'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Plus, Minus, CheckCircle2 } from 'lucide-react';
import type { CustomExamParticipant } from '@/types/custom-exam';

interface TimeAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: CustomExamParticipant | null;
  onConfirm: (secondsDelta: number, reason: string) => Promise<void>;
}

export function TimeAdjustmentModal({
  isOpen,
  onClose,
  participant,
  onConfirm,
}: TimeAdjustmentModalProps) {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(5);
  const [isReduction, setIsReduction] = useState(false);
  const [customMinutes, setCustomMinutes] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [reason, setReason] = useState('Proctor individual adjustment approved.');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !participant) return null;

  const quickMinutes = [1, 5, 10];

  const handleConfirm = async () => {
    let minutes = isCustom ? parseFloat(customMinutes) || 0 : selectedMinutes;
    if (minutes <= 0) return;

    const secondsDelta = Math.round(minutes * 60) * (isReduction ? -1 : 1);
    setSubmitting(true);
    try {
      await onConfirm(secondsDelta, reason.trim() || 'Individual time modification');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="relative w-full max-w-md rounded-[32px] bg-white dark:bg-[#111A2E] shadow-[0_25px_70px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.85)] p-6 sm:p-8 border-0 outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Individual Time Adjustment
              </h2>
              <p className="text-xs text-slate-400">
                Candidate: {participant.student_name} ({participant.student_lce_code})
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
          {/* Extension vs Reduction Toggle */}
          <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-[#162032]">
            <button
              type="button"
              onClick={() => setIsReduction(false)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                !isReduction
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Extend Time</span>
            </button>
            <button
              type="button"
              onClick={() => setIsReduction(true)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                isReduction
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Minus className="w-3.5 h-3.5" />
              <span>Reduce Time</span>
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Adjustment Amount
            </label>
            <div className="grid grid-cols-4 gap-2">
              {quickMinutes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setSelectedMinutes(m);
                    setIsCustom(false);
                  }}
                  className={`py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    !isCustom && selectedMinutes === m
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-[#162032] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {isReduction ? `-${m}m` : `+${m}m`}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className={`py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isCustom
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#162032] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Custom Minute Input */}
          {isCustom && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Custom Minutes ({isReduction ? 'Subtract' : 'Add'})
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                placeholder="Enter minutes..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#162032] border-0 outline-none text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
          )}

          {/* Reason Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Reason for Adjustment (Audit Record)
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Compensated for verified network interruption..."
              className="w-full px-4 py-2 rounded-2xl bg-slate-100 dark:bg-[#162032] border-0 outline-none text-xs text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting}
              className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Applying...' : 'Apply Time Adjustment'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
