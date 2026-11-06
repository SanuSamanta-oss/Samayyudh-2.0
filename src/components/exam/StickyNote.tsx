'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  StickyNote as StickyNoteIcon,
  X,
  ChevronDown,
  Pin,
  Check,
  Loader2,
  CloudOff,
  Minus,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import type { StickyNoteColor } from '@/types';

export interface StickyNoteProps {
  content: string;
  onChange: (content: string) => void;
  onPin?: (content: string, color: StickyNoteColor) => void;
  questionNumber?: number;
  questionSubject?: string;
  questionId?: string;
  color?: StickyNoteColor;
  onColorChange?: (color: StickyNoteColor) => void;
  isPinned?: boolean;
  onTogglePin?: () => void;
  saveStatus?: 'saved' | 'saving' | 'offline' | 'idle';
}

export interface NoteColorConfig {
  id: StickyNoteColor;
  label: string;
  bg: string;
  swatch: string;
  border: string;
  text: string;
  line: string;
  // Modern theme classes
  cardClass: string;
  badgeClass: string;
  accent: string;
}

export const NOTE_COLORS: NoteColorConfig[] = [
  {
    id: 'yellow',
    label: 'Amber Gold',
    bg: '#FEF9C3',
    swatch: 'bg-amber-400',
    border: 'rgba(217,119,6,0.3)',
    text: '#78350F',
    line: 'rgba(217,119,6,0.18)',
    cardClass: 'bg-amber-50/95 dark:bg-[#201A10] border-amber-200 dark:border-amber-800/70 text-amber-950 dark:text-amber-100',
    badgeClass: 'bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200',
    accent: '#F59E0B',
  },
  {
    id: 'seagreen',
    label: 'Mint Emerald',
    bg: '#D1FAE5',
    swatch: 'bg-emerald-400',
    border: 'rgba(5,150,105,0.3)',
    text: '#064E3B',
    line: 'rgba(5,150,105,0.18)',
    cardClass: 'bg-emerald-50/95 dark:bg-[#0D2218] border-emerald-200 dark:border-emerald-800/70 text-emerald-950 dark:text-emerald-100',
    badgeClass: 'bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200',
    accent: '#10B981',
  },
  {
    id: 'blue',
    label: 'Azure Sky',
    bg: '#E0F2FE',
    swatch: 'bg-sky-400',
    border: 'rgba(2,132,199,0.3)',
    text: '#0C4A6E',
    line: 'rgba(2,132,199,0.18)',
    cardClass: 'bg-sky-50/95 dark:bg-[#0B1E2E] border-sky-200 dark:border-sky-800/70 text-sky-950 dark:text-sky-100',
    badgeClass: 'bg-sky-200/80 dark:bg-sky-900/80 text-sky-900 dark:text-sky-200',
    accent: '#0284C7',
  },
  {
    id: 'purple',
    label: 'Soft Violet',
    bg: '#EDE9FE',
    swatch: 'bg-violet-400',
    border: 'rgba(124,58,237,0.3)',
    text: '#4C1D95',
    line: 'rgba(124,58,237,0.18)',
    cardClass: 'bg-violet-50/95 dark:bg-[#1C142E] border-violet-200 dark:border-violet-800/70 text-violet-950 dark:text-violet-100',
    badgeClass: 'bg-violet-200/80 dark:bg-violet-900/80 text-violet-900 dark:text-violet-200',
    accent: '#8B5CF6',
  },
  {
    id: 'rose',
    label: 'Blush Coral',
    bg: '#FFE4E6',
    swatch: 'bg-rose-400',
    border: 'rgba(225,29,72,0.3)',
    text: '#881337',
    line: 'rgba(225,29,72,0.18)',
    cardClass: 'bg-rose-50/95 dark:bg-[#281119] border-rose-200 dark:border-rose-800/70 text-rose-950 dark:text-rose-100',
    badgeClass: 'bg-rose-200/80 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200',
    accent: '#F43F5E',
  },
  {
    id: 'orange',
    label: 'Warm Peach',
    bg: '#FFEDD5',
    swatch: 'bg-orange-400',
    border: 'rgba(234,88,12,0.3)',
    text: '#7C2D12',
    line: 'rgba(234,88,12,0.18)',
    cardClass: 'bg-orange-50/95 dark:bg-[#27140B] border-orange-200 dark:border-orange-800/70 text-orange-950 dark:text-orange-100',
    badgeClass: 'bg-orange-200/80 dark:bg-orange-900/80 text-orange-900 dark:text-orange-200',
    accent: '#EA580C',
  },
  {
    id: 'white',
    label: 'Slate Neutral',
    bg: '#FFFFFF',
    swatch: 'bg-slate-200 dark:bg-slate-700',
    border: 'rgba(100,116,139,0.3)',
    text: '#0F172A',
    line: 'rgba(100,116,139,0.12)',
    cardClass: 'bg-white/95 dark:bg-[#162032] border-slate-200 dark:border-[#283852] text-slate-900 dark:text-slate-100',
    badgeClass: 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
    accent: '#64748B',
  },
];

