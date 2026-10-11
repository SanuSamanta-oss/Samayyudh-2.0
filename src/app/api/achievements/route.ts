import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { STANDARD_ACHIEVEMENTS } from '@/lib/achievements/definitions';

// GET /api/achievements — Return all standard achievement definitions
export async function GET() {
  try {
    const supabase = await createClient();

    // Try fetching from database if table exists, otherwise return standard definition set
    const { data, error } = await supabase
      .from('achievement_definitions')
      .select('*')
      .eq('is_active', true);

    if (error || !data || data.length === 0) {
      return NextResponse.json({
        achievements: STANDARD_ACHIEVEMENTS,
        source: 'definitions_fallback',
      });
    }

    return NextResponse.json({
      achievements: data,
      source: 'database',
    });
  } catch (err) {
    return NextResponse.json({
      achievements: STANDARD_ACHIEVEMENTS,
      source: 'definitions_fallback',
    });
  }
}
