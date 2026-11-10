// ============================================================
// SamayYudh 2.0 — Next.js 16 Proxy (replaces middleware.ts)
// Refreshes Supabase auth sessions, protects routes & balances API load
// ============================================================

import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';
import { checkRateLimit, RateLimitTier } from '@/lib/load-balancer';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Edge Load Balancer & Rate Limiter for API Routes
  if (pathname.startsWith('/api') && pathname !== '/api/health') {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

    let tier: RateLimitTier = 'general';
    if (pathname.includes('/evaluate') || pathname.includes('/gemini') || pathname.includes('/sokha')) {
      tier = 'ai';
    } else if (pathname.includes('/sync') || pathname.includes('/autosave')) {
      tier = 'sync';
    }

    const startTime = Date.now();
    const rateLimit = await checkRateLimit(clientIp, tier);
    const duration = Date.now() - startTime;

    if (!rateLimit.success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: 'Server load threshold reached for this endpoint. Please wait before retrying.',
          nodeId: rateLimit.nodeId,
          retryAfterSeconds: rateLimit.reset,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimit.reset),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.reset),
            'X-LB-Node': rateLimit.nodeId,
          },
        }
      );
    }

    const response = await updateSession(request);
    response.headers.set('X-LB-Node', rateLimit.nodeId);
    response.headers.set('X-RateLimit-Limit', String(rateLimit.limit));
    response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
    response.headers.set('X-RateLimit-Reset', String(rateLimit.reset));
    response.headers.set('X-LB-Overhead-Ms', String(duration));
    return response;
  }

  // 2. Normal Route Processing & Auth Session Refresh
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - api/webhook (public webhooks)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
