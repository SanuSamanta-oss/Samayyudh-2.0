'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BiometricScanAnimationProps {
  status?: 'scanning' | 'success' | 'error';
  size?: number;
  label?: string;
  sublabel?: string;
}

export function BiometricScanAnimation({
  status = 'scanning',
  size = 200,
  label,
  sublabel,
}: BiometricScanAnimationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isSuccess = status === 'success';
  const isError = status === 'error';

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.1;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const defaultLabel = isSuccess
    ? 'Passkey Authorized'
    : isError
    ? 'Passkey Denied'
    : 'Verifying Command Passkey...';

  const defaultSublabel = isSuccess
    ? 'Command Center clearance unlocked'
    : isError
    ? 'Credentials mismatch'
    : 'Scanning biometric security credentials';

  return (
    <div className="flex flex-col items-center justify-center text-center select-none bg-transparent w-full my-auto">
      {/* ── CROPPED BIOMETRIC VIDEO (Zero Sharp Edges, Feathered Vignette, Zero Outlines) ── */}
      <div
        className="relative flex items-center justify-center rounded-full overflow-hidden bg-transparent"
        style={{ width: size, height: size }}
      >
        {/* Soft Ambient Radial Halo that dissolves into the card surface */}
        <motion.div
          animate={{
            scale: isSuccess ? [1, 1.2, 1.1] : [0.95, 1.08, 0.95],
            opacity: isSuccess ? [0.4, 0.7, 0.5] : [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: isSuccess ? 0.5 : 2.2,
            repeat: isSuccess ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute inset-0 rounded-full pointer-events-none blur-2xl transition-colors ${
            isSuccess
              ? 'bg-emerald-500/40'
              : isError
              ? 'bg-rose-500/35'
              : 'bg-emerald-500/25'
          }`}
        />

        {/* The Exact Reference Animation Video (Cropped seamlessly with feathered mask) */}
        <video
          ref={videoRef}
          src="/animations/passkey-verify.mp4"
          poster="/animations/passkey-verify-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover rounded-full pointer-events-none select-none"
          style={{
            maskImage:
              'radial-gradient(circle at center, black 48%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.25) 70%, transparent 78%)',
            WebkitMaskImage:
              'radial-gradient(circle at center, black 48%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.25) 70%, transparent 78%)',
          }}
        />

        {/* Success Hologram Overlay */}
        {isSuccess && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 14, stiffness: 260 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/50">
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

      {/* Dynamic Status Typography */}
      <div className="mt-3 space-y-1">
        <p
          className={`text-sm sm:text-base font-extrabold tracking-wide uppercase transition-colors ${
            isSuccess
              ? 'text-emerald-600 dark:text-emerald-400'
              : isError
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-emerald-600 dark:text-emerald-400'
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
