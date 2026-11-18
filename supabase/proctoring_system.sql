-- ============================================================
-- SamayYudh 2.0 — AI-Assisted Remote Proctoring & Live Exam
-- Supervision System Database Migration
-- Idempotent: Extends existing tables, preserves user data & sessions.
-- ============================================================

-- ============================================================
-- 1. PROCTORING CONFIGURATIONS
-- Controls live supervision policies per exam, category, or classroom
-- ============================================================
CREATE TABLE IF NOT EXISTS public.proctoring_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_code TEXT,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
  live_video_enabled BOOLEAN NOT NULL DEFAULT true,
  parent_stream_enabled BOOLEAN NOT NULL DEFAULT true,
  calculator_enabled BOOLEAN NOT NULL DEFAULT true,
  fullscreen_enforced BOOLEAN NOT NULL DEFAULT false,
  tab_switch_limit INT NOT NULL DEFAULT 3,
  record_session BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_proctoring_configs_exam_code ON public.proctoring_configs(exam_code);
CREATE INDEX IF NOT EXISTS idx_proctoring_configs_classroom_id ON public.proctoring_configs(classroom_id);

ALTER TABLE public.proctoring_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view proctoring configs" ON public.proctoring_configs;
CREATE POLICY "Public can view proctoring configs"
  ON public.proctoring_configs FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Teachers and admins manage configs" ON public.proctoring_configs;
CREATE POLICY "Teachers and admins manage configs"
  ON public.proctoring_configs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin', 'teacher')
    )
  );

-- ============================================================
-- 2. PROCTORING SESSIONS
-- Tracks active live proctoring sessions for students
-- ============================================================
CREATE TABLE IF NOT EXISTS public.proctoring_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_session_id TEXT NOT NULL UNIQUE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE SET NULL,
  exam_code TEXT NOT NULL,
  exam_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'terminated')),
  camera_active BOOLEAN NOT NULL DEFAULT true,
  connection_status TEXT NOT NULL DEFAULT 'connected' CHECK (connection_status IN ('connected', 'reconnecting', 'disconnected')),
  current_question_index INT NOT NULL DEFAULT 0,
  questions_answered INT NOT NULL DEFAULT 0,
  total_questions INT NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_proctoring_sessions_student_id ON public.proctoring_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_proctoring_sessions_status ON public.proctoring_sessions(status);
CREATE INDEX IF NOT EXISTS idx_proctoring_sessions_classroom_id ON public.proctoring_sessions(classroom_id);
CREATE INDEX IF NOT EXISTS idx_proctoring_sessions_heartbeat ON public.proctoring_sessions(last_heartbeat);

ALTER TABLE public.proctoring_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view and update their own proctoring sessions" ON public.proctoring_sessions;
CREATE POLICY "Students can view and update their own proctoring sessions"
  ON public.proctoring_sessions FOR ALL
  USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Teachers and Admins can view active proctoring sessions" ON public.proctoring_sessions;
CREATE POLICY "Teachers and Admins can view active proctoring sessions"
  ON public.proctoring_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin', 'teacher')
    )
  );

-- ============================================================
-- 3. PROCTORING EVENTS
-- Chronological event log for telemetry (tab blur, camera state, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.proctoring_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.proctoring_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'camera_connected',
    'camera_disconnected',
    'permission_revoked',
    'tab_switched',
    'tab_restored',
    'fullscreen_exited',
    'fullscreen_entered',
    'network_offline',
    'network_online',
    'warning_received',
    'session_paused',
    'session_resumed'
  )),
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_proctoring_events_session_id ON public.proctoring_events(session_id);
CREATE INDEX IF NOT EXISTS idx_proctoring_events_student_id ON public.proctoring_events(student_id);
CREATE INDEX IF NOT EXISTS idx_proctoring_events_event_type ON public.proctoring_events(event_type);
CREATE INDEX IF NOT EXISTS idx_proctoring_events_created_at ON public.proctoring_events(created_at);

ALTER TABLE public.proctoring_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can create events for their sessions" ON public.proctoring_events;
CREATE POLICY "Students can create events for their sessions"
  ON public.proctoring_events FOR INSERT
  WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Students can view events for their sessions" ON public.proctoring_events;
CREATE POLICY "Students can view events for their sessions"
  ON public.proctoring_events FOR SELECT
  USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Teachers and Admins can view all proctoring events" ON public.proctoring_events;
CREATE POLICY "Teachers and Admins can view all proctoring events"
  ON public.proctoring_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin', 'teacher')
    )
  );

-- ============================================================
-- 4. PROCTORING INTERVENTIONS
-- Teacher actions (warning, pause, message) sent to a live examinee
-- ============================================================
CREATE TABLE IF NOT EXISTS public.proctoring_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.proctoring_sessions(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('warning', 'pause', 'resume', 'message')),
  message TEXT NOT NULL,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_proctoring_interventions_session_id ON public.proctoring_interventions(session_id);
CREATE INDEX IF NOT EXISTS idx_proctoring_interventions_student_id ON public.proctoring_interventions(student_id);

ALTER TABLE public.proctoring_interventions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Teachers can create interventions" ON public.proctoring_interventions;
CREATE POLICY "Teachers can create interventions"
  ON public.proctoring_interventions FOR INSERT
  WITH CHECK (
    teacher_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin', 'teacher')
    )
  );

DROP POLICY IF EXISTS "Involved parties can view interventions" ON public.proctoring_interventions;
CREATE POLICY "Involved parties can view interventions"
  ON public.proctoring_interventions FOR SELECT
  USING (
    student_id = auth.uid() OR
    teacher_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- ============================================================
-- 5. PARENT-STUDENT RELATIONSHIPS
-- Secure link between parent user accounts and student accounts
-- ============================================================
CREATE TABLE IF NOT EXISTS public.parent_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  link_code TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_parent_student_link UNIQUE (parent_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_parent_student_links_parent_id ON public.parent_student_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_links_student_id ON public.parent_student_links(student_id);

ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents can view their student links" ON public.parent_student_links;
CREATE POLICY "Parents can view their student links"
  ON public.parent_student_links FOR SELECT
  USING (parent_id = auth.uid() OR student_id = auth.uid());

DROP POLICY IF EXISTS "Parents can manage their student links" ON public.parent_student_links;
CREATE POLICY "Parents can manage their student links"
  ON public.parent_student_links FOR ALL
  USING (parent_id = auth.uid());

-- Allow parents to view proctoring sessions for their linked children
DROP POLICY IF EXISTS "Parents can view linked child proctoring sessions" ON public.proctoring_sessions;
CREATE POLICY "Parents can view linked child proctoring sessions"
  ON public.proctoring_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.parent_student_links
      WHERE parent_id = auth.uid() AND student_id = public.proctoring_sessions.student_id AND status = 'active'
    )
  );
