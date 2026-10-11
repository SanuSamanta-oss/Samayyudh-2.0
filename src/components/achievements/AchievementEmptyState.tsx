'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { PerformanceBadge } from './PerformanceBadge';

export interface AchievementEmptyStateProps {
  onStartExam?: () => void;
  className?: string;
}

export function AchievementEmptyState({
  onStartExam,
  className = '',
}: AchievementEmptyStateProps) {
  return (
    <div className={`rounded-3xl border border-dashed border-border bg-card/60 p-8 md:p-12 text-center flex flex-col items-center justify-center ${className}`}>
      {/* Illustrative Preview of the cute First Step Pin */}
      <div className="relative mb-5">
        <PerformanceBadge
          tier="first_step"
          title="FIRST STEP"
          subtitle="YOUR FIRST BADGE"
          size="lg"
          isUnlocked={true}
          showLimbs={true}
        />
        <div className="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Awaits You!</span>
        </div>
      </div>

      <h3 className="text-xl md:text-2xl font-black text-foreground mb-2">
        Start Your Achievement Journey
      </h3>
      <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed mb-6">
        Complete your first mock test to immediately unlock the <strong>First Step</strong> golden shield pin, establish your baseline percentage, and ignite your daily streak!
      </p>

      {onStartExam ? (
        <button
          onClick={onStartExam}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-brand text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:opacity-95 transition-opacity"
        >
          <Trophy className="w-4 h-4" />
          <span>Take a Mock Test</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <Link
          href="/practice"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-brand text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:opacity-95 transition-opacity"
        >
          <Trophy className="w-4 h-4" />
          <span>Take a Mock Test</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

export function AchievementSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-64 rounded-3xl bg-stone-100 dark:bg-stone-900 border border-border" />
      ))}
    </div>
  );
}
