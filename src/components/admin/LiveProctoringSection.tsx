'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StudentLiveStreamCard } from './StudentLiveStreamCard';
import { StudentSupervisionDrawer } from './StudentSupervisionDrawer';
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
} from 'lucide-react';

interface LiveProctoringSectionProps {
  currentUserId?: string;
  role?: CommandRole;
}

export function LiveProctoringSection({
  currentUserId = 'teacher_user',
  role = 'teacher',
}: LiveProctoringSectionProps) {
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
    // Poll active sessions every 10 seconds
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
      (s.student_public_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 mb-1">
            <Video className="w-3.5 h-3.5" />
            <span>AI Remote Proctoring Command Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Live Exam Supervision &amp; Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xl leading-relaxed">
            Live WebRTC video feeds of active examinees. Monitor telemetry anomalies, send advisories, and maintain test integrity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchActiveSessions}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-surface hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-50"
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
            <p className="text-[11px] text-stone-500 mt-0.5">Peer-to-peer P2P</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search examinees by name, ID, or examination title..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border-0 text-xs sm:text-sm text-foreground placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Filter Controls */}
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
              onSelect={() => setSelectedSession(s)}
            />
          ))}
        </div>
      )}

      {/* Detailed Supervision Drawer */}
      {selectedSession && (
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
