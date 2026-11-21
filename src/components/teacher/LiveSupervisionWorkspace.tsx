'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  QrCode,
  Radio,
  Search,
  Filter,
  RefreshCw,
  Users,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  Wifi,
} from 'lucide-react';
import { QrVerificationScanner } from './QrVerificationScanner';
import { MeetStyleFaceSupervision } from './MeetStyleFaceSupervision';
import { IdentityCard } from '@/components/common/IdentityCard';

export type SupervisionTabMode = 'remote_monitoring' | 'qr_verification' | 'live_face';

export function LiveSupervisionWorkspace() {
  const [activeTab, setActiveTab] = useState<SupervisionTabMode>('remote_monitoring');
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForFace, setSelectedStudentForFace] = useState<any | null>(null);

  // Fetch active examinee sessions
  const fetchActiveSessions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/proctoring/active-sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.warn('Failed to fetch active proctoring sessions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveSessions();
    const interval = setInterval(fetchActiveSessions, 12000);
    return () => clearInterval(interval);
  }, [fetchActiveSessions]);

  // Filtered sessions
  const filteredSessions = sessions.filter((s) => {
    const term = searchQuery.toLowerCase();
    return (
      (s.student_name || '').toLowerCase().includes(term) ||
      (s.student_public_id || s.student_lce_code || '').toLowerCase().includes(term) ||
      (s.exam_title || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* 3-MODE TAB SWITCHER (Zero outline, modern pill container) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-[24px] bg-neutral-100 dark:bg-[#171B24] border border-neutral-200/60 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/70 dark:bg-[#1D2330] border border-neutral-200/40 dark:border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('remote_monitoring')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border-0 outline-none ${
              activeTab === 'remote_monitoring'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>A. Remote Monitoring</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qr_verification')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border-0 outline-none ${
              activeTab === 'qr_verification'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>B. QR Physical Verification</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('live_face')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border-0 outline-none ${
              activeTab === 'live_face'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>C. Live Face Supervision</span>
          </button>
        </div>

        {/* Active Examinees Chip */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-200/50 dark:bg-[#1D2330] text-xs font-semibold text-neutral-700 dark:text-neutral-300 mr-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{sessions.length} Live Examinees Active</span>
        </div>
      </div>

      {/* MODE A: LIVE REMOTE MONITORING (GRID OF ACTIVE EXAMINEES) */}
      {activeTab === 'remote_monitoring' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name or LCE code..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#171B24] border border-neutral-200/60 dark:border-white/10 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>

            <button
              type="button"
              onClick={fetchActiveSessions}
              className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#171B24] hover:bg-neutral-50 dark:hover:bg-[#1D2330] border border-neutral-200/60 dark:border-white/10 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2 cursor-pointer outline-none"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Active Grid</span>
            </button>
          </div>

          {/* Active Examinee Grid */}
          {filteredSessions.length === 0 ? (
            <div className="p-12 rounded-[28px] bg-white dark:bg-[#171B24] border border-neutral-200/60 dark:border-white/10 text-center space-y-3">
              <Video className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto" />
              <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
                No active exam supervision sessions found
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                When candidates start an invigilated test, their live encrypted video feeds, LCE identification, and connection status will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => {
                    setSelectedStudentForFace(session);
                    setActiveTab('live_face');
                  }}
                  className="group relative p-4 rounded-[24px] bg-white dark:bg-[#171B24] border border-neutral-200/60 dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
                >
                  {/* Top Bar with Live Badge & LCE Code */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      {session.student_lce_code || session.student_public_id || 'LCE001'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      LIVE
                    </span>
                  </div>

                  {/* Camera Preview Thumbnail (Circular / Rounded) */}
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 mb-3 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-2 border-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.3)] overflow-hidden bg-neutral-800 flex items-center justify-center">
                      <Video className="w-8 h-8 text-neutral-400" />
                    </div>

                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-white flex items-center gap-1">
                      <Wifi className="w-2.5 h-2.5 text-emerald-400" />
                      <span>Connected</span>
                    </div>
                  </div>

                  {/* Student & Exam Info */}
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-[#F3F5FA] truncate">
                      {session.student_name || 'Examinee Candidate'}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-[#737D8E] truncate mt-0.5">
                      {session.exam_title || 'Mock Examination'}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs text-brand-600 dark:text-brand-400 font-semibold">
                    <span>Inspect Live Stream</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODE B: QR PHYSICAL VERIFICATION */}
      {activeTab === 'qr_verification' && (
        <QrVerificationScanner
          onOpenLiveSupervision={(studentId) => {
            const matched = sessions.find((s) => s.student_id === studentId);
            if (matched) setSelectedStudentForFace(matched);
            setActiveTab('live_face');
          }}
        />
      )}

      {/* MODE C: LIVE FACE SUPERVISION */}
      {activeTab === 'live_face' && (
        <MeetStyleFaceSupervision
          studentId={selectedStudentForFace?.student_id || 'sample_candidate_id'}
          studentName={selectedStudentForFace?.student_name || 'Candidate Examinee'}
          studentLceCode={selectedStudentForFace?.student_lce_code || selectedStudentForFace?.student_public_id || 'LCE001'}
          examTitle={selectedStudentForFace?.exam_title || 'Full Mock Examination 2026'}
          examCode={selectedStudentForFace?.exam_code || 'LCE-EX-0001'}
          examSessionId={selectedStudentForFace?.exam_session_id || 'session_default'}
          onBackToGrid={() => setActiveTab('remote_monitoring')}
        />
      )}
    </div>
  );
}
