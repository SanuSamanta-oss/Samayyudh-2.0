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
        {/* Soft Ambient Radial Backlight - Vibrant Cyan/Electric Blue */}
        <div
          className={cn(
            'absolute inset-0 rounded-3xl bg-gradient-to-tr from-sky-500 via-cyan-400 to-blue-500 blur-xl opacity-50 transition-all duration-300 pointer-events-none',
            isHovered && 'opacity-90 blur-2xl scale-125',
            isThinking && 'opacity-95 animate-pulse bg-gradient-to-tr from-cyan-300 via-sky-400 to-blue-600'
          )}
        />

        {/* ── 3D Robot SVG ──────────────────────────────────── */}
        <svg
          viewBox="0 0 100 110"
          className="w-full h-full drop-shadow-[0_12px_24px_rgba(2,132,199,0.45)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Outer Squircle / Head Body Gradient: Vibrant Electric Blue to Sky Blue */}
            <linearGradient id="robotHeadGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00A6FF" />
              <stop offset="0.5" stopColor="#0284C7" />
              <stop offset="1" stopColor="#0369A1" />
            </linearGradient>

            {/* Gloss Highlight Overlay */}
            <linearGradient id="glossGrad" x1="50" y1="18" x2="50" y2="45" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Glowing White/Cyan Luminous Visor Dome (Matching Image White Glow) */}
            <radialGradient id="luminousDomeGrad" cx="50" cy="55" r="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="35%" stopColor="#7DD3FC" />
              <stop offset="70%" stopColor="#E0F2FE" />
              <stop offset="90%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </radialGradient>

            {/* Inner Visor Core Blue */}
            <radialGradient id="visorInnerGrad" cx="50" cy="54" r="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00A6FF" />
              <stop offset="55%" stopColor="#0284C7" />
              <stop offset="85%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
            </radialGradient>

            {/* Pure White Glowing Eye Filter */}
            <filter id="eyeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Thruster Flame Gradient: Cyan & Electric Blue */}
            <linearGradient id="thrusterGrad" x1="50" y1="92" x2="50" y2="108" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="0.6" stopColor="#0284C7" />
              <stop offset="1" stopColor="#00A6FF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 1. Antenna stem & glowing orb in Cyan/Blue */}
          <path
            d="M50 18 L50 7"
            stroke="#0284C7"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="6"
            r="5"
            fill={isThinking ? '#F59E0B' : '#38BDF8'}
            filter="url(#eyeGlow)"
          />
          <circle cx="50" cy="6" r="2.5" fill="#FFFFFF" />

          {/* 2. Side Ear Audio Pods in Matching Sky Blue */}
          {/* Left Pod */}
          <rect x="8" y="44" width="7" height="18" rx="3.5" fill="#0369A1" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="11.5" cy="53" r="2" fill="#E0F2FE" />
          {/* Right Pod */}
          <rect x="85" y="44" width="7" height="18" rx="3.5" fill="#0369A1" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="88.5" cy="53" r="2" fill="#E0F2FE" />

          {/* 3. Main Head Capsule: Rounded squircle app-icon shape */}
          <rect
            x="14"
            y="18"
            width="72"
            height="72"
            rx="24"
            fill="url(#robotHeadGrad)"
            stroke="#38BDF8"
            strokeWidth="2.5"
          />

          {/* Head Top Specular Gloss Highlight */}
          <ellipse
            cx="50"
            cy="27"
            rx="26"
            ry="6"
            fill="url(#glossGrad)"
          />

          {/* 4. The Iconic White Crescent / Glowing Inner Dome (Directly from reference image) */}
          <path
            d="M 18 64 C 18 36, 32 26, 50 26 C 68 26, 82 36, 82 64 C 82 78, 68 84, 50 84 C 32 84, 18 78, 18 64 Z"
            fill="url(#luminousDomeGrad)"
          />

          {/* Inner Cyan-Blue Center Visor */}
          <ellipse
            cx="50"
            cy="56"
            rx="28"
            ry="24"
            fill="url(#visorInnerGrad)"
          />

          {/* 5. Expressive Slightly Tilted Glowing White Eyes (Matching Reference Image) */}
          {isThinking ? (
            /* Thinking eyes: energetic spinning dashes / spirals */
            <g filter="url(#eyeGlow)">
              <circle cx="40" cy="55" r="5" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="6 4" />
              <circle cx="60" cy="54" r="5" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="6 4" />
            </g>
          ) : isHovered ? (
            /* Happy eyes on hover: happy glowing curve arc ^ ^ */
            <g filter="url(#eyeGlow)">
              <path d="M35 57 Q40 47 45 57" stroke="#FFFFFF" strokeWidth="3.8" strokeLinecap="round" />
              <path d="M57 56 Q62 46 67 56" stroke="#FFFFFF" strokeWidth="3.8" strokeLinecap="round" />
            </g>
          ) : blink ? (
            /* Blinking state: sleek white line */
            <g filter="url(#eyeGlow)">
              <line x1="34" y1="55" x2="46" y2="55" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="56" y1="54" x2="68" y2="54" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          ) : (
            /* Standard open eyes: iconic tilted organic white glowing ovals from reference photo */
            <g filter="url(#eyeGlow)">
              {/* Left Eye - tilted oval */}
              <ellipse
                cx="40"
                cy="56"
                rx="5.8"
                ry="7.8"
                fill="#FFFFFF"
                transform="rotate(8 40 56)"
              />
              <circle cx="42" cy="53" r="1.8" fill="#F0F9FF" opacity="0.9" />

              {/* Right Eye - slightly larger / tilted oval as in reference */}
              <ellipse
                cx="61"
                cy="54"
                rx="6.4"
                ry="8.2"
                fill="#FFFFFF"
                transform="rotate(12 61 54)"
              />
              <circle cx="63" cy="51" r="2" fill="#F0F9FF" opacity="0.9" />
            </g>
          )}

          {/* Cute digital blush spots on hover */}
          {isHovered && (
            <g filter="url(#eyeGlow)">
              <ellipse cx="28" cy="64" rx="3.5" ry="1.5" fill="#38BDF8" opacity="0.8" />
              <ellipse cx="72" cy="62" rx="3.5" ry="1.5" fill="#38BDF8" opacity="0.8" />
            </g>
          )}

          {/* 6. Floating Thruster Underneath */}
          <ellipse
            cx="50"
            cy="92"
            rx="14"
            ry="4"
            fill="#0369A1"
            stroke="#38BDF8"
            strokeWidth="1.5"
          />
          {/* Thruster Jet Plasma Cone */}
          <polygon
            points="42,94 58,94 50,107"
            fill="url(#thrusterGrad)"
            opacity={isHovered ? 1 : 0.8}
          />
        </svg>

        {/* Soft shadow/glow pool on ground */}
        <div
          className={cn(
            'absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full bg-sky-500/40 blur-xs transition-all duration-300',
            isHovered ? 'scale-75 opacity-30' : 'scale-100 opacity-60'
          )}
        />
      </motion.div>
    </div>
  );
}
