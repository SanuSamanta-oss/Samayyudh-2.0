'use client';

// ============================================================
// SamayYudh 2.0 — Ethereal Moving Gaseous Circular Body
// Perfectly matching reference Photo 1 (Apple Intelligence / Siri style)
// Swirling multi-layered fluid gaseous ribbons, cosmic indigo core,
// neon cyan & magenta-violet aurora corona, and breathing plasma physics.
// ============================================================

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SokhaOrbProps {
  size?: 'sm' | 'md' | 'lg';
  isThinking?: boolean;
  className?: string;
}

export function SokhaOrb({
  size = 'md',
  isThinking = false,
  className,
}: SokhaOrbProps) {
  const sizeMap = {
    sm: 'w-11 h-11',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-36 h-36 sm:w-44 sm:h-44',
  };

  return (
    <div className={cn('relative flex items-center justify-center select-none', className)}>
      {/* ── Outer Gaseous Mist & Aurora Backlight (Breathing Glow) ─────────────── */}
      <motion.div
        animate={{
          scale: isThinking ? [1, 1.18, 0.95, 1.12, 1] : [1, 1.06, 0.97, 1],
          opacity: isThinking ? [0.7, 0.95, 0.7] : [0.45, 0.65, 0.45],
        }}
        transition={{
          repeat: Infinity,
          duration: isThinking ? 2 : 4.5,
          ease: 'easeInOut',
        }}
        className={cn(
          'absolute rounded-full pointer-events-none filter blur-2xl transition-all',
          sizeMap[size]
        )}
        style={{
          background:
            'radial-gradient(circle, rgba(99,102,241,0.65) 0%, rgba(139,92,246,0.5) 35%, rgba(6,182,212,0.4) 65%, rgba(30,27,75,0) 100%)',
        }}
      />

      {/* ── Main Spherical Gaseous Body Container ────────────────────────────── */}
      <motion.div
        animate={{
          scale: isThinking ? [1, 1.05, 0.97, 1.04, 1] : [1, 1.03, 0.98, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: isThinking ? 2.2 : 5,
          ease: 'easeInOut',
        }}
        className={cn(
          'relative rounded-full overflow-hidden flex items-center justify-center shadow-[0_12px_36px_rgba(79,70,229,0.35)]',
          sizeMap[size]
        )}
        style={{
          background:
            'radial-gradient(circle at 45% 45%, #0e122a 0%, #060918 60%, #020309 100%)',
        }}
      >
        {/* Layer 1: Deep Nebula Gas Ambient Gradient Core */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{
            rotate: { repeat: Infinity, duration: isThinking ? 6 : 16, ease: 'linear' },
            scale: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
          }}
          className="absolute inset-0 rounded-full opacity-85 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 35% 35%, rgba(59,130,246,0.6) 0%, rgba(147,51,234,0.5) 45%, rgba(6,182,212,0.3) 75%, transparent 100%)',
            filter: 'blur(8px)',
          }}
        />

        {/* Layer 2: Primary Fluid Gaseous Swirl Ribbon (Clockwise flow) */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            repeat: Infinity,
            duration: isThinking ? 4 : 10,
            ease: 'linear',
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Cyan -> Blue -> Violet -> Magenta Ribbon Gradient */}
              <linearGradient id="gasGradientPrimary" x1="10%" y1="10%" x2="90%" y2="90%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.95" />
                <stop offset="30%" stopColor="#6366F1" stopOpacity="0.85" />
                <stop offset="65%" stopColor="#A855F7" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.8" />
              </linearGradient>

              {/* Luminous White-Cyan Crest Light */}
              <linearGradient id="crestGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#A5F3FC" stopOpacity="0.9" />
                <stop offset="85%" stopColor="#818CF8" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
              </linearGradient>

              {/* Gaseous Glow Blur Filter */}
              <filter id="fluidGasGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Main Fluid Gaseous Torus / Ribbon Body */}
            <path
              d="M 60 14 C 88 14 106 36 106 60 C 106 85 86 106 60 106 C 34 106 14 86 14 60 C 14 38 32 18 56 16 C 75 14 88 30 84 52 C 80 72 58 84 42 78 C 30 73 24 58 34 46 C 44 34 68 36 78 52 C 86 65 80 84 62 90 C 46 95 32 82 36 66"
              fill="none"
              stroke="url(#gasGradientPrimary)"
              strokeWidth="11"
              strokeLinecap="round"
              filter="url(#fluidGasGlow)"
              opacity="0.88"
            />

            {/* Glowing Ethereal Silk Crest Stream (thin highlight ribbon) */}
            <path
              d="M 58 17 C 82 17 103 36 103 60 C 103 82 85 102 60 102 C 38 102 18 84 18 60 C 18 42 34 22 58 17 C 76 13 86 28 82 48 C 77 66 56 78 42 72"
              fill="none"
              stroke="url(#crestGradient)"
              strokeWidth="3.2"
              strokeLinecap="round"
              filter="url(#fluidGasGlow)"
              opacity="0.95"
            />
          </svg>
        </motion.div>

        {/* Layer 3: Counter-rotating Organic Plasma Wave (Depth & Fluidity) */}
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: isThinking ? [0.94, 1.04, 0.94] : [0.96, 1.02, 0.96],
          }}
          transition={{
            rotate: { repeat: Infinity, duration: isThinking ? 5 : 13, ease: 'linear' },
            scale: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="gasGradientSecondary" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#818CF8" stopOpacity="0.75" />
                <stop offset="70%" stopColor="#D946EF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Counter Swirl Plasma Veil */}
            <path
              d="M 64 24 C 84 28 98 44 98 64 C 98 84 82 98 62 98 C 42 98 24 82 24 62 C 24 44 38 30 56 26 C 72 22 84 36 80 54 C 76 70 58 78 46 72"
              fill="none"
              stroke="url(#gasGradientSecondary)"
              strokeWidth="7"
              strokeLinecap="round"
              filter="url(#fluidGasGlow)"
              opacity="0.78"
            />

            {/* Inner Silky Gas Filament Loop */}
            <path
              d="M 44 48 C 50 36 68 38 74 50 C 80 62 66 74 54 72 C 44 70 40 58 48 50"
              fill="none"
              stroke="#A5F3FC"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.85"
            />
          </svg>
        </motion.div>

        {/* Layer 4: Deep Violet Plasma Core Nebula (Glow in the center) */}
        <motion.div
          animate={{
            scale: isThinking ? [0.85, 1.12, 0.85] : [0.92, 1.05, 0.92],
            opacity: isThinking ? [0.8, 1, 0.8] : [0.65, 0.85, 0.65],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.8,
            ease: 'easeInOut',
          }}
          className="absolute inset-[22%] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(168,85,247,0.7) 0%, rgba(99,102,241,0.5) 50%, rgba(6,182,212,0.2) 80%, transparent 100%)',
            filter: 'blur(5px)',
          }}
        />

        {/* Layer 5: Bright White-Hot Spark Energy Center Node */}
        <motion.div
          animate={{
            opacity: isThinking ? [0.7, 1, 0.7] : [0.5, 0.8, 0.5],
            scale: isThinking ? [1, 1.3, 1] : [0.9, 1.1, 0.9],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.8,
            ease: 'easeInOut',
          }}
          className="absolute w-2 h-2 rounded-full bg-white blur-[1px] pointer-events-none"
          style={{
            top: '34%',
            left: '42%',
            boxShadow: '0 0 12px 3px rgba(255,255,255,0.85), 0 0 20px 6px rgba(56,189,248,0.7)',
          }}
        />
      </motion.div>
    </div>
  );
}

