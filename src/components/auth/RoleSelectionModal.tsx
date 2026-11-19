'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  RoleStudentIllustration,
  RoleTeacherIllustration,
  TeacherVerificationIllustration,
} from '@/components/illustrations/AuthCardIllustrations';
import { CheckCircle2, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onRoleSelected: (role: 'student' | 'teacher') => void;
}

export function RoleSelectionModal({ isOpen, onRoleSelected }: RoleSelectionModalProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<'select' | 'teacher_welcome'>('select');

  if (!isOpen) return null;

  async function handleChooseRole(role: 'student' | 'teacher') {
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      if (res.ok) {
        onRoleSelected(role);
      }
    } catch (err) {
      console.error('Failed to set role:', err);
    } finally {
      setSubmitting(false);
    }
  }

  function handleGoToVerification() {
    onRoleSelected('teacher');
    router.push('/teacher/verify');
  }

  function handleExploreAsStudent() {
    onRoleSelected('teacher');
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 pt-20 sm:p-6 sm:pt-24 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {step === 'select' ? (
          /* POPUP 1: ROLE SELECTION CARDS (Perfect Ratio, Never Cut Off) */
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full max-w-xl sm:max-w-2xl bg-white dark:bg-[#181622] rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] z-10 my-auto text-center"
          >
            {/* Header */}
            <div className="max-w-md mx-auto mb-6 sm:mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Welcome to SamayYudh 2.0
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-white tracking-tight">
                Which role defines you most?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Choose your primary learning or teaching journey. We customize your workflows,
                analytics, and tools accordingly.
              </p>
            </div>

            {/* Role Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* TEACHER CARD */}
              <div
                onClick={() => !submitting && handleChooseRole('teacher')}
                className="group relative flex flex-col items-center pt-4 pb-6 px-5 rounded-[28px] bg-neutral-50 dark:bg-[#201D2E] hover:bg-amber-50/50 dark:hover:bg-[#28243A] cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-center"
              >
                {/* Unclipped 2D circle photo illustration */}
                <div className="mb-2">
                  <RoleTeacherIllustration size={150} />
                </div>

                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                  I&apos;m a Teacher
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5 leading-relaxed">
                  Create classrooms, upload questions and assignments, verify institutional identity,
                  and monitor student batch performance.
                </p>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!submitting) handleChooseRole('teacher');
                  }}
                  className="w-full mt-auto py-3 px-5 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold text-xs sm:text-sm transition-transform active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer border-0 outline-none"
                >
                  <span>Select Teacher</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* STUDENT CARD */}
              <div
                onClick={() => !submitting && handleChooseRole('student')}
                className="group relative flex flex-col items-center pt-4 pb-6 px-5 rounded-[28px] bg-neutral-50 dark:bg-[#201D2E] hover:bg-neutral-100/70 dark:hover:bg-[#28243A] cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-center"
              >
                {/* Unclipped 2D circle photo illustration */}
                <div className="mb-2">
                  <RoleStudentIllustration size={150} />
                </div>

                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                  I&apos;m a Student
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5 leading-relaxed">
                  Participate in live exam battles, practice thousands of PYQs, track study streaks,
                  and join teacher classrooms.
                </p>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!submitting) handleChooseRole('student');
                  }}
                  className="w-full mt-auto py-3 px-5 rounded-2xl bg-[#18181B] hover:bg-black dark:bg-[#2E2A42] dark:hover:bg-[#383350] text-white font-semibold text-xs sm:text-sm transition-transform active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer border-0 outline-none"
                >
                  <span>Select Student</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="mt-5 text-xs text-neutral-400 dark:text-neutral-500">
              You can access public tests, mock sessions, and materials across both accounts.
            </p>
          </motion.div>
        ) : (
          /* POPUP 2: TEACHER CONFIRMATION POPUP (Zero Overlap, Never Cut Off) */
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full max-w-[390px] sm:max-w-[420px] bg-white dark:bg-[#181622] rounded-[32px] pb-7 px-6 sm:px-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] z-10 my-auto text-center"
          >
            {/* Top Breaching Illustration (Vintage Teacher & Classroom) in Document Flow */}
            <div className="-mt-16 sm:-mt-20 mb-3.5 flex items-center justify-center drop-shadow-xl pointer-events-none">
              <TeacherVerificationIllustration size={160} />
            </div>

            <h3 className="text-2xl sm:text-[26px] font-extrabold text-[#18181B] dark:text-white tracking-tight leading-snug">
              Welcome to the Teaching Community!
            </h3>

            <p className="mt-2.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto">
              Your educator account has been created in pending status. Complete quick automated
              verification to activate classroom creation, test publishing, and student analytics.
            </p>

            {/* Quick Benefits Bullet List */}
            <div className="mt-5 p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#201D2E] text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>Instant automated institutional email check</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>Alternative Google Classroom &amp; Directory verification</span>
              </div>
            </div>

            {/* Action Buttons matching reference style */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleGoToVerification}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold text-xs sm:text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Verify Yourself</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleExploreAsStudent}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-[#18181B] hover:bg-black dark:bg-[#27272A] dark:hover:bg-[#323236] text-white font-medium text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
              >
                Explore as Student
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
