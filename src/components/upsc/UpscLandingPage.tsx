'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Award,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  UpscPaper,
  UpscTopic,
  UPSC_PRELIMS_PAPERS,
  UPSC_MAINS_PAPERS,
} from '@/data/upsc/upscSyllabus';
import { UpscPrelimsWorkspace } from './UpscPrelimsWorkspace';
import { UpscMainsWorkspace } from './UpscMainsWorkspace';
import { UpscInterviewWorkspace } from './UpscInterviewWorkspace';
import { UpscTopicWorkspace } from './UpscTopicWorkspace';

export type UpscStage = 'OVERVIEW' | 'PRELIMS' | 'MAINS' | 'INTERVIEW';

interface UpscLandingPageProps {
  onBackToExamSelect: () => void;
  onSelectTopicForBattle?: (topic: UpscTopic, paper: UpscPaper) => void;
}

export function UpscLandingPage({
  onBackToExamSelect,
  onSelectTopicForBattle,
}: UpscLandingPageProps) {
  const [activeStage, setActiveStage] = useState<UpscStage>('OVERVIEW');
  const [activeTopic, setActiveTopic] = useState<{ topic: UpscTopic; paper: UpscPaper; stageName: string } | null>(null);

  // If viewing a dedicated Topic PYQ / Descriptive workspace
  if (activeTopic) {
    return (
      <UpscTopicWorkspace
        stageName={activeTopic.stageName}
        paper={activeTopic.paper}
        topic={activeTopic.topic}
        onBackToPaper={() => setActiveTopic(null)}
        onStartBattle={(t) => {
          if (onSelectTopicForBattle) {
            onSelectTopicForBattle(t, activeTopic.paper);
          }
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Top Navigation Bar ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <button
          onClick={onBackToExamSelect}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-foreground transition-colors cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Choose Your Exam</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Civil Services Examination Architecture
          </span>
        </div>
      </div>

      {/* ── Examination Header Card ───────────────────────────── */}
      <div className="flex items-start gap-4 p-5 rounded-3xl border border-border bg-card shadow-xs">
        <div className="w-12 h-12 rounded-2xl border border-border overflow-hidden shrink-0 mt-0.5 bg-white dark:bg-stone-950 p-1 flex items-center justify-center">
          <Image
            src="/logos/upsc.jpg"
            alt="UPSC"
            width={48}
            height={48}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              UPSC — Union Public Service Commission
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
              OFFICIAL 3-STAGE EXAMINATION
            </span>
          </div>

          <p className="text-xs font-semibold text-stone-500 mt-0.5">
            Civil Services Examination (CSE)
          </p>

          <p className="text-xs text-stone-400 mt-1 leading-relaxed">
            Prepare for Civil Services. Build knowledge. Develop analytical thinking.
          </p>
        </div>
      </div>

      {/* ── Stage Navigation Tabs (Equal Balanced Size Requirement) ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Examination Stages
          </span>
          <span className="text-[11px] font-medium text-stone-400">
            3 Progressive Assessments
          </span>
        </div>

        <div className="p-1.5 rounded-2xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 flex items-center gap-1.5 w-full">
          {[
            { id: 'OVERVIEW', label: 'Stages Overview' },
            { id: 'PRELIMS', label: 'Preliminary' },
            { id: 'MAINS', label: 'Main Examination' },
            { id: 'INTERVIEW', label: 'Interview' },
          ].map((tab) => {
            const isActive = activeStage === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStage(tab.id as UpscStage)}
                className={`relative flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer text-center truncate ${
                  isActive
                    ? 'text-white'
                    : 'text-stone-700 dark:text-stone-300 hover:text-foreground hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="upscStageTabPill"
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

      {/* ── Stage Content Container ──────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeStage === 'OVERVIEW' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* 3 Large Examination Stage Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Preliminary Examination */}
              <div
                onClick={() => setActiveStage('PRELIMS')}
                className="group p-6 rounded-3xl border border-border bg-card hover:border-brand-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    Stage 1 · Screening
                  </span>

                  <h3 className="text-lg font-black text-foreground group-hover:text-brand-600 transition-colors">
                    Preliminary Examination
                  </h3>

                  <p className="text-xs text-stone-500 leading-relaxed">
                    Objective-based screening examination covering General Studies and CSAT.
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-border/70 text-xs">
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Papers:</span>
                    <span className="font-bold text-foreground">GS Paper I &amp; CSAT</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Format:</span>
                    <span className="font-bold text-foreground">Objective (OMR)</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Marks:</span>
                    <span className="font-bold text-foreground">400 Marks Total</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Start Preparation</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* 2. Main Examination */}
              <div
                onClick={() => setActiveStage('MAINS')}
                className="group p-6 rounded-3xl border border-border bg-card hover:border-brand-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                    Stage 2 · Written Test
                  </span>

                  <h3 className="text-lg font-black text-foreground group-hover:text-brand-600 transition-colors">
                    Main Examination
                  </h3>

                  <p className="text-xs text-stone-500 leading-relaxed">
                    Descriptive examination covering Essay, General Studies, Optional Subjects and qualifying language papers.
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-border/70 text-xs">
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Papers:</span>
                    <span className="font-bold text-foreground">9 Papers (7 Merit + 2 Qual.)</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Format:</span>
                    <span className="font-bold text-foreground">Subjective / Essay</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Marks:</span>
                    <span className="font-bold text-foreground">1750 Merit Marks</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Start Preparation</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* 3. Personality Test / Interview */}
              <div
                onClick={() => setActiveStage('INTERVIEW')}
                className="group p-6 rounded-3xl border border-border bg-card hover:border-brand-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                    Stage 3 · Personality
                  </span>

                  <h3 className="text-lg font-black text-foreground group-hover:text-brand-600 transition-colors">
                    Personality Test / Interview
                  </h3>

                  <p className="text-xs text-stone-500 leading-relaxed">
                    Prepare for the final assessment of personality, decision-making and general awareness.
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-border/70 text-xs">
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Conducted By:</span>
                    <span className="font-bold text-foreground">UPSC Interview Board</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Format:</span>
                    <span className="font-bold text-foreground">DAF-Based Oral Assessment</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Marks:</span>
                    <span className="font-bold text-foreground">275 Marks</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Start Preparation</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeStage === 'PRELIMS' && (
          <motion.div
            key="prelims"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <UpscPrelimsWorkspace
              onBackToStages={() => setActiveStage('OVERVIEW')}
              onSelectTopic={(topic, paper) =>
                setActiveTopic({ topic, paper, stageName: 'Preliminary Examination' })
              }
              onStartPrelimsBattle={(topic, paper) => {
                if (onSelectTopicForBattle) {
                  onSelectTopicForBattle(topic, paper);
                }
              }}
            />
          </motion.div>
        )}

        {activeStage === 'MAINS' && (
          <motion.div
            key="mains"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <UpscMainsWorkspace
              onBackToStages={() => setActiveStage('OVERVIEW')}
              onSelectTopic={(topic, paper) =>
                setActiveTopic({ topic, paper, stageName: 'Main Examination' })
              }
            />
          </motion.div>
        )}

        {activeStage === 'INTERVIEW' && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <UpscInterviewWorkspace
              onBackToStages={() => setActiveStage('OVERVIEW')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

