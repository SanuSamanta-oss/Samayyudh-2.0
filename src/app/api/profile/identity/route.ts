import { NextRequest, NextResponse } from 'next/server';
import { getCommandDataClient, isMissingSchemaError } from '@/lib/supabase/admin';
import { ensureUserIdentity } from '@/lib/admin/public-id';
import { resolveUserCommandRole } from '@/lib/security/admin-auth';

export async function GET() {
  try {
    const { db, rlsDb } = await getCommandDataClient();
    const {
      data: { user },
    } = await rlsDb.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const identity = await ensureUserIdentity(db, user);
    const { role } = await resolveUserCommandRole(db, user);

    return NextResponse.json({
      identity: {
        userId: user.id,
        publicId: identity.publicId,
        username: identity.username,
        displayName: identity.displayName,
        avatarUrl: identity.avatarUrl,
        discoverable: identity.discoverable,
        role,
        schemaReady: identity.schemaReady,
      },
    });
  } catch (err) {
    console.error('[GET /api/profile/identity] error:', err);
    return NextResponse.json({ error: 'Failed to load user identity' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { db, rlsDb } = await getCommandDataClient();
    const {
      data: { user },
    } = await rlsDb.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as {
      username?: string;
      discoverable?: boolean;
      fullName?: string;
    };

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof body.username === 'string') {
      const cleaned = body.username.trim().replace(/^@/, '').toLowerCase();
      if (cleaned && !/^[a-z0-9_.-]{3,32}$/.test(cleaned)) {
        return NextResponse.json(
          { error: 'Username must be 3-32 characters (letters, numbers, ., _, -).' },
          { status: 400 }
        );
      }
      updates.username = cleaned || null;
    }

    if (typeof body.discoverable === 'boolean') {
      updates.is_discoverable = body.discoverable;
    }

    if (typeof body.fullName === 'string' && body.fullName.trim()) {
      updates.display_name = body.fullName.trim().slice(0, 80);
    }

    const { data, error } = await db
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('public_id, username, display_name, avatar_url, is_discoverable')
      .maybeSingle();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Username is already taken.' }, { status: 409 });
      }
      if (isMissingSchemaError(error)) {
        return NextResponse.json(
          {
            error:
              'Database schema migration (admin_command_center.sql) is pending for username/discoverable settings.',
            schemaReady: false,
          },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, identity: data });
  } catch (err) {
    console.error('[PATCH /api/profile/identity] error:', err);
    return NextResponse.json({ error: 'Failed to update identity' }, { status: 500 });
  }
}
