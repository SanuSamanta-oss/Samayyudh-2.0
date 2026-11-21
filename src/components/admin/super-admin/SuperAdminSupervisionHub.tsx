'use client';

import React, { useState, useEffect } from 'react';
import {
  Video,
  Radio,
  Clock,
  Users,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import type { PlatformExamSummary } from '@/types/admin';

interface SuperAdminSupervisionHubProps {
  onEnterExamRoom: (examId: string, examCode?: string) => void;
  onOpenExamDetail: (exam: PlatformExamSummary) => void;
}

export function SuperAdminSupervisionHub({
  onEnterExamRoom,
  onOpenExamDetail,
}: SuperAdminSupervisionHubProps) {
  const [liveExams, setLiveExams] = useState<PlatformExamSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLiveExams = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/exams/all?status=live&limit=50');
      if (res.ok) {
        const data = await res.json();
        setLiveExams(data.items || []);
      }
    } catch (err) {
      console.error('[SuperAdminSupervisionHub] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveExams();
    const interval = setInterval(fetchLiveExams, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 select-none">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-300">
              Universal Control Hub
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            Platform Live Supervision Control ({liveExams.length})
          </h2>
          <p className="text-xs text-purple-200/80 mt-0.5">
            Real-time feed across all concurrent faculty exams with Super Admin intervention override.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLiveExams}
          disabled={loading}
          className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Feeds</span>
        </button>
      </div>

      {/* Grid of Live Examination Cards */}
      {loading && liveExams.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-400">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-600" />
          <span>Polling active control rooms...</span>
        </div>
      ) : liveExams.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#111A2E] text-center shadow-xs space-y-2">
          <Radio className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No live examination streams active right now
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            When teachers or scheduled automations start an examination, its encrypted multi-cam feed will appear here for universal super admin supervision.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveExams.map((exam) => (
            <div
              key={exam.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#111A2E] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                    LIVE CONTROL
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {exam.exam_code}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                  {exam.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {exam.subject} · {exam.duration_minutes}m duration
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
                <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-white/10">
                  <span className="text-[11px] text-slate-400">Live Examinees:</span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {exam.total_joined} Active
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onEnterExamRoom(exam.id, exam.exam_code)}
                  className="flex-1 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-2 shadow-md shadow-purple-600/30"
                >
                  <Video className="w-4 h-4" />
                  <span>Enter Supervision Room</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenExamDetail(exam)}
                  className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-all cursor-pointer border-0 outline-none"
                  title="View Dossier"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
