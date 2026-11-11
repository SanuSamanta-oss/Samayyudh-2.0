// ============================================================
// SamayYudh 2.0 — Global Admin & Teacher Command Center Types
// ============================================================

export type CommandRole = 'super_admin' | 'admin' | 'teacher' | 'student';

export type AdminSectionId =
  | 'overview'
  | 'questions'
  | 'resources'
  | 'assignments'
  | 'classrooms'
  | 'students'
  | 'connections'
  | 'analytics'
  | 'notifications'
  | 'settings';

export type ExtendedQuestionType =
  | 'mcq'
  | 'msq'
  | 'numerical'
  | 'integer'
  | 'assertion_reason'
  | 'match_following'
  | 'true_false'
  | 'short_answer'
  | 'long_answer'
  | 'descriptive'
  | 'diagram_based'
  | 'case_based';

export type QuestionStatus = 'draft' | 'published' | 'private' | 'archived';

export interface CommandQuestion {
  id: string;
  question_number: number;
  title?: string;
  question_text: string;
  exam_category: string;
  exam_code: string;
  subject: string;
  chapter: string;
  topic: string;
  subtopic?: string;
  question_type: ExtendedQuestionType;
  marks: number;
  negative_marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  recommended_minutes: number;
  options?: { id: string; text: string; is_correct: boolean }[];
  correct_answer?: string | string[];
  model_answer: string;
  solution_steps?: string;
  evaluation_rubric: string;
  expected_points: string[];
  keywords: string[];
  case_passage?: string;
  diagram_url?: string;
  year?: string;
  exam_shift?: string;
  source?: string;
  tags: string[];
  visibility: 'public' | 'classroom' | 'private';
  status: QuestionStatus;
  author_id?: string | null;
  is_static?: boolean;
  created_at: string;
  updated_at: string;
}

export type ResourceCategory =
  | 'question_paper'
  | 'pyq_paper'
  | 'mcq_sheet'
  | 'assignment'
  | 'cheat_sheet'
  | 'formula_sheet'
  | 'study_notes'
  | 'solutions'
  | 'reference_pdf'
  | 'practice_worksheet'
  | 'other';

export type ResourceVisibility = 'personal' | 'classroom' | 'group' | 'public';
export type VisibilityScope = ResourceVisibility;

