'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, AlertCircle, Calculator, Code2, Compass } from 'lucide-react';
import type { Formula } from '@/types/formulas';
import { MathRenderer } from './MathRenderer';
import { cn } from '@/lib/utils';

interface FormulaCardProps {
  formula: Formula;
  chapterTitle?: string;
  levelTitle?: string;
  highlightQuery?: string;
}

export function FormulaCard({
  formula,
  chapterTitle,
  levelTitle,
}: FormulaCardProps) {
  const [copied, setCopied] = useState(false);
  const [showLatexSource, setShowLatexSource] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formula.latex || formula.expression);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111A2E] p-5 md:p-6 shadow-xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all duration-200"
    >
      {/* Header with Title, Category, and Actions */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          {(chapterTitle || levelTitle) && (
            <div className="text-[11px] font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
              <span>{[levelTitle, chapterTitle].filter(Boolean).join(' • ')}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base md:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
              {formula.name}
            </h3>
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
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowLatexSource(!showLatexSource)}
            type="button"
            aria-label="Toggle LaTeX source view"
            title={showLatexSource ? 'View typeset equation' : 'View LaTeX source code'}
            className={cn(
              'p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors',
              showLatexSource && 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
            )}
          >
            <Code2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            type="button"
            aria-label="Copy LaTeX formula to clipboard"
            title="Copy LaTeX formula"
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mathematical Typeset Expression Container */}
      <div className="my-4 p-4 md:p-5 rounded-xl bg-slate-50/90 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_4px_16px_rgba(0,0,0,0.35)] overflow-x-auto">
        <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 select-none">
            {showLatexSource ? 'LaTeX Source' : 'Typeset Equation'}
          </span>
          {formula.siUnit && (
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
              SI: <span className="font-bold text-slate-900 dark:text-white">{formula.siUnit}</span>
            </span>
          )}
        </div>

        {showLatexSource ? (
          <div className="font-mono text-xs md:text-sm text-indigo-700 dark:text-indigo-300 p-3 rounded-lg bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 overflow-x-auto select-all">
            {formula.latex || formula.expression}
          </div>
        ) : (
          <div className="min-h-[64px] flex items-center justify-center py-4 px-2 text-center text-slate-900 dark:text-white">
            <MathRenderer
              latex={formula.latex || formula.expression}
              formulaId={formula.id}
              fallbackText={formula.expression}
              displayMode={true}
              className="text-xl sm:text-2xl md:text-3xl font-bold"
            />
          </div>
        )}

        {/* Alternate / Equivalent Expressions if present */}
        {formula.alternateLatex && formula.alternateLatex.length > 0 && !showLatexSource && (
          <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 overflow-x-auto">
            <span className="shrink-0 font-bold text-[11px] uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              Equivalent:
            </span>
            <div className="flex items-center gap-3">
              {formula.alternateLatex.map((alt, idx) => (
                <MathRenderer
                  key={`${formula.id}-alt-${idx}`}
                  latex={alt}
                  displayMode={false}
                  formulaId={`${formula.id}-alt-${idx}`}
                  className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Explanation */}
      <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal mb-4">
        {formula.explanation}
      </p>

      {/* Meaning of Symbols Table/List */}
      {formula.symbols.length > 0 && (
        <div className="mb-4 pt-3.5 border-t border-slate-200/80 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Where:
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {formula.symbols.map((sym, idx) => (
              <li
                key={`${formula.id}-sym-${idx}`}
                className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs"
              >
                <span className="shrink-0 min-w-[20px] text-center font-bold text-indigo-600 dark:text-indigo-300">
                  <MathRenderer
                    latex={sym.symbol}
                    displayMode={false}
                    formulaId={`${formula.id}-sym-${idx}`}
                    fallbackText={sym.symbol}
                    className="font-bold text-indigo-600 dark:text-indigo-300"
                  />
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">=</span>
                <span className="truncate text-slate-800 dark:text-slate-100 font-medium">
                  {sym.meaning}
                  {sym.unit ? (
                    <span className="text-slate-500 dark:text-slate-400 font-normal ml-1">
                      ({sym.unit})
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Applicable Conditions / Assumptions */}
      {formula.conditions && (
        <div className="mb-3 flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-950 dark:text-amber-100">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-amber-900 dark:text-amber-300">Conditions / Assumptions: </span>
            <span className="font-medium">{formula.conditions}</span>
          </div>
        </div>
      )}

      {/* Sign Conventions (if applicable) */}
      {formula.signConvention && (
        <div className="mb-3 flex items-start gap-2.5 p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs text-sky-950 dark:text-sky-100">
          <Compass className="w-4 h-4 shrink-0 text-sky-600 dark:text-sky-400 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-sky-900 dark:text-sky-300">Sign Convention: </span>
            <span className="font-medium">{formula.signConvention}</span>
          </div>
        </div>
      )}

      {/* Practical Example */}
      {formula.example && (
        <div className="mb-3 flex items-start gap-2.5 p-3 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/30 text-xs text-indigo-950 dark:text-indigo-100">
          <Calculator className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
          <div className="leading-relaxed flex-1">
            <span className="font-bold text-indigo-900 dark:text-indigo-300">Example: </span>
            <div className="font-mono text-[11px] sm:text-xs text-slate-900 dark:text-indigo-100 bg-white/60 dark:bg-slate-900/80 p-2 rounded-lg mt-1 border border-indigo-200/60 dark:border-indigo-900/60">
              {formula.example}
            </div>
          </div>
        </div>
      )}

      {/* Keywords / Topic tags */}
      {formula.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2">
          {formula.keywords.slice(0, 6).map((kw) => (
            <span
              key={`${formula.id}-kw-${kw}`}
              className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 px-2.5 py-0.5 rounded-md"
            >
              #{kw}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
