import { NextRequest, NextResponse } from 'next/server';
import {
  attachCommandSessionCookie,
  checkPasskeyLockout,
  createCommandSessionCookie,
  extractClientIp,
  getCommandAuthContext,
  isPasskeyConfigured,
  isPrivilegedRole,
  recordPasskeyAttempt,
  verifyPasskeyConstantTime,
  writeAuditLog,
} from '@/lib/security/admin-auth';

export async function POST(req: NextRequest) {
  try {
    if (!isPasskeyConfigured()) {
      return NextResponse.json(
        {
          error:
            'Command passkey is not configured on the server. Set ADMIN_COMMAND_PASSKEY or ADMIN_COMMAND_PASSKEY_HASH in environment variables.',
          code: 'PASSKEY_NOT_CONFIGURED',
        },
        { status: 503 }
      );
    }

    const { authenticated, context } = await getCommandAuthContext(req);
    if (!authenticated || !context) {
      return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 });
    }

    if (context.accountStatus !== 'active') {
      return NextResponse.json(
        { error: 'Your account is currently suspended or archived.' },
        { status: 403 }
      );
    }

    const ipAddress = extractClientIp(req);
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const lockout = await checkPasskeyLockout(context.db, context.user.id, ipAddress);
    if (!lockout.allowed) {
      await writeAuditLog(context.db, {
        actorId: context.user.id,
        action: 'admin.unlock.locked_out',
        targetType: 'command_session',
        ipAddress,
        metadata: { lockedUntil: lockout.lockedUntil },
      });
      return NextResponse.json(
        {
          error: 'Too many failed passkey attempts. Please wait before retrying.',
          code: 'LOCKED_OUT',
          lockedUntil: lockout.lockedUntil,
          remainingAttempts: 0,
        },
        { status: 429 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as { passkey?: unknown };
    const passkey = typeof body.passkey === 'string' ? body.passkey : '';

    if (!passkey.trim()) {
      return NextResponse.json(
        { error: 'Command passkey is required.', remainingAttempts: lockout.remainingAttempts },
        { status: 400 }
      );
    }

    // Strict security check: student accounts CANNOT unlock admin/teacher access even if they obtain the passkey
    if (!isPrivilegedRole(context.role)) {
      await recordPasskeyAttempt(context.db, {
        userId: context.user.id,
        ipAddress,
        userAgent,
        success: false,
      });
      await writeAuditLog(context.db, {
        actorId: context.user.id,
        action: 'admin.unlock.denied_student_role',
        targetType: 'command_session',
        ipAddress,
        metadata: { role: context.role },
      });
      return NextResponse.json(
        {
          error:
            'Access restricted. Your account role is Student and does not hold Admin or Teacher clearance.',
          code: 'ROLE_FORBIDDEN',
        },
        { status: 403 }
      );
    }

    const valid = verifyPasskeyConstantTime(passkey);
    await recordPasskeyAttempt(context.db, {
      userId: context.user.id,
      ipAddress,
      userAgent,
      success: valid,
    });

    if (!valid) {
      const nextRemaining = Math.max(0, lockout.remainingAttempts - 1);
      await writeAuditLog(context.db, {
        actorId: context.user.id,
        action: 'admin.unlock.invalid_passkey',
        targetType: 'command_session',
        ipAddress,
        metadata: { remainingAttempts: nextRemaining },
      });
      return NextResponse.json(
        {
          error:
            nextRemaining === 0
              ? 'Invalid passkey. Account temporarily locked for 15 minutes.'
              : `Invalid command passkey. ${nextRemaining} attempt${nextRemaining === 1 ? '' : 's'} remaining.`,
          code: 'INVALID_PASSKEY',
          remainingAttempts: nextRemaining,
        },
        { status: 401 }
      );
    }

    const session = await createCommandSessionCookie(context.db, {
      userId: context.user.id,
      role: context.role,
      ipAddress,
      userAgent,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Unable to sign secure command session token.' },
        { status: 500 }
      );
    }

    await writeAuditLog(context.db, {
      actorId: context.user.id,
      action: 'admin.unlock.success',
      targetType: 'command_session',
      targetId: session.sessionId,
      ipAddress,
      metadata: { role: context.role },
    });

    const res = NextResponse.json({
      success: true,
      role: context.role,
      expiresAt: session.expiresAt,
      sessionId: session.sessionId,
    });
    attachCommandSessionCookie(res, session.token);
    return res;
  } catch (err) {
    console.error('[POST /api/admin/auth/unlock] error:', err);
    return NextResponse.json({ error: 'Unlock verification failed.' }, { status: 500 });
  }
}

