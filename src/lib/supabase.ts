// ============================================================
// SamayYudh 2.0 — Supabase Client (Browser)
// ============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Check if Supabase is configured with real credentials.
 * When not configured, the app falls back to local-only mode.
 */
export const isSupabaseConfigured =
  supabaseUrl.length > 0 &&
  supabaseAnonKey.length > 0 &&
  supabaseUrl.startsWith('https://');

/**
 * Supabase browser client.
 * Safe to import even when credentials are missing — guarded by `isSupabaseConfigured`.
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
);
