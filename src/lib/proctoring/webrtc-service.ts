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
 * Standardizes stream session channel identifiers for custom examinations.
 */
export function getCustomExamStreamSessionId(examCodeOrId: string, studentId: string): string {
  const cleanCode = (examCodeOrId || 'EXAM').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const cleanStudent = (studentId || 'STUDENT').trim().replace(/[^a-zA-Z0-9_-]/g, '');
  return `ce_${cleanCode}_${cleanStudent}`;
}

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
  private snapshotInterval: any = null;
  private hiddenVideo: HTMLVideoElement | null = null;
  private snapshotCanvas: HTMLCanvasElement | null = null;

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

    // Notify any listening viewers that broadcaster is live
    this.sendSignal({
      type: 'broadcaster_ready',
      sessionId: this.sessionId,
      senderId: this.studentId,
      senderRole: 'student',
    });

    // Start snapshot backup
    this.startSnapshotBroadcast();
  }

  public startSnapshotBroadcast(intervalMs = 2000) {
    if (typeof window === 'undefined') return;
    this.stopSnapshotBroadcast();

    try {
      this.snapshotCanvas = document.createElement('canvas');
      this.snapshotCanvas.width = 320;
      this.snapshotCanvas.height = 240;
      const ctx = this.snapshotCanvas.getContext('2d');

      this.hiddenVideo = document.createElement('video');
      this.hiddenVideo.muted = true;
      this.hiddenVideo.playsInline = true;
      if (this.localStream) {
        this.hiddenVideo.srcObject = this.localStream;
        this.hiddenVideo.play().catch(() => {});
      }

      this.snapshotInterval = setInterval(() => {
        if (this.isDestroyed || !this.localStream || !this.channel) return;
        try {
          if (this.hiddenVideo && this.hiddenVideo.readyState >= 2 && ctx && this.snapshotCanvas) {
            ctx.drawImage(this.hiddenVideo, 0, 0, 320, 240);
            const dataUrl = this.snapshotCanvas.toDataURL('image/jpeg', 0.5);
            this.channel.send({
              type: 'broadcast',
              event: 'frame',
              payload: {
                sessionId: this.sessionId,
                studentId: this.studentId,
                frame: dataUrl,
                timestamp: Date.now(),
              },
            });
          }
        } catch {}
      }, intervalMs);
    } catch {}
  }

  public stopSnapshotBroadcast() {
    if (this.snapshotInterval) {
      clearInterval(this.snapshotInterval);
      this.snapshotInterval = null;
    }
    if (this.hiddenVideo) {
      this.hiddenVideo.pause();
      this.hiddenVideo.srcObject = null;
      this.hiddenVideo = null;
    }
    this.snapshotCanvas = null;
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
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED' && this.localStream) {
          this.sendSignal({
            type: 'broadcaster_ready',
            sessionId: this.sessionId,
            senderId: this.studentId,
            senderRole: 'student',
          });
        }
      });
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
    this.stopSnapshotBroadcast();
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
  private announceInterval: any = null;
  private onStreamCallback: (stream: MediaStream) => void;
  private onFrameCallback: ((frame: string) => void) | null = null;
  private onStatusCallback: (status: 'connecting' | 'connected' | 'disconnected' | 'failed') => void;

  constructor(
    sessionId: string,
    viewerId?: string,
    viewerRole?: 'teacher' | 'parent',
    onStream?: (stream: MediaStream) => void,
    onStatus?: (status: 'connecting' | 'connected' | 'disconnected' | 'failed') => void
  ) {
    this.sessionId = sessionId;
    this.viewerId = viewerId || `viewer_${Math.random().toString(36).substring(2, 9)}`;
    this.viewerRole = viewerRole || 'parent';
    this.onStreamCallback = onStream || (() => {});
    this.onStatusCallback = onStatus || (() => {});
  }

  public onStream(callback: (stream: MediaStream) => void) {
    this.onStreamCallback = callback;
    return this;
  }

  public onFrame(callback: (frame: string) => void) {
    this.onFrameCallback = callback;
    return this;
  }

  public onStatus(callback: (status: 'connecting' | 'connected' | 'disconnected' | 'failed') => void) {
    this.onStatusCallback = callback;
    return this;
  }

  public onError(callback: (err: any) => void) {
    const orig = this.onStatusCallback;
    this.onStatusCallback = (st) => {
      orig(st);
      if (st === 'failed' || st === 'disconnected') {
        callback(st);
      }
    };
    return this;
  }

  public startViewing() {
    this.start();
  }

  public stopViewing() {
    this.destroy();
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
      .on('broadcast', { event: 'frame' }, ({ payload }: { payload: any }) => {
        if (this.isDestroyed || !payload || payload.sessionId !== this.sessionId) return;
        if (payload.frame && this.onFrameCallback) {
          this.onFrameCallback(payload.frame);
        }
      })
      .on('broadcast', { event: 'signal' }, async ({ payload }: { payload: WebRTCSignalingMessage }) => {
        if (this.isDestroyed || !payload || payload.sessionId !== this.sessionId) return;

        // When student broadcaster is ready, announce our join
        if (payload.type === 'broadcaster_ready') {
          this.announceJoin();
        }

        // When receiving offer from student intended for this viewer
        else if (payload.type === 'offer' && payload.targetId === this.viewerId) {
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

          // Periodically re-announce join while waiting for connection
          if (this.announceInterval) clearInterval(this.announceInterval);
          this.announceInterval = setInterval(() => {
            if (this.isDestroyed || this.pc?.connectionState === 'connected') {
              if (this.announceInterval) clearInterval(this.announceInterval);
              return;
            }
            this.announceJoin();
          }, 3000);
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
    if (this.announceInterval) {
      clearInterval(this.announceInterval);
      this.announceInterval = null;
    }
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
