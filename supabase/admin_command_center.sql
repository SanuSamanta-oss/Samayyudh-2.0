-- ============================================================
-- SamayYudh 2.0 — Global Admin & Teacher Command Center Schema
-- Idempotent migration: extends existing SamayYudh Supabase tables
-- without breaking existing student sessions, profiles, or exams.
-- Run in Supabase Dashboard -> SQL Editor
-- ============================================================

-- ====================
-- 1. PUBLIC ID GENERATOR (`SY-XXXXXXXX`)
-- ====================

CREATE OR REPLACE FUNCTION public.generate_samayyudh_public_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars CONSTANT TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := 'SY-';
  i INT;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, 1 + floor(random() * length(chars))::INT, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- ====================
-- 2. ENSURE & EXTEND PROFILES (Unique Public ID, Username, Discovery & Privacy)
-- ====================

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

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Ensure profile auto-creation trigger exists on signup
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
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(COALESCE(NEW.email, 'user'), '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS public_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS institution TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_exam TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subjects TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_discoverable BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS visibility_level TEXT DEFAULT 'public';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active';

-- Backfill profile rows for any already-registered auth.users
INSERT INTO public.profiles (id, email, phone, display_name, avatar_url)
SELECT
  u.id,
  u.email,
  u.phone,
  COALESCE(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', split_part(COALESCE(u.email, 'user'), '@', 1)),
  u.raw_user_meta_data ->> 'avatar_url'
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);

-- Assign unique SY-XXXXXXXX identifier with collision retry
CREATE OR REPLACE FUNCTION public.assign_profile_public_identifiers()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  candidate TEXT;
  attempts INT := 0;
  base_username TEXT;
BEGIN
  IF NEW.public_id IS NULL OR NEW.public_id = '' THEN
    LOOP
      candidate := public.generate_samayyudh_public_id();
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE public_id = candidate);
      attempts := attempts + 1;
      IF attempts > 25 THEN
        candidate := 'SY-' || upper(substr(replace(gen_random_uuid()::TEXT, '-', ''), 1, 8));
        EXIT;
      END IF;
    END LOOP;
    NEW.public_id := candidate;
  END IF;

  IF NEW.username IS NULL OR NEW.username = '' THEN
    base_username := regexp_replace(lower(COALESCE(NULLIF(NEW.display_name, ''), split_part(COALESCE(NEW.email, 'user'), '@', 1))), '[^a-z0-9_]', '', 'g');
    IF length(base_username) < 3 THEN
      base_username := 'aspirant';
    END IF;
    candidate := left(base_username, 20);
    IF EXISTS (SELECT 1 FROM public.profiles WHERE username = candidate AND id <> NEW.id) THEN
      candidate := left(base_username, 15) || '_' || lower(substr(NEW.public_id, 4, 4));
    END IF;
    NEW.username := candidate;
  ELSE
    NEW.username := lower(trim(leading '@' from NEW.username));
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_assign_identifiers ON public.profiles;
CREATE TRIGGER trg_profiles_assign_identifiers
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.assign_profile_public_identifiers();

-- Backfill existing profiles safely
DO $$
DECLARE
  rec RECORD;
  cand TEXT;
BEGIN
  FOR rec IN SELECT id, email, display_name, public_id, username FROM public.profiles WHERE public_id IS NULL OR username IS NULL LOOP
    cand := rec.public_id;
    IF cand IS NULL THEN
      LOOP
        cand := public.generate_samayyudh_public_id();
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE public_id = cand);
      END LOOP;
    END IF;
    UPDATE public.profiles
    SET public_id = COALESCE(public_id, cand),
        username = COALESCE(
          username,
          left(
            COALESCE(NULLIF(regexp_replace(lower(COALESCE(NULLIF(display_name, ''), split_part(COALESCE(email, 'user'), '@', 1))), '[^a-z0-9_]', '', 'g'), ''), 'aspirant'),
            15
          ) || '_' || lower(substr(cand, 4, 4))
        )
    WHERE id = rec.id;
  END LOOP;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_public_id ON public.profiles(public_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(lower(username));

-- ====================
-- 3. USER ROLES & SERVER-ENFORCED RBAC
-- ====================

CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('super_admin', 'admin', 'teacher', 'student')),
  permissions JSONB DEFAULT '{}'::JSONB,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Prevent recursive RLS lookup using SECURITY DEFINER helper
