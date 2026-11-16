// ============================================================
// SamayYudh 2.0 — Supabase module barrel export
// ============================================================

export { createClient as createBrowserClient, isSupabaseConfigured } from './client';
export { createClient as createServerSupabaseClient } from './server';
export {
  getPartitionConfig,
  isDatabaseSeparated,
  getDatabaseTopology,
  getPartitionClient,
  getAdminDatabaseClient,
  getAppDatabaseClient,
  getAnalyticsDatabaseClient,
  pingDatabasePartition,
  type DatabasePartition,
  type PartitionConfig,
  type DatabaseTopology,
} from './db-manager';
