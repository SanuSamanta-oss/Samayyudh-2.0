'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
import { cn } from '@/lib/utils';

interface MathRendererProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
  formulaId?: string;
  fallbackText?: string;
}

export function MathRenderer({
  latex,
  displayMode = true,
  className,
  formulaId,
  fallbackText,
}: MathRendererProps) {
  const { html, isError, errorMessage } = useMemo(() => {
    if (!latex || !latex.trim()) {
      return { html: '', isError: false, errorMessage: '' };
    }

    try {
      const rendered = katex.renderToString(latex.trim(), {
        displayMode,
        throwOnError: false,
        errorColor: '#dc2626',
        output: 'htmlAndMathml',
        trust: false,
        strict: 'ignore',
      });

      return {
        html: rendered,
        isError: false,
        errorMessage: '',
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[MathRenderer Error] Failed to render LaTeX for formula: ${formulaId || 'unknown'}:`,
          errorMsg,
          'Raw LaTeX:',
          latex
        );
      }
      return {
        html: '',
        isError: true,
        errorMessage: errorMsg,
      };
    }
  }, [latex, displayMode, formulaId]);

  if (isError) {
    return (
      <div
        className={cn(
          'p-3 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/20 text-xs text-red-700 dark:text-red-400 font-mono overflow-x-auto',
          className
        )}
      >
        <span className="font-semibold">Rendering fallback: </span>
        <span>{fallbackText || latex}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-x-auto overflow-y-hidden max-w-full select-text py-1',
        displayMode ? 'text-center my-1' : 'inline-block',
        className
      )}
    >
      <span
        dangerouslySetInnerHTML={{ __html: html }}
        className="katex-rendered-wrapper inline-block text-foreground tracking-normal"
      />
    </div>
  );
}
