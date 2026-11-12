'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  FolderArchive,
  Search,
  Sparkles,
  Trash2,
  X,
  ArrowRight,
  Clock,
  CheckCircle2,
  Award,
  Layers,
} from 'lucide-react';
import * as localDB from '@/lib/store/local-db';
import { questionBank } from '@/lib/questions';
import type {
  ExamSession,
  Answer,
  AnswerEvaluation,
  StickyNote,
  Question,
} from '@/types/database';
import { SmoothSelect } from '@/components/ui/SmoothSelect';
import { ExamFolderCard } from '@/components/history/ExamFolderCard';
import { OpenFolderModal } from '@/components/history/OpenFolderModal';
import {
  formatExamDuration,
  resolveExamIdentity,
  type SessionArchiveMeta,
} from '@/components/history/history-helpers';

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'completed', label: 'Completed' },
  { value: 'drafts', label: 'Drafts' },
];

export default function HistoryPage() {
  const prefersReduced = useReducedMotion();
  const [items, setItems] = useState<SessionArchiveMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmCleanupOpen, setConfirmCleanupOpen] = useState(false);
  const [cleaningDrafts, setCleaningDrafts] = useState(false);

  const loadArchiveData = useCallback(async () => {
    const [sessions, allAnswers, allEvals, customQuestions, allNotes] =
      await Promise.all([
        localDB.getAllSessions(),
        localDB.getAllAnswers(),
        localDB.getAllEvaluations(),
        localDB.getAllCustomQuestions(),
        localDB.getAllStickyNotes(),
      ]);

    const questionMap = new Map<string, Question>();
    for (const q of questionBank) {
      questionMap.set(q.id, q);
    }
    for (const q of customQuestions) {
      questionMap.set(q.id, q);
    }

    const answersBySession = new Map<string, Answer[]>();
    for (const ans of allAnswers) {
      const list = answersBySession.get(ans.session_id) ?? [];
      list.push(ans);
      answersBySession.set(ans.session_id, list);
    }

    const evalByAnswerId = new Map<string, AnswerEvaluation>();
    for (const ev of allEvals) {
      evalByAnswerId.set(ev.answer_id, ev);
    }

    const notesBySession = new Map<string, StickyNote[]>();
    for (const note of allNotes) {
      if (!note.session_id) continue;
      const list = notesBySession.get(note.session_id) ?? [];
      list.push(note);
      notesBySession.set(note.session_id, list);
    }

    const sortedSessions = [...sessions].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const enriched: SessionArchiveMeta[] = sortedSessions.map(
      (session: ExamSession) => {
        const sAnswers = answersBySession.get(session.id) ?? [];
        const answeredCount = sAnswers.filter(
          (a) =>
            (a.answer_text && a.answer_text.trim().length > 0) ||
            Boolean(a.selected_option) ||
            (a.selected_options && a.selected_options.length > 0)
        ).length;

        let totalTimeSpent = 0;
        let totalScore = 0;
        let totalMaxScore = 0;
        let accuracyWeightedSum = 0;
        const sEvaluations: AnswerEvaluation[] = [];

        const subjectSet = new Set<string>();
        const topicSet = new Set<string>();

        for (const ans of sAnswers) {
          totalTimeSpent += ans.time_spent_seconds || 0;
          const q = questionMap.get(ans.question_id);
          if (q?.subject) subjectSet.add(q.subject);
          if (q?.topic) topicSet.add(q.topic);

          const ev = evalByAnswerId.get(ans.id);
          if (ev) {
            sEvaluations.push(ev);
            totalScore += ev.score;
            const qMax = ev.max_score || q?.marks || 10;
            totalMaxScore += qMax;
            if (
              typeof ev.percentage === 'number' &&
              !Number.isNaN(ev.percentage)
            ) {
              accuracyWeightedSum += ev.percentage;
            } else if (qMax > 0) {
              accuracyWeightedSum += Math.max(
                0,
                Math.min(100, (ev.score / qMax) * 100)
              );
            }
          }
        }

        const denominator =
          totalMaxScore > 0 ? totalMaxScore : session.total_marks;
        const scorePercent =
          sEvaluations.length > 0 && denominator > 0
            ? Math.round((totalScore / denominator) * 100)
            : null;

        const accuracyPercent =
          sEvaluations.length > 0
            ? Math.round(accuracyWeightedSum / sEvaluations.length)
            : null;

        const sessionNotes = [...(notesBySession.get(session.id) ?? [])].sort(
          (a, b) => {
            if (Boolean(a.is_pinned) !== Boolean(b.is_pinned)) {
              return a.is_pinned ? -1 : 1;
            }
            return (
              new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            );
          }
        );

        const identity = resolveExamIdentity(session.exam_code, session.title);

        return {
          session,
          answers: sAnswers,
          evaluations: sEvaluations,
          notes: sessionNotes,
          answeredCount,
          totalTimeSpent,
          totalScore,
          totalMaxScore,
          scorePercent,
          accuracyPercent,
          examCategory: identity.categoryName,
          examLogo: identity.logo,
          subjects: Array.from(subjectSet),
          topics: Array.from(topicSet),
          firstQuestionId: sAnswers[0]?.question_id ?? '',
        };
      }
    );

    return enriched;
  }, []);

  useEffect(() => {
    let active = true;
    loadArchiveData()
      .then((enriched) => {
        if (!active) return;
        setItems(enriched);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loadArchiveData]);

  const draftSessions = useMemo(
    () =>
      items.filter(
        (item) =>
          item.session.status === 'in_progress' && item.answeredCount === 0
      ),
    [items]
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      if (filterStatus === 'drafts') {
        if (
          !(
            item.session.status === 'in_progress' && item.answeredCount === 0
          )
        ) {
          return false;
        }
      } else if (
        filterStatus !== 'all' &&
        item.session.status !== filterStatus
      ) {
        return false;
      }

      if (!query) return true;
      const haystack = [
        item.session.title,
        item.session.exam_code ?? '',
        item.examCategory,
        ...item.subjects,
        ...item.topics,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [items, searchQuery, filterStatus]);

  const selectedItem = useMemo(
    () => items.find((item) => item.session.id === selectedId) ?? null,
    [items, selectedId]
  );

  const handleDeleteSession = useCallback(async (sessionId: string) => {
    await localDB.deleteSession(sessionId);
    setSelectedId((prev) => (prev === sessionId ? null : prev));
    setItems((prev) => prev.filter((item) => item.session.id !== sessionId));
  }, []);

  const handleCleanupDrafts = useCallback(async () => {
    if (cleaningDrafts || draftSessions.length === 0) return;
    setCleaningDrafts(true);
    try {
      const draftIds = new Set(draftSessions.map((d) => d.session.id));
      for (const draft of draftSessions) {
        await localDB.deleteSession(draft.session.id);
      }
      setSelectedId((prev) => (prev && draftIds.has(prev) ? null : prev));
      setItems((prev) => prev.filter((item) => !draftIds.has(item.session.id)));
      setConfirmCleanupOpen(false);
    } finally {
      setCleaningDrafts(false);
    }
  }, [cleaningDrafts, draftSessions]);

  const handleNotesUpdated = useCallback(
    (sessionId: string, updatedNotes: StickyNote[]) => {
      setItems((prev) =>
        prev.map((item) =>
          item.session.id === sessionId ? { ...item, notes: updatedNotes } : item
        )
      );
    },
    []
  );

  const summaryStats = useMemo(() => {
    const totalAnswered = items.reduce(
      (sum, item) => sum + item.answeredCount,
      0
    );
    const totalSeconds = items.reduce(
      (sum, item) => sum + item.totalTimeSpent,
      0
    );
    const scoredItems = items.filter(
      (item) => item.scorePercent !== null && item.evaluations.length > 0
    );
    const avgScore =
      scoredItems.length > 0
        ? Math.round(
            scoredItems.reduce(
              (sum, item) => sum + (item.scorePercent ?? 0),
              0
            ) / scoredItems.length
          )
        : 0;

    return {
      totalSessions: items.length,
      totalAnswered,
      totalTimeFormatted: formatExamDuration(totalSeconds),
      avgScore,
    };
  }, [items]);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-x-hidden bg-[#F7F8FD] dark:bg-[#090D1A] transition-colors duration-300">
      {/* Atmospheric top ambient gradient wash (non-blocking, zero outline) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-indigo-500/[0.07] via-violet-500/[0.04] to-transparent dark:from-indigo-500/[0.14] dark:via-violet-500/[0.06] dark:to-transparent"
      />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-6">
        {/* Archive Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6366F1] via-[#6C63FF] to-[#4F46E5] flex items-center justify-center text-white shadow-[0_10px_24px_-6px_rgba(99,91,255,0.45)] shrink-0">
                <FolderArchive className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Exam History
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 dark:bg-indigo-400/15 text-indigo-700 dark:text-indigo-200">
                  <Layers className="w-3.5 h-3.5" />
                  <span>
                    {items.length}{' '}
                    {items.length === 1 ? 'Folder' : 'Folders'}
                  </span>
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Open any exam folder to inspect performance metrics, personal sticky notes, and printable reports.
            </p>
          </div>

          <Link
            href="/practice"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#6366F1] via-[#6C63FF] to-[#5448E6] hover:brightness-105 text-white text-xs sm:text-sm font-semibold shadow-[0_10px_26px_-8px_rgba(99,91,255,0.5)] transition-all shrink-0 outline-none focus:outline-none"
          >
            <span>Start New Exam</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </header>

        {/* Subtle Unsubmitted Draft Archive Notice */}
        <AnimatePresence>
          {draftSessions.length > 0 && (
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: -8, scale: 0.98 }
              }
              transition={{ duration: 0.25 }}
              className="rounded-2xl bg-gradient-to-r from-indigo-500/[0.08] via-violet-500/[0.08] to-amber-500/[0.08] dark:from-indigo-500/[0.18] dark:via-violet-500/[0.14] dark:to-amber-500/[0.12] px-4 sm:px-5 py-3.5 shadow-[0_8px_24px_-12px_rgba(79,70,229,0.22)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 dark:bg-amber-400/20 flex items-center justify-center text-amber-600 dark:text-amber-300 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {draftSessions.length} unsubmitted draft{' '}
                    {draftSessions.length === 1 ? 'session' : 'sessions'} with 0
                    answered questions
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Keep your digital archive tidy by removing empty starts that were never submitted.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <AnimatePresence mode="wait">
                  {!confirmCleanupOpen ? (
                    <motion.button
                      key="cleanup-trigger"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      type="button"
                      onClick={() => setConfirmCleanupOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/12 hover:bg-rose-500/20 dark:bg-rose-500/20 dark:hover:bg-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-semibold transition-colors cursor-pointer outline-none focus:outline-none"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clean Up {draftSessions.length} Drafts</span>
                    </motion.button>
                  ) : (
                    <motion.div
                      key="cleanup-confirm"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 px-2.5 py-1.5 rounded-xl shadow-sm"
                    >
                      <span className="text-xs font-medium text-rose-600 dark:text-rose-300 px-1">
                        Remove {draftSessions.length}?
                      </span>
                      <button
                        type="button"
                        disabled={cleaningDrafts}
                        onClick={handleCleanupDrafts}
                        className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors disabled:opacity-60 cursor-pointer outline-none focus:outline-none"
                      >
                        {cleaningDrafts ? 'Cleaning...' : 'Confirm'}
                      </button>
                      <button
                        type="button"
                        disabled={cleaningDrafts}
                        onClick={() => setConfirmCleanupOpen(false)}
                        className="px-2.5 py-1 rounded-lg bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer outline-none focus:outline-none"
                      >
                        Cancel
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimal Archive Toolbar (Search + Smooth Status Filter) */}
        <section
          aria-label="Archive controls"
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sessions by exam title, category, subject, or topic..."
              aria-label="Search exam sessions"
              className="w-full h-11 pl-10 pr-9 rounded-2xl bg-white/90 dark:bg-[#13192D]/90 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-[0_8px_24px_-10px_rgba(15,23,42,0.1)] dark:shadow-[0_10px_28px_-10px_rgba(0,0,0,0.5)] focus:bg-white dark:focus:bg-[#171F36] transition-colors outline-none focus:outline-none"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer outline-none focus:outline-none"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="w-full sm:w-52 shrink-0">
            <SmoothSelect
              value={filterStatus}
              onChange={setFilterStatus}
              options={STATUS_FILTER_OPTIONS}
              ariaLabel="Filter sessions by status"
              variant="elevated"
              align="right"
            />
          </div>
        </section>

        {/* Responsive Exam Folder Gallery */}
        {loading ? (
          <div
            aria-label="Loading exam folders"
            className="grid grid-cols-1 min-[440px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6 pt-2"
          >
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="pt-4">
                <div className="relative h-[265px] rounded-[26px] bg-gradient-to-br from-indigo-100/80 via-slate-100 to-violet-100/70 dark:from-[#171E38] dark:via-[#12182D] dark:to-[#1E1B3A] animate-pulse shadow-sm" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] bg-white/85 dark:bg-[#12172B]/85 px-6 py-16 text-center shadow-[0_16px_44px_-16px_rgba(79,70,229,0.18)] dark:shadow-[0_18px_48px_-16px_rgba(0,0,0,0.55)]"
          >
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 dark:from-indigo-500/25 dark:to-violet-500/25 flex items-center justify-center text-indigo-600 dark:text-indigo-300 mb-4">
              <FolderArchive className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
              {items.length === 0
                ? 'Your Exam Archive Is Empty'
                : 'No Matching Exam Folders'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              {items.length === 0
                ? 'Complete a timed battle or practice test to store your first interactive exam folder here.'
                : 'Try adjusting your search keywords or status filter to locate the session folder.'}
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {(searchQuery || filterStatus !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('all');
                  }}
                  className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer outline-none focus:outline-none"
                >
                  Reset Filters
                </button>
              )}
              <Link
                href="/practice"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#6366F1] via-[#6C63FF] to-[#5448E6] text-white text-xs font-semibold shadow-[0_10px_24px_-8px_rgba(99,91,255,0.5)] outline-none focus:outline-none"
              >
                <span>Start Practice Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 min-[440px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6 pt-1"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <ExamFolderCard
                  key={item.session.id}
                  item={item}
                  index={index}
                  isSelected={selectedId === item.session.id}
                  onOpen={(entry) => setSelectedId(entry.session.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Archive Performance Summary Strip */}
        {items.length > 0 && (
          <section
            aria-label="Archive summary statistics"
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2"
          >
            <div className="rounded-2xl bg-white/85 dark:bg-[#12172B]/90 px-4 py-3.5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)] dark:shadow-[0_10px_28px_-12px_rgba(0,0,0,0.45)] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/12 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0">
                <FolderArchive className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {summaryStats.totalSessions}
                </div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  Total Sessions
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/85 dark:bg-[#12172B]/90 px-4 py-3.5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)] dark:shadow-[0_10px_28px_-12px_rgba(0,0,0,0.45)] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-500/12 dark:bg-violet-400/20 text-violet-600 dark:text-violet-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {summaryStats.totalAnswered}
                </div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  Questions Answered
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/85 dark:bg-[#12172B]/90 px-4 py-3.5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)] dark:shadow-[0_10px_28px_-12px_rgba(0,0,0,0.45)] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/12 dark:bg-blue-400/20 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {summaryStats.totalTimeFormatted}
                </div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  Total Time
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/85 dark:bg-[#12172B]/90 px-4 py-3.5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)] dark:shadow-[0_10px_28px_-12px_rgba(0,0,0,0.45)] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/12 dark:bg-emerald-400/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {summaryStats.avgScore}%
                </div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  Avg Score
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Opened 3D Exam Folder Modal */}
      <AnimatePresence>
        {selectedItem && (
          <OpenFolderModal
            key={selectedItem.session.id}
            item={selectedItem}
            onClose={() => setSelectedId(null)}
            onConfirmDelete={handleDeleteSession}
            onNotesUpdated={handleNotesUpdated}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
