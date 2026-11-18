import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// ============================================================
// SamayYudh 2.0 — Guardian Onboarding & Relationship API
// ============================================================

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();

    // Check existing guardian links for current student
    const { data: relationships } = await admin
      .from('guardian_student_relationships')
      .select(`
        id,
        is_primary,
        status,
        guardian:guardian_profiles(id, guardian_code, full_name, relationship, mobile, mobile_verified, email, email_verified)
      `)
      .eq('student_id', user.id);

    // Get current student LCE code
    const { data: studentCodeRecord } = await admin
      .from('public_identity_codes')
      .select('code')
      .eq('user_id', user.id)
      .eq('entity_type', 'student')
      .maybeSingle();

    const isRegistrationRequired = (!relationships || relationships.length === 0);

    return NextResponse.json({
      registration_required: isRegistrationRequired,
      student_lce_code: studentCodeRecord?.code || 'LCE-PENDING',
      guardians: relationships?.map((r: any) => r.guardian) || [],
    });
  } catch (err: any) {
    console.error('Guardian onboard check error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      fullName,
      relationship,
      mobile,
      email,
      mobileVerified,
      emailVerified,
    } = body;

    if (!fullName || !relationship || !mobile || !email) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const admin = createAdminClient();

    // 1. Ensure student has an LCE code
    let studentLceCode: string;
    const { data: existingStudentCode } = await admin
      .from('public_identity_codes')
      .select('code')
      .eq('user_id', user.id)
      .eq('entity_type', 'student')
      .maybeSingle();

    if (existingStudentCode?.code) {
      studentLceCode = existingStudentCode.code;
    } else {
      const { data: code } = await admin.rpc('generate_unique_identity_code', {
        p_entity_type: 'student',
        p_user_id: user.id,
      });
      studentLceCode = code || `LCE${Math.floor(100 + Math.random() * 900)}`;
    }

    // 2. Generate unique LCG code for the guardian
    const { data: guardianCode } = await admin.rpc('generate_unique_identity_code', {
      p_entity_type: 'guardian',
    });
    const finalLcgCode = guardianCode || `LCG${Math.floor(100 + Math.random() * 900)}`;

    // 3. Insert or update guardian profile
    const { data: guardianProfile, error: profileError } = await admin
      .from('guardian_profiles')
      .insert({
        guardian_code: finalLcgCode,
        full_name: fullName.trim(),
        relationship,
        mobile: mobile.trim(),
        mobile_verified: Boolean(mobileVerified),
        email: email.trim().toLowerCase(),
        email_verified: Boolean(emailVerified),
        status: 'active',
      })
      .select()
      .single();

    if (profileError || !guardianProfile) {
      return NextResponse.json({ error: profileError?.message || 'Failed to save guardian' }, { status: 500 });
    }

    // 4. Link guardian to student
    const { error: linkError } = await admin
      .from('guardian_student_relationships')
      .insert({
        guardian_id: guardianProfile.id,
        student_id: user.id,
        student_lce_code: studentLceCode,
        is_primary: true,
        status: 'active',
      });

    if (linkError) {
      console.warn('Relationship insert error:', linkError);
    }

    // 5. Initialize default notification preferences
    await admin.from('guardian_notification_preferences').insert({
      guardian_id: guardianProfile.id,
      student_id: user.id,
      notify_exam_start: true,
      notify_exam_submit: true,
      notify_exam_complete: true,
      notify_connectivity_loss: true,
      notify_advisories: true,
      sms_channel_enabled: true,
      email_channel_enabled: true,
      in_app_channel_enabled: true,
    });

    return NextResponse.json({
      success: true,
      guardian: guardianProfile,
      guardian_code: finalLcgCode,
      student_lce_code: studentLceCode,
    });
  } catch (err: any) {
    console.error('Guardian onboard error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
