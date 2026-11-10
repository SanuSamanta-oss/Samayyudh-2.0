import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOrSetCache } from '@/lib/cache';

// GET /api/performance/history — Return completed mock tests for user
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';

    const cacheKey = `samayyudh:user:${user.id}:perf_history:${category.toLowerCase()}`;

    const { data, source } = await getOrSetCache(
      cacheKey,
      async () => {
        let query = supabase
          .from('mock_tests')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('completed_at', { ascending: true });

        if (category !== 'all') {
          query = query.eq('exam_category', category);
        }

        const { data: tests, error } = await query;
        if (error) {
          return { mock_tests: [] };
        }
        return { mock_tests: tests || [] };
      },
      { ttlSeconds: 60 }
    );

    return NextResponse.json(data, {
      headers: {
        'X-Cache-Status': source.toUpperCase(),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch performance history' }, { status: 500 });
  }
}
