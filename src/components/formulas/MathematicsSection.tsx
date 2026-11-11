'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Search,
  BookOpen,
  Layers,
  ChevronRight,
  RotateCcw,
  X,
  Code2,
  Copy,
  Check,
  Sparkles,
  Sigma,
  Pi,
  Compass,
  Maximize2,
} from 'lucide-react';
import {
  mathematicsDivisions,
  searchMathematicsFormulas,
  getMathematicsStats,
} from '@/data/formulas/mathematics';
import type { Formula, AcademicLevel, Chapter } from '@/types/formulas';
import { MathRenderer } from './MathRenderer';
import { MathFormulaDetailModal } from './MathFormulaDetailModal';
import { SmoothSelect } from '@/components/ui/SmoothSelect';
import { cn } from '@/lib/utils';

export function MathematicsSection() {
  const [selectedDivisionId, setSelectedDivisionId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeLatexSourceId, setActiveLatexSourceId] = useState<string | null>(null);

  const stats = useMemo(() => getMathematicsStats(), []);

  // Filtered search results
  const searchResults = useMemo(() => {
    return searchMathematicsFormulas(searchQuery, selectedDivisionId, selectedChapterId);
  }, [searchQuery, selectedDivisionId, selectedChapterId]);

  // Currently active division object
  const currentDivision = useMemo(() => {
    if (!selectedDivisionId) return null;
    return mathematicsDivisions.find((div) => div.id === selectedDivisionId) || null;
  }, [selectedDivisionId]);

  // Currently active chapter (subtopic) object
  const currentChapter = useMemo(() => {
    if (!selectedChapterId) return null;
    for (const div of mathematicsDivisions) {
      const found = div.chapters.find((ch) => ch.id === selectedChapterId);
      if (found) return found;
    }
    return null;
  }, [selectedChapterId]);

  // Flattened list of formulas in current view for next/prev modal navigation
  const visibleFormulas = useMemo(() => {
    return searchResults.map((r) => r.formula);
  }, [searchResults]);

  const selectedFormulaIndex = useMemo(() => {
    if (!selectedFormula) return -1;
    return visibleFormulas.findIndex((f) => f.id === selectedFormula.id);
  }, [selectedFormula, visibleFormulas]);

  const handleNextFormula = useCallback(() => {
    if (selectedFormulaIndex >= 0 && selectedFormulaIndex < visibleFormulas.length - 1) {
      setSelectedFormula(visibleFormulas[selectedFormulaIndex + 1]);
    }
  }, [selectedFormulaIndex, visibleFormulas]);

  const handlePrevFormula = useCallback(() => {
    if (selectedFormulaIndex > 0) {
      setSelectedFormula(visibleFormulas[selectedFormulaIndex - 1]);
    }
  }, [selectedFormulaIndex, visibleFormulas]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDivisionId(null);
    setSelectedChapterId(null);
  };

  const handleCopyLatex = async (formula: Formula, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(formula.latex || formula.expression);
      setCopiedId(formula.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleToggleSource = (formulaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveLatexSourceId((prev) => (prev === formulaId ? null : formulaId));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] p-6 md:p-8 shadow-xs"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/80 mb-3">
              <Calculator className="w-3.5 h-3.5" />
              <span>Full Curriculum Mathematics Formula Library</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Mathematics Formula Library
            </h2>
            <p className="mt-1 text-sm md:text-base text-slate-600 dark:text-slate-300 font-normal max-w-2xl">
              Complete topic-wise LaTeX formulas with formal mathematical definitions, variable breakdowns, and domain restrictions across all 6 core curriculum divisions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/80">
              6 Divisions
            </span>
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/80">
              {stats.totalSubtopics} Subtopics
            </span>
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              {stats.totalFormulas} Formulas
            </span>
          </div>
        </div>

        {/* 6 Core Division Selector Tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 border-t border-slate-200/80 dark:border-slate-800 pt-5 scrollbar-none">
          <button
            onClick={() => {
              setSelectedDivisionId(null);
              setSelectedChapterId(null);
            }}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5',
              selectedDivisionId === null
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600'
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Divisions</span>
            <span className="text-[10px] opacity-75">({stats.totalFormulas})</span>
          </button>

          {mathematicsDivisions.map((div, idx) => {
            const isSelected = selectedDivisionId === div.id;
            const formulaCount = div.chapters.reduce((sum, ch) => sum + ch.formulas.length, 0);

            return (
              <button
                key={div.id}
                onClick={() => {
                  setSelectedDivisionId(isSelected ? null : div.id);
                  setSelectedChapterId(null);
                }}
                className={cn(
                  'px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5',
                  isSelected
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600'
                )}
              >
                <span>{idx + 1}. {div.shortTitle}</span>
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  )}
                >
                  {formulaCount}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Search and Subtopic Jump Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mathematical formulas by name, symbol, expression, or keywords..."
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-2xs font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              type="button"
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Subtopic Selector Dropdown */}
        <div className="flex items-center gap-2">
          <SmoothSelect
            value={selectedChapterId || ''}
            onChange={(v) => setSelectedChapterId(v || null)}
            ariaLabel="Select mathematics topic"
            variant="elevated"
            align="right"
            className="min-w-[190px]"
            options={[
              {
                value: '',
                label: `All Topics (${selectedDivisionId ? currentDivision?.chapters.length : stats.totalSubtopics})`,
              },
              ...(selectedDivisionId
                ? currentDivision?.chapters || []
                : mathematicsDivisions.flatMap((d) => d.chapters)
              ).map((ch) => ({ value: ch.id, label: `${ch.title} (${ch.formulas.length})` })),
            ]}
          />

          {(searchQuery || selectedDivisionId || selectedChapterId) && (
            <button
              onClick={handleClearFilters}
              type="button"
              title="Reset all filters"
              className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Subtopics Quick Filter Bar (when a division is selected or all topics) */}
      {selectedDivisionId && currentDivision && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedChapterId(null)}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border',
              selectedChapterId === null
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600'
            )}
          >
            All in {currentDivision.shortTitle}
          </button>
          {currentDivision.chapters.map((ch) => {
            const isSelected = selectedChapterId === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChapterId(isSelected ? null : ch.id)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5',
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600'
                )}
              >
                <span>{ch.title}</span>
                <span className="text-[10px] opacity-75">({ch.formulas.length})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Results Header Counter & Breadcrumbs */}
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
        <div>
          Showing <span className="font-extrabold text-slate-900 dark:text-white">{searchResults.length}</span>{' '}
          {searchResults.length === 1 ? 'mathematical formula' : 'mathematical formulas'}
          {selectedDivisionId && currentDivision && (
            <span>
              {' '}
              in <span className="font-extrabold text-slate-900 dark:text-white">{currentDivision.title}</span>
            </span>
          )}
          {selectedChapterId && currentChapter && (
            <span>
              {' '}
              • Topic: <span className="font-extrabold text-slate-900 dark:text-white">{currentChapter.title}</span>
            </span>
          )}
        </div>

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="hover:text-slate-900 dark:hover:text-white text-indigo-600 dark:text-indigo-400 font-bold"
          >
            Clear query
          </button>
        )}
      </div>

      {/* Main Formula Cards Grid View with Smooth Detail Slide Trigger */}
      {searchResults.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center bg-white dark:bg-[#111A2E]">
          <Search className="w-8 h-8 mx-auto text-slate-400 mb-3" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            No matching mathematics formulas found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            No formula matches &quot;{searchQuery}&quot;. Try searching with alternate terminology or clear filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            Reset Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {searchResults.map(({ formula, chapter, division }) => {
            const isSourceOpen = activeLatexSourceId === formula.id;
            const isCopied = copiedId === formula.id;

            return (
              <motion.div
                key={formula.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setSelectedFormula(formula)}
                className="group relative cursor-pointer rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111A2E] p-5 md:p-6 shadow-xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Tags & Action Buttons */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="text-[11px] font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
                        <span>{division.shortTitle}</span>
                        <span>•</span>
                        <span>{chapter.title}</span>
                      </div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                          {formula.name}
                        </h3>
                        {formula.difficulty && (
                          <span
                            className={cn(
                              'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border',
                              formula.difficulty === 'foundation' &&
                                'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
                              formula.difficulty === 'intermediate' &&
                                'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800',
                              formula.difficulty === 'advanced' &&
                                'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800'
                            )}
                          >
                            {formula.difficulty}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => handleToggleSource(formula.id, e)}
                        type="button"
                        title={isSourceOpen ? 'View typeset equation' : 'View LaTeX source'}
                        className={cn(
                          'p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors',
                          isSourceOpen && 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
                        )}
                      >
                        <Code2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleCopyLatex(formula, e)}
                        type="button"
                        title="Copy LaTeX formula"
                        className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Mathematical Expression Box */}
                  <div className="my-3.5 p-4 md:p-5 rounded-xl bg-slate-50/90 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 overflow-x-auto">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80 dark:border-slate-800/80 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      <span>{isSourceOpen ? 'LaTeX Code' : 'Typeset Equation'}</span>
                      <span className="text-slate-400 dark:text-slate-500 lowercase font-mono">KaTeX</span>
                    </div>

                    {isSourceOpen ? (
                      <div className="font-mono text-xs text-indigo-700 dark:text-indigo-300 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 overflow-x-auto select-all">
                        {formula.latex || formula.expression}
                      </div>
                    ) : (
                      <div className="min-h-[60px] flex items-center justify-center py-3 px-2 text-center text-slate-900 dark:text-white">
                        <MathRenderer
                          latex={formula.latex || formula.expression}
                          formulaId={formula.id}
                          fallbackText={formula.expression}
                          displayMode={true}
                          className="text-lg sm:text-xl md:text-2xl font-bold"
                        />
                      </div>
                    )}
                  </div>

                  {/* Explanation Snippet */}
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
                    {formula.explanation}
                  </p>
                </div>

                {/* Card Footer: Variable Preview & Slide Trigger */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                    {formula.symbols.length > 0
                      ? `${formula.symbols.length} variable ${formula.symbols.length === 1 ? 'definition' : 'definitions'}`
                      : 'Standard variables'}
                  </div>

                  <div className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Smooth Slide-In Formula Detail View */}
      {selectedFormula && (
        <MathFormulaDetailModal
          formula={selectedFormula}
          onClose={() => setSelectedFormula(null)}
          onNext={handleNextFormula}
          onPrev={handlePrevFormula}
          hasNext={selectedFormulaIndex >= 0 && selectedFormulaIndex < visibleFormulas.length - 1}
          hasPrev={selectedFormulaIndex > 0}
          currentIndex={selectedFormulaIndex}
          totalCount={visibleFormulas.length}
          divisionTitle={searchResults.find((r) => r.formula.id === selectedFormula.id)?.division.title}
          subtopicTitle={searchResults.find((r) => r.formula.id === selectedFormula.id)?.chapter.title}
        />
      )}
    </div>
  );
}

