// ============================================================
// SamayYudh 2.0 — AI Remote Proctoring & Live Supervision Types
// ============================================================

export type ProctoringEventType =
  | 'camera_connected'
  | 'camera_disconnected'
  | 'permission_revoked'
  | 'tab_switched'
  | 'tab_restored'
  | 'fullscreen_exited'
  | 'fullscreen_entered'
  | 'network_offline'
  | 'network_online'
  | 'warning_received'
  | 'session_paused'
  | 'session_resumed';

export type ProctoringEventSeverity = 'info' | 'warning' | 'critical';

export interface ProctoringConfig {
  id?: string;
  exam_code?: string;
  classroom_id?: string | null;
  live_video_enabled: boolean;
  parent_stream_enabled: boolean;
  calculator_enabled: boolean;
  fullscreen_enforced: boolean;
  tab_switch_limit: number;
  record_session: boolean;
}

export interface ProctoringSession {
  id: string;
  exam_session_id: string;
  student_id: string;
  student_name?: string;
  student_email?: string;
  student_avatar?: string | null;
  classroom_id?: string | null;
  classroom_name?: string | null;
  exam_code: string;
  exam_title: string;
  status: 'active' | 'paused' | 'completed' | 'terminated';
  camera_active: boolean;
  connection_status: 'connected' | 'reconnecting' | 'disconnected';
  current_question_index: number;
  questions_answered: number;
  total_questions: number;
  started_at: string;
  ended_at?: string | null;
  last_heartbeat: string;
  flags_count?: number;
  duration_seconds?: number;
}

export interface ProctoringEvent {
  id: string;
  session_id: string;
  student_id: string;
  event_type: ProctoringEventType;
  severity: ProctoringEventSeverity;
  details: Record<string, unknown>;
  created_at: string;
}

export interface ProctoringIntervention {
  id: string;
  session_id: string;
  teacher_id: string;
  teacher_name?: string;
  student_id: string;
  action: 'warning' | 'pause' | 'resume' | 'message';
  message: string;
  acknowledged_at?: string | null;
  created_at: string;
}

export interface ParentStudentLink {
  id: string;
  parent_id: string;
  student_id: string;
  student_name?: string;
  student_email?: string;
  student_avatar?: string | null;
  link_code?: string;
  status: 'pending' | 'active' | 'revoked';
  created_at: string;
  active_session?: ProctoringSession | null;
}

export interface WebRTCSignalingMessage {
  type: 'viewer_join' | 'offer' | 'answer' | 'ice_candidate' | 'heartbeat' | 'intervention' | 'event';
  sessionId: string;
  senderId: string;
  senderRole: 'student' | 'teacher' | 'parent';
  targetId?: string;
  payload?: any;
}
