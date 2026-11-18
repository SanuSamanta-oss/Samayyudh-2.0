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
      {/* ── DRAGGABLE FLOATING CIRCULAR HUD BUBBLE ── */}
      <motion.div
        drag
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.85, x: 0, y: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed z-40 select-none bottom-6 right-6 md:bottom-8 md:right-8 touch-none pointer-events-auto"
      >
        <AnimatePresence mode="wait">
          {mode === 'minimized' ? (
            /* MINIMIZED CAPSULE: Ultra-sleek floating indicator */
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
            /* NORMAL CIRCULAR HUD BUBBLE: Luxury VisionOS / FaceID Aesthetic */
            <motion.div
              key="normal"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="relative flex flex-col items-center group"
            >
              {/* Soft Ambient Radial Backlight Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-500/25 via-sky-400/20 to-indigo-500/25 blur-xl pointer-events-none group-hover:scale-115 transition-transform duration-500" />

              {/* Ultra-Fine Gradient Outer Border Ring */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full p-[2.5px] bg-gradient-to-tr from-brand-500 via-sky-400 to-indigo-600 shadow-[0_12px_35px_rgba(99,102,241,0.25)] dark:shadow-[0_16px_45px_rgba(0,0,0,0.7)] cursor-grab active:cursor-grabbing">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-stone-950 flex items-center justify-center">
                  {cameraActive && stream ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover -scale-x-100 pointer-events-none"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white text-xs gap-1.5">
                      <CameraOff className="w-5 h-5 text-rose-400" />
                      <span className="text-[10px] font-medium text-stone-300">Camera Paused</span>
                    </div>
                  )}

                  {/* Clean Biometric HUD Overlay (No harsh dashed lines cutting through face) */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none" />

                  {/* Minimalist Viewfinder Reticle Rings at the Outer Boundary */}
                  <svg viewBox="0 0 100 100" className="absolute inset-1.5 w-[calc(100%-12px)] h-[calc(100%-12px)] pointer-events-none opacity-40">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.75" />
                    <path d="M 50 2 L 50 7" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 50 93 L 50 98" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 2 50 L 7 50" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 93 50 L 98 50" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>

                  {/* Frosted Hover Controls Overlay */}
                  <div className="absolute inset-0 bg-black/45 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMode('expanded');
                      }}
                      className="p-2 rounded-full bg-white/25 hover:bg-white/40 text-white transition-all transform active:scale-90 cursor-pointer shadow-sm"
                      title="Expand Video"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMode('minimized');
                      }}
                      className="p-2 rounded-full bg-white/25 hover:bg-white/40 text-white transition-all transform active:scale-90 cursor-pointer shadow-sm"
                      title="Minimize"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Modern Frosted LIVE Badge Nestled at Top Edge */}
              <div className="absolute -top-2.5 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/90 text-white text-[9px] font-extrabold uppercase tracking-widest shadow-[0_4px_14px_rgba(244,63,94,0.45)] backdrop-blur-md border border-white/20 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>LIVE</span>
              </div>

              {/* Modern Frosted SECURE Badge Nestled at Bottom Edge */}
              <div className="absolute -bottom-2.5 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/95 dark:bg-[#121622]/95 border border-stone-200/90 dark:border-white/10 text-[9px] font-bold text-stone-700 dark:text-stone-200 shadow-[0_4px_12px_rgba(0,0,0,0.12)] backdrop-blur-md pointer-events-none">
                <span className={`w-1.5 h-1.5 rounded-full ${connectionColors[connectionQuality]}`} />
                <span>SECURE</span>
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
