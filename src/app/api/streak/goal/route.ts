import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MAX_CUSTOM_GOAL_DAYS } from '@/lib/achievements/definitions';

// PUT /api/streak/goal — Update user's personal streak target
export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { goal_days } = body;

    const days = parseInt(goal_days, 10);
    if (!days || days <= 0 || days > MAX_CUSTOM_GOAL_DAYS) {
      return NextResponse.json(
        { error: `Goal must be a positive integer between 1 and ${MAX_CUSTOM_GOAL_DAYS}` },
        { status: 400 }
      );
    }

    // Upsert user_streaks
    const { data, error } = await supabase
      .from('user_streaks')
      .upsert(
        {
          user_id: user.id,
          selected_goal_days: days,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, streak: data });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update streak goal' }, { status: 500 });
  }
}
