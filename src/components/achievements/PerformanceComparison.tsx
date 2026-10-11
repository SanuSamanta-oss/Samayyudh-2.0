'use client';

import React from 'react';
import { ArrowUpRight, TrendingUp, Sparkles, Trophy } from 'lucide-react';
import { PerformanceBadge } from './PerformanceBadge';

export interface PerformanceComparisonProps {
  previousPercentage: number;
  latestPercentage: number;
  examCategory: string;
  badgeTier?: string;
  earnedDate?: string;
  className?: string;
}

export function PerformanceComparison({
  previousPercentage,
  latestPercentage,
  examCategory,
  badgeTier = 'rising_star',
  earnedDate,
  className = '',
}: PerformanceComparisonProps) {
  const delta = Number((latestPercentage - previousPercentage).toFixed(1));
  const isPositive = delta > 0;

  return (
    <div className={`rounded-3xl border border-amber-300/40 dark:border-amber-900/40 bg-gradient-to-br from-card via-card to-amber-500/5 p-6 shadow-sm ${className}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Score Comparison Metrics */}
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              {examCategory} Category
            </span>
            {earnedDate && <span className="text-xs text-stone-400 font-medium">{earnedDate}</span>}
          </div>

          <div>
            <h4 className="text-xl font-extrabold text-foreground">
              Performance Growth Milestone
            </h4>
            <p className="text-xs text-stone-500 mt-1">
              Comparing your latest test with your previous attempt in this examination category.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-border">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Previous Test</span>
              <p className="text-lg font-black text-foreground mt-0.5">{previousPercentage}%</p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-border">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Latest Test</span>
              <p className="text-lg font-black text-foreground mt-0.5">{latestPercentage}%</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Improvement</span>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-0.5">
                <ArrowUpRight className="w-4 h-4" />
                <span>+{delta}%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Badge Illustration */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <PerformanceBadge
            tier={badgeTier}
            size="md"
            showLimbs={true}
            animate={true}
          />
          <span className="text-[11px] font-bold text-stone-500 mt-1">Earned Pin</span>
        </div>
      </div>
    </div>
  );
}
