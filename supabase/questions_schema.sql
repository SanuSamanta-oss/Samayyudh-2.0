-- ============================================================
-- SamayYudh 2.0 — Questions Table Schema
-- Run in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  question_number INT NOT NULL,
  question_text TEXT NOT NULL,
  exam_code TEXT NOT NULL,
  exam_category TEXT NOT NULL DEFAULT 'ENGINEERING',
  subject TEXT NOT NULL,
  topic TEXT NOT NULL DEFAULT 'General',
  subtopic TEXT,
  marks INT NOT NULL DEFAULT 1,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  recommended_minutes INT NOT NULL DEFAULT 2,
  question_type TEXT NOT NULL DEFAULT 'mcq',
  options JSONB,
  correct_answer JSONB,
  expected_points TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  model_answer TEXT DEFAULT '',
  evaluation_rubric TEXT DEFAULT '',
  year TEXT DEFAULT '2024',
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for high-speed practice filtering
CREATE INDEX IF NOT EXISTS idx_questions_exam_code ON public.questions(exam_code);
CREATE INDEX IF NOT EXISTS idx_questions_category ON public.questions(exam_category);
CREATE INDEX IF NOT EXISTS idx_questions_subject ON public.questions(subject);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_type ON public.questions(question_type);

-- Row Level Security
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to question bank
CREATE POLICY "Anyone can view questions"
  ON public.questions FOR SELECT
  USING (true);

-- Allow service role / admin full write access
CREATE POLICY "Admins can modify questions"
  ON public.questions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
