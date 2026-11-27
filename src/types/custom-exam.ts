// ============================================================
// SamayYudh 2.0 — Custom Exam & Live Supervision Types
// Production Architecture conforming to Master Upgrade Spec
// ============================================================

export type CustomExamStatus = 'draft' | 'published' | 'waiting' | 'in_progress' | 'ending' | 'completed' | 'archived';

export type ParticipantConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';
export type ParticipantCameraStatus = 'active' | 'paused' | 'disabled';
export type ParticipantExamStatus = 'waiting' | 'in_progress' | 'suspended' | 'submitted' | 'abandoned';

export type WarningLevel = 'first' | 'second' | 'final';

export type WarningReasonCode =
  | 'camera_disabled'
  | 'disconnected'
  | 'suspicious_activity'
  | 'exam_rule_violation'
  | 'looking_away'
  | 'multiple_people'
  | 'suspicious_movement'
  | 'camera_obstruction'
  | 'leaving_screen'
  | 'audio_detected'
  | 'other';

export const WARNING_CATEGORIES: { code: WarningReasonCode; label: string; defaultNote: string }[] = [
  {
    code: 'camera_disabled',
    label: 'Camera Feed Disabled / Obstructed',
    defaultNote: 'Your camera feed is inactive. Please ensure your camera is turned on and unobstructed.',
  },
  {
    code: 'disconnected',
    label: 'Network / Stream Disconnected',
    defaultNote: 'A connection drop was detected. Please check your internet connection.',
  },
  {
    code: 'suspicious_activity',
    label: 'Suspicious Behavior / Looking Away',
    defaultNote: 'Suspicious head/eye movements detected. Please keep your focus directly on the exam.',
  },
  {
    code: 'exam_rule_violation',
    label: 'Examination Rule Violation',
    defaultNote: 'Violation of examination code of conduct. Further infractions will result in immediate suspension.',
  },
  {
    code: 'leaving_screen',
    label: 'Tab Switched / Screen Blurred',
    defaultNote: 'Leaving the examination window is strictly recorded and prohibited.',
  },
  {
    code: 'multiple_people',
    label: 'Multiple Faces / Additional Person',
    defaultNote: 'Another individual was detected in your camera frame. Only the candidate is permitted.',
  },
  {
    code: 'other',
    label: 'Other Proctor Advisory',
    defaultNote: 'Please comply with all supervisory instructions immediately.',
  },
];

export const WARNING_REASONS = WARNING_CATEGORIES;

export type SupervisionAuditEventType =
  | 'EXAM_CREATED'
  | 'EXAM_UPDATED'
  | 'EXAM_CODE_GENERATED'
  | 'QR_GENERATED'
  | 'STUDENT_JOINED'
  | 'STUDENT_READY'
  | 'EXAM_STARTED'
  | 'CAMERA_PERMISSION_GRANTED'
  | 'CAMERA_PERMISSION_DENIED'
  | 'CAMERA_DISCONNECTED'
  | 'CAMERA_RECONNECTED'
  | 'STUDENT_WARNED'
  | 'STUDENT_SUSPENDED'
  | 'STUDENT_RESUMED'
  | 'TIME_REDUCED'
  | 'TIME_EXTENDED'
  | 'ANSWER_SAVED'
  | 'QUESTION_VISITED'
  | 'HAND_RAISED'
  | 'HAND_ACKNOWLEDGED'
  | 'STUDENT_ADMITTED'
  | 'STUDENTS_ALL_ADMITTED'
  | 'STUDENT_SUBMITTED'
  | 'STUDENT_DISCONNECTED'
  | 'STUDENT_RECONNECTED'
  | 'EXAM_ENDED'
  | 'ACCESS_CODE_EXPIRED'
  | 'REPORT_GENERATED';

export interface CustomExam {
  id: string;
  exam_code: string; // e.g. CE4892
  title: string;
  description: string | null;
  created_by: string | null;
  duration_minutes: number;
  total_marks: number;
  start_time: string | null;
  end_time: string | null;
  code_expires_at: string | null; // 3-minute post-exam expiration rule
  supervision_enabled: boolean;
  mic_enabled: boolean;
  negative_marking: boolean;
  question_types: string[];
  max_participants: number;
  target_class?: string | null;
  subject?: string | null;
  instructions: string | null;
  selected_questions: any[];
  subjects: string[];
  randomize_questions?: boolean;
  randomize_options?: boolean;
  status: CustomExamStatus;
  created_at: string;
  updated_at: string;
}

