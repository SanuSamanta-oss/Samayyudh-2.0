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
  const [showPasskeyInput, setShowPasskeyInput] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [scanStatus, setScanStatus] = useState<'scanning' | 'success' | 'error'>('scanning');
  const [scanLabel, setScanLabel] = useState('Verifying Command Passkey...');
  const [scanSublabel, setScanSublabel] = useState('Scanning secure biometric credentials');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // When modal is shown on new session, strictly clear any prior session cookie
  // so Super Admin MUST provide the passkey before unlocking
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
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 pt-20 sm:p-6 sm:pt-24 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/65 backdrop-blur-md"
        />

        {!showPasskeyInput ? (
          /* STEP 1: SUPER ADMIN WELCOME POPUP */
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full max-w-[390px] sm:max-w-[420px] bg-white dark:bg-[#181622] rounded-[32px] pb-7 px-6 sm:px-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] z-10 my-auto text-center"
          >
            {/* Top Breaching Circular Illustration (Snoopy Executive) */}
            <div className="-mt-16 sm:-mt-20 mb-3.5 flex items-center justify-center drop-shadow-xl pointer-events-none">
              <SuperAdminWelcomeIllustration size={160} />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Authorization
            </span>

            <h3 className="text-2xl sm:text-[26px] font-extrabold text-[#18181B] dark:text-white tracking-tight leading-snug">
              Welcome Home, Super Admin!
            </h3>

            <p className="mt-2.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto">
              Your command center is ready. Manage SamayYudh, teachers, students, and the learning
              ecosystem.
            </p>

            {/* Actions: Require passkey to enter dashboard */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPasskeyInput(true)}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold text-xs sm:text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer outline-none focus:outline-none"
              >
                <KeyRound className="w-4 h-4 shrink-0" />
                <span>Enter Super Admin Dashboard</span>
              </button>

              <button
                type="button"
                onClick={onDismiss}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-[#18181B] hover:bg-black dark:bg-[#27272A] dark:hover:bg-[#323236] text-white font-medium text-xs sm:text-sm transition-all active:scale-95 cursor-pointer outline-none focus:outline-none"
              >
                Continue to Platform
              </button>
            </div>
          </motion.div>
        ) : (
          /* STEP 2: PASSKEY VERIFICATION WITH BIOMETRIC SCANNING ANIMATION */
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full max-w-[390px] sm:max-w-[420px] bg-white dark:bg-[#181622] rounded-[32px] pb-7 px-6 sm:px-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] z-10 my-auto text-center"
          >
            {verifying ? (
              /* ACTIVE FINGERPRINT SCANNER ANIMATION */
              <div className="py-4">
                <BiometricScanAnimation
                  status={scanStatus}
                  size={160}
                  label={scanLabel}
                  sublabel={scanSublabel}
                />
              </div>
            ) : (
              /* PASSKEY INPUT FORM */
              <>
                {/* Top Breaching Security Passkey Illustration */}
                <div className="-mt-16 sm:-mt-20 mb-3.5 flex items-center justify-center drop-shadow-xl pointer-events-none">
                  <SecurityPasskeyIllustration size={160} />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#18181B] dark:text-white tracking-tight">
                  Enter Command Passkey
                </h3>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                  Provide your server-configured Super Admin passkey to decrypt session credentials.
                </p>

                <form onSubmit={handleUnlock} className="mt-5 space-y-4">
                  <div className="relative">
                    <input
                      type="password"
                      value={passkey}
                      onChange={(e) => setPasskey(e.target.value)}
                      placeholder="Enter Master Passkey..."
                      autoFocus
                      className="w-full px-4 py-3.5 rounded-2xl bg-neutral-100 dark:bg-[#201D2E] text-neutral-900 dark:text-white placeholder-neutral-400 text-center tracking-widest text-sm outline-none focus:outline-none"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={!passkey.trim()}
                      className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold text-xs sm:text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 outline-none focus:outline-none"
                    >
                      <KeyRound className="w-4 h-4 shrink-0" />
                      <span>Unlock Dashboard</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPasskeyInput(false)}
                      className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-[#18181B] hover:bg-black dark:bg-[#27272A] dark:hover:bg-[#323236] text-white font-medium text-xs sm:text-sm transition-all active:scale-95 cursor-pointer outline-none focus:outline-none"
                    >
                      Back
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
