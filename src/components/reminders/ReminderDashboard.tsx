'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  Check,
  Plus,
  Volume2,
  Loader2,
} from 'lucide-react';
import {
  DEFAULT_REMINDER_SETTINGS,
  type CustomTaskReminder,
  type ReminderSettings,
  type ReminderTone,
} from '@/types/reminders';
import {
  addCustomTask,
  deleteCustomTask,
  doesTaskOccurOnDate,
  formatTimeDisplay,
  getNotificationPermission,
  getReminderSettings,
  getUpcomingScheduleItems,
  requestNotificationPermission,
  saveReminderSettings,
  testNotificationAndAlarm,
  toLocalDateKey,
  toggleTaskCompletion,
  updateCustomTask,
  type UpcomingScheduleItem,
} from '@/lib/notifications/reminder-service';
import {
  deleteStoredCustomAudioTone,
  getStoredCustomAudioTone,
  saveCustomAudioTone,
  type CustomToneRecord,
} from '@/lib/notifications/custom-audio';
import { playReminderSound, stopReminderSound } from '@/lib/notifications/audio';
import { useAuth } from '@/components/providers/AuthProvider';
import * as localDB from '@/lib/store/local-db';
import { appUsageTracker } from '@/lib/usage/tracker';
import { getLocalAchievementSnapshot } from '@/lib/achievements/client';

import { ReminderSidebar, type ReminderFocusView } from './ReminderSidebar';
import { ReminderTopbar } from './ReminderTopbar';
import { SummaryStatistics } from './SummaryStatistics';
import {
  TodaySchedule,
  type ScheduleDisplayItem,
  type WeekDateChip,
} from './TodaySchedule';
import { UpcomingTasks } from './UpcomingTasks';
import { UtilityPanel } from './UtilityPanel';
import { ReminderModal, type ModalTarget } from './ReminderModal';

interface ReminderDashboardProps {
  embedded?: boolean;
  className?: string;
}

function getCountdownLabel(
  timeHHMM: string,
  currentMinutes: number,
  isViewingToday: boolean
): string | undefined {
  if (!isViewingToday) return undefined;
  const [hStr, mStr] = timeHHMM.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return undefined;
  const targetMins = h * 60 + m;
  const diff = targetMins - currentMinutes;
  if (diff < 0) return 'Passed';
  if (diff <= 1) return 'Due now';
  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;
  return hrs === 0 ? `in ${mins}m` : `in ${hrs}h ${mins}m`;
}

