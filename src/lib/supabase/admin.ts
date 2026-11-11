import { createClient as createSupabaseJsClient, type SupabaseClient } from '@supabase/supabase-js';
import { createClient as createServerRlsClient } from '@/lib/supabase/server';

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
 * Creates a server-side Supabase client using the Service Role key when available
 * (bypassing RLS for verified server-authorized Command Center operations),
 * or falls back cleanly to the caller's RLS-authenticated server client.
 */
export function createServiceRoleClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  return createSupabaseJsClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function getCommandDataClient(): Promise<{
  db: SupabaseClient;
  rlsDb: SupabaseClient;
  hasServiceRole: boolean;
}> {
  const rlsDb = await createServerRlsClient();
  const serviceDb = createServiceRoleClient();
  return {
    db: serviceDb ?? rlsDb,
    rlsDb,
    hasServiceRole: Boolean(serviceDb),
  };
}

