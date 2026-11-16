'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BiometricScanAnimationProps {
  status?: 'scanning' | 'success' | 'error';
  size?: number;
  label?: string;
  sublabel?: string;
}

export function BiometricScanAnimation({
  status = 'scanning',
  size = 150,
  label,
  sublabel,
}: BiometricScanAnimationProps) {
  const isSuccess = status === 'success';
  const isError = status === 'error';

  const defaultLabel = isSuccess
    ? 'Passkey Authorized'
    : isError
    ? 'Passkey Denied'
    : 'Verifying Command Passkey...';

  const defaultSublabel = isSuccess
    ? 'Command Center unlocked. Redirecting...'
    : isError
    ? 'Credentials mismatch'
    : 'Authenticating with server enclave';

  return (
    <div className="flex flex-col items-center justify-center text-center select-none bg-transparent w-full my-auto">
      {/* ── SEAMLESS FINGERPRINT CONTAINER (Transparent BG, Blends in Light & Dark Themes) ── */}
      <div
        className="relative flex items-center justify-center bg-transparent"
        style={{ width: size, height: size }}
      >
        {/* Soft Ambient Radial Backlight */}
        <motion.div
          animate={{
            scale: isSuccess ? [1, 1.15, 1.05] : [0.94, 1.06, 0.94],
            opacity: isSuccess ? [0.4, 0.7, 0.5] : [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: isSuccess ? 0.4 : 2.2,
            repeat: isSuccess ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute inset-0 rounded-full pointer-events-none blur-2xl transition-colors duration-500 ${
            isSuccess
              ? 'bg-emerald-500/35'
              : isError
              ? 'bg-rose-500/30'
              : 'bg-amber-500/25 dark:bg-amber-500/30'
          }`}
        />

        {/* 100% Transparent Orange Fingerprint Image */}
        <div className="relative w-full h-full flex items-center justify-center p-2">
          <img
            src="/images/fingerprint-orange.png"
            alt="Biometric Fingerprint"
            className="w-full h-full object-contain pointer-events-none select-none transition-all duration-300"
            style={{
              filter: isSuccess
                ? 'drop-shadow(0 0 16px rgba(16, 185, 129, 0.6))'
                : isError
                ? 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.5))'
                : 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.35))',
            }}
          />

          {/* ── SMOOTH LASER SCANNER SWEEPER ── */}
          <div className="absolute inset-x-2 inset-y-1 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute left-0 right-0 pointer-events-none"
              animate={{
                top: isSuccess ? '50%' : ['-5%', '95%', '-5%'],
              }}
              transition={{
                duration: isSuccess ? 0.3 : 2.0,
                repeat: isSuccess ? 0 : Infinity,
                ease: 'easeInOut',
              }}
              style={{ height: '36px', marginTop: '-18px' }}
            >
              {/* Upward light gradient */}
              <div
                className={`w-full h-4 transition-colors duration-300 ${
                  isSuccess
                    ? 'bg-gradient-to-t from-emerald-500/35 to-transparent'
                    : isError
                    ? 'bg-gradient-to-t from-rose-500/35 to-transparent'
                    : 'bg-gradient-to-t from-amber-500/35 to-transparent'
                }`}
              />

              {/* Glowing Laser Line */}
              <div
                className={`w-full h-[2.5px] rounded-full transition-colors duration-300 ${
                  isSuccess
                    ? 'bg-emerald-400 shadow-[0_0_12px_#10B981,0_0_24px_#34D399]'
                    : isError
                    ? 'bg-rose-500 shadow-[0_0_12px_#EF4444,0_0_24px_#F87171]'
                    : 'bg-amber-400 shadow-[0_0_12px_#F59E0B,0_0_24px_#FBBF24]'
                }`}
              />

              {/* Downward light gradient */}
              <div
                className={`w-full h-4 transition-colors duration-300 ${
                  isSuccess
                    ? 'bg-gradient-to-b from-emerald-500/35 to-transparent'
                    : isError
                    ? 'bg-gradient-to-b from-rose-500/35 to-transparent'
                    : 'bg-gradient-to-b from-amber-500/35 to-transparent'
                }`}
              />
            </motion.div>
          </div>

          {/* Success Authorized Checkmark Badge */}
          {isSuccess && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 14, stiffness: 280 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/50">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Dynamic Status Typography */}
      <div className="mt-4 space-y-1">
        <p
          className={`text-sm sm:text-base font-extrabold tracking-wide uppercase transition-colors ${
            isSuccess
              ? 'text-emerald-600 dark:text-emerald-400'
              : isError
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-amber-600 dark:text-amber-400'
          }`}
        >
          {label || defaultLabel}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium max-w-xs mx-auto">
          {sublabel || defaultSublabel}
        </p>
      </div>
    </div>
  );
}
