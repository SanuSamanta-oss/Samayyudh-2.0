'use client';

// ============================================================
// SamayYudh 2.0 — SOKHA Markdown & Code Formatter
// Renders code blocks, tables, formulas, lists, and citations.
// ============================================================

import React, { useState } from 'react';
import { Check, Copy, ExternalLink, Globe } from 'lucide-react';
import type { SokhaSource } from '@/lib/sokha/types';

interface SokhaMarkdownProps {
  content: string;
  sources?: SokhaSource[];
}

export function SokhaMarkdown({ content, sources }: SokhaMarkdownProps) {
  // Parse text into code blocks and normal markdown segments
  const segments = parseContent(content);

  return (
    <div className="space-y-3 text-sm text-stone-800 leading-relaxed break-words">
      {segments.map((seg, idx) => {
        if (seg.type === 'code') {
          return <CodeBlock key={idx} language={seg.language} code={seg.code} />;
        }
        return <MarkdownSegment key={idx} text={seg.text} />;
      })}

      {/* Grounding Source Citations */}
      {sources && sources.length > 0 && (
        <div className="mt-4 pt-3 border-t border-black/[0.06]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Verified Educational Sources & Citations</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sources.map((src, sIdx) => (
              <a
                key={sIdx}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-purple-50 hover:bg-purple-100/90 ring-1 ring-purple-200/60 text-purple-700 transition-all shadow-xs"
              >
                <span className="font-medium truncate max-w-[200px]">{src.title}</span>
                <span className="text-[10px] text-purple-500 uppercase">({src.domain})</span>
                <ExternalLink className="w-3 h-3 text-purple-600 opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CodeBlock({ language, code }: { language?: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-stone-800 bg-[#0c101d] shadow-md">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#070b14] border-b border-stone-800 text-xs text-stone-400">
        <span className="font-mono text-[11px] font-semibold text-purple-300 uppercase tracking-wider">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] hover:text-white hover:bg-white/10 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-xs font-mono text-purple-50/90 leading-normal">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function MarkdownSegment({ text }: { text: string }) {
  const lines = text.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lIdx} className="h-1.5" />;

        // Header 3 / 2 / 1
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={lIdx} className="text-sm font-bold text-purple-900 mt-2 mb-1">
              {formatInline(trimmed.slice(4))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={lIdx} className="text-base font-bold text-stone-900 mt-3 mb-1 border-b border-black/[0.06] pb-1">
              {formatInline(trimmed.slice(3))}
            </h3>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={lIdx} className="text-lg font-extrabold text-stone-900 mt-3 mb-1">
              {formatInline(trimmed.slice(2))}
            </h2>
          );
        }

        // Unordered List item
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={lIdx} className="flex items-start gap-2 pl-2">
              <span className="text-purple-600 mt-1 text-xs">•</span>
              <span className="flex-1 text-stone-800">{formatInline(trimmed.slice(2))}</span>
            </div>
          );
        }

        // Numbered List item
        const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
        if (numMatch) {
          return (
            <div key={lIdx} className="flex items-start gap-2 pl-2">
              <span className="text-purple-600 font-semibold text-xs mt-0.5">{numMatch[1]}.</span>
              <span className="flex-1 text-stone-800">{formatInline(numMatch[2])}</span>
            </div>
          );
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote
              key={lIdx}
              className="border-l-2 border-purple-500 pl-3 py-1 text-xs italic text-stone-700 bg-purple-50/70 rounded-r-lg"
            >
              {formatInline(trimmed.slice(2))}
            </blockquote>
          );
        }

        return <p key={lIdx} className="text-stone-800">{formatInline(line)}</p>;
      })}
    </div>
  );
}

/**
 * Format inline elements: **bold**, *italic*, `code`, and equations.
 */
function formatInline(text: string): React.ReactNode[] {
  // Regex splitting by backticks, bold, italic
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.substring(lastIdx, match.index));
    }

    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 mx-0.5 text-xs font-mono rounded bg-purple-100/70 ring-1 ring-purple-200/50 text-purple-800 font-semibold"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-stone-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-stone-700">
          {token.slice(1, -1)}
        </em>
      );
    }

    lastIdx = match.index + token.length;
  }

  if (lastIdx < text.length) {
    parts.push(text.substring(lastIdx));
  }

  return parts;
}

interface ParsedSegment {
  type: 'text' | 'code';
  text: string;
  code: string;
  language?: string;
}

function parseContent(raw: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        text: raw.substring(lastIndex, match.index),
        code: '',
      });
    }

    segments.push({
      type: 'code',
      text: '',
      language: match[1] || 'plaintext',
      code: match[2],
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < raw.length) {
    segments.push({
      type: 'text',
      text: raw.substring(lastIndex),
      code: '',
    });
  }

  return segments;
}