export interface CustomExamParticipant {
  id: string;
  exam_id: string;
  student_id: string;
  student_name: string;
  student_lce_code: string;
  student_email: string | null;
  student_class?: string | null;
  student_avatar?: string | null;
  attempt_id: string;
  joined_at: string;
  connection_status: ParticipantConnectionStatus;
  camera_status: ParticipantCameraStatus;
  mic_status?: 'active' | 'muted' | 'unavailable';
  exam_status: ParticipantExamStatus;
  admitted?: boolean;
  warning_count: number;
  is_suspended: boolean;
  suspended_at: string | null;
  suspended_reason: string | null;
  time_adjustment_seconds: number;
  remaining_seconds_cached: number | null;
  hand_raised: boolean;
  hand_raised_at: string | null;
  current_question_index: number;
  questions_answered: number;
  questions_attempted: number;
  questions_unanswered: number;
  questions_correct: number;
  questions_incorrect: number;
  accuracy_percentage: number | null;
  final_score: number | null;
  submission_type?: 'normal' | 'early_exit' | 'timeout' | 'teacher_forced' | null;
  submitted_at?: string | null;
  submission_locked_at?: string | null;
  idempotency_key?: string | null;
  answers_revision?: number;
  score_achieved?: number;
  last_heartbeat: string;
  updated_at: string;
}

export interface SupervisionAuditLog {
  id: string;
  exam_id: string;
  student_id?: string | null;
  teacher_id?: string | null;
  session_id?: string | null;
  event_type: SupervisionAuditEventType;
  actor_id: string;
  actor_role: 'teacher' | 'student' | 'system' | 'admin';
  event_source: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ExamSupervisionEvent {
  id: string;
  exam_id: string;
  student_id: string;
  teacher_id: string;
  event_type: 'warning' | 'suspend' | 'restore' | 'time_adjustment' | 'hand_raised' | 'hand_acknowledged' | 'tab_switch' | 'camera_off' | 'message' | 'exam_ended' | 'heartbeat';
  warning_level?: WarningLevel;
  reason: string;
  description?: string;
  time_adjustment_seconds?: number;
  details?: Record<string, any>;
  created_at: string;
}

export interface ExamSupervisionSession {
  id: string;
  exam_id: string;
  teacher_id: string;
  room_id: string;
  session_status: 'lobby' | 'live' | 'paused' | 'ended';
  started_at: string | null;
  ended_at: string | null;
  active_participant_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomExamInput {
  title: string;
  description?: string;
  target_class?: string;
  subject?: string;
  duration_minutes?: number;
  total_marks?: number;
  start_time?: string;
  end_time?: string;
  supervision_enabled?: boolean;
  mic_enabled?: boolean;
  negative_marking?: boolean;
  randomize_questions?: boolean;
  randomize_options?: boolean;
  question_types?: string[];
  max_participants?: number;
  instructions?: string;
  subjects?: string[];
  selected_questions?: any[];
}

export interface TeacherSupervisionActionPayload {
  exam_id: string;
  student_id: string;
  action: 'warning' | 'suspend' | 'restore' | 'time_adjustment' | 'acknowledge_hand' | 'message' | 'end_student_exam' | 'approve' | 'approve_all' | 'admit' | 'admit_all';
  warning_level?: WarningLevel;
  reason?: string;
  note?: string;
  time_adjustment_seconds?: number; // +/- seconds
}

export interface CustomExamReport {
  exam: CustomExam;
  session: ExamSupervisionSession | null;
  teacher_info: {
    name: string;
    id: string;
    email?: string;
  };
  total_participants: number;
  completed_count: number;
  disconnected_count: number;
  warned_count: number;
  suspended_count: number;
  average_score: number;
  average_accuracy: number;
  highest_score: number;
  lowest_score: number;
  participants: CustomExamParticipant[];
  events: SupervisionAuditLog[];
  generated_at: string;
}

export type InvitationStatus = 'active' | 'revoked' | 'expired';

export interface CustomExamInvitation {
  id: string;
  exam_id: string;
  invitation_code: string;
  token_hash?: string | null;
  created_by?: string | null;
  status: InvitationStatus;
  expires_at?: string | null;
  max_uses?: number | null;
  use_count: number;
  access_restrictions?: Record<string, any>;
  revoked_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvitationValidationResult {
  valid: boolean;
  status: 'valid' | 'expired' | 'revoked' | 'not_found' | 'already_submitted' | 'not_started' | 'ended' | 'full';
  message: string;
  exam?: {
    id: string;
    exam_code: string;
    title: string;
    description?: string | null;
    subject?: string | null;
    target_class?: string | null;
    duration_minutes: number;
    total_marks: number;
    start_time?: string | null;
    end_time?: string | null;
    supervision_enabled: boolean;
    mic_enabled: boolean;
    negative_marking: boolean;
    instructions?: string | null;
    status: CustomExamStatus;
    total_questions: number;
    teacher_name?: string | null;
    institution_name?: string | null;
  } | null;
  invitation?: {
    code: string;
    expires_at?: string | null;
  } | null;
  student_status?: {
    is_authenticated: boolean;
    student_id?: string | null;
    already_submitted: boolean;
    is_suspended: boolean;
  };
}

