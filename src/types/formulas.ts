export interface FormulaSymbol {
  symbol: string;
  meaning: string;
  unit?: string;
}

export interface Formula {
  id: string;
  name: string;
  subject?: string;
  level?: string;
  chapter?: string;
  topic?: string;
  expression: string;
  latex: string;
  alternateLatex?: string[];
  symbols: FormulaSymbol[];
  siUnit?: string;
  explanation: string;
  conditions?: string;
  signConvention?: string;
  example?: string;
  keywords: string[];
  difficulty?: 'foundation' | 'intermediate' | 'advanced';
  status?: 'verified' | 'review_required';
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  formulas: Formula[];
}

export interface AcademicLevel {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  levelOrder: number;
  chapters: Chapter[];
}

export type SubjectId = 'physics' | 'constants' | 'mathematics' | 'neet';

export type ConstantCategory = 'all' | 'universal' | 'electromagnetism' | 'thermodynamics' | 'atomic-nuclear';

export interface SubjectConfig {
  id: SubjectId;
  name: string;
  tagline: string;
  description: string;
  isReady: boolean;
  statusBadge: string;
}

export interface PhysicalConstant {
  id: string;
  name: string;
  symbol: string;
  symbolLatex: string;
  formulaLatex: string;
  value: string;
  valueLatex: string;
  unit: string;
  unitLatex: string;
  dimensions?: string;
  category: 'universal' | 'electromagnetism' | 'thermodynamics' | 'atomic-nuclear';
  description: string;
  latex?: string; // backwards compatibility
}

