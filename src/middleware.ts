import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, RateLimitTier } from '@/lib/load-balancer';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass health check and static assets from rate limiting
  if (pathname === '/api/health' || pathname.startsWith('/_next') || pathname.startsWith('/static')) {
    return NextResponse.next();
  }

  // Only apply active load balancing & rate-limiting to API routes
  if (pathname.startsWith('/api')) {
    // Determine client identifier (IP address, forwarded IP, or fallback)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

    // Categorize traffic tier
    let tier: RateLimitTier = 'general';
    if (pathname.includes('/evaluate') || pathname.includes('/gemini') || pathname.includes('/sokha')) {
      tier = 'ai';
    } else if (pathname.includes('/sync') || pathname.includes('/autosave')) {
      tier = 'sync';
    }

    const startTime = Date.now();
    const rateLimit = await checkRateLimit(clientIp, tier);
    const duration = Date.now() - startTime;

    // Reject requests exceeding threshold with standard 429 response
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

    // Forward request with load balancer telemetry headers
    const response = NextResponse.next();
    response.headers.set('X-LB-Node', rateLimit.nodeId);
    response.headers.set('X-RateLimit-Limit', String(rateLimit.limit));
    response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
    response.headers.set('X-RateLimit-Reset', String(rateLimit.reset));
    response.headers.set('X-LB-Overhead-Ms', String(duration));

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
