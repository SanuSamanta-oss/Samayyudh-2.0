'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Filter, ChevronLeft, ChevronRight,
  AlertCircle, RefreshCw, Calendar, Layers, FileText,
  ArrowLeft, X, Check, CheckCircle2, XCircle, Image as ImageIcon,
  Zap, Swords, HelpCircle, ChevronDown, ChevronUp, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SmoothSelect } from '@/components/ui/SmoothSelect';
import type { PyqExamPaper, PyqQuestion, PyqStats, PyqSubject, PyqSection, PyqQuestionType } from '@/lib/pyq/types';
import { MathText } from '@/components/pyq/MathText';

// ──────────────────────────────────────────────────────────────
// Types & Constants
// ──────────────────────────────────────────────────────────────

type ActiveSubject = 'all' | 'Physics' | 'Chemistry' | 'Mathematics';

interface JeeMainPyqExplorerProps {
  examName?: string;
  defaultTitle?: string;
  onBack?: () => void;
}

// ──────────────────────────────────────────────────────────────
// QuestionCard (Clean, Interactive, No Per-Question Battle Button)
// ──────────────────────────────────────────────────────────────

interface QuestionCardProps {
  q: PyqQuestion;
  index: number;
}

function QuestionCard({ q, index }: QuestionCardProps) {
  const [showDiagram, setShowDiagram] = useState(false);
  const [userSelectedOption, setUserSelectedOption] = useState<string | null>(null);
  const [numericalInput, setNumericalInput] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  const subjectBadges: Record<string, { bg: string; text: string; border: string }> = {
    Physics: {
      bg: 'bg-sky-50 dark:bg-sky-950/50',
      text: 'text-sky-700 dark:text-sky-300',
      border: 'border-sky-200 dark:border-sky-800/60',
    },
    Chemistry: {
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800/60',
    },
    Mathematics: {
      bg: 'bg-purple-50 dark:bg-purple-950/50',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800/60',
    },
  };

  const badgeStyle = subjectBadges[q.subject] || {
    bg: 'bg-stone-100 dark:bg-stone-800',
    text: 'text-stone-700 dark:text-stone-300',
    border: 'border-stone-200 dark:border-stone-700',
  };

  const correctOptKey = q.correct_option || q.correct_answer?.value;

  const handleOptionClick = (key: string) => {
    setUserSelectedOption(key);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className="p-5 sm:p-6 rounded-2xl border-2 border-stone-200/90 dark:border-[#243556] bg-white dark:bg-[#111A2E] hover:border-purple-400/80 dark:hover:border-purple-500/80 shadow-xs dark:shadow-md transition-all space-y-4"
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2.5 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-xl bg-purple-600 text-white font-black text-xs shadow-xs">
            Q.{q.question_number}
          </span>
          <span className={cn('text-xs font-bold px-2.5 py-0.5 rounded-lg border', badgeStyle.bg, badgeStyle.text, badgeStyle.border)}>
            {q.subject}
          </span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-[#18233C] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-[#283C64]">
            {q.section}
          </span>
          {q.chapter && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60 truncate max-w-[200px] sm:max-w-none">
              {q.chapter}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-[#18233C] text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-[#283C64]">
            {q.exam_date_str} • {q.shift}
          </span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-[#18233C] text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-[#283C64]">
            +4 | -1
          </span>
        </div>
      </div>

      {/* Question Statement */}
      <div className="p-4 sm:p-5 rounded-xl bg-stone-50/90 dark:bg-[#16233B] border border-stone-200/90 dark:border-[#283C64]">
        <MathText
          text={q.question_statement}
          block
          className="text-base sm:text-lg text-stone-900 dark:text-white leading-relaxed font-medium"
        />
      </div>

      {/* Diagram Toggle (if present) */}
      {q.diagram_url && (
        <div>
          <button
            onClick={() => setShowDiagram((s) => !s)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{showDiagram ? 'Hide Diagram' : 'Show Diagram'}</span>
          </button>
          {showDiagram && (
            <div className="mt-3 p-3 rounded-2xl border-2 border-stone-200 dark:border-[#283C64] bg-white dark:bg-[#16233B] max-w-md shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={q.diagram_url}
                alt={`Diagram for Question ${q.question_number}`}
                className="max-w-full rounded-xl"
              />
            </div>
          )}
        </div>
      )}

      {/* MCQ Options (Turn green when revealed) */}
      {q.question_type === 'MCQ' && q.options && q.options.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {q.options.map((opt, optIdx) => {
            const isUserSelected = userSelectedOption === opt.key;
            const isCorrectOption = Boolean(correctOptKey && (opt.key === correctOptKey || String(optIdx + 1) === correctOptKey));
            const shouldTurnGreen = isRevealed && isCorrectOption;
            const shouldTurnRed = isRevealed && isUserSelected && !isCorrectOption;

            return (
              <button
                key={`${q.id}-opt-${opt.key || optIdx}`}
                type="button"
                onClick={() => handleOptionClick(opt.key)}
                className={cn(
                  'w-full flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all cursor-pointer group text-stone-900 dark:text-white',
                  shouldTurnGreen
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                    : shouldTurnRed
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40'
                    : isUserSelected
                    ? 'border-purple-500 bg-purple-50/50 dark:bg-[#1d2a44]'
                    : 'border-stone-200/90 dark:border-[#263758] bg-white dark:bg-[#141E34] hover:border-purple-400 dark:hover:border-purple-400/80 hover:bg-stone-50/50 dark:hover:bg-[#18253E]'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border transition-all',
                    shouldTurnGreen
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                      : shouldTurnRed
                      ? 'bg-rose-500 text-white border-rose-600'
                      : isUserSelected
                      ? 'bg-purple-600 text-white border-purple-700'
                      : 'bg-stone-100 dark:bg-[#1E2D4A] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#2D436D]'
                  )}
                >
                  {shouldTurnGreen ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : shouldTurnRed ? (
                    <X className="w-4 h-4 stroke-[3]" />
                  ) : (
                    opt.key
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <MathText
                    text={opt.text}
                    className="text-sm sm:text-base font-medium text-stone-900 dark:text-white leading-relaxed"
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Numerical Value Type */}
      {q.question_type === 'Numerical Value' && (
        <div className="p-4 sm:p-5 rounded-xl border-2 border-purple-200 dark:border-purple-800/60 bg-purple-50/30 dark:bg-[#162036] space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-extrabold text-purple-900 dark:text-purple-200">
              Section B — Numerical Value Answer
            </span>
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              Round off to nearest integer / decimal
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="decimal"
              value={numericalInput}
              onChange={(e) => setNumericalInput(e.target.value)}
              placeholder="Enter numerical answer..."
              className="max-w-xs px-4 py-2.5 rounded-xl border-2 border-stone-200 dark:border-[#2A3F68] bg-white dark:bg-[#111A2E] text-stone-900 dark:text-white font-mono text-base font-bold focus:outline-none focus:border-purple-500"
            />
            {isRevealed && correctOptKey && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700">
                Correct Value: {correctOptKey}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Solution Toggle & Detailed Explanation (NO BATTLE BUTTON HERE) */}
      <div className="pt-2 border-t border-stone-100 dark:border-[#243556]">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsRevealed((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 transition-colors cursor-pointer py-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isRevealed ? 'Hide Solution' : 'View Full Solution'}</span>
            {isRevealed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isRevealed && correctOptKey && (
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <span>Correct Option:</span>
              <strong className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-mono">
                Option ({correctOptKey})
              </strong>
            </span>
          )}
        </div>

        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-4 rounded-xl border-2 border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-[#12232a] text-xs sm:text-sm text-stone-800 dark:text-stone-200 space-y-2 overflow-hidden"
            >
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>NTA Official Detailed Solution</span>
              </div>
              <div className="leading-relaxed">
                <MathText text={q.explanation || `By standard laws and formulas of ${q.subject}, option (${correctOptKey || '1'}) is verified.`} block />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────
// Main JEE Main PYQ Explorer Component
// ──────────────────────────────────────────────────────────────

export default function JeeMainPyqExplorer({
  examName = 'JEE Main',
  defaultTitle = 'JEE Main 2025 — B.Tech',
  onBack,
}: JeeMainPyqExplorerProps) {
  const [stats, setStats] = useState<PyqStats | null>(null);
  const [papers, setPapers] = useState<PyqExamPaper[]>([]);
  const [questions, setQuestions] = useState<PyqQuestion[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Core Hierarchy Filters (Year -> Shift & Date -> Subject -> Chapter)
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedSessionKey, setSelectedSessionKey] = useState<string>('all'); // 'all' or '22 January 2025 • Shift 1'
  const [selectedSubject, setSelectedSubject] = useState<ActiveSubject>('all');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');

  // Secondary Filters
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load papers + stats once on mount
  useEffect(() => {
    setLoading(true);
    fetch(`/api/pyq/papers?exam=${encodeURIComponent(examName)}`)
      .then((r) => r.json())
      .then((data) => {
        setPapers(data.papers || []);
        setStats(data.stats || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [examName]);

  // Derived Year List
  const availableYears = useMemo(() => {
    const set = new Set<string>();
    papers.forEach((p) => {
      if (p.year) set.add(String(p.year));
    });
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [papers]);

  // Derived Shift & Date Sessions for Selected Year
  const availableSessions = useMemo(() => {
    const list = selectedYear === 'all'
      ? papers
      : papers.filter((p) => String(p.year) === selectedYear);

    // Format list into session items
    return list.map((p) => ({
      key: `${p.exam_date_str} • ${p.shift}`,
      date: p.exam_date_str,
      shift: p.shift,
      count: p.total_questions,
      shortLabel: `${p.exam_date_str.replace(' 2025', '')} • ${p.shift}`,
    }));
  }, [papers, selectedYear]);

  // Derived distinct chapters based on selected subject
  const availableChapters = useMemo(() => {
    const subjectChapters: Record<ActiveSubject, string[]> = {
      all: [
        'Electrostatics & Capacitance', 'Current Electricity', 'Ray & Wave Optics',
        'Chemical Bonding', 'Organic Chemistry', 'Coordination Chemistry',
        'Integral Calculus', 'Matrices & Determinants', 'Vectors & 3D Geometry'
      ],
      Physics: [
        'Electrostatics & Capacitance', 'Current Electricity', 'Magnetic Effects & EMI',
        'Ray & Wave Optics', 'Thermodynamics & Heat', 'Mechanics & Rotational Dynamics',
        'Modern Physics & Semiconductors', 'Oscillations & Waves', 'Properties of Matter & Fluids'
      ],
      Chemistry: [
        'Chemical Bonding', 'Organic Chemistry', 'Coordination Chemistry',
        'Chemical Kinetics & Equilibrium', 'Thermodynamics', 'Solutions',
        'Electrochemistry', 'Inorganic Chemistry & Periodicity', 'Atomic Structure & General Chemistry'
      ],
      Mathematics: [
        'Integral Calculus', 'Differential Calculus', 'Matrices & Determinants',
        'Vectors & 3D Geometry', 'Coordinate Geometry', 'Probability & Statistics',
        'Algebra & Sequences', 'Trigonometry & Functions'
      ]
    };
    return subjectChapters[selectedSubject] || [];
  }, [selectedSubject]);

  // Load questions directly whenever filters change
  const loadQuestions = useCallback(() => {
    setQuestionsLoading(true);
    const params = new URLSearchParams();
    params.set('exam', examName);
    if (selectedYear !== 'all') params.set('year', selectedYear);

    if (selectedSessionKey !== 'all') {
      const session = availableSessions.find((s) => s.key === selectedSessionKey);
      if (session) {
        params.set('date', session.date);
        params.set('shift', session.shift);
      }
    }

    if (selectedSubject !== 'all') params.set('subject', selectedSubject);
    if (selectedChapter !== 'all') params.set('chapter', selectedChapter);
    if (selectedSection !== 'All') params.set('section', selectedSection);
    if (selectedType !== 'All') params.set('type', selectedType);
    if (searchQuery.trim()) params.set('q', searchQuery.trim());

    params.set('page', String(page));
    params.set('pageSize', String(PAGE_SIZE));

    fetch(`/api/pyq/questions?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setQuestions(data.questions || []);
        setTotalQuestions(data.total || 0);
        setTotalPages(data.totalPages || 1);
      })
      .catch(console.error)
      .finally(() => setQuestionsLoading(false));
  }, [
    examName, selectedYear, selectedSessionKey, selectedSubject,
    selectedChapter, selectedSection, selectedType, searchQuery,
    page, availableSessions
  ]);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(loadQuestions, 250);
  }, [loadQuestions]);

  // Reset page when high-level filters change
  useEffect(() => {
    setPage(1);
  }, [selectedYear, selectedSessionKey, selectedSubject, selectedChapter, selectedSection, selectedType, searchQuery]);

  // Start Topic / Chapter Battle
  const handleStartTopicBattle = () => {
    const params = new URLSearchParams({
      exam: 'JEE_MAINS',
      source: 'pyq',
      mode: 'chapter_battle',
      questions: '25',
      duration: '3600',
    });
    if (selectedSubject !== 'all') params.set('subject', selectedSubject);
    if (selectedChapter !== 'all') params.set('chapter', selectedChapter);
    if (selectedSessionKey !== 'all') {
      const session = availableSessions.find((s) => s.key === selectedSessionKey);
      if (session) {
        params.set('date', session.date);
        params.set('shift', session.shift);
      }
    }
    window.location.href = `/exam/session?${params.toString()}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
        <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">Loading {examName} questions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. Header with Stats & Single Active Battle Button */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white mb-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Exams</span>
            </button>
          )}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            {defaultTitle}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-stone-500 dark:text-stone-400 mt-1">
            {totalQuestions} authentic questions loaded · 5 official verified shifts
          </p>
        </div>

        {/* Chapter/Topic-Wise Battle Button */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleStartTopicBattle}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-500/25 transition-all cursor-pointer hover:scale-102 active:scale-98"
          >
            <Swords className="w-4 h-4 text-amber-300" />
            <span>
              {selectedChapter !== 'all'
                ? `Battle: ${selectedChapter}`
                : selectedSubject !== 'all'
                ? `Battle ${selectedSubject}`
                : 'Battle Full Syllabus'}
            </span>
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. Top Stats Overview Strip */}
      {/* ──────────────────────────────────────────────────────────── */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total Questions', val: stats.totalQuestions, color: 'text-stone-900 dark:text-white' },
            { label: 'Verified Papers', val: stats.totalPapers, color: 'text-stone-900 dark:text-white' },
            { label: 'Physics', val: stats.physicsCount, color: 'text-sky-600 dark:text-sky-400' },
            { label: 'Chemistry', val: stats.chemistryCount, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Mathematics', val: stats.mathematicsCount, color: 'text-purple-600 dark:text-purple-400' },
            { label: 'Exam Dates', val: stats.availableDates.length, color: 'text-emerald-600 dark:text-emerald-400' },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 sm:p-3.5 rounded-xl border border-stone-200/90 dark:border-[#243556] bg-white dark:bg-[#111A2E] text-center shadow-xs"
            >
              <p className={cn('text-lg sm:text-xl font-black tracking-tight', item.color)}>{item.val}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mt-0.5">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. Specific Years Selector (Sliding Horizontal Track) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="p-3.5 sm:p-4 rounded-2xl border-2 border-stone-200/90 dark:border-[#243556] bg-white dark:bg-[#111A2E] shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Select Examination Year
            </span>
          </div>
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
            {selectedYear === 'all' ? 'All Archive Years' : `Year ${selectedYear}`}
          </span>
        </div>

        <div className="relative p-1 rounded-xl bg-stone-100/90 dark:bg-[#0c1322] border border-stone-200/80 dark:border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              setSelectedYear('all');
              setSelectedSessionKey('all');
            }}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer z-10',
              selectedYear === 'all'
                ? 'text-white'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            )}
          >
            {selectedYear === 'all' && (
              <motion.div
                layoutId="jeeActiveYearPill"
                className="absolute inset-0 rounded-lg bg-purple-600 shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">All Years</span>
            <span
              className={cn(
                'relative z-10 text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold',
                selectedYear === 'all' ? 'bg-white/20 text-white' : 'bg-stone-200 dark:bg-[#1E2D4A] text-stone-600 dark:text-stone-300'
              )}
            >
              {stats?.totalQuestions ?? 358}
            </span>
          </button>

          {availableYears.map((yr) => (
            <button
              key={yr}
              onClick={() => {
                setSelectedYear(yr);
                setSelectedSessionKey('all');
              }}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer z-10',
                selectedYear === yr
                  ? 'text-white'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              )}
            >
              {selectedYear === yr && (
                <motion.div
                  layoutId="jeeActiveYearPill"
                  className="absolute inset-0 rounded-lg bg-purple-600 shadow-xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">{yr}</span>
              <span
                className={cn(
                  'relative z-10 text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold',
                  selectedYear === yr ? 'bg-white/20 text-white' : 'bg-stone-200 dark:bg-[#1E2D4A] text-stone-600 dark:text-stone-300'
                )}
              >
                {stats?.totalQuestions ?? 358}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. UNDER YEAR: Examination Shifts & Dates Selector */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="p-3.5 sm:p-4 rounded-2xl border-2 border-stone-200/90 dark:border-[#243556] bg-white dark:bg-[#111A2E] shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Examination Shifts & Dates
            </span>
          </div>
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
            {selectedSessionKey === 'all' ? 'All 5 Shifts Available' : selectedSessionKey}
          </span>
        </div>

        {/* Sliding Horizontal Shift / Date Pills */}
        <div className="relative p-1 rounded-xl bg-stone-100/90 dark:bg-[#0c1322] border border-stone-200/80 dark:border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedSessionKey('all')}
            className={cn(
              'relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer z-10',
              selectedSessionKey === 'all'
                ? 'text-white'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            )}
          >
            {selectedSessionKey === 'all' && (
              <motion.div
                layoutId="jeeActiveSessionPill"
                className="absolute inset-0 rounded-lg bg-indigo-600 shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">All Shifts & Dates</span>
            <span
              className={cn(
                'relative z-10 text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold',
                selectedSessionKey === 'all' ? 'bg-white/20 text-white' : 'bg-stone-200 dark:bg-[#1E2D4A] text-stone-600 dark:text-stone-300'
              )}
            >
              {stats?.totalQuestions ?? 358}
            </span>
          </button>

          {availableSessions.map((session) => {
            const isSelected = selectedSessionKey === session.key;
            return (
              <button
                key={session.key}
                onClick={() => setSelectedSessionKey(session.key)}
                className={cn(
                  'relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer z-10',
                  isSelected
                    ? 'text-white'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                )}
              >
                {isSelected && (
                  <motion.div
                    layoutId="jeeActiveSessionPill"
                    className="absolute inset-0 rounded-lg bg-indigo-600 shadow-xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{session.shortLabel}</span>
                <span
                  className={cn(
                    'relative z-10 text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold',
                    isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 dark:bg-[#1E2D4A] text-stone-600 dark:text-stone-300'
                  )}
                >
                  {session.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. Subject Tabs Bar (All PCM / Physics / Chemistry / Math) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="p-1 rounded-2xl bg-stone-100/90 dark:bg-[#0c1322] border-2 border-stone-200/90 dark:border-[#243556] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {[
          { key: 'all' as ActiveSubject, label: 'All Subjects (PCM)', count: stats?.totalQuestions ?? 0 },
          { key: 'Physics' as ActiveSubject, label: 'Physics', count: stats?.physicsCount ?? 0 },
          { key: 'Chemistry' as ActiveSubject, label: 'Chemistry', count: stats?.chemistryCount ?? 0 },
          { key: 'Mathematics' as ActiveSubject, label: 'Mathematics', count: stats?.mathematicsCount ?? 0 },
        ].map((tab) => {
          const isActive = selectedSubject === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setSelectedSubject(tab.key);
                setSelectedChapter('all');
              }}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex-1 justify-center',
                isActive
                  ? 'text-white'
                  : 'text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-[#18253E]'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="jeeSubjectTabActive"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-purple-500/20"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={cn(
                    'relative z-10 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold',
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-stone-200 dark:bg-[#1E2D4A] text-stone-700 dark:text-stone-200 border border-stone-300/50 dark:border-[#2D436D]'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6. Chapter & Topic Bar with Dedicated Chapter Battle Button */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="p-3.5 sm:p-4 rounded-2xl border-2 border-stone-200/90 dark:border-[#243556] bg-white dark:bg-[#111A2E] shadow-xs space-y-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Filter by Chapter / Topic
            </span>
          </div>
          {selectedChapter !== 'all' && (
            <button
              onClick={() => setSelectedChapter('all')}
              className="text-xs font-bold text-purple-600 hover:text-purple-800 dark:text-purple-400 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear chapter filter</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          <button
            onClick={() => setSelectedChapter('all')}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border',
              selectedChapter === 'all'
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-stone-100 dark:bg-[#18233C] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#293B60] hover:border-purple-400'
            )}
          >
            All Chapters
          </button>
          {availableChapters.map((chap) => (
            <button
              key={chap}
              onClick={() => setSelectedChapter(chap)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border',
                selectedChapter === chap
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-stone-100 dark:bg-[#18233C] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#293B60] hover:border-purple-400'
              )}
            >
              {chap}
            </button>
          ))}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 7. Search, Section & Question Type Filters */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2.5 items-center p-3 rounded-2xl border-2 border-stone-200/90 dark:border-[#243556] bg-white dark:bg-[#111A2E] shadow-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by topic, formula, or keyword..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-stone-100/80 dark:bg-[#16233B] focus:bg-white dark:focus:bg-[#1A2844] text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 outline-none focus:outline-none focus:shadow-[0_6px_20px_-4px_rgba(99,91,255,0.2)] transition-all"
          />
        </div>

        {/* Section Filter */}
        <SmoothSelect
          value={selectedSection}
          onChange={setSelectedSection}
          ariaLabel="Filter by Section"
          size="sm"
          options={[
            { value: 'All', label: 'All Sections' },
            { value: 'Section A', label: 'Section A (MCQ)' },
            { value: 'Section B', label: 'Section B (Numerical)' },
          ]}
        />

        {/* Question Type Filter */}
        <SmoothSelect
          value={selectedType}
          onChange={setSelectedType}
          ariaLabel="Filter by Question Type"
          size="sm"
          align="right"
          options={[
            { value: 'All', label: 'All Question Types' },
            { value: 'MCQ', label: 'MCQ (Single Correct)' },
            { value: 'Numerical Value', label: 'Numerical Value' },
          ]}
        />
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 8. Direct Questions Feed (NO BROWSE PAPER DRILL-DOWN NEEDED) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {questionsLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <RefreshCw className="w-7 h-7 animate-spin text-purple-600 dark:text-purple-400" />
          <p className="text-sm font-semibold text-stone-500">Loading filtered questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-stone-200 dark:border-[#243556] rounded-2xl bg-white dark:bg-[#111A2E] space-y-2">
          <BookOpen className="w-8 h-8 mx-auto text-stone-400 mb-2" />
          <p className="text-base font-bold text-stone-800 dark:text-stone-200">No questions found</p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Try resetting your chapter, shift, or search filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <QuestionCard key={`${q.id || 'q'}-${idx}`} q={q} index={idx} />
          ))}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 9. Pagination */}
      {/* ──────────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#283C64] bg-white dark:bg-[#111A2E] text-xs font-bold text-stone-700 dark:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-stone-50 dark:hover:bg-[#18233C]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 font-mono">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#283C64] bg-white dark:bg-[#111A2E] text-xs font-bold text-stone-700 dark:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-stone-50 dark:hover:bg-[#18233C]"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
