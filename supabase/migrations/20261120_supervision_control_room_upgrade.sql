-- ==============================================================================
-- SAMAYYUDH 2.0 — COMPLETE SUPERVISION CONTROL ROOM UPGRADE MIGRATION
-- File: supabase/migrations/20261120_supervision_control_room_upgrade.sql
-- Architecture: Versioned, Non-Destructive, Multi-Tenant, RLS-Hardened, Append-Only
-- ==============================================================================

-- 1. Ensure UUID generation extension exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Exams Master Table
CREATE TABLE IF NOT EXISTS public.custom_exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_code VARCHAR(12) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    teacher_name VARCHAR(255),
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    total_marks NUMERIC(8, 2) NOT NULL DEFAULT 100.0,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    code_expires_at TIMESTAMPTZ, -- 3-minute post-exam expiration rule
    supervision_enabled BOOLEAN NOT NULL DEFAULT true,
    mic_enabled BOOLEAN NOT NULL DEFAULT false,
    negative_marking BOOLEAN NOT NULL DEFAULT false,
    negative_marking_ratio NUMERIC(4, 2) DEFAULT 0.25,
    randomize_questions BOOLEAN NOT NULL DEFAULT false,
    randomize_options BOOLEAN NOT NULL DEFAULT false,
    max_participants INTEGER NOT NULL DEFAULT 100,
    target_class VARCHAR(100),
    subject VARCHAR(100),
    instructions TEXT,
    selected_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
    question_types JSONB NOT NULL DEFAULT '["MCQ"]'::jsonb,
    status VARCHAR(32) NOT NULL DEFAULT 'waiting', -- draft, published, waiting, in_progress, ending, completed, archived
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for code search and status queries
CREATE INDEX IF NOT EXISTS idx_custom_exams_code ON public.custom_exams(exam_code);
CREATE INDEX IF NOT EXISTS idx_custom_exams_status ON public.custom_exams(status);
CREATE INDEX IF NOT EXISTS idx_custom_exams_creator ON public.custom_exams(created_by);

