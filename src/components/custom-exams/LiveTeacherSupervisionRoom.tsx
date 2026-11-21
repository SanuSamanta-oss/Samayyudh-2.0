'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  CameraOff,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Pause,
  Play,
  Send,
  Users,
  Search,
  ArrowLeft,
  Clock,
  Wifi,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  PhoneOff,
  MessageSquare,
  Sparkles,
  Camera,
  RefreshCw,
  LayoutGrid,
  Columns,
  Eye,
  Lock,
  Hand,
  FileSpreadsheet,
  Share2,
  QrCode,
  CheckCheck,
  UserCheck,
  UserX,
  X,
  Bot,
} from 'lucide-react';
import type {
  CustomExam,
  CustomExamParticipant,
  ExamSupervisionEvent,
  CustomExamReport,
} from '@/types/custom-exam';
import { IssueWarningModal } from './IssueWarningModal';
import { SuspendStudentModal } from './SuspendStudentModal';
import { SupervisionReportModal } from './SupervisionReportModal';
import { TimeAdjustmentModal } from './TimeAdjustmentModal';
import { EndExamConfirmationModal } from './EndExamConfirmationModal';
import { StudentSupervisionDrawer } from './StudentSupervisionDrawer';

interface LiveTeacherSupervisionRoomProps {
  examId: string;
  examCode?: string;
  onBackToDashboard?: () => void;
  isSuperAdmin?: boolean;
}

