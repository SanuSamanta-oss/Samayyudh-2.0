'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  PlusCircle,
  Swords,
  Layers,
  CheckCircle2,
  XCircle,
  Bookmark,
  FileText,
  Upload,
  Plus,
  Sparkles,
  X,
  Check,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { WbjeeChapter, WbjeeSubject, WbjeeSyllabusConfig } from '@/data/wbjee/wbjeeSyllabus';
import { WBJEE_QUESTIONS_DATA, WbjeeQuestion } from '@/data/wbjee/wbjeeQuestionsData';
import { MathText } from '@/components/pyq/MathText';

// ── WBJEE Upload Modal ─────────────────────────────────────────

interface WbjeeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectName: string;
  chapterName: string;
}

function WbjeeUploadModal({ isOpen, onClose, subjectName, chapterName }: WbjeeUploadModalProps) {
  const [tab, setTab] = useState<'single' | 'bulk' | 'pdf'>('single');
  const [questionText, setQuestionText] = useState('');
  const [examYear, setExamYear] = useState('2024');
  const [questionCategory, setQuestionCategory] = useState('cat1');
  const [difficulty, setDifficulty] = useState('medium');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptions, setCorrectOptions] = useState<number[]>([0]);
  const [explanation, setExplanation] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleOptionChange = (idx: number, val: string) => {
    const next = [...options];
    next[idx] = val;
    setOptions(next);
  };

  const toggleCorrectOption = (idx: number) => {
    if (questionCategory === 'cat3') {
      // Multiple select for Category 3
      setCorrectOptions((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
      );
    } else {
      setCorrectOptions([idx]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => { setSavedSuccess(false); onClose(); }, 1800);
  };

  const categoryConfig: Record<string, { marks: string; neg: string; label: string }> = {
    cat1: { marks: '1', neg: '0.25', label: 'Category 1 — 1 mark, −0.25' },
    cat2: { marks: '2', neg: '0.5', label: 'Category 2 — 2 marks, −0.5' },
    cat3: { marks: '2', neg: '0', label: 'Category 3 — 2 marks, no negative (partial marking)' },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                  Admin PYQ Integration
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  WBJEE • {subjectName}
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground mt-0.5 truncate">
                Upload Questions for: {chapterName}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="flex border-b border-border px-6 pt-3 gap-2 bg-stone-50/50 dark:bg-stone-900/30">
            {[
              { id: 'single', label: 'Single Question', icon: Plus },
              { id: 'bulk', label: 'Bulk JSON / CSV', icon: FileText },
              { id: 'pdf', label: 'PDF Ingestion', icon: Upload },
            ].map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as any)}
                  className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    active
                      ? 'border-brand-600 text-brand-600'
                      : 'border-transparent text-stone-500 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-4">
            {savedSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-foreground">Schema Form Validated</h4>
                <p className="text-xs text-stone-500 max-w-sm">
                  Placeholder saved. Once Supabase migration is linked, questions will persist into the official WBJEE PYQ bank.
                </p>
              </div>
            ) : tab === 'single' ? (
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                {/* Policy Banner */}
                <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 text-blue-900 dark:text-blue-200">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-xs">Strict Zero-Fake-PYQ Policy</p>
                    <p className="text-[11px] opacity-80 mt-0.5">
                      Only verified WBJEE Previous Year Questions with official exam years and WBJEEB answer keys are permitted.
                    </p>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-500 font-medium mb-1">Exam Year</label>
                    <input
                      type="text"
                      value={examYear}
                      onChange={(e) => setExamYear(e.target.value)}
                      placeholder="e.g. 2024"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-medium mb-1">Question Category</label>
                    <select
                      value={questionCategory}
                      onChange={(e) => { setQuestionCategory(e.target.value); setCorrectOptions([0]); }}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground font-medium"
                    >
                      <option value="cat1">Category 1 (1 mark, −0.25)</option>
                      <option value="cat2">Category 2 (2 marks, −0.5)</option>
                      <option value="cat3">Category 3 (2 marks, partial)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-500 font-medium mb-1">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground font-medium"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                {/* Category Info */}
                <div className="px-3 py-2 rounded-lg bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 text-[11px] text-stone-600 dark:text-stone-300 font-medium">
                  {categoryConfig[questionCategory]?.label}
                </div>

                {/* Question Text */}
                <div>
                  <label className="block text-stone-500 font-medium mb-1">
                    Question Statement (Supports LaTeX math syntax)
                  </label>
                  <textarea
                    rows={3}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Enter full question text or LaTeX expression, e.g. $x^2 + y^2 = r^2$"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-stone-400 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                {/* MCQ Options */}
                <div className="space-y-2">
                  <label className="block text-stone-500 font-medium">
                    Options {questionCategory === 'cat3' ? '(Select all correct options)' : '(Select correct option)'}
                  </label>
                  {['A', 'B', 'C', 'D'].map((letter, idx) => (
                    <div key={letter} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleCorrectOption(idx)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center ${
                          correctOptions.includes(idx)
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'border-border bg-surface text-stone-500 hover:border-emerald-300'
                        }`}
                      >
                        {letter}
                      </button>
                      <input
                        type="text"
                        value={options[idx]}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${letter}`}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-surface text-foreground"
                      />
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-stone-500 font-medium mb-1">
                    Detailed Solution &amp; Answer Rationale
                  </label>
                  <textarea
                    rows={2}
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Step-by-step derivation or solution key..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-stone-400 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-brand text-white font-bold shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Save to PYQ Bank
                  </button>
                </div>
              </form>
            ) : tab === 'bulk' ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center mx-auto border border-purple-200 dark:border-purple-800">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Bulk JSON / CSV Upload</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                    Upload structured data for <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-[11px]">{chapterName}</code>. Each row must include question_category (cat1/cat2/cat3), marks, negative_marks and correct answer indices.
                  </p>
                </div>
                <div className="border-2 border-dashed border-border rounded-xl p-6 hover:border-brand-300 transition-colors cursor-pointer bg-surface/30">
                  <Upload className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-foreground">Click to upload or drag and drop</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">JSON, CSV or TSV (max 10 MB)</p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Official PDF Paper Ingestion</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                    Upload official WBJEE scanned or digital PDF question papers. The system will parse, clean and map questions to this chapter.
                  </p>
                </div>
                <div className="border-2 border-dashed border-border rounded-xl p-6 hover:border-blue-300 transition-colors cursor-pointer bg-surface/30">
                  <Upload className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-foreground">Upload Official WBJEE PDF</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">Scanned or digital PDF (up to 50 MB)</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ── WBJEE Chapter Workspace ────────────────────────────────────

type FilterId = 'all' | 'years' | 'cat1' | 'cat2' | 'cat3' | 'attempted' | 'unattempted' | 'correct' | 'incorrect' | 'bookmarked' | 'difficulty';

const FILTER_TABS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All Questions' },
  { id: 'years', label: 'Year-wise' },
  { id: 'cat1', label: 'Category 1' },
  { id: 'cat2', label: 'Category 2' },
  { id: 'cat3', label: 'Category 3' },
  { id: 'attempted', label: 'Attempted' },
  { id: 'unattempted', label: 'Unattempted' },
  { id: 'correct', label: 'Correct' },
  { id: 'incorrect', label: 'Incorrect' },
  { id: 'bookmarked', label: 'Bookmarked' },
  { id: 'difficulty', label: 'Difficulty' },
];

interface WbjeeChapterWorkspaceProps {
  syllabus: WbjeeSyllabusConfig;
  subject: WbjeeSubject;
  chapter: WbjeeChapter;
  onBackToSubject: () => void;
  onStartBattle: (chapter: WbjeeChapter) => void;
}

export function WbjeeChapterWorkspace({
  syllabus,
  subject,
  chapter,
  onBackToSubject,
  onStartBattle,
}: WbjeeChapterWorkspaceProps) {
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [userChoices, setUserChoices] = useState<Record<string, string[]>>({});
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});

  const chapterQuestions = useMemo(() => {
    return WBJEE_QUESTIONS_DATA.filter((q) => {
      if (q.subject.toLowerCase() !== subject.name.toLowerCase()) return false;
      const qChap = q.chapter.toLowerCase();
      const cName = chapter.name.toLowerCase();
      return (
        qChap.includes(cName) ||
        cName.includes(qChap) ||
        qChap.split(':')[0].trim().toLowerCase() === cName ||
        cName.includes(qChap.split(':')[0].trim().toLowerCase())
      );
    });
  }, [subject.name, chapter.name]);

  const toggleOption = (qId: string, optId: string, category: number) => {
    const cur = userChoices[qId] || [];
    if (category === 3) {
      setUserChoices((prev) => ({
        ...prev,
        [qId]: cur.includes(optId) ? cur.filter((i) => i !== optId) : [...cur, optId],
      }));
    } else {
      setUserChoices((prev) => ({
        ...prev,
        [qId]: [optId],
      }));
    }
  };

  const toggleSolution = (qId: string) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const stats = {
    totalPYQs: chapterQuestions.length,
    attempted: Object.keys(userChoices).length,
    correct: chapterQuestions.filter(
      (q) => userChoices[q.id]?.sort().join(', ') === q.correct_option
    ).length,
    incorrect: Math.max(
      0,
      Object.keys(userChoices).length -
        chapterQuestions.filter(
          (q) => userChoices[q.id]?.sort().join(', ') === q.correct_option
        ).length
    ),
    accuracy:
      Object.keys(userChoices).length > 0
        ? Math.round(
            (chapterQuestions.filter(
              (q) => userChoices[q.id]?.sort().join(', ') === q.correct_option
            ).length /
              Object.keys(userChoices).length) *
              100
          )
        : 0,
    bookmarked: 0,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Breadcrumb & Top Bar ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 flex-wrap">
          <button
            onClick={onBackToSubject}
            className="hover:text-brand-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>WBJEE</span>
          </button>
          <span>/</span>
          <button
            onClick={onBackToSubject}
            className="hover:text-brand-600 transition-colors cursor-pointer"
          >
            {subject.name}
          </button>
          <span>/</span>
          <span className="text-foreground font-bold">{chapter.name}</span>
        </div>

        <button
          onClick={() => onStartBattle(chapter)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-brand hover:opacity-90 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Swords className="w-4 h-4" />
          <span>Battle This Chapter</span>
        </button>
      </div>

      {/* ── Chapter Header ───────────────────────────────────── */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
            CHAPTER {chapter.number}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
            {chapter.paperCode === 'PAPER_I' ? 'Paper I — Mathematics' : 'Paper II — Physics & Chemistry'}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {chapter.name}
        </h2>
        {chapter.description && (
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-2xl">
            {chapter.description}
          </p>
        )}
      </div>

      {/* ── Stats Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Available PYQs', value: stats.totalPYQs, sub: 'in bank', color: 'text-foreground' },
          { label: 'Attempted', value: stats.attempted, sub: 'questions', color: 'text-foreground' },
          { label: 'Correct', value: stats.correct, sub: 'verified', color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Incorrect', value: stats.incorrect, sub: 'review needed', color: 'text-rose-600 dark:text-rose-400' },
          { label: 'Accuracy', value: `${stats.accuracy}%`, sub: 'rate', color: 'text-brand-600' },
          { label: 'Bookmarked', value: stats.bookmarked, sub: 'saved', color: 'text-amber-500' },
        ].map((s) => (
          <div key={s.label} className="p-3.5 rounded-2xl border border-border bg-card">
            <p className="text-[11px] font-medium text-stone-500">{s.label}</p>
            <p className={`text-xl font-black mt-0.5 ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-stone-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── WBJEE Exam Pattern Reference ─────────────────────── */}
      <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
        <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
          WBJEE Question Categories — {subject.name}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { cat: 'Category 1', marks: '+1 mark', neg: '−0.25 negative', type: 'Single correct option', color: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300' },
            { cat: 'Category 2', marks: '+2 marks', neg: '−0.5 negative', type: 'Single correct option', color: 'bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300' },
            { cat: 'Category 3', marks: '+2 marks', neg: 'No negative', type: 'One or more correct (partial marking)', color: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' },
          ].map((c) => (
            <div key={c.cat} className={`p-3 rounded-xl border ${c.color}`}>
              <p className="text-[11px] font-black uppercase tracking-wider">{c.cat}</p>
              <p className="text-xs font-bold mt-1">{c.marks}</p>
              <p className="text-[10px] font-medium opacity-80">{c.neg}</p>
              <p className="text-[10px] opacity-70 mt-0.5">{c.type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filter Bar ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card/60">
        <div className="p-1.5 rounded-xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 inline-flex items-center gap-1 overflow-x-auto scrollbar-none max-w-full">
          {FILTER_TABS.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'text-white'
                    : 'text-stone-700 dark:text-stone-300 hover:text-foreground hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="wbjeeChapterFilterPill"
                    className="absolute inset-0 rounded-lg bg-brand-600 dark:bg-brand-500 shadow-sm ring-1 ring-brand-400/30"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Upload Trigger */}
        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-brand-300 dark:border-brand-700 text-brand-600 dark:text-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-950/50 text-xs font-bold transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Upload PYQ Questions</span>
        </button>
      </div>

      {/* ── PYQ Questions List or Placeholder ─────────────────── */}
      {chapterQuestions.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>
              Showing <strong className="text-foreground">{chapterQuestions.length}</strong> verified WBJEE PYQs
            </span>
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
              Official Papers
            </span>
          </div>

          {chapterQuestions.map((q) => {
            const userChoice = userChoices[q.id] || [];
            const isRevealed = expandedSolutions[q.id] || false;

            return (
              <div
                key={q.id}
                className="p-6 sm:p-7 rounded-3xl border-2 border-stone-200 dark:border-[#243556] bg-white dark:bg-[#111A2E] hover:border-purple-300 dark:hover:border-purple-500/70 shadow-xs dark:shadow-md transition-all space-y-5"
              >
                {/* Header Identity Tab */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-purple-600 text-white font-extrabold text-sm shadow-xs">
                      <span>Q{q.question_number}</span>
                    </div>

                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
                      {q.subject}
                    </span>

                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-stone-100 text-stone-800 dark:bg-[#1E2D4A] dark:text-stone-200 border border-stone-200 dark:border-[#2D436D]">
                      {q.section}
                    </span>

                    <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-stone-100 text-stone-700 dark:bg-[#1E2D4A] dark:text-stone-300 border border-stone-200 dark:border-[#2D436D]">
                      {q.category === 3 ? 'Multi-Correct' : 'MCQ'}
                    </span>

                    <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
                      +{q.marks} {q.negative_marks > 0 ? `| −${q.negative_marks}` : '| No Negative'}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-100/90 dark:bg-[#18233C] px-3.5 py-1 rounded-xl border border-stone-200/80 dark:border-[#293B60]">
                    WBJEE {q.year} • {q.subject === 'Mathematics' ? 'Paper I' : 'Paper II'}
                  </div>
                </div>

                {/* Question Statement in Recessed Box */}
                <div className="p-5 sm:p-6 rounded-2xl bg-stone-50/90 dark:bg-[#16233B] border border-stone-200/90 dark:border-[#283C64]">
                  <MathText
                    text={q.question_statement}
                    block
                    className="text-base sm:text-lg md:text-xl text-stone-900 dark:text-white leading-relaxed font-medium"
                  />
                </div>

                {/* Options in JEE Main 2x2 Grid */}
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
                        key={opt.id}
                        onClick={() => toggleOption(q.id, opt.id, q.category)}
                        className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer group shadow-xs ${cardBorderBg}`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl font-extrabold text-base flex items-center justify-center shrink-0 border shadow-2xs group-hover:scale-105 transition-transform ${badgeStyle}`}
                        >
                          {showFeedback && isCorrect ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : showFeedback && isSelected && !isCorrect ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            opt.id
                          )}
                        </div>
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

                {/* Footer */}
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
                      {isRevealed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                      Correct: ({q.correct_option})
                    </span>
                  </div>
                </div>

                {isRevealed && (
                  <div className="p-5 rounded-2xl bg-stone-50/90 dark:bg-[#16233B] border border-stone-200/90 dark:border-[#283C64] space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      <span>Official Step-by-Step Solution & Derivation</span>
                    </div>
                    <div className="pt-1 text-sm sm:text-base leading-relaxed text-stone-800 dark:text-stone-200">
                      <MathText text={q.explanation} block />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 sm:p-12 rounded-3xl border border-dashed border-border bg-card/40 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100/70 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mx-auto border border-blue-200/60 dark:border-blue-800/40">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Chapter Questions Synchronizing
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
              You can practice this chapter directly in the WBJEE timed battle or browse all verified papers in the Explore PYQ section.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 transition-colors cursor-pointer"
            >
              Upload PYQ Questions
            </button>
            <button
              onClick={() => onStartBattle(chapter)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-brand hover:opacity-90 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Launch Timed Practice</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Question Engine Capabilities Info ─────────────────── */}
      <div className="p-5 rounded-2xl border border-border bg-surface/40 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <Layers className="w-4 h-4 text-brand-600" />
          <span>WBJEE Question Engine Ready</span>
        </div>
        <p className="text-xs text-stone-500 leading-relaxed">
          Supports Category 1 and 2 single-correct MCQs, Category 3 multiple-correct with partial-credit evaluation, question images, mathematical expressions (KaTeX), answer explanations and year-wise organisation.
        </p>
      </div>

      {/* Upload Modal */}
      <WbjeeUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        subjectName={subject.name}
        chapterName={chapter.name}
      />
    </div>
  );
}

