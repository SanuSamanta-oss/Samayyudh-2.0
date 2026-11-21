'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  Send,
  CheckCircle2,
} from 'lucide-react';
import {
  WARNING_REASONS,
  type WarningLevel,
  type WarningReasonCode,
  type CustomExamParticipant,
} from '@/types/custom-exam';

interface IssueWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: CustomExamParticipant | null;
  onConfirm: (
    reasonCode: WarningReasonCode,
    reasonLabel: string,
    level: WarningLevel,
    customNote: string
  ) => Promise<void>;
}

export function IssueWarningModal({
  isOpen,
  onClose,
  participant,
  onConfirm,
}: IssueWarningModalProps) {
  const [selectedReason, setSelectedReason] = useState<WarningReasonCode>('looking_away');
  const [warningLevel, setWarningLevel] = useState<WarningLevel>('first');
  const [customNote, setCustomNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Set default level based on current participant warning count
  React.useEffect(() => {
    if (participant) {
      if (participant.warning_count === 0) setWarningLevel('first');
      else if (participant.warning_count === 1) setWarningLevel('second');
      else setWarningLevel('final');
    }
  }, [participant]);

  if (!isOpen || !participant) return null;

  const currentReasonObj = WARNING_REASONS.find((r) => r.code === selectedReason);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onConfirm(
        selectedReason,
        currentReasonObj?.label || 'Suspicious Activity',
        warningLevel,
        customNote.trim() || currentReasonObj?.defaultNote || ''
      );
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
        className="relative w-full max-w-lg rounded-[32px] bg-white dark:bg-[#111A2E] shadow-[0_25px_70px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.8)] p-6 sm:p-8 border-0 outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Issue Invigilator Warning
              </h2>
              <p className="text-xs text-slate-400">
                To: {participant.student_name} ({participant.student_lce_code})
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
          {/* Warning Level Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Warning Escalation Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['first', 'second', 'final'] as WarningLevel[]).map((level) => {
                const active = warningLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setWarningLevel(level)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border-0 outline-none ${
                      active
                        ? level === 'final'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-[#162032] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#1D2B44]'
                    }`}
                  >
                    {level} Warning
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selectable Reasons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Observed Infraction Reason
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {WARNING_REASONS.map((r) => {
                const active = selectedReason === r.code;
                return (
                  <button
                    key={r.code}
                    type="button"
                    onClick={() => setSelectedReason(r.code)}
                    className={`w-full text-left p-3 rounded-2xl text-xs transition-all cursor-pointer border-0 outline-none flex items-center justify-between ${
                      active
                        ? 'bg-purple-100/90 dark:bg-purple-950/70 text-purple-900 dark:text-purple-200 font-semibold'
                        : 'bg-slate-50 dark:bg-[#162032] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1D2B44]'
                    }`}
                  >
                    <span>{r.label}</span>
                    {active && <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Note Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Supervisor Advisory Message (Sent to Student)
            </label>
            <textarea
              rows={2}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder={currentReasonObj?.defaultNote}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#162032] border-0 outline-none ring-0 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0 resize-none shadow-inner"
            />
          </div>

          {/* Action Buttons */}
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
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-tight shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer border-0 outline-none flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Dispatching...' : 'Dispatch Warning'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
