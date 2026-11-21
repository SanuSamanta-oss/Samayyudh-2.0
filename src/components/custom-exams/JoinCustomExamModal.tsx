'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Radio,
  ArrowRight,
  ShieldCheck,
  Video,
  Clock,
  Award,
  CheckCircle2,
  AlertTriangle,
  CameraOff,
  User,
  Sparkles,
} from 'lucide-react';
import type { CustomExam, CustomExamParticipant } from '@/types/custom-exam';

interface JoinCustomExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoined: (exam: CustomExam, participant: CustomExamParticipant) => void;
  initialCode?: string;
}

export function JoinCustomExamModal({
  isOpen,
  onClose,
  onJoined,
  initialCode = '',
}: JoinCustomExamModalProps) {
  const [code, setCode] = useState(initialCode);
  const [verifying, setVerifying] = useState(false);
  const [exam, setExam] = useState<CustomExam | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Device & Camera State
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [joining, setJoining] = useState(false);

  // Real-time lookup of CE code
  const handleVerifyCode = async () => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setError('Please enter a valid examination code (e.g. CE4821).');
      return;
    }

    setVerifying(true);
    setError(null);
    setExam(null);

    try {
      const res = await fetch(`/api/custom-exams/${cleanCode}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid examination code.');
        setVerifying(false);
        return;
      }

      setExam(data.exam);

      // Start webcam preview if supervision enabled
      if (data.exam?.supervision_enabled) {
        startWebcam();
      }
    } catch {
      setError('Network error while validating examination code.');
    } finally {
      setVerifying(false);
    }
  };

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      setCameraStream(mediaStream);
      setCameraReady(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn('Webcam check failed:', err);
      setCameraReady(false);
    }
  };

  // Attach stream whenever video element mounts
  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraStream, exam]);

  // Clean up media tracks when closed
  useEffect(() => {
    if (!isOpen && cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
      setCameraReady(false);
    }
  }, [isOpen, cameraStream]);

  const handleJoin = async () => {
    if (!exam) return;

    setJoining(true);
    setError(null);

    try {
      const res = await fetch('/api/custom-exams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_code: exam.exam_code,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to join examination.');
        setJoining(false);
        return;
      }

      onJoined(exam, data.participant);
    } catch {
      setError('Network error while connecting to examination session.');
      setJoining(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 14 }}
        className="relative w-full max-w-lg rounded-[32px] bg-white dark:bg-[#111A2E] shadow-[0_25px_70px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.8)] p-6 sm:p-8 my-auto border-0 outline-none"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Join Custom Examination
              </h2>
              <p className="text-xs text-slate-400">
                Enter your invitation code provided by your educator
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer border-0 outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* CODE INPUT BAR */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Examination Code (Format: CE####)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. CE4821"
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-[#162032] border-0 outline-none text-base font-mono font-bold tracking-widest text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500/40 uppercase"
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                disabled={verifying || !code.trim()}
                className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer border-0 outline-none flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <span>{verifying ? 'Checking...' : 'Verify'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* VERIFIED EXAM PREVIEW CARD */}
          {exam && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-slate-100/60 dark:bg-[#162032] shadow-xs border-0 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 mb-1 font-mono">
                    {exam.exam_code}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {exam.description || 'Verified custom curriculum examination.'}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="block text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                    {exam.duration_minutes} Mins
                  </span>
                  <span className="block text-[11px] text-slate-400">
                    {exam.total_marks} Marks
                  </span>
                </div>
              </div>

              {/* PHOTO BOOTH WEBCAM PREVIEW IF SUPERVISION ACTIVE */}
              {exam.supervision_enabled && (
                <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      Live Proctoring Camera Check
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cameraReady
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {cameraReady ? 'Camera Active' : 'Connecting Device...'}
                    </span>
                  </div>

                  {/* Photo Booth Preview Window */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-slate-200/50 dark:border-white/10 shadow-inner flex items-center justify-center">
                    {cameraReady ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover -scale-x-100 pointer-events-none"
                      />
                    ) : (
                      <div className="text-center text-white text-xs space-y-1.5 p-4">
                        <CameraOff className="w-6 h-6 text-rose-400 mx-auto" />
                        <p className="font-semibold">Front Camera Required</p>
                        <p className="text-[10px] text-slate-400">
                          Please allow browser camera permissions when prompted.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Join Confirm Button */}
              <button
                type="button"
                onClick={handleJoin}
                disabled={joining || (exam.supervision_enabled && !cameraReady)}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm tracking-tight shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{joining ? 'Connecting to Session...' : 'Enter Examination Lobby'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
