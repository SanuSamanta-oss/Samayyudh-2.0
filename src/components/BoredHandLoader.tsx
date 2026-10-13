'use client';

// ============================================================
// SamayYudh 2.0 — Bored Hand Tapping Loading Animation
// Authentic cartoon hand tapping rhythmically on pure black background
// Used for user authentication, sign-in, and account onboarding
// ============================================================

import React from 'react';
import { motion } from 'framer-motion';

export interface BoredHandLoaderProps {
  text?: string;
  finished?: boolean;
  handOnly?: boolean;
}

export function BoredHandLoader({
  text = 'LOADING...',
  finished = false,
  handOnly = false,
}: BoredHandLoaderProps) {
  const isDefaultLoadingText =
    !text ||
    text.trim().toUpperCase() === 'LOADING...' ||
    text.trim().toUpperCase() === 'LOADING';

  const showCustomText = !isDefaultLoadingText;

  const webpSrc = handOnly ? '/bored_hand_hand_only.webp' : '/bored_hand_black.webp';
  const gifSrc = handOnly ? '/bored_hand_hand_only.gif' : '/bored_hand_black.gif';

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[360px] bg-black select-none">
      <motion.div
        className="relative flex flex-col items-center justify-center"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Exact Bored Hand Tapping Loading Animation on Pure Black Screen */}
        <div className="relative flex items-center justify-center">
          <picture>
            <source srcSet={webpSrc} type="image/webp" />
            <img
              src={gifSrc}
              alt="Loading animation"
              className="w-[280px] sm:w-[350px] md:w-[400px] h-auto object-contain pointer-events-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]"
            />
          </picture>
        </div>

        {/* Minimal High-Tech Progress Bar on Black Screen */}
        <div className="w-56 sm:w-64 h-1 bg-zinc-900 rounded-full mt-4 sm:mt-5 overflow-hidden relative border border-zinc-800">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-stone-400 via-white to-stone-300 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.7)]"
            initial={{ width: '0%' }}
            animate={{ width: finished ? '100%' : '88%' }}
            transition={{ duration: finished ? 0.35 : 2.2, ease: 'easeOut' }}
          />
        </div>

        {/* Dynamic Contextual Text if custom or finished */}
        {(showCustomText || finished) && (
          <motion.p
            className="text-stone-300 text-xs sm:text-sm font-bold tracking-[0.25em] pl-[0.25em] text-center uppercase mt-4 px-4 w-full"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: finished ? 1 : [0.7, 1, 0.7] }}
            transition={{ repeat: finished ? 0 : Infinity, duration: 1.6 }}
          >
            {finished ? 'WELCOME, WARRIOR' : text}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default BoredHandLoader;
