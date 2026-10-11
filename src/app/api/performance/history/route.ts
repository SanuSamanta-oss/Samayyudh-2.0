import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/performance/history — Return completed mock tests for user
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = supabase
      .from('mock_tests')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: true });

    if (category) {
      query = query.eq('exam_category', category);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ mock_tests: [] });
    }

    return NextResponse.json({ mock_tests: data || [] });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch performance history' }, { status: 500 });
  }
}
