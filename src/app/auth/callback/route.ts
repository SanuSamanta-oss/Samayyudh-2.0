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
      // Successful auth — show bored hand loading animation on black screen before entering app
      const targetUrl = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Authenticating — SamayYudh</title>
  <meta http-equiv="refresh" content="2;url=${targetUrl}">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #000000;
      color: #ffffff;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
      user-select: none;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.4s ease-out;
    }
    .anim-img {
      width: 280px;
      max-width: 85vw;
      height: auto;
      object-fit: contain;
      pointer-events: none;
      filter: drop-shadow(0 10px 30px rgba(0,0,0,0.9));
    }
    @media (min-width: 640px) {
      .anim-img { width: 340px; }
    }
    .progress-bar {
      width: 220px;
      height: 4px;
      background: #18181b;
      border-radius: 9999px;
      margin-top: 10px;
      overflow: hidden;
      position: relative;
      border: 1px solid #27272a;
    }
    .progress-fill {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 0%;
      background: linear-gradient(to right, #a8a29e, #ffffff, #d6d3d1);
      border-radius: 9999px;
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.7);
      animation: fillProgress 1.4s ease-out forwards;
    }
    .text {
      color: #d6d3d1;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      margin-top: 12px;
      animation: pulse 1.6s infinite ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.92); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes fillProgress {
      0% { width: 0%; }
      70% { width: 85%; }
      100% { width: 100%; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }
  </style>
</head>
<body>
  <div class="container">
    <picture>
      <source srcset="/bored_hand_black.webp" type="image/webp">
      <img src="/bored_hand_black.gif" alt="Loading animation" class="anim-img">
    </picture>
    <div class="progress-bar">
      <div class="progress-fill"></div>
    </div>
    <p class="text">AUTHENTICATING...</p>
  </div>
  <script>
    setTimeout(function() {
      window.location.replace(${JSON.stringify(targetUrl)});
    }, 1400);
  </script>
</body>
</html>`;
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }
  }

  // Auth code exchange failed — redirect to auth page with error
  return NextResponse.redirect(`${origin}/auth?error=Could+not+authenticate`);
}
