'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, CheckCircle2, AlertTriangle, Zap,
  TrendingUp, Calendar, BookOpen, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProcessedAnalytics } from '@/lib/analytics/data-processor';

interface PersonalizedInsightsProps {
  insights: ProcessedAnalytics['insights'];
}

/**
 * Performance Insights Component (Smooth, No Outlines, Refined Typography)
 */
export function PersonalizedInsights({ insights }: PersonalizedInsightsProps) {
  const cards = [
    insights.strongestSubject ? {
      id: 'strongest',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
      badge: 'Strongest Subject',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
      title: insights.strongestSubject.name,
      description: `High mastery with ${insights.strongestSubject.accuracy}% accuracy across evaluated questions.`,
    } : null,

    insights.weakestSubject ? {
      id: 'weakest',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
      badge: 'Focus Area',
      badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
      title: insights.weakestSubject.name,
      description: `Accuracy currently at ${insights.weakestSubject.accuracy}%. Targeted formula revision recommended.`,
    } : null,

    insights.mostPracticedExam ? {
      id: 'top-exam',
      icon: <BookOpen className="w-3.5 h-3.5 text-purple-500" />,
      badge: 'Most Practiced Exam',
      badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300',
      title: insights.mostPracticedExam.name,
      description: `${insights.mostPracticedExam.count} authentic questions attempted in this category.`,
    } : null,

    insights.mostPracticedTopic ? {
      id: 'top-topic',
      icon: <Layers className="w-3.5 h-3.5 text-indigo-500" />,
      badge: 'Dominant Topic',
      badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300',
      title: insights.mostPracticedTopic.name,
      description: `${insights.mostPracticedTopic.count} questions solved. Core concepts well reinforced.`,
    } : null,

    insights.productivityPeakDay ? {
      id: 'peak-day',
      icon: <Calendar className="w-3.5 h-3.5 text-sky-500" />,
      badge: 'Peak Productive Day',
      badgeClass: 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300',
      title: insights.productivityPeakDay,
      description: `Highest volume of questions and study hours occurs on ${insights.productivityPeakDay}s.`,
    } : null,

    {
      id: 'speed-cadence',
      icon: <Zap className="w-3.5 h-3.5 text-rose-500" />,
      badge: 'Solving Rhythm',
      badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300',
      title: insights.accuracyTrend,
      description: insights.speedAssessment,
    },
  ].filter(Boolean);

  return (
    <div className="space-y-3.5">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-500" />
        <h3 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white tracking-tight">
          Your Performance Insights
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
        {cards.map((card: any, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            whileHover={{ y: -2 }}
            className="p-4 sm:p-4.5 rounded-[24px] bg-white dark:bg-[#111A2E] shadow-sm flex flex-col justify-between space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs', card.badgeClass)}>
                {card.badge}
              </span>
              {card.icon}
            </div>

            <div>
              <h4 className="text-sm font-extrabold text-stone-900 dark:text-white truncate">
                {card.title}
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                {card.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
