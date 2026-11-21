'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertOctagon, CheckCircle2, Lock, FileSpreadsheet, ShieldAlert } from 'lucide-react';
import type { CustomExam, CustomExamParticipant } from '@/types/custom-exam';

interface EndExamConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: CustomExam;
  participants: CustomExamParticipant[];
  onConfirmEnd: () => Promise<void>;
  onDownloadReport: () => void;
}

export function EndExamConfirmationModal({
  isOpen,
  onClose,
  exam,
  participants,
  onConfirmEnd,
  onDownloadReport,
}: EndExamConfirmationModalProps) {
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const total = participants.length;
  const completed = participants.filter((p) => p.exam_status === 'submitted').length;
  const active = participants.filter((p) => p.exam_status === 'in_progress').length;
  const suspended = participants.filter((p) => p.is_suspended).length;
  const disconnected = participants.filter((p) => p.connection_status === 'disconnected').length;

  const handleEnd = async () => {
    setSubmitting(true);
    try {
      await onConfirmEnd();
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
        className="relative w-full max-w-lg rounded-[32px] bg-white dark:bg-[#111A2E] shadow-[0_25px_70px_rgba(0,0,0,0.2)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.85)] p-6 sm:p-8 border-0 outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Conclude Examination Session
              </h2>
              <p className="text-xs text-slate-400">
                Code: {exam.exam_code} • {exam.title}
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
          <div className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 text-xs text-rose-900 dark:text-rose-200 border-0 leading-relaxed">
            <p className="font-bold flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Permanent Invigilator Action</span>
            </p>
            Concluding this examination will immediately freeze all remaining active students, submit their current progress, stop live camera streaming, and seal all audit records. New join requests will be rejected instantly.
          </div>

          {/* Real-Time Session Metrics Summary */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#162032] text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Joined</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5 block">{total}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#162032] text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-500 block">Submitted</span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{completed}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#162032] text-center">
              <span className="text-[10px] uppercase font-bold text-amber-500 block">Active / Writing</span>
              <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400 mt-0.5 block">{active}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#162032] text-center">
              <span className="text-[10px] uppercase font-bold text-rose-500 block">Suspended</span>
              <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400 mt-0.5 block">{suspended}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#162032] text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Disconnected</span>
              <span className="text-lg font-extrabold text-slate-500 mt-0.5 block">{disconnected}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#162032] text-center">
              <span className="text-[10px] uppercase font-bold text-purple-500 block">Code Expiry</span>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-1.5 block">+3 Mins</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onDownloadReport}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
              >
                Keep Live
              </button>
              <button
                type="button"
                onClick={handleEnd}
                disabled={submitting}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-rose-600/20"
              >
                <Lock className="w-4 h-4" />
                <span>{submitting ? 'Concluding...' : 'Conclude & Lock'}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
