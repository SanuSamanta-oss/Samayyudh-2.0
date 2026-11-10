'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementJourneyCardProps {
  totalUnlocked: number;
  totalAvailable: number;
  latestBadge: {
    title: string;
    tier: string;
    description: string;
    earnedAt: string;
  } | null;
  progressPercent: number;
  nextBadgeGoal: string;
}

/**
 * Featured Achievement Showcase Card with torch-bearer scholar illustration
 * - Completely smooth: NO outlines, NO harsh borders on elements, text, or cards
 * - Features the scholar illustration filling the blank space
 * - Seamlessly styled for both dark and light themes
 * - Refined, slightly smaller text typography for a compact and clean aesthetic
 */
export function AchievementJourneyCard({
  totalUnlocked,
  totalAvailable,
  latestBadge,
  progressPercent,
  nextBadgeGoal,
}: AchievementJourneyCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative p-5 sm:p-6 rounded-[32px] overflow-hidden bg-gradient-to-br from-purple-100/70 via-indigo-50/40 to-white dark:from-[#1b1c3b] dark:via-[#131b2e] dark:to-[#0f172a] shadow-sm hover:shadow-md flex flex-col justify-between space-y-4"
    >
      {/* Decorative Ambient Warm Glows */}
      <div className="absolute top-1/3 right-1/4 w-52 h-52 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-44 h-44 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          {/* Integrated Rounded Pill Tab (Smooth, No Outline) */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-purple-950/70 text-purple-900 dark:text-purple-300 text-[11px] font-black shadow-xs">
            <Trophy className="w-3 h-3 text-amber-500 fill-amber-400" />
            <span>A Series of Battles</span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white tracking-tight leading-snug">
            Your Battle Honours
          </h3>

          <p className="text-[11px] sm:text-xs font-medium text-stone-600 dark:text-stone-300 leading-relaxed max-w-xs">
            {latestBadge
              ? `Recently achieved "${latestBadge.title}". Keep pushing forward to reach Grandmaster rank.`
              : 'Complete timed exam battles and hit accuracy milestones to earn medals from Bronze to Grandmaster.'}
          </p>
        </div>

        {/* Badge Milestone Counter Pill (Smooth, No Outline) */}
        <div className="px-3 py-1.5 rounded-2xl bg-white/80 dark:bg-[#18233C]/80 shadow-xs flex flex-col items-center justify-center shrink-0">
          <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />
          <span className="text-[10px] font-black font-mono text-purple-600 dark:text-purple-400 mt-0.5">
            {totalUnlocked}/{totalAvailable}
          </span>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* ILLUSTRATION: The Scholar with Blazing Torch (Seamlessly Merged) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="relative py-1 flex items-center justify-center overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]">
        {/* Soft Ambient Torch Flame Halo for Dark Mode */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-amber-500/25 via-orange-400/20 to-transparent blur-3xl dark:opacity-100 opacity-50" />
        </div>

        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 flex items-center justify-center"
        >
          {/* Light Theme Clean Illustration */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/analytics/torch_scholar_light.png"
            alt="Scholar carrying the torch of learning"
            className="dark:hidden h-44 sm:h-48 md:h-52 w-auto object-contain select-none pointer-events-none"
          />
          {/* Dark Theme Smooth Luminous Illustration */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/analytics/torch_scholar_dark.png"
            alt="Scholar carrying the torch of learning"
            className="hidden dark:block h-44 sm:h-48 md:h-52 w-auto object-contain select-none pointer-events-none drop-shadow-[0_4px_24px_rgba(245,158,11,0.25)]"
          />
        </motion.div>
      </div>

      {/* Progress Toward Next Milestone (Smooth, No Outline) */}
      <div className="relative space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>Next Rank Milestone</span>
          </span>
          <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
            {progressPercent}% Complete
          </span>
        </div>

        {/* Track Bar (Smooth, No Outline) */}
        <div className="h-2 rounded-full bg-stone-200/70 dark:bg-stone-800/80 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500"
          />
        </div>

        <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
          {nextBadgeGoal}
        </p>
      </div>

      {/* Card Action Link with Circular Arrow Button (Smooth, No Outline) */}
      <div className="relative pt-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300">
            {totalUnlocked} Badges Unlocked
          </span>
        </div>

        <Link
          href="/achievements"
          className="flex items-center gap-2 group cursor-pointer"
        >
          <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            View Badges
          </span>

          {/* Circular Button with Arrow (Smooth, No Outline) */}
          <div className="w-8 h-8 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-all">
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
