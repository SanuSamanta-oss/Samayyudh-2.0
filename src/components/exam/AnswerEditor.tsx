'use client';

import { useRef, useEffect } from 'react';
import { cn, countWords } from '@/lib/utils';
import { FileText, Save, CheckCircle2, Loader2 } from 'lucide-react';
import { MathText } from '@/components/pyq/MathText';

import type { QuestionOption } from '@/types';

interface AnswerEditorProps {
  value: string;
  onChange: (text: string) => void;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  disabled?: boolean;
  placeholder?: string;
  options?: QuestionOption[];
}

export function AnswerEditor({
  value,
  onChange,
  saveStatus,
  disabled = false,
  placeholder = 'Write your answer here...',
  options,
}: AnswerEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const words = countWords(value);
  const chars = value.length;

  // Auto-resize
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.max(240, el.scrollHeight)}px`;
    }
  }, [value]);

  return (
    <div className="space-y-2">
      {/* Editor */}
      <div className="relative">
        {options && options.length > 0 ? (
          <div className="flex flex-col gap-3.5 pt-2">
            {options.map((opt) => (
              <label
                key={opt.id}
                className={cn(
                  'flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all',
                  value === opt.id
                    ? 'border-purple-600 bg-purple-50/90 dark:border-purple-500 dark:bg-purple-950/70 shadow-sm'
                    : 'border-stone-200/90 dark:border-[#2A3F68] bg-white dark:bg-[#18253E] hover:border-purple-400 dark:hover:border-purple-400 hover:bg-purple-50/30 dark:hover:bg-[#1F3050] text-stone-900 dark:text-white shadow-xs',
                  disabled && 'opacity-60 cursor-not-allowed'
                )}
              >
                <input
                  type="radio"
                  name="mcq-option"
                  value={opt.id}
                  checked={value === opt.id}
                  onChange={() => onChange(opt.id)}
                  disabled={disabled}
                  className="sr-only"
                />
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-base shrink-0 border transition-transform',
                    value === opt.id
                      ? 'border-purple-600 bg-purple-600 text-white shadow-xs scale-105'
                      : 'border-purple-200 dark:border-purple-600 bg-purple-100 dark:bg-purple-900/80 text-purple-900 dark:text-purple-100'
                  )}
                >
                  {opt.id.replace('opt_', '').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <MathText
                    text={opt.text}
                    className="text-base sm:text-lg font-medium text-stone-900 dark:text-white leading-relaxed"
                  />
                </div>
              </label>
            ))}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              'w-full min-h-[240px] p-4 md:p-5 rounded-xl border border-border bg-card',
              'text-base leading-relaxed resize-none',
              'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400',
              'transition-all duration-200',
              'placeholder:text-stone-400',
              disabled && 'opacity-60 cursor-not-allowed bg-stone-50',
            )}
            aria-label="Answer editor"
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            {words} {words === 1 ? 'word' : 'words'}
          </span>
          <span>{chars} {chars === 1 ? 'character' : 'characters'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600">Saved</span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <Save className="w-3.5 h-3.5 text-red-500" />
              <span className="text-red-600">Save failed — local copy safe</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
