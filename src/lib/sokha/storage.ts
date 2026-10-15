// ============================================================
// SamayYudh 2.0 — SOKHA Local Storage Manager
// Manages conversation threads and privacy-conscious persistence.
// Ensures complete cleanup so deleted chats NEVER resurrect.
// ============================================================

import { SokhaThread, SokhaMessage } from './types';

const STORAGE_KEY_PREFIX = 'samayyudh_sokha_threads_';
const ACTIVE_THREAD_KEY = 'samayyudh_sokha_active_id';

export function getStorageKey(userId?: string | null): string {
  const safeId = userId ? userId.replace(/[^a-zA-Z0-9_-]/g, '') : 'guest';
  return `${STORAGE_KEY_PREFIX}${safeId}`;
}

/**
 * Load all conversation threads for the current user.
 * Migrates any guest threads to the authenticated account upon sign-in.
 */
export function loadThreads(userId?: string | null): SokhaThread[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = getStorageKey(userId);
    const raw = localStorage.getItem(key);
    let threads: SokhaThread[] = [];

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        threads = parsed;
      }
    }

    // If authenticated user has no saved threads yet, check if guest threads exist to migrate
    if (threads.length === 0 && userId && userId !== 'guest') {
      const guestKey = `${STORAGE_KEY_PREFIX}guest`;
      const guestRaw = localStorage.getItem(guestKey);
      if (guestRaw) {
        try {
          const parsedGuest = JSON.parse(guestRaw);
          if (Array.isArray(parsedGuest) && parsedGuest.length > 0) {
            threads = parsedGuest;
            // Persist to user's storage and clean up guest key
            localStorage.setItem(key, JSON.stringify(threads));
            localStorage.removeItem(guestKey);
          }
        } catch {
          // ignore corrupted guest data
        }
      }
    }

    return threads.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  } catch (e) {
    console.error('Failed to load SOKHA threads:', e);
    return [];
  }
}

/**
 * Save all conversation threads to local storage (max 30 threads).
 */
export function saveThreads(threads: SokhaThread[], userId?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    const trimmed = threads.slice(0, 30);
    localStorage.setItem(getStorageKey(userId), JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save SOKHA threads:', e);
  }
}

/**
 * Get active thread ID from storage.
 */
export function getActiveThreadId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_THREAD_KEY);
}

/**
 * Set active thread ID in storage.
 */
export function setActiveThreadId(id: string | null): void {
  if (typeof window === 'undefined') return;
  if (id) {
    localStorage.setItem(ACTIVE_THREAD_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_THREAD_KEY);
  }
}

/**
 * Create a brand-new clean conversation thread.
 */
export function createNewThread(initialMessage?: SokhaMessage): SokhaThread {
  const now = Date.now();
  const id = `thread_${now}_${Math.random().toString(36).slice(2, 7)}`;
  let title = 'New Study Session';
  if (initialMessage?.content) {
    const cleanContent = initialMessage.content.replace(/\s+/g, ' ').trim();
    title = cleanContent.length > 35 ? cleanContent.slice(0, 35) + '…' : cleanContent;
  }

  return {
    id,
    title,
    createdAt: now,
    updatedAt: now,
    messages: initialMessage ? [initialMessage] : [],
  };
}

/**
 * Save or update a specific thread's messages and metadata.
 */
export function saveCurrentThread(
  threadId: string,
  messages: SokhaMessage[],
  userId?: string | null,
  customTitle?: string
): SokhaThread {
  const threads = loadThreads(userId);
  const now = Date.now();
  let existingIndex = threads.findIndex((t) => t.id === threadId);

  let thread: SokhaThread;
  if (existingIndex >= 0) {
    thread = {
      ...threads[existingIndex],
      messages,
      updatedAt: now,
    };
    if (customTitle) {
      thread.title = customTitle;
    } else if (thread.title === 'New Study Session' && messages.length > 0) {
      const firstUserMsg = messages.find((m) => m.role === 'user');
      if (firstUserMsg) {
        const clean = firstUserMsg.content.replace(/\s+/g, ' ').trim();
        thread.title = clean.length > 35 ? clean.slice(0, 35) + '…' : clean;
      }
    }
    threads[existingIndex] = thread;
  } else {
    let title = customTitle || 'New Study Session';
    if (!customTitle && messages.length > 0) {
      const firstUserMsg = messages.find((m) => m.role === 'user');
      if (firstUserMsg) {
        const clean = firstUserMsg.content.replace(/\s+/g, ' ').trim();
        title = clean.length > 35 ? clean.slice(0, 35) + '…' : clean;
      }
    }
    thread = {
      id: threadId,
      title,
      createdAt: now,
      updatedAt: now,
      messages,
    };
    threads.unshift(thread);
  }

  saveThreads(threads, userId);
  setActiveThreadId(threadId);
  return thread;
}

/**
 * Permanently delete a specific conversation thread by its ID.
 */
export function deleteThreadById(threadId: string, userId?: string | null): SokhaThread[] {
  if (typeof window === 'undefined') return [];
  const threads = loadThreads(userId);
  const remaining = threads.filter((t) => t.id !== threadId);
  saveThreads(remaining, userId);

  const activeId = getActiveThreadId();
  if (activeId === threadId) {
    setActiveThreadId(remaining[0]?.id || null);
  }

  return remaining;
}

/**
 * Permanently wipe all chatbot history.
 * Purges both the current user's key AND the guest key to prevent ghost history resurfacing.
 */
export function clearAllThreads(userId?: string | null): void {
  if (typeof window === 'undefined') return;
  // Clear user-specific key
  localStorage.removeItem(getStorageKey(userId));
  // Clear guest key as well so unauthenticated ghost messages never reload
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}guest`);
  // Clear active thread pointer
  localStorage.removeItem(ACTIVE_THREAD_KEY);
}

/**
 * Legacy helper for clearing the active thread.
 */
export function clearCurrentThread(userId?: string | null): void {
  if (typeof window === 'undefined') return;
  const activeId = getActiveThreadId();
  if (activeId) {
    deleteThreadById(activeId, userId);
  } else {
    const threads = loadThreads(userId);
    if (threads.length > 0) {
      deleteThreadById(threads[0].id, userId);
    }
  }
}

/**
 * Delete a single message from storage.
 */
export function deleteMessageFromStorage(
  messageId: string,
  userId?: string | null,
  threadId?: string | null
): void {
  if (typeof window === 'undefined') return;
  const threads = loadThreads(userId);
  if (threads.length === 0) return;

  const targetThreadId = threadId || getActiveThreadId() || threads[0]?.id;
  const threadIndex = threads.findIndex((t) => t.id === targetThreadId);

  if (threadIndex >= 0) {
    threads[threadIndex].messages = threads[threadIndex].messages.filter((m) => m.id !== messageId);
    threads[threadIndex].updatedAt = Date.now();
    saveThreads(threads, userId);
  }
}
