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
  ArrowRight,
  Clock,
  Wifi,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  PhoneOff,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Camera,
  RefreshCw,
  LayoutGrid,
  Columns,
  Mic,
  MicOff,
  Volume2,
  Eye,
  Sliders,
  Lock,
  Hand,
  FileSpreadsheet,
  Share2,
  QrCode,
  MoreVertical,
  Activity,
  ShieldAlert,
  Info,
  ChevronRight,
  ChevronDown,
  X,
} from 'lucide-react';
import type {
  CustomExam,
  CustomExamParticipant,
  ExamSupervisionEvent,
  CustomExamReport,
  WarningLevel,
  WarningReasonCode,
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

// Fallback visual streams for simulated candidate feeds when direct WebRTC is in transition
const CANDIDATE_STREAMS: Record<string, { videoUrl: string; poster: string; gaze: string; lighting: string }> = {
  stud_1: {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-working-with-headphones-on-laptop-42930-large.mp4',
    poster: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    gaze: 'Screen Focused',
    lighting: 'Optimal (98%)',
  },
  stud_2: {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-student-sitting-at-a-desk-working-with-a-laptop-42933-large.mp4',
    poster: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    gaze: 'Screen Focused',
    lighting: 'Optimal (95%)',
  },
  stud_3: {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-remotely-from-his-living-room-42928-large.mp4',
    poster: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    gaze: 'Screen Focused',
    lighting: 'Optimal (94%)',
  },
  stud_4: {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-concentrating-on-a-laptop-at-home-42926-large.mp4',
    poster: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    gaze: 'Slightly Looking Away',
    lighting: 'Optimal (96%)',
  },
  stud_5: {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-sitting-at-a-desk-typing-on-a-laptop-42931-large.mp4',
    poster: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80',
    gaze: 'Screen Focused',
    lighting: 'Optimal (97%)',
  },
};

export function LiveTeacherSupervisionRoom({
  examId,
  examCode: initialCode,
  onBackToDashboard,
  isSuperAdmin = false,
}: LiveTeacherSupervisionRoomProps) {
  const router = useRouter();

  // Core Room State
  const [exam, setExam] = useState<CustomExam | null>(null);
  const [participants, setParticipants] = useState<CustomExamParticipant[]>([]);
  const [events, setEvents] = useState<ExamSupervisionEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Student for Focus / Spotlight / Drawer
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [drawerStudent, setDrawerStudent] = useState<CustomExamParticipant | null>(null);

  // View Mode: 'grid' (adaptive meeting wall) | 'spotlight' (focused active speaker style)
  const [viewMode, setViewMode] = useState<'grid' | 'spotlight'>('grid');

  // Sidebar state (Desktop right panel & Mobile bottom sheet)
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'participants' | 'activity' | 'insights' | 'chat'>('participants');
  const [mobileBottomSheet, setMobileBottomSheet] = useState<'none' | 'participants' | 'chat' | 'insights'>('none');

  // Filters & Search
  const [searchParticipant, setSearchParticipant] = useState('');
  const [studentFilter, setStudentFilter] = useState<'all' | 'active' | 'suspended' | 'hand_raised' | 'warned'>('all');

  // Meeting Controls State
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const centerContainerRef = useRef<HTMLDivElement>(null);
  const centerVideoRef = useRef<HTMLVideoElement>(null);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [advisoryMessages, setAdvisoryMessages] = useState<
    { id: string; sender: string; text: string; time: string; isTeacher?: boolean }[]
  >([
    {
      id: 'm1',
      sender: 'Supervision Engine',
      text: 'Exam supervision session initiated. High-fidelity proctoring active.',
      time: '10:00 AM',
    },
    {
      id: 'm2',
      sender: 'Invigilator Note',
      text: 'Please ensure webcams remain uncovered throughout testing.',
      time: '10:02 AM',
      isTeacher: true,
    },
  ]);

  // Modals State
  const [warningModalStudent, setWarningModalStudent] = useState<CustomExamParticipant | null>(null);
  const [suspendModalStudent, setSuspendModalStudent] = useState<CustomExamParticipant | null>(null);
  const [timeModalStudent, setTimeModalStudent] = useState<CustomExamParticipant | null>(null);
  const [showEndExamModal, setShowEndExamModal] = useState(false);
  const [reportModalData, setReportModalData] = useState<CustomExamReport | null>(null);
  const [actionNotification, setActionNotification] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Local Invigilator Webcam Preview Toggle
  const [localCamStream, setLocalCamStream] = useState<MediaStream | null>(null);
  const [useLocalCam, setUseLocalCam] = useState(false);

  // Official countdown timer
  const [remainingSeconds, setRemainingSeconds] = useState(3600);

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

  // Fetch room state (Real connected students only)
  const fetchRoomState = useCallback(async () => {
    try {
      const res = await fetch(`/api/custom-exams/supervision/${examId}`);
      if (res.ok) {
        const data = await res.json();
        setExam(data.exam);
        const liveParticipants: CustomExamParticipant[] = data.participants || [];
        setParticipants(liveParticipants);
        if (liveParticipants.length > 0) {
          if (!selectedStudentId || !liveParticipants.some((p) => p.student_id === selectedStudentId)) {
            setSelectedStudentId(liveParticipants[0].student_id);
          }
        } else {
          setSelectedStudentId('');
        }
        setEvents(data.events || []);
      }
    } catch {
      // Retain existing state on transient poll glitch
    } finally {
      setLoading(false);
    }
  }, [examId, selectedStudentId]);

  useEffect(() => {
    fetchRoomState();
    const interval = setInterval(fetchRoomState, 4000);
    return () => clearInterval(interval);
  }, [fetchRoomState]);

  // Invigilator local camera toggle
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
        console.warn('Camera access denied or unavailable:', err);
      }
    }
  };

  useEffect(() => {
    if (useLocalCam && localCamStream && centerVideoRef.current) {
      centerVideoRef.current.srcObject = localCamStream;
      centerVideoRef.current.play().catch(() => {});
    }
  }, [useLocalCam, localCamStream, selectedStudentId]);

  // Active candidates list (de-duplicated by student_id)
  const activeCandidates = useMemo(() => {
    const seen = new Set<string>();
    return participants.filter((p) => {
      const id = p.student_id;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [participants]);

  const selectedStudent =
    activeCandidates.find((p) => p.student_id === selectedStudentId) || activeCandidates[0] || null;

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
      setActionNotification('Join link copied! Share with candidates.');
      setTimeout(() => {
        setCopiedLink(false);
        setActionNotification(null), 3000;
      });
    }
  };

  const handleShareInvite = () => {
    const inviteText = `Join the live proctored examination "${exam?.title || 'Examination'}" on SAMAYYUDH.\n\nAccess Code: ${displayCode}\nDirect Link: ${joinUrl}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: exam?.title || 'Examination Invitation',
          text: inviteText,
          url: joinUrl,
        })
        .catch(() => {
          navigator.clipboard?.writeText(inviteText);
          setActionNotification('Invitation copied to clipboard! Share with candidates.');
          setTimeout(() => setActionNotification(null), 3500);
        });
    } else if (typeof navigator !== 'undefined') {
      navigator.clipboard?.writeText(inviteText);
      setActionNotification('Invitation copied to clipboard! Share with candidates.');
      setTimeout(() => setActionNotification(null), 3500);
    }
  };

  // Start exam handler
  const handleStartExam = async () => {
    if (activeCandidates.length === 0) {
      setActionNotification('No one is here right now. Please invite students before starting.');
      setTimeout(() => setActionNotification(null), 4000);
      return;
    }
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
        fetchRoomState();
        setActionNotification('Examination concluded. Submissions finalized and locked.');
        setTimeout(() => setActionNotification(null), 4000);
      }
    } catch {}
  };

  // Issue warning handler
  const handleConfirmWarning = async (
    reasonCode: WarningReasonCode,
    reasonLabel: string,
    level: WarningLevel,
    note: string
  ) => {
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
          reason: reasonLabel,
          note,
          actor_role: isSuperAdmin ? 'admin' : 'teacher',
        }),
      });

      if (res.ok) {
        setActionNotification(`Warning (${level}) sent to ${targetStudent.student_name}`);
        setTimeout(() => setActionNotification(null), 3500);
        fetchRoomState();
      }
    } catch {
      // Optimistic local update
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
        }),
      });
      setActionNotification('Candidate hand acknowledged.');
      setTimeout(() => setActionNotification(null), 3000);
      fetchRoomState();
    } catch {}
  };

  // Force end student examination
  const handleForceEndStudent = async (studentId: string) => {
    try {
      await fetch('/api/custom-exams/supervision/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: exam?.id || examId,
          student_id: studentId,
          action: 'end_student_exam',
        }),
      });
      setActionNotification('Student submission finalized by supervisor.');
      setTimeout(() => setActionNotification(null), 3500);
      fetchRoomState();
    } catch {}
  };

  // Send broadcast advisory
  const handleSendAdvisory = () => {
    if (!chatInput.trim()) return;
    setAdvisoryMessages((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        sender: 'You (Invigilator)',
        text: chatInput.trim(),
        time: 'Just now',
        isTeacher: true,
      },
    ]);
    setChatInput('');
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

  // Filtering candidates in right-side management panel
  const filteredParticipants = activeCandidates.filter((p) => {
    const matchesSearch =
      p.student_name.toLowerCase().includes(searchParticipant.toLowerCase()) ||
      p.student_lce_code.toLowerCase().includes(searchParticipant.toLowerCase());

    if (!matchesSearch) return false;

    if (studentFilter === 'active') return p.exam_status === 'in_progress' && !p.is_suspended;
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

  // Grid layout class based on participant count
  const getGridColsClass = (count: number) => {
    if (count <= 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 6) return 'grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4';
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER: NO ONE IS HERE RIGHT NOW (EMPTY STATE & LIVE QR)
  // ─────────────────────────────────────────────────────────────
  const renderEmptyLobby = () => {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(joinUrl)}`;

    return (
      <div className="flex-1 w-full rounded-[32px] overflow-hidden bg-white/90 dark:bg-[#0D1322]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center p-6 sm:p-12 text-center relative border-0">
        {/* Soft Ambient Meeting Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-500/10 dark:bg-purple-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          {/* Soft Meeting Radar Badge */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold mb-6 shadow-xs border-0 outline-none">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-600 dark:bg-purple-400"></span>
            </span>
            <span className="tracking-wide">Supervision Stage Active • Waiting for candidates...</span>
          </div>

          {/* Heading Requested */}
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            No one is here right now
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-8">
            Your supervision room is ready. Invite students to join the examination. Real-time video tiles will appear automatically as candidates check in.
          </p>

          {/* Large High-Fidelity QR Code Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-[28px] bg-slate-50/90 dark:bg-[#141B2D]/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] w-full max-w-md mb-8 border-0"
          >
            <div className="relative p-3 bg-white rounded-2xl shadow-sm shrink-0">
              <img
                src={qrCodeUrl}
                alt={`Scan QR code to join exam ${displayCode}`}
                className="w-32 h-32 sm:w-36 sm:h-36 object-contain rounded-xl"
                loading="eager"
              />
              <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-1.5 rounded-full shadow-md">
                <QrCode className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex-1 text-left flex flex-col justify-between h-full space-y-3 w-full">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  Examination Access Code
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400 tracking-wider">
                    {displayCode}
                  </span>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-xl bg-slate-200/70 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer border-0 outline-none"
                    title="Copy exam code"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </motion.button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  Direct Student Link
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono mt-0.5">
                  /exam/waiting-room?code={displayCode}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyJoinLink}
                  className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Join Link'}</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShareInvite}
                  className="py-2 px-3 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1.5"
                  title="Share invitation"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Primary Action Button */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleShareInvite}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-extrabold transition-all cursor-pointer border-0 outline-none flex items-center gap-2 shadow-[0_8px_25px_rgba(147,51,234,0.3)]"
            >
              <Share2 className="w-4 h-4" />
              <span>Invite Students</span>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={fetchRoomState}
              className="px-4 py-3 rounded-full bg-slate-200/70 hover:bg-slate-300/80 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Room</span>
            </motion.button>
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER: INDIVIDUAL CANDIDATE TILE
  // ─────────────────────────────────────────────────────────────
  const renderParticipantTile = (p: CustomExamParticipant, isSpotlight = false) => {
    const isSelected = p.student_id === selectedStudentId;
    const streamData = CANDIDATE_STREAMS[p.student_id];

    return (
      <motion.div
        key={p.student_id}
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
        onClick={() => setSelectedStudentId(p.student_id)}
        onDoubleClick={() => setDrawerStudent(p)}
        className={`group relative rounded-3xl overflow-hidden bg-slate-900 shadow-[0_8px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.6)] cursor-pointer flex flex-col justify-between transition-all duration-300 border-0 outline-none ring-0 ${
          isSpotlight || activeCandidates.length === 1
            ? 'w-full h-full min-h-[340px] sm:min-h-[460px]'
            : 'aspect-video min-h-[160px]'
        } ${isSelected ? 'shadow-[0_12px_40px_rgba(147,51,234,0.45)] ring-2 ring-purple-500/70' : ''}`}
      >
        {/* Candidate Video Stream */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={streamData?.poster}
          className={`absolute inset-0 w-full h-full object-cover filter brightness-95 contrast-105 transition-all duration-300 ${
            p.is_suspended ? 'blur-md brightness-40' : ''
          }`}
        >
          <source src={streamData?.videoUrl} type="video/mp4" />
        </video>

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

        {/* Top Floating Status Indicators */}
        <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-xs ${
                p.is_suspended
                  ? 'bg-rose-600/90 text-white'
                  : 'bg-black/45 text-white'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  p.is_suspended ? 'bg-white' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                }`}
              />
              <span>{p.is_suspended ? 'Suspended' : 'Live'}</span>
            </span>

            {/* Audio Indicator */}
            <span className="p-1.5 rounded-full bg-black/45 backdrop-blur-md text-slate-200">
              <Mic className="w-3 h-3 text-emerald-400" />
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {p.hand_raised && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md animate-pulse">
                <Hand className="w-3 h-3" />
                <span>Hand Raised</span>
              </span>
            )}
            {p.warning_count > 0 && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 shadow-md">
                {p.warning_count} Warning{p.warning_count > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* If Suspended: Center Lock Screen */}
        {p.is_suspended && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 text-center bg-rose-950/60 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-300 flex items-center justify-center mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">Examination Paused</h4>
            <p className="text-[11px] text-rose-200 mt-0.5 max-w-[200px] truncate">
              {p.suspended_reason || 'Flagged by invigilator'}
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleRestoreStudent(p);
              }}
              className="mt-3 px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-md cursor-pointer border-0 outline-none flex items-center gap-1.5"
            >
              <Play className="w-3 h-3" />
              <span>Restore</span>
            </motion.button>
          </div>
        )}

        {/* Bottom Floating Candidate Information Bar */}
        <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md text-white text-xs font-semibold shadow-md">
            <span>{p.student_name}</span>
            <span className="text-[10px] text-slate-300 font-mono">({p.student_lce_code})</span>
          </div>

          {/* Quick Hover Supervision Actions */}
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <motion.button
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={(e) => {
                e.stopPropagation();
                setWarningModalStudent(p);
              }}
              className="p-2 rounded-full bg-amber-500 text-slate-950 shadow-md cursor-pointer border-0 outline-none"
              title="Issue Warning"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
            </motion.button>

            {!p.is_suspended && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSuspendModalStudent(p);
                }}
                className="p-2 rounded-full bg-rose-600 text-white shadow-md cursor-pointer border-0 outline-none"
                title="Suspend Student"
              >
                <Pause className="w-3.5 h-3.5" />
              </motion.button>
            )}

            <motion.button
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={(e) => {
                e.stopPropagation();
                setDrawerStudent(p);
              }}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white shadow-md cursor-pointer border-0 outline-none"
              title="Inspect Dossier"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER: DESKTOP WORKSPACE
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[calc(100vh-4.25rem)] w-full select-none overflow-hidden bg-[#EEF3FB] dark:bg-[#080C16] text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* ── SUPER ADMIN SUPERVISION BANNER ── */}
      {isSuperAdmin && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-950 text-white px-4 py-2 flex items-center justify-between text-xs font-semibold shadow-md z-30 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            <span className="tracking-wider uppercase font-black text-amber-300">
              Super Admin Universal Control Room
            </span>
            <span className="text-white/40 hidden sm:inline">|</span>
            <span className="text-white/80 hidden sm:inline text-[11px]">
              Full Platform Oversight & Audit Logging Active
            </span>
          </div>
          <div className="flex items-center gap-3">
            {onBackToDashboard && (
              <button
                type="button"
                onClick={onBackToDashboard}
                className="text-white/80 hover:text-white underline text-[11px] cursor-pointer"
              >
                Exit to Command Center
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── TOP HEADER (MEETORA / ZOOM STYLE) ── */}
      <header className="h-16 px-4 sm:px-6 bg-white/80 dark:bg-[#0E1424]/80 backdrop-blur-2xl flex items-center justify-between shrink-0 z-20 shadow-[0_2px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.4)] border-0">
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
                {exam?.title || 'Examination Supervision Room'}
              </h1>
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleCopyCode}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/70 dark:hover:bg-purple-900/70 text-purple-800 dark:text-purple-300 text-xs font-mono font-bold transition-all border-0 outline-none shadow-xs"
                title="Copy Exam Code"
              >
                <span>{displayCode}</span>
                {copiedCode ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </motion.button>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 truncate">
              <span>{totalJoinedCount} Students Connected</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{activeCount} Active</span>
              {suspendedCount > 0 && (
                <>
                  <span>•</span>
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">{suspendedCount} Suspended</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center: View Switcher (Desktop) */}
        <div className="hidden lg:flex items-center p-1 rounded-full bg-slate-200/70 dark:bg-white/10 shadow-inner border-0 outline-none relative">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className="relative flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 cursor-pointer border-0 outline-none z-10"
          >
            {viewMode === 'grid' && (
              <motion.div
                layoutId="viewModeActiveIndicator"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-full bg-white dark:bg-purple-600 shadow-[0_2px_10px_rgba(0,0,0,0.12)]"
              />
            )}
            <LayoutGrid
              className={`w-3.5 h-3.5 relative z-10 transition-colors ${
                viewMode === 'grid' ? 'text-purple-700 dark:text-white' : 'text-slate-500 dark:text-slate-400'
              }`}
            />
            <span
              className={`relative z-10 transition-colors ${
                viewMode === 'grid' ? 'text-purple-950 dark:text-white font-extrabold' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Adaptive Grid
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('spotlight')}
            className="relative flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 cursor-pointer border-0 outline-none z-10"
          >
            {viewMode === 'spotlight' && (
              <motion.div
                layoutId="viewModeActiveIndicator"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-full bg-white dark:bg-purple-600 shadow-[0_2px_10px_rgba(0,0,0,0.12)]"
              />
            )}
            <Columns
              className={`w-3.5 h-3.5 relative z-10 transition-colors ${
                viewMode === 'spotlight' ? 'text-purple-700 dark:text-white' : 'text-slate-500 dark:text-slate-400'
              }`}
            />
            <span
              className={`relative z-10 transition-colors ${
                viewMode === 'spotlight'
                  ? 'text-purple-950 dark:text-white font-extrabold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Spotlight View
            </span>
          </button>
        </div>

        {/* Right Header Status Badges & Quick Reports */}
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
              <span>Start Exam</span>
            </motion.button>
          )}

          {/* Official Countdown Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs border-0 outline-none">
            <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>{formatCountdown(remainingSeconds)}</span>
          </div>

          {/* Excel Report Download */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadExcel}
            className="hidden sm:flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-full bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-800 dark:text-purple-300 text-xs font-bold transition-all cursor-pointer border-0 outline-none shadow-xs"
            title="Download Excel Report"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Excel</span>
          </motion.button>

          {/* Supervision Audit Modal */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenReport}
            className="hidden md:flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none shadow-xs"
            title="Supervision Audit"
          >
            <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Audit</span>
          </motion.button>

          {/* Toggle Right Panel (Desktop) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSidePanel(!showSidePanel)}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-all cursor-pointer border-0 outline-none shadow-xs"
            title={showSidePanel ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <Users className="w-4 h-4" />
          </motion.button>
        </div>
      </header>

      {/* ── MAIN WORKSPACE CONTAINER ── */}
      <div className="flex-1 flex min-h-0 relative p-3 sm:p-5 gap-4">
        {/* CENTER COLUMN: MEETING STAGE */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Action Notification Pill Toast */}
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

          {/* ── MEETING STAGE VIEWPORT ── */}
          <div
            ref={centerContainerRef}
            className="flex-1 flex flex-col min-h-0 relative rounded-[32px] overflow-hidden bg-white/70 dark:bg-[#0E1424]/70 backdrop-blur-xl shadow-[0_12px_45px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-3 sm:p-4 border-0"
          >
            {activeCandidates.length === 0 ? (
              renderEmptyLobby()
            ) : viewMode === 'grid' ? (
              /* ADAPTIVE PARTICIPANT GRID (ZOOM / MEETORA STYLE) */
              <div
                className={`flex-1 grid ${getGridColsClass(
                  activeCandidates.length
                )} gap-3.5 overflow-y-auto pr-1 pb-1 scrollbar-none`}
              >
                {activeCandidates.map((p) => renderParticipantTile(p, false))}
              </div>
            ) : (
              /* SPOTLIGHT MODE: FOCUSED STUDENT + CAROUSEL RIBBON */
              <div className="flex-1 flex flex-col min-h-0 gap-3">
                <div className="flex-1 relative min-h-0">
                  {selectedStudent && renderParticipantTile(selectedStudent, true)}
                </div>

                {/* Candidate Thumbnails Carousel Ribbon */}
                {activeCandidates.length > 1 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none shrink-0">
                    {activeCandidates.map((p) => {
                      const isSel = p.student_id === selectedStudentId;
                      const streamData = CANDIDATE_STREAMS[p.student_id];
                      return (
                        <motion.div
                          key={`ribbon-${p.student_id}`}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setSelectedStudentId(p.student_id)}
                          className={`relative w-36 sm:w-44 aspect-video rounded-2xl overflow-hidden cursor-pointer shrink-0 shadow-sm transition-all border-0 ${
                            isSel ? 'ring-2 ring-purple-600 scale-[1.02]' : 'opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={streamData?.poster}
                            alt={p.student_name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-bold truncate">
                            {p.student_name}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── FLOATING BOTTOM MEETING CONTROL BAR (ZOOM / GOOGLE MEET STYLE) ── */}
          <div className="mt-3.5 flex items-center justify-center relative z-20">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="px-5 py-3 rounded-full bg-white/95 dark:bg-[#12182B]/95 backdrop-blur-2xl shadow-[0_15px_45px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-center gap-2.5 sm:gap-4 border-0"
            >
              {/* Mic Toggle */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`p-3 rounded-full transition-all cursor-pointer border-0 outline-none ${
                  isMicMuted
                    ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200'
                }`}
                title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </motion.button>

              {/* Invigilator Video Preview Toggle */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={toggleLocalCamera}
                className={`p-3 rounded-full transition-all cursor-pointer border-0 outline-none ${
                  useLocalCam
                    ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.5)]'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200'
                }`}
                title={useLocalCam ? 'Hide My Webcam' : 'Show My Webcam'}
              >
                <Camera className="w-4 h-4" />
              </motion.button>

              {/* View Mode Toggle */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setViewMode(viewMode === 'grid' ? 'spotlight' : 'grid')}
                className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-all cursor-pointer border-0 outline-none"
                title={viewMode === 'grid' ? 'Switch to Spotlight View' : 'Switch to Adaptive Grid'}
              >
                {viewMode === 'grid' ? <Columns className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
              </motion.button>

              {/* Participants Drawer Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  setSidebarTab('participants');
                  setShowSidePanel(true);
                  setMobileBottomSheet('participants');
                }}
                className="relative p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-all cursor-pointer border-0 outline-none"
                title="Participant Roster"
              >
                <Users className="w-4 h-4" />
                {activeCandidates.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    {activeCandidates.length}
                  </span>
                )}
              </motion.button>

              {/* Chat Toggle Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  setSidebarTab('chat');
                  setShowSidePanel(true);
                  setMobileBottomSheet('chat');
                }}
                className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-all cursor-pointer border-0 outline-none"
                title="Advisory Broadcast Chat"
              >
                <MessageSquare className="w-4 h-4" />
              </motion.button>

              {/* Invite / Share Quick Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleShareInvite}
                className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-all cursor-pointer border-0 outline-none"
                title="Invite Candidates (Share Code & QR)"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>

              {/* Fullscreen Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={toggleFullscreen}
                className="hidden sm:block p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-all cursor-pointer border-0 outline-none"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </motion.button>

              {/* Leave / End Examination Button (Prominent Soft Coral Pill) */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowEndExamModal(true)}
                className="ml-1 sm:ml-2 px-5 py-3 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-2 shadow-[0_8px_25px_rgba(225,29,72,0.35)]"
              >
                <PhoneOff className="w-4 h-4" />
                <span className="hidden sm:inline">Leave Supervision</span>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* ── RIGHT COLLAPSIBLE SUPERVISION PANEL (DESKTOP) ── */}
        <AnimatePresence>
          {showSidePanel && (
            <motion.aside
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              className="hidden lg:flex w-84 xl:w-96 rounded-[32px] bg-white/90 dark:bg-[#0E1424]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.5)] flex-col shrink-0 z-10 overflow-hidden border-0"
            >
              {/* Header Segmented Tabs */}
              <div className="p-3.5 pb-2">
                <div className="relative p-1 rounded-2xl bg-slate-200/70 dark:bg-[#161D2E] flex items-center shadow-inner">
                  <button
                    type="button"
                    onClick={() => setSidebarTab('participants')}
                    className="relative flex-1 py-2 rounded-xl text-xs font-bold transition-colors duration-200 cursor-pointer border-0 outline-none z-10 text-center"
                  >
                    {sidebarTab === 'participants' && (
                      <motion.div
                        layoutId="sidebarActiveTabIndicator"
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
                      Students ({activeCandidates.length})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSidebarTab('insights')}
                    className="relative flex-1 py-2 rounded-xl text-xs font-bold transition-colors duration-200 cursor-pointer border-0 outline-none z-10 text-center"
                  >
                    {sidebarTab === 'insights' && (
                      <motion.div
                        layoutId="sidebarActiveTabIndicator"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        className="absolute inset-0 rounded-xl bg-white dark:bg-[#222C44] shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                      />
                    )}
                    <span
                      className={`relative z-10 ${
                        sidebarTab === 'insights'
                          ? 'text-slate-900 dark:text-white font-extrabold'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      AI Insights
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSidebarTab('chat')}
                    className="relative flex-1 py-2 rounded-xl text-xs font-bold transition-colors duration-200 cursor-pointer border-0 outline-none z-10 text-center"
                  >
                    {sidebarTab === 'chat' && (
                      <motion.div
                        layoutId="sidebarActiveTabIndicator"
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
                      Chat
                    </span>
                  </button>
                </div>
              </div>

              {/* ── TAB 1: PARTICIPANTS ── */}
              {sidebarTab === 'participants' && (
                <div className="flex-1 flex flex-col min-h-0 px-4 pb-4 space-y-3">
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
                  <div className="relative flex items-center gap-1 p-1 rounded-2xl bg-slate-200/70 dark:bg-[#161D2E] overflow-x-auto scrollbar-none text-[11px] font-semibold">
                    {(['all', 'active', 'suspended', 'hand_raised', 'warned'] as const).map((f) => {
                      const isActive = studentFilter === f;
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setStudentFilter(f)}
                          className="relative px-3 py-1.5 rounded-xl capitalize transition-colors duration-200 cursor-pointer shrink-0 border-0 outline-none z-10"
                        >
                          {isActive && (
                            <motion.div
                              layoutId="examineeFilterActiveIndicator"
                              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                              className="absolute inset-0 rounded-xl bg-white dark:bg-purple-600 shadow-sm"
                            />
                          )}
                          <span
                            className={`relative z-10 ${
                              isActive
                                ? 'text-purple-900 dark:text-white font-extrabold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {f === 'hand_raised' ? 'Hand Raised' : f}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Candidate Cards List */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-4 scrollbar-none">
                    {filteredParticipants.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                          <Users className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">
                          No one is here right now
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-[200px]">
                          Share the exam code <strong>{displayCode}</strong> or QR code to invite candidates.
                        </p>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleShareInvite}
                          className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer border-0 outline-none"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Invite Candidates</span>
                        </motion.button>
                      </div>
                    ) : (
                      filteredParticipants.map((p) => {
                        const isSelected = p.student_id === selectedStudentId;
                        const streamData = CANDIDATE_STREAMS[p.student_id];
                        return (
                          <motion.div
                            key={p.student_id}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => {
                              setSelectedStudentId(p.student_id);
                              setDrawerStudent(p);
                            }}
                            className={`p-3 rounded-2xl cursor-pointer transition-all flex flex-col gap-2 border-0 outline-none ring-0 ${
                              isSelected
                                ? 'bg-purple-100/80 dark:bg-purple-950/60 shadow-md'
                                : 'bg-slate-50/90 hover:bg-slate-100 dark:bg-[#141B2D] dark:hover:bg-[#1B2338]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-xs">
                                <img
                                  src={streamData?.poster}
                                  alt={p.student_name}
                                  className="w-full h-full object-cover"
                                />
                                <span
                                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#141B2D] ${
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
                                  ) : null}
                                </div>
                                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                  {p.student_lce_code} • {p.questions_answered}/25 Qs
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

              {/* ── TAB 2: AI INSIGHTS & TELEMETRY ── */}
              {sidebarTab === 'insights' && (
                <div className="flex-1 flex flex-col min-h-0 p-4 space-y-3.5 overflow-y-auto scrollbar-none">
                  {/* Summary Metric Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 dark:from-purple-950/40 dark:to-indigo-950/40 border-0">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300 mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Proctoring Integrity Summary</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center mt-3">
                      <div className="p-2.5 rounded-xl bg-white/70 dark:bg-[#1A2236] shadow-xs">
                        <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                          {Math.round(
                            (activeCandidates.filter((c) => c.warning_count === 0 && !c.is_suspended).length /
                              (activeCandidates.length || 1)) *
                              100
                          )}
                          %
                        </span>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Integrity Index</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/70 dark:bg-[#1A2236] shadow-xs">
                        <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                          {activeCandidates.reduce((acc, c) => acc + (c.warning_count || 0), 0)}
                        </span>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Total Warnings</p>
                      </div>
                    </div>
                  </div>

                  {/* Realtime Event Stream */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Live Telemetry Stream
                    </span>
                    <div className="space-y-2">
                      {events.length > 0 ? (
                        events.slice(0, 8).map((evt) => (
                          <div
                            key={evt.id}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#141B2D] text-xs flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Activity className="w-3.5 h-3.5 text-purple-500" />
                              <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {evt.event_type.replace('_', ' ')}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {new Date(evt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-6">
                          Real-time telemetry events will stream here as students interact with their exams.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 3: ADVISORY CHAT ── */}
              {sidebarTab === 'chat' && (
                <div className="flex-1 flex flex-col min-h-0 p-4">
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-none mb-3">
                    {advisoryMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-2xl text-xs ${
                          msg.isTeacher
                            ? 'bg-purple-100/90 dark:bg-purple-950/70 ml-4'
                            : 'bg-slate-100 dark:bg-[#141B2D] mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-bold text-purple-700 dark:text-purple-300">{msg.sender}</span>
                          <span>{msg.time}</span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="relative flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendAdvisory()}
                      placeholder="Broadcast message to all students..."
                      className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-[#141B2D] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none border-0 shadow-xs"
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={handleSendAdvisory}
                      className="p-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white cursor-pointer border-0 outline-none shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ── MOBILE BOTTOM SHEET (FOR MOBILE MEETING EXPERIENCE) ── */}
      <AnimatePresence>
        {mobileBottomSheet !== 'none' && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="w-full max-h-[80vh] rounded-t-[32px] bg-white dark:bg-[#0E1424] p-5 flex flex-col shadow-2xl border-0"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-extrabold capitalize text-slate-900 dark:text-white">
                  {mobileBottomSheet}
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileBottomSheet('none')}
                  className="p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 cursor-pointer border-0 outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pt-3">
                {mobileBottomSheet === 'participants' && (
                  <div className="space-y-2">
                    {activeCandidates.map((p) => (
                      <div
                        key={p.student_id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-[#141B2D] flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{p.student_name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{p.student_lce_code}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setMobileBottomSheet('none');
                              setWarningModalStudent(p);
                            }}
                            className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold"
                          >
                            Warn
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMobileBottomSheet('none');
                              setSuspendModalStudent(p);
                            }}
                            className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold"
                          >
                            Suspend
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {mobileBottomSheet === 'chat' && (
                  <div className="flex flex-col h-72">
                    <div className="flex-1 overflow-y-auto space-y-2 pb-2">
                      {advisoryMessages.map((m) => (
                        <div key={m.id} className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#141B2D] text-xs">
                          <span className="font-bold text-purple-600 block text-[10px]">{m.sender}</span>
                          <span>{m.text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Broadcast message..."
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#141B2D] text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleSendAdvisory}
                        className="p-2 rounded-xl bg-purple-600 text-white"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODALS & INCIDENT MANAGEMENT (PRESERVED ARCHITECTURE) ── */}
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
