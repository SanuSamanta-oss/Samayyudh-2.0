// ============================================================
// SamayYudh 2.0 — Custom Exam & Live Supervision Service
// Server & Client Hybrid Service with Offline Fallback
// Production Architecture conforming to Master Upgrade Spec
// ============================================================

import { isSupabaseConfigured } from '@/lib/supabase/client';
import { createServiceRoleClient } from '@/lib/supabase/admin';
import fs from 'fs';
import path from 'path';
import type {
  CustomExam,
  CustomExamParticipant,
  ExamSupervisionEvent,
  ExamSupervisionSession,
  CreateCustomExamInput,
  TeacherSupervisionActionPayload,
  CustomExamReport,
  SupervisionAuditLog,
} from '@/types/custom-exam';

// Helper for validating UUIDs before passing to PostgreSQL UUID columns
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isValidUuid(str?: string | null): boolean {
  return Boolean(str && UUID_REGEX.test(str.trim()));
}

export function isDemoExamId(id?: string | null): boolean {
  if (!id) return false;
  const s = id.trim().toLowerCase();
  return s === 'demo_exam' || s === 'demo' || s === 'ce4821';
}

/**
 * Checks whether a teacher/admin is authorized to manage or supervise an examination.
 */
export async function isTeacherAuthorizedForExam(examId: string, teacherId: string): Promise<boolean> {
  if (!examId || !teacherId) return false;

  if (isSupabaseConfigured) {
    try {
      const adminClient = createServiceRoleClient();
      if (adminClient) {
        // 1. Check if user is the direct creator of the exam
        const { data: exam } = await adminClient
          .from('custom_exams')
          .select('created_by')
          .eq('id', examId)
          .single();

        if (exam && exam.created_by === teacherId) return true;

        // 2. Check if user has an elevated role with global supervision privileges (super_admin, admin)
        const { data: roleData } = await adminClient
          .from('user_roles')
          .select('role')
          .eq('user_id', teacherId)
          .single();

        if (roleData && ['super_admin', 'admin'].includes(roleData.role)) {
          return true;
        }

        // If exam exists in production database, do not fall back to local exams to bypass authorization
        if (exam) {
          return false;
        }
      }
    } catch {}
  }

  // Local/demo fallback
  const local = getLocalExams();
  const matched = local.find((e) => e.id === examId || (examId === 'demo_exam' && e.id === 'CE4821'));
  if (matched && (matched.created_by === teacherId || (matched.created_by === 'teacher_demo' && teacherId === 'teacher_demo'))) {
    return true;
  }
  return false;
}

// Local storage keys for reliable offline development & local persistence
const STORAGE_EXAMS_KEY = 'samayyudh:custom_exams';
const STORAGE_PARTICIPANTS_KEY = 'samayyudh:custom_exam_participants';
const STORAGE_EVENTS_KEY = 'samayyudh:custom_exam_events';

/**
 * Generates an atomic unique examination code: CE + 4 RANDOM DIGITS (e.g. CE4821)
 */
export async function generateUniqueCustomExamCode(): Promise<string> {
  if (isSupabaseConfigured) {
    try {
      const adminClient = createServiceRoleClient();
      if (adminClient) {
        const { data, error } = await adminClient.rpc('generate_unique_custom_exam_code');
        if (!error && data) {
          return String(data);
        }
      }
    } catch {
      // Fallback to client query verification loop
    }
  }

  // Resilient collision-check generation loop
  let code = '';
  let exists = true;
  let attempts = 0;

  while (exists && attempts < 30) {
    attempts++;
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    code = `CE${randomDigits}`;

    if (isSupabaseConfigured) {
      try {
        const adminClient = createServiceRoleClient();
        if (adminClient) {
          const { data } = await adminClient
            .from('custom_exams')
            .select('id')
            .eq('exam_code', code)
            .maybeSingle();

          if (!data) {
            exists = false;
          }
        } else {
          exists = false;
        }
      } catch {
        exists = false;
      }
    } else {
      const localExams = getLocalExams();
      exists = localExams.some((e) => e.exam_code === code);
    }
  }

  return code || `CE${Math.floor(1000 + Math.random() * 9000)}`;
}

// ─── SERVER & LOCAL STORAGE HYBRID CACHE (ZERO-CRASH MULTI-ENVIRONMENT) ──

interface ServerMemoryStore {
  exams: Map<string, CustomExam>;
  participants: Map<string, CustomExamParticipant>;
  events: ExamSupervisionEvent[];
  auditLogs: SupervisionAuditLog[];
}

const GLOBAL_STORE_KEY = '__samayyudh_exam_store__';

function getStoreDiskPath(): string {
  try {
    const tmp = process.env.TEMP || process.env.TMPDIR || '/tmp';
    return path.join(tmp, 'samayyudh_exam_store_v2.json');
  } catch {
    return '';
  }
}

function syncStoreFromDisk(store: ServerMemoryStore): void {
  try {
    const p = getStoreDiskPath();
    if (p && fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.participants)) {
        data.participants.forEach((pt: CustomExamParticipant) => {
          store.participants.set(`${pt.exam_id}:${pt.student_id}`, pt);
          if (pt.exam_id === 'demo_exam') {
            store.participants.set(`CE4821:${pt.student_id}`, pt);
          }
        });
      }
    }
  } catch {}
}

function syncStoreToDisk(store: ServerMemoryStore): void {
  try {
    const p = getStoreDiskPath();
    if (p) {
      const participants = Array.from(store.participants.values());
      fs.writeFileSync(p, JSON.stringify({ participants, updated_at: new Date().toISOString() }), 'utf8');
    }
  } catch {}
}

function getServerStore(): ServerMemoryStore {
  const g = globalThis as unknown as { [GLOBAL_STORE_KEY]?: ServerMemoryStore };
  if (!g[GLOBAL_STORE_KEY]) {
    const defaultExams = new Map<string, CustomExam>();
    const defaultParticipants = new Map<string, CustomExamParticipant>();

    // Seed default demo exam (CE4821)
    const demoExam: CustomExam = {
      id: 'demo_exam',
      exam_code: 'CE4821',
      title: 'Advanced Physics & Mechanics Assessment 2026',
      description: 'Live proctored custom examination with webcam surveillance, automated gaze tracking, and candidate enforcement.',
      created_by: 'teacher_demo',
      duration_minutes: 60,
      total_marks: 100,
      start_time: new Date(Date.now() - 1800000).toISOString(),
      end_time: new Date(Date.now() + 1800000).toISOString(),
      code_expires_at: null,
      supervision_enabled: true,
      mic_enabled: true,
      negative_marking: true,
      question_types: ['mcq', 'numerical'],
      max_participants: 60,
      instructions: 'Ensure full visibility of face and workspace. Multi-screen setups and unauthorized accessories are strictly flagged.',
      selected_questions: [
        { id: 'q1', question_number: 1, text: 'What is the SI unit of force?', correct_answer: 'A', marks: 4 },
        { id: 'q2', question_number: 2, text: 'What is acceleration due to gravity?', correct_answer: 'B', marks: 4 },
      ],
      subjects: ['Physics', 'Mechanics'],
      target_class: 'Grade 12 Advanced Batch A',
      subject: 'Physics',
      status: 'in_progress',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date().toISOString(),
    };
    defaultExams.set('demo_exam', demoExam);
    defaultExams.set('demo', demoExam);
    defaultExams.set('CE4821', demoExam);

    const store: ServerMemoryStore = {
      exams: defaultExams,
      participants: defaultParticipants,
      events: [],
      auditLogs: [],
    };
    syncStoreFromDisk(store);
    g[GLOBAL_STORE_KEY] = store;
  }
  return g[GLOBAL_STORE_KEY]!;
}

function getLocalExams(): CustomExam[] {
  if (typeof window === 'undefined') {
    return Array.from(getServerStore().exams.values());
  }
  try {
    const raw = localStorage.getItem(STORAGE_EXAMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalExams(exams: CustomExam[]): void {
  exams.forEach((e) => {
    getServerStore().exams.set(e.id, e);
    getServerStore().exams.set(e.exam_code, e);
  });
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_EXAMS_KEY, JSON.stringify(exams));
    } catch {}
  }
}