export function getColorConfig(id?: StickyNoteColor): NoteColorConfig {
  if (!id) return NOTE_COLORS[0];
  return NOTE_COLORS.find((c) => c.id === id) ?? NOTE_COLORS[0];
}

export function StickyNote({
  content,
  onChange,
  onPin,
  questionNumber,
  questionSubject,
  color: initialColor,
  onColorChange,
  isPinned = false,
  onTogglePin,
  saveStatus: initialSaveStatus = 'idle',
}: StickyNoteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [color, setColor] = useState<StickyNoteColor>(initialColor || 'yellow');
  const [localContent, setLocalContent] = useState(content);
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'offline' | 'idle'>(initialSaveStatus);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external content changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  useEffect(() => {
    if (initialColor && initialColor !== color) {
      setColor(initialColor);
    }
  }, [initialColor]);

  const cfg = getColorConfig(color);

  // Handle outside click to close (desktop only)
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(260, Math.max(90, textareaRef.current.scrollHeight))}px`;
    }
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      adjustHeight();
    }
  }, [isOpen, isMinimized, localContent, adjustHeight]);

  // Debounced autosave
  const handleContentChange = (val: string) => {
    setLocalContent(val);
    setSaveState('saving');

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      onChange(val);
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    }, 400);
  };

  const handleColorSelect = (newColor: StickyNoteColor) => {
    setColor(newColor);
    onColorChange?.(newColor);
    setShowColorPicker(false);
  };

  const handlePinAction = () => {
    if (!localContent.trim()) return;
    if (onTogglePin) {
      onTogglePin();
    } else if (onPin) {
      onPin(localContent, color);
      setIsOpen(false);
    }
  };

  const hasNotes = Boolean(content && content.trim().length > 0);

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMinimized(false);
        }}
        className={cn(
          'group flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border',
          isOpen
            ? 'bg-amber-100/90 dark:bg-amber-950/80 border-amber-400 dark:border-amber-600 text-amber-900 dark:text-amber-100 shadow-sm'
            : hasNotes
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/80 text-amber-800 dark:text-amber-200 hover:bg-amber-100/80 dark:hover:bg-amber-900/60 shadow-2xs'
            : 'bg-card border-border text-foreground hover:bg-stone-50 dark:hover:bg-slate-800/60'
        )}
        aria-label="Toggle Question Sticky Note"
        aria-expanded={isOpen}
      >
        <StickyNoteIcon className={cn('w-4 h-4 transition-transform group-hover:scale-110', hasNotes ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400 dark:text-slate-400')} />
        <span className="hidden sm:inline">Note</span>
        {hasNotes && (
          <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-[#162032] shrink-0 animate-pulse" />
        )}
        {isPinned && (
          <Pin className="w-3 h-3 text-amber-600 dark:text-amber-400 rotate-45 shrink-0" />
        )}
        <ChevronDown className={cn('w-3.5 h-3.5 text-stone-400 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      {/* Floating Modern Note Editor */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 sm:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: 'spring', damping: 26, stiffness: 340 }}
              className={cn(
                // Mobile: modern bottom drawer
                'fixed inset-x-2 bottom-3 max-h-[85vh] z-50 rounded-2xl sm:rounded-2xl overflow-hidden shadow-2xl',
                // Desktop: floating positioned panel
                'sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2.5 sm:w-88 md:w-96',
                // Background & theme styling
                cfg.cardClass,
                'border-2 backdrop-blur-md'
              )}
              role="dialog"
              aria-label="Private Question Annotation"
            >
              {/* Header Bar */}
              <div
                className="px-3.5 py-2.5 flex items-center justify-between gap-2 border-b select-none"
                style={{ borderColor: cfg.line }}
              >
                {/* Left: Question Badge */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className={cn('w-2 h-2 rounded-full', cfg.swatch)} />
                  <span className="font-extrabold text-xs tracking-tight truncate">
                    {questionNumber !== undefined ? `Q${questionNumber}` : 'Question Note'}
                  </span>
                  {questionSubject && (
                    <span className="text-[10px] opacity-60 uppercase font-semibold tracking-wider truncate max-w-[90px]">
                      {questionSubject}
                    </span>
                  )}
                </div>

                {/* Center: Autosave Status Pill */}
                <div className="flex items-center gap-1.5 text-[10px] font-medium opacity-75">
                  {saveState === 'saving' && (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                      <span>Saving...</span>
                    </>
                  )}
                  {saveState === 'saved' && (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Saved</span>
                    </>
                  )}
                  {saveState === 'offline' && (
                    <>
                      <CloudOff className="w-3 h-3 text-stone-400" />
                      <span>Offline</span>
                    </>
                  )}
                  {saveState === 'idle' && (
                    <span className="opacity-50">Autosave</span>
                  )}
                </div>

                {/* Right: Window Controls */}
                <div className="flex items-center gap-1">
                  {/* Minimize */}
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors opacity-70 hover:opacity-100"
                    title={isMinimized ? 'Expand' : 'Minimize'}
                  >
                    {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                  </button>

                  {/* Close */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors opacity-70 hover:opacity-100"
                    title="Close"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Collapsible Content Area */}
              {!isMinimized && (
                <div className="p-3.5 space-y-3">
                  {/* Color Palette Pill Selector */}
                  <div className="flex items-center justify-between gap-1.5 pt-0.5">
                    <span className="text-[11px] font-semibold opacity-70">Color:</span>
                    <div className="flex items-center gap-1.5">
                      {NOTE_COLORS.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleColorSelect(c.id)}
                          className={cn(
                            'w-4 h-4 rounded-full transition-transform hover:scale-125 cursor-pointer relative',
                            c.swatch,
                            color === c.id && 'ring-2 ring-offset-1 ring-stone-900 dark:ring-white scale-110 shadow-xs'
                          )}
                          title={c.label}
                          aria-label={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Clean Writing Canvas */}
                  <div className="relative rounded-xl overflow-hidden bg-white/40 dark:bg-black/20 p-2.5 border border-black/5 dark:border-white/5">
                    <textarea
                      ref={textareaRef}
                      value={localContent}
                      onChange={(e) => handleContentChange(e.target.value)}
                      placeholder="Jot down concepts, key formulas, elimination clues, or thoughts..."
                      rows={4}
                      className="w-full bg-transparent text-sm sm:text-base leading-relaxed focus:outline-none resize-none font-sans"
                      style={{ color: 'inherit' }}
                      autoFocus
                    />
                  </div>

                  {/* Footer & Action Bar */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-black/5 dark:border-white/5">
                    <div className="text-[10px] opacity-60">
                      {localContent.trim() ? `${localContent.trim().split(/\s+/).length} words` : 'Private note'}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePinAction}
                        disabled={!localContent.trim()}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs',
                          isPinned
                            ? 'bg-amber-600 text-white hover:bg-amber-700'
                            : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-inherit',
                          !localContent.trim() && 'opacity-40 cursor-not-allowed'
                        )}
                        title={isPinned ? 'Unpin from Board' : 'Pin to Notes Board'}
                      >
                        <Pin className={cn('w-3 h-3', isPinned && 'rotate-45')} />
                        <span>{isPinned ? 'Pinned' : 'Pin to Board'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-center opacity-50 italic">
                    Notes are private annotations and not submitted for grading.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
