import { NextRequest, NextResponse } from 'next/server';
import { requireCommandSession } from '@/lib/security/admin-auth';
import { isMissingSchemaError } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const { db } = ctx;

  try {
    let query = db
      .from('proctoring_sessions')
      .select('*')
      .eq('status', 'active')
      .order('started_at', { ascending: false });

    // If role is teacher, restrict to classrooms taught by this teacher
    if (ctx.role === 'teacher') {
      const { data: myClassrooms } = await db
        .from('classrooms')
        .select('id')
        .eq('teacher_id', ctx.user.id);

      const classroomIds = (myClassrooms || []).map((c) => c.id);
      if (classroomIds.length > 0) {
        query = query.in('classroom_id', classroomIds);
      } else {
        // Teacher has no classrooms yet
        return NextResponse.json({ sessions: [] });
      }
    }

    const { data: sessions, error } = await query;

    if (error) {
      if (isMissingSchemaError(error)) {
        return NextResponse.json({ sessions: [] });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!sessions || sessions.length === 0) {
      return NextResponse.json({ sessions: [] });
    }

    // Enrich sessions with student profile info & flag counts
    const studentIds = Array.from(new Set(sessions.map((s) => s.student_id)));
    const sessionIds = sessions.map((s) => s.id);

    const [profilesRes, eventsRes, classroomsRes] = await Promise.all([
      db
        .from('profiles')
        .select('id, display_name, username, avatar_url, public_id')
        .in('id', studentIds),
      db
        .from('proctoring_events')
        .select('id, session_id, severity')
        .in('session_id', sessionIds),
      db
        .from('classrooms')
        .select('id, name')
        .in('id', sessions.map((s) => s.classroom_id).filter(Boolean)),
    ]);

    const profileMap = new Map((profilesRes.data || []).map((p) => [p.id, p]));
    const classroomMap = new Map((classroomsRes.data || []).map((c) => [c.id, c.name]));

    const flagsMap = new Map<string, number>();
    (eventsRes.data || []).forEach((ev) => {
      if (ev.severity === 'warning' || ev.severity === 'critical') {
        flagsMap.set(ev.session_id, (flagsMap.get(ev.session_id) || 0) + 1);
      }
    });

    const enrichedSessions = sessions.map((s) => {
      const profile = profileMap.get(s.student_id);
      return {
        ...s,
        student_name: profile?.display_name || profile?.username || 'Student',
        student_avatar: profile?.avatar_url || null,
        student_public_id: profile?.public_id || null,
        classroom_name: s.classroom_id ? classroomMap.get(s.classroom_id) || null : null,
        flags_count: flagsMap.get(s.id) || 0,
      };
    });

    return NextResponse.json({ sessions: enrichedSessions });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
