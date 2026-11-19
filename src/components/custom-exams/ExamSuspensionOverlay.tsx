'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PauseCircle, ShieldAlert, Radio, Clock, ShieldCheck, Lock } from 'lucide-react';

interface ExamSuspensionOverlayProps {
  isSuspended: boolean;
  reason?: string | null;
  suspendedAt?: string | null;
  onRefreshStatus?: () => void;
}

export function ExamSuspensionOverlay({
  isSuspended,
  reason,
  suspendedAt,
  onRefreshStatus,
}: ExamSuspensionOverlayProps) {
  if (!isSuspended) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl select-none overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-lg rounded-[32px] bg-white dark:bg-[#0F1424] border border-slate-200/80 dark:border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.45)] dark:shadow-[0_35px_100px_rgba(0,0,0,0.85)] p-6 sm:p-8 my-auto text-center"
        >
          {/* Top Status Icon with Pulse */}
          <div className="mx-auto w-16 h-16 rounded-3xl bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 relative">
            <PauseCircle className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 animate-ping opacity-75" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Workspace Temporarily Paused</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Examination Suspended by Supervisor
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Your examination session has been placed on hold by your proctor. All previously answered questions and your timer state are safely preserved.
          </p>

          {/* Reason Card */}
          <div className="mt-5 p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-left">
            <div className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Supervisor Stated Reason</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              {reason || 'Suspicious behaviour or environment discrepancy flagged by supervisor.'}
            </div>
            {suspendedAt && (
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                Recorded at {new Date(suspendedAt).toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Educational Instructions */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#151C30] border border-slate-100 dark:border-white/5 text-left text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Required Protocol:
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <span>Keep your webcam unobstructed and ensure adequate lighting.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <span>Remain seated in front of your device and maintain screen focus.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <span>Do not switch tabs, minimize the window, or launch third-party utilities.</span>
            </div>
          </div>

          {/* Automatic Live Waiting Pulse */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Awaiting supervisor restoration signal...</span>
            </div>

            {onRefreshStatus && (
              <button
                type="button"
                onClick={onRefreshStatus}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95 cursor-pointer border-0 outline-none"
              >
                Check Status
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
