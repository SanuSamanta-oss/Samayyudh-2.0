'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  ServerCrash,
  Loader2,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { CommandRole } from '@/types/admin';

interface PasskeyGatewayProps {
  role: CommandRole;
  accountStatus: 'active' | 'suspended' | 'archived';
  passkeyConfigured: boolean;
  userEmail: string | null;
  fullName: string | null;
  publicId: string | null;
  onUnlocked: () => void;
}

export function PasskeyGateway({
  role,
  accountStatus,
  passkeyConfigured,
  userEmail,
  fullName,
  publicId,
  onUnlocked,
}: PasskeyGatewayProps) {
  const prefersReduced = useReducedMotion();
  const [passkey, setPasskey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [lockedUntil, setLockedUntil] = useState<string | null>(null);
  const [unlockedSuccess, setUnlockedSuccess] = useState(false);

  const isPrivileged = role === 'super_admin' || role === 'admin' || role === 'teacher';

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
      }, prefersReduced ? 50 : 380);
    } catch {
      setError('Network error while verifying command passkey.');
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F7F6FC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-8 transition-colors">
      {/* Top minimal bar */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-[#111A2E] text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-[#EAE6F5] dark:hover:bg-[#18233C] transition-colors shadow-[0_2px_12px_-4px_rgba(88,28,135,0.08)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Workspace</span>
        </Link>

        <ThemeToggle />
      </div>

      {/* Centered Gateway Card */}
      <div className="w-full max-w-md mx-auto my-8">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="rounded-3xl bg-white dark:bg-[#111A2E] p-7 sm:p-9 shadow-[0_20px_60px_-15px_rgba(109,40,217,0.14)] dark:shadow-[0_24px_64px_-15px_rgba(0,0,0,0.65)]"
        >
          {/* SamayYudh Brand Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#EAE6F5] dark:bg-[#231B3E] text-[#6D28D9] dark:text-[#C4B5FD] flex items-center justify-center mb-4">
              {unlockedSuccess ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ShieldCheck className="w-7 h-7" />
              )}
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-[#162032] text-xs font-medium text-slate-600 dark:text-slate-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#6D28D9] dark:text-[#A78BFA]" />
              <span>SamayYudh 2.0 Command Center</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Admin &amp; Teacher Access Gateway
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Server-verified passkey protection for faculty content, classrooms, assignments, and analytics.
            </p>
          </div>

          {/* Signed-in Identity Summary */}
          <div className="mt-6 rounded-2xl bg-stone-50/90 dark:bg-[#162032] p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {fullName || 'Authenticated Account'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {userEmail || publicId || 'Session verified'}
              </p>
            </div>
            <span
              className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                isPrivileged
                  ? 'bg-[#EAE6F5] text-[#6D28D9] dark:bg-[#231B3E] dark:text-[#C4B5FD]'
                  : 'bg-amber-100/80 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
              }`}
            >
              {role.replace('_', ' ')}
            </span>
          </div>

          {/* Account Status / Role Guard */}
          {accountStatus !== 'active' ? (
            <div className="mt-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 p-4 flex items-start gap-3 text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold">Account Restricted</p>
                <p className="mt-1 text-xs opacity-90">
                  This account is marked as {accountStatus}. Contact a Super Admin to restore access.
                </p>
              </div>
            </div>
          ) : !isPrivileged ? (
            <div className="mt-5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 p-4 flex items-start gap-3 text-amber-800 dark:text-amber-200">
              <Lock className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold">Faculty or Admin Clearance Required</p>
                <p className="mt-1 text-xs leading-relaxed opacity-90">
                  Student accounts cannot unlock the Admin &amp; Teacher Command Center even with a passkey. Ask your administrator to assign a Teacher or Admin role to{' '}
                  <span className="font-mono font-semibold">{publicId || 'your ID'}</span>.
                </p>
              </div>
            </div>
          ) : !passkeyConfigured ? (
            <div className="mt-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 p-4 flex items-start gap-3 text-indigo-900 dark:text-indigo-200">
              <ServerCrash className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <p className="font-semibold text-sm">Server Passkey Setup Required</p>
                <p className="mt-1">
                  Add <code className="px-1.5 py-0.5 rounded bg-white/80 dark:bg-[#0B1120] font-mono">ADMIN_COMMAND_PASSKEY</code> (and optionally <code className="px-1.5 py-0.5 rounded bg-white/80 dark:bg-[#0B1120] font-mono">SUPER_ADMIN_EMAILS</code>) in your server environment variables, then restart or redeploy.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="cmd-passkey-input"
                  className="block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2"
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
                    className="w-full rounded-2xl bg-stone-100/90 dark:bg-[#162032] focus:bg-white dark:focus:bg-[#19263F] pl-11 pr-12 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:outline-none focus:shadow-[0_8px_24px_-6px_rgba(109,40,217,0.28)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((v) => !v)}
                    aria-label={showKey ? 'Hide passkey' : 'Show passkey'}
                    className="absolute right-3 p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={prefersReduced ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{error}</p>
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
                className="w-full rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm py-3.5 px-5 flex items-center justify-center gap-2 transition-all shadow-[0_8px_24px_-6px_rgba(109,40,217,0.45)] cursor-pointer"
              >
                {unlockedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Command Session Unlocked</span>
                  </>
                ) : submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Passkey...</span>
                  </>
                ) : (
                  <>
                    <span>Unlock Command Center</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>

      {/* Footer Security Metadata */}
      <div className="max-w-5xl w-full mx-auto text-center text-xs text-slate-400 dark:text-slate-500">
        HTTP-Only Signed Command Sessions · Rate-Limited Passkey Verification · Audit Logged
      </div>
    </div>
  );
}
