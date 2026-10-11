import type {
  AchievementDefinition,
  UserAchievement,
  UserStreak,
  MockTestRecord,
  TestCompletionResult,
} from '../../types/achievements';
import { STANDARD_ACHIEVEMENTS } from './definitions';

/**
 * Return formatted local calendar date string (YYYY-MM-DD) for a given timestamp and timezone.
 */
export function getLocalDateString(timestamp: string | number | Date = new Date(), timezone = 'UTC'): string {
  const d = new Date(timestamp);
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(d);
  } catch {
    // Fallback if timezone string is invalid
    return d.toISOString().slice(0, 10);
  }
}

/**
 * Calculate difference in calendar days between two YYYY-MM-DD dates.
 */
export function daysBetween(dateA: string, dateB: string): number {
  const [y1, m1, d1] = dateA.split('-').map(Number);
  const [y2, m2, d2] = dateB.split('-').map(Number);
  const utcA = Date.UTC(y1, m1 - 1, d1);
  const utcB = Date.UTC(y2, m2 - 1, d2);
  return Math.round((utcB - utcA) / (1000 * 60 * 60 * 24));
}

/**
 * Update user streak safely given a new qualifying activity date.
 * Rules:
 * - Same day activity: streak unchanged.
 * - Exactly next consecutive calendar day: streak increments by 1.
 * - Missed 1 or more calendar days: streak resets to 1.
 * - Longest streak is updated whenever current streak exceeds it.
 */
export function calculateUpdatedStreak(
  currentStreakState: UserStreak,
  activityDate: string // YYYY-MM-DD
): UserStreak {
  const { current_streak, longest_streak, last_qualifying_date } = currentStreakState;

  if (!last_qualifying_date) {
    // First qualifying activity ever
    return {
      ...currentStreakState,
      current_streak: 1,
      longest_streak: Math.max(1, longest_streak),
      last_qualifying_date: activityDate,
      updated_at: new Date().toISOString(),
    };
  }

  const diff = daysBetween(last_qualifying_date, activityDate);

  if (diff === 0) {
    // Multiple activities on the same day: counts as 1 day, no increase or reset
    return {
      ...currentStreakState,
      updated_at: new Date().toISOString(),
    };
  } else if (diff === 1) {
    // Consecutive day
    const nextStreak = current_streak + 1;
    return {
      ...currentStreakState,
      current_streak: nextStreak,
      longest_streak: Math.max(nextStreak, longest_streak),
      last_qualifying_date: activityDate,
      updated_at: new Date().toISOString(),
    };
  } else if (diff > 1) {
    // Broken streak: reset to 1
    return {
      ...currentStreakState,
      current_streak: 1,
      longest_streak: Math.max(1, longest_streak), // preserve historical longest
      last_qualifying_date: activityDate,
      updated_at: new Date().toISOString(),
    };
  } else {
    // Activity date is older than last_qualifying_date (e.g. historical log); do not alter active streak
    return currentStreakState;
  }
}

/**
 * Core performance & streak achievement evaluation engine.
 * Idempotent, safe, and returns unlocked achievements and updated streak.
 */
