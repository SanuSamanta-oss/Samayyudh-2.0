'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, CheckCircle, BellRing, X } from 'lucide-react';
import type { WarningLevel } from '@/types/custom-exam';

interface TeacherWarningOverlayProps {
  isOpen: boolean;
  warningLevel: WarningLevel;
  reason: string;
  note?: string;
  timestamp?: string;
  onAcknowledge: () => void;
}

export function TeacherWarningOverlay({
  isOpen,
  warningLevel,
  reason,
  note,
  timestamp,
  onAcknowledge,
}: TeacherWarningOverlayProps) {
  if (!isOpen) return null;

  const levelConfigs: Record<
    WarningLevel,
    { title: string; badgeClass: string; glowClass: string }
  > = {
    first: {
      title: 'First Advisory Warning',
      badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
      glowClass: 'shadow-[0_16px_40px_rgba(245,158,11,0.18)] dark:shadow-[0_20px_50px_rgba(245,158,11,0.14)]',
    },
    second: {
      title: 'Second Official Warning',
      badgeClass: 'bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300',
      glowClass: 'shadow-[0_16px_40px_rgba(249,115,22,0.22)] dark:shadow-[0_20px_50px_rgba(249,115,22,0.18)]',
    },
    final: {
      title: 'Final Supervisory Warning',
      badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300',
      glowClass: 'shadow-[0_20px_50px_rgba(244,63,94,0.28)] dark:shadow-[0_24px_60px_rgba(244,63,94,0.22)]',
    },
  };

  const currentConfig = levelConfigs[warningLevel] || levelConfigs.first;

  return (
    <AnimatePresence>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className={`rounded-3xl bg-white dark:bg-[#121727] p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 ${currentConfig.glowClass} select-none`}
        >
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${currentConfig.badgeClass}`}
                  >
                    {currentConfig.title}
                  </span>
                  {timestamp && (
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      {timestamp}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  Proctor Attention Required
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={onAcknowledge}
              className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors border-0 outline-none cursor-pointer"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Reason Section */}
          <div className="mt-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#182035] border border-slate-100 dark:border-white/5">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {reason || 'Suspicious behaviour flagged by live proctor.'}
            </div>
            {note && (
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                Note: {note}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Please refocus on your screen to avoid session suspension.
            </p>
            <button
              type="button"
              onClick={onAcknowledge}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer border-0 outline-none shrink-0 shadow-sm"
            >
              Acknowledge
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
