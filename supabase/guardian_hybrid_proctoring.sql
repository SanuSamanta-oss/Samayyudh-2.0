-- ============================================================
-- SamayYudh 2.0 — Guardian Connect & Hybrid Proctoring Ecosystem
-- Database Migration: Idempotent & Concurrency-Safe
-- ============================================================

-- ============================================================
-- 1. DATABASE SEQUENCES FOR UNIQUE READABLE IDENTIFIERS
-- Format:
--   Student:     LCE001, LCE002, ...
--   Guardian:    LCG001, LCG002, ...
--   Teacher:     LCT001, LCT002, ...
--   Examination: LCE-EX-0001, ...
--   Session:     LCS-2026-0001, ...
-- ============================================================

CREATE SEQUENCE IF NOT EXISTS public.seq_student_lce START WITH 101 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.seq_guardian_lcg START WITH 101 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.seq_teacher_lct START WITH 101 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.seq_exam_lce START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.seq_session_lcs START WITH 1 INCREMENT BY 1;

-- ============================================================
-- 2. PUBLIC IDENTITY CODES TABLE
-- Tracks all issued human-readable identifier codes with uniqueness
-- ============================================================

CREATE TABLE IF NOT EXISTS public.public_identity_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('student', 'guardian', 'teacher', 'examination', 'session')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_public_identity_codes_code ON public.public_identity_codes(code);
CREATE INDEX IF NOT EXISTS idx_public_identity_codes_user_id ON public.public_identity_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_public_identity_codes_entity_type ON public.public_identity_codes(entity_type);

ALTER TABLE public.public_identity_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view identity codes" ON public.public_identity_codes;
CREATE POLICY "Public can view identity codes"
  ON public.public_identity_codes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "System can manage identity codes" ON public.public_identity_codes;
CREATE POLICY "System can manage identity codes"
  ON public.public_identity_codes FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Atomic Code Generator Function
