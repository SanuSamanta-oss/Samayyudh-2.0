-- ============================================================
-- SamayYudh 2.0 — Smart Exam Invitations & Deep Linking Schema
-- Versioned Migration: 20261122_smart_exam_invitations.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS public.custom_exam_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES public.custom_exams(id) ON DELETE CASCADE,
  invitation_code TEXT NOT NULL UNIQUE,
  token_hash TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  expires_at TIMESTAMPTZ,
  max_uses INT DEFAULT NULL,
  use_count INT NOT NULL DEFAULT 0,
  access_restrictions JSONB NOT NULL DEFAULT '{}'::jsonb,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invitations_code ON public.custom_exam_invitations(invitation_code);
CREATE INDEX IF NOT EXISTS idx_invitations_exam ON public.custom_exam_invitations(exam_id);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.custom_exam_invitations(status);

-- Enable RLS
ALTER TABLE public.custom_exam_invitations ENABLE ROW LEVEL SECURITY;

-- Allow students to read active invitations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'custom_exam_invitations' 
    AND policyname = 'Anyone can view active invitations'
  ) THEN
    CREATE POLICY "Anyone can view active invitations"
      ON public.custom_exam_invitations
      FOR SELECT
      USING (status = 'active');
  END IF;
END $$;

-- Allow teachers and super admins to manage invitations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'custom_exam_invitations' 
    AND policyname = 'Teachers can manage their own invitations'
  ) THEN
    CREATE POLICY "Teachers can manage their own invitations"
      ON public.custom_exam_invitations
      FOR ALL
      USING (auth.uid() = created_by);
  END IF;
END $$;
