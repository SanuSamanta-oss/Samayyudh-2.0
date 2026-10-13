'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, ArrowRight, Loader2, AlertCircle,
  CheckCircle2, User, Sparkles
} from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { BoredHandLoader } from '@/components/BoredHandLoader';

type AuthMethod = 'email' | 'phone' | null;
type AuthStep = 'choose' | 'input' | 'otp' | 'name';

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 24 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -24 }),
};

export default function AuthPage() {
  const router = useRouter();
  const [method, setMethod] = useState<AuthMethod>(null);
  const [step, setStep] = useState<AuthStep>('choose');
  const [direction, setDirection] = useState(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [redirectingFinished, setRedirectingFinished] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);

  // Sync otpDigits → otp string
  useEffect(() => {
    setOtp(otpDigits.join(''));
  }, [otpDigits]);

  const goTo = useCallback((next: AuthStep, dir = 1) => {
    setDirection(dir);
    setError(null);
    setSuccess(null);
    setStep(next);
  }, []);

  const handleSendOTP = useCallback(async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured. Add credentials to .env.local');
      }
      if (method === 'email') {
        if (!email || !email.includes('@')) throw new Error('Please enter a valid email address.');
        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: true },
        });
        if (authError) throw authError;
        setSuccess(`OTP sent to ${email}! Check your inbox.`);
      } else {
        if (!phone || phone.replace(/\D/g, '').length < 10) {
          throw new Error('Please enter a valid phone number with country code (e.g., +91...).');
        }
        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithOtp({
          phone,
          options: { shouldCreateUser: true },
        });
        if (authError) throw authError;
        setSuccess(`OTP sent to ${phone}!`);
      }
      goTo('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [method, email, phone, goTo]);

  const handleVerifyOTP = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
      if (otp.length < 6) throw new Error('Please enter the full 6-digit code.');
      const supabase = createClient();
      let result;
      if (method === 'email') {
        result = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
      } else {
        result = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
      }
      if (result.error) throw result.error;

      // Check if user already has a display name
      const existingName = result.data?.user?.user_metadata?.display_name;
      if (existingName) {
        setRedirecting(true);
        setTimeout(() => {
          setRedirectingFinished(true);
          setTimeout(() => router.push('/dashboard'), 500);
        }, 1400);
      } else {
        goTo('name');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [method, email, phone, otp, router, goTo]);

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
        data: { display_name: trimmed },
      });
      if (updateError) throw updateError;
      setRedirecting(true);
      setTimeout(() => {
        setRedirectingFinished(true);
        setTimeout(() => router.push('/dashboard'), 500);
      }, 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save name. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [displayName, router]);

  const handleGoogleLogin = useCallback(async () => {
    setError(null);
    setLoading(true);
    setRedirecting(true);
    try {
      if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (authError) throw authError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.');
      setLoading(false);
      setRedirecting(false);
    }
  }, []);

  const handleOtpDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <>
      {/* Full-screen redirect overlay */}
      <AnimatePresence>
        {redirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none"
          >
            <BoredHandLoader finished={redirectingFinished} text="AUTHENTICATING..." />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
        {/* Ambient glow blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent-500/10 blur-3xl" />
        </div>

        <motion.div
          className="relative w-full max-w-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Logo */}
          <div className="text-center mb-8 space-y-1">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-extrabold text-gradient-brand">সময়যুদ্ধ 2.0</h1>
            </Link>
            <p className="text-sm text-muted">The Battle Between You &amp; The Clock</p>
          </div>

          {/* Supabase Warning */}
          {!isSupabaseConfigured && (
            <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-warning-50 border border-warning-500/30 text-sm">
              <AlertCircle className="w-4 h-4 text-warning-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-warning-600">Supabase not configured</p>
                <p className="text-warning-600/80 text-xs mt-0.5">
                  Copy <code className="bg-warning-500/10 px-1 rounded">.env.example</code> to{' '}
                  <code className="bg-warning-500/10 px-1 rounded">.env.local</code> and add your credentials.
                </p>
              </div>
            </div>
          )}

          {/* Card */}
          <div className="bg-card rounded-2xl border border-border shadow-xl shadow-black/5 overflow-hidden">
            {/* Step progress bar */}
            <div className="h-0.5 bg-border">
              <motion.div
                className="h-full bg-gradient-brand"
                animate={{
                  width: step === 'choose' ? '0%' : step === 'input' ? '33%' : step === 'otp' ? '66%' : '100%',
                }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <div className="p-6 space-y-5">
              {/* Error / Success */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2 p-3 rounded-lg bg-danger-50 border border-danger-500/20 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 text-danger-600 mt-0.5 shrink-0" />
                    <p className="text-danger-600">{error}</p>
                  </motion.div>
                )}
                {success && !error && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2 p-3 rounded-lg bg-success-50 border border-success-500/20 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                    <p className="text-success-600">{success}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step content */}
              <AnimatePresence mode="wait" custom={direction}>
                {/* ── CHOOSE ── */}
                {step === 'choose' && (
                  <motion.div
                    key="choose"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="space-y-3"
                  >
                    <div className="text-center space-y-1 pb-1">
                      <h2 className="text-lg font-bold text-foreground">Welcome, warrior! ⚔️</h2>
                      <p className="text-sm text-muted">Choose how you want to continue</p>
                    </div>

                    <button
                      id="auth-email-btn"
                      onClick={() => { setMethod('email'); goTo('input'); }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-border hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-50/5 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-100/10 flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">Continue with Email</p>
                        <p className="text-xs text-muted">We&apos;ll send you a verification code</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <button
                      id="auth-phone-btn"
                      onClick={() => { setMethod('phone'); goTo('input'); }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-border hover:border-accent-400 hover:bg-accent-50 dark:hover:bg-accent-50/5 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-100/10 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-accent-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">Continue with Phone</p>
                        <p className="text-xs text-muted">We&apos;ll send you an SMS code</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-card px-2 text-muted">or</span>
                      </div>
                    </div>

                    <button
                      id="auth-google-btn"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border hover:bg-surface transition-all text-sm font-semibold text-foreground disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                      )}
                      Continue with Google
                    </button>
                  </motion.div>
                )}

                {/* ── INPUT ── */}
                {step === 'input' && (
                  <motion.div
                    key="input"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="space-y-4"
                  >
                    <button onClick={() => goTo('choose', -1)} className="text-xs text-muted hover:text-foreground transition-colors flex items-center gap-1">
                      ← Back
                    </button>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">
                        {method === 'email' ? 'Enter your email' : 'Enter your phone'}
                      </h2>
                      <p className="text-sm text-muted mt-0.5">We&apos;ll send a 6-digit code</p>
                    </div>
                    {method === 'email' ? (
                      <input
                        id="auth-email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"
                        autoFocus
                      />
                    ) : (
                      <input
                        id="auth-phone-input"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"
                        autoFocus
                      />
                    )}
                    <button
                      id="auth-send-otp-btn"
                      onClick={handleSendOTP}
                      disabled={loading || (method === 'email' ? !email : !phone)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </motion.div>
                )}

                {/* ── OTP ── */}
                {step === 'otp' && (
                  <motion.div
                    key="otp"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="space-y-4"
                  >
                    <button onClick={() => goTo('input', -1)} className="text-xs text-muted hover:text-foreground transition-colors">
                      ← Back
                    </button>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Enter verification code</h2>
                      <p className="text-sm text-muted mt-0.5">
                        Sent to{' '}
                        <span className="text-foreground font-medium">{method === 'email' ? email : phone}</span>
                      </p>
                    </div>

                    {/* 6-box OTP input */}
                    <div className="flex gap-2 justify-between">
                      {otpDigits.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { otpRefs.current[i] = el; }}
                          id={`otp-digit-${i}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigit(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className="w-11 h-13 flex-1 aspect-square text-center text-xl font-bold rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all caret-transparent"
                          autoFocus={i === 0}
                        />
                      ))}
                    </div>

                    <button
                      id="auth-verify-otp-btn"
                      onClick={handleVerifyOTP}
                      disabled={loading || otp.length < 6}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}
                    </button>

                    <button
                      onClick={async () => { setOtpDigits(['', '', '', '', '', '']); await handleSendOTP(); }}
                      disabled={loading}
                      className="w-full text-xs text-muted hover:text-brand-600 transition-colors disabled:opacity-50"
                    >
                      Didn&apos;t receive it? Resend OTP
                    </button>
                  </motion.div>
                )}

                {/* ── NAME ── */}
                {step === 'name' && (
                  <motion.div
                    key="name"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="space-y-5"
                  >
                    {/* Celebration header */}
                    <div className="text-center space-y-2 py-2">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center mx-auto shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-foreground">Account created! 🎉</h2>
                      <p className="text-sm text-muted">What should we call you, warrior?</p>
                    </div>

                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        id="auth-name-input"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        placeholder="Enter your name"
                        maxLength={40}
                        className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"
                        autoFocus
                      />
                    </div>

                    <button
                      id="auth-save-name-btn"
                      onClick={handleSaveName}
                      disabled={loading || displayName.trim().length < 2}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Let&apos;s go! <ArrowRight className="w-4 h-4" /></>}
                    </button>

                    <p className="text-center text-xs text-muted">
                      You can change this anytime in your profile.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            By continuing, you agree to our Terms of Service.
          </p>
        </motion.div>
      </div>
    </>
  );
}
