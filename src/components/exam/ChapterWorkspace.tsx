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

  useEffect(() => {
    let isMounted = true;
    async function loadQuestions() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/pyq/questions?subject=${encodeURIComponent(subjectName)}&pageSize=50`
        );
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
  }, [subjectName]);

  const filteredQuestions = questions.filter((q) => {
    if (activeFilter === 'mcq') return q.question_type === 'MCQ';
    if (activeFilter === 'numerical') return q.question_type === 'Numerical Value';
    return true;
  });

  const stats = {
    totalAvailable: questions.length,
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
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          {[
            { id: 'all', label: `All ${subjectName} PYQs (${questions.length})` },
            { id: 'mcq', label: 'Section A (MCQ)' },
            { id: 'numerical', label: 'Section B (Numerical)' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-brand-600 dark:bg-brand-500 text-white shadow-xs font-bold'
                  : 'text-stone-700 dark:text-stone-200 hover:text-foreground bg-card dark:bg-stone-900 border border-border/80 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/pyq?subject=${encodeURIComponent(subjectName)}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-stone-700 dark:text-stone-300 text-xs font-semibold hover:border-brand-300 hover:text-brand-600 transition-colors cursor-pointer"
          >
            <span>Explore All in PYQ Hub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Upload PDF</span>
          </button>
        </div>
      </div>

      {/* ── B. Dedicated PYQ Section ──────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 border border-dashed border-border rounded-2xl">
          <RefreshCw className="w-6 h-6 animate-spin text-brand-500" />
          <p className="text-xs text-stone-500 font-medium">Loading {subjectName} PYQ questions...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl border border-dashed border-border bg-card/40 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-100/70 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center mx-auto border border-purple-200/60 dark:border-purple-800/40">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              No questions found for this filter.
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
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
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800/40">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-600" />
              <span className="text-xs font-bold text-foreground">
                Showing {filteredQuestions.length} Questions for {subjectName}
              </span>
            </div>
            <button
              onClick={() => onStartBattle(chapter)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-brand hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Battle This Section</span>
            </button>
          </div>

          <div className="space-y-3">
            {filteredQuestions.slice(0, 15).map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="p-4 sm:p-5 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow space-y-3"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-stone-400">
                      Q{q.question_number}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300">
                      {q.subject}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-stone-50 dark:bg-stone-900 text-stone-500 font-medium">
                      {q.section}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-stone-50 dark:bg-stone-900 text-stone-500 font-medium">
                      {q.question_type}
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-400">
                    {q.exam_date_str} • {q.shift}
                  </div>
                </div>

                <MathText
                  text={q.question_statement}
                  block
                  className="text-sm text-foreground leading-relaxed font-normal"
                />

                {q.diagram_url && (
                  <div>
                    <button
                      onClick={() =>
                        setShowDiagramFor((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                      }
                      className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-medium cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      {showDiagramFor[q.id] ? 'Hide Figure' : 'Show Figure'}
                    </button>
                    {showDiagramFor[q.id] && (
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

                {q.question_type === 'MCQ' && q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {q.options.map((opt) => (
                      <div
                        key={opt.key}
                        className="flex items-start gap-2 px-3 py-2 rounded-lg border border-border bg-stone-50 dark:bg-stone-900/60"
                      >
                        <span className="text-xs font-bold text-brand-600 shrink-0 mt-0.5">
                          ({opt.key})
                        </span>
                        <MathText text={opt.text} className="text-xs text-foreground" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-400 truncate max-w-[280px]">
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-brand hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                  >
                    <Zap className="w-3.5 h-3.5" />
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
