import { NextRequest, NextResponse } from 'next/server';
import { extractClientIp, requireCommandSession, writeAuditLog } from '@/lib/security/admin-auth';
import { isMissingSchemaError } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  let query = ctx.db
    .from('assignments')
    .select('*')
    .order('created_at', { ascending: false });

  if (ctx.role === 'teacher') {
    query = query.eq('teacher_id', ctx.user.id);
  }

  const { data: assignments, error } = await query;
  if (error) {
    if (isMissingSchemaError(error)) {
      return NextResponse.json({ schemaReady: false, items: [] });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const ids = (assignments || []).map((a) => a.id);
  const [linksRes, subsRes] =
    ids.length > 0
      ? await Promise.all([
          ctx.db.from('assignment_questions').select('assignment_id, question_id').in('assignment_id', ids),
          ctx.db
            .from('assignment_submissions')
            .select('id, assignment_id, student_id, status, score, max_score, submitted_at, feedback')
            .in('assignment_id', ids)
            .order('submitted_at', { ascending: false }),
        ])
      : [{ data: [] }, { data: [] }];

  const links = linksRes.data || [];
  const subs = subsRes.data || [];

  const subStudentIds = Array.from(new Set(subs.map((s) => s.student_id)));
  const { data: profiles } =
    subStudentIds.length > 0
      ? await ctx.db
          .from('profiles')
          .select('id, public_id, display_name')
          .in('id', subStudentIds)
      : { data: [] };
  const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

  const items = (assignments || []).map((a) => {
    const aSubs = subs.filter((s) => s.assignment_id === a.id);
    return {
      ...a,
      question_count: links.filter((l) => l.assignment_id === a.id).length,
      submission_count: aSubs.length,
      submissions: aSubs.map((s) => ({
        ...s,
        student_name: profileMap.get(s.student_id)?.display_name || 'Student',
        student_public_id: profileMap.get(s.student_id)?.public_id || '',
      })),
    };
  });

  return NextResponse.json({ schemaReady: true, items });
}

export async function POST(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const body = (await req.json().catch(() => ({}))) as {
    title?: string;
    description?: string;
    due_at?: string | null;
    time_limit_minutes?: number;
    max_marks?: number;
    classroom_id?: string | null;
    group_id?: string | null;
    resource_id?: string | null;
    question_ids?: string[];
    status?: 'draft' | 'published' | 'archived';
    submission_type?: 'mcq' | 'pdf' | 'descriptive' | 'mixed';
  };

  if (!body.title?.trim()) {
    return NextResponse.json({ error: 'Assignment title is required.' }, { status: 400 });
  }

  const { data, error } = await ctx.db
    .from('assignments')
    .insert({
      title: body.title.trim(),
      description: body.description?.trim() || '',
      due_at: body.due_at || null,
      time_limit_minutes: Number(body.time_limit_minutes ?? 60),
      max_marks: Number(body.max_marks ?? 100),
      status: body.status || 'published',
      submission_type: body.submission_type || 'mixed',
      teacher_id: ctx.user.id,
      classroom_id: body.classroom_id || null,
      group_id: body.group_id || null,
      resource_id: body.resource_id || null,
    })
    .select('*')
    .single();

  if (error) {
    if (isMissingSchemaError(error)) {
      return NextResponse.json({ error: 'Migration pending.', schemaReady: false }, { status: 503 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const qIds = Array.isArray(body.question_ids) ? body.question_ids : [];
  if (qIds.length > 0) {
    await ctx.db.from('assignment_questions').insert(
      qIds.map((qId, idx) => ({
        assignment_id: data.id,
        question_id: qId,
        sort_order: idx,
      }))
    );
  }

  await writeAuditLog(ctx.db, {
    actorId: ctx.user.id,
    actorRole: ctx.role,
    action: 'assignment.created',
    targetType: 'assignment',
    targetId: data.id,
    ipAddress: extractClientIp(req),
  });

  return NextResponse.json({ success: true, assignment: data }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const body = (await req.json().catch(() => ({}))) as {
    id?: string;
    status?: string;
    submissionId?: string;
    score?: number;
    feedback?: string;
  };

  if (body.submissionId) {
    const { data, error } = await ctx.db
      .from('assignment_submissions')
      .update({
        score: typeof body.score === 'number' ? body.score : undefined,
        feedback: typeof body.feedback === 'string' ? body.feedback : undefined,
        status: 'evaluated',
        evaluated_at: new Date().toISOString(),
      })
      .eq('id', body.submissionId)
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, submission: data });
  }

  if (!body.id) return NextResponse.json({ error: 'Assignment ID required.' }, { status: 400 });

  let query = ctx.db
    .from('assignments')
    .update({ status: body.status || 'published', updated_at: new Date().toISOString() })
    .eq('id', body.id);
  if (ctx.role === 'teacher') query = query.eq('teacher_id', ctx.user.id);
  const { data, error } = await query.select('*').maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, assignment: data });
}

export async function DELETE(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const body = (await req.json().catch(() => ({}))) as { id?: string };
  if (!body.id) return NextResponse.json({ error: 'Assignment ID required.' }, { status: 400 });

  let query = ctx.db.from('assignments').delete().eq('id', body.id);
  if (ctx.role === 'teacher') query = query.eq('teacher_id', ctx.user.id);
  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
