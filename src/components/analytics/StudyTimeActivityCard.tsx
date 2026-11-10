'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock, TrendingUp, Sparkles, Flame, Calendar,
  ChevronDown, BookOpen, Layers, CheckCircle2,
  Trophy, Star, Award, ShieldCheck, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActivityBarItem, ActivityPeriodType } from '@/lib/analytics/data-processor';

interface StudyTimeActivityCardProps {
  activityBars: ActivityBarItem[];
  totalHours: number;
  period: ActivityPeriodType;
  onPeriodChange: (p: ActivityPeriodType) => void;
  insightText: string;
  avgDailyMinutes: number;
  longestSessionMinutes: number;
  mostProductiveDay: string;
  currentStreakDays: number;
  accuracyPercent?: number;
  totalQuestions?: number;
  activeAppUsage: {
    practiceMinutes: number;
    examMinutes: number;
    formulaMinutes: number;
    reviewMinutes: number;
    generalMinutes: number;
    totalMinutes: number;
  };
}

/**
 * Study Activity & Progress Card
 * - Completely smooth: NO outlines, NO harsh borders
 * - Stacked rounded capsule bars with soft illumination
 * - Refined, slightly smaller text typography
 * - High-contrast legibility across both Dark and Light themes
 */
export function StudyTimeActivityCard({
  activityBars,
  totalHours,
  period,
  onPeriodChange,
  insightText,
  avgDailyMinutes,
  longestSessionMinutes,
  mostProductiveDay,
  currentStreakDays,
  accuracyPercent = 0,
  totalQuestions = 0,
  activeAppUsage,
}: StudyTimeActivityCardProps) {
  const [selectedBarKey, setSelectedBarKey] = useState<string | null>(null);

  // Modern palette for stacked segments
  const segmentColors = {
    practice: '#A78BFA', // Soft Purple
    exam: '#F472B6',     // Rose / Pink
    mock: '#FBBF24',     // Warm Amber / Peach
    revision: '#34D399', // Mint Green
  };

  const maxHours = Math.max(1, ...activityBars.map((b) => b.totalHours));

  const activeBar = selectedBarKey
    ? activityBars.find((b) => b.key === selectedBarKey)
    : activityBars.find((b) => b.isPeak) || activityBars[activityBars.length - 1];

  const displayHours = activeBar ? activeBar.totalHours : totalHours;

  return (
    <div className="p-5 sm:p-6 rounded-[32px] bg-white dark:bg-[#111A2E] shadow-sm space-y-5 transition-all">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. Header with Period Dropdown & Dynamic Insight Badge */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Study Activity & App Usage
          </span>
          <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              {displayHours}h
            </span>

            {/* Dynamic Insight Badge (Smooth, No Outline) */}
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
              <span>{insightText}</span>
            </div>
          </div>
        </div>

        {/* Segmented Rounded Pill Toggle (Smooth, No Outline) */}
        <div className="relative inline-flex p-1 rounded-2xl bg-stone-100 dark:bg-[#0c1322] self-start sm:self-auto shadow-xs">
          {(['daily', 'weekly', 'monthly'] as ActivityPeriodType[]).map((p) => {
            const isActive = period === p;
            return (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={cn(
                  'relative px-3 py-1 rounded-xl text-[11px] font-black transition-all capitalize cursor-pointer z-10',
                  isActive
                    ? 'text-white'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activityPeriodPillSmooth"
                    className="absolute inset-0 rounded-xl bg-stone-900 dark:bg-purple-600 shadow-xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{p}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. Vertically Stacked Rounded Capsule Bars (Smooth, No Outline) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="pt-2 pb-1">
        <div className="relative h-48 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-4">
          {/* Faint Guide Lines */}
          <div className="absolute inset-x-0 top-1/4 border-b border-stone-100/80 dark:border-stone-800/50 pointer-events-none" />
          <div className="absolute inset-x-0 top-2/4 border-b border-stone-100/80 dark:border-stone-800/50 pointer-events-none" />
          <div className="absolute inset-x-0 top-3/4 border-b border-stone-100/80 dark:border-stone-800/50 pointer-events-none" />

          {/* Activity Bars */}
          {activityBars.map((bar) => {
            const isSelected = activeBar?.key === bar.key;
            const heightPct = bar.totalHours > 0
              ? Math.max(18, Math.min(95, (bar.totalHours / maxHours) * 95))
              : 12;

            const pracPct = bar.totalHours > 0 ? (bar.practiceHours / bar.totalHours) * 100 : 40;
            const examPct = bar.totalHours > 0 ? (bar.examHours / bar.totalHours) * 100 : 30;
            const mockPct = bar.totalHours > 0 ? (bar.mockHours / bar.totalHours) * 100 : 15;
            const revPct = bar.totalHours > 0 ? (bar.revisionHours / bar.totalHours) * 100 : 15;

            return (
              <div
                key={bar.key}
                onClick={() => setSelectedBarKey(bar.key)}
                className="relative flex-1 flex flex-col items-center justify-end h-full cursor-pointer group"
              >
                {/* Outer Capsule (Smooth Soft Glow, No Outline) */}
                <div
                  className={cn(
                    'relative w-full max-w-[44px] rounded-2xl flex flex-col justify-end p-0.5 transition-all duration-300',
                    isSelected
                      ? 'bg-purple-100/70 dark:bg-purple-950/40 shadow-sm scale-102'
                      : 'hover:opacity-90'
                  )}
                  style={{ height: `${heightPct}%` }}
                >
                  {/* Inner Stacked Rounded Bar */}
                  <div className="w-full h-full rounded-[14px] overflow-hidden flex flex-col-reverse shadow-inner">
                    <div
                      style={{ height: `${pracPct}%`, backgroundColor: segmentColors.practice }}
                      className="w-full transition-all"
                      title={`Practice: ${bar.practiceHours.toFixed(1)}h`}
                    />
                    <div
                      style={{ height: `${examPct}%`, backgroundColor: segmentColors.exam }}
                      className="w-full transition-all"
                      title={`Exam: ${bar.examHours.toFixed(1)}h`}
                    />
                    <div
                      style={{ height: `${mockPct}%`, backgroundColor: segmentColors.mock }}
                      className="w-full transition-all"
                      title={`Mock: ${bar.mockHours.toFixed(1)}h`}
                    />
                    <div
                      style={{ height: `${revPct}%`, backgroundColor: segmentColors.revision }}
                      className="w-full transition-all"
                      title={`Revision: ${bar.revisionHours.toFixed(1)}h`}
                    />
                  </div>
                </div>

                {/* Bottom X-Axis Label Pill (Smooth, No Outline) */}
                <div className="mt-2.5">
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all font-mono',
                      isSelected
                        ? 'bg-stone-900 text-white dark:bg-purple-600 dark:text-white shadow-xs'
                        : 'text-stone-500 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white'
                    )}
                  >
                    {bar.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend for Stacked Bar Segments (Smooth, No Outline) */}
        <div className="flex items-center justify-center gap-4 sm:gap-5 flex-wrap mt-3 pt-2.5 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: segmentColors.practice }} />
            <span className="font-semibold text-stone-600 dark:text-stone-300">Practice</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: segmentColors.exam }} />
            <span className="font-semibold text-stone-600 dark:text-stone-300">Exams</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: segmentColors.mock }} />
            <span className="font-semibold text-stone-600 dark:text-stone-300">Mock Tests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: segmentColors.revision }} />
            <span className="font-semibold text-stone-600 dark:text-stone-300">Revision</span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. Rounded List Tabs (Smooth, No Outline) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="space-y-2 pt-1">
        {/* Item 1: Rating & Mastery */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/90 dark:bg-[#16233B] shadow-2xs hover:bg-stone-100/70 dark:hover:bg-[#1B2B48] transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900 dark:text-white">
                Rating & Accuracy Tier
              </p>
              <p className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">
                {accuracyPercent > 0 ? `${accuracyPercent}% accuracy benchmark` : 'Benchmark setting in progress'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-[#1F3050] text-[10px] font-mono font-bold text-stone-800 dark:text-stone-200 shadow-2xs">
            <Trophy className="w-3 h-3 text-amber-500" />
            <span>Top Tier</span>
          </div>
        </div>

        {/* Item 2: Practice Sessions */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/90 dark:bg-[#16233B] shadow-2xs hover:bg-stone-100/70 dark:hover:bg-[#1B2B48] transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 flex items-center justify-center shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900 dark:text-white">
                Practice Battles & PYQs
              </p>
              <p className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">
                {totalQuestions} total questions attempted
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-orange-500" />
            <span>{Math.round(activeAppUsage.practiceMinutes)}m</span>
          </span>
        </div>

        {/* Item 3: Examination Rhythm */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/90 dark:bg-[#16233B] shadow-2xs hover:bg-stone-100/70 dark:hover:bg-[#1B2B48] transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900 dark:text-white">
                Exam Cadence & Streak
              </p>
              <p className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">
                Peak: {mostProductiveDay} • {currentStreakDays} day streak
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{currentStreakDays}d</span>
          </span>
        </div>
      </div>
    </div>
  );
}
