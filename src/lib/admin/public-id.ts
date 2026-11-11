import crypto from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { isMissingSchemaError } from '@/lib/supabase/admin';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateCandidatePublicId(): string {
  const bytes = crypto.randomBytes(8);
  let suffix = '';
  for (let i = 0; i < 8; i++) {
    suffix += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return `SY-${suffix}`;
}

export function deriveFallbackPublicId(userId: string): string {
  const digest = crypto.createHash('sha256').update(`sy-id:${userId}`).digest();
  let suffix = '';
  for (let i = 0; i < 8; i++) {
    suffix += ALPHABET[digest[i] % ALPHABET.length];
  }
  return `SY-${suffix}`;
}

export interface EnsuredIdentity {
  publicId: string;
  username: string | null;
  displayName: string;
  avatarUrl: string | null;
  discoverable: boolean;
  accountStatus: 'active' | 'suspended' | 'archived';
  schemaReady: boolean;
}

/**
 * Ensures the authenticated user has a permanent `SY-XXXXXXXX` public identifier
 * persisted in `profiles` whenever the migrated schema is present.
 */
export async function ensureUserIdentity(
  db: SupabaseClient,
  user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }
): Promise<EnsuredIdentity> {
  const fallbackName =
    (typeof user.user_metadata?.display_name === 'string' && user.user_metadata.display_name) ||
    (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name) ||
    (user.email ? user.email.split('@')[0] : 'Aspirant');

  const { data: profile, error } = await db
    .from('profiles')
    .select('id, username, display_name, avatar_url, public_id, is_discoverable, account_status')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    if (isMissingSchemaError(error)) {
      const { data: baseProfile } = await db
        .from('profiles')
        .select('id, display_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      return {
        publicId: deriveFallbackPublicId(user.id),
        username: null,
        displayName: baseProfile?.display_name || fallbackName,
        avatarUrl: baseProfile?.avatar_url ?? null,
        discoverable: true,
        accountStatus: 'active',
        schemaReady: false,
      };
    }

    return {
      publicId: deriveFallbackPublicId(user.id),
      username: null,
      displayName: fallbackName,
      avatarUrl: null,
      discoverable: true,
      accountStatus: 'active',
      schemaReady: false,
    };
  }

  if (profile?.public_id) {
    return {
      publicId: profile.public_id,
      username: profile.username ?? null,
      displayName: profile.display_name || fallbackName,
      avatarUrl: profile.avatar_url ?? null,
      discoverable: profile.is_discoverable ?? true,
      accountStatus: (profile.account_status as 'active' | 'suspended' | 'archived') || 'active',
      schemaReady: true,
    };
  }

  for (let attempt = 0; attempt < 4; attempt++) {
    const candidate = generateCandidatePublicId();
    const { data: updated, error: upsertErr } = await db
      .from('profiles')
      .upsert(
        {
          id: user.id,
          email: user.email ?? '',
          display_name: profile?.display_name || fallbackName,
          public_id: candidate,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select('public_id, username, display_name, avatar_url, is_discoverable, account_status')
      .maybeSingle();

    if (!upsertErr && updated?.public_id) {
      return {
        publicId: updated.public_id,
        username: updated.username ?? null,
        displayName: updated.display_name || fallbackName,
        avatarUrl: updated.avatar_url ?? null,
        discoverable: updated.is_discoverable ?? true,
        accountStatus: (updated.account_status as 'active' | 'suspended' | 'archived') || 'active',
        schemaReady: true,
      };
    }

    if (upsertErr && upsertErr.code !== '23505') {
      break;
    }
  }

  return {
    publicId: deriveFallbackPublicId(user.id),
    username: profile?.username ?? null,
    displayName: profile?.display_name || fallbackName,
    avatarUrl: profile?.avatar_url ?? null,
    discoverable: profile?.is_discoverable ?? true,
    accountStatus: (profile?.account_status as 'active' | 'suspended' | 'archived') || 'active',
    schemaReady: true,
  };
}
