import { NextRequest, NextResponse } from 'next/server';
import { requireCommandSession, getSuperAdminEmails } from '@/lib/security/admin-auth';
import {
  getDatabaseTopology,
  pingDatabasePartition,
  getPartitionConfig,
  type DatabasePartition,
} from '@/lib/supabase/db-manager';

export const dynamic = 'force-dynamic';

async function checkIsAuthorizedSuperAdmin(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard;

  const { ctx } = guard;
  const email = (ctx.user.email || '').trim().toLowerCase();
  const superAdminEmails = getSuperAdminEmails();
  const isSuperAdmin = ctx.role === 'super_admin' || (email && superAdminEmails.includes(email));

  if (!isSuperAdmin) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: 'Super Admin privileges required to inspect database partitions' },
        { status: 403 }
      ),
    };
  }

  return { ok: true as const, ctx };
}

/**
 * GET /api/admin/database
 * Returns detailed topology and live connection status for all database partitions.
 */
export async function GET(req: NextRequest) {
  const auth = await checkIsAuthorizedSuperAdmin(req);
  if (!auth.ok) return auth.response;

  const topology = getDatabaseTopology();

  // Test connectivity across all three partitions concurrently
  const [appPing, adminPing, analyticsPing] = await Promise.all([
    pingDatabasePartition('app'),
    pingDatabasePartition('admin'),
    pingDatabasePartition('analytics'),
  ]);

  return NextResponse.json({
    topology,
    connectivity: {
      app: appPing,
      admin: adminPing,
      analytics: analyticsPing,
    },
    meta: {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      superAdmin: auth.ctx.user.email,
    },
  });
}

/**
 * POST /api/admin/database
 * Ping or diagnose a specific partition ('app' | 'admin' | 'analytics').
 */
export async function POST(req: NextRequest) {
  const auth = await checkIsAuthorizedSuperAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const partition: DatabasePartition = body.partition || 'admin';

    if (!['app', 'admin', 'analytics'].includes(partition)) {
      return NextResponse.json(
        { error: 'Invalid partition. Must be "app", "admin", or "analytics"' },
        { status: 400 }
      );
    }

    const config = getPartitionConfig(partition);
    const ping = await pingDatabasePartition(partition);

    return NextResponse.json({
      partition,
      config: {
        configured: config.isConfigured,
        isSeparate: config.isSeparate,
        host: config.sanitizedHost,
        schema: config.schema,
      },
      ping,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Diagnostic failed' },
      { status: 500 }
    );
  }
}
