'use client';

// ============================================================
// SamayYudh 2.0 — Bored Hand Tapping Loading Animation
// Authentic cartoon hand tapping rhythmically on pure black background
// Used ONLY ONCE for user's initial account onboarding/first-ever login.
// Once user has logged in once, this animation is NEVER shown anywhere.
// ============================================================

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { hasUserLoggedInBefore } from '@/lib/auth-welcome';

export interface BoredHandLoaderProps {
  text?: string;
  finished?: boolean;
  handOnly?: boolean;
  /** Force display even if user has logged in before (e.g. for developer preview) */
  forceShow?: boolean;
}

export function BoredHandLoader({
  text = 'LOADING...',
  finished = false,
  handOnly = false,
  forceShow = false,
}: BoredHandLoaderProps) {
  const [shouldHideAnimation, setShouldHideAnimation] = useState(() => {
    if (forceShow) return false;
    return typeof window !== 'undefined' ? hasUserLoggedInBefore() : false;
  });

  useEffect(() => {
    if (!forceShow && hasUserLoggedInBefore()) {
      setShouldHideAnimation(true);
    }
  }, [forceShow]);

  // If user has logged in once, NO MORE this animation should be shown anywhere
  if (shouldHideAnimation) {
    const isCustomText = text && text.trim().toUpperCase() !== 'LOADING...' && text.trim().toUpperCase() !== 'LOADING';
    return (
      <div className="flex flex-col items-center justify-center w-full h-full min-h-[160px] bg-black select-none">
        <motion.div
          className="flex flex-col items-center justify-center text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-48 sm:w-56 h-1 bg-zinc-900 rounded-full overflow-hidden relative border border-zinc-800">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-stone-400 via-white to-stone-300 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.7)]"
              initial={{ width: '0%' }}
              animate={{ width: finished ? '100%' : '88%' }}
              transition={{ duration: finished ? 0.25 : 1.5, ease: 'easeOut' }}
            />
          </div>
          {(isCustomText || finished) && (
            <p className="text-stone-300 text-xs sm:text-sm font-bold tracking-[0.25em] pl-[0.25em] uppercase mt-4">
              {finished ? 'WELCOME, WARRIOR' : text}
            </p>
          )}
        </motion.div>
      </div>
    );
  }

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
