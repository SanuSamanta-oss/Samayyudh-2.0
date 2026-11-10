'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Target, Clock, Award, Zap, CheckCircle2,
  TrendingUp, TrendingDown
} from 'lucide-react';
import { cn, formatDuration } from '@/lib/utils';
import type { MetricComparison } from '@/lib/analytics/data-processor';

interface OverviewStatCardsProps {
  totalSessions: MetricComparison;
  totalQuestions: MetricComparison;
  totalStudyTimeMinutes: MetricComparison;
  avgAccuracyPercent: MetricComparison;
  avgTimePerQuestionSec: MetricComparison;
  totalExamsCompleted: MetricComparison;
}

interface StatCardConfig {
  id: string;
  label: string;
  value: string;
  subMetric?: string;
  metric: MetricComparison;
  icon: React.ReactNode;
  tabBg: string;
  tabText: string;
  iconBadgeBg: string;
  iconColor: string;
}

/**
 * Overview Stat Cards (Smooth, No Outlines, Refined Typography)
 * Features:
 * - Completely smooth rounded surface (rounded-[28px])
 * - NO harsh outlines or borders
 * - Refined text sizing
 * - Zero overlap between top tabs and bottom trend context
 */
export function OverviewStatCards({
  totalSessions,
  totalQuestions,
  totalStudyTimeMinutes,
  avgAccuracyPercent,
  avgTimePerQuestionSec,
  totalExamsCompleted,
}: OverviewStatCardsProps) {
  const cards: StatCardConfig[] = [
    {
      id: 'sessions',
      label: 'Sessions',
      value: String(totalSessions.current),
      subMetric: `${totalSessions.previous} prev`,
      metric: totalSessions,
      icon: <BookOpen className="w-3.5 h-3.5" />,
      tabBg: 'bg-purple-100/80 dark:bg-purple-950/70',
      tabText: 'text-purple-900 dark:text-purple-200',
      iconBadgeBg: 'bg-purple-200 dark:bg-purple-900',
      iconColor: 'text-purple-700 dark:text-purple-300',
    },
    {
      id: 'questions',
      label: 'Questions',
      value: String(totalQuestions.current),
      subMetric: `${totalQuestions.previous} prev`,
      metric: totalQuestions,
      icon: <Target className="w-3.5 h-3.5" />,
      tabBg: 'bg-orange-100/80 dark:bg-orange-950/70',
      tabText: 'text-orange-900 dark:text-orange-200',
      iconBadgeBg: 'bg-orange-200 dark:bg-orange-900',
      iconColor: 'text-orange-700 dark:text-orange-300',
    },
    {
      id: 'study-time',
      label: 'Hours',
      value: totalStudyTimeMinutes.current > 0 ? formatDuration(totalStudyTimeMinutes.current * 60) : '0m',
      subMetric: `${totalStudyTimeMinutes.previous}m prev`,
      metric: totalStudyTimeMinutes,
      icon: <Clock className="w-3.5 h-3.5" />,
      tabBg: 'bg-sky-100/80 dark:bg-sky-950/70',
      tabText: 'text-sky-900 dark:text-sky-200',
      iconBadgeBg: 'bg-sky-200 dark:bg-sky-900',
      iconColor: 'text-sky-700 dark:text-sky-300',
    },
    {
      id: 'accuracy',
      label: 'Accuracy',
      value: avgAccuracyPercent.current > 0 ? `${avgAccuracyPercent.current}%` : '—',
      subMetric: avgAccuracyPercent.previous > 0 ? `Prev: ${avgAccuracyPercent.previous}%` : undefined,
      metric: avgAccuracyPercent,
      icon: <Award className="w-3.5 h-3.5" />,
      tabBg: 'bg-amber-100/80 dark:bg-amber-950/70',
      tabText: 'text-amber-900 dark:text-amber-200',
      iconBadgeBg: 'bg-amber-200 dark:bg-amber-900',
      iconColor: 'text-amber-700 dark:text-amber-300',
    },
    {
      id: 'time-per-q',
      label: 'Speed / Q',
      value: avgTimePerQuestionSec.current > 0 ? `${avgTimePerQuestionSec.current}s` : '—',
      subMetric: avgTimePerQuestionSec.previous > 0 ? `Prev: ${avgTimePerQuestionSec.previous}s` : undefined,
      metric: avgTimePerQuestionSec,
      icon: <Zap className="w-3.5 h-3.5" />,
      tabBg: 'bg-rose-100/80 dark:bg-rose-950/70',
      tabText: 'text-rose-900 dark:text-rose-200',
      iconBadgeBg: 'bg-rose-200 dark:bg-rose-900',
      iconColor: 'text-rose-700 dark:text-rose-300',
    },
    {
      id: 'exams',
      label: 'Exams',
      value: String(totalExamsCompleted.current),
      subMetric: `${totalExamsCompleted.previous} prev`,
      metric: totalExamsCompleted,
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      tabBg: 'bg-emerald-100/80 dark:bg-emerald-950/70',
      tabText: 'text-emerald-900 dark:text-emerald-200',
      iconBadgeBg: 'bg-emerald-200 dark:bg-emerald-900',
      iconColor: 'text-emerald-700 dark:text-emerald-300',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
      {cards.map((card, idx) => {
        const change = card.metric.changePercent;
        const hasPrev = card.metric.previous > 0;

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            whileHover={{ y: -2 }}
            className="relative p-4 rounded-[26px] bg-white dark:bg-[#111A2E] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            {/* Top-Left Integrated Rounded Corner Tab (Smooth, No Outline) */}
            <div className="flex items-center justify-start">
              <div
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-2xl shadow-2xs',
                  card.tabBg
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-lg flex items-center justify-center shrink-0',
                    card.iconBadgeBg,
                    card.iconColor
                  )}
                >
                  {card.icon}
                </div>
                <span className={cn('text-[11px] font-black tracking-tight truncate', card.tabText)}>
                  {card.label}
                </span>
              </div>
            </div>

            {/* Prominent Large Number (Refined Sizing) */}
            <div className="px-0.5">
              <p className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight leading-none">
                {card.value}
              </p>

              {/* Bottom Context Row: SubMetric on left, Trend Pill on right (Smooth, No Outline) */}
              <div className="flex items-center justify-between gap-1.5 mt-2 min-h-[20px]">
                <span className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 truncate">
                  {card.subMetric || 'Active benchmark'}
                </span>

                {hasPrev && change !== 0 && (
                  <div
                    className={cn(
                      'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold shrink-0',
                      card.metric.isPositive
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                    )}
                  >
                    {card.metric.isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                    <span>{change > 0 ? `+${change}%` : `${change}%`}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
