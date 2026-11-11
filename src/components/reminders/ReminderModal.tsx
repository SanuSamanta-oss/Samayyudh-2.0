'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Play,
  SlidersHorizontal,
  Square,
  Upload,
  X,
} from 'lucide-react';
import {
  DAY_LABELS,
  TIME_PRESETS,
  type CustomTaskReminder,
  type ReminderSettings,
  type ReminderTone,
  type RepeatFrequency,
  type TaskCategory,
} from '@/types/reminders';
import type { CustomToneRecord } from '@/lib/notifications/custom-audio';
import { formatTimeDisplay, toLocalDateKey } from '@/lib/notifications/reminder-service';
import { BUILT_IN_TONES } from './NotificationSoundSettings';
import { CategoryIcon, PresetTimeIcon } from './category-icons';
import { SmoothSelect } from '@/components/ui/SmoothSelect';

export type ModalTarget =
  | { kind: 'create'; presetCategory?: TaskCategory; defaultDate?: string }
  | { kind: 'edit-task'; task: CustomTaskReminder }
  | { kind: 'edit-battle' };

export interface ReminderModalProps {
  target: ModalTarget | null;
  settings: ReminderSettings;
  customTone: CustomToneRecord | null;
  previewingTone: ReminderTone | null;
  onClose: () => void;
  onSaveTask: (
    payload: Omit<CustomTaskReminder, 'id'>,
    editingTaskId?: string
  ) => Promise<void>;
  onSaveBattle: (updates: Partial<ReminderSettings>) => Promise<void>;
  onPreviewTone: (tone: ReminderTone, customData?: string) => void;
  onUploadToneFile: (file: File) => Promise<CustomToneRecord | null>;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const REMINDER_TYPES: { id: TaskCategory; label: string }[] = [
  { id: 'study', label: 'Study' },
  { id: 'questions', label: 'Practice' },
  { id: 'practice_battle', label: 'Battle' },
  { id: 'current_affairs', label: 'Current Affairs' },
  { id: 'streak', label: 'Streak' },
  { id: 'custom', label: 'Custom' },
];

const QUICK_TEMPLATES: {
  title: string;
  time: string;
  category: TaskCategory;
  notes: string;
}[] = [
  {
    title: 'Morning Quick Battle (10 Qs)',
    time: '07:30',
    category: 'quick_battle',
    notes: 'Warm up with 10 timed questions in Practice mode.',
  },
  {
    title: 'Daily GK & Editorial Quiz',
    time: '14:30',
    category: 'current_affairs',
    notes: 'Complete your daily current affairs questions.',
  },
  {
    title: 'Full Mock Simulation',
    time: '18:30',
    category: 'full_exam',
    notes: 'Timed exam hall simulation.',
  },
];

function inferRepeatFromTask(task: CustomTaskReminder): RepeatFrequency {
  if (task.repeatType) return task.repeatType;
  if (task.scheduledDate) return 'once';
  if (task.days.length === 7) return 'daily';
  if (
    task.days.length === 5 &&
    [1, 2, 3, 4, 5].every((d) => task.days.includes(d))
  ) {
    return 'weekdays';
  }
  if (task.days.length === 1) return 'weekly';
  return 'custom';
}

function daysForRepeat(
  repeat: RepeatFrequency,
  selectedDate: string,
  customDays: number[]
): number[] {
  switch (repeat) {
    case 'daily':
      return [0, 1, 2, 3, 4, 5, 6];
    case 'weekdays':
      return [1, 2, 3, 4, 5];
    case 'weekly': {
      const d = new Date(`${selectedDate}T00:00:00`);
      return Number.isNaN(d.getTime()) ? [new Date().getDay()] : [d.getDay()];
    }
    case 'once': {
      const d = new Date(`${selectedDate}T00:00:00`);
      return Number.isNaN(d.getTime()) ? [new Date().getDay()] : [d.getDay()];
    }
    case 'custom':
    default:
      return customDays.length > 0 ? customDays : [1, 2, 3, 4, 5];
  }
}

export function ReminderModal({
  target,
  settings,
  customTone,
  previewingTone,
  onClose,
  onSaveTask,
  onSaveBattle,
  onPreviewTone,
  onUploadToneFile,
}: ReminderModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const todayStr = toLocalDateKey(new Date());

  // Task form state
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<TaskCategory>('study');
  const [time, setTime] = useState('08:30');
  const [repeatType, setRepeatType] = useState<RepeatFrequency>('daily');
  const [scheduledDate, setScheduledDate] = useState(todayStr);
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [browserNotif, setBrowserNotif] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [tone, setTone] = useState<ReminderTone>('chime');
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Battle edit state
  const [battleTime, setBattleTime] = useState(settings.studyTime);
  const [battleDays, setBattleDays] = useState<number[]>(settings.days);
  const [battleNote, setBattleNote] = useState(settings.customNote || '');
  const [battleTone, setBattleTone] = useState<ReminderTone>(settings.reminderTone);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);