export function getLocalParticipants(examId?: string): CustomExamParticipant[] {
  if (typeof window === 'undefined') {
    const store = getServerStore();
    syncStoreFromDisk(store);
    const all = Array.from(store.participants.values());
    if (!examId) return all;
    const normalizedExamId = examId.trim().toUpperCase();
    return all.filter((p) => {
      const pExam = (p.exam_id || '').trim().toUpperCase();
      if (pExam === normalizedExamId) return true;
      if (
        (normalizedExamId === 'CE4821' || normalizedExamId === 'DEMO_EXAM' || normalizedExamId === 'DEMO') &&
        (pExam === 'CE4821' || pExam === 'DEMO_EXAM' || pExam === 'DEMO')
      ) {
        return true;
      }
      return false;
    });
  }
  try {
    const raw = localStorage.getItem(STORAGE_PARTICIPANTS_KEY);
    const parsed: CustomExamParticipant[] = raw ? JSON.parse(raw) : [];
    if (!examId) return parsed;
    const normalizedExamId = examId.trim().toUpperCase();
    return parsed.filter((p) => {
      const pExam = (p.exam_id || '').trim().toUpperCase();
      if (pExam === normalizedExamId) return true;
      if (
        (normalizedExamId === 'CE4821' || normalizedExamId === 'DEMO_EXAM' || normalizedExamId === 'DEMO') &&
        (pExam === 'CE4821' || pExam === 'DEMO_EXAM' || pExam === 'DEMO')
      ) {
        return true;
      }
      return false;
    });
  } catch {
    return [];
  }
}

export function saveLocalParticipants(participants: CustomExamParticipant[]): void {
  const store = getServerStore();
  participants.forEach((p) => {
    store.participants.set(`${p.exam_id}:${p.student_id}`, p);
    if (p.exam_id === 'demo_exam') {
      store.participants.set(`CE4821:${p.student_id}`, p);
    }
  });
  syncStoreToDisk(store);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_PARTICIPANTS_KEY, JSON.stringify(participants));
    } catch {}
  }
}

function getLocalEvents(examId?: string): ExamSupervisionEvent[] {
  if (typeof window === 'undefined') {
    const evts = getServerStore().events;
    return examId ? evts.filter((e) => e.exam_id === examId) : evts;
  }
  try {
    const raw = localStorage.getItem(STORAGE_EVENTS_KEY);
    const parsed: ExamSupervisionEvent[] = raw ? JSON.parse(raw) : [];
    return examId ? parsed.filter((e) => e.exam_id === examId) : parsed;
  } catch {
    return [];
  }
}

function saveLocalEvents(events: ExamSupervisionEvent[]): void {
  getServerStore().events = events;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(events));
    } catch {}
  }
}

export function appendAuditLog(log: Omit<SupervisionAuditLog, 'id' | 'created_at'>): void {
  const fullLog: SupervisionAuditLog = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
    ...log,
  };
  getServerStore().auditLogs.unshift(fullLog);

  if (isSupabaseConfigured) {
    try {
      const adminClient = createServiceRoleClient();
      if (adminClient) {
        adminClient.from('supervision_audit_logs').insert(fullLog).then();
      }
    } catch {}
  }
}

// ─── CRUD OPERATIONS ────────────────────────────────────────────────

