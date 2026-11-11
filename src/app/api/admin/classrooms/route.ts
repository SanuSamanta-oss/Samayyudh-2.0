import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { extractClientIp, requireCommandSession, writeAuditLog } from '@/lib/security/admin-auth';
import { isMissingSchemaError } from '@/lib/supabase/admin';

function generateInviteCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(6);
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += alphabet[bytes[i] % alphabet.length];
  }
  return `CLS-${code}`;
}

export async function GET(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  let query = ctx.db
    .from('classrooms')
    .select('*')
    .order('created_at', { ascending: false });

  if (ctx.role === 'teacher') {
    query = query.eq('teacher_id', ctx.user.id);
  }

  const { data: classrooms, error } = await query;
  if (error) {
    if (isMissingSchemaError(error)) {
      return NextResponse.json({ schemaReady: false, items: [] });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const ids = (classrooms || []).map((c) => c.id);
  if (ids.length === 0) {
    return NextResponse.json({ schemaReady: true, items: [] });
  }

  const [membersRes, invitesRes, announcementsRes, assignmentsRes] = await Promise.all([
    ctx.db
      .from('classroom_members')
      .select('id, classroom_id, user_id, member_role, joined_at')
      .in('classroom_id', ids),
    ctx.db
      .from('classroom_invitations')
      .select('id, classroom_id, invite_code, status, max_uses, uses_count, expires_at, created_at')
      .in('classroom_id', ids)
      .order('created_at', { ascending: false }),
    ctx.db
      .from('classroom_announcements')
      .select('id, classroom_id, author_id, title, body, created_at')
      .in('classroom_id', ids)
      .order('created_at', { ascending: false }),
    ctx.db.from('assignments').select('id, classroom_id').in('classroom_id', ids),
  ]);

  const members = membersRes.data || [];
  const memberUserIds = Array.from(new Set(members.map((m) => m.user_id)));
  const { data: profiles } =
    memberUserIds.length > 0
      ? await ctx.db
          .from('profiles')
          .select('id, public_id, username, display_name')
          .in('id', memberUserIds)
      : { data: [] };

  const profileMap = new Map((profiles || []).map((p) => [p.id, p]));
  const invites = invitesRes.data || [];
  const announcements = announcementsRes.data || [];
  const assignRows = assignmentsRes.data || [];

  const enriched = (classrooms || []).map((c) => {
    const classMembers = members
      .filter((m) => m.classroom_id === c.id)
      .map((m) => ({
        ...m,
        profile: profileMap.get(m.user_id) || null,
      }));
    const classInvites = invites.filter((inv) => inv.classroom_id === c.id);
    const activeInvite = classInvites.find((inv) => inv.status === 'active');

    return {
      ...c,
      member_count: classMembers.length,
      assignment_count: assignRows.filter((a) => a.classroom_id === c.id).length,
      active_invite_code: activeInvite?.invite_code || null,
      invite_expires_at: activeInvite?.expires_at || null,
      members: classMembers,
      invitations: classInvites,
      announcements: announcements.filter((a) => a.classroom_id === c.id).slice(0, 10),
    };
  });

  return NextResponse.json({ schemaReady: true, items: enriched });
}

export async function POST(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const ipAddress = extractClientIp(req);
  const body = (await req.json().catch(() => ({}))) as {
    action?:
      | 'create_classroom'
      | 'create_invite'
      | 'revoke_invite'
      | 'add_member'
      | 'remove_member'
      | 'post_announcement';
    name?: string;
    description?: string;
    subject?: string;
    exam_category?: string;
    classroomId?: string;
    inviteId?: string;
    maxUses?: number | null;
    expiresInHours?: number | null;
    identifier?: string;
    userId?: string;
    title?: string;
    message?: string;
  };

  if (!body.action || body.action === 'create_classroom') {
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Classroom name is required.' }, { status: 400 });
    }
    const { data, error } = await ctx.db
      .from('classrooms')
      .insert({
        name: body.name.trim(),
        description: body.description?.trim() || '',
        subject: body.subject?.trim() || 'General',
        exam_category: body.exam_category?.trim() || 'GENERAL',
        teacher_id: ctx.user.id,
        status: 'active',
      })
      .select('*')
      .single();

    if (error) {
      if (isMissingSchemaError(error)) {
        return NextResponse.json({ error: 'Migration pending.', schemaReady: false }, { status: 503 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const inviteCode = generateInviteCode();
    await ctx.db.from('classroom_invitations').insert({
      classroom_id: data.id,
      created_by: ctx.user.id,
      invite_code: inviteCode,
      status: 'active',
      expires_at: new Date(Date.now() + 7 * 86_400_000).toISOString(),
    });

    await writeAuditLog(ctx.db, {
      actorId: ctx.user.id,
      actorRole: ctx.role,
      action: 'classroom.created',
      targetType: 'classroom',
      targetId: data.id,
      ipAddress,
      metadata: { name: data.name },
    });

    return NextResponse.json({ success: true, classroom: data, inviteCode }, { status: 201 });
  }

  if (!body.classroomId) {
    return NextResponse.json({ error: 'classroomId is required.' }, { status: 400 });
  }

  const { data: cls } = await ctx.db
    .from('classrooms')
    .select('id, teacher_id, name')
    .eq('id', body.classroomId)
    .maybeSingle();

  if (!cls) return NextResponse.json({ error: 'Classroom not found.' }, { status: 404 });
  if (ctx.role === 'teacher' && cls.teacher_id !== ctx.user.id) {
    return NextResponse.json({ error: 'You do not own this classroom.' }, { status: 403 });
  }

  if (body.action === 'create_invite') {
    const code = generateInviteCode();
    const expiresAt = body.expiresInHours
      ? new Date(Date.now() + body.expiresInHours * 3600_000).toISOString()
      : null;

    const { data, error } = await ctx.db
      .from('classroom_invitations')
      .insert({
        classroom_id: cls.id,
        created_by: ctx.user.id,
        invite_code: code,
        status: 'active',
        max_uses: body.maxUses ?? 50,
        expires_at: expiresAt,
      })
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, invitation: data });
  }

  if (body.action === 'revoke_invite' && body.inviteId) {
    const { error } = await ctx.db
      .from('classroom_invitations')
      .update({ status: 'revoked' })
      .eq('id', body.inviteId)
      .eq('classroom_id', cls.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  if (body.action === 'add_member') {
    const raw = (body.identifier || '').trim().replace(/^@/, '');
    if (!raw && !body.userId) {
      return NextResponse.json({ error: 'Provide student @username or SY- ID.' }, { status: 400 });
    }

    let targetUserId = body.userId || null;
    if (!targetUserId) {
      const upper = raw.toUpperCase();
      const { data: found } = upper.startsWith('SY-')
        ? await ctx.db.from('profiles').select('id').eq('public_id', upper).maybeSingle()
        : await ctx.db.from('profiles').select('id').ilike('username', raw).maybeSingle();
      targetUserId = found?.id ?? null;
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'No matching SamayYudh account found.' }, { status: 404 });
    }

    const { error } = await ctx.db.from('classroom_members').upsert(
      {
        classroom_id: cls.id,
        user_id: targetUserId,
        member_role: 'student',
      },
      { onConflict: 'classroom_id,user_id' }
    );
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await ctx.db.from('notifications').insert({
      user_id: targetUserId,
      category: 'classroom_invite',
      title: `Added to classroom: ${cls.name}`,
      body: 'You can now access classroom resources and assignments.',
      action_url: '/profile',
    });

    return NextResponse.json({ success: true });
  }

  if (body.action === 'remove_member' && body.userId) {
    const { error } = await ctx.db
      .from('classroom_members')
      .delete()
      .eq('classroom_id', cls.id)
      .eq('user_id', body.userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  if (body.action === 'post_announcement') {
    if (!body.title?.trim() || !body.message?.trim()) {
      return NextResponse.json({ error: 'Title and message are required.' }, { status: 400 });
    }
    const { data, error } = await ctx.db
      .from('classroom_announcements')
      .insert({
        classroom_id: cls.id,
        author_id: ctx.user.id,
        title: body.title.trim(),
        body: body.message.trim(),
      })
      .select('*')
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, announcement: data }, { status: 201 });
  }

  return NextResponse.json({ error: 'Unknown classroom action.' }, { status: 400 });
}

export async function PATCH(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const body = (await req.json().catch(() => ({}))) as {
    id?: string;
    name?: string;
    description?: string;
    subject?: string;
    status?: 'active' | 'archived';
  };
  if (!body.id) return NextResponse.json({ error: 'Classroom ID required.' }, { status: 400 });

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.name?.trim()) updates.name = body.name.trim();
  if (body.description !== undefined) updates.description = body.description?.trim() || '';
  if (body.subject !== undefined) updates.subject = body.subject?.trim() || 'General';
  if (body.status) updates.status = body.status;

  let query = ctx.db.from('classrooms').update(updates).eq('id', body.id);
  if (ctx.role === 'teacher') query = query.eq('teacher_id', ctx.user.id);
  const { data, error } = await query.select('*').maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, classroom: data });
}

export async function DELETE(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const body = (await req.json().catch(() => ({}))) as { id?: string };
  if (!body.id) return NextResponse.json({ error: 'Classroom ID required.' }, { status: 400 });

  let query = ctx.db.from('classrooms').delete().eq('id', body.id);
  if (ctx.role === 'teacher') query = query.eq('teacher_id', ctx.user.id);
  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await writeAuditLog(ctx.db, {
    actorId: ctx.user.id,
    actorRole: ctx.role,
    action: 'classroom.deleted',
    targetType: 'classroom',
    targetId: body.id,
    ipAddress: extractClientIp(req),
  });

  return NextResponse.json({ success: true });
}
