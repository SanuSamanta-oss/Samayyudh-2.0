'use client';

import { ArrowUpRight, Clock, Pencil } from 'lucide-react';
import { CATEGORY_META } from '@/types/reminders';
import type { UpcomingScheduleItem } from '@/lib/notifications/reminder-service';
import { CategoryIcon } from './category-icons';

interface UpcomingTasksProps {
  items: UpcomingScheduleItem[];
  onEditItem: (item: UpcomingScheduleItem) => void;
  onAddReminder: () => void;
}

export function UpcomingTasks({
  items,
  onEditItem,
  onAddReminder,
}: UpcomingTasksProps) {
  return (
    <section aria-label="Upcoming reminders" className="space-y-3">
      <div className="flex items-center justify-between gap-2 px-1">
        <div>
          <h2 className="text-[17px] font-semibold tracking-tight text-[#25233A] dark:text-[#F5F3FF]">
            Upcoming Reminders
          </h2>
          <p className="text-[12px] text-[#77758A] dark:text-[#B0ADBF]">
            Next scheduled alarms across your study calendar
          </p>
        </div>
        <button
          type="button"
          onClick={onAddReminder}
          className="text-[12px] font-semibold text-[#7667C8] dark:text-[#8D7BE0] hover:opacity-80 inline-flex items-center gap-1 transition-opacity"
        >
          <span>Schedule new</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#181822] p-5 text-[13px] text-[#77758A] dark:text-[#B0ADBF] shadow-[0_2px_8px_rgba(30,25,60,0.035)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.28)]">
          No active upcoming reminders right now. Enable an existing slot or create a new reminder.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {items.slice(0, 6).map((item) => {
            const meta = CATEGORY_META[item.category] || CATEGORY_META.custom;
            return (
              <div
                key={item.id}
                className="group rounded-2xl bg-[#FFFFFF] dark:bg-[#181822] p-4 shadow-[0_2px_8px_rgba(30,25,60,0.035)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.28)] hover:shadow-[0_8px_24px_rgba(30,25,60,0.065)] dark:hover:shadow-[0_10px_28px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-150 flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#EAE5FA] dark:bg-[#302A48] text-[#7667C8] dark:text-[#8D7BE0] text-[11px] font-semibold">
                    <CategoryIcon category={item.category} className="w-3 h-3" />
                    {meta.label}
                  </span>

                  {!item.isStreak && (
                    <button
                      type="button"
                      onClick={() => onEditItem(item)}
                      aria-label={`Edit ${item.title}`}
                      className="p-1.5 rounded-lg text-[#A19EB1] hover:text-[#25233A] dark:hover:text-[#F5F3FF] hover:bg-[#F0EDF8] dark:hover:bg-[#20202C] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <h3 className="text-[14px] font-semibold text-[#25233A] dark:text-[#F5F3FF] truncate">
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-[#77758A] dark:text-[#B0ADBF] mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#7667C8] dark:text-[#8D7BE0] shrink-0" />
                    <span className="font-medium text-[#25233A] dark:text-[#F5F3FF] tabular-nums">
                      {item.formattedTime}
                    </span>
                    <span className="text-[#A19EB1] dark:text-[#858195]">
                      &middot; {item.dayLabel}
                    </span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-semibold text-[#7667C8] dark:text-[#8D7BE0]">
                    {item.dayLabel}
                  </span>
                  <span className="text-[11px] font-medium text-[#A19EB1] dark:text-[#858195]">
                    {item.enabled ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
