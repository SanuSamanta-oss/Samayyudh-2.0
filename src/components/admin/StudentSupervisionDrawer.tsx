'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProctorViewer } from '@/lib/proctoring/webrtc-service';
import type { ProctoringSession, ProctoringEvent, ProctoringIntervention } from '@/types/proctoring';
import {
  X,
  Camera,
  CameraOff,
  AlertTriangle,
  ShieldAlert,
  Send,
  Pause,
  Play,
  Clock,
  CheckCircle2,
  Activity,
  History,
  MessageSquareWarning,
} from 'lucide-react';

interface StudentSupervisionDrawerProps {
  session: ProctoringSession & {
    student_name?: string;
    student_avatar?: string | null;
    student_public_id?: string | null;
    classroom_name?: string | null;
  };
  currentUserId: string;
  onClose: () => void;
  onRefresh?: () => void;
}

export function StudentSupervisionDrawer({
  session,
  currentUserId,
  onClose,
  onRefresh,
}: StudentSupervisionDrawerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'failed'>('connecting');
  const [events, setEvents] = useState<ProctoringEvent[]>([]);
  const [interventions, setInterventions] = useState<ProctoringIntervention[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);
  const [sessionStatus, setSessionStatus] = useState(session.status);

  // Connect WebRTC stream
  useEffect(() => {
    const viewerId = `teacher_drawer_${currentUserId}_${Math.random().toString(36).substring(2, 7)}`;
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

  // Fetch proctoring telemetry events & previous interventions
  const fetchTelemetry = async () => {
    try {
      const [eventsRes, interventionsRes] = await Promise.all([
        fetch(`/api/proctoring/events?sessionId=${session.id}`),
        fetch(`/api/proctoring/interventions?sessionId=${session.id}`),
      ]);

      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setEvents(data.events || []);
      }
      if (interventionsRes.ok) {
        const data = await interventionsRes.json();
        setInterventions(data.interventions || []);
      }
    } catch {}
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 6000);
    return () => clearInterval(interval);
  }, [session.id]);

  // Send Teacher Intervention
  const handleSendIntervention = async (action: 'warning' | 'pause' | 'resume', msgText: string) => {
    if (!msgText.trim()) return;
    setSubmittingAction(true);

    try {
      const res = await fetch('/api/proctoring/interventions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          studentId: session.student_id,
          action,
          message: msgText.trim(),
        }),
      });

      if (res.ok) {
        setCustomMessage('');
        if (action === 'pause') setSessionStatus('paused');
        if (action === 'resume') setSessionStatus('active');
        fetchTelemetry();
        onRefresh?.();
      }
    } catch (err) {
      console.warn('Intervention send failed:', err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const quickPresets = [
    'Please position your face directly in the camera frame.',
    'Multiple faces or background activity detected.',
    'Please refrain from switching browser tabs or windows.',
    'Ensure your study environment is quiet and well-lit.',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm select-none">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full max-w-xl h-full bg-card border-l border-border shadow-2xl flex flex-col overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-md p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 overflow-hidden flex items-center justify-center font-bold text-sm text-brand-600 dark:text-brand-300">
                {session.student_avatar ? (
                  <img src={session.student_avatar} alt={session.student_name} className="w-full h-full object-cover" />
                ) : (
                  (session.student_name || 'S').charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {session.student_name || 'Student Examinee'}
                </h3>
                <p className="text-xs text-stone-500">
                  {session.student_public_id ? `ID: ${session.student_public_id}` : session.classroom_name || 'Classroom Examinee'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface text-stone-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-6 flex-1">
            {/* Live Video Window */}
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-xl border border-border/80 flex items-center justify-center">
              {connectionStatus === 'connected' && stream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
              ) : connectionStatus === 'connecting' ? (
                <div className="flex flex-col items-center gap-2 text-white">
                  <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-stone-300">Connecting WebRTC Stream...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-stone-400 text-xs">
                  <CameraOff className="w-8 h-8 text-rose-400" />
                  <span>Camera Stream Disconnected</span>
                </div>
              )}

              {/* Status HUD Overlays */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>LIVE PROCTOR</span>
                </span>
                <span className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-stone-200 text-[10px] font-semibold">
                  {sessionStatus === 'paused' ? 'EXAM PAUSED' : 'EXAM IN PROGRESS'}
                </span>
              </div>
            </div>

            {/* Examination Progress Summary Card */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-surface border border-border/70 flex flex-col">
                <span className="text-[10px] font-bold uppercase text-stone-400">Questions</span>
                <span className="text-lg font-extrabold text-foreground mt-1">
                  {session.questions_answered} / {session.total_questions || '—'}
                </span>
                <span className="text-[10px] text-stone-500">Answered</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-border/70 flex flex-col">
                <span className="text-[10px] font-bold uppercase text-stone-400">Status</span>
                <span className={`text-base font-extrabold mt-1 capitalize ${sessionStatus === 'paused' ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {sessionStatus}
                </span>
                <span className="text-[10px] text-stone-500">Supervision active</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-border/70 flex flex-col">
                <span className="text-[10px] font-bold uppercase text-stone-400">Alerts</span>
                <span className="text-lg font-extrabold text-amber-500 mt-1">
                  {events.filter((e) => e.severity === 'warning' || e.severity === 'critical').length}
                </span>
                <span className="text-[10px] text-stone-500">Flags logged</span>
              </div>
            </div>

            {/* Interventions & Controls */}
            <div className="p-4 rounded-3xl bg-surface border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase text-foreground">
                  <MessageSquareWarning className="w-4 h-4 text-amber-500" />
                  <span>Proctor Intervention Controls</span>
                </div>
                {sessionStatus === 'active' ? (
                  <button
                    type="button"
                    disabled={submittingAction}
                    onClick={() => handleSendIntervention('pause', 'Examination has been paused by the invigilator for verification.')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Exam</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submittingAction}
                    onClick={() => handleSendIntervention('resume', 'Verification complete. You may resume your examination.')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Resume Exam</span>
                  </button>
                )}
              </div>

              {/* Quick Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-stone-500">Quick Advisory Warnings:</span>
                <div className="flex flex-wrap gap-1.5">
                  {quickPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={submittingAction}
                      onClick={() => handleSendIntervention('warning', preset)}
                      className="text-left text-[11px] px-2.5 py-1.5 rounded-xl bg-card hover:bg-stone-200 dark:hover:bg-stone-800 border border-border/80 text-foreground transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Warning Input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Type custom message to student..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-card border border-border text-xs text-foreground placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <button
                  type="button"
                  disabled={!customMessage.trim() || submittingAction}
                  onClick={() => handleSendIntervention('warning', customMessage)}
                  className="px-4 py-2 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>

            {/* Chronological Event Timeline */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase text-foreground">
                <History className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Chronological Event Timeline ({events.length})</span>
              </div>

              {events.length === 0 ? (
                <div className="p-4 rounded-2xl bg-surface border border-border/60 text-center text-xs text-stone-500">
                  No telemetry anomalies reported. Session is clean.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {events.map((ev) => {
                    const isWarn = ev.severity === 'warning';
                    const isCrit = ev.severity === 'critical';
                    const time = new Date(ev.created_at).toLocaleTimeString();

                    return (
                      <div
                        key={ev.id}
                        className={`p-3 rounded-2xl border text-xs flex items-start gap-3 ${
                          isCrit
                            ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
                            : isWarn
                            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200'
                            : 'bg-surface border-border text-foreground'
                        }`}
                      >
                        {isCrit || isWarn ? (
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold uppercase text-[10px] tracking-wider">
                              {ev.event_type.replace(/_/g, ' ')}
                            </span>
                            <span className="text-[10px] text-stone-400 shrink-0">{time}</span>
                          </div>
                          {ev.details && Object.keys(ev.details).length > 0 && (
                            <p className="text-[11px] opacity-80 mt-0.5 truncate">
                              {JSON.stringify(ev.details)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
