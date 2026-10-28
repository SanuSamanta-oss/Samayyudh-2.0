'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NEETQuestionSchema {
  id: string;
  subject: 'physics' | 'chemistry' | 'biology';
  chapter: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionText: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  yearAppeared?: string;
}

const subjectsConfig = [
  {
    id: 'physics',
    name: 'Physics MCQs',
    description: 'Mechanics, Electrodynamics, Optics, Thermodynamics, Modern Physics',
    targetCount: 'To be provided',
  },
  {
    id: 'chemistry',
    name: 'Chemistry MCQs',
    description: 'Physical Chemistry, Inorganic Chemistry, Organic Reaction Mechanisms',
    targetCount: 'To be provided',
  },
  {
    id: 'biology',
    name: 'Biology MCQs',
    description: 'Botany, Zoology, Genetics, Human Physiology, Ecology, Cell Biology',
    targetCount: 'To be provided',
  },
];

export function NeetPrepSection() {
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'physics' | 'chemistry' | 'biology'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  return (
    <div className="space-y-8">
      {/* Primary Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] p-6 md:p-10 shadow-xs"
      >
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/80 mb-4">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Dedicated Exam Staging Track</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            NEET Preparation
          </h2>

          <p className="mt-2 text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
            Important NEET questions, answers, and explanations will be added here soon.
          </p>

          <p className="mt-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
            The question staging engine is prepared to index questions across Physics, Chemistry, and Biology with structured answer keys and step-by-step explanations upon provision.
          </p>
        </div>
      </motion.div>

      {/* Filter and Sub-Track Selector Mockup */}
      <div className="p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              NEET Question Bank Architecture
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Select category and difficulty level to test the filter navigation.
            </p>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700">
            {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={cn(
                  'px-3 py-1 text-xs font-bold rounded-lg capitalize transition-all',
                  selectedDifficulty === diff
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Track Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjectsConfig.map((sub) => {
            const isSelected = selectedSubject === sub.id;
            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubject(isSelected ? 'all' : (sub.id as 'physics' | 'chemistry' | 'biology'))}
                className={cn(
                  'cursor-pointer rounded-2xl border p-4 transition-all',
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{sub.name}</h4>
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    {sub.targetCount}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal font-medium">
                  {sub.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Structural Empty State Placeholder Ready for Real Data */}
      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 md:p-12 text-center bg-slate-50/50 dark:bg-slate-950/30">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-200/50 dark:border-indigo-800/60">
          <BookOpen className="w-6 h-6" />
        </div>
        <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
          Awaiting Verified NEET Question Ingestion
        </h4>
        <p className="mt-1 text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto font-medium">
          No questions have been fabricated or inserted. When you provide the question bank, correct answer keys, and explanations, they will appear here organized by chapter and difficulty.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-bold">
          <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            Chapter-wise Classification
          </span>
          <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            Detailed Step Explanations
          </span>
          <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            Instant Solution Reveal
          </span>
          <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            Timed Practice Readiness
          </span>
        </div>
      </div>
    </div>
  );
}
