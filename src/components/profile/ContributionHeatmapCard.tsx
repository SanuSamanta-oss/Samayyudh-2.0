'use client';

import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CalendarDays, CheckCircle2, Clock, Target, X } from 'lucide-react';
import type { Answer, ExamSession } from '@/types';
import type { DailyUsageBucket } from '@/lib/usage/tracker';

const CONTRIBUTION_COLORS = [
  '#EBEDF0', // Level 0
  '#9BE9A8', // Level 1
  '#40C463', // Level 2
  '#30A14E', // Level 3
  '#216E39', // Level 4
] as const;

type HeatmapRange = '3m' | '6m' | '12m';

interface DailyActivityRecord {
  dateKey: string;
  dateObj: Date;
  questionsAttempted: number;
  completedSessions: number;
  studySeconds: number;
  score: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionHeatmapCardProps {
  answers: Answer[];
  sessions: ExamSession[];
  appUsageBuckets: Record<string, DailyUsageBucket>;
}

function toLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatStudyDuration(seconds: number): string {
  if (seconds <= 0) return '0m';
  if (seconds < 60) return '< 1m';
  const totalMin = Math.round(seconds / 60);
  if (totalMin < 60) return `${totalMin}m`;
  const hrs = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

function getContributionLevel(score: number): 0 | 1 | 2 | 3 | 4 {
  if (score <= 0) return 0;
  if (score <= 3) return 1;
  if (score <= 8) return 2;
  if (score <= 16) return 3;
  return 4;
}

export function ContributionHeatmapCard({
  answers,
  sessions,
  appUsageBuckets,
}: ContributionHeatmapCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [range, setRange] = useState<HeatmapRange>('6m');
  const [hoveredCell, setHoveredCell] = useState<{
    record: DailyActivityRecord;
    weekIndex: number;
    totalWeeks: number;
  } | null>(null);
  const [selectedDay, setSelectedDay] = useState<DailyActivityRecord | null>(null);

  // Deduplicated daily activity aggregation across answers, sessions, and usage buckets
  const activityByDate = useMemo(() => {
    const map = new Map<
      string,
      {
        answerIds: Set<string>;
        sessionIds: Set<string>;
        answerSeconds: number;
        bucketSeconds: number;
      }
    >();

    const ensure = (dateKey: string) => {
      let entry = map.get(dateKey);
      if (!entry) {
        entry = {
          answerIds: new Set(),
          sessionIds: new Set(),
          answerSeconds: 0,
          bucketSeconds: 0,
        };
        map.set(dateKey, entry);
      }
      return entry;
    };

    answers.forEach((a) => {
      const hasEffort =
        Boolean((a.answer_text || a.selected_option || '').trim()) ||
        (a.time_spent_seconds || 0) > 0;
      if (!hasEffort) return;

      const rawTs = a.last_saved_at || a.started_at;
      if (!rawTs) return;
      const dt = new Date(rawTs);
      if (Number.isNaN(dt.getTime())) return;

      const key = toLocalDateKey(dt);
      const entry = ensure(key);
      if (!entry.answerIds.has(a.id)) {
        entry.answerIds.add(a.id);
        entry.answerSeconds += Math.max(0, a.time_spent_seconds || 0);
      }
    });

    sessions.forEach((s) => {
      const isCompleted =
        s.status === 'completed' || s.status === 'evaluated' || Boolean(s.completed_at);
      if (!isCompleted) return;

      const rawTs = s.completed_at || s.started_at || s.created_at;
      if (!rawTs) return;
      const dt = new Date(rawTs);
      if (Number.isNaN(dt.getTime())) return;

      const key = toLocalDateKey(dt);
      const entry = ensure(key);
      entry.sessionIds.add(s.id);
    });

    Object.values(appUsageBuckets).forEach((bucket) => {
      if (!bucket?.date || (bucket.totalActiveSeconds || 0) <= 0) return;
      const entry = ensure(bucket.date);
      entry.bucketSeconds = Math.max(entry.bucketSeconds, bucket.totalActiveSeconds);
    });

    return map;
  }, [answers, sessions, appUsageBuckets]);

  // Build weekly grid ending on today's week
  const { weeks, monthLabels, totalContributions, activeDaysInRange } = useMemo(() => {
    const weekCount = range === '3m' ? 14 : range === '6m' ? 26 : 52;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // End of current week (Saturday) so grid is aligned Sun->Sat vertically
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    const startDate = new Date(endOfWeek);
    startDate.setDate(endOfWeek.getDate() - weekCount * 7 + 1);

    const gridWeeks: (DailyActivityRecord | null)[][] = [];
    const months: { weekIndex: number; label: string }[] = [];
    let lastLabeledMonth = -1;
    let contribSum = 0;
    let activeCount = 0;

    const cursor = new Date(startDate);
    for (let w = 0; w < weekCount; w++) {
      const column: (DailyActivityRecord | null)[] = [];
      let monthAssignedThisCol = false;

      for (let d = 0; d < 7; d++) {
        const cellDate = new Date(cursor);
        cursor.setDate(cursor.getDate() + 1);

        if (cellDate > today) {
          column.push(null);
          continue;
        }

        const dateKey = toLocalDateKey(cellDate);
        if (!monthAssignedThisCol && cellDate.getDate() <= 7 && cellDate.getMonth() !== lastLabeledMonth) {
          months.push({
            weekIndex: w,
            label: cellDate.toLocaleDateString('en-US', { month: 'short' }),
          });
          lastLabeledMonth = cellDate.getMonth();
          monthAssignedThisCol = true;
        } else if (w === 0 && d === 0 && lastLabeledMonth === -1) {
          months.push({
            weekIndex: 0,
            label: cellDate.toLocaleDateString('en-US', { month: 'short' }),
          });
          lastLabeledMonth = cellDate.getMonth();
          monthAssignedThisCol = true;
        }

        const raw = activityByDate.get(dateKey);
        const questionsAttempted = raw ? raw.answerIds.size : 0;
        const completedSessions = raw ? raw.sessionIds.size : 0;
        const studySeconds = raw
          ? Math.max(raw.answerSeconds, raw.bucketSeconds)
          : 0;

        // Weighted daily score from actual questions, completed sessions & sustained study time
        const studyUnits = studySeconds >= 120 ? Math.floor(studySeconds / 300) || 1 : 0;
        const score = questionsAttempted + completedSessions * 3 + studyUnits;
        const level = getContributionLevel(score);

        if (score > 0) {
          contribSum += questionsAttempted + completedSessions;
          activeCount++;
        }

        column.push({
          dateKey,
          dateObj: cellDate,
          questionsAttempted,
          completedSessions,
          studySeconds,
          score,
          level,
        });
      }

      gridWeeks.push(column);
    }

    return {
      weeks: gridWeeks,
      monthLabels: months,
      totalContributions: contribSum,
      activeDaysInRange: activeCount,
    };
  }, [activityByDate, range]);

  const cellSizeClass = range === '12m' ? 'w-2.5 h-2.5 sm:w-[11px] sm:h-[11px]' : 'w-3 h-3 sm:w-[13px] sm:h-[13px]';
  const gridGapClass = range === '12m' ? 'gap-[3px]' : 'gap-1';

  return (
    <section className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 sm:p-6 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)]">
      {/* Header + Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/12 dark:bg-emerald-500/20 flex items-center justify-center text-[#216E39] dark:text-[#40C463]">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Contribution Activity
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalContributions} {totalContributions === 1 ? 'activity' : 'activities'} across{' '}
              {activeDaysInRange} active {activeDaysInRange === 1 ? 'day' : 'days'}
            </p>
          </div>
        </div>

        {/* Range Switcher (3M / 6M / 12M) */}
        <div
          role="group"
          aria-label="Contribution graph time window"
          className="inline-flex items-center p-1 rounded-2xl bg-stone-100/90 dark:bg-[#162032] self-start sm:self-auto"
        >
          {(
            [
              { id: '3m', label: '3M' },
              { id: '6m', label: '6M' },
              { id: '12m', label: '12M' },
            ] as const
          ).map((option) => {
            const active = range === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setRange(option.id);
                  setHoveredCell(null);
                }}
                className={`relative px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="heatmap-range-pill"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.1 }
                        : { type: 'spring', stiffness: 420, damping: 32 }
                    }
                    className="absolute inset-0 rounded-xl bg-white dark:bg-[#223050] shadow-xs"
                  />
                )}
                <span className="relative z-10">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Heatmap Matrix */}
      <div className="relative">
        {/* Hover Tooltip */}
        {hoveredCell && (
          <div
            role="status"
            className="pointer-events-none absolute -top-14 z-30 transition-all duration-150"
            style={{
              left: `${Math.min(
                Math.max(((hoveredCell.weekIndex + 0.5) / hoveredCell.totalWeeks) * 100, 12),
                88
              )}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-[#0A0F1D] text-white shadow-xl whitespace-nowrap text-[11px]">
              <p className="font-semibold text-slate-100">
                {hoveredCell.record.dateObj.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <div className="flex items-center gap-2.5 mt-0.5 text-slate-300">
                <span>{hoveredCell.record.questionsAttempted} questions</span>
                <span>•</span>
                <span>{formatStudyDuration(hoveredCell.record.studySeconds)}</span>
                <span>•</span>
                <span>{hoveredCell.record.completedSessions} sessions</span>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto pb-2">
          <div className="inline-flex flex-col min-w-max">
            {/* Month Labels */}
            <div className="flex items-center pl-8 mb-1.5 relative h-4">
              {monthLabels.map((m, idx) => (
                <span
                  key={`${m.label}-${m.weekIndex}-${idx}`}
                  style={{
                    gridColumnStart: m.weekIndex + 1,
                    left: `calc(${m.weekIndex} * ${range === '12m' ? '14px' : '17px'} + 32px)`,
                  }}
                  className="absolute text-[10px] font-medium text-slate-400 dark:text-slate-400 select-none"
                >
                  {m.label}
                </span>
              ))}
            </div>

            {/* Grid Body: Mon/Wed/Fri labels + Weekly Columns */}
            <div className="flex items-start gap-2">
              {/* Weekday Labels (Mon, Wed, Fri at rows 1, 3, 5) */}
              <div
                className={`grid grid-rows-7 ${gridGapClass} text-[10px] font-medium text-slate-400 dark:text-slate-400 pr-1 select-none`}
              >
                <span className={`${cellSizeClass} !w-6 flex items-center`} />
                <span className={`${cellSizeClass} !w-6 flex items-center`}>Mon</span>
                <span className={`${cellSizeClass} !w-6 flex items-center`} />
                <span className={`${cellSizeClass} !w-6 flex items-center`}>Wed</span>
                <span className={`${cellSizeClass} !w-6 flex items-center`} />
                <span className={`${cellSizeClass} !w-6 flex items-center`}>Fri</span>
                <span className={`${cellSizeClass} !w-6 flex items-center`} />
              </div>

              {/* Week Columns */}
              <div className={`flex ${gridGapClass}`}>
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className={`grid grid-rows-7 ${gridGapClass}`}>
                    {week.map((day, dIdx) => {
                      if (!day) {
                        return (
                          <div
                            key={`empty-${wIdx}-${dIdx}`}
                            className={`${cellSizeClass} rounded-[3px] opacity-0 pointer-events-none`}
                          />
                        );
                      }

                      const isSelected = selectedDay?.dateKey === day.dateKey;
                      const bgHex = CONTRIBUTION_COLORS[day.level];

                      return (
                        <motion.button
                          key={day.dateKey}
                          type="button"
                          onClick={() =>
                            setSelectedDay((prev) =>
                              prev?.dateKey === day.dateKey ? null : day
                            )
                          }
                          onMouseEnter={() =>
                            setHoveredCell({
                              record: day,
                              weekIndex: wIdx,
                              totalWeeks: weeks.length,
                            })
                          }
                          onMouseLeave={() => setHoveredCell(null)}
                          onFocus={() =>
                            setHoveredCell({
                              record: day,
                              weekIndex: wIdx,
                              totalWeeks: weeks.length,
                            })
                          }
                          onBlur={() => setHoveredCell(null)}
                          aria-label={`${day.dateKey}: ${day.questionsAttempted} questions, ${formatStudyDuration(day.studySeconds)} study time, ${day.completedSessions} sessions`}
                          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.75 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={
                            prefersReducedMotion
                              ? { duration: 0 }
                              : {
                                  duration: 0.2,
                                  delay: Math.min(wIdx * 0.012, 0.35),
                                }
                          }
                          style={{ backgroundColor: bgHex }}
                          className={`${cellSizeClass} rounded-[3px] transition-transform duration-150 hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
                            isSelected ? 'ring-2 ring-slate-900 dark:ring-white scale-115' : ''
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Hint + Less -> More Green Legend */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-400">
          <span>Click any square to inspect daily details</span>

          <div className="flex items-center gap-1.5">
            <span>Less</span>
            <div className="flex items-center gap-1">
              {CONTRIBUTION_COLORS.map((hex, levelIdx) => (
                <span
                  key={hex}
                  title={`Intensity level ${levelIdx}`}
                  style={{ backgroundColor: hex }}
                  className="w-3 h-3 rounded-[3px] inline-block"
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Clicked Day Detail Drawer */}
        {selectedDay && (
          <div className="mt-4 p-3.5 rounded-2xl bg-stone-50/95 dark:bg-[#162032] flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {selectedDay.dateObj.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#30A14E]" />
                  <strong className="text-slate-900 dark:text-white">
                    {selectedDay.questionsAttempted}
                  </strong>{' '}
                  questions attempted
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#30A14E]" />
                  <strong className="text-slate-900 dark:text-white">
                    {formatStudyDuration(selectedDay.studySeconds)}
                  </strong>{' '}
                  study time
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#30A14E]" />
                  <strong className="text-slate-900 dark:text-white">
                    {selectedDay.completedSessions}
                  </strong>{' '}
                  completed {selectedDay.completedSessions === 1 ? 'session' : 'sessions'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDay(null)}
              aria-label="Close day details"
              className="p-1.5 rounded-xl bg-white dark:bg-[#1F2D4A] text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