  // Hydrate fields whenever target changes
  useEffect(() => {
    if (!target) return;
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (cancelled) return;
      setError(null);
      setSubmitting(false);

      if (target.kind === 'create') {
        setTitle('');
        setNotes('');
        setCategory(target.presetCategory || 'study');
        setTime('08:30');
        setRepeatType('daily');
        setScheduledDate(target.defaultDate || todayStr);
        setDays([1, 2, 3, 4, 5, 6]);
        setBrowserNotif(true);
        setSoundEnabled(settings.soundEnabled);
        setPushNotif(Boolean(settings.pushSubscribed));
        setTone(settings.reminderTone || 'chime');
        setAdvancedOpen(false);
      } else if (target.kind === 'edit-task') {
        const t = target.task;
        setTitle(t.title);
        setNotes(t.notes || '');
        setCategory(t.category || 'custom');
        setTime(t.time || '08:30');
        setRepeatType(inferRepeatFromTask(t));
        setScheduledDate(t.scheduledDate || todayStr);
        setDays(t.days.length > 0 ? t.days : [1, 2, 3, 4, 5]);
        setBrowserNotif(t.browserNotification !== false);
        setSoundEnabled(true);
        setPushNotif(Boolean(t.pushNotification));
        setTone(t.tone || settings.reminderTone || 'chime');
        setAdvancedOpen(false);
      } else if (target.kind === 'edit-battle') {
        setBattleTime(settings.studyTime || '20:00');
        setBattleDays(settings.days.length > 0 ? settings.days : [0, 1, 2, 3, 4, 5, 6]);
        setBattleNote(settings.customNote || '');
        setBattleTone(settings.reminderTone || 'chime');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [target, settings.soundEnabled, settings.pushSubscribed, settings.reminderTone, settings.studyTime, settings.days, settings.customNote, todayStr]);

  // Escape & focus
  useEffect(() => {
    if (!target) return;
    document.body.style.overflow = 'hidden';
    const focusTimer = setTimeout(() => titleInputRef.current?.focus(), 80);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [target, onClose]);

  const handleUploadCustomSound = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAudio(true);
    setError(null);
    try {
      const record = await onUploadToneFile(file);
      if (record) {
        if (target?.kind === 'edit-battle') setBattleTone('custom');
        else setTone('custom');
        onPreviewTone('custom', record.dataUrl);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to upload custom audio');
    } finally {
      setUploadingAudio(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please enter a reminder title.');
      titleInputRef.current?.focus();
      return;
    }
    if (!time) {
      setError('Please select a scheduled time.');
      return;
    }
    if (repeatType === 'once' && !scheduledDate) {
      setError('Please pick a date for a one-time reminder.');
      return;
    }

    const resolvedDays = daysForRepeat(repeatType, scheduledDate, days);
    const editingId = target?.kind === 'edit-task' ? target.task.id : undefined;

    // Duplicate check: same normalized title + time on overlapping day/date
    const duplicate = (settings.customTasks || []).find((existing) => {
      if (editingId && existing.id === editingId) return false;
      const sameTitle = existing.title.trim().toLowerCase() === trimmedTitle.toLowerCase();
      const sameTime = existing.time === time;
      if (!sameTitle || !sameTime) return false;

      if (repeatType === 'once' && existing.scheduledDate) {
        return existing.scheduledDate === scheduledDate;
      }
      return existing.days.some((d) => resolvedDays.includes(d));
    });

    if (duplicate) {
      setError('A matching reminder is already scheduled at this time.');
      return;
    }

    setSubmitting(true);
    try {
      await onSaveTask(
        {
          title: trimmedTitle,
          notes: notes.trim() || undefined,
          category,
          time,
          repeatType,
          scheduledDate: repeatType === 'once' ? scheduledDate : null,
          days: resolvedDays,
          enabled: target?.kind === 'edit-task' ? target.task.enabled : true,
          tone: soundEnabled ? tone : settings.reminderTone,
          customToneName:
            tone === 'custom' ? customTone?.name || 'Custom Sound' : undefined,
          browserNotification: browserNotif,
          pushNotification: pushNotif,
        },
        editingId
      );
      onClose();
    } catch {
      setError('Could not save reminder. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitBattle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!battleTime) {
      setError('Please select a scheduled time.');
      return;
    }
    setSubmitting(true);
    try {
      await onSaveBattle({
        studyTime: battleTime,
        days: battleDays.length > 0 ? battleDays : [0, 1, 2, 3, 4, 5, 6],
        customNote: battleNote.trim() || undefined,
        reminderTone: battleTone,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {target && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={
            target.kind === 'edit-battle'
              ? 'Edit Daily Study Battle'
              : target.kind === 'edit-task'
                ? 'Edit Reminder'
                : 'Add Reminder'
          }
        >
          {/* Dimmed Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.25, ease: EASE }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1B192B]/40 dark:bg-black/72 backdrop-blur-sm"
          />

          {/* Borderless Modal Container */}
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 14, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 10, scale: 0.98 }
            }
            transition={{ duration: prefersReducedMotion ? 0.12 : 0.28, ease: EASE }}
            className="relative w-full max-w-lg rounded-[24px] bg-white dark:bg-[#181822] p-6 sm:p-7 shadow-[0_16px_40px_rgba(30,25,60,0.16)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.65)] text-[#25233A] dark:text-[#F5F3FF] max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-[#25233A] dark:text-[#F5F3FF]">
                  {target.kind === 'edit-battle'
                    ? 'Edit Daily Study Battle'
                    : target.kind === 'edit-task'
                      ? 'Edit Reminder'
                      : 'Add Reminder'}
                </h3>
                <p className="text-xs text-[#77758A] dark:text-[#B0ADBF] mt-0.5">
                  {target.kind === 'edit-battle'
                    ? 'Adjust your core daily practice schedule and alarm tone'
                    : 'Schedule study sessions, practice battles, or daily routines'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="w-8 h-8 rounded-[10px] bg-[#F0EDF8] dark:bg-[#20202C] hover:bg-[#EAE6F5] dark:hover:bg-[#29283A] text-[#77758A] dark:text-[#B0ADBF] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mb-4 px-3.5 py-2.5 rounded-[12px] bg-rose-500/12 text-rose-600 dark:text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}

            {/* CORE BATTLE EDIT FORM */}
            {target.kind === 'edit-battle' ? (
              <form onSubmit={handleSubmitBattle} className="space-y-4">
                <div className="rounded-[16px] bg-[#F0EDF8] dark:bg-[#20202C] p-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#77758A] dark:text-[#B0ADBF] block">
                      Scheduled Time
                    </span>
                    <span className="text-lg font-bold text-[#7667C8] dark:text-[#8D7BE0] tabular-nums">
                      {formatTimeDisplay(battleTime)}
                    </span>
                  </div>
                  <input
                    type="time"
                    value={battleTime}
                    onChange={(e) => setBattleTime(e.target.value)}
                    className="px-3 py-2 rounded-[12px] bg-white dark:bg-[#181822] text-sm font-semibold text-[#25233A] dark:text-[#F5F3FF] focus:outline-none focus:ring-2 focus:ring-[#7667C8]/40 cursor-pointer"
                  />
                </div>

                <div>
                  <span className="text-xs font-semibold text-[#25233A] dark:text-[#F5F3FF] block mb-2">
                    Quick Presets
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_PRESETS.map((preset) => {
                      const active = battleTime === preset.time;
                      return (
                        <button
                          key={preset.time}
                          type="button"
                          onClick={() => setBattleTime(preset.time)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-[12px] text-left transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#7667C8] dark:bg-[#8D7BE0] text-white'
                              : 'bg-[#F0EDF8] dark:bg-[#20202C] hover:bg-[#EAE6F5] dark:hover:bg-[#29283A] text-[#25233A] dark:text-[#F5F3FF]'
                          }`}
                        >
                          <PresetTimeIcon preset={preset.icon} className="w-4 h-4 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">{preset.label}</p>
                            <p
                              className={`text-[11px] ${
                                active ? 'text-white/80' : 'text-[#77758A] dark:text-[#B0ADBF]'
                              }`}
                            >
                              {formatTimeDisplay(preset.time)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-[#25233A] dark:text-[#F5F3FF] block mb-2">
                    Active Days
                  </span>
                  <div className="grid grid-cols-7 gap-1.5">
                    {DAY_LABELS.map((d) => {
                      const selected = battleDays.includes(d.day);
                      return (
                        <button
                          key={d.day}
                          type="button"
                          onClick={() => {
                            if (selected) {
                              if (battleDays.length <= 1) return;
                              setBattleDays(battleDays.filter((v) => v !== d.day));
                            } else {
                              setBattleDays([...battleDays, d.day].sort());
                            }
                          }}
                          className={`py-2 rounded-[10px] text-xs font-semibold transition-colors cursor-pointer ${
                            selected
                              ? 'bg-[#7667C8] dark:bg-[#8D7BE0] text-white'
                              : 'bg-[#F0EDF8] dark:bg-[#20202C] text-[#77758A] dark:text-[#B0ADBF] hover:bg-[#EAE6F5] dark:hover:bg-[#29283A]'
                          }`}
                        >
                          {d.short}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#25233A] dark:text-[#F5F3FF] block mb-1.5">
                    Motivational Note
                  </label>
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={battleNote}
                    onChange={(e) => setBattleNote(e.target.value)}
                    placeholder="Time for your daily Battle with the Clock."
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#F0EDF8] dark:bg-[#20202C] text-sm text-[#25233A] dark:text-[#F5F3FF] placeholder-[#A19EB1] dark:placeholder-[#858195] focus:outline-none focus:ring-2 focus:ring-[#7667C8]/40"
                  />
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-[12px] text-xs font-semibold bg-[#F0EDF8] dark:bg-[#20202C] text-[#77758A] dark:text-[#B0ADBF] hover:bg-[#EAE6F5] dark:hover:bg-[#29283A] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-[12px] text-xs font-semibold bg-[#7667C8] dark:bg-[#8D7BE0] text-white hover:opacity-92 transition-opacity shadow-[0_6px_18px_rgba(118,103,200,0.28)] cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? 'Saving...' : 'Save Schedule'}
                  </button>
                </div>
              </form>
            ) : (
              /* CREATE OR EDIT TASK FORM */
              <form onSubmit={handleSubmitTask} className="space-y-4">
                {target.kind === 'create' && (
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A19EB1] dark:text-[#858195] block mb-2">
                      Quick Templates
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {QUICK_TEMPLATES.map((tpl) => (
                        <button
                          key={tpl.title}
                          type="button"
                          onClick={() => {
                            setTitle(tpl.title);
                            setTime(tpl.time);
                            setCategory(tpl.category);
                            setNotes(tpl.notes);
                          }}
                          className="p-2.5 rounded-[12px] text-left bg-[#F0EDF8] dark:bg-[#20202C] hover:bg-[#EAE6F5] dark:hover:bg-[#29283A] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#25233A] dark:text-[#F5F3FF]">
                            <CategoryIcon
                              category={tpl.category}
                              className="w-3.5 h-3.5 text-[#7667C8] dark:text-[#8D7BE0] shrink-0"
                            />
                            <span className="truncate">{tpl.title}</span>
                          </div>
                          <p className="text-[11px] text-[#77758A] dark:text-[#B0ADBF] mt-1">
                            {formatTimeDisplay(tpl.time)}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Basic Info */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-[#25233A] dark:text-[#F5F3FF] block mb-1.5">
                      Reminder Title
                    </label>
                    <input
                      ref={titleInputRef}
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Physics Formula Review or Mock Test"
                      className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#F0EDF8] dark:bg-[#20202C] text-sm text-[#25233A] dark:text-[#F5F3FF] placeholder-[#A19EB1] dark:placeholder-[#858195] focus:outline-none focus:ring-2 focus:ring-[#7667C8]/40 dark:focus:ring-[#8D7BE0]/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#25233A] dark:text-[#F5F3FF] block mb-1.5">
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Target goal or session focus"
                      className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#F0EDF8] dark:bg-[#20202C] text-xs sm:text-sm text-[#25233A] dark:text-[#F5F3FF] placeholder-[#A19EB1] dark:placeholder-[#858195] focus:outline-none focus:ring-2 focus:ring-[#7667C8]/40 dark:focus:ring-[#8D7BE0]/40"
                    />
                  </div>
                </div>

                {/* Reminder Type */}
                <div>
                  <span className="text-xs font-semibold text-[#25233A] dark:text-[#F5F3FF] block mb-2">
                    Reminder Type
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {REMINDER_TYPES.map((typeItem) => {
                      const active =
                        category === typeItem.id ||
                        (typeItem.id === 'study' &&
                          (category === 'notes' || category === 'revision')) ||
                        (typeItem.id === 'questions' && category === 'history') ||
                        (typeItem.id === 'practice_battle' &&
                          (category === 'quick_battle' ||
                            category === 'full_exam' ||
                            category === 'practice'));
                      return (
                        <button
                          key={typeItem.id}
                          type="button"
                          onClick={() => setCategory(typeItem.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-[12px] text-xs font-medium transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#EAE5FA] dark:bg-[#302A48] text-[#7667C8] dark:text-[#F5F3FF] font-semibold'
                              : 'bg-[#F0EDF8] dark:bg-[#20202C] text-[#77758A] dark:text-[#B0ADBF] hover:bg-[#EAE6F5] dark:hover:bg-[#29283A]'
                          }`}
                        >
                          <CategoryIcon category={typeItem.id} className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{typeItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Schedule: Date, Time & Repeat */}
                <div className="rounded-[16px] bg-[#F0EDF8]/70 dark:bg-[#20202C] p-3.5 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#77758A] dark:text-[#B0ADBF] flex items-center gap-1.5 mb-1">
                        <Clock className="w-3.5 h-3.5 text-[#7667C8] dark:text-[#8D7BE0]" />
                        Time
                      </label>
                      <input
                        type="time"
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-[12px] bg-white dark:bg-[#181822] text-sm font-semibold text-[#25233A] dark:text-[#F5F3FF] focus:outline-none focus:ring-2 focus:ring-[#7667C8]/40 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#77758A] dark:text-[#B0ADBF] flex items-center gap-1.5 mb-1">
                        <CalendarDays className="w-3.5 h-3.5 text-[#7667C8] dark:text-[#8D7BE0]" />
                        Repeat
                      </label>
                      <SmoothSelect
                        value={repeatType}
                        onChange={(v) => setRepeatType(v as RepeatFrequency)}
                        ariaLabel="Repeat frequency"
                        size="sm"
                        variant="elevated"
                        align="right"
                        className="w-full"
                        options={[
                          { value: 'once', label: 'Once' },
                          { value: 'daily', label: 'Daily' },
                          { value: 'weekdays', label: 'Weekdays' },
                          { value: 'weekly', label: 'Weekly' },
                          { value: 'custom', label: 'Custom' },
                        ]}
                      />
                    </div>
                  </div>

                  {repeatType === 'once' && (
                    <div>
                      <label className="text-[11px] font-semibold text-[#77758A] dark:text-[#B0ADBF] block mb-1">
                        Scheduled Date
                      </label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-[12px] bg-white dark:bg-[#181822] text-sm font-medium text-[#25233A] dark:text-[#F5F3FF] focus:outline-none focus:ring-2 focus:ring-[#7667C8]/40 cursor-pointer"
                      />
                    </div>
                  )}

                  {(repeatType === 'custom' || repeatType === 'weekly') && (
                    <div>
                      <span className="text-[11px] font-semibold text-[#77758A] dark:text-[#B0ADBF] block mb-1.5">
                        {repeatType === 'weekly' ? 'Day of Week' : 'Repeat on Days'}
                      </span>
                      <div className="grid grid-cols-7 gap-1.5">
                        {DAY_LABELS.map((d) => {
                          const selected = days.includes(d.day);
                          return (
                            <button
                              key={d.day}
                              type="button"
                              onClick={() => {
                                if (repeatType === 'weekly') {
                                  setDays([d.day]);
                                  return;
                                }
                                if (selected) {
                                  if (days.length <= 1) return;
                                  setDays(days.filter((v) => v !== d.day));
                                } else {
                                  setDays([...days, d.day].sort());
                                }
                              }}
                              className={`py-1.5 rounded-[10px] text-[11px] font-semibold transition-colors cursor-pointer ${
                                selected
                                  ? 'bg-[#7667C8] dark:bg-[#8D7BE0] text-white'
                                  : 'bg-white dark:bg-[#181822] text-[#77758A] dark:text-[#B0ADBF]'
                              }`}
                            >
                              {d.letter}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Collapsible Advanced Notification Preferences */}
                <div className="rounded-[16px] bg-[#F0EDF8]/65 dark:bg-[#20202C] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setAdvancedOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-[#25233A] dark:text-[#F5F3FF] hover:bg-[#EAE6F5] dark:hover:bg-[#29283A] transition-colors cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-2">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#7667C8] dark:text-[#8D7BE0]" />
                      Notification Preferences & Sound
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#77758A] transition-transform duration-200 ${
                        advancedOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {advancedOpen && (
                    <div className="px-3.5 pb-3.5 pt-1 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          {
                            label: 'Browser Alert',
                            checked: browserNotif,
                            onChange: () => setBrowserNotif((v) => !v),
                          },
                          {
                            label: 'Sound Alert',
                            checked: soundEnabled,
                            onChange: () => setSoundEnabled((v) => !v),
                          },
                          {
                            label: 'Push Alert',
                            checked: pushNotif,
                            onChange: () => setPushNotif((v) => !v),
                          },
                        ].map((pref) => (
                          <button
                            key={pref.label}
                            type="button"
                            onClick={pref.onChange}
                            className={`flex items-center justify-between px-2.5 py-2 rounded-[10px] text-[11px] font-medium transition-colors cursor-pointer ${
                              pref.checked
                                ? 'bg-[#EAE5FA] dark:bg-[#302A48] text-[#7667C8] dark:text-[#F5F3FF]'
                                : 'bg-white dark:bg-[#181822] text-[#77758A] dark:text-[#B0ADBF]'
                            }`}
                          >
                            <span className="inline-flex items-center gap-1.5">
                              <Bell className="w-3 h-3" />
                              {pref.label}
                            </span>
                            {pref.checked && <Check className="w-3 h-3" />}
                          </button>
                        ))}
                      </div>

                      {soundEnabled && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-[#77758A] dark:text-[#B0ADBF]">
                              Alert Sound
                            </span>
                            <button
                              type="button"
                              disabled={uploadingAudio}
                              onClick={() => fileInputRef.current?.click()}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7667C8] dark:text-[#8D7BE0] hover:underline cursor-pointer"
                            >
                              <Upload className="w-3 h-3" />
                              <span>{uploadingAudio ? 'Uploading...' : 'Upload custom sound'}</span>
                            </button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
                              onChange={handleUploadCustomSound}
                              className="hidden"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            {BUILT_IN_TONES.map((t) => {
                              const active = tone === t.id;
                              const playing = previewingTone === t.id;
                              return (
                                <div
                                  key={t.id}
                                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-[10px] text-xs ${
                                    active
                                      ? 'bg-[#7667C8] dark:bg-[#8D7BE0] text-white'
                                      : 'bg-white dark:bg-[#181822] text-[#25233A] dark:text-[#F5F3FF]'
                                  }`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => setTone(t.id)}
                                    className="flex-1 text-left font-medium truncate cursor-pointer"
                                  >
                                    {t.name}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onPreviewTone(t.id)}
                                    aria-label={`Preview ${t.name}`}
                                    className="p-1 rounded-md hover:opacity-80 cursor-pointer shrink-0"
                                  >
                                    {playing ? (
                                      <Square className="w-3 h-3 fill-current" />
                                    ) : (
                                      <Play className="w-3 h-3 fill-current" />
                                    )}
                                  </button>
                                </div>
                              );
                            })}

                            {customTone && (
                              <div
                                className={`col-span-2 flex items-center justify-between px-2.5 py-1.5 rounded-[10px] text-xs ${
                                  tone === 'custom'
                                    ? 'bg-[#7667C8] dark:bg-[#8D7BE0] text-white'
                                    : 'bg-white dark:bg-[#181822] text-[#25233A] dark:text-[#F5F3FF]'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => setTone('custom')}
                                  className="flex-1 text-left font-medium truncate cursor-pointer"
                                >
                                  {customTone.name}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onPreviewTone('custom', customTone.dataUrl)}
                                  aria-label="Preview custom sound"
                                  className="p-1 rounded-md hover:opacity-80 cursor-pointer shrink-0"
                                >
                                  {previewingTone === 'custom' ? (
                                    <Square className="w-3 h-3 fill-current" />
                                  ) : (
                                    <Play className="w-3 h-3 fill-current" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-[12px] text-xs font-semibold bg-[#F0EDF8] dark:bg-[#20202C] text-[#77758A] dark:text-[#B0ADBF] hover:bg-[#EAE6F5] dark:hover:bg-[#29283A] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-[12px] text-xs font-semibold bg-[#7667C8] dark:bg-[#8D7BE0] text-white hover:opacity-92 transition-opacity shadow-[0_6px_18px_rgba(118,103,200,0.28)] cursor-pointer disabled:opacity-60"
                  >
                    {submitting
                      ? 'Saving...'
                      : target.kind === 'edit-task'
                        ? 'Save Changes'
                        : 'Save Reminder'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
