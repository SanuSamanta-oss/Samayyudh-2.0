'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  Camera,
  Flashlight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Keyboard,
  ShieldCheck,
  Search,
  UserCheck,
  Radio,
} from 'lucide-react';
import { qrScanningLaserVariants } from '@/lib/motion-presets';
import { IdentityCard } from '@/components/common/IdentityCard';

interface QrVerificationScannerProps {
  onVerified?: (data: any) => void;
  onOpenLiveSupervision?: (studentId: string) => void;
}

export function QrVerificationScanner({
  onVerified,
  onOpenLiveSupervision,
}: QrVerificationScannerProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [manualCodeInput, setManualCodeInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [verifiedData, setVerifiedData] = useState<any | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Start Camera
  const startScannerCamera = async () => {
    try {
      setErrorMsg(null);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setCameraActive(true);
      setScanning(true);
    } catch (err: any) {
      console.warn('Camera access warning for QR:', err);
      setErrorMsg('Camera permission denied or camera unavailable. You can use manual LCE code verification below.');
      setCameraActive(false);
    }
  };

  const stopScannerCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
    setScanning(false);
  };

  useEffect(() => {
    startScannerCamera();
    return () => stopScannerCamera();
  }, [facingMode]);

  // Toggle Torch/Flashlight
  const toggleFlashlight = async () => {
    if (!mediaStreamRef.current) return;
    const track = mediaStreamRef.current.getVideoTracks()[0];
    const capabilities: any = track.getCapabilities?.() || {};
    if (capabilities.torch) {
      try {
        const nextTorch = !torchEnabled;
        await track.applyConstraints({ advanced: [{ torch: nextTorch } as any] });
        setTorchEnabled(nextTorch);
      } catch (err) {
        console.warn('Torch failed:', err);
      }
    }
  };

  // Switch between front & back camera
  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Manual fallback verification
  const handleManualVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCodeInput.trim()) return;

    setVerifying(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/proctoring/qr/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manualCode: manualCodeInput.trim(), action: 'confirm_attendance' }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Verification failed');
      } else {
        setVerifiedData(data);
        onVerified?.(data);
      }
    } catch {
      setErrorMsg('Network error while verifying code.');
    } finally {
      setVerifying(false);
    }
  };

  // Simulated QR Code Detection (e.g. from camera barcode detection or test tap)
  const handleSimulateScan = async (sampleQrData?: string) => {
    setVerifying(true);
    setErrorMsg(null);

    const payload =
      sampleQrData ||
      `SYQR:${Buffer.from(
        JSON.stringify({
          sid: 'student_sample_id',
          lce: manualCodeInput.trim().toUpperCase() || 'LCE001',
          exam: 'LCE-EX-0001',
          sess: 'session_active_sample',
          ts: Date.now(),
        })
      ).toString('base64')}.abcdef1234567890`;

    try {
      const res = await fetch('/api/proctoring/qr/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData: payload }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to verify QR token');
      } else {
        setVerifiedData(data);
        onVerified?.(data);
      }
    } catch {
      setErrorMsg('Verification failed. Check network.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto w-full space-y-6">
      {/* SUCCESS CARD ON PHYSICAL VERIFICATION */}
      <AnimatePresence>
        {verifiedData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            className="w-full p-6 rounded-[28px] bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-500/20 shadow-lg text-left space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Physical Presence Verified
              </span>
              <button
                type="button"
                onClick={() => setVerifiedData(null)}
                className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white cursor-pointer"
              >
                Scan Next Student
              </button>
            </div>

            <IdentityCard
              code={verifiedData.student_lce_code || verifiedData.code || 'LCE001'}
              entityType="student"
              name={verifiedData.student_name || verifiedData.student?.display_name || 'Examinee'}
              sublabel={`Exam: ${verifiedData.exam_code || 'LCE-EX-0001'} • Timestamp: ${new Date().toLocaleTimeString()}`}
              verified={true}
            />

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  onOpenLiveSupervision?.(verifiedData.student_id);
                }}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer border-0 outline-none"
              >
                <Radio className="w-4 h-4" />
                <span>Open Live Face Supervision</span>
              </button>

              <button
                type="button"
                onClick={() => setVerifiedData(null)}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-white dark:bg-[#1D2330] hover:bg-neutral-100 dark:hover:bg-[#252C3D] text-neutral-800 dark:text-neutral-200 font-medium text-xs sm:text-sm transition-all border border-neutral-200/60 dark:border-white/10 active:scale-95 cursor-pointer outline-none"
              >
                Scan Another Student
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SCANNER CAMERA CONTAINER */}
      {!verifiedData && (
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[380px] rounded-[32px] overflow-hidden bg-neutral-900 border border-neutral-200/40 dark:border-white/10 shadow-xl flex items-center justify-center">
          {cameraActive ? (
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-neutral-400 space-y-3">
              <Camera className="w-10 h-10 opacity-50" />
              <p className="text-xs max-w-xs">{errorMsg || 'Initializing camera feed...'}</p>
              <button
                type="button"
                onClick={startScannerCamera}
                className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer border-0 outline-none"
              >
                Retry Camera
              </button>
            </div>
          )}

          {/* Darkened Overlay with Softly Rounded Scanning Viewport */}
          {cameraActive && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {/* Scanning Box with Corner Highlights */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-[28px] border-2 border-emerald-400/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] overflow-hidden">
                {/* 4 Corner Indicators */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-300 rounded-tl-lg" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-300 rounded-tr-lg" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-300 rounded-bl-lg" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-300 rounded-br-lg" />

                {/* Animated Scanning Laser Line */}
                <motion.div
                  variants={qrScanningLaserVariants}
                  animate="scan"
                  className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                />
              </div>
            </div>
          )}

          {/* Floating Controls Overlay (Flashlight, Camera Switch) */}
          {cameraActive && (
            <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
              <button
                type="button"
                onClick={toggleFlashlight}
                title="Toggle Flashlight"
                className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer border-0 outline-none ${
                  torchEnabled ? 'bg-amber-400 text-black' : 'bg-black/50 text-white hover:bg-black/70'
                }`}
              >
                <Flashlight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={switchCamera}
                title="Switch Camera"
                className="p-2.5 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all cursor-pointer border-0 outline-none"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Scanner Guidance Footer */}
          {cameraActive && (
            <div className="absolute bottom-3 inset-x-0 flex items-center justify-center pointer-events-none">
              <span className="px-3.5 py-1 rounded-full text-[11px] font-medium bg-black/60 text-white/90 backdrop-blur-md">
                Align student exam QR code inside frame
              </span>
            </div>
          )}
        </div>
      )}

      {/* ERROR MESSAGE DISPLAY */}
      {errorMsg && (
        <div className="w-full p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* MANUAL FALLBACK CODE ENTRY ACCORDION */}
      <div className="w-full p-5 rounded-[24px] bg-white dark:bg-[#171B24] border border-neutral-200/60 dark:border-white/10 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-neutral-500" />
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
              Manual Fallback Identification
            </span>
          </div>
          <span className="text-[11px] text-neutral-400">If QR damaged or camera unavailable</span>
        </div>

        <form onSubmit={handleManualVerify} className="flex gap-2">
          <input
            type="text"
            value={manualCodeInput}
            onChange={(e) => setManualCodeInput(e.target.value.toUpperCase())}
            placeholder="Enter Student LCE Code (e.g. LCE001)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#1D2330] border border-neutral-200/60 dark:border-white/10 font-mono text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
          <button
            type="submit"
            disabled={verifying || !manualCodeInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50 border-0 outline-none flex items-center gap-1.5"
          >
            {verifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-4 h-4" />}
            <span>Verify</span>
          </button>
        </form>

        {/* Quick test trigger */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-100 dark:border-white/5">
          <span>Fast simulation for test benches:</span>
          <button
            type="button"
            onClick={() => handleSimulateScan()}
            className="font-medium text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
          >
            Simulate Student QR Pass
          </button>
        </div>
      </div>
    </div>
  );
}
