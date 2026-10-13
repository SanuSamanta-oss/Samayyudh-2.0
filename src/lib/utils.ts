import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format seconds into MM:SS display
 */
export function formatTime(totalSeconds: number): string {
  const isNegative = totalSeconds < 0;
  const abs = Math.abs(Math.floor(totalSeconds));
  const hours = Math.floor(abs / 3600);
  const minutes = Math.floor((abs % 3600) / 60);
  const seconds = abs % 60;

  const prefix = isNegative ? '-' : '';
  
  if (hours > 0) {
    return `${prefix}${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${prefix}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Format seconds into a human-readable duration string
 */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${minutes}m`;
}

/**
 * Generate a UUID v4
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Count words in a text string
 */
export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get current ISO timestamp
 */
export function now(): string {
  return new Date().toISOString();
}

/**
 * Calculate percentage
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Formats math / LaTeX syntax into clean, human-readable text.
 * Safeguards question and option text so raw LaTeX markup is never shown to students.
 */
export function formatMathText(input?: string): string {
  if (!input) return '';

  let text = input;

  // 1. Specific brackets and escaped symbols
  text = text
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[')
    .replace(/\\right\]/g, ']')
    .replace(/\\left\|/g, '|')
    .replace(/\\right\|/g, '|')
    .replace(/\\%/g, '%');

  // 2. Ordinals: 5^{\text{th}} -> 5ᵗʰ
  text = text
    .replace(/(\d+)\^\{\\text\{th\}\}/g, '$1ᵗʰ')
    .replace(/(\d+)\^\{th\}/g, '$1ᵗʰ')
    .replace(/(\d+)\^\{\\text\{st\}\}/g, '$1ˢᵗ')
    .replace(/(\d+)\^\{st\}/g, '$1ˢᵗ')
    .replace(/(\d+)\^\{\\text\{nd\}\}/g, '$1ⁿᵈ')
    .replace(/(\d+)\^\{nd\}/g, '$1ⁿᵈ')
    .replace(/(\d+)\^\{\\text\{rd\}\}/g, '$1ʳᵈ')
    .replace(/(\d+)\^\{rd\}/g, '$1ʳᵈ');

  // 3. Degrees: ^{\circ}\text{C} or ^{\circ}C -> °C
  text = text
    .replace(/\^\{\\circ\}\s*(?:\\text\{C\}|C)/g, '°C')
    .replace(/\^\{\\circ\}\s*(?:\\text\{F\}|F)/g, '°F')
    .replace(/\\circ\b|\\degree\b/g, '°');

  // 4. Unwrap \text{...}, \mathrm{...}, \mathbf{...}, \mathit{...}, \operatorname{...}
  for (let i = 0; i < 5; i++) {
    text = text
      .replace(/\\text\{([^}]*)\}/g, '$1')
      .replace(/\\mathrm\{([^}]*)\}/g, '$1')
      .replace(/\\mathbf\{([^}]*)\}/g, '$1')
      .replace(/\\mathit\{([^}]*)\}/g, '$1')
      .replace(/\\operatorname\{([^}]*)\}/g, '$1');
  }

  // 5. Square roots before fractions
  text = text
    .replace(/\\sqrt\{([^}]+)\}/g, '√$1')
    .replace(/\\sqrt\s*([0-9a-zA-Z])/g, '√$1')
    .replace(/\\sqrt\b/g, '√');

  // 6. Common constants and fractions
  text = text
    .replace(/\\frac\{1\}\{4\\pi\\varepsilon_0\}/g, '1/(4πε₀)')
    .replace(/\\frac\{1\}\{4\\pi\\epsilon_0\}/g, '1/(4πε₀)')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\frac\{([^}]+)\}([0-9a-zA-Z])/g, '($1)/$2')
    .replace(/\\dfrac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\dfrac\{([^}]+)\}([0-9a-zA-Z])/g, '($1)/$2');

  // 7. Reactions & Arrows
  text = text
    .replace(/\\xrightarrow(?:\[([^\]]*)\])?\{([^}]+)\}/g, (_, below, above) =>
      `—[${below ? `${below}, ` : ''}${above}]→`
    )
    .replace(/\\rightleftharpoons\b/g, '⇌')
    .replace(/\\rightarrow\b|\\to\b/g, '→')
    .replace(/\\leftarrow\b/g, '←')
    .replace(/\\leftrightarrow\b/g, '↔');

  // 8. Boolean bars & vectors
  text = text
    .replace(/\\(?:overline|bar)\{([A-Za-z0-9])\}/g, '$1̄')
    .replace(/\\vec\{([A-Za-z0-9])\}/g, '$1');

  // 9. Underset
  text = text.replace(/\\underset\{[^}]*\}\{([^}]+)\}/g, '$1');

  // 10. Micro symbol
  text = text.replace(/\\mu/g, 'µ');

  // 11. Trigonometric & logarithmic functions
  text = text
    .replace(/\\sin(?![a-zA-Z])/g, 'sin')
    .replace(/\\cos(?![a-zA-Z])/g, 'cos')
    .replace(/\\tan(?![a-zA-Z])/g, 'tan')
    .replace(/\\log(?![a-zA-Z])/g, 'log')
    .replace(/\\ln(?![a-zA-Z])/g, 'ln');

  // 12. Symbols and Greek letters
  const symbolMap: [RegExp, string][] = [
    [/\\varepsilon_0|\\epsilon_0/g, 'ε₀'],
    [/\\varepsilon|\\epsilon/g, 'ε'],
    [/\\times(?![a-zA-Z])/g, '×'],
    [/\\pm(?![a-zA-Z])/g, '±'],
    [/\\mp(?![a-zA-Z])/g, '∓'],
    [/\\cdot(?![a-zA-Z])/g, '·'],
    [/\\gg(?![a-zA-Z])/g, '>>'],
    [/\\leq(?![a-zA-Z])|\\le(?![a-zA-Z])/g, '≤'],
    [/\\geq(?![a-zA-Z])|\\ge(?![a-zA-Z])/g, '≥'],
    [/\\neq(?![a-zA-Z])/g, '≠'],
    [/\\approx(?![a-zA-Z])/g, '≈'],
    [/\\propto(?![a-zA-Z])/g, '∝'],
    [/\\infty(?![a-zA-Z])/g, '∞'],
    [/\\pi(?![a-zA-Z])/g, 'π'],
    [/\\Pi(?![a-zA-Z])/g, 'Π'],
    [/\\lambda(?![a-zA-Z])/g, 'λ'],
    [/\\alpha(?![a-zA-Z])/g, 'α'],
    [/\\beta(?![a-zA-Z])/g, 'β'],
    [/\\gamma(?![a-zA-Z])/g, 'γ'],
    [/\\delta(?![a-zA-Z])/g, 'δ'],
    [/\\Delta(?![a-zA-Z])/g, 'Δ'],
    [/\\theta(?![a-zA-Z])/g, 'θ'],
    [/\\omega(?![a-zA-Z])/g, 'ω'],
    [/\\Omega(?![a-zA-Z])/g, 'Ω'],
    [/\\sigma(?![a-zA-Z])/g, 'σ'],
    [/\\Sigma(?![a-zA-Z])/g, 'Σ'],
    [/\\nu(?![a-zA-Z])/g, 'ν'],
    [/\\chi(?![a-zA-Z])/g, 'χ'],
    [/\\overset\{\\oplus\}\{C\}/g, 'C⁺'],
    [/\\overset\{\\ominus\}\{C\}/g, 'C⁻'],
    [/\\quad\b/g, ' '],
    [/\\qquad\b/g, '  '],
    [/\\ /g, ' '],
    [/\\\\/g, ' '],
    [/\\,/g, ' '],
    [/\\;/g, ' '],
    [/\\:/g, ' '],
    [/\\!/g, ''],
    [/\\text(?![a-zA-Z])/g, ''],
  ];

  for (const [pattern, replacement] of symbolMap) {
    text = text.replace(pattern, replacement);
  }

  // 13. Superscripts
  const supMap: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
    'n': 'ⁿ', 'i': 'ⁱ'
  };
  text = text.replace(/\^\{([0-9\+\-\(\)ni]+)\}/g, (_, chars) =>
    chars.split('').map((c: string) => supMap[c] || c).join('')
  );
  text = text.replace(/\^([0-9\+\-])/g, (_, c) => supMap[c] || c);

  // 14. Subscripts
  const subMap: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    '+': '₊', '-': '₋', '=': '₌', 'a': 'ₐ', 'e': 'ₑ',
    'o': 'ₒ', 'x': 'ₓ', 'h': 'ₕ', 'k': 'ₖ', 'l': 'ₗ',
    'm': 'ₘ', 'n': 'ₙ', 'p': 'ₚ', 's': 'ₛ', 't': 'ₜ'
  };
  text = text.replace(/_\{([0-9a-z\+\-]+)\}/g, (_, chars) =>
    chars.split('').map((c: string) => subMap[c] || c).join('')
  );
  text = text.replace(/_([0-9])/g, (_, c) => subMap[c] || c);

  // 15. Strip dollars
  text = text.replace(/\$\$/g, '').replace(/\$/g, '');

  // 16. Simplify fractions
  text = text.replace(/\(([0-9a-zA-Z√]+)\)\/\(+([0-9a-zA-Z]+)\)+/g, '$1/$2');
  text = text.replace(/\(+([0-9a-zA-Z]+)\)+\s*\/\s*\(+([^\)]+)\)+/g, '$1/($2)');

  // 17. Clean multiple spaces (preserve single newlines)
  const lines = text.split('\n').map((l) => l.replace(/[ \t]+/g, ' ').trim());
  return lines.join('\n').trim();
}

/**
 * Format option text, stripping redundant leading '(1) ', '1. ', etc.
 */
export function formatOptionText(text?: string): string {
  if (!text) return '';
  const cleaned = formatMathText(text);
  return cleaned
    .replace(/^\([1-4a-dA-D]\)\s+/, '')
    .replace(/^[1-4]\.\s+/, '')
    .trim();
}
