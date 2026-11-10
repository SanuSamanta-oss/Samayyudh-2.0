'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AnalyticsTimeRange } from '@/lib/analytics/data-processor';

interface AnalyticsHeaderProps {
  selectedRange: AnalyticsTimeRange;
  onRangeChange: (r: AnalyticsTimeRange) => void;
  dateRangeLabel: string;
  totalSessions: number;
  totalQuestions: number;
  avgAccuracy: number;
}

const TIME_RANGES: { key: AnalyticsTimeRange; label: string }[] = [
  { key: '7d', label: '7 Days' },
  { key: '14d', label: '14 Days' },
  { key: '30d', label: '30 Days' },
  { key: '3m', label: '3 Months' },
  { key: '6m', label: '6 Months' },
  { key: 'all', label: 'All Time' },
];

/**
 * Analytics Header (Smooth, No Outlines, Refined Sizing)
 */
export function AnalyticsHeader({
  selectedRange,
  onRangeChange,
  dateRangeLabel,
  totalSessions,
  totalQuestions,
  avgAccuracy,
}: AnalyticsHeaderProps) {
  let personalSummary = `Your academic performance across ${totalSessions} sessions (${totalQuestions} questions attempted).`;
  if (totalSessions === 0) {
    personalSummary = 'Begin your first battle to establish your benchmark accuracy and speed ratings.';
  } else if (avgAccuracy >= 75) {
    personalSummary = `Exceptional mastery! Maintaining ${avgAccuracy}% accuracy across ${totalQuestions} questions.`;
  } else if (avgAccuracy >= 50) {
    personalSummary = `Consistent progress across ${totalSessions} sessions with a solid ${avgAccuracy}% accuracy benchmark.`;
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pb-2">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
              Academic Analytics
            </h1>
          </div>
        </div>
        <p className="text-[11px] sm:text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
          {personalSummary}
        </p>
      </div>

      {/* Date Range Selector Segmented Track (Smooth, No Outlines) */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 self-start lg:self-auto">
        <div className="p-1 rounded-2xl bg-stone-100/90 dark:bg-[#0c1322] flex items-center gap-1 overflow-x-auto scrollbar-none shadow-xs">
          {TIME_RANGES.map((r) => {
            const isActive = selectedRange === r.key;
            return (
              <button
                key={r.key}
                onClick={() => onRangeChange(r.key)}
                className={cn(
                  'relative px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer z-10',
                  isActive
                    ? 'text-white'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="analyticsHeaderPillSmooth"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{r.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#16233B] text-[11px] font-semibold text-stone-600 dark:text-stone-300 shadow-2xs">
          <Calendar className="w-3 h-3 text-purple-500" />
          <span>{dateRangeLabel}</span>
        </div>
      </div>
    </div>
  );
}
