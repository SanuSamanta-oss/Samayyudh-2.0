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
  Mic,
  MicOff,
  ChevronRight,
  MoreVertical,
  Activity,
  ShieldCheck,
  Bot,
  Sliders,
  Volume2,
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
import { ProctorViewer, getCustomExamStreamSessionId } from '@/lib/proctoring/webrtc-service';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { ZoomMeetingView } from '@/components/zoom/ZoomMeetingView';

interface StudentLiveStreamFeedProps {
  examCode: string;
  studentId: string;
  studentName: string;
  studentLceCode?: string;
  isSuspended: boolean;
  isMini?: boolean;
}

function StudentLiveStreamFeed({
  examCode,
  studentId,
  studentName,
  studentLceCode,
  isSuspended,
  isMini = false,
}: StudentLiveStreamFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [fallbackFrame, setFallbackFrame] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'failed'>('connecting');
  const [isAudioMuted, setIsAudioMuted] = useState(isMini);

  useEffect(() => {
    if (isSuspended) return;

    const streamSessionId = getCustomExamStreamSessionId(examCode, studentId);
    const viewerId = `teacher_viewer_${Math.random().toString(36).substring(2, 7)}`;

    const viewer = new ProctorViewer(
      streamSessionId,
      viewerId,
      'teacher',
      (remoteStream) => {
        setStream(remoteStream);
        if (videoRef.current) {
          videoRef.current.srcObject = remoteStream;
          videoRef.current.play().catch(() => {});
        }
      },
      (status) => {
        setConnectionStatus(status);
      }
    );

    // Frame snapshot listener for instant zero-delay preview & NAT fallback
    viewer.onFrame((frameData) => {
      setFallbackFrame(frameData);
    });

    viewer.start();

    return () => {
      viewer.destroy();
    };
  }, [examCode, studentId, isSuspended]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

  const hasLiveVideo = Boolean(stream);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center select-none">
      {/* 1. Real WebRTC Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isAudioMuted}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          hasLiveVideo ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* 2. Fallback Canvas Frame Snapshot */}
      {!hasLiveVideo && fallbackFrame && (
        <img
          src={fallbackFrame}
          alt={studentName}
          className="absolute inset-0 w-full h-full object-cover z-5"
        />
      )}

      {/* 3. Placeholder Avatar when connecting / waiting */}
      {!hasLiveVideo && !fallbackFrame && (
        <div className="flex flex-col items-center justify-center text-center p-3 z-0">
          <div
            className={`${
              isMini ? 'w-10 h-10 text-xs' : 'w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl'
            } rounded-full bg-purple-600/25 text-purple-300 flex items-center justify-center font-black shadow-inner mb-2 border-0`}
          >
            {studentName.slice(0, 2).toUpperCase()}
          </div>
          <span className={`${isMini ? 'text-[11px]' : 'text-xs sm:text-sm'} font-bold text-white drop-shadow-sm`}>
            {studentName}
          </span>
          {studentLceCode && !isMini && (
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">{studentLceCode}</span>
          )}
          {!isMini && (
            <div className="flex items-center gap-1.5 text-[11px] text-purple-400 mt-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc] animate-pulse" />
              <span>Connecting live camera...</span>
            </div>
          )}
        </div>
      )}

      {/* Audio Mute/Unmute Quick Toggle on tile (only for full-size tiles with audio) */}
      {!isMini && hasLiveVideo && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsAudioMuted(!isAudioMuted);
          }}
          className={`absolute bottom-3 right-12 z-20 p-2 rounded-full backdrop-blur-md text-white transition-all border-0 outline-none cursor-pointer ${
            isAudioMuted ? 'bg-rose-600/80 hover:bg-rose-600' : 'bg-black/50 hover:bg-black/70'
          }`}
          title={isAudioMuted ? 'Click to Unmute Candidate Audio' : 'Click to Mute Candidate Audio'}
        >
          {isAudioMuted ? <MicOff className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
        </button>
      )}
    </div>
  );
}

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

  // ── Core Room State (Real Connected Students Only — ZERO Dummy Data) ──
  const [exam, setExam] = useState<CustomExam | null>(null);
  const [participants, setParticipants] = useState<CustomExamParticipant[]>([]);
  const [events, setEvents] = useState<ExamSupervisionEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Selection & Focus ──
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [drawerStudent, setDrawerStudent] = useState<CustomExamParticipant | null>(null);

  // ── View Mode: 'grid' (adaptive meeting wall) | 'spotlight' (focused speaker view) | 'zoom' (meeting SDK) ──
  const [viewMode, setViewMode] = useState<'grid' | 'spotlight' | 'zoom'>('grid');

  // ── Side Panels & Mobile Sheets ──
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'participants' | 'insights' | 'chat'>('participants');
  const [mobileSheet, setMobileSheet] = useState<'none' | 'participants' | 'waiting' | 'chat' | 'insights'>('none');

  // ── Filters & Search ──
  const [searchParticipant, setSearchParticipant] = useState('');
  const [studentFilter, setStudentFilter] = useState<'all' | 'active' | 'waiting' | 'suspended' | 'hand_raised' | 'warned'>('all');

  // ── Controls State ──
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [localCamStream, setLocalCamStream] = useState<MediaStream | null>(null);
  const [useLocalCam, setUseLocalCam] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const centerContainerRef = useRef<HTMLDivElement>(null);
  const centerVideoRef = useRef<HTMLVideoElement>(null);

  // ── Official Countdown Timer ──
  const [remainingSeconds, setRemainingSeconds] = useState(3600);

  // ── Notification Toast & Copy Feedback ──
  const [actionNotification, setActionNotification] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // ── Modals State ──
  const [warningModalStudent, setWarningModalStudent] = useState<CustomExamParticipant | null>(null);
  const [suspendModalStudent, setSuspendModalStudent] = useState<CustomExamParticipant | null>(null);
  const [timeModalStudent, setTimeModalStudent] = useState<CustomExamParticipant | null>(null);
  const [showEndExamModal, setShowEndExamModal] = useState(false);
  const [reportModalData, setReportModalData] = useState<CustomExamReport | null>(null);

  // ── Advisory Broadcast Messages ──
  const [chatInput, setChatInput] = useState('');
  const [advisoryMessages, setAdvisoryMessages] = useState<
    { id: string; sender: string; text: string; time: string; isTeacher?: boolean }[]
  >([
    {
      id: 'm1',
      sender: 'Supervision Engine',
      text: 'Examination supervision initialized. High-integrity proctoring active.',
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

  // Countdown clock tick
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

  // ── Fetch Room State (Real Connected Students Only) ──
  const activeExamCode = exam?.exam_code || initialCode || 'CE4821';

  const fetchRoomState = useCallback(async () => {
    try {
      const codeQuery = activeExamCode ? `?code=${encodeURIComponent(activeExamCode)}` : '';
      const res = await fetch(`/api/custom-exams/supervision/${examId}${codeQuery}`);
      if (res.ok) {
        const data = await res.json();
        setExam(data.exam);
        const liveParticipants: CustomExamParticipant[] = data.participants || [];
        setParticipants(liveParticipants);

        // Keep active selection in sync
        const admitted = liveParticipants.filter((p) => p.exam_status !== 'waiting');
        if (admitted.length > 0) {
          if (!selectedStudentId || !admitted.some((p) => p.student_id === selectedStudentId)) {
            setSelectedStudentId(admitted[0].student_id);
          }
        } else if (liveParticipants.length > 0) {
          setSelectedStudentId(liveParticipants[0].student_id);
        } else {
          setSelectedStudentId('');
        }

        setEvents(data.events || []);
      }
    } catch {
      // Retain state on transient network glitch
    } finally {
      setLoading(false);
    }
  }, [examId, activeExamCode, selectedStudentId]);

  useEffect(() => {
    fetchRoomState();
    const interval = setInterval(fetchRoomState, 1500); // 1.5s responsive polling interval
    return () => clearInterval(interval);
  }, [fetchRoomState]);

  // Real-time peer admission and join sync via Supabase Realtime Channel
  useEffect(() => {
    if (!isSupabaseConfigured || !activeExamCode) return;
    const supabase = createClient();
    const channelName = `custom_exam_${activeExamCode.toLowerCase()}`;
    const channel = supabase.channel(channelName);

    channel
      .on('broadcast', { event: 'student_joined' }, ({ payload }: { payload: any }) => {
        if (payload?.participant) {
          const pt = payload.participant as CustomExamParticipant;
          setParticipants((prev) => {
            const idx = prev.findIndex((x) => x.student_id === pt.student_id);
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = { ...updated[idx], ...pt };
              return updated;
            }
            return [...prev, pt];
          });
        }
      })
      .on('broadcast', { event: 'student_admitted' }, ({ payload }: { payload: any }) => {
        if (payload?.student_id) {
          setParticipants((prev) =>
            prev.map((x) =>
              payload.student_id === 'all' || x.student_id === payload.student_id
                ? { ...x, exam_status: 'in_progress' }
                : x
            )
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeExamCode]);

  // ── Local Webcam Preview Toggle ──
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
        console.warn('Webcam permission denied or unavailable:', err);
      }
    }
  };

  useEffect(() => {
    if (useLocalCam && localCamStream && centerVideoRef.current) {
      centerVideoRef.current.srcObject = localCamStream;
      centerVideoRef.current.play().catch(() => {});
    }
  }, [useLocalCam, localCamStream, selectedStudentId]);

  // ── Waiting Room Students vs Admitted Students ──
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
      ? `${window.location.origin}/join/${displayCode}`
      : `https://samayyudh-2-0.vercel.app/join/${displayCode}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(joinUrl)}`;

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
        setActionNotification(null);
      }, 3000);
    }
  };

  const handleShareInvite = () => {
    const inviteText = `Join examination "${exam?.title || 'Examination'}" on SAMAYYUDH.\nAccess Code: ${displayCode}\nJoin Link: ${joinUrl}`;
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

  // ── Examination Actions ──
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

  // ── Waiting Room Approvals ──
  const handleApproveStudent = async (student: CustomExamParticipant) => {
    // 1. Optimistically update local participant list immediately
    setParticipants((prev) =>
      prev.map((p) =>
        p.student_id === student.student_id ? { ...p, exam_status: 'in_progress' } : p
      )
    );
    setActionNotification(`Admitted ${student.student_name} to examination.`);
    setTimeout(() => setActionNotification(null), 3000);

    // 2. Broadcast via Supabase Realtime channel so student waiting room redirects in 0ms
    if (isSupabaseConfigured && activeExamCode) {
      try {
        const supabase = createClient();
        const ch = supabase.channel(`custom_exam_${activeExamCode.toLowerCase()}`);
        ch.subscribe((st: string) => {
          if (st === 'SUBSCRIBED') {
            ch.send({
              type: 'broadcast',
              event: 'student_admitted',
              payload: { student_id: student.student_id, exam_status: 'in_progress' },
            });
          }
        });
      } catch {}
    }

    // 3. Persist action to backend
    try {
      await fetch('/api/custom-exams/supervision/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: exam?.id || examId,
          student_id: student.student_id,
          action: 'approve',
          actor_role: isSuperAdmin ? 'admin' : 'teacher',
        }),
      });
      fetchRoomState();
    } catch {}
  };

  const handleApproveAll = async () => {
    // 1. Optimistically admit all waiting candidates immediately
    setParticipants((prev) =>
      prev.map((p) => (p.exam_status === 'waiting' ? { ...p, exam_status: 'in_progress' } : p))
    );
    setActionNotification('Admitted all waiting candidates!');
    setTimeout(() => setActionNotification(null), 3000);

    // 2. Broadcast admission signal to all waiting students
    if (isSupabaseConfigured && activeExamCode) {
      try {
        const supabase = createClient();
        const ch = supabase.channel(`custom_exam_${activeExamCode.toLowerCase()}`);
        ch.subscribe((st: string) => {
          if (st === 'SUBSCRIBED') {
            ch.send({
              type: 'broadcast',
              event: 'student_admitted',
              payload: { student_id: 'all', exam_status: 'in_progress' },
            });
          }
        });
      } catch {}
    }

    // 3. Persist action to backend
    try {
      await fetch('/api/custom-exams/supervision/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: exam?.id || examId,
          action: 'approve_all',
          actor_role: isSuperAdmin ? 'admin' : 'teacher',
        }),
      });
      fetchRoomState();
    } catch {}
  };

  // ── Disciplinary Interventions ──
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
        setActionNotification(`Warning issued to ${targetStudent.student_name}`);
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
    setActionNotification('Broadcast sent to all candidates.');
    setTimeout(() => setActionNotification(null), 3000);
  };

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

  const handleDownloadExcel = () => {
    const code = exam?.exam_code || initialCode || 'CE4821';
    window.open(`/api/custom-exams/${code}/export-excel`, '_blank');
  };

  // Filter participants for side panel
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

  const totalJoinedCount = activeCandidates.length;
  const activeCount = activeCandidates.filter((p) => p.exam_status === 'in_progress' && !p.is_suspended).length;
  const suspendedCount = activeCandidates.filter((p) => p.is_suspended).length;
  const handRaisedCount = activeCandidates.filter((p) => p.hand_raised).length;

  // Adaptive Grid columns based on participant count (Reference 1 style)
  const getAdaptiveGridClass = (count: number) => {
    if (count <= 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2';
    if (count <= 4) return 'grid-cols-1 sm:grid-cols-2';
    if (count <= 6) return 'grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4';
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER: INDIVIDUAL CANDIDATE TILE (ZOOM / MEETORA AESTHETIC)
  // ─────────────────────────────────────────────────────────────
  const renderParticipantTile = (p: CustomExamParticipant, isSpotlight = false) => {
    const isSelected = p.student_id === selectedStudentId;

    return (
      <motion.div
        key={p.id || p.student_id}
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onClick={() => setSelectedStudentId(p.student_id)}
        onDoubleClick={() => setDrawerStudent(p)}
        className={`group relative rounded-3xl overflow-hidden bg-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_14px_40px_rgba(0,0,0,0.6)] cursor-pointer flex flex-col justify-between transition-all duration-300 border-0 outline-none ring-0 select-none ${
          isSpotlight || activeCandidates.length === 1
            ? 'w-full h-full min-h-[340px] sm:min-h-[460px]'
            : 'aspect-video min-h-[160px]'
        } ${isSelected ? 'ring-2 ring-purple-500/80 shadow-[0_12px_45px_rgba(147,51,234,0.4)]' : ''}`}
      >
        {/* Live Proctoring Real Video & Audio Stream Feed */}
        <StudentLiveStreamFeed
          examCode={displayCode}
          studentId={p.student_id}
          studentName={p.student_name}
          studentLceCode={p.student_lce_code}
          isSuspended={p.is_suspended}
        />

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

        {/* Top Status Indicators */}
        <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-xs ${
                p.is_suspended ? 'bg-rose-600/90 text-white' : 'bg-black/45 text-white'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  p.is_suspended ? 'bg-white' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                }`}
              />
              <span>{p.is_suspended ? 'Suspended' : 'Live'}</span>
            </span>

            {/* Mic Indicator */}
            <span className="p-1.5 rounded-full bg-black/45 backdrop-blur-md text-emerald-400">
              <Mic className="w-3 h-3" />
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

        {/* If Suspended: Overlay Notice */}
        {p.is_suspended && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 text-center bg-rose-950/75 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/25 text-rose-300 flex items-center justify-center mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">Examination Suspended</h4>
            <p className="text-[11px] text-rose-200 mt-0.5 max-w-[200px] truncate">
              {p.suspended_reason || 'Flagged by supervisor'}
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

        {/* Bottom Floating Info & Quick Hover Actions */}
        <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md text-white text-xs font-semibold shadow-md">
            <span>{p.student_name}</span>
            <span className="text-[10px] text-slate-300 font-mono">({p.student_lce_code})</span>
          </div>

          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={(e) => {
                e.stopPropagation();
                setWarningModalStudent(p);
              }}
              className="p-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md cursor-pointer border-0 outline-none"
              title="Issue Warning"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
            </motion.button>

            {!p.is_suspended ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSuspendModalStudent(p);
                }}
                className="p-2 rounded-full bg-rose-500 hover:bg-rose-400 text-white shadow-md cursor-pointer border-0 outline-none"
                title="Suspend Student"
              >
                <Pause className="w-3.5 h-3.5" />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRestoreStudent(p);
                }}
                className="p-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-md cursor-pointer border-0 outline-none"
                title="Restore Student"
              >
                <Play className="w-3.5 h-3.5" />
              </motion.button>
            )}

            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
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
  // RENDER: EMPTY STATE & INVITATION (NO ONE IS HERE RIGHT NOW)
  // ─────────────────────────────────────────────────────────────
  const renderEmptyStage = () => {
    // If students are waiting for admission, display Waiting Room Queue prominently
    if (waitingStudents.length > 0) {
      return (
        <div className="flex-1 w-full rounded-[32px] overflow-hidden bg-white/90 dark:bg-[#0D1322]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.6)] flex flex-col p-6 sm:p-10 border-0 outline-none overflow-y-auto scrollbar-none">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Admission Queue Active
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Waiting Room ({waitingStudents.length} {waitingStudents.length === 1 ? 'candidate' : 'candidates'})
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Candidates have checked in and are waiting for your approval to enter the live examination.
              </p>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleApproveAll}
              className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer border-0 outline-none transition-all shrink-0"
            >
              <CheckCheck className="w-4 h-4 text-white" />
              <span>Approve All Candidates</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 my-6">
            {waitingStudents.map((student, idx) => (
              <motion.div
                key={student.id || `${student.student_id}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="p-4 rounded-2xl bg-slate-50/90 dark:bg-[#141B2D]/90 flex items-center justify-between gap-3 shadow-xs border-0 outline-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-sm flex items-center justify-center shrink-0">
                    <StudentLiveStreamFeed
                      examCode={displayCode}
                      studentId={student.student_id}
                      studentName={student.student_name}
                      studentLceCode={student.student_lce_code}
                      isSuspended={false}
                      isMini
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {student.student_name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {student.student_lce_code} • {new Date(student.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleApproveStudent(student)}
                  className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer border-0 outline-none transition-all shrink-0"
                >
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Approve</span>
                </motion.button>
              </motion.div>
            ))}
          </div>

          <div className="pt-4 mt-auto border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>More students can join with code <strong className="text-purple-600 dark:text-purple-400 font-mono text-sm">{displayCode}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyJoinLink}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-300 font-bold border-0 outline-none cursor-pointer"
              >
                {copiedLink ? 'Copied Link' : 'Copy Student Link'}
              </button>
              <button
                type="button"
                onClick={handleShareInvite}
                className="px-3.5 py-1.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 dark:text-purple-300 font-bold border-0 outline-none cursor-pointer"
              >
                Share Invite
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Default: Empty Room (No students connected yet)
    return (
      <div className="flex-1 w-full rounded-[32px] overflow-hidden bg-white/90 dark:bg-[#0D1322]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center p-6 sm:p-12 text-center relative border-0 outline-none">
        {/* Soft Ambient Meeting Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-500/10 dark:bg-purple-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          {/* Radar Badge */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold mb-6 shadow-xs border-0 outline-none">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-600 dark:bg-purple-400"></span>
            </span>
            <span className="tracking-wide">Supervision Stage Active • Waiting for candidates...</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            No one is here right now
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-8">
            Your supervision room is ready. Invite students to join the examination. Real-time video tiles will appear automatically as candidates check in.
          </p>

          {/* High-Fidelity QR Code Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-[28px] bg-slate-50/90 dark:bg-[#141B2D]/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] w-full max-w-md mb-8 border-0 outline-none"
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Universal Invitation Link
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono mt-0.5">
                  /join/{displayCode}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyJoinLink}
                  className="flex-1 py-2 px-3 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-900 dark:bg-purple-950/70 dark:hover:bg-purple-900/80 dark:text-purple-200 text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1.5 shadow-xs"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Join Link'}</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShareInvite}
                  className="py-2 px-3 rounded-full bg-slate-200/80 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1.5 shadow-xs"
                  title="Share invitation"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleShareInvite}
              className="px-6 py-2.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-900 dark:bg-purple-950/70 dark:hover:bg-purple-900/80 dark:text-purple-200 text-xs sm:text-sm font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-2 shadow-xs"
            >
              <Share2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Invite Students</span>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={fetchRoomState}
              className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-300 text-xs sm:text-sm font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-2 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Room</span>
            </motion.button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.25rem)] w-full select-none overflow-hidden bg-[#F4F7FB] dark:bg-[#090D1A] text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* ── TOP HEADER (MEETORA STYLE) ── */}
      <header className="h-16 px-4 sm:px-6 bg-white/90 dark:bg-[#111728]/90 backdrop-blur-2xl flex items-center justify-between shrink-0 z-20 shadow-[0_2px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.4)] border-0 outline-none">
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
                {exam?.title || 'Live Examination Supervision Room'}
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
                {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
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
                layoutId="viewModeIndicator"
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
                viewMode === 'grid'
                  ? 'text-purple-950 dark:text-white font-extrabold'
                  : 'text-slate-600 dark:text-slate-300'
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
                layoutId="viewModeIndicator"
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

          <button
            type="button"
            onClick={() => setViewMode('zoom')}
            className="relative flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 cursor-pointer border-0 outline-none z-10"
          >
            {viewMode === 'zoom' && (
              <motion.div
                layoutId="viewModeIndicator"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-full bg-white dark:bg-purple-600 shadow-[0_2px_10px_rgba(0,0,0,0.12)]"
              />
            )}
            <Video
              className={`w-3.5 h-3.5 relative z-10 transition-colors ${
                viewMode === 'zoom' ? 'text-purple-700 dark:text-white' : 'text-slate-500 dark:text-slate-400'
              }`}
            />
            <span
              className={`relative z-10 transition-colors ${
                viewMode === 'zoom'
                  ? 'text-purple-950 dark:text-white font-extrabold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Zoom Live Stream
            </span>
          </button>
        </div>

        {/* Right Header Status Badges & Quick Reports */}
        <div className="flex items-center gap-2.5">
          {exam?.status === 'waiting' && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleStartExam}
              className="px-4 py-2 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/80 dark:text-emerald-200 text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-1.5 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Start Exam</span>
            </motion.button>
          )}

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs border-0 outline-none">
            <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>{formatCountdown(remainingSeconds)}</span>
          </div>

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
        </div>
      </header>

      {/* ── MAIN WORKSPACE VIEWPORT ── */}
      <div className="flex-1 flex min-h-0 relative p-3 sm:p-4 gap-4">
        {/* CENTER COLUMN: MEETING STAGE */}
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

          {/* ── CENTRAL MEETING STAGE (ZOOM / MEETORA DOMINANT VIEW) ── */}
          <div
            ref={centerContainerRef}
            className="flex-1 flex flex-col min-h-0 relative rounded-[32px] overflow-hidden bg-white/70 dark:bg-[#0E1424]/70 backdrop-blur-xl shadow-[0_12px_45px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-3 sm:p-4 border-0 outline-none"
          >
            {/* Active stage banner when students are waiting in the admission lobby */}
            {waitingStudents.length > 0 && activeCandidates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 px-4 py-2.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 shadow-xs border-0 outline-none shrink-0"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>{waitingStudents.length} candidate{waitingStudents.length > 1 ? 's' : ''} in waiting room</span>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleApproveAll}
                    className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer border-0 outline-none transition-all"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-white" />
                    <span>Approve All Candidates</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {viewMode === 'zoom' ? (
              /* ZOOM MEETING SDK STAGE (TEACHER HOST) */
              <div className="flex-1 flex flex-col min-h-0 w-full h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-950 shadow-xl">
                <ZoomMeetingView
                  examId={examId}
                  role={1}
                  userName="Teacher Invigilator"
                  className="w-full h-full flex-1"
                />
              </div>
            ) : activeCandidates.length === 0 ? (
              renderEmptyStage()
            ) : viewMode === 'grid' ? (
              /* ADAPTIVE PARTICIPANT GRID (MEETORA / ZOOM STYLE) */
              <div
                className={`flex-1 grid ${getAdaptiveGridClass(
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

                {activeCandidates.length > 1 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none shrink-0">
                    {activeCandidates.map((p) => {
                      const isSel = p.student_id === selectedStudentId;
                      return (
                        <motion.div
                          key={`ribbon-${p.id || p.student_id}`}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setSelectedStudentId(p.student_id)}
                          className={`relative w-36 sm:w-44 aspect-video rounded-2xl overflow-hidden cursor-pointer shrink-0 shadow-sm transition-all border-0 outline-none bg-slate-900 flex items-center justify-center ${
                            isSel ? 'ring-2 ring-purple-600 scale-[1.02]' : 'opacity-80 hover:opacity-100'
                          }`}
                        >
                          <StudentLiveStreamFeed
                            examCode={displayCode}
                            studentId={p.student_id}
                            studentName={p.student_name}
                            isSuspended={p.is_suspended}
                            isMini={true}
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

          {/* ── FLOATING BOTTOM MEETING CONTROL BAR (MEETORA & ZOOM STYLE) ── */}
          <div className="mt-3.5 flex items-center justify-center relative z-20">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="px-5 py-3 rounded-full bg-white/95 dark:bg-[#111728]/95 backdrop-blur-2xl shadow-[0_15px_45px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-center gap-2.5 sm:gap-4 border-0 outline-none"
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
                    ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200'
                }`}
                title={useLocalCam ? 'Turn off camera' : 'Show teacher camera'}
              >
                {useLocalCam ? <Video className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
              </motion.button>

              {/* Chat Toggle */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  setSidebarTab('chat');
                  setShowSidePanel(true);
                  setMobileSheet('chat');
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

              {/* Leave / End Examination Button (Soft Rose Pill) */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowEndExamModal(true)}
                className="ml-1 sm:ml-2 px-5 py-2.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950/60 dark:hover:bg-rose-900/70 dark:text-rose-200 text-xs font-bold transition-all cursor-pointer border-0 outline-none ring-0 flex items-center gap-2 shadow-xs"
              >
                <PhoneOff className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span className="hidden sm:inline">Leave Supervision</span>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* ── RIGHT COLLAPSIBLE SUPERVISION PANEL (MEETORA DASHBOARD STYLE) ── */}
        <AnimatePresence>
          {showSidePanel && (
            <motion.aside
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              className="hidden lg:flex w-84 xl:w-96 rounded-[32px] bg-white/90 dark:bg-[#111728]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.5)] flex-col shrink-0 z-10 overflow-hidden border-0 outline-none"
            >
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
                        layoutId="sidebarTabHighlight"
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
                        layoutId="sidebarTabHighlight"
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
                        layoutId="sidebarTabHighlight"
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
                          className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer border-0 outline-none transition-all flex items-center gap-1 shadow-xs"
                        >
                          <CheckCheck className="w-3 h-3 text-white" />
                          <span>Approve All</span>
                        </button>
                      </div>

                      <div className="space-y-1.5 max-h-44 overflow-y-auto scrollbar-none">
                        {waitingStudents.map((s, idx) => (
                          <div
                            key={s.id || `${s.student_id}-${idx}`}
                            className="p-2.5 rounded-xl bg-white/90 dark:bg-[#141B2D]/90 flex items-center justify-between gap-2 shadow-xs border-0 outline-none"
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
                              className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-[10px] font-bold cursor-pointer border-0 outline-none transition-all flex items-center gap-1 shrink-0 shadow-xs"
                            >
                              <Check className="w-3 h-3 text-white" />
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
                              layoutId="examineeFilterHighlight"
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
                          className="px-4 py-2 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-900 dark:bg-purple-950/70 dark:hover:bg-purple-900/80 dark:text-purple-200 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer border-0 outline-none"
                        >
                          <Share2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                          <span>Invite Candidates</span>
                        </motion.button>
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
                                ? 'bg-purple-100/80 dark:bg-purple-950/60 shadow-md'
                                : 'bg-slate-50/90 hover:bg-slate-100 dark:bg-[#141B2D] dark:hover:bg-[#1B2338]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-full bg-purple-600/20 text-purple-400 font-bold text-xs flex items-center justify-center shrink-0">
                                {p.student_name.slice(0, 2).toUpperCase()}
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
                                className="flex-1 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 dark:text-amber-200 text-[11px] font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1 shadow-xs"
                              >
                                <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                <span>Warn</span>
                              </button>

                              {p.is_suspended ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRestoreStudent(p);
                                  }}
                                  className="flex-1 py-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-200 text-[11px] font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1 shadow-xs"
                                >
                                  <Play className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                  <span>Restore</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSuspendModalStudent(p);
                                  }}
                                  className="flex-1 py-1.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-900 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 dark:text-rose-200 text-[11px] font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1 shadow-xs"
                                >
                                  <Pause className="w-3 h-3 text-rose-600 dark:text-rose-400" />
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

              {/* ── TAB 2: AI INSIGHTS & TELEMETRY (MEETORA AI COMPONENT) ── */}
              {sidebarTab === 'insights' && (
                <div className="flex-1 flex flex-col min-h-0 p-4 space-y-3.5 overflow-y-auto scrollbar-none">
                  {/* Meetora AI Header Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-indigo-500/10 dark:from-purple-950/40 dark:to-indigo-950/40 border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>SamayYudh AI Proctoring</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                        Live Analyzing
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center mt-3">
                      <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#1A2236] shadow-xs">
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

                      <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#1A2236] shadow-xs">
                        <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                          {activeCandidates.reduce((acc, c) => acc + (c.warning_count || 0), 0)}
                        </span>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Total Warnings</p>
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Event Stream */}
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
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                              <span className="text-slate-700 dark:text-slate-300 font-medium capitalize">
                                {evt.event_type.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(evt.created_at || Date.now()).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-4">No security infractions recorded.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 3: BROADCAST ADVISORY CHAT ── */}
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

      {/* ── MOBILE APPLICATION EXPERIENCE (REFERENCE IMAGE 2 LAYOUT) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 dark:bg-[#0E1424]/95 backdrop-blur-2xl z-40 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-around shadow-2xl">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => toggleLocalCamera()}
          className="p-3 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200"
          title="Camera"
        >
          <Camera className="w-5 h-5" />
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsMicMuted(!isMicMuted)}
          className={`p-3.5 rounded-full shadow-md ${
            isMicMuted ? 'bg-rose-600 text-white' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
          }`}
          title="Microphone"
        >
          {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setMobileSheet('participants')}
          className="p-3 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 relative"
          title="Participants"
        >
          <Users className="w-5 h-5" />
          {waitingStudents.length > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setMobileSheet('chat')}
          className="p-3 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200"
          title="Chat"
        >
          <MessageSquare className="w-5 h-5" />
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowEndExamModal(true)}
          className="p-3 rounded-full bg-rose-600 text-white shadow-lg"
          title="Leave Supervision"
        >
          <PhoneOff className="w-5 h-5" />
        </motion.button>
      </div>

      {/* ── MOBILE BOTTOM SHEET (FOR PARTICIPANTS & CHAT) ── */}
      <AnimatePresence>
        {mobileSheet !== 'none' && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="w-full max-h-[85vh] rounded-t-[32px] bg-white dark:bg-[#0E1424] p-5 flex flex-col shadow-2xl border-0 outline-none"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-extrabold capitalize text-slate-900 dark:text-white">
                  {mobileSheet === 'participants' ? `Candidates (${totalJoinedCount})` : 'Advisory Broadcast'}
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileSheet('none')}
                  className="p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 cursor-pointer border-0 outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pt-3">
                {mobileSheet === 'participants' && (
                  <div className="space-y-3">
                    {waitingStudents.length > 0 && (
                      <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                            Waiting Room ({waitingStudents.length})
                          </span>
                          <button
                            type="button"
                            onClick={handleApproveAll}
                            className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer border-0 outline-none transition-all shadow-xs"
                          >
                            Approve All
                          </button>
                        </div>
                        {waitingStudents.map((s, idx) => (
                          <div
                            key={s.id || `${s.student_id}-${idx}`}
                            className="p-2.5 rounded-xl bg-white dark:bg-[#141B2D] flex items-center justify-between gap-2 shadow-xs border-0 outline-none"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{s.student_name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{s.student_lce_code}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleApproveStudent(s)}
                              className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer border-0 outline-none transition-all shadow-xs shrink-0"
                            >
                              Approve
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      {activeCandidates.map((p, idx) => (
                        <div
                          key={p.id || `${p.student_id}-${idx}`}
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
                                setMobileSheet('none');
                                setWarningModalStudent(p);
                              }}
                              className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold"
                            >
                              Warn
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setMobileSheet('none');
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
                  </div>
                )}

                {mobileSheet === 'chat' && (
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
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#141B2D] text-xs text-slate-900 dark:text-white"
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

      {/* ── SUPERVISION MODALS & INCIDENT MANAGEMENT ── */}
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
