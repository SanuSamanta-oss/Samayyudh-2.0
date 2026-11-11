import { NextRequest, NextResponse } from 'next/server';
import { requireCommandSession } from '@/lib/security/admin-auth';
import { isMissingSchemaError } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  let query = ctx.db
    .from('student_groups')
    .select('*')
    .order('created_at', { ascending: false });

  if (ctx.role === 'teacher') {
    query = query.eq('teacher_id', ctx.user.id);
  }

  const { data: groups, error } = await query;
  if (error) {
    if (isMissingSchemaError(error)) {
      return NextResponse.json({ schemaReady: false, items: [] });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const ids = (groups || []).map((g) => g.id);
  if (ids.length === 0) {
    return NextResponse.json({ schemaReady: true, items: [] });
  }

  const { data: members } = await ctx.db
    .from('group_members')
    .select('id, group_id, user_id, added_at')
    .in('group_id', ids);

  const memberIds = Array.from(new Set((members || []).map((m) => m.user_id)));
  const { data: profiles } =
    memberIds.length > 0
      ? await ctx.db
          .from('profiles')
          .select('id, public_id, username, display_name, avatar_url')
          .in('id', memberIds)
      : { data: [] };

  const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

  const items = (groups || []).map((g) => {
    const groupMembers = (members || []).filter((m) => m.group_id === g.id);
    return {
      ...g,
      member_ids: groupMembers.map((m) => m.user_id),
      members: groupMembers.map((m) => {
        const p = profileMap.get(m.user_id);
        return {
          user_id: m.user_id,
          public_id: p?.public_id || 'SY-MEMBER',
          username: p?.username || '',
          display_name: p?.display_name || 'Student',
          avatar_url: p?.avatar_url || null,
          role: 'student',
        };
      }),
    };
  });

  return NextResponse.json({ schemaReady: true, items });
}

export async function POST(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const body = (await req.json().catch(() => ({}))) as {
    action?: 'create_group' | 'add_member' | 'remove_member';
    name?: string;
    description?: string;
    classroomId?: string | null;
    groupId?: string;
    identifier?: string;
    userId?: string;
  };

  if (!body.action || body.action === 'create_group') {
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Group name is required.' }, { status: 400 });
    }
    const { data, error } = await ctx.db
      .from('student_groups')
      .insert({
        name: body.name.trim(),
        description: body.description?.trim() || '',
        teacher_id: ctx.user.id,
        classroom_id: body.classroomId || null,
        is_private: true,
      })
      .select('*')
      .single();

    if (error) {
      if (isMissingSchemaError(error)) {
        return NextResponse.json({ error: 'Migration pending.', schemaReady: false }, { status: 503 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, group: data }, { status: 201 });
  }

  if (!body.groupId) {
    return NextResponse.json({ error: 'groupId is required.' }, { status: 400 });
  }

  const { data: group } = await ctx.db
    .from('student_groups')
    .select('id, teacher_id')
    .eq('id', body.groupId)
    .maybeSingle();

  if (!group) return NextResponse.json({ error: 'Group not found.' }, { status: 404 });
  if (ctx.role === 'teacher' && group.teacher_id !== ctx.user.id) {
    return NextResponse.json({ error: 'You do not own this group.' }, { status: 403 });
  }

  if (body.action === 'add_member') {
    const raw = (body.identifier || '').trim().replace(/^@/, '');
    let targetId = body.userId || null;

    if (!targetId && raw) {
      const upper = raw.toUpperCase();
      const { data: found } = upper.startsWith('SY-')
        ? await ctx.db.from('profiles').select('id').eq('public_id', upper).maybeSingle()
        : await ctx.db.from('profiles').select('id').ilike('username', raw).maybeSingle();
      targetId = found?.id ?? null;
    }

    if (!targetId) {
      return NextResponse.json({ error: 'Student not found.' }, { status: 404 });
    }

    const { error } = await ctx.db.from('group_members').upsert(
      { group_id: group.id, user_id: targetId },
      { onConflict: 'group_id,user_id' }
    );
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  if (body.action === 'remove_member' && body.userId) {
    const { error } = await ctx.db
      .from('group_members')
      .delete()
      .eq('group_id', group.id)
      .eq('user_id', body.userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Unsupported group action.' }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const body = (await req.json().catch(() => ({}))) as { id?: string };
  if (!body.id) return NextResponse.json({ error: 'Group ID required.' }, { status: 400 });

  let query = ctx.db.from('student_groups').delete().eq('id', body.id);
  if (ctx.role === 'teacher') query = query.eq('teacher_id', ctx.user.id);
  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
