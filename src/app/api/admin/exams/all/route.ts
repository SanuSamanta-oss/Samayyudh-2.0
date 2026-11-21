import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { listTeacherCustomExams } from '@/lib/exams/custom-exam-service';
import type { PlatformExamSummary } from '@/types/admin';

function mapCustomExamToSummary(exam: any): PlatformExamSummary {
  const parts = exam.custom_exam_participants || [];
  const totalRegistered = parts.length;
  const totalJoined = parts.filter((p: any) => Boolean(p.joined_at)).length;
  const totalSubmitted = parts.filter((p: any) => p.exam_status === 'submitted' || Boolean(p.submitted_at)).length;
  const totalSuspended = parts.filter((p: any) => Boolean(p.is_suspended)).length;
  const totalFlagged = parts.filter((p: any) => (p.warning_count || 0) > 0 || Boolean(p.is_suspended)).length;
  const isLiveNow = exam.status === 'live';

  const questionsArr = Array.isArray(exam.selected_questions)
    ? exam.selected_questions
    : Array.isArray(exam.questions)
    ? exam.questions
    : [];

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
    status: exam.status || 'waiting',
    scheduled_start: exam.scheduled_start || exam.start_time || null,
    scheduled_end: exam.scheduled_end || exam.end_time || null,
    actual_start: exam.actual_start || exam.start_time || null,
    actual_end: exam.actual_end || exam.end_time || null,
    created_at: exam.created_at || new Date().toISOString(),
    updated_at: exam.updated_at || new Date().toISOString(),
    created_by: exam.created_by || null,
    creator_name: exam.creator_name || 'Faculty Member',
    creator_email: exam.creator_email || 'faculty@institution.ac.in',
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
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const status = searchParams.get('status') || 'all';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(5, parseInt(searchParams.get('limit') || '20', 10)));
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

    let dbExams: any[] = [];
    let dbCount = 0;
    let dbSuccess = false;

    try {
      const supabase = await createClient();
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

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.order(sortBy, { ascending: sortOrder === 'asc' }).range(from, to);

      const { data, count, error } = await query;
      if (!error && data) {
        dbExams = data;
        dbCount = count || data.length;
        dbSuccess = true;
      }
    } catch (dbErr) {
      console.warn('[AdminExamsAPI] Supabase query bypassed or failed:', dbErr);
    }

    // Always fetch fallback / local memory exams to merge newly created or offline exams
    const localExams = await listTeacherCustomExams(null);
    const localSummaries = localExams.map(mapCustomExamToSummary);

    // Merge: if Supabase succeeded, add any local exams that aren't in Supabase yet
    let combinedItems: PlatformExamSummary[] = [];

    if (dbSuccess && dbExams.length > 0) {
      const dbSummaries = dbExams.map((exam) => mapCustomExamToSummary(exam));
      const seenCodes = new Set(dbSummaries.map((e) => e.exam_code));
      const seenIds = new Set(dbSummaries.map((e) => e.id));

      const unpersistedLocals = localSummaries.filter(
        (e) => !seenCodes.has(e.exam_code) && !seenIds.has(e.id)
      );

      combinedItems = [...unpersistedLocals, ...dbSummaries];
    } else {
      // Supabase table not created yet or empty: use local custom exam registry
      combinedItems = localSummaries;
    }

    // Filter combined items
    let filtered = combinedItems;
    if (status !== 'all') {
      filtered = filtered.filter((e) => e.status === status);
    }
    if (search) {
      filtered = filtered.filter(
        (e) =>
          (e.title && e.title.toLowerCase().includes(search)) ||
          (e.exam_code && e.exam_code.toLowerCase().includes(search)) ||
          (e.subject && e.subject.toLowerCase().includes(search))
      );
    }

    const total = filtered.length;
    const from = (page - 1) * limit;
    const paged = filtered.slice(from, from + limit);

    // Stats calculation across all available exams
    const totalExamsCount = combinedItems.length;
    const liveCount = combinedItems.filter((e) => e.status === 'live').length;
    const scheduledCount = combinedItems.filter((e) => e.status === 'scheduled' || e.status === 'waiting').length;
    const endedCount = combinedItems.filter((e) => (e.status as string) === 'ended' || (e.status as string) === 'completed').length;

    return NextResponse.json({
      items: paged,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      stats: {
        total_exams: totalExamsCount,
        live_exams: liveCount,
        scheduled_exams: scheduledCount,
        ended_exams: endedCount,
      },
    });
  } catch (error: any) {
    console.error('[AdminExamsAPI] Unhandled error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
