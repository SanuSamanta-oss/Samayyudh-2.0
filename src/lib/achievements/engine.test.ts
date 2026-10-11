import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateUpdatedStreak,
  daysBetween,
  getLocalDateString,
  evaluateTestCompletion,
} from './engine';
import { STANDARD_ACHIEVEMENTS } from './definitions';
import type { MockTestRecord, UserStreak } from '../../types/achievements';

test('1. First test achievement is awarded on first completed test', () => {
  const latestTest: MockTestRecord = {
    id: 'test-1',
    user_id: 'user-1',
    title: 'GATE CS Mock 1',
    exam_category: 'ENGINEERING',
    exam_code: 'GATE-CS-1',
    score: 65,
    maximum_marks: 100,
    percentage: 65,
    status: 'completed',
    duration_seconds: 3600,
    started_at: '2026-10-10T10:00:00Z',
    completed_at: '2026-10-10T11:00:00Z',
  };

  const initialStreak: UserStreak = {
    user_id: 'user-1',
    current_streak: 0,
    longest_streak: 0,
    last_qualifying_date: null,
    selected_goal_days: 7,
    timezone: 'UTC',
    updated_at: '2026-10-10T10:00:00Z',
  };

  const result = evaluateTestCompletion({
    userId: 'user-1',
    latestTest,
    historicalTests: [],
    existingAchievements: [],
    currentStreak: initialStreak,
    definitions: STANDARD_ACHIEVEMENTS,
  });

  const codes = result.new_achievements.map((a) => a.achievement.code);
  assert.ok(codes.includes('FIRST_STEP'));
  assert.equal(result.improvement_points, null);
  assert.equal(result.streak.current_streak, 1);
});

test('2. Performance improvement calculation compares percentages across different maximum marks', () => {
  const previousTest: MockTestRecord = {
    id: 'test-1',
    user_id: 'user-1',
    title: 'GATE Test 1 (50 marks)',
    exam_category: 'ENGINEERING',
    exam_code: 'GATE-CS-1',
    score: 30,
    maximum_marks: 50,
    percentage: 60, // 60%
    status: 'completed',
    duration_seconds: 1800,
    started_at: '2026-10-09T10:00:00Z',
    completed_at: '2026-10-09T11:00:00Z',
  };

  const latestTest: MockTestRecord = {
    id: 'test-2',
    user_id: 'user-1',
    title: 'GATE Test 2 (100 marks)',
    exam_category: 'ENGINEERING',
    exam_code: 'GATE-CS-1',
    score: 73,
    maximum_marks: 100,
    percentage: 73, // 73% (+13 percentage points)
    status: 'completed',
    duration_seconds: 3600,
    started_at: '2026-10-10T10:00:00Z',
    completed_at: '2026-10-10T11:00:00Z',
  };

  const initialStreak: UserStreak = {
    user_id: 'user-1',
    current_streak: 1,
    longest_streak: 1,
    last_qualifying_date: '2026-10-09',
    selected_goal_days: 7,
    timezone: 'UTC',
    updated_at: '2026-10-09T11:00:00Z',
  };

  const result = evaluateTestCompletion({
    userId: 'user-1',
    latestTest,
    historicalTests: [previousTest],
    existingAchievements: [],
    currentStreak: initialStreak,
    definitions: STANDARD_ACHIEVEMENTS,
  });

  assert.equal(result.improvement_points, 13);
  const codes = result.new_achievements.map((a) => a.achievement.code);
  assert.ok(codes.includes('GETTING_BETTER'));
  assert.ok(codes.includes('RISING_STAR'));
  assert.ok(!codes.includes('HIGH_ACHIEVER')); // requires >= 15%
  assert.equal(result.is_personal_best, true);
});

