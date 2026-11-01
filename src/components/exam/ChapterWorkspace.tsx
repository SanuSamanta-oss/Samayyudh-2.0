'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Filter,
  PlusCircle,
  HelpCircle,
  Swords,
  BarChart3,
  Sparkles,
  Bookmark,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { ChapterTopic } from '@/data/examSyllabus';
import { UploadPYQModal } from './UploadPYQModal';

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
  const [activeFilter, setActiveFilter] = useState<'all' | 'years' | 'difficulty' | 'status'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Initial empty states (as strictly specified in requirements)
  const stats = {
    totalAvailable: 0,
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

      {/* ── A. Chapter Overview Statistics (Empty state initially) ── */}
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
            <span className="text-2xl font-bold text-brand-600">{stats.accuracy}%</span>
            <span className="text-[10px] text-stone-400 font-medium">overall</span>
          </div>
        </div>
      </div>

      {/* ── D. Filter and Sort Bar (Reserved for question ingestion) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card/60">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'years', label: 'Year-wise PYQs' },
            { id: 'difficulty', label: 'Difficulty' },
            { id: 'status', label: 'Status' },
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

        {/* Admin Upload Trigger Placeholder */}
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Upload PYQ Questions</span>
        </button>
      </div>

      {/* ── B. Dedicated PYQ Section — Placeholder ─────────────── */}
      <div className="p-8 sm:p-12 rounded-3xl border border-dashed border-border bg-card/40 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-purple-100/70 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center mx-auto border border-purple-200/60 dark:border-purple-800/40">
          <BookOpen className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            No questions uploaded yet.
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Previous Year Questions for this chapter will appear here once added.
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

      {/* ── C. Future Question Display Capabilities Info Card ─── */}
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

