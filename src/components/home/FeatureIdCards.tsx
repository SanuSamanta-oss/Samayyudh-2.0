'use client';

// ============================================================
// SamayYudh 2.0 — Compact, Clean Feature ID Cards
// Restored to the original clean layout:
// - Smaller, more compact proportions (fits naturally without overflow)
// - Simpler presentation: vibrant gradient header, centered emblem,
//   concise typography & minimalist barcode strip
// - Completely BORDERLESS (zero border or ring classes, pure soft depth & shadows)
// - Dual-theme support (light & dark mode)
// - Woven lanyard strap with smooth chrome clasp and gentle pendulum sway
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import {
  Timer, PenLine, Target, Brain, Zap, Award,
  BookOpen, BarChart3, Shield, ChevronLeft, ChevronRight,
  type LucideIcon,
} from 'lucide-react';

const features = [
  {
    icon: Timer,
    title: 'Persistent Timer',
    desc: 'Survives refresh, tab switches, and network drops. Your time never lies.',
    id: '01',
    color: '#6366f1',
    light: '#e0e7ff',
  },
  {
    icon: PenLine,
    title: 'Real Answer Writing',
    desc: 'Write full answers, not just click options. Track word count and structure.',
    id: '02',
    color: '#8b5cf6',
    light: '#ede9fe',
  },
  {
    icon: Target,
    title: 'Time Pressure Analysis',
    desc: 'Know exactly where you spend too much — or too little — time.',
    id: '03',
    color: '#ec4899',
    light: '#fce7f3',
  },
  {
    icon: Brain,
    title: 'AI Evaluation',
    desc: 'Gemini-powered analysis of correctness, completeness, and exam-readiness.',
    id: '04',
    color: '#0ea5e9',
    light: '#e0f2fe',
  },
  {
    icon: Zap,
    title: 'Auto-Save & Offline',
    desc: 'Answers save automatically. IndexedDB backup keeps data safe offline.',
    id: '05',
    color: '#f59e0b',
    light: '#fef3c7',
  },
  {
    icon: Award,
    title: 'Half Century & Century',
    desc: 'Milestone celebrations at 50 and 100 questions. Track your exam readiness.',
    id: '06',
    color: '#10b981',
    light: '#d1fae5',
  },
  {
    icon: BookOpen,
    title: 'Multi-Exam Support',
    desc: 'GATE, JEE, UPSC, University — one engine, every exam pattern.',
    id: '07',
    color: '#f43f5e',
    light: '#ffe4e6',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    desc: 'Score by topic, time per question, weak areas, and readiness metrics.',
    id: '08',
    color: '#14b8a6',
    light: '#ccfbf1',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your data is yours. RLS protection. No exposed API keys.',
    id: '09',
    color: '#64748b',
    light: '#f1f5f9',
  },
];

type FeatureItem = (typeof features)[number];

