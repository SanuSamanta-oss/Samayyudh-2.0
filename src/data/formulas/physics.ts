import type { AcademicLevel, Chapter, Formula } from '@/types/formulas';
import { class10Physics } from './class10';
import { class11Physics } from './class11';
import { class12Physics } from './class12';
import { higherEducationPhysics } from './higher-education';

export const physicsAcademicLevels: AcademicLevel[] = [
  class10Physics,
  class11Physics,
  class12Physics,
  higherEducationPhysics,
];

export function getAllPhysicsLevels(): AcademicLevel[] {
  return physicsAcademicLevels;
}

export function getPhysicsLevelById(levelId: string): AcademicLevel | undefined {
  return physicsAcademicLevels.find((level) => level.id === levelId);
}

export function getAllPhysicsChapters(): Chapter[] {
  return physicsAcademicLevels.flatMap((level) => level.chapters);
}

export function getPhysicsChapterById(chapterId: string): Chapter | undefined {
  for (const level of physicsAcademicLevels) {
    const found = level.chapters.find((ch) => ch.id === chapterId);
    if (found) return found;
  }
  return undefined;
}

export interface SearchResult {
  formula: Formula;
  chapter: Chapter;
  level: AcademicLevel;
}

export function searchPhysicsFormulas(
  query: string,
  levelId?: string | null,
  chapterId?: string | null
): SearchResult[] {
  const normalized = query.trim().toLowerCase();
  const results: SearchResult[] = [];

  for (const level of physicsAcademicLevels) {
    if (levelId && level.id !== levelId) continue;

    for (const chapter of level.chapters) {
      if (chapterId && chapter.id !== chapterId) continue;

      for (const formula of chapter.formulas) {
        if (!normalized) {
          results.push({ formula, chapter, level });
          continue;
        }

        const matchName = formula.name.toLowerCase().includes(normalized);
        const matchExpression = formula.expression.toLowerCase().includes(normalized);
        const matchExplanation = formula.explanation.toLowerCase().includes(normalized);
        const matchChapter = chapter.title.toLowerCase().includes(normalized);
        const matchLevel = level.title.toLowerCase().includes(normalized);
        const matchKeywords = formula.keywords.some((k) => k.toLowerCase().includes(normalized));
        const matchSymbols = formula.symbols.some(
          (s) => s.symbol.toLowerCase().includes(normalized) || s.meaning.toLowerCase().includes(normalized)
        );

        if (
          matchName ||
          matchExpression ||
          matchExplanation ||
          matchChapter ||
          matchLevel ||
          matchKeywords ||
          matchSymbols
        ) {
          results.push({ formula, chapter, level });
        }
      }
    }
  }

  return results;
}

export function getPhysicsStats() {
  const totalLevels = physicsAcademicLevels.length;
  const totalChapters = physicsAcademicLevels.reduce((acc, lvl) => acc + lvl.chapters.length, 0);
  const totalFormulas = physicsAcademicLevels.reduce(
    (acc, lvl) => acc + lvl.chapters.reduce((cAcc, ch) => cAcc + ch.formulas.length, 0),
    0
  );

  return {
    totalLevels,
    totalChapters,
    totalFormulas,
  };
}
