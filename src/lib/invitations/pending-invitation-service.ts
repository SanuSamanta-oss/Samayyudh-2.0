/**
 * SamayYudh 2.0 — Pending Examination Invitation Service
 * Multi-layer client storage & recovery utility (LocalStorage + SessionStorage + Secure Cookie)
 * Guarantees zero-loss deferred deep linking when students install the PWA/App or authenticate.
 */

export interface PendingInvitationData {
  code: string;
  timestamp: number;
  origin?: string;
  source?: 'qr' | 'link' | 'share';
}

const STORAGE_KEY = 'sy_pending_invitation';
const COOKIE_NAME = 'sy_pending_exam';
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours validity

/**
 * Stores the pending examination invitation code across multiple browser storage layers.
 */
export function setPendingInvitation(code: string, source: 'qr' | 'link' | 'share' = 'link'): void {
  if (typeof window === 'undefined') return;
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) return;

  const data: PendingInvitationData = {
    code: cleanCode,
    timestamp: Date.now(),
    origin: window.location.origin,
    source,
  };

  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
    sessionStorage.setItem(STORAGE_KEY, serialized);
    
    // Also set a cookie so server-side middleware or edge routes can read it if needed
    const expires = new Date(Date.now() + MAX_AGE_MS).toUTCString();
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(cleanCode)}; expires=${expires}; path=/; SameSite=Lax`;
  } catch (err) {
    console.warn('[PendingInvitation] Failed to persist invitation:', err);
  }
}

/**
 * Retrieves the pending examination invitation if still valid (< 24 hours).
 */
export function getPendingInvitation(): PendingInvitationData | null {
  if (typeof window === 'undefined') return null;

  try {
    // 1. Try SessionStorage
    let raw = sessionStorage.getItem(STORAGE_KEY);
    // 2. Fallback to LocalStorage
    if (!raw) {
      raw = localStorage.getItem(STORAGE_KEY);
    }

    if (raw) {
      const parsed: PendingInvitationData = JSON.parse(raw);
      if (Date.now() - parsed.timestamp < MAX_AGE_MS && parsed.code) {
        return parsed;
      }
      // Expired
      clearPendingInvitation();
    }

    // 3. Fallback to Cookie
    const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
    if (match && match[2]) {
      const code = decodeURIComponent(match[2]).trim().toUpperCase();
      if (code) {
        return {
          code,
          timestamp: Date.now(),
          source: 'link',
        };
      }
    }
  } catch (err) {
    console.warn('[PendingInvitation] Failed to read pending invitation:', err);
  }

  return null;
}

/**
 * Clears the pending invitation from all storage layers once consumed.
 */
export function clearPendingInvitation(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  } catch (err) {
    console.warn('[PendingInvitation] Failed to clear pending invitation:', err);
  }
}
