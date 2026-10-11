'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface PerformanceBadgeProps {
  title?: string;
  subtitle?: string;
  tier?: 'first_step' | 'getting_better' | 'rising_star' | 'high_achiever' | 'outstanding_progress' | 'personal_best' | 'perfect_score' | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isUnlocked?: boolean;
  showLimbs?: boolean;
  animate?: boolean;
  className?: string;
}

const TIER_CONFIG: Record<string, { label: string; sub: string; accent: string }> = {
  first_step: { label: 'FIRST STEP', sub: 'JOURNEY', accent: '#3b82f6' },
  getting_better: { label: 'GETTING BETTER', sub: '+5% BOOST', accent: '#10b981' },
  rising_star: { label: 'RISING STAR', sub: '+10% JUMP', accent: '#f59e0b' },
  high_achiever: { label: 'HIGH ACHIEVER', sub: '+15% LEAP', accent: '#8b5cf6' },
  outstanding_progress: { label: 'OUTSTANDING', sub: '+20% MASTER', accent: '#ec4899' },
  personal_best: { label: 'PERSONAL BEST', sub: 'PEAK SCORE', accent: '#d97706' },
  perfect_score: { label: 'PERFECT SCORE', sub: '100% GOLD', accent: '#eab308' },
};

export function PerformanceBadge({
  title,
  subtitle,
  tier = 'rising_star',
  size = 'md',
  isUnlocked = true,
  showLimbs = true,
  animate = true,
  className = '',
}: PerformanceBadgeProps) {
  const config = TIER_CONFIG[tier] || {
    label: title || 'RISING STAR',
    sub: subtitle || 'SCORE BOOST',
    accent: '#f59e0b',
  };

  const displayTitle = title || config.label;

  // Sizing map (width & height in px)
  const sizeMap = {
    sm: { w: 100, h: 120, scale: 0.65 },
    md: { w: 140, h: 170, scale: 0.9 },
    lg: { w: 200, h: 240, scale: 1.25 },
    xl: { w: 260, h: 310, scale: 1.6 },
  };

  const { w, h } = sizeMap[size];

  return (
    <motion.div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: w, height: h }}
      whileHover={animate && isUnlocked ? { scale: 1.05, rotate: 2 } : undefined}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
    >
      <svg
        viewBox="0 0 200 240"
        className={`w-full h-full drop-shadow-xl ${!isUnlocked ? 'filter grayscale opacity-40' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic Gold Pin Gradient */}
          <linearGradient id="shieldGoldGrad" x1="20" y1="20" x2="180" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF1B8" />
            <stop offset="25%" stopColor="#F5B82A" />
            <stop offset="70%" stopColor="#D98A16" />
            <stop offset="100%" stopColor="#B3690B" />
          </linearGradient>

          {/* Enamel Gloss Overlay */}
          <linearGradient id="shieldGloss" x1="40" y1="20" x2="160" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Golden Rim Bevel */}
          <linearGradient id="shieldRim" x1="0" y1="0" x2="200" y2="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFEAA7" />
            <stop offset="40%" stopColor="#C4881C" />
            <stop offset="70%" stopColor="#FFE082" />
            <stop offset="100%" stopColor="#8A5200" />
          </linearGradient>

          {/* Subtle 3D Pin Drop Shadow */}
          <filter id="pinShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#784200" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* ── Cartoon Doodled Limbs (Inspired by Ref 1) ── */}
        {showLimbs && (
          <g className="cartoon-limbs" stroke="#1E1E1E" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Left Hand Arm */}
            <path d="M 50 120 Q 20 115 14 90" />
            <circle cx="14" cy="88" r="6" fill="#1E1E1E" />

            {/* Right Hand Arm (Cheering waving up) */}
            <path d="M 150 120 Q 180 115 186 90" />
            <circle cx="186" cy="88" r="6" fill="#1E1E1E" />

            {/* Left Foot Leg */}
            <path d="M 75 195 Q 60 215 50 218" />
            <ellipse cx="48" cy="219" rx="8" ry="4.5" fill="#1E1E1E" />

            {/* Right Foot Leg */}
            <path d="M 125 195 Q 140 215 150 218" />
            <ellipse cx="152" cy="219" rx="8" ry="4.5" fill="#1E1E1E" />
          </g>
        )}

        {/* ── Handwritten-style sparkles around the pin (Ref 1) ── */}
        {isUnlocked && (
          <g stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
            {/* Top sparkle */}
            <path d="M 35 45 L 35 30 M 35 45 L 35 60 M 35 45 L 20 45 M 35 45 L 50 45" />
            {/* Top-right star doodle */}
            <path d="M 165 35 Q 170 30 175 35 Q 180 40 175 45 Q 170 50 165 45 Q 160 40 165 35 Z" fill="#FCD34D" />
          </g>
        )}

        {/* ── Golden Shield Outer Rim / Bevel ── */}
        <path
          d="M 100 28 C 135 28 168 18 174 38 C 178 78 170 148 100 205 C 30 148 22 78 26 38 C 32 18 65 28 100 28 Z"
          fill="url(#shieldRim)"
          filter="url(#pinShadow)"
          stroke="#945800"
          strokeWidth="3.5"
        />

        {/* ── Golden Shield Inner Gloss Enamel Surface ── */}
        <path
          d="M 100 36 C 130 36 156 28 162 44 C 165 76 158 136 100 188 C 42 136 35 76 38 44 C 44 28 70 36 100 36 Z"
          fill="url(#shieldGoldGrad)"
          stroke="#804A00"
          strokeWidth="2.5"
        />

        {/* ── Upper Curved Gloss Highlight (Ref 1 enamel glass look) ── */}
        <path
          d="M 100 38 C 126 38 148 32 154 45 C 156 60 148 88 100 96 C 52 88 44 60 46 45 C 52 32 74 38 100 38 Z"
          fill="url(#shieldGloss)"
        />

        {/* ── Hand-Drawn / Pin Enamel Banner Strip Across Shield ── */}
        <g id="shieldBanner">
          <path
            d="M 38 98 C 65 92 135 92 162 98 L 164 126 C 135 120 65 120 36 126 Z"
            fill="#FFFBEB"
            fillOpacity="0.25"
            stroke="#7A4400"
            strokeWidth="2.5"
          />

          {/* Banner Title (STAR OF THE WEEK / RISING STAR / ETC) */}
          <text
            x="100"
            y="114"
            textAnchor="middle"
            fill="#361B00"
            fontSize="11"
            fontWeight="900"
            letterSpacing="0.8"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {displayTitle.toUpperCase()}
          </text>
        </g>

        {/* ── Friendly Cute Character Face (From Reference 1) ── */}
        <g id="pinFace">
          {/* Left Eye */}
          <circle cx="84" cy="148" r="4.5" fill="#2B1400" />
          <circle cx="82.5" cy="146.5" r="1.5" fill="#FFFFFF" />

          {/* Right Eye */}
          <circle cx="116" cy="148" r="4.5" fill="#2B1400" />
          <circle cx="114.5" cy="146.5" r="1.5" fill="#FFFFFF" />

          {/* Rosy Blush Cheeks */}
          <circle cx="76" cy="154" r="5" fill="#FF7A8A" opacity="0.65" />
          <circle cx="124" cy="154" r="5" fill="#FF7A8A" opacity="0.65" />

          {/* Cute Smiling Mouth */}
          <path
            d="M 94 156 Q 100 163 106 156"
            stroke="#2B1400"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* ── Metallic Rim Highlight Lines (Realistic Enamel Sheen) ── */}
        <path
          d="M 44 48 C 50 38 75 42 98 42"
          stroke="#FFFDEB"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M 152 56 C 158 80 152 130 106 178"
          stroke="#FFF5C2"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    </motion.div>
  );
}
