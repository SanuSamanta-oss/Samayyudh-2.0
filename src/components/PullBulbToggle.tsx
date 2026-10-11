'use client';

// ============================================================
// SamayYudh 2.0 — Pull-Cord Animated Bulb Theme Switcher
// Interactive hanging lamp with physics pull-string, audio click,
// realistic spring recoil, cord wiggle, and dynamic bulb glow.
// Pulling the cord toggles between Light Mode and Dark Mode.
// BULB IS ROTATED 180° — glass dome faces DOWN, cap faces UP.
// The cord hangs from the bottom of the glass dome.
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Pre-defined wavy cord paths for the classic pull animation ripple
// Cord now starts from the bottom of the inverted bulb (dome at bottom)
// Cord origin Y = 260 (bottom of inverted dome), end Y = 410
const CORD_PULL_PATHS = [
  // 0: straight rest
  'M 98.7 260 L 98.7 410',
  // 1: wave phase 1
  'M 98.7 260 Q 126.7 297 98.7 335 Q 70.7 373 98.7 410',
  // 2: wave phase 2 (recoil reverse)
  'M 98.7 260 Q 78.7 297 98.7 335 Q 118.7 373 98.7 410',
  // 3: wave phase 3 (tighter wave)
  'M 98.7 260 Q 114.7 297 98.7 335 Q 82.7 373 98.7 410',
  // 4: slight oscillation
  'M 98.7 260 Q 88.7 297 98.7 335 Q 108.7 373 98.7 410',
];

