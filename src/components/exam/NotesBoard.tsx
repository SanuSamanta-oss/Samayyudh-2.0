'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Pin,
  Trash2,
  StickyNote as StickyNoteIcon,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  LayoutGrid,
  Move,
  Maximize2,
  Minimize2,
  Clock,
  Edit3,
  Filter,
  Sparkles,
} from 'lucide-react';
import type { BoardNote, StickyNoteColor } from '@/types';
import { getColorConfig, NOTE_COLORS } from './StickyNote';

export interface NotesBoardProps {
  notes: BoardNote[];
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: StickyNoteColor) => void;
  onPositionChange?: (id: string, x: number, y: number) => void;
  onSelectNote?: (note: BoardNote) => void;
  onTogglePin?: (id: string) => void;
  examTitle?: string;
}

export function NotesBoard({
  notes,
  onDelete,
  onColorChange,
  onPositionChange,
  onSelectNote,
  onTogglePin,
  examTitle,
}: NotesBoardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'canvas'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestionFilter, setSelectedQuestionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'question'>('newest');
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Extract unique questions that have notes
  const questionOptions = useMemo(() => {
    const set = new Set<number>();
    notes.forEach((n) => {
      set.add(n.question_number ?? n.question_index + 1);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [notes]);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesContent = note.content.toLowerCase().includes(q);
          const qNum = `q${note.question_number ?? note.question_index + 1}`;
          const matchesQ = qNum.includes(q);
          if (!matchesContent && !matchesQ) return false;
        }
        // Question number filter
        if (selectedQuestionFilter !== 'all') {
          const qNum = String(note.question_number ?? note.question_index + 1);
          if (qNum !== selectedQuestionFilter) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.updated_at || b.pinned_at).getTime() - new Date(a.updated_at || a.pinned_at).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.pinned_at).getTime() - new Date(b.pinned_at).getTime();
        }
        const qA = a.question_number ?? a.question_index + 1;
        const qB = b.question_number ?? b.question_index + 1;
        return qA - qB;
      });
  }, [notes, searchQuery, selectedQuestionFilter, sortBy]);

  // Subtle restrained tilt per card for realistic organic look
  const getRotation = (id: string) => {
    const tilts = [-0.8, 0.6, -0.4, 0.9, -0.7, 0.5];
    const charCode = id.charCodeAt(id.length - 1) || 0;
    return tilts[charCode % tilts.length];
  };

  return (
    <div className="mt-8 transition-all duration-300">
      {/* ── Outer Browser Window Container ────────────────────────── */}
      <div
        className={cn(
          'rounded-2xl border-2 transition-all duration-300 shadow-xl overflow-hidden',
          'bg-white dark:bg-[#0E1726] border-stone-200 dark:border-[#22334E]',
          isExpanded && 'fixed inset-4 sm:inset-8 z-50 flex flex-col shadow-2xl'
        )}
      >
        {/* ── 1. Modern Browser Window Header (Image 1 Inspiration) ── */}
        <div className="px-4 py-3 border-b border-stone-200 dark:border-[#22334E] bg-stone-100/90 dark:bg-[#142033] flex flex-wrap items-center justify-between gap-3 select-none">
          {/* Left: Window Traffic Light Dots + Title */}
          <div className="flex items-center gap-3">
            {/* macOS-style traffic light dots */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors shadow-2xs"
                title="Collapse / Close"
                aria-label="Close"
              />
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-500 transition-colors shadow-2xs"
                title="Minimize / Restore"
                aria-label="Minimize"
              />
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-2xs"
                title="Toggle Fullscreen"
                aria-label="Maximize"
              />
            </div>

            {/* Title & Note Count */}
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-white tracking-tight">
                Notes Board
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                {notes.length}
              </span>
              {examTitle && (
                <span className="hidden md:inline-block text-[11px] font-medium text-stone-500 dark:text-slate-400 truncate max-w-[200px]">
                  • {examTitle}
                </span>
              )}
            </div>
          </div>

          {/* Center: Search & Filter Address Bar */}
          <div className="flex-1 max-w-md min-w-[220px] order-last sm:order-none">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-stone-400 dark:text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes, questions, formulas..."
                className="w-full pl-8 pr-7 py-1.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all bg-white dark:bg-[#0B1320] border-stone-200 dark:border-[#283C5A] text-stone-900 dark:text-white placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 p-0.5 rounded hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Right: View & Filter Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Question filter pill */}
            {questionOptions.length > 0 && (
              <select
                value={selectedQuestionFilter}
                onChange={(e) => setSelectedQuestionFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold border bg-white dark:bg-[#0B1320] border-stone-200 dark:border-[#283C5A] text-stone-700 dark:text-stone-200 focus:outline-none cursor-pointer"
                aria-label="Filter by question"
              >
                <option value="all">All Questions</option>
                {questionOptions.map((q) => (
                  <option key={q} value={String(q)}>
                    Question Q{q}
                  </option>
                ))}
              </select>
            )}

            {/* Sort toggle */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold border bg-white dark:bg-[#0B1320] border-stone-200 dark:border-[#283C5A] text-stone-700 dark:text-stone-200 focus:outline-none cursor-pointer hidden md:inline-block"
              aria-label="Sort notes"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="question">Question Order</option>
            </select>

            {/* Layout Mode Toggle: Grid vs Canvas */}
            <div className="flex items-center rounded-lg border border-stone-200 dark:border-[#283C5A] p-0.5 bg-stone-50 dark:bg-[#0B1320]">
              <button
                onClick={() => setLayoutMode('grid')}
                className={cn(
                  'p-1 rounded-md transition-colors',
                  layoutMode === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-2xs'
                    : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                )}
                title="Grid Layout"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLayoutMode('canvas')}
                className={cn(
                  'p-1 rounded-md transition-colors',
                  layoutMode === 'canvas'
                    ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-2xs'
                    : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                )}
                title="Freeform Pinboard Canvas (Draggable)"
              >
                <Move className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Expand / Collapse Fullscreen */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg hover:bg-stone-200/60 dark:hover:bg-slate-800 transition-colors text-stone-500 dark:text-slate-400"
              title={isExpanded ? 'Restore Size' : 'Maximize Workspace'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Collapse toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg hover:bg-stone-200/60 dark:hover:bg-slate-800 transition-colors text-stone-500 dark:text-slate-400"
              title={collapsed ? 'Expand Board' : 'Collapse Board'}
            >
              {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ── 2. Working Canvas Body ──────────────────────────────── */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className={cn(
                'relative p-4 sm:p-6 overflow-y-auto transition-colors',
                // Digital workspace dot matrix background (replaces corkboard)
                'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]',
                isExpanded ? 'flex-1 min-h-[400px]' : 'min-h-[220px]'
              )}
              ref={canvasRef}
            >
              {filteredNotes.length === 0 ? (
                /* Empty state */
                <div className="py-12 sm:py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-xs">
                    <StickyNoteIcon className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                    {searchQuery ? 'No notes matched your search' : 'No notes pinned yet'}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {searchQuery
                      ? 'Try clearing the search query or changing question filters.'
                      : 'Capture quick formulas, key concept notes, or deduction ideas while attempting questions. Click the "Note" button on any question to add one.'}
                  </p>
                </div>
              ) : layoutMode === 'grid' ? (
                /* Responsive Organized Grid Layout */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredNotes.map((note) => (
                    <ModernNoteCard
                      key={note.id}
                      note={note}
                      rotation={getRotation(note.id)}
                      onDelete={() => onDelete(note.id)}
                      onColorChange={(c) => onColorChange(note.id, c)}
                      onSelect={() => onSelectNote?.(note)}
                      onTogglePin={() => onTogglePin?.(note.id)}
                    />
                  ))}
                </div>
              ) : (
                /* Freeform Draggable Canvas Layout */
                <div className="relative min-h-[460px] w-full">
                  <p className="text-[11px] text-stone-400 dark:text-slate-500 mb-3 flex items-center gap-1.5 italic">
                    <Move className="w-3.5 h-3.5" />
                    Drag and rearrange your notes freely across the board. Positions are automatically preserved.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredNotes.map((note) => (
                      <motion.div
                        key={note.id}
                        drag
                        dragConstraints={canvasRef}
                        dragElastic={0.08}
                        whileDrag={{
                          scale: 1.05,
                          zIndex: 50,
                          rotate: 0,
                          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        }}
                        onDragEnd={(_, info) => {
                          onPositionChange?.(note.id, info.point.x, info.point.y);
                        }}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <ModernNoteCard
                          note={note}
                          rotation={getRotation(note.id)}
                          onDelete={() => onDelete(note.id)}
                          onColorChange={(c) => onColorChange(note.id, c)}
                          onSelect={() => onSelectNote?.(note)}
                          onTogglePin={() => onTogglePin?.(note.id)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 3. Footer Privacy Reassurance ──────────────────────── */}
        {!collapsed && (
          <div className="px-4 py-2 border-t border-stone-200/80 dark:border-[#22334E] bg-stone-50/80 dark:bg-[#0B1320] flex items-center justify-between text-[11px] text-stone-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Private student annotations — preserved across sessions &amp; never included in grading.
            </span>
            <span>{filteredNotes.length} note{filteredNotes.length === 1 ? '' : 's'} shown</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Refined Modern Note Card
// ─────────────────────────────────────────────────────────────────────────────
function ModernNoteCard({
  note,
  rotation,
  onDelete,
  onColorChange,
  onSelect,
  onTogglePin,
}: {
  note: BoardNote;
  rotation: number;
  onDelete: () => void;
  onColorChange: (c: StickyNoteColor) => void;
  onSelect?: () => void;
  onTogglePin?: () => void;
}) {
  const [showPalette, setShowPalette] = useState(false);
  const cfg = getColorConfig(note.color);

  const questionNum = note.question_number ?? note.question_index + 1;
  const timeFormatted = new Date(note.updated_at || note.pinned_at).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className="group relative select-none"
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'top center',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <div
        className={cn(
          'rounded-2xl border-2 p-3.5 space-y-2.5 transition-all duration-200',
          'group-hover:scale-[1.02] group-hover:rotate-0 group-hover:shadow-xl shadow-md',
          cfg.cardClass
        )}
        onDoubleClick={onSelect}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between gap-1.5 border-b pb-2" style={{ borderColor: cfg.line }}>
          {/* Question Tag */}
          <div className="flex items-center gap-1.5">
            <span className={cn('text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-2xs', cfg.badgeClass)}>
              Q{questionNum}
            </span>
            <span className="text-[10px] opacity-60 font-medium">Question Note</span>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            {/* Pin Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin?.();
              }}
              className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors opacity-70 hover:opacity-100"
              title="Pin / Unpin Note"
            >
              <Pin className={cn('w-3.5 h-3.5', note.is_pinned !== false && 'rotate-45 text-amber-600 dark:text-amber-400')} />
            </button>

            {/* Color Swatch Picker Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPalette(!showPalette);
              }}
              className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors opacity-70 hover:opacity-100"
              title="Change Color"
            >
              <div className={cn('w-3.5 h-3.5 rounded-full border border-black/20', cfg.swatch)} />
            </button>

            {/* Delete */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 rounded-md hover:bg-red-500/10 text-rose-600 dark:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
              title="Remove Note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Color Palette Popover (when toggled) */}
        {showPalette && (
          <div
            className="flex items-center gap-1.5 py-1.5 px-2 rounded-xl bg-white/90 dark:bg-black/40 border border-black/10 dark:border-white/10 shadow-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {NOTE_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onColorChange(c.id);
                  setShowPalette(false);
                }}
                className={cn(
                  'w-4 h-4 rounded-full transition-transform hover:scale-125',
                  c.swatch,
                  note.color === c.id && 'ring-2 ring-stone-900 dark:ring-white scale-110 shadow-xs'
                )}
                title={c.label}
              />
            ))}
          </div>
        )}

        {/* Note Content */}
        <div className="min-h-[70px]">
          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words font-sans">
            {note.content}
          </p>
        </div>

        {/* Footer Details */}
        <div className="flex items-center justify-between pt-2 border-t text-[10px] opacity-60" style={{ borderColor: cfg.line }}>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeFormatted}
          </span>

          <button
            onClick={onSelect}
            className="inline-flex items-center gap-1 font-semibold hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
