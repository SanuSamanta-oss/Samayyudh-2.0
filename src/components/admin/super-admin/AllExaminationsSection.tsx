'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Video,
  FileText,
  Clock,
  Radio,
  ExternalLink,
  Mail,
  FileSpreadsheet,
  RefreshCw,
  Plus,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import type { PlatformExamSummary } from '@/types/admin';

interface AllExaminationsSectionProps {
  onEnterExamRoom: (examId: string, examCode?: string) => void;
  onOpenExamDetail: (exam: PlatformExamSummary) => void;
  onContactTeacher: (teacherEmail: string, teacherName?: string, examId?: string, examCode?: string) => void;
  onOpenNewExam: () => void;
}

export function AllExaminationsSection({
  onEnterExamRoom,
  onOpenExamDetail,
  onContactTeacher,
  onOpenNewExam,
}: AllExaminationsSectionProps) {
  const [exams, setExams] = useState<PlatformExamSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'waiting' | 'scheduled' | 'ended' | 'draft'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '15',
        status: statusFilter,
        search,
        sortBy: 'created_at',
        sortOrder: 'desc',
      });
      const res = await fetch(`/api/admin/exams/all?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setExams(data.items || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      console.error('[AllExaminationsSection] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchExams();
  };

  // Format date strictly in Asia/Kolkata
  const formatIST = (isoString?: string | null) => {
    if (!isoString) return '—';
    try {
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  const statusStyles: Record<string, { bg: string; text: string; dot?: string }> = {
    live: { bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', text: 'LIVE NOW', dot: 'bg-rose-500 animate-ping' },
    waiting: { bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', text: 'WAITING ROOM', dot: 'bg-amber-500' },
    scheduled: { bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400', text: 'SCHEDULED' },
    ended: { bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', text: 'COMPLETED' },
    draft: { bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400', text: 'DRAFT' },
    cancelled: { bg: 'bg-red-500/10 text-red-600 dark:text-red-400', text: 'CANCELLED' },
  };

  return (
    <div className="space-y-4 select-none">
      {/* Header & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 rounded-[28px] bg-white dark:bg-[#111A2E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-0 ring-0">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Platform Examinations ({totalCount})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Complete registry of all custom and standard examinations created by faculty members.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code, title, subject..."
              className="pl-9 pr-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-white/5 text-xs text-slate-900 dark:text-white placeholder-slate-400 border-0 outline-none focus:ring-1 focus:ring-purple-500/50 w-48 sm:w-60"
            />
          </form>

          <button
            type="button"
            onClick={fetchExams}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer border-0 outline-none shadow-xs"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={onOpenNewExam}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-1.5 shadow-md shadow-purple-600/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Exam</span>
          </button>
        </div>
      </div>

      {/* Filter Pills with Smooth Sliding Animation */}
      <div className="relative flex items-center gap-1 p-1 rounded-2xl bg-slate-200/70 dark:bg-white/5 w-fit overflow-x-auto scrollbar-none shadow-inner">
        {(['all', 'live', 'waiting', 'scheduled', 'ended', 'draft'] as const).map((st) => {
          const isActive = statusFilter === st;
          return (
            <button
              key={st}
              type="button"
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className="relative px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors duration-200 cursor-pointer border-0 outline-none capitalize shrink-0 z-10"
            >
              {isActive && (
                <motion.div
                  layoutId="allExamsStatusIndicator"
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
                {st === 'all' ? 'All Examinations' : st}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Table */}
      <div className="rounded-[28px] bg-white dark:bg-[#111A2E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-0 ring-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-[11px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-white/2">
                <th className="py-3.5 px-4 font-bold">Exam Details</th>
                <th className="py-3.5 px-3 font-bold">Subject / Marks</th>
                <th className="py-3.5 px-3 font-bold">Creator Faculty</th>
                <th className="py-3.5 px-3 font-bold">Assigned Proctor</th>
                <th className="py-3.5 px-3 font-bold">Schedule (IST)</th>
                <th className="py-3.5 px-3 font-bold text-center">Examinees</th>
                <th className="py-3.5 px-3 font-bold text-center">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-600" />
                    <span>Loading platform examinations...</span>
                  </td>
                </tr>
              ) : exams.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="font-bold text-slate-600 dark:text-slate-400">No examinations found.</p>
                    <p className="text-[11px] mt-0.5">Try adjusting your search or status filter.</p>
                  </td>
                </tr>
              ) : (
                exams.map((exam) => {
                  const style = statusStyles[exam.status] || statusStyles.draft;
                  return (
                    <tr
                      key={exam.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-white/3 transition-colors group"
                    >
                      {/* Column 1: Title & Code */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                          {exam.title}
                        </div>
                        <div className="font-mono text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                          {exam.exam_code}
                        </div>
                      </td>

                      {/* Column 2: Subject & Marks */}
                      <td className="py-3.5 px-3">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">
                          {exam.subject}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {exam.total_marks} Marks · {exam.duration_minutes}m
                        </div>
                      </td>

                      {/* Column 3: Creator Faculty */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {exam.creator_name || 'Faculty Member'}
                        </div>
                        {exam.creator_email && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            {exam.creator_email}
                          </div>
                        )}
                      </td>

                      {/* Column 4: Assigned Proctor */}
                      <td className="py-3.5 px-3">
                        {exam.assigned_teacher_name ? (
                          <div>
                            <div className="font-semibold text-purple-600 dark:text-purple-400">
                              {exam.assigned_teacher_name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                              {exam.assigned_teacher_email || 'Assigned Supervisor'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Same as creator</span>
                        )}
                      </td>

                      {/* Column 5: Schedule IST */}
                      <td className="py-3.5 px-3">
                        <div className="text-slate-700 dark:text-slate-300 font-medium">
                          {formatIST(exam.scheduled_start || exam.created_at)}
                        </div>
                        {exam.actual_start && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                            Started: {formatIST(exam.actual_start)}
                          </div>
                        )}
                      </td>

                      {/* Column 6: Examinees */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-black text-slate-900 dark:text-white">
                          {exam.total_joined}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          {' '}/ {exam.total_registered || exam.total_joined}
                        </span>
                        {exam.total_suspended > 0 && (
                          <div className="text-[10px] text-rose-500 font-bold">
                            {exam.total_suspended} Suspended
                          </div>
                        )}
                      </td>

                      {/* Column 7: Status Badge */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${style.bg}`}
                        >
                          {style.dot && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />}
                          {style.text}
                        </span>
                      </td>

                      {/* Column 8: Row Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Enter Universal Supervision Room */}
                          <button
                            type="button"
                            onClick={() => onEnterExamRoom(exam.id, exam.exam_code)}
                            className="p-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer border-0 outline-none shadow-xs"
                            title="Super Admin Universal Room Access"
                          >
                            <Video className="w-3.5 h-3.5" />
                          </button>

                          {/* View Detail Drawer */}
                          <button
                            type="button"
                            onClick={() => onOpenExamDetail(exam)}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-all cursor-pointer border-0 outline-none"
                            title="View Full Dossier"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          {/* Contact Teacher */}
                          <button
                            type="button"
                            onClick={() =>
                              onContactTeacher(
                                exam.creator_email || '',
                                exam.creator_name || 'Faculty',
                                exam.id,
                                exam.exam_code
                              )
                            }
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-all cursor-pointer border-0 outline-none"
                            title="Send Official Notice to Teacher"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500">
            <span>
              Page {page} of {totalPages} ({totalCount} total exams)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 disabled:opacity-40 cursor-pointer border-0 outline-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 disabled:opacity-40 cursor-pointer border-0 outline-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
