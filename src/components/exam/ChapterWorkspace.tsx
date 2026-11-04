'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  PlusCircle,
  Swords,
  Layers,
  Zap,
  Image as ImageIcon,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { ChapterTopic } from '@/data/examSyllabus';
import { UploadPYQModal } from './UploadPYQModal';
import { MathText } from '@/components/pyq/MathText';
import type { PyqQuestion } from '@/lib/pyq/types';
import { cn } from '@/lib/utils';

interface ChapterWorkspaceProps {
  examCode: string;
  examName: string;
  subjectName: string;
  chapter: ChapterTopic;
  onBackToSubject: () => void;
  onStartBattle: (chapter: ChapterTopic) => void;
}

export function ChapterWorkspace({
  examCode,
  examName,
  subjectName,
  chapter,
  onBackToSubject,
  onStartBattle,
}: ChapterWorkspaceProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'mcq' | 'numerical'>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [questions, setQuestions] = useState<PyqQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDiagramFor, setShowDiagramFor] = useState<Record<string, boolean>>({});
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadQuestions() {
      setLoading(true);
      try {
        const examParam = examCode === 'JEE_ADVANCED' ? 'JEE Advanced' : examCode === 'JEE_MAINS' ? 'JEE Main' : '';
        const params = new URLSearchParams();
        if (examParam) params.set('exam', examParam);
        params.set('subject', subjectName);
        params.set('pageSize', '50');

        const res = await fetch(`/api/pyq/questions?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.questions) {
            setQuestions(data.questions);
          }
        }
      } catch (err) {
        console.error('Failed to load questions:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, [subjectName, examCode]);

  const filteredQuestions = questions
    .filter((q) => !q.is_placeholder && !q.question_statement.startsWith('Question ') && q.question_statement.trim().length >= 20)
    .filter((q) => {
      if (activeFilter === 'mcq') return q.question_type === 'MCQ';
      if (activeFilter === 'numerical') return q.question_type === 'Numerical Value';
      return true;
    });

  const stats = {
    totalAvailable: questions.filter((q) => !q.is_placeholder && !q.question_statement.startsWith('Question ') && q.question_statement.trim().length >= 20).length,
    totalAttempted: 0,
    correctAnswers: 0,
    accuracy: 0,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Breadcrumb & Top Bar ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 flex-wrap">
          <button
            onClick={onBackToSubject}
            className="hover:text-brand-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{examName}</span>
          </button>
          <span>/</span>
          <button onClick={onBackToSubject} className="hover:text-brand-600 transition-colors cursor-pointer">
            {subjectName}
          </button>
          <span>/</span>
          <span className="text-foreground font-bold">{chapter.name}</span>
        </div>

        {/* Start Battle with this chapter CTA */}
        <button
          onClick={() => onStartBattle(chapter)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-brand hover:opacity-90 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Swords className="w-4 h-4" />
          <span>Battle This Chapter</span>
        </button>
      </div>

      {/* ── Chapter Header & Description ─────────────────────── */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
            CHAPTER {chapter.number}
          </span>
          <span className="text-xs text-stone-400 font-medium">Syllabus Unit</span>
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

      {/* ── A. Chapter Overview Statistics ───────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
          <p className="text-[11px] font-medium text-stone-500">Available Questions</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-foreground">{stats.totalAvailable}</span>
            <span className="text-[10px] text-stone-400 font-medium">PYQs queued</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
          <p className="text-[11px] font-medium text-stone-500">Attempted Questions</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-foreground">{stats.totalAttempted}</span>
            <span className="text-[10px] text-stone-400 font-medium">solved</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
          <p className="text-[11px] font-medium text-stone-500">Correct Answers</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.correctAnswers}
            </span>
            <span className="text-[10px] text-stone-400 font-medium">verified</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
          <p className="text-[11px] font-medium text-stone-500">Accuracy Rate</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-foreground">{stats.accuracy}%</span>
            <span className="text-[10px] text-stone-400 font-medium">overall</span>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-sm">
          {[
            { id: 'all', label: `All Questions (${questions.length})` },
            { id: 'mcq', label: 'Section A — MCQs (Q1–20)' },
            { id: 'numerical', label: 'Section B — Numerical (Q21–25)' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={cn(
                'px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer text-xs sm:text-sm font-bold',
                activeFilter === f.id
                  ? 'bg-purple-600 text-white shadow-xs dark:shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'text-stone-700 dark:text-stone-200 hover:text-foreground bg-white dark:bg-[#16233B] border-2 border-stone-200 dark:border-[#2A3F68] hover:bg-stone-50 dark:hover:bg-[#1E2E4E]'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/pyq?subject=${encodeURIComponent(subjectName)}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-[#2A3F68] bg-white dark:bg-[#16233B] text-stone-700 dark:text-stone-200 text-xs font-semibold hover:border-purple-300 dark:hover:border-purple-400 hover:text-purple-600 transition-colors cursor-pointer"
          >
            <span>Explore All in PYQ Hub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-dashed border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Upload PDF</span>
          </button>
        </div>
      </div>

      {/* ── B. Dedicated PYQ Section ──────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 border-2 border-dashed border-stone-200 dark:border-[#243556] rounded-3xl bg-white/40 dark:bg-[#111A2E]/60">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-sm text-stone-500 dark:text-stone-400 font-semibold">Loading {subjectName} PYQ questions...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl border-2 border-dashed border-stone-200 dark:border-[#243556] bg-white dark:bg-[#111A2E]/60 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-100/70 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center mx-auto border border-purple-200/60 dark:border-purple-800/40">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              No questions found for this filter.
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
              Previous Year Questions will appear here once added or try resetting filters.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors cursor-pointer"
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
      ) : (
        <div className="space-y-6">
          {/* Top Banner with Section Battle Button */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50/80 dark:bg-[#16233B] border-2 border-purple-200/80 dark:border-[#2A3F68]">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-bold text-purple-950 dark:text-purple-100">
                Showing {filteredQuestions.length} Questions for {subjectName}
              </span>
            </div>
            <button
              onClick={() => onStartBattle(chapter)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-brand hover:opacity-90 transition-opacity cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <Swords className="w-4 h-4" />
              <span>Battle This Section</span>
            </button>
          </div>

          {/* Quick Question Navigation Tabs (Slide) */}
          <div className="p-4 rounded-2xl border-2 border-stone-200 dark:border-[#243556] bg-white dark:bg-[#111A2E] space-y-2.5 shadow-xs dark:shadow-md">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-300">
                  Question Number Slide
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Section A: Q1–20 | Section B: Q21–25
                </span>
              </div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-300">
                Click any number to jump
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {filteredQuestions.map((q) => {
                const isSelected = selectedQuestionId === q.id;
                const isSectionB = q.question_number >= 21 || q.section === 'Section B';
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelectedQuestionId(q.id);
                      const el = document.getElementById(`pyq-${q.id}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    title={isSectionB ? `Section B: Numerical Value Q${q.question_number}` : `Section A: MCQ Q${q.question_number}`}
                    className={cn(
                      'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1',
                      isSelected
                        ? 'bg-purple-600 text-white shadow-sm dark:shadow-[0_0_12px_rgba(168,85,247,0.5)] scale-105'
                        : isSectionB
                          ? 'bg-purple-50 text-purple-900 dark:bg-[#201D3D] dark:text-purple-200 border-2 border-purple-300 dark:border-purple-600/80 hover:bg-purple-100 dark:hover:bg-[#292452]'
                          : 'bg-stone-100 hover:bg-purple-50 text-stone-800 dark:bg-[#18253E] dark:hover:bg-[#203152] dark:text-stone-200 border border-stone-200 dark:border-[#2A3F68]'
                    )}
                  >
                    <span>Q{q.question_number}</span>
                    {isSectionB && (
                      <span className={cn(
                        'text-[9px] px-1 py-0.2 rounded font-black',
                        isSelected ? 'bg-white/20 text-white' : 'bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100'
                      )}>
                        NUM
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Cards List */}
          <div className="space-y-6">
            {filteredQuestions.map((q, idx) => (
              <motion.div
                id={`pyq-${q.id}`}
                key={q.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className={cn(
                  'p-6 sm:p-7 rounded-3xl border-2 transition-all space-y-5',
                  selectedQuestionId === q.id
                    ? 'border-purple-500 shadow-md bg-white dark:bg-[#111A2E]'
                    : 'border-stone-200 dark:border-[#243556] bg-white dark:bg-[#111A2E] hover:border-purple-300 dark:hover:border-purple-500/70 shadow-xs dark:shadow-md'
                )}
              >
                {/* Header Identity Tab */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-purple-600 text-white font-extrabold text-sm shadow-xs">
                      <span>Q{q.question_number}</span>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-purple-50 text-purple-800 dark:bg-purple-950/90 dark:text-purple-200 dark:border dark:border-purple-700/80">
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

                {/* Question Statement Box — Enhanced Size & High-Contrast Typography */}
                <div className="p-5 sm:p-6 rounded-2xl bg-stone-50/90 dark:bg-[#16233B] border border-stone-200/90 dark:border-[#283C64]">
                  <MathText
                    text={q.question_statement}
                    block
                    className="text-base sm:text-lg md:text-xl text-stone-900 dark:text-white leading-relaxed font-medium"
                  />
                </div>

                {/* Diagram Figure Toggle */}
                {q.diagram_url && (
                  <div>
                    <button
                      onClick={() =>
                        setShowDiagramFor((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                      }
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>{showDiagramFor[q.id] ? 'Hide Figure' : 'Show Figure'}</span>
                    </button>
                    {showDiagramFor[q.id] && (
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

                {/* Options as Interactive Tabs — Enhanced Font Size & Theme Visibility */}
                {q.question_type === 'MCQ' && q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={`${q.id}-opt-${opt.key || optIdx}-${optIdx}`}
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

                {/* Numerical Type Box & Interactive Answer Tab (Last 5 Questions) */}
                {q.question_type === 'Numerical Value' && (
                  <div className="p-5 sm:p-6 rounded-2xl border-2 border-purple-300 dark:border-purple-800/80 bg-purple-50/50 dark:bg-[#162036] space-y-3.5 shadow-xs">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-extrabold text-purple-900 dark:text-purple-200">
                          Section B — Numerical Value Answer
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-100">
                          No Options (Direct Value)
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                        Round off to nearest integer / decimal
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="relative flex-1 max-w-sm">
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="Type numerical answer..."
                          className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-[#2A3F68] bg-white dark:bg-[#111A2E] text-stone-900 dark:text-white font-mono text-lg sm:text-xl font-bold focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
                        />
                      </div>
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
                        className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Solve in Battle</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Footer */}
                <div className="pt-3 border-t border-stone-200 dark:border-[#243556] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-[#18233C] px-3 py-1.5 rounded-lg border border-stone-200/60 dark:border-[#293B60] truncate max-w-md">
                    {q.clean_source || `${q.exam} ${q.year} • ${q.exam_date_str} • ${q.shift}`}
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
            ))}
          </div>
        </div>
      )}

      {/* ── C. Capabilities Card ─────────────────────────────── */}
      <div className="p-5 rounded-2xl border border-border bg-surface/40 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <Layers className="w-4 h-4 text-brand-600" />
          <span>Interactive Question Formats Ready</span>
        </div>
        <p className="text-xs text-stone-500 leading-relaxed">
          The question engine supports Multiple-Choice (Single &amp; Multiple-Correct), Numerical Value, Integer Type, Assertion &amp; Reason, Matrix Match, Diagrams, and KaTeX mathematical typography.
        </p>
      </div>

      {/* Upload Modal */}
      <UploadPYQModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        examName={examName}
        subjectName={subjectName}
        chapterName={chapter.name}
      />
    </div>
  );
}
