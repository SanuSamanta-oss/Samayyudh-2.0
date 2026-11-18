'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TeacherVerificationIllustration } from '@/components/illustrations/AuthCardIllustrations';
import { CheckCircle2, ChevronRight, GraduationCap } from 'lucide-react';

interface TeacherWelcomeModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export function TeacherWelcomeModal({ isOpen, onDismiss }: TeacherWelcomeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleVerify = () => {
    onDismiss();
    router.push('/teacher/verify');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
          className="fixed inset-0 bg-black/65 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-[390px] sm:max-w-[420px] bg-white dark:bg-[#181622] rounded-[36px] p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] z-10 my-auto text-center flex flex-col items-center border-0 outline-none"
        >
          {/* Top Illustration */}
          <div className="mb-2 flex items-center justify-center drop-shadow-md pointer-events-none">
            <TeacherVerificationIllustration size={120} />
          </div>

          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] mb-2">
            <GraduationCap className="w-3 h-3" /> Educator Account Initialized
          </span>

          <h3 className="text-xl sm:text-2xl font-extrabold text-[#18181B] dark:text-white tracking-tight leading-snug">
            Welcome to the Teaching Community!
          </h3>

          <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-[290px] mx-auto">
            Your educator account has been created in pending status. Complete quick automated verification to activate classroom creation, test publishing, and student analytics.
          </p>

          {/* Verification Highlights */}
          <div className="w-full mt-4 p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#201D2E] text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
              <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <span>Instant automated institutional email check</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
              <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <span>Alternative Google Classroom &amp; Directory verification</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full mt-5 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={handleVerify}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer border-0 outline-none"
              style={{ outline: 'none' }}
            >
              <span>Verify Yourself</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onDismiss}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-2xl bg-[#18181B] hover:bg-black dark:bg-[#27272A] dark:hover:bg-[#323236] text-white font-medium text-xs sm:text-sm transition-all active:scale-95 cursor-pointer border-0 outline-none"
              style={{ outline: 'none' }}
            >
              Explore as Student
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
