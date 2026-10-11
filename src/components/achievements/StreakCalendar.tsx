'use client';

import React from 'react';
import { Check, Flame } from 'lucide-react';
import { getLocalDateString } from '@/lib/achievements/engine';

export interface StreakCalendarProps {
  qualifyingDates?: string[]; // YYYY-MM-DD
  timezone?: string;
  daysToShow?: number;
  className?: string;
}

export function StreakCalendar({
  qualifyingDates = [],
  timezone = 'UTC',
  daysToShow = 14,
  className = '',
}: StreakCalendarProps) {
  const activeDateSet = new Set(qualifyingDates);
  const todayStr = getLocalDateString(new Date(), timezone);

  // Generate sequence of past N days ending with today
  const dayItems = [];
  for (let i = daysToShow - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = getLocalDateString(d, timezone);
    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayOfMonth = d.getDate();
    const isCompleted = activeDateSet.has(dateStr);
    const isToday = dateStr === todayStr;

    dayItems.push({
      dateStr,
      dayOfWeek,
      dayOfMonth,
      isCompleted,
      isToday,
    });
  }

  return (
    <div className={`rounded-3xl border border-border bg-card p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <h4 className="text-sm font-bold text-foreground">Recent Activity Strip</h4>
        </div>
        <span className="text-xs text-stone-500">Last {daysToShow} Days</span>
      </div>

      {/* Horizontal Strip */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-2">
        {dayItems.map((day) => (
          <div
            key={day.dateStr}
            className={`flex flex-col items-center min-w-[38px] p-2 rounded-2xl border transition-all ${
              day.isCompleted
                ? 'bg-amber-100 dark:bg-amber-500/15 border-amber-300 dark:border-amber-400/40 text-amber-900 dark:text-amber-200'
                : day.isToday
                ? 'bg-amber-50/60 dark:bg-stone-800 border-2 border-dashed border-amber-500 text-stone-900 dark:text-stone-100'
                : 'bg-stone-100/80 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
            }`}
          >
            <span className="text-[10px] font-bold uppercase text-stone-600 dark:text-stone-400">
              {day.dayOfWeek[0]}
            </span>
            <div
              className={`w-7 h-7 my-1 rounded-full flex items-center justify-center text-xs font-bold ${
                day.isCompleted
                  ? 'bg-amber-500 text-white shadow-sm font-black'
                  : day.isToday
                  ? 'bg-amber-500 text-white font-black shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {day.isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : day.dayOfMonth}
            </div>
            <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400">
              {day.isToday ? 'Today' : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
