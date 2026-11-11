import { NextRequest, NextResponse } from 'next/server';
import {
  clearCommandSessionCookie,
  extractClientIp,
  getCommandAuthContext,
  writeAuditLog,
} from '@/lib/security/admin-auth';
import { isMissingSchemaError } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { authenticated, context } = await getCommandAuthContext(req);
    const ipAddress = extractClientIp(req);

    if (authenticated && context && context.sessionId) {
      const { error } = await context.db
        .from('admin_command_sessions')
        .update({ revoked_at: new Date().toISOString() })
        .eq('id', context.sessionId)
        .eq('user_id', context.user.id);

      if (error && !isMissingSchemaError(error)) {
        console.warn('[POST /api/admin/auth/logout] revoke error:', error.message);
      }

      await writeAuditLog(context.db, {
        actorId: context.user.id,
        action: 'admin.session.locked',
        targetType: 'command_session',
        targetId: context.sessionId,
        ipAddress,
      });
    }

    const res = NextResponse.json({ success: true });
    clearCommandSessionCookie(res);
    return res;
  } catch (err) {
    console.error('[POST /api/admin/auth/logout] error:', err);
    const res = NextResponse.json({ success: true });
    clearCommandSessionCookie(res);
    return res;
  }
}

