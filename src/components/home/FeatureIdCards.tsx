'use client';

// ============================================================
// SamayYudh 2.0 — Professional ID Card Feature Badges (Compact)
// Modeled precisely after the reference emerald green lanyard ID badge:
// - Separate woven forest green lanyard for EACH card (with snap button,
//   D-ring clamp, swivel joint & lobster clasp)
// - Gentle hanging wavy sway animation (id-card-sway)
// - Fanned-out 3-card deck with interactive drag & spring physics
// - Right-edge vertical 'DESIGNER' style ribbon tag
// - Compact, refined silhouette with high-density security badge layout
// - Bold white title with vibrant mint pill badge underneath
// - High-security QR code badge & verification metadata
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import {
  Timer, PenLine, Target, Brain, Zap, Award,
  BookOpen, BarChart3, Shield, ChevronLeft, ChevronRight,
  type LucideIcon
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
    <div className="w-9 h-9 bg-white p-0.5 rounded-md shadow-md flex items-center justify-center shrink-0 border border-emerald-950/20">
      <svg viewBox="0 0 29 29" className="w-full h-full text-slate-900" fill="currentColor">
        {/* Top-Left Target */}
        <rect x="2" y="2" width="7" height="7" rx="1" fill="#0f172a" />
        <rect x="4" y="4" width="3" height="3" fill="#fff" />
        <rect x="5" y="5" width="1" height="1" fill="#0f172a" />

        {/* Top-Right Target */}
        <rect x="20" y="2" width="7" height="7" rx="1" fill="#0f172a" />
        <rect x="22" y="4" width="3" height="3" fill="#fff" />
        <rect x="23" y="5" width="1" height="1" fill="#0f172a" />

        {/* Bottom-Left Target */}
        <rect x="2" y="20" width="7" height="7" rx="1" fill="#0f172a" />
        <rect x="4" y="22" width="3" height="3" fill="#fff" />
        <rect x="5" y="23" width="1" height="1" fill="#0f172a" />

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

  // Drag physics & dynamic rotations
  const dragRotateZ = useTransform(x, [-220, 220], [-24, 24]);
  const rotateY = useTransform(x, [-220, 220], [-15, 15]);
  const rotateX = useTransform(y, [-220, 220], [12, -12]);

  // Strap elastic stretch on vertical drag
  const strapScaleY = useTransform(y, (val) => Math.max(0.4, 1 + val / 180));

  const isFront = stackIndex === 0;

  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 75 || Math.abs(info.offset.y) > 75 || Math.abs(info.velocity.x) > 340) {
      onSwipe();
    }
  };

  const Icon = feature.icon;

  // Compact 3-card fanned layout
  const restingRotation = stackIndex === 0 ? 0 : stackIndex === 1 ? -13 : 13;
  const restingX = stackIndex === 0 ? 0 : stackIndex === 1 ? -36 : 36;
  const restingY = stackIndex === 0 ? 0 : 10;
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
      transition={{ type: 'spring', stiffness: 280, damping: 24, mass: 1 }}
    >
      {/* ── Separate Lanyard Strap & Hardware for this Card (Scaled Compact) ── */}
      <div className="relative flex flex-col items-center z-40 -mb-4 pointer-events-none">
        {/* Woven Damask Forest Green Strap */}
        <motion.div
          className="w-9 sm:w-10 h-18 sm:h-20 relative overflow-hidden shadow-xl"
          style={{
            background: 'linear-gradient(90deg, #022c22 0%, #064e3b 15%, #065f46 50%, #064e3b 85%, #022c22 100%)',
            scaleY: isFront ? strapScaleY : 1,
            transformOrigin: 'top center',
          }}
        >
          {/* Woven geometric texture */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #34d399 0px, #34d399 2px, transparent 2px, transparent 6px)',
            }}
          />
          {/* Lighting highlights */}
          <div className="absolute inset-y-0 left-0 w-1 bg-black/50" />
          <div className="absolute inset-y-0 right-0 w-1 bg-black/50" />
          <div className="absolute inset-y-0 left-1.5 w-px bg-white/15" />

          {/* Dark Gunmetal Rivet / Snap Button */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#18231e] border border-[#4b5563] shadow-md flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#374151]" />
          </div>
        </motion.div>

        {/* Gunmetal D-Ring Clamp */}
        <div
          className="w-9 sm:w-10 h-3 relative -mt-0.5 z-20 rounded-b-md shadow-md"
          style={{
            background: 'linear-gradient(180deg, #4b5563 0%, #1f2937 70%, #111827 100%)',
            borderLeft: '1px solid #9ca3af',
            borderRight: '1px solid #9ca3af',
            borderBottom: '1.5px solid #374151',
          }}
        />

        {/* Swivel Joint Mechanism */}
        <div className="flex flex-col items-center -mt-0.5 z-20">
          <div
            className="w-2 h-2.5 shadow-sm"
            style={{
              background: 'linear-gradient(90deg, #374151 0%, #9ca3af 50%, #374151 100%)',
              borderLeft: '1px solid #1f2937',
              borderRight: '1px solid #1f2937',
            }}
          />
          <div className="w-3 h-1.5 rounded-full bg-gradient-to-b from-[#9ca3af] to-[#374151] border border-[#1f2937] -mt-0.5 z-30 shadow-sm" />
        </div>

        {/* Metallic Lobster Clasp Hook */}
        <div className="flex flex-col items-center -mt-0.5 relative z-20">
          <div
            className="w-5 h-6.5 relative shadow-lg"
            style={{
              border: '2.5px solid #6b7280',
              borderRadius: '999px 999px 8px 8px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(31,41,55,0.8) 100%)',
            }}
          >
            {/* Spring latch lever */}
            <div className="absolute -right-0.5 top-1.5 w-1 h-3 bg-gradient-to-r from-[#9ca3af] to-[#4b5563] rounded-full border border-[#1f2937]" />
          </div>
        </div>
      </div>

      {/* ── ID Card Body (Scaled Compact: ~255px x 395px) ── */}
      <motion.div
        className="relative w-[252px] sm:w-[268px] h-[388px] sm:h-[402px] rounded-[24px] overflow-hidden text-left"
        style={{
          background: 'radial-gradient(ellipse at 50% 15%, #08634c 0%, #054837 40%, #033326 75%, #012219 100%)',
          boxShadow: isFront
            ? '0 25px 55px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(52, 211, 153, 0.3), inset 0 1px 1px rgba(255,255,255,0.35)'
            : '0 12px 28px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(52, 211, 153, 0.15)',
          cursor: isFront ? 'grab' : 'default',
        }}
        whileDrag={{ cursor: 'grabbing', scale: 1.04 }}
      >
        {/* Damask / Islamic Geometric Watermark Overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="damask-watermark-compact" width="46" height="46" patternUnits="userSpaceOnUse">
              <path
                d="M23 3 C18 11 11 18 3 23 C11 28 18 35 23 43 C28 35 35 28 43 23 C35 18 28 11 23 3 Z"
                fill="none"
                stroke="#6ee7b7"
                strokeWidth="1"
              />
              <circle cx="23" cy="23" r="3.5" fill="none" stroke="#6ee7b7" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#damask-watermark-compact)" />
        </svg>

        {/* Specular Diagonal Sheen Reflection */}
        <div
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.02) 42%, transparent 60%, rgba(255,255,255,0.05) 100%)',
          }}
        />

        {/* Realistic Oblong Punch Hole */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-9 h-2.5 rounded-full bg-[#021812] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.2)] z-30 ring-1 ring-white/10" />

        {/* ── Top Header Section (Matching BE READY and Brand Header) ── */}
        <div className="pt-7 px-4 flex items-center justify-between relative z-20">
          {/* Top-Left 'BE READY' */}
          <span className="text-[#2ee6a8] text-[8.5px] font-black tracking-[0.2em] uppercase drop-shadow-[0_0_6px_rgba(46,230,168,0.4)]">
            BE READY
          </span>

          {/* Top Brand Title & Pill */}
          <div className="flex flex-col items-end">
            <span className="text-white text-[10.5px] font-black tracking-wider uppercase drop-shadow-sm">
              সময়যুদ্ধ 2.0
            </span>
            <span className="text-[7.5px] font-bold text-[#2ee6a8] bg-[#02281e]/90 border border-[#2ee6a8]/50 px-1.5 py-0.2 rounded-full uppercase tracking-wider mt-0.5">
              EXAM ENGINE
            </span>
          </div>
        </div>

        {/* ── Right Edge Vertical Ribbon / Badge Tag ── */}
        <div className="absolute right-0 top-18 z-20">
          <div className="bg-gradient-to-b from-[#2ee6a8] via-[#10b981] to-[#059669] text-[#022c22] font-black text-[9.5px] tracking-[0.22em] uppercase rounded-l-lg px-1 py-3 shadow-lg border-y border-l border-white/20 [writing-mode:vertical-rl] rotate-180">
            {feature.roleTag}
          </div>
        </div>

        {/* ── Center Feature Visual Emblem / Portrait Frame (Compact) ── */}
        <div className="flex justify-center mt-2 relative z-10 px-4">
          <div className="w-28 h-28 sm:w-30 sm:h-30 rounded-xl bg-gradient-to-b from-[#022118]/80 to-[#01150f]/90 border border-emerald-400/30 shadow-xl relative overflow-hidden backdrop-blur-md flex items-center justify-center ring-1 ring-white/10">
            {/* Ambient emerald radial glow */}
            <div className="absolute inset-0 bg-radial from-emerald-400/25 via-transparent to-transparent pointer-events-none" />

            {/* Radar / Circular focus rings */}
            <div className="absolute w-22 h-22 rounded-full border border-emerald-400/15" />
            <div className="absolute w-15 h-15 rounded-full border border-emerald-400/20" />

            {/* Feature Icon in radiant mint */}
            <Icon
              className="w-13 h-13 sm:w-14 sm:h-14 text-[#2ee6a8] relative z-10 filter drop-shadow-[0_0_14px_rgba(46,230,168,0.7)]"
            />

            {/* Corner reticle brackets */}
            <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-emerald-300/40" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-emerald-300/40" />
            <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-emerald-300/40" />
            <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-emerald-300/40" />
          </div>
        </div>

        {/* ── Lower Section: Title, Pill & Description ── */}
        <div className="px-3.5 mt-2 flex flex-col items-center text-center relative z-20">
          {/* Bold White Title */}
          <h4 className="text-base sm:text-[17px] font-black text-white tracking-wide uppercase leading-tight drop-shadow-md">
            {feature.title}
          </h4>

          {/* Mint Green Pill underneath Title */}
          <div className="mt-1 inline-flex items-center px-3 py-0.5 rounded-full bg-[#2ee6a8] text-[#022c22] font-black text-[9.5px] tracking-wider uppercase shadow-md">
            {feature.badge}
          </div>

          {/* Feature Description */}
          <p className="mt-1.5 text-[11px] sm:text-xs text-emerald-100/90 leading-snug font-medium max-w-[215px] line-clamp-2">
            {feature.desc}
          </p>

          {/* Subtle divider */}
          <div className="w-11/12 h-px bg-emerald-400/20 mt-2 mb-1.5" />

          {/* ── Bottom Information & QR Security Strip ── */}
          <div className="w-full flex items-center justify-between px-1">
            {/* Left: Authentic Mini QR Code */}
            <MiniQRCode />

            {/* Center: ID Code & System Meta */}
            <div className="flex flex-col text-left pl-2">
              <span className="text-[8.5px] font-mono font-bold text-emerald-200 tracking-wider">
                ID: {feature.code}
              </span>
              <span className="text-[8px] font-semibold text-emerald-300/80 tracking-wide">
                100% EXAM READY
              </span>
              <span className="text-[7.5px] font-mono text-emerald-400/60 uppercase">
                samayyudh.com
              </span>
            </div>

            {/* Right: Security Badge Stamp */}
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-mono font-bold text-emerald-300/70 tracking-widest uppercase">
                FEATURE
              </span>
              <span className="text-[11px] font-black text-white">
                #{feature.id}
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
      {/* ── 3-Card Fanned Deck Container with the Hanging Wavy Sway Animation (Compact Height: 480px) ── */}
      <div
        className="relative w-full max-w-[280px] sm:max-w-[300px] flex justify-center id-card-sway"
        style={{ height: '480px', perspective: '1200px', transformOrigin: 'top center' }}
      >
        <AnimatePresence mode="popLayout">
          {/* Background right card (index 2) with its own strap */}
          <IDCard
            key={visible[2].title + '-right'}
            feature={visible[2]}
            stackIndex={2}
            onSwipe={handleNext}
          />
          {/* Background left card (index 1) with its own strap */}
          <IDCard
            key={visible[1].title + '-left'}
            feature={visible[1]}
            stackIndex={1}
            onSwipe={handleNext}
          />
          {/* Foreground active card (index 0) with its own strap */}
          <IDCard
            key={visible[0].title + '-front'}
            feature={visible[0]}
            stackIndex={0}
            onSwipe={handleNext}
          />
        </AnimatePresence>
      </div>

      {/* ── Interactive Controls & Swipe Guidance ── */}
      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={handlePrev}
          className="p-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-800/40 hover:text-white transition-all active:scale-95 shadow-md"
          aria-label="Previous feature"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Feature Pagination Indicators */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/25 backdrop-blur-sm shadow-inner">
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
                    ? 'w-4 h-1.5 bg-[#2ee6a8] shadow-[0_0_8px_rgba(46,230,168,0.9)]'
                    : 'w-1.5 h-1.5 bg-emerald-800/80 hover:bg-emerald-600'
                }`}
                aria-label={`Jump to ${f.title}`}
              />
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="p-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-800/40 hover:text-white transition-all active:scale-95 shadow-md"
          aria-label="Next feature"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[11px] text-muted/80 font-medium tracking-wide mt-1.5">
        Drag card or use arrows to inspect all {features.length} battle features
      </p>
    </div>
  );
}

export default FeatureIdCards;