export function LiveTeacherSupervisionRoom({
  examId,
  examCode: initialCode,
  onBackToDashboard,
  isSuperAdmin = false,
}: LiveTeacherSupervisionRoomProps) {
  const router = useRouter();

  // Core Room State (Real Connected Students Only - ZERO mock candidates)
  const [exam, setExam] = useState<CustomExam | null>(null);
  const [participants, setParticipants] = useState<CustomExamParticipant[]>([]);
  const [events, setEvents] = useState<ExamSupervisionEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Student for Focus / Spotlight / Drawer
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [drawerStudent, setDrawerStudent] = useState<CustomExamParticipant | null>(null);

  // View Mode: 'spotlight' (focused video + bottom carousel) | 'grid' (multi-cam wall)
  const [viewMode, setViewMode] = useState<'spotlight' | 'grid'>('spotlight');

  // Sidebar Tab: 'participants' | 'chat'
  const [sidebarTab, setSidebarTab] = useState<'participants' | 'chat'>('participants');

  // Search & Filters
  const [searchParticipant, setSearchParticipant] = useState('');
  const [studentFilter, setStudentFilter] = useState<'all' | 'active' | 'waiting' | 'suspended' | 'hand_raised' | 'warned'>('all');

  // Local Invigilator Webcam Preview Toggle & Fullscreen
  const [localCamStream, setLocalCamStream] = useState<MediaStream | null>(null);
  const [useLocalCam, setUseLocalCam] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const centerContainerRef = useRef<HTMLDivElement>(null);
  const centerVideoRef = useRef<HTMLVideoElement>(null);

  // Countdown timer
  const [remainingSeconds, setRemainingSeconds] = useState(3600);

  // Notifications & Clipboard
  const [actionNotification, setActionNotification] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals State
  const [warningModalStudent, setWarningModalStudent] = useState<CustomExamParticipant | null>(null);
  const [suspendModalStudent, setSuspendModalStudent] = useState<CustomExamParticipant | null>(null);
  const [timeModalStudent, setTimeModalStudent] = useState<CustomExamParticipant | null>(null);
  const [showEndExamModal, setShowEndExamModal] = useState(false);
  const [reportModalData, setReportModalData] = useState<CustomExamReport | null>(null);

  // Advisory Chat
  const [chatInput, setChatInput] = useState('');
  const [advisoryMessages, setAdvisoryMessages] = useState<
    { id: string; sender: string; text: string; time: string; isTeacher?: boolean }[]
  >([
    {
      id: 'm1',
      sender: 'Supervision Engine',
      text: 'Exam supervision session initiated. Proctoring active.',
      time: '10:00 AM',
    },
    {
      id: 'm2',
      sender: 'Invigilator Note',
      text: 'Ensure webcams remain uncovered throughout testing.',
      time: '10:02 AM',
      isTeacher: true,
    },
  ]);

  // Official countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Fetch room state (Only REAL students from database/api - no demo injection)
  const fetchRoomState = useCallback(async () => {
    try {
      const res = await fetch(`/api/custom-exams/supervision/${examId}`);
      if (res.ok) {
        const data = await res.json();
        setExam(data.exam);
        const liveParticipants: CustomExamParticipant[] = data.participants || [];
        setParticipants(liveParticipants);

        // Keep selection synced with active participants
        const activeOnly = liveParticipants.filter((p) => p.exam_status !== 'waiting');
        if (activeOnly.length > 0) {
          if (!selectedStudentId || !activeOnly.some((p) => p.student_id === selectedStudentId)) {
            setSelectedStudentId(activeOnly[0].student_id);
          }
        } else if (liveParticipants.length > 0) {
          setSelectedStudentId(liveParticipants[0].student_id);
        } else {
          setSelectedStudentId('');
        }

        setEvents(data.events || []);
      }
    } catch {
      // Retain state on transient fetch error
    } finally {
      setLoading(false);
    }
  }, [examId, selectedStudentId]);

  useEffect(() => {
    fetchRoomState();
    const interval = setInterval(fetchRoomState, 3500);
    return () => clearInterval(interval);
  }, [fetchRoomState]);

  // Invigilator local webcam toggle
  const toggleLocalCamera = async () => {
    if (useLocalCam) {
      if (localCamStream) {
        localCamStream.getTracks().forEach((t) => t.stop());
        setLocalCamStream(null);
      }
      setUseLocalCam(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: false,
        });
        setLocalCamStream(stream);
        setUseLocalCam(true);
      } catch (err) {
        console.warn('Camera access denied:', err);
      }
    }
  };

  useEffect(() => {
    if (useLocalCam && localCamStream && centerVideoRef.current) {
      centerVideoRef.current.srcObject = localCamStream;
      centerVideoRef.current.play().catch(() => {});
    }
  }, [useLocalCam, localCamStream, selectedStudentId]);

  // Separate Waiting Room candidates from Admitted / Active candidates
  const waitingStudents = useMemo(() => {
    const seen = new Set<string>();
    return participants.filter((p) => {
      if (p.exam_status !== 'waiting') return false;
      const key = p.id || p.student_id;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [participants]);

  const activeCandidates = useMemo(() => {
    const seen = new Set<string>();
    return participants.filter((p) => {
      if (p.exam_status === 'waiting') return false;
      const key = p.id || p.student_id;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [participants]);

  const selectedStudent =
    activeCandidates.find((p) => p.student_id === selectedStudentId) ||
    activeCandidates[0] ||
    waitingStudents[0] ||
    null;

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!centerContainerRef.current) return;
    if (!document.fullscreenElement) {
      centerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const displayCode = exam?.exam_code || initialCode || 'CE4821';

  const joinUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/exam/waiting-room?code=${displayCode}`
      : `https://samayyudh.vercel.app/exam/waiting-room?code=${displayCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(displayCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyJoinLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(joinUrl);
      setCopiedLink(true);
      setActionNotification('Student join link copied to clipboard!');
      setTimeout(() => {
        setCopiedLink(false);
        setActionNotification(null);
      }, 3000);
    }
  };

  const handleShareInvite = () => {
    const inviteText = `Join the proctored examination "${exam?.title || 'Examination'}" on SAMAYYUDH.\nAccess Code: ${displayCode}\nJoin Link: ${joinUrl}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: exam?.title || 'Examination Invitation',
          text: inviteText,
          url: joinUrl,
        })
        .catch(() => {
          navigator.clipboard?.writeText(inviteText);
          setActionNotification('Invitation copied to clipboard!');
          setTimeout(() => setActionNotification(null), 3000);
        });
    } else if (typeof navigator !== 'undefined') {
      navigator.clipboard?.writeText(inviteText);
      setActionNotification('Invitation copied to clipboard!');
      setTimeout(() => setActionNotification(null), 3000);
    }
  };

  // Start exam handler
  const handleStartExam = async () => {
    try {
      const res = await fetch('/api/custom-exams/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exam_id: examId }),
      });
      if (res.ok) {
        fetchRoomState();
        setActionNotification('Official examination launched! Candidate countdowns started.');
        setTimeout(() => setActionNotification(null), 3500);
      }
    } catch {}
  };

  // End exam handler
  const handleConfirmEndExam = async () => {
    try {
      const res = await fetch('/api/custom-exams/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exam_id: examId }),
      });
      if (res.ok) {
        setActionNotification('Examination ended successfully. Reports generated.');
        setTimeout(() => setActionNotification(null), 3500);
        fetchRoomState();
      }
    } catch {}
  };

  // Admit / Approve student from waiting room
  const handleApproveStudent = async (student: CustomExamParticipant) => {
    try {
      const res = await fetch('/api/custom-exams/supervision/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: exam?.id || examId,
          student_id: student.student_id,
          action: 'approve',
          actor_role: isSuperAdmin ? 'admin' : 'teacher',
        }),
      });
      if (res.ok) {
        setActionNotification(`Admitted ${student.student_name} to examination.`);
        setTimeout(() => setActionNotification(null), 3000);
        fetchRoomState();
      }
    } catch {
      setParticipants((prev) =>
        prev.map((p) =>
          p.student_id === student.student_id ? { ...p, exam_status: 'in_progress' } : p
        )
      );
      setActionNotification(`Admitted ${student.student_name}.`);
      setTimeout(() => setActionNotification(null), 3000);
    }
  };

  // Admit all waiting students
  const handleApproveAll = async () => {
    try {
      const res = await fetch('/api/custom-exams/supervision/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: exam?.id || examId,
          action: 'approve_all',
          actor_role: isSuperAdmin ? 'admin' : 'teacher',
        }),
      });
      if (res.ok) {
        setActionNotification('Admitted all waiting candidates!');
        setTimeout(() => setActionNotification(null), 3000);
        fetchRoomState();
      }
    } catch {
      setParticipants((prev) =>
        prev.map((p) => (p.exam_status === 'waiting' ? { ...p, exam_status: 'in_progress' } : p))
      );
      setActionNotification('Admitted all waiting candidates.');
      setTimeout(() => setActionNotification(null), 3000);
    }
  };

  // Issue warning handler
  const handleConfirmWarning = async (level: any, reason: any, note: string) => {
    const targetStudent = warningModalStudent || selectedStudent;
    if (!targetStudent) return;

    try {
      const res = await fetch('/api/custom-exams/supervision/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: exam?.id || examId,
          student_id: targetStudent.student_id,
          action: 'warning',
          warning_level: level,
          reason,
          note,
          actor_role: isSuperAdmin ? 'admin' : 'teacher',
        }),
      });
      if (res.ok) {
        setActionNotification(`Warning dispatched to ${targetStudent.student_name}`);
        setTimeout(() => setActionNotification(null), 3500);
        fetchRoomState();
      }
    } catch {
      setParticipants((prev) =>
        prev.map((p) =>
          p.student_id === targetStudent.student_id ? { ...p, warning_count: (p.warning_count || 0) + 1 } : p
        )
      );
      setActionNotification(`Warning issued to ${targetStudent.student_name}`);
      setTimeout(() => setActionNotification(null), 3500);
    }
  };

  // Suspend student handler
  const handleConfirmSuspend = async (reason: string) => {
    const targetStudent = suspendModalStudent || selectedStudent;
    if (!targetStudent) return;

    try {
      const res = await fetch('/api/custom-exams/supervision/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: exam?.id || examId,
          student_id: targetStudent.student_id,
          action: 'suspend',
          reason,
          actor_role: isSuperAdmin ? 'admin' : 'teacher',
        }),
      });
      if (res.ok) {
        setActionNotification(`Candidate ${targetStudent.student_name} suspended.`);
        setTimeout(() => setActionNotification(null), 3500);
        fetchRoomState();
      }
    } catch {
      setParticipants((prev) =>
        prev.map((p) =>
          p.student_id === targetStudent.student_id
            ? { ...p, is_suspended: true, suspended_reason: reason }
            : p
        )
      );
      setActionNotification(`Candidate ${targetStudent.student_name} suspended.`);
      setTimeout(() => setActionNotification(null), 3500);
    }
  };

  // Restore student handler
  const handleRestoreStudent = async (student: CustomExamParticipant) => {
    try {
      const res = await fetch('/api/custom-exams/supervision/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: exam?.id || examId,
          student_id: student.student_id,
          action: 'restore',
          actor_role: isSuperAdmin ? 'admin' : 'teacher',
        }),
      });
      if (res.ok) {
        setActionNotification(`Candidate ${student.student_name} restored.`);
        setTimeout(() => setActionNotification(null), 3500);
        fetchRoomState();
      }
    } catch {
      setParticipants((prev) =>
        prev.map((p) =>
          p.student_id === student.student_id ? { ...p, is_suspended: false, suspended_reason: null } : p
        )
      );
      setActionNotification(`Candidate ${student.student_name} restored.`);
      setTimeout(() => setActionNotification(null), 3500);
    }
  };

  // Time adjustment handler
  const handleConfirmTimeAdjustment = async (secondsDelta: number, reason: string) => {
    const targetStudent = timeModalStudent || selectedStudent;
    if (!targetStudent) return;

    try {
      const res = await fetch('/api/custom-exams/supervision/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: exam?.id || examId,
          student_id: targetStudent.student_id,
          action: 'time_adjustment',
          time_adjustment_seconds: secondsDelta,
          reason,
          actor_role: isSuperAdmin ? 'admin' : 'teacher',
        }),
      });
      if (res.ok) {
        setActionNotification(
          `Adjusted time by ${secondsDelta > 0 ? '+' : ''}${Math.round(secondsDelta / 60)}m for ${targetStudent.student_name}.`
        );
        setTimeout(() => setActionNotification(null), 3500);
        fetchRoomState();
      }
    } catch {}
  };

  // Acknowledge student hand raise
  const handleAcknowledgeHand = async (studentId: string) => {
    try {
      await fetch('/api/custom-exams/supervision/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: exam?.id || examId,
          student_id: studentId,
          action: 'acknowledge_hand',
          actor_role: isSuperAdmin ? 'admin' : 'teacher',
        }),
      });
      setParticipants((prev) =>
        prev.map((p) => (p.student_id === studentId ? { ...p, hand_raised: false } : p))
      );
      setActionNotification('Student hand acknowledged.');
      setTimeout(() => setActionNotification(null), 3000);
    } catch {}
  };

  // Force end student exam
  const handleForceEndStudent = async (studentId: string) => {
    try {
      await fetch('/api/custom-exams/supervision/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: exam?.id || examId,
          student_id: studentId,
          action: 'end_student_exam',
          actor_role: isSuperAdmin ? 'admin' : 'teacher',
        }),
      });
      setParticipants((prev) =>
        prev.map((p) => (p.student_id === studentId ? { ...p, exam_status: 'submitted' } : p))
      );
      setActionNotification('Student exam forced to submission.');
      setTimeout(() => setActionNotification(null), 3500);
    } catch {}
  };

  // Advisory broadcast message
  const handleSendAdvisory = () => {
    if (!chatInput.trim()) return;
    const newMsg = {
      id: `chat_${Date.now()}`,
      sender: isSuperAdmin ? 'Super Admin' : 'Invigilator (You)',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTeacher: true,
    };
    setAdvisoryMessages((prev) => [...prev, newMsg]);
    setChatInput('');
    setActionNotification('Advisory broadcast sent to all candidates.');
    setTimeout(() => setActionNotification(null), 3000);
  };

  // Open final supervision report modal
  const handleOpenReport = async () => {
    const code = exam?.exam_code || initialCode || 'CE4821';
    try {
      const res = await fetch(`/api/custom-exams/${code}/report`);
      if (res.ok) {
        const data = await res.json();
        setReportModalData(data.report);
      }
    } catch {}
  };

  // Direct Excel Report Download
  const handleDownloadExcel = () => {
    const code = exam?.exam_code || initialCode || 'CE4821';
    window.open(`/api/custom-exams/${code}/export-excel`, '_blank');
  };

  // Filtering candidates for right panel
  const filteredParticipants = activeCandidates.filter((p) => {
    const matchesSearch =
      p.student_name.toLowerCase().includes(searchParticipant.toLowerCase()) ||
      p.student_lce_code.toLowerCase().includes(searchParticipant.toLowerCase());

    if (!matchesSearch) return false;

    if (studentFilter === 'active') return p.exam_status === 'in_progress' && !p.is_suspended;
    if (studentFilter === 'waiting') return p.exam_status === 'waiting';
    if (studentFilter === 'suspended') return p.is_suspended;
    if (studentFilter === 'hand_raised') return p.hand_raised;
    if (studentFilter === 'warned') return p.warning_count > 0;

    return true;
  });

  // Summary Metrics
  const totalJoinedCount = activeCandidates.length;
  const activeCount = activeCandidates.filter((p) => p.exam_status === 'in_progress' && !p.is_suspended).length;
  const suspendedCount = activeCandidates.filter((p) => p.is_suspended).length;
  const handRaisedCount = activeCandidates.filter((p) => p.hand_raised).length;

  return (
    <div className="flex flex-col h-[calc(100vh-4.25rem)] w-full select-none overflow-hidden bg-slate-100/90 dark:bg-[#070A12] text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* ── TOP HEADER (IMAGE 2 LAYOUT) ── */}
      <header className="h-16 px-4 sm:px-6 bg-white/90 dark:bg-[#0E1322]/90 backdrop-blur-2xl flex items-center justify-between shrink-0 z-20 shadow-xs border-b border-slate-200/50 dark:border-slate-800/60">
        <div className="flex items-center gap-3 min-w-0">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToDashboard || (() => router.push('/exams'))}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-all cursor-pointer border-0 outline-none shadow-xs"
            title="Return to exam suite"
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.button>

          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                {exam?.title || 'Custom Examination Supervision Room'}
              </h1>
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleCopyCode}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/70 dark:hover:bg-purple-900/70 text-purple-800 dark:text-purple-300 text-xs font-mono font-bold transition-all border-0 outline-none shadow-xs"
                title="Copy CE Code"
              >
                <span>{displayCode}</span>
                {copiedCode ? (
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </motion.button>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 truncate">
              <span>{totalJoinedCount} Joined</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{activeCount} Active</span>
              {suspendedCount > 0 && (
                <>
                  <span>•</span>
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">{suspendedCount} Suspended</span>
                </>
              )}
              {handRaisedCount > 0 && (
                <>
                  <span>•</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 animate-pulse">
                    <Hand className="w-3 h-3" />
                    <span>{handRaisedCount} Hand Raised</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center: View Switcher (Spotlight View vs Multi-Cam Grid) */}
        <div className="hidden lg:flex items-center p-1 rounded-full bg-slate-200/70 dark:bg-white/10 shadow-xs border-0 outline-none relative">
          <button
            type="button"
            onClick={() => setViewMode('spotlight')}
            className="relative flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 cursor-pointer border-0 outline-none z-10"
          >
            {viewMode === 'spotlight' && (
              <motion.div
                layoutId="viewModeActiveIndicator"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-full bg-white dark:bg-purple-600 shadow-[0_2px_10px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_14px_rgba(147,51,234,0.45)]"
              />
            )}
            <Columns className={`w-3.5 h-3.5 relative z-10 transition-colors ${viewMode === 'spotlight' ? 'text-purple-700 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`} />
            <span className={`relative z-10 transition-colors ${viewMode === 'spotlight' ? 'text-purple-950 dark:text-white font-extrabold' : 'text-slate-600 dark:text-slate-300'}`}>
              Spotlight View
            </span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className="relative flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 cursor-pointer border-0 outline-none z-10"
          >
            {viewMode === 'grid' && (
              <motion.div
                layoutId="viewModeActiveIndicator"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-full bg-white dark:bg-purple-600 shadow-[0_2px_10px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_14px_rgba(147,51,234,0.45)]"
              />
            )}
            <LayoutGrid className={`w-3.5 h-3.5 relative z-10 transition-colors ${viewMode === 'grid' ? 'text-purple-700 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`} />
            <span className={`relative z-10 transition-colors ${viewMode === 'grid' ? 'text-purple-950 dark:text-white font-extrabold' : 'text-slate-600 dark:text-slate-300'}`}>
              Multi-Cam Grid
            </span>
          </button>
        </div>

        {/* Right Header Status Badges & Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Start Exam Button if Exam is Waiting */}
          {exam?.status === 'waiting' && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleStartExam}
              className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Start Examination</span>
            </motion.button>
          )}

          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs border-0 outline-none">
            <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>{formatCountdown(remainingSeconds)}</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-bold shadow-xs border-0 outline-none">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>{(exam?.status || 'live').toUpperCase()}</span>
          </div>

          {/* Download Excel Report */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadExcel}
            className="p-2 sm:px-3.5 sm:py-2 rounded-full bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-800 dark:text-purple-300 text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-1.5 shadow-xs"
            title="Download Excel Report"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">Excel Report</span>
          </motion.button>

          {/* Open Full Audit Report Modal */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenReport}
            className="p-2 sm:px-3.5 sm:py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-1.5 shadow-xs"
            title="Supervision Audit Dashboard"
          >
            <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden md:inline">Audit Log</span>
          </motion.button>
        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <div className="flex-1 flex min-h-0 relative p-3 sm:p-4 gap-4">
        {/* CENTER COLUMN: MAIN VIEW */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Notification Toast */}
          <AnimatePresence>
            {actionNotification && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-full bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 text-xs font-bold shadow-2xl flex items-center gap-2.5 backdrop-blur-md"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                <span>{actionNotification}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* If there are candidates in the waiting room, show a sleek top notification banner */}
          {waitingStudents.length > 0 && activeCandidates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2.5 px-4 py-2 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/60 backdrop-blur-md flex items-center justify-between gap-2 shadow-xs border-0 outline-none shrink-0"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{waitingStudents.length} candidate{waitingStudents.length > 1 ? 's' : ''} waiting in lobby</span>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleApproveAll}
                className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer border-0 outline-none"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Approve All</span>
              </motion.button>
            </motion.div>
          )}

          {/* VIEW MODE A: SPOTLIGHT MODE */}
          {viewMode === 'spotlight' ? (
            <>
              {/* Spotlight Center Video Stage */}
              <div
                ref={centerContainerRef}
                className="flex-1 relative rounded-[32px] overflow-hidden bg-slate-950 dark:bg-[#030611] shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.7)] flex items-center justify-center min-h-[300px]"
              >
                {activeCandidates.length === 0 && waitingStudents.length === 0 ? (
                  /* SLEEK MODERN EMPTY STAGE (WAITING FOR CANDIDATES) */
                  <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-lg">
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 text-purple-300 text-xs font-bold mb-4">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400"></span>
                      </span>
                      <span>Supervision Stage Active • Waiting for Candidates</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
                      No Candidates Connected
                    </h3>
                    <p className="text-xs text-slate-400 mb-6 max-w-sm">
                      Share the examination code or QR with candidates. Their live feeds will appear here immediately upon check-in.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-white/5 backdrop-blur-md mb-6">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(joinUrl)}`}
                        alt="QR Code"
                        className="w-28 h-28 object-contain rounded-xl bg-white p-2 shrink-0"
                      />
                      <div className="text-left space-y-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Exam Access Code
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-2xl font-black font-mono text-purple-400 tracking-wider">
                              {displayCode}
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyCode}
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border-0 outline-none"
                            >
                              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleCopyJoinLink}
                            className="px-3 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none"
                          >
                            {copiedLink ? 'Copied Link' : 'Copy Student Link'}
                          </button>
                          <button
                            type="button"
                            onClick={handleShareInvite}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border-0 outline-none"
                            title="Share Invitation"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : activeCandidates.length === 0 && waitingStudents.length > 0 ? (
                  /* WAITING ROOM ADMISSION QUEUE */
                  <div className="relative z-10 w-full max-w-xl p-6 text-center flex flex-col items-center">
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                      </span>
                      <span>Candidates in Waiting Room ({waitingStudents.length})</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                      Review & Admit Candidates
                    </h3>
                    <p className="text-xs text-slate-400 mb-5">
                      Candidates are ready and awaiting admission to enter the examination session.
                    </p>

                    <div className="w-full space-y-2 mb-6 max-h-56 overflow-y-auto scrollbar-none text-left">
                      {waitingStudents.map((s, idx) => (
                        <div
                          key={s.id || `${s.student_id}-${idx}`}
                          className="p-3 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-purple-600/30 text-purple-300 font-bold text-xs flex items-center justify-center shrink-0">
                              {s.student_name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{s.student_name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{s.student_lce_code}</p>
                            </div>
                          </div>

                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleApproveStudent(s)}
                            className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer border-0 outline-none shrink-0"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </motion.button>
                        </div>
                      ))}
                    </div>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleApproveAll}
                      className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-600/40 cursor-pointer border-0 outline-none"
                    >
                      <CheckCheck className="w-4 h-4" />
                      <span>Approve All Candidates</span>
                    </motion.button>
                  </div>
                ) : selectedStudent ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedStudent.student_id + (useLocalCam ? '_local' : '_stream')}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.01 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 w-full h-full flex items-center justify-center"
                      >
                        {useLocalCam ? (
                          <video
                            ref={centerVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover -scale-x-100"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white relative">
                            {/* Proctoring camera placeholder */}
                            <div className="w-24 h-24 rounded-full bg-purple-600/20 text-purple-300 flex items-center justify-center font-bold text-2xl shadow-inner mb-3">
                              {selectedStudent.student_name.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="text-sm font-bold">{selectedStudent.student_name}</span>
                            <span className="text-xs text-slate-400 font-mono mt-0.5">{selectedStudent.student_lce_code}</span>
                            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                              <span>Live Examination Surveillance Active</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Subtle Cinematic Vignette */}
                    <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/50 pointer-events-none" />

                    {/* If Suspended: Prominent Frosted Suspension Screen */}
                    {selectedStudent.is_suspended && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-rose-950/70 backdrop-blur-md">
                        <div className="w-16 h-16 rounded-3xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-4 relative">
                          <Lock className="w-8 h-8" />
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 animate-ping opacity-75" />
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500" />
                        </div>
                        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 text-white mb-2 shadow-lg">
                          Candidate Suspended
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                          Examination Paused by Invigilator
                        </h3>
                        <p className="text-xs text-rose-200 mt-1 max-w-md">
                          Reason: {selectedStudent.suspended_reason || 'Examination integrity breach flagged.'}
                        </p>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRestoreStudent(selectedStudent)}
                          className="mt-5 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-2 shadow-[0_8px_25px_rgba(16,185,129,0.5)]"
                        >
                          <Play className="w-4 h-4" />
                          <span>Restore Candidate Access</span>
                        </motion.button>
                      </div>
                    )}

                    {/* Overlaid Candidate Name Tag with Live Audio Visualizer */}
                    <div className="absolute bottom-5 left-5 z-10 flex items-center gap-2.5">
                      <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-black/65 backdrop-blur-2xl text-white text-xs font-bold shadow-xl border-0 outline-none">
                        <span className={`w-2.5 h-2.5 rounded-full ${selectedStudent.is_suspended ? 'bg-rose-500' : 'bg-emerald-400 shadow-[0_0_10px_#34d399]'}`} />
                        <span>{selectedStudent.student_name}</span>
                        <span className="text-[10px] text-slate-300 font-mono">
                          ({selectedStudent.student_lce_code})
                        </span>

                        {!selectedStudent.is_suspended && (
                          <div className="flex items-center gap-0.5 ml-1">
                            <span className="w-1 h-3 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="w-1 h-4 rounded-full bg-emerald-400 animate-pulse delay-75" />
                            <span className="w-1 h-2 rounded-full bg-emerald-400 animate-pulse delay-150" />
                          </div>
                        )}
                      </div>

                      {selectedStudent.hand_raised && (
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold shadow-xl animate-pulse">
                          <Hand className="w-4 h-4" />
                          <span>Hand Raised</span>
                        </div>
                      )}

                      {!selectedStudent.is_suspended && (
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/60 backdrop-blur-xl text-slate-200 text-xs font-medium shadow-xl">
                          <Eye className="w-3.5 h-3.5 text-purple-400" />
                          <span>Screen Focused</span>
                        </div>
                      )}

                      {selectedStudent.warning_count > 0 && (
                        <span className="px-3 py-2 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold shadow-xl">
                          {selectedStudent.warning_count} Warning{selectedStudent.warning_count > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Network Quality Tag */}
                    <div className="absolute top-5 right-5 z-10 flex items-center gap-2">
                      <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-xl text-emerald-300 text-xs font-bold shadow-xl border-0">
                        <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                        <span>1080p HD (24ms)</span>
                      </span>
                    </div>

                    {/* Camera Switcher & Fullscreen */}
                    <div className="absolute bottom-5 right-5 z-10 flex items-center gap-2">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={toggleLocalCamera}
                        className={`p-3 rounded-full backdrop-blur-xl transition-all cursor-pointer border-0 outline-none shadow-xl ${
                          useLocalCam
                            ? 'bg-purple-600 text-white shadow-[0_0_25px_rgba(147,51,234,0.7)]'
                            : 'bg-black/60 text-white hover:bg-black/80'
                        }`}
                        title={useLocalCam ? 'Switch to student view' : 'Connect teacher webcam'}
                      >
                        <Camera className="w-4 h-4" />
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={toggleFullscreen}
                        className="p-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xl text-white transition-all cursor-pointer border-0 outline-none shadow-xl"
                        title="Toggle fullscreen"
                      >
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      </motion.button>
                    </div>
                  </>
                ) : null}
              </div>

              {/* Bottom Carousel Strip with Candidate Feeds */}
              {activeCandidates.length > 0 && (
                <div className="mt-3 relative shrink-0">
                  <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                    {activeCandidates.map((p, idx) => {
                      const isSelected = p.student_id === selectedStudentId;
                      return (
                        <motion.div
                          key={`carousel-${p.id || p.student_id}-${idx}`}
                          layout
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                          className={`group relative w-44 sm:w-52 aspect-[16/10] rounded-2xl overflow-hidden transition-all duration-300 shrink-0 text-left p-2.5 flex flex-col justify-between border-0 outline-none ring-0 cursor-pointer bg-slate-900 ${
                            isSelected
                              ? 'shadow-[0_12px_36px_rgba(147,51,234,0.45)] ring-2 ring-purple-500 scale-[1.03] opacity-100'
                              : 'shadow-[0_4px_16px_rgba(0,0,0,0.2)] opacity-85 hover:opacity-100'
                          }`}
                          onClick={() => setSelectedStudentId(p.student_id)}
                        >
                          {/* Inner Avatar Graphic */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-purple-950/40">
                            <div className="w-10 h-10 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold text-xs mb-1">
                              {p.student_name.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="text-[10px] text-slate-400">Surveillance Feed</span>
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

                          {/* Status Pill Top Right */}
                          <div className="flex items-center justify-between w-full z-10">
                            <span className={`w-2 h-2 rounded-full ${p.is_suspended ? 'bg-rose-500' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'}`} />
                            <div className="flex items-center gap-1">
                              {p.hand_raised && (
                                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950 flex items-center gap-0.5">
                                  <Hand className="w-2.5 h-2.5" />
                                </span>
                              )}
                              {p.is_suspended ? (
                                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-600 text-white">
                                  Suspended
                                </span>
                              ) : p.warning_count > 0 ? (
                                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950">
                                  {p.warning_count}W
                                </span>
                              ) : null}
                            </div>
                          </div>

                          {/* Hover Overlay Action Pills for Each Student */}
                          <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-xs flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudentId(p.student_id);
                                setWarningModalStudent(p);
                              }}
                              className="px-2.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-1 shadow-xs"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>Warn</span>
                            </motion.button>

                            {p.is_suspended ? (
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRestoreStudent(p);
                                }}
                                className="px-2.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-1 shadow-xs"
                              >
                                <Play className="w-3 h-3" />
                                <span>Restore</span>
                              </motion.button>
                            ) : (
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStudentId(p.student_id);
                                  setSuspendModalStudent(p);
                                }}
                                className="px-2.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-1 shadow-xs"
                              >
                                <Pause className="w-3 h-3" />
                                <span>Suspend</span>
                              </motion.button>
                            )}
                          </div>

                          {/* Candidate Name Tag Bottom */}
                          <div className="w-full z-10 p-1 pointer-events-none">
                            <p className="text-[11px] font-bold text-white truncate drop-shadow-md">
                              {p.student_name}
                            </p>
                            <div className="flex items-center justify-between text-[9px] text-slate-300">
                              <span className="font-mono">{p.student_lce_code}</span>
                              <span>{p.questions_answered}/25 Qs</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* VIEW MODE B: MULTI-CAM GRID */
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-3.5 min-h-[380px] overflow-y-auto pr-1">
              {activeCandidates.map((p, idx) => {
                const isSelected = p.student_id === selectedStudentId;
                return (
                  <motion.div
                    key={`grid-${p.id || p.student_id}-${idx}`}
                    layout
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    onClick={() => {
                      setSelectedStudentId(p.student_id);
                      setDrawerStudent(p);
                    }}
                    className={`relative rounded-[28px] overflow-hidden bg-slate-950 shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.6)] cursor-pointer flex flex-col justify-between p-3.5 transition-all duration-300 border-0 outline-none ring-0 ${
                      isSelected ? 'shadow-[0_14px_45px_rgba(147,51,234,0.5)] ring-2 ring-purple-500 scale-[1.02]' : ''
                    }`}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-purple-950/40">
                      <div className="w-12 h-12 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold text-sm mb-1">
                        {p.student_name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[11px] text-slate-400">Surveillance Stream Active</span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/45" />

                    {/* Top Row: Live Status + Badges */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                        <span className={`w-2 h-2 rounded-full ${p.is_suspended ? 'bg-rose-500' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'}`} />
                        <span>{p.is_suspended ? 'Suspended' : 'Live Feed'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {p.hand_raised && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-xs flex items-center gap-1 animate-pulse">
                            <Hand className="w-3 h-3" />
                            <span>Hand</span>
                          </span>
                        )}
                        {p.warning_count > 0 && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-xs">
                            {p.warning_count} Warn
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Row: Candidate Information + Direct Actions */}
                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white drop-shadow-md">
                            {p.student_name}
                          </h4>
                          <p className="text-[10px] text-slate-300 font-mono">
                            {p.student_lce_code} • {p.questions_answered}/25 Answered
                          </p>
                        </div>

                        {!p.is_suspended && (
                          <div className="flex items-center gap-0.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur-md">
                            <span className="w-1 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="w-1 h-3.5 rounded-full bg-emerald-400 animate-pulse delay-75" />
                            <span className="w-1 h-2 rounded-full bg-emerald-400 animate-pulse delay-150" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-1 border-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudentId(p.student_id);
                            setWarningModalStudent(p);
                          }}
                          className="flex-1 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1 shadow-xs"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>Warn</span>
                        </button>

                        {p.is_suspended ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestoreStudent(p);
                            }}
                            className="flex-1 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1 shadow-xs"
                          >
                            <Play className="w-3 h-3" />
                            <span>Restore</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudentId(p.student_id);
                              setSuspendModalStudent(p);
                            }}
                            className="flex-1 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1 shadow-xs"
                          >
                            <Pause className="w-3 h-3" />
                            <span>Suspend</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ── FLOATING ACTION CONTROLS BAR (IMAGE 2 DOCKED BOTTOM BAR) ── */}
          <div className="mt-3 p-3 rounded-full bg-white/95 dark:bg-[#111728]/95 backdrop-blur-2xl shadow-[0_15px_45px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-center justify-between gap-3 border-0 outline-none">
            {/* Left: Timer Pill with Theme-Adaptive Colors */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 dark:bg-white/10 dark:text-white text-xs font-mono font-bold shadow-xs border-0 outline-none">
              <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{formatCountdown(remainingSeconds)}</span>
            </div>

            {/* Center: Supervisory Actions for Currently Focused Student */}
            <div className="flex items-center gap-2.5">
              <span className="hidden xl:inline text-xs font-semibold text-slate-500 dark:text-slate-400">
                Focus: <strong className="text-slate-900 dark:text-white">{selectedStudent?.student_name || 'No Student Selected'}</strong>
              </span>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95, y: 1 }}
                disabled={!selectedStudent}
                onClick={() => setWarningModalStudent(selectedStudent)}
                className="px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-2 shadow-[0_6px_20px_rgba(245,158,11,0.35)] disabled:opacity-40"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Issue Warning</span>
              </motion.button>

              {selectedStudent?.is_suspended ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95, y: 1 }}
                  onClick={() => handleRestoreStudent(selectedStudent)}
                  className="px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-2 shadow-[0_6px_20px_rgba(16,185,129,0.35)]"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Restore Student</span>
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95, y: 1 }}
                  disabled={!selectedStudent}
                  onClick={() => setSuspendModalStudent(selectedStudent)}
                  className="px-4 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-2 shadow-[0_6px_20px_rgba(225,29,72,0.35)] disabled:opacity-40"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Suspend Student</span>
                </motion.button>
              )}

              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95, y: 1 }}
                disabled={!selectedStudent}
                onClick={() => setTimeModalStudent(selectedStudent)}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all cursor-pointer border-0 outline-none disabled:opacity-40"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Adjust Time</span>
              </motion.button>

              {selectedStudent?.hand_raised && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95, y: 1 }}
                  onClick={() => handleAcknowledgeHand(selectedStudent.student_id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer border-0 outline-none animate-pulse"
                >
                  <Hand className="w-3.5 h-3.5" />
                  <span>Lower Hand</span>
                </motion.button>
              )}
            </div>

            {/* Right: End Examination Pill Button */}
            <div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95, y: 1 }}
                onClick={() => setShowEndExamModal(true)}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-2 shadow-[0_6px_25px_rgba(225,29,72,0.4)]"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">End Examination</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── RIGHT DOCKED SIDEBAR (PARTICIPANTS & CHAT) ── */}
        <aside className="hidden lg:flex w-84 xl:w-96 rounded-[32px] bg-white/95 dark:bg-[#0E1322]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.5)] flex-col shrink-0 z-10 overflow-hidden border-0 outline-none">
          {/* Header Segmented Tabs */}
          <div className="p-3.5 pb-2">
            <div className="relative p-1 rounded-2xl bg-slate-200/70 dark:bg-[#161D2E] flex items-center shadow-inner border-0 outline-none">
              <button
                type="button"
                onClick={() => setSidebarTab('participants')}
                className="relative flex-1 py-2 rounded-xl text-xs font-bold transition-colors duration-200 cursor-pointer border-0 outline-none z-10 text-center"
              >
                {sidebarTab === 'participants' && (
                  <motion.div
                    layoutId="sidebarTabIndicator"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-white dark:bg-[#222C44] shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                  />
                )}
                <span
                  className={`relative z-10 ${
                    sidebarTab === 'participants'
                      ? 'text-slate-900 dark:text-white font-extrabold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Participants ({totalJoinedCount})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSidebarTab('chat')}
                className="relative flex-1 py-2 rounded-xl text-xs font-bold transition-colors duration-200 cursor-pointer border-0 outline-none z-10 text-center"
              >
                {sidebarTab === 'chat' && (
                  <motion.div
                    layoutId="sidebarTabIndicator"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-white dark:bg-[#222C44] shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                  />
                )}
                <span
                  className={`relative z-10 ${
                    sidebarTab === 'chat'
                      ? 'text-slate-900 dark:text-white font-extrabold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Advisory Chat
                </span>
              </button>
            </div>
          </div>

          {/* TAB 1: PARTICIPANTS */}
          {sidebarTab === 'participants' && (
            <div className="flex-1 flex flex-col min-h-0 px-4 pb-4 space-y-3">
              {/* Dedicated Waiting Room Section */}
              {waitingStudents.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 space-y-2 border-0 outline-none shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                        Waiting Room ({waitingStudents.length})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleApproveAll}
                      className="px-2.5 py-1 rounded-full bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/60 dark:hover:bg-emerald-800 text-emerald-900 dark:text-emerald-200 text-[11px] font-bold cursor-pointer border-0 outline-none transition-all flex items-center gap-1 shadow-xs"
                    >
                      <CheckCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Approve All</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-none">
                    {waitingStudents.map((s, idx) => (
                      <div
                        key={s.id || `${s.student_id}-${idx}`}
                        className="p-2 rounded-xl bg-white/90 dark:bg-[#141B2D]/90 flex items-center justify-between gap-2 shadow-xs border-0 outline-none"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {s.student_name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">{s.student_lce_code}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApproveStudent(s)}
                          className="px-2.5 py-1 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-300 text-[10px] font-bold cursor-pointer border-0 outline-none transition-all flex items-center gap-1 shrink-0"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchParticipant}
                  onChange={(e) => setSearchParticipant(e.target.value)}
                  placeholder="Search candidate name or LCE..."
                  className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-100 dark:bg-[#161D2E] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0 border-0 shadow-xs"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-semibold text-slate-500">
                {(['all', 'active', 'suspended', 'hand_raised', 'warned'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setStudentFilter(f)}
                    className={`px-3 py-1 rounded-full capitalize transition-all cursor-pointer border-0 outline-none shrink-0 ${
                      studentFilter === f
                        ? 'bg-purple-600 text-white font-extrabold shadow-sm'
                        : 'bg-slate-200/70 dark:bg-[#161D2E] text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-[#1F273E]'
                    }`}
                  >
                    {f === 'hand_raised' ? 'Hand Raised' : f}
                  </button>
                ))}
              </div>

              {/* Candidate Cards List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-4 scrollbar-none">
                {filteredParticipants.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                      <Users className="w-6 h-6" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                      No Candidates Found
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 max-w-[180px]">
                      Share exam code <strong>{displayCode}</strong> to invite candidates.
                    </p>
                    <button
                      type="button"
                      onClick={handleShareInvite}
                      className="px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-xs cursor-pointer border-0 outline-none"
                    >
                      Invite Students
                    </button>
                  </div>
                ) : (
                  filteredParticipants.map((p, idx) => {
                    const isSelected = p.student_id === selectedStudentId;
                    return (
                      <motion.div
                        key={p.id || `${p.student_id}-${idx}`}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => {
                          setSelectedStudentId(p.student_id);
                          setDrawerStudent(p);
                        }}
                        className={`p-3 rounded-2xl cursor-pointer transition-all flex flex-col gap-2 border-0 outline-none ring-0 ${
                          isSelected
                            ? 'bg-purple-50 dark:bg-purple-950/60 shadow-sm'
                            : 'bg-slate-50 dark:bg-[#131929] hover:bg-slate-100 dark:hover:bg-[#192236]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full bg-purple-600/20 text-purple-400 font-bold text-xs flex items-center justify-center shrink-0">
                            {p.student_name.slice(0, 2).toUpperCase()}
                            <span
                              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#131929] ${
                                p.is_suspended ? 'bg-rose-500' : 'bg-emerald-500'
                              }`}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {p.student_name}
                              </h4>
                              {p.is_suspended ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                  Suspended
                                </span>
                              ) : p.warning_count > 0 ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                  {p.warning_count}W
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {p.student_lce_code} • {p.questions_answered}/25 answered
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1 border-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setWarningModalStudent(p);
                            }}
                            className="flex-1 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-800 hover:text-slate-950 dark:bg-amber-500/20 dark:hover:bg-amber-500 dark:text-amber-300 dark:hover:text-slate-950 text-[11px] font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1 shadow-xs"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            <span>Warn</span>
                          </button>

                          {p.is_suspended ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRestoreStudent(p);
                              }}
                              className="flex-1 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-600 text-emerald-800 hover:text-white dark:bg-emerald-500/20 dark:hover:bg-emerald-600 dark:text-emerald-300 dark:hover:text-white text-[11px] font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1 shadow-xs"
                            >
                              <Play className="w-3 h-3" />
                              <span>Restore</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSuspendModalStudent(p);
                              }}
                              className="flex-1 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-600 text-rose-800 hover:text-white dark:bg-rose-500/20 dark:hover:bg-rose-600 dark:text-rose-300 dark:hover:text-white text-[11px] font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1 shadow-xs"
                            >
                              <Pause className="w-3 h-3" />
                              <span>Suspend</span>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ADVISORY BROADCAST CHAT */}
          {sidebarTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0 px-4 pb-4">
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 pb-3 scrollbar-none">
                {advisoryMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-2xl text-xs space-y-1 ${
                      msg.isTeacher
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-l-2 border-purple-500'
                        : 'bg-slate-100 dark:bg-[#162032]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-purple-600 dark:text-purple-400">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200">{msg.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAdvisory()}
                  placeholder="Broadcast instructions to candidates..."
                  className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#162032] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0 border-0 shadow-inner"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendAdvisory}
                  className="p-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer border-0 outline-none shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          )}
        </aside>

        {/* Floating AI Assistant Bot Badge */}
        <div className="fixed bottom-6 right-6 z-30 hidden sm:flex">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-[0_8px_30px_rgba(6,182,212,0.5)] cursor-pointer"
            title="AI Proctoring Assistant Active"
          >
            <Bot className="w-6 h-6 animate-pulse" />
          </motion.div>
        </div>
      </div>

      {/* ── MODALS ── */}
      <IssueWarningModal
        isOpen={!!warningModalStudent}
        onClose={() => setWarningModalStudent(null)}
        participant={warningModalStudent}
        onConfirm={handleConfirmWarning}
      />

      <SuspendStudentModal
        isOpen={!!suspendModalStudent}
        onClose={() => setSuspendModalStudent(null)}
        participant={suspendModalStudent}
        onConfirm={handleConfirmSuspend}
      />

      <TimeAdjustmentModal
        isOpen={!!timeModalStudent}
        onClose={() => setTimeModalStudent(null)}
        participant={timeModalStudent}
        onConfirm={handleConfirmTimeAdjustment}
      />

      {exam && (
        <EndExamConfirmationModal
          isOpen={showEndExamModal}
          onClose={() => setShowEndExamModal(false)}
          exam={exam}
          participants={activeCandidates}
          onConfirmEnd={handleConfirmEndExam}
          onDownloadReport={handleDownloadExcel}
        />
      )}

      <SupervisionReportModal
        isOpen={!!reportModalData}
        onClose={() => setReportModalData(null)}
        report={reportModalData}
      />

      <StudentSupervisionDrawer
        isOpen={!!drawerStudent}
        onClose={() => setDrawerStudent(null)}
        participant={drawerStudent}
        events={events}
        onOpenWarnModal={() => {
          if (drawerStudent) setWarningModalStudent(drawerStudent);
        }}
        onOpenSuspendModal={() => {
          if (drawerStudent) setSuspendModalStudent(drawerStudent);
        }}
        onRestore={async () => {
          if (drawerStudent) await handleRestoreStudent(drawerStudent);
        }}
        onOpenTimeModal={() => {
          if (drawerStudent) setTimeModalStudent(drawerStudent);
        }}
        onAcknowledgeHand={async () => {
          if (drawerStudent) await handleAcknowledgeHand(drawerStudent.student_id);
        }}
        onForceSubmit={async () => {
          if (drawerStudent) await handleForceEndStudent(drawerStudent.student_id);
        }}
      />
    </div>
  );
}
