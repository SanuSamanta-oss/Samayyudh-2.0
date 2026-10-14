'use client';

// ============================================================
// SamayYudh 2.0 — Realistic Purple Lanyard ID Card Badges (Refined Size)
// Identical match to reference mockup (https://pin.it/65z4QwIvM):
// - Vibrant purple woven fabric lanyard ribbon with herringbone/twill weave
// - Folded bottom hem with horizontal dashed thread stitch line
// - Polished silver chrome D-ring, cylindrical swivel collar & lobster clip
// - Hook latches through the oblong punch-hole slot of the card
// - Refined, slightly smaller white satin PVC badge with rounded corners & gloss sheen
// - Natural wavy swinging pendulum physics (id-card-wavy)
// - Fanned 3-card deck with interactive touch/mouse drag & spring transitions
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import {
  Timer, PenLine, Target, Brain, Zap, Award,
  BookOpen, BarChart3, Shield, ChevronLeft, ChevronRight,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: Timer,
    title: 'Persistent Timer',
    badge: 'TIME INTELLIGENCE',
    roleTag: 'TIMER',
    desc: 'Survives refresh, tab switches, and network drops. Your time never lies.',
    id: '01',
    code: 'SY2-TMR-88',
  },
  {
    icon: PenLine,
    title: 'Real Answer Writing',
    badge: 'ACTIVE PRACTICE',
    roleTag: 'WRITING',
    desc: 'Write full answers, not just click options. Track word count and structure.',
    id: '02',
    code: 'SY2-RAW-42',
  },
  {
    icon: Target,
    title: 'Time Pressure Analysis',
    badge: 'SPEED DIAGNOSTICS',
    roleTag: 'PRESSURE',
    desc: 'Know exactly where you spend too much — or too little — time.',
    id: '03',
    code: 'SY2-TPA-91',
  },
  {
    icon: Brain,
    title: 'AI Evaluation',
    badge: 'GEMINI 2.5 FLASH',
    roleTag: 'AI ENGINE',
    desc: 'Gemini-powered analysis of correctness, completeness, and exam-readiness.',
    id: '04',
    code: 'SY2-AIE-17',
  },
  {
    icon: Zap,
    title: 'Auto-Save & Offline',
    badge: 'INDEXEDDB BACKUP',
    roleTag: 'OFFLINE',
    desc: 'Answers save automatically. IndexedDB backup keeps data safe offline.',
    id: '05',
    code: 'SY2-ASO-63',
  },
  {
    icon: Award,
    title: 'Half Century & Century',
    badge: 'EXAM MILESTONES',
    roleTag: 'MILESTONE',
    desc: 'Milestone celebrations at 50 and 100 questions. Track your exam readiness.',
    id: '06',
    code: 'SY2-HCC-50',
  },
  {
    icon: BookOpen,
    title: 'Multi-Exam Support',
    badge: 'ALL-INDIA PATTERNS',
    roleTag: 'EXAMS',
    desc: 'GATE, JEE, UPSC, University — one engine, every exam pattern.',
    id: '07',
    code: 'SY2-MES-09',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    badge: 'SCORE DIAGNOSTICS',
    roleTag: 'ANALYTICS',
    desc: 'Score by topic, time per question, weak areas, and readiness metrics.',
    id: '08',
    code: 'SY2-DAN-34',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    badge: 'ROW-LEVEL SECURITY',
    roleTag: 'SECURITY',
    desc: 'Your data is yours. RLS protection. No exposed API keys.',
    id: '09',
    code: 'SY2-SEC-99',
  },
];

type FeatureItem = (typeof features)[number];

