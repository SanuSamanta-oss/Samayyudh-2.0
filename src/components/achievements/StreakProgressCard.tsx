'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, Calendar, ChevronRight, Settings } from 'lucide-react';
import { UserStreak } from '@/types/achievements';

export interface StreakProgressCardProps {
  streak: UserStreak;
  onOpenSettings?: () => void;
  className?: string;
}

export function StreakProgressCard({
  streak,
  onOpenSettings,
  className = '',
}: StreakProgressCardProps) {
  const current = streak.current_streak || 0;
  const goal = streak.selected_goal_days || 7;
  const progressPercent = Math.min(100, Math.round((current / goal) * 100));
  const remaining = Math.max(0, goal - current);

  // Milestone list
  const nextMilestones = [3, 7, 20, 30, 50, 100];
  const nextMilestone = nextMilestones.find(m => m > current) || 100;
  const daysToMilestone = Math.max(0, nextMilestone - current);

  return (
    <div className={`rounded-3xl border border-amber-200/60 dark:border-amber-900/40 bg-gradient-to-br from-card via-card to-amber-500/5 p-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, -6, 6, 0],
              }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <Flame className="w-6 h-6 fill-amber-500" />
            </motion.div>
          </div>
          <div>
            <h3 className="font-extrabold text-foreground text-lg">Daily Streak Challenge</h3>
            <p className="text-xs text-stone-500">
              Personal Goal: <span className="font-bold text-amber-600 dark:text-amber-400">{goal} Days</span>
            </p>
          </div>
        </div>

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Customize Goal</span>
          </button>
        )}
      </div>

      {/* Main Counter & Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Current Streak */}
        <div className="flex flex-col justify-center p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Active Streak</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">{current}</span>
            <span className="text-sm font-semibold text-stone-500">consecutive days</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Longest recorded: <strong className="text-stone-700 dark:text-stone-300">{streak.longest_streak || current} days</strong>
          </p>
        </div>

        {/* Goal Status */}
        <div className="flex flex-col justify-center p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-border">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">To Selected Goal</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-foreground">
              {remaining === 0 ? 'Goal Met!' : `${remaining}`}
            </span>
            {remaining > 0 && <span className="text-sm font-semibold text-stone-500">days left</span>}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Target: {goal} days ({progressPercent}% achieved)
          </p>
        </div>

        {/* Next Tier Medal */}
        <div className="flex flex-col justify-center p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-border">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Next Medal Milestone</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-foreground">{daysToMilestone}</span>
            <span className="text-sm font-semibold text-stone-500">days away</span>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
            Next unlock at {nextMilestone} days
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-stone-600 dark:text-stone-400">Progress to {goal}-Day Goal</span>
          <span className="text-amber-600 dark:text-amber-400">{progressPercent}%</span>
        </div>
        <div className="h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-sm"
          />
        </div>
        <p className="text-xs text-stone-500 text-center mt-2">
          {remaining === 0
            ? '🎉 Congratulations! You reached your streak goal! Challenge yourself with a higher target.'
            : `Complete 1 mock test every day to maintain your streak. Missing a day resets the counter.`}
        </p>
      </div>
    </div>
  );
}
