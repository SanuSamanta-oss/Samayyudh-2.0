// ============================================================
// SamayYudh 2.0 — First-Login & Onboarding Tracking
// Ensures the Bored Hand tapping animation is only ever shown ONCE
// during the user's initial account onboarding/first-ever login.
// Once logged in, it will NEVER be shown anywhere across the app.
// ============================================================

import type { User } from '@supabase/supabase-js';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export const HAS_LOGGED_IN_KEY = 'samayyudh_has_logged_in';
export const AUTH_ANIM_SEEN_KEY = 'samayyudh_auth_animation_shown';

/**
 * Checks whether the user has already completed a login before or seen the animation.
 * Returns true if the user has already logged in once, meaning the animation
 * must never be shown anywhere again.
 */
export function hasUserLoggedInBefore(user?: User | null): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Check persistent localStorage keys
  try {
    if (localStorage.getItem(HAS_LOGGED_IN_KEY) === 'true') return true;
    if (localStorage.getItem(AUTH_ANIM_SEEN_KEY) === 'true') return true;
  } catch {}

  // 2. Check cookies (supports SSR and persists across tab sessions)
  try {
    if (document.cookie.includes(`${HAS_LOGGED_IN_KEY}=true`)) return true;
    if (document.cookie.includes(`${AUTH_ANIM_SEEN_KEY}=true`)) return true;
  } catch {}

  // 3. Inspect user metadata if provided
  if (user) {
    const meta = user.user_metadata || {};
    if (meta.has_logged_in === true || meta.animation_shown === true) {
      return true;
    }
    // Existing users already have a display name configured
    if (typeof meta.display_name === 'string' && meta.display_name.trim().length > 0) {
      return true;
    }
    // Returning users whose last_sign_in_at is after account creation
    if (user.last_sign_in_at && user.created_at) {
      const created = new Date(user.created_at).getTime();
      const lastLogin = new Date(user.last_sign_in_at).getTime();
      if (lastLogin - created > 10000) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Marks that the user has logged in. Once called, the tapping hand animation
 * will never be shown anywhere again across sessions, devices, or reloads.
 */
export function markUserLoggedIn(user?: User | null): void {
  if (typeof window === 'undefined') return;

  // 1. Persist to localStorage
  try {
    localStorage.setItem(HAS_LOGGED_IN_KEY, 'true');
    localStorage.setItem(AUTH_ANIM_SEEN_KEY, 'true');
  } catch {}

  // 2. Persist to cookie (10-year expiration)
  try {
    document.cookie = `${HAS_LOGGED_IN_KEY}=true; path=/; max-age=315360000; SameSite=Lax`;
    document.cookie = `${AUTH_ANIM_SEEN_KEY}=true; path=/; max-age=315360000; SameSite=Lax`;
  } catch {}

  // 3. Update Supabase user profile metadata if user session is active
  if (isSupabaseConfigured && user) {
    try {
      const supabase = createClient();
      supabase.auth.updateUser({
        data: {
          has_logged_in: true,
          animation_shown: true,
        },
      }).catch(() => {});
    } catch {}
  }
}