function MiniQRCode() {
  return (
    <div className="w-8.5 h-8.5 bg-white p-0.5 rounded-md shadow-xs flex items-center justify-center shrink-0 border border-slate-300">
      <svg viewBox="0 0 29 29" className="w-full h-full text-slate-900" fill="currentColor">
        {/* Top-Left Target */}
        <rect x="2" y="2" width="7" height="7" rx="1" fill="#1e1b4b" />
        <rect x="4" y="4" width="3" height="3" fill="#fff" />
        <rect x="5" y="5" width="1" height="1" fill="#1e1b4b" />

        {/* Top-Right Target */}
        <rect x="20" y="2" width="7" height="7" rx="1" fill="#1e1b4b" />
        <rect x="22" y="4" width="3" height="3" fill="#fff" />
        <rect x="23" y="5" width="1" height="1" fill="#1e1b4b" />

        {/* Bottom-Left Target */}
        <rect x="2" y="20" width="7" height="7" rx="1" fill="#1e1b4b" />
        <rect x="4" y="22" width="3" height="3" fill="#fff" />
        <rect x="5" y="23" width="1" height="1" fill="#1e1b4b" />

        {/* Interior Matrix Data */}
        <rect x="11" y="3" width="2" height="2" />
        <rect x="15" y="3" width="2" height="2" />
        <rect x="11" y="7" width="2" height="2" />
        <rect x="15" y="7" width="2" height="2" />

        <rect x="3" y="11" width="2" height="2" />
        <rect x="7" y="11" width="2" height="2" />
        <rect x="11" y="11" width="3" height="3" />
        <rect x="16" y="11" width="2" height="2" />
        <rect x="21" y="11" width="2" height="2" />
        <rect x="25" y="11" width="2" height="2" />

        <rect x="3" y="15" width="2" height="2" />
        <rect x="7" y="15" width="2" height="2" />
        <rect x="11" y="16" width="2" height="2" />
        <rect x="15" y="15" width="3" height="3" />
        <rect x="21" y="15" width="2" height="2" />
        <rect x="25" y="15" width="2" height="2" />

        <rect x="11" y="21" width="2" height="2" />
        <rect x="15" y="21" width="2" height="2" />
        <rect x="11" y="25" width="2" height="2" />
        <rect x="15" y="25" width="2" height="2" />
        <rect x="21" y="21" width="3" height="3" />
        <rect x="25" y="23" width="2" height="2" />
      </svg>
    </div>
  );
}

