'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders,
  Plus,
  Copy,
  Check,
  Video,
  Clock,
  Award,
  Users,
  Search,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  FileText,
  AlertCircle,
  Radio,
  BookOpen,
} from 'lucide-react';
import type { CustomExam } from '@/types/custom-exam';
import { CreateCustomExamModal } from './CreateCustomExamModal';
import { JoinCustomExamModal } from './JoinCustomExamModal';

interface CustomExamManagementDashboardProps {
  onBackToCategorySelect?: () => void;
  onOpenSupervisionRoom?: (examId: string, examCode: string) => void;
}

export function CustomExamManagementDashboard({
  onBackToCategorySelect,
  onOpenSupervisionRoom,
}: CustomExamManagementDashboardProps) {
  const router = useRouter();

  const [exams, setExams] = useState<CustomExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/custom-exams');
      if (res.ok) {
        const data = await res.json();
        setExams(data.exams || []);
      }
    } catch (err) {
      console.warn('Failed to fetch custom exams:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleOpenSupervision = (exam: CustomExam) => {
    if (onOpenSupervisionRoom) {
      onOpenSupervisionRoom(exam.id, exam.exam_code);
    } else {
      router.push(`/teacher/supervise/${exam.id}?code=${exam.exam_code}`);
    }
  };

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.exam_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exam.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    const isFinished = exam.status === 'completed' || exam.status === 'archived';
    return matchesSearch && (activeTab === 'active' ? !isFinished : isFinished);
  });

  const activeCount = exams.filter((e) => e.status !== 'completed' && e.status !== 'archived').length;
  const completedCount = exams.filter((e) => e.status === 'completed' || e.status === 'archived').length;

  return (
    <div className="space-y-8 select-none">
      {/* ── TOP HERO HEADER & ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#111A2E] border border-slate-200/80 dark:border-white/10 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Faculty &amp; Educator Examination Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Custom Examination Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
            Compose tailored question papers, generate random four-digit CE access codes, invite candidates, and conduct live WebRTC webcam supervision.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => setShowJoinModal(true)}
            className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#162032] dark:hover:bg-[#1D2B44] text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer border-0 outline-none flex items-center justify-center gap-2 shadow-xs"
          >
            <Radio className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Join with Code</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-[0_10px_25px_-5px_rgba(109,40,217,0.4)] hover:shadow-[0_14px_30px_-5px_rgba(109,40,217,0.5)] active:scale-95 transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Examination</span>
          </button>
        </div>
      </div>

      {/* ── METRIC TILES ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-[24px] bg-white dark:bg-[#111A2E] shadow-xs border-0 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Custom Exams</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{exams.length}</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-[24px] bg-white dark:bg-[#111A2E] shadow-xs border-0 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Active &amp; Ready</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{activeCount}</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-[24px] bg-white dark:bg-[#111A2E] shadow-xs border-0 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Webcam Supervised</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {exams.filter((e) => e.supervision_enabled).length}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-[24px] bg-white dark:bg-[#111A2E] shadow-xs border-0 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Completed Sessions</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{completedCount}</span>
          </div>
        </div>
      </div>

      {/* ── FILTER & SEARCH TOOLBAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl bg-slate-100/90 dark:bg-[#0D1527] shadow-xs border-0">
        {/* Segmented Tab Pill */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border-0 outline-none ${
              activeTab === 'active'
                ? 'bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span>Active &amp; Scheduled ({activeCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border-0 outline-none ${
              activeTab === 'completed'
                ? 'bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span>Archived ({completedCount})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or CE code..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#162032] border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* ── EXAMINATIONS GRID ── */}
      {loading ? (
        <div className="p-16 rounded-[32px] bg-white dark:bg-[#111A2E] border border-slate-200/60 dark:border-white/10 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-400">Loading custom examinations...</p>
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="p-16 rounded-[32px] bg-white dark:bg-[#111A2E] border border-slate-200/60 dark:border-white/10 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <Sliders className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {searchQuery ? 'No matching examinations found' : 'No examinations composed yet'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? 'Try a different search term or clear the filter.'
                : 'Click "Create Examination" to generate your first custom exam code and set up live supervision.'}
            </p>
          </div>
          {!searchQuery && (
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs tracking-tight shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer border-0 outline-none inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Examination</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((exam) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[28px] bg-white dark:bg-[#111A2E] p-5 sm:p-6 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_-6px_rgba(0,0,0,0.6)] border-0 flex flex-col justify-between hover:-translate-y-1 transition-all duration-200 group"
            >
              {/* Top Card Bar with CE Code and Status */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  {/* CE Code Bubble with One-Click Copy */}
                  <button
                    type="button"
                    onClick={() => handleCopyCode(exam.exam_code)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/90 dark:bg-purple-950/70 hover:bg-purple-200 text-purple-900 dark:text-purple-300 text-xs font-mono font-bold transition-colors cursor-pointer border-0 outline-none shadow-xs"
                    title="Copy student invitation code"
                  >
                    <span>{exam.exam_code}</span>
                    {copiedCode === exam.exam_code ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    )}
                  </button>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{exam.status}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                  {exam.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {exam.description || 'Custom configured question paper with real-time supervision.'}
                </p>

                {/* Badges strip */}
                <div className="flex items-center gap-2 flex-wrap mt-4 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-[#162032]">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{exam.duration_minutes} mins</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-[#162032]">
                    <Award className="w-3 h-3 text-slate-400" />
                    <span>{exam.total_marks} marks</span>
                  </span>
                  {exam.supervision_enabled && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400">
                      <Video className="w-3 h-3" />
                      <span>Webcam Live</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button at Card Bottom */}
              <div className="pt-4 mt-4 border-0 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleCopyCode(exam.exam_code)}
                  className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#162032] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer border-0 outline-none"
                  title="Share invitation code"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenSupervision(exam)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer border-0 outline-none flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Open Supervision Room</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* CREATE EXAM MODAL */}
      <CreateCustomExamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(newExam) => {
          setExams((prev) => [newExam, ...prev]);
          setShowCreateModal(false);
          handleOpenSupervision(newExam);
        }}
      />

      {/* JOIN EXAM MODAL */}
      <JoinCustomExamModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoined={(exam, participant) => {
          setShowJoinModal(false);
          router.push(`/exam/session?customExam=${exam.exam_code}`);
        }}
      />
    </div>
  );
}
