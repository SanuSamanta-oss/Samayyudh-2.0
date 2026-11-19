import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || phone.replace(/\D/g, '').length < 10) {
      return NextResponse.json({ error: 'Please provide a valid 10+ digit phone number.' }, { status: 400 });
    }

    if (!otp || String(otp).length < 6) {
      return NextResponse.json({ error: 'Please enter the 6-digit test code.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceKey || !anonKey) {
      return NextResponse.json({ error: 'Supabase credentials not configured.' }, { status: 500 });
    }

    const adminClient = createClient(supabaseUrl, serviceKey);
    const anonClient = createClient(supabaseUrl, anonKey);

    // Normalize phone number to create a deterministic internal test identity
    const cleanDigits = phone.replace(/\D/g, '');
    const internalEmail = `phone_${cleanDigits}@samayyudh.local`;
    const deterministicPassword = `SyPhoneAuth#${cleanDigits}!`;

    // Ensure user exists in Supabase Auth
    try {
      await adminClient.auth.admin.createUser({
        email: internalEmail,
        password: deterministicPassword,
        email_confirm: true,
        phone_confirm: true,
        user_metadata: {
          phone: phone,
          phone_verified: true,
          auth_provider: 'phone',
        },
      });
    } catch {
      // User might already exist, update password to ensure login succeeds
      const { data: usersData } = await adminClient.auth.admin.listUsers();
      const existing = usersData?.users?.find(
        (u) => u.email === internalEmail || u.user_metadata?.phone === phone
      );
      if (existing) {
        await adminClient.auth.admin.updateUserById(existing.id, {
          password: deterministicPassword,
          email_confirm: true,
        });
      }
    }

    // Authenticate and get real Supabase session tokens
    const { data: authData, error: signInError } = await anonClient.auth.signInWithPassword({
      email: internalEmail,
      password: deterministicPassword,
    });

    if (signInError || !authData.session) {
      return NextResponse.json(
        { error: signInError?.message || 'Failed to generate authenticated session.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      },
      user: authData.user,
    });
  } catch (err: any) {
    console.error('[PhoneTestLogin] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
