-- ============================================================
-- SamayYudh 2.0 — Supabase Database Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- ====================
-- 1. PROFILES TABLE
-- ====================
-- Automatically created when a user signs up via a trigger

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  display_name TEXT DEFAULT '',
  avatar_url TEXT,
  total_questions_attempted INT DEFAULT 0,
  total_sessions INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ====================
-- 2. USER EXAM PROFILES
-- ====================

CREATE TABLE IF NOT EXISTS public.user_exam_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_code TEXT NOT NULL,
  target_date DATE,
  target_score INT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_exam_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own exam profiles"
  ON public.user_exam_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ====================
-- 3. EXAM SESSIONS
-- ====================

CREATE TABLE IF NOT EXISTS public.exam_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  exam_code TEXT NOT NULL,
  mode TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'setup',
  total_questions INT NOT NULL,
  total_marks INT NOT NULL,
  duration_seconds INT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  current_question_index INT DEFAULT 0,
  evaluation_status TEXT DEFAULT 'not_started',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sessions"
  ON public.exam_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index for fast session lookups
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.exam_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.exam_sessions(status);

-- ====================
-- 4. ANSWERS
-- ====================

CREATE TABLE IF NOT EXISTS public.answers (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answer_text TEXT DEFAULT '',
  selected_option TEXT,
  selected_options TEXT[],
  word_count INT DEFAULT 0,
  character_count INT DEFAULT 0,
  started_at TIMESTAMPTZ,
  last_saved_at TIMESTAMPTZ DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  time_spent_seconds INT DEFAULT 0,
  status TEXT DEFAULT 'not_visited'
);

ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own answers"
  ON public.answers FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_answers_session ON public.answers(session_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON public.answers(question_id);

-- ====================
-- 5. EVALUATIONS
-- ====================

CREATE TABLE IF NOT EXISTS public.evaluations (
  id UUID PRIMARY KEY,
  answer_id UUID NOT NULL REFERENCES public.answers(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score NUMERIC(5,2) NOT NULL,
  max_score NUMERIC(5,2) NOT NULL,
  percentage NUMERIC(5,2) NOT NULL,
  correctness TEXT NOT NULL,
  time_assessment TEXT NOT NULL,
  word_count INT DEFAULT 0,
  ideal_word_range JSONB DEFAULT '{"min": 0, "max": 0}',
  actual_time_seconds INT DEFAULT 0,
  recommended_time_seconds INT DEFAULT 0,
  over_explaining BOOLEAN DEFAULT false,
  under_explaining BOOLEAN DEFAULT false,
  missing_points TEXT[] DEFAULT '{}',
  incorrect_points TEXT[] DEFAULT '{}',
  strengths TEXT[] DEFAULT '{}',
  improvements TEXT[] DEFAULT '{}',
  shorter_exam_version TEXT DEFAULT '',
  corrected_answer TEXT DEFAULT '',
  examiner_feedback TEXT DEFAULT '',
  confidence NUMERIC(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own evaluations"
  ON public.evaluations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_evaluations_answer ON public.evaluations(answer_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_question ON public.evaluations(question_id);

-- ====================
-- 6. STICKY NOTES
-- ====================

CREATE TABLE IF NOT EXISTS public.sticky_notes (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  session_id UUID NOT NULL REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.sticky_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notes"
  ON public.sticky_notes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notes_session ON public.sticky_notes(session_id);

-- ====================
-- 7. USER PROGRESS
-- ====================

CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_code TEXT NOT NULL,
  total_questions_attempted INT DEFAULT 0,
  total_questions_correct INT DEFAULT 0,
  average_score NUMERIC(5,2) DEFAULT 0,
  average_time_efficiency NUMERIC(5,2) DEFAULT 0,
  strongest_topic TEXT,
  weakest_topic TEXT,
  half_centuries INT DEFAULT 0,
  centuries INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, exam_code)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own progress"
  ON public.user_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ====================
-- 8. MILESTONES
-- ====================

CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  achieved_at TIMESTAMPTZ DEFAULT now(),
  session_id UUID REFERENCES public.exam_sessions(id) ON DELETE SET NULL
);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own milestones"
  ON public.milestones FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ====================
-- 9. STORAGE BUCKET (for answer images)
-- ====================

INSERT INTO storage.buckets (id, name, public)
VALUES ('answer-images', 'answer-images', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'answer-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'answer-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'answer-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ====================
-- 10. AUTO-CREATE PROFILE ON SIGNUP (Trigger)
-- ====================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================
-- 11. ENABLE REALTIME
-- ====================

ALTER PUBLICATION supabase_realtime ADD TABLE public.exam_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.answers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.evaluations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_progress;
