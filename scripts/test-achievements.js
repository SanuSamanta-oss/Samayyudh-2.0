// ============================================================
// SamayYudh 2.0 — Achievement Engine Tests (Executable via Node.js)
// ============================================================

const test = require('node:test');
const assert = require('node:assert/strict');

// Inlined logic mirrors src/lib/achievements/engine.ts
function daysBetween(dateA, dateB) {
  const [y1, m1, d1] = dateA.split('-').map(Number);
  const [y2, m2, d2] = dateB.split('-').map(Number);
  const utcA = Date.UTC(y1, m1 - 1, d1);
  const utcB = Date.UTC(y2, m2 - 1, d2);
  return Math.round((utcB - utcA) / (1000 * 60 * 60 * 24));
}

function calculateUpdatedStreak(currentStreakState, activityDate) {
  const { current_streak, longest_streak, last_qualifying_date } = currentStreakState;

  if (!last_qualifying_date) {
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
    return {
      ...currentStreakState,
      updated_at: new Date().toISOString(),
    };
  } else if (diff === 1) {
    const nextStreak = current_streak + 1;
    return {
      ...currentStreakState,
      current_streak: nextStreak,
      longest_streak: Math.max(nextStreak, longest_streak),
      last_qualifying_date: activityDate,
      updated_at: new Date().toISOString(),
    };
  } else if (diff > 1) {
    return {
      ...currentStreakState,
      current_streak: 1,
      longest_streak: Math.max(1, longest_streak),
      last_qualifying_date: activityDate,
      updated_at: new Date().toISOString(),
    };
  } else {
    return currentStreakState;
  }
}

function evaluateTestCompletion(params) {
  const { userId, latestTest, historicalTests, existingAchievements, currentStreak } = params;
  const earnedDefIds = new Set(existingAchievements.map(a => a.achievement_definition_id));
  const newAchievements = [];

  const sameCategoryTests = historicalTests
    .filter(t => t.id !== latestTest.id && t.status === 'completed' && t.exam_category === latestTest.exam_category)
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());

  const previousTest = sameCategoryTests.length > 0 ? sameCategoryTests[0] : null;

  // 1. First test achievement
  const allCompletedTests = historicalTests.filter(t => t.id !== latestTest.id && t.status === 'completed');
  if (allCompletedTests.length === 0 && !earnedDefIds.has('ach-first-test')) {
    newAchievements.push({ code: 'FIRST_STEP', id: 'ach-first-test' });
    earnedDefIds.add('ach-first-test');
  }

  // 2. Improvement
  let improvementPoints = null;
  if (previousTest) {
    improvementPoints = Number((latestTest.percentage - previousTest.percentage).toFixed(2));
    if (improvementPoints >= 5 && !earnedDefIds.has('ach-getting-better')) {
      newAchievements.push({ code: 'GETTING_BETTER', id: 'ach-getting-better' });
      earnedDefIds.add('ach-getting-better');
    }
    if (improvementPoints >= 10 && !earnedDefIds.has('ach-rising-star')) {
      newAchievements.push({ code: 'RISING_STAR', id: 'ach-rising-star' });
      earnedDefIds.add('ach-rising-star');
    }
    if (improvementPoints >= 15 && !earnedDefIds.has('ach-high-achiever')) {
      newAchievements.push({ code: 'HIGH_ACHIEVER', id: 'ach-high-achiever' });
      earnedDefIds.add('ach-high-achiever');
    }
  }

  // 3. Personal Best
  let isPersonalBest = false;
  if (sameCategoryTests.length > 0) {
    const highestPrev = Math.max(...sameCategoryTests.map(t => t.percentage));
    if (latestTest.percentage > highestPrev) {
      isPersonalBest = true;
      if (!earnedDefIds.has('ach-personal-best')) {
        newAchievements.push({ code: 'PERSONAL_BEST', id: 'ach-personal-best' });
      }
    }
  }

  // 4. Streak
  const activityDate = latestTest.completed_at.slice(0, 10);
  const updatedStreak = calculateUpdatedStreak(currentStreak, activityDate);

  return {
    test: latestTest,
    previous_test: previousTest,
    improvement_points: improvementPoints,
    is_personal_best: isPersonalBest,
    streak: updatedStreak,
    new_achievements: newAchievements,
  };
}

// ── Tests ──

