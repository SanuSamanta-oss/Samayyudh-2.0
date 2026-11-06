'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Answer, AnswerStatus } from '@/types';
import {
  CheckCircle2,
  Circle,
  Eye,
  Pencil,
  Flag,
  Check,
  X,
  Filter,
  Search,
  Sparkles,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

// ============================================================================
// 1. EXACT STATUS COLOR IDENTITIES (Mandatory Specification)
// ============================================================================
export const STATUS_COLORS = {
  not_visited: '#A78BFA', // 1. Not Visited — Purple
  visited: '#7285FF',     // 2. Visited — Blue
  in_progress: '#FFB020', // 3. In Progress — Yellow / Amber
  answered: '#00C781',    // 4. Answered — Green
  correct: '#00C781',     // 5. Correct — Green
  wrong: '#FF5C68',       // 6. Wrong — Red
  flagged: '#FF5C68',     // 7. Flagged — Red
  submitted: '#00C781',   // Submitted shares Answered green identity
} as const;

export type DisplayStatus = 'not_visited' | 'visited' | 'in_progress' | 'answered' | 'correct' | 'wrong' | 'flagged';

export interface QuestionNavigatorProps {
  totalQuestions: number;
  currentIndex: number;
  getQuestionStatus: (questionId: string) => AnswerStatus;
  questionIds: string[];
  onNavigate: (index: number) => void;
  stats: {
    total: number;
    answered: number;
    visited: number;
    flagged: number;
    notVisited: number;
    inProgress?: number;
    correct?: number;
    wrong?: number;
  };
  // Optional enhancements for rich state synchronization
  answers?: Map<string, Answer>;
  onToggleFlag?: (questionId: string) => void;
  evaluations?: Record<string, { is_correct?: boolean; score?: number }>;
  className?: string;
  isMobileDrawer?: boolean;
}

// ============================================================================
// 2. ANIMATED ROLLING NUMBER COUNTER
// ============================================================================
function AnimatedCounter({ value, color }: { value: number; color?: string }) {
  return (
    <span className="relative inline-flex items-center justify-center min-w-[1.1rem] h-5 overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 7, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -7, opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="font-black tabular-nums text-sm leading-none"
          style={color ? { color } : undefined}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ============================================================================
// 3. MAIN COMPONENT: QuestionNavigator
// ============================================================================
export function QuestionNavigator({
  totalQuestions,
  currentIndex,
  getQuestionStatus,
  questionIds,
  onNavigate,
  stats,
  answers,
  onToggleFlag,
  evaluations,
  className,
  isMobileDrawer = false,
}: QuestionNavigatorProps) {
  const [filter, setFilter] = useState<'all' | 'answered' | 'visited' | 'not_visited' | 'flagged' | 'in_progress'>('all');
  const [jumpInput, setJumpInput] = useState('');
  const [showJumpSearch, setShowJumpSearch] = useState(false);
  const activeTileRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll active question into view inside navigation panel
  useEffect(() => {
    if (activeTileRef.current) {
      activeTileRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [currentIndex]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentIndex < totalQuestions - 1) {
          e.preventDefault();
          onNavigate(currentIndex + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentIndex > 0) {
          e.preventDefault();
          onNavigate(currentIndex - 1);
        }
      } else if ((e.key === 'f' || e.key === 'F') && onToggleFlag) {
        const activeQId = questionIds[currentIndex];
        if (activeQId) {
          e.preventDefault();
          onToggleFlag(activeQId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalQuestions, onNavigate, onToggleFlag, questionIds]);

  // Compute question item metadata with preserved exact statuses
  const questionsMeta = useMemo(() => {
    return Array.from({ length: totalQuestions }, (_, i) => {
      const qId = questionIds[i];
      const ans = qId && answers ? answers.get(qId) : undefined;
      const rawStatus = qId ? getQuestionStatus(qId) : 'not_visited';
      const evaluation = qId && evaluations ? evaluations[qId] : undefined;

      // Evaluation post-exam result (if available)
      const isEvaluated = Boolean(evaluation);
      const isCorrect = Boolean(evaluation?.is_correct || (evaluation?.score && evaluation.score > 0));

      // Flag state: Flagged status retains underlying status!
      const isFlagged = rawStatus === 'flagged' || ans?.status === 'flagged';

      // Has student answered?
      const hasAnswer = Boolean(
        rawStatus === 'answered' ||
        rawStatus === 'submitted' ||
        (ans && (ans.answer_text?.trim().length > 0 || ans.selected_option || (ans.selected_options && ans.selected_options.length > 0)))
      );

      // In Progress?
      const isInProgress = rawStatus === 'in_progress' || (ans && ans.status === 'in_progress');

      // Base visual status
      let baseStatus: DisplayStatus = 'not_visited';
      if (isEvaluated) {
        baseStatus = isCorrect ? 'correct' : 'wrong';
      } else if (hasAnswer) {
        baseStatus = 'answered';
      } else if (isInProgress) {
        baseStatus = 'in_progress';
      } else if (rawStatus === 'visited' || ans) {
        baseStatus = 'visited';
      } else {
        baseStatus = 'not_visited';
      }

      return {
        index: i,
        questionNumber: i + 1,
        questionId: qId,
        baseStatus,
        isFlagged,
        isCurrent: i === currentIndex,
        hasAnswer,
      };
    });
  }, [totalQuestions, questionIds, answers, getQuestionStatus, evaluations, currentIndex]);

  // Live status summary counters
  const summaryCounts = useMemo(() => {
    let answered = 0;
    let visited = 0;
    let notVisited = 0;
    let flagged = 0;
    let inProgress = 0;
    let correct = 0;
    let wrong = 0;

    questionsMeta.forEach((q) => {
      if (q.baseStatus === 'correct') correct++;
      else if (q.baseStatus === 'wrong') wrong++;

      if (q.hasAnswer) answered++;
      else if (q.baseStatus === 'visited') visited++;
      else if (q.baseStatus === 'in_progress') inProgress++;
      else if (q.baseStatus === 'not_visited') notVisited++;

      if (q.isFlagged) flagged++;
    });

    return {
      answered: Math.max(stats.answered, answered),
      visited: Math.max(stats.visited, visited),
      notVisited: Math.min(stats.notVisited, notVisited),
      flagged: Math.max(stats.flagged, flagged),
      inProgress: stats.inProgress ?? inProgress,
      correct: stats.correct ?? correct,
      wrong: stats.wrong ?? wrong,
    };
  }, [questionsMeta, stats]);

  // Filtered questions list
  const filteredQuestions = useMemo(() => {
    if (filter === 'all') return questionsMeta;
    return questionsMeta.filter((q) => {
      if (filter === 'answered') return q.hasAnswer;
      if (filter === 'flagged') return q.isFlagged;
      if (filter === 'visited') return q.baseStatus === 'visited' && !q.hasAnswer;
      if (filter === 'not_visited') return q.baseStatus === 'not_visited';
      if (filter === 'in_progress') return q.baseStatus === 'in_progress';
      return true;
    });
  }, [questionsMeta, filter]);

  // Handle Jump Input
  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpInput.trim(), 10);
    if (!isNaN(num) && num >= 1 && num <= totalQuestions) {
      onNavigate(num - 1);
      setJumpInput('');
      setShowJumpSearch(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'w-full bg-white/95 dark:bg-[#111A2E]/95 backdrop-blur-md rounded-3xl border border-stone-200/90 dark:border-[#223354] shadow-lg shadow-black/5 dark:shadow-black/30 transition-all space-y-4 select-none',
        isMobileDrawer ? 'p-3.5' : 'p-4 sm:p-5',
        className
      )}
    >
      {/* ── 1. PALETTE HEADER ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-[#1E2D4A]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-white">
            Question Palette
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-stone-500 dark:text-slate-400 bg-stone-100 dark:bg-[#162238] px-2.5 py-0.5 rounded-full border border-stone-200/70 dark:border-[#243556]">
            {currentIndex + 1} / {totalQuestions}
          </span>
          {totalQuestions > 12 && (
            <button
              onClick={() => setShowJumpSearch(!showJumpSearch)}
              className={cn(
                'p-1.5 rounded-lg border transition-all cursor-pointer',
                showJumpSearch
                  ? 'bg-brand-50 border-brand-300 text-brand-600 dark:bg-brand-950/60 dark:border-brand-700 dark:text-brand-300'
                  : 'border-stone-200 dark:border-[#243556] text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#18263E]'
              )}
              title="Jump to Question #"
              aria-label="Jump to question"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Jump To Question Input (Expandable) ── */}
      <AnimatePresence>
        {showJumpSearch && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            onSubmit={handleJumpSubmit}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-[#16233B] border border-stone-200 dark:border-[#283C64]">
              <input
                type="number"
                min={1}
                max={totalQuestions}
                placeholder={`Jump (1 - ${totalQuestions})...`}
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                autoFocus
                className="w-full text-xs font-semibold bg-transparent focus:outline-none text-stone-900 dark:text-white placeholder:text-stone-400"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-brand-600 text-white hover:bg-brand-700 transition-colors cursor-pointer shrink-0"
              >
                Go
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* ── 2. COMPACT STATUS SUMMARY DASHBOARD (Exact Colors) ────────────── */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-xs">
          {/* Answered — Green #00C781 */}
          <button
            onClick={() => setFilter(filter === 'answered' ? 'all' : 'answered')}
            className={cn(
              'flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer group',
              filter === 'answered'
                ? 'border-[#00C781] bg-[#00C781]/12 dark:bg-[#00C781]/20 shadow-xs'
                : 'border-stone-200/80 dark:border-[#1E2D4A] bg-stone-50/80 dark:bg-[#162238] hover:border-[#00C781]/50 hover:bg-[#00C781]/5'
            )}
            title="Filter Answered Questions"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                style={{ backgroundColor: STATUS_COLORS.answered }}
              />
              <span className="text-[11px] font-bold text-stone-700 dark:text-slate-300 truncate">
                Answered
              </span>
            </div>
            <AnimatedCounter value={summaryCounts.answered} color={STATUS_COLORS.answered} />
          </button>

          {/* Visited — Blue #7285FF */}
          <button
            onClick={() => setFilter(filter === 'visited' ? 'all' : 'visited')}
            className={cn(
              'flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer group',
              filter === 'visited'
                ? 'border-[#7285FF] bg-[#7285FF]/12 dark:bg-[#7285FF]/20 shadow-xs'
                : 'border-stone-200/80 dark:border-[#1E2D4A] bg-stone-50/80 dark:bg-[#162238] hover:border-[#7285FF]/50 hover:bg-[#7285FF]/5'
            )}
            title="Filter Visited Questions"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                style={{ backgroundColor: STATUS_COLORS.visited }}
              />
              <span className="text-[11px] font-bold text-stone-700 dark:text-slate-300 truncate">
                Visited
              </span>
            </div>
            <AnimatedCounter value={summaryCounts.visited} color={STATUS_COLORS.visited} />
          </button>

          {/* Not Visited — Purple #A78BFA */}
          <button
            onClick={() => setFilter(filter === 'not_visited' ? 'all' : 'not_visited')}
            className={cn(
              'flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer group',
              filter === 'not_visited'
                ? 'border-[#A78BFA] bg-[#A78BFA]/12 dark:bg-[#A78BFA]/20 shadow-xs'
                : 'border-stone-200/80 dark:border-[#1E2D4A] bg-stone-50/80 dark:bg-[#162238] hover:border-[#A78BFA]/50 hover:bg-[#A78BFA]/5'
            )}
            title="Filter Not Visited Questions"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                style={{ backgroundColor: STATUS_COLORS.not_visited }}
              />
              <span className="text-[11px] font-bold text-stone-700 dark:text-slate-300 truncate">
                Not Visited
              </span>
            </div>
            <AnimatedCounter value={summaryCounts.notVisited} color={STATUS_COLORS.not_visited} />
          </button>

          {/* Flagged — Red #FF5C68 */}
          <button
            onClick={() => setFilter(filter === 'flagged' ? 'all' : 'flagged')}
            className={cn(
              'flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer group',
              filter === 'flagged'
                ? 'border-[#FF5C68] bg-[#FF5C68]/12 dark:bg-[#FF5C68]/20 shadow-xs'
                : 'border-stone-200/80 dark:border-[#1E2D4A] bg-stone-50/80 dark:bg-[#162238] hover:border-[#FF5C68]/50 hover:bg-[#FF5C68]/5'
            )}
            title="Filter Flagged Questions"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs flex items-center justify-center text-[7px] text-white"
                style={{ backgroundColor: STATUS_COLORS.flagged }}
              >
                <Flag className="w-1.5 h-1.5 fill-current" />
              </span>
              <span className="text-[11px] font-bold text-stone-700 dark:text-slate-300 truncate">
                Flagged
              </span>
            </div>
            <AnimatedCounter value={summaryCounts.flagged} color={STATUS_COLORS.flagged} />
          </button>
        </div>

        {/* Additional status row: In Progress & Evaluations (if applicable) */}
        {(summaryCounts.inProgress > 0 || (evaluations && (summaryCounts.correct > 0 || summaryCounts.wrong > 0))) && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            {summaryCounts.inProgress > 0 && (
              <div className="flex items-center justify-between p-2 rounded-xl border border-stone-200/70 dark:border-[#1E2D4A] bg-stone-50/60 dark:bg-[#162238]/60 text-[11px]">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: STATUS_COLORS.in_progress }}
                  />
                  <span className="font-semibold text-stone-600 dark:text-slate-300 truncate">
                    In Progress
                  </span>
                </div>
                <AnimatedCounter value={summaryCounts.inProgress} color={STATUS_COLORS.in_progress} />
              </div>
            )}
            {evaluations && summaryCounts.correct > 0 && (
              <div className="flex items-center justify-between p-2 rounded-xl border border-[#00C781]/40 bg-[#00C781]/10 text-[11px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Check className="w-3 h-3 text-[#00C781]" />
                  <span className="font-bold text-[#00C781]">Correct</span>
                </div>
                <AnimatedCounter value={summaryCounts.correct} color={STATUS_COLORS.correct} />
              </div>
            )}
            {evaluations && summaryCounts.wrong > 0 && (
              <div className="flex items-center justify-between p-2 rounded-xl border border-[#FF5C68]/40 bg-[#FF5C68]/10 text-[11px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <X className="w-3 h-3 text-[#FF5C68]" />
                  <span className="font-bold text-[#FF5C68]">Wrong</span>
                </div>
                <AnimatedCounter value={summaryCounts.wrong} color={STATUS_COLORS.wrong} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Active Filter Pill & Reset ── */}
      {filter !== 'all' && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/60 text-[11px]">
          <span className="font-bold text-brand-700 dark:text-brand-300 capitalize">
            Filter: {filter.replace('_', ' ')} ({filteredQuestions.length})
          </span>
          <button
            onClick={() => setFilter('all')}
            className="flex items-center gap-1 font-extrabold text-brand-600 hover:text-brand-800 dark:text-brand-300 dark:hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Show All</span>
          </button>
        </div>
      )}

      {/* ── 3. INTERACTIVE QUESTION NUMBER GRID ───────────────────────────── */}
      <div className="space-y-2">
        <div
          className={cn(
            'grid gap-2 max-h-[360px] overflow-y-auto pr-1 select-none custom-scrollbar',
            totalQuestions <= 25 ? 'grid-cols-5' : 'grid-cols-5 sm:grid-cols-5'
          )}
        >
          {filteredQuestions.map((q) => {
            const isCurrent = q.isCurrent;
            const statusColor = STATUS_COLORS[q.baseStatus];

            return (
              <motion.button
                key={q.questionNumber}
                ref={isCurrent ? activeTileRef : null}
                onClick={() => onNavigate(q.index)}
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                className={cn(
                  'relative aspect-square flex flex-col items-center justify-center rounded-2xl font-bold text-sm transition-all cursor-pointer',
                  // Base styles based on status
                  q.baseStatus === 'answered' &&
                    'bg-[#00C781]/12 dark:bg-[#00C781]/20 border border-[#00C781]/45 text-[#00A368] dark:text-[#34D399]',
                  q.baseStatus === 'visited' &&
                    'bg-[#7285FF]/12 dark:bg-[#7285FF]/20 border border-[#7285FF]/45 text-[#4F46E5] dark:text-[#93C5FD]',
                  q.baseStatus === 'not_visited' &&
                    'bg-[#A78BFA]/10 dark:bg-[#A78BFA]/16 border border-[#A78BFA]/35 text-[#7C3AED] dark:text-[#C4B5FD]',
                  q.baseStatus === 'in_progress' &&
                    'bg-[#FFB020]/12 dark:bg-[#FFB020]/20 border border-[#FFB020]/45 text-[#D97706] dark:text-[#FDE047]',
                  q.baseStatus === 'correct' &&
                    'bg-[#00C781]/25 border-2 border-[#00C781] text-[#047857] dark:text-[#34D399]',
                  q.baseStatus === 'wrong' &&
                    'bg-[#FF5C68]/25 border-2 border-[#FF5C68] text-[#DC2626] dark:text-[#FCA5A5]',

                  // Active Highlight: prominent glowing outline that works on ANY status
                  isCurrent && [
                    'ring-2 ring-brand-500 dark:ring-brand-400 ring-offset-2 ring-offset-white dark:ring-offset-[#111A2E]',
                    'scale-[1.06] shadow-md shadow-brand-500/30 z-10 font-extrabold',
                  ]
                )}
                title={`Question ${q.questionNumber} — ${q.baseStatus.replace('_', ' ')}${
                  q.isFlagged ? ' (Flagged)' : ''
                }`}
                aria-label={`Go to question ${q.questionNumber}, status ${q.baseStatus}${
                  q.isFlagged ? ', flagged' : ''
                }`}
                aria-current={isCurrent ? 'true' : undefined}
              >
                {/* Flag Indicator Badge (Corner indicator — never overwrites underlying status) */}
                {q.isFlagged && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-[#FF5C68] text-white flex items-center justify-center shadow-xs z-20"
                    title="Flagged Question"
                  >
                    <Flag className="w-2.5 h-2.5 fill-current" />
                  </motion.div>
                )}

                {/* Question Number */}
                <span className="leading-none">{q.questionNumber}</span>

                {/* Status Dot / Evaluation Indicator Badge */}
                <div className="absolute top-1 right-1">
                  {q.baseStatus === 'correct' ? (
                    <Check className="w-2.5 h-2.5 text-[#00C781] stroke-[3]" />
                  ) : q.baseStatus === 'wrong' ? (
                    <X className="w-2.5 h-2.5 text-[#FF5C68] stroke-[3]" />
                  ) : (
                    <span
                      className="block w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: statusColor }}
                    />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="p-6 text-center text-xs text-stone-500 dark:text-slate-400 border border-dashed border-stone-200 dark:border-[#1E2D4A] rounded-2xl">
            No questions match the &quot;{filter}&quot; status filter.
          </div>
        )}
      </div>

      {/* ── 4. MODERN STATUS LEGEND (Exact Existing Colors) ───────────────── */}
      <div className="pt-3 border-t border-stone-200/80 dark:border-[#1E2D4A] space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-400">
            Legend
          </p>
          <span className="text-[10px] text-stone-400 dark:text-slate-500">
            [← →] Move • [F] Flag
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] text-stone-600 dark:text-slate-300">
          {/* Not Visited: #A78BFA */}
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
              style={{ backgroundColor: STATUS_COLORS.not_visited }}
            />
            <span className="truncate">Not Visited</span>
          </div>

          {/* Visited: #7285FF */}
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
              style={{ backgroundColor: STATUS_COLORS.visited }}
            />
            <span className="truncate">Visited</span>
          </div>

          {/* In Progress: #FFB020 */}
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
              style={{ backgroundColor: STATUS_COLORS.in_progress }}
            />
            <span className="truncate">In Progress</span>
          </div>

          {/* Answered: #00C781 */}
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
              style={{ backgroundColor: STATUS_COLORS.answered }}
            />
            <span className="truncate">Answered</span>
          </div>

          {/* Flagged: #FF5C68 */}
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs flex items-center justify-center text-[7px] text-white"
              style={{ backgroundColor: STATUS_COLORS.flagged }}
            >
              <Flag className="w-1.5 h-1.5 fill-current" />
            </span>
            <span className="truncate">Flagged</span>
          </div>

          {/* Correct / Wrong Post-Exam Reference */}
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 flex items-center justify-center text-[8px] text-white"
              style={{ backgroundColor: STATUS_COLORS.correct }}
            >
              <Check className="w-2 h-2 text-white stroke-[3]" />
            </span>
            <span className="truncate">Correct / Wrong</span>
          </div>
        </div>
      </div>
    </div>
  );
}
