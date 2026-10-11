import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/achievements/me — Return earned achievements for authenticated user
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievement_definitions(*)')
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false });

    if (error) {
      return NextResponse.json({ achievements: [] });
    }

    return NextResponse.json({ achievements: data || [] });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch user achievements' }, { status: 500 });
  }
}