export function ReminderDashboard({
  embedded = false,
  className = '',
}: ReminderDashboardProps) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_REMINDER_SETTINGS);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [customTone, setCustomTone] = useState<CustomToneRecord | null>(null);
  const [previewingTone, setPreviewingTone] = useState<ReminderTone | null>(null);
  const [isUploadingTone, setIsUploadingTone] = useState(false);
  const [toneUploadError, setToneUploadError] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real study productivity metrics
  const [activeStreakDays, setActiveStreakDays] = useState(0);
  const [todayStudyMinutes, setTodayStudyMinutes] = useState(0);

  // Navigation & filter state
  const [activeView, setActiveView] = useState<ReminderFocusView>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [nowClock, setNowClock] = useState<Date>(() => new Date());

  // Unified modal state
  const [modalTarget, setModalTarget] = useState<ModalTarget | null>(null);

  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 2600);
  }, []);

  // Load persisted reminder settings, custom audio, and live study metrics asynchronously
  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      await Promise.resolve();
      if (cancelled) return;

      const currentSettings = getReminderSettings();
      setSettings(currentSettings);
      setPermission(getNotificationPermission());

      try {
        const storedTone = await getStoredCustomAudioTone();
        if (!cancelled) setCustomTone(storedTone);
      } catch {
        // IndexedDB unavailable; ignore cleanly
      }

      // Compute real study minutes & streak from local IndexedDB + appUsageTracker
      try {
        appUsageTracker.init();
        const todayKey = toLocalDateKey(new Date());
        const buckets = appUsageTracker.getAllStoredBuckets?.() ?? {};
        const usageTodaySec = buckets[todayKey]?.totalActiveSeconds ?? 0;

        const answers = await localDB.getAllAnswers();
        let answersTodaySec = 0;
        for (const a of answers) {
          const stamp = a.last_saved_at || a.started_at;
          if (stamp && toLocalDateKey(new Date(stamp)) === todayKey) {
            answersTodaySec += a.time_spent_seconds || 0;
          }
        }
        const mins = Math.round(Math.max(usageTodaySec, answersTodaySec) / 60);
        if (!cancelled) setTodayStudyMinutes(mins);

        if (user?.id) {
          const snap = await getLocalAchievementSnapshot(user.id);
          if (!cancelled) {
            setActiveStreakDays(snap.streak?.current_streak ?? 0);
          }
        } else {
          // Compute local streak approximation from unique active answer dates if logged out
          const dates = new Set(
            answers
              .map((a) => a.last_saved_at || a.started_at)
              .filter(Boolean)
              .map((d) => toLocalDateKey(new Date(d!)))
          );
          if (!cancelled) setActiveStreakDays(dates.has(todayKey) ? 1 : dates.size > 0 ? 1 : 0);
        }
      } catch {
        // Metrics remain cleanly at 0
      }
    };

    void loadAll();

    // Update live clock once per minute
    const clockInterval = setInterval(() => {
      setNowClock(new Date());
    }, 30000);

    return () => {
      cancelled = true;
      clearInterval(clockInterval);
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      stopReminderSound();
    };
  }, [user?.id]);

  const persistSettings = useCallback(
    async (next: ReminderSettings, label = 'Preferences saved') => {
      setSettings(next);
      await saveReminderSettings(next, user?.id);
      showToast(label);
    },
    [showToast, user?.id]
  );

  const handleUpdateSetting = useCallback(
    <K extends keyof ReminderSettings>(key: K, value: ReminderSettings[K]) => {
      const next = { ...settings, [key]: value };
      void persistSettings(next);
    },
    [persistSettings, settings]
  );

  // Audio preview toggle
  const handlePreviewTone = useCallback(
    (tone: ReminderTone, customAudioData?: string) => {
      if (previewingTone === tone) {
        stopReminderSound();
        setPreviewingTone(null);
        if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
        return;
      }

      stopReminderSound();
      setPreviewingTone(tone);
      const dataUrl =
        tone === 'custom' ? customAudioData || customTone?.dataUrl : undefined;
      playReminderSound(tone, dataUrl);

      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
      previewTimerRef.current = setTimeout(() => {
        setPreviewingTone(null);
      }, 4500);
    },
    [customTone?.dataUrl, previewingTone]
  );

  const handleUploadToneFile = useCallback(
    async (file: File): Promise<CustomToneRecord | null> => {
      setToneUploadError(null);
      setIsUploadingTone(true);
      try {
        const record = await saveCustomAudioTone(file);
        setCustomTone(record);
        const next: ReminderSettings = {
          ...settings,
          soundEnabled: true,
          reminderTone: 'custom',
        };
        await persistSettings(next, `Custom sound "${record.name}" active`);
        return record;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Unable to save this audio file.';
        setToneUploadError(msg);
        return null;
      } finally {
        setIsUploadingTone(false);
      }
    },
    [persistSettings, settings]
  );

  const handleDeleteCustomTone = useCallback(async () => {
    stopReminderSound();
    setPreviewingTone(null);
    await deleteStoredCustomAudioTone();
    setCustomTone(null);
    if (settings.reminderTone === 'custom') {
      const next: ReminderSettings = { ...settings, reminderTone: 'chime' };
      await persistSettings(next, 'Switched back to Zen Chime');
    } else {
      showToast('Custom ringtone removed');
    }
  }, [persistSettings, settings, showToast]);

  const handleRequestPermission = useCallback(async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === 'granted') {
      showToast('Browser notifications enabled');
    } else if (result === 'denied') {
      showToast('Notifications blocked in browser settings');
    }
  }, [showToast]);

  const handleRunTest = useCallback(async () => {
    setIsTesting(true);
    try {
      const res = await testNotificationAndAlarm(settings);
      setPermission(res.permission);
      if (res.notificationSent) {
        showToast('Test alarm and notification delivered');
      } else if (res.soundPlayed) {
        showToast('Test chime played');
      } else {
        showToast('Test completed');
      }
    } finally {
      setIsTesting(false);
    }
  }, [settings, showToast]);

  // Modal Save Handlers
  const handleSaveTask = useCallback(
    async (
      payload: Omit<CustomTaskReminder, 'id'>,
      editingTaskId?: string
    ) => {
      if (editingTaskId) {
        const updated = await updateCustomTask(editingTaskId, payload, user?.id);
        setSettings(updated);
        showToast('Reminder updated');
      } else {
        const updated = await addCustomTask(payload, user?.id);
        setSettings(updated);
        showToast('Reminder added');
      }
      setModalTarget(null);
    },
    [showToast, user?.id]
  );

  const handleSaveBattle = useCallback(
    async (updates: Partial<ReminderSettings>) => {
      const next = { ...settings, ...updates };
      await persistSettings(next, 'Daily Battle schedule updated');
      setModalTarget(null);
    },
    [persistSettings, settings]
  );

  // Date Calculations
  const todayKey = useMemo(() => toLocalDateKey(nowClock), [nowClock]);
  const selectedDateKey = useMemo(() => toLocalDateKey(selectedDate), [selectedDate]);
  const isViewingToday = selectedDateKey === todayKey;

  const weekDays: WeekDateChip[] = useMemo(() => {
    const base = new Date(nowClock);
    base.setHours(12, 0, 0, 0);
    // Start week 3 days before today + 7-day shift per weekOffset
    const center = new Date(base);
    center.setDate(base.getDate() + weekOffset * 7);

    const chips: WeekDateChip[] = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(center);
      d.setDate(center.getDate() + i);
      const dKey = toLocalDateKey(d);
      const dayOfWeek = d.getDay();

      const hasBattle = settings.enabled && settings.days.includes(dayOfWeek);
      const hasCustom = (settings.customTasks || []).some(
        (t) => t.enabled && doesTaskOccurOnDate(t, d)
      );
      const hasStreak = settings.enabled && settings.streakProtection;

      chips.push({
        date: d,
        dateKey: dKey,
        dayShort: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        isToday: dKey === todayKey,
        hasActivity: hasBattle || hasCustom || hasStreak,
      });
    }
    return chips;
  }, [nowClock, settings, todayKey, weekOffset]);

  const handleSelectDate = useCallback((d: Date) => {
    setSelectedDate(d);
  }, []);

  const handleShiftWeek = useCallback(
    (delta: number) => {
      const nextOffset = weekOffset + delta;
      setWeekOffset(nextOffset);
      const shifted = new Date(selectedDate);
      shifted.setDate(selectedDate.getDate() + delta * 7);
      setSelectedDate(shifted);
    },
    [selectedDate, weekOffset]
  );

  const handleJumpToday = useCallback(() => {
    setWeekOffset(0);
    setSelectedDate(new Date());
    setActiveView('today');
  }, []);

  // Build selected day's schedule items
  const currentMinutes = nowClock.getHours() * 60 + nowClock.getMinutes();
  const currentTimeHHMM = `${String(nowClock.getHours()).padStart(2, '0')}:${String(
    nowClock.getMinutes()
  ).padStart(2, '0')}`;
  const currentTimeFormatted = useMemo(
    () => formatTimeDisplay(currentTimeHHMM),
    [currentTimeHHMM]
  );

  const rawDayItems: ScheduleDisplayItem[] = useMemo(() => {
    const dayOfWeek = selectedDate.getDay();
    const list: ScheduleDisplayItem[] = [];

    // 1. Primary Daily Battle Reminder
    if (settings.days.includes(dayOfWeek)) {
      list.push({
        id: 'primary-battle',
        kind: 'battle',
        title: 'Daily Study Battle',
        description: 'Timed practice battle session to build speed & accuracy.',
        category: 'practice_battle',
        timeHHMM: settings.studyTime,
        formattedTime: formatTimeDisplay(settings.studyTime),
        countdown: settings.enabled
          ? getCountdownLabel(settings.studyTime, currentMinutes, isViewingToday)
          : 'Paused',
        enabled: settings.enabled,
        completed: false,
        canComplete: false,
        canDelete: false,
      });
    }

    // 2. Custom Task Reminders matching selectedDate
    (settings.customTasks || []).forEach((task) => {
      if (!doesTaskOccurOnDate(task, selectedDate)) return;
      const isCompletedOnSelected = task.completedDate === selectedDateKey;
      list.push({
        id: task.id,
        kind: 'custom',
        title: task.title,
        description: task.notes,
        category: task.category,
        timeHHMM: task.time,
        formattedTime: formatTimeDisplay(task.time),
        countdown: task.enabled
          ? isCompletedOnSelected
            ? 'Completed'
            : getCountdownLabel(task.time, currentMinutes, isViewingToday)
          : 'Paused',
        enabled: task.enabled,
        completed: isCompletedOnSelected,
        canComplete: true,
        canDelete: true,
      });
    });

    // 3. Streak Protection Shield (10:00 PM)
    list.push({
      id: 'streak-shield',
      kind: 'streak',
      title: 'Streak Protection Shield',
      description: 'Alert 2h before midnight to safeguard your study streak.',
      category: 'streak',
      timeHHMM: '22:00',
      formattedTime: '10:00 PM',
      countdown:
        settings.enabled && settings.streakProtection
          ? getCountdownLabel('22:00', currentMinutes, isViewingToday)
          : 'Paused',
      enabled: settings.enabled && settings.streakProtection,
      completed: false,
      canComplete: false,
      canDelete: false,
    });

    list.sort((a, b) => a.timeHHMM.localeCompare(b.timeHHMM));
    return list;
  }, [currentMinutes, isViewingToday, selectedDate, selectedDateKey, settings]);

  // Apply Search Query + View Filter cleanly
  const filteredDayItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return rawDayItems.filter((item) => {
      if (activeView === 'completed' && !item.completed) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        (item.description?.toLowerCase().includes(q) ?? false) ||
        item.formattedTime.toLowerCase().includes(q)
      );
    });
  }, [activeView, rawDayItems, searchQuery]);

  // Upcoming Items across next 7 days
  const upcomingItems: UpcomingScheduleItem[] = useMemo(() => {
    const raw = getUpcomingScheduleItems(settings, 8);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return raw;
    return raw.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.formattedTime.toLowerCase().includes(q) ||
        i.dayLabel.toLowerCase().includes(q)
    );
  }, [searchQuery, settings]);

  // Summary metrics (real values!)
  const todayStats = useMemo(() => {
    const dayOfWeek = nowClock.getDay();
    let count = 0;
    let completed = 0;

    if (settings.enabled && settings.days.includes(dayOfWeek)) count++;
    if (settings.enabled && settings.streakProtection) count++;

    (settings.customTasks || []).forEach((t) => {
      if (doesTaskOccurOnDate(t, nowClock)) {
        if (t.enabled) count++;
        if (t.completedDate === todayKey) completed++;
      }
    });

    return { count, completed };
  }, [nowClock, settings, todayKey]);

  const totalActiveCount = useMemo(() => {
    const enabledCustom = (settings.customTasks || []).filter((t) => t.enabled).length;
    return (
      enabledCustom +
      (settings.enabled ? 1 : 0) +
      (settings.enabled && settings.streakProtection ? 1 : 0)
    );
  }, [settings]);

  // Row Interactions
  const handleToggleRowEnabled = useCallback(
    async (item: ScheduleDisplayItem) => {
      if (item.kind === 'battle') {
        await persistSettings(
          { ...settings, enabled: !settings.enabled },
          settings.enabled ? 'Study Battle reminders paused' : 'Study Battle reminders active'
        );
      } else if (item.kind === 'streak') {
        const nextProtection = !settings.streakProtection;
        await persistSettings(
          {
            ...settings,
            enabled: nextProtection ? true : settings.enabled,
            streakProtection: nextProtection,
          },
          nextProtection ? 'Streak protection enabled' : 'Streak protection paused'
        );
      } else {
        const updated = await updateCustomTask(
          item.id,
          { enabled: !item.enabled },
          user?.id
        );
        setSettings(updated);
        showToast(item.enabled ? 'Reminder paused' : 'Reminder enabled');
      }
    },
    [persistSettings, settings, showToast, user?.id]
  );

  const handleToggleRowCompleted = useCallback(
    async (item: ScheduleDisplayItem) => {
      if (item.kind !== 'custom') return;
      const updated = await toggleTaskCompletion(item.id, selectedDateKey, user?.id);
      setSettings(updated);
      showToast(item.completed ? 'Marked pending' : 'Marked completed');
    },
    [selectedDateKey, showToast, user?.id]
  );

  const handleEditScheduleItem = useCallback(
    (item: ScheduleDisplayItem) => {
      if (item.kind === 'battle') {
        setModalTarget({ kind: 'edit-battle' });
        return;
      }
      if (item.kind === 'custom') {
        const task = (settings.customTasks || []).find((t) => t.id === item.id);
        if (task) setModalTarget({ kind: 'edit-task', task });
      }
    },
    [settings.customTasks]
  );

  const handleEditUpcomingItem = useCallback(
    (item: UpcomingScheduleItem) => {
      if (item.isPrimary) {
        setModalTarget({ kind: 'edit-battle' });
        return;
      }
      if (item.taskId) {
        const task = (settings.customTasks || []).find((t) => t.id === item.taskId);
        if (task) setModalTarget({ kind: 'edit-task', task });
      }
    },
    [settings.customTasks]
  );

  const handleDeleteScheduleItem = useCallback(
    async (item: ScheduleDisplayItem) => {
      if (item.kind !== 'custom') return;
      const updated = await deleteCustomTask(item.id, user?.id);
      setSettings(updated);
      showToast('Reminder removed');
    },
    [showToast, user?.id]
  );

  const handleJumpToSound = useCallback(() => {
    const el = document.getElementById('sound-settings');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleSelectView = useCallback(
    (view: ReminderFocusView) => {
      setActiveView(view);
      if (view === 'today') {
        setWeekOffset(0);
        setSelectedDate(new Date());
      } else if (view === 'upcoming') {
        const el = document.getElementById('upcoming-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    []
  );

  const firstUpcoming = upcomingItems[0];
  const nextUpcomingLabel = firstUpcoming
    ? `${firstUpcoming.formattedTime} · ${firstUpcoming.dayLabel}`
    : 'No upcoming alerts';

  const coreWorkspace = (
    <div className="space-y-5 min-w-0 flex-1">
      {!embedded && (
        <ReminderTopbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notificationsEnabled={settings.enabled}
          upcomingCount={upcomingItems.length}
          onToggleNotifications={() => handleUpdateSetting('enabled', !settings.enabled)}
          onJumpToSound={handleJumpToSound}
          userName={user?.user_metadata?.full_name || user?.email || undefined}
        />
      )}

      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-[24px] sm:text-[26px] font-semibold tracking-tight text-[#25233A] dark:text-[#F5F3FF]">
              Reminders &amp; Schedule
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#EAE5FA] dark:bg-[#302A48] text-[#7667C8] dark:text-[#8D7BE0] text-[11px] font-semibold uppercase tracking-wide">
              <Bell className="w-3 h-3" />
              {settings.enabled ? 'Active' : 'Paused'}
            </span>
          </div>
          <p className="text-[13.5px] text-[#77758A] dark:text-[#B0ADBF] mt-0.5">
            Daily study goals, timed battles &amp; streak protection
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Master Reminder Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={settings.enabled}
            onClick={() => handleUpdateSetting('enabled', !settings.enabled)}
            className="h-9 px-3 rounded-xl bg-[#FFFFFF] dark:bg-[#181822] shadow-[0_2px_8px_rgba(30,25,60,0.035)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.28)] inline-flex items-center gap-2 text-[12.5px] font-medium text-[#25233A] dark:text-[#F5F3FF]"
          >
            <span>All Alarms</span>
            <span
              className={`relative w-8 h-4.5 rounded-full transition-colors ${
                settings.enabled
                  ? 'bg-[#7667C8] dark:bg-[#8D7BE0]'
                  : 'bg-[#A19EB1]/45 dark:bg-[#858195]/40'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  settings.enabled ? 'translate-x-3.5' : 'translate-x-0'
                }`}
              />
            </span>
          </button>

          {/* Test Alarm Button */}
          <button
            type="button"
            onClick={handleRunTest}
            disabled={isTesting}
            className="h-9 px-3 rounded-xl bg-[#FFFFFF] dark:bg-[#181822] hover:bg-[#EAE6F5] dark:hover:bg-[#29283A] shadow-[0_2px_8px_rgba(30,25,60,0.035)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.28)] text-[12.5px] font-semibold text-[#25233A] dark:text-[#F5F3FF] inline-flex items-center gap-1.5 transition-colors disabled:opacity-60"
          >
            {isTesting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7667C8]" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#7667C8] dark:text-[#8D7BE0]" />
            )}
            <span>Test</span>
          </button>

          {/* Primary Add Reminder CTA */}
          <button
            type="button"
            onClick={() =>
              setModalTarget({ kind: 'create', defaultDate: selectedDateKey })
            }
            className="h-9 px-4 rounded-xl bg-[#7667C8] dark:bg-[#8D7BE0] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 shadow-[0_4px_14px_rgba(118,103,200,0.3)] hover:opacity-95 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reminder</span>
          </button>
        </div>
      </header>

      {/* Summary Statistics Cards */}
      <SummaryStatistics
        todayCount={todayStats.count}
        completedTodayCount={todayStats.completed}
        upcomingCount={upcomingItems.length}
        nextUpcomingLabel={nextUpcomingLabel}
        activeStreakDays={activeStreakDays}
        todayStudyMinutes={todayStudyMinutes}
      />

      {/* Two-Column Productivity Body (Schedule + Utility Panel) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-8 space-y-5 min-w-0">
          <TodaySchedule
            selectedDate={selectedDate}
            selectedDateKey={selectedDateKey}
            isViewingToday={isViewingToday}
            weekDays={weekDays}
            currentTimeHHMM={currentTimeHHMM}
            currentTimeFormatted={currentTimeFormatted}
            items={filteredDayItems}
            onSelectDate={handleSelectDate}
            onShiftWeek={handleShiftWeek}
            onJumpToday={handleJumpToday}
            onToggleEnabled={handleToggleRowEnabled}
            onToggleCompleted={handleToggleRowCompleted}
            onEditItem={handleEditScheduleItem}
            onDeleteItem={handleDeleteScheduleItem}
            onAddReminder={() =>
              setModalTarget({ kind: 'create', defaultDate: selectedDateKey })
            }
            searchActive={searchQuery.trim().length > 0 || activeView === 'completed'}
          />

          <div id="upcoming-section">
            <UpcomingTasks
              items={upcomingItems}
              onEditItem={handleEditUpcomingItem}
              onAddReminder={() =>
                setModalTarget({ kind: 'create', defaultDate: selectedDateKey })
              }
            />
          </div>
        </div>

        <div className="xl:col-span-4 min-w-0">
          <UtilityPanel
            settings={settings}
            upcomingItems={upcomingItems}
            customTone={customTone}
            previewingTone={previewingTone}
            isUploadingTone={isUploadingTone}
            toneUploadError={toneUploadError}
            permission={permission}
            isTesting={isTesting}
            onQuickCreate={(presetCategory) =>
              setModalTarget({
                kind: 'create',
                presetCategory,
                defaultDate: selectedDateKey,
              })
            }
            onEditUpcoming={handleEditUpcomingItem}
            onUpdateSetting={handleUpdateSetting}
            onPreviewTone={handlePreviewTone}
            onUploadToneFile={handleUploadToneFile}
            onDeleteCustomTone={() => void handleDeleteCustomTone()}
            onRequestPermission={() => void handleRequestPermission()}
            onRunTest={() => void handleRunTest()}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={
        embedded
          ? `w-full ${className}`
          : `min-h-[calc(100vh-4rem)] bg-[#F6F4FB] dark:bg-[#101018] text-[#25233A] dark:text-[#F5F3FF] transition-colors ${className}`
      }
    >
      <div
        className={
          embedded
            ? 'space-y-5'
            : 'max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 pb-24 md:pb-10'
        }
      >
        {embedded ? (
          coreWorkspace
        ) : (
          <div className="lg:flex lg:items-start lg:gap-6">
            <ReminderSidebar
              activeView={activeView}
              onSelectView={handleSelectView}
              totalActiveCount={totalActiveCount}
              completedTodayCount={todayStats.completed}
              upcomingCount={upcomingItems.length}
              notificationsActive={permission === 'granted' && settings.enabled}
              soundEnabled={settings.soundEnabled}
              onJumpToSound={handleJumpToSound}
            />
            {coreWorkspace}
          </div>
        )}
      </div>

      {/* Mobile Floating Action Button (hidden on md+ so desktop stays clean) */}
      <button
        type="button"
        onClick={() =>
          setModalTarget({ kind: 'create', defaultDate: selectedDateKey })
        }
        aria-label="Add reminder"
        className="md:hidden fixed bottom-22 right-5 z-40 w-13 h-13 rounded-2xl bg-[#7667C8] dark:bg-[#8D7BE0] text-white shadow-[0_10px_28px_rgba(118,103,200,0.42)] flex items-center justify-center active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Unified Add / Edit Reminder Modal */}
      <ReminderModal
        target={modalTarget}
        settings={settings}
        customTone={customTone}
        previewingTone={previewingTone}
        onClose={() => setModalTarget(null)}
        onSaveTask={handleSaveTask}
        onSaveBattle={handleSaveBattle}
        onPreviewTone={handlePreviewTone}
        onUploadToneFile={handleUploadToneFile}
      />

      {/* Subtle Floating Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[#25233A] dark:bg-[#F5F3FF] text-white dark:text-[#101018] text-[12.5px] font-medium shadow-[0_12px_32px_rgba(30,25,60,0.22)] inline-flex items-center gap-2"
        >
          <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
