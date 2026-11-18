'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProctorViewer } from '@/lib/proctoring/webrtc-service';
import type { ProctoringSession } from '@/types/proctoring';
import { Camera, CameraOff, AlertTriangle, Eye, Wifi, Clock, ShieldCheck } from 'lucide-react';

interface StudentLiveStreamCardProps {
  session: ProctoringSession & {
    student_name?: string;
    student_avatar?: string | null;
    student_public_id?: string | null;
    classroom_name?: string | null;
    flags_count?: number;
  };
  currentUserId: string;
  onSelect: () => void;
}

export function StudentLiveStreamCard({
  session,
  currentUserId,
  onSelect,
}: StudentLiveStreamCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'failed'>('connecting');
  const [elapsedMinutes, setElapsedMinutes] = useState<number>(0);

  // Compute elapsed time
  useEffect(() => {
    const updateElapsed = () => {
      const start = new Date(session.started_at).getTime();
      const now = Date.now();
      setElapsedMinutes(Math.max(0, Math.floor((now - start) / 60000)));
    };
    updateElapsed();
    const interval = setInterval(updateElapsed, 30000);
    return () => clearInterval(interval);
  }, [session.started_at]);

  // Connect WebRTC ProctorViewer
  useEffect(() => {
    const viewerId = `teacher_${currentUserId}_${Math.random().toString(36).substring(2, 7)}`;
    const viewer = new ProctorViewer(
      session.id,
      viewerId,
      'teacher',
      (remoteStream) => {
        setStream(remoteStream);
        if (videoRef.current) {
          videoRef.current.srcObject = remoteStream;
          videoRef.current.play().catch(() => {});
        }
      },
      (status) => {
        setConnectionStatus(status);
      }
    );

    viewer.start();

    return () => {
      viewer.destroy();
    };
  }, [session.id, currentUserId]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

  const flags = session.flags_count || 0;

  return (
    <div
      onClick={onSelect}
      className="group relative rounded-3xl bg-card border border-border/80 hover:border-brand-500/50 p-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      {/* Top Banner / Student Info */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 overflow-hidden flex items-center justify-center font-bold text-xs text-brand-600 dark:text-brand-300 shrink-0">
            {session.student_avatar ? (
              <img src={session.student_avatar} alt={session.student_name} className="w-full h-full object-cover" />
            ) : (
              (session.student_name || 'S').charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {session.student_name || 'Examinee'}
            </h4>
            <p className="text-[10px] text-stone-500 truncate">
              {session.student_public_id ? `ID: ${session.student_public_id}` : session.classroom_name || 'Live Battle'}
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-1.5 shrink-0">
          {flags > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[10px] font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{flags}</span>
            </span>
          )}
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>LIVE</span>
          </span>
        </div>
      </div>

      {/* Video Stream Container (Clean Rounded Card View) */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-inner">
        {connectionStatus === 'connected' && stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover -scale-x-100 pointer-events-none"
          />
        ) : connectionStatus === 'connecting' ? (
          <div className="flex flex-col items-center gap-1.5 text-stone-300 text-xs">
            <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] text-stone-400">Negotiating WebRTC...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-stone-400 text-xs">
            <CameraOff className="w-6 h-6 text-rose-400" />
            <span className="text-[10px]">Awaiting Stream</span>
          </div>
        )}

        {/* Hover Eye Overlay */}
        <div className="absolute inset-0 bg-brand-900/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] flex items-center justify-center">
          <div className="px-3 py-1.5 rounded-full bg-white text-black font-bold text-xs shadow-lg flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>Supervise</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500">
        <div className="flex items-center gap-1.5 truncate max-w-[65%]">
          <span className="font-semibold text-foreground truncate">{session.exam_title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-stone-400" />
            <span>{elapsedMinutes}m</span>
          </span>
          <span className="text-stone-300 dark:text-stone-700">|</span>
          <span className="font-medium">
            {session.questions_answered}/{session.total_questions || '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
