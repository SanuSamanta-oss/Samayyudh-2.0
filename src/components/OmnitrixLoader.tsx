'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { BoredHandLoader } from './BoredHandLoader';

export function OmnitrixLoader({ 
  text = 'LOADING...', 
  finished = false,
  variant = 'penspin',
}: { 
  text?: string;
  finished?: boolean;
  logoUrl?: string;
  variant?: 'penspin' | 'boredhand';
}) {
  if (variant === 'boredhand') {
    return <BoredHandLoader text={text} finished={finished} />;
  }

  const showCustomText = text && text.trim().toUpperCase() !== 'LOADING...' && text.trim().toUpperCase() !== 'LOADING';

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[360px] bg-black select-none">
      <motion.div 
        className="relative flex flex-col items-center justify-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Exact Pen Spinning Hand Animation from Pinterest (pin.it/3ZPwVZTHf) on Black Screen */}
        <div className="relative flex items-center justify-center">
          <picture>
            <source srcSet="/pen_spin_black.webp" type="image/webp" />
            <img 
              src="/pen_spin_black.gif" 
              alt="Loading animation" 
              className="w-[260px] sm:w-[320px] md:w-[380px] h-auto object-contain pointer-events-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]"
            />
          </picture>
        </div>

        {/* Dynamic Contextual Text (if specific exam or action is being prepared) */}
        {showCustomText && (
          <motion.p
            className="text-stone-300 text-xs sm:text-sm font-bold tracking-[0.25em] text-center uppercase mt-6 sm:mt-8 px-4"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: finished ? 1 : [0.7, 1, 0.7] }}
            transition={{ repeat: finished ? 0 : Infinity, duration: 1.6 }}
          >
            {finished ? 'READY' : text}
          </motion.p>
        )}

        {/* Minimal High-Tech Progress Bar on Black Screen */}
        <div className={`w-56 sm:w-64 h-1 bg-zinc-900 rounded-full ${showCustomText ? 'mt-3 sm:mt-4' : 'mt-6 sm:mt-8'} overflow-hidden relative border border-zinc-800`}>
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-stone-400 via-white to-stone-300 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.7)]"
            initial={{ width: "0%" }}
            animate={{ width: finished ? "100%" : "88%" }}
            transition={{ duration: finished ? 0.3 : 2.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}

// Named alias exports for cleaner imports
export const PenSpinLoader = OmnitrixLoader;
export { BoredHandLoader };
export const LoadingScreen = OmnitrixLoader;
export default OmnitrixLoader;

