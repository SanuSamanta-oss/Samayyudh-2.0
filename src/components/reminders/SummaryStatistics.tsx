'use client';

import React from 'react';
import { CalendarDays, Clock, Flame, ListChecks } from 'lucide-react';

export interface SummaryStatisticsProps {
  todayCount: number;
  completedTodayCount: number;
  upcomingCount: number;
  nextUpcomingLabel: string;
  activeStreakDays: number;
  todayStudyMinutes: number;
}

function formatStudyTime(minutes: number): string {
  if (minutes <= 0) return '0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function SummaryStatistics({
  todayCount,
  completedTodayCount,
  upcomingCount,
  nextUpcomingLabel,
  activeStreakDays,
  todayStudyMinutes,
}: SummaryStatisticsProps) {
  const cards = [
    {
      id: 'today',
      label: "Today's Reminders",
      value: String(todayCount),
      subtitle: `${completedTodayCount} completed today`,
      icon: ListChecks,
      tint: 'bg-[#EAE5FA] text-[#7667C8] dark:bg-[#302A48] dark:text-[#8D7BE0]',
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      value: String(upcomingCount),
      subtitle: nextUpcomingLabel,
      icon: CalendarDays,
      tint: 'bg-[#EAE5FA] text-[#7667C8] dark:bg-[#302A48] dark:text-[#8D7BE0]',
    },
    {
      id: 'streak',
      label: 'Active Streak',
      value: `${activeStreakDays} ${activeStreakDays === 1 ? 'day' : 'days'}`,
      subtitle:
        activeStreakDays > 0
          ? 'Keep your momentum going'
          : 'Complete a session today',
      icon: Flame,
      tint: 'bg-amber-500/12 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    },
    {
      id: 'study-time',
      label: 'Study Time',
      value: formatStudyTime(todayStudyMinutes),
      subtitle: 'Total study time today',
      icon: Clock,
      tint: 'bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="rounded-[20px] bg-white dark:bg-[#181822] p-4 sm:p-[18px] shadow-[0_2px_8px_rgba(30,25,60,0.035)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.28)] flex flex-col justify-between gap-3 transition-colors duration-200"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[#77758A] dark:text-[#B0ADBF]">
                {card.label}
              </span>
              <div
                className={`w-8 h-8 rounded-[12px] ${card.tint} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-4 h-4 stroke-[1.9]" />
              </div>
            </div>

            <div>
              <p className="text-2xl font-bold tracking-tight text-[#25233A] dark:text-[#F5F3FF] tabular-nums leading-none">
                {card.value}
              </p>
              <p className="text-[11px] sm:text-xs text-[#A19EB1] dark:text-[#858195] mt-1.5 truncate">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

