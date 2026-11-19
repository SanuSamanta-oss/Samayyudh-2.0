'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  ServerCrash,
  UserCheck,
  User,
  GraduationCap,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BiometricScanAnimation } from '@/components/auth/BiometricScanAnimation';
import type { CommandRole } from '@/types/admin';

interface PasskeyGatewayProps {
  role: CommandRole;
  accountStatus: 'active' | 'suspended' | 'archived';
  passkeyConfigured: boolean;
  userEmail: string | null;
  fullName: string | null;
  publicId: string | null;
  isTeacherVerified?: boolean;
  teacherVerificationStatus?: 'verified' | 'pending' | 'unverified';
  onUnlocked: () => void;
  onRoleChanged?: () => void;
}

export function PasskeyGateway({
  role: initialRole,
  accountStatus,
  passkeyConfigured,
  userEmail,
  fullName,
  publicId,
  isTeacherVerified = false,
  teacherVerificationStatus = 'unverified',
  onUnlocked,
  onRoleChanged,
}: PasskeyGatewayProps) {
  const router = useRouter();
  const prefersReduced = useReducedMotion();

  const [currentRole, setCurrentRole] = useState<CommandRole>(initialRole);
  const [resolvedName, setResolvedName] = useState<string>(fullName || '');

  // Synchronize custom display name from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('samayyudh:display_name');
      if (savedName) setResolvedName(savedName);
    }
  }, [fullName]);

  const [gatewayTab, setGatewayTab] = useState<'verify' | 'passkey'>(
    initialRole === 'teacher' && !isTeacherVerified ? 'verify' : 'passkey'
  );
  const [passkey, setPasskey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [lockedUntil, setLockedUntil] = useState<string | null>(null);
  const [unlockedSuccess, setUnlockedSuccess] = useState(false);

  const isStudent = currentRole === 'student';

  async function handleSwitchToStudent() {
    if (switchingRole) return;
    setSwitchingRole(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'student' }),
      });
      if (res.ok) {
        setCurrentRole('student');
        if (onRoleChanged) onRoleChanged();
      } else {
        setError('Failed to switch to student role.');
      }
    } catch {
      setError('Network error while switching role.');
    } finally {
      setSwitchingRole(false);
    }
  }

  async function handleSwitchToTeacher() {
    if (switchingRole) return;
    setSwitchingRole(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'teacher' }),
      });
      if (res.ok) {
        setCurrentRole('teacher');
        setGatewayTab('verify');
        if (onRoleChanged) onRoleChanged();
      } else {
        setError('Failed to request teacher role.');
      }
    } catch {
      setError('Network error while requesting teacher role.');
    } finally {
      setSwitchingRole(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!passkey.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        remainingAttempts?: number;
        lockedUntil?: string;
        success?: boolean;
      };

      if (!res.ok) {
        setError(data.error || 'Verification failed.');
        if (typeof data.remainingAttempts === 'number') setRemaining(data.remainingAttempts);
        if (data.lockedUntil) setLockedUntil(data.lockedUntil);
        setSubmitting(false);
        return;
      }

      setUnlockedSuccess(true);
      setPasskey('');
      setTimeout(() => {
        onUnlocked();
      }, prefersReduced ? 100 : 700);
    } catch {
      setError('Network error while verifying command passkey.');
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F7F8FC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-8 transition-colors">
      {/* Top Bar Navigation */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 hover:bg-white dark:bg-[#111A2E]/90 dark:hover:bg-[#18233C] text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 transition-all shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] active:scale-95 outline-none"
        >
          <ArrowLeft className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Back to Student Workspace</span>
        </Link>

        <ThemeToggle />
      </div>

      {/* Centered Gateway Card Container */}
      <div className="w-full max-w-[460px] mx-auto my-6 sm:my-8">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="rounded-[32px] bg-white dark:bg-[#111A2E] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(109,40,217,0.12)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-slate-200/60 dark:border-white/[0.08] overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {submitting || unlockedSuccess ? (
              /* BIOMETRIC SCANNER ANIMATION DURING VERIFICATION */
              <motion.div
                key="biometric"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="py-4"
              >
                <BiometricScanAnimation
                  status={unlockedSuccess ? 'success' : 'scanning'}
                  size={160}
                  label={unlockedSuccess ? 'Access Granted' : 'Verifying Biometric Passkey...'}
                  sublabel={
                    unlockedSuccess
                      ? 'Decrypting command session tokens...'
                      : 'Validating credentials with secure server enclave'
                  }
                />
              </motion.div>
            ) : isStudent ? (
              /* ============================================================ */
              /* 1. STUDENT DISABLED VIEW WITH SMOOTH SLIDE TRANSITION        */
              /* ============================================================ */
              <motion.div
                key="student-disabled"
                initial={prefersReduced ? false : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 shadow-sm border border-amber-200/60 dark:border-amber-500/20">
                  <Lock className="w-8 h-8" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 dark:bg-amber-950/60 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-2.5">
                  <span>Admin Section Disabled for Students</span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Student Account Active
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                  The Faculty &amp; Administrative Command Center is strictly restricted to verified educators. Your exam battles, practice PYQs, and rank leaderboards are in your student workspace.
                </p>

                {/* Account Identity Badge */}
                <div className="w-full mt-5 rounded-2xl bg-slate-50 dark:bg-[#162032] p-3.5 flex items-center justify-between text-left border border-slate-200/60 dark:border-white/5">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {resolvedName || fullName || 'Student Warrior'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {userEmail || publicId || 'Session active'}
                    </p>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100/80 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-300/40 dark:border-amber-600/30">
                    Student
                  </span>
                </div>

                <div className="w-full mt-6 space-y-3">
                  <Link
                    href="/dashboard"
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm tracking-tight transition-all duration-200 shadow-[0_10px_25px_-5px_rgba(109,40,217,0.45)] hover:shadow-[0_14px_30px_-5px_rgba(109,40,217,0.55)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border-0 outline-none"
                  >
                    <span>Go to Student Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleSwitchToTeacher}
                    disabled={switchingRole}
                    className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-50 dark:bg-[#162032] dark:hover:bg-[#1D2B44] text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all duration-200 border border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center gap-2 cursor-pointer outline-none active:scale-[0.98]"
                  >
                    <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>{switchingRole ? 'Switching...' : 'I am a Teacher (Verify Credentials)'}</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ============================================================ */
              /* 2. TEACHER / ADMIN ACCESS GATEWAY VIEW                       */
              /* ============================================================ */
              <motion.div
                key="teacher-gateway"
                initial={prefersReduced ? false : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Brand Top Header */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#EAE6F5] dark:bg-[#231B3E] text-[#6D28D9] dark:text-[#C4B5FD] flex items-center justify-center mb-3 shadow-xs border border-purple-200/50 dark:border-purple-500/20">
                    <ShieldCheck className="w-7 h-7" />
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#162032] text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 border border-slate-200/60 dark:border-white/5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>SamayYudh 2.0 Command Center</span>
                  </div>

                  <h1 className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Teacher &amp; Admin Access
                  </h1>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                    Authenticate your educator credentials to unlock classrooms, assignments, and test composition.
                  </p>
                </div>

                {/* User Account Info Card */}
                <div className="mt-5 rounded-2xl bg-slate-50 dark:bg-[#162032] p-3.5 flex items-center justify-between gap-3 border border-slate-200/60 dark:border-white/5">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {resolvedName || fullName || 'Educator Account'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {userEmail || publicId || 'Session active'}
                    </p>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold capitalize bg-[#EAE6F5] text-[#6D28D9] dark:bg-[#231B3E] dark:text-[#C4B5FD] border border-purple-200/60 dark:border-purple-500/20">
                    {currentRole.replace('_', ' ')}
                    {!isTeacherVerified && currentRole === 'teacher' && ' (Pending)'}
                  </span>
                </div>

                {/* SILKY SMOOTH SLIDING PILL TAB SELECTOR (Spring layoutId Animation) */}
                {currentRole === 'teacher' && (
                  <div className="relative flex items-center p-1.5 rounded-2xl bg-slate-100/90 dark:bg-[#0D1527] border border-slate-200/80 dark:border-white/10 mt-5 shadow-xs overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setGatewayTab('verify')}
                      className={`relative z-10 flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-200 cursor-pointer border-0 outline-none flex items-center justify-center gap-1.5 ${
                        gatewayTab === 'verify'
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      {gatewayTab === 'verify' && (
                        <motion.div
                          layoutId="active-gateway-tab-pill"
                          className="absolute inset-0 rounded-xl bg-white dark:bg-[#1E293B] shadow-[0_2px_10px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-white/15 -z-10"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}
                      <UserCheck
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          gatewayTab === 'verify' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'
                        }`}
                      />
                      <span>Verify as Teacher</span>
                      {!isTeacherVerified && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] shrink-0 animate-pulse" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setGatewayTab('passkey')}
                      className={`relative z-10 flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-200 cursor-pointer border-0 outline-none flex items-center justify-center gap-1.5 ${
                        gatewayTab === 'passkey'
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      {gatewayTab === 'passkey' && (
                        <motion.div
                          layoutId="active-gateway-tab-pill"
                          className="absolute inset-0 rounded-xl bg-white dark:bg-[#1E293B] shadow-[0_2px_10px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-white/15 -z-10"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}
                      <KeyRound
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          gatewayTab === 'passkey' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'
                        }`}
                      />
                      <span>Command Passkey</span>
                    </button>
                  </div>
                )}

                {/* HORIZONTAL SLIDING CONTENT TRANSITION */}
                <div className="overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    {gatewayTab === 'verify' && currentRole === 'teacher' ? (
                      /* TAB 1: VERIFY AS TEACHER */
                      <motion.div
                        key="verify-tab"
                        initial={prefersReduced ? false : { opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 18 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-5 space-y-4"
                      >
                        {/* Verification Benefits Card */}
                        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-500/20 text-left space-y-2.5">
                          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>Instant automated institutional email check (.ac.in, .edu, universities)</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>Alternative Google Classroom &amp; Faculty directory verification</span>
                          </div>
                        </div>

                        {/* PROPER PRIMARY BUTTON: Open Teacher Verification Center */}
                        <button
                          type="button"
                          onClick={() => router.push('/teacher/verify')}
                          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-tight transition-all duration-200 shadow-[0_10px_25px_-5px_rgba(245,158,11,0.4)] hover:shadow-[0_14px_30px_-5px_rgba(245,158,11,0.5)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border-0 outline-none"
                        >
                          <span>Open Teacher Verification Center</span>
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        {/* PROPER SECONDARY BUTTON: I am a student */}
                        <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 text-center">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                            Selected Teacher by mistake or decided to continue as student?
                          </p>
                          <button
                            type="button"
                            onClick={handleSwitchToStudent}
                            disabled={switchingRole}
                            className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-50 dark:bg-[#162032] dark:hover:bg-[#1D2B44] text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all duration-200 border border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center gap-2 cursor-pointer outline-none active:scale-[0.98]"
                          >
                            <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            <span>{switchingRole ? 'Updating role...' : 'I am a student (Disable Admin Section)'}</span>
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      /* TAB 2: COMMAND PASSKEY */
                      <motion.div
                        key="passkey-tab"
                        initial={prefersReduced ? false : { opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -18 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-5 space-y-4"
                      >
                        {accountStatus !== 'active' ? (
                          <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 p-4 flex items-start gap-3 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-500/20">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-semibold">Account Restricted</p>
                              <p className="mt-1 text-xs opacity-90">
                                This account is marked as {accountStatus}. Contact a Super Admin to restore access.
                              </p>
                            </div>
                          </div>
                        ) : !passkeyConfigured ? (
                          <div className="rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 p-4 flex items-start gap-3 text-indigo-900 dark:text-indigo-200 border border-indigo-200/60 dark:border-indigo-500/20">
                            <ServerCrash className="w-5 h-5 shrink-0 mt-0.5" />
                            <div className="text-xs leading-relaxed">
                              <p className="font-semibold text-sm">Server Passkey Setup Required</p>
                              <p className="mt-1">
                                Add <code className="px-1.5 py-0.5 rounded bg-white/80 dark:bg-[#0B1120] font-mono">ADMIN_COMMAND_PASSKEY</code> in your server environment variables, then restart or redeploy.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                              <label
                                htmlFor="cmd-passkey-input"
                                className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2"
                              >
                                Command Passkey
                              </label>
                              <div className="relative flex items-center">
                                <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                                <input
                                  id="cmd-passkey-input"
                                  type={showKey ? 'text' : 'password'}
                                  value={passkey}
                                  onChange={(e) => setPasskey(e.target.value)}
                                  placeholder="Enter command passkey"
                                  autoComplete="current-password"
                                  autoFocus
                                  disabled={submitting || unlockedSuccess}
                                  className="w-full rounded-2xl bg-slate-100/90 dark:bg-[#162032] focus:bg-white dark:focus:bg-[#19263F] border border-slate-200/80 dark:border-white/10 pl-11 pr-12 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:outline-none focus:shadow-[0_8px_24px_-6px_rgba(109,40,217,0.28)] transition-all"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowKey((v) => !v)}
                                  aria-label={showKey ? 'Hide passkey' : 'Show passkey'}
                                  className="absolute right-3 p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer outline-none focus:outline-none"
                                >
                                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            {error && (
                              <motion.div
                                initial={prefersReduced ? false : { opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5 border border-rose-200/60 dark:border-rose-500/20"
                              >
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-semibold">{error}</p>
                                  {lockedUntil && (
                                    <p className="mt-0.5 opacity-80">
                                      Lockout expires at {new Date(lockedUntil).toLocaleTimeString()}
                                    </p>
                                  )}
                                  {remaining !== null && remaining > 0 && !lockedUntil && (
                                    <p className="mt-0.5 opacity-80">
                                      {remaining} attempt{remaining === 1 ? '' : 's'} left before 15-minute cooldown.
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            )}

                            <button
                              type="submit"
                              disabled={submitting || !passkey.trim() || unlockedSuccess}
                              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm tracking-tight transition-all duration-200 shadow-[0_10px_25px_-5px_rgba(109,40,217,0.45)] hover:shadow-[0_14px_30px_-5px_rgba(109,40,217,0.55)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border-0 outline-none"
                            >
                              <span>Unlock Command Center</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>

                            {/* Switch to Student Action */}
                            <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 text-center">
                              <button
                                type="button"
                                onClick={handleSwitchToStudent}
                                disabled={switchingRole}
                                className="w-full py-3 px-5 rounded-2xl bg-white hover:bg-slate-50 dark:bg-[#162032] dark:hover:bg-[#1D2B44] text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all duration-200 border border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center gap-2 cursor-pointer outline-none active:scale-[0.98]"
                              >
                                <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                <span>{switchingRole ? 'Updating role...' : 'I am a student (Disable Admin Section)'}</span>
                              </button>
                            </div>
                          </form>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Footer Security Note */}
      <div className="max-w-5xl w-full mx-auto text-center text-xs text-slate-400 dark:text-slate-500">
        HTTP-Only Signed Command Sessions · Rate-Limited Passkey Verification · Audit Logged
      </div>
    </div>
  );
}
