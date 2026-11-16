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
        if (role === 'teacher') {
          setStep('teacher_welcome');
        } else {
          onRoleSelected('student');
        }
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
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {step === 'select' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#181622] rounded-[32px] p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] z-10 my-auto text-center overflow-hidden"
          >
            {/* Header */}
            <div className="max-w-md mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Welcome to SamayYudh 2.0
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-white tracking-tight">
                Which role defines you most?
              </h2>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Choose your primary learning or teaching journey. We customize your workflows,
                analytics, and tools accordingly.
              </p>
            </div>

            {/* Role Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {/* TEACHER CARD */}
              <div
                onClick={() => !submitting && handleChooseRole('teacher')}
                className="group relative flex flex-col items-center p-6 rounded-[28px] bg-neutral-50 dark:bg-[#201D2E] hover:bg-amber-50/50 dark:hover:bg-[#28243A] cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-center"
              >
                {/* Breaching 2D illustration */}
                <div className="-mt-8 mb-2">
                  <RoleTeacherIllustration size={160} />
                </div>

                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                  I&apos;m a Teacher
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
                  Create classrooms, upload questions and assignments, verify institutional identity,
                  and monitor student batch performance.
                </p>

                <button
                  type="button"
                  disabled={submitting}
                  className="w-full mt-auto py-3 px-5 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold text-sm transition-transform active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Select Teacher</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* STUDENT CARD */}
              <div
                onClick={() => !submitting && handleChooseRole('student')}
                className="group relative flex flex-col items-center p-6 rounded-[28px] bg-neutral-50 dark:bg-[#201D2E] hover:bg-neutral-100/70 dark:hover:bg-[#28243A] cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-center"
              >
                {/* Breaching 2D illustration */}
                <div className="-mt-8 mb-2">
                  <RoleStudentIllustration size={160} />
                </div>

                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                  I&apos;m a Student
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
                  Participate in live exam battles, practice thousands of PYQs, track study streaks,
                  and join teacher classrooms.
                </p>

                <button
                  type="button"
                  disabled={submitting}
                  className="w-full mt-auto py-3 px-5 rounded-2xl bg-[#18181B] hover:bg-black dark:bg-[#2E2A42] dark:hover:bg-[#383350] text-white font-semibold text-sm transition-transform active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Select Student</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="mt-6 text-xs text-neutral-400 dark:text-neutral-500">
              You can access public tests, mock sessions, and materials across both accounts.
            </p>
          </motion.div>
        ) : (
          /* STEP 2: TEACHER CONFIRMATION POPUP */
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full max-w-md bg-white dark:bg-[#181622] rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] z-10 my-auto text-center overflow-hidden"
          >
            {/* Top Breaching Illustration */}
            <div className="-mt-12 flex justify-center mb-3">
              <TeacherVerificationIllustration size={190} />
            </div>

            <h3 className="text-2xl font-extrabold text-[#18181B] dark:text-white tracking-tight">
              Welcome to the Teaching Community!
            </h3>

            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Your educator account has been created in pending status. Complete quick automated
              verification to activate classroom creation, test publishing, and student analytics.
            </p>

            {/* Quick Benefits Bullet List */}
            <div className="mt-5 p-4 rounded-2xl bg-neutral-50 dark:bg-[#201D2E] text-left space-y-2">
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
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Verify Yourself</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleExploreAsStudent}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-[#18181B] hover:bg-black dark:bg-[#27272A] dark:hover:bg-[#323236] text-white font-medium text-sm transition-all active:scale-95 cursor-pointer"
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

