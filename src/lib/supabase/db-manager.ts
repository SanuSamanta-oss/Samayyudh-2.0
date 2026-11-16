import { createClient as createSupabaseJsClient, type SupabaseClient } from '@supabase/supabase-js';

export type DatabasePartition = 'app' | 'admin' | 'analytics';

export interface PartitionConfig {
  partition: DatabasePartition;
  url: string | null;
  anonKey: string | null;
  serviceKey: string | null;
  schema: string;
  isConfigured: boolean;
  isSeparate: boolean;
  sanitizedHost: string | null;
}

export interface PartitionTopologyInfo {
  configured: boolean;
  isSeparate: boolean;
  host: string | null;
  schema: string;
  hasServiceRole: boolean;
}

export interface DatabaseTopology {
  mode: 'separated' | 'unified';
  defaultSchema: string;
  partitions: {
    app: PartitionTopologyInfo;
    admin: PartitionTopologyInfo;
    analytics: PartitionTopologyInfo;
  };
}

// In-memory client cache to prevent socket churn across serverless invocations
const clientCache = new Map<string, SupabaseClient>();

function sanitizeHost(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.host;
  } catch {
    return 'invalid-url';
  }
}

/**
 * Resolves the configuration for a given database partition.
 *
 * Partition Fallback Hierarchy:
 * - 'app':
 *     URL: APP_SUPABASE_URL -> NEXT_PUBLIC_SUPABASE_URL
 *     Anon: APP_SUPABASE_ANON_KEY -> NEXT_PUBLIC_SUPABASE_ANON_KEY
 *     Service: APP_SUPABASE_SERVICE_ROLE_KEY -> SUPABASE_SERVICE_ROLE_KEY
 *     Schema: APP_DB_SCHEMA -> 'public'
 *
 * - 'admin':
 *     URL: ADMIN_SUPABASE_URL -> APP_SUPABASE_URL -> NEXT_PUBLIC_SUPABASE_URL
 *     Anon: ADMIN_SUPABASE_ANON_KEY -> NEXT_PUBLIC_SUPABASE_ANON_KEY
 *     Service: ADMIN_SUPABASE_SERVICE_ROLE_KEY -> SUPABASE_SERVICE_ROLE_KEY
 *     Schema: ADMIN_DB_SCHEMA -> 'public'
 *
 * - 'analytics':
 *     URL: ANALYTICS_SUPABASE_URL -> ADMIN_SUPABASE_URL -> NEXT_PUBLIC_SUPABASE_URL
 *     Anon: ANALYTICS_SUPABASE_ANON_KEY -> NEXT_PUBLIC_SUPABASE_ANON_KEY
 *     Service: ANALYTICS_SUPABASE_SERVICE_ROLE_KEY -> ADMIN_SUPABASE_SERVICE_ROLE_KEY -> SUPABASE_SERVICE_ROLE_KEY
 *     Schema: ANALYTICS_DB_SCHEMA -> 'public'
 */
