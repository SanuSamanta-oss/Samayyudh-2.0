'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  CameraOff,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Wifi,
  WifiOff,
  AlertTriangle,
  X,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface StudentProctoringBubbleProps {
  stream: MediaStream | null;
  cameraActive: boolean;
  connectionQuality?: 'good' | 'fair' | 'poor' | 'offline';
  isLive?: boolean;
  examTitle?: string;
  warningMessage?: string | null;
  onDismissWarning?: () => void;
}

export function StudentProctoringBubble({
  stream,
  cameraActive,
  connectionQuality = 'good',
  isLive = true,
  examTitle = 'Examination',
  warningMessage = null,
  onDismissWarning,
}: StudentProctoringBubbleProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const expandedVideoRef = useRef<HTMLVideoElement>(null);

  const [mode, setMode] = useState<'normal' | 'minimized' | 'expanded'>('normal');

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
    if (stream && expandedVideoRef.current) {
      expandedVideoRef.current.srcObject = stream;
      expandedVideoRef.current.play().catch(() => {});
    }
  }, [stream, mode]);

  const connectionColors = {
    good: 'bg-emerald-500 shadow-[0_0_8px_#10B981]',
    fair: 'bg-amber-500 shadow-[0_0_8px_#F59E0B]',
    poor: 'bg-orange-500 shadow-[0_0_8px_#F97316]',
    offline: 'bg-rose-500 shadow-[0_0_8px_#EF4444]',
  };

  return (
    <>
      {/* ── DRAGGABLE FLOATING PROCTORING WINDOW (Sketch / Photo Booth Style) ── */}
      <motion.div
        drag
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.85, x: 0, y: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed z-40 select-none bottom-6 right-6 md:bottom-8 md:right-8 touch-none pointer-events-auto"
      >
        <AnimatePresence mode="wait">
          {mode === 'minimized' ? (
            /* MINIMIZED CAPSULE: Sleek floating indicator */
            <motion.div
              key="minimized"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={() => setMode('normal')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 dark:bg-[#121622]/90 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.6)] border border-stone-200/80 dark:border-white/10 cursor-pointer hover:scale-105 active:scale-95 transition-all text-foreground"
            >
              <div className="relative flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="absolute w-3.5 h-3.5 rounded-full bg-rose-500/40 animate-ping" />
              </div>
              <Camera className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span className="text-[10px] font-extrabold tracking-widest text-foreground uppercase">Proctored</span>
            </motion.div>
          ) : (
            /* NORMAL WINDOW: Exact Match to User Sketch & macOS Photo Booth Frame */
            <motion.div
              key="normal"
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative group select-none cursor-grab active:cursor-grabbing"
            >
              {/* Soft Ambient Radial Backlight Glow */}
              <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-tr from-purple-500/20 via-sky-400/15 to-indigo-500/20 blur-xl pointer-events-none group-hover:scale-105 transition-transform duration-500" />

              {/* Main Outer Window Frame (Vertical Rounded Rectangle Card) */}
              <div className="relative w-44 sm:w-48 rounded-[26px] bg-white/95 dark:bg-[#111622]/95 backdrop-blur-xl p-2.5 sm:p-3 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_-8px_rgba(0,0,0,0.75)] border border-slate-200/90 dark:border-white/10 flex flex-col transition-colors">
                
                {/* ── TOP HEADER BAR (Exact Sketch: Expand Icon on Left, Red Live Dot on Right) ── */}
                <div className="flex items-center justify-between px-1 pt-0.5 pb-2">
                  {/* Top-Left: Expand / Inspect Preview Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMode('expanded');
                    }}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all cursor-pointer outline-none active:scale-90"
                    title="Expand Video Preview"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Top-Center: Subtle Live Video Label */}
                  <div className="flex items-center gap-1 opacity-70">
                    <span className="text-[9px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                      Live Video
                    </span>
                  </div>

                  {/* Top-Right: Solid Red Live Recording Indicator Dot */}
                  <div
                    className="relative flex items-center justify-center p-1"
                    title="Live Proctoring Stream Active"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.85)]" />
                    <span className="absolute w-4 h-4 rounded-full bg-rose-500/35 animate-ping pointer-events-none" />
                  </div>
                </div>

                {/* ── NESTED ROUNDED RECTANGULAR VIDEO VIEWPORT ── */}
                <div className="relative w-full aspect-[4/3] rounded-[18px] overflow-hidden bg-stone-950 border border-slate-200/60 dark:border-white/10 shadow-inner flex items-center justify-center">
                  {cameraActive && stream ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover -scale-x-100 pointer-events-none"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white text-xs gap-1.5 p-3 text-center">
                      <CameraOff className="w-5 h-5 text-rose-400" />
                      <span className="text-[10px] font-medium text-stone-300">Camera Paused</span>
                    </div>
                  )}

                  {/* Clean Subtle Inner Vignette */}
                  <div className="absolute inset-0 rounded-[18px] shadow-[inset_0_0_15px_rgba(0,0,0,0.4)] pointer-events-none" />

                  {/* Viewfinder Corner Accents */}
                  <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/40 pointer-events-none rounded-tl-sm" />
                  <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/40 pointer-events-none rounded-tr-sm" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/40 pointer-events-none rounded-bl-sm" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/40 pointer-events-none rounded-br-sm" />

                  {/* Hover Controls Overlay */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMode('expanded');
                      }}
                      className="p-1.5 rounded-full bg-white/20 hover:bg-white/35 text-white transition-all transform active:scale-90 cursor-pointer shadow-sm"
                      title="Inspect Video"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMode('minimized');
                      }}
                      className="p-1.5 rounded-full bg-white/20 hover:bg-white/35 text-white transition-all transform active:scale-90 cursor-pointer shadow-sm"
                      title="Minimize to Pill"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* ── BOTTOM AREA (CHIN) (Photo Booth Base with Connection & Quick Minimize) ── */}
                <div className="flex items-center justify-between px-1.5 pt-2 text-[10px]">
                  <div className="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-300">
                    <span className={`w-1.5 h-1.5 rounded-full ${connectionColors[connectionQuality]}`} />
                    <span className="capitalize">{connectionQuality === 'good' ? 'Secure' : connectionQuality}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMode('minimized');
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer outline-none"
                    title="Minimize"
                  >
                    <Minimize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── TEACHER INTERVENTION LIVE WARNING BANNER ── */}
      <AnimatePresence>
        {warningMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-auto"
          >
            <div className="p-4 rounded-3xl bg-amber-500 text-black shadow-2xl flex items-center justify-between gap-3 border border-amber-400">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Proctor Notice</h4>
                  <p className="text-xs font-medium leading-snug">{warningMessage}</p>
                </div>
              </div>
              {onDismissWarning && (
                <button
                  type="button"
                  onClick={onDismissWarning}
                  className="p-1.5 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EXPANDED INSPECTION MODAL (Modern Luxury Glass UI) ── */}
      <AnimatePresence>
        {mode === 'expanded' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xl select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="relative w-full max-w-lg bg-card/95 dark:bg-[#111622]/95 backdrop-blur-2xl rounded-[32px] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.35)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.85)] border border-border/80 dark:border-white/10 flex flex-col items-center"
            >
              {/* Header */}
              <div className="w-full flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">Proctor Camera Preview</h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">Encrypted invigilator supervision active</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMode('normal')}
                  className="w-8 h-8 rounded-full bg-surface hover:bg-stone-200 dark:hover:bg-white/10 text-stone-500 dark:text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Large Video Frame with Rounded Viewfinder */}
              <div className="relative w-full aspect-video rounded-[24px] overflow-hidden bg-stone-950 shadow-inner flex items-center justify-center border border-black/10 dark:border-white/5">
                {cameraActive && stream ? (
                  <video
                    ref={expandedVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover -scale-x-100"
                  />
                ) : (
                  <div className="text-white text-xs flex flex-col items-center gap-2">
                    <CameraOff className="w-7 h-7 text-rose-400" />
                    <span className="font-medium text-stone-300">Camera is not active</span>
                  </div>
                )}

                {/* Modern Floating LIVE SUPERVISION Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-white text-[10px] font-extrabold tracking-wider flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>LIVE SUPERVISION</span>
                </div>

                {/* Viewfinder Corner Reticles */}
                <div className="absolute top-3 right-3 w-3.5 h-3.5 border-t-2 border-r-2 border-white/50 pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b-2 border-l-2 border-white/50 pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b-2 border-r-2 border-white/50 pointer-events-none" />
              </div>

              {/* Diagnostic Metric Tiles */}
              <div className="w-full grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-surface/80 dark:bg-white/[0.04] border border-border/80 dark:border-white/[0.08] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">Connection</span>
                    <span className="text-xs font-bold text-foreground capitalize truncate block">{connectionQuality} Signal</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface/80 dark:bg-white/[0.04] border border-border/80 dark:border-white/[0.08] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">Camera Device</span>
                    <span className="text-xs font-bold text-foreground truncate block">Webcam Active</span>
                  </div>
                </div>
              </div>

              {/* Encryption & Transparency Notice */}
              <p className="mt-4 text-xs text-stone-500 dark:text-stone-400 text-center leading-relaxed max-w-sm">
                Your video stream is encrypted end-to-end and monitored in real time by authorized invigilators.
              </p>

              {/* Return Button */}
              <button
                type="button"
                onClick={() => setMode('normal')}
                className="w-full mt-4 py-3 rounded-2xl bg-gradient-brand text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Return to Examination</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
