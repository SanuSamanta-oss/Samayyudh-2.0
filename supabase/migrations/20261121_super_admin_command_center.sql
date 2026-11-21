-- ============================================================
-- SamayYudh 2.0 — Super Admin Examination Command Center Migration
-- Migration: 20261121_super_admin_command_center.sql
-- ============================================================

-- 1. Ensure assigned_teacher columns exist on custom_exams
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'custom_exams' AND column_name = 'assigned_teacher_id'
  ) THEN
    ALTER TABLE custom_exams ADD COLUMN assigned_teacher_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'custom_exams' AND column_name = 'assigned_teacher_name'
  ) THEN
    ALTER TABLE custom_exams ADD COLUMN assigned_teacher_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'custom_exams' AND column_name = 'assigned_teacher_email'
  ) THEN
    ALTER TABLE custom_exams ADD COLUMN assigned_teacher_email text;
  END IF;
END $$;

-- 2. Create teacher_communications table
CREATE TABLE IF NOT EXISTS teacher_communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id text REFERENCES custom_exams(id) ON DELETE SET NULL,
  teacher_id text NOT NULL,
  teacher_email text NOT NULL,
  teacher_name text,
  sender_id text,
  sender_email text,
  subject text NOT NULL,
  category text NOT NULL DEFAULT 'general' CHECK (category IN ('exam_issue', 'schedule_notice', 'supervision_clarification', 'compliance_warning', 'general')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  message text NOT NULL,
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('queued', 'sent', 'delivered', 'failed')),
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teacher_comms_teacher_id ON teacher_communications(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_comms_exam_id ON teacher_communications(exam_id);
CREATE INDEX IF NOT EXISTS idx_teacher_comms_created_at ON teacher_communications(created_at DESC);

-- 3. Create supervision_issues table
CREATE TABLE IF NOT EXISTS supervision_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id text REFERENCES custom_exams(id) ON DELETE CASCADE,
  teacher_id text,
  student_id text,
  student_name text,
  category text NOT NULL DEFAULT 'other' CHECK (category IN ('technical_glitch', 'proctoring_violation', 'disconnection', 'time_dispute', 'cheating_flag', 'other')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'waiting_teacher', 'resolved', 'closed')),
  assigned_to text,
  resolution_notes text,
  created_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_supervision_issues_exam_id ON supervision_issues(exam_id);
CREATE INDEX IF NOT EXISTS idx_supervision_issues_status ON supervision_issues(status);
CREATE INDEX IF NOT EXISTS idx_supervision_issues_created_at ON supervision_issues(created_at DESC);

-- 4. Enable RLS and setup permissive platform-wide policies
ALTER TABLE teacher_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervision_issues ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'teacher_communications' AND policyname = 'Allow service role and admins full access on teacher_communications'
  ) THEN
    CREATE POLICY "Allow service role and admins full access on teacher_communications"
      ON teacher_communications
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'supervision_issues' AND policyname = 'Allow service role and admins full access on supervision_issues'
  ) THEN
    CREATE POLICY "Allow service role and admins full access on supervision_issues"
      ON supervision_issues
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
