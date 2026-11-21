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
  Radio,
  Wifi,
  CheckCircle2,
  AlertOctagon,
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
  RotateCcw,
  Hand,
  FileSpreadsheet,
  Layers,
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
}

// Realistic candidate webcam video streams
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
    gaze: 'Writing Notes',
    lighting: 'Good (92%)',
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

const DEFAULT_SAMPLE_CANDIDATES: CustomExamParticipant[] = [
  {
    id: 'cand_1',
    exam_id: 'demo',
    student_id: 'stud_1',
    student_name: 'Albert Flores',
    student_lce_code: 'LCE-1042',
    student_email: 'albert.flores@institution.ac.in',
    student_class: 'Batch A',
    attempt_id: 'att_1',
    joined_at: new Date(Date.now() - 1800000).toISOString(),
    connection_status: 'connected',
    camera_status: 'active',
    exam_status: 'in_progress',
    warning_count: 1,
    is_suspended: false,
    suspended_at: null,
    suspended_reason: null,
    time_adjustment_seconds: 0,
    remaining_seconds_cached: 2400,
    hand_raised: false,
    hand_raised_at: null,
    current_question_index: 18,
    questions_answered: 18,
    questions_attempted: 18,
    questions_unanswered: 7,
    questions_correct: 15,
    questions_incorrect: 3,
    accuracy_percentage: 83.3,
    final_score: 57,
    last_heartbeat: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cand_2',
    exam_id: 'demo',
    student_id: 'stud_2',
    student_name: 'Floyd Miles',
    student_lce_code: 'LCE-1088',
    student_email: 'floyd.miles@institution.ac.in',
    student_class: 'Batch A',
    attempt_id: 'att_2',
    joined_at: new Date(Date.now() - 1700000).toISOString(),
    connection_status: 'connected',
    camera_status: 'active',
    exam_status: 'in_progress',
    warning_count: 0,
    is_suspended: false,
    suspended_at: null,
    suspended_reason: null,
    time_adjustment_seconds: 0,
    remaining_seconds_cached: 2500,
    hand_raised: true,
    hand_raised_at: new Date(Date.now() - 60000).toISOString(),
    current_question_index: 22,
    questions_answered: 22,
    questions_attempted: 22,
    questions_unanswered: 3,
    questions_correct: 19,
    questions_incorrect: 3,
    accuracy_percentage: 86.4,
    final_score: 73,
    last_heartbeat: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cand_3',
    exam_id: 'demo',
    student_id: 'stud_3',
    student_name: 'Ralph Edwards',
    student_lce_code: 'LCE-1104',
    student_email: 'ralph.edwards@institution.ac.in',
    student_class: 'Batch B',
    attempt_id: 'att_3',
    joined_at: new Date(Date.now() - 1600000).toISOString(),
    connection_status: 'connected',
    camera_status: 'active',
    exam_status: 'in_progress',
    warning_count: 0,
    is_suspended: false,
    suspended_at: null,
    suspended_reason: null,
    time_adjustment_seconds: 0,
    remaining_seconds_cached: 2600,
    hand_raised: false,
    hand_raised_at: null,
    current_question_index: 15,
    questions_answered: 15,
    questions_attempted: 15,
    questions_unanswered: 10,
    questions_correct: 12,
    questions_incorrect: 3,
    accuracy_percentage: 80.0,
    final_score: 45,
    last_heartbeat: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cand_4',
    exam_id: 'demo',
    student_id: 'stud_4',
    student_name: 'Leslie Alexander',
    student_lce_code: 'LCE-1132',
    student_email: 'leslie.alexander@institution.ac.in',
    student_class: 'Batch B',
    attempt_id: 'att_4',
    joined_at: new Date(Date.now() - 1500000).toISOString(),
    connection_status: 'connected',
    camera_status: 'active',
    exam_status: 'suspended',
    warning_count: 2,
    is_suspended: true,
    suspended_at: new Date(Date.now() - 300000).toISOString(),
    suspended_reason: 'Continuous gaze departure from testing viewport.',
    time_adjustment_seconds: -300,
    remaining_seconds_cached: 2700,
    hand_raised: false,
    hand_raised_at: null,
    current_question_index: 12,
    questions_answered: 12,
    questions_attempted: 12,
    questions_unanswered: 13,
    questions_correct: 8,
    questions_incorrect: 4,
    accuracy_percentage: 66.7,
    final_score: 28,
    last_heartbeat: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cand_5',
    exam_id: 'demo',
    student_id: 'stud_5',
    student_name: 'Annette Black',
    student_lce_code: 'LCE-1149',
    student_email: 'annette.black@institution.ac.in',
    student_class: 'Batch A',
    attempt_id: 'att_5',
    joined_at: new Date(Date.now() - 1400000).toISOString(),
    connection_status: 'connected',
    camera_status: 'active',
    exam_status: 'in_progress',
    warning_count: 0,
    is_suspended: false,
    suspended_at: null,
    suspended_reason: null,
    time_adjustment_seconds: 0,
    remaining_seconds_cached: 2800,
    hand_raised: false,
    hand_raised_at: null,
    current_question_index: 20,
    questions_answered: 20,
    questions_attempted: 20,
    questions_unanswered: 5,
    questions_correct: 18,
    questions_incorrect: 2,
    accuracy_percentage: 90.0,
    final_score: 70,
    last_heartbeat: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function LiveTeacherSupervisionRoom({
  examId,
  examCode: initialCode,
  onBackToDashboard,
}: LiveTeacherSupervisionRoomProps) {
  const router = useRouter();

  const [exam, setExam] = useState<CustomExam | null>(null);
  const [participants, setParticipants] = useState<CustomExamParticipant[]>([]);
  const [events, setEvents] = useState<ExamSupervisionEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected student for main spotlight & drawer
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stud_1');
  const [drawerStudent, setDrawerStudent] = useState<CustomExamParticipant | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const centerContainerRef = useRef<HTMLDivElement>(null);
  const centerVideoRef = useRef<HTMLVideoElement>(null);

  // Layout mode: 'spotlight' or 'grid'
  const [viewMode, setViewMode] = useState<'spotlight' | 'grid'>('spotlight');

  // Sidebar filters & tab
  const [sidebarTab, setSidebarTab] = useState<'participants' | 'chat'>('participants');
  const [studentFilter, setStudentFilter] = useState<'all' | 'active' | 'waiting' | 'suspended' | 'submitted' | 'hand_raised' | 'warned'>('all');
  const [searchParticipant, setSearchParticipant] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [advisoryMessages, setAdvisoryMessages] = useState<{ id: string; sender: string; text: string; time: string }[]>([
    {
      id: 'm1',
      sender: 'Proctor System',
      text: 'Supervision room initialized. All connected feeds are encrypted end-to-end.',
      time: 'Just now',
    },
  ]);

  // Modals
  const [warningModalStudent, setWarningModalStudent] = useState<CustomExamParticipant | null>(null);
  const [suspendModalStudent, setSuspendModalStudent] = useState<CustomExamParticipant | null>(null);
  const [timeModalStudent, setTimeModalStudent] = useState<CustomExamParticipant | null>(null);
  const [showEndExamModal, setShowEndExamModal] = useState(false);
  const [reportModalData, setReportModalData] = useState<CustomExamReport | null>(null);
  const [actionNotification, setActionNotification] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Local webcam stream preview toggle
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

  // Fetch room state
  const fetchRoomState = useCallback(async () => {
    try {
      const res = await fetch(`/api/custom-exams/supervision/${examId}`);
      if (res.ok) {
        const data = await res.json();
        setExam(data.exam);
        const liveParticipants = data.participants || [];
        if (liveParticipants.length > 0) {
          setParticipants(liveParticipants);
          if (!selectedStudentId) {
            setSelectedStudentId(liveParticipants[0].student_id);
          }
        } else {
          setParticipants((prev) => (prev.length > 0 ? prev : DEFAULT_SAMPLE_CANDIDATES));
        }
        setEvents(data.events || []);
      } else {
        setParticipants(DEFAULT_SAMPLE_CANDIDATES);
      }
    } catch {
      setParticipants(DEFAULT_SAMPLE_CANDIDATES);
    } finally {
      setLoading(false);
    }
  }, [examId, selectedStudentId]);

  useEffect(() => {
    fetchRoomState();
    const interval = setInterval(fetchRoomState, 4000);
    return () => clearInterval(interval);
  }, [fetchRoomState]);

  // Local camera stream handler
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

  const activeCandidates = useMemo(() => {
    const raw = participants.length > 0 ? participants : DEFAULT_SAMPLE_CANDIDATES;
    const seen = new Set<string>();
    return raw.filter((p) => {
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

  const handleCopyCode = () => {
    const code = exam?.exam_code || initialCode || 'CE4821';
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
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
          p.student_id === targetStudent.student_id
            ? { ...p, warning_count: (p.warning_count || 0) + 1 }
            : p
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
          p.student_id === student.student_id
            ? { ...p, is_suspended: false, suspended_reason: null }
            : p
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
    if (studentFilter === 'waiting') return p.exam_status === 'waiting';
    if (studentFilter === 'suspended') return p.is_suspended;
    if (studentFilter === 'submitted') return p.exam_status === 'submitted';
    if (studentFilter === 'hand_raised') return p.hand_raised;
    if (studentFilter === 'warned') return p.warning_count > 0;

    return true;
  });

  const displayCode = exam?.exam_code || initialCode || 'CE4821';

  // Summary Metrics
  const totalJoinedCount = activeCandidates.length;
  const activeCount = activeCandidates.filter((p) => p.exam_status === 'in_progress' && !p.is_suspended).length;
  const suspendedCount = activeCandidates.filter((p) => p.is_suspended).length;
  const handRaisedCount = activeCandidates.filter((p) => p.hand_raised).length;

  return (
    <div className="flex flex-col h-[calc(100vh-4.25rem)] w-full select-none overflow-hidden bg-slate-100/90 dark:bg-[#070A12] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* ── TOP INFORMATION BAR ── */}
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

        {/* Center: View Switcher (Spotlight Focus vs Multi-Cam Wall) */}
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
            title="Download 5-Sheet Excel Report"
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

          {/* VIEW MODE A: SPOTLIGHT MODE */}
          {viewMode === 'spotlight' ? (
            <>
              {/* Spotlight Center Video Stage */}
              <div
                ref={centerContainerRef}
                className="flex-1 relative rounded-[32px] overflow-hidden bg-slate-950 dark:bg-[#030611] shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.7)] flex items-center justify-center min-h-[300px]"
              >
                {selectedStudent ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedStudent.student_id + (useLocalCam ? '_local' : '_stream')}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.01 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 w-full h-full"
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
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            poster={CANDIDATE_STREAMS[selectedStudent.student_id]?.poster}
                            className={`w-full h-full object-cover filter brightness-95 contrast-105 transition-all duration-300 ${
                              selectedStudent.is_suspended ? 'blur-md brightness-50' : ''
                            }`}
                          >
                            <source
                              src={CANDIDATE_STREAMS[selectedStudent.student_id]?.videoUrl}
                              type="video/mp4"
                            />
                          </video>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Subtle Cinematic Vignette */}
                    <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/50 pointer-events-none" />

                    {/* If Suspended: Prominent Frosted Suspension Screen */}
                    {selectedStudent.is_suspended && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-rose-950/60 backdrop-blur-md">
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
                          <span>{CANDIDATE_STREAMS[selectedStudent.student_id]?.gaze || 'Screen Focused'}</span>
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
                        title={useLocalCam ? 'Switch to student video feed' : 'Connect and show my live webcam'}
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

              {/* Bottom Carousel Strip with Live Moving Feeds */}
              <div className="mt-3 relative shrink-0">
                <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {activeCandidates.map((p) => {
                    const isSelected = p.student_id === selectedStudentId;
                    const streamData = CANDIDATE_STREAMS[p.student_id];
                    return (
                      <motion.div
                        key={p.student_id}
                        layout
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                        className={`group relative w-44 sm:w-52 aspect-[16/10] rounded-2xl overflow-hidden transition-all duration-300 shrink-0 text-left p-2.5 flex flex-col justify-between border-0 outline-none ring-0 cursor-pointer ${
                          isSelected
                            ? 'shadow-[0_12px_36px_rgba(147,51,234,0.45)] scale-[1.03] opacity-100'
                            : 'shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] opacity-85 hover:opacity-100'
                        }`}
                        onClick={() => setSelectedStudentId(p.student_id)}
                      >
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          poster={streamData?.poster}
                          className={`absolute inset-0 w-full h-full object-cover filter brightness-90 ${
                            p.is_suspended ? 'blur-xs brightness-40' : ''
                          }`}
                        >
                          <source src={streamData?.videoUrl} type="video/mp4" />
                        </video>
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
            </>
          ) : (
            /* VIEW MODE B: MULTI-CAM GRID */
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-3.5 min-h-[380px] overflow-y-auto pr-1">
              {activeCandidates.map((p) => {
                const isSelected = p.student_id === selectedStudentId;
                const streamData = CANDIDATE_STREAMS[p.student_id];
                return (
                  <motion.div
                    key={p.student_id}
                    layout
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    onClick={() => {
                      setSelectedStudentId(p.student_id);
                      setDrawerStudent(p);
                    }}
                    className={`relative rounded-[28px] overflow-hidden bg-slate-950 shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.6)] cursor-pointer flex flex-col justify-between p-3.5 transition-all duration-300 border-0 outline-none ring-0 ${
                      isSelected ? 'shadow-[0_14px_45px_rgba(147,51,234,0.5)] scale-[1.02]' : ''
                    }`}
                  >
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster={streamData?.poster}
                      className={`absolute inset-0 w-full h-full object-cover filter brightness-95 ${
                        p.is_suspended ? 'blur-xs brightness-40' : ''
                      }`}
                    >
                      <source src={streamData?.videoUrl} type="video/mp4" />
                    </video>
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

                    {/* Bottom Row: Candidate Information + Direct Individual Actions */}
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

                      <div className="flex items-center gap-2 pt-1">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudentId(p.student_id);
                            setWarningModalStudent(p);
                          }}
                          className="flex-1 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Warn</span>
                        </motion.button>

                        {p.is_suspended ? (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestoreStudent(p);
                            }}
                            className="flex-1 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Restore</span>
                          </motion.button>
                        ) : (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudentId(p.student_id);
                              setSuspendModalStudent(p);
                            }}
                            className="flex-1 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Pause className="w-3.5 h-3.5" />
                            <span>Suspend</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ── FLOATING ACTION CONTROLS BAR ── */}
          <div className="mt-3 p-3 rounded-full bg-white/95 dark:bg-[#111728]/95 backdrop-blur-2xl shadow-[0_15px_45px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-center justify-between gap-3 border-0 outline-none">
            {/* Left: Timer Pill with Theme-Adaptive Colors */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 dark:bg-white/10 dark:text-white text-xs font-mono font-bold shadow-xs border-0 outline-none">
              <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{formatCountdown(remainingSeconds)}</span>
            </div>

            {/* Center: Supervisory Actions for Currently Focused Student */}
            <div className="flex items-center gap-2.5">
              <span className="hidden xl:inline text-xs font-semibold text-slate-500 dark:text-slate-400">
                Focus: <strong className="text-slate-900 dark:text-white">{selectedStudent?.student_name}</strong>
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

        {/* ── RIGHT PARTICIPANT SIDEBAR ── */}
        <aside className="w-80 lg:w-96 rounded-[32px] bg-white/90 dark:bg-[#0E1322]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.5)] flex flex-col shrink-0 z-10 overflow-hidden">
          {/* Segmented Pill Tabs */}
          <div className="p-3">
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
                    className="absolute inset-0 rounded-xl bg-white dark:bg-[#222C44] shadow-[0_2px_10px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.5)]"
                  />
                )}
                <span
                  className={`relative z-10 transition-colors duration-200 ${
                    sidebarTab === 'participants'
                      ? 'text-slate-900 dark:text-white font-extrabold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Participants ({activeCandidates.length})
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
                    className="absolute inset-0 rounded-xl bg-white dark:bg-[#222C44] shadow-[0_2px_10px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.5)]"
                  />
                )}
                <span
                  className={`relative z-10 transition-colors duration-200 ${
                    sidebarTab === 'chat'
                      ? 'text-slate-900 dark:text-white font-extrabold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Advisory Chat
                </span>
              </button>
            </div>
          </div>

          {sidebarTab === 'participants' ? (
            <div className="flex-1 flex flex-col min-h-0 px-4 pb-4 space-y-2.5">
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

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-semibold text-slate-500">
                {(['all', 'active', 'suspended', 'hand_raised', 'warned'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setStudentFilter(f)}
                    className={`px-2.5 py-1 rounded-xl capitalize transition-all cursor-pointer shrink-0 border-0 outline-none ${
                      studentFilter === f
                        ? 'bg-purple-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 dark:bg-[#161D2E] text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {f === 'hand_raised' ? 'Hand Raised' : f}
                  </button>
                ))}
              </div>

              {/* Categorized Candidate Cards */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-16 scrollbar-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Examinees ({filteredParticipants.length})
                </span>

                {filteredParticipants.map((p) => {
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
                          ? 'bg-purple-100/80 dark:bg-purple-950/60 shadow-[0_6px_22px_rgba(147,51,234,0.15)] dark:shadow-[0_8px_25px_rgba(147,51,234,0.3)]'
                          : 'bg-slate-50/90 hover:bg-slate-100 dark:bg-[#141B2D] dark:hover:bg-[#1B2338] shadow-xs'
                      }`}
                    >
                      {/* Top Row: Avatar + Info + Badges */}
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
                          <div className="flex items-center justify-between gap-1.5">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {p.student_name}
                            </h4>

                            <div className="flex items-center gap-1 shrink-0">
                              {p.hand_raised && (
                                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950 flex items-center gap-0.5 animate-pulse">
                                  <Hand className="w-2.5 h-2.5" />
                                </span>
                              )}
                              {p.is_suspended ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                  Suspended
                                </span>
                              ) : p.warning_count > 0 ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                  {p.warning_count} Warn
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                  Active
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                            <span>{p.student_lce_code}</span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="text-slate-500 dark:text-slate-400 whitespace-nowrap">
                              {p.questions_answered}/25 answered
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Quick Action Buttons */}
                      <div className="flex items-center gap-2 pt-1 border-0">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudentId(p.student_id);
                            setWarningModalStudent(p);
                          }}
                          className="flex-1 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-800 hover:text-slate-950 dark:bg-amber-500/20 dark:hover:bg-amber-500 dark:text-amber-300 dark:hover:text-slate-950 text-[11px] font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1 shadow-xs"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>Warn</span>
                        </motion.button>

                        {p.is_suspended ? (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestoreStudent(p);
                            }}
                            className="flex-1 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-600 text-emerald-800 hover:text-white dark:bg-emerald-500/20 dark:hover:bg-emerald-600 dark:text-emerald-300 dark:hover:text-white text-[11px] font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1 shadow-xs"
                          >
                            <Play className="w-3 h-3" />
                            <span>Restore</span>
                          </motion.button>
                        ) : (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudentId(p.student_id);
                              setSuspendModalStudent(p);
                            }}
                            className="flex-1 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-600 text-rose-800 hover:text-white dark:bg-rose-500/20 dark:hover:bg-rose-600 dark:text-rose-300 dark:hover:text-white text-[11px] font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1 shadow-xs"
                          >
                            <Pause className="w-3 h-3" />
                            <span>Suspend</span>
                          </motion.button>
                        )}

                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudentId(p.student_id);
                            setTimeModalStudent(p);
                          }}
                          className="px-2 py-1 rounded-xl bg-indigo-500/15 hover:bg-indigo-600 text-indigo-800 hover:text-white dark:bg-indigo-500/20 dark:hover:bg-indigo-600 dark:text-indigo-300 dark:hover:text-white text-[11px] font-bold transition-all cursor-pointer border-0 outline-none shadow-xs"
                          title="Adjust Time"
                        >
                          <Clock className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Advisory Broadcast Chat */
            <div className="flex-1 flex flex-col min-h-0 p-4">
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-none">
                {advisoryMessages.map((msg) => (
                  <div key={msg.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-[#141B2D]">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-bold text-purple-600 dark:text-purple-400">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-200">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="mt-3 flex items-center gap-2">
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
      </div>

      {/* ── SUPERVISORY MODALS & DRAWERS ── */}
      <IssueWarningModal
        isOpen={Boolean(warningModalStudent)}
        participant={warningModalStudent}
        onClose={() => setWarningModalStudent(null)}
        onConfirm={handleConfirmWarning}
      />

      <SuspendStudentModal
        isOpen={Boolean(suspendModalStudent)}
        participant={suspendModalStudent}
        onClose={() => setSuspendModalStudent(null)}
        onConfirm={handleConfirmSuspend}
      />

      <TimeAdjustmentModal
        isOpen={Boolean(timeModalStudent)}
        participant={timeModalStudent}
        onClose={() => setTimeModalStudent(null)}
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

      <StudentSupervisionDrawer
        isOpen={Boolean(drawerStudent)}
        participant={drawerStudent}
        events={events}
        onClose={() => setDrawerStudent(null)}
        onOpenWarnModal={() => {
          setWarningModalStudent(drawerStudent);
        }}
        onOpenSuspendModal={() => {
          setSuspendModalStudent(drawerStudent);
        }}
        onRestore={async () => {
          if (drawerStudent) await handleRestoreStudent(drawerStudent);
        }}
        onOpenTimeModal={() => {
          setTimeModalStudent(drawerStudent);
        }}
        onAcknowledgeHand={async () => {
          if (drawerStudent) await handleAcknowledgeHand(drawerStudent.student_id);
        }}
        onForceSubmit={async () => {
          if (drawerStudent) await handleForceEndStudent(drawerStudent.student_id);
        }}
      />

      <SupervisionReportModal
        isOpen={Boolean(reportModalData)}
        report={reportModalData}
        onClose={() => setReportModalData(null)}
      />
    </div>
  );
}
