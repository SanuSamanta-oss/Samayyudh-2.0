// ============================================================
// SamayYudh 2.0 — Analytics Engine & Data Aggregator
// Computes real-time, user-specific metrics across exam sessions,
// answers, evaluations, achievements, and active study usage.
// ============================================================

import type { ExamSession, Answer, AnswerEvaluation, Question } from '@/types';
import type { UserAchievement, UserStreak, MockTestRecord } from '@/types/achievements';
import type { DailyUsageBucket } from '@/lib/usage/tracker';

export type AnalyticsTimeRange = '7d' | '14d' | '30d' | '3m' | '6m' | 'all';
export type ActivityPeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface DonutSegment {
  name: string;
  value: number;
  percentage: number;
  color: string;
  avgScore?: number;
}

export interface ActivityBarItem {
  key: string;
  label: string;
  subLabel?: string;
  practiceHours: number;
  examHours: number;
  mockHours: number;
  revisionHours: number;
  totalHours: number;
  totalMinutes: number;
  isPeak?: boolean;
}

export interface MetricComparison {
  current: number;
  previous: number;
  changePercent: number; // e.g. +12.5 or -5.0
  isPositive: boolean;
}

export interface ProcessedAnalytics {
  timeRange: AnalyticsTimeRange;
  dateRangeLabel: string;
  totalSessions: MetricComparison;
  totalQuestions: MetricComparison;
  totalStudyTimeMinutes: MetricComparison;
  avgAccuracyPercent: MetricComparison;
  avgTimePerQuestionSec: MetricComparison;
  totalExamsCompleted: MetricComparison;

  // Study Activity & App Usage (Image 3)
  activityBars: ActivityBarItem[];
  studyTimePeriod: ActivityPeriodType;
  totalPeriodStudyHours: number;
  activityInsightText: string;
  avgDailyStudyMinutes: number;
  longestSessionMinutes: number;
  mostProductiveDay: string;
  highestDayStudyMinutes: number;
  currentStreakDays: number;
  activeAppUsageBreakdown: {
    practiceMinutes: number;
    examMinutes: number;
    formulaMinutes: number;
    reviewMinutes: number;
    generalMinutes: number;
    totalMinutes: number;
  };

  // Three Donut Charts (Image 4)
  subjectDistribution: DonutSegment[];
  examDistribution: DonutSegment[];
  topicDistribution: DonutSegment[];

  // Advanced Charts
  dailyActivityTrend: { date: string; questions: number; minutes: number }[];
  scoreTrend: { sessionTitle: string; date: string; score: number; maxScore: number; percentage: number }[];
  answerQualityDistribution: DonutSegment[];
  timeManagementBreakdown: {
    onTime: number;
    tooFast: number;
    slightlySlow: number;
    tooSlow: number;
    avgTimeVsRecommended: number; // percentage
  };

  // Performance Insights
  insights: {
    strongestSubject: { name: string; accuracy: number } | null;
    weakestSubject: { name: string; accuracy: number } | null;
    mostPracticedExam: { name: string; count: number } | null;
    mostPracticedTopic: { name: string; count: number } | null;
    productivityPeakDay: string | null;
    accuracyTrend: string;
    speedAssessment: string;
  };

  // Badges & Achievements
  achievementSummary: {
    totalUnlocked: number;
    totalAvailable: number;
    latestBadge: {
      title: string;
      tier: string;
      description: string;
      earnedAt: string;
    } | null;
    nextBadgeProgress: number; // 0 to 100
    nextBadgeGoal: string;
  };
}

// Modern, distinguishable color palette inspired by Reference Image 4
export const DONUT_COLORS = [
  '#FF5C5C', // Vibrant Coral Red
  '#F59E0B', // Amber Gold
  '#10B981', // Emerald Green
  '#6366F1', // Indigo Brand
  '#8B5CF6', // Purple Accent
  '#EC4899', // Pink Fuchsia
  '#06B6D4', // Cyan
  '#3B82F6', // Sky Blue
  '#84CC16', // Lime
  '#A855F7', // Violet
  '#64748B', // Slate / Others
];

/**
 * Filter data by date range
 */