CREATE OR REPLACE FUNCTION public.get_my_command_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = ''
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1),
    'student'
  );
$$;

CREATE OR REPLACE FUNCTION public.has_command_role(allowed_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = ''
AS $$
  SELECT public.get_my_command_role() = ANY(allowed_roles);
$$;

DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
CREATE POLICY "Users can view own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.has_command_role(ARRAY['super_admin', 'admin']));

-- Only super_admin / service_role can assign or change roles (blocks self-escalation)
DROP POLICY IF EXISTS "Super admins manage roles" ON public.user_roles;
CREATE POLICY "Super admins manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_command_role(ARRAY['super_admin']))
  WITH CHECK (public.has_command_role(ARRAY['super_admin']));

-- Auto-create default student role when new auth user registers
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Backfill roles for existing users
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'student' FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- Allow directory visibility of non-sensitive fields via explicit RPC (protects email/phone)
CREATE OR REPLACE FUNCTION public.search_public_directory(
  search_query TEXT,
  max_results INT DEFAULT 20
)
RETURNS TABLE (
  user_id UUID,
  public_id TEXT,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  institution TEXT,
  preferred_exam TEXT,
  subjects TEXT[],
  role TEXT,
  visibility_level TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = ''
AS $$
  SELECT
    p.id AS user_id,
    p.public_id,
    p.username,
    p.display_name,
    p.avatar_url,
    p.institution,
    p.preferred_exam,
    p.subjects,
    COALESCE(r.role, 'student') AS role,
    p.visibility_level
  FROM public.profiles p
  LEFT JOIN public.user_roles r ON r.user_id = p.id
  WHERE p.account_status = 'active'
    AND p.is_discoverable = true
    AND p.visibility_level <> 'private'
    AND (
      search_query IS NULL
      OR trim(search_query) = ''
      OR p.public_id ILIKE '%' || trim(search_query) || '%'
      OR p.username ILIKE '%' || trim(leading '@' from trim(search_query)) || '%'
      OR p.display_name ILIKE '%' || trim(search_query) || '%'
    )
  ORDER BY p.created_at DESC
  LIMIT LEAST(GREATEST(max_results, 1), 50);
$$;

-- ====================
-- 4. ADMIN SECURITY GATEWAY, SESSIONS & AUDIT LOGS
-- ====================

CREATE TABLE IF NOT EXISTS public.admin_passkey_attempts (
  identifier TEXT PRIMARY KEY,
  failed_count INT DEFAULT 0,
  locked_until TIMESTAMPTZ,
  last_attempt_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_passkey_attempts ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.admin_command_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_command_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own command sessions" ON public.admin_command_sessions;
CREATE POLICY "Users read own command sessions"
  ON public.admin_command_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role TEXT DEFAULT 'unknown',
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read audit logs" ON public.audit_logs;
CREATE POLICY "Admins read audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.has_command_role(ARRAY['super_admin', 'admin']));

DROP POLICY IF EXISTS "Authenticated users insert own audit events" ON public.audit_logs;
CREATE POLICY "Authenticated users insert own audit events"
  ON public.audit_logs FOR INSERT
  WITH CHECK (auth.uid() = actor_id OR auth.uid() IS NOT NULL);

-- ====================
-- 5. ENSURE & EXTEND QUESTION BANK & NORMALIZED OPTIONS / SOLUTIONS
-- ====================

CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  question_number INT NOT NULL DEFAULT 1,
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

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS chapter TEXT DEFAULT '';
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS exam_shift TEXT DEFAULT '';
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS negative_marks NUMERIC(5,2) DEFAULT 0;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS solution_steps TEXT DEFAULT '';
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS case_passage TEXT DEFAULT '';
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS diagram_url TEXT DEFAULT '';
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public';
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  option_key TEXT NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);

ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.question_solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  solution_markdown TEXT NOT NULL DEFAULT '',
  steps JSONB DEFAULT '[]'::JSONB,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.question_solutions ENABLE ROW LEVEL SECURITY;

-- Replace legacy question policies with role-aware visibility & authoring policies
DROP POLICY IF EXISTS "Anyone can view questions" ON public.questions;
CREATE POLICY "Read published or authorized questions"
  ON public.questions FOR SELECT
  USING (
    status = 'published'
    OR author_id = auth.uid()
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  );

DROP POLICY IF EXISTS "Admins can modify questions" ON public.questions;
CREATE POLICY "Authorized teachers and admins modify questions"
  ON public.questions FOR ALL
  USING (
    public.has_command_role(ARRAY['super_admin', 'admin'])
    OR (public.has_command_role(ARRAY['teacher']) AND (author_id = auth.uid() OR author_id IS NULL))
  )
  WITH CHECK (
    public.has_command_role(ARRAY['super_admin', 'admin', 'teacher'])
  );

DROP POLICY IF EXISTS "Question options inherit read" ON public.question_options;
CREATE POLICY "Question options inherit read"
  ON public.question_options FOR SELECT USING (true);

DROP POLICY IF EXISTS "Teachers and admins manage options" ON public.question_options;
CREATE POLICY "Teachers and admins manage options"
  ON public.question_options FOR ALL
  USING (public.has_command_role(ARRAY['super_admin', 'admin', 'teacher']))
  WITH CHECK (public.has_command_role(ARRAY['super_admin', 'admin', 'teacher']));

DROP POLICY IF EXISTS "Question solutions read" ON public.question_solutions;
CREATE POLICY "Question solutions read"
  ON public.question_solutions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Teachers and admins manage solutions" ON public.question_solutions;
CREATE POLICY "Teachers and admins manage solutions"
  ON public.question_solutions FOR ALL
  USING (public.has_command_role(ARRAY['super_admin', 'admin', 'teacher']))
  WITH CHECK (public.has_command_role(ARRAY['super_admin', 'admin', 'teacher']));

-- ====================
-- 6. CONNECTIONS & CONNECTION REQUESTS
-- ====================

CREATE TABLE IF NOT EXISTS public.connection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  message TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  responded_at TIMESTAMPTZ,
  CHECK (sender_id <> recipient_id)
);

-- Prevent duplicate active pending requests between same pair
CREATE UNIQUE INDEX IF NOT EXISTS idx_conn_req_unique_pending
  ON public.connection_requests(sender_id, recipient_id)
  WHERE status = 'pending';

CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_b UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'accepted' CHECK (status IN ('accepted', 'blocked')),
  blocked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CHECK (user_a < user_b),
  UNIQUE(user_a, user_b)
);

ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users access own connection requests" ON public.connection_requests;
CREATE POLICY "Users access own connection requests"
  ON public.connection_requests FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Users send connection requests" ON public.connection_requests;
