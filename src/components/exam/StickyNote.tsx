'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { StickyNote as StickyNoteIcon, X, ChevronDown, Pin } from 'lucide-react';
import type { StickyNoteColor } from '@/types';

interface StickyNoteProps {
  content: string;
  onChange: (content: string) => void;
  onPin?: (content: string, color: StickyNoteColor) => void;
}

export const NOTE_COLORS: {
  id: StickyNoteColor;
  label: string;
  bg: string;
  swatch: string;
  border: string;
  text: string;
  line: string;
}[] = [
  {
    id: 'yellow',
    label: 'Yellow',
    bg: '#fef3c7',
    swatch: 'bg-yellow-300',
    border: 'rgba(0,0,0,0.18)',
    text: '#3b2800',
    line: 'rgba(180,140,60,0.22)',
  },
  {
    id: 'orange',
    label: 'Orange',
    bg: '#ffedd5',
    swatch: 'bg-orange-300',
    border: 'rgba(0,0,0,0.18)',
    text: '#431407',
    line: 'rgba(200,100,40,0.2)',
  },
  {
    id: 'seagreen',
    label: 'Sea Green',
    bg: '#d1fae5',
    swatch: 'bg-emerald-300',
    border: 'rgba(0,0,0,0.16)',
    text: '#064e3b',
    line: 'rgba(16,120,80,0.18)',
  },
  {
    id: 'white',
    label: 'White',
    bg: '#ffffff',
    swatch: 'bg-white border border-stone-300',
    border: 'rgba(0,0,0,0.15)',
    text: '#1c1917',
    line: 'rgba(0,0,0,0.08)',
  },
];

export function getColorConfig(id: StickyNoteColor) {
  return NOTE_COLORS.find((c) => c.id === id) ?? NOTE_COLORS[0];
}

export function StickyNote({ content, onChange, onPin }: StickyNoteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState<StickyNoteColor>('yellow');
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cfg = getColorConfig(color);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  function handlePin() {
    if (!content.trim()) return;
    onPin?.(content, color);
    onChange('');
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
          'border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100',
          isOpen && 'bg-amber-100 border-amber-400',
          content && 'ring-1 ring-amber-400/50'
        )}
        aria-label="Toggle sticky note"
        aria-expanded={isOpen}
      >
        <StickyNoteIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Note</span>
        {content && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />}
        <ChevronDown className={cn('w-3 h-3 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-3 z-50 w-72 sm:w-80 origin-top-right"
          role="dialog"
          aria-label="Private note"
        >
          <div className="flex justify-center -mb-px relative z-10 pointer-events-none">
            <div
              className="w-12 h-6 shadow-sm"
              style={{
                background: 'rgba(255,255,255,0.78)',
                border: '1px solid rgba(0,0,0,0.10)',
                clipPath: 'polygon(0% 10%,3% 0%,8% 8%,14% 1%,20% 9%,27% 2%,33% 10%,40% 0%,46% 8%,53% 1%,60% 9%,67% 2%,73% 10%,80% 0%,87% 8%,93% 1%,100% 10%,100% 90%,93% 100%,87% 92%,80% 100%,73% 91%,67% 100%,60% 91%,53% 100%,46% 92%,40% 100%,33% 91%,27% 100%,20% 91%,14% 100%,8% 92%,3% 100%,0% 90%)',
              }}
            />
          </div>

          <div
            className="rounded-lg overflow-hidden"
            style={{
              background: cfg.bg,
              border: `2px solid ${cfg.border}`,
              boxShadow: '4px 6px 18px rgba(0,0,0,0.18),0 1px 3px rgba(0,0,0,0.10)',
            }}
          >
            <div
              className="flex items-center justify-between px-3 pt-2.5 pb-1"
              style={{ borderBottom: `1px solid ${cfg.line}` }}
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: cfg.text }}>
                <StickyNoteIcon className="w-3.5 h-3.5" />
                Private Note
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="transition-opacity hover:opacity-60 rounded p-0.5"
                style={{ color: cfg.text }}
                aria-label="Close note"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 px-3 pt-2.5 pb-1">
              {NOTE_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  className={cn(
                    'w-5 h-5 rounded-full transition-transform hover:scale-110',
                    c.swatch,
                    color === c.id && 'ring-2 ring-offset-1 ring-stone-600 scale-110'
                  )}
                  title={c.label}
                  aria-label={c.label + ' color'}
                />
              ))}
              <span className="ml-auto text-[10px] opacity-50" style={{ color: cfg.text }}>
                {cfg.label}
              </span>
            </div>

            <div className="relative px-3 pt-2 pb-1">
              <div
                className="absolute inset-x-3 top-2 bottom-1 pointer-events-none"
                aria-hidden
                style={{
                  backgroundImage: `repeating-linear-gradient(transparent,transparent 23px,${cfg.line} 23px,${cfg.line} 24px)`,
                  backgroundPositionY: '4px',
                }}
              />
              <textarea
                value={content}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Jot down ideas, reminders, concepts..."
                rows={5}
                className="relative w-full resize-none bg-transparent text-sm leading-6 py-1 focus:outline-none"
                style={{ lineHeight: '24px', fontFamily: 'inherit', color: cfg.text }}
                aria-label="Note content"
                autoFocus
              />
            </div>

            <div className="px-3 pb-2.5 pt-1 flex items-center justify-between gap-2">
              <p className="text-[10px] italic opacity-55" style={{ color: cfg.text }}>
                Not included in AI grading
              </p>
              {onPin && (
                <button
                  onClick={handlePin}
                  disabled={!content.trim()}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all',
                    'bg-black/10 hover:bg-black/18 disabled:opacity-35 disabled:cursor-not-allowed'
                  )}
                  style={{ color: cfg.text }}
                >
                  <Pin className="w-3 h-3" />
                  Pin to Board
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
