'use client';

import { useRef, useEffect } from 'react';
import { cn, countWords } from '@/lib/utils';
import { FileText, Save, CheckCircle2, Loader2 } from 'lucide-react';

interface AnswerEditorProps {
  value: string;
  onChange: (text: string) => void;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  disabled?: boolean;
  placeholder?: string;
}

export function AnswerEditor({
  value,
  onChange,
  saveStatus,
  disabled = false,
  placeholder = 'Write your answer here...',
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
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            'w-full min-h-[240px] p-4 md:p-5 rounded-xl border border-border bg-white',
            'text-base leading-relaxed resize-none',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400',
            'transition-all duration-200',
            'placeholder:text-stone-400',
            disabled && 'opacity-60 cursor-not-allowed bg-stone-50',
          )}
          aria-label="Answer editor"
        />
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
