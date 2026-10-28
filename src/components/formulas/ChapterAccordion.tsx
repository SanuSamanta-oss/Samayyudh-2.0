'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { Chapter } from '@/types/formulas';
import { FormulaCard } from './FormulaCard';
import { cn } from '@/lib/utils';

interface ChapterAccordionProps {
  chapter: Chapter;
  levelTitle: string;
  defaultExpanded?: boolean;
  highlightQuery?: string;
}

export function ChapterAccordion({
  chapter,
  levelTitle,
  defaultExpanded = false,
  highlightQuery,
}: ChapterAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      id={chapter.id}
      className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111A2E] overflow-hidden transition-all duration-200 scroll-mt-24 shadow-xs"
    >
      {/* Chapter Accordion Trigger */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className={cn(
          'w-full flex items-center justify-between p-4 md:p-5 text-left transition-colors select-none',
          isExpanded
            ? 'bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200/90 dark:border-slate-800'
            : 'hover:bg-slate-50/60 dark:hover:bg-slate-900/40'
        )}
      >
        <div className="flex items-start gap-3.5 min-w-0 pr-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/80 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            {chapter.number}
          </div>
          <div className="min-w-0">
            <h4 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white truncate">
              {chapter.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
              {chapter.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            {chapter.formulas.length} {chapter.formulas.length === 1 ? 'formula' : 'formulas'}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-slate-400 dark:text-slate-400"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </button>

      {/* Accordion Content Panel */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key={`content-${chapter.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="p-4 md:p-6 space-y-4 bg-slate-50/40 dark:bg-slate-950/30">
              {chapter.formulas.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No formulas recorded for this chapter yet.
                </div>
              ) : (
                chapter.formulas.map((formula) => (
                  <FormulaCard
                    key={formula.id}
                    formula={formula}
                    chapterTitle={chapter.title}
                    levelTitle={levelTitle}
                    highlightQuery={highlightQuery}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