test('3. Tests from different exam categories are isolated', () => {
  const previousMedicalTest: MockTestRecord = {
    id: 'test-med',
    user_id: 'user-1',
    title: 'NEET Biology',
    exam_category: 'MEDICAL',
    exam_code: 'NEET',
    score: 90,
    maximum_marks: 100,
    percentage: 90,
    status: 'completed',
    duration_seconds: 3600,
    started_at: '2026-10-09T10:00:00Z',
    completed_at: '2026-10-09T11:00:00Z',
  };

  const latestEngineeringTest: MockTestRecord = {
    id: 'test-eng',
    user_id: 'user-1',
    title: 'GATE CS',
    exam_category: 'ENGINEERING',
    exam_code: 'GATE-CS',
    score: 70,
    maximum_marks: 100,
    percentage: 70,
    status: 'completed',
    duration_seconds: 3600,
    started_at: '2026-10-10T10:00:00Z',
    completed_at: '2026-10-10T11:00:00Z',
  };

  const streak: UserStreak = {
    user_id: 'user-1',
    current_streak: 1,
    longest_streak: 1,
    last_qualifying_date: '2026-10-09',
    selected_goal_days: 7,
    timezone: 'UTC',
    updated_at: '2026-10-09T11:00:00Z',
  };

  const result = evaluateTestCompletion({
    userId: 'user-1',
    latestTest: latestEngineeringTest,
    historicalTests: [previousMedicalTest],
    existingAchievements: [],
    currentStreak: streak,
    definitions: STANDARD_ACHIEVEMENTS,
  });

  assert.equal(result.previous_test, null);
  assert.equal(result.improvement_points, null);
});

test('4. Streak logic: consecutive day increments, same day ignores, missed day resets', () => {
  const baseStreak: UserStreak = {
    user_id: 'user-1',
    current_streak: 3,
    longest_streak: 5,
    last_qualifying_date: '2026-10-10',
    selected_goal_days: 7,
    timezone: 'UTC',
    updated_at: '2026-10-10T00:00:00Z',
  };

  // Same day test
  const sameDay = calculateUpdatedStreak(baseStreak, '2026-10-10');
  assert.equal(sameDay.current_streak, 3);

  // Consecutive next day test
  const nextDay = calculateUpdatedStreak(baseStreak, '2026-10-11');
  assert.equal(nextDay.current_streak, 4);
  assert.equal(nextDay.longest_streak, 5);

  // Missed day test (2 days gap)
  const missedDay = calculateUpdatedStreak(baseStreak, '2026-10-13');
  assert.equal(missedDay.current_streak, 1);
  assert.equal(missedDay.longest_streak, 5); // historical longest preserved
});

test('5. Duplicate achievements are prevented idempotently', () => {
  const previousTest: MockTestRecord = {
    id: 'test-1',
    user_id: 'user-1',
    title: 'GATE Test 1',
    exam_category: 'ENGINEERING',
    exam_code: 'GATE-CS-1',
    score: 50,
    maximum_marks: 100,
    percentage: 50,
    status: 'completed',
    duration_seconds: 3600,
    started_at: '2026-10-09T10:00:00Z',
    completed_at: '2026-10-09T11:00:00Z',
  };

  const latestTest: MockTestRecord = {
    id: 'test-2',
    user_id: 'user-1',
    title: 'GATE Test 2',
    exam_category: 'ENGINEERING',
    exam_code: 'GATE-CS-1',
    score: 65,
    maximum_marks: 100,
    percentage: 65, // +15%
    status: 'completed',
    duration_seconds: 3600,
    started_at: '2026-10-10T10:00:00Z',
    completed_at: '2026-10-10T11:00:00Z',
  };

  const streak: UserStreak = {
    user_id: 'user-1',
    current_streak: 1,
    longest_streak: 1,
    last_qualifying_date: '2026-10-09',
    selected_goal_days: 7,
    timezone: 'UTC',
    updated_at: '2026-10-09T11:00:00Z',
  };

  // User already has FIRST_STEP and GETTING_BETTER
  const existing = [
    {
      id: 'ua-1',
      user_id: 'user-1',
      achievement_definition_id: 'ach-first-test',
      earned_at: '2026-10-09T11:00:00Z',
    },
    {
      id: 'ua-2',
      user_id: 'user-1',
      achievement_definition_id: 'ach-getting-better',
      earned_at: '2026-10-09T11:00:00Z',
    },
  ];

  const result = evaluateTestCompletion({
    userId: 'user-1',
    latestTest,
    historicalTests: [previousTest],
    existingAchievements: existing,
    currentStreak: streak,
    definitions: STANDARD_ACHIEVEMENTS,
  });

  const codes = result.new_achievements.map((a) => a.achievement.code);
  assert.ok(!codes.includes('FIRST_STEP'));
  assert.ok(!codes.includes('GETTING_BETTER')); // Already awarded
  assert.ok(codes.includes('RISING_STAR')); // Newly unlocked
  assert.ok(codes.includes('HIGH_ACHIEVER')); // Newly unlocked
});
