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
  Activity,
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
    good: 'bg-emerald-500',
    fair: 'bg-amber-500',
    poor: 'bg-orange-500',
    offline: 'bg-rose-500',
  };

  return (
    <>
      {/* ── DRAGGABLE FLOATING CIRCULAR HUD BUBBLE ── */}
      <motion.div
        drag
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed z-40 select-none bottom-6 right-6 md:bottom-8 md:right-8 touch-none pointer-events-auto"
      >
        <AnimatePresence mode="wait">
          {mode === 'minimized' ? (
            /* MINIMIZED PILL: Compact, non-intrusive */
            <motion.div
              key="minimized"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => setMode('normal')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/95 dark:bg-[#181622]/95 backdrop-blur-md shadow-lg border border-border/80 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="relative flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="absolute w-4 h-4 rounded-full bg-rose-500/30 animate-ping" />
              </div>
              <Camera className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span className="text-[11px] font-bold tracking-wider text-foreground">PROCTORED</span>
            </motion.div>
          ) : (
            /* NORMAL CIRCULAR HUD BUBBLE: Inspired by reference image */
            <motion.div
              key="normal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative flex flex-col items-center group"
            >
              {/* Outer Ambient Radial Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-500/20 via-sky-400/20 to-emerald-400/20 blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

              {/* Circular Video Frame with HUD Rings */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-br from-brand-500 via-sky-400 to-indigo-600 shadow-xl overflow-hidden cursor-grab active:cursor-grabbing">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                  {cameraActive && stream ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover -scale-x-100 pointer-events-none"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white text-xs gap-1">
                      <CameraOff className="w-5 h-5 text-rose-400" />
                      <span className="text-[10px]">Camera Paused</span>
                    </div>
                  )}

                  {/* High-Tech HUD Guide Rings (Reference Visual Overlay) */}
                  <div className="absolute inset-1 rounded-full border border-white/20 pointer-events-none" />
                  <div className="absolute inset-3 rounded-full border border-dashed border-sky-400/30 pointer-events-none animate-[spin_40s_linear_infinite]" />

                  {/* Corner Accent Brackets */}
                  <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-brand-400/70 pointer-events-none" />
                  <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-brand-400/70 pointer-events-none" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-brand-400/70 pointer-events-none" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-brand-400/70 pointer-events-none" />

                  {/* Quick Control Overlays on Hover */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMode('expanded');
                      }}
                      className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
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
                      className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
                      title="Minimize"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Pills Floating on Bubble Periphery */}
              <div className="absolute -top-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600/90 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md backdrop-blur-sm pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>LIVE</span>
              </div>

              <div className="absolute -bottom-2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-card/90 dark:bg-[#181622]/90 border border-border/80 text-[9px] font-semibold text-foreground shadow-sm backdrop-blur-sm pointer-events-none">
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
            <div className="p-4 rounded-2xl bg-amber-500 text-black shadow-2xl flex items-center justify-between gap-3">
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
                  className="p-1 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EXPANDED INSPECTION MODAL ── */}
      <AnimatePresence>
        {mode === 'expanded' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-card rounded-3xl p-5 shadow-2xl border border-border flex flex-col items-center"
            >
              <div className="w-full flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span className="text-sm font-bold text-foreground">Proctor Camera Preview</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMode('normal')}
                  className="p-1.5 rounded-full hover:bg-surface text-stone-500 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Large Video Preview */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center">
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
                    <CameraOff className="w-6 h-6 text-rose-400" />
                    <span>Camera is not active</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[10px] font-bold tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>LIVE SUPERVISION</span>
                </div>
              </div>

              {/* Diagnostic Metrics */}
              <div className="w-full grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="p-2.5 rounded-xl bg-surface border border-border/60 flex flex-col gap-0.5">
                  <span className="text-stone-400 text-[10px] uppercase font-bold">Connection</span>
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="capitalize">{connectionQuality} Signal</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-surface border border-border/60 flex flex-col gap-0.5">
                  <span className="text-stone-400 text-[10px] uppercase font-bold">Device</span>
                  <div className="flex items-center gap-1.5 font-semibold text-foreground truncate">
                    <Camera className="w-3.5 h-3.5 text-brand-500" />
                    <span className="truncate">Webcam Active</span>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-stone-500 dark:text-stone-400 text-center leading-relaxed">
                Your video stream is encrypted and monitored live by authorized invigilators.
              </p>

              <button
                type="button"
                onClick={() => setMode('normal')}
                className="w-full mt-4 py-2.5 rounded-xl bg-surface hover:bg-stone-200 dark:hover:bg-stone-800 text-foreground font-semibold text-xs transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
