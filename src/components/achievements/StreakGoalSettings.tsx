'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, Target, Check, AlertCircle, Bell } from 'lucide-react';
import { PRESET_STREAK_GOALS, MAX_CUSTOM_GOAL_DAYS } from '@/lib/achievements/definitions';

export interface StreakGoalSettingsProps {
  isOpen: boolean;
  currentGoal: number;
  currentStreak: number;
  onSave: (newGoal: number) => Promise<void> | void;
  onClose: () => void;
}

export function StreakGoalSettings({
  isOpen,
  currentGoal,
  currentStreak,
  onSave,
  onClose,
}: StreakGoalSettingsProps) {
  const [selectedGoal, setSelectedGoal] = useState<number>(currentGoal);
  const [customInput, setCustomInput] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(!PRESET_STREAK_GOALS.includes(currentGoal as any));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (days: number) => {
    setIsCustom(false);
    setSelectedGoal(days);
    setError(null);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomInput(val);
    const num = parseInt(val, 10);
    if (!num || num <= 0) {
      setError('Please enter a positive number of days');
    } else if (num > MAX_CUSTOM_GOAL_DAYS) {
      setError(`Maximum goal allowed is ${MAX_CUSTOM_GOAL_DAYS} days`);
    } else {
      setError(null);
      setSelectedGoal(num);
    }
  };

  const handleConfirm = async () => {
    let finalDays = selectedGoal;
    if (isCustom) {
      const num = parseInt(customInput, 10);
      if (!num || num <= 0 || num > MAX_CUSTOM_GOAL_DAYS) {
        setError(`Please enter a valid target between 1 and ${MAX_CUSTOM_GOAL_DAYS} days`);
        return;
      }
      finalDays = num;
    }

    try {
      setIsSaving(true);
      await onSave(finalDays);
      onClose();
    } catch {
      setError('Failed to update streak goal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 md:p-8 shadow-2xl overflow-hidden"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Heading */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Set Your Streak Goal</h3>
              <p className="text-xs text-stone-500">
                Choose a streak milestone to strive toward every single day.
              </p>
            </div>
          </div>

          {/* Rules explanation box */}
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 mb-6 text-xs text-stone-600 dark:text-stone-300 space-y-1.5">
            <p className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
              <span>📌</span> How Streak Counting Works:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-stone-600 dark:text-stone-400">
              <li>Complete at least <strong>1 mock test</strong> on consecutive calendar days.</li>
              <li>Multiple tests in 1 day count as 1 streak day.</li>
              <li>Changing your goal <em>never resets your active streak ({currentStreak} days)</em> or erases medals.</li>
            </ul>
          </div>

          {/* Presets Grid */}
          <div className="space-y-3 mb-6">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              Choose a Target
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {PRESET_STREAK_GOALS.map((days) => {
                const isSelected = !isCustom && selectedGoal === days;
                return (
                  <button
                    key={days}
                    type="button"
                    onClick={() => handleSelectPreset(days)}
                    className={`py-3 px-2 rounded-2xl border text-center font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                        : 'border-border bg-card hover:bg-stone-50 dark:hover:bg-stone-800 text-foreground'
                    }`}
                  >
                    <span>{days} Days</span>
                    <span className={`text-[10px] font-normal ${isSelected ? 'text-amber-100' : 'text-stone-400'}`}>
                      {days <= 7 ? 'Sprint' : days <= 30 ? 'Habit' : 'Champion'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Input Option */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCustom(true);
                  if (!customInput) setCustomInput(selectedGoal.toString());
                }}
                className={`w-full py-2.5 px-4 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-colors ${
                  isCustom
                    ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                    : 'border-border hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                <span>Or Enter a Custom Target in Days</span>
                <span className="text-[11px] text-stone-400">Up to 365 days</span>
              </button>

              {isCustom && (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={MAX_CUSTOM_GOAL_DAYS}
                    value={customInput}
                    onChange={handleCustomChange}
                    placeholder="Enter days (e.g. 14, 45, 90)"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-stone-500 pr-2">Days</span>
                </div>
              )}
            </div>

            {error && (
              <p className="text-xs font-semibold text-rose-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* Daily Reminder Link */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 mb-5">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-purple-600 text-white shadow-xs">
                <Bell className="w-4 h-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-foreground">Need a Daily Practice Alarm?</p>
                <p className="text-[11px] text-muted">Set an 8:00 PM alarm so you never lose your streak</p>
              </div>
            </div>
            <Link
              href="/settings"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-white dark:bg-purple-900/60 border border-purple-200 dark:border-purple-700/60 hover:bg-purple-100 transition-colors shadow-2xs"
            >
              Set Alarm →
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="py-2.5 px-4 rounded-xl border border-border text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSaving || !!error}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              {isSaving ? 'Saving...' : 'Confirm Goal'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
