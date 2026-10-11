-- ============================================================
-- SamayYudh 2.0 — Achievement & Streak System Schema Migration
-- ============================================================

-- 1. Ensure profiles has timezone
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';

-- 2. Mock Tests table (records completed test attempts with categories & marks)
CREATE TABLE IF NOT EXISTS public.mock_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  exam_category TEXT NOT NULL,
  exam_code TEXT NOT NULL,
  score NUMERIC(7,2) NOT NULL DEFAULT 0,
  maximum_marks NUMERIC(7,2) NOT NULL DEFAULT 0,
  percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed',
  duration_seconds INT NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own mock tests"
  ON public.mock_tests FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_mock_tests_user ON public.mock_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_tests_category ON public.mock_tests(exam_category);
CREATE INDEX IF NOT EXISTS idx_mock_tests_completed ON public.mock_tests(completed_at DESC);

-- 3. User Streaks table
CREATE TABLE IF NOT EXISTS public.user_streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  last_qualifying_date DATE,
  selected_goal_days INT NOT NULL DEFAULT 7,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own streak"
  ON public.user_streaks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Qualifying Activity Days (prevents duplicate daily counts)
CREATE TABLE IF NOT EXISTS public.qualifying_activity_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  activity_type TEXT NOT NULL DEFAULT 'mock_test',
  source_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_activity_date UNIQUE (user_id, activity_date)
);

ALTER TABLE public.qualifying_activity_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own qualifying days"
  ON public.qualifying_activity_days FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_qualifying_days_user_date ON public.qualifying_activity_days(user_id, activity_date);

-- 5. Achievement Definitions table
CREATE TABLE IF NOT EXISTS public.achievement_definitions (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  threshold NUMERIC NOT NULL DEFAULT 0,
  badge_asset TEXT NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'common',
  visual_type TEXT NOT NULL DEFAULT 'pin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active achievements"
  ON public.achievement_definitions FOR SELECT
  USING (is_active = true);

-- 6. User Achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_definition_id TEXT NOT NULL REFERENCES public.achievement_definitions(id) ON DELETE CASCADE,
  source_test_id UUID REFERENCES public.mock_tests(id) ON DELETE SET NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT uq_user_achievement UNIQUE (user_id, achievement_definition_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);

-- 7. Seed Standard Achievement Definitions
INSERT INTO public.achievement_definitions (id, code, title, subtitle, description, category, threshold, badge_asset, rarity, visual_type, is_active)
VALUES
  ('ach-first-test', 'FIRST_STEP', 'First Step', 'Journey Begun!', 'Completed your very first mock test on SamayYudh.', 'test_completion', 1, 'first_step', 'common', 'pin', true),
  ('ach-getting-better', 'GETTING_BETTER', 'Getting Better', '+5% Score Jump', 'Improved your score by at least 5 percentage points compared to your previous test.', 'performance', 5, 'getting_better', 'common', 'pin', true),
  ('ach-rising-star', 'RISING_STAR', 'Rising Star', '+10% Score Leap', 'Improved your score by 10+ percentage points in your category. Keep soaring!', 'performance', 10, 'rising_star', 'rare', 'pin', true),
  ('ach-high-achiever', 'HIGH_ACHIEVER', 'High Achiever', '+15% Giant Leap', 'Surged forward with a massive 15+ percentage point score improvement.', 'performance', 15, 'high_achiever', 'epic', 'pin', true),
  ('ach-outstanding-progress', 'OUTSTANDING_PROGRESS', 'Outstanding Progress', '+20% Master Surge', 'Phenomenal 20+ percentage point increase! Exceptional dedication and growth.', 'performance', 20, 'outstanding_progress', 'legendary', 'pin', true),
  ('ach-personal-best', 'PERSONAL_BEST', 'Personal Best', 'New Category Peak', 'Set a new all-time highest score in this examination category.', 'personal_record', 1, 'personal_best', 'epic', 'pin', true),
  ('ach-perfect-score', 'PERFECT_SCORE', 'Perfect Score', 'Flawless 100%', 'Achieved a flawless 100% score on a completed mock test.', 'personal_record', 100, 'perfect_score', 'legendary', 'pin', true),
  ('ach-streak-3', 'BRONZE_SPARK', 'Bronze Spark', '3-Day Streak', 'Practiced consistently for 3 consecutive days. The spark has been lit!', 'streak', 3, 'bronze_spark', 'common', 'medal', true),
  ('ach-streak-7', 'SILVER_FLAME', 'Silver Flame', '7-Day Streak', '1 full week of daily mock tests. A dedicated habit taking deep root.', 'streak', 7, 'silver_flame', 'rare', 'medal', true),
  ('ach-streak-20', 'GOLDEN_DEDICATION', 'Golden Dedication', '20-Day Streak', '20 days unbroken! Pure discipline and relentless drive toward mastery.', 'streak', 20, 'golden_dedication', 'epic', 'medal', true),
  ('ach-streak-30', 'PLATINUM_STAR', 'Platinum Star', '30-Day Streak', 'A full month of non-stop test battles. Elite consistency achieved!', 'streak', 30, 'platinum_star', 'epic', 'medal', true),
  ('ach-streak-50', 'LEGENDARY_ACHIEVER', 'Legendary Achiever', '50-Day Streak', '50 consecutive days of battle tests. You stand among the top 1%!', 'streak', 50, 'legendary_achiever', 'legendary', 'medal', true),
  ('ach-streak-100', 'ETERNAL_CHAMPION', 'Eternal Champion', '100-Day Streak', 'Triple-digit mastery! 100 days of relentless, unstoppable exam dominance.', 'streak', 100, 'eternal_champion', 'legendary', 'medal', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  threshold = EXCLUDED.threshold,
  badge_asset = EXCLUDED.badge_asset,
  rarity = EXCLUDED.rarity,
  visual_type = EXCLUDED.visual_type;

-- 8. Enable Realtime Publications
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_streaks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_achievements;
