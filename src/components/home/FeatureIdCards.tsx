'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import {
  Timer, PenLine, Target, Brain, Zap, Award,
  BookOpen, BarChart3, Shield, type LucideIcon
} from 'lucide-react';

const features = [
  { icon: Timer,    title: 'Persistent Timer',        desc: 'Survives refresh, tab switches, and network drops. Your time never lies.', color: '#6366f1', light: '#e0e7ff' },
  { icon: PenLine,  title: 'Real Answer Writing',     desc: 'Write full answers, not just click options. Track word count and structure.', color: '#8b5cf6', light: '#ede9fe' },
  { icon: Target,   title: 'Time Pressure Analysis',  desc: 'Know exactly where you spend too much — or too little — time.', color: '#ec4899', light: '#fce7f3' },
  { icon: Brain,    title: 'AI Evaluation',           desc: 'Gemini-powered analysis of correctness, completeness, and exam-readiness.', color: '#0ea5e9', light: '#e0f2fe' },
  { icon: Zap,      title: 'Auto-Save & Offline',     desc: 'Answers save automatically. IndexedDB backup keeps data safe offline.', color: '#f59e0b', light: '#fef3c7' },
  { icon: Award,    title: 'Half Century & Century',  desc: 'Milestone celebrations at 50 and 100 questions. Track your exam readiness.', color: '#10b981', light: '#d1fae5' },
  { icon: BookOpen, title: 'Multi-Exam Support',      desc: 'GATE, JEE, UPSC, University — one engine, every exam pattern.', color: '#f43f5e', light: '#ffe4e6' },
  { icon: BarChart3,title: 'Deep Analytics',          desc: 'Score by topic, time per question, weak areas, and readiness metrics.', color: '#14b8a6', light: '#ccfbf1' },
  { icon: Shield,   title: 'Secure & Private',        desc: 'Your data is yours. RLS protection. No exposed API keys.', color: '#64748b', light: '#f1f5f9' },
];

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  light: string;
}

