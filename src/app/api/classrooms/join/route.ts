import { NextRequest, NextResponse } from 'next/server';
import { getCommandDataClient, isMissingSchemaError } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const { db, rlsDb } = await getCommandDataClient();
    const {
      data: { user },
    } = await rlsDb.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const { data: memberships, error } = await db
      .from('classroom_members')
      .select('id, classroom_id, member_role, joined_at')
      .eq('user_id', user.id);

    if (error) {
      if (isMissingSchemaError(error)) {
        return NextResponse.json({ schemaReady: false, classrooms: [] });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const clsIds = (memberships || []).map((m) => m.classroom_id);
    if (clsIds.length === 0) {
      return NextResponse.json({ schemaReady: true, classrooms: [] });
    }

    const { data: classrooms } = await db
      .from('classrooms')
      .select('id, name, description, subject, exam_category, status')
      .in('id', clsIds)
      .eq('status', 'active');

    return NextResponse.json({ schemaReady: true, classrooms: classrooms || [] });
  } catch (err) {
    console.error('[GET /api/classrooms/join] error:', err);
    return NextResponse.json({ error: 'Failed to load classrooms' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { db, rlsDb } = await getCommandDataClient();
    const {
      data: { user },
    } = await rlsDb.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const body = (await req.json().catch(() => ({}))) as { inviteCode?: string };
    const code = (body.inviteCode || '').trim().toUpperCase();
    if (!code) {
      return NextResponse.json({ error: 'Invite code is required.' }, { status: 400 });
    }

    const { data: invite, error } = await db
      .from('classroom_invitations')
      .select('id, classroom_id, max_uses, uses_count, expires_at, status')
      .eq('invite_code', code)
      .maybeSingle();

    if (error) {
      if (isMissingSchemaError(error)) {
        return NextResponse.json({ error: 'Migration pending.', schemaReady: false }, { status: 503 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!invite || invite.status === 'revoked') {
      return NextResponse.json({ error: 'Invite code is invalid or has been revoked.' }, { status: 404 });
    }
    if (invite.expires_at && new Date(invite.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: 'This classroom invite code has expired.' }, { status: 410 });
    }
    if (typeof invite.max_uses === 'number' && invite.uses_count >= invite.max_uses) {
      return NextResponse.json({ error: 'This invite code has reached its usage limit.' }, { status: 410 });
    }

    const { error: joinErr } = await db.from('classroom_members').upsert(
      {
        classroom_id: invite.classroom_id,
        user_id: user.id,
        member_role: 'student',
      },
      { onConflict: 'classroom_id,user_id' }
    );
    if (joinErr) return NextResponse.json({ error: joinErr.message }, { status: 400 });

    await db
      .from('classroom_invitations')
      .update({ uses_count: (invite.uses_count || 0) + 1 })
      .eq('id', invite.id);

    const { data: classroom } = await db
      .from('classrooms')
      .select('id, name, subject, exam_category')
      .eq('id', invite.classroom_id)
      .maybeSingle();

    return NextResponse.json({ success: true, classroom });
  } catch (err) {
    console.error('[POST /api/classrooms/join] error:', err);
    return NextResponse.json({ error: 'Failed to join classroom' }, { status: 500 });
  }
}
