'use client';

// ============================================================
// SamayYudh 2.0 — SOKHA 3D Futuristic Floating Bot Character
// Inspired by interactive 3D robot landing interfaces (Pinterest pin.it/5pGBaUQgZ)
// Features animated LED visor eyes, floating bob physics, glowing thruster,
// antenna pulse, and dynamic emotion states (idle, happy, thinking).
// ============================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SokhaBotCharacterProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  isThinking?: boolean;
  className?: string;
  onClick?: () => void;
  showGreeting?: boolean;
  greetingText?: string;
}

export function SokhaBotCharacter({
  size = 'md',
  isThinking = false,
  className,
  onClick,
  showGreeting = false,
  greetingText = "Hey! Need help studying?",
}: SokhaBotCharacterProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [blink, setBlink] = useState(false);

  // Periodic blinking effect for life-like presence
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  const dimensions = {
    sm: { width: 44, height: 48, scale: 0.7 },
    md: { width: 64, height: 70, scale: 1 },
    lg: { width: 84, height: 92, scale: 1.3 },
    hero: { width: 120, height: 130, scale: 1.8 },
  }[size];

  return (
    <div
      className={cn('relative select-none flex items-center justify-center group', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* ── Interactive Speech Bubble ───────────────────────── */}
      {showGreeting && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute -top-11 right-0 sm:right-2 z-20 pointer-events-none"
        >
          <div className="relative px-3.5 py-1.5 rounded-2xl bg-[#0c1224]/95 border border-purple-400/40 shadow-[0_8px_25px_rgba(124,58,237,0.45)] backdrop-blur-md text-[11px] font-semibold text-purple-100 whitespace-nowrap flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{greetingText}</span>
            {/* Bubble arrow tip */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#0c1224] border-r border-b border-purple-400/40 rotate-45" />
          </div>
        </motion.div>
      )}

      {/* ── Floating Character Container ─────────────────────── */}
      <motion.div
        animate={{
          y: isHovered ? -12 : [0, -7, 0],
          rotate: isHovered ? [0, -3, 3, 0] : [0, 1.5, -1.5, 0],
        }}
        transition={{
          y: isHovered
            ? { duration: 0.25 }
            : { repeat: Infinity, duration: 3.2, ease: 'easeInOut' },
          rotate: isHovered
            ? { duration: 0.4 }
            : { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
        }}
        className="relative cursor-pointer"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        {/* Soft Ambient Radial Backlight */}
        <div
          className={cn(
            'absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 blur-lg opacity-40 transition-all duration-300 pointer-events-none',
            isHovered && 'opacity-85 blur-xl scale-125',
            isThinking && 'opacity-90 animate-pulse bg-gradient-to-tr from-amber-400 via-purple-600 to-indigo-500'
          )}
        />

        {/* ── 3D Robot SVG ──────────────────────────────────── */}
        <svg
          viewBox="0 0 100 110"
          className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Outer Head 3D Gradient */}
            <linearGradient id="robotHeadGrad" x1="10" y1="15" x2="90" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2A1B4E" />
              <stop offset="0.45" stopColor="#1E1738" />
              <stop offset="1" stopColor="#0B0E20" />
            </linearGradient>

            {/* Gloss Highlight Overlay */}
            <linearGradient id="glossGrad" x1="50" y1="20" x2="50" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" stopOpacity="0.35" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Visor Screen Gradient */}
            <linearGradient id="visorGrad" x1="20" y1="40" x2="80" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="#060914" />
              <stop offset="1" stopColor="#02040A" />
            </linearGradient>

            {/* LED Eye Glow */}
            <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Thruster Flame Gradient */}
            <linearGradient id="thrusterGrad" x1="50" y1="92" x2="50" y2="108" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A855F7" />
              <stop offset="0.6" stopColor="#6366F1" />
              <stop offset="1" stopColor="#06B6D4" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 1. Antenna stem & glowing orb */}
          <path
            d="M50 18 L50 7"
            stroke="#8B5CF6"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="6"
            r="5"
            fill={isThinking ? '#F59E0B' : '#A855F7'}
            filter="url(#eyeGlow)"
          />
          <circle cx="50" cy="6" r="2.5" fill="#FFFFFF" />

          {/* 2. Side Ear Audio Pods */}
          {/* Left Pod */}
          <rect x="8" y="44" width="7" height="18" rx="3.5" fill="#3B2667" stroke="#7C3AED" strokeWidth="1.5" />
          <circle cx="11.5" cy="53" r="2" fill="#C084FC" />
          {/* Right Pod */}
          <rect x="85" y="44" width="7" height="18" rx="3.5" fill="#3B2667" stroke="#7C3AED" strokeWidth="1.5" />
          <circle cx="88.5" cy="53" r="2" fill="#C084FC" />

          {/* 3. Main Head Capsule */}
          <rect
            x="14"
            y="20"
            width="72"
            height="68"
            rx="26"
            fill="url(#robotHeadGrad)"
            stroke="#9333EA"
            strokeWidth="2.5"
          />

          {/* Head Top Specular Gloss Highlight */}
          <ellipse
            cx="50"
            cy="31"
            rx="26"
            ry="7"
            fill="url(#glossGrad)"
          />

          {/* 4. OLED Curved Visor Display */}
          <rect
            x="22"
            y="37"
            width="56"
            height="34"
            rx="14"
            fill="url(#visorGrad)"
            stroke="#6366F1"
            strokeWidth="1.5"
          />

          {/* Subtle visor scanlines */}
          <line x1="26" y1="46" x2="74" y2="46" stroke="#4338CA" strokeWidth="0.5" strokeOpacity="0.4" />
          <line x1="26" y1="54" x2="74" y2="54" stroke="#4338CA" strokeWidth="0.5" strokeOpacity="0.4" />
          <line x1="26" y1="62" x2="74" y2="62" stroke="#4338CA" strokeWidth="0.5" strokeOpacity="0.4" />

          {/* 5. Expressive LED Visor Eyes */}
          {isThinking ? (
            /* Thinking eyes: energetic spinning dashes / spirals */
            <g filter="url(#eyeGlow)">
              <circle cx="38" cy="53" r="5" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="6 4" />
              <circle cx="62" cy="53" r="5" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="6 4" />
            </g>
          ) : isHovered ? (
            /* Happy eyes on hover: happy curve arc ^ ^ */
            <g filter="url(#eyeGlow)">
              <path d="M33 56 Q38 47 43 56" stroke="#22D3EE" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M57 56 Q62 47 67 56" stroke="#22D3EE" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          ) : blink ? (
            /* Blinking state: flat line */
            <g filter="url(#eyeGlow)">
              <line x1="33" y1="54" x2="43" y2="54" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
              <line x1="57" y1="54" x2="67" y2="54" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : (
            /* Standard open eyes: cute expressive glowing rounded ovals */
            <g filter="url(#eyeGlow)">
              {/* Left Eye */}
              <ellipse cx="38" cy="53" rx="5" ry="6.5" fill="#C084FC" />
              <circle cx="36" cy="50.5" r="1.8" fill="#FFFFFF" />
              {/* Right Eye */}
              <ellipse cx="62" cy="53" rx="5" ry="6.5" fill="#C084FC" />
              <circle cx="60" cy="50.5" r="1.8" fill="#FFFFFF" />
            </g>
          )}

          {/* Cute digital blush spots on hover */}
          {isHovered && (
            <g filter="url(#eyeGlow)">
              <ellipse cx="29" cy="62" rx="3.5" ry="1.5" fill="#F472B6" opacity="0.8" />
              <ellipse cx="71" cy="62" rx="3.5" ry="1.5" fill="#F472B6" opacity="0.8" />
            </g>
          )}

          {/* 6. Floating Thruster Underneath */}
          <ellipse
            cx="50"
            cy="90"
            rx="14"
            ry="4"
            fill="#1E163B"
            stroke="#7C3AED"
            strokeWidth="1.5"
          />
          {/* Thruster Jet Plasma Cone */}
          <polygon
            points="42,92 58,92 50,105"
            fill="url(#thrusterGrad)"
            opacity={isHovered ? 1 : 0.75}
          />
        </svg>

        {/* Soft shadow/glow pool on ground */}
        <div
          className={cn(
            'absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full bg-purple-600/40 blur-xs transition-all duration-300',
            isHovered ? 'scale-75 opacity-30' : 'scale-100 opacity-60'
          )}
        />
      </motion.div>
    </div>
  );
}
