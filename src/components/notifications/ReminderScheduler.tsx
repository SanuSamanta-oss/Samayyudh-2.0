'use client';

// ============================================================
// SamayYudh 2.0 — Background Reminder Scheduler & Global Watcher
// Monitors scheduled study alarms, plays audio, and fires notifications.
// ============================================================

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { CATEGORY_META } from '@/types/reminders';
import {
  getReminderSettings,
  saveReminderSettings,
  triggerStudyNotification,
  REMINDER_SETTINGS_CHANGED_EVENT,
  ensureServiceWorker,
} from '@/lib/notifications/reminder-service';
import { playReminderSound, triggerHapticVibration } from '@/lib/notifications/audio';
import { InAppReminderModal } from './InAppReminderModal';
import { useAuth } from '@/components/providers/AuthProvider';

export function ReminderScheduler() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Daily Study Battle');
  const [modalMessage, setModalMessage] = useState('');
  const [modalTargetUrl, setModalTargetUrl] = useState('/practice');
  const [modalActionLabel, setModalActionLabel] = useState('Start Quick Battle (10 Min)');
  const [isStreakAlert, setIsStreakAlert] = useState(false);

  const lastCheckedMinuteRef = useRef<string>('');

  // 1. Register Service Worker and reset minute lock on settings changes
  useEffect(() => {
    ensureServiceWorker().catch(() => {});

    const handleSettingsChanged = () => {
      lastCheckedMinuteRef.current = '';
    };

    window.addEventListener(REMINDER_SETTINGS_CHANGED_EVENT, handleSettingsChanged);
    window.addEventListener('storage', handleSettingsChanged);

    return () => {
      window.removeEventListener(REMINDER_SETTINGS_CHANGED_EVENT, handleSettingsChanged);
      window.removeEventListener('storage', handleSettingsChanged);
    };
  }, []);

  // 2. Alarm Evaluation Logic
  const checkAlarm = useCallback(async () => {
    const current = getReminderSettings();
    if (!current.enabled) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayKey = `${year}-${month}-${day}`;

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentHM = `${hours}:${minutes}`;

    // Prevent executing multiple times in the same exact minute
    if (lastCheckedMinuteRef.current === currentHM) {
      return;
    }
    lastCheckedMinuteRef.current = currentHM;

    // Check if currently snoozed
    if (current.snoozedUntil && Date.now() < current.snoozedUntil) {
      return;
    }

    const currentDayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon ...
    const isDayActive = current.days.includes(currentDayOfWeek);

    // Check Snooze expiry
    const isSnoozeExpired = current.snoozedUntil && Date.now() >= current.snoozedUntil;

    // Check Scheduled Study Alarm Time
    const isExactStudyTime = isDayActive && currentHM === current.studyTime;
    const isAlreadyFiredToday = current.lastTriggeredDate === todayKey;

    let shouldFireAlarm = false;
    let title = 'Daily Study Battle';
    let message = current.customNote || 'Your scheduled study session is here. Practice real questions and protect your streak.';
    let isStreak = false;
    let toneToPlay = current.reminderTone;
    let triggeredTaskId: string | null = null;
    let shouldSendBrowserNotification = true;

    if (isSnoozeExpired) {
      shouldFireAlarm = true;
      title = 'Snooze Finished — Time to Practice';
      message = 'Ready for your quick study sprint? 10 minutes of practice makes all the difference.';
    } else if (isExactStudyTime && !isAlreadyFiredToday) {
      shouldFireAlarm = true;
    } else if (current.streakProtection && currentHM === '22:00' && current.lastTriggeredDate !== `${todayKey}_streak`) {
      // Streak Protection check at 10:00 PM
      shouldFireAlarm = true;
      isStreak = true;
      title = 'Streak Shield: 2 Hours Left';
      message = "Don't let today slip away! Complete 1 quick battle before midnight to keep your study streak alive.";
    } else if (current.customTasks && current.customTasks.length > 0) {
      // Check custom day-to-day task reminders (handles both one-time scheduledDate and recurring days)
      for (const task of current.customTasks) {
        const matchesDate =
          task.repeatType === 'once' || task.scheduledDate
            ? task.scheduledDate === todayKey
            : task.days.includes(currentDayOfWeek);
        if (
          task.enabled &&
          matchesDate &&
          currentHM === task.time &&
          task.lastTriggeredDate !== todayKey
        ) {
          shouldFireAlarm = true;
          title = task.title;
          message = task.notes || 'Your scheduled study task has arrived. Stay focused and keep your momentum high.';
          toneToPlay = task.tone || current.reminderTone;
          triggeredTaskId = task.id;
          shouldSendBrowserNotification = task.browserNotification !== false;
          break;
        }
      }
    }

    if (shouldFireAlarm) {
      // Play Sound
      if (current.soundEnabled) {
        playReminderSound(toneToPlay).catch(() => {});
      }

      // Haptic Vibration
      if (current.vibrationEnabled) {
        triggerHapticVibration([250, 100, 250, 100, 250]);
      }

      // Determine deep link URL and label based on triggered task category
      let targetUrl = '/practice';
      let actionLabel = 'Start Quick Battle (10 Min)';
      if (triggeredTaskId) {
        const found = current.customTasks.find((t) => t.id === triggeredTaskId);
        if (found && found.category && CATEGORY_META[found.category]) {
          targetUrl = CATEGORY_META[found.category].route;
          actionLabel = `Launch ${CATEGORY_META[found.category].sectionName}`;
        }
      } else if (isStreak) {
        targetUrl = '/achievements';
        actionLabel = 'Protect My Streak';
      }

      // System Notification (Service Worker or Native)
      if (shouldSendBrowserNotification) {
        triggerStudyNotification(title, message, {
          tag: isStreak ? 'streak-reminder' : triggeredTaskId ? `task-${triggeredTaskId}` : 'study-reminder',
          url: targetUrl,
        }).catch(() => {});
      }

      // Open In-App Modal if tab is focused
      setModalTitle(title);
      setModalMessage(message);
      setModalTargetUrl(targetUrl);
      setModalActionLabel(actionLabel);
      setIsStreakAlert(isStreak);
      setModalOpen(true);

      // Persist that alarm has fired for today
      if (triggeredTaskId) {
        const nextCustomTasks = (current.customTasks || []).map((t) =>
          t.id === triggeredTaskId ? { ...t, lastTriggeredDate: todayKey } : t
        );
        saveReminderSettings({ customTasks: nextCustomTasks }, user?.id);
      } else {
        saveReminderSettings(
          {
            lastTriggeredDate: isStreak ? `${todayKey}_streak` : todayKey,
            snoozedUntil: null,
          },
          user?.id
        );
      }
    }
  }, [user?.id]);

  // 3. Scheduler Tick Loop (runs every 25 seconds)
  useEffect(() => {
    let cancelled = false;
    const interval = setInterval(() => {
      void checkAlarm();
    }, 25000);

    // Also check immediately when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void checkAlarm();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    // Initial check on load asynchronously to avoid synchronous setState in effect
    void Promise.resolve().then(() => {
      if (!cancelled) void checkAlarm();
    });

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkAlarm]);

  const handleSnooze = (minutes: number = 10) => {
    const snoozeTime = Date.now() + minutes * 60 * 1000;
    saveReminderSettings({ snoozedUntil: snoozeTime }, user?.id);
    setModalOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <InAppReminderModal
      isOpen={modalOpen}
      onClose={handleCloseModal}
      onSnooze={handleSnooze}
      title={modalTitle}
      message={modalMessage}
      isStreakAlert={isStreakAlert}
      targetUrl={modalTargetUrl}
      actionLabel={modalActionLabel}
    />
  );
}
