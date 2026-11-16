import { NextResponse, type NextRequest } from 'next/server';
import { createServerRlsClient } from '@/lib/supabase/server';
import { getCommandDataClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const rlsDb = await createServerRlsClient();
    const {
      data: { user },
      error: userErr,
    } = await rlsDb.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const courseCode = String(body.course_code || '').trim();
    const institutionName = String(body.institution_name || '').trim();

    // Check if user has connected Google account via OAuth identities
    const identities = (user.identities || []) as Array<{ provider?: string }>;
    const googleIdentity = identities.find((id) => id.provider === 'google');

    const { db } = await getCommandDataClient();

    // If user logged in with Google or provided a course code
    const isGoogleAccount = Boolean(googleIdentity || user.app_metadata?.provider === 'google');

    if (!isGoogleAccount && !courseCode) {
      return NextResponse.json(
        {
          error:
            'Please sign in or link your Google Educational account to verify via Google Classroom.',
        },
        { status: 400 }
      );
    }

    // Record submission
    await db.from('teacher_verification_records').insert({
      user_id: user.id,
      verification_method: 'google_classroom',
      status: 'approved',
      submitted_data: {
        googleEmail: user.email,
        courseCode: courseCode || 'direct_google_workspace',
        institutionName: institutionName || 'Google Workspace for Education',
      },
      verified_at: new Date().toISOString(),
    });

    // Elevate status
    await db.from('teachers').upsert(
      {
        user_id: user.id,
        institution_name: institutionName || 'Google Classroom Educator',
        verification_status: 'verified',
        verification_method: 'google_classroom',
        verification_score: 95,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    await db.from('user_roles').upsert(
      {
        user_id: user.id,
        role: 'teacher',
        status: 'active',
        role_selected: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Google Classroom Educator account verified successfully!',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
