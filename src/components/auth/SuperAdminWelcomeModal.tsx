'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  SuperAdminWelcomeIllustration,
  SecurityPasskeyIllustration,
} from '@/components/illustrations/AuthCardIllustrations';
import { ShieldCheck, KeyRound, Loader2, AlertCircle } from 'lucide-react';

interface SuperAdminWelcomeModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export function SuperAdminWelcomeModal({ isOpen, onDismiss }: SuperAdminWelcomeModalProps) {
  const router = useRouter();
  const [showPasskeyInput, setShowPasskeyInput] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!passkey.trim()) {
      setErrorMsg('Please enter your Command Passkey');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/auth/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: passkey.trim() }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(data.error || 'Invalid Super Admin Passkey. Access denied.');
        return;
      }

      // Success! Redirect to Command Center
      router.push('/admin');
      onDismiss();
    } catch {
      setErrorMsg('Failed to verify passkey. Check server connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/65 backdrop-blur-md"
        />

        {!showPasskeyInput ? (
          /* WELCOME POPUP */
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full max-w-md bg-white dark:bg-[#181622] rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] z-10 my-auto text-center overflow-hidden"
          >
            {/* Breaching Illustration */}
            <div className="-mt-12 flex justify-center mb-3">
              <SuperAdminWelcomeIllustration size={200} />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Authorization
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-white tracking-tight">
              Welcome Home, Super Admin!
            </h3>

            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Your command center is ready. Manage SamayYudh, teachers, students, and the learning
              ecosystem.
            </p>

            {/* Actions matching reference style */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPasskeyInput(true)}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Enter Super Admin Dashboard</span>
              </button>

              <button
                type="button"
                onClick={onDismiss}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-[#18181B] hover:bg-black dark:bg-[#27272A] dark:hover:bg-[#323236] text-white font-medium text-sm transition-all active:scale-95 cursor-pointer"
              >
                Continue to Platform
              </button>
            </div>
          </motion.div>
        ) : (
          /* PASSKEY VERIFICATION DIALOG */
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full max-w-md bg-white dark:bg-[#181622] rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] z-10 my-auto text-center overflow-hidden"
          >
            <div className="-mt-10 flex justify-center mb-2">
              <SecurityPasskeyIllustration size={170} />
            </div>

            <h3 className="text-2xl font-bold text-[#18181B] dark:text-white tracking-tight">
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
                  disabled={loading}
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
                  disabled={loading}
                  className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Unlock Dashboard</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowPasskeyInput(false)}
                  disabled={loading}
                  className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-[#18181B] hover:bg-black dark:bg-[#27272A] dark:hover:bg-[#323236] text-white font-medium text-sm transition-all active:scale-95 cursor-pointer"
                >
                  Back
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}

