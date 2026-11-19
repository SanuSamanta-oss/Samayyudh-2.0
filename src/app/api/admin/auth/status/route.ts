import { NextRequest, NextResponse } from 'next/server';
import { getCommandAuthContext } from '@/lib/security/admin-auth';
import { ensureUserIdentity } from '@/lib/admin/public-id';

export async function GET(req: NextRequest) {
  try {
    const { authenticated, context } = await getCommandAuthContext(req);
    if (!authenticated || !context) {
      return NextResponse.json({
        authenticated: false,
        unlocked: false,
        role: 'student',
        accountStatus: 'active',
        passkeyConfigured: false,
        schemaReady: false,
        hasServiceRole: false,
        expiresAt: null,
        identity: null,
        isTeacherVerified: false,
        teacherVerificationStatus: 'unverified' as const,
      });
    }

    const identity = await ensureUserIdentity(context.db, context.user);

    let isTeacherVerified = false;
    let teacherVerificationStatus: 'verified' | 'pending' | 'unverified' = 'unverified';

    if (context.role === 'teacher' || context.user.user_metadata?.role === 'teacher') {
      const { data: tRow } = await context.db
        .from('teachers')
        .select('verification_status')
        .eq('user_id', context.user.id)
        .maybeSingle();

      if (tRow?.verification_status === 'verified' || context.user.user_metadata?.teacher_verified === true) {
        isTeacherVerified = true;
        teacherVerificationStatus = 'verified';
      } else if (tRow?.verification_status === 'pending') {
        teacherVerificationStatus = 'pending';
      }
    }

    return NextResponse.json({
      authenticated: true,
      unlocked: context.unlocked,
      role: context.role,
      accountStatus: context.accountStatus,
      passkeyConfigured: context.passkeyConfigured,
      schemaReady: context.schemaReady && identity.schemaReady,
      hasServiceRole: context.hasServiceRole,
      expiresAt: context.expiresAt,
      isTeacherVerified,
      teacherVerificationStatus,
      identity: {
        userId: context.user.id,
        email: context.user.email ?? null,
        publicId: identity.publicId,
        username: identity.username,
        fullName: identity.displayName,
        avatarUrl: identity.avatarUrl,
        discoverable: identity.discoverable,
      },
    });
  } catch (err) {
    console.error('[GET /api/admin/auth/status] error:', err);
    return NextResponse.json(
      { error: 'Unable to check command authorization status' },
      { status: 500 }
    );
  }
}
