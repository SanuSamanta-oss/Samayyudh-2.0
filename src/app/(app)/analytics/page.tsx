'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, RefreshCw, Zap, BookOpen, Layers,
  Award, TrendingUp, Sparkles, AlertCircle
} from 'lucide-react';
import * as localDB from '@/lib/store/local-db';
import type { ExamSession, Answer, AnswerEvaluation, Question } from '@/types';
import type { UserAchievement, UserStreak } from '@/types/achievements';
import { getLocalAchievementSnapshot } from '@/lib/achievements/client';
import { appUsageTracker } from '@/lib/usage/tracker';
import {
  processAnalyticsData,
  AnalyticsTimeRange,
  ActivityPeriodType,
  ProcessedAnalytics,
} from '@/lib/analytics/data-processor';

import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { OverviewStatCards } from '@/components/analytics/OverviewStatCards';
import { SubjectPillTabs } from '@/components/analytics/SubjectPillTabs';
import { AchievementJourneyCard } from '@/components/analytics/AchievementJourneyCard';
import { StudyTimeActivityCard } from '@/components/analytics/StudyTimeActivityCard';
import { SegmentedDonutChart } from '@/components/analytics/SegmentedDonutChart';
import { AdvancedPerformanceSection } from '@/components/analytics/AdvancedPerformanceSection';
import { PersonalizedInsights } from '@/components/analytics/PersonalizedInsights';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<AnalyticsTimeRange>('14d');
  const [activityPeriod, setActivityPeriod] = useState<ActivityPeriodType>('daily');
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');

  // Raw database records
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [evaluations, setEvaluations] = useState<AnswerEvaluation[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [streak, setStreak] = useState<UserStreak | null>(null);

  // Load and subscribe to real application data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      appUsageTracker.init();

      const [loadedSessions, loadedAnswers, loadedEvaluations, customQs] = await Promise.all([
        localDB.getAllSessions(),
        localDB.getAllAnswers(),
        localDB.getAllEvaluations(),
        localDB.getAllCustomQuestions(),
      ]);

      const { questionBank } = await import('@/lib/questions');
      const combinedQuestions = [...questionBank, ...customQs];

      const snapshot = await getLocalAchievementSnapshot('local-user');

      setSessions(loadedSessions || []);
      setAnswers(loadedAnswers || []);
      setEvaluations(loadedEvaluations || []);
      setAllQuestions(combinedQuestions);
      setAchievements(snapshot.userAchievements || []);
      setStreak(snapshot.streak || null);
    } catch (err) {
      console.error('Error loading analytics records:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute processed metrics dynamically based on active filters
  const analytics = useMemo<ProcessedAnalytics>(() => {
    const buckets = appUsageTracker.getAllStoredBuckets();

    // If subject is selected, filter answers accordingly
    const filteredAnswers = selectedSubject === 'All Subjects'
      ? answers
      : answers.filter((a) => {
          const q = allQuestions.find((item) => item.id === a.question_id);
          return q?.subject === selectedSubject;
        });

    return processAnalyticsData({
      sessions,
      answers: filteredAnswers,
      evaluations,
      allQuestions,
      achievements,
      streak,
      timeRange,
      activityPeriod,
      appUsageBuckets: buckets,
    });
  }, [sessions, answers, evaluations, allQuestions, achievements, streak, timeRange, activityPeriod, selectedSubject]);

  // Available subjects for the pill tabs
  const availableSubjects = useMemo(() => {
    return analytics.subjectDistribution.map((s) => ({
      name: s.name,
      count: s.value,
    }));
  }, [analytics.subjectDistribution]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
        <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">
          Calculating academic analytics...
        </p>
      </div>
    );
  }

  const hasData = sessions.length > 0 || answers.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 pb-16">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. Header Section */}
      {/* ──────────────────────────────────────────────────────────── */}
      <AnalyticsHeader
        selectedRange={timeRange}
        onRangeChange={setTimeRange}
        dateRangeLabel={analytics.dateRangeLabel}
        totalSessions={analytics.totalSessions.current}
        totalQuestions={analytics.totalQuestions.current}
        avgAccuracy={analytics.avgAccuracyPercent.current}
      />

      {/* Empty State when zero sessions exist */}
      {!hasData ? (
        <div className="text-center py-20 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl bg-white dark:bg-[#111A2E] space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white">
              No battle activity recorded yet
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
              Complete practice battles or full-length examination sessions to unlock live accuracy benchmarks, study-time tracking, and question distribution charts.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Launch Practice Battle</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* ──────────────────────────────────────────────────────────── */}
          {/* 2. Main Overview Statistic Cards (Rounded Corner Tabs like Image 2) */}
          {/* ──────────────────────────────────────────────────────────── */}
          <OverviewStatCards
            totalSessions={analytics.totalSessions}
            totalQuestions={analytics.totalQuestions}
            totalStudyTimeMinutes={analytics.totalStudyTimeMinutes}
            avgAccuracyPercent={analytics.avgAccuracyPercent}
            avgTimePerQuestionSec={analytics.avgTimePerQuestionSec}
            totalExamsCompleted={analytics.totalExamsCompleted}
          />

          {/* ──────────────────────────────────────────────────────────── */}
          {/* 3. Subject Pill Tabs (Literature, Math, Biology from Image 2) */}
          {/* ──────────────────────────────────────────────────────────── */}
          {availableSubjects.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Quick Subject Focus
                </span>
                {selectedSubject !== 'All Subjects' && (
                  <button
                    onClick={() => setSelectedSubject('All Subjects')}
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                  >
                    Reset to All
                  </button>
                )}
              </div>
              <SubjectPillTabs
                selectedSubject={selectedSubject}
                onSelectSubject={setSelectedSubject}
                subjects={availableSubjects}
              />
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* 4. Featured Multi-Column Row (Image 2 & 3 Composition) */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column: Achievement Journey Showcase Card (Image 2 Top-Left) */}
            <div className="lg:col-span-5 flex flex-col">
              <AchievementJourneyCard
                totalUnlocked={analytics.achievementSummary.totalUnlocked}
                totalAvailable={analytics.achievementSummary.totalAvailable}
                latestBadge={analytics.achievementSummary.latestBadge}
                progressPercent={analytics.achievementSummary.nextBadgeProgress}
                nextBadgeGoal={analytics.achievementSummary.nextBadgeGoal}
              />
            </div>

            {/* Right Column: Study Activity & App Usage (Image 3 Stacked Bars) */}
            <div className="lg:col-span-7 flex flex-col">
              <StudyTimeActivityCard
                activityBars={analytics.activityBars}
                totalHours={analytics.totalPeriodStudyHours}
                period={activityPeriod}
                onPeriodChange={setActivityPeriod}
                insightText={analytics.activityInsightText}
                avgDailyMinutes={analytics.avgDailyStudyMinutes}
                longestSessionMinutes={analytics.longestSessionMinutes}
                mostProductiveDay={analytics.mostProductiveDay}
                currentStreakDays={analytics.currentStreakDays}
                accuracyPercent={analytics.avgAccuracyPercent.current}
                totalQuestions={analytics.totalQuestions.current}
                activeAppUsage={analytics.activeAppUsageBreakdown}
              />
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* 5. THREE Advanced Question Distribution Donut Charts (Image 4) */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-white tracking-tight">
                Question Distribution & Coverage
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {/* Chart 1: Subject-Wise Question Distribution */}
              <SegmentedDonutChart
                title="Subject Performance"
                subtitle="Questions solved by academic subject"
                data={analytics.subjectDistribution}
                totalLabel="Subject Questions"
              />

              {/* Chart 2: Exam Preparation Distribution */}
              <SegmentedDonutChart
                title="Exam Preparation Distribution"
                subtitle="Questions solved per examination tier"
                data={analytics.examDistribution}
                totalLabel="Exam Questions"
              />

              {/* Chart 3: Topic-Wise Question Distribution */}
              <SegmentedDonutChart
                title="Topic Coverage"
                subtitle="Core concept & chapter distribution"
                data={analytics.topicDistribution}
                totalLabel="Topic Questions"
              />
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* 6. Personalized Performance Insights */}
          {/* ──────────────────────────────────────────────────────────── */}
          <PersonalizedInsights insights={analytics.insights} />

          {/* ──────────────────────────────────────────────────────────── */}
          {/* 7. Advanced Performance Charts (Activity, Score, Quality, Time) */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-white tracking-tight">
                In-Depth Performance & Speed Analytics
              </h3>
            </div>

            <AdvancedPerformanceSection
              dailyActivity={analytics.dailyActivityTrend}
              scoreTrend={analytics.scoreTrend}
              answerQuality={analytics.answerQualityDistribution}
              timeManagement={analytics.timeManagementBreakdown}
            />
          </div>
        </div>
      )}
    </div>
  );
}
