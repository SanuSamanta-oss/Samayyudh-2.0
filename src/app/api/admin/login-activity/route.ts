import crypto from 'crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerRlsClient } from '@/lib/supabase/server';
import { getCommandDataClient, isMissingSchemaError } from '@/lib/supabase/admin';
import { getSuperAdminEmails, getCommandAuthContext } from '@/lib/security/admin-auth';

function hashIp(ip: string): string {
  if (!ip || ip === '::1' || ip === '127.0.0.1') return '127.0.0.1';
  return crypto.createHash('sha256').update(ip + '-salt').digest('hex').slice(0, 12);
}

function parseDeviceType(ua: string): string {
  const lower = ua.toLowerCase();
  if (lower.includes('mobile') || lower.includes('android') || lower.includes('iphone')) {
    return 'Mobile PWA / Phone';
  }
  if (lower.includes('ipad') || lower.includes('tablet')) {
    return 'Tablet';
  }
  return 'Desktop / Laptop';
}

export async function GET(req: NextRequest) {
  try {
    // 1. Strict Authorization check: Super Admin email in allowlist AND passkey unlocked
    const { authenticated, context } = await getCommandAuthContext(req);
    if (!authenticated || !context || !context.unlocked || context.role !== 'super_admin') {
      return NextResponse.json({ error: 'Super Admin passkey unlock required' }, { status: 403 });
    }

    const email = (context.user.email || '').trim().toLowerCase();
    const superAdminEmails = getSuperAdminEmails();
    if (!email || !superAdminEmails.includes(email)) {
      return NextResponse.json({ error: 'Super Admin authorization required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'recent'; // 'recent' | '7d' | '30d'

    let sinceMs = 24 * 60 * 60 * 1000; // 24 hours
    if (range === '7d') sinceMs = 7 * 24 * 60 * 60 * 1000;
    if (range === '30d') sinceMs = 30 * 24 * 60 * 60 * 1000;

    const sinceDate = new Date(Date.now() - sinceMs).toISOString();

    const { db } = await getCommandDataClient();

    // Query login activity
    const { data: rows, error } = await db
      .from('login_activity')
      .select('*')
      .gte('signed_in_at', sinceDate)
      .order('signed_in_at', { ascending: false })
      .limit(200);

    if (error && !isMissingSchemaError(error)) {
      console.warn('Error reading login_activity:', error);
    }

    const sessions = rows || [];

    // Aggregate statistics
    const uniqueUserIds = new Set(sessions.map((s) => s.user_id));
    const roleCounts = {
      super_admin: 0,
      teacher: 0,
      student: 0,
    };
    let mobileCount = 0;
    let desktopCount = 0;

    sessions.forEach((s) => {
      const r = (s.role as keyof typeof roleCounts) || 'student';
      if (roleCounts[r] !== undefined) {
        roleCounts[r]++;
      }
      const dev = (s.device_type || '').toLowerCase();
      if (dev.includes('mobile') || dev.includes('phone')) {
        mobileCount++;
      } else {
        desktopCount++;
      }
    });

    const stats = {
      totalLogins: sessions.length,
      uniqueUsers: uniqueUserIds.size,
      roleDistribution: roleCounts,
      deviceBreakdown: {
        mobile: mobileCount,
        desktop: desktopCount,
      },
    };

    return NextResponse.json({
      range,
      stats,
      sessions,
      last_updated: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rlsDb = await createServerRlsClient();
    const {
      data: { user },
    } = await rlsDb.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const ua = req.headers.get('user-agent') || body.user_agent || 'Unknown';
    const rawIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const deviceType = parseDeviceType(ua);
    const hashedIp = hashIp(rawIp);

    const { db } = await getCommandDataClient();

    // Check user's current role
    const { data: roleRow } = await db
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    const role = roleRow?.role || 'student';

    await db.from('login_activity').insert({
      user_id: user.id,
      email: user.email,
      role,
      user_agent: ua.slice(0, 255),
      ip_address: hashedIp,
      device_type: deviceType,
      is_active: true,
      signed_in_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

