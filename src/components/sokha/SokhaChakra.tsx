'use client';

// ============================================================
// SamayYudh 2.0 — Mystic Sacred Chakra & Aura Energy Field
// Exact match to reference pin (https://pin.it/2JZL1HP2o)
// Seamless, borderless, pure transparent blending (NO black background, NO yellow border)
// 75-frame high-framerate seamless looped animation with GPU-accelerated
// buttery-smooth 60fps/120fps continuous rotation across all modes.
// ============================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SokhaChakraProps {
  size?: 'sm' | 'md' | 'lg';
  isThinking?: boolean;
  className?: string;
}

export function SokhaChakra({
  size = 'md',
  isThinking = false,
  className,
}: SokhaChakraProps) {
  const [imageFailed, setImageFailed] = useState(false);

  // Responsive dimensions
  const dimensions = {
    sm: {
      container: 'w-10 h-10',
    },
    md: {
      container: 'w-36 h-36 sm:w-40 sm:h-40',
    },
    lg: {
      container: 'w-52 h-52 sm:w-60 sm:h-60',
    },
  }[size];

  return (
    <div
      className={cn(
        'relative flex items-center justify-center select-none shrink-0 group bg-transparent',
        dimensions.container,
        className
      )}
    >
      {/* ── Main Sacred Chakra: 75-Frame High-Framerate Animation with GPU Linear Rotation ── */}
      <div className="relative w-full h-full flex items-center justify-center bg-transparent pointer-events-none">
        {!imageFailed ? (
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: isThinking ? [1, 1.06, 0.98, 1.04, 1] : [1, 1.02, 0.99, 1],
            }}
            transition={{
              rotate: {
                repeat: Infinity,
                duration: isThinking ? 9 : 24,
                ease: 'linear',
              },
              scale: {
                repeat: Infinity,
                duration: isThinking ? 1.6 : 4,
                ease: 'easeInOut',
              },
            }}
            className="w-full h-full flex items-center justify-center will-change-transform"
          >
            <img
              src="/mystic-chakra.webp"
              alt="Sacred Vedic Chakra"
              className={cn(
                "w-full h-full object-contain pointer-events-none select-none transition-[filter] duration-300",
                // Light mode: Electric Blue/Cyan line hue-shift + radiant cyan/blue glow
                "[filter:hue-rotate(185deg)_saturate(1.35)_brightness(1.05)_drop-shadow(0_0_8px_rgba(14,165,233,0.65))_drop-shadow(0_0_18px_rgba(6,182,212,0.4))]",
                // Dark mode: Authentic Fiery Red/Orange lines + crimson flame glow
                "dark:[filter:drop-shadow(0_0_8px_rgba(255,69,0,0.55))_drop-shadow(0_0_18px_rgba(239,68,68,0.3))]"
              )}
              onError={() => setImageFailed(true)}
            />
          </motion.div>
        ) : (
          /* Fallback Animated SVG Chakra if asset fails to load */
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
              className={cn(
                "w-[85%] h-[85%] rounded-full opacity-80 flex items-center justify-center blur-sm",
                "bg-gradient-to-tr from-cyan-500/20 via-sky-500/30 to-blue-400/20",
                "dark:bg-gradient-to-tr dark:from-amber-500/20 dark:via-orange-500/30 dark:to-yellow-400/20"
              )}
            >
              <div className="w-5 h-5 rounded-full bg-cyan-400 dark:bg-amber-400 blur-[2px] shadow-[0_0_15px_rgba(14,165,233,0.9)] dark:shadow-[0_0_15px_rgba(251,191,36,0.9)]" />
            </motion.div>
          </div>
        )}
      </div>

      {/* ── Floating Fiery/Electric Ember Sparks ────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {[
          { top: '15%', left: '22%', delay: 0, duration: 3.2, size: 'w-1 h-1' },
          { top: '75%', left: '74%', delay: 1.1, duration: 2.8, size: 'w-1.5 h-1.5' },
          { top: '28%', left: '78%', delay: 0.5, duration: 3.5, size: 'w-1 h-1' },
          { top: '68%', left: '18%', delay: 1.8, duration: 4.0, size: 'w-1 h-1' },
          { top: '48%', left: '88%', delay: 2.2, duration: 2.6, size: 'w-1.5 h-1.5' },
        ].map((spark, idx) => (
          <motion.div
            key={idx}
            animate={{
              y: [-6, 6, -6],
              x: [-4, 4, -4],
              opacity: [0.2, 0.85, 0.2],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              repeat: Infinity,
              duration: spark.duration,
              delay: spark.delay,
              ease: 'easeInOut',
            }}
            className={cn(
              'absolute rounded-full blur-[0.5px] transition-colors duration-300',
              // Light mode: Electric cyan/blue sparks
              'bg-cyan-300 shadow-[0_0_6px_2px_rgba(14,165,233,0.7)]',
              // Dark mode: Fiery amber/orange sparks
              'dark:bg-orange-300 dark:shadow-[0_0_6px_2px_rgba(249,115,22,0.65)]',
              spark.size
            )}
            style={{
              top: spark.top,
              left: spark.left,
            }}
          />
        ))}
      </div>

      {/* ── Central Bindu Luminous Star ───────────────────────────────────────────── */}
      <motion.div
        animate={{
          scale: isThinking ? [1, 1.4, 1] : [0.95, 1.15, 0.95],
          opacity: isThinking ? [0.85, 1, 0.85] : [0.65, 0.9, 0.65],
        }}
        transition={{
          repeat: Infinity,
          duration: isThinking ? 1.4 : 2.5,
          ease: 'easeInOut',
        }}
        className={cn(
          "absolute w-2 h-2 rounded-full bg-white blur-[0.5px] pointer-events-none transition-shadow duration-300",
          // Light mode: Electric cyan/sky-blue core glow
          "shadow-[0_0_10px_3px_rgba(255,255,255,0.95),0_0_20px_5px_rgba(14,165,233,0.8)]",
          // Dark mode: Crimson fiery orange core glow
          "dark:shadow-[0_0_10px_3px_rgba(255,255,255,0.95),0_0_20px_5px_rgba(249,115,22,0.75)]"
        )}
      />
    </div>
  );
}
