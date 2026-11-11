'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Award, BookOpen, Flame, Target } from 'lucide-react';

export interface ProfileStatsGridProps {
  totalSessions: number;
  questionsAttempted: number;
  averageScore: number;
  activeDays: number;
  currentStreak?: number;
}

interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgClass: string;
  iconColorClass: string;
}

function AnimatedNumber({
  value,
  suffix = '',
  inView,
  reducedMotion,
}: {
  value: number;
  suffix?: string;
  inView: boolean;
  reducedMotion: boolean | null;
}) {
  const [animatedDisplay, setAnimatedDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reducedMotion || value === 0) return;

    let rafId = 0;
    const duration = 650;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedDisplay(Math.round(value * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setAnimatedDisplay(value);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value, inView, reducedMotion]);

  const shown = reducedMotion ? value : inView && value > 0 ? animatedDisplay : 0;

  return (
    <span className="tabular-nums">
      {shown.toLocaleString()}
      {suffix}
    </span>
  );
}

export function ProfileStatsGrid({
  totalSessions,
  questionsAttempted,
  averageScore,
  activeDays,
  currentStreak = 0,
}: ProfileStatsGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const items: StatItem[] = [
    {
      id: 'sessions',
      label: 'Total Sessions',
      value: totalSessions,
      sublabel: 'Completed & in-progress',
      icon: BookOpen,
      iconBgClass: 'bg-violet-500/12 dark:bg-violet-500/18',
      iconColorClass: 'text-violet-600 dark:text-violet-400',
    },
    {
      id: 'questions',
      label: 'Questions Attempted',
      value: questionsAttempted,
      sublabel: 'Across all exams',
      icon: Target,
      iconBgClass: 'bg-emerald-500/12 dark:bg-emerald-500/18',
      iconColorClass: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'score',
      label: 'Average Score',
      value: averageScore,
      suffix: '%',
      sublabel: 'Evaluated accuracy',
      icon: Award,
      iconBgClass: 'bg-amber-500/12 dark:bg-amber-500/18',
      iconColorClass: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 'streak',
      label: 'Active Days',
      value: activeDays,
      sublabel: currentStreak > 0 ? `${currentStreak}d current streak` : 'Consistent practice',
      icon: Flame,
      iconBgClass: 'bg-rose-500/12 dark:bg-rose-500/18',
      iconColorClass: 'text-rose-600 dark:text-rose-400',
    },
  ];

  return (
    <div ref={gridRef} className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.id}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="rounded-3xl bg-white dark:bg-[#111A2E] p-4 sm:p-5 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)] flex flex-col justify-between gap-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div
                className={`w-10 h-10 rounded-2xl ${item.iconBgClass} flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-5 h-5 ${item.iconColorClass}`} />
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                <AnimatedNumber
                  value={item.value}
                  suffix={item.suffix}
                  inView={isInView}
                  reducedMotion={prefersReducedMotion}
                />
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1.5">
                {item.label}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5 truncate">
                {item.sublabel}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