CREATE POLICY "Users send connection requests"
  ON public.connection_requests FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND sender_id <> recipient_id);

DROP POLICY IF EXISTS "Sender cancels or recipient responds" ON public.connection_requests;
CREATE POLICY "Sender cancels or recipient responds"
  ON public.connection_requests FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Users manage own connections" ON public.connections;
CREATE POLICY "Users manage own connections"
  ON public.connections FOR ALL
  USING (auth.uid() = user_a OR auth.uid() = user_b)
  WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);

-- ====================
-- 7. CLASSROOMS, INVITATIONS & PERSONAL STUDENT GROUPS
-- ====================

CREATE TABLE IF NOT EXISTS public.classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  subject TEXT NOT NULL DEFAULT 'General',
  exam_category TEXT NOT NULL DEFAULT 'GENERAL',
  academic_year TEXT DEFAULT '2026-27',
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_url TEXT DEFAULT '',
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'invite_only', 'public')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  allow_self_join BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.classroom_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_role TEXT NOT NULL DEFAULT 'student' CHECK (member_role IN ('teacher', 'assistant', 'student')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(classroom_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.classroom_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'accepted', 'declined', 'revoked', 'expired')),
  max_uses INT DEFAULT 50,
  uses_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.classroom_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  group_id UUID,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.student_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.student_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_classroom_teacher(c_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (SELECT 1 FROM public.classrooms WHERE id = c_id AND teacher_id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.is_classroom_member(c_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (SELECT 1 FROM public.classroom_members WHERE classroom_id = c_id AND user_id = auth.uid());
$$;

DROP POLICY IF EXISTS "Classrooms visible to teachers members and super_admin" ON public.classrooms;
CREATE POLICY "Classrooms visible to teachers members and super_admin"
  ON public.classrooms FOR SELECT
  USING (
    teacher_id = auth.uid()
    OR public.is_classroom_member(id)
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  );

DROP POLICY IF EXISTS "Teachers and admins manage classrooms" ON public.classrooms;
CREATE POLICY "Teachers and admins manage classrooms"
  ON public.classrooms FOR ALL
  USING (
    (teacher_id = auth.uid() AND public.has_command_role(ARRAY['teacher', 'admin', 'super_admin']))
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  )
  WITH CHECK (public.has_command_role(ARRAY['teacher', 'admin', 'super_admin']));

DROP POLICY IF EXISTS "Classroom members view" ON public.classroom_members;
CREATE POLICY "Classroom members view"
  ON public.classroom_members FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.is_classroom_teacher(classroom_id)
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  );

DROP POLICY IF EXISTS "Classroom teacher manages members" ON public.classroom_members;
CREATE POLICY "Classroom teacher manages members"
  ON public.classroom_members FOR ALL
  USING (
    public.is_classroom_teacher(classroom_id)
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  )
  WITH CHECK (
    public.is_classroom_teacher(classroom_id)
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  );

DROP POLICY IF EXISTS "Invitations view" ON public.classroom_invitations;
CREATE POLICY "Invitations view"
  ON public.classroom_invitations FOR SELECT
  USING (
    invited_user_id = auth.uid()
    OR public.is_classroom_teacher(classroom_id)
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  );

DROP POLICY IF EXISTS "Teacher manages classroom invitations" ON public.classroom_invitations;
CREATE POLICY "Teacher manages classroom invitations"
  ON public.classroom_invitations FOR ALL
  USING (
    public.is_classroom_teacher(classroom_id)
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  )
  WITH CHECK (
    public.is_classroom_teacher(classroom_id)
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  );

DROP POLICY IF EXISTS "Student groups visibility" ON public.student_groups;
CREATE POLICY "Student groups visibility"
  ON public.student_groups FOR SELECT
  USING (
    teacher_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = id AND gm.user_id = auth.uid())
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  );

DROP POLICY IF EXISTS "Teacher manages student groups" ON public.student_groups;
CREATE POLICY "Teacher manages student groups"
  ON public.student_groups FOR ALL
  USING (teacher_id = auth.uid() OR public.has_command_role(ARRAY['super_admin', 'admin']))
  WITH CHECK (public.has_command_role(ARRAY['teacher', 'admin', 'super_admin']));

DROP POLICY IF EXISTS "Group members strict read" ON public.group_members;
CREATE POLICY "Group members strict read"
  ON public.group_members FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.student_groups g WHERE g.id = group_id AND g.teacher_id = auth.uid())
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  );

