import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_STREAK_GOAL } from '@/lib/achievements/definitions';

// GET /api/streak — Return user's active streak & qualifying activity
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user profile timezone
    const { data: profile } = await supabase
      .from('profiles')
      .select('timezone')
      .eq('id', user.id)
      .single();

    const userTimezone = profile?.timezone || 'UTC';

    // Fetch user_streaks
    const { data: streak } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Fetch qualifying days (last 30)
    const { data: days } = await supabase
      .from('qualifying_activity_days')
      .select('activity_date')
      .eq('user_id', user.id)
      .order('activity_date', { ascending: false })
      .limit(30);

    return NextResponse.json({
      streak: streak || {
        user_id: user.id,
        current_streak: 0,
        longest_streak: 0,
        last_qualifying_date: null,
        selected_goal_days: DEFAULT_STREAK_GOAL,
        timezone: userTimezone,
        updated_at: new Date().toISOString(),
      },
      qualifying_dates: days?.map((d: any) => d.activity_date) || [],
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch streak' }, { status: 500 });
  }
}
