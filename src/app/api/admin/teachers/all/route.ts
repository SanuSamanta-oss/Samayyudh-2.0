import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { PlatformTeacherDirectoryItem } from '@/types/admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';

    const supabase = await createClient();

    // Query profiles where role is teacher or teacher_profiles exists
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, created_at, updated_at')
      .in('role', ['teacher', 'faculty', 'admin', 'super_admin'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[AdminTeachersAPI] Error fetching profiles:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Query exams to calculate portfolio statistics per teacher
    const { data: allExams } = await supabase
      .from('custom_exams')
      .select('id, created_by, assigned_teacher_id, status');

    const examsList: any[] = allExams || [];

    const items: PlatformTeacherDirectoryItem[] = ((profiles as any[]) || [])
      .map((p: any) => {
        const createdCount = examsList.filter((e: any) => e.created_by === p.id).length;
        const supervisedCount = examsList.filter((e: any) => e.assigned_teacher_id === p.id).length;
        const liveNow = examsList.filter(
          (e: any) => (e.created_by === p.id || e.assigned_teacher_id === p.id) && e.status === 'live'
        ).length;

        return {
          id: p.id,
          name: p.full_name || 'Educator',
          email: p.email || '',
          institution: 'Department of Science & Technology',
          role: p.role,
          verified: true,
          total_exams_created: createdCount,
          total_exams_supervised: supervisedCount,
          active_exams_now: liveNow,
          last_active: p.updated_at || p.created_at,
          created_at: p.created_at,
        };
      })
      .filter((t: PlatformTeacherDirectoryItem) => {
        if (!search) return true;
        return (
          t.name.toLowerCase().includes(search) ||
          t.email.toLowerCase().includes(search) ||
          (t.institution && t.institution.toLowerCase().includes(search))
        );
      });

    return NextResponse.json({ items, total: items.length });
  } catch (err: any) {
    console.error('[AdminTeachersAPI] Exception:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
