'use client';

// ============================================================
// SamayYudh 2.0 — Reminder & Study Schedule Timeline UI
// Dual Theme (Light & Dark) with Custom Day-to-Day Student Task Alarms
// Zero Harsh Borders | Perfect Vertical Line & Node Alignment
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Clock, Volume2, Check, AlertCircle, Play,
  BookOpen, Flame, Swords, Plus, X, CheckCircle2,
  Trash2, ListTodo, Sparkles, Music, Upload, Square
} from 'lucide-react';
import Link from 'next/link';
import {
  ReminderSettings,
  ReminderTone,
  CustomTaskReminder,
  TaskCategory,
  CATEGORY_META,
  DEFAULT_REMINDER_SETTINGS,
  TIME_PRESETS,
} from '@/types/reminders';
import {
  getReminderSettings,
  saveReminderSettings,
  addCustomTask,
  updateCustomTask,
  deleteCustomTask,
  getNextUpcomingTask,
  getNotificationPermission,
  requestNotificationPermission,
  formatTimeDisplay,
  testNotificationAndAlarm,
  triggerStudyNotification,
} from '@/lib/notifications/reminder-service';
import { playReminderSound, stopReminderSound, triggerHapticVibration } from '@/lib/notifications/audio';
import {
  saveCustomAudioTone,
  getStoredCustomAudioTone,
  deleteStoredCustomAudioTone,
  formatAudioSize,
  CustomToneRecord,
} from '@/lib/notifications/custom-audio';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn } from '@/lib/utils';

interface ReminderSettingsPanelProps {
  className?: string;
}

const STUDENT_PRESET_TEMPLATES: {
  title: string;
  time: string;
  category: TaskCategory;
  notes: string;
}[] = [
  {
    title: 'Morning Quick Battle (10 Qs)',
    time: '07:30',
    category: 'quick_battle',
    notes: 'Warm up with 10 fast questions in Practice Mode.',
  },
  {
    title: 'Question Bank PYQ Drill',
    time: '11:30',
    category: 'questions',
    notes: 'Solve chapter-wise PYQs from Question Bank library.',
  },
  {
    title: 'Practice Battle (25 Qs)',
    time: '15:00',
    category: 'practice_battle',
    notes: 'Timed 25-question set to build speed and accuracy.',
  },
  {
    title: 'Full Exam Mock Simulation',
    time: '18:30',
    category: 'full_exam',
    notes: 'Full official timed paper in Exams section.',
  },
  {
    title: 'Mistake Review & History',
    time: '21:00',
    category: 'history',
    notes: 'Review incorrect answers in History section.',
  },
  {
    title: 'Daily Streak & Badges',
    time: '22:15',
    category: 'streak',
    notes: 'Protect daily streak and claim milestone badges.',
  },
];