DROP POLICY IF EXISTS "Group teacher manages members" ON public.group_members;
CREATE POLICY "Group teacher manages members"
  ON public.group_members FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.student_groups g WHERE g.id = group_id AND g.teacher_id = auth.uid())
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  )
  WITH CHECK (public.has_command_role(ARRAY['teacher', 'admin', 'super_admin']));

DROP POLICY IF EXISTS "Announcements visible to members" ON public.classroom_announcements;
CREATE POLICY "Announcements visible to members"
  ON public.classroom_announcements FOR ALL
  USING (
    author_id = auth.uid()
    OR public.is_classroom_member(classroom_id)
    OR public.is_classroom_teacher(classroom_id)
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  );

-- ====================
-- 8. RESOURCE LIBRARY & EDUCATIONAL STORAGE BUCKET
-- ====================

CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'reference_pdf' CHECK (category IN (
    'question_paper', 'pyq_paper', 'mcq_sheet', 'assignment', 'cheat_sheet',
    'formula_sheet', 'study_notes', 'solutions', 'reference_pdf', 'practice_worksheet', 'other'
  )),
  subject TEXT DEFAULT 'General',
  exam_code TEXT DEFAULT 'GENERAL',
  chapter TEXT DEFAULT '',
  topic TEXT DEFAULT '',
  academic_year TEXT DEFAULT '2026',
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  bucket_id TEXT NOT NULL DEFAULT 'educational-resources',
  file_size BIGINT DEFAULT 0,
  mime_type TEXT DEFAULT 'application/pdf',
  visibility TEXT NOT NULL DEFAULT 'personal' CHECK (visibility IN ('personal', 'classroom', 'group', 'public')),
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE SET NULL,
  group_id UUID REFERENCES public.student_groups(id) ON DELETE SET NULL,
  assignment_id UUID,
  tags TEXT[] DEFAULT '{}',
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.resource_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.student_groups(id) ON DELETE CASCADE,
  can_download BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Resources visibility read" ON public.resources;