export function PullBulbToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [waveStep, setWaveStep] = useState(0);

  const startPosRef = useRef({ x: 0, y: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize theme from DOM & localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = saved === 'dark' || (!saved && prefersDark);
    setIsDark(initialDark);

    // Audio setup
    try {
      const audio = new Audio('https://assets.codepen.io/605876/click.mp3');
      audio.preload = 'auto';
      audioRef.current = audio;
    } catch {}

    // Listen to theme changes from other components (like Navbar pill)
    const handleSync = (e: CustomEvent<{ isDark: boolean }>) => {
      if (typeof e.detail?.isDark === 'boolean') {
        setIsDark(e.detail.isDark);
      }
    };
    window.addEventListener('samayyudh:theme-change' as any, handleSync as any);
    return () => {
      window.removeEventListener('samayyudh:theme-change' as any, handleSync as any);
    };
  }, []);

  // Theme toggle action
  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      window.dispatchEvent(new CustomEvent('samayyudh:theme-change', { detail: { isDark: next } }));
      return next;
    });

    // Play click sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    // Trigger cord ripple animation sequence
    setIsPulling(true);
    let step = 1;
    const interval = setInterval(() => {
      if (step < CORD_PULL_PATHS.length) {
        setWaveStep(step);
        step++;
      } else {
        clearInterval(interval);
        setWaveStep(0);
        setIsPulling(false);
      }
    }, 75);
  }, []);

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = (e.clientX - startPosRef.current.x) * 0.45;
    // Disallow pushing cord upwards; restrict maximum downward stretch to 55px
    const dy = Math.max(0, Math.min(55, (e.clientY - startPosRef.current.y) * 0.7));
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    // Calculate total displacement traveled
    const dx = Math.abs(e.clientX - startPosRef.current.x);
    const dy = Math.abs(e.clientY - startPosRef.current.y);
    const distance = Math.hypot(dx, dy);

    // Rebound smoothly back to (0, 0)
    setDragOffset({ x: 0, y: 0 });

    // If pulled more than 16px, or quick tap/click, trigger toggle
    if (distance > 16 || distance < 4) {
      toggleTheme();
    }
  };

  if (!mounted) {
    return <div className="w-16 h-32 md:w-20 md:h-40" />;
  }

  // Determine current active cord path
  // Cord hangs from bottom of inverted bulb dome (Y=260) down to Y=410
  const restCordStartY = 260;
  const restCordEndY = 410;
  const currentCordEndX = 98.7 + dragOffset.x;
  const currentCordEndY = restCordEndY + dragOffset.y;

  const currentCordPath = isDragging
    ? `M 98.7 ${restCordStartY} Q ${98.7 + dragOffset.x * 0.3} ${(restCordStartY + currentCordEndY) / 2} ${currentCordEndX.toFixed(1)} ${currentCordEndY.toFixed(1)}`
    : isPulling && waveStep > 0
    ? CORD_PULL_PATHS[waveStep]
    : `M 98.7 ${restCordStartY} L 98.7 ${restCordEndY}`;

  // ── Bulb geometry constants ──
  // Original bulb center in local-group coords: (-745.343, ~800)
  // After translate(844.069, -645.213) → SVG coords ~(98.7, 155)
  // The bulb spans roughly from Y=55 (dome top) to Y=237 (cap bottom) in SVG space
  // Rotation center in SVG space: (98.7, 146) — center of the bulb body
  const bulbCenterX = 98.7;
  const bulbCenterY = 146;

  return (
    <div
      className="relative select-none animate-bulb-sway"
      style={{
        width: '75px',
        height: '220px',
        transformOrigin: 'top center',
      }}
      title={isDark ? 'Pull cord to switch to Light Mode' : 'Pull cord to switch to Dark Mode'}
    >
      <svg
        className="w-full h-full overflow-visible"
        viewBox="-10 0 220 520"
        preserveAspectRatio="xMidYMin meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cord ball marker */}
          <marker
            id="cord-ball-end"
            orient="auto"
            overflow="visible"
            refX="0"
            refY="0"
          >
            <path
              fillRule="evenodd"
              strokeWidth="0.5"
              className={isDark ? 'fill-amber-400 stroke-amber-500' : 'fill-stone-600 stroke-stone-700'}
              d="M 1.8 0 A 2 2 0 1 1 -2.2 0 A 2 2 0 0 1 1.8 0 Z"
            />
          </marker>

          {/* Clip path for bulb cap metallic sheen */}
          <clipPath id="cap-clip" clipPathUnits="userSpaceOnUse">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4.677"
              d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v53.6s-8.825 16-29.203 16c-21.674 0-29.203-16-29.203-16z"
            />
          </clipPath>

          {/* Glowing Radial Gradient for On state */}
          <radialGradient id="bulb-warm-glow" cx="48%" cy="52%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="25%" stopColor="#fffbeb" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#fde047" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#f59e0b" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.3" />
          </radialGradient>

          {/* Soft Glass Off State Gradient */}
          <radialGradient id="bulb-off-glass" cx="45%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#cbd5e1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* ── TOP SUSPENSION WIRE (Starts cleanly from bottom edge of button down to bulb cap) ── */}
        <line
          x1="98.7"
          y1="-2"
          x2="98.7"
          y2="55"
          stroke={isDark ? '#64748b' : '#94a3b8'}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* ── THE LIGHT BULB BODY — ROTATED 180° (dome faces down) ── */}
        <g
          transform={`translate(844.069 -645.213) rotate(180 -745.343 800)`}
          className="transition-all duration-300"
        >
          {/* Outer Atmospheric Aura Glow when ON */}
          {isDark && (
            <circle
              cx="-745.343"
              cy="743.939"
              r="105"
              fill="rgba(253, 224, 71, 0.18)"
              className="animate-pulse"
              style={{ filter: 'blur(16px)' }}
            />
          )}

          {/* Bulb Metallic Screw Cap Base (now at top after rotation) */}
          <path
            fill={isDark ? '#475569' : '#64748b'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4.677"
            d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v53.6s-8.825 16-29.203 16c-21.674 0-29.203-16-29.203-16z"
          />

          {/* Cap Metallic Shine Stripe */}
          <path
            fill={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)'}
            d="M-778.379 802.873h25.512v118.409h-25.512z"
            clipPath="url(#cap-clip)"
            transform="matrix(.52452 0 0 .90177 -368.282 82.976)"
          />

          {/* Cap Lower Rim (now upper rim after rotation) */}
          <path
            fill={isDark ? '#334155' : '#475569'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v0s-8.439 10.115-28.817 10.115c-21.673 0-29.59-10.115-29.59-10.115z"
          />

          {/* Cap Outline */}
          <path
            fill="none"
            stroke={isDark ? '#1e293b' : '#334155'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4.677"
            d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v53.6s-8.825 16-29.203 16c-21.674 0-29.203-16-29.203-16z"
          />

          {/* Tungsten Filament */}
          <g
            fill="none"
            strokeLinecap="round"
            strokeWidth="5"
            stroke={isDark ? '#fef08a' : '#94a3b8'}
            className="transition-colors duration-200"
          >
            <path d="M-752.914 823.875l-8.858-33.06" />
            <path d="M-737.772 823.875l8.858-33.06" />
            {isDark && (
              <path
                d="M-761.772 790.815 Q -745.343 782 -728.914 790.815"
                stroke="#fff"
                strokeWidth="4"
                strokeLinecap="round"
              />
            )}
          </g>

          {/* Glass Envelope Bulb Dome (now faces downward) */}
          <path
            strokeLinecap="round"
            strokeWidth="5"
            stroke={isDark ? 'rgba(254, 240, 138, 0.9)' : '#64748b'}
            fill={isDark ? 'url(#bulb-warm-glow)' : 'url(#bulb-off-glass)'}
            style={{
              filter: isDark ? 'drop-shadow(0 0 25px rgba(253, 224, 71, 0.75))' : 'none',
              transition: 'fill 0.3s ease, filter 0.3s ease, stroke 0.3s ease',
            }}
            d="M-783.192 803.855c5.251 8.815 5.295 21.32 13.272 27.774 12.299 8.045 36.46 8.115 49.127 0 7.976-6.454 8.022-18.96 13.273-27.774 3.992-6.7 14.408-19.811 14.408-19.811 8.276-11.539 12.769-24.594 12.769-38.699 0-35.898-29.102-65-65-65-35.899 0-65 29.102-65 65 0 13.667 4.217 26.348 12.405 38.2 0 0 10.754 13.61 14.746 20.31z"
          />

          {/* Glass Highlight Curved Reflection */}
          <path
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="11"
            stroke={isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.85)'}
            d="M-789.19 757.501a45.897 45.897 0 013.915-36.189 45.897 45.897 0 0129.031-21.957"
          />
        </g>

        {/* ── THE INTERACTIVE PULL CORD (hangs from bottom of dome) ── */}
        <g className="cursor-grab active:cursor-grabbing">
          {/* Main Pull Cord Line / Ripple Wave */}
          <path
            fill="none"
            strokeLinecap="round"
            strokeWidth="5"
            stroke={isDark ? '#e2e8f0' : '#475569'}
            d={currentCordPath}
            markerEnd="url(#cord-ball-end)"
            style={{
              transition: isDragging ? 'none' : 'd 0.15s ease-out',
            }}
          />

          {/* Interactive Touch / Click / Drag Hit Spot */}
          <circle
            cx={currentCordEndX}
            cy={currentCordEndY}
            r="44"
            fill="transparent"
            className="cursor-pointer"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />

          {/* Subtle Pull Indicator Bead */}
          <circle
            cx={currentCordEndX}
            cy={currentCordEndY}
            r="9"
            className={
              isDark
                ? 'fill-amber-400 stroke-amber-200 stroke-2 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                : 'fill-stone-600 stroke-stone-400 stroke-2 shadow-sm'
            }
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        </g>
      </svg>
    </div>
  );
}
