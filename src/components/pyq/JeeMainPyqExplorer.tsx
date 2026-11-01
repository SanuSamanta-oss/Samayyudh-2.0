'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Filter, ChevronLeft, ChevronRight,
  AlertCircle, RefreshCw, Calendar, Layers, FileText,
  ArrowLeft, X, Upload, Check, Image as ImageIcon, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PyqExamPaper, PyqQuestion, PyqStats, PyqSubject, PyqSection, PyqQuestionType } from '@/lib/pyq/types';
import { MathText } from '@/components/pyq/MathText';

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

type ActiveTab = 'all' | 'Physics' | 'Chemistry' | 'Mathematics';
type BrowseView = 'overview' | 'questions';

// ──────────────────────────────────────────────────────────────
// SubjectTabBar
// ──────────────────────────────────────────────────────────────

function SubjectTabBar({
  active,
  onChange,
  stats,
}: {
  active: ActiveTab;
  onChange: (t: ActiveTab) => void;
  stats: PyqStats | null;
}) {
  const tabs: { key: ActiveTab; label: string; count: number }[] = [
    { key: 'all', label: 'All Questions', count: stats?.totalQuestions ?? 0 },
    { key: 'Physics', label: 'Physics', count: stats?.physicsCount ?? 0 },
    { key: 'Chemistry', label: 'Chemistry', count: stats?.chemistryCount ?? 0 },
    { key: 'Mathematics', label: 'Mathematics', count: stats?.mathematicsCount ?? 0 },
  ];

  return (
    <div className="p-1.5 rounded-2xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex-1 justify-center',
              isActive
                ? 'text-white'
                : 'text-stone-700 dark:text-stone-300 hover:text-foreground hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="pyqActiveSubjectTab"
                className="absolute inset-0 rounded-xl bg-brand-600 dark:bg-brand-500 shadow-md"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={cn(
                  'relative z-10 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-200/80 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// StatsBar
// ──────────────────────────────────────────────────────────────

function StatsBar({ stats }: { stats: PyqStats }) {
  const items = [
    { label: 'Total Questions', value: stats.totalQuestions },
    { label: 'Papers Imported', value: stats.totalPapers },
    { label: 'Physics', value: stats.physicsCount },
    { label: 'Chemistry', value: stats.chemistryCount },
    { label: 'Mathematics', value: stats.mathematicsCount },
    { label: 'Dates Available', value: stats.availableDates.length },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="p-3 rounded-xl border border-border bg-card text-center"
        >
          <p className="text-lg sm:text-xl font-black text-foreground">{item.value}</p>
          <p className="text-[11px] text-stone-500 mt-0.5 leading-tight">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// PaperDateCard
// ──────────────────────────────────────────────────────────────

function PaperDateCard({
  paper,
  onBrowse,
}: {
  paper: PyqExamPaper;
  onBrowse: (paper: PyqExamPaper) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl border border-border bg-card hover:shadow-md hover:border-brand-200 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
              {paper.shift}
            </span>
            {paper.session && (
              <span className="text-xs text-stone-500">{paper.session}</span>
            )}
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50 font-medium">
              {paper.source_classification}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-foreground mt-1.5">{paper.exam_date_str}</h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
            <span>Physics: {paper.physics_count}</span>
            <span>Chemistry: {paper.chemistry_count}</span>
            <span>Mathematics: {paper.mathematics_count}</span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Total: {paper.total_questions} questions
          </p>
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <button
            onClick={() => onBrowse(paper)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors cursor-pointer text-center"
          >
            Browse
          </button>
          <button
            onClick={() => {
              const params = new URLSearchParams({
                exam: 'JEE_MAINS',
                source: 'pyq',
                date: paper.exam_date_str,
                shift: paper.shift,
                mode: 'half_century',
                questions: '50',
                duration: '5400',
              });
              window.location.href = `/exam/session?${params.toString()}`;
            }}
            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors cursor-pointer"
          >
            <Zap className="w-3 h-3" />
            <span>Battle</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────
// QuestionCard
// ──────────────────────────────────────────────────────────────

function QuestionCard({ q, index }: { q: PyqQuestion; index: number }) {
  const [showDiagram, setShowDiagram] = useState(false);
  const subjectColors: Record<string, string> = {
    Physics: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40',
    Chemistry: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40',
    Mathematics: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className="p-6 sm:p-7 rounded-3xl border-2 border-stone-200 dark:border-[#243556] bg-white dark:bg-[#111A2E] hover:border-purple-300 dark:hover:border-purple-500/70 shadow-xs dark:shadow-md transition-all space-y-5"
    >
      {/* Header Identity Tab */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-purple-600 text-white font-extrabold text-sm shadow-xs">
            <span>Q{q.question_number}</span>
          </div>
          <span className={cn('text-xs font-bold px-3 py-1 rounded-xl border', subjectColors[q.subject])}>
            {q.subject}
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-stone-100 text-stone-800 dark:bg-[#1E2D4A] dark:text-stone-200 border border-stone-200 dark:border-[#2D436D]">
            {q.section}
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-stone-100 text-stone-700 dark:bg-[#1E2D4A] dark:text-stone-300 border border-stone-200 dark:border-[#2D436D]">
            {q.question_type}
          </span>
        </div>
        <div className="text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-100/90 dark:bg-[#18233C] px-3 py-1 rounded-xl border border-stone-200/80 dark:border-[#293B60]">
          {q.exam_date_str} • {q.shift}
        </div>
      </div>

      {/* Question statement — Enhanced Size & High-Contrast Typography */}
      <div className="p-5 sm:p-6 rounded-2xl bg-stone-50/90 dark:bg-[#16233B] border border-stone-200/90 dark:border-[#283C64]">
        <MathText
          text={q.question_statement}
          block
          className="text-base sm:text-lg md:text-xl text-stone-900 dark:text-white leading-relaxed font-medium"
        />
      </div>

      {/* Diagram figure toggle */}
      {q.diagram_url && (
        <div>
          <button
            onClick={() => setShowDiagram((s) => !s)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            <span>{showDiagram ? 'Hide Figure' : 'Show Figure'}</span>
          </button>
          {showDiagram && (
            <div className="mt-3 p-3.5 rounded-2xl border-2 border-stone-200 dark:border-[#283C64] bg-white dark:bg-[#16233B] max-w-md shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={q.diagram_url}
                alt={`Diagram for Q${q.question_number}`}
                className="max-w-full rounded-xl"
              />
            </div>
          )}
        </div>
      )}

      {/* MCQ Options as Interactive Tabs */}
      {q.question_type === 'MCQ' && q.options && q.options.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {q.options.map((opt) => (
            <div
              key={opt.key}
              className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 border-stone-200/90 dark:border-[#2A3F68] bg-white dark:bg-[#18253E] hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50/30 dark:hover:bg-[#1F3050] text-stone-900 dark:text-white shadow-xs transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 dark:bg-purple-900/80 dark:text-purple-100 dark:border dark:border-purple-600 font-extrabold text-base flex items-center justify-center shrink-0 border border-purple-200 shadow-2xs group-hover:scale-105 transition-transform">
                {opt.key}
              </div>
              <div className="flex-1 min-w-0">
                <MathText
                  text={opt.text}
                  className="text-base sm:text-lg font-medium text-stone-900 dark:text-white leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {q.question_type === 'Numerical Value' && (
        <div className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-stone-300 dark:border-[#2A3F68] bg-stone-50/70 dark:bg-[#18253E]/60">
          <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">
            Numerical Value Type — Enter the exact integer or decimal value
          </p>
        </div>
      )}

      {/* Review flag */}
      {q.review_required && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{q.review_reason || 'Question flagged for manual review'}</span>
        </div>
      )}

      {/* Action Footer: Solve in Battle */}
      <div className="pt-3 border-t border-stone-200 dark:border-[#243556] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs font-semibold text-stone-500 dark:text-stone-300 bg-stone-100 dark:bg-[#18233C] px-3 py-1.5 rounded-lg border border-stone-200/60 dark:border-[#293B60] truncate max-w-md">
          {q.source_reference}
        </span>
        <button
          onClick={() => {
            const params = new URLSearchParams({
              exam: 'JEE_MAINS',
              source: 'pyq',
              subject: q.subject,
              shift: q.shift,
              date: q.exam_date_str,
              mode: 'quick_battle',
              questions: '10',
            });
            window.location.href = `/exam/session?${params.toString()}`;
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-brand hover:opacity-95 shadow-sm hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>Solve in Battle</span>
        </button>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────
// Filters Panel
// ──────────────────────────────────────────────────────────────

function FiltersPanel({
  dates, shifts, subject,
  selectedDate, setSelectedDate,
  selectedShift, setSelectedShift,
  selectedSection, setSelectedSection,
  selectedType, setSelectedType,
  searchQuery, setSearchQuery,
}: {
  dates: string[];
  shifts: string[];
  subject: ActiveTab;
  selectedDate: string;
  setSelectedDate: (v: string) => void;
  selectedShift: string;
  setSelectedShift: (v: string) => void;
  selectedSection: string;
  setSelectedSection: (v: string) => void;
  selectedType: string;
  setSelectedType: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions..."
          className="w-full pl-8 pr-3 py-2 rounded-xl border border-border bg-card text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      </div>

      {/* Date filter */}
      <select
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="px-3 py-2 rounded-xl border border-border bg-card text-xs text-stone-600 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer"
      >
        <option value="All">All Dates</option>
        {dates.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {/* Shift filter */}
      <select
        value={selectedShift}
        onChange={(e) => setSelectedShift(e.target.value)}
        className="px-3 py-2 rounded-xl border border-border bg-card text-xs text-stone-600 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer"
      >
        <option value="All">All Shifts</option>
        {shifts.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Section filter */}
      <select
        value={selectedSection}
        onChange={(e) => setSelectedSection(e.target.value)}
        className="px-3 py-2 rounded-xl border border-border bg-card text-xs text-stone-600 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer"
      >
        <option value="All">All Sections</option>
        <option value="Section A">Section A (MCQ)</option>
        <option value="Section B">Section B (Numerical)</option>
      </select>

      {/* Type filter */}
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="px-3 py-2 rounded-xl border border-border bg-card text-xs text-stone-600 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer"
      >
        <option value="All">All Types</option>
        <option value="MCQ">MCQ</option>
        <option value="Numerical Value">Numerical Value</option>
      </select>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// PYQ Explorer — Main Component
// ──────────────────────────────────────────────────────────────

export default function JeeMainPyqExplorer() {
  const [stats, setStats] = useState<PyqStats | null>(null);
  const [papers, setPapers] = useState<PyqExamPaper[]>([]);
  const [questions, setQuestions] = useState<PyqQuestion[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [view, setView] = useState<BrowseView>('overview');
  const [selectedPaper, setSelectedPaper] = useState<PyqExamPaper | null>(null);

  // Filters
  const [selectedDate, setSelectedDate] = useState('All');
  const [selectedShift, setSelectedShift] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load papers + stats
  useEffect(() => {
    setLoading(true);
    fetch('/api/pyq/papers')
      .then((r) => r.json())
      .then((data) => {
        setPapers(data.papers || []);
        setStats(data.stats || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Load questions with filters + debounce
  const loadQuestions = useCallback(() => {
    setQuestionsLoading(true);
    const params = new URLSearchParams();
    if (activeTab !== 'all') params.set('subject', activeTab);
    if (selectedDate !== 'All') params.set('date', selectedDate);
    if (selectedShift !== 'All') params.set('shift', selectedShift);
    if (selectedSection !== 'All') params.set('section', selectedSection);
    if (selectedType !== 'All') params.set('type', selectedType);
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedPaper) {
      params.set('date', selectedPaper.exam_date_str);
      params.set('shift', selectedPaper.shift);
    }
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
  }, [activeTab, selectedDate, selectedShift, selectedSection, selectedType, searchQuery, page, selectedPaper]);

  useEffect(() => {
    if (view === 'questions') {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(loadQuestions, 300);
    }
  }, [view, loadQuestions]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [activeTab, selectedDate, selectedShift, selectedSection, selectedType, searchQuery, selectedPaper]);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setView('questions');
  };

  const handleBrowsePaper = (paper: PyqExamPaper) => {
    setSelectedPaper(paper);
    setSelectedDate(paper.exam_date_str);
    setSelectedShift(paper.shift);
    setActiveTab('all');
    setView('questions');
  };

  const handleBack = () => {
    setView('overview');
    setSelectedPaper(null);
    setSelectedDate('All');
    setSelectedShift('All');
    setActiveTab('all');
    setPage(1);
  };

  // ── Render ──

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <RefreshCw className="w-7 h-7 animate-spin text-brand-500" />
        <p className="text-sm text-stone-500">Loading JEE Main PYQs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          {view === 'questions' && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-stone-500 hover:text-foreground mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Overview
            </button>
          )}
          <h2 className="text-lg font-bold text-foreground">
            {selectedPaper
              ? `${selectedPaper.exam_date_str} — ${selectedPaper.shift}`
              : 'JEE Main 2025 — B.Tech'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {view === 'questions'
              ? `${totalQuestions} question${totalQuestions !== 1 ? 's' : ''} found`
              : `${stats?.totalPapers ?? 0} papers · ${stats?.totalQuestions ?? 0} questions imported`}
          </p>
        </div>
      </div>

      {/* Stats bar (overview only) */}
      {view === 'overview' && stats && <StatsBar stats={stats} />}

      {/* Subject tabs */}
      <SubjectTabBar active={activeTab} onChange={handleTabChange} stats={stats} />

      <AnimatePresence mode="wait">
        {view === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Date-shift organized paper cards */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-500" />
                Examination Papers
              </h3>
              {papers.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-border rounded-xl">
                  <BookOpen className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                  <p className="text-sm text-stone-500">No papers imported yet.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {papers.map((paper) => (
                    <PaperDateCard key={paper.id} paper={paper} onBrowse={handleBrowsePaper} />
                  ))}
                </div>
              )}
            </div>

            {/* Date-wise breakdown */}
            {stats && Object.keys(stats.byDate).length > 0 && (
              <div className="p-4 rounded-xl border border-border bg-card/60">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Date-wise Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(stats.byDate)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([date, count]) => (
                      <div key={date} className="flex items-center justify-between text-xs">
                        <span className="text-stone-600 dark:text-stone-400">{date}</span>
                        <span className="font-semibold text-foreground">{count} questions</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="questions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Filters */}
            <FiltersPanel
              dates={stats?.availableDates ?? []}
              shifts={stats?.availableShifts ?? []}
              subject={activeTab}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedShift={selectedShift}
              setSelectedShift={setSelectedShift}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            {/* Battle Mode Launcher Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-brand-500/10 via-purple-500/10 to-blue-500/10 border border-brand-500/25">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand text-white flex items-center justify-center shrink-0 shadow-md">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    Battle Mode — Solve with Real Exam Timer
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Solve {activeTab === 'all' ? 'JEE Main 2025' : activeTab} PYQs under battle pressure with immediate scoring.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const params = new URLSearchParams({
                    exam: 'JEE_MAINS',
                    source: 'pyq',
                    mode: 'quick_battle',
                    questions: '10',
                    duration: '1800',
                  });
                  if (activeTab !== 'all') params.set('subject', activeTab);
                  if (selectedDate !== 'All') params.set('date', selectedDate);
                  if (selectedShift !== 'All') params.set('shift', selectedShift);
                  window.location.href = `/exam/session?${params.toString()}`;
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-brand hover:opacity-90 transition-all shadow-md shadow-brand-500/25 cursor-pointer shrink-0"
              >
                <Zap className="w-4 h-4" />
                <span>Launch PYQ Battle</span>
              </button>
            </div>

            {/* Questions list */}
            {questionsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-brand-500" />
                <p className="text-sm text-stone-500">Loading questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-xl">
                <Search className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                <p className="text-sm text-stone-500">No questions match your filters.</p>
                <p className="text-xs text-stone-400 mt-1">Try adjusting the date, shift or section filters.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <QuestionCard key={q.id} q={q} index={idx} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-border hover:bg-stone-50 dark:hover:bg-stone-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-stone-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-border hover:bg-stone-50 dark:hover:bg-stone-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

