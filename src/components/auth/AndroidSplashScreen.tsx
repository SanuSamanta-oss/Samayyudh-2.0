'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function AndroidSplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B0F19] text-white select-none px-6"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      {/* App Logo */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-6"
      >
        <div className="w-24 h-24 rounded-3xl overflow-hidden bg-black border border-white/15 shadow-2xl flex items-center justify-center">
          <Image
            src="/icon-512.png"
            alt="সময়যুদ্ধ 2.0"
            width={96}
            height={96}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </motion.div>

      {/* Brand Title */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="text-center space-y-1.5"
      >
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl font-black tracking-tight text-white">
            সময়যুদ্ধ
          </h1>
          <span className="text-xs font-bold text-teal-400 bg-teal-950/80 border border-teal-800/80 px-2 py-0.5 rounded-md">
            2.0
          </span>
        </div>
        <p className="text-xs text-slate-400 font-medium tracking-wide">
          The Battle Between You &amp; The Clock
        </p>
      </motion.div>

      {/* Loading Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="mt-10 w-36 h-1 rounded-full bg-white/10 overflow-hidden"
      >
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          className="w-1/2 h-full bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full"
        />
      </motion.div>
    </motion.div>
  );
}
