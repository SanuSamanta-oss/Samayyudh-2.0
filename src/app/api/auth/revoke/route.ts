// ============================================================
// SamayYudh 2.0 — Token Revocation API
// Revokes the user's active session or ALL sessions across all devices
// (global sign out / emergency revocation against unauthorized access)
// ============================================================

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized or token already invalid' }, { status: 401 });
    }

    let scope: 'global' | 'local' = 'global';
    try {
      const body = await request.json();
      if (body.scope === 'local') {
        scope = 'local';
      }
    } catch {
      // Default to global revocation for maximum security
      scope = 'global';
    }

    // Sign out & revoke token in Supabase Auth server
    // scope: 'global' revokes all refresh tokens and sessions for this user across all devices/hackers
    const { error: signOutError } = await supabase.auth.signOut({ scope });

    if (signOutError) {
      return NextResponse.json({ error: signOutError.message }, { status: 500 });
    }

    // Explicitly delete all Supabase auth cookies in response
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    allCookies.forEach((c) => {
      if (c.name.startsWith('sb-') || c.name.includes('supabase') || c.name.includes('auth-token')) {
        cookieStore.delete(c.name);
      }
    });

    return NextResponse.json({
      success: true,
      message:
        scope === 'global'
          ? 'All active sessions and tokens have been revoked across all devices.'
          : 'Current session and token have been revoked.',
      scope,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to revoke token';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
