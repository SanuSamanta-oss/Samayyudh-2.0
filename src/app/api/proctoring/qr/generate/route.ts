import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// ============================================================
// SamayYudh 2.0 — QR Token Generation API
// Generates short-lived, signed single-use QR invigilation tokens
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const examCode = body.examCode || 'LCE-EX-DEFAULT';
    const sessionId = body.sessionId || `session_${user.id}_${Date.now()}`;

    const admin = createAdminClient();

    // Get student LCE code
    const { data: codeRecord } = await admin
      .from('public_identity_codes')
      .select('code')
      .eq('user_id', user.id)
      .eq('entity_type', 'student')
      .maybeSingle();

    const studentLceCode = codeRecord?.code || `LCE${Math.floor(100 + Math.random() * 900)}`;

    // Create cryptographically signed token payload
    const tokenPayload = {
      sid: user.id,
      lce: studentLceCode,
      exam: examCode,
      sess: sessionId,
      ts: Date.now(),
      nonce: crypto.randomBytes(8).toString('hex'),
    };

    const secret = process.env.ADMIN_JWT_SECRET || 'sy_qr_secret_salt_2026';
    const signature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(tokenPayload))
      .digest('hex');

    const qrRawValue = `SYQR:${Buffer.from(JSON.stringify(tokenPayload)).toString('base64')}.${signature.slice(0, 16)}`;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Store in qr_verification_tokens table for single-use redemption
    await admin.from('qr_verification_tokens').insert({
      token_signature: signature,
      student_id: user.id,
      student_lce_code: studentLceCode,
      exam_code: examCode,
      session_id: sessionId,
      status: 'active',
      expires_at: expiresAt,
    });

    return NextResponse.json({
      qr_payload: qrRawValue,
      student_lce_code: studentLceCode,
      expires_at: expiresAt,
      expires_in_seconds: 600,
    });
  } catch (err: any) {
    console.error('QR generate error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
