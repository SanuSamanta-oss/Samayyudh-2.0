'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  StickyNote as StickyNoteIcon, Search, Calendar, BookOpen,
  Trash2, ExternalLink, Loader2, Zap, Filter, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import * as localDB from '@/lib/store/local-db';
import { questionBank } from '@/lib/questions';
import type { StickyNote, ExamSession, Question } from '@/types';

import { getColorConfig, NOTE_COLORS } from '@/components/exam/StickyNote';

interface NoteWithContext {
  note: StickyNote;
  question: Question | undefined;
  session: ExamSession | undefined;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteWithContext[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'question'>('newest');

  async function loadNotes() {
    setLoading(true);
    const allNotes = await localDB.getAllStickyNotes();
    const allSessions = await localDB.getAllSessions();

    const sessionMap = new Map(allSessions.map(s => [s.id, s]));
    const customQs = await localDB.getAllCustomQuestions();
    const allQuestions = [...questionBank, ...customQs];
    const questionMap = new Map(allQuestions.map(q => [q.id, q]));

    const enriched: NoteWithContext[] = allNotes
      .filter(n => n.content.trim().length > 0) // skip empty notes
      .map(note => ({
        note,
        question: questionMap.get(note.question_id),
        session: sessionMap.get(note.session_id),
      }));

    setNotes(enriched);
    setLoading(false);
  }

  useEffect(() => {
    setTimeout(() => {
      loadNotes();
    }, 0);
  }, []);

  async function deleteNote(noteId: string) {
    await localDB.deleteStickyNote(noteId);
    setNotes(prev => prev.filter(n => n.note.id !== noteId));
  }

  const filtered = notes
    .filter(n => {
      if (searchQuery === '') return true;
      const q = searchQuery.toLowerCase();
      return (
        n.note.content.toLowerCase().includes(q) ||
        n.question?.question_text.toLowerCase().includes(q) ||
        n.question?.subject.toLowerCase().includes(q) ||
        n.question?.topic.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.note.updated_at).getTime() - new Date(a.note.updated_at).getTime();
      if (sortBy === 'oldest') return new Date(a.note.updated_at).getTime() - new Date(b.note.updated_at).getTime();
      return (a.question?.subject || '').localeCompare(b.question?.subject || '');
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto" />
          <p className="text-sm text-stone-500">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <StickyNoteIcon className="w-6 h-6 text-brand-600" />
            Notes
          </h1>
          <p className="text-stone-500 mt-1">
            {notes.length > 0
              ? `${notes.length} note${notes.length !== 1 ? 's' : ''} from your exam sessions`
              : 'Your sticky notes from exam sessions'}
          </p>
        </div>
      </div>

      {/* Search and Sort */}
      {notes.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search notes, questions, subjects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'newest' | 'oldest' | 'question')}
              className="pl-9 pr-8 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="question">By Subject</option>
            </select>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <StickyNoteIcon className="w-12 h-12 mx-auto text-stone-300" />
          <p className="text-stone-500">
            {notes.length === 0
              ? 'No notes yet. Jot down ideas during your exams using the sticky note button.'
              : 'No notes match your search.'}
          </p>
          {notes.length === 0 && (
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity"
            >
              <Zap className="w-4 h-4" /> Start Practicing
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, index) => {
            const cfg = getColorConfig(item.note.color);
            const qNum = item.note.question_number ?? (item.note.question_index !== undefined ? item.note.question_index + 1 : undefined);

            return (
              <div
                key={item.note.id}
                className={cn(
                  'rounded-2xl border-2 p-4 space-y-3 transition-all duration-200 group relative shadow-sm hover:shadow-md hover:scale-[1.01]',
                  cfg.cardClass
                )}
              >
                {/* Note Header */}
                <div className="flex items-center justify-between pb-1 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className={cn('text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-2xs', cfg.badgeClass)}>
                      {qNum !== undefined ? `Q${qNum}` : 'Note'}
                    </span>
                    {item.question?.subject && (
                      <span className="text-[10px] opacity-60 font-semibold uppercase tracking-wider">
                        {item.question.subject}
                      </span>
                    )}
                  </div>
                  {item.session?.title && (
                    <span className="text-[10px] opacity-50 truncate max-w-[120px]">
                      {item.session.title}
                    </span>
                  )}
                </div>

                {/* Note Content */}
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap line-clamp-6 font-sans">
                  {item.note.content}
                </p>

                {/* Question Context */}
                {item.question && (
                  <div className="pt-2 border-t border-black/5 dark:border-white/5">
                    <p className="text-xs opacity-75 line-clamp-2">
                      <span className="font-semibold">Q:</span>{' '}
                      {item.question.question_text.slice(0, 100)}
                      {item.question.question_text.length > 100 ? '…' : ''}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] opacity-60">
                      <span>{item.question.topic}</span>
                      <span>·</span>
                      <span>{item.question.marks}m</span>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-[10px] opacity-60">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(item.note.updated_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.session && (
                      <Link
                        href={`/results?session=${item.session.id}`}
                        className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        title="View in exam results"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    <button
                      onClick={() => deleteNote(item.note.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats */}
      {notes.length > 0 && (
        <div className="flex items-center justify-center gap-6 pt-4 border-t border-border text-xs text-stone-400">
          <span className="flex items-center gap-1">
            <StickyNoteIcon className="w-3.5 h-3.5" />
            {notes.length} total notes
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {new Set(notes.map(n => n.question?.subject).filter(Boolean)).size} subjects covered
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Set(notes.map(n => n.note.session_id)).size} sessions
          </span>
        </div>
      )}
    </div>
  );
}
