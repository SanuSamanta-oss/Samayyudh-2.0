// ============================================================
// SamayYudh 2.0 — Achievement & Streak System Types
// ============================================================

export type AchievementCategory =
  | 'performance'
  | 'streak'
  | 'test_completion'
  | 'personal_record';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface AchievementDefinition {
  id: string;
  code: string;
  title: string;
  subtitle?: string;
  description: string;
  category: AchievementCategory;
  threshold: number; // percentage point improvement, day count, or score
  badge_asset: string; // pin style or medal tier
  rarity: AchievementRarity;
  is_active: boolean;
  visual_type: 'pin' | 'medal'; // 'pin' for cute character shield, 'medal' for geometric 3D star medal
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_definition_id: string;
  source_test_id?: string | null;
  earned_at: string;
  metadata?: {
    improvement?: number;
    previous_percentage?: number;
    latest_percentage?: number;
    previous_score?: number;
    latest_score?: number;
    streak_count?: number;
    exam_category?: string;
    goal_days?: number;
    [key: string]: unknown;
  };
}

export interface UserStreak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_qualifying_date: string | null; // YYYY-MM-DD
  selected_goal_days: number;
  timezone: string;
  updated_at: string;
}

export interface QualifyingActivityDay {
  id: string;
  user_id: string;
  activity_date: string; // YYYY-MM-DD in user's timezone
  activity_type: 'mock_test' | 'practice_session';
  source_id?: string;
  created_at: string;
}

export interface MockTestRecord {
  id: string;
  user_id: string;
  title: string;
  exam_category: string;
  exam_code: string;
  score: number;
  maximum_marks: number;
  percentage: number;
  status: 'completed' | 'in_progress' | 'abandoned';
  started_at: string;
  completed_at: string;
  duration_seconds: number;
}

export interface TestCompletionResult {
  test: MockTestRecord;
  previous_test: MockTestRecord | null;
  improvement_points: number | null;
  is_personal_best: boolean;
  is_perfect_score: boolean;
  streak: UserStreak;
  new_achievements: Array<{
    achievement: AchievementDefinition;
    record: UserAchievement;
  }>;
}

export interface AchievementStats {
  current_streak: number;
  longest_streak: number;
  total_achievements: number;
  total_tests_completed: number;
  personal_best_percentage: number;
  selected_goal_days: number;
}

export interface StreakDayActivity {
  date: string; // YYYY-MM-DD
  completed: boolean;
  test_count: number;
}
