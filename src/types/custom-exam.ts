// ============================================================
// SamayYudh 2.0 — Custom Exam & Live Supervision Types
// ============================================================

export type CustomExamStatus = 'draft' | 'published' | 'in_progress' | 'completed' | 'archived';

export type ParticipantConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';
export type ParticipantCameraStatus = 'active' | 'paused' | 'disabled';
export type ParticipantExamStatus = 'waiting' | 'in_progress' | 'suspended' | 'submitted' | 'abandoned';

export type WarningLevel = 'first' | 'second' | 'final';

export type WarningReasonCode =
  | 'looking_away'
  | 'multiple_people'
  | 'suspicious_movement'
  | 'camera_obstruction'
  | 'leaving_screen'
  | 'audio_detected'
  | 'other';

export const WARNING_REASONS: { code: WarningReasonCode; label: string; defaultNote: string }[] = [
  {
    code: 'looking_away',
    label: 'Repeatedly looking away from screen',
    defaultNote: 'Please keep your visual focus on the exam screen at all times.',
  },
  {
    code: 'multiple_people',
    label: 'Another person visible in camera',
    defaultNote: 'Only the enrolled candidate is permitted in the testing space.',
  },
  {
    code: 'suspicious_movement',
    label: 'Suspicious movement detected',
    defaultNote: 'Maintain a stable posture and avoid unusual hand movements.',
  },
  {
    code: 'camera_obstruction',
    label: 'Camera feed obstructed or poor lighting',
    defaultNote: 'Ensure your full face is illuminated and clearly visible in the camera frame.',
  },
  {
    code: 'leaving_screen',
    label: 'Leaving the examination screen / Tab switched',
    defaultNote: 'Switching away from the examination window is strictly prohibited.',
  },
  {
    code: 'other',
    label: 'Other suspicious activity',
    defaultNote: 'Please comply with all examination regulations immediately.',
  },
];

export interface CustomExam {
  id: string;
  exam_code: string; // CE4821
  title: string;
  description: string | null;
  created_by: string | null;
  duration_minutes: number;
  total_marks: number;
  start_time: string | null;
  end_time: string | null;
  supervision_enabled: boolean;
  mic_enabled: boolean;
  negative_marking: boolean;
  question_types: string[];
  max_participants: number;
  instructions: string | null;
  selected_questions: any[];
  subjects: string[];
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
  attempt_id: string;
  joined_at: string;
  connection_status: ParticipantConnectionStatus;
  camera_status: ParticipantCameraStatus;
  exam_status: ParticipantExamStatus;
  warning_count: number;
  is_suspended: boolean;
  suspended_at: string | null;
  suspended_reason: string | null;
  current_question_index: number;
  questions_answered: number;
  score_achieved?: number;
  last_heartbeat: string;
  updated_at: string;
}

export interface ExamSupervisionEvent {
  id: string;
  exam_id: string;
  student_id: string;
  teacher_id: string;
  event_type: 'warning' | 'suspend' | 'restore' | 'tab_switch' | 'camera_off' | 'message' | 'exam_ended' | 'heartbeat';
  warning_level?: WarningLevel;
  reason: string;
  description?: string;
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
  duration_minutes?: number;
  total_marks?: number;
  start_time?: string;
  end_time?: string;
  supervision_enabled?: boolean;
  mic_enabled?: boolean;
  negative_marking?: boolean;
  question_types?: string[];
  max_participants?: number;
  instructions?: string;
  subjects?: string[];
  selected_questions?: any[];
}

export interface TeacherSupervisionActionPayload {
  exam_id: string;
  student_id: string;
  action: 'warning' | 'suspend' | 'restore' | 'message' | 'end_student_exam';
  warning_level?: WarningLevel;
  reason?: string;
  note?: string;
}

export interface CustomExamReport {
  exam: CustomExam;
  session: ExamSupervisionSession | null;
  teacher_info: {
    name: string;
    id: string;
  };
  total_participants: number;
  completed_count: number;
  disconnected_count: number;
  warned_count: number;
  suspended_count: number;
  participants: CustomExamParticipant[];
  events: ExamSupervisionEvent[];
  generated_at: string;
}