export interface GlobalSearchResult {
  id: string;
  category: 'questions' | 'resources' | 'assignments' | 'classrooms' | 'groups' | 'students';
  title: string;
  subtitle: string;
  section: AdminSectionId;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  subject: string;
  exam_code: string;
  chapter: string;
  topic: string;
  academic_year: string;
  file_name: string;
  file_path: string;
  bucket_id: string;
  file_size: number;
  mime_type: string;
  visibility: ResourceVisibility;
  classroom_id?: string | null;
  group_id?: string | null;
  assignment_id?: string | null;
  tags: string[];
  uploaded_by: string;
  uploader_name?: string;
  signed_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DirectoryUser {
  user_id: string;
  public_id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
  institution?: string;
  preferred_exam?: string;
  subjects?: string[];
  role: CommandRole;
  account_status?: 'active' | 'suspended' | 'archived';
  visibility_level?: 'public' | 'connections' | 'private';
  connection_status?: 'none' | 'pending_sent' | 'pending_received' | 'connected' | 'blocked';
  created_at?: string;
  // Extra fields ONLY populated when viewer is super_admin / authorized teacher
  academic_summary?: {
    total_sessions: number;
    questions_attempted: number;
    average_score: number;
    classrooms_count: number;
  };
}

export interface ConnectionRequestItem {
  id: string;
  sender_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  message?: string;
  created_at: string;
  peer?: DirectoryUser;
}

export interface ClassroomItem {
  id: string;
  name: string;
  description: string;
  subject: string;
  exam_category: string;
  academic_year: string;
  teacher_id: string;
  teacher_name?: string;
  avatar_url?: string;
  visibility: 'private' | 'invite_only' | 'public';
  status: 'active' | 'archived';
  member_count: number;
  assignment_count: number;
  active_invite_code?: string | null;
  invite_expires_at?: string | null;
  invitations?: {
    id: string;
    invite_code: string;
    status: string;
    max_uses: number | null;
    uses_count: number;
    expires_at: string | null;
  }[];
  members?: {
    id: string;
    user_id: string;
    member_role: string;
    joined_at: string;
    profile?: {
      display_name: string;
      public_id: string;
      username?: string | null;
    } | null;
  }[];
  announcements?: {
    id: string;
    title: string;
    body: string;
    created_at: string;
  }[];
  created_at: string;
}

export interface StudentGroupItem {
  id: string;
  classroom_id?: string | null;
  classroom_name?: string;
  teacher_id: string;
  name: string;
  description: string;
  is_private: boolean;
  member_ids: string[];
  members?: DirectoryUser[];
  created_at: string;
}

export interface AssignmentItem {
  id: string;
  title: string;
  description: string;
  teacher_id: string;
  classroom_id?: string | null;
  classroom_name?: string;
  group_id?: string | null;
  group_name?: string;
  resource_id?: string | null;
  max_marks: number;
  start_at: string;
  due_at?: string | null;
  time_limit_minutes: number;
  attempts_allowed: number;
  negative_marking: boolean;
  submission_type: 'mcq' | 'pdf' | 'descriptive' | 'mixed';
  late_submission_policy: 'disallow' | 'allow_marked' | 'allow_full';
  status: 'draft' | 'published' | 'archived';
  question_ids?: string[];
  question_count?: number;
  submission_count?: number;
  submissions?: AssignmentSubmissionItem[];
  stats?: {
    total_assigned: number;
    submitted: number;
    late: number;
    evaluated: number;
    average_score: number;
  };
  created_at: string;
}

export interface AssignmentSubmissionItem {
  id: string;
  assignment_id: string;
  student_id: string;
  student_name?: string;
  student_public_id?: string;
  status: 'in_progress' | 'submitted' | 'late' | 'evaluated';
  score?: number | null;
  max_score?: number | null;
  feedback?: string;
  submitted_at: string;
}

export interface CommandNotification {
  id: string;
  category:
    | 'connection_request'
    | 'connection_accepted'
    | 'classroom_invite'
    | 'assignment_published'
    | 'resource_shared'
    | 'system'
    | 'security';
  title: string;
  body: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  actor_id?: string | null;
  actor_role: string;
  action: string;
  target_type?: string | null;
  target_id?: string | null;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface ExtractedPdfQuestionDraft {
  temp_id: string;
  selected: boolean;
  question_text: string;
  question_type: ExtendedQuestionType;
  options: { id: string; text: string; is_correct: boolean }[];
  correct_answer?: string | string[];
  model_answer: string;
  exam_code: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  negative_marks?: number;
  confidence?: number;
  needs_review?: boolean;
  has_diagram_hint?: boolean;
}

export interface AdminOverviewPayload {
  role: CommandRole;
  schema_ready: boolean;
  stats: {
    total_students: number;
    total_teachers: number;
    total_questions: number;
    custom_questions: number;
    builtin_questions: number;
    total_resources: number;
    total_assignments: number;
    active_classrooms: number;
    pending_connections: number;
    recent_uploads_7d: number;
  };
  activity_feed: {
    id: string;
    type: string;
    title: string;
    subtitle: string;
    timestamp: string;
  }[];
  recent_resources: ResourceItem[];
  recent_audit: AuditLogEntry[];
  notifications: CommandNotification[];
  health: {
    schema_ready: boolean;
    passkey_configured: boolean;
    has_service_role: boolean;
    gemini_configured: boolean;
  };
  charts: {
    growth_series: { label: string; sessions: number; questions_added: number }[];
    subject_distribution: { subject: string; count: number }[];
  };
}
