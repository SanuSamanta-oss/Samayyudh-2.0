'use client';

/**
 * MathText — KaTeX-powered math renderer for PYQ questions.
 *
 * The PDF extractor produces text that mixes plain prose with:
 *   • Raw LaTeX commands:  \mu  \varepsilon  \int  \times
 *   • Fragmented fractions: numerator on one line, denominator on the next
 *   • Stray parentheses and equals signs from formula layout
 *
 * This component:
 *   1. Normalises the raw text into clean LaTeX where possible
 *   2. Splits the string into prose segments and math segments
 *   3. Renders math segments with KaTeX inline and falls back to plain text
 */

import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — Text normalisation
// ─────────────────────────────────────────────────────────────────────────────

/** Known single-symbol LaTeX → Unicode substitutions for inline prose */
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

/**
 * Heuristic: detect lines that look like they are part of a fraction layout —
 * a short number / expression on one line, then another short expression below.
 * Convert    "a\nb"   →   "$\frac{a}{b}$"   when both parts are math-like.
 */
function reconstructFractions(text: string): string {
  // Pattern: line1 (short, math-like) \n line2 (short, math-like) near operators
  // We look for lines that are ONLY a number or simple expression (≤ 8 chars)
  const lines = text.split('\n');
  const result: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const cur = lines[i].trim();
    const next = lines[i + 1]?.trim() ?? '';

    const isMathLike = (s: string) =>
      s.length > 0 &&
      s.length <= 12 &&
      /^[\d\w\s\+\-\*\/\^\(\)\[\]\\,\.\|]+$/.test(s) &&
      /\d/.test(s);

    // Heuristic: both lines are short and math-like → treat as fraction
    if (isMathLike(cur) && isMathLike(next)) {
      result.push(`$\\frac{${cur}}{${next}}$`);
      i += 2;
    } else {
      result.push(lines[i]);
      i++;
    }
  }
  return result.join('\n');
}

/**
 * Wraps isolated LaTeX command sequences in $...$ so KaTeX can render them.
 * Skips sequences that are already inside $...$.
 */
function wrapLatexCommands(text: string): string {
  // Match \command optionally followed by {...} that are NOT already inside $ $
  return text.replace(
    /(?<!\$)(\\(?:frac|sqrt|int|sum|prod|lim|log|ln|sin|cos|tan|vec|hat|bar|dot|ddot|overline|underline|mathbf|mathrm|left|right|binom|begin|end)\s*(?:\{[^}]*\})*(?:\{[^}]*\})?)/g,
    (match) => `$${match.trim()}$`
  );
}

/**
 * Master normaliser — runs all heuristics in order.
 */
function normalise(raw: string): string {
  let s = raw;

  // 1. Collapse 3+ blank lines
  s = s.replace(/\n{3,}/g, '\n\n');

  // 2. Reconstruct fragmented fractions
  s = reconstructFractions(s);

  // 3. Wrap isolated LaTeX commands
  s = wrapLatexCommands(s);

  return s.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Segment splitting  (prose vs. inline math)
// ─────────────────────────────────────────────────────────────────────────────

type Segment = { type: 'text'; content: string } | { type: 'math'; content: string };

function splitSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  // Match $...$ (not $$) — inline math
  const pattern = /\$([^$]+)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) {
      segments.push({ type: 'text', content: text.slice(last, m.index) });
    }
    segments.push({ type: 'math', content: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    segments.push({ type: 'text', content: text.slice(last) });
  }
  return segments;
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 3 — Render a single math segment with KaTeX
// ─────────────────────────────────────────────────────────────────────────────

function KatexInline({ latex }: { latex: string }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        output: 'html',
        displayMode: false,
        strict: false,
        trust: false,
      });
    } catch {
      return null;
    }
  }, [latex]);

  if (!html) {
    // Fallback: show raw latex in a code-style span
    return <code className="text-xs font-mono text-purple-700 dark:text-purple-300">{latex}</code>;
  }

  return (
    <span
      className="katex-inline align-middle"
      // KaTeX HTML is safe — it is generated server-side from our own data
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 4 — Render a prose segment (apply inline symbol substitutions)
// ─────────────────────────────────────────────────────────────────────────────

function renderProseSegment(raw: string): string {
  let s = raw;
  for (const [pattern, replacement] of INLINE_REPLACEMENTS) {
    s = s.replace(pattern, replacement);
  }
  return s;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public component
// ─────────────────────────────────────────────────────────────────────────────

interface MathTextProps {
  text: string;
  /** Tailwind className applied to the outer <span> */
  className?: string;
  /** When true the text is rendered block-level (whitespace-pre-line) */
  block?: boolean;
}

export function MathText({ text, className, block = false }: MathTextProps) {
  const segments = useMemo(() => {
    const normalised = normalise(text);
    return splitSegments(normalised);
  }, [text]);

  const Tag = block ? 'p' : 'span';

  return (
    <Tag
      className={className}
      style={block ? { whiteSpace: 'pre-line' } : undefined}
    >
      {segments.map((seg, i) => {
        if (seg.type === 'math') {
          return <KatexInline key={i} latex={seg.content} />;
        }
        return (
          <React.Fragment key={i}>
            {renderProseSegment(seg.content)}
          </React.Fragment>
        );
      })}
    </Tag>
  );
}
