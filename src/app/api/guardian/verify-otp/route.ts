import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

// ============================================================
// SamayYudh 2.0 — Guardian Mobile OTP Verification API
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, mobile, otp, guardianId } = body;

    if (!mobile) {
      return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 });
    }

    const cleanMobile = mobile.replace(/[^0-9+]/g, '');
    const admin = createAdminClient();

    // ACTION: SEND OTP
    if (action === 'send') {
      // Check cooldown (60 seconds)
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
      const { data: recentRecord } = await admin
        .from('guardian_verification_records')
        .select('created_at')
        .eq('target_identifier', cleanMobile)
        .eq('verification_type', 'mobile_otp')
        .gt('created_at', oneMinuteAgo)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (recentRecord) {
        return NextResponse.json(
          { error: 'Please wait 60 seconds before requesting another code.' },
          { status: 429 }
        );
      }

      // Generate secure 6-digit numeric OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

      const { error: insertError } = await admin.from('guardian_verification_records').insert({
        guardian_id: guardianId || null,
        verification_type: 'mobile_otp',
        target_identifier: cleanMobile,
        otp_code: generatedOtp,
        attempts_count: 0,
        max_attempts: 5,
        expires_at: expiresAt,
      });

      if (insertError) {
        console.warn('OTP record insert notice:', insertError);
      }

      // Log to SMS outbox for carrier dispatch
      await admin.from('notification_outbox').insert({
        channel: 'sms',
        recipient: cleanMobile,
        subject: 'Guardian Verification Code',
        payload: {
          code: generatedOtp,
          message: `Your SamayYudh 2.0 Guardian verification code is: ${generatedOtp}. Valid for 5 minutes. Do not share this code.`,
        },
        status: 'queued',
      });

      return NextResponse.json({
        success: true,
        message: 'Verification code dispatched to mobile.',
        expires_in_seconds: 300,
        // In local development, also expose code for zero-friction verification
        dev_code: process.env.NODE_ENV !== 'production' ? generatedOtp : undefined,
      });
    }

    // ACTION: VERIFY OTP
    if (action === 'verify') {
      if (!otp || otp.trim().length !== 6) {
        return NextResponse.json({ error: 'Please enter a valid 6-digit verification code.' }, { status: 400 });
      }

      const submittedCode = otp.trim();

      // Retrieve most recent active verification record
      const { data: record, error: fetchError } = await admin
        .from('guardian_verification_records')
        .select('*')
        .eq('target_identifier', cleanMobile)
        .eq('verification_type', 'mobile_otp')
        .is('verified_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError || !record) {
        return NextResponse.json(
          { error: 'No active verification code found. Please request a new code.' },
          { status: 404 }
        );
      }

      // Check expiry
      if (new Date(record.expires_at) < new Date()) {
        return NextResponse.json(
          { error: 'Verification code has expired. Please request a new code.' },
          { status: 400 }
        );
      }

      // Check max attempts
      if (record.attempts_count >= record.max_attempts) {
        return NextResponse.json(
          { error: 'Too many incorrect attempts. Please request a fresh code.' },
          { status: 429 }
        );
      }

      // Validate OTP
      if (record.otp_code !== submittedCode) {
        await admin
          .from('guardian_verification_records')
          .update({ attempts_count: record.attempts_count + 1 })
          .eq('id', record.id);

        const remaining = record.max_attempts - (record.attempts_count + 1);
        return NextResponse.json(
          {
            error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
          },
          { status: 400 }
        );
      }

      // Code is correct: mark verified!
      await admin
        .from('guardian_verification_records')
        .update({ verified_at: new Date().toISOString() })
        .eq('id', record.id);

      if (guardianId) {
        await admin
          .from('guardian_profiles')
          .update({ mobile_verified: true, updated_at: new Date().toISOString() })
          .eq('id', guardianId);
      }

      return NextResponse.json({
        success: true,
        verified: true,
        message: 'Mobile number verified successfully.',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Verify OTP error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
