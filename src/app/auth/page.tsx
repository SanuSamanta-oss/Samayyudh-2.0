'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type AuthMethod = 'email' | 'phone' | null;
type AuthStep = 'choose' | 'input' | 'otp';

export default function AuthPage() {
  const [method, setMethod] = useState<AuthMethod>(null);
  const [step, setStep] = useState<AuthStep>('choose');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSendOTP = useCallback(async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        throw new Error(
          'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
        );
      }

      if (method === 'email') {
        if (!email || !email.includes('@')) {
          throw new Error('Please enter a valid email address.');
        }
        const { error: authError } = await supabase.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: true },
        });
        if (authError) throw authError;
        setSuccess(`OTP sent to ${email}! Check your inbox (and spam folder).`);
      } else {
        if (!phone || phone.replace(/\D/g, '').length < 10) {
          throw new Error('Please enter a valid phone number with country code (e.g., +91...).');
        }
        const { error: authError } = await supabase.auth.signInWithOtp({
          phone,
          options: { shouldCreateUser: true },
        });
        if (authError) throw authError;
        setSuccess(`OTP sent to ${phone}!`);
      }

      setStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [method, email, phone]);

  const handleVerifyOTP = useCallback(async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured.');
      }

      if (otp.length < 6) {
        throw new Error('Please enter the full 6-digit code.');
      }

      let result;
      if (method === 'email') {
        result = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'email',
        });
      } else {
        result = await supabase.auth.verifyOtp({
          phone,
          token: otp,
          type: 'sms',
        });
      }

      if (result.error) throw result.error;

      // Success — redirect to dashboard
      setSuccess('Verified! Redirecting...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [method, email, phone, otp]);

  const handleResendOTP = useCallback(async () => {
    setError(null);
    setOtp('');
    await handleSendOTP();
  }, [handleSendOTP]);

  const handleGoogleLogin = useCallback(async () => {
    setError(null);
    try {
      if (!isSupabaseConfigured) {
        throw new Error(
          'Supabase is not configured. Add your credentials to .env.local first.'
        );
      }
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (authError) throw authError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.');
    }
  }, []);

  const handleBack = () => {
    setError(null);
    setSuccess(null);
    if (step === 'otp') setStep('input');
    else if (step === 'input') { setStep('choose'); setMethod(null); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <motion.div
        className="w-full max-w-sm space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center space-y-2">
          <Link href="/">
            <h1 className="text-4xl font-extrabold text-gradient-brand">সময়যুদ্ধ 2.0</h1>
          </Link>
          <p className="text-sm text-muted">The Battle Between You &amp; The Clock</p>
        </div>

        {/* Supabase Warning */}
        {!isSupabaseConfigured && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-warning-50 border border-warning-500/30 text-sm">
            <AlertCircle className="w-4 h-4 text-warning-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-warning-600">Supabase not configured</p>
              <p className="text-warning-600/80 text-xs mt-0.5">
                Copy <code className="bg-warning-500/10 px-1 rounded">.env.example</code> to{' '}
                <code className="bg-warning-500/10 px-1 rounded">.env.local</code> and add your Supabase URL + Anon Key.
              </p>
            </div>
          </div>
        )}

        {/* Card */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-5">
          {/* Error / Success Messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2 p-3 rounded-lg bg-danger-50 border border-danger-500/30 text-sm"
              >
                <AlertCircle className="w-4 h-4 text-danger-600 mt-0.5 shrink-0" />
                <p className="text-danger-600">{error}</p>
              </motion.div>
            )}
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2 p-3 rounded-lg bg-success-50 border border-success-500/30 text-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                <p className="text-success-600">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {step === 'choose' && (
            <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-lg font-semibold text-center text-foreground">Welcome</h2>
              <p className="text-sm text-muted text-center">Choose how to continue</p>
              <button
                onClick={() => { setMethod('email'); setStep('input'); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-brand-300 hover:bg-brand-50 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">Continue with Email</p>
                  <p className="text-xs text-muted">We&apos;ll send you a verification code</p>
                </div>
              </button>
              <button
                onClick={() => { setMethod('phone'); setStep('input'); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-brand-300 hover:bg-brand-50 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-50 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">Continue with Phone</p>
                  <p className="text-xs text-muted">We&apos;ll send you an SMS code</p>
                </div>
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-surface px-2 text-muted">OR</span></div>
              </div>
              <button
                onClick={handleGoogleLogin}
                className="w-full px-4 py-3 rounded-xl border border-border hover:bg-surface-2 transition-all text-sm font-medium text-foreground text-center"
              >
                Continue with Google
              </button>
            </motion.div>
          )}

          {step === 'input' && (
            <motion.div className="space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <button onClick={handleBack} className="text-xs text-muted hover:text-foreground transition-colors">← Back</button>
              <h2 className="text-lg font-semibold text-foreground">
                {method === 'email' ? 'Enter your email' : 'Enter your phone number'}
              </h2>
              {method === 'email' ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                  autoFocus
                />
              ) : (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 12345 67890"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                  autoFocus
                />
              )}
              <button
                onClick={handleSendOTP}
                disabled={loading || (method === 'email' ? !email : !phone)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
              </button>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div className="space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <button onClick={handleBack} className="text-xs text-muted hover:text-foreground transition-colors">← Back</button>
              <h2 className="text-lg font-semibold text-foreground">Enter verification code</h2>
              <p className="text-sm text-muted">
                Sent to {method === 'email' ? email : phone}
              </p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-center text-2xl font-mono tracking-[0.5em] placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                autoFocus
              />
              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length < 6}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}
              </button>
              <button
                onClick={handleResendOTP}
                disabled={loading}
                className="w-full text-xs text-muted hover:text-brand-600 transition-colors disabled:opacity-50"
              >
                Resend OTP
              </button>
            </motion.div>
          )}
        </div>

        <p className="text-center text-xs text-muted">
          By continuing, you agree to our Terms of Service.
        </p>
      </motion.div>
    </div>
  );
}
