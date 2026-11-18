import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

// ============================================================
// SamayYudh 2.0 — Guardian Email Verification API
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, code, guardianId } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const admin = createAdminClient();

    if (action === 'send') {
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

      await admin.from('guardian_verification_records').insert({
        guardian_id: guardianId || null,
        verification_type: 'email_otp',
        target_identifier: cleanEmail,
        otp_code: generatedCode,
        attempts_count: 0,
        max_attempts: 5,
        expires_at: expiresAt,
      });

      // Queue email outbox
      await admin.from('notification_outbox').insert({
        channel: 'email',
        recipient: cleanEmail,
        subject: 'Verify your Guardian Email — SamayYudh 2.0',
        payload: {
          code: generatedCode,
          body: `Your email verification code for SamayYudh Guardian Connect is ${generatedCode}. Valid for 15 minutes.`,
        },
        status: 'queued',
      });

      return NextResponse.json({
        success: true,
        message: 'Verification code sent to email.',
        dev_code: process.env.NODE_ENV !== 'production' ? generatedCode : undefined,
      });
    }

    if (action === 'verify') {
      if (!code || code.trim().length !== 6) {
        return NextResponse.json({ error: 'Please enter a 6-digit email code.' }, { status: 400 });
      }

      const { data: record } = await admin
        .from('guardian_verification_records')
        .select('*')
        .eq('target_identifier', cleanEmail)
        .eq('verification_type', 'email_otp')
        .is('verified_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!record || record.otp_code !== code.trim()) {
        return NextResponse.json({ error: 'Invalid or expired email verification code.' }, { status: 400 });
      }

      await admin
        .from('guardian_verification_records')
        .update({ verified_at: new Date().toISOString() })
        .eq('id', record.id);

      if (guardianId) {
        await admin
          .from('guardian_profiles')
          .update({ email_verified: true, updated_at: new Date().toISOString() })
          .eq('id', guardianId);
      }

      return NextResponse.json({
        success: true,
        verified: true,
        message: 'Email verified successfully.',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Verify email error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
