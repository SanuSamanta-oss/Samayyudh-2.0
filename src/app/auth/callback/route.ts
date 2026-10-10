// ============================================================
// SamayYudh 2.0 — Auth Callback Route Handler
// Handles the redirect after OTP verification / OAuth callback
// Exchanges the auth code for a session cookie
// ============================================================

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful auth — redirect to dashboard or requested page
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth code exchange failed — redirect to auth page with error
  return NextResponse.redirect(`${origin}/auth?error=Could+not+authenticate`);
}