CREATE POLICY "Resources visibility read"
  ON public.resources FOR SELECT
  USING (
    uploaded_by = auth.uid()
    OR visibility = 'public'
    OR (visibility = 'classroom' AND classroom_id IS NOT NULL AND public.is_classroom_member(classroom_id))
    OR (visibility = 'group' AND group_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.group_members gm WHERE gm.group_id = resources.group_id AND gm.user_id = auth.uid()
    ))
    OR EXISTS (SELECT 1 FROM public.resource_permissions rp WHERE rp.resource_id = resources.id AND rp.user_id = auth.uid())
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  );

DROP POLICY IF EXISTS "Teachers and admins manage resources" ON public.resources;
CREATE POLICY "Teachers and admins manage resources"
  ON public.resources FOR ALL
  USING (
    uploaded_by = auth.uid()
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  )
  WITH CHECK (public.has_command_role(ARRAY['teacher', 'admin', 'super_admin']));

DROP POLICY IF EXISTS "Resource permissions access" ON public.resource_permissions;
CREATE POLICY "Resource permissions access"
  ON public.resource_permissions FOR ALL
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.resources r WHERE r.id = resource_id AND r.uploaded_by = auth.uid())
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  );

-- Private Educational Resources Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('educational-resources', 'educational-resources', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Command roles upload educational resources" ON storage.objects;
CREATE POLICY "Command roles upload educational resources"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'educational-resources'
    AND public.has_command_role(ARRAY['teacher', 'admin', 'super_admin'])
  );

DROP POLICY IF EXISTS "Authorized users read educational resources" ON storage.objects;
CREATE POLICY "Authorized users read educational resources"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'educational-resources'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.has_command_role(ARRAY['super_admin', 'admin'])
    )
  );

DROP POLICY IF EXISTS "Owners and admins delete educational resources" ON storage.objects;
CREATE POLICY "Owners and admins delete educational resources"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'educational-resources'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.has_command_role(ARRAY['super_admin', 'admin'])
    )
  );

-- ====================
-- 9. ASSIGNMENTS & SUBMISSIONS
-- ====================

CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE SET NULL,
  group_id UUID REFERENCES public.student_groups(id) ON DELETE SET NULL,
  target_student_ids UUID[] DEFAULT '{}',
  resource_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
  max_marks INT DEFAULT 100,
  start_at TIMESTAMPTZ DEFAULT now(),
  due_at TIMESTAMPTZ,
  time_limit_minutes INT DEFAULT 60,
  attempts_allowed INT DEFAULT 1,
  negative_marking BOOLEAN DEFAULT false,
  submission_type TEXT DEFAULT 'mixed' CHECK (submission_type IN ('mcq', 'pdf', 'descriptive', 'mixed')),
  late_submission_policy TEXT DEFAULT 'allow_marked' CHECK (late_submission_policy IN ('disallow', 'allow_marked', 'allow_full')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assignment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  marks INT DEFAULT 1,
  sort_order INT DEFAULT 0,
  UNIQUE(assignment_id, question_id)
);

CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB DEFAULT '{}'::JSONB,
  attached_file_path TEXT,
  score NUMERIC(6,2),
  max_score NUMERIC(6,2),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('in_progress', 'submitted', 'late', 'evaluated')),
  feedback TEXT DEFAULT '',
  submitted_at TIMESTAMPTZ DEFAULT now(),
  evaluated_at TIMESTAMPTZ,
  attempt_number INT DEFAULT 1,
  UNIQUE(assignment_id, student_id, attempt_number)
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Assignments view" ON public.assignments;
CREATE POLICY "Assignments view"
  ON public.assignments FOR SELECT
  USING (
    teacher_id = auth.uid()
    OR (
      status = 'published' AND (
        auth.uid() = ANY(target_student_ids)
        OR (classroom_id IS NOT NULL AND public.is_classroom_member(classroom_id))
        OR (group_id IS NOT NULL AND EXISTS (
          SELECT 1 FROM public.group_members gm WHERE gm.group_id = assignments.group_id AND gm.user_id = auth.uid()
        ))
      )
    )
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  );

DROP POLICY IF EXISTS "Teachers manage own assignments" ON public.assignments;
CREATE POLICY "Teachers manage own assignments"
  ON public.assignments FOR ALL
  USING (teacher_id = auth.uid() OR public.has_command_role(ARRAY['super_admin', 'admin']))
  WITH CHECK (public.has_command_role(ARRAY['teacher', 'admin', 'super_admin']));

DROP POLICY IF EXISTS "Assignment questions access" ON public.assignment_questions;
CREATE POLICY "Assignment questions access"
  ON public.assignment_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      WHERE a.id = assignment_id AND (
        a.teacher_id = auth.uid()
        OR a.status = 'published'
        OR public.has_command_role(ARRAY['super_admin', 'admin'])
      )
    )
  );

DROP POLICY IF EXISTS "Students manage own submissions teachers inspect class submissions" ON public.assignment_submissions;
CREATE POLICY "Students manage own submissions teachers inspect class submissions"
  ON public.assignment_submissions FOR ALL
  USING (
    student_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.assignments a WHERE a.id = assignment_id AND a.teacher_id = auth.uid())
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  )
  WITH CHECK (
    student_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.assignments a WHERE a.id = assignment_id AND a.teacher_id = auth.uid())
    OR public.has_command_role(ARRAY['super_admin', 'admin'])
  );

-- ====================
-- 10. PERSISTENT USER NOTIFICATIONS
-- ====================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'system' CHECK (category IN (
    'connection_request', 'connection_accepted', 'classroom_invite',
    'assignment_published', 'resource_shared', 'system', 'security'
  )),
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  action_url TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read and update own notifications" ON public.notifications;
CREATE POLICY "Users read and update own notifications"
  ON public.notifications FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- Useful performance indexes
CREATE INDEX IF NOT EXISTS idx_resources_uploaded_by ON public.resources(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_resources_visibility ON public.resources(visibility);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON public.assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_classroom ON public.assignments(classroom_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

