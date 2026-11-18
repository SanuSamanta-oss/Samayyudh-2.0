import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// ============================================================
// SamayYudh 2.0 — Teacher QR Verification & Invigilation API
// Validates physical presence, checks replay attack protection
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();

    // Verify user is authorized teacher or admin
    const { data: roleData } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    const isTeacherOrAdmin = ['super_admin', 'admin', 'teacher'].includes(roleData?.role || '');

    if (!isTeacherOrAdmin) {
      return NextResponse.json({ error: 'Forbidden: Teacher access required' }, { status: 403 });
    }

    const body = await req.json();
    const { qrData, manualCode, action = 'verify' } = body;

    // A. MANUAL FALLBACK CODE ENTRY (e.g. LCE001)
    if (manualCode && !qrData) {
      const cleanCode = manualCode.trim().toUpperCase();
      const { data: identityRecord } = await admin
        .from('public_identity_codes')
        .select('*')
        .eq('code', cleanCode)
        .eq('entity_type', 'student')
        .maybeSingle();

      if (!identityRecord) {
        return NextResponse.json({ error: 'No student found with this identification code.' }, { status: 404 });
      }

      // Fetch student profile
      const { data: studentProfile } = await admin
        .from('profiles')
        .select('id, display_name, email, avatar_url')
        .eq('id', identityRecord.user_id)
        .maybeSingle();

      // Fetch active proctoring session if any
      const { data: activeSession } = await admin
        .from('proctoring_sessions')
        .select('*')
        .eq('student_id', identityRecord.user_id)
        .eq('status', 'active')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (action === 'confirm_attendance') {
        if (activeSession) {
          await admin
            .from('proctoring_sessions')
            .update({ qr_verified: true, qr_verified_at: new Date().toISOString() })
            .eq('id', activeSession.id);
        }

        await admin.from('qr_verification_events').insert({
          student_id: identityRecord.user_id,
          student_lce_code: cleanCode,
          teacher_id: user.id,
          exam_code: activeSession?.exam_code || 'MANUAL-CHECK',
          verification_result: 'verified',
          notes: 'Manual LCE code physical verification confirmed by invigilator',
        });

        return NextResponse.json({
          success: true,
          verified: true,
          student: studentProfile,
          code: cleanCode,
          session: activeSession,
        });
      }

      return NextResponse.json({
        success: true,
        matched: true,
        student: studentProfile,
        code: cleanCode,
        session: activeSession,
      });
    }

    // B. RAW QR DATA SCAN
    if (!qrData || !qrData.startsWith('SYQR:')) {
      return NextResponse.json({ error: 'Invalid QR format. Please scan a valid SamayYudh examination QR code.' }, { status: 400 });
    }

    const rawPayload = qrData.replace('SYQR:', '');
    const [b64Data, sigSnippet] = rawPayload.split('.');

    if (!b64Data) {
      return NextResponse.json({ error: 'Corrupted QR code payload.' }, { status: 400 });
    }

    let parsedPayload: any;
    try {
      parsedPayload = JSON.parse(Buffer.from(b64Data, 'base64').toString('utf-8'));
    } catch {
      return NextResponse.json({ error: 'Failed to decode QR payload.' }, { status: 400 });
    }

    const { sid: studentId, lce: studentLceCode, exam: examCode, sess: sessionId, ts } = parsedPayload;

    // Validate expiration (15 minutes max window)
    if (Date.now() - ts > 15 * 60 * 1000) {
      await admin.from('qr_verification_events').insert({
        student_id: studentId,
        student_lce_code: studentLceCode || 'UNKNOWN',
        teacher_id: user.id,
        exam_code: examCode || 'UNKNOWN',
        verification_result: 'expired',
        notes: 'QR token timestamp exceeded maximum allowed window.',
      });
      return NextResponse.json({ error: 'QR Code has expired. Student must generate a fresh pass.' }, { status: 410 });
    }

    // Single-use token check (replay attack protection)
    const secret = process.env.ADMIN_JWT_SECRET || 'sy_qr_secret_salt_2026';
    const computedSig = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(parsedPayload))
      .digest('hex');

    const { data: tokenRecord } = await admin
      .from('qr_verification_tokens')
      .select('*')
      .eq('token_signature', computedSig)
      .maybeSingle();

    if (tokenRecord && tokenRecord.status === 'redeemed') {
      await admin.from('qr_verification_events').insert({
        student_id: studentId,
        student_lce_code: studentLceCode,
        teacher_id: user.id,
        exam_code: examCode,
        verification_result: 'rejected',
        notes: 'Replay attack prevented: token was already redeemed previously.',
      });
      return NextResponse.json(
        { error: 'QR Code already redeemed. Replay of used tokens is prohibited.' },
        { status: 409 }
      );
    }

    // Fetch student profile
    const { data: studentProfile } = await admin
      .from('profiles')
      .select('id, display_name, email, avatar_url')
      .eq('id', studentId)
      .maybeSingle();

    // Mark token redeemed
    if (tokenRecord) {
      await admin
        .from('qr_verification_tokens')
        .update({
          status: 'redeemed',
          redeemed_at: new Date().toISOString(),
          redeemed_by_teacher_id: user.id,
        })
        .eq('id', tokenRecord.id);
    }

    // Mark active session verified if exists
    await admin
      .from('proctoring_sessions')
      .update({ qr_verified: true, qr_verified_at: new Date().toISOString() })
      .eq('student_id', studentId)
      .eq('status', 'active');

    // Record verified event in audit trail
    await admin.from('qr_verification_events').insert({
      student_id: studentId,
      student_lce_code: studentLceCode,
      teacher_id: user.id,
      exam_code: examCode,
      verification_result: 'verified',
      notes: 'Physical invigilation verification completed via camera scan',
    });

    return NextResponse.json({
      success: true,
      verified: true,
      student_id: studentId,
      student_name: studentProfile?.display_name || 'Examinee',
      student_lce_code: studentLceCode,
      exam_code: examCode,
      session_id: sessionId,
      verified_at: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('QR verify error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
