// ============================================================
// SamayYudh 2.0 — SOKHA Local Storage Manager
// Manages conversation threads and privacy-conscious persistence.
// ============================================================

import { SokhaThread, SokhaMessage } from './types';

const STORAGE_KEY_PREFIX = 'samayyudh_sokha_threads_';
const ACTIVE_THREAD_KEY = 'samayyudh_sokha_active_id';

function getStorageKey(userId?: string | null): string {
  // Isolate conversations per user identifier; use 'guest' if not signed in
  const safeId = userId ? userId.replace(/[^a-zA-Z0-9_-]/g, '') : 'guest';
  return `${STORAGE_KEY_PREFIX}${safeId}`;
}

export function loadThreads(userId?: string | null): SokhaThread[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load SOKHA threads:', e);
    return [];
  }
}

export function saveThreads(threads: SokhaThread[], userId?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    // Keep max 20 recent threads to avoid localStorage overflow
    const trimmed = threads.slice(0, 20);
    localStorage.setItem(getStorageKey(userId), JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save SOKHA threads:', e);
  }
}

export function getActiveThreadId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_THREAD_KEY);
}

export function setActiveThreadId(id: string | null): void {
  if (typeof window === 'undefined') return;
  if (id) {
    localStorage.setItem(ACTIVE_THREAD_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_THREAD_KEY);
  }
}

export function createNewThread(initialMessage?: SokhaMessage): SokhaThread {
  const now = Date.now();
  const id = `thread_${now}_${Math.random().toString(36).slice(2, 7)}`;
  const title = initialMessage ? initialMessage.content.slice(0, 32).trim() + '...' : 'New Study Session';

  return {
    id,
    title,
    createdAt: now,
    updatedAt: now,
    messages: initialMessage ? [initialMessage] : [],
  };
}

export function clearAllThreads(userId?: string | null): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(getStorageKey(userId));
  localStorage.removeItem(ACTIVE_THREAD_KEY);
}
