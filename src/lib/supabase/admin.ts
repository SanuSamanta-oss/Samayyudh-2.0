import { type SupabaseClient } from '@supabase/supabase-js';
import { createClient as createServerRlsClient } from '@/lib/supabase/server';
import {
  getAdminDatabaseClient,
  getPartitionConfig,
  isDatabaseSeparated,
  getDatabaseTopology,
  type DatabaseTopology,
} from '@/lib/supabase/db-manager';

export interface SupabaseErrorLike {
  code?: string | null;
  message?: string | null;
  details?: string | null;
  hint?: string | null;
}

/**
 * Checks whether a Postgres/PostgREST error indicates the migration SQL
 * (`supabase/admin_command_center.sql`) has not been applied yet.
 */
export function isMissingSchemaError(err: SupabaseErrorLike | null | undefined): boolean {
  if (!err) return false;
  const code = (err.code ?? '').toUpperCase();
  if (
    code === '42P01' ||
    code === '42703' ||
    code === '42883' ||
    code === 'PGRST205' ||
    code === 'PGRST204' ||
    code === 'PGRST202'
  ) {
    return true;
  }
  const msg = (err.message ?? '').toLowerCase();
  return (
    msg.includes('does not exist') ||
    msg.includes('could not find the table') ||
    msg.includes('schema cache')
  );
}

/**
 * Creates a server-side Supabase client using the Service Role key when available.
 * Supports separate databases: uses ADMIN_SUPABASE_URL / ADMIN_SUPABASE_SERVICE_ROLE_KEY
 * when configured, or falls back seamlessly to the primary app database credentials.
 */
export function createServiceRoleClient(options?: { schema?: string }): SupabaseClient | null {
  return getAdminDatabaseClient(options);
}

/**
 * Returns the data client for the Admin & Teacher Command Center.
 * If separate databases are configured, `db` connects directly to the dedicated Admin database.
 */
export async function getCommandDataClient(): Promise<{
  db: SupabaseClient;
  rlsDb: SupabaseClient;
  hasServiceRole: boolean;
  isSeparate: boolean;
  topology: DatabaseTopology;
}> {
  const rlsDb = await createServerRlsClient();
  const serviceDb = createServiceRoleClient();
  const isSeparate = isDatabaseSeparated('admin');
  const topology = getDatabaseTopology();

  return {
    db: serviceDb ?? rlsDb,
    rlsDb,
    hasServiceRole: Boolean(serviceDb),
    isSeparate,
    topology,
  };
}

export {
  getAdminDatabaseClient,
  getPartitionConfig,
  isDatabaseSeparated,
  getDatabaseTopology,
};