// ── Realistic Purple Woven Lanyard Ribbon & Solid Chrome Lobster Clasp Hardware ──
function LanyardHardware({
  scaleY,
}: {
  scaleY?: ReturnType<typeof useTransform<number, number>>;
}) {
  return (
    <div className="relative flex flex-col items-center z-40 select-none pointer-events-none">
      {/* 1. Purple Woven Twill Ribbon (Rolled around D-ring top bar) */}
      <motion.div
        className="w-12 h-14 relative overflow-hidden shadow-lg rounded-t-sm"
        style={{
          background:
            'linear-gradient(90deg, #5b21b6 0%, #7c3aed 14%, #8b5cf6 35%, #a78bfa 50%, #8b5cf6 65%, #7c3aed 86%, #5b21b6 100%)',
          scaleY: scaleY ?? 1,
          transformOrigin: 'top center',
        }}
      >
        {/* Woven herringbone texture */}
        <svg
          className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="lanyard-twill-v5" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M0 2 L2 0 L4 2 L2 4 Z" fill="none" stroke="#ffffff" strokeWidth="0.65" />
              <line x1="0" y1="2" x2="4" y2="2" stroke="#4c1d95" strokeWidth="0.45" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lanyard-twill-v5)" />
        </svg>

        {/* 3D cylindrical lighting depth */}
        <div className="absolute inset-y-0 left-0 w-1.5 bg-black/45" />
        <div className="absolute inset-y-0 right-0 w-1.5 bg-black/45" />
        <div className="absolute inset-y-0 left-1.5 w-0.5 bg-white/30" />
        <div className="absolute inset-y-0 right-1.5 w-0.5 bg-black/30" />

        {/* Horizontal thread stitch line above fold */}
        <div className="absolute bottom-2.5 inset-x-0 px-1 flex flex-col items-center">
          <div className="w-full h-px bg-purple-950/50" />
          <div className="w-full h-0.5 border-b border-dashed border-purple-200/90 my-[1px]" />
          <div className="w-full h-px bg-white/30" />
        </div>

        {/* Bottom fold roll shadow wrapping around the D-ring */}
        <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-t from-black/60 via-purple-950/30 to-transparent pointer-events-none" />
      </motion.div>

      {/* 2. Silver Chrome Hardware: Solid D-Ring, Swivel Joint & 3D Lobster Clasp */}
      <div className="relative -mt-1 flex flex-col items-center z-40">
        <svg
          width="64"
          height="88"
          viewBox="0 0 64 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]"
        >
          <defs>
            {/* Specular Chrome Body Gradient */}
            <linearGradient id="chrome-body-v5" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="14%" stopColor="#f8fafc" />
              <stop offset="30%" stopColor="#cbd5e1" />
              <stop offset="48%" stopColor="#475569" />
              <stop offset="52%" stopColor="#1e293b" />
              <stop offset="68%" stopColor="#94a3b8" />
              <stop offset="85%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            {/* Cylindrical Metallic Swivel Gradient */}
            <linearGradient id="chrome-cyl-v5" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="18%" stopColor="#94a3b8" />
              <stop offset="42%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#cbd5e1" />
              <stop offset="88%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* D-Ring Wire Gradient */}
            <linearGradient id="dring-grad-v5" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#cbd5e1" />
              <stop offset="65%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          {/* ── D-Ring Top Straight Bar (Passes through ribbon, ends emerge at left & right) ── */}
          <line
            x1="5"
            y1="4.5"
            x2="59"
            y2="4.5"
            stroke="url(#chrome-cyl-v5)"
            strokeWidth="4.2"
            strokeLinecap="round"
          />
          {/* Top edge specular highlight on straight bar */}
          <line
            x1="5"
            y1="3"
            x2="59"
            y2="3"
            stroke="#ffffff"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* ── D-Ring Curved Loop (Seamless solid U-hoop meeting at bottom center) ── */}
          {/* Left half curving down to swivel */}
          <path
            d="M 5 4.5 C 4 19, 21 28.5, 29 28.5"
            stroke="url(#chrome-body-v5)"
            strokeWidth="4.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right half curving down to swivel */}
          <path
            d="M 59 4.5 C 60 19, 43 28.5, 35 28.5"
            stroke="url(#chrome-body-v5)"
            strokeWidth="4.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Specular inner crest reflection on D-ring loop */}
          <path
            d="M 6.5 4.5 C 5.5 17.5, 21.5 27, 28.5 27.2"
            stroke="#ffffff"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.85"
            fill="none"
          />
          <path
            d="M 57.5 4.5 C 58.5 17.5, 42.5 27, 35.5 27.2"
            stroke="#ffffff"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.85"
            fill="none"
          />

          {/* ── Swivel Collar Mechanism (Cylindrical barrel & retaining collar) ── */}
          {/* Upper retaining bead on D-ring */}
          <rect x="25" y="27" width="14" height="3.5" rx="1.75" fill="url(#chrome-cyl-v5)" />
          {/* Vertical swivel neck pin */}
          <rect x="28.5" y="30.5" width="7" height="6.5" rx="1" fill="url(#chrome-cyl-v5)" />
          <line x1="32" y1="31" x2="32" y2="36.5" stroke="#ffffff" strokeWidth="0.8" opacity="0.9" />
          {/* Lower flange ring */}
          <rect x="26.5" y="36.5" width="11" height="3" rx="1.5" fill="url(#chrome-cyl-v5)" />

          {/* ── Upper Eyelet Ring connecting to clasp ── */}
          <circle
            cx="32"
            cy="42"
            r="4.8"
            stroke="url(#chrome-body-v5)"
            strokeWidth="2.8"
            fill="none"
          />
          <circle
            cx="32"
            cy="42"
            r="4.8"
            stroke="#ffffff"
            strokeWidth="0.8"
            opacity="0.8"
            fill="none"
          />

          {/* ── Pivot Hinge Pin (Dark rivet core with chrome bevel ring) ── */}
          <circle cx="32" cy="46.5" r="2.2" fill="#1e293b" stroke="url(#chrome-cyl-v5)" strokeWidth="0.8" />

          {/* ── Solid Lobster Clasp Body ── */}
          {/* Left Shank: Solid chrome beam tapering smoothly down to hook */}
          <path
            d="M 29 48 C 26 56, 25 65, 26.5 74"
            stroke="url(#chrome-body-v5)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Specular crest line on left shank */}
          <path
            d="M 28 49 C 25.2 56, 24.3 64, 25.6 72"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.9"
            fill="none"
          />
          {/* Inner groove shadow giving 3D channeled cross-section */}
          <path
            d="M 30 50 C 27.5 57, 26.8 64, 28 72"
            stroke="#334155"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.6"
            fill="none"
          />

          {/* ── Spring Gate (Right Latch Lever) ── */}
          <path
            d="M 34.5 48.5 L 36.5 70"
            stroke="url(#chrome-cyl-v5)"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Trigger thumb tab projecting outward */}
          <path
            d="M 35.5 53.5 L 39.5 52.5 C 40.5 52.5, 41 53.5, 40.5 55.5 L 36.5 57 Z"
            fill="url(#chrome-body-v5)"
          />
          <line x1="36" y1="53" x2="39.5" y2="52" stroke="#ffffff" strokeWidth="0.6" opacity="0.9" />

          {/* ── Solid Continuous J-Hook (Curves flawlessly down into punch slot) ── */}
          {/* Thick solid hook: swoops down from left shank at Y=74 to Y=84.5 and curls up to Y=73 */}
          <path
            d="M 26.5 73.5 C 26 80, 29 84.5, 33 84.5 C 37 84.5, 39.5 81, 38.5 73"
            stroke="url(#chrome-body-v5)"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* High-gloss specular highlight along outer bend of the hook */}
          <path
            d="M 26.2 75 C 26 80.5, 28.5 83.5, 32.5 83.5 C 36.5 83.5, 38.8 80.5, 38 74"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.95"
            fill="none"
          />
        </svg>
      </div>
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
  const dragRotateZ = useTransform(x, [-200, 200], [-18, 18]);
  const rotateY = useTransform(x, [-200, 200], [-12, 12]);
  const rotateX = useTransform(y, [-200, 200], [10, -10]);

  const isFront = stackIndex === 0;

  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 65 || Math.abs(info.offset.y) > 70 || Math.abs(info.velocity.x) > 300) {
      onSwipe();
    }
  };

  const Icon = feature.icon;

  // Compact 3-card fanned resting geometry
  const restingRotation = stackIndex === 0 ? 0 : stackIndex === 1 ? -10 : 10;
  const restingX = stackIndex === 0 ? 0 : stackIndex === 1 ? -30 : 30;
  const restingY = stackIndex === 0 ? 0 : 8;
  const restingScale = stackIndex === 0 ? 1 : 0.94;
  const restingOpacity = stackIndex === 0 ? 1 : 0.86;
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
      {/* ── Compact ID Card Badge (Smaller, Simpler, Without Bordering) ── */}
      <motion.div
        className="relative w-[252px] sm:w-[264px] h-[356px] sm:h-[370px] rounded-[22px] overflow-hidden text-left bg-white dark:bg-[#16112a]"
        style={{
          boxShadow: isFront
            ? '0 24px 48px -12px rgba(15, 23, 42, 0.16), 0 10px 24px -6px rgba(124, 58, 237, 0.14), inset 0 1px 1px rgba(255,255,255,0.95)'
            : '0 12px 28px -8px rgba(15, 23, 42, 0.12)',
          cursor: isFront ? 'grab' : 'default',
        }}
        whileDrag={{ cursor: 'grabbing', scale: 1.03 }}
      >
        {/* Specular Diagonal Sheen Reflection (Glossy badge finish) */}
        <div
          className="absolute inset-0 pointer-events-none z-30 rounded-[22px]"
          style={{
            background:
              'linear-gradient(130deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.12) 36%, transparent 58%, rgba(255,255,255,0.18) 100%)',
          }}
        />

        {/* Oblong Punch-Hole Slot at Top Center (Borderless, natural depth) */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-11 h-2.5 rounded-full bg-slate-200/90 dark:bg-black/50 shadow-[inset_0_2px_3px_rgba(0,0,0,0.35),0_1px_1px_rgba(255,255,255,0.4)] z-30" />

        {/* ── Top Header Section: Vibrant Gradient Banner Matching Feature ── */}
        <div
          className="h-23 sm:h-24 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${feature.color}ee, ${feature.color}99)` }}
        >
          {/* Subtle Halftone Pattern */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1.2px, transparent 1.2px)',
              backgroundSize: '11px 11px',
            }}
          />

          {/* Logo Watermark SY */}
          <span className="absolute top-2.5 right-3.5 text-white/20 text-2xl font-black tracking-tighter select-none">
            SY
          </span>

          {/* Badge Number Pill (Borderless) */}
          <span
            className="absolute top-3 left-3.5 z-10 text-[9.5px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full shadow-xs"
            style={{ background: 'rgba(0,0,0,0.24)', color: 'rgba(255,255,255,0.95)' }}
          >
            FEATURE #{feature.id}
          </span>
        </div>

        {/* ── Center Feature Emblem: Overlapping Header and Body (Zero Borders) ── */}
        <div className="flex justify-center -mt-8 relative z-20 mb-2.5">
          <div
            className="w-15 h-15 rounded-2xl flex items-center justify-center transition-transform duration-300"
            style={{
              background: feature.light,
              boxShadow: `0 8px 24px -4px ${feature.color}35`,
            }}
          >
            <Icon className="w-7.5 h-7.5" style={{ color: feature.color }} />
          </div>
        </div>

        {/* ── Lower Section: Title, Description & Clean Barcode Footer ── */}
        <div className="px-5 pb-5 text-center flex flex-col items-center relative z-20">
          {/* Feature Title */}
          <h4 className="text-[14px] sm:text-[15px] font-bold text-slate-900 dark:text-white leading-snug tracking-tight">
            {feature.title}
          </h4>

          {/* Concise Feature Description */}
          <p className="mt-1.5 text-[11px] sm:text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-[215px] line-clamp-2">
            {feature.desc}
          </p>

          {/* Clean Hairline Divider (Borderless) */}
          <div className="w-12 h-px bg-slate-200 dark:bg-slate-700/60 my-2.5" />

          {/* Footer ID row */}
          <div className="flex items-center gap-2 text-[8.5px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <span>SAMAYYUDH 2.0</span>
            <span style={{ color: feature.color }}>●</span>
            <span>VALID: ALL EXAMS</span>
          </div>

          {/* Minimal Barcode Strip */}
          <div className="flex items-center justify-center gap-[1.5px] mt-2.5 opacity-35 dark:opacity-40">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[0.5px] bg-slate-800 dark:bg-slate-200"
                style={{
                  width: i % 4 === 0 ? 2.5 : i % 3 === 0 ? 1.8 : 1,
                  height: i % 5 === 0 ? 16 : i % 2 === 0 ? 12 : 9,
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom punch holes */}
        <div className="absolute bottom-3 right-3.5 flex gap-1.5">
          {[1, 2, 3].map((d) => (
            <div key={d} className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 opacity-60" />
          ))}
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
      {/* ── Realistic Hanging Lanyard Assembly with Pendulum Sway ── */}
      <div className="id-card-wavy flex flex-col items-center">
        <LanyardHardware />

        {/* ── 3-Card Fanned Deck Container (Compact Height: ~385px) ── */}
        <div
          className="relative w-full max-w-[270px] sm:max-w-[285px] flex justify-center -mt-5"
          style={{
            height: '385px',
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

      {/* ── Interactive Navigation Controls (Completely Borderless) ── */}
      <div className="flex items-center gap-3 mt-4 z-20">
        <button
          onClick={handlePrev}
          className="p-1.5 sm:p-2 rounded-full bg-purple-100/90 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-all active:scale-95 shadow-xs"
          aria-label="Previous feature"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Feature Pagination Indicators (Borderless) */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50/90 dark:bg-purple-950/60 shadow-xs backdrop-blur-sm">
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
                    ? 'w-4 h-1.5 bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.6)]'
                    : 'w-1.5 h-1.5 bg-purple-200 dark:bg-purple-800 hover:bg-purple-400'
                }`}
                aria-label={`Jump to ${f.title}`}
              />
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="p-1.5 sm:p-2 rounded-full bg-purple-100/90 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-all active:scale-95 shadow-xs"
          aria-label="Next feature"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-muted font-medium tracking-wide mt-2">
        Drag card or use arrows to inspect all {features.length} battle features
      </p>
    </div>
  );
}

export default FeatureIdCards;
