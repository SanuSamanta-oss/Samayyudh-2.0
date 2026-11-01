'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Swords,
  Sparkles,
  Layers,
  CheckCircle2,
  Lock,
  Compass,
  FileText,
} from 'lucide-react';
import { GatePaper, GateSection, GateChapter, getGatePYQStats } from '@/data/gateSyllabus';
import { GateChapterWorkspace } from './GateChapterWorkspace';

interface GatePaperWorkspaceProps {
  paper: GatePaper;
  onBackToPaperList: () => void;
  onSelectChapterForBattle: (chapter: GateChapter, section: GateSection, paper: GatePaper) => void;
  onSelectSectionForBattle: (section: GateSection, paper: GatePaper) => void;
  onSelectEntirePaperForBattle: (paper: GatePaper) => void;
}

export function GatePaperWorkspace({
  paper,
  onBackToPaperList,
  onSelectChapterForBattle,
  onSelectSectionForBattle,
  onSelectEntirePaperForBattle,
}: GatePaperWorkspaceProps) {
  // Current active section tab
  const [activeSectionId, setActiveSectionId] = useState<string>(
    paper.sections[0]?.id || 'ga'
  );

  // Active individual chapter if opened
  const [selectedChapter, setSelectedChapter] = useState<GateChapter | null>(null);

  const activeSection =
    paper.sections.find((s) => s.id === activeSectionId) || paper.sections[0];

  const pyqStats = getGatePYQStats(paper.code);

  // If viewing an individual chapter workspace
  if (selectedChapter && activeSection) {
    return (
      <GateChapterWorkspace
        paper={paper}
        section={activeSection}
        chapter={selectedChapter}
        onBackToPaper={() => setSelectedChapter(null)}
        onStartBattle={(ch, sec) => onSelectChapterForBattle(ch, sec, paper)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Top Header Navigation ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <button
          onClick={onBackToPaperList}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-foreground transition-colors cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All GATE Papers</span>
        </button>

        {/* Global Paper Battle CTA */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => onSelectSectionForBattle(activeSection, paper)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-200 bg-card border border-border hover:border-brand-300 shadow-xs transition-all cursor-pointer"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Battle {activeSection.name}</span>
          </button>

          <button
            onClick={() => onSelectEntirePaperForBattle(paper)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-brand hover:opacity-90 shadow-sm transition-all cursor-pointer"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Full Paper Battle ({paper.code})</span>
          </button>
        </div>
      </div>

      {/* ── Paper Header Card ─────────────────────────────────── */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-xs space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-400">
          <div className="w-5 h-5 rounded-md overflow-hidden bg-white dark:bg-stone-950 p-0.5 border border-border shrink-0">
            <Image
              src="/logos/gate.png"
              alt="GATE"
              width={20}
              height={20}
              className="w-full h-full object-contain"
            />
          </div>
          <span>GATE</span>
          <span>/</span>
          <span className="text-foreground font-bold">{paper.name}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-lg text-xs font-black tracking-wider bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
                PAPER CODE: {paper.code}
              </span>
              <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-0.5 rounded-md border border-brand-200 dark:border-brand-800">
                GATE 2026 OFFICIAL PATTERN
              </span>
              {pyqStats.hasQuestions && (
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  {pyqStats.totalPYQs} PYQs Active
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight pt-1">
              {paper.name.toUpperCase()}
            </h1>

            <p className="text-xs sm:text-sm text-stone-500 max-w-2xl leading-relaxed">
              {paper.description}
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-background/50 border border-border shrink-0 self-start sm:self-auto text-xs">
            <div>
              <p className="text-stone-400 font-medium">Total Duration</p>
              <p className="font-bold text-foreground">180 Minutes (3 Hrs)</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="text-stone-400 font-medium">Total Marks</p>
              <p className="font-bold text-foreground">100 Marks (65 Qs)</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Paper Section Navigation Tabs ─────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Paper Sections &amp; Syllabi ({paper.sections.length} Sections)
          </h2>
          <span className="text-[11px] text-stone-500 dark:text-stone-400">
            Click any section to browse its chapters
          </span>
        </div>

        {/* Smooth Horizontal Segmented Tabs Track */}
        <div className="p-1.5 rounded-2xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {paper.sections.map((sec) => {
            const isActive = sec.id === activeSection.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`relative px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'text-white'
                    : 'text-stone-700 dark:text-stone-300 hover:text-foreground hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="gateActiveSectionTab"
                    className="absolute inset-0 rounded-xl bg-brand-600 dark:bg-brand-500 shadow-md ring-1 ring-brand-400/30"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{sec.name}</span>

                {sec.marksAllocation && (
                  <span
                    className={`relative z-10 text-[10px] px-2 py-0.5 rounded-md font-bold tracking-tight transition-colors ${
                      isActive
                        ? 'bg-black/25 text-white'
                        : 'bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-300/40 dark:border-stone-700/60'
                    }`}
                  >
                    {sec.marksAllocation}
                  </span>
                )}

                {sec.isCompulsory ? (
                  <span
                    className={`relative z-10 text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider transition-colors ${
                      isActive
                        ? 'bg-emerald-300 text-emerald-950 shadow-2xs'
                        : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    Compulsory
                  </span>
                ) : (
                  <span
                    className={`relative z-10 text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider transition-colors ${
                      isActive
                        ? 'bg-amber-300 text-amber-950 shadow-2xs'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    Optional
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Section Banner ─────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-2xl border border-border bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">
                {activeSection.name}
              </h3>
              {activeSection.marksAllocation && (
                <span className="text-[11px] font-bold text-brand-600">
                  • {activeSection.marksAllocation}
                </span>
              )}
            </div>
            {activeSection.description && (
              <p className="text-xs text-stone-500 max-w-2xl leading-relaxed">
                {activeSection.description}
              </p>
            )}
          </div>

          <button
            onClick={() => onSelectSectionForBattle(activeSection, paper)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Practice This Section</span>
          </button>
        </motion.div>
      </AnimatePresence>

      {/* ── Chapters Grid ─────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Syllabus Units & Chapters ({activeSection.chapters.length} Chapters)
          </h3>
          <span className="text-xs text-stone-400">
            All chapters individually clickable
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {activeSection.chapters.map((ch) => (
            <div
              key={ch.id}
              className="p-4 sm:p-5 rounded-2xl border border-border bg-card hover:border-brand-300 hover:shadow-xs transition-all flex flex-col justify-between group space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                    CHAPTER {ch.number}
                  </span>

                  {pyqStats.hasQuestions && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      PYQs Available
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-foreground group-hover:text-brand-600 transition-colors">
                  {ch.name}
                </h4>

                {ch.description && (
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {ch.description}
                  </p>
                )}

                {ch.subtopics && ch.subtopics.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {ch.subtopics.slice(0, 3).map((sub) => (
                      <span
                        key={sub}
                        className="text-[10px] px-2 py-0.5 rounded bg-background border border-border text-stone-500"
                      >
                        {sub}
                      </span>
                    ))}
                    {ch.subtopics.length > 3 && (
                      <span className="text-[10px] text-stone-400">
                        +{ch.subtopics.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                <button
                  onClick={() => setSelectedChapter(ch)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-300 bg-background hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Explore PYQs</span>
                </button>

                <button
                  onClick={() => onSelectChapterForBattle(ch, activeSection, paper)}
                  className="inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-foreground hover:opacity-90 shadow-2xs transition-all cursor-pointer"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Battle</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

