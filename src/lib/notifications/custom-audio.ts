// ============================================================
// SamayYudh 2.0 — Custom Notification Tune & Audio Storage Engine
// IndexedDB + LocalStorage fallback for custom study alarm audio (MP3, WAV, OGG, M4A, AAC)
// ============================================================

const DB_NAME = 'samayyudh_audio_db';
const DB_VERSION = 1;
const STORE_NAME = 'custom_tones';
const STORAGE_KEY = 'samayyudh_custom_tone_meta';
const ACTIVE_TONE_ID = 'active_custom_tone';

export interface CustomToneRecord {
  id: string;
  name: string;
  dataUrl: string;
  sizeBytes: number;
  mimeType: string;
  updatedAt: number;
}

/**
 * Opens or initializes the IndexedDB database for audio storage.
 */
function openAudioDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves a user-uploaded audio file as the active custom reminder tune.
 * Supports MP3, WAV, OGG, M4A, AAC up to 10MB.
 */
export async function saveCustomAudioTone(file: File): Promise<CustomToneRecord> {
  // Validate file size (10 MB limit)
  const MAX_SIZE_BYTES = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('Audio file exceeds 10MB limit. Please choose a shorter or compressed audio clip.');
  }

  // Convert File to base64 Data URL
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read audio file'));
    reader.readAsDataURL(file);
  });

  const record: CustomToneRecord = {
    id: ACTIVE_TONE_ID,
    name: file.name,
    dataUrl,
    sizeBytes: file.size,
    mimeType: file.type || 'audio/mpeg',
    updatedAt: Date.now(),
  };

  // 1. Try saving to IndexedDB
  try {
    const db = await openAudioDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[CustomAudio] IndexedDB store failed, falling back to localStorage metadata', err);
  }

  // 2. Also keep metadata in localStorage for fast sync across tabs/components
  if (typeof window !== 'undefined') {
    try {
      const meta = {
        name: record.name,
        sizeBytes: record.sizeBytes,
        mimeType: record.mimeType,
        updatedAt: record.updatedAt,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
      // If smaller than 2MB, store fallback data URL in localStorage too
      if (file.size < 2 * 1024 * 1024) {
        localStorage.setItem(`${STORAGE_KEY}_data`, record.dataUrl);
      }
    } catch {
      // Ignore quota errors for localStorage
    }
  }

  return record;
}

/**
 * Retrieves the stored custom audio tone record from IndexedDB or LocalStorage.
 */
export async function getStoredCustomAudioTone(): Promise<CustomToneRecord | null> {
  if (typeof window === 'undefined') return null;

  // 1. Try IndexedDB
  try {
    const db = await openAudioDB();
    const result = await new Promise<CustomToneRecord | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(ACTIVE_TONE_ID);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (result && result.dataUrl) {
      return result;
    }
  } catch {
    // Fall back to localStorage
  }

  // 2. Fallback to LocalStorage
  try {
    const rawMeta = localStorage.getItem(STORAGE_KEY);
    const dataUrl = localStorage.getItem(`${STORAGE_KEY}_data`);
    if (rawMeta && dataUrl) {
      const meta = JSON.parse(rawMeta);
      return {
        id: ACTIVE_TONE_ID,
        name: meta.name,
        dataUrl,
        sizeBytes: meta.sizeBytes || 0,
        mimeType: meta.mimeType || 'audio/mpeg',
        updatedAt: meta.updatedAt || Date.now(),
      };
    }
  } catch {
    // Ignore
  }

  return null;
}

/**
 * Deletes the stored custom audio tone.
 */
export async function deleteStoredCustomAudioTone(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const db = await openAudioDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(ACTIVE_TONE_ID);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Ignore
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(`${STORAGE_KEY}_data`);
  } catch {
    // Ignore
  }
}

/**
 * Formats bytes into a human-readable size string (e.g., "340 KB").
 */
export function formatAudioSize(bytes: number): string {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
