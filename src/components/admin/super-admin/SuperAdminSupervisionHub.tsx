'use client';

import React, { useState, useEffect } from 'react';
import { Video, RefreshCw, Radio, ExternalLink, Clock, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PlatformExamSummary } from '@/types/admin';

interface SuperAdminSupervisionHubProps {
  onEnterExamRoom: (examId: string, examCode?: string) => void;
  onOpenExamDetail: (exam: PlatformExamSummary) => void;
}

export function SuperAdminSupervisionHub({
  onEnterExamRoom,
  onOpenExamDetail,
}: SuperAdminSupervisionHubProps) {
  const [exams, setExams] = useState<PlatformExamSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'all' | 'live' | 'waiting'>('all');

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/exams/all?limit=50&sortBy=created_at&sortOrder=desc');
      if (res.ok) {
        const data = await res.json();
        setExams(data.items || []);
      }
    } catch (err) {
      console.error('[SuperAdminSupervisionHub] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
    const interval = setInterval(fetchExams, 12000);
    return () => clearInterval(interval);
  }, []);

  const liveExams = exams.filter((e) => e.status === 'live');
  const waitingExams = exams.filter((e) => e.status === 'waiting' || e.status === 'scheduled');
  
  const displayedExams =
    filterMode === 'live'
      ? liveExams
      : filterMode === 'waiting'
      ? waitingExams
      : exams.filter((e) => e.status !== 'ended');

  return (
    <div className="space-y-4 select-none">
      {/* Top Banner — Theme Adaptive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 rounded-[28px] bg-gradient-to-r from-purple-100/90 via-indigo-50/70 to-white dark:from-[#1E1238] dark:via-[#16122E] dark:to-[#0F172A] text-slate-900 dark:text-white shadow-[0_10px_35px_-10px_rgba(109,40,217,0.12)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] border-0 ring-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-300">
              Universal Control Hub
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Platform Supervision Control ({liveExams.length} Live, {waitingExams.length} Ready)
          </h2>
          <p className="text-xs text-slate-600 dark:text-purple-200/80 mt-0.5">
            Supervise all concurrent live exams and launch control rooms for newly created or scheduled examinations.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchExams}
          disabled={loading}
          className="p-2.5 rounded-2xl bg-white/80 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Feeds</span>
        </button>
      </div>

      {/* Filter Tabs with Smooth Sliding Pill */}
      <div className="relative flex items-center gap-1 p-1 rounded-2xl bg-slate-200/70 dark:bg-white/5 w-fit overflow-x-auto scrollbar-none shadow-inner">
        {[
          { key: 'all', label: `All Supervision Rooms (${exams.filter((e) => e.status !== 'ended').length})` },
          { key: 'live', label: `Live Feeds (${liveExams.length})` },
          { key: 'waiting', label: `Waiting & Ready to Launch (${waitingExams.length})` },
        ].map((tab) => {
          const isActive = filterMode === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterMode(tab.key as any)}
              className="relative px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors duration-200 cursor-pointer border-0 outline-none capitalize shrink-0 z-10"
            >
              {isActive && (
                <motion.div
                  layoutId="supervisionHubFilterIndicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="absolute inset-0 rounded-xl bg-white dark:bg-purple-600 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_rgba(147,51,234,0.4)]"
                />
              )}
              <span
                className={`relative z-10 transition-colors duration-200 ${
                  isActive
                    ? 'text-purple-900 dark:text-white font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Examination Cards */}
      {loading && displayedExams.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-400">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-600" />
          <span>Polling active control rooms...</span>
        </div>
      ) : displayedExams.length === 0 ? (
        <div className="p-12 rounded-[28px] bg-white dark:bg-[#111A2E] text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-0 ring-0 space-y-2">
          <Radio className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {filterMode === 'live'
              ? 'No live streams are currently running'
              : 'No examination rooms found in this view'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {filterMode === 'live' && waitingExams.length > 0
              ? `You have ${waitingExams.length} created examination(s) ready in Waiting mode. Switch to 'Waiting & Ready' or 'All' to launch them.`
              : 'Create a platform examination using "+ Create Platform Exam" or schedule one with faculty members.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedExams.map((exam) => {
            const isLive = exam.status === 'live';
            return (
              <div
                key={exam.id}
                className="p-5 rounded-[26px] bg-white dark:bg-[#111A2E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all flex flex-col justify-between space-y-4 border-0 ring-0"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    {isLive ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        LIVE CONTROL
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                        <Clock className="w-3 h-3" />
                        WAITING & READY
                      </span>
                    )}
                    <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-md">
                      {exam.exam_code}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {exam.subject} · {exam.duration_minutes}m duration · {exam.questions_count} Questions
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Faculty Creator:</span>
                    <span className="font-semibold">{exam.creator_name || 'Faculty Member'}</span>
                  </div>
                  {exam.assigned_teacher_name && (
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Assigned Proctor:</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {exam.assigned_teacher_name}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-white/10">
                    <span className="text-[11px] text-slate-400">Status & Participants:</span>
                    <span className="font-black text-slate-900 dark:text-white">
                      {isLive ? `${exam.total_joined} Active Examinees` : 'Waiting for Launch'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onEnterExamRoom(exam.id, exam.exam_code)}
                    className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-2 shadow-md shadow-purple-600/30"
                  >
                    {isLive ? <Video className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                    <span>{isLive ? 'Enter Live Control Room' : 'Launch Live Supervision'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenExamDetail(exam)}
                    className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-all cursor-pointer border-0 outline-none shadow-xs"
                    title="View Dossier"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
