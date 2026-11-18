// ============================================================
// SamayYudh 2.0 — WebRTC & Real-Time Video Streaming Service
// Peer-to-Peer Multi-Viewer Live Supervision Engine
// ============================================================

import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { WebRTCSignalingMessage } from '@/types/proctoring';

export const DEFAULT_RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
  ],
  iceCandidatePoolSize: 10,
};

/**
 * Student Broadcaster: Captures local webcam stream and streams it
 * to authorized teachers and parents via peer-to-peer WebRTC connections.
 */
export class ProctorBroadcaster {
  private sessionId: string;
  private studentId: string;
  private localStream: MediaStream | null = null;
  private peers: Map<string, RTCPeerConnection> = new Map();
  private channel: any = null;
  private isDestroyed = false;

  constructor(sessionId: string, studentId: string) {
    this.sessionId = sessionId;
    this.studentId = studentId;
  }

  public setStream(stream: MediaStream) {
    this.localStream = stream;
    // Update existing peers if stream replaced
    this.peers.forEach((pc) => {
      const senders = pc.getSenders();
      stream.getTracks().forEach((track) => {
        const sender = senders.find((s) => s.track?.kind === track.kind);
        if (sender) {
          sender.replaceTrack(track).catch(() => {});
        } else {
          pc.addTrack(track, stream);
        }
      });
    });
  }

  public startSignaling() {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    const channelName = `proctor_session_${this.sessionId}`;

    this.channel = supabase.channel(channelName, {
      config: { broadcast: { self: false } },
    });

    this.channel
      .on('broadcast', { event: 'signal' }, async ({ payload }: { payload: WebRTCSignalingMessage }) => {
        if (this.isDestroyed || !payload || payload.sessionId !== this.sessionId) return;

        // When a new viewer (teacher/parent) requests to join
        if (payload.type === 'viewer_join') {
          const viewerId = payload.senderId;
          await this.initiatePeerForViewer(viewerId);
        }

        // When an answer returns from an active viewer
        else if (payload.type === 'answer' && payload.targetId === this.studentId) {
          const pc = this.peers.get(payload.senderId);
          if (pc && pc.signalingState !== 'stable') {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(payload.payload));
            } catch (err) {
              console.warn('[Broadcaster] Failed to set remote description from answer:', err);
            }
          }
        }

        // When viewer sends an ICE candidate
        else if (payload.type === 'ice_candidate' && payload.targetId === this.studentId) {
          const pc = this.peers.get(payload.senderId);
          if (pc && payload.payload) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(payload.payload));
            } catch (err) {
              console.warn('[Broadcaster] Failed to add ICE candidate:', err);
            }
          }
        }
      })
      .subscribe();
  }

  private async initiatePeerForViewer(viewerId: string) {
    if (!this.localStream) return;

    // Close previous connection if any
    const existing = this.peers.get(viewerId);
    if (existing) {
      existing.close();
      this.peers.delete(viewerId);
    }

    try {
      const pc = new RTCPeerConnection(DEFAULT_RTC_CONFIG);
      this.peers.set(viewerId, pc);

      // Add local video track to peer
      this.localStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!);
      });

      // Send local ICE candidates to viewer
      pc.onicecandidate = (event) => {
        if (event.candidate && this.channel) {
          this.sendSignal({
            type: 'ice_candidate',
            sessionId: this.sessionId,
            senderId: this.studentId,
            senderRole: 'student',
            targetId: viewerId,
            payload: event.candidate.toJSON(),
          });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
          this.peers.delete(viewerId);
        }
      };

      // Create and send SDP offer
      const offer = await pc.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false,
      });
      await pc.setLocalDescription(offer);

      this.sendSignal({
        type: 'offer',
        sessionId: this.sessionId,
        senderId: this.studentId,
        senderRole: 'student',
        targetId: viewerId,
        payload: { type: offer.type, sdp: offer.sdp },
      });
    } catch (err) {
      console.warn('[Broadcaster] Error initiating peer connection:', err);
    }
  }

  public sendSignal(msg: WebRTCSignalingMessage) {
    if (this.channel) {
      this.channel.send({
        type: 'broadcast',
        event: 'signal',
        payload: msg,
      });
    }
  }

  public destroy() {
    this.isDestroyed = true;
    this.peers.forEach((pc) => pc.close());
    this.peers.clear();

    if (this.channel) {
      const supabase = createClient();
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }
}