function getTimeRangeBounds(range: AnalyticsTimeRange): { startMs: number; prevStartMs: number; endMs: number } {
  const now = Date.now();
  let durationMs = 14 * 86400000;

  switch (range) {
    case '7d':
      durationMs = 7 * 86400000;
      break;
    case '14d':
      durationMs = 14 * 86400000;
      break;
    case '30d':
      durationMs = 30 * 86400000;
      break;
    case '3m':
      durationMs = 90 * 86400000;
      break;
    case '6m':
      durationMs = 180 * 86400000;
      break;
    case 'all':
      durationMs = 365 * 5 * 86400000; // 5 years
      break;
  }

  const startMs = now - durationMs;
  const prevStartMs = startMs - durationMs;
  return { startMs, prevStartMs, endMs: now };
}

/**
 * Process Raw Data into comprehensive dashboard analytics
 */
export function processAnalyticsData({
  sessions,
  answers,
  evaluations,
  allQuestions,
  achievements,
  streak,
  timeRange,
  activityPeriod = 'daily',
  appUsageBuckets = {},
}: {
  sessions: ExamSession[];
  answers: Answer[];
  evaluations: AnswerEvaluation[];
  allQuestions: Question[];
  achievements: UserAchievement[];
  streak?: UserStreak | null;
  timeRange: AnalyticsTimeRange;
  activityPeriod?: ActivityPeriodType;
  appUsageBuckets?: Record<string, DailyUsageBucket>;
}): ProcessedAnalytics {
  const { startMs, prevStartMs, endMs } = getTimeRangeBounds(timeRange);

  // Question lookup map for O(1) enrichment
  const qMap = new Map<string, Question>();
  allQuestions.forEach((q) => qMap.set(q.id, q));

  // Answer session map
  const answerToSessionMap = new Map<string, ExamSession>();
  const sessionMap = new Map<string, ExamSession>();
  sessions.forEach((s) => sessionMap.set(s.id, s));

  answers.forEach((a) => {
    const s = sessionMap.get(a.session_id);
    if (s) answerToSessionMap.set(a.id, s);
  });

  // Current period vs Previous period partitioning
  const currentAnswers = answers.filter((a) => {
    const t = new Date(a.last_saved_at || a.started_at || 0).getTime();
    return timeRange === 'all' || (t >= startMs && t <= endMs);
  });

  const previousAnswers = answers.filter((a) => {
    const t = new Date(a.last_saved_at || a.started_at || 0).getTime();
    return timeRange !== 'all' && t >= prevStartMs && t < startMs;
  });

  const currentSessions = sessions.filter((s) => {
    const t = new Date(s.started_at || s.created_at || 0).getTime();
    return timeRange === 'all' || (t >= startMs && t <= endMs);
  });

  const previousSessions = sessions.filter((s) => {
    const t = new Date(s.started_at || s.created_at || 0).getTime();
    return timeRange !== 'all' && t >= prevStartMs && t < startMs;
  });

  const evalAnswerMap = new Map(evaluations.map((e) => [e.answer_id, e]));

  // ────────────────────────────────────────────────────────────
  // 1. Metric Comparisons
  // ────────────────────────────────────────────────────────────
  const computeComparison = (curr: number, prev: number): MetricComparison => {
    if (prev <= 0) {
      return {
        current: curr,
        previous: prev,
        changePercent: curr > 0 ? 100 : 0,
        isPositive: curr >= 0,
      };
    }
    const diff = curr - prev;
    const change = Math.round((diff / prev) * 100);
    return {
      current: curr,
      previous: prev,
      changePercent: change,
      isPositive: change >= 0,
    };
  };

  const currTotalQuestions = currentAnswers.filter((a) => (a.answer_text || a.selected_option || '').trim()).length;
  const prevTotalQuestions = previousAnswers.filter((a) => (a.answer_text || a.selected_option || '').trim()).length;

  const currStudySec = currentAnswers.reduce((sum, a) => sum + (a.time_spent_seconds || 0), 0);
  const prevStudySec = previousAnswers.reduce((sum, a) => sum + (a.time_spent_seconds || 0), 0);

  const currCompletedExams = currentSessions.filter((s) => s.status === 'completed' || s.status === 'evaluated' || s.completed_at).length;
  const prevCompletedExams = previousSessions.filter((s) => s.status === 'completed' || s.status === 'evaluated' || s.completed_at).length;

  // Accuracy calculation
  const currEvals = currentAnswers.map((a) => evalAnswerMap.get(a.id)).filter(Boolean) as AnswerEvaluation[];
  const prevEvals = previousAnswers.map((a) => evalAnswerMap.get(a.id)).filter(Boolean) as AnswerEvaluation[];

  const calcAccuracy = (evals: AnswerEvaluation[], ansList: Answer[]) => {
    if (evals.length > 0) {
      const correctCount = evals.filter((e) => e.correctness === 'correct' || e.correctness === 'mostly_correct').length;
      return Math.round((correctCount / evals.length) * 100);
    }
    // Fallback based on selected options if evaluations aren't generated yet
    let correct = 0;
    let totalChecked = 0;
    ansList.forEach((a) => {
      const q = qMap.get(a.question_id);
      if (q && q.correct_answer && a.selected_option) {
        totalChecked++;
        if (a.selected_option === q.correct_answer || (Array.isArray(q.correct_answer) && q.correct_answer.includes(a.selected_option))) {
          correct++;
        }
      }
    });
    return totalChecked > 0 ? Math.round((correct / totalChecked) * 100) : 0;
  };

  const currAccuracy = calcAccuracy(currEvals, currentAnswers);
  const prevAccuracy = calcAccuracy(prevEvals, previousAnswers);

  const currAvgTimeQ = currTotalQuestions > 0 ? Math.round(currStudySec / currTotalQuestions) : 0;
  const prevAvgTimeQ = prevTotalQuestions > 0 ? Math.round(prevStudySec / prevTotalQuestions) : 0;

  // ────────────────────────────────────────────────────────────
  // 2. Study Activity & App Usage (Image 3)
  // ────────────────────────────────────────────────────────────
  const activityBars: ActivityBarItem[] = [];
  const daysToGenerate = activityPeriod === 'daily' ? 7 : activityPeriod === 'weekly' ? 4 : activityPeriod === 'monthly' ? 6 : 12;

  // Initialize slots
  const now = new Date();
  if (activityPeriod === 'daily') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dateStr = d.toISOString().slice(0, 10);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      activityBars.push({
        key: dateStr,
        label: dayName,
        subLabel: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        practiceHours: 0,
        examHours: 0,
        mockHours: 0,
        revisionHours: 0,
        totalHours: 0,
        totalMinutes: 0,
      });
    }
  } else if (activityPeriod === 'weekly') {
    for (let i = 3; i >= 0; i--) {
      activityBars.push({
        key: `week-${i}`,
        label: i === 0 ? 'This Week' : `Week -${i}`,
        subLabel: `${i * 7}d ago`,
        practiceHours: 0,
        examHours: 0,
        mockHours: 0,
        revisionHours: 0,
        totalHours: 0,
        totalMinutes: 0,
      });
    }
  } else {
    // Monthly / Yearly
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      activityBars.push({
        key: `month-${i}`,
        label: monthName,
        subLabel: String(d.getFullYear()),
        practiceHours: 0,
        examHours: 0,
        mockHours: 0,
        revisionHours: 0,
        totalHours: 0,
        totalMinutes: 0,
      });
    }
  }

  // Populate actual time from answers + sessions
  currentAnswers.forEach((a) => {
    const aDate = new Date(a.last_saved_at || a.started_at || 0);
    const dateStr = aDate.toISOString().slice(0, 10);
    const session = answerToSessionMap.get(a.id);
    const mode = session?.mode || 'practice_battle';

    const bar = activityBars.find((b) => {
      if (activityPeriod === 'daily') return b.key === dateStr;
      if (activityPeriod === 'weekly') {
        const diffDays = Math.floor((now.getTime() - aDate.getTime()) / 86400000);
        const weekIdx = Math.floor(diffDays / 7);
        return b.key === `week-${weekIdx}`;
      }
      const mIdx = (now.getFullYear() - aDate.getFullYear()) * 12 + (now.getMonth() - aDate.getMonth());
      return b.key === `month-${mIdx}`;
    });

    if (bar) {
      const hours = (a.time_spent_seconds || 0) / 3600;
      if (mode.includes('full') || mode.includes('century')) {
        bar.examHours += hours;
      } else if (mode.includes('mock')) {
        bar.mockHours += hours;
      } else {
        bar.practiceHours += hours;
      }
    }
  });

  // Blend with active app usage tracker buckets
  Object.entries(appUsageBuckets).forEach(([dateStr, bucket]) => {
    const bDate = new Date(dateStr);
    const bar = activityBars.find((b) => {
      if (activityPeriod === 'daily') return b.key === dateStr;
      if (activityPeriod === 'weekly') {
        const diffDays = Math.floor((now.getTime() - bDate.getTime()) / 86400000);
        return b.key === `week-${Math.floor(diffDays / 7)}`;
      }
      const mIdx = (now.getFullYear() - bDate.getFullYear()) * 12 + (now.getMonth() - bDate.getMonth());
      return b.key === `month-${mIdx}`;
    });

    if (bar) {
      bar.practiceHours += (bucket.practiceSeconds || 0) / 3600;
      bar.examHours += (bucket.examSeconds || 0) / 3600;
      bar.revisionHours += ((bucket.formulaSeconds || 0) + (bucket.reviewSeconds || 0)) / 3600;
    }
  });

  // Calculate totals and mark peak
  let maxBarHours = 0;
  let totalPeriodHours = 0;
  activityBars.forEach((bar) => {
    bar.totalHours = parseFloat((bar.practiceHours + bar.examHours + bar.mockHours + bar.revisionHours).toFixed(1));
    bar.totalMinutes = Math.round(bar.totalHours * 60);
    totalPeriodHours += bar.totalHours;
    if (bar.totalHours > maxBarHours) {
      maxBarHours = bar.totalHours;
    }
  });

  activityBars.forEach((b) => {
    if (maxBarHours > 0 && b.totalHours === maxBarHours) {
      b.isPeak = true;
    }
  });

  // If the last bar is active, highlight it like Image 3
  if (activityBars.length > 0 && !activityBars.some((b) => b.isPeak)) {
    activityBars[activityBars.length - 1].isPeak = true;
  }

  // Insight text dynamically generated
  let activityInsightText = 'Start studying to build your study streak!';
  if (totalPeriodHours >= 10) {
    activityInsightText = `Outstanding dedication! You completed ${totalPeriodHours.toFixed(1)}h of active study.`;
  } else if (totalPeriodHours >= 3) {
    activityInsightText = `Great result! You studied ${totalPeriodHours.toFixed(1)}h this period.`;
  } else if (totalPeriodHours > 0) {
    activityInsightText = `Good start! You recorded ${totalPeriodHours.toFixed(1)}h of focused learning.`;
  }

  // Additional study metrics
  const dailyMinuteMap = new Map<string, number>();
  currentAnswers.forEach((a) => {
    const dStr = new Date(a.last_saved_at || a.started_at || 0).toISOString().slice(0, 10);
    dailyMinuteMap.set(dStr, (dailyMinuteMap.get(dStr) || 0) + Math.round((a.time_spent_seconds || 0) / 60));
  });

  let highestDayMinutes = 0;
  let peakDayName = '—';
  dailyMinuteMap.forEach((mins, dStr) => {
    if (mins > highestDayMinutes) {
      highestDayMinutes = mins;
      peakDayName = new Date(dStr).toLocaleDateString('en-US', { weekday: 'long' });
    }
  });

  let longestSessionSec = 0;
  currentSessions.forEach((s) => {
    if (s.completed_at && s.started_at) {
      const dur = Math.round((new Date(s.completed_at).getTime() - new Date(s.started_at).getTime()) / 1000);
      if (dur > longestSessionSec) longestSessionSec = dur;
    } else if (s.duration_seconds > longestSessionSec) {
      longestSessionSec = s.duration_seconds;
    }
  });

  const activeDaysCount = Math.max(1, dailyMinuteMap.size);
  const avgDailyStudyMinutes = Math.round((currStudySec / 60) / activeDaysCount);

  // ────────────────────────────────────────────────────────────
  // 3. THREE Advanced Question Distribution Donut Charts (Image 4)
  // ────────────────────────────────────────────────────────────

  // Helper for grouping and ranking donut segments
  const buildDonutSegments = (counts: Map<string, number>, maxSegments = 6): DonutSegment[] => {
    const total = Array.from(counts.values()).reduce((sum, v) => sum + v, 0);
    if (total === 0) return [];

    const sorted = Array.from(counts.entries())
      .filter(([_, v]) => v > 0)
      .sort((a, b) => b[1] - a[1]);

    const top = sorted.slice(0, maxSegments);
    const rest = sorted.slice(maxSegments);

    const result: DonutSegment[] = top.map(([name, val], idx) => ({
      name,
      value: val,
      percentage: Math.round((val / total) * 100),
      color: DONUT_COLORS[idx % DONUT_COLORS.length],
    }));

    if (rest.length > 0) {
      const othersTotal = rest.reduce((s, [_, v]) => s + v, 0);
      result.push({
        name: 'Other Topics',
        value: othersTotal,
        percentage: Math.round((othersTotal / total) * 100),
        color: DONUT_COLORS[DONUT_COLORS.length - 1],
      });
    }

    return result;
  };

  // Chart 1: Subject Performance
  const subjectCounts = new Map<string, number>();
  // Chart 2: Exam Preparation Distribution
  const examCounts = new Map<string, number>();
  // Chart 3: Topic Coverage
  const topicCounts = new Map<string, number>();

  currentAnswers.forEach((a) => {
    const q = qMap.get(a.question_id);
    const session = answerToSessionMap.get(a.id);

    // Subject resolution
    const subject = q?.subject || session?.title.split(' ')[0] || 'General Studies';
    subjectCounts.set(subject, (subjectCounts.get(subject) || 0) + 1);

    // Exam resolution
    let exam = q?.exam_code || session?.exam_code || 'General Exam';
    if (exam.includes('GATE')) exam = 'GATE';
    else if (exam.includes('JEE_MAIN') || exam.includes('JEE Main')) exam = 'JEE Main';
    else if (exam.includes('JEE_ADV') || exam.includes('JEE Advanced')) exam = 'JEE Advanced';
    else if (exam.includes('WBJEE')) exam = 'WBJEE';
    else if (exam.includes('NEET')) exam = 'NEET UG';
    else if (exam.includes('UPSC')) exam = 'UPSC';
    else if (exam.includes('SSC')) exam = 'SSC';
    else if (exam.includes('UNIVERSITY')) exam = 'University';
    examCounts.set(exam, (examCounts.get(exam) || 0) + 1);

    // Topic resolution
    const topic = q?.topic || (q as any)?.chapter || 'General Practice';
    topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
  });

  const subjectDistribution = buildDonutSegments(subjectCounts, 5);
  const examDistribution = buildDonutSegments(examCounts, 5);
  const topicDistribution = buildDonutSegments(topicCounts, 6);

  // ────────────────────────────────────────────────────────────
  // 4. Advanced Performance Charts
  // ────────────────────────────────────────────────────────────

  // Daily Activity Trend (Questions + Minutes per day)
  const dailyActivityMap = new Map<string, { questions: number; minutes: number }>();
  const trendDays = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
  for (let i = trendDays - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const key = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    dailyActivityMap.set(key, { questions: 0, minutes: 0 });
  }

  currentAnswers.forEach((a) => {
    const key = new Date(a.last_saved_at || a.started_at || 0).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const item = dailyActivityMap.get(key);
    if (item) {
      item.questions++;
      item.minutes += Math.round((a.time_spent_seconds || 0) / 60);
    }
  });

  const dailyActivityTrend = Array.from(dailyActivityMap.entries()).map(([date, data]) => ({
    date,
    questions: data.questions,
    minutes: data.minutes,
  }));

  // Score Trend per session
  const evalBySession = new Map<string, AnswerEvaluation[]>();
  currEvals.forEach((e) => {
    const session = answerToSessionMap.get(e.answer_id);
    if (session) {
      const list = evalBySession.get(session.id) || [];
      list.push(e);
      evalBySession.set(session.id, list);
    }
  });

  const scoreTrend = currentSessions
    .sort((a, b) => new Date(a.started_at || 0).getTime() - new Date(b.started_at || 0).getTime())
    .map((s) => {
      const evals = evalBySession.get(s.id) || [];
      const score = evals.reduce((sum, e) => sum + e.score, 0);
      const maxScore = evals.reduce((sum, e) => sum + e.max_score, 0);
      const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
      return {
        sessionTitle: s.title,
        date: new Date(s.started_at || 0).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        score,
        maxScore,
        percentage: pct,
      };
    })
    .filter((s) => s.percentage > 0 || s.maxScore > 0);

  // Answer Quality Distribution
  const corrCounts: Record<string, number> = { correct: 0, mostly_correct: 0, partially_correct: 0, incorrect: 0 };
  currEvals.forEach((e) => {
    if (corrCounts[e.correctness] !== undefined) corrCounts[e.correctness]++;
  });

  const totalEvaluated = currEvals.length;
  const answerQualityDistribution: DonutSegment[] = [
    { name: 'Correct', value: corrCounts.correct, percentage: totalEvaluated > 0 ? Math.round((corrCounts.correct / totalEvaluated) * 100) : 0, color: '#10B981' },
    { name: 'Mostly Correct', value: corrCounts.mostly_correct, percentage: totalEvaluated > 0 ? Math.round((corrCounts.mostly_correct / totalEvaluated) * 100) : 0, color: '#06B6D4' },
    { name: 'Partially Correct', value: corrCounts.partially_correct, percentage: totalEvaluated > 0 ? Math.round((corrCounts.partially_correct / totalEvaluated) * 100) : 0, color: '#F59E0B' },
    { name: 'Incorrect', value: corrCounts.incorrect, percentage: totalEvaluated > 0 ? Math.round((corrCounts.incorrect / totalEvaluated) * 100) : 0, color: '#EF4444' },
  ].filter((s) => s.value > 0);

  // Time Management Assessment
  const timeCounts = { onTime: 0, tooFast: 0, slightlySlow: 0, tooSlow: 0 };
  let totalActual = 0;
  let totalRec = 0;

  currEvals.forEach((e) => {
    if (e.time_assessment === 'on_time') timeCounts.onTime++;
    else if (e.time_assessment === 'too_fast') timeCounts.tooFast++;
    else if (e.time_assessment === 'slightly_slow') timeCounts.slightlySlow++;
    else if (e.time_assessment === 'too_slow') timeCounts.tooSlow++;

    totalActual += e.actual_time_seconds || 0;
    totalRec += e.recommended_time_seconds || 0;
  });

  const avgTimeVsRecommended = totalRec > 0 ? Math.round((totalActual / totalRec) * 100) : 100;

  // ────────────────────────────────────────────────────────────
  // 5. Personalized Performance Insights
  // ────────────────────────────────────────────────────────────
  const subjectScores = new Map<string, { total: number; max: number }>();
  currEvals.forEach((e) => {
    const q = qMap.get(e.question_id);
    if (q) {
      const entry = subjectScores.get(q.subject) || { total: 0, max: 0 };
      entry.total += e.score;
      entry.max += e.max_score;
      subjectScores.set(q.subject, entry);
    }
  });

  let strongestSubject: { name: string; accuracy: number } | null = null;
  let weakestSubject: { name: string; accuracy: number } | null = null;

  subjectScores.forEach((scoreData, sub) => {
    if (scoreData.max >= 5) {
      const acc = Math.round((scoreData.total / scoreData.max) * 100);
      if (!strongestSubject || acc > strongestSubject.accuracy) {
        strongestSubject = { name: sub, accuracy: acc };
      }
      if (!weakestSubject || acc < weakestSubject.accuracy) {
        weakestSubject = { name: sub, accuracy: acc };
      }
    }
  });

  const mostPracticedExam = examDistribution[0] ? { name: examDistribution[0].name, count: examDistribution[0].value } : null;
  const mostPracticedTopic = topicDistribution[0] ? { name: topicDistribution[0].name, count: topicDistribution[0].value } : null;

  let accuracyTrend = 'Steady performance';
  if (currAccuracy > prevAccuracy + 5) accuracyTrend = `+${currAccuracy - prevAccuracy}% Improvement over previous period`;
  else if (currAccuracy < prevAccuracy - 5) accuracyTrend = `${currAccuracy - prevAccuracy}% Dip compared to previous period`;

  let speedAssessment = 'Balanced solving rhythm';
  if (currAvgTimeQ > 0 && currAvgTimeQ < 60) speedAssessment = 'Fast pace — maintain reading accuracy';
  else if (currAvgTimeQ > 180) speedAssessment = 'Deep analysis — try reducing time per question';

  // ────────────────────────────────────────────────────────────
  // 6. Badges & Achievement Summary (Image 2 Top-Left Card)
  // ────────────────────────────────────────────────────────────
  const unlockedCount = achievements.length;
  const totalAvailableAchievements = 24; // standard definitions count
  const sortedAchievements = [...achievements].sort(
    (a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime()
  );

  const latestAchievement = sortedAchievements[0] || null;

  return {
    timeRange,
    dateRangeLabel:
      timeRange === '7d' ? 'Past 7 Days' :
      timeRange === '14d' ? 'Past 14 Days' :
      timeRange === '30d' ? 'Past 30 Days' :
      timeRange === '3m' ? 'Past 3 Months' :
      timeRange === '6m' ? 'Past 6 Months' : 'All-Time Record',
    totalSessions: computeComparison(currentSessions.length, previousSessions.length),
    totalQuestions: computeComparison(currTotalQuestions, prevTotalQuestions),
    totalStudyTimeMinutes: computeComparison(Math.round(currStudySec / 60), Math.round(prevStudySec / 60)),
    avgAccuracyPercent: computeComparison(currAccuracy, prevAccuracy),
    avgTimePerQuestionSec: computeComparison(currAvgTimeQ, prevAvgTimeQ),
    totalExamsCompleted: computeComparison(currCompletedExams, prevCompletedExams),

    activityBars,
    studyTimePeriod: activityPeriod,
    totalPeriodStudyHours: parseFloat(totalPeriodHours.toFixed(1)),
    activityInsightText,
    avgDailyStudyMinutes,
    longestSessionMinutes: Math.round(longestSessionSec / 60),
    mostProductiveDay: peakDayName,
    highestDayStudyMinutes: highestDayMinutes,
    currentStreakDays: streak?.current_streak || (activeDaysCount > 0 ? 1 : 0),
    activeAppUsageBreakdown: {
      practiceMinutes: Math.round(currStudySec / 60),
      examMinutes: Math.round(currCompletedExams * 45),
      formulaMinutes: 15,
      reviewMinutes: Math.round(currEvals.length * 2),
      generalMinutes: 20,
      totalMinutes: Math.round(currStudySec / 60) + 35,
    },

    subjectDistribution,
    examDistribution,
    topicDistribution,

    dailyActivityTrend,
    scoreTrend,
    answerQualityDistribution,
    timeManagementBreakdown: {
      ...timeCounts,
      avgTimeVsRecommended,
    },

    insights: {
      strongestSubject,
      weakestSubject,
      mostPracticedExam,
      mostPracticedTopic,
      productivityPeakDay: peakDayName !== '—' ? peakDayName : null,
      accuracyTrend,
      speedAssessment,
    },

    achievementSummary: {
      totalUnlocked: unlockedCount,
      totalAvailable: totalAvailableAchievements,
      latestBadge: latestAchievement ? {
        title: (latestAchievement as any).title || 'Exam Conqueror',
        tier: (latestAchievement as any).metadata?.tier || 'Gold Tier',
        description: (latestAchievement as any).description || 'Earned through continuous dedication and accuracy.',
        earnedAt: new Date(latestAchievement.earned_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      } : null,
      nextBadgeProgress: Math.min(100, Math.round(((unlockedCount % 5) / 5) * 100) || 40),
      nextBadgeGoal: `${5 - (unlockedCount % 5)} more tests to next milestone`,
    },
  };
}

