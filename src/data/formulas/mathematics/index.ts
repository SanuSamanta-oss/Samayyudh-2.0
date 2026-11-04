import type { AcademicLevel, Chapter, Formula } from '@/types/formulas';
import { division1Algebra } from './division1_algebra';
import { division2Calculus } from './division2_calculus';
import { division3Trigonometry } from './division3_trigonometry';
import { division4CoordinateGeometry } from './division4_coordinate_geometry';
import { division5Vectors3D } from './division5_vectors_3d';
import { division6ProbabilityStats } from './division6_probability_stats';

export const mathematicsDivisions: AcademicLevel[] = [
  division1Algebra,
  division2Calculus,
  division3Trigonometry,
  division4CoordinateGeometry,
  division5Vectors3D,
  division6ProbabilityStats,
];

export function getAllMathematicsDivisions(): AcademicLevel[] {
  return mathematicsDivisions;
}

export function getMathematicsDivisionById(divisionId: string): AcademicLevel | undefined {
  return mathematicsDivisions.find((div) => div.id === divisionId);
}

export function getAllMathematicsChapters(): Chapter[] {
  return mathematicsDivisions.flatMap((div) => div.chapters);
}

export function getMathematicsChapterById(chapterId: string): Chapter | undefined {
  for (const div of mathematicsDivisions) {
    const found = div.chapters.find((ch) => ch.id === chapterId);
    if (found) return found;
  }
  return undefined;
}

export interface MathSearchResult {
  formula: Formula;
  chapter: Chapter;
  division: AcademicLevel;
}

export function searchMathematicsFormulas(
  query: string,
  divisionId?: string | null,
  chapterId?: string | null
): MathSearchResult[] {
  const normalized = query.trim().toLowerCase();
  const results: MathSearchResult[] = [];

  for (const division of mathematicsDivisions) {
    if (divisionId && division.id !== divisionId) continue;

    for (const chapter of division.chapters) {
      if (chapterId && chapter.id !== chapterId) continue;

      for (const formula of chapter.formulas) {
        if (!normalized) {
          results.push({ formula, chapter, division });
          continue;
        }

        const matchName = formula.name.toLowerCase().includes(normalized);
        const matchExpression = formula.expression.toLowerCase().includes(normalized);
        const matchLatex = formula.latex.toLowerCase().includes(normalized);
        const matchExplanation = formula.explanation.toLowerCase().includes(normalized);
        const matchChapter = chapter.title.toLowerCase().includes(normalized);
        const matchDivision = division.title.toLowerCase().includes(normalized);
        const matchKeywords = formula.keywords.some((k) => k.toLowerCase().includes(normalized));
        const matchSymbols = formula.symbols.some(
          (s) => s.symbol.toLowerCase().includes(normalized) || s.meaning.toLowerCase().includes(normalized)
        );

        if (
          matchName ||
          matchExpression ||
          matchLatex ||
          matchExplanation ||
          matchChapter ||
          matchDivision ||
          matchKeywords ||
          matchSymbols
        ) {
          results.push({ formula, chapter, division });
        }
      }
    }
  }

  return results;
}

export function getMathematicsStats() {
  const totalDivisions = mathematicsDivisions.length;
  const totalSubtopics = mathematicsDivisions.reduce((acc, div) => acc + div.chapters.length, 0);
  const totalFormulas = mathematicsDivisions.reduce(
    (acc, div) => acc + div.chapters.reduce((cAcc, ch) => cAcc + ch.formulas.length, 0),
    0
  );

  return {
    totalDivisions,
    totalSubtopics,
    totalFormulas,
  };
}

export {
  division1Algebra,
  division2Calculus,
  division3Trigonometry,
  division4CoordinateGeometry,
  division5Vectors3D,
  division6ProbabilityStats,
};

