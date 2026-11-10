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
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Atom,
  FlaskConical,
  Sprout,
  Dna,
  X,
  Sparkles,
  RotateCcw,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MathText } from '@/components/pyq/MathText';
import {
  NEET_QUESTIONS_DATA,
  NEET_YEARS,
  NEET_SUBJECTS,
  NeetQuestion,
  NeetYear,
  getNeetStats,
} from '@/data/neet/neetQuestionsData';

interface NeetPyqExplorerProps {
  onBack?: () => void;
}

type ActiveSubject = 'all' | 'Physics' | 'Chemistry' | 'Botany' | 'Zoology';
type ActiveSection = 'all' | 'Section A' | 'Section B';

export default function NeetPyqExplorer({ onBack }: NeetPyqExplorerProps) {
  const router = useRouter();

  // Filters state
  const [selectedYear, setSelectedYear] = useState<NeetYear | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<ActiveSubject>('all');
  const [selectedSection, setSelectedSection] = useState<ActiveSection>('all');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  // Stats
  const stats = useMemo(() => getNeetStats(), []);

  // Filtered Questions Pipeline
  const filteredQuestions = useMemo(() => {
    return NEET_QUESTIONS_DATA.filter((q) => {
      // Year Filter
      if (selectedYear !== 'all' && q.year !== selectedYear) return false;

      // Subject Filter
      if (selectedSubject !== 'all' && q.subject !== selectedSubject) return false;

      // Section Filter
      if (selectedSection !== 'all' && q.section !== selectedSection) return false;

      // Chapter Filter
      if (selectedChapter !== 'all' && q.chapter !== selectedChapter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesStatement = q.question_statement.toLowerCase().includes(query);
        const matchesChapter = q.chapter.toLowerCase().includes(query);
        const matchesSubject = q.subject.toLowerCase().includes(query);
        const matchesOptions = q.options.some((opt) =>
          opt.text.toLowerCase().includes(query)
        );
        if (!matchesStatement && !matchesChapter && !matchesSubject && !matchesOptions) {
          return false;
        }
      }

      return true;
    });
  }, [selectedYear, selectedSubject, selectedSection, selectedChapter, searchQuery]);

  // Available Chapters
  const availableChapters = useMemo(() => {
    const questions =
      selectedSubject === 'all'
        ? NEET_QUESTIONS_DATA
        : NEET_QUESTIONS_DATA.filter((q) => q.subject === selectedSubject);
    const set = new Set<string>();
    questions.forEach((q) => set.add(q.chapter));
    return Array.from(set).sort();
  }, [selectedSubject]);

  // Subject Configuration Helper
  const currentSubjectMeta = useMemo(() => {
    return NEET_SUBJECTS.find((s) => s.key === selectedSubject);
  }, [selectedSubject]);

  // User answer click
  const handleSelectOption = (questionId: string, optId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optId,
    }));
  };

  // Reset answer
  const handleResetAnswer = (questionId: string) => {
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  // Toggle explanation
  const toggleSolution = (qId: string) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // Battle Handlers
  const handleStartSubjectBattle = (subjectName?: string) => {
    const sub = subjectName || (selectedSubject === 'all' ? 'biology' : selectedSubject.toLowerCase());
    router.push(`/practice?exam=NEET&subject=${encodeURIComponent(sub)}`);
  };

  const handleStartChapterBattle = (chapterName: string) => {
    const sub = selectedSubject === 'all' ? 'biology' : selectedSubject.toLowerCase();
    router.push(
      `/practice?exam=NEET&subject=${encodeURIComponent(sub)}&chapter=${encodeURIComponent(chapterName)}`
    );
  };

  // Helper to split [Diagram: ...] out of question statements
  const parseStatementAndDiagram = (raw: string) => {
    const diagramMatch = raw.match(/\[Diagram:\s*([\s\S]+?)\]/i);
    if (diagramMatch) {
      const diagramText = diagramMatch[1].trim();
      const cleanStatement = raw.replace(/\[Diagram:\s*[\s\S]+?\]/i, '').trim();
      return { cleanStatement, diagramText };
    }
    return { cleanStatement: raw, diagramText: null };
  };

  // Subject colors map for consistent styling
  const subjectColorStyles: Record<string, { badge: string; optionKey: string; buttonBg: string }> = {
    Physics: {
      badge: 'bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 border-sky-300 dark:border-sky-800',
      optionKey: 'bg-sky-100 text-sky-900 dark:bg-sky-900/80 dark:text-sky-100 dark:border-sky-700',
      buttonBg: 'bg-sky-600 hover:bg-sky-700 text-white',
    },
    Chemistry: {
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      optionKey: 'bg-amber-100 text-amber-900 dark:bg-amber-900/80 dark:text-amber-100 dark:border-amber-700',
      buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    Botany: {
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      optionKey: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/80 dark:text-emerald-100 dark:border-emerald-700',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    Zoology: {
      badge: 'bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300 border-violet-300 dark:border-violet-800',
      optionKey: 'bg-violet-100 text-violet-900 dark:bg-violet-900/80 dark:text-violet-100 dark:border-violet-700',
      buttonBg: 'bg-violet-600 hover:bg-violet-700 text-white',
    },
  };

  return (
    <div className="space-y-6 pb-16">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. Header & Navigation Breadcrumb */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
              aria-label="Back to PYQ Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Official NTA Archive
              </span>
              <span className="inline-block w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700" />
              <span className="text-xs text-stone-500 font-medium">NEET UG 2019–2024 Archive</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mt-0.5">
              NEET UG PYQ Explorer
            </h1>
          </div>
        </div>

        {/* Global Subject Battle Button in Header */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => handleStartSubjectBattle()}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-all cursor-pointer',
              currentSubjectMeta
                ? currentSubjectMeta.buttonBg
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
            )}
          >
            <Swords className="w-4 h-4" />
            <span>
              {selectedSubject === 'all'
                ? 'Battle Full NEET PCB'
                : `Battle ${selectedSubject}`}
            </span>
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. Top Stats Overview Strip */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Questions */}
        <div className="p-4 rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white/80 dark:bg-stone-900/60 backdrop-blur-md shadow-xs">
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
          <p className="text-[11px] text-stone-400 font-medium mt-0.5">720 Marks Standard</p>
        </div>

        {/* Physics */}
        <div className="p-4 rounded-2xl border border-sky-200/80 dark:border-sky-900/50 bg-gradient-to-br from-sky-50/50 to-white dark:from-sky-950/25 dark:to-stone-900/60 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider">
              Physics
            </span>
            <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300">
              <Atom className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-sky-950 dark:text-sky-200 mt-1.5 tracking-tight">
            {stats.phys}
          </p>
          <p className="text-[11px] text-sky-600/80 dark:text-sky-400/80 font-medium mt-0.5">
            180 Marks (50 Qs)
          </p>
        </div>

        {/* Chemistry */}
        <div className="p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-950/25 dark:to-stone-900/60 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              Chemistry
            </span>
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
              <FlaskConical className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-950 dark:text-amber-200 mt-1.5 tracking-tight">
            {stats.chem}
          </p>
          <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 font-medium mt-0.5">
            180 Marks (50 Qs)
          </p>
        </div>

        {/* Botany */}
        <div className="p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/25 dark:to-stone-900/60 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
              Botany
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
              <Sprout className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-950 dark:text-emerald-200 mt-1.5 tracking-tight">
            {stats.bot}
          </p>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium mt-0.5">
            180 Marks (50 Qs)
          </p>
        </div>

        {/* Zoology */}
        <div className="p-4 rounded-2xl border border-violet-200/80 dark:border-violet-900/50 bg-gradient-to-br from-violet-50/50 to-white dark:from-violet-950/25 dark:to-stone-900/60 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider">
              Zoology
            </span>
            <div className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300">
              <Dna className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-violet-950 dark:text-violet-200 mt-1.5 tracking-tight">
            {stats.zoo}
          </p>
          <p className="text-[11px] text-violet-600/80 dark:text-violet-400/80 font-medium mt-0.5">
            180 Marks (50 Qs)
          </p>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. Examination Year Selector (Clean & Rock-Solid Pills) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white/90 dark:bg-stone-900/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
              Select Examination Year
            </span>
          </div>

          <span className="text-xs font-semibold text-stone-400">
            {selectedYear === 'all' ? 'All Archive Years' : `NEET ${selectedYear}`}
          </span>
        </div>

        {/* Year Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* All Years Pill */}
          <button
            onClick={() => setSelectedYear('all')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5',
              selectedYear === 'all'
                ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            )}
          >
            <span>All Years</span>
            <span className={cn(
              'px-1.5 py-0.2 rounded-md text-[10px] font-mono',
              selectedYear === 'all'
                ? 'bg-white/20 dark:bg-stone-900/20 text-white dark:text-stone-900'
                : 'bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400'
            )}>
              {NEET_QUESTIONS_DATA.length}
            </span>
          </button>

          {/* Individual Year Pills */}
          {NEET_YEARS.map((yr) => {
            const count = NEET_QUESTIONS_DATA.filter((q) => q.year === yr).length;
            const isSelected = selectedYear === yr;
            return (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5',
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                )}
              >
                <span>{yr}</span>
                <span className={cn(
                  'px-1.5 py-0.2 rounded-md text-[10px] font-mono',
                  isSelected
                    ? 'bg-white/25 text-white'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400'
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. Subject Tabs Bar (Sleek JEE Main Styled SubjectTabBar) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="p-1.5 rounded-2xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {[
          { key: 'all' as const, label: 'All PCB', count: stats.total, color: 'bg-stone-900 dark:bg-white text-white dark:text-stone-900' },
          { key: 'Physics' as const, label: 'Physics', count: stats.phys, color: 'bg-sky-600 text-white' },
          { key: 'Chemistry' as const, label: 'Chemistry', count: stats.chem, color: 'bg-amber-600 text-white' },
          { key: 'Botany' as const, label: 'Botany', count: stats.bot, color: 'bg-emerald-600 text-white' },
          { key: 'Zoology' as const, label: 'Zoology', count: stats.zoo, color: 'bg-violet-600 text-white' },
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
                  ? tab.color + ' shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-200/80 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. Filter Controls: Search & Section & Chapter Pills */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search equations, topics, chapters, or questions..."
              className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/60 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Section Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 shrink-0 mr-1">
              Section:
            </span>
            {[
              { id: 'all' as const, label: 'All Sections' },
              { id: 'Section A' as const, label: 'Section A (Compulsory 35 Qs)' },
              { id: 'Section B' as const, label: 'Section B (Optional 15 Qs)' },
            ].map((sec) => {
              const isSelected = selectedSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSection(sec.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
                    isSelected
                      ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  )}
                >
                  {sec.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chapter Sub-Section Sliding Pills */}
        {availableChapters.length > 0 && (
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 shrink-0 mr-1 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Chapters:
              </span>

              {/* All Chapters Pill */}
              <button
                onClick={() => setSelectedChapter('all')}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer',
                  selectedChapter === 'all'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                )}
              >
                All Chapters
              </button>

              {/* Individual Chapters */}
              {availableChapters.map((chap) => {
                const isSelected = selectedChapter === chap;
                return (
                  <button
                    key={chap}
                    onClick={() => setSelectedChapter(chap)}
                    className={cn(
                      'px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer',
                      isSelected
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    )}
                  >
                    {chap}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6. Active Topic Header with Single Battle Button */}
      {/* ──────────────────────────────────────────────────────────── */}
      {selectedChapter !== 'all' && (
        <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Selected Topic / Chapter
            </span>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white mt-0.5">
              {selectedChapter}
            </h2>
            <p className="text-xs text-stone-500">
              {filteredQuestions.length} NEET questions found for this topic
            </p>
          </div>

          <button
            onClick={() => handleStartChapterBattle(selectedChapter)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-black dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200 shadow-xs transition-all cursor-pointer self-stretch sm:self-auto justify-center"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Battle This Topic</span>
          </button>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 7. Questions List with KaTeX Math & Interactive Checking */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-stone-500 px-1">
          <span>
            Showing <strong className="text-stone-900 dark:text-white">{filteredQuestions.length}</strong>{' '}
            questions
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Correct (+4)
            </span>
            <span className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Wrong (-1)
            </span>
          </div>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60">
            <HelpCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
              No NEET questions found
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Try adjusting your search query, selecting another year, or resetting the chapter filter.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const userAnswer = userAnswers[q.id];
            const hasAnswered = !!userAnswer;
            const isRevealed = revealedSolutions[q.id];
            const isUserCorrect = userAnswer === q.correct_option;
            const subStyle = subjectColorStyles[q.subject] || subjectColorStyles.Physics;
            const { cleanStatement, diagramText } = parseStatementAndDiagram(q.question_statement);

            return (
              <div
                key={q.id}
                className="p-6 sm:p-7 rounded-3xl border-2 border-stone-200 dark:border-[#243556] bg-white dark:bg-[#111A2E] hover:border-purple-300 dark:hover:border-purple-500/70 shadow-xs dark:shadow-md transition-all space-y-5"
              >
                {/* Header Identity Row (Matching JEE Main Exactly) */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Q Number Badge */}
                    <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-purple-600 text-white font-extrabold text-sm shadow-xs">
                      <span>Q{q.question_number}</span>
                    </div>

                    {/* Subject Pill */}
                    <span className={cn('text-xs font-bold px-3 py-1 rounded-xl border', subStyle.badge)}>
                      {q.subject}
                    </span>

                    {/* Section Pill */}
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-stone-100 text-stone-800 dark:bg-[#1E2D4A] dark:text-stone-200 border border-stone-200 dark:border-[#2D436D]">
                      {q.section}
                    </span>

                    {/* Question Type Pill */}
                    <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-stone-100 text-stone-700 dark:bg-[#1E2D4A] dark:text-stone-300 border border-stone-200 dark:border-[#2D436D]">
                      MCQ
                    </span>
                  </div>

                  {/* Year & Marks Badges */}
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-100/90 dark:bg-[#18233C] px-3 py-1 rounded-xl border border-stone-200/80 dark:border-[#293B60]">
                      NEET {q.year} • {q.chapter}
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-[#1E2D4A] text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-[#2D436D]">
                      +4 | -1
                    </span>
                  </div>
                </div>

                {/* Question Statement Box (High-Contrast Navy Container) */}
                <div className="p-5 sm:p-6 rounded-2xl bg-stone-50/90 dark:bg-[#16233B] border border-stone-200/90 dark:border-[#283C64]">
                  <MathText
                    text={cleanStatement}
                    block
                    className="text-base sm:text-lg md:text-xl text-stone-900 dark:text-white leading-relaxed font-medium"
                  />
                </div>

                {/* Diagram / Schematic Reference Box (if present) */}
                {diagramText && (
                  <div className="p-4 rounded-2xl border-2 border-dashed border-stone-300 dark:border-[#283C64] bg-stone-50/80 dark:bg-[#141F35] flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 shrink-0">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed font-medium">
                      <span className="font-bold text-stone-900 dark:text-white block mb-0.5">
                        Figure / Schematic Description:
                      </span>
                      <MathText text={diagramText} />
                    </div>
                  </div>
                )}

                {/* Options 2x2 Interactive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {q.options.map((opt) => {
                    const isSelected = userAnswer === opt.id;
                    const isCorrect = opt.id === q.correct_option;

                    // Base state
                    let containerClass =
                      'border-stone-200/90 dark:border-[#2A3F68] bg-white dark:bg-[#18253E] hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50/20 dark:hover:bg-[#1F3050] text-stone-900 dark:text-white';
                    let badgeClass =
                      'bg-purple-100 text-purple-900 dark:bg-purple-900/80 dark:text-purple-100 dark:border dark:border-purple-600';

                    // Feedback state when user has answered OR clicked to view solution
                    const showAnswerFeedback = hasAnswered || isRevealed;

                    if (showAnswerFeedback) {
                      if (isCorrect) {
                        // The exact correct solution turns vibrant green
                        containerClass =
                          'border-emerald-500 bg-emerald-500/15 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/50 shadow-sm';
                        badgeClass = 'bg-emerald-600 text-white border-emerald-400 font-black shadow-xs';
                      } else if (isSelected && !isCorrect) {
                        // If user clicked this wrong option
                        containerClass =
                          'border-rose-500 bg-rose-500/15 dark:bg-rose-950/50 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/50 shadow-sm';
                        badgeClass = 'bg-rose-600 text-white border-rose-400 font-black shadow-xs';
                      } else {
                        // Other non-correct options are gently dimmed
                        containerClass =
                          'opacity-60 border-stone-200 dark:border-[#243556] bg-stone-50 dark:bg-[#152138] text-stone-600 dark:text-stone-400';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={cn(
                          'w-full text-left flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 shadow-xs transition-all cursor-pointer group',
                          containerClass
                        )}
                      >
                        {/* Option Key Badge */}
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl font-extrabold text-base flex items-center justify-center shrink-0 border shadow-2xs group-hover:scale-105 transition-transform',
                            badgeClass
                          )}
                        >
                          {opt.id}
                        </div>

                        {/* Option Text with KaTeX */}
                        <div className="flex-1 min-w-0">
                          <MathText
                            text={opt.text}
                            className="text-base sm:text-lg font-medium text-stone-900 dark:text-white leading-relaxed"
                          />
                        </div>

                        {/* Feedback Checkmark / Cross Icon */}
                        {showAnswerFeedback && (
                          <div className="shrink-0">
                            {isCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            )}
                            {isSelected && !isCorrect && (
                              <XCircle className="w-5 h-5 text-rose-500" />
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Answer Feedback Banner (shows immediately on answer click) */}
                {hasAnswered && (
                  <div
                    className={cn(
                      'p-3.5 rounded-xl border flex items-center justify-between gap-3 flex-wrap',
                      isUserCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                    )}
                  >
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
                      {isUserCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Correct! +4 Marks</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          <span>Incorrect (-1 Mark). The correct answer is Option ({q.correct_option}).</span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => handleResetAnswer(q.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Try Again</span>
                    </button>
                  </div>
                )}

                {/* Footer Controls: Solution Toggle */}
                <div className="pt-2 border-t border-stone-200 dark:border-[#243556] flex items-center justify-between flex-wrap gap-2">
                  <button
                    onClick={() => toggleSolution(q.id)}
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>{isRevealed ? 'Hide NCERT Solution' : 'View Full Solution'}</span>
                    {isRevealed ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Official Key:</span>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300/50 dark:border-emerald-700/50">
                      Option ({q.correct_option})
                    </span>
                  </div>
                </div>

                {/* Solution Drawer with KaTeX Math */}
                <AnimatePresence>
                  {isRevealed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 rounded-2xl bg-stone-50 dark:bg-[#16233B] border border-stone-200/90 dark:border-[#283C64] space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          <Sparkles className="w-4 h-4" />
                          <span>Detailed NCERT-Aligned Explanation</span>
                        </div>
                        <div className="text-sm sm:text-base leading-relaxed text-stone-800 dark:text-stone-200 font-normal">
                          <MathText text={q.explanation} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
