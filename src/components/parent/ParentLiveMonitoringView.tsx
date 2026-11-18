'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProctorViewer } from '@/lib/proctoring/webrtc-service';
import {
  Users,
  Video,
  CameraOff,
  ShieldCheck,
  Clock,
  Sparkles,
  Link as LinkIcon,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Lock,
} from 'lucide-react';

interface LinkedChild {
  linkId: string;
  studentId: string;
  studentName: string;
  studentPublicId?: string | null;
  studentAvatar?: string | null;
  activeSession?: {
    id: string;
    exam_session_id: string;
    exam_title: string;
    exam_code: string;
    started_at: string;
    duration_seconds?: number;
    questions_answered?: number;
    total_questions?: number;
    parentStreamAllowed?: boolean;
    status: string;
  } | null;
}

export function ParentLiveMonitoringView() {
  const [children, setChildren] = useState<LinkedChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkingOpen, setLinkingOpen] = useState(false);
  const [studentCodeInput, setStudentCodeInput] = useState('');
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkSuccess, setLinkSuccess] = useState<string | null>(null);
  const [linkingLoading, setLinkingLoading] = useState(false);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/parent/link');
      if (res.ok) {
        const data = await res.json();
        setChildren(data.children || []);
      }
    } catch (err) {
      console.warn('Failed to fetch linked children:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
    // Poll every 12 seconds for active child sessions
    const interval = setInterval(fetchChildren, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentCodeInput.trim()) return;

    setLinkingLoading(true);
    setLinkError(null);
    setLinkSuccess(null);

    try {
      const res = await fetch('/api/parent/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentCode: studentCodeInput.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLinkError(data.error || 'Failed to link student');
      } else {
        setLinkSuccess(`Successfully linked ${data.student?.name || 'student'}!`);
        setStudentCodeInput('');
        fetchChildren();
        setTimeout(() => {
          setLinkingOpen(false);
          setLinkSuccess(null);
        }, 1200);
      }
    } catch {
      setLinkError('Network error. Failed to reach server.');
    } finally {
      setLinkingLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 select-none">
      {/* Mobile-First Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Parent Supervision Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Live Exam Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-lg leading-relaxed">
            Monitor your linked child&apos;s real-time examination sessions and verified live camera streams securely.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchChildren}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-surface hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors shadow-xs flex items-center justify-center cursor-pointer"
            title="Refresh Status"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setLinkingOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-brand text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Link Child</span>
          </button>
        </div>
      </div>

      {/* Linked Children List / Live Monitoring Cards */}
      {loading && children.length === 0 ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 rounded-3xl bg-surface animate-pulse" />
          ))}
        </div>
      ) : children.length === 0 ? (
        <div className="p-10 rounded-3xl bg-card border border-border/80 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 flex items-center justify-center">
            <LinkIcon className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">No Children Linked Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
            Link your child&apos;s SamayYudh account by clicking the button above and entering their unique Student ID or username.
          </p>
          <button
            type="button"
            onClick={() => setLinkingOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-brand text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Link Your Child Now
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {children.map((child) => (
            <ParentChildLiveCard key={child.linkId} child={child} />
          ))}
        </div>
      )}

      {/* Link Child Modal */}
      <AnimatePresence>
        {linkingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-md bg-card rounded-3xl p-6 shadow-2xl border border-border space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
                <LinkIcon className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground">Link Child Account</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Enter your child&apos;s Student Public ID (e.g., SY-XXXXXX) or username.
                </p>
              </div>

              <form onSubmit={handleLinkStudent} className="space-y-3 pt-2 text-left">
                <input
                  type="text"
                  value={studentCodeInput}
                  onChange={(e) => setStudentCodeInput(e.target.value)}
                  placeholder="e.g. SY-5BV5J9GL"
                  className="w-full px-4 py-3 rounded-2xl bg-surface border border-border text-sm text-foreground placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-brand-500 uppercase tracking-widest text-center font-bold"
                  autoFocus
                />

                {linkError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{linkError}</span>
                  </div>
                )}

                {linkSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{linkSuccess}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLinkingOpen(false);
                      setLinkError(null);
                    }}
                    className="flex-1 py-3 px-4 rounded-2xl border border-border hover:bg-surface font-semibold text-xs text-foreground transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!studentCodeInput.trim() || linkingLoading}
                    className="flex-1 py-3 px-4 rounded-2xl bg-gradient-brand text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {linkingLoading ? 'Linking...' : 'Confirm Link'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Single Child Live Monitoring Card:
 * If child is actively writing an exam, connects WebRTC ProctorViewer to stream live camera.
 * If child is not in an exam, displays clean reassuring empty state.
 */
