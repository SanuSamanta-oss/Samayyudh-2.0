'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BiometricScanAnimationProps {
  status?: 'scanning' | 'success' | 'error';
  size?: number;
  colorScheme?: 'amber' | 'emerald';
  label?: string;
  sublabel?: string;
}

export function BiometricScanAnimation({
  status = 'scanning',
  size = 170,
  colorScheme = 'amber',
  label,
  sublabel,
}: BiometricScanAnimationProps) {
  const isSuccess = status === 'success';
  const isError = status === 'error';

  // Harmonious theme palette matching Super Admin card
  const theme =
    colorScheme === 'amber'
      ? {
          stroke: isSuccess ? '#10B981' : isError ? '#EF4444' : '#D97706',
          strokeDark: isSuccess ? '#34D399' : isError ? '#F87171' : '#F59E0B',
          glow: isSuccess ? '#10B981' : isError ? '#EF4444' : '#F59E0B',
          grid: isSuccess
            ? 'rgba(16, 185, 129, 0.22)'
            : isError
            ? 'rgba(239, 68, 68, 0.22)'
            : 'rgba(245, 158, 11, 0.24)',
          textClass: isSuccess
            ? 'text-emerald-600 dark:text-emerald-400'
            : isError
            ? 'text-rose-600 dark:text-rose-400'
            : 'text-amber-600 dark:text-amber-400',
        }
      : {
          stroke: isSuccess ? '#10B981' : isError ? '#EF4444' : '#059669',
          strokeDark: isSuccess ? '#34D399' : isError ? '#F87171' : '#10B981',
          glow: isSuccess ? '#10B981' : isError ? '#EF4444' : '#10B981',
          grid: 'rgba(16, 185, 129, 0.2)',
          textClass: isSuccess
            ? 'text-emerald-600 dark:text-emerald-400'
            : isError
            ? 'text-rose-600 dark:text-rose-400'
            : 'text-emerald-600 dark:text-emerald-400',
        };

  const defaultLabel = isSuccess
    ? 'Passkey Authorized'
    : isError
    ? 'Passkey Denied'
    : 'Verifying Command Passkey...';

  const defaultSublabel = isSuccess
    ? 'Command Center clearance unlocked'
    : isError
    ? 'Credentials mismatch'
    : 'Authenticating with server enclave';

  return (
    <div className="flex flex-col items-center justify-center text-center select-none bg-transparent w-full">
      {/* ── 100% TRANSPARENT BLENDED SCANNER CANVAS (Zero Black Box, Zero Outlines) ── */}
      <div
        className="relative flex items-center justify-center bg-transparent"
        style={{ width: size, height: size }}
      >
        {/* Soft Ambient Radial Halo directly blending into popup card */}
        <motion.div
          animate={{
            scale: isSuccess ? [1, 1.25, 1.15] : [0.95, 1.08, 0.95],
            opacity: isSuccess ? [0.35, 0.65, 0.45] : [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: isSuccess ? 0.6 : 2.4,
            repeat: isSuccess ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-full pointer-events-none blur-2xl"
          style={{
            background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
          }}
        />

        {/* Concentric Radar Pulse Ring */}
        {!isSuccess && !isError && (
          <motion.div
            animate={{
              scale: [0.6, 1.3],
              opacity: [0.65, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: size * 0.72,
              height: size * 0.72,
              border: `1.5px solid ${theme.glow}`,
            }}
          />
        )}

        {/* ── MAIN VECTOR BIOMETRIC SCANNER (Fingerprint + 3D Grid + Corner Targets) ── */}
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full relative z-10 overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Filter for Holographic Neon Glow */}
          <defs>
            <filter id="biometricGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="scanBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={theme.glow} stopOpacity="0" />
              <stop offset="25%" stopColor={theme.glow} stopOpacity="0.6" />
              <stop offset="50%" stopColor={theme.glow} stopOpacity="1" />
              <stop offset="75%" stopColor={theme.glow} stopOpacity="0.6" />
              <stop offset="100%" stopColor={theme.glow} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 1. 3D Perspective Grid Base */}
          <g opacity="0.65" stroke={theme.grid} strokeWidth="0.8">
            {/* Converging vertical perspective lines */}
            <line x1="20" y1="108" x2="42" y2="78" />
            <line x1="38" y1="108" x2="47" y2="78" />
            <line x1="60" y1="108" x2="60" y2="78" />
            <line x1="82" y1="108" x2="73" y2="78" />
            <line x1="100" y1="108" x2="78" y2="78" />
            {/* Horizontal ground lines */}
            <line x1="22" y1="104" x2="98" y2="104" />
            <line x1="30" y1="94" x2="90" y2="94" />
            <line x1="37" y1="85" x2="83" y2="85" />
            <line x1="42" y1="78" x2="78" y2="78" />
          </g>

          {/* 2. Four Biometric Corner Target Brackets */}
          <g stroke={theme.stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
            {/* Top-Left */}
            <path d="M 16 32 L 16 20 Q 16 16 20 16 L 32 16" />
            {/* Top-Right */}
            <path d="M 88 16 L 100 16 Q 104 16 104 20 L 104 32" />
            {/* Bottom-Left */}
            <path d="M 16 88 L 16 100 Q 16 104 20 104 L 32 104" />
            {/* Bottom-Right */}
            <path d="M 88 104 L 100 104 Q 104 104 104 100 L 104 88" />
          </g>

          {/* 3. Detailed Authentic Biometric Fingerprint Ridges */}
          <g
            stroke={theme.stroke}
            strokeWidth="1.8"
            strokeLinecap="round"
            filter="url(#biometricGlow)"
            className="transition-all duration-300"
          >
            {/* Center Core Loop */}
            <path d="M 60 58 Q 60 52 56 52 Q 52 52 52 58 Q 52 64 58 66" />

            {/* Loop 1: Inner Core Arch */}
            <path d="M 50 67 C 48 64 46 60 46 56 C 46 48 52 44 60 44 C 68 44 74 48 74 56 C 74 62 70 68 66 72" />

            {/* Loop 2: Mid Arch Ridge */}
            <path d="M 42 74 C 40 68 39 62 39 55 C 39 43 48 36 60 36 C 72 36 81 43 81 55 C 81 64 77 73 72 78" />

            {/* Loop 3: Upper Main Arch */}
            <path d="M 35 81 C 33 73 32 64 32 54 C 32 38 44 28 60 28 C 76 28 88 38 88 54 C 88 67 83 78 77 84" />

            {/* Loop 4: Outer Perimeter Ridge */}
            <path d="M 28 87 C 26 77 25 65 25 53 C 25 33 40 21 60 21 C 80 21 95 33 95 53 C 95 70 90 83 82 90" />

            {/* Side Delta Ridges & Ridge Endings for True Biometric Texture */}
            <path d="M 46 75 C 47 79 49 84 53 87" />
            <path d="M 67 79 C 68 83 70 86 73 88" />
            <path d="M 57 74 L 57 84" />
            <path d="M 63 74 L 63 82" />
            <path d="M 52 38 C 55 35 65 35 68 38" />
          </g>

          {/* 4. Dynamic Laser Scanning Beam oscillating across fingerprint */}
          {!isSuccess && !isError && (
            <motion.g
              animate={{
                y: [18, 92, 18],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Laser Core Line */}
              <line
                x1="18"
                y1="0"
                x2="102"
                y2="0"
                stroke="url(#scanBeamGrad)"
                strokeWidth="2.4"
                filter="url(#biometricGlow)"
              />
              {/* Floating Laser Particle Dots */}
              <circle cx="34" cy="0" r="1.5" fill={theme.glow} />
              <circle cx="60" cy="0" r="2.2" fill={theme.glow} filter="url(#biometricGlow)" />
              <circle cx="86" cy="0" r="1.5" fill={theme.glow} />
            </motion.g>
          )}

          {/* 5. Success Checkmark Morph Overlay */}
          {isSuccess && (
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 260 }}
            >
              <circle cx="60" cy="56" r="22" fill="#10B981" />
              <path
                d="M 50 56 L 57 63 L 70 50"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>
          )}
        </svg>
      </div>

      {/* Dynamic Status Typography directly on popup card */}
      <div className="mt-2 space-y-1">
        <p className={`text-sm sm:text-base font-extrabold tracking-wide uppercase ${theme.textClass}`}>
          {label || defaultLabel}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium max-w-xs mx-auto">
          {sublabel || defaultSublabel}
        </p>
      </div>
    </div>
  );
}
