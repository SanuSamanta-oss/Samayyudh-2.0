'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Users,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { IdentityCard } from '@/components/common/IdentityCard';
import { modalMotionVariants, otpShakeVariants } from '@/lib/motion-presets';

interface GuardianRegistrationModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onCompleted?: (guardianData: any) => void;
  studentLceCode?: string;
}

type Step = 'intro' | 'details' | 'mobile_otp' | 'email_verify' | 'confirmation';

export function GuardianRegistrationModal({
  isOpen,
  onDismiss,
  onCompleted,
  studentLceCode = 'LCE001',
}: GuardianRegistrationModalProps) {
  const [step, setStep] = useState<Step>('intro');
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState<'father' | 'mother' | 'legal_guardian' | 'other'>('father');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');

  // Mobile OTP state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [otpExpired, setOtpExpired] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Email verification state
  const [emailCodeDigits, setEmailCodeDigits] = useState(['', '', '', '', '', '']);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const emailInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Generated codes
  const [assignedGuardianCode, setAssignedGuardianCode] = useState('LCG001');
  const [assignedStudentCode, setAssignedStudentCode] = useState(studentLceCode);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown > 0 && (step === 'mobile_otp' || step === 'email_verify')) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown, step]);

  if (!isOpen) return null;

  // STEP 2 -> STEP 3: SUBMIT DETAILS & DISPATCH MOBILE OTP
  const handleProceedToMobileOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobileNumber.trim() || !emailAddress.trim()) {
      return;
    }

    setOtpLoading(true);
    setOtpError(null);

    const fullMobile = `${countryCode}${mobileNumber.trim()}`;

    try {
      const res = await fetch('/api/guardian/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', mobile: fullMobile }),
      });

      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error || 'Failed to dispatch verification code');
      } else {
        setResendCooldown(60);
        setStep('mobile_otp');
        setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
      }
    } catch {
      setOtpError('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // STEP 3: HANDLE 6-DIGIT OTP DIGIT PROGRESSION
  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    setOtpError(null);

    // Auto advance
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newDigits = [...otpDigits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);
    if (pasted.length === 6) {
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleVerifyMobileOtp = async () => {
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setOtpError('Please enter all 6 digits of the code.');
      return;
    }

    setOtpLoading(true);
    setOtpError(null);

    const fullMobile = `${countryCode}${mobileNumber.trim()}`;

    try {
      const res = await fetch('/api/guardian/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', mobile: fullMobile, otp: fullOtp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error || 'Invalid verification code');
      } else {
        setMobileVerified(true);
        // Automatically dispatch email verification code
        await fetch('/api/guardian/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'send', email: emailAddress }),
        }).catch(() => {});

        setStep('email_verify');
        setTimeout(() => emailInputRefs.current[0]?.focus(), 150);
      }
    } catch {
      setOtpError('Verification failed. Check network.');
    } finally {
      setOtpLoading(false);
    }
  };

  // STEP 4: VERIFY EMAIL
  const handleVerifyEmailCode = async () => {
    const code = emailCodeDigits.join('');
    if (code.length !== 6) {
      setEmailError('Please enter the 6-digit email code.');
      return;
    }

    setEmailLoading(true);
    setEmailError(null);

    try {
      const res = await fetch('/api/guardian/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email: emailAddress, code }),
      });

      const data = await res.json();
      if (!res.ok) {
        setEmailError(data.error || 'Invalid email code');
      } else {
        setEmailVerified(true);
        // Finalize registration with backend
        const onboardRes = await fetch('/api/guardian/onboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName,
            relationship,
            mobile: `${countryCode}${mobileNumber.trim()}`,
            email: emailAddress.trim(),
            mobileVerified: true,
            emailVerified: true,
          }),
        });

        const onboardData = await onboardRes.json();
        if (onboardData.guardian_code) {
          setAssignedGuardianCode(onboardData.guardian_code);
        }
        if (onboardData.student_lce_code) {
          setAssignedStudentCode(onboardData.student_lce_code);
        }

        setStep('confirmation');
      }
    } catch {
      setEmailError('Failed to complete email verification.');
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step === 'confirmation' ? onDismiss : undefined}
          className="fixed inset-0 bg-black/65 backdrop-blur-md"
        />

        {/* Modal Window (14-22px corner radii, low contrast borders, zero harsh outlines) */}
        <motion.div
          variants={modalMotionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative w-full max-w-[460px] bg-white dark:bg-[#171B24] rounded-[28px] p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-neutral-200/60 dark:border-white/10 z-10 my-auto text-left outline-none"
        >
          {/* STEP 1: INTRODUCTION */}
          {step === 'intro' && (
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-[22px] bg-brand-50 dark:bg-[#1D2330] flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 shadow-sm border border-neutral-200/50 dark:border-white/5">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mb-2">
                <Users className="w-3.5 h-3.5" /> Guardian Connect Ecosystem
              </span>

              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-[#F3F5FA] tracking-tight">
                Connect Your Guardian
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-neutral-500 dark:text-[#A1A9B8] leading-relaxed max-w-sm">
                Connect a parent or trusted guardian to receive examination updates and access authorized live supervision during active tests.
              </p>

              {/* Transparency Notice Box */}
              <div className="w-full mt-5 p-4 rounded-2xl bg-neutral-50 dark:bg-[#1D2330] border border-neutral-200/40 dark:border-white/5 text-left space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Receive instant start, submit, and completion notifications.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Authorized read-only live camera stream during examination sessions.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-500 dark:text-[#737D8E]">
                  <Lock className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <span>Zero desktop surveillance. Guardians never see answers or other browser tabs.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-full mt-6 py-3 px-5 rounded-2xl bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer border-0 outline-none"
              >
                <span>Continue to Guardian Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: GUARDIAN DETAILS */}
          {step === 'details' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setStep('intro')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <span className="text-[11px] font-mono text-neutral-400">Step 2 of 5</span>
              </div>

              <h3 className="text-lg font-bold text-neutral-900 dark:text-[#F3F5FA]">
                Guardian Information
              </h3>
              <p className="text-xs text-neutral-500 dark:text-[#A1A9B8] mt-1 mb-5">
                Provide contact coordinates for your primary parent or legal guardian.
              </p>

              <form onSubmit={handleProceedToMobileOtp} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Guardian Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#1D2330] border border-neutral-200/60 dark:border-white/10 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </div>

                {/* Relationship */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Relationship
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#1D2330] border border-neutral-200/60 dark:border-white/10 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer"
                  >
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="legal_guardian">Legal Guardian</option>
                    <option value="other">Other Relative</option>
                  </select>
                </div>

                {/* Mobile Number with Country Code */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Mobile Number (for SMS &amp; OTP Alerts)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-16 px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#1D2330] border border-neutral-200/60 dark:border-white/10 text-xs font-mono text-center text-neutral-900 dark:text-white focus:outline-none"
                    />
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#1D2330] border border-neutral-200/60 dark:border-white/10 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Email Address (for Reports &amp; Live Passes)
                  </label>
                  <input
                    type="email"
                    required
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="guardian@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#1D2330] border border-neutral-200/60 dark:border-white/10 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </div>

                {otpError && (
                  <p className="text-xs text-rose-500 flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> {otpError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={otpLoading}
                  className="w-full mt-2 py-3 px-5 rounded-2xl bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer border-0 outline-none"
                >
                  {otpLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send Mobile Verification OTP</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: MOBILE OTP VERIFICATION */}
          {step === 'mobile_otp' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <span className="text-[11px] font-mono text-neutral-400">Step 3 of 5</span>
              </div>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-[#F3F5FA]">
                  Verify Guardian Mobile
                </h3>
                <p className="text-xs text-neutral-500 dark:text-[#A1A9B8] mt-1 max-w-xs mx-auto">
                  Enter the 6-digit verification code dispatched to{' '}
                  <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                    {countryCode} {mobileNumber}
                  </span>
                </p>
              </div>

              {/* 6-Digit Individual Inputs */}
              <div
                className="flex items-center justify-center gap-2.5 sm:gap-3 mb-5"
                onPaste={handleOtpPaste}
              >
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpInputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg font-bold font-mono rounded-xl bg-neutral-100 dark:bg-[#1D2330] border border-neutral-200/60 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-xs text-rose-500 text-center flex items-center justify-center gap-1.5 font-medium mb-4">
                  <AlertCircle className="w-3.5 h-3.5" /> {otpError}
                </p>
              )}

              <button
                type="button"
                onClick={handleVerifyMobileOtp}
                disabled={otpLoading || otpDigits.join('').length !== 6}
                className="w-full py-3 px-5 rounded-2xl bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border-0 outline-none"
              >
                {otpLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Verify Mobile Number</span>
                )}
              </button>

              <div className="text-center mt-4">
                {resendCooldown > 0 ? (
                  <span className="text-xs text-neutral-400">
                    Resend code in <strong className="font-mono">{resendCooldown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleProceedToMobileOtp}
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                  >
                    Resend OTP Code
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: EMAIL VERIFICATION */}
          {step === 'email_verify' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mobile Verified
                </span>
                <span className="text-[11px] font-mono text-neutral-400">Step 4 of 5</span>
              </div>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-[#F3F5FA]">
                  Verify Guardian Email
                </h3>
                <p className="text-xs text-neutral-500 dark:text-[#A1A9B8] mt-1 max-w-xs mx-auto">
                  Enter the 6-digit email confirmation code dispatched to{' '}
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {emailAddress}
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-5">
                {emailCodeDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { emailInputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      if (!/^[0-9]?$/.test(e.target.value)) return;
                      const next = [...emailCodeDigits];
                      next[idx] = e.target.value;
                      setEmailCodeDigits(next);
                      if (e.target.value && idx < 5) emailInputRefs.current[idx + 1]?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !emailCodeDigits[idx] && idx > 0) {
                        emailInputRefs.current[idx - 1]?.focus();
                      }
                    }}
                    className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg font-bold font-mono rounded-xl bg-neutral-100 dark:bg-[#1D2330] border border-neutral-200/60 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                ))}
              </div>

              {emailError && (
                <p className="text-xs text-rose-500 text-center flex items-center justify-center gap-1.5 font-medium mb-4">
                  <AlertCircle className="w-3.5 h-3.5" /> {emailError}
                </p>
              )}

              <button
                type="button"
                onClick={handleVerifyEmailCode}
                disabled={emailLoading || emailCodeDigits.join('').length !== 6}
                className="w-full py-3 px-5 rounded-2xl bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border-0 outline-none"
              >
                {emailLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Verify Email &amp; Finish</span>
                )}
              </button>
            </div>
          )}

          {/* STEP 5: CONFIRMATION */}
          {step === 'confirmation' && (
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-[24px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 shadow-sm border border-emerald-200/40 dark:border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Guardian Successfully Linked
              </span>

              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-[#F3F5FA] tracking-tight">
                Guardian Verified &amp; Connected
              </h2>

              <p className="mt-1 text-xs text-neutral-500 dark:text-[#A1A9B8] max-w-sm">
                Your guardian has been verified and issued permanent academic identification credentials.
              </p>

              {/* Identity Cards Display */}
              <div className="w-full space-y-3 my-5 text-left">
                <IdentityCard
                  code={assignedGuardianCode}
                  entityType="guardian"
                  name={fullName}
                  sublabel={`${relationship.toUpperCase()} • ${countryCode} ${mobileNumber}`}
                  verified={true}
                />
                <IdentityCard
                  code={assignedStudentCode}
                  entityType="student"
                  name="Student Examinee"
                  sublabel="Primary Examinee Identity"
                  verified={true}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  onDismiss();
                  onCompleted?.({ guardianCode: assignedGuardianCode, studentCode: assignedStudentCode });
                }}
                className="w-full py-3 px-5 rounded-2xl bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-sm cursor-pointer border-0 outline-none"
              >
                Complete &amp; Return to Exam Hub
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