function ParentChildLiveCard({ child }: { child: LinkedChild }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'failed'>('connecting');
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  const active = child.activeSession;
  const isStreaming = Boolean(active && active.parentStreamAllowed);

  // Compute elapsed time
  useEffect(() => {
    if (!active?.started_at) return;
    const updateElapsed = () => {
      const start = new Date(active.started_at).getTime();
      const now = Date.now();
      setElapsedMinutes(Math.max(0, Math.floor((now - start) / 60000)));
    };
    updateElapsed();
    const interval = setInterval(updateElapsed, 30000);
    return () => clearInterval(interval);
  }, [active?.started_at]);

  // Connect WebRTC if active session has parent stream allowed
  useEffect(() => {
    if (!active || !isStreaming) return;

    const viewerId = `parent_${child.studentId}_${Math.random().toString(36).substring(2, 7)}`;
    const viewer = new ProctorViewer(
      active.id,
      viewerId,
      'parent',
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
  }, [active?.id, isStreaming, child.studentId]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

  return (
    <div className="rounded-3xl bg-card border border-border p-5 sm:p-6 shadow-sm space-y-5">
      {/* Child Identity Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 overflow-hidden flex items-center justify-center font-bold text-sm text-brand-600 dark:text-brand-300 shrink-0">
            {child.studentAvatar ? (
              <img src={child.studentAvatar} alt={child.studentName} className="w-full h-full object-cover" />
            ) : (
              child.studentName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-foreground truncate">{child.studentName}</h3>
            <p className="text-xs text-stone-500 truncate">
              {child.studentPublicId ? `Student ID: ${child.studentPublicId}` : 'Verified Student'}
            </p>
          </div>
        </div>

        {active ? (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 text-xs font-extrabold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>EXAM IN PROGRESS</span>
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-surface text-stone-500 text-xs font-semibold">
            Not In Exam
          </span>
        )}
      </div>

      {/* Active Session Content OR Reassuring Idle State */}
      {active ? (
        <div className="space-y-4">
          {/* Exam Details Bar */}
          <div className="p-4 rounded-2xl bg-surface border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Active Examination
              </span>
              <h4 className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                {active.exam_title}
              </h4>
            </div>

            <div className="flex items-center gap-4 text-xs text-stone-500">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-stone-400" />
                <span>Elapsed: <strong className="text-foreground">{elapsedMinutes}m</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Answered: <strong className="text-foreground">{active.questions_answered || 0}</strong></span>
              </div>
            </div>
          </div>

          {/* Live Video Feed (if parent stream allowed) */}
          {isStreaming ? (
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-lg border border-border flex items-center justify-center">
              {connectionStatus === 'connected' && stream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
              ) : connectionStatus === 'connecting' ? (
                <div className="flex flex-col items-center gap-2 text-stone-300 text-xs">
                  <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to child&apos;s live stream...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-stone-400 text-xs">
                  <CameraOff className="w-8 h-8 text-rose-400" />
                  <span>Waiting for camera stream</span>
                </div>
              )}

              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-extrabold tracking-wider flex items-center gap-1.5 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>LIVE FEED</span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-surface border border-border/70 text-center space-y-2">
              <Lock className="w-6 h-6 text-stone-400 mx-auto" />
              <h5 className="text-xs font-bold text-foreground">Teacher Supervision Policy Active</h5>
              <p className="text-[11px] text-stone-500 max-w-sm mx-auto leading-relaxed">
                Live camera viewing for this examination is restricted to faculty invigilators to preserve strict examination confidentiality.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Reassuring Empty State */
        <div className="p-6 rounded-2xl bg-surface border border-border/60 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-foreground">
            {child.studentName} is not currently writing an exam
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            When {child.studentName} begins a supervised examination, live examination status and camera feed will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
}
