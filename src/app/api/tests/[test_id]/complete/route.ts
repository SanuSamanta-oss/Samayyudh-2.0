import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { evaluateTestCompletion, getLocalDateString } from '@/lib/achievements/engine';
import { STANDARD_ACHIEVEMENTS } from '@/lib/achievements/definitions';
import { MockTestRecord, UserStreak } from '@/types/achievements';

// POST /api/tests/[test_id]/complete — Server-side verified mock test completion & achievement evaluation
export async function POST(
  request: Request,
  { params }: { params: Promise<{ test_id: string }> }
) {
  try {
    const { test_id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      exam_category,
      exam_code,
      score,
      maximum_marks,
      duration_seconds = 0,
    } = body;

    // Server-side validation
    if (!title || !exam_category || maximum_marks === undefined || score === undefined) {
      return NextResponse.json(
        { error: 'Missing required test completion payload' },
        { status: 400 }
      );
    }

    const validMaxMarks = Math.max(1, Number(maximum_marks));
    const validScore = Math.max(0, Math.min(Number(score), validMaxMarks));
    const percentage = Number(((validScore / validMaxMarks) * 100).toFixed(2));
    const nowIso = new Date().toISOString();

    // 1. Fetch user profile timezone
    const { data: profile } = await supabase
      .from('profiles')
      .select('timezone')
      .eq('id', user.id)
      .single();

    const userTimezone = profile?.timezone || 'UTC';

    // 2. Fetch existing completed tests for user
    const { data: existingTestsData } = await supabase
      .from('mock_tests')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed');

    const historicalTests: MockTestRecord[] = existingTestsData || [];

    // 3. Fetch current streak
    const { data: streakData } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const currentStreak: UserStreak = streakData || {
      user_id: user.id,
      current_streak: 0,
      longest_streak: 0,
      last_qualifying_date: null,
      selected_goal_days: 7,
      timezone: userTimezone,
      updated_at: nowIso,
    };

    // 4. Fetch existing achievements
    const { data: existingAchievementsData } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', user.id);

    const existingAchievements = existingAchievementsData || [];

    // 5. Construct current MockTestRecord
    const latestTest: MockTestRecord = {
      id: test_id,
      user_id: user.id,
      title,
      exam_category,
      exam_code: exam_code || exam_category,
      score: validScore,
      maximum_marks: validMaxMarks,
      percentage,
      status: 'completed',
      duration_seconds: Number(duration_seconds),
      started_at: body.started_at || nowIso,
      completed_at: nowIso,
    };

    // 6. Run core evaluation engine
    const evaluation = evaluateTestCompletion({
      userId: user.id,
      latestTest,
      historicalTests,
      existingAchievements,
      currentStreak,
      definitions: STANDARD_ACHIEVEMENTS,
    });

    // 7. Persist test in mock_tests table (upsert)
    await supabase.from('mock_tests').upsert(latestTest, { onConflict: 'id' });

    // 8. Record qualifying activity day (unique per user_id & activity_date)
    const activityDate = getLocalDateString(nowIso, userTimezone);
    await supabase.from('qualifying_activity_days').upsert(
      {
        user_id: user.id,
        activity_date: activityDate,
        activity_type: 'mock_test',
        source_id: test_id,
      },
      { onConflict: 'user_id,activity_date' }
    );

    // 9. Persist updated streak
    await supabase.from('user_streaks').upsert(evaluation.streak, { onConflict: 'user_id' });

    // 10. Persist new achievements idempotently
    if (evaluation.new_achievements.length > 0) {
      for (const item of evaluation.new_achievements) {
        await supabase.from('user_achievements').upsert(
          {
            id: item.record.id,
            user_id: user.id,
            achievement_definition_id: item.record.achievement_definition_id,
            source_test_id: latestTest.id,
            earned_at: item.record.earned_at,
            metadata: item.record.metadata,
          },
          { onConflict: 'user_id,achievement_definition_id' }
        );
      }
    }

    return NextResponse.json({
      success: true,
      result: evaluation,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Test completion processing failed', message: err.message },
      { status: 500 }
    );
  }
}
