'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Lock } from 'lucide-react';
import { AchievementDefinition, UserAchievement } from '@/types/achievements';
import { PerformanceBadge } from './PerformanceBadge';
import { StreakMedal } from './StreakMedal';

export interface AchievementCardProps {
  definition: AchievementDefinition;
  userAchievement?: UserAchievement;
  onClick?: () => void;
  className?: string;
}

export function AchievementCard({
  definition,
  userAchievement,
  onClick,
  className = '',
}: AchievementCardProps) {
  const isUnlocked = !!userAchievement;
  const isMedal = definition.visual_type === 'medal';

  const earnedDateStr = userAchievement
    ? new Date(userAchievement.earned_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`group relative rounded-3xl border transition-all duration-300 p-5 flex flex-col items-center text-center cursor-pointer ${
        isUnlocked
          ? 'bg-gradient-to-b from-card via-card to-amber-500/5 border-amber-300/40 dark:border-amber-900/40 shadow-sm hover:shadow-md hover:border-amber-400'
          : 'bg-card/60 border-border/70 hover:border-border opacity-70 hover:opacity-90'
      } ${className}`}
    >
      {/* Status Pill Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1">
        {isUnlocked ? (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>Unlocked</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 text-[10px] font-semibold">
            <Lock className="w-3 h-3" />
            <span>Locked</span>
          </span>
        )}
      </div>

      {/* Visual Badge Pin or Medal */}
      <div className="my-2 flex items-center justify-center min-h-[140px]">
        {isMedal ? (
          <StreakMedal
            tier={definition.badge_asset}
            milestoneDays={definition.threshold}
            isUnlocked={isUnlocked}
            size="md"
          />
        ) : (
          <PerformanceBadge
            tier={definition.badge_asset}
            title={definition.title}
            subtitle={definition.subtitle}
            isUnlocked={isUnlocked}
            size="md"
          />
        )}
      </div>

      {/* Title & Category */}
      <div className="w-full mt-2">
        <h4 className="text-base font-extrabold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {definition.title}
        </h4>
        {definition.subtitle && (
          <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mt-0.5">
            {definition.subtitle}
          </p>
        )}
        <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
          {definition.description}
        </p>
      </div>

      {/* Footer Info */}
      <div className="w-full mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-stone-400">
        <span className="capitalize font-semibold text-stone-500">
          {definition.rarity}
        </span>
        {earnedDateStr ? (
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <Calendar className="w-3 h-3" />
            {earnedDateStr}
          </span>
        ) : (
          <span>Target: {definition.threshold} {definition.category === 'streak' ? 'days' : definition.category === 'performance' ? '% improvement' : ''}</span>
        )}
      </div>
    </motion.div>
  );
}