export async function createCustomExam(
  input: CreateCustomExamInput,
  userId: string | null
): Promise<CustomExam> {
  const examCode = await generateUniqueCustomExamCode();
  const now = new Date().toISOString();

  const newExam: CustomExam = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ce_${Date.now()}`,
    exam_code: examCode,
    title: input.title,
    description: input.description || null,
    created_by: userId,
    duration_minutes: input.duration_minutes || 60,
    total_marks: input.total_marks || 100,
    start_time: input.start_time || null,
    end_time: input.end_time || null,
    code_expires_at: null,
    supervision_enabled: input.supervision_enabled ?? true,
    mic_enabled: input.mic_enabled ?? false,
    negative_marking: input.negative_marking ?? false,
    randomize_questions: input.randomize_questions ?? false,
    randomize_options: input.randomize_options ?? false,
    question_types: input.question_types || ['MCQ'],
    max_participants: input.max_participants || 100,
    target_class: input.target_class || null,
    subject: input.subject || null,
    instructions: input.instructions || null,
    selected_questions: input.selected_questions || [],
    subjects: input.subjects || (input.subject ? [input.subject] : ['General']),
    status: 'waiting',
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured && userId) {
    try {
      const adminClient = createServiceRoleClient();
      if (adminClient) {
        const { data, error } = await adminClient
          .from('custom_exams')
          .insert(newExam)
          .select()
          .single();

        if (!error && data) {
          appendAuditLog({
            exam_id: newExam.id,
            teacher_id: userId,
            actor_id: userId,
            actor_role: 'teacher',
            event_type: 'EXAM_CREATED',
            event_source: 'dashboard',
            metadata: { exam_code: newExam.exam_code, title: newExam.title },
          });
          return data as CustomExam;
        }
      }
    } catch (e) {
      console.warn('[CustomExamService] Falling back to local storage:', e);
    }
  }

  // Fallback to local memory / local storage
  const exams = getLocalExams();
  saveLocalExams([newExam, ...exams]);

  appendAuditLog({
    exam_id: newExam.id,
    teacher_id: userId || 'teacher_system',
    actor_id: userId || 'teacher_system',
    actor_role: 'teacher',
    event_type: 'EXAM_CREATED',
    event_source: 'dashboard',
    metadata: { exam_code: newExam.exam_code, title: newExam.title },
  });

  return newExam;
}

export async function getCustomExamByCode(code: string): Promise<CustomExam | null> {
  const normalizedCode = code.trim().toUpperCase();
  if (normalizedCode === 'CE4821') {
    return getServerStore().exams.get('demo_exam') || null;
  }

  if (isSupabaseConfigured) {
    try {
      const adminClient = createServiceRoleClient();
      if (adminClient) {
        const { data, error } = await adminClient
          .from('custom_exams')
          .select('*')
          .eq('exam_code', normalizedCode)
          .maybeSingle();

        if (!error && data) {
          return data as CustomExam;
        }
      }
    } catch {}
  }

  const local = getLocalExams();
  return local.find((e) => e.exam_code.toUpperCase() === normalizedCode) || null;
}

export async function getCustomExamById(id: string): Promise<CustomExam | null> {
  if (id === 'demo_exam' || id === 'demo' || id.toUpperCase() === 'CE4821') {
    return getServerStore().exams.get('demo_exam') || null;
  }

  if (isSupabaseConfigured) {
    try {
      const adminClient = createServiceRoleClient();
      if (adminClient) {
        const { data, error } = await adminClient
          .from('custom_exams')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) {
          return data as CustomExam;
        }
      }
    } catch {}
  }

  const local = getLocalExams();
  return local.find((e) => e.id === id || e.exam_code.toUpperCase() === id.toUpperCase()) || null;
}

export async function listTeacherCustomExams(teacherId: string | null): Promise<CustomExam[]> {
  if (isSupabaseConfigured && teacherId) {
    try {
      const adminClient = createServiceRoleClient();
      if (adminClient) {
        const { data, error } = await adminClient
          .from('custom_exams')
          .select('*')
          .eq('created_by', teacherId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data as CustomExam[];
        }
      }
    } catch {}
  }

  const local = getLocalExams();
  if (teacherId) {
    const matched = local.filter((e) => e.created_by === teacherId);
    if (matched.length > 0) return matched;
  }
  return local;
}

// ─── STUDENT PARTICIPATION OPERATIONS ───────────────────────────────

export async function joinCustomExamParticipant(
  examId: string,
  student: {
    id: string;
    name?: string;
    email?: string | null;
    lceCode?: string;
    studentClass?: string;
  }
): Promise<{ participant: CustomExamParticipant; isExpired?: boolean; error?: string }> {
  // Check exam existence and status
  const exam = await getCustomExamById(examId);
  if (!exam) {
    return { participant: null as any, error: 'Examination not found' };
  }

  // Three-minute expiration rule: If exam is completed, reject join requests immediately!
  if (exam.status === 'completed' || exam.status === 'archived') {
    return {
      participant: null as any,
      isExpired: true,
      error: 'This examination has already concluded and is no longer accepting new participants.',
    };
  }

  const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const participant: CustomExamParticipant = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `part_${Date.now()}`,
    exam_id: exam.id,
    student_id: student.id,
    student_name: student.name || 'Candidate Student',
    student_lce_code: student.lceCode || `LCE-${Math.floor(1000 + Math.random() * 9000)}`,
    student_email: student.email || null,
    student_class: student.studentClass || 'General Batch',
    attempt_id: attemptId,
    joined_at: new Date().toISOString(),
    connection_status: 'connected',
    camera_status: 'active',
    exam_status: 'waiting',
    warning_count: 0,
    is_suspended: false,
    suspended_at: null,
    suspended_reason: null,
    time_adjustment_seconds: 0,
    remaining_seconds_cached: exam.duration_minutes * 60,
    hand_raised: false,
    hand_raised_at: null,
    current_question_index: 0,
    questions_answered: 0,
    questions_attempted: 0,
    questions_unanswered: (exam.selected_questions || []).length || 25,
    questions_correct: 0,
    questions_incorrect: 0,
    accuracy_percentage: 0,
    final_score: null,
    last_heartbeat: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && isValidUuid(participant.exam_id) && isValidUuid(participant.student_id)) {
    try {
      const adminClient = createServiceRoleClient();
      if (adminClient) {
        const { data, error } = await adminClient
          .from('custom_exam_participants')
          .upsert(participant, { onConflict: 'exam_id,student_id' })
          .select()
          .single();

        if (!error && data) {
          appendAuditLog({
            exam_id: exam.id,
            student_id: student.id,
            actor_id: student.id,
            actor_role: 'student',
            event_type: 'STUDENT_JOINED',
            event_source: 'waiting_room',
            metadata: { student_name: participant.student_name, lce_code: participant.student_lce_code },
          });
        }
      }
    } catch {}
  }

  // Always save in resilient persistent store
  const all = getLocalParticipants();
  const existingIdx = all.findIndex(
    (p) =>
      (p.exam_id === exam.id || (exam.id === 'demo_exam' && p.exam_id === 'CE4821')) &&
      p.student_id === student.id
  );
  if (existingIdx >= 0) {
    all[existingIdx] = { ...all[existingIdx], ...participant };
  } else {
    all.push(participant);
  }
  saveLocalParticipants(all);

  appendAuditLog({
    exam_id: exam.id,
    student_id: student.id,
    actor_id: student.id,
    actor_role: 'student',
    event_type: 'STUDENT_JOINED',
    event_source: 'waiting_room',
    metadata: { student_name: participant.student_name, lce_code: participant.student_lce_code },
  });

  // Broadcast student join to realtime channel so supervisor sees them instantly
  if (isSupabaseConfigured) {
    try {
      const adminClient = createServiceRoleClient();
      if (adminClient) {
        const channelName = `custom_exam_${exam.exam_code.toLowerCase()}`;
        const ch = adminClient.channel(channelName);
        ch.subscribe((st: string) => {
          if (st === 'SUBSCRIBED') {
            ch.send({
              type: 'broadcast',
              event: 'student_joined',
              payload: { participant },
            });
          }
        });
      }
    } catch {}
  }

  return { participant };
}

export async function getStudentParticipantStatus(
  examId: string,
  studentId: string
): Promise<{ participant: CustomExamParticipant | null; latestEvent: ExamSupervisionEvent | null; exam: CustomExam | null }> {
  let participant: CustomExamParticipant | null = null;
  let latestEvent: ExamSupervisionEvent | null = null;
  const exam = await getCustomExamById(examId);
  const targetExamIds = Array.from(
    new Set([examId, exam?.id, exam?.exam_code].filter(Boolean) as string[])
  );
  if (
    targetExamIds.some((id) => id.toUpperCase() === 'CE4821' || id === 'demo_exam' || id === 'demo')
  ) {
    if (!targetExamIds.includes('CE4821')) targetExamIds.push('CE4821');
    if (!targetExamIds.includes('demo_exam')) targetExamIds.push('demo_exam');
    if (!targetExamIds.includes('demo')) targetExamIds.push('demo');
  }
  const validUuids = targetExamIds.filter(isValidUuid);

  if (isSupabaseConfigured && validUuids.length > 0 && isValidUuid(studentId)) {
    try {
      const adminClient = createServiceRoleClient();
      if (adminClient) {
        const { data: pData } = await adminClient
          .from('custom_exam_participants')
          .select('*')
          .in('exam_id', validUuids)
          .eq('student_id', studentId)
          .maybeSingle();

        if (pData) participant = pData as CustomExamParticipant;

        const { data: eData } = await adminClient
          .from('exam_supervision_events')
          .select('*')
          .in('exam_id', validUuids)
          .eq('student_id', studentId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (eData) latestEvent = eData as ExamSupervisionEvent;
      }
    } catch {}
  }

  if (!participant) {
    const all = getLocalParticipants();
    participant =
      all.find(
        (p) =>
          targetExamIds.includes(p.exam_id) &&
          (p.student_id === studentId || p.student_lce_code === studentId)
      ) || null;
  }

  if (!latestEvent) {
    const events = getLocalEvents(examId);
    latestEvent = events.find((e) => e.student_id === studentId) || null;
  }

  return { participant, latestEvent, exam };
}

export async function updateStudentParticipantHeartbeat(
  examId: string,
  studentId: string,
  updates: {
    camera_active?: boolean;
    connection_quality?: 'good' | 'fair' | 'poor' | 'offline';
    questions_answered?: number;
    current_question_index?: number;
    time_remaining_seconds?: number;
  }
): Promise<boolean> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured) {
    try {
      const adminClient = createServiceRoleClient();
      if (adminClient) {
        // Enforce route-level suspension check: Reject writes from suspended students
        const { data: part } = await adminClient
          .from('custom_exam_participants')
          .select('is_suspended, exam_status')
          .eq('exam_id', examId)
          .eq('student_id', studentId)
          .single();

        if (part && (part.is_suspended || part.exam_status === 'suspended')) {
          return false;
        }

        await adminClient
          .from('custom_exam_participants')
          .update({
            ...updates,
            last_heartbeat: now,
            updated_at: now,
          })
          .eq('exam_id', examId)
          .eq('student_id', studentId);
        return true;
      }
    } catch {}
  }

  const all = getLocalParticipants();
  const idx = all.findIndex((p) => p.exam_id === examId && p.student_id === studentId);
  if (idx >= 0) {
    if (all[idx].is_suspended || all[idx].exam_status === 'suspended') {
      return false;
    }
    all[idx] = {
      ...all[idx],
      ...updates,
      last_heartbeat: now,
      updated_at: now,
    };
    saveLocalParticipants(all);
    return true;
  }
  return false;
}

// ─── TEACHER SUPERVISORY ACTIONS ────────────────────────────────────

export async function executeSupervisionAction(
  payload: TeacherSupervisionActionPayload,
  teacherId: string
): Promise<{ success: boolean; event?: ExamSupervisionEvent; participant?: CustomExamParticipant; error?: string }> {
  const { exam_id, student_id, action, warning_level, reason, note, time_adjustment_seconds } = payload;
  const now = new Date().toISOString();

  let eventType: ExamSupervisionEvent['event_type'] = 'warning';
  if (action === 'suspend') eventType = 'suspend';
  if (action === 'restore') eventType = 'restore';
  if (action === 'time_adjustment') eventType = 'time_adjustment';
  if (action === 'acknowledge_hand') eventType = 'hand_acknowledged';
  if (action === 'message') eventType = 'message';
  if (action === 'end_student_exam') eventType = 'exam_ended';

  const newEvent: ExamSupervisionEvent = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `evt_${Date.now()}`,
    exam_id,
    student_id,
    teacher_id: teacherId,
    event_type: eventType,
    warning_level: action === 'warning' ? warning_level || 'first' : undefined,
    reason: reason || action,
    description: note || undefined,
    time_adjustment_seconds,
    details: { action, timestamp: now, time_adjustment_seconds },
    created_at: now,
  };

  let updatedParticipant: CustomExamParticipant | undefined;

  // Supabase update with strict fail-closed boundary
  if (isSupabaseConfigured && !isDemoExamId(exam_id)) {
    try {
      const adminClient = createServiceRoleClient();
      if (!adminClient) {
        return { success: false, event: newEvent, error: 'DATABASE_ERROR' };
      }

      const { error: insErr } = await adminClient.from('exam_supervision_events').insert(newEvent);
      if (insErr) {
        console.error('[executeSupervisionAction] Event insert error:', insErr);
      }

      if (action === 'warning') {
        const { data } = await adminClient
          .from('custom_exam_participants')
          .select('warning_count')
          .eq('exam_id', exam_id)
          .eq('student_id', student_id)
          .single();
        const nextCount = (data?.warning_count || 0) + 1;

        const { data: part, error: upErr } = await adminClient
          .from('custom_exam_participants')
          .update({ warning_count: nextCount, updated_at: now })
          .eq('exam_id', exam_id)
          .eq('student_id', student_id)
          .select()
          .single();
        if (upErr || !part) {
          return { success: false, event: newEvent, error: 'DATABASE_ERROR' };
        }
        updatedParticipant = part as CustomExamParticipant;

        appendAuditLog({
          exam_id,
          student_id,
          teacher_id: teacherId,
          actor_id: teacherId,
          actor_role: 'teacher',
          event_type: 'STUDENT_WARNED',
          event_source: 'control_room',
          metadata: { warning_level: warning_level || 'first', category: reason, message: note },
        });
      } else if (action === 'suspend') {
        const { data: part, error: upErr } = await adminClient
          .from('custom_exam_participants')
          .update({
            is_suspended: true,
            exam_status: 'suspended',
            suspended_at: now,
            suspended_reason: reason || 'Suspicious behaviour detected by supervisor.',
            updated_at: now,
          })
          .eq('exam_id', exam_id)
          .eq('student_id', student_id)
          .select()
          .single();
        if (upErr || !part) {
          return { success: false, event: newEvent, error: 'DATABASE_ERROR' };
        }
        updatedParticipant = part as CustomExamParticipant;

        appendAuditLog({
          exam_id,
          student_id,
          teacher_id: teacherId,
          actor_id: teacherId,
          actor_role: 'teacher',
          event_type: 'STUDENT_SUSPENDED',
          event_source: 'control_room',
          metadata: { reason },
        });
      } else if (action === 'restore') {
        const { data: part, error: upErr } = await adminClient
          .from('custom_exam_participants')
          .update({
            is_suspended: false,
            exam_status: 'in_progress',
            suspended_at: null,
            suspended_reason: null,
            updated_at: now,
          })
          .eq('exam_id', exam_id)
          .eq('student_id', student_id)
          .select()
          .single();
        if (upErr || !part) {
          return { success: false, event: newEvent, error: 'DATABASE_ERROR' };
        }
        updatedParticipant = part as CustomExamParticipant;

        appendAuditLog({
          exam_id,
          student_id,
          teacher_id: teacherId,
          actor_id: teacherId,
          actor_role: 'teacher',
          event_type: 'STUDENT_RESUMED',
          event_source: 'control_room',
          metadata: {},
        });
      } else if (action === 'approve' || action === 'admit') {
        const { data: part, error: upErr } = await adminClient
          .from('custom_exam_participants')
          .update({
            exam_status: 'in_progress',
            updated_at: now,
          })
          .eq('exam_id', exam_id)
          .eq('student_id', student_id)
          .select()
          .single();
        if (upErr || !part) {
          return { success: false, event: newEvent, error: 'DATABASE_ERROR' };
        }
        updatedParticipant = part as CustomExamParticipant;

        appendAuditLog({
          exam_id,
          student_id,
          teacher_id: teacherId,
          actor_id: teacherId,
          actor_role: 'teacher',
          event_type: 'STUDENT_ADMITTED',
          event_source: 'control_room',
          metadata: {},
        });

        getCustomExamById(exam_id).then((ex) => {
          const code = ex?.exam_code || exam_id;
          const ch = adminClient.channel(`custom_exam_${code.toLowerCase()}`);
          ch.subscribe((st: string) => {
            if (st === 'SUBSCRIBED') {
              ch.send({
                type: 'broadcast',
                event: 'student_admitted',
                payload: { student_id, exam_status: 'in_progress' },
              });
            }
          });
        });

        return { success: true, event: newEvent, participant: updatedParticipant };
      } else if (action === 'approve_all' || action === 'admit_all') {
        const { error: upErr } = await adminClient
          .from('custom_exam_participants')
          .update({
            exam_status: 'in_progress',
            updated_at: now,
          })
          .eq('exam_id', exam_id)
          .eq('exam_status', 'waiting');

        if (upErr) {
          return { success: false, event: newEvent, error: 'DATABASE_ERROR' };
        }

        appendAuditLog({
          exam_id,
          student_id: 'all',
          teacher_id: teacherId,
          actor_id: teacherId,
          actor_role: 'teacher',
          event_type: 'STUDENTS_ALL_ADMITTED',
          event_source: 'control_room',
          metadata: {},
        });

        getCustomExamById(exam_id).then((ex) => {
          const code = ex?.exam_code || exam_id;
          const ch = adminClient.channel(`custom_exam_${code.toLowerCase()}`);
          ch.subscribe((st: string) => {
            if (st === 'SUBSCRIBED') {
              ch.send({
                type: 'broadcast',
                event: 'student_admitted',
                payload: { student_id: 'all', exam_status: 'in_progress' },
              });
            }
          });
        });

        return { success: true, event: newEvent };
      } else if (action === 'time_adjustment') {
        const delta = time_adjustment_seconds || 0;
        const { data } = await adminClient
          .from('custom_exam_participants')
          .select('time_adjustment_seconds')
          .eq('exam_id', exam_id)
          .eq('student_id', student_id)
          .single();
        const nextAdj = (data?.time_adjustment_seconds || 0) + delta;

        const { data: part, error: upErr } = await adminClient
          .from('custom_exam_participants')
          .update({ time_adjustment_seconds: nextAdj, updated_at: now })
          .eq('exam_id', exam_id)
          .eq('student_id', student_id)
          .select()
          .single();
        if (upErr || !part) {
          return { success: false, event: newEvent, error: 'DATABASE_ERROR' };
        }
        updatedParticipant = part as CustomExamParticipant;

        appendAuditLog({
          exam_id,
          student_id,
          teacher_id: teacherId,
          actor_id: teacherId,
          actor_role: 'teacher',
          event_type: delta >= 0 ? 'TIME_EXTENDED' : 'TIME_REDUCED',
          event_source: 'control_room',
          metadata: { delta_seconds: delta, reason },
        });
      } else if (action === 'acknowledge_hand') {
        const { data: part, error: upErr } = await adminClient
          .from('custom_exam_participants')
          .update({ hand_raised: false, updated_at: now })
          .eq('exam_id', exam_id)
          .eq('student_id', student_id)
          .select()
          .single();
        if (upErr || !part) {
          return { success: false, event: newEvent, error: 'DATABASE_ERROR' };
        }
        updatedParticipant = part as CustomExamParticipant;

        appendAuditLog({
          exam_id,
          student_id,
          teacher_id: teacherId,
          actor_id: teacherId,
          actor_role: 'teacher',
          event_type: 'HAND_ACKNOWLEDGED',
          event_source: 'control_room',
          metadata: {},
        });
      } else if (action === 'end_student_exam') {
        const { data: part, error: upErr } = await adminClient
          .from('custom_exam_participants')
          .update({
            exam_status: 'submitted',
            submission_type: 'teacher_forced',
            submitted_at: now,
            updated_at: now,
          })
          .eq('exam_id', exam_id)
          .eq('student_id', student_id)
          .select()
          .single();
        if (upErr || !part) {
          return { success: false, event: newEvent, error: 'DATABASE_ERROR' };
        }
        updatedParticipant = part as CustomExamParticipant;

        appendAuditLog({
          exam_id,
          student_id,
          teacher_id: teacherId,
          actor_id: teacherId,
          actor_role: 'teacher',
          event_type: 'STUDENT_SUBMITTED',
          event_source: 'control_room',
          metadata: { submission_type: 'teacher_forced' },
        });
      }

      return { success: true, event: newEvent, participant: updatedParticipant };
    } catch (err) {
      console.error('[executeSupervisionAction] Supabase database error:', err);
      return { success: false, event: newEvent, error: 'DATABASE_ERROR' };
    }
  }

  // Local / in-memory server fallback strictly for demo / offline environments
  const events = getLocalEvents();
  saveLocalEvents([newEvent, ...events]);

  const allParts = getLocalParticipants();
  const partIdx = allParts.findIndex(
    (p) =>
      (p.exam_id === exam_id ||
        (exam_id === 'demo_exam' && (p.exam_id === 'demo' || p.exam_id === 'CE4821')) ||
        (exam_id === 'CE4821' && (p.exam_id === 'demo_exam' || p.exam_id === 'demo')) ||
        (exam_id === 'demo' && p.exam_id === 'demo_exam')) &&
      p.student_id === student_id
  );

  if (action === 'approve_all' || action === 'admit_all') {
    allParts.forEach((p) => {
      if (
        (p.exam_id === exam_id ||
          (exam_id === 'demo_exam' && (p.exam_id === 'demo' || p.exam_id === 'CE4821')) ||
          (exam_id === 'CE4821' && (p.exam_id === 'demo_exam' || p.exam_id === 'demo')) ||
          (exam_id === 'demo' && p.exam_id === 'demo_exam')) &&
        p.exam_status === 'waiting'
      ) {
        p.exam_status = 'in_progress';
        p.updated_at = now;
      }
    });
    saveLocalParticipants(allParts);
    appendAuditLog({
      exam_id,
      student_id: 'all',
      teacher_id: teacherId,
      actor_id: teacherId,
      actor_role: 'teacher',
      event_type: 'STUDENTS_ALL_ADMITTED',
      event_source: 'control_room',
      metadata: {},
    });

    if (isSupabaseConfigured) {
      try {
        const adminClient = createServiceRoleClient();
        if (adminClient) {
          getCustomExamById(exam_id).then((ex) => {
            const code = ex?.exam_code || exam_id;
            const ch = adminClient.channel(`custom_exam_${code.toLowerCase()}`);
            ch.subscribe((st: string) => {
              if (st === 'SUBSCRIBED') {
                ch.send({
                  type: 'broadcast',
                  event: 'student_admitted',
                  payload: { student_id: 'all', exam_status: 'in_progress' },
                });
              }
            });
          });
        }
      } catch {}
    }

    return { success: true, event: newEvent };
  }

  if (partIdx >= 0) {
    const p = { ...allParts[partIdx] };
    if (action === 'warning') {
      p.warning_count = (p.warning_count || 0) + 1;
      appendAuditLog({
        exam_id,
        student_id,
        teacher_id: teacherId,
        actor_id: teacherId,
        actor_role: 'teacher',
        event_type: 'STUDENT_WARNED',
        event_source: 'control_room',
        metadata: { warning_level: warning_level || 'first', category: reason, message: note },
      });
    } else if (action === 'suspend') {
      p.is_suspended = true;
      p.exam_status = 'suspended';
      p.suspended_at = now;
      p.suspended_reason = reason || 'Suspicious activity flagged by proctor.';
      appendAuditLog({
        exam_id,
        student_id,
        teacher_id: teacherId,
        actor_id: teacherId,
        actor_role: 'teacher',
        event_type: 'STUDENT_SUSPENDED',
        event_source: 'control_room',
        metadata: { reason },
      });
    } else if (action === 'restore') {
      p.is_suspended = false;
      p.exam_status = 'in_progress';
      p.suspended_at = null;
      p.suspended_reason = null;
      appendAuditLog({
        exam_id,
        student_id,
        teacher_id: teacherId,
        actor_id: teacherId,
        actor_role: 'teacher',
        event_type: 'STUDENT_RESUMED',
        event_source: 'control_room',
        metadata: {},
      });
    } else if (action === 'approve' || action === 'admit') {
      p.exam_status = 'in_progress';
      p.updated_at = now;
      appendAuditLog({
        exam_id,
        student_id,
        teacher_id: teacherId,
        actor_id: teacherId,
        actor_role: 'teacher',
        event_type: 'STUDENT_ADMITTED',
        event_source: 'control_room',
        metadata: {},
      });

      if (isSupabaseConfigured) {
        try {
          const adminClient = createServiceRoleClient();
          if (adminClient) {
            getCustomExamById(exam_id).then((ex) => {
              const code = ex?.exam_code || exam_id;
              const ch = adminClient.channel(`custom_exam_${code.toLowerCase()}`);
              ch.subscribe((st: string) => {
                if (st === 'SUBSCRIBED') {
                  ch.send({
                    type: 'broadcast',
                    event: 'student_admitted',
                    payload: { student_id, exam_status: 'in_progress' },
                  });
                }
              });
            });
          }
        } catch {}
      }
    } else if (action === 'time_adjustment') {
      const delta = time_adjustment_seconds || 0;
      p.time_adjustment_seconds = (p.time_adjustment_seconds || 0) + delta;
      appendAuditLog({
        exam_id,
        student_id,
        teacher_id: teacherId,
        actor_id: teacherId,
        actor_role: 'teacher',
        event_type: delta >= 0 ? 'TIME_EXTENDED' : 'TIME_REDUCED',
        event_source: 'control_room',
        metadata: { delta_seconds: delta, reason },
      });
    } else if (action === 'acknowledge_hand') {
      p.hand_raised = false;
      appendAuditLog({
        exam_id,
        student_id,
        teacher_id: teacherId,
        actor_id: teacherId,
        actor_role: 'teacher',
        event_type: 'HAND_ACKNOWLEDGED',
        event_source: 'control_room',
        metadata: {},
      });
    } else if (action === 'end_student_exam') {
      p.exam_status = 'submitted';
      p.submission_type = 'teacher_forced';
      p.submitted_at = now;
      appendAuditLog({
        exam_id,
        student_id,
        teacher_id: teacherId,
        actor_id: teacherId,
        actor_role: 'teacher',
        event_type: 'STUDENT_SUBMITTED',
        event_source: 'control_room',
        metadata: { submission_type: 'teacher_forced' },
      });
    }
    p.updated_at = now;
    allParts[partIdx] = p;
    saveLocalParticipants(allParts);
    updatedParticipant = p;
  }

  return { success: true, event: newEvent, participant: updatedParticipant };
}

// ─── ATOMIC START & END EXAM WORKFLOWS ──────────────────────────────

export async function startCustomExamSession(
  examId: string,
  teacherId: string
): Promise<{ success: boolean; exam: CustomExam | null; error?: string }> {
  const now = new Date();
  const exam = await getCustomExamById(examId);
  if (!exam) return { success: false, exam: null, error: 'EXAM_NOT_FOUND' };

  const durationMin = exam.duration_minutes || 60;
  const startTime = now.toISOString();
  const endTime = new Date(now.getTime() + durationMin * 60000).toISOString();

  if (isSupabaseConfigured && !isDemoExamId(examId)) {
    try {
      const adminClient = createServiceRoleClient();
      if (!adminClient) return { success: false, exam: null, error: 'DATABASE_ERROR' };

      const { error: examErr } = await adminClient
        .from('custom_exams')
        .update({
          status: 'in_progress',
          start_time: startTime,
          end_time: endTime,
          updated_at: startTime,
        })
        .eq('id', exam.id);

      if (examErr) {
        console.error('[startCustomExamSession] Database update error on custom_exams:', examErr);
        return { success: false, exam: null, error: 'DATABASE_ERROR' };
      }

      const { error: partErr } = await adminClient
        .from('custom_exam_participants')
        .update({
          exam_status: 'in_progress',
          updated_at: startTime,
        })
        .eq('exam_id', exam.id)
        .eq('exam_status', 'waiting');

      if (partErr) {
        console.error('[startCustomExamSession] Database update error on participants:', partErr);
        return { success: false, exam: null, error: 'DATABASE_ERROR' };
      }

      appendAuditLog({
        exam_id: exam.id,
        teacher_id: teacherId,
        actor_id: teacherId,
        actor_role: 'teacher',
        event_type: 'EXAM_STARTED',
        event_source: 'control_room',
        metadata: { start_time: startTime, end_time: endTime },
      });

      const updatedExam = { ...exam, status: 'in_progress' as const, start_time: startTime, end_time: endTime, updated_at: startTime };
      return { success: true, exam: updatedExam };
    } catch (err) {
      console.error('[startCustomExamSession] DB exception:', err);
      return { success: false, exam: null, error: 'DATABASE_ERROR' };
    }
  }

  // Local/demo fallback
  exam.status = 'in_progress';
  exam.start_time = startTime;
  exam.end_time = endTime;
  exam.updated_at = startTime;

  getServerStore().exams.set(exam.id, exam);
  getServerStore().exams.set(exam.exam_code, exam);

  const participants = getLocalParticipants(exam.id);
  participants.forEach((p) => {
    if (p.exam_status === 'waiting') {
      p.exam_status = 'in_progress';
      p.updated_at = startTime;
    }
  });
  saveLocalParticipants(participants);

  appendAuditLog({
    exam_id: exam.id,
    teacher_id: teacherId,
    actor_id: teacherId,
    actor_role: 'teacher',
    event_type: 'EXAM_STARTED',
    event_source: 'control_room',
    metadata: { start_time: startTime, end_time: endTime },
  });

  return { success: true, exam };
}

export async function endCustomExamSession(
  examId: string,
  teacherId: string
): Promise<{ success: boolean; exam: CustomExam | null; error?: string }> {
  const now = new Date();
  const exam = await getCustomExamById(examId);
  if (!exam) return { success: false, exam: null, error: 'EXAM_NOT_FOUND' };

  const endTime = now.toISOString();
  // 3-minute post-exam expiration rule for code expiration metadata
  const codeExpiresAt = new Date(now.getTime() + 3 * 60000).toISOString();

  if (isSupabaseConfigured && !isDemoExamId(examId)) {
    try {
      const adminClient = createServiceRoleClient();
      if (!adminClient) return { success: false, exam: null, error: 'DATABASE_ERROR' };

      const { error: examErr } = await adminClient
        .from('custom_exams')
        .update({
          status: 'completed',
          end_time: endTime,
          code_expires_at: codeExpiresAt,
          updated_at: endTime,
        })
        .eq('id', exam.id);

      if (examErr) {
        console.error('[endCustomExamSession] Database update error on custom_exams:', examErr);
        return { success: false, exam: null, error: 'DATABASE_ERROR' };
      }

      const { error: partErr } = await adminClient
        .from('custom_exam_participants')
        .update({
          exam_status: 'submitted',
          submission_type: 'teacher_forced',
          submitted_at: endTime,
          updated_at: endTime,
        })
        .eq('exam_id', exam.id)
        .in('exam_status', ['in_progress', 'waiting', 'suspended']);

      if (partErr) {
        console.error('[endCustomExamSession] Database update error on participants:', partErr);
        return { success: false, exam: null, error: 'DATABASE_ERROR' };
      }

      appendAuditLog({
        exam_id: exam.id,
        teacher_id: teacherId,
        actor_id: teacherId,
        actor_role: 'teacher',
        event_type: 'EXAM_ENDED',
        event_source: 'control_room',
        metadata: { end_time: endTime, code_expires_at: codeExpiresAt },
      });

      const updatedExam = { ...exam, status: 'completed' as const, end_time: endTime, code_expires_at: codeExpiresAt, updated_at: endTime };
      return { success: true, exam: updatedExam };
    } catch (err) {
      console.error('[endCustomExamSession] DB exception:', err);
      return { success: false, exam: null, error: 'DATABASE_ERROR' };
    }
  }

  // Update in local store
  exam.status = 'completed';
  exam.end_time = endTime;
  exam.code_expires_at = codeExpiresAt;
  exam.updated_at = endTime;

  getServerStore().exams.set(exam.id, exam);
  getServerStore().exams.set(exam.exam_code, exam);

  const participants = getLocalParticipants(exam.id);
  participants.forEach((p) => {
    if (p.exam_status !== 'submitted') {
      p.exam_status = 'submitted';
      p.submission_type = 'teacher_forced';
      p.submitted_at = endTime;
      p.updated_at = endTime;
    }
  });
  saveLocalParticipants(participants);

  appendAuditLog({
    exam_id: exam.id,
    teacher_id: teacherId,
    actor_id: teacherId,
    actor_role: 'teacher',
    event_type: 'EXAM_ENDED',
    event_source: 'control_room',
    metadata: { end_time: endTime, code_expires_at: codeExpiresAt },
  });

  return { success: true, exam };
}

// ─── STUDENT HAND RAISE & SUBMISSION OPERATIONS ─────────────────────

export async function studentRaiseHand(
  examId: string,
  studentId: string
): Promise<boolean> {
  if (isSupabaseConfigured && !isDemoExamId(examId)) {
    try {
      const adminClient = createServiceRoleClient();
      if (!adminClient) return false;

      // Enforce suspension check
      const { data: part, error: pErr } = await adminClient
        .from('custom_exam_participants')
        .select('is_suspended, exam_status')
        .eq('exam_id', examId)
        .eq('student_id', studentId)
        .single();

      if (pErr || !part || part.is_suspended || part.exam_status === 'suspended') {
        return false;
      }

      const { error: upErr } = await adminClient
        .from('custom_exam_participants')
        .update({ hand_raised: true, hand_raised_at: new Date().toISOString() })
        .eq('exam_id', examId)
        .eq('student_id', studentId);

      if (upErr) return false;

      appendAuditLog({
        exam_id: examId,
        student_id: studentId,
        actor_id: studentId,
        actor_role: 'student',
        event_type: 'HAND_RAISED',
        event_source: 'exam_workspace',
        metadata: {},
      });

      return true;
    } catch {
      return false;
    }
  }

  const parts = getLocalParticipants();
  const p = parts.find((pt) => pt.exam_id === examId && pt.student_id === studentId);
  if (p) {
    if (p.is_suspended || p.exam_status === 'suspended') {
      return false;
    }
    p.hand_raised = true;
    p.hand_raised_at = new Date().toISOString();
    saveLocalParticipants(parts);
  }

  appendAuditLog({
    exam_id: examId,
    student_id: studentId,
    actor_id: studentId,
    actor_role: 'student',
    event_type: 'HAND_RAISED',
    event_source: 'exam_workspace',
  });

  return true;
}

export async function submitStudentExam(
  examId: string,
  studentId: string,
  answers: Record<string, any>,
  submissionType: 'normal' | 'early_exit' | 'timeout' | 'teacher_forced' = 'normal',
  options?: {
    idempotencyKey?: string;
    actorId?: string;
  }
): Promise<{
  success: boolean;
  score?: number | null;
  accuracy?: number | null;
  submitted_at?: string;
  idempotent?: boolean;
  already_submitted?: boolean;
  error?: string;
  code?: string;
}> {
  const now = new Date().toISOString();
  const idempotencyKey = options?.idempotencyKey || null;
  const actorId = options?.actorId || studentId;

  // Validate server deadline
  const exam = await getCustomExamById(examId);
  if (exam && ['completed', 'archived'].includes(exam.status) && submissionType !== 'teacher_forced') {
    return { success: false, error: 'EXAM_CONCLUDED', code: 'EXAM_CONCLUDED' };
  }

  let calculatedScore: number | null = null;
  let correctCount = 0;
  let incorrectCount = 0;
  let accuracy: number | null = null;
  const attemptedCount = Object.keys(answers || {}).length;

  // Grade strictly against known question answer keys if present
  const questionsList = exam?.selected_questions;
  const hasQuestionList = Array.isArray(questionsList) && questionsList.length > 0;
  const allQuestionsHaveKeys = hasQuestionList && questionsList.every((q: any) =>
    q.correct_answer !== undefined || q.correct_option !== undefined
  );

  if (hasQuestionList && allQuestionsHaveKeys) {
    let scoreAcc = 0;
    for (const q of questionsList) {
      const studentAns = answers ? (answers[q.id] ?? answers[String(q.id)] ?? answers[q.question_number]) : undefined;
      const expectedKey = String(q.correct_answer ?? q.correct_option ?? '').trim().toLowerCase();

      if (studentAns !== undefined && studentAns !== null && String(studentAns).trim() !== '') {
        const normalizedStudentAns = String(studentAns).trim().toLowerCase();
        if (normalizedStudentAns === expectedKey) {
          correctCount++;
          scoreAcc += (typeof q.marks === 'number' ? q.marks : 4);
        } else {
          incorrectCount++;
          const negMarks = typeof q.negative_marks === 'number' ? q.negative_marks : 1;
          scoreAcc -= negMarks;
        }
      }
    }
    calculatedScore = Math.max(0, scoreAcc);
    accuracy = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;
  } else {
    // If questions do NOT have trusted answer keys (e.g. subjective questions or unkeyed question set),
    // do NOT fabricate a simulated 75% score. Leave score and accuracy as null (pending teacher grading).
    calculatedScore = null;
    accuracy = null;
  }

  if (isSupabaseConfigured && !isDemoExamId(examId)) {
    try {
      const adminClient = createServiceRoleClient();
      if (!adminClient) {
        console.error('[submitStudentExam] Failed to initialize Supabase admin client');
        return { success: false, error: 'DATABASE_ERROR', code: 'DATABASE_ERROR' };
      }

      // Attempt atomic database RPC submission
      const { data: rpcResult, error: rpcError } = await adminClient.rpc('submit_custom_exam_student', {
        p_exam_id: examId,
        p_student_id: studentId,
        p_answers: answers || {},
        p_submission_type: submissionType,
        p_idempotency_key: idempotencyKey,
        p_actor_id: actorId,
        p_score: calculatedScore,
        p_accuracy: accuracy,
      });

      if (!rpcError && rpcResult) {
        if (rpcResult.success) {
          appendAuditLog({
            exam_id: examId,
            student_id: studentId,
            actor_id: actorId,
            actor_role: submissionType === 'teacher_forced' ? 'teacher' : 'student',
            event_type: 'STUDENT_SUBMITTED',
            event_source: 'exam_workspace',
            metadata: { submission_type: submissionType, score: rpcResult.score, accuracy: rpcResult.accuracy, idempotency_key: idempotencyKey },
          });

          return {
            success: true,
            score: rpcResult.score,
            accuracy: rpcResult.accuracy,
            submitted_at: rpcResult.submitted_at || now,
            idempotent: Boolean(rpcResult.idempotent),
            already_submitted: Boolean(rpcResult.already_submitted),
          };
        }
        return {
          success: false,
          error: rpcResult.error || 'SUBMISSION_REJECTED',
          code: rpcResult.code || rpcResult.error,
          score: rpcResult.score,
          accuracy: rpcResult.accuracy,
          already_submitted: Boolean(rpcResult.already_submitted),
        };
      }

      // Fallback for pre-RPC environments with explicit checks
      if (rpcError && rpcError.code === 'PGRST202') {
        const { data: existing, error: existErr } = await adminClient
          .from('custom_exam_participants')
          .select('is_suspended, exam_status, idempotency_key, final_score, accuracy_percentage, submitted_at')
          .eq('exam_id', examId)
          .eq('student_id', studentId)
          .single();

        if (existErr) {
          console.error('[submitStudentExam] Database query error on participants:', existErr);
          return { success: false, error: 'DATABASE_ERROR', code: 'DATABASE_ERROR' };
        }

        if (existing) {
          if ((existing.is_suspended || existing.exam_status === 'suspended') && submissionType !== 'teacher_forced') {
            return { success: false, error: 'STUDENT_SUSPENDED', code: 'STUDENT_SUSPENDED' };
          }
          if (existing.exam_status === 'submitted') {
            if (idempotencyKey && existing.idempotency_key === idempotencyKey) {
              return {
                success: true,
                score: existing.final_score ?? calculatedScore,
                accuracy: existing.accuracy_percentage ?? accuracy,
                submitted_at: existing.submitted_at ?? now,
                idempotent: true,
                already_submitted: true,
              };
            }
            return {
              success: false,
              error: 'ALREADY_SUBMITTED',
              code: 'ALREADY_SUBMITTED',
              score: existing.final_score ?? undefined,
              accuracy: existing.accuracy_percentage ?? undefined,
              already_submitted: true,
            };
          }
        }

        const { error: updateErr } = await adminClient
          .from('custom_exam_participants')
          .update({
            exam_status: 'submitted',
            submission_type: submissionType,
            submitted_at: now,
            idempotency_key: idempotencyKey,
            questions_attempted: attemptedCount,
            questions_answered: attemptedCount,
            questions_correct: correctCount,
            questions_incorrect: incorrectCount,
            accuracy_percentage: accuracy,
            final_score: calculatedScore,
            updated_at: now,
          })
          .eq('exam_id', examId)
          .eq('student_id', studentId);

        if (updateErr) {
          console.error('[submitStudentExam] Failed to update participant submission:', updateErr);
          return { success: false, error: 'DATABASE_ERROR', code: 'DATABASE_ERROR' };
        }

        const { error: upsertErr } = await adminClient
          .from('custom_exam_submissions')
          .upsert(
            {
              exam_id: examId,
              student_id: studentId,
              answers,
              score: calculatedScore,
              accuracy,
              submission_type: submissionType,
              idempotency_key: idempotencyKey,
              submitted_at: now,
            },
            { onConflict: 'exam_id,student_id' }
          );

        if (upsertErr) {
          console.error('[submitStudentExam] Failed to upsert submission:', upsertErr);
          return { success: false, error: 'DATABASE_ERROR', code: 'DATABASE_ERROR' };
        }

        appendAuditLog({
          exam_id: examId,
          student_id: studentId,
          actor_id: actorId,
          actor_role: submissionType === 'teacher_forced' ? 'teacher' : 'student',
          event_type: 'STUDENT_SUBMITTED',
          event_source: 'exam_workspace',
          metadata: { submission_type: submissionType, score: calculatedScore, accuracy, idempotency_key: idempotencyKey },
        });

        return { success: true, score: calculatedScore, accuracy, submitted_at: now };
      }

      console.error('[submitStudentExam] Database RPC error:', rpcError);
      return { success: false, error: 'DATABASE_ERROR', code: 'DATABASE_ERROR' };
    } catch (err) {
      console.error('[submitStudentExam] Unexpected database error:', err);
      return { success: false, error: 'DATABASE_ERROR', code: 'DATABASE_ERROR' };
    }
  }

  // Local/demo fallback strictly for demo/offline environments
  const localParts = getLocalParticipants();
  const localP = localParts.find((pt) => pt.exam_id === examId && pt.student_id === studentId);
  if (localP) {
    if ((localP.is_suspended || localP.exam_status === 'suspended') && submissionType !== 'teacher_forced') {
      return { success: false, error: 'STUDENT_SUSPENDED', code: 'STUDENT_SUSPENDED' };
    }
    if (localP.exam_status === 'submitted') {
      if (idempotencyKey && (localP as any).idempotency_key === idempotencyKey) {
        return {
          success: true,
          score: localP.final_score ?? calculatedScore,
          accuracy: localP.accuracy_percentage ?? accuracy,
          submitted_at: localP.submitted_at ?? now,
          idempotent: true,
          already_submitted: true,
        };
      }
      return {
        success: false,
        error: 'ALREADY_SUBMITTED',
        code: 'ALREADY_SUBMITTED',
        score: localP.final_score ?? undefined,
        accuracy: localP.accuracy_percentage ?? undefined,
        already_submitted: true,
      };
    }

    localP.exam_status = 'submitted';
    localP.submission_type = submissionType;
    localP.submitted_at = now;
    (localP as any).idempotency_key = idempotencyKey;
    localP.questions_attempted = attemptedCount;
    localP.questions_answered = attemptedCount;
    localP.questions_correct = correctCount;
    localP.questions_incorrect = incorrectCount;
    localP.accuracy_percentage = accuracy;
    localP.final_score = calculatedScore;
    saveLocalParticipants(localParts);
  }

  appendAuditLog({
    exam_id: examId,
    student_id: studentId,
    actor_id: actorId,
    actor_role: submissionType === 'teacher_forced' ? 'teacher' : 'student',
    event_type: 'STUDENT_SUBMITTED',
    event_source: 'exam_workspace',
    metadata: { submission_type: submissionType, score: calculatedScore, accuracy, idempotency_key: idempotencyKey },
  });

  return { success: true, score: calculatedScore, accuracy, submitted_at: now };
}

/**
 * Atomic answer autosave with revision tracking and stale write rejection.
 */
export async function autosaveStudentAnswers(
  examId: string,
  studentId: string,
  answers: Record<string, any>,
  revisionNumber: number
): Promise<{
  success: boolean;
  revision?: number;
  error?: string;
  code?: string;
}> {
  if (!examId || !studentId) {
    return { success: false, error: 'MISSING_PARAMS', code: 'MISSING_PARAMS' };
  }

  if (isSupabaseConfigured && !isDemoExamId(examId)) {
    try {
      const adminClient = createServiceRoleClient();
      if (!adminClient) {
        return { success: false, error: 'DATABASE_ERROR', code: 'DATABASE_ERROR' };
      }

      const { data: rpcResult, error: rpcError } = await adminClient.rpc('autosave_custom_exam_answers', {
        p_exam_id: examId,
        p_student_id: studentId,
        p_answers: answers || {},
        p_client_revision: revisionNumber,
      });

      if (!rpcError && rpcResult) {
        if (rpcResult.success) {
          return { success: true, revision: rpcResult.revision };
        }
        return {
          success: false,
          error: rpcResult.error || 'AUTOSAVE_FAILED',
          code: rpcResult.code || rpcResult.error,
        };
      }

      if (rpcError && rpcError.code === 'PGRST202') {
        const { data: part, error: pErr } = await adminClient
          .from('custom_exam_participants')
          .select('is_suspended, exam_status, answers_revision')
          .eq('exam_id', examId)
          .eq('student_id', studentId)
          .single();

        if (pErr) {
          return { success: false, error: 'DATABASE_ERROR', code: 'DATABASE_ERROR' };
        }

        if (part) {
          if (part.exam_status === 'submitted') {
            return { success: false, error: 'ALREADY_SUBMITTED', code: 'ALREADY_SUBMITTED' };
          }
          if (part.is_suspended || part.exam_status === 'suspended') {
            return { success: false, error: 'STUDENT_SUSPENDED', code: 'STUDENT_SUSPENDED' };
          }
          const currentRev = part.answers_revision || 0;
          if (revisionNumber <= currentRev) {
            return { success: false, error: 'STALE_REVISION', code: 'STALE_REVISION' };
          }
          const boundedRev = revisionNumber > currentRev + 1 ? currentRev + 1 : revisionNumber;
          await adminClient
            .from('custom_exam_participants')
            .update({ answers_revision: boundedRev, updated_at: new Date().toISOString() })
            .eq('exam_id', examId)
            .eq('student_id', studentId);
          return { success: true, revision: boundedRev };
        }
      }

      console.error('[autosaveStudentAnswers] RPC error:', rpcError);
      return { success: false, error: 'DATABASE_ERROR', code: 'DATABASE_ERROR' };
    } catch (err) {
      console.error('[autosaveStudentAnswers] Unexpected database error:', err);
      return { success: false, error: 'DATABASE_ERROR', code: 'DATABASE_ERROR' };
    }
  }

  // Local/demo fallback
  const parts = getLocalParticipants();
  const p = parts.find((pt) => pt.exam_id === examId && pt.student_id === studentId);
  if (p) {
    if (p.exam_status === 'submitted') {
      return { success: false, error: 'ALREADY_SUBMITTED', code: 'ALREADY_SUBMITTED' };
    }
    if (p.is_suspended || p.exam_status === 'suspended') {
      return { success: false, error: 'STUDENT_SUSPENDED', code: 'STUDENT_SUSPENDED' };
    }
    const currentRev = (p as any).answers_revision || 0;
    if (revisionNumber <= currentRev) {
      return { success: false, error: 'STALE_REVISION', code: 'STALE_REVISION' };
    }
    // Bounded revision increment: clamp arbitrary jumps to sequential progression
    const boundedRev = revisionNumber > currentRev + 1 ? currentRev + 1 : revisionNumber;
    (p as any).answers_revision = boundedRev;
    (p as any).draft_answers = answers;
    p.questions_answered = Object.keys(answers || {}).length;
    p.last_heartbeat = new Date().toISOString();
    saveLocalParticipants(parts);
    return { success: true, revision: boundedRev };
  }

  return { success: false, error: 'PARTICIPANT_NOT_FOUND', code: 'PARTICIPANT_NOT_FOUND' };
}

// ─── LIVE SUPERVISION ROOM QUERY & REPORT ───────────────────────────

export async function getExamSupervisionRoomState(examId: string): Promise<{
  exam: CustomExam | null;
  session: ExamSupervisionSession | null;
  participants: CustomExamParticipant[];
  events: ExamSupervisionEvent[];
}> {
  const exam = await getCustomExamById(examId);
  const targetExamIds = Array.from(
    new Set([examId, exam?.id, exam?.exam_code].filter(Boolean) as string[])
  );
  if (
    targetExamIds.some((id) => id.toUpperCase() === 'CE4821' || id === 'demo_exam' || id === 'demo')
  ) {
    if (!targetExamIds.includes('CE4821')) targetExamIds.push('CE4821');
    if (!targetExamIds.includes('demo_exam')) targetExamIds.push('demo_exam');
    if (!targetExamIds.includes('demo')) targetExamIds.push('demo');
  }

  const validUuids = targetExamIds.filter(isValidUuid);

  const [participants, events] = await Promise.all([
    (async () => {
      let sbParticipants: CustomExamParticipant[] = [];
      if (isSupabaseConfigured && validUuids.length > 0) {
        try {
          const adminClient = createServiceRoleClient();
          if (adminClient) {
            const { data } = await adminClient
              .from('custom_exam_participants')
              .select('*')
              .in('exam_id', validUuids)
              .order('joined_at', { ascending: true });
            if (data && data.length > 0) {
              sbParticipants = data as CustomExamParticipant[];
            }
          }
        } catch {}
      }

      const local = getLocalParticipants();
      const localMatched = local.filter(
        (p) =>
          targetExamIds.includes(p.exam_id) ||
          (targetExamIds.includes('demo') && p.exam_id === 'demo_exam') ||
          (targetExamIds.includes('demo_exam') && (p.exam_id === 'demo' || p.exam_id === 'CE4821')) ||
          (targetExamIds.includes('CE4821') && (p.exam_id === 'demo_exam' || p.exam_id === 'CE4821'))
      );

      // Merge and deduplicate by student_id, preferring most recently updated record
      const map = new Map<string, CustomExamParticipant>();
      sbParticipants.forEach((p) => map.set(p.student_id, p));
      localMatched.forEach((p) => {
        const existing = map.get(p.student_id);
        if (!existing || new Date(p.updated_at || p.joined_at) >= new Date(existing.updated_at || existing.joined_at)) {
          map.set(p.student_id, p);
        }
      });
      return Array.from(map.values());
    })(),
    (async () => {
      let sbEvents: ExamSupervisionEvent[] = [];
      if (isSupabaseConfigured && validUuids.length > 0) {
        try {
          const adminClient = createServiceRoleClient();
          if (adminClient) {
            const { data } = await adminClient
              .from('exam_supervision_events')
              .select('*')
              .in('exam_id', validUuids)
              .order('created_at', { ascending: false });
            if (data && data.length > 0) {
              sbEvents = data as ExamSupervisionEvent[];
            }
          }
        } catch {}
      }
      const local = getLocalEvents();
      const localMatched = local.filter((e) => targetExamIds.includes(e.exam_id));
      const seen = new Set<string>();
      const combined = [...sbEvents, ...localMatched].filter((e) => {
        if (!e.id || seen.has(e.id)) return false;
        seen.add(e.id);
        return true;
      });
      return combined;
    })(),
  ]);

  let session: ExamSupervisionSession | null = null;
  if (isSupabaseConfigured) {
    try {
      const adminClient = createServiceRoleClient();
      if (adminClient) {
        const { data } = await adminClient
          .from('exam_supervision_sessions')
          .select('*')
          .eq('exam_id', examId)
          .maybeSingle();
        if (data) session = data as ExamSupervisionSession;
      }
    } catch {}
  }

  if (!session && exam) {
    session = {
      id: `sess_${exam.id}`,
      exam_id: exam.id,
      teacher_id: exam.created_by || 'teacher_system',
      room_id: `room_${exam.exam_code.toLowerCase()}`,
      session_status: exam.status === 'in_progress' ? 'live' : 'lobby',
      started_at: exam.start_time || exam.created_at,
      ended_at: exam.end_time || null,
      active_participant_count: participants.length,
      created_at: exam.created_at,
      updated_at: exam.updated_at,
    };
  }

  return { exam, session, participants, events };
}

export async function generateSupervisionReport(examId: string): Promise<CustomExamReport | null> {
  const room = await getExamSupervisionRoomState(examId);
  if (!room.exam) return null;

  const total = room.participants.length;
  const completed = room.participants.filter((p) => p.exam_status === 'submitted').length;
  const disconnected = room.participants.filter((p) => p.connection_status === 'disconnected').length;
  const warned = room.participants.filter((p) => p.warning_count > 0).length;
  const suspended = room.participants.filter((p) => p.is_suspended).length;

  const scores = room.participants.map((p) => p.final_score ?? p.score_achieved ?? 0);
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

  const accuracies = room.participants.map((p) => p.accuracy_percentage ?? 75);
  const avgAccuracy = accuracies.length > 0 ? accuracies.reduce((a, b) => a + b, 0) / accuracies.length : 0;

  const auditLogs = getServerStore().auditLogs.filter((l) => l.exam_id === room.exam!.id);

  return {
    exam: room.exam,
    session: room.session,
    teacher_info: {
      name: 'Faculty Invigilator',
      id: room.exam.created_by || 'teacher_001',
    },
    total_participants: total,
    completed_count: completed,
    disconnected_count: disconnected,
    warned_count: warned,
    suspended_count: suspended,
    average_score: avgScore,
    average_accuracy: avgAccuracy,
    highest_score: highestScore,
    lowest_score: lowestScore,
    participants: room.participants,
    events: auditLogs,
    generated_at: new Date().toISOString(),
  };
}

export async function getCustomExamReport(codeOrId: string): Promise<CustomExamReport | null> {
  const exam = await getCustomExamByCode(codeOrId) || await getCustomExamById(codeOrId);
  if (!exam) return null;
  return generateSupervisionReport(exam.id);
}
