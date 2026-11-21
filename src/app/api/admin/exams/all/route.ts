import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { PlatformExamSummary } from '@/types/admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const status = searchParams.get('status') || 'all';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(5, parseInt(searchParams.get('limit') || '20', 10)));
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

    const supabase = await createClient();

    // Fetch exams with participants
    let query = supabase
      .from('custom_exams')
      .select(`
        id,
        exam_code,
        title,
        subject,
        exam_category,
        duration_minutes,
        total_marks,
        passing_marks,
        status,
        scheduled_start,
        scheduled_end,
        actual_start,
        actual_end,
        created_at,
        updated_at,
        created_by,
        assigned_teacher_id,
        assigned_teacher_name,
        assigned_teacher_email,
        questions,
        custom_exam_participants (
          id,
          student_id,
          exam_status,
          is_suspended,
          warning_count,
          joined_at,
          submitted_at
        )
      `, { count: 'exact' });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,exam_code.ilike.%${search}%,subject.ilike.%${search}%`);
    }

    // Apply sorting and pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.order(sortBy, { ascending: sortOrder === 'asc' }).range(from, to);

    const { data: exams, count, error } = await query;

    if (error) {
      console.error('[AdminExamsAPI] Fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Gather creator IDs to resolve creator profile names and emails
    const creatorIds = Array.from(new Set((exams || []).map((e: any) => e.created_by).filter(Boolean)));
    const userProfilesMap: Record<string, { name: string; email: string }> = {};

    if (creatorIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', creatorIds);

      if (profiles) {
        for (const p of profiles) {
          userProfilesMap[p.id] = {
            name: p.full_name || 'Teacher',
            email: p.email || '',
          };
        }
      }
    }

    // Transform to PlatformExamSummary
    const items: PlatformExamSummary[] = (exams || []).map((exam: any) => {
      const parts = exam.custom_exam_participants || [];
      const totalRegistered = parts.length;
      const totalJoined = parts.filter((p: any) => Boolean(p.joined_at)).length;
      const totalSubmitted = parts.filter((p: any) => p.exam_status === 'submitted' || Boolean(p.submitted_at)).length;
      const totalSuspended = parts.filter((p: any) => Boolean(p.is_suspended)).length;
      const totalFlagged = parts.filter((p: any) => (p.warning_count || 0) > 0 || Boolean(p.is_suspended)).length;
      const isLiveNow = exam.status === 'live';

      const creator = userProfilesMap[exam.created_by] || {
        name: exam.created_by ? 'Faculty Member' : 'Admin',
        email: '',
      };

      const questionsArr = Array.isArray(exam.questions) ? exam.questions : [];

      return {
        id: exam.id,
        exam_code: exam.exam_code,
        title: exam.title || 'Untitled Exam',
        subject: exam.subject || 'General',
        exam_category: exam.exam_category || 'custom',
        duration_minutes: exam.duration_minutes || 60,
        total_marks: exam.total_marks || 100,
        passing_marks: exam.passing_marks || 40,
        questions_count: questionsArr.length,
        status: exam.status,
        scheduled_start: exam.scheduled_start,
        scheduled_end: exam.scheduled_end,
        actual_start: exam.actual_start,
        actual_end: exam.actual_end,
        created_at: exam.created_at,
        updated_at: exam.updated_at,
        created_by: exam.created_by,
        creator_name: creator.name,
        creator_email: creator.email,
        assigned_teacher_id: exam.assigned_teacher_id || null,
        assigned_teacher_name: exam.assigned_teacher_name || null,
        assigned_teacher_email: exam.assigned_teacher_email || null,
        total_registered: totalRegistered,
        total_joined: totalJoined,
        total_submitted: totalSubmitted,
        total_suspended: totalSuspended,
        total_flagged: totalFlagged,
        is_live_now: isLiveNow,
      };
    });

    // Compute overall overview stats across the platform
    const { count: liveCount } = await supabase
      .from('custom_exams')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'live');

    const { count: scheduledCount } = await supabase
      .from('custom_exams')
      .select('*', { count: 'exact', head: true })
      .in('status', ['scheduled', 'waiting']);

    const { count: endedCount } = await supabase
      .from('custom_exams')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ended');

    const { count: totalExamsCount } = await supabase
      .from('custom_exams')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      items,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      stats: {
        total_exams: totalExamsCount || 0,
        live_exams: liveCount || 0,
        scheduled_exams: scheduledCount || 0,
        ended_exams: endedCount || 0,
      },
    });
  } catch (error: any) {
    console.error('[AdminExamsAPI] Unhandled error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
