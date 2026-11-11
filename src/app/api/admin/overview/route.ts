import { NextRequest, NextResponse } from 'next/server';
import { requireCommandSession } from '@/lib/security/admin-auth';
import { isMissingSchemaError } from '@/lib/supabase/admin';
import { questionBank as staticQuestionBank } from '@/lib/questions';
import type { AdminOverviewPayload } from '@/types/admin';

export async function GET(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const { db } = ctx;

  try {
    const [
      profilesRes,
      rolesRes,
      questionsRes,
      resourcesRes,
      assignmentsRes,
      classroomsRes,
      pendingConnRes,
      auditRes,
      notificationsRes,
      sessionsRes,
    ] = await Promise.all([
      db.from('profiles').select('id', { count: 'exact', head: true }),
      db.from('user_roles').select('role'),
      db.from('questions').select('id, subject, difficulty, status, exam_code, created_at'),
      db
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8),
      db.from('assignments').select('id', { count: 'exact', head: true }),
      db.from('classrooms').select('id, status'),
      db
        .from('connection_requests')
        .select('id', { count: 'exact', head: true })
        .eq('recipient_id', ctx.user.id)
        .eq('status', 'pending'),
      db
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12),
      db
        .from('notifications')
        .select('*')
        .eq('user_id', ctx.user.id)
        .order('created_at', { ascending: false })
        .limit(20),
      db
        .from('exam_sessions')
        .select('id, started_at, score, total_marks')
        .gte('started_at', new Date(Date.now() - 14 * 86_400_000).toISOString())
        .limit(500),
    ]);

    const schemaMissing =
      isMissingSchemaError(rolesRes.error) ||
      isMissingSchemaError(resourcesRes.error) ||
      isMissingSchemaError(classroomsRes.error);

    const roleRows = rolesRes.error ? [] : rolesRes.data || [];
    const teachersCount = roleRows.filter(
      (r) => r.role === 'teacher' || r.role === 'admin' || r.role === 'super_admin'
    ).length;

    const totalProfiles = profilesRes.count ?? 0;
    const explicitStudents = roleRows.filter((r) => r.role === 'student').length;
    const studentsCount = Math.max(explicitStudents, Math.max(0, totalProfiles - teachersCount));

    const dbQuestions = questionsRes.error ? [] : questionsRes.data || [];
    const totalQuestions = dbQuestions.length + staticQuestionBank.length;

    const classroomsList = classroomsRes.error ? [] : classroomsRes.data || [];
    const activeClassrooms = classroomsList.filter((c) => c.status !== 'archived').length;
    const resourcesList = resourcesRes.error ? [] : resourcesRes.data || [];

    const sevenDaysAgo = Date.now() - 7 * 86_400_000;
    const recentUploads7d = resourcesList.filter(
      (r) => new Date(r.created_at).getTime() >= sevenDaysAgo
    ).length;

    const subjectMap = new Map<string, number>();
    for (const q of dbQuestions) {
      const key = q.subject || 'General';
      subjectMap.set(key, (subjectMap.get(key) || 0) + 1);
    }
    for (const sq of staticQuestionBank) {
      const key = sq.subject || 'General';
      subjectMap.set(key, (subjectMap.get(key) || 0) + 1);
    }
    const subjectDistribution = Array.from(subjectMap.entries())
      .map(([subject, count]) => ({ subject, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const growthSeries: { label: string; sessions: number; questions_added: number }[] = [];
    const sessionRows = sessionsRes.error ? [] : sessionsRes.data || [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(Date.now() - i * 86_400_000);
      const iso = day.toISOString().slice(0, 10);
      const label = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const daySessions = sessionRows.filter((s) => (s.started_at || '').startsWith(iso)).length;
      const dayQuestions = dbQuestions.filter((q) => (q.created_at || '').startsWith(iso)).length;
      growthSeries.push({
        label,
        sessions: daySessions,
        questions_added: dayQuestions,
      });
    }

    const auditRows = auditRes.error ? [] : auditRes.data || [];
    const payload: AdminOverviewPayload = {
      role: ctx.role,
      schema_ready: !schemaMissing,
      stats: {
        total_students: studentsCount,
        total_teachers: teachersCount,
        total_questions: totalQuestions,
        custom_questions: dbQuestions.length,
        builtin_questions: staticQuestionBank.length,
        total_resources: resourcesList.length,
        total_assignments: assignmentsRes.error ? 0 : (assignmentsRes.count ?? 0),
        active_classrooms: activeClassrooms,
        pending_connections: pendingConnRes.error ? 0 : (pendingConnRes.count ?? 0),
        recent_uploads_7d: recentUploads7d,
      },
      activity_feed: auditRows.slice(0, 8).map((a) => ({
        id: String(a.id),
        type: String(a.target_type || 'system'),
        title: String(a.action),
        subtitle: a.target_id ? `${a.target_type || 'item'}: ${a.target_id}` : 'Command event',
        timestamp: String(a.created_at),
      })),
      recent_resources: resourcesList,
      recent_audit: auditRows,
      notifications: notificationsRes.error ? [] : notificationsRes.data || [],
      health: {
        schema_ready: !schemaMissing,
        passkey_configured: ctx.passkeyConfigured,
        has_service_role: ctx.hasServiceRole,
        gemini_configured: Boolean(process.env.GEMINI_API_KEY),
      },
      charts: {
        growth_series: growthSeries,
        subject_distribution: subjectDistribution,
      },
    };

    return NextResponse.json(payload);
  } catch (err) {
    console.error('[GET /api/admin/overview] error:', err);
    return NextResponse.json({ error: 'Failed to load command overview' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const body = (await req.json().catch(() => ({}))) as {
    markAll?: boolean;
    ids?: string[];
  };

  let query = ctx.db
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', ctx.user.id)
    .eq('is_read', false);

  if (!body.markAll && Array.isArray(body.ids) && body.ids.length > 0) {
    query = query.in('id', body.ids);
  }

  const { error } = await query;
  if (error && !isMissingSchemaError(error)) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
