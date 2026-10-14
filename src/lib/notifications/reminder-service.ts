// ============================================================
// SamayYudh 2.0 — Study Reminder & Notification Service
// Handles storage, browser notification permissions, and alarms.
// ============================================================

import {
  ReminderSettings,
  DEFAULT_REMINDER_SETTINGS,
} from '@/types/reminders';
import { playReminderSound, triggerHapticVibration } from './audio';
import { createClient } from '@/lib/supabase/client';

const STORAGE_KEY = 'samayyudh_reminder_settings';
export const REMINDER_SETTINGS_CHANGED_EVENT = 'samayyudh_reminder_settings_changed';

/**
 * Loads student reminder settings from localStorage with fallback defaults.
 */
export function getReminderSettings(): ReminderSettings {
  if (typeof window === 'undefined') return DEFAULT_REMINDER_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_REMINDER_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_REMINDER_SETTINGS,
      ...parsed,
      customTasks: Array.isArray(parsed.customTasks) ? parsed.customTasks : DEFAULT_REMINDER_SETTINGS.customTasks,
    };
  } catch {
    return DEFAULT_REMINDER_SETTINGS;
  }
}

/**
 * Saves reminder settings to localStorage and syncs with Supabase if online.
 */
export async function saveReminderSettings(
  updated: Partial<ReminderSettings>,
  userId?: string | null
): Promise<ReminderSettings> {
  const current = getReminderSettings();
  const next: ReminderSettings = {
    ...current,
    ...updated,
    customTasks: updated.customTasks !== undefined ? updated.customTasks : current.customTasks,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(
        new CustomEvent(REMINDER_SETTINGS_CHANGED_EVENT, { detail: next })
      );
    } catch {
      // Ignore localStorage errors
    }
  }

  // Sync to Supabase user metadata if logged in
  if (userId) {
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: {
          reminder_settings: next,
        },
      });
    } catch {
      // Graceful offline fallback
    }
  }

  return next;
}

/**
 * Adds a new custom task reminder for the student.
 */
export async function addCustomTask(
  task: Omit<import('@/types/reminders').CustomTaskReminder, 'id'>,
  userId?: string | null
): Promise<ReminderSettings> {
  const current = getReminderSettings();
  const newTask: import('@/types/reminders').CustomTaskReminder = {
    ...task,
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
  };
  return saveReminderSettings(
    {
      customTasks: [...(current.customTasks || []), newTask],
    },
    userId
  );
}

/**
 * Updates a custom task by ID.
 */
export async function updateCustomTask(
  id: string,
  updates: Partial<import('@/types/reminders').CustomTaskReminder>,
  userId?: string | null
): Promise<ReminderSettings> {
  const current = getReminderSettings();
  const nextTasks = (current.customTasks || []).map((t) =>
    t.id === id ? { ...t, ...updates } : t
  );
  return saveReminderSettings({ customTasks: nextTasks }, userId);
}

/**
 * Deletes a custom task by ID.
 */
export async function deleteCustomTask(
  id: string,
  userId?: string | null
): Promise<ReminderSettings> {
  const current = getReminderSettings();
  const nextTasks = (current.customTasks || []).filter((t) => t.id !== id);
  return saveReminderSettings({ customTasks: nextTasks }, userId);
}

/**
 * Computes the next upcoming task (primary study battle or custom task) and remaining time.
 */
