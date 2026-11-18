'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  SuperAdminWelcomeIllustration,
  SecurityPasskeyIllustration,
} from '@/components/illustrations/AuthCardIllustrations';
import { BiometricScanAnimation } from '@/components/auth/BiometricScanAnimation';
import { ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';

interface SuperAdminWelcomeModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export function SuperAdminWelcomeModal({ isOpen, onDismiss }: SuperAdminWelcomeModalProps) {
  const router = useRouter();
  const [showPasskeyInput, setShowPasskeyInput] = useState(true);
  const [passkey, setPasskey] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [scanStatus, setScanStatus] = useState<'scanning' | 'success' | 'error'>('scanning');
  const [scanLabel, setScanLabel] = useState('Verifying Command Passkey...');
  const [scanSublabel, setScanSublabel] = useState('Scanning secure biometric credentials');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // When modal is shown on a new session, clear any lingering passkey cookie
  // so Super Admin MUST enter the passkey before the dashboard unlocks
  useEffect(() => {
    if (isOpen) {
      fetch('/api/admin/auth/logout', { method: 'POST' }).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!passkey.trim()) {
      setErrorMsg('Please enter your Command Passkey');
      return;
    }

    setVerifying(true);
    setErrorMsg(null);
    setScanStatus('scanning');
    setScanLabel('Verifying Command Passkey...');
    setScanSublabel('Authenticating with server enclave');

    try {
      const res = await fetch('/api/admin/auth/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: passkey.trim() }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setScanStatus('error');
        setScanLabel('Passkey Denied');
        setScanSublabel(data.error || 'Invalid credentials');
        setErrorMsg(data.error || 'Invalid Super Admin Passkey. Access denied.');
        setTimeout(() => {
          setVerifying(false);
        }, 1200);
        return;
      }

      // Success! Play green biometric authorization flash
      setScanStatus('success');
      setScanLabel('Passkey Authorized');
      setScanSublabel('Command Center unlocked. Redirecting...');
      try {
        sessionStorage.setItem('sy_super_admin_passkey_unlocked', 'true');
      } catch {}

      setTimeout(() => {
        router.push('/admin');
        onDismiss();
      }, 750);
    } catch {
      setScanStatus('error');
      setScanLabel('Network Error');
      setScanSublabel('Failed to reach authentication server');
      setErrorMsg('Failed to verify passkey. Check server connection.');
      setTimeout(() => {
        setVerifying(false);
      }, 1200);
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/65 backdrop-blur-md"
        />

        {/* ── 1:1 SQUARE POP-UP CARD (No sharp edges, No outlines, Perfectly Centered) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative aspect-square w-full max-w-[360px] sm:max-w-[390px] bg-white dark:bg-[#181622] rounded-[36px] p-5 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] z-10 my-auto text-center flex flex-col justify-center items-center overflow-hidden select-none border-0 ring-0 outline-none"
        >
          {verifying ? (
            /* VERIFICATION STATE: BLENDED FINGERPRINT LASER SCANNER */
            <div className="w-full h-full flex flex-col items-center justify-center my-auto">
              <BiometricScanAnimation
                status={scanStatus}
                size={150}
                label={scanLabel}
                sublabel={scanSublabel}
              />
            </div>
          ) : !showPasskeyInput ? (
            /* STEP 1: WELCOME SCREEN (1:1 Ratio Centered Layout) */
            <div className="w-full flex flex-col items-center justify-center my-auto">
              {/* Top Section: Illustration & Badge */}
              <div className="mb-2 flex items-center justify-center drop-shadow-md pointer-events-none">
                <SuperAdminWelcomeIllustration size={118} />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] mb-2">
                <ShieldCheck className="w-3 h-3" /> Super Admin Authorization
              </span>

              <h3 className="text-xl sm:text-2xl font-extrabold text-[#18181B] dark:text-white tracking-tight leading-snug">
                Welcome Home, Super Admin!
              </h3>

              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-[270px] mx-auto">
                Your command center is ready. Manage SamayYudh, teachers, students, and the learning ecosystem.
              </p>

              {/* Actions */}
              <div className="w-full flex flex-col gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowPasskeyInput(true)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer border-0 outline-none focus:outline-none focus-visible:outline-none"
                  style={{ outline: 'none' }}
                >
                  <KeyRound className="w-4 h-4 shrink-0" />
                  <span>Enter Super Admin Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={onDismiss}
                  className="w-full py-2 px-4 rounded-2xl bg-[#18181B] hover:bg-black dark:bg-[#27272A] dark:hover:bg-[#323236] text-white font-medium text-xs sm:text-sm transition-all active:scale-95 cursor-pointer border-0 outline-none focus:outline-none focus-visible:outline-none"
                  style={{ outline: 'none' }}
                >
                  Continue to Platform
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: PASSKEY INPUT (1:1 Ratio Centered Layout - No Empty Void, No Outline) */
            <div className="w-full flex flex-col items-center justify-center my-auto">
              <div className="mb-2 flex items-center justify-center drop-shadow-md pointer-events-none">
                <SecurityPasskeyIllustration size={112} />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[#18181B] dark:text-white tracking-tight">
                Enter Command Passkey
              </h3>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 max-w-[260px] mx-auto">
                Provide your server-configured Super Admin passkey to decrypt session credentials.
              </p>

              <form onSubmit={handleUnlock} className="w-full space-y-3 mt-3.5">
                <div className="relative">
                  <input
                    type="password"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Enter Master Passkey..."
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-2xl bg-neutral-100 dark:bg-[#201D2E] text-neutral-900 dark:text-white placeholder-neutral-400 text-center tracking-widest text-sm border-0 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
                    style={{ outline: 'none', boxShadow: 'none' }}
                  />
                </div>

                {errorMsg && (
                  <div className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={!passkey.trim()}
                    className="flex-1 py-2.5 px-3 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 border-0 outline-none focus:outline-none focus-visible:outline-none"
                    style={{ outline: 'none' }}
                  >
                    <KeyRound className="w-3.5 h-3.5 shrink-0" />
                    <span>Unlock Dashboard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPasskeyInput(false)}
                    className="py-2.5 px-4 rounded-2xl bg-neutral-200 hover:bg-neutral-300 dark:bg-[#27272A] dark:hover:bg-[#323236] text-neutral-800 dark:text-white font-medium text-xs sm:text-sm transition-all active:scale-95 cursor-pointer border-0 outline-none focus:outline-none focus-visible:outline-none"
                    style={{ outline: 'none' }}
                  >
                    Back
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
