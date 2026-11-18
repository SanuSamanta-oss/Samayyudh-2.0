import { NextRequest, NextResponse } from 'next/server';
import { createServerRlsClient } from '@/lib/supabase/server';
import { getCommandDataClient, isMissingSchemaError } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const rlsDb = await createServerRlsClient();
    const {
      data: { user },
      error: userErr,
    } = await rlsDb.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { studentCode } = body;

    if (!studentCode || typeof studentCode !== 'string') {
      return NextResponse.json({ error: 'Please enter a valid Student ID or Link Code' }, { status: 400 });
    }

    const trimmedCode = studentCode.trim().toUpperCase();
    const { db } = await getCommandDataClient();

    // Look up student by public_id or username
    const { data: studentProfile, error: profileErr } = await db
      .from('profiles')
      .select('id, display_name, username, avatar_url, public_id')
      .or(`public_id.eq.${trimmedCode},username.ilike.${trimmedCode}`)
      .maybeSingle();

    if (profileErr && !isMissingSchemaError(profileErr)) {
      return NextResponse.json({ error: profileErr.message }, { status: 400 });
    }

    if (!studentProfile) {
      return NextResponse.json({ error: 'No student found matching this Student ID / Code' }, { status: 404 });
    }

    if (studentProfile.id === user.id) {
      return NextResponse.json({ error: 'You cannot link your own account as a student' }, { status: 400 });
    }

    // Upsert parent_student_link
    try {
      const { data: link, error: linkErr } = await db
        .from('parent_student_links')
        .upsert(
          {
            parent_id: user.id,
            student_id: studentProfile.id,
            link_code: trimmedCode,
            status: 'active',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'parent_id,student_id' }
        )
        .select('*')
        .single();

      if (linkErr && !isMissingSchemaError(linkErr)) {
        return NextResponse.json({ error: linkErr.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        student: {
          id: studentProfile.id,
          name: studentProfile.display_name || studentProfile.username,
          public_id: studentProfile.public_id,
          avatar_url: studentProfile.avatar_url,
        },
      });
    } catch (err) {
      return NextResponse.json({ error: 'Failed to establish parent link' }, { status: 500 });
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const rlsDb = await createServerRlsClient();
    const {
      data: { user },
      error: userErr,
    } = await rlsDb.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await getCommandDataClient();

    const { data: links, error: linksErr } = await db
      .from('parent_student_links')
      .select('id, parent_id, student_id, status, created_at')
      .eq('parent_id', user.id)
      .eq('status', 'active');

    if (linksErr) {
      if (isMissingSchemaError(linksErr)) {
        return NextResponse.json({ children: [] });
      }
      return NextResponse.json({ error: linksErr.message }, { status: 400 });
    }

    if (!links || links.length === 0) {
      return NextResponse.json({ children: [] });
    }

    const studentIds = links.map((l) => l.student_id);

    // Fetch student profiles and active proctoring sessions
    const [profilesRes, sessionsRes, configsRes] = await Promise.all([
      db
        .from('profiles')
        .select('id, display_name, username, avatar_url, public_id')
        .in('id', studentIds),
      db
        .from('proctoring_sessions')
        .select('*')
        .in('student_id', studentIds)
        .eq('status', 'active'),
      db
        .from('proctoring_configs')
        .select('exam_code, parent_stream_enabled'),
    ]);

    const profileMap = new Map((profilesRes.data || []).map((p) => [p.id, p]));
    const sessionMap = new Map((sessionsRes.data || []).map((s) => [s.student_id, s]));
    const configMap = new Map((configsRes.data || []).map((c) => [c.exam_code, c.parent_stream_enabled]));

    const children = links.map((l) => {
      const profile = profileMap.get(l.student_id);
      const activeSession = sessionMap.get(l.student_id);

      // Check if parent stream is enabled by exam policy
      let parentStreamAllowed = true;
      if (activeSession?.exam_code && configMap.has(activeSession.exam_code)) {
        parentStreamAllowed = Boolean(configMap.get(activeSession.exam_code));
      }

      return {
        linkId: l.id,
        studentId: l.student_id,
        studentName: profile?.display_name || profile?.username || 'Student',
        studentPublicId: profile?.public_id || null,
        studentAvatar: profile?.avatar_url || null,
        activeSession: activeSession
          ? {
              ...activeSession,
              parentStreamAllowed,
            }
          : null,
      };
    });

    return NextResponse.json({ children });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
