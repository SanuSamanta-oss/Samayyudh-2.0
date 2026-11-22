'use client';

import { useEffect, useState, useCallback, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ExamProvider, useExam } from '@/lib/store/exam-store';
import { ExamTimer } from '@/components/exam/ExamTimer';
import { QuestionCard } from '@/components/exam/QuestionCard';
import { AnswerEditor } from '@/components/exam/AnswerEditor';
import { QuestionNavigator } from '@/components/exam/QuestionNavigator';
import { StickyNote } from '@/components/exam/StickyNote';
import { NotesBoard } from '@/components/exam/NotesBoard';
import { MobileQuestionDrawer } from '@/components/exam/MobileQuestionDrawer';
import { PreExamCameraCheckModal } from '@/components/exam/proctoring/PreExamCameraCheckModal';
import { StudentProctoringBubble } from '@/components/exam/proctoring/StudentProctoringBubble';
import { ExamCalculator } from '@/components/exam/calculator/ExamCalculator';
import { useProctoringMonitor } from '@/hooks/useProctoringMonitor';
import { ProctorBroadcaster, getCustomExamStreamSessionId } from '@/lib/proctoring/webrtc-service';
import { questionBank, getQuestionsByExam } from '@/lib/questions';
import { convertPyqListToBattle } from '@/lib/pyq/battleAdapter';
import type { PyqQuestion } from '@/lib/pyq/types';
import * as localDB from '@/lib/store/local-db';
import { generateId, now, formatDuration } from '@/lib/utils';
import { OmnitrixLoader } from '@/components/OmnitrixLoader';
import { motion } from 'framer-motion';
import type { ExamSession, ExamMode, BoardNote, StickyNoteColor, Question } from '@/types';
import type { CustomExam, WarningLevel } from '@/types/custom-exam';
import { TeacherWarningOverlay } from '@/components/custom-exams/TeacherWarningOverlay';
import { ExamSuspensionOverlay } from '@/components/custom-exams/ExamSuspensionOverlay';
import {
  ChevronLeft, ChevronRight, Flag, Grid3X3, Send, Award,
  AlertTriangle, CheckCircle2, Calculator, Trophy, ShieldCheck, Radio, Hand
} from 'lucide-react';
import { cn } from '@/lib/utils';

function ExamSessionInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    state, initSession, goToQuestion, updateAnswer, updateStickyNote,
    flagQuestion, submitExam, currentQuestion, currentAnswer, currentStickyNote,
    getQuestionStatus, stats
  } = useExam();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showMilestone, setShowMilestone] = useState<string | null>(null);
  const [boardNotes, setBoardNotes] = useState<BoardNote[]>([]);

  // Live Remote Proctoring & Calculator State
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [showCameraCheck, setShowCameraCheck] = useState<boolean>(false);
  const [cameraVerified, setCameraVerified] = useState<boolean>(false);
  const [proctorSessionId, setProctorSessionId] = useState<string>('');
  const [proctorConfig, setProctorConfig] = useState<{
    live_video_enabled: boolean;
    parent_stream_enabled: boolean;
    calculator_enabled: boolean;
  }>({
    live_video_enabled: true,
    parent_stream_enabled: true,
    calculator_enabled: true,
  });
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const broadcasterRef = useRef<ProctorBroadcaster | null>(null);

  // Custom Exam Live Supervision States
  const [customExamInfo, setCustomExamInfo] = useState<{
    id: string;
    code: string;
    title: string;
    require_webcam: boolean;
  } | null>(null);
  const [isSuspended, setIsSuspended] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState<string | null>(null);
  const [suspendedAt, setSuspendedAt] = useState<string | null>(null);
  const [activeWarning, setActiveWarning] = useState<{
    id: string;
    level: WarningLevel;
    reason: string;
    note?: string;
    timestamp: string;
  } | null>(null);
  const [acknowledgedWarningIds, setAcknowledgedWarningIds] = useState<Set<string>>(new Set());
  const [isHandRaised, setIsHandRaised] = useState(false);

  const handleRaiseHand = async () => {
    if (!customExamInfo?.id) return;
    const studentId =
      state.session?.user_id ||
      (typeof window !== 'undefined' ? localStorage.getItem('sy_student_id') : null) ||
      'candidate_student';
    try {
      const res = await fetch('/api/custom-exams/hand-raise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: customExamInfo.id,
          student_id: studentId,
        }),
      });
      if (res.ok) {
        setIsHandRaised(true);
      }
    } catch {}
  };

  const { warningMessage, connectionQuality, dismissWarning } = useProctoringMonitor({
    sessionId: proctorSessionId || state.session?.id || '',
    examSessionId: state.session?.id || '',
    studentId: state.session?.user_id || '',
    stream: cameraStream,
    enabled: Boolean(proctorConfig.live_video_enabled && cameraVerified),
    currentQuestionIndex: state.currentQuestionIndex,
    questionsAnswered: stats.answered,
  });

  const hasCalculations = state.questions.some((q) => {
    const subj = (q.subject || '').toLowerCase();
    const qType = (q.question_type || '').toLowerCase();
    const text = (q.question_text || '').toLowerCase();
    return (
      subj.includes('math') ||
      subj.includes('physics') ||
      subj.includes('chem') ||
      subj.includes('engineer') ||
      qType === 'numerical' ||
      qType === 'integer' ||
      text.includes('calculate') ||
      text.includes('value of')
    );
  });
  const isCalculatorAllowed = proctorConfig.calculator_enabled;

  const handleCameraConfirmed = (stream: MediaStream) => {
    setCameraStream(stream);
    setCameraVerified(true);
    setShowCameraCheck(false);

    const customCode = searchParams.get('customExam') || searchParams.get('code');
    const storedStudentId = typeof window !== 'undefined' ? localStorage.getItem('sy_student_id') : null;
    const studentId =
      (storedStudentId && storedStudentId.trim()) ||
      (state.session?.user_id && state.session.user_id !== 'local-user' ? state.session.user_id : null) ||
      'candidate_student';
    const streamSessionId = customCode
      ? getCustomExamStreamSessionId(customCode, studentId)
      : (proctorSessionId || state.session?.id || 'session');

    if (broadcasterRef.current) {
      broadcasterRef.current.destroy();
    }
    const broadcaster = new ProctorBroadcaster(streamSessionId, studentId);
    broadcaster.setStream(stream);
    broadcaster.startSignaling();
    broadcaster.startSnapshotBroadcast(1500); // Continuous live snapshot fallback
    broadcasterRef.current = broadcaster;
  };

  // Auto-acquire camera if arriving from custom exam waiting room
  useEffect(() => {
    const customCode = searchParams.get('customExam') || searchParams.get('code');
    if (!customCode || cameraVerified) return;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: true,
        })
        .then((stream) => {
          handleCameraConfirmed(stream);
        })
        .catch(() => {
          navigator.mediaDevices
            .getUserMedia({
              video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
              audio: false,
            })
            .then((stream) => {
              handleCameraConfirmed(stream);
            })
            .catch(() => {
              // Permission check modal will appear if necessary
            });
        });
    }
  }, [searchParams, cameraVerified]);

  // Register / fetch proctoring session & config when exam session is initialized
  useEffect(() => {
    if (!state.session?.id) return;

    fetch('/api/proctoring/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        examSessionId: state.session.id,
        examCode: state.session.exam_code,
        examTitle: state.session.title || 'Examination',
        totalQuestions: state.questions.length,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.sessionId) {
          setProctorSessionId(data.sessionId);
        }
        if (data.config) {
          setProctorConfig(data.config);
          if (data.config.live_video_enabled && !cameraVerified) {
            setShowCameraCheck(true);
          }
        }

        // Notify linked guardians that examination has commenced
        if (state.session?.user_id) {
          fetch('/api/proctoring/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentId: state.session.user_id,
              eventType: 'exam_started',
              examTitle: state.session.title || 'Examination',
            }),
          }).catch(() => {});
        }
      })
      .catch(() => {});
  }, [state.session?.id, state.session?.exam_code, state.session?.title, state.questions.length, cameraVerified]);

  // Clean up WebRTC broadcaster and camera tracks when leaving or completing
  useEffect(() => {
    return () => {
      if (broadcasterRef.current) {
        broadcasterRef.current.destroy();
        broadcasterRef.current = null;
      }
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [cameraStream]);

  // Load saved notes for session from IndexedDB
  useEffect(() => {
    if (!state.session?.id) return;
    localDB.getStickyNotesBySession(state.session.id).then((saved) => {
      if (saved && saved.length > 0) {
        const mapped: BoardNote[] = saved
          .filter((n) => n.content && n.content.trim().length > 0)
          .map((n) => ({
            id: n.id,
            session_id: n.session_id,
            question_id: n.question_id,
            question_index: n.question_index ?? 0,
            question_number: n.question_number ?? (n.question_index !== undefined ? n.question_index + 1 : 1),
            content: n.content,
            color: n.color ?? 'yellow',
            is_pinned: n.is_pinned !== false,
            position_x: n.position_x,
            position_y: n.position_y,
            pinned_at: n.created_at,
            updated_at: n.updated_at,
          }));
        setBoardNotes(mapped);
      }
    });
  }, [state.session?.id]);

  const handlePin = (content: string, color: StickyNoteColor) => {
    if (!currentQuestion || !state.session) return;
    const noteId = currentStickyNote?.id || generateId();
    const qIndex = state.currentQuestionIndex;
    const qNumber = qIndex + 1;
    const timestamp = now();

    const newBoardNote: BoardNote = {
      id: noteId,
      session_id: state.session.id,
      question_id: currentQuestion.id,
      question_index: qIndex,
      question_number: qNumber,
      content,
      color,
      is_pinned: true,
      pinned_at: timestamp,
      updated_at: timestamp,
    };

    setBoardNotes((prev) => {
      const filtered = prev.filter((n) => n.question_id !== currentQuestion.id);
      return [...filtered, newBoardNote];
    });

    // Save to IndexedDB
    localDB.saveStickyNote({
      id: noteId,
      user_id: state.session.user_id || 'local',
      session_id: state.session.id,
      question_id: currentQuestion.id,
      question_index: qIndex,
      question_number: qNumber,
      exam_name: state.session.title || 'Exam',
      category: state.session.exam_code || 'Practice',
      content,
      color,
      is_pinned: true,
      created_at: timestamp,
      updated_at: timestamp,
    });
  };

  const handleDeleteBoardNote = (id: string) => {
    setBoardNotes((prev) => prev.filter((n) => n.id !== id));
    localDB.deleteStickyNote(id);
  };

  const handleBoardNoteColorChange = (id: string, color: StickyNoteColor) => {
    setBoardNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const updated = { ...n, color, updated_at: now() };
          localDB.saveStickyNote({
            id: n.id,
            user_id: state.session?.user_id || 'local',
            session_id: n.session_id,
            question_id: n.question_id,
            question_index: n.question_index,
            question_number: n.question_number,
            exam_name: state.session?.title,
            content: n.content,
            color,
            is_pinned: n.is_pinned,
            position_x: n.position_x,
            position_y: n.position_y,
            created_at: n.pinned_at,
            updated_at: now(),
          });
          return updated;
        }
        return n;
      })
    );
  };

  const handlePositionChange = (id: string, x: number, y: number) => {
    setBoardNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const updated = { ...n, position_x: x, position_y: y, updated_at: now() };
          localDB.saveStickyNote({
            id: n.id,
            user_id: state.session?.user_id || 'local',
            session_id: n.session_id,
            question_id: n.question_id,
            question_index: n.question_index,
            question_number: n.question_number,
            exam_name: state.session?.title,
            content: n.content,
            color: n.color,
            is_pinned: n.is_pinned,
            position_x: x,
            position_y: y,
            created_at: n.pinned_at,
            updated_at: now(),
          });
          return updated;
        }
        return n;
      })
    );
  };

  // Initialize session from URL params
  useEffect(() => {
    if (state.session) return; // Already initialized

    const customExamCode = searchParams.get('customExam') || searchParams.get('code');
    if (customExamCode) {
      fetch(`/api/custom-exams/${encodeURIComponent(customExamCode)}`)
        .then((res) => res.json())
        .then(async (data) => {
          if (data.exam) {
            const ex = data.exam as CustomExam;
            setCustomExamInfo({
              id: ex.id,
              code: ex.exam_code,
              title: ex.title,
              require_webcam: Boolean(ex.supervision_enabled),
            });
            if (ex.supervision_enabled) {
              setProctorConfig((prev) => ({ ...prev, live_video_enabled: true }));
              setShowCameraCheck(true);
            }

            // Map custom questions if available, or fetch matching subject questions
            let examQuestions: Question[] = [];
            const questionsList = ex.selected_questions || [];
            if (questionsList.length > 0) {
              examQuestions = questionsList.map((q: any, i: number) => ({
                id: q.id || `custom_q_${i + 1}`,
                question_number: i + 1,
                question_text: q.question_text || q.text || '',
                exam_category: 'CUSTOM',
                exam_code: ex.exam_code,
                subject: q.subject || (ex.subjects && ex.subjects[0]) || 'General',
                topic: q.topic || 'General',
                question_type: (q.question_type || 'multiple_choice'),
                marks: q.marks || 4,
                difficulty: (q.difficulty || 'medium'),
                recommended_minutes: 2,
                expected_points: q.expected_points || [],
                keywords: q.keywords || [],
                model_answer: q.model_answer || '',
                evaluation_rubric: q.evaluation_rubric || '',
                options: q.options || [],
                correct_answer: q.correct_answer || '',
                created_at: now(),
                updated_at: now(),
              }));
            } else {
              const subjects = ex.subjects || [];
              const matched = questionBank.filter((q) =>
                subjects.some((s) => (q.subject || '').toLowerCase().includes(s.toLowerCase()))
              );
              examQuestions = matched.length >= 5 ? matched.slice(0, 20) : questionBank.slice(0, 15);
            }

            const startTime = now();
            const examDurationSeconds = (ex.duration_minutes || 60) * 60;
            const endTime = new Date(Date.now() + examDurationSeconds * 1000).toISOString();

            const activeStudentId =
              (typeof window !== 'undefined' ? localStorage.getItem('sy_student_id') : null) || 'local-user';

            const session: ExamSession = {
              id: generateId(),
              user_id: activeStudentId,
              title: ex.title,
              exam_code: ex.exam_code,
              mode: 'custom',
              status: 'in_progress',
              total_questions: examQuestions.length,
              total_marks: ex.total_marks || examQuestions.reduce((sum, q) => sum + q.marks, 0),
              duration_seconds: examDurationSeconds,
              started_at: startTime,
              ends_at: endTime,
              completed_at: null,
              current_question_index: 0,
              evaluation_status: 'not_started',
              created_at: startTime,
            };

            await initSession(session, examQuestions);
            return;
          }
        })
        .catch((err) => {
          console.warn('Failed to load custom exam session by code:', err);
        });
      return;
    }

    const mode = (searchParams.get('mode') || 'quick_battle') as ExamMode;
    const questionCount = Number(searchParams.get('questions') || 10);
    const duration = Number(searchParams.get('duration') || 3600);
    const resumeId = searchParams.get('resume') || searchParams.get('session');

    const requestedExam = searchParams.get('exam') || 'NEET';
    const isPyqSource =
      searchParams.get('source') === 'pyq' ||
      requestedExam.toUpperCase() === 'JEE_MAIN_2025' ||
      requestedExam.toUpperCase() === 'JEE_MAINS_PYQ' ||
      requestedExam.toUpperCase() === 'ENGINEERING_ENTRANCE' ||
      requestedExam.toUpperCase() === 'JEE_MAINS' ||
      requestedExam.toUpperCase() === 'JEE' ||
      (requestedExam.toUpperCase().includes('JEE') && (searchParams.get('year') === '2025' || searchParams.get('pyq') === 'true'));

    localDB.getAllCustomQuestions().then(async (customQs) => {
      let pyqConvertedQs: Question[] = [];
      if (isPyqSource) {
        try {
          const subjectParam = searchParams.get('subject') || 'All';
          const dateParam = searchParams.get('date') || 'All';
          const shiftParam = searchParams.get('shift') || 'All';
          const res = await fetch(
            `/api/pyq/questions?pageSize=100&subject=${encodeURIComponent(subjectParam)}&date=${encodeURIComponent(dateParam)}&shift=${encodeURIComponent(shiftParam)}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data.questions && data.questions.length > 0) {
              pyqConvertedQs = convertPyqListToBattle(data.questions as PyqQuestion[]);
            }
          }
        } catch (err) {
          console.error('Error fetching PYQ questions for battle:', err);
        }
      }

      // Strictly isolate questions by the requested exam (NEET, GATE, JEE, etc.)
      const examSpecific = pyqConvertedQs.length > 0 ? pyqConvertedQs : getQuestionsByExam(requestedExam);
      const customForExam = customQs.filter(q => 
        q.exam_code?.toUpperCase() === requestedExam.toUpperCase() ||
        q.exam_category?.toUpperCase() === requestedExam.toUpperCase()
      );
      
      const allQuestions = examSpecific.length > 0 
        ? [...examSpecific, ...customForExam]
        : [...questionBank.filter(q => q.exam_code?.toUpperCase() === requestedExam.toUpperCase() || q.exam_category?.toUpperCase() === requestedExam.toUpperCase()), ...customQs];

      // 1. If explicit resume requested:
      if (resumeId) {
        const existing = await localDB.getSession(resumeId);
        if (existing && existing.status === 'in_progress') {
          const savedAnswers = await localDB.getAnswersBySession(existing.id);
          const answerQIds = new Set(savedAnswers.map(a => a.question_id));
          const matched = allQuestions.filter(q => answerQIds.has(q.id));
          const remaining = allQuestions.filter(q => !answerQIds.has(q.id));
          const needed = Math.max(0, existing.total_questions - matched.length);
          const selected = [...matched, ...remaining.slice(0, needed)];
          await initSession(existing, selected);
          return;
        }
      }

      // 2. Prevent duplicate ghost sessions on quick reload/re-entry:
      const allSessions = await localDB.getAllSessions();
      const recentEmptyDraft = allSessions.find(s => 
        s.status === 'in_progress' && 
        s.mode === mode &&
        s.exam_code?.toUpperCase() === requestedExam.toUpperCase() &&
        (Date.now() - new Date(s.started_at).getTime()) < 10 * 60 * 1000
      );

      if (recentEmptyDraft) {
        const answers = await localDB.getAnswersBySession(recentEmptyDraft.id);
        const hasAnswers = answers.some(a => a.answer_text.trim());
        if (!hasAnswers) {
          // Reuse this draft session instead of creating another duplicate
          const selected = (mode === 'full_century' || recentEmptyDraft.total_questions >= allQuestions.length)
            ? [...allQuestions].sort((a, b) => a.question_number - b.question_number).slice(0, Math.min(recentEmptyDraft.total_questions, allQuestions.length))
            : [...allQuestions].sort(() => Math.random() - 0.5).slice(0, Math.min(recentEmptyDraft.total_questions, allQuestions.length));
          await initSession(recentEmptyDraft, selected);
          return;
        }
      }

      // 3. Otherwise, create a clean new session
      const selected = (mode === 'full_century' || questionCount >= allQuestions.length)
        ? [...allQuestions].sort((a, b) => a.question_number - b.question_number).slice(0, questionCount)
        : [...allQuestions].sort(() => Math.random() - 0.5).slice(0, Math.min(questionCount, allQuestions.length));

      const startTime = now();
      const endTime = new Date(Date.now() + duration * 1000).toISOString();

      const session: ExamSession = {
        id: generateId(),
        user_id: 'local-user',
        title: `${mode.replace(/_/g, ' ')} — ${new Date().toLocaleDateString()}`,
        exam_code: requestedExam,
        mode,
        status: 'in_progress',
        total_questions: selected.length,
        total_marks: selected.reduce((sum, q) => sum + q.marks, 0),
        duration_seconds: duration,
        started_at: startTime,
        ends_at: endTime,
        completed_at: null,
        current_question_index: 0,
        evaluation_status: 'not_started',
        created_at: startTime,
      };

      await initSession(session, selected);
    });
  }, [searchParams, state.session, initSession]);

  const handleTimeUp = useCallback(() => {
    // Time up — preserve everything, allow review
  }, []);

  const handlePrev = useCallback(() => {
    goToQuestion(state.currentQuestionIndex - 1);
  }, [goToQuestion, state.currentQuestionIndex]);

  const handleNext = useCallback(() => {
    // Check milestones
    const nextIdx = state.currentQuestionIndex + 1;
    if (nextIdx === 50 && state.questions.length >= 50) {
      setShowMilestone('half_century');
      setTimeout(() => setShowMilestone(null), 3000);
    }
    if (nextIdx === 100 && state.questions.length >= 100) {
      setShowMilestone('century');
      setTimeout(() => setShowMilestone(null), 3000);
    }
    goToQuestion(nextIdx);
  }, [goToQuestion, state.currentQuestionIndex, state.questions.length]);

  const handleSubmit = useCallback(async () => {
    // Notify linked guardians that examination has been submitted
    if (state.session?.user_id) {
      fetch('/api/proctoring/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: state.session.user_id,
          eventType: 'exam_submitted',
          examTitle: state.session.title || 'Examination',
        }),
      }).catch(() => {});
    }

    await submitExam();
    setShowSubmitDialog(false);
    router.push('/results?session=' + state.session?.id);
  }, [submitExam, router, state.session?.id, state.session?.user_id, state.session?.title]);

  // Warn before leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.session?.status === 'in_progress') {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.session?.status]);

  // Live Supervision Polling for Custom Exam
  useEffect(() => {
    if (!customExamInfo?.id) return;
    const studentId = state.session?.user_id || 'local-user';

    const checkStatus = async () => {
      try {
        const res = await fetch(
          `/api/custom-exams/student-status?exam_id=${customExamInfo.id}&student_id=${studentId}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.participant) {
          if (data.participant.is_suspended) {
            setIsSuspended(true);
            setSuspensionReason(data.participant.suspended_reason || 'Suspended by proctor.');
            setSuspendedAt(data.participant.suspended_at || null);
          } else {
            setIsSuspended(false);
            setSuspensionReason(null);
            setSuspendedAt(null);
          }

          if (data.participant.exam_status === 'submitted' && state.session?.status === 'in_progress') {
            handleSubmit();
          }
        }

        if (data.latestEvent && data.latestEvent.event_type === 'warning') {
          const evtId = data.latestEvent.id;
          if (!acknowledgedWarningIds.has(evtId)) {
            setActiveWarning({
              id: evtId,
              level: data.latestEvent.warning_level || 'first',
              reason: data.latestEvent.reason || 'Flagged by supervisor',
              note: data.latestEvent.description,
              timestamp: new Date(data.latestEvent.created_at).toLocaleTimeString(),
            });
          }
        }
      } catch {}
    };

    checkStatus();
    const statusInterval = setInterval(checkStatus, 3000);
    return () => clearInterval(statusInterval);
  }, [customExamInfo?.id, state.session?.user_id, state.session?.status, acknowledgedWarningIds, handleSubmit]);

  // Student Heartbeat Dispatcher for Live Supervisor
  useEffect(() => {
    if (!customExamInfo?.id) return;
    const studentId = state.session?.user_id || 'local-user';

    const sendHeartbeat = async () => {
      try {
        await fetch('/api/custom-exams/student-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exam_id: customExamInfo.id,
            student_id: studentId,
            updates: {
              camera_active: Boolean(cameraStream && cameraVerified),
              connection_quality: connectionQuality,
              questions_answered: stats.answered,
              current_question_index: state.currentQuestionIndex,
            },
          }),
        });
      } catch {}
    };

    sendHeartbeat();
    const hbInterval = setInterval(sendHeartbeat, 5000);
    return () => clearInterval(hbInterval);
  }, [
    customExamInfo?.id,
    state.session?.user_id,
    cameraStream,
    cameraVerified,
    connectionQuality,
    stats.answered,
    state.currentQuestionIndex,
  ]);

  if (!state.session || !currentQuestion) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
        <OmnitrixLoader text="PREPARING YOUR BATTLE..." />
      </div>
    );
  }

  const questionIds = state.questions.map(q => q.id);
  const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Milestone Overlay */}
      {showMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="text-center space-y-4 animate-bounce">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)]">
              {showMilestone === 'half_century' ? (
                <Award className="w-10 h-10" />
              ) : (
                <Trophy className="w-10 h-10" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-white">
              {showMilestone === 'half_century' ? 'HALF CENTURY' : 'CENTURY'}
            </h2>
            <p className="text-white/80">{stats.answered} questions answered</p>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className="sticky top-0 z-20 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-3 md:px-6 flex items-center justify-between h-14 gap-3">
          {/* Left: Title + Progress */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-sm font-semibold text-gradient-brand hidden sm:block">সময়যুদ্ধ</span>
            {customExamInfo && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold shadow-xs">
                <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>Supervised ({customExamInfo.code})</span>
              </div>
            )}
            <div className="text-xs text-stone-500 hidden md:block">
              <span className="font-medium text-foreground">{stats.answered}</span>/{stats.total} answered
            </div>
            {/* Progress bar */}
            <div className="hidden md:block w-24 h-1.5 rounded-full bg-stone-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-brand transition-all duration-500"
                style={{ width: `${(stats.answered / stats.total) * 100}%` }}
              />
            </div>
          </div>

          {/* Center: Marks */}
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Award className="w-4 h-4 text-brand-600" />
            <span><strong className="text-foreground">{state.session.total_marks}</strong> marks</span>
          </div>

          {/* Right: Timer + Actions */}
          <div className="flex items-center gap-2">
            {isCalculatorAllowed && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.94, y: 1 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => setShowCalculator((prev) => !prev)}
                className={cn(
                  'group relative flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border-0 outline-none select-none shadow-sm',
                  showCalculator
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_4px_20px_rgba(147,51,234,0.4)]'
                    : 'bg-white hover:bg-purple-50 text-slate-800 hover:text-purple-700 shadow-[0_2px_10px_rgba(0,0,0,0.08)] dark:bg-[#1E293B] dark:hover:bg-[#28354D] dark:text-white dark:shadow-[0_4px_16px_rgba(0,0,0,0.45)]'
                )}
                title={showCalculator ? 'Hide Exam Calculator' : 'Open Exam Calculator'}
              >
                {/* Ambient Glow Aura when Active */}
                {showCalculator && (
                  <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 blur-sm opacity-50 pointer-events-none -z-10 animate-pulse" />
                )}

                {/* Inner Icon Bubble with Micro-scale */}
                <span
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0',
                    showCalculator
                      ? 'bg-white/20 text-white'
                      : 'bg-purple-100 text-purple-600 dark:bg-purple-600/30 dark:text-purple-300 group-hover:bg-purple-200 dark:group-hover:bg-purple-600/50'
                  )}
                >
                  <Calculator className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                </span>

                <span className="tracking-tight text-xs font-bold">Calc</span>

                {/* Subtle Live Status Indicator Dot */}
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-colors shrink-0',
                    showCalculator
                      ? 'bg-emerald-300 shadow-[0_0_6px_#6ee7b7] animate-pulse'
                      : 'bg-slate-300 dark:bg-slate-500 group-hover:bg-purple-400'
                  )}
                />
              </motion.button>
            )}
            {customExamInfo && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.94, y: 1 }}
                onClick={handleRaiseHand}
                className={cn(
                  'group relative flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border-0 outline-none select-none shadow-sm',
                  isHandRaised
                    ? 'bg-amber-500 text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.4)]'
                    : 'bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-700 dark:bg-[#1E293B] dark:hover:bg-[#28354D] dark:text-white'
                )}
                title={isHandRaised ? 'Hand raised — Proctor notified' : 'Raise hand for proctor attention'}
              >
                <Hand className={cn('w-3.5 h-3.5', isHandRaised ? 'text-slate-950 animate-bounce' : 'text-amber-500')} />
                <span className="hidden sm:inline">{isHandRaised ? 'Hand Raised' : 'Raise Hand'}</span>
              </motion.button>
            )}
            <ExamTimer endsAt={state.session.ends_at} onTimeUp={handleTimeUp} isPaused={isSuspended} />
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden p-2 rounded-lg border border-border hover:bg-stone-50"
              aria-label="Question navigator"
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div
        className={cn(
          'flex-1 max-w-7xl mx-auto w-full px-3 md:px-6 py-4 md:py-6 transition-all duration-300',
          isSuspended && 'pointer-events-none select-none blur-[2px] opacity-60'
        )}
      >
        <div className="flex gap-6">
          {/* Left: Question + Answer */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Question */}
            <QuestionCard
              question={currentQuestion}
              answer={currentAnswer}
              questionIndex={state.currentQuestionIndex}
              totalQuestions={state.questions.length}
            />

            {/* Answer Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-foreground">Your Answer</h3>
                <div className="flex items-center gap-2">
                  <StickyNote
                    content={currentStickyNote?.content || ''}
                    onChange={(c) =>
                      updateStickyNote(currentQuestion.id, c, {
                        color: currentStickyNote?.color || 'yellow',
                      })
                    }
                    onPin={handlePin}
                    questionNumber={state.currentQuestionIndex + 1}
                    questionSubject={currentQuestion.subject}
                    color={currentStickyNote?.color || 'yellow'}
                    onColorChange={(newCol) =>
                      updateStickyNote(
                        currentQuestion.id,
                        currentStickyNote?.content || '',
                        { color: newCol }
                      )
                    }
                    isPinned={boardNotes.some(
                      (b) => b.question_id === currentQuestion.id && b.is_pinned !== false
                    )}
                    onTogglePin={() => {
                      const existingBoardNote = boardNotes.find(
                        (b) => b.question_id === currentQuestion.id
                      );
                      if (existingBoardNote) {
                        handleDeleteBoardNote(existingBoardNote.id);
                      } else {
                        handlePin(
                          currentStickyNote?.content || '',
                          currentStickyNote?.color || 'yellow'
                        );
                      }
                    }}
                    saveStatus={state.saveStatus === 'error' ? 'offline' : state.saveStatus}
                  />
                  <button
                    onClick={() => flagQuestion(currentQuestion.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all border',
                      currentAnswer?.status === 'flagged'
                        ? 'border-red-300 bg-red-50 text-red-700'
                        : 'border-border text-stone-500 hover:bg-stone-50',
                    )}
                    aria-label={currentAnswer?.status === 'flagged' ? 'Unflag question' : 'Flag question'}
                  >
                    <Flag className="w-4 h-4" />
                    <span className="hidden sm:inline">{currentAnswer?.status === 'flagged' ? 'Flagged' : 'Flag'}</span>
                  </button>
                </div>
              </div>
              <AnswerEditor
                value={currentAnswer?.answer_text || ''}
                onChange={(text) => updateAnswer(currentQuestion.id, text)}
                saveStatus={state.saveStatus}
                disabled={state.isTimeUp}
                options={currentQuestion.options}
              />

              {/* Modern Browser-Inspired Notes Board */}
              <NotesBoard
                notes={boardNotes}
                onDelete={handleDeleteBoardNote}
                onColorChange={handleBoardNoteColorChange}
                onPositionChange={handlePositionChange}
                onSelectNote={(note) => goToQuestion(note.question_index)}
                onTogglePin={(id) => {
                  setBoardNotes((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, is_pinned: !n.is_pinned } : n))
                  );
                }}
                examTitle={state.session?.title}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrev}
                disabled={state.currentQuestionIndex === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-border bg-card hover:bg-stone-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-2">
                {isLastQuestion ? (
                  <button
                    onClick={() => setShowSubmitDialog(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/25"
                  >
                    <Send className="w-4 h-4" /> Submit Exam
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Navigator (Desktop) */}
          <div className="hidden md:block w-64 lg:w-72 shrink-0">
            <div className="sticky top-20">
              <QuestionNavigator
                totalQuestions={state.questions.length}
                currentIndex={state.currentQuestionIndex}
                getQuestionStatus={getQuestionStatus}
                questionIds={questionIds}
                onNavigate={goToQuestion}
                stats={stats}
                answers={state.answers}
                onToggleFlag={flagQuestion}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigator Drawer */}
      <MobileQuestionDrawer
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        totalQuestions={state.questions.length}
        currentIndex={state.currentQuestionIndex}
        getQuestionStatus={getQuestionStatus}
        questionIds={questionIds}
        onNavigate={goToQuestion}
        stats={stats}
        answers={state.answers}
        onToggleFlag={flagQuestion}
      />

      {/* Submit Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-5">
            <div className="text-center">
              <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-3" />
              <h3 className="text-lg font-bold text-foreground">Submit Exam?</h3>
              <p className="text-sm text-stone-500 mt-1">Review your answers before submitting.</p>
            </div>

            <div className="bg-surface rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Total Questions</span>
                <span className="font-semibold">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Answered</span>
                <span className="font-semibold text-emerald-600">{stats.answered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Unanswered</span>
                <span className="font-semibold text-red-600">{stats.total - stats.answered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Flagged</span>
                <span className="font-semibold text-amber-600">{stats.flagged}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-stone-500">Total Marks</span>
                <span className="font-bold text-foreground">{state.session?.total_marks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Duration</span>
                <span className="font-semibold">{formatDuration(state.session?.duration_seconds || 0)}</span>
              </div>
            </div>

            {stats.total - stats.answered > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>You have {stats.total - stats.answered} unanswered question(s).</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitDialog(false)}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-stone-50"
              >
                Review
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-brand"
              >
                <CheckCircle2 className="w-4 h-4" /> Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PRE-EXAM CAMERA CHECK & PERMISSION MODAL ── */}
      <PreExamCameraCheckModal
        isOpen={showCameraCheck}
        examTitle={state.session?.title || 'Examination'}
        onConfirm={handleCameraConfirmed}
        onCancel={() => setShowCameraCheck(false)}
      />

      {/* ── FLOATING PHOTO-BOOTH STYLE PROCTORING WINDOW ── */}
      {proctorConfig.live_video_enabled && cameraVerified && (
        <StudentProctoringBubble
          stream={cameraStream}
          cameraActive={Boolean(cameraStream && cameraStream.getVideoTracks().some((t) => t.readyState === 'live'))}
          connectionQuality={connectionQuality}
          isLive={true}
          examTitle={state.session?.title}
          warningMessage={warningMessage}
          onDismissWarning={dismissWarning}
        />
      )}

      {/* ── BASIC ON-SCREEN CALCULATOR ── */}
      {isCalculatorAllowed && (
        <ExamCalculator
          isOpen={showCalculator}
          onClose={() => setShowCalculator(false)}
        />
      )}

      {/* ── TEACHER SUPERVISORY WARNING BANNER ── */}
      <TeacherWarningOverlay
        isOpen={Boolean(activeWarning)}
        warningLevel={activeWarning?.level || 'first'}
        reason={activeWarning?.reason || ''}
        note={activeWarning?.note}
        timestamp={activeWarning?.timestamp}
        onAcknowledge={() => {
          if (activeWarning?.id) {
            setAcknowledgedWarningIds((prev) => new Set([...prev, activeWarning.id]));
          }
          setActiveWarning(null);
        }}
      />

      {/* ── UNBYPASSABLE EXAM SUSPENSION SCREEN ── */}
      <ExamSuspensionOverlay
        isSuspended={isSuspended}
        reason={suspensionReason}
        suspendedAt={suspendedAt}
        onRefreshStatus={async () => {
          if (!customExamInfo?.id) return;
          const studentId = state.session?.user_id || 'local-user';
          try {
            const res = await fetch(
              `/api/custom-exams/student-status?exam_id=${customExamInfo.id}&student_id=${studentId}`
            );
            if (res.ok) {
              const data = await res.json();
              if (data.participant && !data.participant.is_suspended) {
                setIsSuspended(false);
                setSuspensionReason(null);
                setSuspendedAt(null);
              }
            }
          } catch {}
        }}
      />
    </div>
  );
}

export default function ExamSessionPage() {
  return (
    <ExamProvider>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <ExamSessionInner />
      </Suspense>
    </ExamProvider>
  );
}