CREATE OR REPLACE FUNCTION public.generate_unique_identity_code(
  p_entity_type TEXT,
  p_user_id UUID DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_seq_val BIGINT;
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    IF p_entity_type = 'student' THEN
      v_seq_val := nextval('public.seq_student_lce');
      v_code := 'LCE' || lpad(v_seq_val::text, 3, '0');
    ELSIF p_entity_type = 'guardian' THEN
      v_seq_val := nextval('public.seq_guardian_lcg');
      v_code := 'LCG' || lpad(v_seq_val::text, 3, '0');
    ELSIF p_entity_type = 'teacher' THEN
      v_seq_val := nextval('public.seq_teacher_lct');
      v_code := 'LCT' || lpad(v_seq_val::text, 3, '0');
    ELSIF p_entity_type = 'examination' THEN
      v_seq_val := nextval('public.seq_exam_lce');
      v_code := 'LCE-EX-' || lpad(v_seq_val::text, 4, '0');
    ELSIF p_entity_type = 'session' THEN
      v_seq_val := nextval('public.seq_session_lcs');
      v_code := 'LCS-' || to_char(now(), 'YYYY') || '-' || lpad(v_seq_val::text, 4, '0');
    ELSE
      RAISE EXCEPTION 'Invalid entity type: %', p_entity_type;
    END IF;

    -- Verify collision protection
    SELECT EXISTS (
      SELECT 1 FROM public.public_identity_codes WHERE code = v_code
    ) INTO v_exists;

    IF NOT v_exists THEN
      INSERT INTO public.public_identity_codes (code, entity_type, user_id, entity_id)
      VALUES (v_code, p_entity_type, p_user_id, p_entity_id);
      RETURN v_code;
    END IF;
  END LOOP;
END;
$$;

-- ============================================================
-- 3. GUARDIAN PROFILES TABLE
-- Dedicated guardian/parent identity records
-- ============================================================

CREATE TABLE IF NOT EXISTS public.guardian_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guardian_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  relationship TEXT NOT NULL CHECK (relationship IN ('father', 'mother', 'legal_guardian', 'other')),
  mobile TEXT NOT NULL,
  mobile_verified BOOLEAN NOT NULL DEFAULT false,
  email TEXT NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guardian_profiles_user_id ON public.guardian_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_guardian_profiles_code ON public.guardian_profiles(guardian_code);
CREATE INDEX IF NOT EXISTS idx_guardian_profiles_mobile ON public.guardian_profiles(mobile);
CREATE INDEX IF NOT EXISTS idx_guardian_profiles_email ON public.guardian_profiles(lower(email));

ALTER TABLE public.guardian_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Guardians can view own profile" ON public.guardian_profiles;
CREATE POLICY "Guardians can view own profile"
  ON public.guardian_profiles FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Guardians can update own profile" ON public.guardian_profiles;
CREATE POLICY "Guardians can update own profile"
  ON public.guardian_profiles FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert guardian profile" ON public.guardian_profiles;
CREATE POLICY "Users can insert guardian profile"
  ON public.guardian_profiles FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- 4. GUARDIAN-STUDENT RELATIONSHIPS
-- Links one or multiple guardians to students
-- ============================================================

CREATE TABLE IF NOT EXISTS public.guardian_student_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID NOT NULL REFERENCES public.guardian_profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_lce_code TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending_verification', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_guardian_student UNIQUE (guardian_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_guardian_student_guardian_id ON public.guardian_student_relationships(guardian_id);
CREATE INDEX IF NOT EXISTS idx_guardian_student_student_id ON public.guardian_student_relationships(student_id);
CREATE INDEX IF NOT EXISTS idx_guardian_student_code ON public.guardian_student_relationships(student_lce_code);

ALTER TABLE public.guardian_student_relationships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Guardians and students can view relationship" ON public.guardian_student_relationships;
CREATE POLICY "Guardians and students can view relationship"
  ON public.guardian_student_relationships FOR SELECT
  USING (
    student_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.guardian_profiles WHERE id = guardian_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Authorized users can manage relationships" ON public.guardian_student_relationships;
CREATE POLICY "Authorized users can manage relationships"
  ON public.guardian_student_relationships FOR ALL
  USING (
    student_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.guardian_profiles WHERE id = guardian_id AND user_id = auth.uid())
  );

-- ============================================================
-- 5. GUARDIAN VERIFICATION RECORDS
-- Independent Mobile and Email OTP verification with rate-limiting
-- ============================================================

CREATE TABLE IF NOT EXISTS public.guardian_verification_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID REFERENCES public.guardian_profiles(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('mobile_otp', 'email_otp', 'email_link')),
  target_identifier TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  attempts_count INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 5,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guardian_verification_target ON public.guardian_verification_records(target_identifier);
CREATE INDEX IF NOT EXISTS idx_guardian_verification_guardian ON public.guardian_verification_records(guardian_id);

ALTER TABLE public.guardian_verification_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Verification records manage policy" ON public.guardian_verification_records;
CREATE POLICY "Verification records manage policy"
  ON public.guardian_verification_records FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 6. GUARDIAN NOTIFICATION PREFERENCES & LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.guardian_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID NOT NULL REFERENCES public.guardian_profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notify_exam_start BOOLEAN NOT NULL DEFAULT true,
  notify_exam_submit BOOLEAN NOT NULL DEFAULT true,
  notify_exam_complete BOOLEAN NOT NULL DEFAULT true,
  notify_connectivity_loss BOOLEAN NOT NULL DEFAULT true,
  notify_advisories BOOLEAN NOT NULL DEFAULT true,
  sms_channel_enabled BOOLEAN NOT NULL DEFAULT true,
  email_channel_enabled BOOLEAN NOT NULL DEFAULT true,
  in_app_channel_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_guardian_notif_pref UNIQUE (guardian_id, student_id)
);

ALTER TABLE public.guardian_notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Guardian manages notification preferences" ON public.guardian_notification_preferences;
CREATE POLICY "Guardian manages notification preferences"
  ON public.guardian_notification_preferences FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.guardian_profiles WHERE id = guardian_id AND user_id = auth.uid())
  );

CREATE TABLE IF NOT EXISTS public.guardian_notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID NOT NULL REFERENCES public.guardian_profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'exam_started',
    'exam_submitted',
    'exam_completed',
    'exam_paused',
    'connectivity_interrupted',
    'proctor_advisory'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  channels TEXT[] NOT NULL DEFAULT ARRAY['in_app']::TEXT[],
  delivery_status TEXT NOT NULL DEFAULT 'delivered' CHECK (delivery_status IN ('pending', 'delivered', 'failed')),
  idempotency_key TEXT UNIQUE,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guardian_notif_logs_guardian ON public.guardian_notification_logs(guardian_id);
CREATE INDEX IF NOT EXISTS idx_guardian_notif_logs_student ON public.guardian_notification_logs(student_id);

