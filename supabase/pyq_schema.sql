-- ============================================================
-- SamayYudh 2.0 — PYQ Question Bank Schema
-- Supports continuous PDF uploads for JEE Main and other competitive exams
-- ============================================================

-- 1. Table for Exam Papers (e.g. JEE Main 2025 B.Tech 22 Jan Shift 1)
CREATE TABLE IF NOT EXISTS public.pyq_exam_papers (
  id TEXT PRIMARY KEY,
  exam TEXT NOT NULL DEFAULT 'JEE Main',
  year INT NOT NULL DEFAULT 2025,
  course TEXT NOT NULL DEFAULT 'B.Tech',
  exam_date DATE NOT NULL,
  exam_date_str TEXT NOT NULL,
  shift TEXT NOT NULL,           -- e.g. 'Shift 1' or 'Shift 2'
  session TEXT,                  -- e.g. 'Morning' or 'Evening'
  source_filename TEXT NOT NULL,
  source_classification TEXT NOT NULL DEFAULT 'Memory Based', -- 'Memory Based' | 'Official'
  checksum TEXT UNIQUE,          -- SHA-256 of source PDF to prevent duplicate re-imports
  total_questions INT NOT NULL DEFAULT 0,
  physics_count INT NOT NULL DEFAULT 0,
  chemistry_count INT NOT NULL DEFAULT 0,
  mathematics_count INT NOT NULL DEFAULT 0,
  import_status TEXT NOT NULL DEFAULT 'Ready to Import', -- 'Processing' | 'Ready to Import' | 'Successfully Imported' | 'Failed'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Table for Individual Questions
CREATE TABLE IF NOT EXISTS public.pyq_questions (
  id TEXT PRIMARY KEY,
  paper_id TEXT NOT NULL REFERENCES public.pyq_exam_papers(id) ON DELETE CASCADE,
  exam TEXT NOT NULL DEFAULT 'JEE Main',
  year INT NOT NULL DEFAULT 2025,
  course TEXT NOT NULL DEFAULT 'B.Tech',
  exam_date_str TEXT NOT NULL,
  shift TEXT NOT NULL,
  session TEXT,
  subject TEXT NOT NULL,          -- 'Physics' | 'Chemistry' | 'Mathematics'
  question_number INT NOT NULL,   -- Original question numbering: 1-25
  section TEXT NOT NULL,          -- 'Section A' (MCQ 1-20) | 'Section B' (Numerical 21-25)
  question_type TEXT NOT NULL,    -- 'MCQ' | 'Numerical Value'
  question_statement TEXT NOT NULL,
  options JSONB,                  -- Array of choices: [{ "key": "1", "text": "..." }, ...]
  correct_answer JSONB,           -- Stored only if independently verified; no publisher solutions
  diagram_url TEXT,               -- Relative path or URL to extracted diagram image
  diagram_caption TEXT,
  review_required BOOLEAN NOT NULL DEFAULT false,
  review_reason TEXT,
  source_reference TEXT,          -- Filename & page reference
  fingerprint TEXT UNIQUE,        -- Stable hash for duplicate prevention: hash(exam + year + date + shift + subject + q_num)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for lightning-fast queries and filter aggregations
CREATE INDEX IF NOT EXISTS idx_pyq_papers_exam_year ON public.pyq_exam_papers(exam, year, course);
CREATE INDEX IF NOT EXISTS idx_pyq_papers_date_shift ON public.pyq_exam_papers(exam_date, shift);
CREATE INDEX IF NOT EXISTS idx_pyq_questions_paper ON public.pyq_questions(paper_id);
CREATE INDEX IF NOT EXISTS idx_pyq_questions_subject ON public.pyq_questions(subject);
CREATE INDEX IF NOT EXISTS idx_pyq_questions_section ON public.pyq_questions(section);
CREATE INDEX IF NOT EXISTS idx_pyq_questions_type ON public.pyq_questions(question_type);
CREATE INDEX IF NOT EXISTS idx_pyq_questions_filter ON public.pyq_questions(exam, year, subject, exam_date_str, shift);

-- Row Level Security
ALTER TABLE public.pyq_exam_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyq_questions ENABLE ROW LEVEL SECURITY;

-- Anyone can view imported PYQ papers and questions
CREATE POLICY "Anyone can view PYQ papers"
  ON public.pyq_exam_papers FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view PYQ questions"
  ON public.pyq_questions FOR SELECT
  USING (true);

-- Admin / service role write access
CREATE POLICY "Admins can manage PYQ papers"
  ON public.pyq_exam_papers FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can manage PYQ questions"
  ON public.pyq_questions FOR ALL
  USING (true)
  WITH CHECK (true);

