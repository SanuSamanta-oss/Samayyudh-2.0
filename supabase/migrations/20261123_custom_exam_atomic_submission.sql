-- ============================================================
-- SamayYudh 2.0 — Task 2: Atomic Submission, Concurrency Safety & Reliable Synchronization
-- Migration: 20261123_custom_exam_atomic_submission.sql
-- Status: Local migration file (Unapplied to live database)
-- ============================================================

-- 1. Extend custom_exam_submissions with idempotency, revision, and finalization tracking
ALTER TABLE public.custom_exam_submissions 
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT,
  ADD COLUMN IF NOT EXISTS revision_number INT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS is_final BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS finalized_at TIMESTAMPTZ;

-- Correctly scoped composite unique index: (exam_id, student_id, idempotency_key)
DROP INDEX IF EXISTS public.idx_submissions_idempotency_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_submissions_idempotency_scope 
  ON public.custom_exam_submissions(exam_id, student_id, idempotency_key) 
  WHERE idempotency_key IS NOT NULL;

-- 2. Extend custom_exam_participants with concurrency revision and lock metadata
ALTER TABLE public.custom_exam_participants 
  ADD COLUMN IF NOT EXISTS answers_revision INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS submission_locked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

CREATE INDEX IF NOT EXISTS idx_participants_submission_concurrency 
  ON public.custom_exam_participants(exam_id, student_id, exam_status, is_suspended);

-- ============================================================
-- 3. ATOMIC FINAL SUBMISSION RPC
-- Guarantees single-transaction execution, consistent row locking,
-- idempotency enforcement, and mutual exclusion with concurrent suspension.
-- Strictly callable ONLY by service_role (invoked via Next.js server).
-- ============================================================

