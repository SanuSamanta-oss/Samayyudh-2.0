import { NextRequest, NextResponse } from 'next/server';
import { extractClientIp, requireCommandSession, writeAuditLog } from '@/lib/security/admin-auth';
import { isMissingSchemaError } from '@/lib/supabase/admin';
import { deriveFallbackPublicId } from '@/lib/admin/public-id';
import type { CommandRole } from '@/types/admin';

export async function GET(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const sp = req.nextUrl.searchParams;
  const search = (sp.get('search') || '').trim().toLowerCase();
  const roleFilter = sp.get('role') || '';

  let allowedIds: Set<string> | null = null;
  if (ctx.role === 'teacher') {
    const [clsRes, grpRes, connRes] = await Promise.all([
      ctx.db.from('classrooms').select('id').eq('teacher_id', ctx.user.id),
      ctx.db.from('student_groups').select('id').eq('teacher_id', ctx.user.id),
      ctx.db
        .from('connections')
        .select('user_a, user_b')
        .eq('status', 'accepted')
        .or(`user_a.eq.${ctx.user.id},user_b.eq.${ctx.user.id}`),
    ]);

    const cIds = (clsRes.data || []).map((c) => c.id);
    const gIds = (grpRes.data || []).map((g) => g.id);

    const [cmRes, gmRes] = await Promise.all([
      cIds.length > 0
        ? ctx.db.from('classroom_members').select('user_id').in('classroom_id', cIds)
        : Promise.resolve({ data: [] }),
      gIds.length > 0
        ? ctx.db.from('group_members').select('user_id').in('group_id', gIds)
        : Promise.resolve({ data: [] }),
    ]);

    allowedIds = new Set<string>([ctx.user.id]);
    for (const row of cmRes.data || []) allowedIds.add(row.user_id);
    for (const row of gmRes.data || []) allowedIds.add(row.user_id);
    for (const row of connRes.data || []) {
      allowedIds.add(row.user_a);
      allowedIds.add(row.user_b);
    }
  }

  let profileQuery = ctx.db
    .from('profiles')
    .select('id, public_id, username, display_name, avatar_url, preferred_exam, account_status, created_at')
    .order('created_at', { ascending: false })
    .limit(300);

  if (allowedIds) {
    profileQuery = profileQuery.in('id', Array.from(allowedIds));
  }

  const { data: profiles, error: profErr } = await profileQuery;
  let profileRows = profiles || [];
  let schemaReady = true;

  if (profErr) {
    if (isMissingSchemaError(profErr)) {
      schemaReady = false;
      const { data: fallbackProfiles } = await ctx.db
        .from('profiles')
        .select('id, display_name, avatar_url, created_at')
        .order('created_at', { ascending: false })
        .limit(200);
      profileRows = (fallbackProfiles || []).map((p) => ({
        ...p,
        public_id: deriveFallbackPublicId(p.id),
        username: '',
        preferred_exam: '',
        account_status: 'active',
      }));
    } else {
      return NextResponse.json({ error: profErr.message }, { status: 400 });
    }
  }

  const ids = profileRows.map((p) => p.id);
  const [rolesRes, sessRes] =
    ids.length > 0
      ? await Promise.all([
          ctx.db.from('user_roles').select('user_id, role').in('user_id', ids),
          ctx.db
            .from('exam_sessions')
            .select('user_id, score, total_marks')
            .in('user_id', ids)
            .limit(1000),
        ])
      : [{ data: [], error: null }, { data: [], error: null }];

  if (isMissingSchemaError(rolesRes.error)) schemaReady = false;

  const roleMap = new Map(
    (rolesRes.data || []).map((r) => [r.user_id, (r.role as CommandRole) || 'student'])
  );

  const sessByUser = new Map<string, Array<{ score: number; total_marks: number }>>();
  for (const s of sessRes.data || []) {
    const arr = sessByUser.get(s.user_id) || [];
    arr.push(s);
    sessByUser.set(s.user_id, arr);
  }

  let items = profileRows.map((p) => {
    const role = roleMap.get(p.id) || 'student';
    const uSessions = sessByUser.get(p.id) || [];
    const avgScore =
      uSessions.length > 0
        ? Math.round(
            uSessions.reduce(
              (acc, s) => acc + ((s.score || 0) / Math.max(1, s.total_marks || 1)) * 100,
              0
            ) / uSessions.length
          )
        : 0;

    return {
      user_id: p.id,
      public_id: p.public_id || deriveFallbackPublicId(p.id),
      username: p.username || '',
      display_name: p.display_name || 'SamayYudh Aspirant',
      avatar_url: p.avatar_url ?? null,
      preferred_exam: p.preferred_exam || '',
      role,
      account_status: (p.account_status as 'active' | 'suspended' | 'archived') || 'active',
      sessions_count: uSessions.length,
      avg_score: avgScore,
      created_at: p.created_at,
    };
  });

  if (search) {
    items = items.filter(
      (i) =>
        i.display_name.toLowerCase().includes(search) ||
        i.username.toLowerCase().includes(search) ||
        i.public_id.toLowerCase().includes(search)
    );
  }
  if (roleFilter) {
    items = items.filter((i) => i.role === roleFilter);
  }

  return NextResponse.json({
    schemaReady,
    total: items.length,
    scopedToTeacher: ctx.role === 'teacher',
    items,
  });
}

export async function PATCH(req: NextRequest) {
  const guard = await requireCommandSession(req, ['super_admin', 'admin']);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const ipAddress = extractClientIp(req);
  const body = (await req.json().catch(() => ({}))) as {
    targetUserId?: string;
    role?: CommandRole;
    account_status?: 'active' | 'suspended' | 'archived';
  };

  if (!body.targetUserId) {
    return NextResponse.json({ error: 'targetUserId is required.' }, { status: 400 });
  }
  if (body.targetUserId === ctx.user.id) {
    return NextResponse.json({ error: 'Cannot alter your own administrative status.' }, { status: 400 });
  }

  if ((body.role === 'admin' || body.role === 'super_admin') && ctx.role !== 'super_admin') {
    return NextResponse.json({ error: 'Only Super Admin can grant Admin privileges.' }, { status: 403 });
  }

  if (body.role) {
    const { error: roleErr } = await ctx.db
      .from('user_roles')
      .upsert(
        {
          user_id: body.targetUserId,
          role: body.role,
          assigned_by: ctx.user.id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
    if (roleErr) return NextResponse.json({ error: roleErr.message }, { status: 400 });
  }

  if (body.account_status) {
    const { error: profErr } = await ctx.db
      .from('profiles')
      .update({ account_status: body.account_status, updated_at: new Date().toISOString() })
      .eq('id', body.targetUserId);

    if (profErr) return NextResponse.json({ error: profErr.message }, { status: 400 });

    if (body.account_status !== 'active') {
      await ctx.db
        .from('admin_command_sessions')
        .update({ revoked_at: new Date().toISOString() })
        .eq('user_id', body.targetUserId);
    }
  }

  await writeAuditLog(ctx.db, {
    actorId: ctx.user.id,
    actorRole: ctx.role,
    action: 'user.role_or_status_updated',
    targetType: 'user',
    targetId: body.targetUserId,
    ipAddress,
    metadata: { role: body.role, account_status: body.account_status },
  });

  return NextResponse.json({ success: true });
}