function IDCard({
  feature,
  stackIndex,
  totalVisible,
  onSwipe,
}: {
  feature: Feature;
  stackIndex: number;
  totalVisible: number;
  onSwipe: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Drag-based rotations
  const dragRotateZ = useTransform(x, [-300, 300], [-35, 35]);
  const rotateY = useTransform(x, [-300, 300], [-25, 25]);
  const rotateX = useTransform(y, [-300, 300], [20, -20]);

  // Strap elastic stretch
  const strapScaleY = useTransform(y, (val) => Math.max(0.3, 1 + val / 200));

  const isFront = stackIndex === 0;

  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 110 || Math.abs(info.offset.y) > 110 || Math.abs(info.velocity.x) > 500) {
      onSwipe();
    }
  };

  const Icon = feature.icon;
  const depthScale = 1 - stackIndex * 0.05;
  const depthY = stackIndex * 18;
  const depthOpacity = stackIndex === 0 ? 1 : stackIndex === 1 ? 0.8 : 0.4;
  const restingRotation = stackIndex % 2 === 0 ? stackIndex * 2 : stackIndex * -2;

  return (
    <motion.div
      className="absolute top-0 left-0 right-0 mx-auto flex flex-col items-center select-none"
      style={{
        zIndex: totalVisible - stackIndex,
        x: isFront ? x : 0,
        y: isFront ? y : depthY,
        rotateZ: isFront ? dragRotateZ : restingRotation,
        rotateY: isFront ? rotateY : 0,
        rotateX: isFront ? rotateX : 0,
        scale: depthScale,
        opacity: depthOpacity,
        transformOrigin: 'top center',
      }}
      drag={isFront}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 1.2 }}
    >
      {/* ── Lanyard strap ─────────────────────────────────────── */}
      <div className="relative flex flex-col items-center" style={{ zIndex: 10 }}>
        {/* Woven purple fabric strap */}
        <motion.div
          className="w-11 h-32 relative overflow-hidden shadow-md"
          style={{
            background: 'repeating-linear-gradient(0deg, #8b5cf6 0px, #8b5cf6 2px, #7c3aed 2px, #7c3aed 4px)',
            scaleY: isFront ? strapScaleY : 1,
            transformOrigin: 'top center',
          }}
        >
          {/* Subtle fabric lighting/shadows */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
          <div className="absolute top-0 left-2 w-px h-full bg-white/10" />
          <div className="absolute top-0 right-2 w-px h-full bg-black/10" />
        </motion.div>

        {/* Metal D-ring wrapping the strap */}
        <div
          className="w-11 h-5 relative -mt-1 z-20"
          style={{
            borderBottom: '3.5px solid #d4d4d8',
            borderLeft: '3.5px solid #d4d4d8',
            borderRight: '3.5px solid #d4d4d8',
            borderRadius: '0 0 999px 999px',
            background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.1) 100%)',
            boxShadow: '0 4px 4px -2px rgba(0,0,0,0.4)',
          }}
        />

        {/* Swivel joint */}
        <div className="flex flex-col items-center -mt-[2px] z-20">
          <div
            className="w-2.5 h-4 relative shadow-sm"
            style={{
              background: 'linear-gradient(90deg, #a1a1aa 0%, #f4f4f5 50%, #a1a1aa 100%)',
              borderLeft: '1px solid #71717a',
              borderRight: '1px solid #71717a',
            }}
          />
          {/* Joint base */}
          <div className="w-4 h-1.5 rounded-full bg-gradient-to-b from-[#f4f4f5] to-[#a1a1aa] border border-[#71717a] -mt-0.5 z-30 shadow-sm" />
        </div>

        {/* Lobster Clasp / Hook */}
        <div className="flex flex-col items-center -mt-[2px] relative z-20">
          <div
            className="w-5 h-8 relative"
            style={{
              border: '3px solid #d4d4d8',
              borderRadius: '999px 999px 12px 12px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.5) 50%, rgba(0,0,0,0.05) 100%)',
              boxShadow: '0 6px 6px -2px rgba(0,0,0,0.3)',
            }}
          >
            {/* The spring latch on the clip */}
            <div className="absolute right-[-3px] top-2 w-1.5 h-3.5 bg-gradient-to-r from-[#a1a1aa] to-[#d4d4d8] rounded-full border border-[#71717a]" />
          </div>
        </div>
      </div>

      {/* ── ID Card body ───────────────────────────────────────── */}
      <motion.div
        className="relative w-72 rounded-[20px] overflow-hidden -mt-5"
        style={{
          background: 'var(--card)',
          boxShadow: isFront
            ? `0 30px 60px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.1)`
            : `0 10px 30px -8px rgba(0,0,0,0.2)`,
          cursor: isFront ? 'grab' : 'default',
        }}
        whileDrag={{ cursor: 'grabbing', scale: 1.05 }}
      >
        {/* Realistic punch hole for the clip */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-3.5 rounded-full bg-background shadow-[inset_0_3px_5px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.2)] z-30" />

        {/* Glossy sheen overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[20px] z-40"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(255,255,255,0.04) 100%)',
          }}
        />

        {/* Colored header band */}
        <div
          className="h-24 relative"
          style={{ background: `linear-gradient(135deg, ${feature.color}ee, ${feature.color}88)` }}
        >
          {/* Subtle halftone pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }}
          />
          {/* Logo watermark */}
          <span className="absolute top-3 right-4 text-white/20 text-2xl font-black tracking-tighter select-none">SY</span>

          {/* Badge number — positioned top-left so it doesn't collide with the icon */}
          <span
            className="absolute top-3 left-4 z-10 text-xs font-mono font-bold tracking-widest px-2 py-0.5 rounded"
            style={{ background: 'rgba(0,0,0,0.25)', color: 'rgba(255,255,255,0.9)' }}
          >
            FEATURE #{String(features.indexOf(feature) + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Icon badge — overlapping header/body */}
        <div className="flex justify-center -mt-8 relative z-20 mb-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-[var(--card)]"
            style={{ background: feature.light }}
          >
            <Icon className="w-8 h-8" style={{ color: feature.color }} />
          </div>
        </div>

        {/* Card content */}
        <div className="px-6 pb-6 text-center flex flex-col items-center gap-2">
          <h4 className="text-base font-bold text-foreground leading-snug">{feature.title}</h4>
          <p className="text-xs text-muted leading-relaxed">{feature.desc}</p>

          {/* Divider */}
          <div className="w-12 h-px bg-border my-2" />

          {/* Footer ID row */}
          <div className="flex items-center gap-3 text-[9px] font-mono uppercase tracking-widest text-muted/60">
            <span>SAMAYYUDH 2.0</span>
            <span style={{ color: feature.color }}>●</span>
            <span>VALID: ALL EXAMS</span>
          </div>

          {/* Barcode strip */}
          <div className="flex gap-px mt-2 opacity-30">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[1px]"
                style={{
                  width: i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
                  height: i % 5 === 0 ? 20 : 14,
                  background: 'var(--foreground)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom punch hole row */}
        <div className="absolute bottom-3 right-4 flex gap-1.5">
          {[1,2,3].map(d => (
            <div key={d} className="w-1.5 h-1.5 rounded-full bg-border opacity-60" />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FeatureIdCards() {
  const [queue, setQueue] = useState(features);
  const [exiting, setExiting] = useState(false);

  const handleSwipe = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => {
      setQueue(prev => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
      setExiting(false);
    }, 200);
  };

  const visible = queue.slice(0, 3);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Stack container — exact size of content, no invisible overflow */}
      <div className="relative w-72 id-card-sway" style={{ height: '500px', perspective: '1200px' }}>
        <AnimatePresence mode="popLayout">
          {visible.map((f, i) => (
            <IDCard
              key={f.title}
              feature={f}
              stackIndex={i}
              totalVisible={visible.length}
              onSwipe={handleSwipe}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Swipe hint */}
      <div className="flex flex-col items-center gap-1 mt-6">
        <div className="flex gap-1.5">
          {features.map((f) => (
            <div
              key={f.title}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                background: queue[0].title === f.title
                  ? queue[0].color
                  : 'var(--border)',
                transform: queue[0].title === f.title ? 'scale(1.4)' : 'scale(1)',
              }}
            />
          ))}
        </div>
        <p className="text-xs text-muted/70 mt-1 font-medium tracking-wide">
          Drag to explore all {features.length} features
        </p>
      </div>
    </div>
  );
}
