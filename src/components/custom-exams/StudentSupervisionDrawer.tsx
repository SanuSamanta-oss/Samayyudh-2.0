'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  AlertTriangle,
  Pause,
  Play,
  Clock,
  Hand,
  CheckCircle2,
  Lock,
  Camera,
  Wifi,
  History,
  ShieldAlert,
  User,
  Award,
} from 'lucide-react';
import type { CustomExamParticipant, ExamSupervisionEvent } from '@/types/custom-exam';

interface StudentSupervisionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  participant: CustomExamParticipant | null;
  events: ExamSupervisionEvent[];
  onOpenWarnModal: () => void;
  onOpenSuspendModal: () => void;
  onRestore: () => Promise<void>;
  onOpenTimeModal: () => void;
  onAcknowledgeHand: () => Promise<void>;
  onForceSubmit: () => Promise<void>;
}

export function StudentSupervisionDrawer({
  isOpen,
  onClose,
  participant,
  events,
  onOpenWarnModal,
  onOpenSuspendModal,
  onRestore,
  onOpenTimeModal,
  onAcknowledgeHand,
  onForceSubmit,
}: StudentSupervisionDrawerProps) {
  if (!isOpen || !participant) return null;

  const studentEvents = events.filter((e) => e.student_id === participant.student_id);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end select-none">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="w-full max-w-md h-full bg-white dark:bg-[#0F172A] shadow-2xl flex flex-col justify-between border-l border-slate-200/60 dark:border-slate-800"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold text-base shadow-md">
              {participant.student_name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {participant.student_name}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {participant.student_lce_code} • {participant.student_class || 'Batch A'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                participant.is_suspended
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                  : participant.exam_status === 'submitted'
                  ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                  : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
              }`}
            >
              Status: {participant.exam_status.toUpperCase()}
            </span>

            {participant.hand_raised && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center gap-1.5 animate-pulse">
                <Hand className="w-3.5 h-3.5" />
                <span>Hand Raised</span>
              </span>
            )}

            {participant.warning_count > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{participant.warning_count} Warnings</span>
              </span>
            )}
          </div>

          {/* Real-time Candidate Statistics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Questions Attempted</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white mt-1 block">
                {participant.questions_answered || participant.questions_attempted || 0} Answered
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Estimated Accuracy</span>
              <span className="text-base font-extrabold text-purple-600 dark:text-purple-400 mt-1 block">
                {(participant.accuracy_percentage || 80).toFixed(1)}%
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Time Adjustment</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white mt-1 block">
                {participant.time_adjustment_seconds
                  ? `${participant.time_adjustment_seconds > 0 ? '+' : ''}${Math.round(
                      participant.time_adjustment_seconds / 60
                    )}m`
                  : '0m'}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Camera Feed</span>
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                <span>Active</span>
              </span>
            </div>
          </div>

          {/* Supervisory Interventions Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Supervisor Actions
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onOpenWarnModal}
                className="py-3 px-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border-0"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Issue Warning</span>
              </button>

              {participant.is_suspended ? (
                <button
                  type="button"
                  onClick={onRestore}
                  className="py-3 px-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border-0"
                >
                  <Play className="w-4 h-4" />
                  <span>Resume Exam</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenSuspendModal}
                  className="py-3 px-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border-0"
                >
                  <Pause className="w-4 h-4" />
                  <span>Suspend Exam</span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenTimeModal}
                className="py-3 px-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-800 dark:text-indigo-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border-0"
              >
                <Clock className="w-4 h-4" />
                <span>Adjust Time</span>
              </button>

              {participant.hand_raised ? (
                <button
                  type="button"
                  onClick={onAcknowledgeHand}
                  className="py-3 px-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-800 dark:text-purple-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border-0"
                >
                  <Hand className="w-4 h-4" />
                  <span>Lower Hand</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onForceSubmit}
                  className="py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border-0"
                >
                  <Lock className="w-4 h-4" />
                  <span>Force Submit</span>
                </button>
              )}
            </div>
          </div>

          {/* Audit Event Timeline for this Candidate */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <History className="w-3.5 h-3.5" />
              <span>Candidate Supervision History</span>
            </h3>

            {studentEvents.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-center text-xs text-slate-400">
                No disciplinary or intervention incidents recorded for this candidate.
              </div>
            ) : (
              <div className="space-y-2">
                {studentEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-slate-400 text-[10px]">
                      <span className="font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                        {evt.event_type}
                      </span>
                      <span>{new Date(evt.created_at).toLocaleTimeString()}</span>
                    </div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{evt.reason}</p>
                    {evt.description && (
                      <p className="text-[11px] text-slate-500 italic">{evt.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Student ID: {participant.student_id}</span>
          <span>Joined: {new Date(participant.joined_at).toLocaleTimeString()}</span>
        </div>
      </motion.div>
    </div>
  );
}