export function getNextUpcomingTask(settings: ReminderSettings): {
  id: string;
  title: string;
  time: string;
  formattedTime: string;
  countdown: string;
  isPrimary?: boolean;
} | null {
  if (!settings.enabled) return null;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentDayOfWeek = now.getDay();

  const allItems: {
    id: string;
    title: string;
    time: string;
    minutes: number;
    isPrimary?: boolean;
    days: number[];
  }[] = [];

  // 1. Primary study battle
  if (settings.studyTime && settings.days.includes(currentDayOfWeek)) {
    const [h, m] = settings.studyTime.split(':').map((v) => parseInt(v, 10));
    allItems.push({
      id: 'primary-battle',
      title: 'Daily Study Battle',
      time: settings.studyTime,
      minutes: h * 60 + m,
      isPrimary: true,
      days: settings.days,
    });
  }

  // 2. Custom tasks active today
  (settings.customTasks || []).forEach((t) => {
    if (t.enabled && t.days.includes(currentDayOfWeek)) {
      const [h, m] = t.time.split(':').map((v) => parseInt(v, 10));
      allItems.push({
        id: t.id,
        title: t.title,
        time: t.time,
        minutes: h * 60 + m,
        isPrimary: false,
        days: t.days,
      });
    }
  });

  if (allItems.length === 0) return null;

  // Sort by minutes of day
  allItems.sort((a, b) => a.minutes - b.minutes);

  // Find next task today
  let next = allItems.find((item) => item.minutes > currentMinutes);

  let diffMinutes = 0;
  if (next) {
    diffMinutes = next.minutes - currentMinutes;
  } else {
    // Wrap around to first task tomorrow
    next = allItems[0];
    diffMinutes = 24 * 60 - currentMinutes + next.minutes;
  }

  const hLeft = Math.floor(diffMinutes / 60);
  const mLeft = diffMinutes % 60;
  const countdown =
    hLeft === 0 && mLeft <= 1
      ? 'Due now'
      : hLeft === 0
      ? `in ${mLeft}m`
      : `in ${hLeft}h ${mLeft}m`;

  return {
    id: next.id,
    title: next.title,
    time: next.time,
    formattedTime: formatTimeDisplay(next.time),
    countdown,
    isPrimary: next.isPrimary,
  };
}

/**
 * Checks whether native notifications are supported in this browser environment.
 */
export function isNotificationSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'Notification' in window;
}

/**
 * Returns current permission state ('granted' | 'denied' | 'default' | 'unsupported').
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Registers service worker if not already registered and active.
 */
export async function ensureServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    return registration;
  } catch {
    return null;
  }
}

/**
 * Requests browser permission to display system notifications.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await ensureServiceWorker();
    }
    return permission;
  } catch {
    return 'default';
  }
}

/**
 * Dispatches a native browser notification via Service Worker or Notification API.
 */
export async function triggerStudyNotification(
  title: string,
  body: string,
  options?: {
    tag?: string;
    url?: string;
    requireInteraction?: boolean;
  }
): Promise<boolean> {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  const url = options?.url || '/practice';
  const tag = options?.tag || 'study-reminder';

  // 1. Try Service Worker showNotification (preferred for mobile PWA & Android)
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.showNotification) {
        await reg.showNotification(title, {
          body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag,
          renotify: true,
          requireInteraction: options?.requireInteraction ?? true,
          data: { url },
        } as any);
        return true;
      }
    } catch {
      // Fall through to standard Notification
    }
  }

  // 2. Standard Notification constructor fallback
  try {
    const notification = new Notification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag,
      data: { url },
    });

    notification.onclick = () => {
      window.focus();
      if (typeof window !== 'undefined') {
        window.location.href = url;
      }
      notification.close();
    };

    return true;
  } catch {
    return false;
  }
}

/**
 * Formats 24h string "HH:mm" into a friendly localized string like "8:00 PM".
 */
export function formatTimeDisplay(timeStr: string): string {
  if (!timeStr || !timeStr.includes(':')) return timeStr;
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return timeStr;

  const period = h >= 12 ? 'PM' : 'AM';
  const displayHours = h % 12 || 12;
  const displayMinutes = m < 10 ? `0${m}` : m;
  return `${displayHours}:${displayMinutes} ${period}`;
}

/**
 * Runs a complete test simulation of the sound, vibration, and system notification.
 */
export async function testNotificationAndAlarm(settings: ReminderSettings): Promise<{
  soundPlayed: boolean;
  notificationSent: boolean;
  permission: NotificationPermission | 'unsupported';
}> {
  let soundPlayed = false;
  if (settings.soundEnabled) {
    playReminderSound(settings.reminderTone);
    soundPlayed = true;
  }

  if (settings.vibrationEnabled) {
    triggerHapticVibration([200, 100, 200]);
  }

  let permission = getNotificationPermission();
  if (permission === 'default') {
    permission = await requestNotificationPermission();
  }

  let notificationSent = false;
  if (permission === 'granted') {
    const formatted = formatTimeDisplay(settings.studyTime);
    notificationSent = await triggerStudyNotification(
      'সময়যুদ্ধ 2.0 — Alarm & Notification Test 🔔',
      `Awesome! Your study alarm is set for ${formatted}. We'll remind you to conquer your questions on schedule!`,
      { tag: 'test-reminder', url: '/practice' }
    );
  }

  return { soundPlayed, notificationSent, permission };
}
