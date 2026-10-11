'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface StreakMedalProps {
  milestoneDays?: number;
  title?: string;
  tier?: 'bronze_spark' | 'silver_flame' | 'golden_dedication' | 'platinum_star' | 'legendary_achiever' | 'eternal_champion' | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isUnlocked?: boolean;
  animate?: boolean;
  className?: string;
}

const MEDAL_TIERS: Record<string, { days: number; name: string; ribbon1: string; ribbon2: string; coreStop: string }> = {
  bronze_spark: { days: 3, name: 'Bronze Spark', ribbon1: '#d97706', ribbon2: '#b45309', coreStop: '#f59e0b' },
  silver_flame: { days: 7, name: 'Silver Flame', ribbon1: '#94a3b8', ribbon2: '#64748b', coreStop: '#e2e8f0' },
  golden_dedication: { days: 20, name: 'Golden Dedication', ribbon1: '#f59e0b', ribbon2: '#d97706', coreStop: '#fbbf24' },
  platinum_star: { days: 30, name: 'Platinum Star', ribbon1: '#06b6d4', ribbon2: '#0891b2', coreStop: '#67e8f9' },
  legendary_achiever: { days: 50, name: 'Legendary Achiever', ribbon1: '#8b5cf6', ribbon2: '#7c3aed', coreStop: '#c084fc' },
  eternal_champion: { days: 100, name: 'Eternal Champion', ribbon1: '#f43f5e', ribbon2: '#e11d48', coreStop: '#fda4af' },
};