ALTER TABLE public.guardian_notification_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Guardian views own notification logs" ON public.guardian_notification_logs;
CREATE POLICY "Guardian views own notification logs"
  ON public.guardian_notification_logs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.guardian_profiles WHERE id = guardian_id AND user_id = auth.uid())
  );

-- Outbox for async/queued external SMS & Email notifications
CREATE TABLE IF NOT EXISTS public.notification_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email', 'webhook')),
  recipient TEXT NOT NULL,
  subject TEXT,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sending', 'sent', 'failed')),
  retry_count INT NOT NULL DEFAULT 0,
  max_retries INT NOT NULL DEFAULT 3,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

ALTER TABLE public.notification_outbox ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 7. QR PHYSICAL VERIFICATION SYSTEM
-- Short-lived signed tokens for physical in-person invigilation
-- ============================================================

CREATE TABLE IF NOT EXISTS public.qr_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_signature TEXT NOT NULL UNIQUE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_lce_code TEXT NOT NULL,
  exam_code TEXT NOT NULL,
  session_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired', 'revoked')),
  expires_at TIMESTAMPTZ NOT NULL,
  redeemed_at TIMESTAMPTZ,
  redeemed_by_teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qr_tokens_signature ON public.qr_verification_tokens(token_signature);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_student ON public.qr_verification_tokens(student_id);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_status ON public.qr_verification_tokens(status);

ALTER TABLE public.qr_verification_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students view own QR tokens" ON public.qr_verification_tokens;
CREATE POLICY "Students view own QR tokens"
  ON public.qr_verification_tokens FOR SELECT
  USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Teachers manage QR tokens" ON public.qr_verification_tokens;
CREATE POLICY "Teachers manage QR tokens"
  ON public.qr_verification_tokens FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin', 'teacher')
    )
  );

CREATE TABLE IF NOT EXISTS public.qr_verification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID REFERENCES public.qr_verification_tokens(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_lce_code TEXT NOT NULL,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_code TEXT NOT NULL,
  verification_result TEXT NOT NULL CHECK (verification_result IN ('verified', 'rejected', 'expired', 'mismatch')),
  station_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qr_events_student ON public.qr_verification_events(student_id);
CREATE INDEX IF NOT EXISTS idx_qr_events_teacher ON public.qr_verification_events(teacher_id);

ALTER TABLE public.qr_verification_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Teachers and admins view QR events" ON public.qr_verification_events;
CREATE POLICY "Teachers and admins view QR events"
  ON public.qr_verification_events FOR SELECT
  USING (
    teacher_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

DROP POLICY IF EXISTS "Teachers create QR events" ON public.qr_verification_events;
CREATE POLICY "Teachers create QR events"
  ON public.qr_verification_events FOR INSERT
  WITH CHECK (
    teacher_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin', 'teacher')
    )
  );

-- ============================================================
-- 8. ENHANCE PROCTORING SESSIONS & ACCESS PERMISSIONS
-- Adds LCS code, screen stream toggle, and viewer limits
-- ============================================================

ALTER TABLE public.proctoring_sessions
  ADD COLUMN IF NOT EXISTS lcs_code TEXT,
  ADD COLUMN IF NOT EXISTS student_lce_code TEXT,
  ADD COLUMN IF NOT EXISTS screen_stream_active BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS guardian_viewer_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS teacher_viewer_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS qr_verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS qr_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS calculator_used BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.guardian_access_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID NOT NULL REFERENCES public.guardian_profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_code TEXT NOT NULL,
  can_view_camera BOOLEAN NOT NULL DEFAULT true,
  can_view_screen BOOLEAN NOT NULL DEFAULT false,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.guardian_access_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Guardian access permissions policy" ON public.guardian_access_permissions;
CREATE POLICY "Guardian access permissions policy"
  ON public.guardian_access_permissions FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.guardian_profiles WHERE id = guardian_id AND user_id = auth.uid())
  );

CREATE TABLE IF NOT EXISTS public.proctoring_viewers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.proctoring_sessions(id) ON DELETE CASCADE,
  viewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewer_role TEXT NOT NULL CHECK (viewer_role IN ('teacher', 'guardian', 'admin')),
  connection_state TEXT NOT NULL DEFAULT 'connected' CHECK (connection_state IN ('connected', 'disconnected')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  left_at TIMESTAMPTZ
);

ALTER TABLE public.proctoring_viewers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Viewers manage own presence" ON public.proctoring_viewers;
CREATE POLICY "Viewers manage own presence"
  ON public.proctoring_viewers FOR ALL
  USING (viewer_id = auth.uid());
