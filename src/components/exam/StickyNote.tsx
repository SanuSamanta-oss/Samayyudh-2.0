'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { StickyNote as StickyNoteIcon, X, ChevronDown, ChevronUp } from 'lucide-react';

interface StickyNoteProps {
  content: string;
  onChange: (content: string) => void;
}

export function StickyNote({ content, onChange }: StickyNoteProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
          'border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100',
          content && 'bg-amber-100'
        )}
        aria-label="Toggle sticky note"
      >
        <StickyNoteIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Note</span>
        {content && <span className="w-2 h-2 rounded-full bg-amber-500" />}
        {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-72 sm:w-80 bg-amber-50 border border-amber-200 rounded-xl shadow-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
              <StickyNoteIcon className="w-3.5 h-3.5" />
              Private Note
            </span>
            <button onClick={() => setIsOpen(false)} className="text-amber-600 hover:text-amber-800">
              <X className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Jot down ideas, reminders, concepts..."
            className="w-full h-24 p-2.5 text-sm rounded-lg border border-amber-200 bg-white/80 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/30 placeholder:text-amber-400"
          />
          <p className="text-[10px] text-amber-500">Not included in AI grading</p>
        </div>
      )}
    </div>
  );
}