// ── Realistic Purple Woven Lanyard Ribbon & Silver Chrome Hardware ──
function LanyardHardware({
  scaleY,
}: {
  scaleY?: ReturnType<typeof useTransform<number, number>>;
}) {
  return (
    <div className="relative flex flex-col items-center z-40 select-none pointer-events-none">
      {/* 1. Purple Woven Twill Ribbon (Slightly refined compact width) */}
      <motion.div
        className="w-10 sm:w-11 h-18 sm:h-20 relative overflow-hidden shadow-xl"
        style={{
          background:
            'linear-gradient(90deg, #6d28d9 0%, #7c3aed 15%, #8b5cf6 36%, #9d5de6 50%, #8b5cf6 64%, #7c3aed 85%, #6d28d9 100%)',
          scaleY: scaleY ?? 1,
          transformOrigin: 'top center',
        }}
      >
        {/* Real woven twill / herringbone texture */}
        <svg
          className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="lanyard-twill-pattern-v3" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M0 2 L2 0 L4 2 L2 4 Z" fill="none" stroke="#ffffff" strokeWidth="0.7" />
              <line x1="0" y1="2" x2="4" y2="2" stroke="#4c1d95" strokeWidth="0.45" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lanyard-twill-pattern-v3)" />
        </svg>

        {/* 3D fabric edge depth & cylindrical lighting */}
        <div className="absolute inset-y-0 left-0 w-1 bg-black/45" />
        <div className="absolute inset-y-0 right-0 w-1 bg-black/45" />
        <div className="absolute inset-y-0 left-1 w-0.5 bg-white/30" />
        <div className="absolute inset-y-0 right-1 w-0.5 bg-black/30" />

        {/* Sewn Fold Line with horizontal thread stitches (Identical to Pinterest photo) */}
        <div className="absolute bottom-4 inset-x-0 px-1 flex flex-col items-center">
          <div className="w-full h-px bg-purple-950/50 shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
          <div className="w-full h-0.5 border-b border-dashed border-purple-200/90 my-[1px]" />
          <div className="w-full h-px bg-white/25" />
        </div>

        {/* Bottom fold roll shadow */}
        <div className="absolute bottom-0 inset-x-0 h-3.5 bg-gradient-to-t from-black/45 to-transparent pointer-events-none" />
      </motion.div>

      {/* 2. Silver Chrome Hardware: D-Ring, Swivel Joint & Lobster Clasp */}
      <div className="relative -mt-1.5 flex flex-col items-center z-40">
        <svg
          width="50"
          height="62"
          viewBox="0 0 54 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
        >
          <defs>
            {/* Polished chrome high-contrast metallic gradient */}
            <linearGradient id="chrome-shine-v3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="16%" stopColor="#f8fafc" />
              <stop offset="38%" stopColor="#94a3b8" />
              <stop offset="65%" stopColor="#e2e8f0" />
              <stop offset="85%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Cylindrical swivel reflection */}
            <linearGradient id="chrome-cyl-v3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="15%" stopColor="#cbd5e1" />
              <stop offset="48%" stopColor="#ffffff" />
              <stop offset="78%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          {/* D-Ring: Curved silver chrome loop where the purple fabric wraps */}
          <path
            d="M 9 2 C 9 20, 47 20, 47 2"
            stroke="url(#chrome-shine-v3)"
            strokeWidth="4.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* D-Ring specular reflection highlight */}
          <path
            d="M 10.5 2 C 10.5 18, 45.5 18, 45.5 2"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.9"
            fill="none"
          />

          {/* Swivel Collar Mechanism */}
          <rect
            x="23"
            y="17"
            width="10"
            height="3"
            rx="1.5"
            fill="url(#chrome-cyl-v3)"
            stroke="#475569"
            strokeWidth="0.5"
          />
          <rect
            x="24.5"
            y="19.5"
            width="7"
            height="5"
            fill="url(#chrome-cyl-v3)"
            stroke="#334155"
            strokeWidth="0.5"
          />
          <ellipse
            cx="28"
            cy="26"
            rx="4.5"
            ry="1.8"
            fill="url(#chrome-shine-v3)"
            stroke="#475569"
            strokeWidth="0.5"
          />

          {/* Clasp Upper Eye Loop */}
          <circle cx="28" cy="31" r="4.2" stroke="url(#chrome-shine-v3)" strokeWidth="2.8" fill="none" />
          <circle cx="28" cy="31" r="4.2" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" fill="none" />

          {/* Lobster Clasp Body */}
          <path
            d="M 24.5 34 C 22 40, 23 46, 25 51 L 26 56"
            stroke="url(#chrome-shine-v3)"
            strokeWidth="3.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Spring Latch Trigger Lever */}
          <path
            d="M 31.5 36 L 31.5 47 C 31.5 48.5, 30 50, 28.5 51"
            stroke="url(#chrome-cyl-v3)"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="32.5" cy="40" r="1.2" fill="#e2e8f0" stroke="#475569" strokeWidth="0.5" />

          {/* Clasp hook stem entering the card slot */}
          <path
            d="M 26 54 C 26 62, 28.5 66, 30.5 66 C 32.5 66, 33.5 62.5, 32.5 58"
            stroke="url(#chrome-shine-v3)"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 26.5 55 C 26.5 61.5, 29 64.5, 30.5 64.5"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.9"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}

