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
  size = 150,
  label = 'Verifying Passkey...',
  sublabel = 'Scanning secure enclave credentials',
}: BiometricScanAnimationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.15;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, []);

  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <div className="flex flex-col items-center justify-center text-center select-none py-2">
      {/* Biometric Aperture Container (Zero Outlines, Organic Glowing Blend) */}
      <div
        className="relative flex items-center justify-center rounded-3xl overflow-hidden bg-[#05110B] dark:bg-[#030B07] shadow-[0_0_35px_rgba(34,197,94,0.22)]"
        style={{ width: size, height: size }}
      >
        {/* Soft Ambient Radial Glow Behind */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
            isSuccess
              ? 'bg-radial from-emerald-500/40 via-emerald-500/10 to-transparent'
              : isError
              ? 'bg-radial from-rose-500/35 via-rose-500/10 to-transparent'
              : 'bg-radial from-emerald-500/25 via-emerald-500/5 to-transparent'
          }`}
        />

        {/* The Fingerprint Scanner Video (Exact reference from pin.it/7kcFxjQCH) */}
        <video
          ref={videoRef}
          src="/animations/passkey-verify.mp4"
          poster="/animations/passkey-verify-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover pointer-events-none"
          style={{
            maskImage: 'radial-gradient(circle at center, black 62%, transparent 98%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 62%, transparent 98%)',
          }}
        />

        {/* Dynamic Scanning Laser Bar */}
        {!isSuccess && !isError && (
          <motion.div
            animate={{
              y: [-size / 2 + 10, size / 2 - 10, -size / 2 + 10],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-x-3 h-[2px] bg-gradient-to-r from-transparent via-[#22C55E] to-transparent shadow-[0_0_12px_#22C55E] pointer-events-none"
          />
        )}

        {/* Success / Error Overlay Pulse */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold shadow-lg shadow-emerald-500/50">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
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
      <div className="mt-3.5 space-y-1">
        <p
          className={`text-sm font-extrabold tracking-wide uppercase transition-colors ${
            isSuccess
              ? 'text-emerald-500 dark:text-emerald-400'
              : isError
              ? 'text-rose-500 dark:text-rose-400'
              : 'text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {label}
        </p>
        {sublabel && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium max-w-xs">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}