export function evaluateTestCompletion(params: {
  userId: string;
  latestTest: MockTestRecord;
  historicalTests: MockTestRecord[]; // all previous tests belonging to user
  existingAchievements: UserAchievement[];
  currentStreak: UserStreak;
  definitions?: AchievementDefinition[];
}): TestCompletionResult {
  const {
    userId,
    latestTest,
    historicalTests,
    existingAchievements,
    currentStreak,
    definitions = STANDARD_ACHIEVEMENTS,
  } = params;

  const earnedDefIds = new Set(existingAchievements.map(a => a.achievement_definition_id));
  const newAchievements: Array<{ achievement: AchievementDefinition; record: UserAchievement }> = [];

  // Filter valid completed historical tests in the same examination category
  const sameCategoryTests = historicalTests
    .filter(t => t.id !== latestTest.id && t.status === 'completed' && t.exam_category === latestTest.exam_category)
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());

  const previousTest = sameCategoryTests.length > 0 ? sameCategoryTests[0] : null;

  // 1. First test completed achievement (awarded if user has completed at least 1 mock test)
  const totalCompletedCount = historicalTests.filter(t => t.id !== latestTest.id && t.status === 'completed').length + 1;

  const firstStepDef = definitions.find(d => d.code === 'FIRST_STEP');
  if (firstStepDef && totalCompletedCount >= 1 && !earnedDefIds.has(firstStepDef.id)) {
    const record: UserAchievement = {
      id: `ua-${userId}-${firstStepDef.id}`,
      user_id: userId,
      achievement_definition_id: firstStepDef.id,
      source_test_id: latestTest.id,
      earned_at: new Date().toISOString(),
      metadata: {
        latest_percentage: latestTest.percentage,
        exam_category: latestTest.exam_category,
      },
    };
    newAchievements.push({ achievement: firstStepDef, record });
    earnedDefIds.add(firstStepDef.id);
  }

  // 2. Performance Improvement Calculation
  let improvementPoints: number | null = null;
  if (previousTest) {
    improvementPoints = Number((latestTest.percentage - previousTest.percentage).toFixed(2));

    if (improvementPoints > 0) {
      // Check tier thresholds: 5, 10, 15, 20
      const improvementTiers = [
        { code: 'GETTING_BETTER', min: 5 },
        { code: 'RISING_STAR', min: 10 },
        { code: 'HIGH_ACHIEVER', min: 15 },
        { code: 'OUTSTANDING_PROGRESS', min: 20 },
      ];

      for (const tier of improvementTiers) {
        if (improvementPoints >= tier.min) {
          const def = definitions.find(d => d.code === tier.code);
          if (def && !earnedDefIds.has(def.id)) {
            const record: UserAchievement = {
              id: `ua-${userId}-${def.id}`,
              user_id: userId,
              achievement_definition_id: def.id,
              source_test_id: latestTest.id,
              earned_at: new Date().toISOString(),
              metadata: {
                improvement: improvementPoints,
                previous_percentage: previousTest.percentage,
                latest_percentage: latestTest.percentage,
                exam_category: latestTest.exam_category,
              },
            };
            newAchievements.push({ achievement: def, record });
            earnedDefIds.add(def.id);
          }
        }
      }
    }
  }

  // 3. Personal Best Check
  let isPersonalBest = false;
  if (sameCategoryTests.length > 0) {
    const highestPreviousScore = Math.max(...sameCategoryTests.map(t => t.percentage));
    if (latestTest.percentage > highestPreviousScore) {
      isPersonalBest = true;
      const pbDef = definitions.find(d => d.code === 'PERSONAL_BEST');
      if (pbDef && !earnedDefIds.has(pbDef.id)) {
        const record: UserAchievement = {
          id: `ua-${userId}-${pbDef.id}`,
          user_id: userId,
          achievement_definition_id: pbDef.id,
          source_test_id: latestTest.id,
          earned_at: new Date().toISOString(),
          metadata: {
            latest_percentage: latestTest.percentage,
            previous_highest: highestPreviousScore,
            exam_category: latestTest.exam_category,
          },
        };
        newAchievements.push({ achievement: pbDef, record });
        earnedDefIds.add(pbDef.id);
      }
    }
  }

  // 4. Perfect Score (100%) Check
  const isPerfectScore = latestTest.percentage >= 100;
  if (isPerfectScore) {
    const perfDef = definitions.find(d => d.code === 'PERFECT_SCORE');
    if (perfDef && !earnedDefIds.has(perfDef.id)) {
      const record: UserAchievement = {
        id: `ua-${userId}-${perfDef.id}`,
        user_id: userId,
        achievement_definition_id: perfDef.id,
        source_test_id: latestTest.id,
        earned_at: new Date().toISOString(),
        metadata: {
          latest_percentage: 100,
          score: latestTest.score,
          maximum_marks: latestTest.maximum_marks,
        },
      };
      newAchievements.push({ achievement: perfDef, record });
      earnedDefIds.add(perfDef.id);
    }
  }

  // 5. Update Streak
  const activityDate = getLocalDateString(latestTest.completed_at, currentStreak.timezone || 'UTC');
  const updatedStreak = calculateUpdatedStreak(currentStreak, activityDate);

  // 6. Streak Milestone Awards
  const streakTiers = [
    { code: 'BRONZE_SPARK', days: 3 },
    { code: 'SILVER_FLAME', days: 7 },
    { code: 'GOLDEN_DEDICATION', days: 20 },
    { code: 'PLATINUM_STAR', days: 30 },
    { code: 'LEGENDARY_ACHIEVER', days: 50 },
    { code: 'ETERNAL_CHAMPION', days: 100 },
  ];

  for (const st of streakTiers) {
    if (updatedStreak.current_streak >= st.days) {
      const def = definitions.find(d => d.code === st.code);
      if (def && !earnedDefIds.has(def.id)) {
        const record: UserAchievement = {
          id: `ua-${userId}-${def.id}`,
          user_id: userId,
          achievement_definition_id: def.id,
          source_test_id: latestTest.id,
          earned_at: new Date().toISOString(),
          metadata: {
            streak_count: updatedStreak.current_streak,
            milestone_days: st.days,
          },
        };
        newAchievements.push({ achievement: def, record });
        earnedDefIds.add(def.id);
      }
    }
  }

  return {
    test: latestTest,
    previous_test: previousTest,
    improvement_points: improvementPoints,
    is_personal_best: isPersonalBest,
    is_perfect_score: isPerfectScore,
    streak: updatedStreak,
    new_achievements: newAchievements,
  };
}
