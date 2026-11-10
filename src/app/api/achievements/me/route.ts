import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOrSetCache } from '@/lib/cache';

// GET /api/achievements/me — Return earned achievements for authenticated user
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cacheKey = `samayyudh:user:${user.id}:achievements`;

    const { data, source } = await getOrSetCache(
      cacheKey,
      async () => {
        const { data: achievements, error } = await supabase
          .from('user_achievements')
          .select('*, achievement_definitions(*)')
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false });

        if (error) {
          return { achievements: [] };
        }
        return { achievements: achievements || [] };
      },
      { ttlSeconds: 60 }
    );

    return NextResponse.json(data, {
      headers: {
        'X-Cache-Status': source.toUpperCase(),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch user achievements' }, { status: 500 });
  }
}