CREATE OR REPLACE FUNCTION public.submit_custom_exam_student(
    p_exam_id UUID,
    p_student_id UUID,
    p_answers JSONB,
    p_submission_type VARCHAR(32),
    p_idempotency_key TEXT,
    p_actor_id UUID,
    p_score NUMERIC DEFAULT NULL,
    p_accuracy NUMERIC DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_exam RECORD;
    v_part RECORD;
    v_now TIMESTAMPTZ := NOW();
    v_answered_count INT := 0;
BEGIN
    -- 1. Strict row-locking on custom_exams in consistent order (FOR SHARE)
    SELECT id, status, created_by 
    INTO v_exam
    FROM public.custom_exams
    WHERE id = p_exam_id
    FOR SHARE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'EXAM_NOT_FOUND',
            'code', 'EXAM_NOT_FOUND',
            'message', 'The requested examination does not exist.'
        );
    END IF;

    -- Concluded exam check (teacher_forced is exempted if finalized as part of exam wrap-up)
    IF v_exam.status IN ('completed', 'archived') AND p_submission_type != 'teacher_forced' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'EXAM_CONCLUDED',
            'code', 'EXAM_CONCLUDED',
            'message', 'The examination has concluded and submissions are closed.'
        );
    END IF;

    -- 2. Strict row-locking on custom_exam_participants (FOR UPDATE)
    -- This serializes with any concurrent autosave, suspension, or duplicate submission
    SELECT id, exam_status, is_suspended, suspended_at, suspended_reason,
           idempotency_key, answers_revision, final_score, accuracy_percentage, submitted_at,
           submission_type
    INTO v_part
    FROM public.custom_exam_participants
    WHERE exam_id = p_exam_id AND student_id = p_student_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'PARTICIPANT_NOT_FOUND',
            'code', 'PARTICIPANT_NOT_FOUND',
            'message', 'The student is not an enrolled participant in this examination.'
        );
    END IF;

    -- 3. Idempotency Check: Already submitted?
    IF v_part.exam_status = 'submitted' THEN
        -- Check if this is a safe retry with the same idempotency key
        IF p_idempotency_key IS NOT NULL AND v_part.idempotency_key = p_idempotency_key THEN
            RETURN jsonb_build_object(
                'success', true,
                'already_submitted', true,
                'idempotent', true,
                'score', v_part.final_score,
                'accuracy', v_part.accuracy_percentage,
                'submitted_at', v_part.submitted_at,
                'submission_type', v_part.submission_type
            );
        END IF;

        -- Different request arriving after finalization
        RETURN jsonb_build_object(
            'success', false,
            'error', 'ALREADY_SUBMITTED',
            'code', 'ALREADY_SUBMITTED',
            'already_submitted', true,
            'score', v_part.final_score,
            'accuracy', v_part.accuracy_percentage,
            'submitted_at', v_part.submitted_at,
            'message', 'Examination has already been submitted and finalized.'
        );
    END IF;

    -- 4. Suspension Enforcement
    -- If a suspension committed before this transaction, the student submission must be rejected
    IF v_part.is_suspended = true OR v_part.exam_status = 'suspended' THEN
        IF p_submission_type != 'teacher_forced' THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'STUDENT_SUSPENDED',
                'code', 'STUDENT_SUSPENDED',
                'suspended_at', v_part.suspended_at,
                'suspended_reason', v_part.suspended_reason,
                'message', 'Examination is locked due to active proctoring suspension.'
            );
        END IF;
    END IF;

    -- 5. Calculate answer count safely
    IF p_answers IS NOT NULL AND jsonb_typeof(p_answers) = 'object' THEN
        SELECT count(*) INTO v_answered_count FROM jsonb_object_keys(p_answers);
    ELSE
        v_answered_count := 0;
    END IF;

    -- 6. Persist final answers into custom_exam_submissions atomically
    INSERT INTO public.custom_exam_submissions (
        exam_id,
        student_id,
        answers,
        score,
        accuracy,
        submission_type,
        idempotency_key,
        revision_number,
        is_final,
        submitted_at,
        finalized_at,
        created_at
    ) VALUES (
        p_exam_id,
        p_student_id,
        COALESCE(p_answers, '{}'::jsonb),
        p_score,
        p_accuracy,
        p_submission_type,
        p_idempotency_key,
        COALESCE(v_part.answers_revision, 0) + 1,
        true,
        v_now,
        v_now,
        v_now
    )
    ON CONFLICT (exam_id, student_id) DO UPDATE SET
        answers = EXCLUDED.answers,
        score = EXCLUDED.score,
        accuracy = EXCLUDED.accuracy,
        submission_type = EXCLUDED.submission_type,
        idempotency_key = COALESCE(public.custom_exam_submissions.idempotency_key, EXCLUDED.idempotency_key),
        revision_number = public.custom_exam_submissions.revision_number + 1,
        is_final = true,
        finalized_at = v_now,
        submitted_at = COALESCE(public.custom_exam_submissions.submitted_at, v_now);

    -- 7. Update custom_exam_participants to finalized state
    UPDATE public.custom_exam_participants
    SET exam_status = 'submitted',
        submission_type = p_submission_type,
        submitted_at = v_now,
        submission_locked_at = v_now,
        idempotency_key = p_idempotency_key,
        answers_revision = COALESCE(answers_revision, 0) + 1,
        questions_answered = v_answered_count,
        questions_attempted = v_answered_count,
        final_score = p_score,
        accuracy_percentage = p_accuracy,
        updated_at = v_now
    WHERE exam_id = p_exam_id AND student_id = p_student_id;

    -- 8. Append to immutable supervision audit logs
    INSERT INTO public.supervision_audit_logs (
        exam_id,
        student_id,
        teacher_id,
        event_type,
        actor_id,
        actor_role,
        event_source,
        metadata,
        created_at
    ) VALUES (
        p_exam_id,
        p_student_id,
        NULL,
        'STUDENT_SUBMITTED',
        p_actor_id,
        CASE WHEN p_submission_type = 'teacher_forced' THEN 'teacher' ELSE 'student' END,
        'exam_workspace',
        jsonb_build_object(
            'submission_type', p_submission_type,
            'idempotency_key', p_idempotency_key,
            'score', p_score,
            'accuracy', p_accuracy,
            'submitted_at', v_now
        ),
        v_now
    );

    RETURN jsonb_build_object(
        'success', true,
        'exam_id', p_exam_id,
        'student_id', p_student_id,
        'score', p_score,
        'accuracy', p_accuracy,
        'submission_type', p_submission_type,
        'submitted_at', v_now,
        'idempotent', false,
        'already_submitted', false
    );
END;
$$;

-- ============================================================
-- 4. ATOMIC AUTOSAVE RPC WITH HARDENED REVISION CONTROL
-- Atomically increments server revision or rejects client revision jumps.
-- Strictly callable ONLY by service_role (invoked via Next.js server).
-- ============================================================

