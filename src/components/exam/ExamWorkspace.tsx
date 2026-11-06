'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Swords,
  Atom,
  Calculator,
  FlaskConical,
  Leaf,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ExamSyllabusConfig, ChapterTopic, SubjectSyllabus } from '@/data/examSyllabus';
import { ChapterWorkspace } from './ChapterWorkspace';

const SUBJECT_ICON_MAP: Record<string, React.ReactNode> = {
  Atom: <Atom className="w-4 h-4" />,
  Calculator: <Calculator className="w-4 h-4" />,
  FlaskConical: <FlaskConical className="w-4 h-4" />,
  Leaf: <Leaf className="w-4 h-4" />,
};

interface ExamWorkspaceProps {
  syllabus: ExamSyllabusConfig;
  onBackToExamSelect: () => void;
  onSelectChapterForBattle: (chapter: ChapterTopic, subject: SubjectSyllabus) => void;
  onSelectSubjectForBattle: (subject: SubjectSyllabus) => void;
}

export function ExamWorkspace({
  syllabus,
  onBackToExamSelect,
  onSelectChapterForBattle,
  onSelectSubjectForBattle,
}: ExamWorkspaceProps) {
  // Current active subject tab
  const [activeSubjectId, setActiveSubjectId] = useState<string>(
    syllabus.subjects[0]?.id || ''
  );
  // Currently opened chapter (if student clicked into a specific chapter)
  const [selectedChapter, setSelectedChapter] = useState<ChapterTopic | null>(null);

  const activeSubject =
    syllabus.subjects.find((s) => s.id === activeSubjectId) || syllabus.subjects[0];

  // If viewing an individual chapter workspace
  if (selectedChapter && activeSubject) {
    return (
      <ChapterWorkspace
        examCode={syllabus.code}
        examName={syllabus.name}
        subjectName={activeSubject.name}
        chapter={selectedChapter}
        onBackToSubject={() => setSelectedChapter(null)}
        onStartBattle={(ch) => onSelectChapterForBattle(ch, activeSubject)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Top Header Navigation ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <button
          onClick={onBackToExamSelect}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-foreground transition-colors cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Choose Your Exam</span>
        </button>

        {/* Global Subject Battle Button */}
        <button
          onClick={() => onSelectSubjectForBattle(activeSubject)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-accent-600 hover:from-brand-500 hover:to-accent-500 shadow-lg shadow-brand-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer self-start sm:self-auto ring-1 ring-white/20"
        >
          <Swords className="w-4 h-4" />
          <span>Battle All {activeSubject.name}</span>
        </button>
      </div>

      {/* ── Examination Header Card ─────────────────────────── */}
      <div className="flex items-start gap-4 p-5 rounded-3xl border border-border bg-card shadow-xs">
        {syllabus.logo && (
          <Image
            src={syllabus.logo}
            alt={syllabus.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-2xl object-contain shrink-0 mt-0.5 border border-border"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {syllabus.name}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
              OFFICIAL SYLLABUS
            </span>
          </div>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">
            {syllabus.fullName}
          </p>
          <p className="text-xs text-stone-400 mt-1 leading-relaxed">
            {syllabus.description}
          </p>
        </div>
      </div>

      {/* ── Subject Navigation Tabs ─────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Select Core Subject
          </span>
          <span className="text-[11px] font-medium text-stone-400">
            {activeSubject.chapters.length} Chapters Available
          </span>
        </div>

        {/* The Primary Subject Tabs (Physics, Mathematics, Chemistry, Biology) */}
        <div className="p-1.5 rounded-2xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {syllabus.subjects.map((subj) => {
            const isActive = subj.id === activeSubjectId;
            return (
              <button
                key={subj.id}
                onClick={() => {
                  setActiveSubjectId(subj.id);
                  setSelectedChapter(null);
                }}
                className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer flex-1 justify-center shrink-0 ${
                  isActive
                    ? 'text-white'
                    : 'text-stone-700 dark:text-stone-300 hover:text-foreground hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="examActiveSubjectTab"
                    className="absolute inset-0 rounded-xl shadow-md ring-2 ring-white/20"
                    style={{ backgroundColor: subj.color }}
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{SUBJECT_ICON_MAP[subj.iconName]}</span>
                <span className="relative z-10">{subj.name}</span>
                <span
                  className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold transition-colors ${
                    isActive
                      ? 'bg-black/25 text-white'
                      : 'bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300/40 dark:border-stone-700/50'
                  }`}
                >
                  {subj.chapters.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Chapters Grid ───────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubjectId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeSubject.chapters.map((ch) => (
              <div
                key={ch.id}
                onClick={() => setSelectedChapter(ch)}
                className="group p-4 rounded-2xl border border-border bg-card hover:border-brand-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      CH {ch.number}
                    </span>
                    <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 group-hover:underline flex items-center gap-0.5">
                      Explore PYQs <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-brand-600 transition-colors line-clamp-1">
                    {ch.name}
                  </h4>
                  {ch.description && (
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {ch.description}
                    </p>
                  )}
                </div>

                {/* Card Action Row */}
                <div className="pt-3 mt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-400 font-medium">
                    PYQ Workspace Ready
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectChapterForBattle(ch, activeSubject);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>Battle</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

