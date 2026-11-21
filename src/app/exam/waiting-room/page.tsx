'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  CameraOff,
  Radio,
  Wifi,
  ShieldCheck,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  User,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import type { CustomExam } from '@/types/custom-exam';

function WaitingRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examCode = searchParams.get('code') || searchParams.get('customExam') || 'CE4821';

  const [exam, setExam] = useState<CustomExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Camera permissions & preview
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load exam details
  useEffect(() => {
    let active = true;
    async function fetchExam() {
      try {
        const res = await fetch(`/api/custom-exams/${examCode}`);
        if (!res.ok) {
          throw new Error('Examination not found or invalid code.');
        }
        const data = await res.json();
        if (active) {
          setExam(data.exam);
          setLoading(false);

          // Register student into the waiting room participant list
          try {
            let sId = localStorage.getItem('sy_student_id');
            if (!sId) {
              sId = `stud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
              localStorage.setItem('sy_student_id', sId);
            }
            const sName = localStorage.getItem('sy_student_name') || 'Candidate Student';
            const sLce = localStorage.getItem('sy_student_lce') || `LCE-${Math.floor(1000 + Math.random() * 9000)}`;

            await fetch('/api/custom-exams/join', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                exam_code: examCode,
                student_id: sId,
                student_name: sName,
                student_lce_code: sLce,
              }),
            });
          } catch {}

          // If already in progress, redirect straight to session
          if (data.exam?.status === 'in_progress') {
            router.push(`/exam/session?customExam=${examCode}`);
          }
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Failed to load examination.');
          setLoading(false);
        }
      }
    }

    fetchExam();
    return () => {
      active = false;
    };
  }, [examCode, router]);

  // Request camera stream
  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraPermission('granted');
    } catch {
      setCameraPermission('denied');
    }
  };

  useEffect(() => {
    requestCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Poll for exam start or teacher individual admission
  useEffect(() => {
    if (!exam || exam.status === 'in_progress') return;

    const interval = setInterval(async () => {
      try {
        const sId = typeof window !== 'undefined' ? localStorage.getItem('sy_student_id') : null;
        if (sId) {
          const statusRes = await fetch(
            `/api/custom-exams/student-status?exam_id=${exam.id || examCode}&student_id=${sId}`
          );
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            if (statusData.participant?.exam_status === 'in_progress') {
              clearInterval(interval);
              router.push(`/exam/session?customExam=${examCode}`);
              return;
            }
          }
        }

        const res = await fetch(`/api/custom-exams/${examCode}`);
        if (res.ok) {
          const data = await res.json();
          if (data.exam?.status === 'in_progress') {
            clearInterval(interval);
            router.push(`/exam/session?customExam=${examCode}`);
          }
        }
      } catch {}
    }, 2000);

    return () => clearInterval(interval);
  }, [exam, examCode, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-6 text-foreground">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-stone-500">Connecting to secure waiting room...</p>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-6 text-foreground">
        <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl p-8 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold">Access Verification Error</h2>
          <p className="text-sm text-stone-500">{error || 'Could not verify custom exam code.'}</p>
          <button
            type="button"
            onClick={() => router.push('/exams')}
            className="w-full py-3 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm font-semibold hover:bg-stone-200 cursor-pointer"
          >
            Return to Examination Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-foreground flex flex-col justify-between p-4 md:p-8">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-stone-200/60 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black tracking-wider text-sm shadow-md">
            SY
          </div>
          <div>
            <h1 className="text-lg font-bold">SAMAYYUDH 2.0</h1>
            <p className="text-xs text-stone-500">Live Secure Examination Waiting Room</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/70 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>Awaiting Invigilator Start</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto w-full grid md:grid-cols-12 gap-8 my-auto py-8">
        {/* Left Column: Examination Details & Policy */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 md:p-8 shadow-xs border border-stone-200/60 dark:border-stone-800 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-bold tracking-wider">
              CODE: {exam.exam_code}
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight">
              {exam.title}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-3.5">
                <span className="text-xs text-stone-400 block font-medium">Duration</span>
                <span className="text-sm font-bold text-foreground mt-0.5 block">{exam.duration_minutes} Mins</span>
              </div>
              <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-3.5">
                <span className="text-xs text-stone-400 block font-medium">Total Marks</span>
                <span className="text-sm font-bold text-foreground mt-0.5 block">{exam.total_marks} Pts</span>
              </div>
              <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-3.5">
                <span className="text-xs text-stone-400 block font-medium">Supervision</span>
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-0.5 block">Live Proctored</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Rules & Instructions</h3>
              <ul className="text-xs text-stone-600 dark:text-stone-300 space-y-2 list-disc list-inside leading-relaxed">
                <li>Your webcam stream will be monitored live by authorized invigilators only.</li>
                <li>Ensure you are in a quiet, well-illuminated room with your full face visible.</li>
                <li>Switching browser tabs or applications will trigger automated supervisory alerts.</li>
                <li>Once the teacher initiates the examination, your official countdown timer will start.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Camera Verification & Readiness */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-xs border border-stone-200/60 dark:border-stone-800 space-y-5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Camera className="w-4 h-4 text-purple-600" />
              <span>Camera Setup & Verification</span>
            </h3>

            {/* Video Preview Frame */}
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-900 flex items-center justify-center shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-300 ${
                  cameraPermission === 'granted' ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {cameraPermission === 'pending' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70 p-4 text-center">
                  <Camera className="w-8 h-8 animate-pulse mb-2 text-purple-400" />
                  <p className="text-xs">Requesting camera authorization...</p>
                </div>
              )}

              {cameraPermission === 'denied' && (
                <div className="absolute inset-0 bg-stone-900/90 flex flex-col items-center justify-center text-white p-4 text-center space-y-2">
                  <CameraOff className="w-8 h-8 text-rose-500 mb-1" />
                  <p className="text-xs font-bold text-rose-400">Camera Permission Blocked</p>
                  <p className="text-[11px] text-stone-400 max-w-xs">
                    Please allow camera access in your browser settings to enter the supervised examination.
                  </p>
                  <button
                    type="button"
                    onClick={requestCamera}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer mt-2"
                  >
                    Retry Permission
                  </button>
                </div>
              )}

              {cameraPermission === 'granted' && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-[10px] font-bold flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Feed Encrypted & Verified</span>
                </div>
              )}
            </div>

            {/* Candidate Readiness Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsReady(!isReady)}
                disabled={cameraPermission !== 'granted'}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  cameraPermission !== 'granted'
                    ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                    : isReady
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20'
                }`}
              >
                {isReady ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>I Am Ready — Waiting for Invigilator</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Confirm Readiness to Begin</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-5xl mx-auto w-full text-center py-4 text-xs text-stone-400 flex items-center justify-center gap-4">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Anti-Cheat AI Active</span>
        </span>
        <span>•</span>
        <span>End-to-End Encrypted Live Proctoring</span>
        <span>•</span>
        <span>Session ID: {exam.id.slice(0, 8)}</span>
      </div>
    </div>
  );
}

export default function WaitingRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <WaitingRoomContent />
    </Suspense>
  );
}
