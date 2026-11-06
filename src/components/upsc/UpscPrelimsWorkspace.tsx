'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronRight,
  Search,
  X,
  Swords,
  BookOpen,
  Award,
  Zap,
} from 'lucide-react';
import {
  UPSC_PRELIMS_PAPERS,
  UpscPaper,
  UpscTopic,
} from '@/data/upsc/upscSyllabus';

interface UpscPrelimsWorkspaceProps {
  onBackToStages: () => void;
  onSelectTopic: (topic: UpscTopic, paper: UpscPaper) => void;
  onStartPrelimsBattle: (topic: UpscTopic, paper: UpscPaper) => void;
}

export function UpscPrelimsWorkspace({
  onBackToStages,
  onSelectTopic,
  onStartPrelimsBattle,
}: UpscPrelimsWorkspaceProps) {
  const papers = UPSC_PRELIMS_PAPERS;
  const [activePaperId, setActivePaperId] = useState<string>(papers[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const activePaper = papers.find((p) => p.id === activePaperId) || papers[0];

  const filteredTopics = activePaper.topics.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── Top Bar ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <button
          onClick={onBackToStages}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-foreground transition-colors cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to UPSC Stages</span>
        </button>

        <button
          onClick={() => {
            if (activePaper.topics[0]) {
              onStartPrelimsBattle(activePaper.topics[0], activePaper);
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-brand hover:opacity-90 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Swords className="w-3.5 h-3.5" />
          <span>Practice Full {activePaper.code}</span>
        </button>
      </div>

      {/* ── Stage Banner ─────────────────────────────────────── */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-xs space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-lg text-xs font-black tracking-wider bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
            STAGE 1
          </span>
          <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-0.5 rounded-md border border-brand-200 dark:border-brand-800">
            OBJECTIVE SCREENING
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          UPSC CIVIL SERVICES — PRELIMINARY EXAMINATION
        </h1>

        <p className="text-xs sm:text-sm text-stone-500 max-w-2xl leading-relaxed">
          Screening test comprising two compulsory objective papers of 200 marks each. Marks in GS Paper I determine qualifying cutoff for Mains, while GS Paper II (CSAT) is qualifying with a minimum 33% threshold.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-surface/50 border border-border/80 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-foreground">General Studies Paper I</p>
              <p className="text-[11px] text-stone-400">100 Questions · 200 Marks · 2 Hours</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Cutoff Deciding
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface/50 border border-border/80 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-foreground">General Studies Paper II (CSAT)</p>
              <p className="text-[11px] text-stone-400">80 Questions · 200 Marks · 2 Hours</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Qualifying (33%)
            </span>
          </div>
        </div>
      </div>

      {/* ── Equal Balanced Paper Tabs (Same Size Requirement) ─ */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Select Prelims Paper
          </span>
          <span className="text-[11px] font-medium text-stone-400">
            {activePaper.topics.length} Syllabus Topics
          </span>
        </div>

        <div className="p-1.5 rounded-2xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 flex items-center gap-1.5 w-full">
          {papers.map((p) => {
            const isActive = p.id === activePaperId;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActivePaperId(p.id);
                  setSearchQuery('');
                }}
                className={`relative flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer text-center truncate ${
                  isActive
                    ? 'text-white'
                    : 'text-stone-700 dark:text-stone-300 hover:text-foreground hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="upscPrelimsActivePaperPill"
                    className="absolute inset-0 rounded-xl bg-brand-600 dark:bg-brand-500 shadow-md ring-1 ring-brand-400/30"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Search Bar ───────────────────────────────────────── */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activePaper.code} topics (e.g., Polity, Economy, Reasoning)...`}
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

      {/* ── Topic Cards Grid ─────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePaperId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic, activePaper)}
              className="group p-4 rounded-2xl border border-border bg-card hover:border-brand-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    TOPIC {topic.number}
                  </span>
                  <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 group-hover:underline flex items-center gap-0.5">
                    Explore PYQs <ChevronRight className="w-3 h-3" />
                  </span>
                </div>

                <h4 className="text-sm font-bold text-foreground group-hover:text-brand-600 transition-colors line-clamp-1">
                  {topic.name}
                </h4>

                {topic.description && (
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-400 font-medium">
                  Independent PYQ Bank
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartPrelimsBattle(topic, activePaper);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>Practice Battle</span>
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

