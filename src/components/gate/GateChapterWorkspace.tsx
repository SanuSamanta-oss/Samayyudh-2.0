'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Swords,
  BarChart3,
  Sparkles,
  Bookmark,
  Calendar,
  Layers,
  Filter,
  PlusCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { GatePaper, GateSection, GateChapter, getGateQuestionsForPaper } from '@/data/gateSyllabus';
import { UploadPYQModal } from '@/components/exam/UploadPYQModal';
import { Question } from '@/types';

interface GateChapterWorkspaceProps {
  paper: GatePaper;
  section: GateSection;
  chapter: GateChapter;
  onBackToPaper: () => void;
  onStartBattle: (chapter: GateChapter, section: GateSection) => void;
}

export function GateChapterWorkspace({
  paper,
  section,
  chapter,
  onBackToPaper,
  onStartBattle,
}: GateChapterWorkspaceProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'years' | 'difficulty' | 'status'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Load existing questions for this paper from the database/question bank
  const paperQuestions = getGateQuestionsForPaper(paper.code);
  
  // Try matching questions for this specific chapter/topic if topic/subject matches, or show paper questions
  const chapterQuestions = paperQuestions.filter((q) => {
    const qTopic = (q.topic || '').toLowerCase();
    const qSubj = (q.subject || '').toLowerCase();
    const chName = chapter.name.toLowerCase();
    return qTopic.includes(chName) || chName.includes(qTopic) || (qTopic === 'general' && section.id === 'ga');
  });

  const displayedQuestions = chapterQuestions.length > 0 ? chapterQuestions : paperQuestions;

  // Filter questions based on UI filters
  const filteredQuestions = displayedQuestions.filter((q) => {
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    if (selectedYear !== 'all' && String(q.year) !== selectedYear) return false;
    return true;
  });

  const availableYears = Array.from(new Set(displayedQuestions.map((q) => String(q.year)).filter(Boolean)));

  // Initial stats
  const stats = {
    totalPYQs: displayedQuestions.length,
    attempted: 0,
    correct: 0,
    incorrect: 0,
    accuracy: 0,
    bookmarked: 0,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Breadcrumb & Top Bar ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 flex-wrap">
          <button
            onClick={onBackToPaper}
            className="hover:text-brand-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>GATE</span>
          </button>
          <span>/</span>
          <button onClick={onBackToPaper} className="hover:text-brand-600 transition-colors cursor-pointer">
            {paper.name} ({paper.code})
          </button>
          <span>/</span>
          <span className="text-stone-400">{section.name}</span>
          <span>/</span>
          <span className="text-foreground font-bold">{chapter.name}</span>
        </div>

        {/* Start Battle with this chapter CTA */}
        <button
          onClick={() => onStartBattle(chapter, section)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-brand hover:opacity-90 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Swords className="w-4 h-4" />
          <span>Battle This Chapter</span>
        </button>
      </div>

      {/* ── Chapter Header & Description ─────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
            {paper.code}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
            CHAPTER {chapter.number}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-border">
            {section.name}
          </span>
          {section.isCompulsory ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              Compulsory Section
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
              Optional Section
            </span>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {chapter.name}
        </h2>
        {chapter.description && (
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-3xl">
            {chapter.description}
          </p>
        )}

        {chapter.subtopics && chapter.subtopics.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] font-bold text-stone-400">Key Subtopics:</span>
            {chapter.subtopics.map((st) => (
              <span
                key={st}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-card border border-border text-stone-600 dark:text-stone-300"
              >
                {st}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Section A: Chapter Overview ───────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-brand-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Chapter Performance Overview
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-2xl border border-border bg-card">
            <p className="text-[11px] font-medium text-stone-400">Total PYQs</p>
            <p className="text-xl font-black text-foreground mt-0.5">{stats.totalPYQs}</p>
            <p className="text-[10px] text-stone-400 mt-1">Available in bank</p>
          </div>

          <div className="p-3.5 rounded-2xl border border-border bg-card">
            <p className="text-[11px] font-medium text-stone-400">Attempted</p>
            <p className="text-xl font-black text-foreground mt-0.5">{stats.attempted}</p>
            <p className="text-[10px] text-stone-400 mt-1">Questions solved</p>
          </div>

          <div className="p-3.5 rounded-2xl border border-border bg-card">
            <p className="text-[11px] font-medium text-stone-400">Correct</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {stats.correct}
            </p>
            <p className="text-[10px] text-stone-400 mt-1">Verified correct</p>
          </div>

          <div className="p-3.5 rounded-2xl border border-border bg-card">
            <p className="text-[11px] font-medium text-stone-400">Incorrect</p>
            <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
              {stats.incorrect}
            </p>
            <p className="text-[10px] text-stone-400 mt-1">Review needed</p>
          </div>

          <div className="p-3.5 rounded-2xl border border-border bg-card">
            <p className="text-[11px] font-medium text-stone-400">Accuracy</p>
            <p className="text-xl font-black text-brand-600 mt-0.5">{stats.accuracy}%</p>
            <p className="text-[10px] text-stone-400 mt-1">Precision rate</p>
          </div>

          <div className="p-3.5 rounded-2xl border border-border bg-card">
            <p className="text-[11px] font-medium text-stone-400">Bookmarked</p>
            <p className="text-xl font-black text-amber-500 mt-0.5">{stats.bookmarked}</p>
            <p className="text-[10px] text-stone-400 mt-1">Saved for revision</p>
          </div>
        </div>
      </div>

      {/* ── Section B & C: PYQ Questions, Filters & Placeholders ─ */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Previous Year Questions (PYQs)
            </h3>
            {displayedQuestions.length > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {displayedQuestions.length} PYQs Active
              </span>
            )}
          </div>

          {/* Admin Upload PYQ Trigger */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-brand-300 dark:border-brand-700 text-brand-600 dark:text-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-950/50 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Upload PYQ Questions</span>
          </button>
        </div>

        {/* Question Filter Buttons with Smooth Sliding Spring Indicator */}
        <div className="p-1.5 rounded-2xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 inline-flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'years', label: 'Year-wise PYQs' },
            { id: 'difficulty', label: 'Difficulty' },
            { id: 'status', label: 'Status' },
          ].map((item) => {
            const isActive = activeFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveFilter(item.id as any);
                  if (item.id === 'all') {
                    setSelectedDifficulty('all');
                    setSelectedYear('all');
                  }
                }}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'text-white'
                    : 'text-stone-700 dark:text-stone-300 hover:text-foreground hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="gateQuestionFilterTab"
                    className="absolute inset-0 rounded-xl bg-brand-600 dark:bg-brand-500 shadow-md ring-1 ring-brand-400/30"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Secondary Filter Bar */}
        {activeFilter === 'years' && availableYears.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap p-3 rounded-2xl bg-card border border-border">
            <span className="text-xs font-bold text-stone-400">Exam Year:</span>
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                selectedYear === 'all' ? 'bg-brand-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              All Years
            </button>
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  selectedYear === yr ? 'bg-brand-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                GATE {yr}
              </button>
            ))}
          </div>
        )}

        {activeFilter === 'difficulty' && (
          <div className="flex items-center gap-2 flex-wrap p-3 rounded-2xl bg-card border border-border">
            <span className="text-xs font-bold text-stone-400">Difficulty:</span>
            {['all', 'easy', 'medium', 'hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize cursor-pointer ${
                  selectedDifficulty === diff ? 'bg-brand-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        )}

        {/* ── Real Questions OR Official Empty State Placeholder ── */}
        {filteredQuestions.length > 0 ? (
          <div className="space-y-3">
            {filteredQuestions.slice(0, 10).map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
                      Q{q.question_number || idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                      {q.question_type?.toUpperCase() || 'MCQ'}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">
                      GATE {q.year || '2024'} • {q.marks || 1} {q.marks === 1 ? 'Mark' : 'Marks'}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md capitalize bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    {q.difficulty}
                  </span>
                </div>

                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {q.question_text}
                </p>

                {q.options && q.options.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={opt.id || oIdx}
                        className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-background/50 text-xs"
                      >
                        <span className="w-5 h-5 rounded-md bg-stone-100 dark:bg-stone-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="text-foreground truncate">{opt.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {filteredQuestions.length > 10 && (
              <p className="text-xs text-center text-stone-400 py-2">
                Showing 10 of {filteredQuestions.length} available PYQ questions.
              </p>
            )}
          </div>
        ) : (
          /* Exact required empty state when no questions uploaded yet */
          <div className="p-8 sm:p-12 rounded-3xl border border-dashed border-border bg-card/50 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 dark:bg-stone-800/80 text-stone-400 mx-auto flex items-center justify-center">
              <BookOpen className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-foreground">
                No PYQs uploaded yet.
              </h4>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                Previous Year Questions for this chapter will appear here once available.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-foreground hover:opacity-90 shadow-sm transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Upload PYQ Questions</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Admin Upload Modal ───────────────────────────────── */}
      <UploadPYQModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        examName={`GATE ${paper.name} (${paper.code})`}
        subjectName={section.name}
        chapterName={chapter.name}
      />
    </div>
  );
}

