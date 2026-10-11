'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Flame,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar,
  Layers,
  Settings,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  AchievementDefinition,
  UserAchievement,
  UserStreak,
  MockTestRecord,
  AchievementStats,
} from '@/types/achievements';
import { getAchievementSystemData, updateStreakGoal } from '@/lib/achievements/client';
import { StreakProgressCard } from '@/components/achievements/StreakProgressCard';
import { StreakCalendar } from '@/components/achievements/StreakCalendar';
import { StreakGoalSettings } from '@/components/achievements/StreakGoalSettings';
import { AchievementGrid } from '@/components/achievements/AchievementGrid';
import { AchievementUnlockModal } from '@/components/achievements/AchievementUnlockModal';
import { PerformanceTrendChart } from '@/components/achievements/PerformanceTrendChart';
import { PerformanceComparison } from '@/components/achievements/PerformanceComparison';
import {
  AchievementEmptyState,
  AchievementSkeleton,
} from '@/components/achievements/AchievementEmptyState';

export default function AchievementsPage() {
  const { user } = useAuth();
  const userId = user?.id || 'local-user';

  const [loading, setLoading] = useState(true);
  const [definitions, setDefinitions] = useState<AchievementDefinition[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [qualifyingDates, setQualifyingDates] = useState<string[]>([]);
  const [mockTests, setMockTests] = useState<MockTestRecord[]>([]);
  const [stats, setStats] = useState<AchievementStats | null>(null);

  // Modals
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [inspectItem, setInspectItem] = useState<{
    achievement: AchievementDefinition;
    record: UserAchievement;
  } | null>(null);

  // Load achievement data
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAchievementSystemData(userId);
      setDefinitions(data.definitions);
      setUserAchievements(data.userAchievements);
      setStreak(data.streak);
      setQualifyingDates(data.qualifyingDates);
      setMockTests(data.mockTests);
      setStats(data.stats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleSaveGoal = async (newGoal: number) => {
    const updated = await updateStreakGoal(userId, newGoal);
    setStreak(updated);
    if (stats) {
      setStats({ ...stats, selected_goal_days: newGoal });
    }
  };

  // Find latest performance improvement achievement if any
  const latestImprovement = useMemo(() => {
    const sorted = [...userAchievements].sort(
      (a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime()
    );
    const imp = sorted.find(a => a.metadata?.improvement);
    return imp || null;
  }, [userAchievements]);

  if (loading || !streak || !stats) {
    return (
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8 space-y-8">
        <div className="h-28 rounded-3xl bg-stone-100 dark:bg-stone-900 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-stone-100 dark:bg-stone-900 animate-pulse" />
          ))}
        </div>
        <AchievementSkeleton />
      </div>
    );
  }

  const isBrandNewUser = userAchievements.length === 0 && mockTests.length === 0;

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 md:py-10 space-y-8">
      {/* ── Section A: Welcome Banner ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-6 md:p-8 text-white shadow-xl shadow-amber-500/10"
      >
        <div className="pointer-events-none absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-amber-400/20 blur-xl" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-extrabold uppercase tracking-widest text-amber-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SamayYudh Honor Hall</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Your Achievements & Streaks
            </h1>
            <p className="text-sm text-white/80 max-w-xl">
              Celebrate every score surge, preserve your daily streak flame, and collect golden pins & medals.
            </p>
          </div>

          <Link
            href="/practice"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-stone-900 hover:bg-amber-50 font-bold text-sm shadow-md transition-all self-stretch sm:self-auto justify-center"
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Battle Next Test</span>
            <ArrowRight className="w-4 h-4 text-stone-400" />
          </Link>
        </div>
      </motion.div>

      {/* ── Section B: Statistics Cards ──────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Current Streak */}
        <div className="flex flex-col gap-1 p-4 rounded-2xl border border-amber-300/40 bg-gradient-to-br from-card to-amber-500/5 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500 mb-1">
            <Flame className="w-4 h-4 fill-amber-500" />
          </div>
          <span className="text-2xl font-black text-foreground">{stats.current_streak}</span>
          <span className="text-xs text-stone-500 font-medium">Day Streak</span>
        </div>

        {/* Longest Streak */}
        <div className="flex flex-col gap-1 p-4 rounded-2xl border border-border bg-card shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 mb-1">
            <Target className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-foreground">{stats.longest_streak}</span>
          <span className="text-xs text-stone-500 font-medium">Longest Streak</span>
        </div>

        {/* Unlocked Badges */}
        <div className="flex flex-col gap-1 p-4 rounded-2xl border border-border bg-card shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 mb-1">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-foreground">
            {stats.total_achievements}
            <span className="text-xs font-normal text-stone-400">/{definitions.length}</span>
          </span>
          <span className="text-xs text-stone-500 font-medium">Badges Earned</span>
        </div>

        {/* Total Mock Tests */}
        <div className="flex flex-col gap-1 p-4 rounded-2xl border border-border bg-card shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-600 mb-1">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-foreground">{stats.total_tests_completed}</span>
          <span className="text-xs text-stone-500 font-medium">Tests Completed</span>
        </div>

        {/* Personal Best */}
        <div className="flex flex-col gap-1 p-4 rounded-2xl border border-border bg-card shadow-sm col-span-2 md:col-span-1">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500 mb-1">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {stats.personal_best_percentage > 0 ? `${stats.personal_best_percentage}%` : '—'}
          </span>
          <span className="text-xs text-stone-500 font-medium">Personal Best</span>
        </div>
      </section>

      {/* ── Section C: Streak Progress & Strip Calendar ──────────────── */}
      <section className="space-y-4">
        <StreakProgressCard
          streak={streak}
          onOpenSettings={() => setIsGoalModalOpen(true)}
        />
        <StreakCalendar
          qualifyingDates={qualifyingDates}
          timezone={streak.timezone}
          daysToShow={14}
        />
      </section>

      {/* ── Section D: Performance Growth Section ─────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-500" />
          <span>Performance Analytics & Improvement Surge</span>
        </h3>

        {latestImprovement && (
          <PerformanceComparison
            previousPercentage={latestImprovement.metadata?.previous_percentage || 0}
            latestPercentage={latestImprovement.metadata?.latest_percentage || 0}
            examCategory={latestImprovement.metadata?.exam_category || 'Mock Test'}
            badgeTier={
              definitions.find(d => d.id === latestImprovement.achievement_definition_id)?.badge_asset ||
              'rising_star'
            }
            earnedDate={new Date(latestImprovement.earned_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          />
        )}

        <PerformanceTrendChart mockTests={mockTests} />
      </section>

      {/* ── Section E & F: All Achievements Collection Grid ──────────── */}
      <section className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Full Badge & Medal Showcase</span>
            </h3>
            <p className="text-xs text-stone-500">
              Unlock badges through genuine percentage improvements and continuous practice.
            </p>
          </div>
        </div>

        {mockTests.length === 0 && (
          <AchievementEmptyState className="mb-6" />
        )}

        <AchievementGrid
          definitions={definitions}
          userAchievements={userAchievements}
          onSelectAchievement={(item) => {
            if (item.userAchievement) {
              setInspectItem({
                achievement: item.definition,
                record: item.userAchievement,
              });
            }
          }}
        />
      </section>

      {/* ── Modals ───────────────────────────────────────────────────── */}
      <StreakGoalSettings
        isOpen={isGoalModalOpen}
        currentGoal={streak.selected_goal_days}
        currentStreak={streak.current_streak}
        onSave={handleSaveGoal}
        onClose={() => setIsGoalModalOpen(false)}
      />

      <AchievementUnlockModal
        unlockedItem={inspectItem}
        onClose={() => setInspectItem(null)}
        onViewCollection={() => setInspectItem(null)}
      />
    </div>
  );
}