-- 3. Custom Exam Participants Table
CREATE TABLE IF NOT EXISTS public.custom_exam_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES public.custom_exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    student_lce_code VARCHAR(64) NOT NULL,
    student_email VARCHAR(255),
    student_class VARCHAR(100),
    student_avatar TEXT,
    attempt_id VARCHAR(64) NOT NULL DEFAULT ('att_' || substr(md5(random()::text), 1, 12)),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    connection_status VARCHAR(32) NOT NULL DEFAULT 'connected', -- connected, reconnecting, disconnected
    camera_status VARCHAR(32) NOT NULL DEFAULT 'active', -- active, paused, disabled
    mic_status VARCHAR(32) NOT NULL DEFAULT 'unavailable',
    exam_status VARCHAR(32) NOT NULL DEFAULT 'waiting', -- waiting, in_progress, suspended, submitted, abandoned
    warning_count INTEGER NOT NULL DEFAULT 0,
    is_suspended BOOLEAN NOT NULL DEFAULT false,
    suspended_at TIMESTAMPTZ,
    suspended_reason TEXT,
    time_adjustment_seconds INTEGER NOT NULL DEFAULT 0,
    remaining_seconds_cached INTEGER,
    hand_raised BOOLEAN NOT NULL DEFAULT false,
    hand_raised_at TIMESTAMPTZ,
    current_question_index INTEGER NOT NULL DEFAULT 0,
    questions_answered INTEGER NOT NULL DEFAULT 0,
    questions_attempted INTEGER NOT NULL DEFAULT 0,
    questions_unanswered INTEGER NOT NULL DEFAULT 0,
    questions_correct INTEGER NOT NULL DEFAULT 0,
    questions_incorrect INTEGER NOT NULL DEFAULT 0,
    accuracy_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    final_score NUMERIC(8, 2),
    submission_type VARCHAR(32), -- normal, early_exit, timeout, teacher_forced
    submitted_at TIMESTAMPTZ,
    last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_exam_student UNIQUE(exam_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_participants_exam ON public.custom_exam_participants(exam_id);
CREATE INDEX IF NOT EXISTS idx_participants_student ON public.custom_exam_participants(student_id);
CREATE INDEX IF NOT EXISTS idx_participants_exam_status ON public.custom_exam_participants(exam_id, exam_status);

-- 4. Custom Exam Submissions / Answer Records Table
CREATE TABLE IF NOT EXISTS public.custom_exam_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES public.custom_exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    evaluation_results JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC(8, 2),
    accuracy NUMERIC(5, 2),
    submission_type VARCHAR(32) NOT NULL DEFAULT 'normal',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    evaluated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_submission_exam_student UNIQUE(exam_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_exam ON public.custom_exam_submissions(exam_id);

-- 5. Append-Only Supervision Audit Logs Table
CREATE TABLE IF NOT EXISTS public.supervision_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES public.custom_exams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(64),
    event_type VARCHAR(64) NOT NULL,
    actor_id UUID NOT NULL,
    actor_role VARCHAR(32) NOT NULL, -- teacher, student, system, admin
    event_source VARCHAR(64) NOT NULL DEFAULT 'supervision_room',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_exam ON public.supervision_audit_logs(exam_id);
CREATE INDEX IF NOT EXISTS idx_audit_student ON public.supervision_audit_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_audit_event_type ON public.supervision_audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.supervision_audit_logs(created_at);

-- 6. Individual Student Warnings Table
CREATE TABLE IF NOT EXISTS public.supervision_warnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES public.custom_exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    warning_level VARCHAR(16) NOT NULL DEFAULT 'first', -- first, second, final
    category VARCHAR(64) NOT NULL,
    message TEXT NOT NULL,
    acknowledged BOOLEAN NOT NULL DEFAULT false,
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_warnings_exam_student ON public.supervision_warnings(exam_id, student_id);

-- ==============================================================================
-- ATOMIC STORED PROCEDURES (RPCs)
-- ==============================================================================

-- 7. Atomic Exam Start
CREATE OR REPLACE FUNCTION public.start_custom_exam(
    p_exam_id UUID,
    p_teacher_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_exam RECORD;
    v_start_time TIMESTAMPTZ := NOW();
    v_end_time TIMESTAMPTZ;
BEGIN
    SELECT * INTO v_exam FROM public.custom_exams WHERE id = p_exam_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Examination not found');
    END IF;

    IF v_exam.status = 'in_progress' THEN
        RETURN jsonb_build_object('success', true, 'message', 'Examination already active', 'start_time', v_exam.start_time);
    END IF;

    v_end_time := v_start_time + (v_exam.duration_minutes || ' minutes')::INTERVAL;

    -- Update exam to in_progress
    UPDATE public.custom_exams
    SET status = 'in_progress',
        start_time = v_start_time,
        end_time = v_end_time,
        updated_at = NOW()
    WHERE id = p_exam_id;

    -- Update all joined/waiting participants to in_progress
    UPDATE public.custom_exam_participants
    SET exam_status = 'in_progress',
        updated_at = NOW()
    WHERE exam_id = p_exam_id AND exam_status = 'waiting';

    -- Append audit log
    INSERT INTO public.supervision_audit_logs (exam_id, teacher_id, event_type, actor_id, actor_role, event_source, metadata)
    VALUES (p_exam_id, p_teacher_id, 'EXAM_STARTED', p_teacher_id, 'teacher', 'control_room', jsonb_build_object('start_time', v_start_time, 'end_time', v_end_time));

    RETURN jsonb_build_object(
        'success', true,
        'exam_id', p_exam_id,
        'start_time', v_start_time,
        'end_time', v_end_time
    );
END;
$$;

-- 8. Atomic Student Suspension
CREATE OR REPLACE FUNCTION public.suspend_custom_exam_student(
    p_exam_id UUID,
    p_student_id UUID,
    p_teacher_id UUID,
    p_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.custom_exam_participants
    SET is_suspended = true,
        exam_status = 'suspended',
        suspended_at = NOW(),
        suspended_reason = p_reason,
        updated_at = NOW()
    WHERE exam_id = p_exam_id AND student_id = p_student_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Participant not found');
    END IF;

    INSERT INTO public.supervision_audit_logs (exam_id, student_id, teacher_id, event_type, actor_id, actor_role, event_source, metadata)
    VALUES (p_exam_id, p_student_id, p_teacher_id, 'STUDENT_SUSPENDED', p_teacher_id, 'teacher', jsonb_build_object('reason', p_reason));

    RETURN jsonb_build_object('success', true, 'exam_id', p_exam_id, 'student_id', p_student_id, 'suspended', true);
END;
$$;

-- 9. Atomic Student Resumption
CREATE OR REPLACE FUNCTION public.resume_custom_exam_student(
    p_exam_id UUID,
    p_student_id UUID,
    p_teacher_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.custom_exam_participants
    SET is_suspended = false,
        exam_status = 'in_progress',
        suspended_at = NULL,
        suspended_reason = NULL,
        updated_at = NOW()
    WHERE exam_id = p_exam_id AND student_id = p_student_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Participant not found');
    END IF;

    INSERT INTO public.supervision_audit_logs (exam_id, student_id, teacher_id, event_type, actor_id, actor_role, event_source, metadata)
    VALUES (p_exam_id, p_student_id, p_teacher_id, 'STUDENT_RESUMED', p_teacher_id, 'teacher', '{}'::jsonb);

    RETURN jsonb_build_object('success', true, 'exam_id', p_exam_id, 'student_id', p_student_id, 'resumed', true);
END;
$$;

-- 10. Atomic Individual Time Adjustment (+/- seconds)
CREATE OR REPLACE FUNCTION public.adjust_student_exam_time(
    p_exam_id UUID,
    p_student_id UUID,
    p_teacher_id UUID,
    p_seconds INTEGER,
    p_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_adj INTEGER;
    v_event_type VARCHAR(32);
BEGIN
    SELECT time_adjustment_seconds INTO v_current_adj
    FROM public.custom_exam_participants
    WHERE exam_id = p_exam_id AND student_id = p_student_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Participant not found');
    END IF;

    UPDATE public.custom_exam_participants
    SET time_adjustment_seconds = time_adjustment_seconds + p_seconds,
        updated_at = NOW()
    WHERE exam_id = p_exam_id AND student_id = p_student_id;

    v_event_type := CASE WHEN p_seconds >= 0 THEN 'TIME_EXTENDED' ELSE 'TIME_REDUCED' END;

    INSERT INTO public.supervision_audit_logs (exam_id, student_id, teacher_id, event_type, actor_id, actor_role, event_source, metadata)
    VALUES (p_exam_id, p_student_id, p_teacher_id, v_event_type, p_teacher_id, 'teacher', jsonb_build_object('delta_seconds', p_seconds, 'reason', p_reason));

    RETURN jsonb_build_object('success', true, 'student_id', p_student_id, 'new_total_adjustment', (v_current_adj + p_seconds));
END;
$$;

-- 11. Atomic Hand Raise Lifecycle
CREATE OR REPLACE FUNCTION public.raise_hand_custom_exam(
    p_exam_id UUID,
    p_student_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.custom_exam_participants
    SET hand_raised = true,
        hand_raised_at = NOW(),
        updated_at = NOW()
    WHERE exam_id = p_exam_id AND student_id = p_student_id;

    INSERT INTO public.supervision_audit_logs (exam_id, student_id, event_type, actor_id, actor_role, event_source, metadata)
    VALUES (p_exam_id, p_student_id, 'HAND_RAISED', p_student_id, 'student', 'exam_workspace', '{}'::jsonb);

    RETURN jsonb_build_object('success', true, 'student_id', p_student_id, 'hand_raised', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.acknowledge_hand_custom_exam(
    p_exam_id UUID,
    p_student_id UUID,
    p_teacher_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.custom_exam_participants
    SET hand_raised = false,
        updated_at = NOW()
    WHERE exam_id = p_exam_id AND student_id = p_student_id;

    INSERT INTO public.supervision_audit_logs (exam_id, student_id, teacher_id, event_type, actor_id, actor_role, event_source, metadata)
    VALUES (p_exam_id, p_student_id, p_teacher_id, 'HAND_ACKNOWLEDGED', p_teacher_id, 'teacher', '{}'::jsonb);

    RETURN jsonb_build_object('success', true, 'student_id', p_student_id, 'hand_raised', false);
END;
$$;

-- 12. Atomic Exam End Workflow with 3-Minute Expiration Rule
CREATE OR REPLACE FUNCTION public.end_custom_exam(
    p_exam_id UUID,
    p_teacher_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_end_time TIMESTAMPTZ := NOW();
    v_code_expires TIMESTAMPTZ := NOW() + INTERVAL '3 minutes';
BEGIN
    -- Transition exam to completed, set 3-minute post-exam expiration metadata
    UPDATE public.custom_exams
    SET status = 'completed',
        end_time = v_end_time,
        code_expires_at = v_code_expires,
        updated_at = NOW()
    WHERE id = p_exam_id;

    -- Lock and submit any remaining in_progress participants as teacher_forced
    UPDATE public.custom_exam_participants
    SET exam_status = 'submitted',
        submission_type = 'teacher_forced',
        submitted_at = v_end_time,
        updated_at = NOW()
    WHERE exam_id = p_exam_id AND exam_status IN ('in_progress', 'waiting', 'suspended');

    INSERT INTO public.supervision_audit_logs (exam_id, teacher_id, event_type, actor_id, actor_role, event_source, metadata)
    VALUES (p_exam_id, p_teacher_id, 'EXAM_ENDED', p_teacher_id, 'teacher', 'control_room', jsonb_build_object('end_time', v_end_time, 'code_expires_at', v_code_expires));

    RETURN jsonb_build_object(
        'success', true,
        'exam_id', p_exam_id,
        'end_time', v_end_time,
        'code_expires_at', v_code_expires
    );
END;
$$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.custom_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_exam_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervision_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervision_warnings ENABLE ROW LEVEL SECURITY;

-- Custom Exams RLS
DROP POLICY IF EXISTS "Anyone authenticated can view active or published custom exams" ON public.custom_exams;
CREATE POLICY "Anyone authenticated can view active or published custom exams"
    ON public.custom_exams FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Teachers can create custom exams" ON public.custom_exams;
CREATE POLICY "Teachers can create custom exams"
    ON public.custom_exams FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Teachers can update their own custom exams" ON public.custom_exams;
CREATE POLICY "Teachers can update their own custom exams"
    ON public.custom_exams FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by);

-- Participants RLS
DROP POLICY IF EXISTS "Participants can view exam participants" ON public.custom_exam_participants;
CREATE POLICY "Participants can view exam participants"
    ON public.custom_exam_participants FOR SELECT
    TO authenticated
    USING (
        student_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.custom_exams ce
            WHERE ce.id = custom_exam_participants.exam_id AND ce.created_by = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Students can join custom exams" ON public.custom_exam_participants;
CREATE POLICY "Students can join custom exams"
    ON public.custom_exam_participants FOR INSERT
    TO authenticated
    WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Teachers and students can update participants appropriately" ON public.custom_exam_participants;
CREATE POLICY "Teachers and students can update participants appropriately"
    ON public.custom_exam_participants FOR UPDATE
    TO authenticated
    USING (
        student_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.custom_exams ce
            WHERE ce.id = custom_exam_participants.exam_id AND ce.created_by = auth.uid()
        )
    );

-- Audit Logs RLS (Strict Append-Only: No UPDATE, No DELETE for anyone except Service Role)
DROP POLICY IF EXISTS "Authorized users can view audit logs" ON public.supervision_audit_logs;
CREATE POLICY "Authorized users can view audit logs"
    ON public.supervision_audit_logs FOR SELECT
    TO authenticated
    USING (
        student_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.custom_exams ce
            WHERE ce.id = supervision_audit_logs.exam_id AND ce.created_by = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON public.supervision_audit_logs;
CREATE POLICY "Authenticated users can insert audit logs"
    ON public.supervision_audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (actor_id = auth.uid());

-- Prevent any UPDATE or DELETE on audit logs for authenticated users
-- (PostgreSQL default denies when no UPDATE/DELETE policy is granted)
