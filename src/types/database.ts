// ============================================================
// SamayYudh 2.0 — Core Database Types (Multi-Exam Platform)
// ============================================================

// --- Exam Categories & Configuration ---

export type ExamCategoryCode =
  | 'ENGINEERING_ENTRANCE'
  | 'ENGINEERING'
  | 'STATE_ENTRANCE'
  | 'CIVIL_SERVICES'
  | 'UNIVERSITY'
  | 'COMPETITIVE'
  | 'MEDICAL'
  | 'MANAGEMENT'
  | 'LAW'
  | 'SCHOOL'
  | 'PROFESSIONAL'
  | 'CUSTOM';

export interface ExamCategory {
  code: ExamCategoryCode;
  name: string;
  description: string;
  icon: string;
  exams: ExamConfig[];
}

export interface ExamConfig {
  id: string;
  exam_code: string;
  exam_name: string;
  category: ExamCategoryCode;
  description: string;
  icon: string;
  duration_seconds: number;
  total_questions: number;
  total_marks: number;
  negative_marking: boolean;
  marking_rules: MarkingRule[];
  question_types: QuestionType[];
  subjects: string[];
  sections: ExamSection[];
  time_rules: MarkTimeRule[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExamSection {
  id: string;
  name: string;
  subject: string;
  question_count: number;
  marks: number;
  duration_seconds?: number;
}

export interface MarkingRule {
  question_type: QuestionType;
  correct_marks: number;
  negative_marks: number;
  partial_marking: boolean;
}

// --- Question System ---

export type QuestionType =
  | 'mcq'
  | 'msq'
  | 'numerical'
  | 'short_answer'
  | 'long_answer'
  | 'descriptive'
  | 'essay'
  | 'true_false'
  | 'fill_blank'
  | 'match_following'
  | 'code'
  | 'custom';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  question_number: number;
  question_text: string;
  exam_category: ExamCategoryCode;
  exam_code: string;
  subject: string;
  topic: string;
  subtopic?: string;
  question_type: QuestionType;
  marks: number;
  difficulty: Difficulty;
  recommended_minutes: number;
  expected_points: string[];
  keywords: string[];
  model_answer: string;
  evaluation_rubric: string;
  // For objective questions
  options?: QuestionOption[];
  correct_answer?: string | string[];
  // Metadata
  year?: string;
  source?: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface QuestionTopic {
  id: string;
  exam_code: string;
  subject: string;
  topic: string;
  description: string;
}

export interface MarkTimeRule {
  id: string;
  marks: number;
  time_seconds: number;
  label: string;
}

// --- Exam System ---

export type ExamMode =
  | 'quick_battle'
  | 'practice_battle'
  | 'half_century'
  | 'full_century'
  | 'custom'
  | 'full_exam'
  | 'timed_practice'
  | 'topic_practice'
  | 'section_practice'
  | 'previous_year'
  | 'mock_test'
  | 'speed_battle';

export type ExamStatus = 'setup' | 'in_progress' | 'paused' | 'completed' | 'submitted' | 'evaluated';

export type EvaluationStatus = 'not_started' | 'in_progress' | 'completed' | 'failed';

export interface ExamSession {
  id: string;
  user_id: string;
  title: string;
  exam_code: string;
  mode: ExamMode;
  status: ExamStatus;
  total_questions: number;
  total_marks: number;
  duration_seconds: number;
  started_at: string;
  ends_at: string;
  completed_at: string | null;
  current_question_index: number;
  evaluation_status: EvaluationStatus;
  created_at: string;
}

export interface ExamSessionQuestion {
  id: string;
  session_id: string;
  question_id: string;
  question_order: number;
  question: Question;
}

// --- Answer System ---

export type AnswerStatus = 'not_visited' | 'visited' | 'in_progress' | 'answered' | 'flagged' | 'submitted';

export interface Answer {
  id: string;
  session_id: string;
  question_id: string;
  user_id: string;
  answer_text: string;
  selected_option?: string;
  selected_options?: string[];
  word_count: number;
  character_count: number;
  started_at: string | null;
  last_saved_at: string;
  submitted_at: string | null;
  time_spent_seconds: number;
  status: AnswerStatus;
}

// --- AI Evaluation ---

export type CorrectnessLevel = 'correct' | 'mostly_correct' | 'partially_correct' | 'incorrect';
export type TimeAssessment = 'too_fast' | 'on_time' | 'slightly_slow' | 'too_slow';

export interface AnswerEvaluation {
  id: string;
  answer_id: string;
  question_id: string;
  score: number;
  max_score: number;
  percentage: number;
  correctness: CorrectnessLevel;
  time_assessment: TimeAssessment;
  word_count: number;
  ideal_word_range: { min: number; max: number };
  actual_time_seconds: number;
  recommended_time_seconds: number;
  over_explaining: boolean;
  under_explaining: boolean;
  missing_points: string[];
  incorrect_points: string[];
  strengths: string[];
  improvements: string[];
  shorter_exam_version: string;
  corrected_answer: string;
  examiner_feedback: string;
  confidence: number;
  created_at: string;
}

// --- Sticky Notes ---

export interface StickyNote {
  id: string;
  user_id: string;
  question_id: string;
  session_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// --- User ---

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  display_name: string;
  avatar_url: string | null;
  total_questions_attempted: number;
  total_sessions: number;
  created_at: string;
  updated_at: string;
}

export interface UserExamProfile {
  id: string;
  user_id: string;
  exam_code: string;
  target_date?: string;
  target_score?: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

// --- Progress & Milestones ---

export type MilestoneType = 'half_century' | 'century' | 'streak' | 'speed_demon' | 'perfect_score';

export interface UserProgress {
  id: string;
  user_id: string;
  exam_code: string;
  total_questions_attempted: number;
  total_questions_correct: number;
  average_score: number;
  average_time_efficiency: number;
  strongest_topic: string | null;
  weakest_topic: string | null;
  half_centuries: number;
  centuries: number;
  updated_at: string;
}

export interface Milestone {
  id: string;
  user_id: string;
  type: MilestoneType;
  title: string;
  description: string;
  achieved_at: string;
  session_id: string | null;
}

// --- UI Types ---

export interface ExamDurationOption {
  label: string;
  minutes: number;
  seconds: number;
}

export interface ExamModeConfig {
  mode: ExamMode;
  label: string;
  description: string;
  questionCount: number;
  icon: string;
}

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}
