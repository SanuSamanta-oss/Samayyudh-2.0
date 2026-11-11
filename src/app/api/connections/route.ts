import { NextRequest, NextResponse } from 'next/server';
import { getCommandDataClient, isMissingSchemaError } from '@/lib/supabase/admin';
import { deriveFallbackPublicId, ensureUserIdentity } from '@/lib/admin/public-id';
import { extractClientIp, writeAuditLog } from '@/lib/security/admin-auth';
import type { CommandRole, DirectoryUser } from '@/types/admin';

async function getAuthedUser() {
  const { db, rlsDb } = await getCommandDataClient();
  const {
    data: { user },
  } = await rlsDb.auth.getUser();
  return { db, user };
}

export async function GET(req: NextRequest) {
  try {
    const { db, user } = await getAuthedUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const identity = await ensureUserIdentity(db, user);
    const q = (req.nextUrl.searchParams.get('q') || '').trim();

    const [reqRes, connRes] = await Promise.all([
      db
        .from('connection_requests')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false }),
      db
        .from('connections')
        .select('*')
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .order('created_at', { ascending: false }),
    ]);

    if (isMissingSchemaError(reqRes.error) || isMissingSchemaError(connRes.error)) {
      return NextResponse.json({
        schemaReady: false,
        identity,
        connections: [],
        incoming: [],
        outgoing: [],
        searchResults: [],
      });
    }

    const requests = reqRes.data || [];
    const conns = (connRes.data || []).filter((c) => c.status === 'accepted');

    const peerIds = new Set<string>();
    for (const r of requests) {
      peerIds.add(r.sender_id);
      peerIds.add(r.recipient_id);
    }
    for (const c of connRes.data || []) {
      peerIds.add(c.user_a);
      peerIds.add(c.user_b);
    }
    peerIds.delete(user.id);

    const peerIdArr = Array.from(peerIds);
    const [peerProfilesRes, peerRolesRes] =
      peerIdArr.length > 0
        ? await Promise.all([
            db
              .from('profiles')
              .select('id, public_id, username, display_name, avatar_url, preferred_exam')
              .in('id', peerIdArr),
            db.from('user_roles').select('user_id, role').in('user_id', peerIdArr),
          ])
        : [{ data: [] }, { data: [] }];

    const roleMap = new Map(
      (peerRolesRes.data || []).map((r) => [r.user_id, (r.role as CommandRole) || 'student'])
    );
    const peerMap = new Map<string, DirectoryUser>();
    for (const p of peerProfilesRes.data || []) {
      peerMap.set(p.id, {
        user_id: p.id,
        public_id: p.public_id || deriveFallbackPublicId(p.id),
        username: p.username || '',
        display_name: p.display_name || 'SamayYudh Member',
        avatar_url: p.avatar_url ?? null,
        preferred_exam: p.preferred_exam || '',
        role: roleMap.get(p.id) || 'student',
      });
    }

    const incoming = requests
      .filter((r) => r.recipient_id === user.id && r.status === 'pending')
      .map((r) => ({ ...r, peer: peerMap.get(r.sender_id) }));

    const outgoing = requests
      .filter((r) => r.sender_id === user.id && r.status === 'pending')
      .map((r) => ({ ...r, peer: peerMap.get(r.recipient_id) }));

    const activeConnections = conns.map((c) => {
      const otherId = c.user_a === user.id ? c.user_b : c.user_a;
      return {
        ...c,
        peer: peerMap.get(otherId) || null,
      };
    });

    let searchResults: DirectoryUser[] = [];
    if (q.length >= 2) {
      const { data: found } = await db.rpc('search_public_directory', {
        search_query: q,
        max_results: 12,
      });

      const rpcRows = (Array.isArray(found) ? found : []) as Array<{
        user_id: string;
        public_id: string;
        username: string;
        display_name: string;
        avatar_url?: string | null;
        preferred_exam?: string;
        role: CommandRole;
      }>;

      searchResults = rpcRows
        .filter((f) => f.user_id !== user.id)
        .map((f) => {
          const isBlocked = (connRes.data || []).some(
            (c) => (c.user_a === f.user_id || c.user_b === f.user_id) && c.status === 'blocked'
          );
          const isConn = conns.some((c) => c.user_a === f.user_id || c.user_b === f.user_id);
          const pendingOut = requests.some(
            (r) => r.sender_id === user.id && r.recipient_id === f.user_id && r.status === 'pending'
          );
          const pendingIn = requests.some(
            (r) => r.sender_id === f.user_id && r.recipient_id === user.id && r.status === 'pending'
          );

          let connectionStatus: DirectoryUser['connection_status'] = 'none';
          if (isBlocked) connectionStatus = 'blocked';
          else if (isConn) connectionStatus = 'connected';
          else if (pendingOut) connectionStatus = 'pending_sent';
          else if (pendingIn) connectionStatus = 'pending_received';

          return {
            user_id: f.user_id,
            public_id: f.public_id || deriveFallbackPublicId(f.user_id),
            username: f.username || '',
            display_name: f.display_name || 'SamayYudh Member',
            avatar_url: f.avatar_url ?? null,
            preferred_exam: f.preferred_exam || '',
            role: f.role || 'student',
            connection_status: connectionStatus,
          };
        });
    }

    return NextResponse.json({
      schemaReady: true,
      identity,
      connections: activeConnections,
      incoming,
      outgoing,
      searchResults,
    });
  } catch (err) {
    console.error('[GET /api/connections] error:', err);
    return NextResponse.json({ error: 'Failed to load connections' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { db, user } = await getAuthedUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const ipAddress = extractClientIp(req);
    const body = (await req.json().catch(() => ({}))) as {
      action?: 'send' | 'accept' | 'reject' | 'cancel' | 'remove' | 'block';
      targetUserId?: string;
      identifier?: string;
      requestId?: string;
      message?: string;
      connectionId?: string;
    };

    if (!body.action) {
      return NextResponse.json({ error: 'Action is required.' }, { status: 400 });
    }

    if (body.action === 'send') {
      let recipientId = body.targetUserId || null;
      if (!recipientId && body.identifier) {
        const clean = body.identifier.trim().replace(/^@/, '');
        const upper = clean.toUpperCase();
        const { data: targetProf } = upper.startsWith('SY-')
          ? await db.from('profiles').select('id').eq('public_id', upper).eq('is_discoverable', true).maybeSingle()
          : await db.from('profiles').select('id').ilike('username', clean).eq('is_discoverable', true).maybeSingle();
        recipientId = targetProf?.id ?? null;
      }

      if (!recipientId) {
        return NextResponse.json(
          { error: 'User not found or directory discovery is disabled.' },
          { status: 404 }
        );
      }
      if (recipientId === user.id) {
        return NextResponse.json(
          { error: 'You cannot send a connection request to yourself.' },
          { status: 400 }
        );
      }

      const pairLow = user.id < recipientId ? user.id : recipientId;
      const pairHigh = user.id < recipientId ? recipientId : user.id;

      const [{ data: existingConn }, { data: existingReq }] = await Promise.all([
        db
          .from('connections')
          .select('id, status')
          .eq('user_a', pairLow)
          .eq('user_b', pairHigh)
          .maybeSingle(),
        db
          .from('connection_requests')
          .select('id, status')
          .or(
            `and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`
          )
          .eq('status', 'pending')
          .maybeSingle(),
      ]);

      if (existingConn?.status === 'blocked') {
        return NextResponse.json({ error: 'Connection request cannot be sent.' }, { status: 403 });
      }
      if (existingConn?.status === 'accepted') {
        return NextResponse.json({ error: 'Already connected.' }, { status: 409 });
      }
      if (existingReq) {
        return NextResponse.json({ error: 'A pending request already exists.' }, { status: 409 });
      }

      const { data: created, error } = await db
        .from('connection_requests')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          message: body.message?.trim().slice(0, 240) || '',
          status: 'pending',
        })
        .select('*')
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 400 });

      await db.from('notifications').insert({
        user_id: recipientId,
        category: 'connection_request',
        title: 'New Connection Request',
        body: body.message?.trim() || 'A SamayYudh member invited you to connect.',
        action_url: '/admin',
      });

      return NextResponse.json({ success: true, request: created }, { status: 201 });
    }

    if ((body.action === 'accept' || body.action === 'reject') && body.requestId) {
      const { data: reqRow } = await db
        .from('connection_requests')
        .select('*')
        .eq('id', body.requestId)
        .eq('recipient_id', user.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (!reqRow) {
        return NextResponse.json({ error: 'Pending request not found.' }, { status: 404 });
      }

      const nextStatus = body.action === 'accept' ? 'accepted' : 'rejected';
      await db
        .from('connection_requests')
        .update({ status: nextStatus, responded_at: new Date().toISOString() })
        .eq('id', reqRow.id);

      if (body.action === 'accept') {
        const userA = reqRow.sender_id < reqRow.recipient_id ? reqRow.sender_id : reqRow.recipient_id;
        const userB = reqRow.sender_id < reqRow.recipient_id ? reqRow.recipient_id : reqRow.sender_id;
        await db.from('connections').upsert(
          { user_a: userA, user_b: userB, status: 'accepted' },
          { onConflict: 'user_a,user_b' }
        );
        await db.from('notifications').insert({
          user_id: reqRow.sender_id,
          category: 'connection_accepted',
          title: 'Connection Accepted',
          body: 'Your SamayYudh connection invitation was accepted.',
          action_url: '/admin',
        });
      }

      return NextResponse.json({ success: true });
    }

    if (body.action === 'cancel' && body.requestId) {
      await db
        .from('connection_requests')
        .update({ status: 'cancelled', responded_at: new Date().toISOString() })
        .eq('id', body.requestId)
        .eq('sender_id', user.id);
      return NextResponse.json({ success: true });
    }

    if (body.action === 'remove' && body.connectionId) {
      await db
        .from('connections')
        .delete()
        .eq('id', body.connectionId)
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);
      return NextResponse.json({ success: true });
    }

    if (body.action === 'block' && body.targetUserId) {
      const userA = user.id < body.targetUserId ? user.id : body.targetUserId;
      const userB = user.id < body.targetUserId ? body.targetUserId : user.id;
      await db.from('connections').upsert(
        {
          user_a: userA,
          user_b: userB,
          status: 'blocked',
          blocked_by: user.id,
        },
        { onConflict: 'user_a,user_b' }
      );
      await writeAuditLog(db, {
        actorId: user.id,
        action: 'connection.blocked_user',
        targetType: 'user',
        targetId: body.targetUserId,
        ipAddress,
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid connection operation.' }, { status: 400 });
  } catch (err) {
    console.error('[POST /api/connections] error:', err);
    return NextResponse.json({ error: 'Connection request failed.' }, { status: 500 });
  }
}
