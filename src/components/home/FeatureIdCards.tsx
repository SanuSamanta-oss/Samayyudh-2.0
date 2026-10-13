'use client';

// ============================================================
// SamayYudh 2.0 — Professional ID Card Feature Badges
// Modeled precisely after the reference emerald green lanyard ID badge:
// - Woven forest green lanyard with metallic rivet, D-ring clamp & swivel hook
// - Fanned-out 3-card deck presentation
// - Right-edge vertical 'DESIGNER' style ribbon tag
// - Iconic central portrait emblem with corner reticles
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
    <div className="w-11 h-11 bg-white p-1 rounded-lg shadow-md flex items-center justify-center shrink-0 border border-emerald-950/20">
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
  const dragRotateZ = useTransform(x, [-260, 260], [-26, 26]);
  const rotateY = useTransform(x, [-260, 260], [-18, 18]);
  const rotateX = useTransform(y, [-260, 260], [14, -14]);

  const isFront = stackIndex === 0;

  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 85 || Math.abs(info.offset.y) > 85 || Math.abs(info.velocity.x) > 380) {
      onSwipe();
    }
  };

  const Icon = feature.icon;

  // Exact 3-card fanned layout matching reference photograph:
  // stackIndex 0 = Center front (0 deg)
  // stackIndex 1 = Left fan (-14.5 deg, shifted left -46px)
  // stackIndex 2 = Right fan (+14.5 deg, shifted right +46px)
  const restingRotation = stackIndex === 0 ? 0 : stackIndex === 1 ? -14.5 : 14.5;
  const restingX = stackIndex === 0 ? 0 : stackIndex === 1 ? -46 : 46;
  const restingY = stackIndex === 0 ? 0 : 14;
  const restingScale = stackIndex === 0 ? 1 : 0.93;
  const restingOpacity = stackIndex === 0 ? 1 : 0.85;
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
      {/* ── ID Card Body ────────────────────────────────────────── */}
      <motion.div
        className="relative w-[310px] sm:w-[330px] h-[480px] sm:h-[495px] rounded-[28px] overflow-hidden text-left"
        style={{
          background: 'radial-gradient(ellipse at 50% 15%, #08634c 0%, #054837 40%, #033326 75%, #012219 100%)',
          boxShadow: isFront
            ? '0 32px 70px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(52, 211, 153, 0.3), inset 0 1px 1px rgba(255,255,255,0.35)'
            : '0 16px 36px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(52, 211, 153, 0.15)',
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
            <pattern id="damask-watermark" width="56" height="56" patternUnits="userSpaceOnUse">
              <path
                d="M28 4 C22 14 14 22 4 28 C14 34 22 42 28 52 C34 42 42 34 52 28 C42 22 34 14 28 4 Z"
                fill="none"
                stroke="#6ee7b7"
                strokeWidth="1.2"
              />
              <circle cx="28" cy="28" r="4.5" fill="none" stroke="#6ee7b7" strokeWidth="1" />
              <path d="M0 0 L10 10 M46 10 L56 0 M10 46 L0 56 M46 46 L56 56" stroke="#6ee7b7" strokeWidth="0.9" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#damask-watermark)" />
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
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-12 h-3.5 rounded-full bg-[#021812] shadow-[inset_0_3px_5px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.2)] z-30 ring-1 ring-white/10" />

        {/* ── Top Header Section (Matching BE READY and Brand Header) ── */}
        <div className="pt-9 px-5 flex items-center justify-between relative z-20">
          {/* Top-Left 'BE READY' in Vibrant Mint Monospace */}
          <span className="text-[#2ee6a8] text-[10px] font-black tracking-[0.25em] uppercase drop-shadow-[0_0_8px_rgba(46,230,168,0.4)]">
            BE READY
          </span>

          {/* Top Brand Title & Pill (Matching KHAIR + DESIGNING AGENCY Pill) */}
          <div className="flex flex-col items-end">
            <span className="text-white text-xs font-black tracking-wider uppercase drop-shadow-sm">
              সময়যুদ্ধ 2.0
            </span>
            <span className="text-[8.5px] font-bold text-[#2ee6a8] bg-[#02281e]/90 border border-[#2ee6a8]/50 px-2 py-0.5 rounded-full uppercase tracking-wider mt-0.5">
              EXAM ENGINE
            </span>
          </div>
        </div>

        {/* ── Right Edge Vertical Ribbon / Badge Tag (Exact match to reference 'DESIGNER' ribbon) ── */}
        <div className="absolute right-0 top-24 z-20">
          <div className="bg-gradient-to-b from-[#2ee6a8] via-[#10b981] to-[#059669] text-[#022c22] font-black text-[11px] tracking-[0.28em] uppercase rounded-l-xl px-1.5 py-4 shadow-xl border-y border-l border-white/20 [writing-mode:vertical-rl] rotate-180">
            {feature.roleTag}
          </div>
        </div>

        {/* ── Center Feature Visual Emblem / Portrait Frame ── */}
        <div className="flex justify-center mt-3 relative z-10 px-6">
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-b from-[#022118]/80 to-[#01150f]/90 border border-emerald-400/30 shadow-2xl relative overflow-hidden backdrop-blur-md flex items-center justify-center ring-1 ring-white/10">
            {/* Ambient emerald radial glow */}
            <div className="absolute inset-0 bg-radial from-emerald-400/25 via-transparent to-transparent pointer-events-none" />

            {/* Radar / Circular focus rings */}
            <div className="absolute w-28 h-28 rounded-full border border-emerald-400/15" />
            <div className="absolute w-20 h-20 rounded-full border border-emerald-400/20" />

            {/* Feature Icon in radiant mint */}
            <Icon
              className="w-16 h-16 sm:w-18 sm:h-18 text-[#2ee6a8] relative z-10 filter drop-shadow-[0_0_18px_rgba(46,230,168,0.7)]"
            />

            {/* Corner reticle brackets (ID Portrait styling) */}
            <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-300/40" />
            <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-300/40" />
            <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-300/40" />
            <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-300/40" />
          </div>
        </div>

        {/* ── Lower Section: Title, Pill & Description (Matching Ahamad Raees & Designer Pill) ── */}
        <div className="px-5 mt-3 flex flex-col items-center text-center relative z-20">
          {/* Bold White Title */}
          <h4 className="text-lg sm:text-xl font-black text-white tracking-wider uppercase leading-tight drop-shadow-md">
            {feature.title}
          </h4>

          {/* Mint Green Pill underneath Title */}
          <div className="mt-1.5 inline-flex items-center px-4 py-1 rounded-full bg-[#2ee6a8] text-[#022c22] font-black text-[11px] tracking-wider uppercase shadow-md">
            {feature.badge}
          </div>

          {/* Feature Description */}
          <p className="mt-2 text-xs sm:text-[13px] text-emerald-100/90 leading-relaxed font-medium max-w-[260px] line-clamp-2">
            {feature.desc}
          </p>

          {/* Subtle divider */}
          <div className="w-11/12 h-px bg-emerald-400/20 mt-3 mb-2.5" />

          {/* ── Bottom Information & QR Security Strip ── */}
          <div className="w-full flex items-center justify-between px-1.5">
            {/* Left: Authentic Mini QR Code */}
            <MiniQRCode />

            {/* Center: ID Code & System Meta */}
            <div className="flex flex-col text-left pl-3">
              <span className="text-[9.5px] font-mono font-bold text-emerald-200 tracking-wider">
                ID: {feature.code}
              </span>
              <span className="text-[9px] font-semibold text-emerald-300/80 tracking-wide">
                100% EXAM READY
              </span>
              <span className="text-[8.5px] font-mono text-emerald-400/60 uppercase">
                samayyudh.com
              </span>
            </div>

            {/* Right: Security Badge Stamp */}
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-mono font-bold text-emerald-300/70 tracking-widest uppercase">
                FEATURE
              </span>
              <span className="text-[13px] font-black text-white">
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
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* ── Fixed Static Lanyard Hanging from Top ── */}
      <div className="relative flex flex-col items-center z-50 pointer-events-none -mb-3">
        {/* Deep Forest Green Patterned Lanyard Strap */}
        <div
          className="w-12 h-24 relative overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(90deg, #022c22 0%, #064e3b 15%, #065f46 50%, #064e3b 85%, #022c22 100%)',
          }}
        >
          {/* Woven Damask Strap Pattern */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #34d399 0px, #34d399 2px, transparent 2px, transparent 6px)',
            }}
          />
          {/* Edge Shadows & Highlights */}
          <div className="absolute inset-y-0 left-0 w-1.5 bg-black/50" />
          <div className="absolute inset-y-0 right-0 w-1.5 bg-black/50" />
          <div className="absolute inset-y-0 left-2 w-px bg-white/15" />

          {/* Dark Gunmetal Rivet / Snap Button */}
          <div className="absolute top-9 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#18231e] border-2 border-[#4b5563] shadow-md flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#374151]" />
          </div>
        </div>

        {/* Gunmetal D-Ring Clamp */}
        <div
          className="w-12 h-4 relative -mt-1 z-20 rounded-b-md shadow-md"
          style={{
            background: 'linear-gradient(180deg, #4b5563 0%, #1f2937 70%, #111827 100%)',
            borderLeft: '1px solid #9ca3af',
            borderRight: '1px solid #9ca3af',
            borderBottom: '2px solid #374151',
          }}
        />

        {/* Swivel Joint Mechanism */}
        <div className="flex flex-col items-center -mt-0.5 z-20">
          <div
            className="w-2.5 h-3.5 shadow-sm"
            style={{
              background: 'linear-gradient(90deg, #374151 0%, #9ca3af 50%, #374151 100%)',
              borderLeft: '1px solid #1f2937',
              borderRight: '1px solid #1f2937',
            }}
          />
          <div className="w-4 h-2 rounded-full bg-gradient-to-b from-[#9ca3af] to-[#374151] border border-[#1f2937] -mt-0.5 z-30 shadow-sm" />
        </div>

        {/* Metallic Swivel Snap Hook / Lobster Clasp */}
        <div className="flex flex-col items-center -mt-0.5 relative z-20">
          <div
            className="w-6 h-8 relative shadow-xl"
            style={{
              border: '3.5px solid #6b7280',
              borderRadius: '999px 999px 10px 10px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(31,41,55,0.8) 100%)',
            }}
          >
            {/* Spring latch lever */}
            <div className="absolute -right-1 top-2 w-1.5 h-4 bg-gradient-to-r from-[#9ca3af] to-[#4b5563] rounded-full border border-[#1f2937]" />
          </div>
        </div>
      </div>

      {/* ── 3-Card Fanned Deck Container ── */}
      <div
        className="relative w-full max-w-[340px] sm:max-w-[360px] flex justify-center"
        style={{ height: '525px', perspective: '1200px' }}
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

      {/* ── Interactive Controls & Swipe Guidance ── */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-800/40 hover:text-white transition-all active:scale-95 shadow-md"
          aria-label="Previous feature"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Feature Pagination Indicators */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/25 backdrop-blur-sm shadow-inner">
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
                    ? 'w-5 h-1.5 bg-[#2ee6a8] shadow-[0_0_8px_rgba(46,230,168,0.9)]'
                    : 'w-1.5 h-1.5 bg-emerald-800/80 hover:bg-emerald-600'
                }`}
                aria-label={`Jump to ${f.title}`}
              />
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="p-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-800/40 hover:text-white transition-all active:scale-95 shadow-md"
          aria-label="Next feature"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <p className="text-xs text-muted/80 font-medium tracking-wide mt-2">
        Drag card or use arrows to inspect all {features.length} battle features
      </p>
    </div>
  );
}

export default FeatureIdCards;
