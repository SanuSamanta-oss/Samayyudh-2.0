'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  X,
  Swords,
  CheckCircle2,
} from 'lucide-react';
import {
  GATE_CATEGORY_TABS,
  GateCategoryKey,
  GatePaper,
  GateSection,
  GateChapter,
  getAllGatePapers,
  getGatePYQStats,
} from '@/data/gateSyllabus';
import { GatePaperWorkspace } from './GatePaperWorkspace';

interface GateLandingPageProps {
  onBackToExamSelect: () => void;
  onSelectChapterForBattle: (chapter: GateChapter, section: GateSection, paper: GatePaper) => void;
  onSelectSectionForBattle: (section: GateSection, paper: GatePaper) => void;
  onSelectPaperForBattle: (paper: GatePaper) => void;
  initialPaperCode?: string | null;
}

export function GateLandingPage({
  onBackToExamSelect,
  onSelectChapterForBattle,
  onSelectSectionForBattle,
  onSelectPaperForBattle,
  initialPaperCode,
}: GateLandingPageProps) {
  const [activeCategory, setActiveCategory] = useState<GateCategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // All 30 papers
  const allPapers = useMemo(() => getAllGatePapers(), []);

  // Selected paper state for the dedicated workspace
  const [activePaper, setActivePaper] = useState<GatePaper | null>(() => {
    if (initialPaperCode) {
      const cleaned = initialPaperCode.toUpperCase().replace(/^GATE-?/, '');
      return allPapers.find((p) => p.code === cleaned || p.code === initialPaperCode) || null;
    }
    return null;
  });

  // Filter papers by category tab and search query
  const filteredPapers = useMemo(() => {
    return allPapers.filter((p) => {
      // Category filter
      if (activeCategory !== 'all' && p.category !== activeCategory) {
        return false;
      }
      // Search filter (searches paper name, paper code, and historical sessions)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCode = p.code.toLowerCase().includes(q);
        const matchesSessions = p.historicalSessions?.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesCode && !matchesSessions) {
          return false;
        }
      }
      return true;
    });
  }, [allPapers, activeCategory, searchQuery]);

  // If a paper workspace is open, render dedicated paper dashboard
  if (activePaper) {
    return (
      <GatePaperWorkspace
        paper={activePaper}
        onBackToPaperList={() => setActivePaper(null)}
        onSelectChapterForBattle={onSelectChapterForBattle}
        onSelectSectionForBattle={onSelectSectionForBattle}
        onSelectEntirePaperForBattle={onSelectPaperForBattle}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Top Header Navigation ────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-border">
        <button
          onClick={onBackToExamSelect}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Choose Your Exam</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            30 Official GATE Papers
          </span>
        </div>
      </div>

      {/* ── Main GATE Title & Subtitle Banner Card ───────────── */}
      <div className="flex items-start gap-4 p-5 rounded-3xl border border-border bg-card shadow-xs">
        <div className="w-12 h-12 rounded-2xl border border-border overflow-hidden shrink-0 mt-0.5 bg-white dark:bg-stone-950 p-1 flex items-center justify-center">
          <Image
            src="/logos/gate.png"
            alt="GATE"
            width={48}
            height={48}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black tracking-wider bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
              GATE 2026
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
              OFFICIAL EXAM ARCHITECTURE
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight pt-1">
            GATE — Graduate Aptitude Test in Engineering
          </h1>

          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl leading-relaxed mt-0.5">
            Choose your engineering, science or interdisciplinary paper to start practicing.
          </p>
        </div>
      </div>

      {/* ── Search Branch Bar ─────────────────────────────────── */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search branch by name or code (e.g. CS, Mechanical, AE)..."
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-card border border-border text-xs sm:text-sm text-foreground placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Smooth Horizontal Category Navigation Tabs ─────────── */}
      <div className="space-y-2">
        <div className="p-1.5 rounded-2xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {GATE_CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`relative px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'text-white'
                    : 'text-stone-700 dark:text-stone-300 hover:text-foreground hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="gateCategoryActiveTab"
                    className="absolute inset-0 rounded-xl bg-brand-600 dark:bg-brand-500 shadow-md ring-1 ring-brand-400/30"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Branch / Paper Cards Grid ─────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
          <span>Showing {filteredPapers.length} of {allPapers.length} Papers</span>
          {searchQuery && (
            <span className="text-brand-600 font-bold">Filtered by &quot;{searchQuery}&quot;</span>
          )}
        </div>

        {filteredPapers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredPapers.map((paper) => {
              const pyqStats = getGatePYQStats(paper.code);
              const totalChapters = paper.sections.reduce(
                (sum, sec) => sum + sec.chapters.length,
                0
              );

              return (
                <div
                  key={paper.code}
                  onClick={() => setActivePaper(paper)}
                  className="p-5 rounded-2xl border border-border bg-card hover:border-brand-300 hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer space-y-4"
                >
                  <div className="space-y-2.5">
                    {/* Header with paper code badge - NO EMOJIS */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black tracking-wider bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
                        {paper.code}
                      </span>

                      {pyqStats.hasQuestions ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {pyqStats.totalPYQs} PYQs Ready
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500">
                          Syllabus Ready
                        </span>
                      )}
                    </div>

                    {/* Paper Name */}
                    <div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-brand-600 transition-colors leading-snug">
                        {paper.name} ({paper.code})
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                        {paper.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Metadata & Open Paper */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2 text-xs">
                    <span className="text-stone-400 font-medium">
                      {totalChapters} Chapters • {paper.sections.length} Sections
                    </span>

                    <span className="inline-flex items-center gap-1 font-bold text-brand-600 group-hover:translate-x-0.5 transition-transform">
                      <span>Open Paper</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card/40 space-y-2">
            <p className="text-sm font-bold text-foreground">No GATE papers match your search.</p>
            <p className="text-xs text-stone-400">
              Try searching with another branch name or clearing the search query.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="text-xs font-bold text-brand-600 hover:underline pt-2 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