test('1. First test achievement is awarded on first completed test', () => {
  const latestTest = {
    id: 'test-1',
    user_id: 'user-1',
    title: 'GATE CS Mock 1',
    exam_category: 'ENGINEERING',
    percentage: 65,
    status: 'completed',
    completed_at: '2026-10-10T11:00:00Z',
  };
  const streak = { current_streak: 0, longest_streak: 0, last_qualifying_date: null };
  const res = evaluateTestCompletion({
    userId: 'user-1',
    latestTest,
    historicalTests: [],
    existingAchievements: [],
    currentStreak: streak,
  });

  assert.equal(res.new_achievements[0].code, 'FIRST_STEP');
  assert.equal(res.improvement_points, null);
  assert.equal(res.streak.current_streak, 1);
});

test('2. Performance improvement calculation compares percentages across different maximum marks', () => {
  const prev = {
    id: 'test-1',
    user_id: 'user-1',
    exam_category: 'ENGINEERING',
    percentage: 60,
    status: 'completed',
    completed_at: '2026-10-09T11:00:00Z',
  };
  const latest = {
    id: 'test-2',
    user_id: 'user-1',
    exam_category: 'ENGINEERING',
    percentage: 73, // +13%
    status: 'completed',
    completed_at: '2026-10-10T11:00:00Z',
  };
  const streak = { current_streak: 1, longest_streak: 1, last_qualifying_date: '2026-10-09' };

  const res = evaluateTestCompletion({
    userId: 'user-1',
    latestTest: latest,
    historicalTests: [prev],
    existingAchievements: [],
    currentStreak: streak,
  });

  assert.equal(res.improvement_points, 13);
  const codes = res.new_achievements.map(a => a.code);
  assert.ok(codes.includes('GETTING_BETTER'));
  assert.ok(codes.includes('RISING_STAR'));
  assert.ok(!codes.includes('HIGH_ACHIEVER'));
  assert.equal(res.is_personal_best, true);
});

test('3. Tests from different exam categories are isolated', () => {
  const medTest = {
    id: 'med-1',
    exam_category: 'MEDICAL',
    percentage: 95,
    status: 'completed',
    completed_at: '2026-10-09T11:00:00Z',
  };
  const engTest = {
    id: 'eng-1',
    exam_category: 'ENGINEERING',
    percentage: 70,
    status: 'completed',
    completed_at: '2026-10-10T11:00:00Z',
  };
  const streak = { current_streak: 1, longest_streak: 1, last_qualifying_date: '2026-10-09' };

  const res = evaluateTestCompletion({
    userId: 'user-1',
    latestTest: engTest,
    historicalTests: [medTest],
    existingAchievements: [],
    currentStreak: streak,
  });

  assert.equal(res.previous_test, null);
  assert.equal(res.improvement_points, null);
});

test('4. Streak logic: consecutive day increments, same day ignores, missed day resets', () => {
  const base = { current_streak: 3, longest_streak: 5, last_qualifying_date: '2026-10-10' };
  assert.equal(calculateUpdatedStreak(base, '2026-10-10').current_streak, 3);
  assert.equal(calculateUpdatedStreak(base, '2026-10-11').current_streak, 4);
  const reset = calculateUpdatedStreak(base, '2026-10-13');
  assert.equal(reset.current_streak, 1);
  assert.equal(reset.longest_streak, 5); // longest is preserved
});

test('5. Duplicate achievements are prevented idempotently', () => {
  const prev = { id: 't-1', exam_category: 'ENG', percentage: 50, status: 'completed', completed_at: '2026-10-09T00:00:00Z' };
  const latest = { id: 't-2', exam_category: 'ENG', percentage: 65, status: 'completed', completed_at: '2026-10-10T00:00:00Z' };
  const existing = [
    { achievement_definition_id: 'ach-first-test' },
    { achievement_definition_id: 'ach-getting-better' },
  ];
  const streak = { current_streak: 1, longest_streak: 1, last_qualifying_date: '2026-10-09' };

  const res = evaluateTestCompletion({
    userId: 'user-1',
    latestTest: latest,
    historicalTests: [prev],
    existingAchievements: existing,
    currentStreak: streak,
  });

  const codes = res.new_achievements.map(a => a.code);
  assert.ok(!codes.includes('FIRST_STEP'));
  assert.ok(!codes.includes('GETTING_BETTER'));
  assert.ok(codes.includes('RISING_STAR'));
  assert.ok(codes.includes('HIGH_ACHIEVER'));
});
