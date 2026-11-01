'use client';

/**
 * MathText — KaTeX-powered math and aligned prose renderer.
 * Supports:
 *   - Inline math: $ ... $
 *   - Block/Display math: $$ ... $$
 *   - Automatic unbreaking of arbitrary newlines in prose paragraphs
 *   - Safe KaTeX rendering with graceful fallback
 */

import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Single-symbol LaTeX replacements for prose outside $...$
const INLINE_REPLACEMENTS: [RegExp, string][] = [
  [/\\mu\b/g, 'μ'],
  [/\\varepsilon\b/g, 'ε'],
  [/\\epsilon\b/g, 'ε'],
  [/\\implies\b/g, '⟹'],
  [/\\Rightarrow\b/g, '⇒'],
  [/\\rightarrow\b/g, '→'],
  [/\\leftarrow\b/g, '←'],
  [/\\alpha\b/g, 'α'],
  [/\\beta\b/g, 'β'],
  [/\\gamma\b/g, 'γ'],
  [/\\delta\b/g, 'δ'],
  [/\\Delta\b/g, 'Δ'],
  [/\\theta\b/g, 'θ'],
  [/\\lambda\b/g, 'λ'],
  [/\\pi\b/g, 'π'],
  [/\\sigma\b/g, 'σ'],
  [/\\omega\b/g, 'ω'],
  [/\\Omega\b/g, 'Ω'],
  [/\\phi\b/g, 'φ'],
  [/\\psi\b/g, 'ψ'],
  [/\\infty\b/g, '∞'],
  [/\\pm\b/g, '±'],
  [/\\times\b/g, '×'],
  [/\\cdot\b/g, '·'],
  [/\\leq\b/g, '≤'],
  [/\\geq\b/g, '≥'],
  [/\\neq\b/g, '≠'],
  [/\\approx\b/g, '≈'],
  [/\\sqrt\b/g, '√'],
  [/\\int\b/g, '∫'],
  [/\\sum\b/g, 'Σ'],
  [/\\prod\b/g, 'Π'],
];

function wrapBareLatexCommands(text: string): string {
  // Wrap bare LaTeX commands like \frac{a}{b} that aren't inside $...$
  return text.replace(
    /(?<!\$)(?<!\\)(\\(?:frac|sqrt|int|sum|prod|lim|log|ln|sin|cos|tan|vec|hat|bar|dot|ddot|overline|underline|mathbf|mathrm|left|right|binom)\s*(?:\{[^}]*\})+(?:\{[^}]*\})?)(?!\$)/g,
    '$$$1$$'
  );
}

function flowParagraphLines(text: string): string {
  if (!text) return '';
  // Split into paragraphs by double newlines
  const paragraphs = text.split(/\n\s*\n/);
  const unwrappedParas = paragraphs.map((para) => {
    const lines = para.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length <= 1) return para.trim();

    // If paragraph contains lists like (i), (1), •, 1., preserve them on new lines
    const result: string[] = [];
    for (const line of lines) {
      const isList = /^(?:\([0-9a-zA-ZivxLCDM]+\)|[0-9a-zA-ZivxLCDM]+\.|\-|\*|\•)\s+/.test(line);
      if (isList) {
        result.push('\n' + line);
      } else if (result.length > 0 && !result[result.length - 1].endsWith('\n')) {
        result[result.length - 1] += ' ' + line;
      } else {
        result.push(line);
      }
    }
    return result.join(' ').replace(/[ \t]+/g, ' ').trim();
  });

  return unwrappedParas.join('\n\n');
}

type Segment =
  | { type: 'text'; content: string }
  | { type: 'math'; content: string; display: boolean };

function splitSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  // Match $$...$$ (display math) or $...$ (inline math)
  const regex = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex, match.index),
      });
    }

    const raw = match[0];
    if (raw.startsWith('$$') && raw.endsWith('$$')) {
      segments.push({
        type: 'math',
        content: raw.slice(2, -2).trim(),
        display: true,
      });
    } else {
      segments.push({
        type: 'math',
        content: raw.slice(1, -1).trim(),
        display: false,
      });
    }
    lastIndex = match.index + raw.length;
  }

  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.slice(lastIndex),
    });
  }

  return segments;
}

function KatexSegment({ latex, display }: { latex: string; display: boolean }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        output: 'html',
        displayMode: display,
        strict: false,
        trust: false,
      });
    } catch {
      return null;
    }
  }, [latex, display]);

  if (!html) {
    return <code className="text-xs font-mono text-purple-600 dark:text-purple-300 font-bold">{latex}</code>;
  }

  return (
    <span
      className={display ? 'block my-2 text-center overflow-x-auto py-1' : 'katex-inline align-baseline mx-0.5'}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function ProseSegment({ text }: { text: string }) {
  let s = text;
  for (const [pattern, replacement] of INLINE_REPLACEMENTS) {
    s = s.replace(pattern, replacement);
  }
  return <>{s}</>;
}

interface MathTextProps {
  text?: string | null;
  className?: string;
  block?: boolean;
}

export function MathText({ text, className, block = false }: MathTextProps) {
  const segments = useMemo(() => {
    if (!text) return [];
    const unwrapped = flowParagraphLines(text);
    const withCommands = wrapBareLatexCommands(unwrapped);
    return splitSegments(withCommands);
  }, [text]);

  if (!text) return null;

  const Tag = block ? 'div' : 'span';

  return (
    <Tag className={className} style={block ? { whiteSpace: 'pre-line' } : undefined}>
      {segments.map((seg, i) => {
        if (seg.type === 'math') {
          return <KatexSegment key={i} latex={seg.content} display={seg.display} />;
        }
        return <ProseSegment key={i} text={seg.content} />;
      })}
    </Tag>
  );
}
