-- ============================================================
-- SamayYudh 2.0 — Multi-Role Authentication, Teacher Verification
-- & Super Admin Management System Migration
-- Idempotent: Extends existing tables, preserves user data & sessions.
-- ============================================================

-- ====================
-- 1. INSTITUTION DOMAINS (Curated Educational Registry)
-- ====================

CREATE TABLE IF NOT EXISTS public.institution_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  institution_website TEXT,
  country TEXT NOT NULL DEFAULT 'IN',
  verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'provisional', 'unverified', 'blacklisted')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_institution_domains_domain ON public.institution_domains(lower(domain));
CREATE INDEX IF NOT EXISTS idx_institution_domains_status ON public.institution_domains(verification_status);

ALTER TABLE public.institution_domains ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view verified domains" ON public.institution_domains;
CREATE POLICY "Public can view verified domains"
  ON public.institution_domains FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Super admins manage domains" ON public.institution_domains;
CREATE POLICY "Super admins manage domains"
  ON public.institution_domains FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Pre-seed curated Indian & Global institution domains
INSERT INTO public.institution_domains (institution_name, domain, institution_website, country, verification_status)
VALUES
  ('Indian Institute of Technology Bombay', 'iitb.ac.in', 'https://www.iitb.ac.in', 'IN', 'verified'),
  ('Indian Institute of Technology Delhi', 'iitd.ac.in', 'https://home.iitd.ac.in', 'IN', 'verified'),
  ('Indian Institute of Technology Madras', 'iitm.ac.in', 'https://www.iitm.ac.in', 'IN', 'verified'),
  ('Indian Institute of Technology Kanpur', 'iitk.ac.in', 'https://www.iitk.ac.in', 'IN', 'verified'),
  ('Indian Institute of Technology Kharagpur', 'iitkgp.ac.in', 'https://www.iitkgp.ac.in', 'IN', 'verified'),
  ('Indian Institute of Technology Roorkee', 'iitr.ac.in', 'https://www.iitr.ac.in', 'IN', 'verified'),
  ('Indian Institute of Technology Guwahati', 'iitg.ac.in', 'https://www.iitg.ac.in', 'IN', 'verified'),
  ('Indian Institute of Technology Hyderabad', 'iith.ac.in', 'https://www.iith.ac.in', 'IN', 'verified'),
  ('Indian Institute of Science Bangalore', 'iisc.ac.in', 'https://www.iisc.ac.in', 'IN', 'verified'),
  ('Birla Institute of Technology and Science, Pilani', 'bits-pilani.ac.in', 'https://www.bits-pilani.ac.in', 'IN', 'verified'),
  ('All India Institute of Medical Sciences New Delhi', 'aiims.edu', 'https://www.aiims.edu', 'IN', 'verified'),
  ('National Institute of Technology Karnataka', 'nitk.edu.in', 'https://www.nitk.ac.in', 'IN', 'verified'),
  ('National Institute of Technology Tiruchirappalli', 'nitt.edu', 'https://www.nitt.edu', 'IN', 'verified'),
  ('University of Delhi', 'du.ac.in', 'https://www.du.ac.in', 'IN', 'verified'),
  ('Jawaharlal Nehru University', 'jnu.ac.in', 'https://www.jnu.ac.in', 'IN', 'verified'),
  ('Jadavpur University', 'jaduniv.edu.in', 'https://www.jaduniv.edu.in', 'IN', 'verified'),
  ('University of Calcutta', 'caluniv.ac.in', 'https://www.caluniv.ac.in', 'IN', 'verified'),
  ('Banaras Hindu University', 'bhu.ac.in', 'https://www.bhu.ac.in', 'IN', 'verified'),
  ('Aligarh Muslim University', 'amu.ac.in', 'https://www.amu.ac.in', 'IN', 'verified'),
  ('Indian Institute of Information Technology Allahabad', 'iiita.ac.in', 'https://www.iiita.ac.in', 'IN', 'verified'),
  ('Vellore Institute of Technology', 'vit.ac.in', 'https://www.vit.ac.in', 'IN', 'verified'),
  ('Massachusetts Institute of Technology', 'mit.edu', 'https://www.mit.edu', 'US', 'verified'),
  ('Stanford University', 'stanford.edu', 'https://www.stanford.edu', 'US', 'verified'),
  ('Harvard University', 'harvard.edu', 'https://www.harvard.edu', 'US', 'verified'),
  ('University of Oxford', 'ox.ac.uk', 'https://www.ox.ac.uk', 'GB', 'verified'),
  ('University of Cambridge', 'cam.ac.uk', 'https://www.cam.ac.uk', 'GB', 'verified')
ON CONFLICT (domain) DO UPDATE
SET updated_at = now();

-- ====================
-- 2. ENHANCE USER ROLES TABLE
-- ====================

CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('super_admin', 'admin', 'teacher', 'student')),
  permissions JSONB DEFAULT '{}'::JSONB,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS role_selected BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_status ON public.user_roles(status);

-- ====================
-- 3. SUPER ADMINS TABLE
-- ====================

CREATE TABLE IF NOT EXISTS public.super_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'super_admin',
  access_status TEXT NOT NULL DEFAULT 'active' CHECK (access_status IN ('active', 'suspended', 'revoked')),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_super_admins_email ON public.super_admins(lower(email));
CREATE INDEX IF NOT EXISTS idx_super_admins_status ON public.super_admins(access_status);

ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins can view super admins" ON public.super_admins;
CREATE POLICY "Super admins can view super admins"
  ON public.super_admins FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

DROP POLICY IF EXISTS "Super admins manage super admins table" ON public.super_admins;
CREATE POLICY "Super admins manage super admins table"
  ON public.super_admins FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- ====================
