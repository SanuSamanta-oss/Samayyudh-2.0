'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Swords,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  SlidersHorizontal,
  Sparkles,
  Award,
  Check,
  RefreshCw,
  Calculator,
  Atom,
  FlaskConical,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MathText } from '@/components/pyq/MathText';
import {
  WBJEE_QUESTIONS_DATA,
  WBJEE_YEARS,
  WBJEE_SUBJECTS,
  WbjeeQuestion,
  WbjeeYear,
  getWbjeeStats,
} from '@/data/wbjee/wbjeeQuestionsData';

interface WbjeePyqExplorerProps {
  onBack?: () => void;
}

type ActiveSubject = 'all' | 'Mathematics' | 'Physics' | 'Chemistry';
type ActiveCategory = 'all' | 1 | 2 | 3;

export default function WbjeePyqExplorer({ onBack }: WbjeePyqExplorerProps) {
  const router = useRouter();

  // Filters state
  const [selectedYear, setSelectedYear] = useState<WbjeeYear | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<ActiveSubject>('all');
  const [selectedCategory, setSelectedCategory] = useState<ActiveCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');

  // Interactive Question State (user selected options and reveal solution)
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const stats = useMemo(() => getWbjeeStats(), []);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return WBJEE_QUESTIONS_DATA.filter((q) => {
      if (selectedYear !== 'all' && q.year !== selectedYear) return false;
      if (selectedSubject !== 'all' && q.subject !== selectedSubject) return false;
      if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;
      if (selectedChapter !== 'all' && q.chapter !== selectedChapter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchStatement = q.question_statement.toLowerCase().includes(query);
        const matchChapter = q.chapter.toLowerCase().includes(query);
        const matchOptions = q.options.some((opt) => opt.text.toLowerCase().includes(query));
        if (!matchStatement && !matchChapter && !matchOptions) return false;
      }
      return true;
    });
  }, [selectedYear, selectedSubject, selectedCategory, selectedChapter, searchQuery]);

  // Extract distinct chapters for the current subject
  const availableChapters = useMemo(() => {
    const questions =
      selectedSubject === 'all'
        ? WBJEE_QUESTIONS_DATA
        : WBJEE_QUESTIONS_DATA.filter((q) => q.subject === selectedSubject);
    const set = new Set<string>();
    questions.forEach((q) => set.add(q.chapter));
    return Array.from(set).sort();
  }, [selectedSubject]);

  // Subject Configuration Helper
  const currentSubjectMeta = useMemo(() => {
    return WBJEE_SUBJECTS.find((s) => s.key === selectedSubject);
  }, [selectedSubject]);

  // Toggle user answer selection (Single choice for Cat 1/2, multi choice for Cat 3)
  const handleSelectOption = (question: WbjeeQuestion, optId: string) => {
    const qId = question.id;
    const current = userAnswers[qId] || [];

    if (question.category === 3) {
      // Multi-select for Category 3
      if (current.includes(optId)) {
        setUserAnswers((prev) => ({
          ...prev,
          [qId]: current.filter((id) => id !== optId),
        }));
      } else {
        setUserAnswers((prev) => ({
          ...prev,
          [qId]: [...current, optId],
        }));
      }
    } else {
      // Single select for Category 1 & 2
      setUserAnswers((prev) => ({
        ...prev,
        [qId]: [optId],
      }));
    }
  };

  const toggleSolution = (qId: string) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // Single Action Button Handlers for Battle
  const handleStartSubjectBattle = (subjectName?: string) => {
    const sub = subjectName || (selectedSubject === 'all' ? 'mathematics' : selectedSubject.toLowerCase());
    router.push(`/practice?exam=WBJEE&subject=${encodeURIComponent(sub)}`);
  };

  const handleStartChapterBattle = (chapterName: string) => {
    const sub = selectedSubject === 'all' ? 'mathematics' : selectedSubject.toLowerCase();
    router.push(
      `/practice?exam=WBJEE&subject=${encodeURIComponent(sub)}&chapter=${encodeURIComponent(chapterName)}`
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. Header & Navigation Breadcrumb */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Back to PYQ Home"
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Official Archive
              </span>
              <span className="inline-block w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700" />
              <span className="text-xs text-stone-500 font-medium">WBJEEB Papers 2019–2024</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mt-0.5">
              WBJEE PYQ Explorer
            </h1>
          </div>
        </div>

        {/* Global Subject Battle Button Header */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => handleStartSubjectBattle()}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-all cursor-pointer',
              currentSubjectMeta
                ? currentSubjectMeta.buttonBg
                : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/20'
            )}
          >
            <Swords className="w-4 h-4" />
            <span>
              {selectedSubject === 'all'
                ? 'Battle All WBJEE'
                : `Battle ${selectedSubject}`}
            </span>
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. Top Stats Overview Strip */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Questions */}
        <div className="group relative p-4 rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white/80 dark:bg-stone-900/60 backdrop-blur-md shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Total Archive
            </span>
            <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-1.5 tracking-tight">
            {stats.total}
          </p>
          <p className="text-[11px] text-stone-400 font-medium mt-0.5">5 Verified Papers (2019–2024)</p>
        </div>

        {/* Mathematics */}
        <div className="group relative p-4 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/25 dark:to-stone-900/60 backdrop-blur-md shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
              Mathematics
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold">
              Paper I
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-indigo-950 dark:text-indigo-200 mt-1.5 tracking-tight">
            {stats.math}
          </p>
          <p className="text-[11px] text-indigo-600/80 dark:text-indigo-400/80 font-medium mt-0.5">
            100 Marks (75 Qs)
          </p>
        </div>

        {/* Physics */}
        <div className="group relative p-4 rounded-2xl border border-violet-200/80 dark:border-violet-900/50 bg-gradient-to-br from-violet-50/50 to-white dark:from-violet-950/25 dark:to-stone-900/60 backdrop-blur-md shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider">
              Physics
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 font-bold">
              Paper II
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-violet-950 dark:text-violet-200 mt-1.5 tracking-tight">
            {stats.phys}
          </p>
          <p className="text-[11px] text-violet-600/80 dark:text-violet-400/80 font-medium mt-0.5">
            50 Marks (40 Qs)
          </p>
        </div>

        {/* Chemistry */}
        <div className="group relative p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/25 dark:to-stone-900/60 backdrop-blur-md shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
              Chemistry
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold">
              Paper II
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-950 dark:text-emerald-200 mt-1.5 tracking-tight">
            {stats.chem}
          </p>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium mt-0.5">
            50 Marks (40 Qs)
          </p>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. Year Selection Panel (Modern Sliding Segmented Track) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white/90 dark:bg-stone-900/80 backdrop-blur-md shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-600 dark:text-stone-300">
              Examination Year
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700" />
            <span className="text-xs text-stone-400 font-medium">
              Filter official archive by session
            </span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400">
              {selectedYear === 'all'
                ? 'All 5 Archive Years'
                : `WBJEE ${selectedYear} Session`}
            </span>
          </div>
        </div>

        {/* Sliding Year Slider Track with layoutId */}
        <div className="relative p-1.5 rounded-2xl bg-stone-100/90 dark:bg-[#0c1322] border border-stone-200/80 dark:border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {/* All Years Button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setSelectedYear('all')}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer z-10',
              selectedYear === 'all'
                ? 'text-stone-900 dark:text-white'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            )}
          >
            {selectedYear === 'all' && (
              <motion.div
                layoutId="wbjee_active_year_pill"
                className="absolute inset-0 rounded-xl bg-white dark:bg-[#1E293B] shadow-sm border border-stone-200/90 dark:border-white/10"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">All Years</span>
            <span
              className={cn(
                'relative z-10 text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold transition-colors',
                selectedYear === 'all'
                  ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400'
                  : 'bg-stone-200/80 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
              )}
            >
              {WBJEE_QUESTIONS_DATA.length}
            </span>
          </motion.button>

          {/* Individual Years */}
          {WBJEE_YEARS.map((year) => {
            const count = WBJEE_QUESTIONS_DATA.filter((q) => q.year === year).length;
            const isSelected = selectedYear === year;
            return (
              <motion.button
                key={year}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedYear(year)}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer z-10',
                  isSelected
                    ? 'text-stone-900 dark:text-white'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                )}
              >
                {isSelected && (
                  <motion.div
                    layoutId="wbjee_active_year_pill"
                    className="absolute inset-0 rounded-xl bg-white dark:bg-[#1E293B] shadow-sm border border-stone-200/90 dark:border-white/10"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{year}</span>
                <span
                  className={cn(
                    'relative z-10 text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold transition-colors',
                    isSelected
                      ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400'
                      : 'bg-stone-200/80 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                  )}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. Subject Selection Tabs (Sliding High-End Subject Cards) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* All Subjects Tab */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSelectedSubject('all');
            setSelectedChapter('all');
          }}
          className={cn(
            'group relative p-4 rounded-2xl border text-left transition-all cursor-pointer overflow-hidden',
            selectedSubject === 'all'
              ? 'border-brand-500/80 bg-gradient-to-br from-brand-50/70 to-white dark:from-brand-950/40 dark:to-stone-900/90 shadow-lg shadow-brand-500/10'
              : 'border-stone-200/90 dark:border-stone-800 bg-white/90 dark:bg-stone-900/70 hover:border-stone-300 dark:hover:border-stone-700'
          )}
        >
          {selectedSubject === 'all' && (
            <motion.div
              layoutId="wbjee_active_subject_glow"
              className="absolute inset-0 rounded-2xl pointer-events-none ring-2 ring-brand-500/40 dark:ring-brand-400/40"
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            />
          )}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              All Subjects
            </span>
            <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-base font-extrabold text-stone-900 dark:text-white tracking-tight">
            Full Syllabus
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {WBJEE_QUESTIONS_DATA.length} Questions
            </span>
            <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700" />
            <span className="text-[11px] text-stone-400 font-medium">5 Years</span>
          </div>
        </motion.button>

        {/* Mathematics Tab */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSelectedSubject('Mathematics');
            setSelectedChapter('all');
          }}
          className={cn(
            'group relative p-4 rounded-2xl border text-left transition-all cursor-pointer overflow-hidden',
            selectedSubject === 'Mathematics'
              ? 'border-indigo-500/80 bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/40 dark:to-stone-900/90 shadow-lg shadow-indigo-500/10'
              : 'border-stone-200/90 dark:border-stone-800 bg-white/90 dark:bg-stone-900/70 hover:border-indigo-200 dark:hover:border-indigo-800/60'
          )}
        >
          {selectedSubject === 'Mathematics' && (
            <motion.div
              layoutId="wbjee_active_subject_glow"
              className="absolute inset-0 rounded-2xl pointer-events-none ring-2 ring-indigo-500/50 dark:ring-indigo-400/50"
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            />
          )}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold">
              Paper I
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
              <Calculator className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-base font-extrabold text-stone-900 dark:text-white tracking-tight">
            Mathematics
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {stats.math} Questions
            </span>
            <span className="w-1 h-1 rounded-full bg-indigo-300 dark:bg-indigo-700" />
            <span className="text-[11px] text-stone-400 font-medium">100 Marks</span>
          </div>
        </motion.button>

        {/* Physics Tab */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSelectedSubject('Physics');
            setSelectedChapter('all');
          }}
          className={cn(
            'group relative p-4 rounded-2xl border text-left transition-all cursor-pointer overflow-hidden',
            selectedSubject === 'Physics'
              ? 'border-violet-500/80 bg-gradient-to-br from-violet-50/70 to-white dark:from-violet-950/40 dark:to-stone-900/90 shadow-lg shadow-violet-500/10'
              : 'border-stone-200/90 dark:border-stone-800 bg-white/90 dark:bg-stone-900/70 hover:border-violet-200 dark:hover:border-violet-800/60'
          )}
        >
          {selectedSubject === 'Physics' && (
            <motion.div
              layoutId="wbjee_active_subject_glow"
              className="absolute inset-0 rounded-2xl pointer-events-none ring-2 ring-violet-500/50 dark:ring-violet-400/50"
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            />
          )}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 font-bold">
              Paper II
            </span>
            <div className="p-1.5 rounded-lg bg-violet-100/70 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
              <Atom className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-base font-extrabold text-stone-900 dark:text-white tracking-tight">
            Physics
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
              {stats.phys} Questions
            </span>
            <span className="w-1 h-1 rounded-full bg-violet-300 dark:bg-violet-700" />
            <span className="text-[11px] text-stone-400 font-medium">50 Marks</span>
          </div>
        </motion.button>

        {/* Chemistry Tab */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSelectedSubject('Chemistry');
            setSelectedChapter('all');
          }}
          className={cn(
            'group relative p-4 rounded-2xl border text-left transition-all cursor-pointer overflow-hidden',
            selectedSubject === 'Chemistry'
              ? 'border-emerald-500/80 bg-gradient-to-br from-emerald-50/70 to-white dark:from-emerald-950/40 dark:to-stone-900/90 shadow-lg shadow-emerald-500/10'
              : 'border-stone-200/90 dark:border-stone-800 bg-white/90 dark:bg-stone-900/70 hover:border-emerald-200 dark:hover:border-emerald-800/60'
          )}
        >
          {selectedSubject === 'Chemistry' && (
            <motion.div
              layoutId="wbjee_active_subject_glow"
              className="absolute inset-0 rounded-2xl pointer-events-none ring-2 ring-emerald-500/50 dark:ring-emerald-400/50"
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            />
          )}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold">
              Paper II
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              <FlaskConical className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-base font-extrabold text-stone-900 dark:text-white tracking-tight">
            Chemistry
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {stats.chem} Questions
            </span>
            <span className="w-1 h-1 rounded-full bg-emerald-300 dark:bg-emerald-700" />
            <span className="text-[11px] text-stone-400 font-medium">50 Marks</span>
          </div>
        </motion.button>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. Sub-Section: Chapter Filter & Category Segmented Slider */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white/90 dark:bg-stone-900/75 backdrop-blur-md space-y-3.5 shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Glassmorphic Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search equations, formulas, topics, chapters or keywords..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl text-xs sm:text-sm border border-stone-200/90 dark:border-stone-800 bg-stone-50/80 dark:bg-[#0c1322] text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear Search"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sliding Category Segmented Control with layoutId */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 shrink-0">
              Category:
            </span>
            <div className="relative p-1 rounded-xl bg-stone-100/90 dark:bg-[#0c1322] border border-stone-200/80 dark:border-white/10 flex items-center gap-1 shrink-0">
              {[
                { id: 'all' as const, label: 'All' },
                { id: 1 as const, label: 'Cat 1 (1M, -0.25)' },
                { id: 2 as const, label: 'Cat 2 (2M, -0.5)' },
                { id: 3 as const, label: 'Cat 3 (2M, Multi)' },
              ].map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      'relative px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer z-10',
                      isSelected
                        ? 'text-stone-900 dark:text-white'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="wbjee_active_category_pill"
                        className="absolute inset-0 rounded-lg bg-white dark:bg-[#1E293B] shadow-sm border border-stone-200/90 dark:border-white/10"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{cat.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chapter Sub-Section Sliding Pills */}
        {availableChapters.length > 0 && (
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80">
            <div className="relative flex items-center">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pr-8 w-full">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 shrink-0 mr-1 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Chapters:
                </span>

                {/* All Chapters Pill */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedChapter('all')}
                  className={cn(
                    'relative px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer z-10',
                    selectedChapter === 'all'
                      ? 'text-brand-700 dark:text-brand-300 font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  )}
                >
                  {selectedChapter === 'all' && (
                    <motion.div
                      layoutId="wbjee_active_chapter_pill"
                      className="absolute inset-0 rounded-lg bg-brand-100 dark:bg-brand-950/70 border border-brand-300/50 dark:border-brand-700/50"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">All Chapters</span>
                </motion.button>

                {/* Individual Chapters */}
                {availableChapters.map((chap) => {
                  const isSelected = selectedChapter === chap;
                  return (
                    <motion.button
                      key={chap}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSelectedChapter(chap)}
                      className={cn(
                        'relative px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer z-10',
                        isSelected
                          ? 'text-white font-bold'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                      )}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="wbjee_active_chapter_pill"
                          className="absolute inset-0 rounded-lg bg-brand-600 shadow-sm"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">{chap}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Smooth Right edge fade mask */}
              <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-10 bg-gradient-to-l from-white dark:from-stone-900 to-transparent" />
            </div>
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6. Active Topic Header with Single Battle Button */}
      {/* ──────────────────────────────────────────────────────────── */}
      {selectedChapter !== 'all' && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm',
            currentSubjectMeta ? currentSubjectMeta.lightBg : 'bg-stone-50 dark:bg-stone-900/60',
            currentSubjectMeta ? currentSubjectMeta.border : 'border-stone-200 dark:border-stone-800'
          )}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Selected Topic / Chapter
            </span>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white mt-0.5">
              {selectedChapter}
            </h2>
            <p className="text-xs text-stone-500">
              {filteredQuestions.length} WBJEE questions found for this topic
            </p>
          </div>

          <button
            onClick={() => handleStartChapterBattle(selectedChapter)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-black dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200 shadow-sm transition-all cursor-pointer self-stretch sm:self-auto justify-center"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Battle This Topic</span>
          </button>
        </motion.div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 7. Questions List with KaTeX Math and Interactive Checking */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-stone-500 px-1">
          <span>
            Showing <strong className="text-stone-900 dark:text-white">{filteredQuestions.length}</strong>{' '}
            questions
          </span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> Math
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-violet-500" /> Phys
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Chem
            </span>
          </div>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-stone-200 dark:border-stone-800 rounded-3xl bg-white/40 dark:bg-stone-900/40">
            <Layers className="w-8 h-8 mx-auto text-stone-400 mb-2" />
            <p className="text-base font-bold text-stone-900 dark:text-white">
              No questions found
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Try adjusting your year, subject, category, or search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedYear('all');
                setSelectedSubject('all');
                setSelectedCategory('all');
                setSelectedChapter('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const userChoice = userAnswers[q.id] || [];
            const isRevealed = revealedSolutions[q.id] || false;

            const subjectPillColors: Record<string, string> = {
              Mathematics:
                'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/40',
              Physics:
                'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40',
              Chemistry:
                'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40',
            };

            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.02, 0.25) }}
                className="p-6 sm:p-7 rounded-3xl border-2 border-stone-200 dark:border-[#243556] bg-white dark:bg-[#111A2E] hover:border-purple-300 dark:hover:border-purple-500/70 shadow-xs dark:shadow-md transition-all space-y-5"
              >
                {/* ── Header Identity Tab (JEE Main Layout Match) ── */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Q Number Badge */}
                    <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-purple-600 text-white font-extrabold text-sm shadow-xs">
                      <span>Q{q.question_number}</span>
                    </div>

                    {/* Subject Badge */}
                    <span
                      className={cn(
                        'text-xs font-bold px-3 py-1 rounded-xl border',
                        subjectPillColors[q.subject] ||
                          'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      )}
                    >
                      {q.subject}
                    </span>

                    {/* Category / Section Badge */}
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-stone-100 text-stone-800 dark:bg-[#1E2D4A] dark:text-stone-200 border border-stone-200 dark:border-[#2D436D]">
                      {q.section}
                    </span>

                    {/* Question Type Badge */}
                    <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-stone-100 text-stone-700 dark:bg-[#1E2D4A] dark:text-stone-300 border border-stone-200 dark:border-[#2D436D]">
                      {q.category === 3 ? 'Multi-Correct' : 'MCQ'}
                    </span>

                    {/* Marking Scheme Badge */}
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
                      +{q.marks} {q.negative_marks > 0 ? `| −${q.negative_marks}` : '| No Negative'}
                    </span>
                  </div>

                  {/* Year & Paper Tag */}
                  <div className="text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-100/90 dark:bg-[#18233C] px-3.5 py-1 rounded-xl border border-stone-200/80 dark:border-[#293B60]">
                    WBJEE {q.year} • {q.subject === 'Mathematics' ? 'Paper I' : 'Paper II'}
                  </div>
                </div>

                {/* ── Question Statement (Recessed Box as in Photo 1) ── */}
                <div className="p-5 sm:p-6 rounded-2xl bg-stone-50/90 dark:bg-[#16233B] border border-stone-200/90 dark:border-[#283C64]">
                  <MathText
                    text={q.question_statement}
                    block
                    className="text-base sm:text-lg md:text-xl text-stone-900 dark:text-white leading-relaxed font-medium"
                  />
                </div>

                {/* Diagram figure (if present) */}
                {q.diagram_url && (
                  <div className="p-3.5 rounded-2xl border-2 border-stone-200 dark:border-[#283C64] bg-white dark:bg-[#16233B] max-w-md shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={q.diagram_url}
                      alt={`Diagram for Q${q.question_number}`}
                      className="max-w-full rounded-xl"
                    />
                  </div>
                )}

                {/* ── MCQ Options as Interactive Tabs (Matching Photo 1) ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {q.options.map((opt) => {
                    const isSelected = userChoice.includes(opt.id);
                    const showFeedback = isRevealed || userChoice.length > 0;
                    const isCorrect = opt.is_correct;

                    let cardBorderBg =
                      'border-stone-200/90 dark:border-[#2A3F68] bg-white dark:bg-[#18253E] hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50/30 dark:hover:bg-[#1F3050] text-stone-900 dark:text-white';
                    let badgeStyle =
                      'bg-purple-100 text-purple-900 dark:bg-purple-900/80 dark:text-purple-100 border-purple-200 dark:border-purple-600';

                    if (showFeedback && isCorrect) {
                      cardBorderBg =
                        'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20';
                      badgeStyle =
                        'bg-emerald-600 text-white border-emerald-500 shadow-sm';
                    } else if (showFeedback && isSelected && !isCorrect) {
                      cardBorderBg =
                        'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/20';
                      badgeStyle =
                        'bg-rose-600 text-white border-rose-500 shadow-sm';
                    } else if (isSelected) {
                      cardBorderBg =
                        'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 text-purple-900 dark:text-purple-100 ring-2 ring-purple-500/20';
                      badgeStyle =
                        'bg-purple-600 text-white border-purple-500 shadow-sm';
                    }

                    return (
                      <div
                        key={`${q.id}-opt-${opt.id}`}
                        onClick={() => handleSelectOption(q, opt.id)}
                        className={cn(
                          'flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer group shadow-xs',
                          cardBorderBg
                        )}
                      >
                        {/* Option Letter / Index Square Badge */}
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl font-extrabold text-base flex items-center justify-center shrink-0 border shadow-2xs group-hover:scale-105 transition-transform',
                            badgeStyle
                          )}
                        >
                          {showFeedback && isCorrect ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : showFeedback && isSelected && !isCorrect ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            opt.id
                          )}
                        </div>

                        {/* Option Text with crisp KaTeX */}
                        <div className="flex-1 min-w-0">
                          <MathText
                            text={opt.text}
                            className="text-base sm:text-lg font-medium text-stone-900 dark:text-white leading-relaxed"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── Card Footer: Metadata + Solution (NO Solve in Battle button) ── */}
                <div className="pt-3 border-t border-stone-200 dark:border-[#243556] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-[#18233C] px-3.5 py-1.5 rounded-lg border border-stone-200/60 dark:border-[#293B60] truncate max-w-md">
                    WBJEE {q.year} • {q.subject} • {q.chapter}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSolution(q.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-[#18233C] hover:bg-stone-200 dark:hover:bg-[#202e4d] border border-stone-200/60 dark:border-[#293B60] transition-colors cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
                      <span>{isRevealed ? 'Hide Solution' : 'View Full Solution'}</span>
                      {isRevealed ? (
                        <ChevronUp className="w-3 h-3 text-stone-400" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-stone-400" />
                      )}
                    </button>

                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                      Correct: ({q.correct_option})
                    </span>
                  </div>
                </div>

                {/* ── Expanded Detailed Derivation & Solution Drawer ── */}
                <AnimatePresence>
                  {isRevealed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3 pt-4 border-t border-stone-200 dark:border-[#243556]"
                    >
                      <div className="p-5 rounded-2xl bg-stone-50/90 dark:bg-[#16233B] border border-stone-200/90 dark:border-[#283C64] space-y-2">
                        <div className="flex items-center gap-2 font-bold text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                          <Sparkles className="w-4 h-4" />
                          <span>Official Step-by-Step Solution & Derivation</span>
                        </div>
                        <div className="pt-1 text-sm sm:text-base leading-relaxed text-stone-800 dark:text-stone-200">
                          <MathText text={q.explanation} block />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

