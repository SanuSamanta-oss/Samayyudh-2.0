'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  BookOpen,
  Info,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import type { Formula } from '@/types/formulas';
import { MathRenderer } from './MathRenderer';
import { cn } from '@/lib/utils';

interface MathFormulaDetailModalProps {
  formula: Formula | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  currentIndex?: number;
  totalCount?: number;
  divisionTitle?: string;
  subtopicTitle?: string;
}

export function MathFormulaDetailModal({
  formula,
  onClose,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
  currentIndex,
  totalCount,
  divisionTitle,
  subtopicTitle,
}: MathFormulaDetailModalProps) {
  const [copiedLatex, setCopiedLatex] = React.useState(false);
  const [showRawLatex, setShowRawLatex] = React.useState(false);

  // Keyboard navigation: Escape to close, Arrow keys for prev/next
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && hasPrev && onPrev) {
        onPrev();
      }
    },
    [onClose, onNext, onPrev, hasNext, hasPrev]
  );

  useEffect(() => {
    if (formula) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [formula, handleKeyDown]);

  const handleCopyLatex = async () => {
    if (!formula) return;
    try {
      await navigator.clipboard.writeText(formula.latex || formula.expression);
      setCopiedLatex(true);
      setTimeout(() => setCopiedLatex(false), 2000);
    } catch {
      // fallback
    }
  };

  if (!formula) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
        {/* Backdrop overlay with blur */}
        <motion.div
          key="math-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs"
          aria-hidden="true"
        />

        {/* Sliding Detail Drawer Panel */}
        <motion.aside
          key={`math-modal-drawer-${formula.id}`}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className={cn(
            'relative z-10 w-full sm:max-w-2xl h-full flex flex-col',
            'bg-white dark:bg-[#0D1526] text-slate-900 dark:text-white',
            'border-l border-slate-200/90 dark:border-slate-800',
            'shadow-2xl overflow-y-auto'
          )}
        >
          {/* Top Bar with Navigation & Actions */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0D1526]/95 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/80">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Mathematics Formula Detail</span>
              </span>
              {typeof currentIndex === 'number' && typeof totalCount === 'number' && (
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {currentIndex + 1} of {totalCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Previous / Next buttons */}
              {onPrev && (
                <button
                  onClick={onPrev}
                  disabled={!hasPrev}
                  type="button"
                  title="Previous formula (Left Arrow)"
                  aria-label="Previous formula"
                  className={cn(
                    'p-2 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors',
                    hasPrev
                      ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-300'
                      : 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50'
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {onNext && (
                <button
                  onClick={onNext}
                  disabled={!hasNext}
                  type="button"
                  title="Next formula (Right Arrow)"
                  aria-label="Next formula"
                  className={cn(
                    'p-2 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors',
                    hasNext
                      ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-300'
                      : 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50'
                  )}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                type="button"
                title="Close detail view (Esc)"
                aria-label="Close formula details"
                className="p-2 ml-1 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body Content with Slide Transition between formulas */}
          <motion.div
            key={`math-detail-body-${formula.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 p-6 md:p-8 space-y-6"
          >
            {/* Hierarchy Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {(divisionTitle || formula.level) && (
                <span className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {divisionTitle || formula.level}
                </span>
              )}
              {(subtopicTitle || formula.chapter) && (
                <span className="text-xs font-bold px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/80">
                  {subtopicTitle || formula.chapter}
                </span>
              )}
              {formula.difficulty && (
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border',
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

            {/* Formula Name */}
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {formula.name}
              </h2>
            </div>

            {/* LaTeX Equation Container */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-[#070D18] p-5 md:p-7 shadow-xs">
              <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-200/90 dark:border-slate-800/90">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 select-none">
                  {showRawLatex ? 'Raw LaTeX Expression' : 'Typeset Mathematical Equation'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowRawLatex(!showRawLatex)}
                    type="button"
                    title={showRawLatex ? 'View typeset equation' : 'View raw LaTeX code'}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors',
                      showRawLatex
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{showRawLatex ? 'Typeset' : 'LaTeX'}</span>
                  </button>

                  <button
                    onClick={handleCopyLatex}
                    type="button"
                    title="Copy LaTeX formula to clipboard"
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {copiedLatex ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {showRawLatex ? (
                <div className="font-mono text-xs sm:text-sm text-indigo-700 dark:text-indigo-300 p-4 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 overflow-x-auto select-all leading-relaxed">
                  {formula.latex || formula.expression}
                </div>
              ) : (
                <div className="min-h-[80px] flex items-center justify-center py-6 px-3 text-center overflow-x-auto text-slate-900 dark:text-white">
                  <MathRenderer
                    latex={formula.latex || formula.expression}
                    formulaId={`modal-${formula.id}`}
                    fallbackText={formula.expression}
                    displayMode={true}
                    className="text-2xl sm:text-3xl font-bold"
                  />
                </div>
              )}

              {/* Alternate forms if present */}
              {formula.alternateLatex && formula.alternateLatex.length > 0 && !showRawLatex && (
                <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                    Equivalent / Alternative Formulations:
                  </div>
                  <div className="space-y-2">
                    {formula.alternateLatex.map((alt, idx) => (
                      <div
                        key={`modal-alt-${idx}`}
                        className="py-2 px-3 rounded-lg bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 overflow-x-auto flex items-center justify-center"
                      >
                        <MathRenderer
                          latex={alt}
                          displayMode={true}
                          formulaId={`modal-alt-${formula.id}-${idx}`}
                          className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Explanation & Conceptual Meaning */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Concept &amp; Explanation</span>
              </div>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80">
                {formula.explanation}
              </p>
            </div>

            {/* Variable & Symbol Definitions */}
            {formula.symbols && formula.symbols.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Info className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Variables &amp; Mathematical Symbols ({formula.symbols.length})</span>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden bg-white dark:bg-[#111A2E]/60">
                  {formula.symbols.map((sym, sIdx) => (
                    <div
                      key={`symbol-${sIdx}`}
                      className="p-3.5 flex items-start gap-3.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="w-16 shrink-0 py-1 px-2 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-900/50 text-center font-mono font-bold text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm">
                        <MathRenderer
                          latex={sym.symbol}
                          displayMode={false}
                          formulaId={`sym-${formula.id}-${sIdx}`}
                          fallbackText={sym.symbol}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                          {sym.meaning}
                        </div>
                        {sym.unit && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Unit / Domain: <span className="font-semibold text-slate-700 dark:text-slate-300">{sym.unit}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Applicable Conditions & Restrictions */}
            {formula.conditions && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Applicable Conditions &amp; Mathematical Domains</span>
                </div>
                <div className="p-4 rounded-xl border border-amber-200/70 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 text-xs sm:text-sm text-amber-900 dark:text-amber-200/90 leading-relaxed font-medium">
                  {formula.conditions}
                </div>
              </div>
            )}

            {/* Keywords & Tags */}
            {formula.keywords && formula.keywords.length > 0 && (
              <div className="pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Keywords
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formula.keywords.map((kw, kwIdx) => (
                    <span
                      key={`kw-${kwIdx}`}
                      className="px-2.5 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Bottom Footer with Prev/Next Navigation */}
          <div className="sticky bottom-0 z-20 flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0D1526]/95 backdrop-blur-md">
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              type="button"
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all',
                hasPrev
                  ? 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'border-slate-200/50 dark:border-slate-800/50 text-slate-300 dark:text-slate-700 opacity-50 cursor-not-allowed'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={onClose}
              type="button"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
            >
              Done
            </button>

            <button
              onClick={onNext}
              disabled={!hasNext}
              type="button"
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all',
                hasNext
                  ? 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'border-slate-200/50 dark:border-slate-800/50 text-slate-300 dark:text-slate-700 opacity-50 cursor-not-allowed'
              )}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
}

