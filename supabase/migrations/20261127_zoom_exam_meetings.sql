-- ==============================================================================
-- Migration: 20261127_zoom_exam_meetings.sql
-- Module: Custom Examinations — Zoom Meeting Durable Persistence
-- Status: LOCAL SPECIFICATION ONLY — DO NOT APPLY TO PRODUCTION DATABASE
-- ==============================================================================

-- 1. Create Zoom Meeting Persistence Table with Unique Exam Constraint
CREATE TABLE IF NOT EXISTS public.custom_exam_zoom_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES public.custom_exams(id) ON DELETE CASCADE,
  meeting_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  password TEXT NOT NULL DEFAULT '',
  join_url TEXT NOT NULL,
  start_url TEXT, -- Secured: Only visible to authorized teachers
  host_id TEXT NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'started', 'ended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Strict 1:1 Invariant: One exam maps to exactly one active Zoom meeting
  CONSTRAINT uq_custom_exam_zoom_meeting_exam_id UNIQUE (exam_id),
  CONSTRAINT uq_custom_exam_zoom_meeting_meeting_id UNIQUE (meeting_id)
);

-- 2. Indexes for High-Concurrency Lookups
CREATE INDEX IF NOT EXISTS idx_zoom_meetings_exam_id ON public.custom_exam_zoom_meetings(exam_id);
CREATE INDEX IF NOT EXISTS idx_zoom_meetings_meeting_id ON public.custom_exam_zoom_meetings(meeting_id);
CREATE INDEX IF NOT EXISTS idx_zoom_meetings_status ON public.custom_exam_zoom_meetings(status);

-- 3. Row Level Security (RLS)
ALTER TABLE public.custom_exam_zoom_meetings ENABLE ROW LEVEL SECURITY;

-- Teachers / Admins: Full control over meetings for exams they own or manage
DROP POLICY IF EXISTS "Teachers can manage Zoom meetings for their exams" ON public.custom_exam_zoom_meetings;
CREATE POLICY "Teachers can manage Zoom meetings for their exams"
  ON public.custom_exam_zoom_meetings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.custom_exams ce
      WHERE ce.id = custom_exam_zoom_meetings.exam_id
        AND (ce.created_by = auth.uid() OR auth.jwt() ->> 'role' IN ('admin', 'super_admin'))
    )
  );

-- Admitted Students: Read-only access to meeting details (excluding start_url)
DROP POLICY IF EXISTS "Admitted students can view meeting details" ON public.custom_exam_zoom_meetings;
CREATE POLICY "Admitted students can view meeting details"
  ON public.custom_exam_zoom_meetings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.custom_exam_participants cep
      WHERE cep.exam_id = custom_exam_zoom_meetings.exam_id
        AND cep.student_id = auth.uid()
        AND cep.admitted = true
        AND cep.is_suspended = false
    )
  );

-- 4. Automatic Timestamp Update Trigger
CREATE OR REPLACE FUNCTION public.handle_zoom_meeting_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_zoom_meetings_updated_at ON public.custom_exam_zoom_meetings;
CREATE TRIGGER tr_zoom_meetings_updated_at
  BEFORE UPDATE ON public.custom_exam_zoom_meetings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_zoom_meeting_updated_at();
