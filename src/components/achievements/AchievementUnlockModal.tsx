'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Award, ArrowRight } from 'lucide-react';
import { AchievementDefinition, UserAchievement } from '@/types/achievements';
import { PerformanceBadge } from './PerformanceBadge';
import { StreakMedal } from './StreakMedal';

export interface AchievementUnlockModalProps {
  unlockedItem: {
    achievement: AchievementDefinition;
    record: UserAchievement;
  } | null;
  onClose: () => void;
  onViewCollection?: () => void;
}

export function AchievementUnlockModal({
  unlockedItem,
  onClose,
  onViewCollection,
}: AchievementUnlockModalProps) {
  if (!unlockedItem) return null;

  const { achievement, record } = unlockedItem;
  const isMedal = achievement.visual_type === 'medal';

  // Format custom reason message
  let reasonText = achievement.description;
  if (record.metadata?.improvement) {
    reasonText = `You improved your score from ${record.metadata.previous_percentage}% to ${record.metadata.latest_percentage}%. That's a +${record.metadata.improvement} percentage point boost!`;
  } else if (record.metadata?.streak_count) {
    reasonText = `You completed qualifying mock tests on ${record.metadata.streak_count} consecutive days. Keep the fire burning!`;
  } else if (record.metadata?.latest_percentage === 100) {
    reasonText = `Flawless execution! 100% perfect marks achieved on this mock test.`;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          className="relative w-full max-w-md rounded-3xl border border-amber-300/40 bg-gradient-to-b from-card via-card to-amber-50/10 p-6 md:p-8 text-center shadow-2xl overflow-hidden"
        >
          {/* Ambient Golden Glow Behind Badge */}
          <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-400/25 blur-3xl" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Tag */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Achievement Unlocked!</span>
          </motion.div>

          {/* Badge / Medal Showcase */}
          <motion.div
            initial={{ scale: 0.4, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 16, stiffness: 260, delay: 0.2 }}
            className="flex items-center justify-center my-3"
          >
            {isMedal ? (
              <StreakMedal
                tier={achievement.badge_asset}
                milestoneDays={achievement.threshold}
                size="lg"
                animate={true}
              />
            ) : (
              <PerformanceBadge
                tier={achievement.badge_asset}
                title={achievement.title}
                subtitle={achievement.subtitle}
                size="lg"
                showLimbs={true}
                animate={true}
              />
            )}
          </motion.div>

          {/* Title & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-1.5 mt-4"
          >
            <h3 className="text-2xl font-black text-foreground">
              {achievement.title}
            </h3>
            {achievement.subtitle && (
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                {achievement.subtitle}
              </p>
            )}
          </motion.div>

          {/* Specific Reason */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-stone-600 dark:text-stone-300 mt-3 px-2 leading-relaxed"
          >
            {reasonText}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="grid grid-cols-2 gap-3 mt-7"
          >
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl border border-border bg-card hover:bg-stone-100 dark:hover:bg-stone-800 text-foreground font-semibold text-sm transition-all"
            >
              Continue
            </button>
            <button
              onClick={() => {
                onClose();
                if (onViewCollection) onViewCollection();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5 transition-all"
            >
              <span>View Badges</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
