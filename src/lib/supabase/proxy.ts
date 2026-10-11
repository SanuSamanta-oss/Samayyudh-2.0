// ============================================================
// SamayYudh 2.0 — Supabase Proxy Client
// Use this ONLY inside src/proxy.ts (Next.js 16 proxy)
// ============================================================

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Do NOT use getSession() here — use getUser() for security.
  // getSession() reads from cookies which can be tampered with.
  // getUser() always validates the token with the Supabase Auth server.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define protected routes (everything under (app) group)
  const protectedPaths = [
    '/dashboard',
    '/practice',
    '/exams',
    '/questions',
    '/history',
    '/analytics',
    '/notes',
    '/profile',
    '/admin',
    '/exam/',
    '/results',
    '/report',
  ];

  const isProtectedRoute = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  // Redirect unauthenticated users to auth page and clear any invalid/stale/revoked cookies
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    const redirectResponse = NextResponse.redirect(url);

    // If an invalid or revoked token was provided, ensure client cookies are purged
    request.cookies.getAll().forEach((c) => {
      if (c.name.startsWith('sb-') || c.name.includes('supabase') || c.name.includes('auth-token')) {
        redirectResponse.cookies.delete(c.name);
      }
    });

    return redirectResponse;
  }

  // Redirect authenticated users away from auth page
  if (user && request.nextUrl.pathname === '/auth') {
    const redirect = request.nextUrl.searchParams.get('redirect') || '/dashboard';
    const url = request.nextUrl.clone();
    url.pathname = redirect;
    url.searchParams.delete('redirect');
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
