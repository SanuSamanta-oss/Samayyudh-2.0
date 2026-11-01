'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Filter, ChevronLeft, ChevronRight,
  AlertCircle, RefreshCw, Calendar, Layers, FileText,
  ArrowLeft, X, Upload, Check, Image as ImageIcon
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
        <button
          onClick={() => onBrowse(paper)}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors cursor-pointer"
        >
          Browse
        </button>
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
      className="p-4 sm:p-5 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow"
    >
      {/* Header meta */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold text-stone-400">
            Q{q.question_number}
          </span>
          <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold border', subjectColors[q.subject])}>
            {q.subject}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-stone-50 dark:bg-stone-900 text-stone-500 font-medium">
            {q.section}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-stone-50 dark:bg-stone-900 text-stone-500 font-medium">
            {q.question_type}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-stone-400">{q.exam_date_str}</span>
          <span className="text-[10px] text-stone-400">•</span>
          <span className="text-[10px] text-stone-400">{q.shift}</span>
        </div>
      </div>

      {/* Question text */}
      <MathText
        text={q.question_statement}
        block
        className="text-sm text-foreground leading-relaxed font-normal"
      />

      {/* Diagram toggle */}
      {q.diagram_url && (
        <div className="mt-3">
          <button
            onClick={() => setShowDiagram((s) => !s)}
            className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-medium cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            {showDiagram ? 'Hide Figure' : 'Show Figure'}
          </button>
          {showDiagram && (
            <div className="mt-2 p-2 rounded-lg border border-border bg-stone-50 dark:bg-stone-900 max-w-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={q.diagram_url}
                alt={`Diagram for Q${q.question_number}`}
                className="max-w-full rounded"
              />
            </div>
          )}
        </div>
      )}

      {/* MCQ Options */}
      {q.question_type === 'MCQ' && q.options && q.options.length > 0 && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {q.options.map((opt) => (
            <div
              key={opt.key}
              className="flex items-start gap-2 px-3 py-2 rounded-lg border border-border bg-stone-50 dark:bg-stone-900/60"
            >
              <span className="text-xs font-bold text-brand-600 shrink-0 mt-0.5">({opt.key})</span>
              <MathText
                text={opt.text}
                className="text-xs text-foreground"
              />
            </div>
          ))}
        </div>
      )}

      {q.question_type === 'Numerical Value' && (
        <div className="mt-3 px-3 py-2 rounded-lg border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30">
          <p className="text-xs text-stone-500 font-medium">Numerical Value — Enter your calculated answer</p>
        </div>
      )}

      {/* Review flag */}
      {q.review_required && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{q.review_reason || 'Question flagged for manual review'}</span>
        </div>
      )}
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
        <p className="text-sm text-stone-500">Loading PYQ question bank...</p>
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

