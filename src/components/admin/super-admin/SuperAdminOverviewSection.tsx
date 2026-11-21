'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Video,
  Clock,
  CheckCircle2,
  Users,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Radio,
  ExternalLink,
  Plus,
  RefreshCw,
  Mail,
  GraduationCap,
} from 'lucide-react';
import type { PlatformExamSummary, AdminSectionId } from '@/types/admin';

interface SuperAdminOverviewSectionProps {
  onNavigate: (section: AdminSectionId) => void;
  onEnterExamRoom: (examId: string, examCode?: string) => void;
  onOpenExamDetail: (exam: PlatformExamSummary) => void;
  onOpenNewExam: () => void;
}

export function SuperAdminOverviewSection({
  onNavigate,
  onEnterExamRoom,
  onOpenExamDetail,
  onOpenNewExam,
}: SuperAdminOverviewSectionProps) {
  const [exams, setExams] = useState<PlatformExamSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_exams: 0,
    live_exams: 0,
    scheduled_exams: 0,
    ended_exams: 0,
  });

  const loadOverviewData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/exams/all?limit=10&sortBy=created_at&sortOrder=desc');
      if (res.ok) {
        const data = await res.json();
        setExams(data.items || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('[SuperAdminOverview] Failed to fetch exams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverviewData();
  }, []);

  const liveExams = exams.filter((e) => e.status === 'live');
  const upcomingExams = exams.filter((e) => e.status === 'scheduled' || e.status === 'waiting');

  return (
    <div className="space-y-6 select-none">
      {/* Top Welcome & Control Header — Theme Adaptive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-[28px] bg-gradient-to-r from-purple-100/90 via-indigo-50/70 to-white dark:from-[#1E1238] dark:via-[#16122E] dark:to-[#0F172A] shadow-[0_10px_35px_-10px_rgba(109,40,217,0.12)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] border-0 ring-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-600/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] font-black uppercase tracking-wider">
              Super Admin Authority
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-purple-200/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Platform Engine
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Examination Command Center
          </h1>
          <p className="text-xs text-slate-600 dark:text-purple-200/80 max-w-xl">
            Platform-wide visibility, live proctoring control, multi-teacher oversight, and student intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={loadOverviewData}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-white/80 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-1.5 shadow-xs"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('super_admin_communications')}
            className="px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 text-purple-700 dark:text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-1.5 shadow-xs"
          >
            <Mail className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
            <span>Teacher Notices</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewExam}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-1.5 shadow-md shadow-purple-600/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Platform Exam</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Total Exams */}
        <div
          onClick={() => onNavigate('super_admin_exams')}
          className="p-5 rounded-[26px] bg-white dark:bg-[#111A2E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all cursor-pointer border-0 outline-none ring-0 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Exams</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <FileText className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.total_exams}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Across all faculties & courses
            </p>
          </div>
        </div>

        {/* Card 2: Currently Live */}
        <div
          onClick={() => onNavigate('super_admin_supervision')}
          className="p-5 rounded-[26px] bg-white dark:bg-[#111A2E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all cursor-pointer border-0 outline-none ring-0 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Live Right Now
            </span>
            <div className="w-9 h-9 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Radio className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.live_exams}
            </div>
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-0.5">
              Universal Control Available
            </p>
          </div>
        </div>

        {/* Card 3: Scheduled & Waiting */}
        <div
          onClick={() => onNavigate('super_admin_exams')}
          className="p-5 rounded-[26px] bg-white dark:bg-[#111A2E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all cursor-pointer border-0 outline-none ring-0 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Scheduled</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.scheduled_exams}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Ready for activation
            </p>
          </div>
        </div>

        {/* Card 4: Completed */}
        <div
          onClick={() => onNavigate('super_admin_exams')}
          className="p-5 rounded-[26px] bg-white dark:bg-[#111A2E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all cursor-pointer border-0 outline-none ring-0 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Completed</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.ended_exams}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Archived & reports ready
            </p>
          </div>
        </div>
      </div>

      {/* Currently Live Examinations Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Active Examination Control Rooms ({liveExams.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('super_admin_supervision')}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Live</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {liveExams.length === 0 ? (
          <div className="p-8 rounded-[28px] bg-white dark:bg-[#111A2E] text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-0 ring-0">
            <Video className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No examinations are actively live at this exact moment.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Super Admin can initiate or activate scheduled custom examinations directly from the list below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveExams.map((exam) => (
              <div
                key={exam.id}
                className="p-5 rounded-[26px] bg-white dark:bg-[#111A2E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all border-0 ring-0 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider">
                      Live Stream
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {exam.exam_code}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Subject: {exam.subject} | {exam.questions_count} Questions
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300 border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Creator Faculty:</span>
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
                    <span className="text-[11px] text-slate-400">Active Examinees:</span>
                    <span className="font-black text-slate-900 dark:text-white">
                      {exam.total_joined} / {exam.total_registered || exam.total_joined}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onEnterExamRoom(exam.id, exam.exam_code)}
                    className="flex-1 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Enter Control Room</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenExamDetail(exam)}
                    className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-all cursor-pointer border-0 outline-none shadow-xs"
                    title="View Detailed Dossier"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scheduled & Waiting Examination Control Rooms (Ready to Launch) */}
      {upcomingExams.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Ready for Supervision & Waiting Rooms ({upcomingExams.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('super_admin_exams')}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Exams</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingExams.slice(0, 6).map((exam) => (
              <div
                key={exam.id}
                className="p-5 rounded-[26px] bg-white dark:bg-[#111A2E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all border-0 ring-0 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                      <Clock className="w-3 h-3" />
                      Waiting & Ready
                    </span>
                    <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-md">
                      {exam.exam_code}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Subject: {exam.subject} | {exam.questions_count} Questions
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300 border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Creator Faculty:</span>
                    <span className="font-semibold">{exam.creator_name || 'Faculty Member'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-white/10">
                    <span className="text-[11px] text-slate-400">Duration:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {exam.duration_minutes} minutes
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onEnterExamRoom(exam.id, exam.exam_code)}
                    className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Launch Live Supervision Room</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenExamDetail(exam)}
                    className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-all cursor-pointer border-0 outline-none shadow-xs"
                    title="View Detailed Dossier"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Panel 1: Teacher Directory & Portfolios */}
        <div
          onClick={() => onNavigate('super_admin_teachers')}
          className="p-5 rounded-[26px] bg-white dark:bg-[#111A2E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all cursor-pointer border-0 outline-none ring-0 space-y-2 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            Teacher Directory & Supervision Assignments
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Inspect all educators, examine their exam portfolios, and reassign proctoring responsibilities.
          </p>
        </div>

        {/* Panel 2: Student Intelligence */}
        <div
          onClick={() => onNavigate('super_admin_students')}
          className="p-5 rounded-[26px] bg-white dark:bg-[#111A2E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all cursor-pointer border-0 outline-none ring-0 space-y-2 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            Student Intelligence & Proctoring Dossiers
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Platform-wide student directory, warning aggregations, suspension records, and accuracy metrics.
          </p>
        </div>

        {/* Panel 3: Supervision Issues */}
        <div
          onClick={() => onNavigate('super_admin_issues')}
          className="p-5 rounded-[26px] bg-white dark:bg-[#111A2E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all cursor-pointer border-0 outline-none ring-0 space-y-2 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            Supervision Issues & Technical Incidents
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track proctoring flags, disconnections, time disputes, and manage incident lifecycles.
          </p>
        </div>
      </div>
    </div>
  );
}
