'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Clock,
  Award,
  Video,
  Mic,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Globe,
  Sparkles,
  User,
  School,
  FileText,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import type { InvitationValidationResult } from '@/types/custom-exam';
import { setPendingInvitation } from '@/lib/invitations/pending-invitation-service';
import { PwaInstallBanner } from './PwaInstallBanner';
import { useAuth } from '@/components/providers/AuthProvider';
import { isStandaloneApp } from '@/lib/platform';

interface SmartInvitationLandingProps {
  initialCode: string;
}

export function SmartInvitationLanding({ initialCode }: SmartInvitationLandingProps) {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<InvitationValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Validate the invitation on mount
  useEffect(() => {
    let active = true;

    async function validate() {
      try {
        setLoading(true);
        setError(null);

        // Store pending invitation locally right away
        setPendingInvitation(initialCode, 'link');

        const res = await fetch(`/api/custom-exams/invitation/validate?code=${encodeURIComponent(initialCode)}`);
        const json: InvitationValidationResult = await res.json();

        if (active) {
          setData(json);
          setLoading(false);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Unable to connect to verification server.');
          setLoading(false);
        }
      }
    }

    validate();

    return () => {
      active = false;
    };
  }, [initialCode]);

  // Handle "Continue on Web" action
  const handleContinueOnWeb = () => {
    const cleanCode = (data?.exam?.exam_code || initialCode).trim().toUpperCase();
    setPendingInvitation(cleanCode, 'link');

    if (isAuthenticated) {
      // Direct pass to waiting room
      router.push(`/exam/waiting-room?code=${encodeURIComponent(cleanCode)}`);
    } else {
      // Route to auth with preserved redirect target
      router.push(`/auth?redirect=${encodeURIComponent(`/exam/waiting-room?code=${cleanCode}`)}&exam=${encodeURIComponent(cleanCode)}`);
    }
  };

  const exam = data?.exam;
  const isInvalid = !data?.valid || data?.status !== 'valid';

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0A0E17] text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* Background Soft Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/10 dark:bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-xl mx-auto z-10 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-[0_8px_20px_rgba(124,58,237,0.3)]">
              S
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white block">
                SAMAYYUDH <span className="text-purple-600 dark:text-purple-400">2.0</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase block">
                Official Examination Gateway
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span>Invitation Verified</span>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#111827] shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto animate-spin">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Validating Examination Invitation...
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Connecting to secure examination ledger and checking candidate eligibility.
            </p>
          </motion.div>
        )}

        {/* ERROR / RESTRICTED STATES */}
        {!loading && isInvalid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {data?.status === 'already_submitted'
                    ? 'Examination Already Submitted'
                    : data?.status === 'expired'
                    ? 'Invitation Has Expired'
                    : data?.status === 'revoked'
                    ? 'Invitation Revoked'
                    : data?.status === 'ended'
                    ? 'Examination Concluded'
                    : 'Examination Not Available'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {data?.message || error || 'This examination link is no longer accessible.'}
                </p>
              </div>
            </div>

            {data?.status === 'already_submitted' && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Your examination responses have been recorded and sent to your invigilator.</span>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 py-3.5 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold transition-all border-0 outline-none"
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="py-3.5 px-5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all border-0 outline-none flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* VALID INVITATION CARD */}
        {!loading && !isInvalid && exam && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] space-y-6"
          >
            {/* Header: Title & Subject */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold text-xs">
                  {exam.subject || 'All Subjects'}
                </span>
                {exam.target_class && (
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-xs">
                    {exam.target_class}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-purple-600 dark:text-purple-400 font-bold text-xs ml-auto">
                  {exam.exam_code}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                {exam.title}
              </h1>

              {exam.description && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                  {exam.description}
                </p>
              )}
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 text-center space-y-1">
                <div className="w-7 h-7 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] text-slate-400 block font-medium">Duration</span>
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">
                  {exam.duration_minutes} Mins
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 text-center space-y-1">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] text-slate-400 block font-medium">Total Marks</span>
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">
                  {exam.total_marks} Marks
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 text-center space-y-1">
                <div className="w-7 h-7 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] text-slate-400 block font-medium">Questions</span>
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">
                  {exam.total_questions > 0 ? `${exam.total_questions} Qs` : 'Standard'}
                </span>
              </div>
            </div>

            {/* Proctoring & Security Tags */}
            <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300">
                <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Supervision Requirements</span>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                {exam.supervision_enabled ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 shadow-sm font-medium">
                    <Video className="w-3 h-3 text-purple-600" />
                    Webcam Surveillance Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 shadow-sm font-medium">
                    No Live Camera
                  </span>
                )}
                {exam.mic_enabled && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 shadow-sm font-medium">
                    <Mic className="w-3 h-3 text-purple-600" />
                    Audio Integrity Monitored
                  </span>
                )}
                {exam.negative_marking && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 shadow-sm font-medium text-amber-600 dark:text-amber-400">
                    Negative Marking Applicable
                  </span>
                )}
              </div>
            </div>

            {/* Instructions */}
            {exam.instructions && (
              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-700 dark:text-slate-200 block">Candidate Instructions:</span>
                <p className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 leading-relaxed">
                  {exam.instructions}
                </p>
              </div>
            )}

            {/* ACTION SECTION: ADAPTIVE FOR APP INSTALLED vs BROWSER */}
            <div className="space-y-3 pt-2">
              {isStandaloneApp() ? (
                /* App already installed / running inside PWA */
                <div className="space-y-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={handleContinueOnWeb}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(124,58,237,0.35)] transition-all cursor-pointer border-0 outline-none ring-0"
                  >
                    <span>Enter Examination</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Running inside SamayYudh Application</span>
                  </div>
                </div>
              ) : (
                /* Web Browser — Provide Option A (Install App) & Option B (Continue on Web) */
                <>
                  {/* Option A: Install App (Native PWA Banner) */}
                  <PwaInstallBanner examCode={exam.exam_code} />

                  {/* Option B: Continue on Web */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleContinueOnWeb}
                    className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1E293B] dark:hover:bg-[#283548] text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer border-0 outline-none ring-0"
                  >
                    <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>Continue on Web</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60 ml-auto" />
                  </motion.button>
                </>
              )}
            </div>

            {/* Footer reassurance */}
            <div className="text-center pt-1">
              <span className="text-[11px] text-slate-400">
                Your examination progress and state are protected against disconnections.
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
