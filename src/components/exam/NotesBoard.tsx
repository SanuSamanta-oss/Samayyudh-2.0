'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Pin, Trash2, StickyNote as StickyNoteIcon, ChevronDown, ChevronUp } from 'lucide-react';
import type { BoardNote, StickyNoteColor } from '@/types';
import { getColorConfig, NOTE_COLORS } from './StickyNote';

interface NotesBoardProps {
  notes: BoardNote[];
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: StickyNoteColor) => void;
}

/** Tiny tape strip rendered above each card */
function TapeStrip() {
  return (
    <div className="flex justify-center -mb-px relative z-10 pointer-events-none">
      <div
        className="w-10 h-5 shadow-sm"
        style={{
          background: 'rgba(255,255,255,0.75)',
          border: '1px solid rgba(0,0,0,0.10)',
          clipPath:
            'polygon(0% 10%,3% 0%,8% 8%,14% 1%,20% 9%,27% 2%,33% 10%,40% 0%,46% 8%,53% 1%,60% 9%,67% 2%,73% 10%,80% 0%,87% 8%,93% 1%,100% 10%,100% 90%,93% 100%,87% 92%,80% 100%,73% 91%,67% 100%,60% 91%,53% 100%,46% 92%,40% 100%,33% 91%,27% 100%,20% 91%,14% 100%,8% 92%,3% 100%,0% 90%)',
        }}
      />
    </div>
  );
}

function StickyCard({
  note,
  onDelete,
  onColorChange,
}: {
  note: BoardNote;
  onDelete: () => void;
  onColorChange: (color: StickyNoteColor) => void;
}) {
  const cfg = getColorConfig(note.color);
  const [showColors, setShowColors] = useState(false);

  // slight rotation per note for the "board" feel
  const rotations = [-1.8, 1.2, -0.6, 2.1, -1.2, 0.8];
  const rot = rotations[parseInt(note.id.slice(-1), 16) % rotations.length];

  return (
    <div
      className="group relative select-none"
      style={{ transform: `rotate(${rot}deg)`, transformOrigin: 'top center' }}
    >
      <TapeStrip />
      <div
        className="rounded-lg overflow-hidden transition-transform group-hover:scale-[1.02] group-hover:rotate-0 group-hover:shadow-2xl"
        style={{
          background: cfg.bg,
          border: `2px solid ${cfg.border}`,
          boxShadow: '3px 5px 14px rgba(0,0,0,0.15),0 1px 2px rgba(0,0,0,0.08)',
          minHeight: '140px',
          transition: 'all 0.25s ease',
        }}
      >
        {/* Card header */}
        <div
          className="flex items-center justify-between px-2.5 pt-2 pb-1"
          style={{ borderBottom: `1px solid ${cfg.line}` }}
        >
          <span className="text-[10px] font-semibold opacity-60" style={{ color: cfg.text }}>
            Q{note.question_index + 1}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Color picker toggle */}
            <button
              onClick={() => setShowColors((p) => !p)}
              className="p-1 rounded hover:bg-black/10 transition-colors"
              style={{ color: cfg.text }}
              title="Change color"
            >
              <div className="w-3 h-3 rounded-full" style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}` }} />
            </button>
            {/* Delete */}
            <button
              onClick={onDelete}
              className="p-1 rounded hover:bg-black/10 transition-colors"
              style={{ color: cfg.text }}
              title="Remove note"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Color swatches (shown when toggled) */}
        {showColors && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5" style={{ borderBottom: `1px solid ${cfg.line}` }}>
            {NOTE_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => { onColorChange(c.id); setShowColors(false); }}
                className={cn(
                  'w-4 h-4 rounded-full transition-transform hover:scale-110',
                  c.swatch,
                  note.color === c.id && 'ring-2 ring-offset-1 ring-stone-500 scale-110'
                )}
                title={c.label}
              />
            ))}
          </div>
        )}

        {/* Content — lined paper */}
        <div className="relative px-3 pt-2 pb-3">
          <div
            className="absolute inset-x-3 top-2 bottom-1 pointer-events-none"
            aria-hidden
            style={{
              backgroundImage: `repeating-linear-gradient(transparent,transparent 19px,${cfg.line} 19px,${cfg.line} 20px)`,
              backgroundPositionY: '2px',
            }}
          />
          <p
            className="relative text-sm leading-5 whitespace-pre-wrap break-words"
            style={{ color: cfg.text, lineHeight: '20px' }}
          >
            {note.content}
          </p>
        </div>

        {/* Footer timestamp */}
        <div className="px-2.5 pb-2 text-right">
          <span className="text-[9px] opacity-40" style={{ color: cfg.text }}>
            {new Date(note.pinned_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}

export function NotesBoard({ notes, onDelete, onColorChange }: NotesBoardProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (notes.length === 0) return null;

  return (
    <div className="mt-6">
      {/* Board header */}
      <button
        onClick={() => setCollapsed((p) => !p)}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <div className="flex items-center gap-2">
          <Pin className="w-4 h-4 text-amber-600 rotate-45" />
          <h3 className="text-sm font-semibold text-foreground">
            Notes Board
          </h3>
          <span className="text-xs text-muted bg-amber-100 text-amber-700 font-medium px-1.5 py-0.5 rounded-full">
            {notes.length}
          </span>
        </div>
        {collapsed
          ? <ChevronDown className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
          : <ChevronUp className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />}
      </button>

      {!collapsed && (
        <>
          {/* Cork board surface */}
          <div
            className="rounded-xl p-4 sm:p-5"
            style={{
              background: 'repeating-conic-gradient(#d6b87d 0% 25%,#c9a96c 0% 50%) 0 0/8px 8px',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15),0 2px 4px rgba(0,0,0,0.08)',
              border: '3px solid #a07840',
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {notes.map((note) => (
                <StickyCard
                  key={note.id}
                  note={note}
                  onDelete={() => onDelete(note.id)}
                  onColorChange={(c) => onColorChange(note.id, c)}
                />
              ))}
            </div>
          </div>
          <p className="text-[10px] text-muted mt-2 text-center">
            Notes are private and not submitted for grading
          </p>
        </>
      )}
    </div>
  );
}