export function ReminderSettingsPanel({ className }: ReminderSettingsPanelProps) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_REMINDER_SETTINGS);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isTesting, setIsTesting] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [previewingTone, setPreviewingTone] = useState<ReminderTone | null>(null);

  // Timeline UI state matching Momentum reference
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(3); // Default today (index 3)
  const [collapsedMorning, setCollapsedMorning] = useState<boolean>(true);
  const [collapsedNight, setCollapsedNight] = useState<boolean>(true);
  const [isTimePickerModalOpen, setIsTimePickerModalOpen] = useState<boolean>(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  // Form state for creating custom task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('08:00');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('quick_battle');
  const [newTaskDays, setNewTaskDays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [newTaskTone, setNewTaskTone] = useState<ReminderTone>('chime');
  const [newTaskNotes, setNewTaskNotes] = useState('');

  // Custom audio tone management
  const [customTone, setCustomTone] = useState<CustomToneRecord | null>(null);
  const [isUploadingTone, setIsUploadingTone] = useState(false);
  const [toneUploadError, setToneUploadError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const taskModalFileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const current = getReminderSettings();
    setSettings(current);
    setPermission(getNotificationPermission());

    // Load active custom tone from IndexedDB / LocalStorage
    getStoredCustomAudioTone().then((record) => {
      if (record) {
        setCustomTone(record);
      }
    });

    const updateCurrentTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTimeStr(formatTimeDisplay(`${hours}:${minutes}`));
    };
    updateCurrentTime();
    const timer = setInterval(updateCurrentTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // 7-day strip centered around today
  const dateStrip = useMemo(() => {
    const today = new Date();
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = -3; i <= 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push({
        dayName: dayNames[d.getDay()],
        dayNum: d.getDate(),
        fullDate: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        dayOfWeek: d.getDay(),
        isToday: i === 0,
      });
    }
    return days;
  }, []);

  const selectedDay = dateStrip[selectedDateIndex] || dateStrip[3];
  const todayDateStr = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  const updateSetting = async <K extends keyof ReminderSettings>(
    key: K,
    val: ReminderSettings[K]
  ) => {
    const updated = await saveReminderSettings({ [key]: val }, user?.id);
    setSettings(updated);

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === 'granted') {
      updateSetting('enabled', true);
    }
  };

  const toggleDayOfWeek = (dayIdx: number) => {
    let nextDays: number[];
    if (settings.days.includes(dayIdx)) {
      if (settings.days.length <= 1) return;
      nextDays = settings.days.filter((d) => d !== dayIdx);
    } else {
      nextDays = [...settings.days, dayIdx].sort();
    }
    updateSetting('days', nextDays);
  };

  const handlePreviewTone = (tone: ReminderTone, customAudioData?: string) => {
    if (previewingTone === tone) {
      stopReminderSound();
      setPreviewingTone(null);
      return;
    }
    stopReminderSound();
    setPreviewingTone(tone);
    playReminderSound(tone, customAudioData || customTone?.dataUrl).then(() => {
      setPreviewingTone(null);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingTone(true);
    setToneUploadError(null);
    try {
      const record = await saveCustomAudioTone(file);
      setCustomTone(record);
      await updateSetting('reminderTone', 'custom');
      await updateSetting('customToneName', record.name);
      await updateSetting('customToneSize', formatAudioSize(record.sizeBytes));

      // Play quick 2.5s preview of the uploaded tune
      handlePreviewTone('custom', record.dataUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to process audio file';
      setToneUploadError(message);
    } finally {
      setIsUploadingTone(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleDeleteCustomTone = async () => {
    stopReminderSound();
    await deleteStoredCustomAudioTone();
    setCustomTone(null);
    if (settings.reminderTone === 'custom') {
      await updateSetting('reminderTone', 'chime');
      await updateSetting('customToneName', undefined);
      await updateSetting('customToneSize', undefined);
    }
  };

  const handleTaskModalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const record = await saveCustomAudioTone(file);
      setCustomTone(record);
      setNewTaskTone('custom');
      handlePreviewTone('custom', record.dataUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload audio file';
      alert(message);
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    try {
      const res = await testNotificationAndAlarm(settings);
      setPermission(res.permission);
    } finally {
      setIsTesting(false);
    }
  };

  // Next Upcoming Task calculation
  const nextUpcoming = useMemo(() => {
    return getNextUpcomingTask(settings);
  }, [settings]);

  // Test Play Store Next Task notification
  const handleTestNextTaskNotification = async () => {
    setIsTesting(true);
    try {
      playReminderSound(settings.reminderTone);
      triggerHapticVibration([250, 100, 250]);

      let perm = getNotificationPermission();
      if (perm === 'default') {
        perm = await requestNotificationPermission();
        setPermission(perm);
      }

      if (perm === 'granted') {
        const titleText = nextUpcoming
          ? `⏰ Next Task: ${nextUpcoming.title}`
          : 'সময়যুদ্ধ 2.0 — Study Task Alert 🔔';
        const bodyText = nextUpcoming
          ? `Scheduled for ${nextUpcoming.formattedTime} (${nextUpcoming.countdown}). Take 10 minutes to stay ahead of the clock!`
          : 'Your next daily task notification is ready. Click to conquer questions!';

        await triggerStudyNotification(titleText, bodyText, {
          tag: 'next-task-alert',
          url: '/practice',
        });
      }
    } finally {
      setIsTesting(false);
    }
  };

  // Handle adding custom task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const updated = await addCustomTask(
      {
        title: newTaskTitle.trim(),
        time: newTaskTime,
        category: newTaskCategory,
        days: newTaskDays,
        tone: newTaskTone,
        customToneName: newTaskTone === 'custom' ? (customTone?.name || 'Custom Tune') : undefined,
        notes: newTaskNotes.trim() || undefined,
        enabled: true,
      },
      user?.id
    );

    setSettings(updated);
    setIsAddTaskModalOpen(false);
    setNewTaskTitle('');
    setNewTaskNotes('');
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleToggleTask = async (id: string, currentEnabled: boolean) => {
    const updated = await updateCustomTask(id, { enabled: !currentEnabled }, user?.id);
    setSettings(updated);
  };

  const handleToggleTaskCompleted = async (task: CustomTaskReminder) => {
    const isCompleted = task.completedDate === todayDateStr;
    const updated = await updateCustomTask(
      task.id,
      { completedDate: isCompleted ? null : todayDateStr },
      user?.id
    );
    setSettings(updated);
  };

  const handleDeleteTask = async (id: string) => {
    const updated = await deleteCustomTask(id, user?.id);
    setSettings(updated);
  };

  const applyTemplate = (tpl: typeof STUDENT_PRESET_TEMPLATES[0]) => {
    setNewTaskTitle(tpl.title);
    setNewTaskTime(tpl.time);
    setNewTaskCategory(tpl.category);
    setNewTaskNotes(tpl.notes);
  };

  // Tone options
  const toneOptions: { id: ReminderTone; name: string; desc: string }[] = [
    { id: 'chime', name: 'Zen Chime', desc: '528Hz Solfeggio clarity' },
    { id: 'gong', name: 'Tibetan Gong', desc: 'Deep meditation bowl' },
    { id: 'bell', name: 'Temple Bell', desc: 'Crystal triple sparkle' },
    { id: 'marimba', name: 'Marimba', desc: 'Upbeat acoustic melody' },
  ];

  // Helper to parse "HH:mm" to minutes of day
  const toMinutes = (timeStr: string) => {
    if (!timeStr || !timeStr.includes(':')) return 0;
    const [h, m] = timeStr.split(':').map((v) => parseInt(v, 10));
    return (h || 0) * 60 + (m || 0);
  };

  // Calculate current minutes of day
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Assemble chronological events for the selected day
  const timelineEvents = useMemo(() => {
    interface TimelineItem {
      id: string;
      type: 'battle' | 'custom_task';
      time: string;
      minutes: number;
      task?: CustomTaskReminder;
    }

    const items: TimelineItem[] = [];

    // 1. Primary Study Battle (if enabled for this day)
    if (settings.days.includes(selectedDay.dayOfWeek)) {
      items.push({
        id: 'primary-battle',
        type: 'battle',
        time: settings.studyTime,
        minutes: toMinutes(settings.studyTime),
      });
    }

    // 2. Custom tasks scheduled for this day
    (settings.customTasks || []).forEach((t) => {
      if (t.days.includes(selectedDay.dayOfWeek)) {
        items.push({
          id: t.id,
          type: 'custom_task',
          time: t.time,
          minutes: toMinutes(t.time),
          task: t,
        });
      }
    });

    // Sort items chronologically
    items.sort((a, b) => a.minutes - b.minutes);
    return items;
  }, [settings.days, settings.studyTime, settings.customTasks, selectedDay.dayOfWeek]);

  // Compute countdown for any time string
  const getCountdown = (timeStr: string) => {
    if (!timeStr || !timeStr.includes(':')) return '';
    const targetMin = toMinutes(timeStr);
    let diff = targetMin - currentMinutes;
    if (diff < 0) diff += 24 * 60;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    if (h === 0 && m <= 1) return 'Due now';
    if (h === 0) return `in ${m}m`;
    return `in ${h}h ${m}m`;
  };

  return (
    <div className={cn('space-y-6 select-none', className)}>
      {/* ── Main Momentum-Style Container (Light & Dark, No Harsh Borders) ── */}
      <div className="rounded-[2.5rem] bg-white dark:bg-[#15102A] p-6 sm:p-8 shadow-[0_10px_40px_rgba(124,113,178,0.08)] dark:shadow-[0_12px_45px_rgba(0,0,0,0.45)] text-[#2A2244] dark:text-white relative overflow-hidden transition-colors duration-200">
        {/* Soft Ambient Radial Violet Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-[#E1D8EB]/40 dark:from-[#261E48]/50 dark:via-[#1C1636]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* ── Header: Title & Subtitle matching Momentum ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2A2244] dark:text-white flex items-center gap-2">
                <span>Reminders & Tasks</span>
                <span className="text-2xl">⏰</span>
              </h2>
              {savedToast && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7C71B2] dark:text-white bg-[#E1D8EB] dark:bg-[#261E48] px-2.5 py-0.5 rounded-full animate-fade-in">
                  <Check className="w-3 h-3 text-[#7C71B2] dark:text-[#A59AC0]" /> Saved
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#5A4E7A] dark:text-[#A59AC0] font-medium">
              Daily study battles, custom task alarms & Play Store notifications
            </p>
          </div>

          {/* Master Enable & Test Controls */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              disabled={isTesting}
              onClick={handleRunTest}
              className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#7C71B2] hover:bg-[#685EA1] active:scale-95 transition-all shadow-md shadow-[#7C71B2]/30 cursor-pointer flex items-center gap-1.5"
              title="Test alarm sound & push notification"
            >
              <Bell className={cn('w-3.5 h-3.5', isTesting && 'animate-spin')} />
              <span>{isTesting ? 'Testing...' : 'Test Alarm'}</span>
            </button>

            {/* Master Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={settings.enabled}
              onClick={() => {
                const nextVal = !settings.enabled;
                updateSetting('enabled', nextVal);
                if (nextVal && permission === 'default') {
                  handleRequestPermission();
                }
              }}
              className={cn(
                'relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out',
                settings.enabled ? 'bg-[#7C71B2]' : 'bg-[#E1D8EB] dark:bg-[#1C1636]'
              )}
              title={settings.enabled ? 'Alarms are Active' : 'Alarms are Paused'}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 m-1 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out',
                  settings.enabled ? 'translate-x-6' : 'translate-x-0'
                )}
              />
            </button>
          </div>
        </div>

        {/* ── Play Store Next Task Banner ── */}
        {nextUpcoming && (
          <div className="rounded-2xl p-4 bg-gradient-to-r from-[#E1D8EB]/50 via-white to-transparent dark:from-[#261E48]/70 dark:via-[#1C1636]/60 dark:to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 shadow-xs relative z-10 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#7C71B2] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#7C71B2]/30">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C71B2] dark:text-[#C4B7DE]">
                    Next Task Alert
                  </span>
                  <span className="text-[10px] font-bold bg-[#E1D8EB] dark:bg-[#15102A] text-[#7C71B2] dark:text-[#D8CEEB] px-2 py-0.5 rounded-full">
                    ⏳ {nextUpcoming.countdown}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-[#2A2244] dark:text-white">
                  {nextUpcoming.title} • {nextUpcoming.formattedTime}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleTestNextTaskNotification}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#261E48] hover:bg-[#E1D8EB] dark:hover:bg-[#34295F] text-[#7C71B2] dark:text-[#D8CEEB] transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                title="Send Play Store notification alert test for this task"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Next Alert</span>
              </button>
              <Link
                href="/practice"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#7C71B2] hover:bg-[#685EA1] transition-all shadow-sm shadow-[#7C71B2]/30 flex items-center gap-1.5"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Start Now</span>
              </Link>
            </div>
          </div>
        )}

        {/* ── 7-Day Calendar Strip matching Momentum ── */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-6 relative z-10">
          {dateStrip.map((item, idx) => {
            const isSelected = idx === selectedDateIndex;
            const isDayConfigured =
              settings.days.includes(item.dayOfWeek) ||
              (settings.customTasks || []).some((t) => t.enabled && t.days.includes(item.dayOfWeek));

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDateIndex(idx)}
                className={cn(
                  'flex flex-col items-center justify-center py-3.5 sm:py-4 px-1 rounded-2xl sm:rounded-3xl transition-all cursor-pointer select-none text-center relative',
                  isSelected
                    ? 'bg-gradient-to-b from-[#7C71B2] to-[#685EA1] text-white font-extrabold shadow-lg shadow-[#7C71B2]/35 scale-105'
                    : 'bg-[#F0EEF7] dark:bg-[#1C1636] hover:bg-[#E1D8EB] dark:hover:bg-[#261E48] text-[#2A2244] dark:text-[#C4B7DE] font-semibold'
                )}
              >
                <span
                  className={cn(
                    'text-[11px] sm:text-xs mb-1 font-medium',
                    isSelected ? 'text-white/80' : 'text-[#8D7EA8] dark:text-[#8E82A8]'
                  )}
                >
                  {item.dayName}
                </span>
                <span className="text-base sm:text-lg font-extrabold">{item.dayNum}</span>

                {/* Day configured dot indicator */}
                {isDayConfigured && (
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full mt-1.5',
                      isSelected ? 'bg-white' : 'bg-[#7C71B2]'
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Selected Day Heading & Add Task Action ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-2 relative z-10">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-[#2A2244] dark:text-white">
              {selectedDay.fullDate}
            </h3>
            {selectedDay.isToday && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E1D8EB] dark:bg-[#261E48] text-[#7C71B2] dark:text-[#D8CEEB]">
                Today
              </span>
            )}
            <span className="text-xs text-[#8D7EA8] dark:text-[#8E82A8] font-medium ml-1">
              • {timelineEvents.length} items
            </span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Quick Day Toggle Button */}
            <button
              type="button"
              onClick={() => toggleDayOfWeek(selectedDay.dayOfWeek)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer',
                settings.days.includes(selectedDay.dayOfWeek)
                  ? 'bg-[#E1D8EB] dark:bg-[#261E48] text-[#7C71B2] dark:text-white hover:bg-[#D5C9E3] dark:hover:bg-[#34295F]'
                  : 'bg-[#F0EEF7] dark:bg-[#1C1636] text-[#8D7EA8] dark:text-[#8E82A8] hover:text-[#2A2244] dark:hover:text-white'
              )}
            >
              {settings.days.includes(selectedDay.dayOfWeek)
                ? '✓ Battle Active'
                : '+ Enable Battle'}
            </button>

            {/* Add Task Button */}
            <button
              type="button"
              onClick={() => setIsAddTaskModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-[#7C71B2] hover:bg-[#685EA1] transition-all shadow-sm shadow-[#7C71B2]/30 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* ── Vertical Timeline View (Fixed Alignment — ZERO OVERLAP) ── */}
        {/*
            Grid Math:
            Column 1 (Time): w-14 sm:w-16 (56px mobile, 64px sm) with pr-1.
            Gap: gap-2.5 sm:gap-3.5 (10px mobile, 14px sm).
            Column 2 (Node): w-6 (24px, center at 12px).
            Center of node mobile = 56 + 10 + 12 = 78px (left-[78px]).
            Center of node sm = 64 + 14 + 12 = 90px (sm:left-[90px]).
            Text ends at ~48px, line is at 78px. Distance = 30px clear air!
        */}
        <div className="relative space-y-5 relative z-10">
          {/* Continuous Vertical Guide Line through node centers */}
          <div className="absolute top-4 bottom-4 left-[78px] sm:left-[90px] -translate-x-1/2 w-0.5 bg-[#E1D8EB] dark:bg-[#261E48]" />

          {/* 1. Morning Empty Hours Block (Collapsible) */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 relative">
            <div className="w-14 sm:w-16 shrink-0 text-right pr-1 text-[11px] sm:text-xs text-[#8D7EA8] dark:text-[#8E82A8] font-mono select-none">
              00:00<br />
              <span className="text-[10px] opacity-70">to 06:00</span>
            </div>

            {/* Timeline node */}
            <div className="w-6 shrink-0 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-[#F0EEF7] dark:bg-[#1C1636] shadow-xs flex items-center justify-center text-[#7C71B2] z-10">
                <span className="text-[10px] font-bold">z</span>
              </div>
            </div>

            {/* Collapsed Pill */}
            <div className="flex-1 min-w-0">
              <button
                type="button"
                onClick={() => setCollapsedMorning(!collapsedMorning)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#F0EEF7] dark:bg-[#1C1636] hover:bg-[#E1D8EB] dark:hover:bg-[#261E48] text-xs transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 text-[#5A4E7A] dark:text-[#C4B7DE]">
                  <span>💤</span>
                  <span className="font-semibold">Quiet morning hours</span>
                </div>
                <span className="text-[11px] font-bold text-[#7C71B2] dark:text-[#A59AC0] hover:text-[#2A2244] dark:hover:text-white">
                  {collapsedMorning ? 'Expand' : 'Collapse'}
                </span>
              </button>

              {!collapsedMorning && (
                <div className="mt-2 p-3.5 rounded-2xl bg-[#F0EEF7] dark:bg-[#1C1636] text-xs text-[#2A2244] dark:text-[#C4B7DE] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Morning Focus Preset</span>
                    <button
                      type="button"
                      onClick={() => updateSetting('studyTime', '07:00')}
                      className="px-3 py-1 rounded-full bg-[#7C71B2] text-white font-bold text-[11px] hover:bg-[#685EA1] transition-colors"
                    >
                      Set 07:00 AM
                    </button>
                  </div>
                  <p className="text-[11px] text-[#8D7EA8] dark:text-[#8E82A8]">
                    Practice fresh in the morning before distractions start.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 2. Chronological Items on Timeline */}
          {timelineEvents.map((event, idx) => {
            const isCompleted =
              event.type === 'custom_task' &&
              event.task?.completedDate === todayDateStr;

            return (
              <React.Fragment key={event.id}>
                {/* Dynamically render Live NOW bar if current time lands before this event */}
                {selectedDay.isToday &&
                  idx > 0 &&
                  timelineEvents[idx - 1].minutes <= currentMinutes &&
                  event.minutes > currentMinutes && (
                    <div className="flex items-center gap-2.5 sm:gap-3.5 relative my-2">
                      <div className="w-14 sm:w-16 shrink-0 text-right pr-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7C71B2] select-none">
                        NOW
                      </div>
                      <div className="w-6 shrink-0 flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7C71B2] animate-ping" />
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 border-t-2 border-dotted border-[#C8BBDC] dark:border-[#382C66]" />
                        <span className="text-[11px] font-mono font-bold text-[#7C71B2] dark:text-[#D8CEEB] bg-[#E1D8EB] dark:bg-[#261E48] px-3 py-0.5 rounded-full shrink-0">
                          {currentTimeStr || 'Current Time'}
                        </span>
                      </div>
                    </div>
                  )}

                {/* Event Card */}
                {event.type === 'battle' ? (
                  /* Primary Daily Study Battle Card */
                  <div className="flex items-start gap-2.5 sm:gap-3.5 relative group">
                    <div className="w-14 sm:w-16 shrink-0 text-right pr-1 pt-3 select-none">
                      <span className="text-xs sm:text-sm font-bold font-mono text-[#2A2244] dark:text-white block leading-tight">
                        {formatTimeDisplay(settings.studyTime).split(' ')[0]}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#7C71B2] dark:text-[#A59AC0] block">
                        {formatTimeDisplay(settings.studyTime).split(' ')[1]}
                      </span>
                    </div>

                    <div className="w-6 shrink-0 flex items-center justify-center pt-3">
                      <div className="w-5 h-5 rounded-full bg-[#7C71B2] shadow-[0_0_12px_rgba(124,113,178,0.5)] z-10 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 rounded-3xl bg-[#F0EEF7] dark:bg-gradient-to-r dark:from-[#1C1636] dark:to-[#221B42] p-4 sm:p-5 shadow-[0_4px_20px_rgba(124,113,178,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] relative transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#261E48] text-[#7C71B2] dark:text-[#C4B7DE] flex items-center justify-center shrink-0 shadow-xs">
                            <BookOpen className="w-5 h-5 text-[#7C71B2] dark:text-[#C4B7DE]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm sm:text-base font-extrabold text-[#2A2244] dark:text-white tracking-tight">
                                Daily Study Battle
                              </h4>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E1D8EB] dark:bg-[#261E48] text-[#7C71B2] dark:text-[#D8CEEB]">
                                Core Alarm
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#5A4E7A] dark:text-[#C4B7DE]">
                              <span className="flex items-center gap-1 font-mono font-bold text-[#2A2244] dark:text-white">
                                <Clock className="w-3.5 h-3.5 text-[#7C71B2] dark:text-[#A59AC0]" />
                                {formatTimeDisplay(settings.studyTime)}
                              </span>
                              <span>•</span>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E1D8EB] dark:bg-[#130E26] text-[#7C71B2] dark:text-[#D8CEEB]">
                                ⏳ {getCountdown(settings.studyTime)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => setIsTimePickerModalOpen(true)}
                          className="p-2 rounded-2xl bg-white dark:bg-[#261E48] hover:bg-[#E1D8EB] dark:hover:bg-[#34295F] text-[#7C71B2] dark:text-[#D8CEEB] transition-colors cursor-pointer shrink-0 shadow-xs"
                          title="Change Study Hour"
                          aria-label="Change study time"
                        >
                          <Clock className="w-4 h-4 text-[#7C71B2] dark:text-white" />
                        </button>
                      </div>

                      {/* Quick Tone & Action line */}
                      <div className="mt-4 pt-3 border-t border-[#C8BBDC]/40 dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A4E7A] dark:text-[#C4B7DE]">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#7C71B2] dark:text-[#A59AC0]">
                            <Volume2 className="w-3.5 h-3.5 text-[#7C71B2] dark:text-[#C4B7DE]" />
                            <span>Tone: {toneOptions.find((t) => t.id === settings.reminderTone)?.name || 'Zen Chime'}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handlePreviewTone(settings.reminderTone)}
                            className="p-1 rounded-lg bg-white dark:bg-[#261E48] hover:bg-[#E1D8EB] dark:hover:bg-[#34295F] text-[#7C71B2] dark:text-[#D8CEEB] transition-colors cursor-pointer shadow-xs"
                            title="Play Tone Preview"
                          >
                            <Play className={cn('w-3 h-3', previewingTone === settings.reminderTone && 'animate-spin')} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsTimePickerModalOpen(true)}
                          className="text-[11px] font-bold text-[#7C71B2] dark:text-[#A59AC0] hover:text-[#2A2244] dark:hover:text-white transition-colors cursor-pointer"
                        >
                          Edit Hour →
                        </button>
                      </div>
                    </div>
                  </div>
                ) : event.task ? (
                  /* Custom Student Task Reminder Card */
                  <div className="flex items-start gap-2.5 sm:gap-3.5 relative group">
                    <div className="w-14 sm:w-16 shrink-0 text-right pr-1 pt-3 select-none">
                      <span className="text-xs sm:text-sm font-bold font-mono text-[#2A2244] dark:text-white block leading-tight">
                        {formatTimeDisplay(event.task.time).split(' ')[0]}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#7C71B2] dark:text-[#A59AC0] block">
                        {formatTimeDisplay(event.task.time).split(' ')[1]}
                      </span>
                    </div>

                    <div className="w-6 shrink-0 flex items-center justify-center pt-3">
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full z-10 flex items-center justify-center transition-all',
                          isCompleted
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : event.task.enabled
                            ? 'bg-[#7C71B2] shadow-[0_0_10px_rgba(124,113,178,0.45)]'
                            : 'bg-[#C8BBDC] dark:bg-[#261E48]'
                        )}
                      >
                        {isCompleted ? (
                          <Check className="w-3 h-3 stroke-[3]" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>

                    <div
                      className={cn(
                        'flex-1 min-w-0 rounded-3xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(124,113,178,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] relative transition-all',
                        isCompleted
                          ? 'bg-[#EBF7EE] dark:bg-[#13221B] opacity-80'
                          : 'bg-[#F0EEF7] dark:bg-gradient-to-r dark:from-[#1C1636] dark:to-[#221B42]'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs text-lg',
                              CATEGORY_META[event.task.category]?.color || 'bg-white text-[#7C71B2]'
                            )}
                          >
                            <span>{CATEGORY_META[event.task.category]?.icon || '🎯'}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4
                                className={cn(
                                  'text-sm sm:text-base font-extrabold tracking-tight',
                                  isCompleted
                                    ? 'line-through text-[#5A4E7A] dark:text-[#A59AC0]'
                                    : 'text-[#2A2244] dark:text-white'
                                )}
                              >
                                {event.task.title}
                              </h4>
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded-full text-[10px] font-bold',
                                  CATEGORY_META[event.task.category]?.color || 'bg-[#E1D8EB] text-[#7C71B2]',
                                  CATEGORY_META[event.task.category]?.darkColor
                                )}
                              >
                                {CATEGORY_META[event.task.category]?.label || 'Task'}
                              </span>
                            </div>

                            {event.task.notes && (
                              <p className="text-xs text-[#5A4E7A] dark:text-[#C4B7DE] mt-0.5 line-clamp-1">
                                {event.task.notes}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[#5A4E7A] dark:text-[#C4B7DE]">
                              <span className="flex items-center gap-1 font-mono font-bold text-[#2A2244] dark:text-white">
                                <Clock className="w-3.5 h-3.5 text-[#7C71B2] dark:text-[#A59AC0]" />
                                {formatTimeDisplay(event.task.time)}
                              </span>
                              <span>•</span>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E1D8EB] dark:bg-[#130E26] text-[#7C71B2] dark:text-[#D8CEEB]">
                                ⏳ {getCountdown(event.task.time)}
                              </span>
                              <span>•</span>
                              <Link
                                href={CATEGORY_META[event.task.category]?.route || '/practice'}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7C71B2] dark:text-[#A59AC0] hover:text-[#2A2244] dark:hover:text-white hover:underline transition-colors cursor-pointer"
                              >
                                <span>Go to {CATEGORY_META[event.task.category]?.sectionName || 'Section'}</span>
                                <span>→</span>
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Actions: Toggle alarm & mark completed */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleTaskCompleted(event.task!)}
                            className={cn(
                              'p-2 rounded-2xl transition-colors cursor-pointer shadow-xs',
                              isCompleted
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white dark:bg-[#261E48] hover:bg-[#E1D8EB] dark:hover:bg-[#34295F] text-[#7C71B2] dark:text-[#D8CEEB]'
                            )}
                            title={isCompleted ? 'Mark as Incomplete' : 'Mark as Done Today'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          {/* Toggle Task Alarm */}
                          <button
                            type="button"
                            role="switch"
                            aria-checked={event.task.enabled}
                            onClick={() => handleToggleTask(event.task!.id, event.task!.enabled)}
                            className={cn(
                              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out',
                              event.task.enabled ? 'bg-[#7C71B2]' : 'bg-[#E1D8EB] dark:bg-[#130E26]'
                            )}
                            title="Toggle alarm for this task"
                          >
                            <span
                              className={cn(
                                'pointer-events-none inline-block h-5 w-5 m-0.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out',
                                event.task.enabled ? 'translate-x-5' : 'translate-x-0'
                              )}
                            />
                          </button>

                          {/* Delete task button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(event.task!.id)}
                            className="p-2 rounded-2xl text-[#8D7EA8] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                            title="Delete this task reminder"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}

          {/* 3. Streak Shield Alert Card */}
          <div className="flex items-start gap-2.5 sm:gap-3.5 relative">
            <div className="w-14 sm:w-16 shrink-0 text-right pr-1 pt-3 select-none">
              <span className="text-xs sm:text-sm font-bold font-mono text-[#2A2244] dark:text-white block leading-tight">
                10:00
              </span>
              <span className="text-[10px] uppercase font-bold text-[#7C71B2] dark:text-[#A59AC0] block">
                PM
              </span>
            </div>

            <div className="w-6 shrink-0 flex items-center justify-center pt-3">
              <div className="w-5 h-5 rounded-full bg-[#E1D8EB] dark:bg-[#261E48] shrink-0 z-10 flex items-center justify-center shadow-xs">
                <Flame className="w-2.5 h-2.5 text-[#D97706] dark:text-[#FBBF24]" />
              </div>
            </div>

            <div className="flex-1 min-w-0 rounded-3xl bg-gradient-to-r from-[#FFF5E6] to-[#F0EEF7] dark:from-[#241A3D] dark:to-[#1C1636] p-4 sm:p-5 shadow-sm relative">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] dark:bg-[#382046] text-[#D97706] dark:text-[#FBBF24] flex items-center justify-center shrink-0">
                    <Flame className="w-5 h-5 text-[#D97706] dark:text-[#FBBF24]" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-[#2A2244] dark:text-white tracking-tight">
                      Streak Protection Shield
                    </h4>
                    <p className="text-xs text-[#5A4E7A] dark:text-[#A59AC0] mt-0.5 leading-relaxed">
                      10:00 PM • Warns 2h before midnight to protect your daily streak
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.streakProtection}
                  onClick={() => updateSetting('streakProtection', !settings.streakProtection)}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out',
                    settings.streakProtection ? 'bg-[#7C71B2]' : 'bg-[#E1D8EB] dark:bg-[#130E26]'
                  )}
                  title="Toggle Streak Shield Alert"
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-5 w-5 m-0.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out',
                      settings.streakProtection ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 4. Night Empty Hours Block (Collapsible) */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 relative">
            <div className="w-14 sm:w-16 shrink-0 text-right pr-1 text-[11px] sm:text-xs text-[#8D7EA8] dark:text-[#8E82A8] font-mono select-none">
              23:00<br />
              <span className="text-[10px] opacity-70">to 23:59</span>
            </div>

            <div className="w-6 shrink-0 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-[#F0EEF7] dark:bg-[#1C1636] shadow-xs flex items-center justify-center text-[#7C71B2] z-10">
                <span className="text-[10px] font-bold">z</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <button
                type="button"
                onClick={() => setCollapsedNight(!collapsedNight)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#F0EEF7] dark:bg-[#1C1636] hover:bg-[#E1D8EB] dark:hover:bg-[#261E48] text-xs transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 text-[#5A4E7A] dark:text-[#C4B7DE]">
                  <span>🌙</span>
                  <span className="font-semibold">Late night rest window</span>
                </div>
                <span className="text-[11px] font-bold text-[#7C71B2] dark:text-[#A59AC0] hover:text-[#2A2244] dark:hover:text-white">
                  {collapsedNight ? 'Expand' : 'Collapse'}
                </span>
              </button>

              {!collapsedNight && (
                <div className="mt-2 p-3.5 rounded-2xl bg-[#F0EEF7] dark:bg-[#1C1636] text-xs text-[#2A2244] dark:text-[#C4B7DE] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Night Sprint Preset</span>
                    <button
                      type="button"
                      onClick={() => updateSetting('studyTime', '22:00')}
                      className="px-3 py-1 rounded-full bg-[#7C71B2] text-white font-bold text-[11px] hover:bg-[#685EA1] transition-colors"
                    >
                      Set 10:00 PM
                    </button>
                  </div>
                  <p className="text-[11px] text-[#8D7EA8] dark:text-[#8E82A8]">
                    Consolidate exam memory with a quick practice sprint before sleep.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Browser Alert Status Bar (Clean Borderless Styling) ── */}
        <div className="mt-8 pt-5 border-t border-[#C8BBDC]/40 dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[#5A4E7A] dark:text-[#8E82A8] font-medium">Browser / Play Store Status:</span>
            {permission === 'granted' && (
              <span className="inline-flex items-center gap-1 font-bold text-[#7C71B2] dark:text-[#D8CEEB] bg-[#E1D8EB] dark:bg-[#261E48] px-3 py-1 rounded-full text-[11px]">
                <Check className="w-3 h-3 text-[#7C71B2] dark:text-[#A59AC0]" /> System Notifications Active
              </span>
            )}
            {permission === 'denied' && (
              <span className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/70 px-3 py-1 rounded-full text-[11px]">
                <AlertCircle className="w-3 h-3" /> Blocked in Browser / App
              </span>
            )}
            {permission === 'default' && (
              <span className="inline-flex items-center gap-1 font-bold text-[#7C71B2] dark:text-[#D8CEEB] bg-[#E1D8EB] dark:bg-[#261E48] px-3 py-1 rounded-full text-[11px]">
                <AlertCircle className="w-3 h-3" /> Permission Not Granted Yet
              </span>
            )}
          </div>

          {permission !== 'granted' && permission !== 'unsupported' && (
            <button
              type="button"
              onClick={handleRequestPermission}
              className="px-4 py-1.5 rounded-full font-bold text-xs text-white bg-[#7C71B2] hover:bg-[#685EA1] active:scale-95 transition-all self-start sm:self-auto cursor-pointer shadow-sm"
            >
              Enable Notifications
            </button>
          )}
        </div>

        {/* ── Floating Action Button (+) ── */}
        <div className="fixed bottom-20 sm:bottom-8 right-6 z-40">
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsAddTaskModalOpen(true)}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#7C71B2] to-[#8B5CF6] hover:brightness-110 text-white flex items-center justify-center shadow-[0_8px_30px_rgba(124,113,178,0.45)] cursor-pointer transition-all group"
            title="Add Custom Task Reminder"
            aria-label="Add custom task reminder"
          >
            <Plus className="w-6 h-6 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
          </motion.button>
        </div>
      </div>

      {/* ── Audio Tone & Sound Preferences (Light & Dark Surface, Borderless) ── */}
      <div className="rounded-[2rem] bg-white dark:bg-[#15102A] p-6 sm:p-7 space-y-4 shadow-[0_10px_40px_rgba(124,113,178,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] text-[#2A2244] dark:text-white transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#F0EEF7] dark:bg-[#261E48] text-[#7C71B2] dark:text-[#C4B7DE]">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#2A2244] dark:text-white">Study Chime Sound</h4>
              <p className="text-xs text-[#5A4E7A] dark:text-[#A59AC0]">Synthesized offline bell tone when alarms trigger</p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={settings.soundEnabled}
            onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out',
              settings.soundEnabled ? 'bg-[#7C71B2]' : 'bg-[#E1D8EB] dark:bg-[#1C1636]'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-5 w-5 m-0.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out',
                settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>

        {/* Tone Selection Pills & Custom Tune Option */}
        {settings.soundEnabled && (
          <div className="space-y-3.5 pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {toneOptions.map((t) => {
                const isSelected = settings.reminderTone === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => updateSetting('reminderTone', t.id)}
                    className={cn(
                      'p-3 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between gap-2',
                      isSelected
                        ? 'bg-[#E1D8EB] dark:bg-[#261E48] text-[#2A2244] dark:text-white shadow-xs'
                        : 'bg-[#F0EEF7] dark:bg-[#1C1636] hover:bg-[#E1D8EB]/70 dark:hover:bg-[#261E48]/60 text-[#5A4E7A] dark:text-[#C4B7DE]'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{t.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#7C71B2] dark:text-[#C4B7DE]" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#8D7EA8] dark:text-[#8E82A8] truncate">{t.desc.split(' ')[0]}</span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewTone(t.id);
                        }}
                        className="p-1 rounded-md bg-white dark:bg-[#15102A] hover:bg-[#E1D8EB] dark:hover:bg-[#34295F] text-[#7C71B2] dark:text-[#D8CEEB] transition-colors shadow-2xs"
                      >
                        <Play className={cn('w-3 h-3', previewingTone === t.id && 'animate-spin')} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Tune Upload & Control Card */}
            <div className="rounded-2xl p-4 bg-[#F0EEF7] dark:bg-[#1C1636] transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
                onChange={handleFileUpload}
                className="hidden"
              />

              {customTone ? (
                /* Custom Tone Uploaded State */
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => handlePreviewTone('custom', customTone.dataUrl)}
                      className="w-10 h-10 rounded-2xl bg-white dark:bg-[#261E48] text-[#7C71B2] dark:text-[#D8CEEB] flex items-center justify-center shrink-0 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      title="Play / Pause Custom Tone Preview"
                    >
                      {previewingTone === 'custom' ? (
                        <Square className="w-4 h-4 fill-current text-[#7C71B2] dark:text-[#D8CEEB]" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5 text-[#7C71B2] dark:text-[#D8CEEB]" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#2A2244] dark:text-white truncate max-w-[200px] sm:max-w-xs block">
                          🎵 {customTone.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E1D8EB] dark:bg-[#261E48] text-[#7C71B2] dark:text-[#D8CEEB] shrink-0">
                          {formatAudioSize(customTone.sizeBytes)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8D7EA8] dark:text-[#8E82A8] mt-0.5">
                        Custom notification tune stored offline
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => updateSetting('reminderTone', 'custom')}
                      className={cn(
                        'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                        settings.reminderTone === 'custom'
                          ? 'bg-[#7C71B2] text-white shadow-xs'
                          : 'bg-white dark:bg-[#261E48] text-[#5A4E7A] dark:text-[#C4B7DE] hover:bg-[#E1D8EB] dark:hover:bg-[#34295F]'
                      )}
                    >
                      {settings.reminderTone === 'custom' && <Check className="w-3.5 h-3.5" />}
                      <span>{settings.reminderTone === 'custom' ? 'Active Tone' : 'Use As Alarm'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#261E48] hover:bg-[#E1D8EB] dark:hover:bg-[#34295F] text-[#5A4E7A] dark:text-[#C4B7DE] transition-colors cursor-pointer"
                      title="Replace with another audio file"
                    >
                      Change
                    </button>

                    <button
                      type="button"
                      onClick={handleDeleteCustomTone}
                      className="p-1.5 rounded-xl text-[#8D7EA8] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Delete custom tone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* No Custom Tone Uploaded Yet */
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#261E48] text-[#7C71B2] dark:text-[#C4B7DE] flex items-center justify-center shrink-0 shadow-xs">
                      <Music className="w-5 h-5 text-[#7C71B2] dark:text-[#C4B7DE]" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#2A2244] dark:text-white">
                        Add Custom Notification Tune
                      </h5>
                      <p className="text-[11px] text-[#8D7EA8] dark:text-[#8E82A8]">
                        Upload your favorite ringtone or study soundtrack (MP3, WAV, OGG, M4A)
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isUploadingTone}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#7C71B2] hover:bg-[#685EA1] active:scale-95 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingTone ? 'Processing...' : 'Upload Tune'}</span>
                  </button>
                </div>
              )}

              {toneUploadError && (
                <p className="text-xs text-rose-500 mt-2 font-medium">
                  {toneUploadError}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Modal: Add Custom Student Task Reminder ── */}
      <AnimatePresence>
        {isAddTaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddTaskModalOpen(false)}
              className="absolute inset-0 bg-[#2A2244]/50 dark:bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#15102A] p-6 sm:p-7 shadow-2xl text-[#2A2244] dark:text-white overflow-hidden max-h-[90vh] overflow-y-auto transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#F0EEF7] dark:bg-[#261E48] text-[#7C71B2] dark:text-[#C4B7DE]">
                    <ListTodo className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#2A2244] dark:text-white">
                      Add Task Reminder
                    </h3>
                    <p className="text-xs text-[#8D7EA8] dark:text-[#8E82A8]">
                      Schedule day-to-day study alarms & notifications
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="p-1.5 rounded-full text-[#8D7EA8] hover:text-[#2A2244] dark:text-[#8E82A8] dark:hover:text-white hover:bg-[#F0EEF7] dark:hover:bg-[#1C1636] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1-Click Popular Presets */}
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8D7EA8] dark:text-[#8E82A8] block mb-2">
                  Quick Student Templates
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STUDENT_PRESET_TEMPLATES.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyTemplate(tpl)}
                      className="p-2.5 rounded-xl text-left bg-[#F0EEF7] dark:bg-[#1C1636] hover:bg-[#E1D8EB] dark:hover:bg-[#261E48] transition-colors cursor-pointer text-xs flex flex-col justify-between gap-1 group"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs shrink-0">{CATEGORY_META[tpl.category]?.icon || '🎯'}</span>
                        <span className="font-bold text-[#2A2244] dark:text-white truncate block">
                          {tpl.title}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#7C71B2] dark:text-[#A59AC0] font-mono mt-0.5">
                        <span>{formatTimeDisplay(tpl.time)}</span>
                        <span className="text-[9px] font-sans font-medium px-1.5 py-0.5 rounded-md bg-[#E1D8EB]/80 dark:bg-[#261E48] text-[#5A4E7A] dark:text-[#C4B7DE] truncate">
                          {CATEGORY_META[tpl.category]?.sectionName || 'Section'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateTask} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-xs font-bold text-[#2A2244] dark:text-white block mb-1">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Physics Formula Recap, Math PYQs"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F0EEF7] dark:bg-[#1C1636] text-[#2A2244] dark:text-white placeholder-[#8D7EA8] dark:placeholder-[#8E82A8] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C71B2] transition-all"
                  />
                </div>

                {/* Time & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#2A2244] dark:text-white block mb-1">
                      Alarm Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={newTaskTime}
                      onChange={(e) => setNewTaskTime(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#F0EEF7] dark:bg-[#1C1636] text-[#2A2244] dark:text-white font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#7C71B2] transition-all cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2A2244] dark:text-white block mb-1">
                      Category
                    </label>
                    <select
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value as TaskCategory)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#F0EEF7] dark:bg-[#1C1636] text-[#2A2244] dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7C71B2] transition-all cursor-pointer"
                    >
                      <option value="quick_battle">⚡ Quick Battle (10 Qs) — Practice Mode</option>
                      <option value="practice_battle">⚔️ Practice Battle (25 Qs) — Practice Mode</option>
                      <option value="century">🏏 Century Run (50/100 Qs) — Practice Mode</option>
                      <option value="full_exam">🎓 Full Exam Mock Simulation — Exams Section</option>
                      <option value="questions">📚 Question Bank & PYQ — Questions Library</option>
                      <option value="history">🕒 History & Mistakes Review — History Section</option>
                      <option value="analytics">📊 Analytics & Speed Stats — Analytics</option>
                      <option value="streak">🔥 Streak Shield & Badges — Badges & Goals</option>
                      <option value="notes">📝 Notes & Formula Sheets — Notes Section</option>
                    </select>
                  </div>
                </div>

                {/* Days of Week */}
                <div>
                  <label className="text-xs font-bold text-[#2A2244] dark:text-white block mb-1.5">
                    Repeat on Days
                  </label>
                  <div className="grid grid-cols-7 gap-1.5">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayChar, dIdx) => {
                      const isDaySelected = newTaskDays.includes(dIdx);
                      return (
                        <button
                          key={dIdx}
                          type="button"
                          onClick={() => {
                            if (isDaySelected) {
                              if (newTaskDays.length <= 1) return;
                              setNewTaskDays(newTaskDays.filter((d) => d !== dIdx));
                            } else {
                              setNewTaskDays([...newTaskDays, dIdx].sort());
                            }
                          }}
                          className={cn(
                            'py-2 rounded-xl text-xs font-bold transition-all cursor-pointer',
                            isDaySelected
                              ? 'bg-[#7C71B2] text-white shadow-xs'
                              : 'bg-[#F0EEF7] dark:bg-[#1C1636] text-[#8D7EA8] dark:text-[#8E82A8]'
                          )}
                        >
                          {dayChar}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tone selection */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#2A2244] dark:text-white">
                      Alarm Sound Tone
                    </label>
                    <button
                      type="button"
                      onClick={() => taskModalFileInputRef.current?.click()}
                      className="text-[11px] font-bold text-[#7C71B2] dark:text-[#C4B7DE] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{customTone ? 'Upload Different Tune' : 'Add Custom Tune'}</span>
                    </button>
                  </div>

                  <input
                    ref={taskModalFileInputRef}
                    type="file"
                    accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
                    onChange={handleTaskModalFileUpload}
                    className="hidden"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    {toneOptions.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setNewTaskTone(t.id)}
                        className={cn(
                          'p-2 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between',
                          newTaskTone === t.id
                            ? 'bg-[#7C71B2] text-white shadow-xs'
                            : 'bg-[#F0EEF7] dark:bg-[#1C1636] text-[#2A2244] dark:text-[#C4B7DE]'
                        )}
                      >
                        <span>{t.name}</span>
                        {newTaskTone === t.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}

                    {/* Custom Tone Option if available */}
                    {customTone && (
                      <button
                        type="button"
                        onClick={() => setNewTaskTone('custom')}
                        className={cn(
                          'p-2 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between col-span-2',
                          newTaskTone === 'custom'
                            ? 'bg-[#7C71B2] text-white shadow-xs'
                            : 'bg-[#F0EEF7] dark:bg-[#1C1636] text-[#2A2244] dark:text-[#C4B7DE]'
                        )}
                      >
                        <span className="truncate">🎵 {customTone.name} ({formatAudioSize(customTone.sizeBytes)})</span>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewTone('custom', customTone.dataUrl);
                            }}
                            className="p-1 rounded-md bg-white dark:bg-[#261E48] hover:bg-[#E1D8EB] text-[#7C71B2] dark:text-[#D8CEEB]"
                            title="Preview sound"
                          >
                            <Play className="w-3 h-3" />
                          </span>
                          {newTaskTone === 'custom' && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs font-bold text-[#2A2244] dark:text-white block mb-1">
                    Target Goal / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15 questions target, review mistakes"
                    value={newTaskNotes}
                    onChange={(e) => setNewTaskNotes(e.target.value)}
                    className="w-full px-4 py-2 rounded-2xl bg-[#F0EEF7] dark:bg-[#1C1636] text-[#2A2244] dark:text-white placeholder-[#8D7EA8] dark:placeholder-[#8E82A8] text-xs focus:outline-none focus:ring-2 focus:ring-[#7C71B2] transition-all"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddTaskModalOpen(false)}
                    className="flex-1 py-3 rounded-2xl text-xs font-semibold text-[#8D7EA8] dark:text-[#8E82A8] bg-[#F0EEF7] dark:bg-[#1C1636] hover:bg-[#E1D8EB] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl text-xs font-bold text-white bg-[#7C71B2] hover:bg-[#685EA1] active:scale-95 transition-all shadow-md shadow-[#7C71B2]/30 cursor-pointer"
                  >
                    Save Task Reminder
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal: Edit Core Study Battle Time ── */}
      <AnimatePresence>
        {isTimePickerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTimePickerModalOpen(false)}
              className="absolute inset-0 bg-[#2A2244]/50 dark:bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#15102A] p-6 sm:p-7 shadow-2xl text-[#2A2244] dark:text-white overflow-hidden transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#F0EEF7] dark:bg-[#261E48] text-[#7C71B2] dark:text-[#C4B7DE]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#2A2244] dark:text-white">
                    Set Study Battle Hour
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTimePickerModalOpen(false)}
                  className="p-1.5 rounded-full text-[#8D7EA8] hover:text-[#2A2244] dark:text-[#8E82A8] dark:hover:text-white hover:bg-[#F0EEF7] dark:hover:bg-[#1C1636] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Time Selector */}
              <div className="p-4 rounded-2xl bg-[#F0EEF7] dark:bg-[#1C1636] mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8D7EA8] dark:text-[#8E82A8] block">
                    Scheduled Time
                  </span>
                  <span className="text-xl font-bold font-mono text-[#7C71B2] dark:text-[#D8CEEB]">
                    {formatTimeDisplay(settings.studyTime)}
                  </span>
                </div>
                <input
                  type="time"
                  value={settings.studyTime}
                  onChange={(e) => updateSetting('studyTime', e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#261E48] text-[#2A2244] dark:text-white font-mono text-base font-bold shadow-xs focus:outline-none focus:ring-2 focus:ring-[#7C71B2] transition-all cursor-pointer"
                />
              </div>

              {/* Quick Presets */}
              <div className="space-y-2 mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8D7EA8] dark:text-[#8E82A8] block">
                  Quick Presets
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_PRESETS.map((p) => {
                    const isSelected = settings.studyTime === p.time;
                    return (
                      <button
                        key={p.time}
                        type="button"
                        onClick={() => updateSetting('studyTime', p.time)}
                        className={cn(
                          'flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer',
                          isSelected
                            ? 'bg-[#7C71B2] text-white shadow-xs'
                            : 'bg-[#F0EEF7] dark:bg-[#1C1636] hover:bg-[#E1D8EB] dark:hover:bg-[#261E48] text-[#2A2244] dark:text-[#C4B7DE]'
                        )}
                      >
                        <span className="text-base">{p.icon}</span>
                        <div>
                          <div className={isSelected ? 'text-white font-bold' : 'text-[#2A2244] dark:text-white'}>
                            {p.label}
                          </div>
                          <div
                            className={cn(
                              'text-[10px] font-mono',
                              isSelected ? 'text-white/80' : 'text-[#8D7EA8] dark:text-[#8E82A8]'
                            )}
                          >
                            {formatTimeDisplay(p.time)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTimePickerModalOpen(false)}
                className="w-full py-3 rounded-2xl text-xs font-bold text-white bg-[#7C71B2] hover:bg-[#685EA1] active:scale-95 transition-all shadow-md shadow-[#7C71B2]/30 cursor-pointer"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
