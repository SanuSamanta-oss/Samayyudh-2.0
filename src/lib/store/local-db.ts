// ============================================================
// SamayYudh 2.0 — IndexedDB Local Store
// Provides offline-first persistence for exam sessions
// ============================================================

import { openDB, type IDBPDatabase } from 'idb';
import type { Answer, AnswerEvaluation, ExamSession, StickyNote, Question } from '@/types';

const DB_NAME = 'samayyudh-v2';
const DB_VERSION = 3;

interface SamayYudhDB {
  sessions: ExamSession;
  answers: Answer;
  sticky_notes: StickyNote;
  evaluations: AnswerEvaluation;
  sync_queue: SyncQueueItem;
  questions: Question;
}

interface SyncQueueItem {
  id: string;
  table: string;
  operation: 'upsert' | 'delete';
  data: unknown;
  timestamp: string;
  synced: boolean;
}

let dbPromise: Promise<IDBPDatabase<SamayYudhDB>> | null = null;

function getDB() {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<SamayYudhDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('answers')) {
          const answerStore = db.createObjectStore('answers', { keyPath: 'id' });
          answerStore.createIndex('by_session', 'session_id');
          answerStore.createIndex('by_question', 'question_id');
        }
        if (!db.objectStoreNames.contains('sticky_notes')) {
          const noteStore = db.createObjectStore('sticky_notes', { keyPath: 'id' });
          noteStore.createIndex('by_session', 'session_id');
        }
        if (!db.objectStoreNames.contains('evaluations')) {
          const evalStore = db.createObjectStore('evaluations', { keyPath: 'id' });
          evalStore.createIndex('by_answer', 'answer_id');
          evalStore.createIndex('by_question', 'question_id');
        }
        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id' });
          syncStore.createIndex('by_synced', 'synced');
        }
        if (!db.objectStoreNames.contains('questions')) {
          db.createObjectStore('questions', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

// --- Session Operations ---

export async function saveSession(session: ExamSession): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('sessions', session);
}

export async function getSession(id: string): Promise<ExamSession | undefined> {
  const db = await getDB();
  if (!db) return undefined;
  return db.get('sessions', id);
}

export async function getAllSessions(): Promise<ExamSession[]> {
  const db = await getDB();
  if (!db) return [];
  return db.getAll('sessions');
}

export async function deleteSession(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete('sessions', id);
}

// --- Answer Operations ---

export async function saveAnswer(answer: Answer): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('answers', answer);
}

export async function getAnswer(id: string): Promise<Answer | undefined> {
  const db = await getDB();
  if (!db) return undefined;
  return db.get('answers', id);
}

export async function getAnswersBySession(sessionId: string): Promise<Answer[]> {
  const db = await getDB();
  if (!db) return [];
  return db.getAllFromIndex('answers', 'by_session', sessionId);
}

export async function getAnswerByQuestionAndSession(
  sessionId: string,
  questionId: string
): Promise<Answer | undefined> {
  const db = await getDB();
  if (!db) return undefined;
  const answers = await db.getAllFromIndex('answers', 'by_session', sessionId);
  return answers.find((a) => a.question_id === questionId);
}

// --- Sticky Note Operations ---

export async function saveStickyNote(note: StickyNote): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('sticky_notes', note);
}

export async function getStickyNotesBySession(sessionId: string): Promise<StickyNote[]> {
  const db = await getDB();
  if (!db) return [];
  return db.getAllFromIndex('sticky_notes', 'by_session', sessionId);
}

// --- Sync Queue ---

export async function addToSyncQueue(item: SyncQueueItem): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('sync_queue', item);
}

export async function getUnsyncedItems(): Promise<SyncQueueItem[]> {
  const db = await getDB();
  if (!db) return [];
  return db.getAllFromIndex('sync_queue', 'by_synced', 0);
}

export async function markSynced(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  const item = await db.get('sync_queue', id);
  if (item) {
    item.synced = true;
    await db.put('sync_queue', item);
  }
}

// --- Evaluation Operations ---

export async function saveEvaluation(evaluation: AnswerEvaluation): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('evaluations', evaluation);
}

export async function getEvaluationByQuestion(questionId: string): Promise<AnswerEvaluation | undefined> {
  const db = await getDB();
  if (!db) return undefined;
  const results = await db.getAllFromIndex('evaluations', 'by_question', questionId);
  return results[0]; // Latest evaluation for this question
}

export async function getEvaluationsByAnswerIds(answerIds: string[]): Promise<AnswerEvaluation[]> {
  const db = await getDB();
  if (!db) return [];
  const all: AnswerEvaluation[] = [];
  for (const id of answerIds) {
    const results = await db.getAllFromIndex('evaluations', 'by_answer', id);
    all.push(...results);
  }
  return all;
}

export async function getAllEvaluations(): Promise<AnswerEvaluation[]> {
  const db = await getDB();
  if (!db) return [];
  return db.getAll('evaluations');
}

// --- Bulk Operations ---

export async function getAllAnswers(): Promise<Answer[]> {
  const db = await getDB();
  if (!db) return [];
  return db.getAll('answers');
}

export async function getAllStickyNotes(): Promise<StickyNote[]> {
  const db = await getDB();
  if (!db) return [];
  return db.getAll('sticky_notes');
}

// --- Custom Question Operations ---

export async function saveCustomQuestion(question: Question): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('questions', question);
}

export async function getAllCustomQuestions(): Promise<Question[]> {
  const db = await getDB();
  if (!db) return [];
  return db.getAll('questions');
}

export async function deleteCustomQuestion(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete('questions', id);
}

