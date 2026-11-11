'use client';

import { useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarX2,
  Moon,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import type { TaskCategory } from '@/types/reminders';
import { ReminderRow } from './ReminderRow';

export interface ScheduleDisplayItem {
  id: string;
  kind: 'custom' | 'battle' | 'streak';
  title: string;
  description?: string;
  category: TaskCategory;
  timeHHMM: string;
  formattedTime: string;
  countdown?: string;
  enabled: boolean;
  completed?: boolean;
  canComplete?: boolean;
  canDelete?: boolean;
}

export interface WeekDateChip {
  date: Date;
  dateKey: string;
  dayShort: string;
  dayNum: number;
  isToday: boolean;
  hasActivity: boolean;
}

interface TodayScheduleProps {
  selectedDate: Date;
  selectedDateKey: string;
  isViewingToday: boolean;
  weekDays: WeekDateChip[];
  currentTimeHHMM: string;
  currentTimeFormatted: string;
  items: ScheduleDisplayItem[];
  onSelectDate: (date: Date) => void;
  onShiftWeek: (delta: number) => void;
  onJumpToday: () => void;
  onToggleEnabled: (item: ScheduleDisplayItem) => void;
  onToggleCompleted: (item: ScheduleDisplayItem) => void;
  onEditItem: (item: ScheduleDisplayItem) => void;
  onDeleteItem: (item: ScheduleDisplayItem) => void;
  onAddReminder: () => void;
  searchActive: boolean;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map((n) => parseInt(n, 10));
  return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
}

export function TodaySchedule({
  selectedDate,
  selectedDateKey,
  isViewingToday,
  weekDays,
  currentTimeHHMM,
  currentTimeFormatted,
  items,
  onSelectDate,
  onShiftWeek,
  onJumpToday,
  onToggleEnabled,
  onToggleCompleted,
  onEditItem,
  onDeleteItem,
  onAddReminder,
  searchActive,
}: TodayScheduleProps) {
  const readableDate = useMemo(
    () =>
      selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    [selectedDate]
  );

  const nowMinutes = toMinutes(currentTimeHHMM);

  // Split items cleanly before and after NOW when viewing today
  const { beforeNow, afterNow } = useMemo(() => {
    if (!isViewingToday) {
      return { beforeNow: items, afterNow: [] as ScheduleDisplayItem[] };
    }
    const before: ScheduleDisplayItem[] = [];
    const after: ScheduleDisplayItem[] = [];
    for (const item of items) {
      if (toMinutes(item.timeHHMM) <= nowMinutes) {
        before.push(item);
      } else {
        after.push(item);
      }
    }
    return { beforeNow: before, afterNow: after };
  }, [items, isViewingToday, nowMinutes]);

  const hasMorningQuiet = useMemo(
    () => !items.some((i) => toMinutes(i.timeHHMM) < 360),
    [items]
  );
  const hasNightQuiet = useMemo(
    () => !items.some((i) => toMinutes(i.timeHHMM) >= 1380),
    [items]
  );

  return (
    <section
      aria-label="Daily schedule"
      className="rounded-2xl bg-[#FFFFFF] dark:bg-[#181822] p-5 sm:p-6 shadow-[0_8px_24px_rgba(30,25,60,0.055)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.36)]"
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-[19px] sm:text-[21px] font-semibold tracking-tight text-[#25233A] dark:text-[#F5F3FF]">
              {isViewingToday ? "Today's Schedule" : 'Scheduled Timeline'}
            </h2>
            {isViewingToday && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#EAE5FA] dark:bg-[#302A48] text-[#7667C8] dark:text-[#8D7BE0] text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7667C8] dark:bg-[#8D7BE0]" />
                TODAY
              </span>
            )}
          </div>
          <p className="text-[13px] text-[#77758A] dark:text-[#B0ADBF] mt-0.5">
            {readableDate} &middot; {items.length}{' '}
            {items.length === 1 ? 'scheduled item' : 'scheduled items'}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {!isViewingToday && (
            <button
              type="button"
              onClick={onJumpToday}
              className="h-8 px-2.5 rounded-xl bg-[#EAE5FA] dark:bg-[#302A48] text-[#7667C8] dark:text-[#8D7BE0] text-[12px] font-semibold hover:opacity-90 transition-opacity"
            >
              Back to Today
            </button>
          )}
          <button
            type="button"
            onClick={() => onShiftWeek(-1)}
            aria-label="Previous week"
            className="h-8 w-8 rounded-xl bg-[#F0EDF8] dark:bg-[#20202C] hover:bg-[#EAE6F5] dark:hover:bg-[#29283A] text-[#77758A] dark:text-[#B0ADBF] hover:text-[#25233A] dark:hover:text-[#F5F3FF] inline-flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onShiftWeek(1)}
            aria-label="Next week"
            className="h-8 w-8 rounded-xl bg-[#F0EDF8] dark:bg-[#20202C] hover:bg-[#EAE6F5] dark:hover:bg-[#29283A] text-[#77758A] dark:text-[#B0ADBF] hover:text-[#25233A] dark:hover:text-[#F5F3FF] inline-flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Compact Horizontal 7-Day Date Strip (Zero Borders) */}
      <div
        role="tablist"
        aria-label="Select schedule date"
        className="grid grid-cols-7 gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[#F0EDF8]/80 dark:bg-[#20202C]/80 mb-5"
      >
        {weekDays.map((chip) => {
          const isSelected = chip.dateKey === selectedDateKey;
          return (
            <button
              key={chip.dateKey}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectDate(chip.date)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7667C8]/40 dark:focus-visible:ring-[#8D7BE0]/40 ${
                isSelected
                  ? 'bg-[#EAE5FA] dark:bg-[#302A48] text-[#7667C8] dark:text-[#8D7BE0] shadow-[0_2px_8px_rgba(30,25,60,0.06)]'
                  : 'text-[#77758A] dark:text-[#B0ADBF] hover:bg-[#FFFFFF]/70 dark:hover:bg-[#29283A] hover:text-[#25233A] dark:hover:text-[#F5F3FF]'
              }`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                {chip.dayShort}
              </span>
              <span
                className={`text-[14px] sm:text-[15px] font-semibold tabular-nums mt-0.5 ${
                  isSelected
                    ? 'text-[#7667C8] dark:text-[#8D7BE0]'
                    : chip.isToday
                      ? 'text-[#7667C8] dark:text-[#8D7BE0]'
                      : 'text-[#25233A] dark:text-[#F5F3FF]'
                }`}
              >
                {chip.dayNum}
              </span>
              <span
                className={`mt-1 w-1.5 h-1.5 rounded-full transition-opacity ${
                  chip.hasActivity
                    ? isSelected
                      ? 'bg-[#7667C8] dark:bg-[#8D7BE0] opacity-100'
                      : 'bg-[#7667C8]/50 dark:bg-[#8D7BE0]/50 opacity-100'
                    : 'opacity-0'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Schedule Content */}
      {items.length === 0 ? (
        <div className="rounded-2xl bg-[#F0EDF8]/75 dark:bg-[#20202C]/75 px-5 py-10 text-center">
          <div className="w-11 h-11 rounded-2xl bg-[#EAE5FA] dark:bg-[#302A48] text-[#7667C8] dark:text-[#8D7BE0] mx-auto flex items-center justify-center mb-3">
            <CalendarX2 className="w-5 h-5" />
          </div>
          <h3 className="text-[15px] font-semibold text-[#25233A] dark:text-[#F5F3FF]">
            {searchActive ? 'No matching reminders' : 'No study reminders scheduled'}
          </h3>
          <p className="text-[13px] text-[#77758A] dark:text-[#B0ADBF] mt-1 max-w-sm mx-auto">
            {searchActive
              ? 'Try another keyword or clear your search filter to see the full day timeline.'
              : 'Stay consistent by adding your next practice battle, revision block, or daily mock alarm.'}
          </p>
          {!searchActive && (
            <button
              type="button"
              onClick={onAddReminder}
              className="mt-4 h-9 px-4 rounded-xl bg-[#7667C8] dark:bg-[#8D7BE0] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 shadow-[0_4px_12px_rgba(118,103,200,0.28)] hover:opacity-95 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add Reminder
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {/* Quiet Morning Window Strip (Minimal) */}
          {hasMorningQuiet && (
            <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#F0EDF8]/60 dark:bg-[#20202C]/60 text-[12px] text-[#A19EB1] dark:text-[#858195]">
              <span className="inline-flex items-center gap-2">
                <Sun className="w-3.5 h-3.5" />
                <span>Quiet Morning &middot; 00:00 – 06:00</span>
              </span>
              <span className="font-medium">No alarms</span>
            </div>
          )}

          {/* Items Before Current Time */}
          {beforeNow.map((item) => (
            <ReminderRow
              key={item.id}
              id={item.id}
              kind={item.kind}
              title={item.title}
              description={item.description}
              category={item.category}
              formattedTime={item.formattedTime}
              countdown={item.countdown}
              enabled={item.enabled}
              completed={item.completed}
              canComplete={item.canComplete}
              canDelete={item.canDelete}
              onToggleEnabled={() => onToggleEnabled(item)}
              onToggleCompleted={() => onToggleCompleted(item)}
              onEdit={
                item.kind !== 'streak' ? () => onEditItem(item) : undefined
              }
              onDelete={
                item.canDelete ? () => onDeleteItem(item) : undefined
              }
            />
          ))}

          {/* Current Time Inline Divider (Today only) */}
          {isViewingToday && (
            <div
              className="flex items-center gap-3 py-1.5"
              aria-label={`Current time ${currentTimeFormatted}`}
            >
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#7667C8]/30 dark:via-[#8D7BE0]/30 to-[#7667C8]/40 dark:to-[#8D7BE0]/40" />
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#EAE5FA] dark:bg-[#302A48] text-[#7667C8] dark:text-[#8D7BE0] text-[11px] font-semibold tabular-nums">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7667C8] dark:bg-[#8D7BE0]" />
                NOW &middot; {currentTimeFormatted}
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#7667C8]/30 dark:via-[#8D7BE0]/30 to-[#7667C8]/40 dark:to-[#8D7BE0]/40" />
            </div>
          )}

          {/* Items After Current Time */}
          {afterNow.map((item) => (
            <ReminderRow
              key={item.id}
              id={item.id}
              kind={item.kind}
              title={item.title}
              description={item.description}
              category={item.category}
              formattedTime={item.formattedTime}
              countdown={item.countdown}
              enabled={item.enabled}
              completed={item.completed}
              canComplete={item.canComplete}
              canDelete={item.canDelete}
              onToggleEnabled={() => onToggleEnabled(item)}
              onToggleCompleted={() => onToggleCompleted(item)}
              onEdit={
                item.kind !== 'streak' ? () => onEditItem(item) : undefined
              }
              onDelete={
                item.canDelete ? () => onDeleteItem(item) : undefined
              }
            />
          ))}

          {/* Quiet Night Window Strip (Minimal) */}
          {hasNightQuiet && (
            <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#F0EDF8]/60 dark:bg-[#20202C]/60 text-[12px] text-[#A19EB1] dark:text-[#858195]">
              <span className="inline-flex items-center gap-2">
                <Moon className="w-3.5 h-3.5" />
                <span>Late Night Rest &middot; 23:00 – 23:59</span>
              </span>
              <span className="inline-flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Protected
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

