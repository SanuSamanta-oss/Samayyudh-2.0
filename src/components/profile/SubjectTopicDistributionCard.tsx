'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Layers, PieChart, ArrowUpRight } from 'lucide-react';
import type { DonutSegment } from '@/lib/analytics/data-processor';
import { SegmentedDonutChart } from '@/components/analytics/SegmentedDonutChart';

export interface SubjectTopicDistributionCardProps {
  subjectDistribution: DonutSegment[];
  topicDistribution: DonutSegment[];
}

type DistributionMode = 'subject' | 'topic';

export function SubjectTopicDistributionCard({
  subjectDistribution,
  topicDistribution,
}: SubjectTopicDistributionCardProps) {
  const [mode, setMode] = useState<DistributionMode>('subject');
  const prefersReducedMotion = useReducedMotion();

  const activeData = mode === 'subject' ? subjectDistribution : topicDistribution;
  const totalCount = activeData.reduce((sum, item) => sum + item.value, 0);
  const hasAnyData = subjectDistribution.length > 0 || topicDistribution.length > 0;

  return (
    <section className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 sm:p-6 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)]">
      {/* Header + Segmented Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-500/12 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {mode === 'subject' ? 'Subject Distribution' : 'Topic Distribution'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {hasAnyData
                  ? `${totalCount} ${totalCount === 1 ? 'question' : 'questions'} analyzed from practice history`
                  : 'Learning activity breakdown by subject and topic'}
              </p>
            </div>
          </div>
        </div>

        {/* Smooth Animated Pill Switcher */}
        <div
          role="tablist"
          aria-label="Distribution category"
          className="inline-flex items-center p-1 rounded-2xl bg-stone-100/90 dark:bg-[#162032] self-start sm:self-auto"
        >
          {(
            [
              { id: 'subject', label: 'Subject' },
              { id: 'topic', label: 'Topic' },
            ] as const
          ).map((tab) => {
            const isActive = mode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setMode(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'text-violet-700 dark:text-violet-200'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="profile-distribution-tab"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.1 }
                        : { type: 'spring', stiffness: 420, damping: 32 }
                    }
                    className="absolute inset-0 rounded-xl bg-white dark:bg-[#223050] shadow-xs"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Area or Empty State */}
      {!hasAnyData ? (
        <div className="py-10 px-4 rounded-2xl bg-stone-50/80 dark:bg-[#162032]/70 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/12 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-3">
            <PieChart className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            No distribution data yet
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
            Complete a practice session or mock test to visualize your subject and topic coverage.
          </p>
          <Link
            href="/practice"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors"
          >
            Start Practicing
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <SegmentedDonutChart
              title=""
              data={activeData}
              totalLabel={mode === 'subject' ? 'Subjects' : 'Topics'}
              size={196}
              thickness={26}
              className="bg-transparent! dark:bg-transparent! shadow-none! p-0! rounded-none!"
            />
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}

