'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  User,
  ShieldAlert,
  Mic,
  FileText,
  Save,
  CheckCircle2,
  Clock,
  HelpCircle,
  Sparkles,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import {
  UPSC_INTERVIEW_SECTIONS,
  UpscInterviewSection,
} from '@/data/upsc/upscSyllabus';

interface UpscInterviewWorkspaceProps {
  onBackToStages: () => void;
}

export function UpscInterviewWorkspace({ onBackToStages }: UpscInterviewWorkspaceProps) {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'DAF' | 'AWARENESS' | 'SITUATIONAL' | 'PRACTICE'>('ALL');
  const [selectedSection, setSelectedSection] = useState<UpscInterviewSection | null>(null);
  const [privateNotes, setPrivateNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  // Mock interview timer state
  const [timerSeconds, setTimerSeconds] = useState(1800); // 30 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const filteredSections = UPSC_INTERVIEW_SECTIONS.filter(
    (s) => activeCategory === 'ALL' || s.category === activeCategory
  );

  const handleSaveNotes = () => {
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

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

        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-400 font-medium">Stage 3:</span>
          <span className="font-bold text-foreground">Personality Test · 275 Marks</span>
        </div>
      </div>

      {/* ── Stage 3 Banner ───────────────────────────────────── */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-xs space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-lg text-xs font-black tracking-wider bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
            STAGE 3
          </span>
          <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-0.5 rounded-md border border-brand-200 dark:border-brand-800">
            FINAL PERSONALITY ASSESSMENT
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            UPSC CIVIL SERVICES — PERSONALITY TEST / INTERVIEW
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-3xl leading-relaxed mt-1">
            The candidate will be interviewed by a Board who will have before them a record of his/her career. The object of the interview is to assess the personal suitability of the candidate for a career in public service by a Board of competent and unbiased observers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-surface/50 border border-border/80 text-xs">
            <p className="text-[11px] font-bold text-stone-400">Total Marks</p>
            <p className="text-lg font-black text-foreground mt-0.5">275 Marks</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Added to Mains total for final merit rank</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface/50 border border-border/80 text-xs">
            <p className="text-[11px] font-bold text-stone-400">Assessment Pillars</p>
            <p className="text-lg font-black text-foreground mt-0.5">Mental Alertness</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Critical assimilation, balance of judgement, leadership</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface/50 border border-border/80 text-xs">
            <p className="text-[11px] font-bold text-stone-400">Board Dynamics</p>
            <p className="text-lg font-black text-foreground mt-0.5">Dholpur House Board</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Interactive, purposeful discussion (not cross-examination)</p>
          </div>
        </div>
      </div>

      {/* ── Category Filter Tabs (Equal Balanced Size) ───────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Interview Modules
          </span>
          <span className="text-[11px] font-medium text-stone-400">
            {filteredSections.length} Preparation Areas
          </span>
        </div>

        <div className="p-1.5 rounded-2xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 flex items-center gap-1.5 w-full overflow-x-auto scrollbar-none">
          {[
            { id: 'ALL', label: 'All Modules' },
            { id: 'DAF', label: 'DAF & Background' },
            { id: 'AWARENESS', label: 'National & Global' },
            { id: 'SITUATIONAL', label: 'Situational & Ethics' },
            { id: 'PRACTICE', label: 'Mock Practice' },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`relative flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center truncate shrink-0 ${
                  isActive
                    ? 'text-white'
                    : 'text-stone-700 dark:text-stone-300 hover:text-foreground hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="upscInterviewCatPill"
                    className="absolute inset-0 rounded-xl bg-brand-600 dark:bg-brand-500 shadow-md ring-1 ring-brand-400/30"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section Cards Grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredSections.map((sec) => (
          <div
            key={sec.id}
            onClick={() => setSelectedSection(sec)}
            className="group p-4 rounded-2xl border border-border bg-card hover:border-brand-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                  MODULE {sec.number}
                </span>
                <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 group-hover:underline flex items-center gap-0.5">
                  Prepare Questions <ChevronRight className="w-3 h-3" />
                </span>
              </div>

              <h4 className="text-sm font-bold text-foreground group-hover:text-brand-600 transition-colors line-clamp-1">
                {sec.name}
              </h4>

              <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                {sec.description}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-stone-400 font-medium">
                DAF Personal Safe
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-600">
                <FileText className="w-3 h-3" />
                <span>Open Workspace</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Active Module Interactive Scratchpad Modal ──────── */}
      <AnimatePresence>
        {selectedSection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSection(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-5 border-b border-border flex items-center justify-between bg-surface/50">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                    Interview Preparation Workspace
                  </span>
                  <h3 className="text-lg font-black text-foreground mt-0.5">
                    {selectedSection.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSection(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
                  <p className="font-bold text-foreground">Board Perspective</p>
                  <p className="text-stone-500 leading-relaxed">{selectedSection.description}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-500 font-bold">
                    Private Preparation Notes &amp; Anticipated Board Questions
                  </label>
                  <textarea
                    rows={8}
                    value={privateNotes}
                    onChange={(e) => setPrivateNotes(e.target.value)}
                    placeholder="Enter key points you wish to articulate when questioned on this area:
- Personal rationale for civil services
- Stance on controversial state policy
- Practical solutions to district-level implementation hurdles
- Constitutional principles supporting your viewpoint..."
                    className="w-full p-3.5 rounded-xl border border-border bg-surface text-foreground placeholder:text-stone-400 leading-relaxed font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-[11px] text-stone-400">
                    Confidential &middot; Stored locally in your private safe
                  </span>
                  <button
                    onClick={handleSaveNotes}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-brand shadow-sm hover:opacity-90 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{notesSaved ? 'Saved to Safe!' : 'Save Notes'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

