'use client';

/**
 * MathText — KaTeX-powered math and aligned typography renderer.
 * Safely renders:
 *   - Inline math: $ ... $
 *   - Display / Block math: $$ ... $$
 *   - Bare LaTeX formulas (e.g. \frac{...}{...})
 *   - Natural flowing prose paragraphs with preserved lists and line structures
 */

import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Replacements for standalone prose outside math delimiters
const PROSE_REPLACEMENTS: [RegExp, string][] = [
  [/\\mu\b/g, 'μ'],
  [/\\varepsilon\b/g, 'ε'],
  [/\\implies\b/g, '⟹'],
  [/\\Rightarrow\b/g, '⇒'],
  [/\\rightarrow\b/g, '→'],
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
];

function flowParagraphLines(text: string): string {
  if (!text) return '';
  const paragraphs = text.split(/\n\s*\n/);
  const unwrappedParas = paragraphs.map((para) => {
    const lines = para.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length <= 1) return para.trim();

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
  if (!text) return [];
  const trimmed = text.trim();

  // 1. Entire text is display math $$...$$
  if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length >= 4) {
    return [{ type: 'math', content: trimmed.slice(2, -2).trim(), display: true }];
  }
  // 2. Entire text is inline math $...$
  if (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.length >= 2) {
    return [{ type: 'math', content: trimmed.slice(1, -1).trim(), display: false }];
  }

  // 3. Entire text is a bare LaTeX formula (common in math options)
  if (/^\s*\\[a-zA-Z]+/.test(trimmed) && !trimmed.includes('\n\n')) {
    try {
      katex.renderToString(trimmed, { throwOnError: true });
      return [{ type: 'math', content: trimmed, display: false }];
    } catch {
      // not a single formula, continue to segment splitting
    }
  }

  // 4. Split mixed prose by $$...$$ and $...$
  const segments: Segment[] = [];
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
  for (const [pattern, replacement] of PROSE_REPLACEMENTS) {
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
    const formatted = flowParagraphLines(text);
    return splitSegments(formatted);
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
