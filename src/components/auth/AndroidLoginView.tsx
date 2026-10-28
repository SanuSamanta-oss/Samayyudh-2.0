'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Mail,
  Phone,
  User,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/AuthProvider';
import { markUserLoggedIn } from '@/lib/auth-welcome';
import { BoredHandLoader } from '@/components/BoredHandLoader';

type AndroidAuthMode = 'email' | 'phone';
type AndroidAuthStep = 'input' | 'verify' | 'name';

interface AndroidLoginViewProps {
  onSwitchToWeb?: () => void;
}

export function AndroidLoginView({ onSwitchToWeb }: AndroidLoginViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  // Mode and state
  const [mode, setMode] = useState<AndroidAuthMode>('email');
  const [step, setStep] = useState<AndroidAuthStep>('input');

  // Input states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [displayName, setDisplayName] = useState('');

  // Status and Bored Hand Loader animation states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [redirectingFinished, setRedirectingFinished] = useState(false);
  const [redirectText, setRedirectText] = useState('AUTHENTICATING...');

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Compute redirect target URL — defaults to landing page with profile hint
  const targetUrl = useMemo(() => {
    const redirectParam = searchParams.get('redirect') || searchParams.get('next');
    const examParam = searchParams.get('exam');
    let url = redirectParam || '/?welcome_hint=true';
    if (examParam && !url.includes('exam=')) {
      url += (url.includes('?') ? '&' : '?') + `exam=${encodeURIComponent(examParam)}`;
    }
    return url;
  }, [searchParams]);

  // If already authenticated on initial mount (e.g. returning session), navigate straight to destination
  const initialAuthRef = useRef(isAuthenticated);
  useEffect(() => {
    if (initialAuthRef.current && isAuthenticated && !authLoading && !redirecting) {
      markUserLoggedIn(user);
      router.replace(targetUrl);
    }
  }, [isAuthenticated, authLoading, user, targetUrl, router, redirecting]);

  // Read error parameter from URL if any
  useEffect(() => {
    const errorParam = searchParams.get('error_description') || searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  // Handle Google OAuth
  const handleGoogleLogin = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured.');
      }
      const supabase = createClient();
      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(targetUrl)}`;
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: callbackUrl },
      });
      if (authError) throw authError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.');
      setLoading(false);
    }
  }, [targetUrl]);

  // Send OTP
  const handleSendOTP = useCallback(async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured. Add credentials to .env.local');
      }

      const supabase = createClient();

      if (mode === 'email') {
        if (!email || !email.includes('@')) {
          throw new Error('Please enter a valid email address.');
        }

        const { error: authError } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: { shouldCreateUser: true },
        });

        if (authError) throw authError;
        setSuccess(`Verification code sent to ${email.trim()}`);
        setStep('verify');
      } else {
        const cleanPhone = phone.trim();
        if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 10) {
          throw new Error('Please enter a valid phone number with country code (e.g. +91...).');
        }

        const { error: authError } = await supabase.auth.signInWithOtp({
          phone: cleanPhone,
          options: { shouldCreateUser: true },
        });

        if (authError) throw authError;
        setSuccess(`SMS code sent to ${cleanPhone}`);
        setStep('verify');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [mode, email, phone]);

  // Verify OTP Code
  const handleVerifyOTP = useCallback(async () => {
    setError(null);
    setLoading(true);
    const token = otpDigits.join('');

    try {
      if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
      if (token.length < 6) throw new Error('Please enter the full 6-digit code.');

      const supabase = createClient();
      let result;

      if (mode === 'email') {
        result = await supabase.auth.verifyOtp({
          email: email.trim(),
          token,
          type: 'email',
        });
      } else {
        result = await supabase.auth.verifyOtp({
          phone: phone.trim(),
          token,
          type: 'sms',
        });
      }

      if (result.error) throw result.error;

      markUserLoggedIn(result.data?.user);

      // Check if new user needs to set their display name
      const hasDisplayName = !!result.data?.user?.user_metadata?.display_name;
      const userName =
        result.data?.user?.user_metadata?.display_name ||
        result.data?.user?.user_metadata?.full_name;

      if (hasDisplayName) {
        // Show Bored Hand tapping loading animation then route to target destination
        setRedirecting(true);
        setTimeout(() => {
          setRedirectingFinished(true);
          setRedirectText(userName ? `WELCOME, ${userName.toUpperCase()}` : 'WELCOME, WARRIOR');
          setTimeout(() => {
            try {
              sessionStorage.setItem('samayyudh_just_logged_in', 'true');
            } catch {}
            router.replace(targetUrl);
          }, 700);
        }, 2200);
      } else {
        setStep('name');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [otpDigits, mode, email, phone, targetUrl, router]);

  // Save Display Name
  const handleSaveName = useCallback(async () => {
    const trimmed = displayName.trim();
    if (!trimmed || trimmed.length < 2) {
      setError('Please enter at least 2 characters.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        data: { display_name: trimmed, has_logged_in: true, animation_shown: true },
      });
      if (updateError) throw updateError;

      markUserLoggedIn();

      // Show Bored Hand tapping loading animation upon completing profile setup
      setRedirecting(true);
      setTimeout(() => {
        setRedirectingFinished(true);
        setRedirectText(`WELCOME, ${trimmed.toUpperCase()}`);
        setTimeout(() => {
          try {
            sessionStorage.setItem('samayyudh_just_logged_in', 'true');
          } catch {}
          router.replace(targetUrl);
        }, 700);
      }, 2200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save name. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [displayName, targetUrl, router]);

  // OTP digit navigation helper
  const handleOtpInput = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="fixed inset-0 h-[100dvh] max-h-[100dvh] w-screen bg-[#FAF9F6] text-slate-900 overflow-hidden overscroll-none select-none font-sans flex flex-col justify-between">
      {/* Full-screen Bored Hand Loading Animation upon login completion */}
      <AnimatePresence>
        {redirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center select-none"
          >
            <BoredHandLoader finished={redirectingFinished} text={redirectText} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOP RIGHT ORGANIC PEACH DECORATION ── */}
      <div
        className="absolute -top-10 -right-10 w-48 h-48 sm:w-64 sm:h-64 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 320 320"
          className="w-full h-full fill-[#F1B496]/85"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M120 0 C220 0, 320 20, 320 120 C 320 220, 240 290, 160 270 C 80 250, 40 180, 20 120 C 0 60, 20 0, 120 0 Z" />
        </svg>
      </div>

      {/* ── BOTTOM LEFT ORGANIC TURQUOISE DECORATION ── */}
      <div
        className="absolute -bottom-10 -left-10 w-48 h-48 sm:w-64 sm:h-64 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 320 320"
          className="w-full h-full fill-[#86C5C0]/85"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 100 C60 40, 140 20, 210 70 C 280 120, 310 190, 280 250 C 250 310, 180 320, 110 320 C 40 320, 0 270, 0 200 Z" />
        </svg>
      </div>

      {/* ── MAIN CONTENT CONTAINER (Locked to 100dvh, zero scrolling, perfectly scaled) ── */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-5 py-3 sm:py-5 h-full flex-1 flex flex-col justify-between items-center overflow-hidden">
        {/* Top Section: App Emblem, Scaled Illustration & Title */}
        <div className="w-full flex flex-col items-center shrink-0">
          {/* Subtle app branding tag */}
          <div className="flex items-center gap-1.5 mb-1 opacity-90">
            <span className="text-xs font-black tracking-tight text-slate-800">সময়যুদ্ধ</span>
            <span className="text-[10px] font-bold text-[#358781] bg-[#E3F2F0] px-1.5 py-0.2 rounded">
              2.0
            </span>
          </div>

          {/* Clean Study Illustration — Viewport-height responsive (shrinks on small phones, zero overflow) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-[240px] h-[18vh] min-h-[105px] max-h-[175px] relative flex items-center justify-center my-0.5 select-none"
          >
            <Image
              src="/illustrations/android-login-illustration-transparent.png"
              alt="Students preparing with SamayYudh"
              width={480}
              height={380}
              className="w-full h-full object-contain drop-shadow-xs"
              priority
            />
          </motion.div>

          {/* Welcome Heading */}
          <div className="text-center mt-1 mb-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              Welcome, Warrior!
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
              Your battle against the clock begins here.
            </p>
          </div>

          {/* Mode Switcher Pills (Email vs Phone) */}
          {step === 'input' && (
            <div className="flex items-center gap-1 p-0.5 rounded-full bg-[#EBF4F3] border border-[#CDE5E2] text-[11px] font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode('email');
                  setError(null);
                }}
                className={`px-3.5 py-1 rounded-full transition-all ${
                  mode === 'email'
                    ? 'bg-white text-[#2C6F6A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Email Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('phone');
                  setError(null);
                }}
                className={`px-3.5 py-1 rounded-full transition-all ${
                  mode === 'phone'
                    ? 'bg-white text-[#2C6F6A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Phone Number
              </button>
            </div>
          )}
        </div>

        {/* Form Inputs & Interactive Section */}
        <div className="w-full space-y-2.5 sm:space-y-3 shrink-0">
          {/* Status Banners */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium"
              >
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="flex-1">{error}</span>
              </motion.div>
            )}
            {success && !error && (
              <motion.div
                key="success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="flex-1">{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* STEP 1: CREDENTIAL INPUTS (Pill fields with circular icons) */}
          {step === 'input' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2 sm:space-y-2.5"
            >
              {mode === 'email' ? (
                <>
                  {/* Email Input Field */}
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E2F2F0] text-[#3A8C86] flex items-center justify-center shrink-0 shadow-2xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        autoComplete="email"
                        className="w-full rounded-full border border-[#BCE1DD] bg-white/95 px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#5CB0A8] focus:ring-2 focus:ring-[#86C5C0]/25 transition-all font-medium text-center shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Primary Button */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSendOTP}
                    className="w-full py-2.5 sm:py-3 rounded-full bg-[#80C2BD] hover:bg-[#6EB5B0] active:scale-[0.98] text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm shadow-[#80C2BD]/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Send Verification Code</span>
                    )}
                  </button>
                </>
              ) : (
                <>
                  {/* Phone Input Field */}
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E2F2F0] text-[#3A8C86] flex items-center justify-center shrink-0 shadow-2xs">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        autoComplete="tel"
                        className="w-full rounded-full border border-[#BCE1DD] bg-white/95 px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#5CB0A8] focus:ring-2 focus:ring-[#86C5C0]/25 transition-all font-medium text-center shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Primary Button for Phone */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSendOTP}
                    className="w-full py-2.5 sm:py-3 rounded-full bg-[#80C2BD] hover:bg-[#6EB5B0] active:scale-[0.98] text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm shadow-[#80C2BD]/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Send SMS Code</span>
                    )}
                  </button>
                </>
              )}
            </motion.div>
          )}

          {/* STEP 2: OTP VERIFICATION CODE */}
          {step === 'verify' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-center">
                <p className="text-xs text-slate-600 font-medium">
                  Enter the 6-digit code sent to:
                </p>
                <p className="text-xs font-bold text-slate-900 mt-0.5 font-mono">
                  {mode === 'email' ? email : phone}
                </p>
              </div>

              {/* 6 Digit Input Row */}
              <div className="flex justify-center gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInput(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-10 h-12 rounded-xl text-center font-mono font-bold text-base text-slate-900 border border-[#BCE1DD] bg-white focus:outline-none focus:border-[#5CB0A8] focus:ring-2 focus:ring-[#86C5C0]/30 transition-all"
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                type="button"
                disabled={loading || otpDigits.join('').length < 6}
                onClick={handleVerifyOTP}
                className="w-full py-3 rounded-full bg-[#80C2BD] hover:bg-[#6EB5B0] active:scale-[0.98] text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm shadow-[#80C2BD]/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify &amp; Continue</span>}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-2">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="hover:text-slate-800 transition-colors"
                >
                  Change {mode === 'email' ? 'email' : 'number'}
                </button>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="text-[#358781] hover:underline"
                >
                  Resend code
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: NEW USER DISPLAY NAME */}
          {step === 'name' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3.5"
            >
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900">Choose your Warrior Name</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  This will be shown on your certificates &amp; exam reports.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#E2F2F0] text-[#3A8C86] flex items-center justify-center shrink-0 shadow-2xs">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Sanu Samanta"
                    autoFocus
                    className="w-full rounded-full border border-[#BCE1DD] bg-white/95 px-5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#5CB0A8] focus:ring-2 focus:ring-[#86C5C0]/25 transition-all font-medium text-center shadow-2xs"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={loading || displayName.trim().length < 2}
                onClick={handleSaveName}
                className="w-full py-3 rounded-full bg-[#80C2BD] hover:bg-[#6EB5B0] active:scale-[0.98] text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm shadow-[#80C2BD]/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Start Your Journey</span>}
              </button>
            </motion.div>
          )}

          {/* Social Divider & Google Button (when on input step) */}
          {step === 'input' && (
            <div className="space-y-2 pt-0.5">
              {/* Centered Or with straight line removed */}
              <div className="flex items-center justify-center py-0.5">
                <span className="text-xs font-semibold text-slate-400 tracking-wider">
                  Or
                </span>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2 sm:py-2.5 px-4 rounded-full border border-[#BCE1DD] bg-white/90 hover:bg-white text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-2xs hover:border-[#6DB5AE] transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer & Secondary Navigation */}
        <div className="w-full pt-1 pb-1 sm:pb-2 text-center space-y-1 select-none shrink-0">
          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 font-medium">
            <span>Don&apos;t have an account?</span>
            <button
              type="button"
              onClick={() => {
                setMode('email');
                setStep('input');
                setError(null);
                setSuccess('Enter your email to create a new warrior account');
              }}
              className="font-bold text-[#2A7570] hover:underline"
            >
              Get Started
            </button>
          </div>

          <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
            By continuing, you agree to our Terms of Service.
          </p>

          {/* Testing / Preview switcher link */}
          {onSwitchToWeb && (
            <div>
              <button
                type="button"
                onClick={onSwitchToWeb}
                className="text-[10px] text-slate-400 hover:text-slate-600 underline"
              >
                Switch to Web View
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