/**
 * Teacher/Parent Viewer: Receives low-latency live WebRTC stream from the student.
 */
export class ProctorViewer {
  private sessionId: string;
  private viewerId: string;
  private viewerRole: 'teacher' | 'parent';
  private pc: RTCPeerConnection | null = null;
  private channel: any = null;
  private isDestroyed = false;
  private onStreamCallback: (stream: MediaStream) => void;
  private onStatusCallback: (status: 'connecting' | 'connected' | 'disconnected' | 'failed') => void;

  constructor(
    sessionId: string,
    viewerId: string,
    viewerRole: 'teacher' | 'parent',
    onStream: (stream: MediaStream) => void,
    onStatus: (status: 'connecting' | 'connected' | 'disconnected' | 'failed') => void
  ) {
    this.sessionId = sessionId;
    this.viewerId = viewerId;
    this.viewerRole = viewerRole;
    this.onStreamCallback = onStream;
    this.onStatusCallback = onStatus;
  }

  public start() {
    this.onStatusCallback('connecting');
    if (!isSupabaseConfigured) {
      this.onStatusCallback('disconnected');
      return;
    }

    const supabase = createClient();
    const channelName = `proctor_session_${this.sessionId}`;

    this.channel = supabase.channel(channelName, {
      config: { broadcast: { self: false } },
    });

    this.channel
      .on('broadcast', { event: 'signal' }, async ({ payload }: { payload: WebRTCSignalingMessage }) => {
        if (this.isDestroyed || !payload || payload.sessionId !== this.sessionId) return;

        // When receiving offer from student intended for this viewer
        if (payload.type === 'offer' && payload.targetId === this.viewerId) {
          await this.handleOffer(payload.senderId, payload.payload);
        }

        // When receiving ICE candidate from student
        else if (payload.type === 'ice_candidate' && payload.targetId === this.viewerId && this.pc) {
          if (payload.payload) {
            try {
              await this.pc.addIceCandidate(new RTCIceCandidate(payload.payload));
            } catch (err) {
              console.warn('[Viewer] Failed to add ICE candidate:', err);
            }
          }
        }
      })
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          // Announce presence so student broadcaster initiates an offer
          this.announceJoin();
        }
      });
  }

  public announceJoin() {
    if (!this.channel) return;
    this.channel.send({
      type: 'broadcast',
      event: 'signal',
      payload: {
        type: 'viewer_join',
        sessionId: this.sessionId,
        senderId: this.viewerId,
        senderRole: this.viewerRole,
      },
    });
  }

  private async handleOffer(studentId: string, offer: RTCSessionDescriptionInit) {
    if (this.pc) {
      this.pc.close();
    }

    try {
      this.pc = new RTCPeerConnection(DEFAULT_RTC_CONFIG);

      this.pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          this.onStreamCallback(event.streams[0]);
          this.onStatusCallback('connected');
        }
      };

      this.pc.onicecandidate = (event) => {
        if (event.candidate && this.channel) {
          this.channel.send({
            type: 'broadcast',
            event: 'signal',
            payload: {
              type: 'ice_candidate',
              sessionId: this.sessionId,
              senderId: this.viewerId,
              senderRole: this.viewerRole,
              targetId: studentId,
              payload: event.candidate.toJSON(),
            },
          });
        }
      };

      this.pc.onconnectionstatechange = () => {
        const state = this.pc?.connectionState;
        if (state === 'connected') {
          this.onStatusCallback('connected');
        } else if (state === 'connecting') {
          this.onStatusCallback('connecting');
        } else if (state === 'disconnected') {
          this.onStatusCallback('disconnected');
        } else if (state === 'failed') {
          this.onStatusCallback('failed');
        }
      };

      await this.pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answer);

      this.channel.send({
        type: 'broadcast',
        event: 'signal',
        payload: {
          type: 'answer',
          sessionId: this.sessionId,
          senderId: this.viewerId,
          senderRole: this.viewerRole,
          targetId: studentId,
          payload: { type: answer.type, sdp: answer.sdp },
        },
      });
    } catch (err) {
      console.warn('[Viewer] Error handling offer:', err);
      this.onStatusCallback('failed');
    }
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    if (this.channel) {
      const supabase = createClient();
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }
}