export function StreakMedal({
  milestoneDays = 7,
  title,
  tier = 'golden_dedication',
  size = 'md',
  isUnlocked = true,
  animate = true,
  className = '',
}: StreakMedalProps) {
  const currentTier = MEDAL_TIERS[tier] || {
    days: milestoneDays,
    name: title || `${milestoneDays}-Day Streak`,
    ribbon1: '#f59e0b',
    ribbon2: '#d97706',
    coreStop: '#fbbf24',
  };

  const sizeMap = {
    sm: { w: 90, h: 110 },
    md: { w: 140, h: 170 },
    lg: { w: 200, h: 240 },
    xl: { w: 260, h: 310 },
  };

  const { w, h } = sizeMap[size];

  return (
    <motion.div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: w, height: h }}
      whileHover={animate && isUnlocked ? { scale: 1.06, rotate: 2 } : undefined}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
    >
      <svg
        viewBox="0 0 220 270"
        className={`w-full h-full drop-shadow-2xl ${!isUnlocked ? 'filter grayscale opacity-35' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Top Hanging Bar Gradient */}
          <linearGradient id="hangerGrad" x1="40" y1="10" x2="180" y2="25" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF9E0" />
            <stop offset="50%" stopColor="#F5B82A" />
            <stop offset="100%" stopColor="#B3690B" />
          </linearGradient>

          {/* Ribbon Gradients */}
          <linearGradient id="ribbonGrad" x1="0" y1="20" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={currentTier.ribbon1} />
            <stop offset="100%" stopColor={currentTier.ribbon2} />
          </linearGradient>

          {/* 3D Gold Star Backing */}
          <linearGradient id="starFacetTop" x1="110" y1="60" x2="110" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF3B8" />
            <stop offset="40%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Circular Face Medallion */}
          <linearGradient id="medallionRim" x1="30" y1="70" x2="190" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFDE6" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="75%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          <radialGradient id="medallionCore" cx="110" cy="150" r="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="50%" stopColor={currentTier.coreStop} />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>

          {/* Glass Highlight */}
          <linearGradient id="glassSweep" x1="60" y1="90" x2="160" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          <filter id="medal3DShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#78350F" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* ── Top Hanging Pin Bar ── */}
        <rect x="42" y="10" width="136" height="15" rx="7.5" fill="url(#hangerGrad)" stroke="#B45309" strokeWidth="2" />
        <rect x="58" y="14" width="104" height="6" rx="3" fill="#FFF9E0" fillOpacity="0.6" />

        {/* ── Folded Ribbon Strips (Reference 2) ── */}
        <g id="ribbon">
          <path d="M 64 25 L 64 105 L 88 95 L 88 25 Z" fill="url(#ribbonGrad)" opacity="0.95" />
          <path d="M 88 25 L 88 95 L 110 88 L 110 25 Z" fill="#FFFFFF" fillOpacity="0.3" />
          <path d="M 110 25 L 110 88 L 132 95 L 132 25 Z" fill="#FFFFFF" fillOpacity="0.3" />
          <path d="M 132 25 L 132 105 L 156 95 L 156 25 Z" fill="url(#ribbonGrad)" opacity="0.95" />
          <path d="M 64 25 L 156 25 L 156 32 L 64 32 Z" fill="#000000" fillOpacity="0.15" />
        </g>

        {/* ── Layered Geometric 6-Point Gold Star (Ref 2 backing) ── */}
        <g id="geometricStarBacking" filter="url(#medal3DShadow)">
          {/* Outer Star Silhouette */}
          <polygon
            points="
              110,50 132,96 182,90 156,134 192,172 142,184
              110,228 78,184 28,172 64,134 38,90 88,96
            "
            fill="url(#starFacetTop)"
            stroke="#B45309"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Facet Shading Lines for 3D Chiseled Look */}
          <path d="M 110 50 L 110 148" stroke="#FFF7C2" strokeWidth="2.5" />
          <path d="M 182 90 L 110 148" stroke="#92400E" strokeWidth="2.5" />
          <path d="M 192 172 L 110 148" stroke="#78350F" strokeWidth="2.5" />
          <path d="M 110 228 L 110 148" stroke="#92400E" strokeWidth="2.5" />
          <path d="M 28 172 L 110 148" stroke="#FFF7C2" strokeWidth="2.5" />
          <path d="M 38 90 L 110 148" stroke="#FFFBEB" strokeWidth="2.5" />
        </g>

        {/* ── Circular Medal Bevel & Outer Ring ── */}
        <circle cx="110" cy="148" r="64" fill="url(#medallionRim)" stroke="#92400E" strokeWidth="4" />
        <circle cx="110" cy="148" r="54" fill="url(#medallionCore)" stroke="#B45309" strokeWidth="2.5" />

        {/* ── Central Embossed 5-Point Star (Ref 2 focal element) ── */}
        <g id="centralStar">
          {/* Star Outer Bevel Shadow */}
          <polygon
            points="110,104 121,133 152,134 127,152 136,182 110,164 84,182 93,152 68,134 99,133"
            fill="#B45309"
          />
          {/* Star Front Face */}
          <polygon
            points="110,107 120,134 149,135 125,151 134,178 110,161 86,178 95,151 71,135 100,134"
            fill="#FFFBEB"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Star Inner Facet Highlight */}
          <path d="M 110 107 L 110 148 L 149 135" fill="#FFE58F" opacity="0.8" />
          <path d="M 110 148 L 134 178 L 110 161" fill="#F59E0B" opacity="0.6" />
          <path d="M 110 148 L 86 178 L 110 161" fill="#D97706" opacity="0.7" />
          <path d="M 110 107 L 110 148 L 71 135" fill="#FFFFFF" opacity="0.9" />
        </g>

        {/* ── Curved Glass Sheen / Reflection Across Medallion (Ref 2) ── */}
        <path
          d="M 58 120 C 75 95 145 95 162 120 C 145 155 75 155 58 120 Z"
          fill="url(#glassSweep)"
        />

        {/* ── Sparkle Highlights ── */}
        {isUnlocked && (
          <g fill="#FFFFFF">
            {/* Sparkle 1 */}
            <path d="M 72 108 Q 74 114 80 114 Q 74 114 72 120 Q 70 114 64 114 Q 70 114 72 108 Z" opacity="0.9" />
            {/* Sparkle 2 */}
            <path d="M 152 188 Q 153.5 192 158 192 Q 153.5 192 152 196 Q 150.5 192 146 192 Q 150.5 192 152 188 Z" opacity="0.85" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}
