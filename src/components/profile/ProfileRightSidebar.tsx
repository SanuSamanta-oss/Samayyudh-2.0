'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Cloud,
  CloudOff,
  Lock,
  RefreshCw,
  ShieldCheck,
  Trophy,
  TrendingUp,
} from 'lucide-react';
import type { AchievementDefinition } from '@/types/achievements';
import { PerformanceBadge } from '@/components/achievements/PerformanceBadge';
import { StreakMedal } from '@/components/achievements/StreakMedal';

export interface RecentBadgeItem {
  definition: AchievementDefinition;
  unlocked: boolean;
  earnedAt?: string;
  progressText?: string;
}

export interface ProfileRightSidebarProps {
  bestScore: number;
  totalSessions: number;
  completedSessions: number;
  recentBadges: RecentBadgeItem[];
  onViewAllAchievements: () => void;
  isAuthenticated: boolean;
  userEmail: string;
  isOnline: boolean;
  unsyncedCount: number;
  syncing: boolean;
  onManualSync: () => void;
}

export function ProfileRightSidebar({
  bestScore,
  totalSessions,
  completedSessions,
  recentBadges,
  onViewAllAchievements,
  isAuthenticated,
  userEmail,
  isOnline,
  unsyncedCount,
  syncing,
  onManualSync,
}: ProfileRightSidebarProps) {
  const prefersReducedMotion = useReducedMotion();
  const perfRef = useRef<HTMLDivElement>(null);
  const perfInView = useInView(perfRef, { once: true, amount: 0.3 });

  const clampedBest = Math.max(0, Math.min(100, Math.round(bestScore)));

  // Sync status computation
  const syncState = !isAuthenticated
    ? {
        dotClass: 'bg-slate-400',
        title: 'Local Mode',
        badgeText: 'Not Signed In',
        iconBg: 'bg-slate-500/12 text-slate-600 dark:text-slate-300',
        icon: CloudOff,
        message: 'Sign in to back up sessions and keep progress synchronized across devices.',
      }
    : !isOnline
      ? {
          dotClass: 'bg-amber-500',
          title: 'Offline',
          badgeText: 'Local Queue Active',
          iconBg: 'bg-amber-500/12 text-amber-600 dark:text-amber-400',
          icon: CloudOff,
          message:
            unsyncedCount > 0
              ? `${unsyncedCount} ${unsyncedCount === 1 ? 'change' : 'changes'} saved locally and queued for sync.`
              : 'Your progress is saved safely offline and will sync when you reconnect.',
        }
      : unsyncedCount > 0
        ? {
            dotClass: 'bg-violet-500',
            title: 'Sync Pending',
            badgeText: `${unsyncedCount} queued`,
            iconBg: 'bg-violet-500/12 text-violet-600 dark:text-violet-400',
            icon: RefreshCw,
            message: 'Pending practice records are ready to sync with your cloud account.',
          }
        : {
            dotClass: 'bg-emerald-500',
            title: 'Signed In & Synced',
            badgeText: 'Up to date',
            iconBg: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400',
            icon: ShieldCheck,
            message: 'Your sessions, answers, and achievements are securely synchronized with your account.',
          };

  const SyncIcon = syncState.icon;

  return (
    <div className="space-y-4">
      {/* A. Best Performance — Prominent Purple Gradient Widget */}
      <section
        ref={perfRef}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5B21B6] via-[#7C3AED] to-[#9333EA] dark:from-[#4C1D95] dark:via-[#6D28D9] dark:to-[#7C3AED] p-5 sm:p-6 text-white shadow-[0_12px_32px_-8px_rgba(109,40,217,0.45)]"
      >
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none"
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-violet-100/90 uppercase tracking-wider">
              Best Performance
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight tabular-nums">
              {clampedBest}%
            </span>
            <span className="text-xs text-violet-100/85 font-medium">peak score</span>
          </div>

          <p className="text-xs text-violet-100/85 mt-1">
            Across {totalSessions} {totalSessions === 1 ? 'session' : 'sessions'}
            {completedSessions > 0 ? ` (${completedSessions} completed)` : ''}
          </p>

          {/* Animated Progress Indicator */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] text-violet-100/85 mb-1.5">
              <span>Score benchmark</span>
              <span className="font-semibold tabular-nums">{clampedBest}/100</span>
            </div>
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: prefersReducedMotion ? `${clampedBest}%` : '0%' }}
                animate={perfInView ? { width: `${clampedBest}%` } : undefined}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* B. Recent Achievements */}
      <section className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/12 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Recent Achievements
            </h2>
          </div>
        </div>

        <div className="space-y-2.5">
          {recentBadges.slice(0, 4).map(({ definition, unlocked, progressText }) => (
            <div
              key={definition.id}
              className={`flex items-center gap-3 p-2.5 rounded-2xl transition-colors ${
                unlocked
                  ? 'bg-stone-50/90 dark:bg-[#162032]'
                  : 'bg-stone-50/50 dark:bg-[#162032]/55 opacity-75'
              }`}
            >
              {/* Compact Existing Vector Artwork Preview */}
              <div className="relative w-10 h-10 rounded-xl bg-white dark:bg-[#1C2842] flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                <div className="scale-[0.3] origin-center pointer-events-none">
                  {definition.visual_type === 'medal' ? (
                    <StreakMedal
                      tier={definition.badge_asset}
                      milestoneDays={definition.threshold}
                      size="sm"
                      isUnlocked={unlocked}
                      animate={false}
                    />
                  ) : (
                    <PerformanceBadge
                      tier={definition.badge_asset}
                      title={definition.title}
                      size="sm"
                      isUnlocked={unlocked}
                      showLimbs={false}
                      animate={false}
                    />
                  )}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {definition.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {definition.subtitle || definition.description}
                </p>
              </div>

              <div className="shrink-0">
                {unlocked ? (
                  <span
                    title="Unlocked"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-400">
                    <Lock className="w-3 h-3" />
                    {progressText}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onViewAllAchievements}
          className="mt-4 w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-violet-700 dark:text-violet-300 bg-violet-500/8 hover:bg-violet-500/15 dark:bg-violet-500/15 dark:hover:bg-violet-500/25 transition-colors cursor-pointer"
        >
          <span>View All Achievements</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* C. Account Synchronization Status */}
      <section className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-3">
          <div className={`w-10 h-10 rounded-2xl ${syncState.iconBg} flex items-center justify-center shrink-0`}>
            <SyncIcon className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-100 dark:bg-[#18233C] text-slate-600 dark:text-slate-300">
            <Cloud className="w-3 h-3 text-violet-500" />
            {syncState.badgeText}
          </span>
        </div>

        <div className="mt-3.5">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${syncState.dotClass}`} />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {syncState.title}
            </h3>
          </div>

          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate mt-1">
            {isAuthenticated ? userEmail : 'local-device'}
          </p>

          <p className="text-[11px] text-slate-400 dark:text-slate-400 leading-relaxed mt-2">
            {syncState.message}
          </p>
        </div>

        {isAuthenticated ? (
          isOnline && unsyncedCount > 0 && (
            <button
              type="button"
              onClick={onManualSync}
              disabled={syncing}
              className="mt-3.5 w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Synchronizing...' : 'Sync Now'}
            </button>
          )
        ) : (
          <Link
            href="/auth/login"
            className="mt-3.5 w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors"
          >
            Sign In to Sync
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </section>
    </div>
  );
}