export function getPartitionConfig(partition: DatabasePartition): PartitionConfig {
  const appUrl = (process.env.APP_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim() || null;
  const appAnonKey = (process.env.APP_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim() || null;
  const appServiceKey = (process.env.APP_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim() || null;
  const appSchema = (process.env.APP_DB_SCHEMA || 'public').trim();

  if (partition === 'app') {
    return {
      partition: 'app',
      url: appUrl,
      anonKey: appAnonKey,
      serviceKey: appServiceKey,
      schema: appSchema,
      isConfigured: Boolean(appUrl && (appAnonKey || appServiceKey)),
      isSeparate: false, // The primary app database is the baseline
      sanitizedHost: sanitizeHost(appUrl),
    };
  }

  if (partition === 'admin') {
    const adminUrlRaw = (process.env.ADMIN_SUPABASE_URL || '').trim();
    const adminAnonRaw = (process.env.ADMIN_SUPABASE_ANON_KEY || '').trim();
    const adminServiceRaw = (process.env.ADMIN_SUPABASE_SERVICE_ROLE_KEY || '').trim();
    const adminSchema = (process.env.ADMIN_DB_SCHEMA || 'public').trim();

    const isDedicatedUrl = Boolean(adminUrlRaw && adminUrlRaw !== appUrl);
    const isDedicatedSchema = adminSchema !== appSchema;
    const isSeparate = isDedicatedUrl || isDedicatedSchema;

    const url = adminUrlRaw || appUrl;
    const anonKey = adminAnonRaw || appAnonKey;
    const serviceKey = adminServiceRaw || appServiceKey;

    return {
      partition: 'admin',
      url,
      anonKey,
      serviceKey,
      schema: adminSchema,
      isConfigured: Boolean(url && (anonKey || serviceKey)),
      isSeparate,
      sanitizedHost: sanitizeHost(url),
    };
  }

  // analytics partition
  const analyticsUrlRaw = (process.env.ANALYTICS_SUPABASE_URL || '').trim();
  const analyticsAnonRaw = (process.env.ANALYTICS_SUPABASE_ANON_KEY || '').trim();
  const analyticsServiceRaw = (process.env.ANALYTICS_SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const analyticsSchema = (process.env.ANALYTICS_DB_SCHEMA || 'public').trim();

  const adminConfig = getPartitionConfig('admin');
  const fallbackUrl = adminConfig.url || appUrl;
  const fallbackAnon = adminConfig.anonKey || appAnonKey;
  const fallbackService = adminConfig.serviceKey || appServiceKey;

  const isDedicatedUrl = Boolean(analyticsUrlRaw && analyticsUrlRaw !== appUrl);
  const isDedicatedSchema = analyticsSchema !== appSchema;
  const isSeparate = isDedicatedUrl || isDedicatedSchema;

  const url = analyticsUrlRaw || fallbackUrl;
  const anonKey = analyticsAnonRaw || fallbackAnon;
  const serviceKey = analyticsServiceRaw || fallbackService;

  return {
    partition: 'analytics',
    url,
    anonKey,
    serviceKey,
    schema: analyticsSchema,
    isConfigured: Boolean(url && (anonKey || serviceKey)),
    isSeparate,
    sanitizedHost: sanitizeHost(url),
  };
}

/**
 * Checks whether a specific partition is isolated on a dedicated database or schema.
 */
export function isDatabaseSeparated(partition: DatabasePartition): boolean {
  return getPartitionConfig(partition).isSeparate;
}

/**
 * Returns topology information describing how databases are partitioned.
 */
export function getDatabaseTopology(): DatabaseTopology {
  const app = getPartitionConfig('app');
  const admin = getPartitionConfig('admin');
  const analytics = getPartitionConfig('analytics');

  const isSeparated = admin.isSeparate || analytics.isSeparate;

  return {
    mode: isSeparated ? 'separated' : 'unified',
    defaultSchema: 'public',
    partitions: {
      app: {
        configured: app.isConfigured,
        isSeparate: false,
        host: app.sanitizedHost,
        schema: app.schema,
        hasServiceRole: Boolean(app.serviceKey),
      },
      admin: {
        configured: admin.isConfigured,
        isSeparate: admin.isSeparate,
        host: admin.sanitizedHost,
        schema: admin.schema,
        hasServiceRole: Boolean(admin.serviceKey),
      },
      analytics: {
        configured: analytics.isConfigured,
        isSeparate: analytics.isSeparate,
        host: analytics.sanitizedHost,
        schema: analytics.schema,
        hasServiceRole: Boolean(analytics.serviceKey),
      },
    },
  };
}

/**
 * Creates or retrieves a cached Supabase client for a given database partition.
 */
export function getPartitionClient(
  partition: DatabasePartition,
  options?: {
    useServiceRole?: boolean;
    schema?: string;
  }
): SupabaseClient | null {
  const config = getPartitionConfig(partition);
  if (!config.url) return null;

  const useService = options?.useServiceRole ?? true;
  const authKey = useService ? config.serviceKey : (config.anonKey || config.serviceKey);

  if (!authKey) return null;

  const targetSchema = options?.schema || config.schema || 'public';
  const cacheKey = `${partition}:${config.url}:${useService ? 'svc' : 'anon'}:${targetSchema}`;

  const cached = clientCache.get(cacheKey);
  if (cached) return cached;

  const client = createSupabaseJsClient(config.url, authKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: targetSchema as any,
    },
  });

  clientCache.set(cacheKey, client);
  return client;
}

/**
 * Convenience helper to get the Admin Command Center database client.
 * Uses the dedicated Admin database when configured, or the unified App database.
 */
export function getAdminDatabaseClient(options?: { schema?: string }): SupabaseClient | null {
  return getPartitionClient('admin', { useServiceRole: true, schema: options?.schema });
}

/**
 * Convenience helper to get the Student / App database client with service role privileges.
 */
export function getAppDatabaseClient(options?: { schema?: string }): SupabaseClient | null {
  return getPartitionClient('app', { useServiceRole: true, schema: options?.schema });
}

/**
 * Convenience helper to get the Analytics / Audit database client.
 */
export function getAnalyticsDatabaseClient(options?: { schema?: string }): SupabaseClient | null {
  return getPartitionClient('analytics', { useServiceRole: true, schema: options?.schema });
}

/**
 * Tests connectivity to a database partition with latency measurement.
 */
export async function pingDatabasePartition(partition: DatabasePartition): Promise<{
  partition: DatabasePartition;
  connected: boolean;
  latencyMs: number;
  host: string | null;
  schema: string;
  error?: string;
}> {
  const config = getPartitionConfig(partition);
  const client = getPartitionClient(partition, { useServiceRole: true });

  if (!client || !config.url) {
    return {
      partition,
      connected: false,
      latencyMs: 0,
      host: config.sanitizedHost,
      schema: config.schema,
      error: 'Partition credentials not configured',
    };
  }

  const start = Date.now();
  try {
    // Perform a lightweight metadata probe
    const { error } = await client.from('profiles').select('id', { count: 'exact', head: true }).limit(1);

    const latencyMs = Date.now() - start;
    if (error && error.code !== 'PGRST116') {
      // Missing table / schema error is still a successful network / auth connection to postgres
      const code = error.code || '';
      const isPostgresConnected =
        code === '42P01' || // relation does not exist
        code === 'PGRST205' || // table not found in schema
        code === 'PGRST204';

      if (isPostgresConnected) {
        return {
          partition,
          connected: true,
          latencyMs,
          host: config.sanitizedHost,
          schema: config.schema,
          error: `Connected to PostgreSQL, but tables need migration in schema "${config.schema}"`,
        };
      }

      return {
        partition,
        connected: false,
        latencyMs,
        host: config.sanitizedHost,
        schema: config.schema,
        error: error.message || error.details || 'Database query error',
      };
    }

    return {
      partition,
      connected: true,
      latencyMs,
      host: config.sanitizedHost,
      schema: config.schema,
    };
  } catch (err) {
    return {
      partition,
      connected: false,
      latencyMs: Date.now() - start,
      host: config.sanitizedHost,
      schema: config.schema,
      error: err instanceof Error ? err.message : 'Unknown connection error',
    };
  }
}
