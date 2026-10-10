// ============================================================
// SamayYudh 2.0 — Supabase Client (Legacy Compatibility)
// This file re-exports from the new SSR-safe module.
// New code should import from '@/lib/supabase/client' directly.
// ============================================================

import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

/**
 * @deprecated Use `createClient()` from '@/lib/supabase/client' instead.
 * This is kept for backward compatibility with existing code.
 */
export const supabase = createClient();

export { isSupabaseConfigured };