-- 4. TEACHERS TABLE
-- ====================

CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL,
  institution_name TEXT,
  department TEXT,
  designation TEXT,
  institutional_email TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending_verification' CHECK (
    verification_status IN ('requested', 'pending_verification', 'limited', 'verified', 'rejected', 'suspended')
  ),
  verification_method TEXT CHECK (
    verification_method IN ('institutional_email', 'google_classroom', 'faculty_directory', 'professional_credential', 'manual_override')
  ),
  verification_score INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON public.teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_verification_status ON public.teachers(verification_status);
CREATE INDEX IF NOT EXISTS idx_teachers_is_verified ON public.teachers(is_verified);

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Teachers can view own profile" ON public.teachers;
CREATE POLICY "Teachers can view own profile"
  ON public.teachers FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

DROP POLICY IF EXISTS "Teachers can update own basic info" ON public.teachers;
CREATE POLICY "Teachers can update own basic info"
  ON public.teachers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    -- Cannot self-verify: is_verified & verification_status changes require server-side / super admin check
  );

DROP POLICY IF EXISTS "Super admins manage all teachers" ON public.teachers;
CREATE POLICY "Super admins manage all teachers"
  ON public.teachers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- ====================
-- 5. STUDENTS TABLE
-- ====================

CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL,
  registration_status TEXT NOT NULL DEFAULT 'active' CHECK (registration_status IN ('active', 'suspended', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(registration_status);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own record" ON public.students;
CREATE POLICY "Students can view own record"
  ON public.students FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin', 'teacher')
    )
  );

DROP POLICY IF EXISTS "Super admins manage students" ON public.students;
CREATE POLICY "Super admins manage students"
  ON public.students FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- ====================
-- 6. TEACHER VERIFICATION RECORDS TABLE
-- ====================

CREATE TABLE IF NOT EXISTS public.teacher_verification_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  verification_method TEXT NOT NULL,
  evidence_type TEXT NOT NULL,
  evidence_reference TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  verification_score INT DEFAULT 0,
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_verification_records_teacher ON public.teacher_verification_records(teacher_id);
CREATE INDEX IF NOT EXISTS idx_verification_records_status ON public.teacher_verification_records(verification_status);

ALTER TABLE public.teacher_verification_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Teachers can view own verification records" ON public.teacher_verification_records;
CREATE POLICY "Teachers can view own verification records"
  ON public.teacher_verification_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.teachers WHERE id = teacher_id AND user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

DROP POLICY IF EXISTS "Super admins manage verification records" ON public.teacher_verification_records;
CREATE POLICY "Super admins manage verification records"
  ON public.teacher_verification_records FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- ====================
-- 7. TEACHER EMAIL OTPS TABLE (Temporary, Encrypted/Hashed, Rate-Limited)
-- ====================

CREATE TABLE IF NOT EXISTS public.teacher_email_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  attempts INT DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teacher_otps_user ON public.teacher_email_otps(user_id);
CREATE INDEX IF NOT EXISTS idx_teacher_otps_email ON public.teacher_email_otps(lower(email));

ALTER TABLE public.teacher_email_otps ENABLE ROW LEVEL SECURITY;

-- Server-only access via Service Role for security (never exposed to public client)

-- ====================
-- 8. LOGIN ACTIVITY TABLE (Session & Audit Feed)
-- ====================

CREATE TABLE IF NOT EXISTS public.login_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'student',
  ip_address TEXT,
  user_agent TEXT,
  device TEXT,
  browser TEXT,
  session_status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_login_activity_user ON public.login_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_login_activity_created ON public.login_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_activity_role ON public.login_activity(role);

ALTER TABLE public.login_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own login activity" ON public.login_activity;
CREATE POLICY "Users can view own login activity"
  ON public.login_activity FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

DROP POLICY IF EXISTS "Users can insert own login activity" ON public.login_activity;
CREATE POLICY "Users can insert own login activity"
  ON public.login_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ====================
-- 9. ADMIN AUDIT LOGS TABLE
-- ====================

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role TEXT DEFAULT 'unknown',
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_details JSONB DEFAULT '{}'::JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action ON public.admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_actor ON public.admin_audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_target ON public.admin_audit_logs(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created ON public.admin_audit_logs(created_at DESC);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- ====================
-- 10. BACKFILL EXISTING USERS SAFELY
-- ====================

-- 1. Populate students table for existing users who are students
INSERT INTO public.students (user_id, full_name, registration_status)
SELECT
  p.id,
  COALESCE(NULLIF(p.display_name, ''), split_part(COALESCE(p.email, 'aspirant'), '@', 1)),
  'active'
FROM public.profiles p
LEFT JOIN public.user_roles r ON r.user_id = p.id
WHERE (r.role = 'student' OR r.role IS NULL)
ON CONFLICT (user_id) DO NOTHING;

-- 2. Populate teachers table for any existing teacher accounts
INSERT INTO public.teachers (user_id, full_name, is_verified, verification_status, verification_method)
SELECT
  p.id,
  COALESCE(NULLIF(p.display_name, ''), split_part(COALESCE(p.email, 'teacher'), '@', 1)),
  true,
  'verified',
  'manual_override'
FROM public.profiles p
JOIN public.user_roles r ON r.user_id = p.id
WHERE r.role = 'teacher'
ON CONFLICT (user_id) DO NOTHING;

-- 3. Mark role_selected = true for existing accounts that have completed registration
UPDATE public.user_roles
SET role_selected = true
WHERE user_id IN (SELECT id FROM public.profiles WHERE display_name <> '' AND display_name IS NOT NULL);

-- Migration Complete

