'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProctorViewer } from '@/lib/proctoring/webrtc-service';
import {
  Users,
  Video,
  CameraOff,
  ShieldCheck,
  Clock,
  Radio,
  Wifi,
  Bell,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { IdentityCard } from '@/components/common/IdentityCard';
import { GuardianRegistrationModal } from './GuardianRegistrationModal';
import { livePulseVariants } from '@/lib/motion-presets';

export function GuardianDashboardView() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChildStream, setActiveChildStream] = useState<any | null>(null);
  const [showAddGuardianModal, setShowAddGuardianModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'monitoring' | 'notifications' | 'privacy'>('monitoring');

  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const proctorViewerRef = useRef<ProctorViewer | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/guardian/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        // If any linked child has an active exam session, automatically focus their stream preview
        const activeChild = json.children?.find((c: any) => c.activeSession);
        if (activeChild) {
          setActiveChildStream(activeChild);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch guardian dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000);
    return () => clearInterval(interval);
  }, []);

  // WebRTC viewer connection when child stream is active
  useEffect(() => {
    if (!activeChildStream?.activeSession) {
      proctorViewerRef.current?.stopViewing();
      return;
    }

    const sessionId = activeChildStream.activeSession.examSessionId || 'default_session';
    const viewer = new ProctorViewer(sessionId);
    proctorViewerRef.current = viewer;

    viewer.onStream((stream: MediaStream) => {
      if (videoElementRef.current) {
        videoElementRef.current.srcObject = stream;
        videoElementRef.current.play().catch(() => {});
      }
    });

    viewer.startViewing();

    return () => {
      viewer.stopViewing();
    };
  }, [activeChildStream]);

  const guardian = data?.guardian || {
    fullName: 'Guardian / Parent',
    guardianCode: 'LCG001',
    relationship: 'Legal Guardian',
    mobile: '',
    email: '',
  };

  const children = data?.children || [];
  const notifications = data?.notifications || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* COMPACT TOP NAVIGATION & PROFILE BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[28px] bg-white dark:bg-[#171B24] border border-neutral-200/60 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold font-mono text-base border border-emerald-200/40 dark:border-emerald-500/20 shadow-sm">
            <Users className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-neutral-900 dark:text-[#F3F5FA] tracking-tight">
                {guardian.fullName}
              </h1>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                {guardian.guardianCode}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-[#737D8E]">
              {guardian.relationship.toUpperCase()} • Guardian Connect Portal
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-100 dark:bg-[#1D2330]">
          <button
            type="button"
            onClick={() => setActiveTab('monitoring')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 outline-none ${
              activeTab === 'monitoring'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
            }`}
          >
            Live Monitor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 outline-none ${
              activeTab === 'notifications'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
            }`}
          >
            Alerts ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 outline-none ${
              activeTab === 'privacy'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
            }`}
          >
            Privacy
          </button>
        </div>
      </div>

      {/* TAB 1: MONITORING & ACTIVE EXAMINATION */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          {/* LINKED CHILDREN SECTION */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                Linked Children &amp; Candidates
              </h2>
              <button
                type="button"
                onClick={() => setShowAddGuardianModal(true)}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Link Another Child
              </button>
            </div>

            {children.length === 0 ? (
              <div className="p-8 rounded-[24px] bg-white dark:bg-[#171B24] border border-neutral-200/60 dark:border-white/10 text-center space-y-3">
                <Users className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto" />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  No linked students connected yet. Connect your child using their LCE code.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddGuardianModal(true)}
                  className="py-2 px-4 rounded-xl bg-neutral-900 text-white text-xs font-semibold cursor-pointer border-0 outline-none"
                >
                  Connect Student
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {children.map((child: any) => (
                  <IdentityCard
                    key={child.studentId}
                    code={child.studentLceCode || 'LCE001'}
                    entityType="student"
                    name={child.name}
                    sublabel={
                      child.activeSession
                        ? `Taking Exam: ${child.activeSession.examTitle}`
                        : 'No active exam underway'
                    }
                    verified={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ACTIVE EXAMINATION CARD & LIVE STREAM PREVIEW */}
          {activeChildStream?.activeSession ? (
            <div className="p-6 rounded-[28px] bg-white dark:bg-[#171B24] border border-neutral-200/60 dark:border-white/10 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                    <motion.span
                      variants={livePulseVariants}
                      animate="pulse"
                      className="w-2 h-2 rounded-full bg-rose-500"
                    />
                    LIVE EXAMINATION SESSION
                  </span>
                  <span className="font-mono text-xs font-bold text-neutral-500">
                    {activeChildStream.studentLceCode}
                  </span>
                </div>

                <span className="text-xs text-neutral-500">
                  {activeChildStream.name}
                </span>
              </div>

              {/* Live WebRTC Camera Stream Container */}
              <div className="relative w-full aspect-video rounded-[24px] overflow-hidden bg-neutral-950 border border-neutral-800 shadow-inner flex items-center justify-center">
                <video
                  ref={videoElementRef}
                  playsInline
                  autoPlay
                  className="w-full h-full object-cover"
                />

                {/* Overlaid Live Badges */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Authorized Parent View</span>
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 text-xs font-mono flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <span>Encrypted Peer Stream</span>
                </div>

                <div className="absolute bottom-3 inset-x-0 flex items-center justify-center pointer-events-none">
                  <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-black/70 text-white/90 backdrop-blur-md">
                    Read-only supervision. Stream terminates automatically when exam completes.
                  </span>
                </div>
              </div>

              {/* Exam Info & Progress */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-[#1D2330]">
                  <span className="block text-[11px] text-neutral-400">Examination</span>
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate block">
                    {activeChildStream.activeSession.examTitle}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-[#1D2330]">
                  <span className="block text-[11px] text-neutral-400">Questions Answered</span>
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 font-mono">
                    {activeChildStream.activeSession.questionsAnswered || 0} / {activeChildStream.activeSession.totalQuestions || 50}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-[#1D2330] col-span-2 sm:col-span-1">
                  <span className="block text-[11px] text-neutral-400">Camera Status</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Active &amp; Verified
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Clean Empty State when no exam active */
            <div className="p-10 rounded-[28px] bg-white dark:bg-[#171B24] border border-neutral-200/60 dark:border-white/10 text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-[#1D2330] flex items-center justify-center mx-auto text-neutral-400">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
                No active examination session underway
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
                When your child starts a scheduled test, live supervision and real-time status updates will appear here automatically.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: NOTIFICATIONS LOG */}
      {activeTab === 'notifications' && (
        <div className="p-6 rounded-[28px] bg-white dark:bg-[#171B24] border border-neutral-200/60 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-[#F3F5FA] flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-500" />
              Examination Notification History
            </h2>
            <span className="text-xs text-neutral-400">Logged to SMS &amp; In-App</span>
          </div>

          {notifications.length === 0 ? (
            <p className="text-xs text-neutral-400 py-6 text-center">
              No examination alerts recorded yet.
            </p>
          ) : (
            <div className="space-y-2.5">
              {notifications.map((notif: any) => (
                <div
                  key={notif.id}
                  className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#1D2330] border border-neutral-200/40 dark:border-white/5 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(notif.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-[#A1A9B8]">
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRIVACY & TRANSPARENCY NOTICE */}
      {activeTab === 'privacy' && (
        <div className="p-6 rounded-[28px] bg-white dark:bg-[#171B24] border border-neutral-200/60 dark:border-white/10 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            Guardian Privacy &amp; Access Controls
          </h2>
          <div className="space-y-3 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            <p>
              SamayYudh 2.0 adheres to strict academic privacy regulations. As a guardian:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You can only view active examination video sessions for children explicitly linked to your account.</li>
              <li>Camera streaming is encrypted end-to-end via WebRTC and is strictly read-only.</li>
              <li>You cannot access other students, faculty communications, examination questions, or answer keys.</li>
              <li>When the test concludes, video access terminates immediately and automatically.</li>
            </ul>
          </div>
        </div>
      )}

      {/* GUARDIAN REGISTRATION MODAL */}
      <GuardianRegistrationModal
        isOpen={showAddGuardianModal}
        onDismiss={() => setShowAddGuardianModal(false)}
        onCompleted={() => {
          setShowAddGuardianModal(false);
          fetchDashboardData();
        }}
      />
    </div>
  );
}
