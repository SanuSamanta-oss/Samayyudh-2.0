'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ShieldAlert, Pause, AlertOctagon } from 'lucide-react';
import type { CustomExamParticipant } from '@/types/custom-exam';

interface SuspendStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: CustomExamParticipant | null;
  onConfirm: (reason: string) => Promise<void>;
}

export function SuspendStudentModal({
  isOpen,
  onClose,
  participant,
  onConfirm,
}: SuspendStudentModalProps) {
  const [reason, setReason] = useState('Severe violation of examination integrity protocols.');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !participant) return null;

  const handleSuspend = async () => {
    setSubmitting(true);
    try {
      await onConfirm(reason.trim());
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="relative w-full max-w-md rounded-[32px] bg-white dark:bg-[#111A2E] shadow-[0_25px_70px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.85)] p-6 sm:p-8 border-0 outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Suspend Candidate Examination
              </h2>
              <p className="text-xs text-slate-400">
                Action requires supervisor authorization
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer border-0 outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 text-xs text-rose-800 dark:text-rose-200 leading-relaxed border-0 shadow-xs">
            <strong>Candidate:</strong> {participant.student_name} ({participant.student_lce_code})
            <p className="mt-1 text-[11px] opacity-90">
              Suspending this candidate will immediately freeze their examination screen and block further answer submissions. All previously answered questions will remain safely stored. You can restore this student at any time.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Reason for Suspension
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide reason for suspension audit records..."
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#162032] border-0 outline-none ring-0 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0 resize-none shadow-inner"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer border-0 outline-none"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSuspend}
              disabled={submitting || !reason.trim()}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs tracking-tight shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer border-0 outline-none flex items-center gap-1.5 disabled:opacity-50"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>{submitting ? 'Suspending...' : 'Confirm Suspension'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
