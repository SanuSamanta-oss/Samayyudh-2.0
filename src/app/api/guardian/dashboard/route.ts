import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// ============================================================
// SamayYudh 2.0 — Guardian Dashboard Data API
// Mobile-first endpoint for linked children & active exam streams
// ============================================================

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();

    // 1. Fetch Guardian profile (or match by user_id or linked relationships)
    let { data: guardian } = await admin
      .from('guardian_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    // If guardian profile not found by auth user id, check if user is linked by email or mobile
    if (!guardian && user.email) {
      const { data: matchedGuardian } = await admin
        .from('guardian_profiles')
        .select('*')
        .eq('email', user.email.toLowerCase())
        .maybeSingle();
      if (matchedGuardian) {
        guardian = matchedGuardian;
      }
    }

    if (!guardian) {
      // Auto-provision guardian identity code if needed
      const { data: code } = await admin.rpc('generate_unique_identity_code', {
        p_entity_type: 'guardian',
        p_user_id: user.id,
      });
      const guardianCode = code || `LCG${Math.floor(100 + Math.random() * 900)}`;

      const { data: createdGuardian } = await admin
        .from('guardian_profiles')
        .insert({
          user_id: user.id,
          guardian_code: guardianCode,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Guardian',
          relationship: 'legal_guardian',
          mobile: user.phone || '',
          email: user.email || '',
          status: 'active',
        })
        .select()
        .single();
      guardian = createdGuardian;
    }

    // 2. Fetch linked student relationships
    const { data: relationships } = await admin
      .from('guardian_student_relationships')
      .select('id, student_id, student_lce_code, is_primary, status, created_at')
      .eq('guardian_id', guardian.id)
      .eq('status', 'active');

    const childrenDetails: any[] = [];

    if (relationships && relationships.length > 0) {
      for (const rel of relationships) {
        // Fetch student profile
        const { data: studentProfile } = await admin
          .from('profiles')
          .select('id, display_name, email, avatar_url')
          .eq('id', rel.student_id)
          .maybeSingle();

        // Fetch active proctoring session if currently taking an exam
        const { data: activeSession } = await admin
          .from('proctoring_sessions')
          .select('*')
          .eq('student_id', rel.student_id)
          .eq('status', 'active')
          .order('started_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        childrenDetails.push({
          relationshipId: rel.id,
          studentId: rel.student_id,
          studentLceCode: rel.student_lce_code,
          name: studentProfile?.display_name || 'Student',
          email: studentProfile?.email,
          avatarUrl: studentProfile?.avatar_url,
          isPrimary: rel.is_primary,
          activeSession: activeSession
            ? {
                id: activeSession.id,
                examSessionId: activeSession.exam_session_id,
                examTitle: activeSession.exam_title,
                examCode: activeSession.exam_code,
                startedAt: activeSession.started_at,
                cameraActive: activeSession.camera_active,
                screenActive: activeSession.screen_stream_active,
                connectionStatus: activeSession.connection_status,
                questionsAnswered: activeSession.questions_answered,
                totalQuestions: activeSession.total_questions,
                status: activeSession.status,
              }
            : null,
        });
      }
    }

    // 3. Fetch recent notification logs for this guardian
    const { data: notifications } = await admin
      .from('guardian_notification_logs')
      .select('*')
      .eq('guardian_id', guardian.id)
      .order('sent_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      guardian: {
        id: guardian.id,
        guardianCode: guardian.guardian_code,
        fullName: guardian.full_name,
        relationship: guardian.relationship,
        mobile: guardian.mobile,
        mobileVerified: guardian.mobile_verified,
        email: guardian.email,
        emailVerified: guardian.email_verified,
      },
      children: childrenDetails,
      notifications: notifications || [],
    });
  } catch (err: any) {
    console.error('Guardian dashboard error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
