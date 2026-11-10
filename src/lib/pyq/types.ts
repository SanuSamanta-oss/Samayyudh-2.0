// ============================================================
// SamayYudh 2.0 — PYQ Question Bank Types
// ============================================================

export type PyqSubject = 'Physics' | 'Chemistry' | 'Mathematics';
export type PyqSection = 'Section A' | 'Section B';
export type PyqQuestionType = 'MCQ' | 'Numerical Value';
export type PyqImportStatus = 'Processing' | 'Ready to Import' | 'Successfully Imported' | 'Duplicate Detected' | 'Failed';

export interface PyqOption {
  key: string; // '1' | '2' | '3' | '4'
  text: string;
  diagram_url?: string;
}

export interface PyqExamPaper {
  id: string;
  exam: string;                  // 'JEE Main'
  year: number;                  // 2025
  course: string;                // 'B.Tech'
  exam_date: string;             // '2025-01-22'
  exam_date_str: string;         // '22 January 2025'
  shift: string;                 // 'Shift 1' | 'Shift 2'
  session?: string;              // 'Morning' | 'Evening'
  source_filename: string;
  source_classification: string; // 'Memory Based' | 'Official'
  checksum?: string;             // SHA-256
  total_questions: number;
  physics_count: number;
  chemistry_count: number;
  mathematics_count: number;
  import_status: PyqImportStatus;
  created_at: string;
  updated_at?: string;
}

export interface PyqQuestion {
  id: string;
  paper_id: string;
  exam: string;                  // 'JEE Main'
  year: number;                  // 2025
  course: string;                // 'B.Tech'
  exam_date_str: string;         // '22 January 2025'
  shift: string;                 // 'Shift 1' | 'Shift 2'
  session?: string;              // 'Morning' | 'Evening'
  subject: PyqSubject;
  chapter?: string;
  question_number: number;       // 1 - 25
  section: PyqSection;           // 'Section A' | 'Section B'
  question_type: PyqQuestionType;// 'MCQ' | 'Numerical Value'
  question_statement: string;
  options?: PyqOption[];
  correct_option?: string;
  explanation?: string;
  correct_answer?: {
    value: string;               // e.g. '2' for MCQ or numeric string
    is_verified: boolean;
  };
  diagram_url?: string;
  diagram_caption?: string;
  is_placeholder?: boolean;
  clean_source?: string;
  review_required: boolean;
  review_reason?: string;
  source_reference: string;
  fingerprint: string;
  created_at: string;
}

export interface PyqStats {
  totalQuestions: number;
  totalPapers: number;
  availableDates: string[];
  availableShifts: string[];
  physicsCount: number;
  chemistryCount: number;
  mathematicsCount: number;
  byDate: Record<string, number>;
  byShift: Record<string, number>;
}

export interface PyqFilterParams {
  exam?: string;
  year?: number;
  course?: string;
  subject?: PyqSubject | 'All';
  chapter?: string;
  date?: string;
  shift?: string;
  section?: PyqSection | 'All';
  questionType?: PyqQuestionType | 'All';
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