CREATE OR REPLACE FUNCTION public.autosave_custom_exam_answers(
    p_exam_id UUID,
    p_student_id UUID,
    p_answers JSONB,
    p_client_revision INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_part RECORD;
    v_now TIMESTAMPTZ := NOW();
    v_answered_count INT := 0;
    v_new_revision INT := 1;
BEGIN
    -- Lock participant record (FOR UPDATE)
    SELECT id, exam_status, is_suspended, answers_revision
    INTO v_part
    FROM public.custom_exam_participants
    WHERE exam_id = p_exam_id AND student_id = p_student_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'PARTICIPANT_NOT_FOUND',
            'code', 'PARTICIPANT_NOT_FOUND'
        );
    END IF;

    -- 1. Never overwrite a finalized submission with autosave
    IF v_part.exam_status = 'submitted' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'ALREADY_SUBMITTED',
            'code', 'ALREADY_SUBMITTED',
            'message', 'Cannot autosave answers for an already finalized examination.'
        );
    END IF;

    -- 2. Reject autosave if participant is suspended
    IF v_part.is_suspended = true OR v_part.exam_status = 'suspended' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'STUDENT_SUSPENDED',
            'code', 'STUDENT_SUSPENDED',
            'message', 'Autosave rejected due to active proctoring suspension.'
        );
    END IF;

    -- 3. Stale revision rejection: client revision cannot be less than or equal to current server revision
    IF p_client_revision <= COALESCE(v_part.answers_revision, 0) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'STALE_REVISION',
            'code', 'STALE_REVISION',
            'server_revision', v_part.answers_revision,
            'client_revision', p_client_revision,
            'message', 'Stale autosave rejected: newer revision already persisted.'
        );
    END IF;

    -- 4. Bounded revision increment: prevent arbitrary revision jumps from poisoning counter
    IF p_client_revision > COALESCE(v_part.answers_revision, 0) + 1 THEN
        -- Reconcile to strict sequential increment
        v_new_revision := COALESCE(v_part.answers_revision, 0) + 1;
    ELSE
        v_new_revision := p_client_revision;
    END IF;

    IF p_answers IS NOT NULL AND jsonb_typeof(p_answers) = 'object' THEN
        SELECT count(*) INTO v_answered_count FROM jsonb_object_keys(p_answers);
    ELSE
        v_answered_count := 0;
    END IF;

    -- Upsert draft answers into custom_exam_submissions
    INSERT INTO public.custom_exam_submissions (
        exam_id,
        student_id,
        answers,
        submission_type,
        revision_number,
        is_final,
        created_at
    ) VALUES (
        p_exam_id,
        p_student_id,
        COALESCE(p_answers, '{}'::jsonb),
        'draft',
        v_new_revision,
        false,
        v_now
    )
    ON CONFLICT (exam_id, student_id) DO UPDATE SET
        answers = EXCLUDED.answers,
        revision_number = EXCLUDED.revision_number
    WHERE public.custom_exam_submissions.is_final = false;

    -- Update participant telemetry and revision
    UPDATE public.custom_exam_participants
    SET answers_revision = v_new_revision,
        questions_answered = v_answered_count,
        last_heartbeat = v_now,
        updated_at = v_now
    WHERE exam_id = p_exam_id AND student_id = p_student_id;

    RETURN jsonb_build_object(
        'success', true,
        'revision', v_new_revision,
        'questions_answered', v_answered_count,
        'saved_at', v_now
    );
END;
$$;

-- ============================================================
-- 5. SUSPENSION COORDINATION UPDATE
-- Coordinates row lock with submit_custom_exam_student
-- Strictly callable ONLY by service_role (invoked via Next.js server).
-- ============================================================

CREATE OR REPLACE FUNCTION public.suspend_custom_exam_student(
    p_exam_id UUID,
    p_student_id UUID,
    p_teacher_id UUID,
    p_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_status TEXT;
BEGIN
    -- Acquire exclusive row lock on participant in identical order
    SELECT exam_status INTO v_status
    FROM public.custom_exam_participants
    WHERE exam_id = p_exam_id AND student_id = p_student_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Participant not found');
    END IF;

    -- Cannot suspend an already submitted exam
    IF v_status = 'submitted' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'ALREADY_SUBMITTED',
            'code', 'ALREADY_SUBMITTED',
            'message', 'Cannot suspend a student who has already submitted the examination.'
        );
    END IF;

    UPDATE public.custom_exam_participants
    SET is_suspended = true,
        exam_status = 'suspended',
        suspended_at = NOW(),
        suspended_reason = p_reason,
        updated_at = NOW()
    WHERE exam_id = p_exam_id AND student_id = p_student_id;

    INSERT INTO public.supervision_audit_logs (
        exam_id, student_id, teacher_id, event_type, actor_id, actor_role, event_source, metadata
    ) VALUES (
        p_exam_id, p_student_id, p_teacher_id, 'STUDENT_SUSPENDED', p_teacher_id, 'teacher', 'control_room',
        jsonb_build_object('reason', p_reason)
    );

    RETURN jsonb_build_object(
        'success', true,
        'exam_id', p_exam_id,
        'student_id', p_student_id,
        'suspended', true
    );
END;
$$;

-- ============================================================
-- 6. STRICT PERMISSIONS: SERVICE-ROLE ONLY EXECUTION
-- Privileged SECURITY DEFINER RPCs are revoked from public, anon, AND authenticated.
-- Only the trusted Next.js server (service_role client) can execute them.
-- ============================================================

REVOKE EXECUTE ON FUNCTION public.submit_custom_exam_student FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_custom_exam_student TO service_role;

REVOKE EXECUTE ON FUNCTION public.autosave_custom_exam_answers FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.autosave_custom_exam_answers TO service_role;

REVOKE EXECUTE ON FUNCTION public.suspend_custom_exam_student FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.suspend_custom_exam_student TO service_role;
