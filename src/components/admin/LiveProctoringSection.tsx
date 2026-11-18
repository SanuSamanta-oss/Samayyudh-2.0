'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StudentLiveStreamCard } from './StudentLiveStreamCard';
import { StudentSupervisionDrawer } from './StudentSupervisionDrawer';
import { QrVerificationScanner } from '@/components/teacher/QrVerificationScanner';
import { MeetStyleFaceSupervision } from '@/components/teacher/MeetStyleFaceSupervision';
import type { ProctoringSession } from '@/types/proctoring';
import type { CommandRole } from '@/types/admin';
import {
  Video,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Users,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  QrCode,
  Radio,
} from 'lucide-react';

interface LiveProctoringSectionProps {
  currentUserId?: string;
  role?: CommandRole;
}

export type ProctoringMode = 'remote_monitoring' | 'qr_verification' | 'live_face';

export function LiveProctoringSection({
  currentUserId = 'teacher_user',
  role = 'teacher',
}: LiveProctoringSectionProps) {
  const [activeMode, setActiveMode] = useState<ProctoringMode>('remote_monitoring');
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [filterAttentionOnly, setFilterAttentionOnly] = useState(false);

  const fetchActiveSessions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/proctoring/active-sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.warn('Failed to fetch active proctoring sessions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveSessions();
    const interval = setInterval(fetchActiveSessions, 10000);
    return () => clearInterval(interval);
  }, [fetchActiveSessions]);

  // Extract unique classrooms
  const classrooms = Array.from(
    new Set(sessions.map((s) => s.classroom_name).filter(Boolean))
  ) as string[];

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    const nameMatch =
      (s.student_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.student_public_id || s.student_lce_code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.exam_title || '').toLowerCase().includes(searchQuery.toLowerCase());

    const classroomMatch =
      selectedClassroom === 'all' || s.classroom_name === selectedClassroom;

    const attentionMatch =
      !filterAttentionOnly || (s.flags_count && s.flags_count > 0);

    return nameMatch && classroomMatch && attentionMatch;
  });

  const totalFlags = sessions.reduce((acc, s) => acc + (s.flags_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* 3-MODE TAB WORKSPACE SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-[24px] bg-neutral-100 dark:bg-[#171B24] border border-neutral-200/60 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/70 dark:bg-[#1D2330] border border-neutral-200/40 dark:border-white/5">
          <button
            type="button"
            onClick={() => setActiveMode('remote_monitoring')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border-0 outline-none ${
              activeMode === 'remote_monitoring'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>A. Live Remote Monitoring</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('qr_verification')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border-0 outline-none ${
              activeMode === 'qr_verification'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>B. QR Physical Verification</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('live_face')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border-0 outline-none ${
              activeMode === 'live_face'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>C. Live Face Supervision</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5 mr-2">
          <button
            type="button"
            onClick={fetchActiveSessions}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-white dark:bg-[#1D2330] hover:bg-neutral-100 dark:hover:bg-[#252C3D] text-neutral-700 dark:text-neutral-300 transition-colors shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-50 border border-neutral-200/50 dark:border-white/5 outline-none"
            title="Refresh Sessions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="px-3.5 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-extrabold text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>{sessions.length} ACTIVE EXAMINEES</span>
          </div>
        </div>
      </div>

      {/* MODE A: LIVE REMOTE MONITORING */}
      {activeMode === 'remote_monitoring' && (
        <div className="space-y-6">
          {/* Real-Time Stats Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-3xl bg-card border border-border shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Examinees</span>
                <Users className="w-4 h-4 text-brand-500" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground">{sessions.length}</span>
                <p className="text-[11px] text-stone-500 mt-0.5">Currently streaming</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-card border border-border shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Classrooms</span>
                <GraduationCap className="w-4 h-4 text-sky-500" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground">{classrooms.length}</span>
                <p className="text-[11px] text-stone-500 mt-0.5">Active rooms</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-card border border-border shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Telemetry Flags</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-500">{totalFlags}</span>
                <p className="text-[11px] text-stone-500 mt-0.5">Anomalies logged</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-card border border-border shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Transmission</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-500">WebRTC</span>
                <p className="text-[11px] text-stone-500 mt-0.5">Encrypted low-latency</p>
              </div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search examinees by name, LCE ID, or examination title..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border-0 text-xs sm:text-sm text-foreground placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center gap-2">
              {classrooms.length > 0 && (
                <select
                  value={selectedClassroom}
                  onChange={(e) => setSelectedClassroom(e.target.value)}
                  className="py-2 px-3 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="all">All Classrooms</option>
                  {classrooms.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}

              <button
                type="button"
                onClick={() => setFilterAttentionOnly(!filterAttentionOnly)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  filterAttentionOnly
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
                    : 'bg-surface border-border text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Attention Needed</span>
              </button>
            </div>
          </div>

          {/* Grid of Student Live Streams */}
          {loading && sessions.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 rounded-3xl bg-surface animate-pulse" />
              ))}
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-12 rounded-3xl bg-card border border-border/80 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 flex items-center justify-center">
                <Video className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-foreground">No Active Proctored Examinations</h3>
              <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
                There are currently no students writing proctored tests in your assigned classrooms.
                As soon as an examinee begins their test, their live camera feed will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSessions.map((s) => (
                <StudentLiveStreamCard
                  key={s.id}
                  session={s}
                  currentUserId={currentUserId}
                  onSelect={() => {
                    setSelectedSession(s);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODE B: QR PHYSICAL VERIFICATION */}
      {activeMode === 'qr_verification' && (
        <QrVerificationScanner
          onOpenLiveSupervision={(studentId) => {
            const matched = sessions.find((s) => s.student_id === studentId);
            if (matched) setSelectedSession(matched);
            setActiveMode('live_face');
          }}
        />
      )}

      {/* MODE C: LIVE FACE SUPERVISION */}
      {activeMode === 'live_face' && (
        <MeetStyleFaceSupervision
          studentId={selectedSession?.student_id || sessions[0]?.student_id || 'sample_student_id'}
          studentName={selectedSession?.student_name || sessions[0]?.student_name || 'Candidate Examinee'}
          studentLceCode={selectedSession?.student_lce_code || selectedSession?.student_public_id || sessions[0]?.student_public_id || 'LCE001'}
          examTitle={selectedSession?.exam_title || sessions[0]?.exam_title || 'WBJEE Full Mock Examination 2026'}
          examCode={selectedSession?.exam_code || sessions[0]?.exam_code || 'LCE-EX-0001'}
          examSessionId={selectedSession?.exam_session_id || sessions[0]?.exam_session_id || 'session_default'}
          onBackToGrid={() => setActiveMode('remote_monitoring')}
        />
      )}

      {/* Detailed Supervision Drawer (when opened from grid) */}
      {selectedSession && activeMode === 'remote_monitoring' && (
        <StudentSupervisionDrawer
          session={selectedSession}
          currentUserId={currentUserId}
          onClose={() => setSelectedSession(null)}
          onRefresh={fetchActiveSessions}
        />
      )}
    </div>
  );
}