// ── Hook Lip extending through slot to front ──
function FrontHookLip() {
  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hook-lip-chrome-v3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#e2e8f0" />
            <stop offset="70%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>
        {/* Curved hook tip coming through the slot to the front */}
        <path
          d="M 10 4 C 10 11, 13 15, 15 15 C 17 15, 18 12, 17 8"
          stroke="url(#hook-lip-chrome-v3)"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 10.5 5 C 10.5 10.5, 13 13.5, 14.8 13.5"
          stroke="#ffffff"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.9"
          fill="none"
        />
      </svg>
    </div>
  );
}

function IDCard({
  feature,
  stackIndex,
  onSwipe,
}: {
  feature: FeatureItem;
  stackIndex: number; // 0 = front center, 1 = left wing, 2 = right wing
  onSwipe: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 3D physics on card drag
  const dragRotateZ = useTransform(x, [-240, 240], [-22, 22]);
  const rotateY = useTransform(x, [-240, 240], [-14, 14]);
  const rotateX = useTransform(y, [-240, 240], [12, -12]);

  const isFront = stackIndex === 0;

  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 70 || Math.abs(info.offset.y) > 75 || Math.abs(info.velocity.x) > 320) {
      onSwipe();
    }
  };

  const Icon = feature.icon;

  // Slightly smaller 3-card fanned resting geometry
  const restingRotation = stackIndex === 0 ? 0 : stackIndex === 1 ? -10 : 10;
  const restingX = stackIndex === 0 ? 0 : stackIndex === 1 ? -32 : 32;
  const restingY = stackIndex === 0 ? 0 : 8;
  const restingScale = stackIndex === 0 ? 1 : 0.94;
  const restingOpacity = stackIndex === 0 ? 1 : 0.88;
  const zIndex = stackIndex === 0 ? 30 : stackIndex === 1 ? 20 : 19;

  return (
    <motion.div
      className="absolute top-0 left-0 right-0 mx-auto flex flex-col items-center select-none"
      style={{
        zIndex,
        x: isFront ? x : restingX,
        y: isFront ? y : restingY,
        rotateZ: isFront ? dragRotateZ : restingRotation,
        rotateY: isFront ? rotateY : 0,
        rotateX: isFront ? rotateX : 0,
        scale: restingScale,
        opacity: restingOpacity,
        transformOrigin: 'top center',
      }}
      drag={isFront}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      transition={{ type: 'spring', stiffness: 290, damping: 25, mass: 1 }}
    >
      {/* ── Refined ID Card Badge (~276px x 416px, Perfectly Proportioned) ── */}
      <motion.div
        className="relative w-[258px] sm:w-[276px] md:w-[286px] h-[396px] sm:h-[416px] md:h-[426px] rounded-[22px] overflow-hidden text-left bg-[#ffffff] border border-slate-200/90 shadow-xl"
        style={{
          boxShadow: isFront
            ? '0 25px 50px -12px rgba(124, 58, 237, 0.22), 0 12px 28px -8px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(15, 23, 42, 0.05), inset 0 1px 2px rgba(255,255,255,0.95)'
            : '0 12px 26px -8px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.04)',
          cursor: isFront ? 'grab' : 'default',
        }}
        whileDrag={{ cursor: 'grabbing', scale: 1.03 }}
      >
        {/* Subtle Security Guilloche Watermark Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="card-security-pattern-v3" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="16" fill="none" stroke="#7c3aed" strokeWidth="0.8" />
              <path
                d="M 20 4 C 12 12, 12 28, 20 36 C 28 28, 28 12, 20 4 Z"
                fill="none"
                stroke="#6d28d9"
                strokeWidth="0.6"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#card-security-pattern-v3)" />
        </svg>

        {/* Specular Diagonal Sheen Reflection (Glossy Plastic Badge Finish) */}
        <div
          className="absolute inset-0 pointer-events-none z-30 rounded-[22px]"
          style={{
            background:
              'linear-gradient(130deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.2) 36%, transparent 58%, rgba(255,255,255,0.25) 100%)',
          }}
        />

        {/* Oblong Punch-Hole Slot at Top Center (Same as Reference Mockup) */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-12 h-3 rounded-full bg-slate-200/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.35),0_1px_1px_rgba(255,255,255,0.9)] z-20 ring-1 ring-slate-300/80" />

        {/* Front Interlocking Clip Hook Lip (passes through the slot on front card) */}
        {isFront && <FrontHookLip />}

        {/* ── Top Header Section ── */}
        <div className="pt-8 px-4 flex items-center justify-between relative z-20">
          {/* Brand & Bengali Subtitle */}
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-[10.5px] font-black tracking-wider text-slate-900 uppercase drop-shadow-xs flex items-center gap-1">
              SAMAYYUDH 2.0
            </span>
            <span className="text-[7.5px] font-bold text-purple-700 tracking-widest uppercase mt-0.5">
              সময়যুদ্ধ · OFFICIAL PASS
            </span>
          </div>

          {/* Verification Status Pill */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[8px] font-bold tracking-wider uppercase shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
            PASS #{feature.id}
          </div>
        </div>

        {/* ── Center Feature Visual Emblem Box (Scaled slightly compact) ── */}
        <div className="flex justify-center mt-3 relative z-10 px-4">
          <div className="w-26 h-26 sm:w-28 sm:h-28 rounded-xl bg-gradient-to-b from-purple-50 via-violet-50/70 to-indigo-50/40 border border-purple-200/90 shadow-inner relative overflow-hidden backdrop-blur-sm flex items-center justify-center ring-1 ring-black/5">
            {/* Ambient purple radial glow */}
            <div className="absolute inset-0 bg-radial from-purple-500/15 via-transparent to-transparent pointer-events-none" />

            {/* Radar concentric circular guides */}
            <div className="absolute w-20 h-20 rounded-full border border-purple-300/40" />
            <div className="absolute w-14 h-14 rounded-full border border-purple-400/30" />

            {/* Radiant Purple Feature Icon */}
            <Icon className="w-12 h-12 sm:w-13 sm:h-13 text-purple-600 relative z-10 filter drop-shadow-[0_6px_14px_rgba(124,58,237,0.35)] transition-transform duration-300" />

            {/* Corner reticle marks */}
            <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 border-t-1.5 border-l-1.5 border-purple-400/60" />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 border-t-1.5 border-r-1.5 border-purple-400/60" />
            <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 border-b-1.5 border-l-1.5 border-purple-400/60" />
            <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 border-b-1.5 border-r-1.5 border-purple-400/60" />
          </div>
        </div>

        {/* ── Lower Section: Title, Pill & Description ── */}
        <div className="px-4 mt-2.5 flex flex-col items-center text-center relative z-20">
          {/* Bold Feature Title */}
          <h4 className="text-sm sm:text-[15px] font-black text-slate-900 tracking-tight uppercase leading-snug">
            {feature.title}
          </h4>

          {/* Vibrant Purple Pill underneath Title */}
          <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-extrabold text-[8px] sm:text-[8.5px] tracking-wider uppercase shadow-xs">
            {feature.badge}
          </div>

          {/* Feature Description */}
          <p className="mt-1.5 text-[10px] sm:text-[10.5px] text-slate-600 leading-relaxed font-medium max-w-[215px] line-clamp-2">
            {feature.desc}
          </p>

          {/* Clean hairline divider */}
          <div className="w-11/12 h-px bg-slate-200 mt-2.5 mb-2" />

          {/* ── Bottom Information & QR Security Strip ── */}
          <div className="w-full flex items-center justify-between px-1">
            {/* Left: Authentic Mini QR Code */}
            <MiniQRCode />

            {/* Center: ID Code & System Meta */}
            <div className="flex flex-col text-left pl-2">
              <span className="text-[8.5px] font-mono font-bold text-slate-800 tracking-wider">
                ID: {feature.code}
              </span>
              <span className="text-[7.5px] font-semibold text-purple-700 tracking-wide uppercase">
                100% EXAM VERIFIED
              </span>
              <span className="text-[7px] font-mono text-slate-400">
                samayyudh.com
              </span>
            </div>

            {/* Right: Security Official Stamp */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-0.5 text-purple-600">
                <Sparkles className="w-2 h-2" />
                <span className="text-[7.5px] font-mono font-bold tracking-widest uppercase">
                  OFFICIAL
                </span>
              </div>
              <span className="text-[11px] font-black text-slate-900">
                #SY2
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FeatureIdCards() {
  const [queue, setQueue] = useState(features);
  const [exiting, setExiting] = useState(false);

  const handleNext = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => {
      setQueue((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
      setExiting(false);
    }, 180);
  };

  const handlePrev = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => {
      setQueue((prev) => {
        const last = prev[prev.length - 1];
        const rest = prev.slice(0, prev.length - 1);
        return [last, ...rest];
      });
      setExiting(false);
    }, 180);
  };

  // Always show 3 cards in the fanned deck:
  // queue[0] = center front
  // queue[1] = left wing
  // queue[2] = right wing
  const visible = [queue[0], queue[1], queue[2]];

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      {/* ── Realistic Hanging Lanyard Assembly (Anchors the deck at the top) ── */}
      <div className="id-card-wavy flex flex-col items-center">
        <LanyardHardware />

        {/* ── 3-Card Fanned Deck Container with Natural Wavy Sway (Refined Height: ~435px) ── */}
        <div
          className="relative w-full max-w-[280px] sm:max-w-[300px] md:max-w-[310px] flex justify-center -mt-3.5"
          style={{
            height: '435px',
            perspective: '1200px',
            transformOrigin: 'top center',
          }}
        >
          <AnimatePresence mode="popLayout">
            {/* Background right card (index 2) */}
            <IDCard
              key={visible[2].title + '-right'}
              feature={visible[2]}
              stackIndex={2}
              onSwipe={handleNext}
            />
            {/* Background left card (index 1) */}
            <IDCard
              key={visible[1].title + '-left'}
              feature={visible[1]}
              stackIndex={1}
              onSwipe={handleNext}
            />
            {/* Foreground active card (index 0) */}
            <IDCard
              key={visible[0].title + '-front'}
              feature={visible[0]}
              stackIndex={0}
              onSwipe={handleNext}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* ── Interactive Navigation Controls with Ample Clear Spacing ── */}
      <div className="flex items-center gap-3 mt-6 z-20">
        <button
          onClick={handlePrev}
          className="p-1.5 sm:p-2 rounded-full border border-purple-200 dark:border-purple-800/60 bg-white dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 hover:text-purple-900 transition-all active:scale-95 shadow-sm"
          aria-label="Previous feature"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Feature Pagination Indicators */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-800/50 backdrop-blur-sm shadow-xs">
          {features.map((f) => {
            const isActive = queue[0].title === f.title;
            return (
              <button
                key={f.title}
                onClick={() => {
                  const targetIdx = queue.findIndex((item) => item.title === f.title);
                  if (targetIdx > 0) {
                    setQueue((prev) => [...prev.slice(targetIdx), ...prev.slice(0, targetIdx)]);
                  }
                }}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-4.5 h-1.5 bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.6)]'
                    : 'w-1.5 h-1.5 bg-purple-200 dark:bg-purple-800 hover:bg-purple-400'
                }`}
                aria-label={`Jump to ${f.title}`}
              />
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="p-1.5 sm:p-2 rounded-full border border-purple-200 dark:border-purple-800/60 bg-white dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 hover:text-purple-900 transition-all active:scale-95 shadow-sm"
          aria-label="Next feature"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-muted font-medium tracking-wide mt-2.5">
        Drag card or use arrows to inspect all {features.length} battle features
      </p>
    </div>
  );
}

export default FeatureIdCards;
