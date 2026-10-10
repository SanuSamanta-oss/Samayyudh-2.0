// ============================================================
// SamayYudh 2.0 — Cloud Sync Engine
// Syncs data between IndexedDB (local) ↔ Supabase (cloud)
// Offline-first: local writes are queued and synced when online
// ============================================================

import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import * as localDB from '@/lib/store/local-db';
import type { Answer, AnswerEvaluation, ExamSession, StickyNote } from '@/types';

type SyncTable = 'exam_sessions' | 'answers' | 'evaluations' | 'sticky_notes';

interface SyncQueueItem {
  id: string;
  table: SyncTable;
  operation: 'upsert' | 'delete';
  data: Record<string, unknown>;
  timestamp: string;
  synced: boolean;
}

let isSyncing = false;

/**
 * Queue a local change for background sync to Supabase.
 */
export async function queueSync(
  table: SyncTable,
  operation: 'upsert' | 'delete',
  data: Record<string, unknown>,
): Promise<void> {
  const item: SyncQueueItem = {
    id: `${table}-${data.id}-${Date.now()}`,
    table,
    operation,
    data,
    timestamp: new Date().toISOString(),
    synced: false,
  };

  await localDB.addToSyncQueue(item as Parameters<typeof localDB.addToSyncQueue>[0]);

  // Attempt immediate sync if online
  if (navigator.onLine && isSupabaseConfigured) {
    debouncedSync();
  }
}

/**
 * Process all unsynced items from the queue.
 */
export async function processSync(): Promise<{ synced: number; failed: number }> {
  if (!isSupabaseConfigured || isSyncing) return { synced: 0, failed: 0 };
  if (!navigator.onLine) return { synced: 0, failed: 0 };

  isSyncing = true;
  let synced = 0;
  let failed = 0;

  try {
    const supabase = createClient();
    const unsyncedItems = await localDB.getUnsyncedItems();

    for (const item of unsyncedItems) {
      try {
        const typedItem = item as unknown as SyncQueueItem;

        if (typedItem.operation === 'upsert') {
          const { error } = await supabase
            .from(typedItem.table)
            .upsert(typedItem.data, { onConflict: 'id' });

          if (error) {
            console.error(`[Sync] Failed to upsert ${typedItem.table}:`, error.message);
            failed++;
            continue;
          }
        } else if (typedItem.operation === 'delete') {
          const { error } = await supabase
            .from(typedItem.table)
            .delete()
            .eq('id', typedItem.data.id as string);

          if (error) {
            console.error(`[Sync] Failed to delete from ${typedItem.table}:`, error.message);
            failed++;
            continue;
          }
        }

        await localDB.markSynced(typedItem.id);
        synced++;
      } catch (err) {
        console.error('[Sync] Error processing item:', err);
        failed++;
      }
    }
  } catch (err) {
    console.error('[Sync] Error:', err);
  } finally {
    isSyncing = false;
  }

  return { synced, failed };
}

/**
 * Pull data from Supabase and merge into IndexedDB.
 * Used on initial login or when reconnecting.
 */
export async function pullFromCloud(userId: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  const supabase = createClient();

  try {
    // Pull sessions
    const { data: sessions } = await supabase
      .from('exam_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (sessions) {
      for (const session of sessions) {
        await localDB.saveSession(session as ExamSession);
      }
    }

    // Pull answers
    const { data: answers } = await supabase
      .from('answers')
      .select('*')
      .eq('user_id', userId);

    if (answers) {
      for (const answer of answers) {
        await localDB.saveAnswer(answer as Answer);
      }
    }

    // Pull evaluations
    const { data: evaluations } = await supabase
      .from('evaluations')
      .select('*')
      .eq('user_id', userId);

    if (evaluations) {
      for (const evaluation of evaluations) {
        await localDB.saveEvaluation(evaluation as AnswerEvaluation);
      }
    }

    // Pull sticky notes
    const { data: notes } = await supabase
      .from('sticky_notes')
      .select('*')
      .eq('user_id', userId);

    if (notes) {
      for (const note of notes) {
        await localDB.saveStickyNote(note as StickyNote);
      }
    }

    console.log('[Sync] Cloud data pulled successfully');
  } catch (err) {
    console.error('[Sync] Failed to pull from cloud:', err);
  }
}

// Debounce helper
let syncTimeout: ReturnType<typeof setTimeout> | null = null;

function debouncedSync() {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    processSync();
  }, 2000);
}

/**
 * Set up listeners for online/offline events.
 * Call this once on app mount.
 */
export function initSyncListeners(): () => void {
  const handleOnline = () => {
    console.log('[Sync] Back online — processing queue');
    processSync();
  };

  window.addEventListener('online', handleOnline);

  // Process any pending items on init
  if (navigator.onLine && isSupabaseConfigured) {
    processSync();
  }

  return () => {
    window.removeEventListener('online', handleOnline);
  };
}
