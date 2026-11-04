// ============================================================
// SamayYudh 2.0 — PYQ Question Bank Store & Dynamic Aggregations
// Works seamlessly on both server and browser environments
// ============================================================

import type { PyqExamPaper, PyqQuestion, PyqStats, PyqFilterParams } from './types';
import fs from 'fs';
import path from 'path';

// Cached in-memory database on the server
let cachedDb: { papers: PyqExamPaper[]; questions: PyqQuestion[]; updated_at: string } | null = null;

function getDatabaseFilePath(): string {
  return path.join(process.cwd(), 'data', 'pyq_database.json');
}

export function loadServerPyqData(): { papers: PyqExamPaper[]; questions: PyqQuestion[] } {
  if (typeof window !== 'undefined') {
    throw new Error('loadServerPyqData can only be called in a server environment.');
  }

  try {
    const filePath = getDatabaseFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      cachedDb = JSON.parse(content);
      return cachedDb || { papers: [], questions: [] };
    }
  } catch (err) {
    console.error('Error reading pyq_database.json:', err);
  }

  return { papers: [], questions: [] };
}

export function calculatePyqStats(questions: PyqQuestion[], papers: PyqExamPaper[]): PyqStats {
  const datesSet = new Set<string>();
  const shiftsSet = new Set<string>();
  const byDate: Record<string, number> = {};
  const byShift: Record<string, number> = {};

  let physicsCount = 0;
  let chemistryCount = 0;
  let mathematicsCount = 0;

  for (const q of questions) {
    if (q.subject === 'Physics') physicsCount++;
    else if (q.subject === 'Chemistry') chemistryCount++;
    else if (q.subject === 'Mathematics') mathematicsCount++;

    if (q.exam_date_str) {
      datesSet.add(q.exam_date_str);
      byDate[q.exam_date_str] = (byDate[q.exam_date_str] || 0) + 1;
    }

    if (q.shift) {
      shiftsSet.add(q.shift);
      byShift[q.shift] = (byShift[q.shift] || 0) + 1;
    }
  }

  return {
    totalQuestions: questions.length,
    totalPapers: papers.length,
    availableDates: Array.from(datesSet).sort(),
    availableShifts: Array.from(shiftsSet).sort(),
    physicsCount,
    chemistryCount,
    mathematicsCount,
    byDate,
    byShift,
  };
}

export function filterPyqQuestions(
  questions: PyqQuestion[],
  filters: PyqFilterParams
): { questions: PyqQuestion[]; total: number } {
  let filtered = [...questions];

  // Exclude placeholder or incomplete questions by default
  filtered = filtered.filter(
    (q) => !q.is_placeholder && !q.question_statement.startsWith('Question ') && q.question_statement.trim().length >= 20
  );

  if (filters.exam && filters.exam !== 'All') {
    filtered = filtered.filter((q) => q.exam.toLowerCase() === filters.exam!.toLowerCase());
  }

  if (filters.subject && filters.subject !== 'All') {
    filtered = filtered.filter((q) => q.subject.toLowerCase() === filters.subject!.toLowerCase());
  }

  if (filters.date && filters.date !== 'All') {
    filtered = filtered.filter((q) => q.exam_date_str === filters.date);
  }

  if (filters.shift && filters.shift !== 'All') {
    filtered = filtered.filter((q) => q.shift.toLowerCase() === filters.shift!.toLowerCase());
  }

  if (filters.section && filters.section !== 'All') {
    filtered = filtered.filter((q) => q.section.toLowerCase() === filters.section!.toLowerCase());
  }

  if (filters.questionType && filters.questionType !== 'All') {
    filtered = filtered.filter((q) => q.question_type.toLowerCase() === filters.questionType!.toLowerCase());
  }

  if (filters.searchQuery && filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.question_statement.toLowerCase().includes(q) ||
        (item.options && item.options.some((opt) => opt.text.toLowerCase().includes(q))) ||
        item.subject.toLowerCase().includes(q) ||
        item.exam_date_str.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;

  if (filters.page && filters.pageSize) {
    const start = (filters.page - 1) * filters.pageSize;
    filtered = filtered.slice(start, start + filters.pageSize);
  }

  return { questions: filtered, total };
}

// Client-side API fetchers
export async function fetchClientPyqPapers(): Promise<{
  papers: PyqExamPaper[];
  stats: PyqStats;
}> {
  const res = await fetch('/api/pyq/papers');
  if (!res.ok) {
    throw new Error(`Failed to fetch PYQ papers: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchClientPyqQuestions(
  filters: PyqFilterParams
): Promise<{ questions: PyqQuestion[]; total: number; page: number; pageSize: number }> {
  const params = new URLSearchParams();
  if (filters.subject && filters.subject !== 'All') params.set('subject', filters.subject);
  if (filters.date && filters.date !== 'All') params.set('date', filters.date);
  if (filters.shift && filters.shift !== 'All') params.set('shift', filters.shift);
  if (filters.section && filters.section !== 'All') params.set('section', filters.section);
  if (filters.questionType && filters.questionType !== 'All') params.set('type', filters.questionType);
  if (filters.searchQuery) params.set('q', filters.searchQuery);
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.pageSize) params.set('pageSize', filters.pageSize.toString());

  const res = await fetch(`/api/pyq/questions?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch PYQ questions: ${res.statusText}`);
  }
  return res.json();
}

