'use client';

import {
  Plus,
  BookOpen,
  Swords,
  CheckSquare,
  Clock,
  ChevronRight,
} from 'lucide-react';
import type { ReminderSettings, ReminderTone, TaskCategory } from '@/types/reminders';
import type { CustomToneRecord } from '@/lib/notifications/custom-audio';
import type { UpcomingScheduleItem } from '@/lib/notifications/reminder-service';
import { NotificationSoundSettings } from './NotificationSoundSettings';
import { CategoryIcon } from './category-icons';

interface UtilityPanelProps {
  settings: ReminderSettings;
  upcomingItems: UpcomingScheduleItem[];
  customTone: CustomToneRecord | null;
  previewingTone: ReminderTone | null;
  isUploadingTone: boolean;
  toneUploadError: string | null;
  permission: NotificationPermission | 'unsupported';
  isTesting: boolean;
  onQuickCreate: (presetCategory?: TaskCategory) => void;
  onEditUpcoming: (item: UpcomingScheduleItem) => void;
  onUpdateSetting: <K extends keyof ReminderSettings>(
    key: K,
    value: ReminderSettings[K]
  ) => void;
  onPreviewTone: (tone: ReminderTone, customDataUrl?: string) => void;
  onUploadToneFile: (file: File) => Promise<CustomToneRecord | null>;
  onDeleteCustomTone: () => void;
  onRequestPermission: () => void;
  onRunTest: () => void;
}

export function UtilityPanel({
  settings,
  upcomingItems,
  customTone,
  previewingTone,
  isUploadingTone,
  toneUploadError,
  permission,
  isTesting,
  onQuickCreate,
  onEditUpcoming,
  onUpdateSetting,
  onPreviewTone,
  onUploadToneFile,
  onDeleteCustomTone,
  onRequestPermission,
  onRunTest,
}: UtilityPanelProps) {
  const quickActions: Array<{
    label: string;
    subtitle: string;
    icon: typeof Plus;
    category: TaskCategory;
    primary?: boolean;
  }> = [
    {
      label: 'Add Reminder',
      subtitle: 'Custom time & repeat schedule',
      icon: Plus,
      category: 'study',
      primary: true,
    },
    {
      label: 'Add Study Session',
      subtitle: 'Focused revision block',
      icon: BookOpen,
      category: 'study',
    },
    {
      label: 'Add Practice Battle',
      subtitle: 'Timed speed challenge',
      icon: Swords,
      category: 'practice_battle',
    },
    {
      label: 'Add Task',
      subtitle: 'Current affairs or formula drill',
      icon: CheckSquare,
      category: 'current_affairs',
    },
  ];

  return (
    <aside aria-label="Productivity utility panel" className="space-y-4">
      {/* Section A: Quick Actions */}
      <section className="rounded-2xl bg-[#FFFFFF] dark:bg-[#181822] p-4 shadow-[0_8px_24px_rgba(30,25,60,0.055)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.36)]">
        <div className="mb-3">
          <h3 className="text-[14px] font-semibold text-[#25233A] dark:text-[#F5F3FF]">
            Quick Actions
          </h3>
          <p className="text-[11px] text-[#77758A] dark:text-[#B0ADBF]">
            Create a structured reminder in seconds
          </p>
        </div>

        <div className="space-y-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                onClick={() => onQuickCreate(action.category)}
                className={`w-full flex items-center justify-between gap-2.5 p-2.5 rounded-xl text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7667C8]/40 ${
                  action.primary
                    ? 'bg-[#7667C8] dark:bg-[#8D7BE0] text-white shadow-[0_4px_14px_rgba(118,103,200,0.28)] hover:opacity-95'
                    : 'bg-[#F0EDF8] dark:bg-[#20202C] hover:bg-[#EAE6F5] dark:hover:bg-[#29283A] text-[#25233A] dark:text-[#F5F3FF]'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      action.primary
                        ? 'bg-white/18 text-white'
                        : 'bg-[#EAE5FA] dark:bg-[#302A48] text-[#7667C8] dark:text-[#8D7BE0]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12.5px] font-semibold truncate">
                      {action.label}
                    </span>
                    <span
                      className={`block text-[11px] truncate ${
                        action.primary
                          ? 'text-white/80'
                          : 'text-[#77758A] dark:text-[#B0ADBF]'
                      }`}
                    >
                      {action.subtitle}
                    </span>
                  </span>
                </span>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 ${
                    action.primary ? 'text-white/85' : 'text-[#A19EB1]'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* Section B: Next 3 Upcoming Reminders */}
      <section className="rounded-2xl bg-[#FFFFFF] dark:bg-[#181822] p-4 shadow-[0_2px_8px_rgba(30,25,60,0.035)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.28)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[14px] font-semibold text-[#25233A] dark:text-[#F5F3FF]">
            Up Next
          </h3>
          <span className="text-[11px] font-medium text-[#77758A] dark:text-[#B0ADBF]">
            Next {Math.min(3, upcomingItems.length)}
          </span>
        </div>

        {upcomingItems.length === 0 ? (
          <p className="text-[12px] text-[#77758A] dark:text-[#B0ADBF] py-2">
            No upcoming alerts queued.
          </p>
        ) : (
          <div className="space-y-2">
            {upcomingItems.slice(0, 3).map((item) => (
              <button
                key={`upnext-${item.id}`}
                type="button"
                onClick={() => !item.isStreak && onEditUpcoming(item)}
                className="w-full flex items-center justify-between gap-2.5 p-2.5 rounded-xl bg-[#F0EDF8]/80 dark:bg-[#20202C]/80 hover:bg-[#EAE6F5] dark:hover:bg-[#29283A] text-left transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-[#EAE5FA] dark:bg-[#302A48] text-[#7667C8] dark:text-[#8D7BE0] flex items-center justify-center shrink-0">
                    <CategoryIcon category={item.category} className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-[#25233A] dark:text-[#F5F3FF] truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[#77758A] dark:text-[#B0ADBF] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#7667C8] dark:text-[#8D7BE0]" />
                      <span>{item.formattedTime}</span>
                      <span>&middot; {item.dayLabel}</span>
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#7667C8] dark:text-[#8D7BE0] shrink-0">
                  {item.dayLabel}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Section C: Compact Notification & Sound Settings */}
      <div id="sound-settings">
        <NotificationSoundSettings
          settings={settings}
          customTone={customTone}
          previewingTone={previewingTone}
          isUploadingTone={isUploadingTone}
          toneUploadError={toneUploadError}
          permission={permission}
          isTesting={isTesting}
          onUpdateSetting={onUpdateSetting}
          onPreviewTone={onPreviewTone}
          onUploadFile={(e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (file) void onUploadToneFile(file);
          }}
          onDeleteCustomTone={onDeleteCustomTone}
          onRequestPermission={onRequestPermission}
          onRunTest={onRunTest}
        />
      </div>
    </aside>
  );
}
