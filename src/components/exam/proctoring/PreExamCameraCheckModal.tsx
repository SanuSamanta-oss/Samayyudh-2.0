'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  CameraOff,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface PreExamCameraCheckModalProps {
  isOpen: boolean;
  examTitle: string;
  onConfirm: (stream: MediaStream) => void;
  onCancel?: () => void;
}

export function PreExamCameraCheckModal({
  isOpen,
  examTitle,
  onConfirm,
  onCancel,
}: PreExamCameraCheckModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionState, setPermissionState] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Request camera stream
  const startCamera = async () => {
    setPermissionState('requesting');
    setErrorMessage(null);

    // Stop existing stream if any
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 24, max: 30 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setPermissionState('granted');

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('[CameraCheck] Permission or device error:', err);
      setPermissionState('denied');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Camera access was denied. Please allow camera permissions in your browser address bar.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('No camera device detected. Please connect a webcam or enable your front camera.');
      } else {
        setErrorMessage('Could not activate camera. Please check your browser privacy settings and try again.');
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    }
    return () => {
      // Don't kill stream here if user confirms; onConfirm passes it to the parent
    };
  }, [isOpen]);

  // Attach stream to video tag whenever granted or videoRef mounts
  useEffect(() => {
    if (permissionState === 'granted' && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [permissionState, stream]);

  const handleConfirm = () => {
    if (stream) {
      onConfirm(stream);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-lg bg-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-border/80 my-auto text-center flex flex-col items-center"
        >
          {/* Header Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AI Remote Proctoring Verification</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Camera &amp; Environment Check
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
            {examTitle} requires live video supervision. Center your face in the circular frame below.
          </p>

          {/* Circular Camera Preview Container */}
          <div className="relative my-6 flex items-center justify-center">
            {/* Outer Subtle Radial Ambient Glow */}
            <div className="absolute -inset-4 rounded-full bg-brand-500/15 dark:bg-brand-500/25 blur-xl pointer-events-none" />

            {/* Circular Camera Mask Frame */}
            <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-full overflow-hidden border-2 border-brand-500/40 dark:border-brand-400/50 shadow-inner bg-stone-900 flex items-center justify-center">
              {permissionState === 'granted' ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover -scale-x-100"
                  />
                  {/* Subtle Face Alignment HUD Ring */}
                  <div className="absolute inset-4 rounded-full border border-dashed border-white/40 pointer-events-none" />
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>Camera Ready</span>
                  </div>
                </>
              ) : permissionState === 'requesting' ? (
                <div className="flex flex-col items-center gap-2 p-4 text-white">
                  <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-medium text-stone-300">Requesting Camera...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 p-4 text-center text-white">
                  <CameraOff className="w-8 h-8 text-rose-400" />
                  <span className="text-xs font-medium text-stone-300">Camera Unavailable</span>
                </div>
              )}
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="w-full mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Privacy & Transparency Notice */}
          <div className="w-full p-3 rounded-2xl bg-surface border border-border/70 text-xs text-stone-600 dark:text-stone-300 text-left space-y-1 mb-5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Lock className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Session Supervision Transparency</span>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-500 dark:text-stone-400">
              Video is transmitted encrypted via peer-to-peer WebRTC directly to your assigned faculty proctor.
              Streams are live-only and never saved or made public without explicit authorization.
            </p>
          </div>

          {/* Actions */}
          <div className="w-full flex items-center gap-3">
            {permissionState === 'denied' && (
              <button
                type="button"
                onClick={startCamera}
                className="flex-1 py-3 px-4 rounded-2xl border border-border hover:bg-surface font-semibold text-xs sm:text-sm text-foreground transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Permission</span>
              </button>
            )}

            <button
              type="button"
              disabled={permissionState !== 'granted'}
              onClick={handleConfirm}
              className="flex-1 py-3 px-5 rounded-2xl bg-gradient-brand text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Confirm &amp; Enter Exam</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
