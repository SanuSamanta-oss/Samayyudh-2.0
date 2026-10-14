'use client';

// ============================================================
// SamayYudh 2.0 — In-App Study Reminder Modal
// Styled with the Light Pastel Lavender Palette (No harsh borders):
// #F0EEF7 | #E1D8EB | #C8BBDC | #A193C6 | #7C71B2
// ============================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Flame, Swords, Clock, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface InAppReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSnooze: (minutes?: number) => void;
  title?: string;
  message?: string;
  isStreakAlert?: boolean;
  targetUrl?: string;
  actionLabel?: string;
}

export function InAppReminderModal({
  isOpen,
  onClose,
  onSnooze,
  title = 'Study Battle Time! ⚔️',
  message = 'Your scheduled study time has arrived. Take 10 minutes to conquer real exam questions and maintain your edge!',
  isStreakAlert = false,
  targetUrl = '/practice',
  actionLabel,
}: InAppReminderModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleStartPractice = () => {
    onClose();
    router.push(targetUrl || '/practice');
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
          className="absolute inset-0 bg-[#2A2244]/40 dark:bg-black/75 backdrop-blur-md"
        />

        {/* Modal Card - Clean, borderless floating card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 18 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#15102A] p-6 sm:p-8 shadow-[0_20px_60px_rgba(124,113,178,0.22)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden text-center text-[#2A2244] dark:text-white transition-colors duration-200"
        >
          {/* Subtle Ambient Backlight */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-gradient-to-b from-[#E1D8EB]/80 dark:from-[#261E48]/50 to-transparent blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#8D7EA8] dark:text-[#8E82A8] hover:text-[#2A2244] dark:hover:text-white hover:bg-[#F0EEF7] dark:hover:bg-[#1C1636] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Badge */}
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-[#E1D8EB] dark:bg-[#261E48] text-[#7C71B2] dark:text-[#C4B7DE] flex items-center justify-center shadow-sm animate-bounce">
            {isStreakAlert ? (
              <Flame className="w-8 h-8 text-[#D97706] dark:text-[#FBBF24]" />
            ) : (
              <Bell className="w-8 h-8 text-[#7C71B2] dark:text-[#D8CEEB]" />
            )}
          </div>

          {/* Title & Tag */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#E1D8EB] dark:bg-[#261E48] text-[#7C71B2] dark:text-[#D8CEEB]">
              <Clock className="w-3 h-3 text-[#7C71B2] dark:text-[#C4B7DE]" />
              {isStreakAlert ? 'Streak Shield Alert' : 'Daily Study Alarm'}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-[#2A2244] dark:text-white tracking-tight mb-2">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-[#5A4E7A] dark:text-[#C4B7DE] leading-relaxed mb-6 px-2">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleStartPractice}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#7C71B2] hover:bg-[#685EA1] shadow-md shadow-[#7C71B2]/30 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Swords className="w-4 h-4" />
              <span>{actionLabel || (isStreakAlert ? 'Protect My Streak 🔥' : 'Start Quick Battle (10 Min)')}</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onSnooze(10)}
                className="py-2.5 px-3 rounded-2xl text-xs font-semibold text-[#7C71B2] dark:text-[#D8CEEB] bg-[#F0EEF7] dark:bg-[#1C1636] hover:bg-[#E1D8EB] dark:hover:bg-[#261E48] transition-colors cursor-pointer"
              >
                Snooze 10m
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-3 rounded-2xl text-xs font-semibold text-[#8D7EA8] dark:text-[#8E82A8] hover:text-[#2A2244] dark:hover:text-white bg-[#F0EEF7] dark:bg-[#1C1636] hover:bg-[#E1D8EB] dark:hover:bg-[#261E48] transition-colors cursor-pointer"
              >
                Dismiss Today
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
