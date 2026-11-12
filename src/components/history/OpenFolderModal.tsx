'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Award,
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Edit3,
  FolderOpen,
  GraduationCap,
  Layers,
  Pin,
  Plus,
  Printer,
  RotateCcw,
  StickyNote as StickyNoteIcon,
  Target,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { cn, generateId, percentage } from '@/lib/utils';
import * as localDB from '@/lib/store/local-db';
import { getColorConfig } from '@/components/exam/StickyNote';
import type { StickyNote, StickyNoteColor } from '@/types';
import {
  formatExamDuration,
  getFolderThemePalette,
  STATUS_DISPLAY,
  type SessionArchiveMeta,
} from './history-helpers';

interface OpenFolderModalProps {
  item: SessionArchiveMeta | null;
  onClose: () => void;
  onConfirmDelete: (sessionId: string) => Promise<void>;
  onNotesUpdated: (sessionId: string, notes: StickyNote[]) => void;
}

const FOLDER_NOTE_COLOR_IDS: StickyNoteColor[] = [
  'yellow',
  'seagreen',
  'blue',
  'purple',
  'rose',
];

const FOLDER_NOTE_TINTS: Record<
  StickyNoteColor,
  { card: string; chip: string }
> = {
  yellow: {
    card: 'bg-amber-50/95 dark:bg-[#231C0F] text-amber-950 dark:text-amber-100',
    chip: 'bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200',
  },
  orange: {
    card: 'bg-orange-50/95 dark:bg-[#26180F] text-orange-950 dark:text-orange-100',
    chip: 'bg-orange-200/70 dark:bg-orange-900/60 text-orange-900 dark:text-orange-200',
  },
  seagreen: {
    card: 'bg-emerald-50/95 dark:bg-[#0E2419] text-emerald-950 dark:text-emerald-100',
    chip: 'bg-emerald-200/70 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200',
  },
  white: {
    card: 'bg-stone-50 dark:bg-[#182238] text-slate-900 dark:text-slate-100',
    chip: 'bg-stone-200/80 dark:bg-slate-700 text-slate-800 dark:text-slate-200',
  },
  blue: {
    card: 'bg-sky-50/95 dark:bg-[#0D1E31] text-sky-950 dark:text-sky-100',
    chip: 'bg-sky-200/70 dark:bg-sky-900/60 text-sky-900 dark:text-sky-200',
  },
  purple: {
    card: 'bg-violet-50/95 dark:bg-[#1C1432] text-violet-950 dark:text-violet-100',
    chip: 'bg-violet-200/70 dark:bg-violet-900/60 text-violet-900 dark:text-violet-200',
  },
  rose: {
    card: 'bg-rose-50/95 dark:bg-[#29131C] text-rose-950 dark:text-rose-100',
    chip: 'bg-rose-200/70 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200',
  },
  amber: {
    card: 'bg-amber-50/95 dark:bg-[#231C0F] text-amber-950 dark:text-amber-100',
    chip: 'bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200',
  },
};

export function OpenFolderModal({
  item,
  onClose,
  onConfirmDelete,
  onNotesUpdated,
}: OpenFolderModalProps) {
  const prefersReduced = useReducedMotion();
  const [logoFailed, setLogoFailed] = useState(false);
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Sticky Note editor state
  const [draftContent, setDraftContent] = useState('');
  const [draftColor, setDraftColor] = useState<StickyNoteColor>('yellow');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (deleteConfirmOpen) {
          setDeleteConfirmOpen(false);
        } else if (notesDrawerOpen) {
          setNotesDrawerOpen(false);
        } else {
          onClose();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, notesDrawerOpen, deleteConfirmOpen, onClose]);

  if (!item) return null;

  const {
    session,
    answeredCount,
    totalTimeSpent,
    totalScore,
    totalMaxScore,
    scorePercent,
    accuracyPercent,
    examCategory,
    examLogo,
    subjects,
    topics,
    notes,
    firstQuestionId,
  } = item;

  const palette = getFolderThemePalette(examCategory, session.id);
  const statusInfo = STATUS_DISPLAY[session.status] || STATUS_DISPLAY.completed;
  const hasEval = scorePercent !== null && totalMaxScore > 0;
  const answerCompletionPct = percentage(
    answeredCount,
    Math.max(1, session.total_questions)
  );
  const totalMarksDisplay = hasEval ? totalMaxScore : session.total_marks;

  const formattedDate = new Date(session.started_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  async function handleSaveNewNote() {
    if (!item || !draftContent.trim() || savingNote) return;
    setSavingNote(true);
    try {
      const now = new Date().toISOString();
      const newNote: StickyNote = {
        id: generateId(),
        user_id: session.user_id || 'local',
        question_id: firstQuestionId || `session-${session.id}`,
        session_id: session.id,
        exam_name: session.title,
        category: examCategory,
        content: draftContent.trim(),
        color: draftColor,
        is_pinned: true,
        created_at: now,
        updated_at: now,
      };
      await localDB.saveStickyNote(newNote);
      const nextNotes = [newNote, ...notes];
      onNotesUpdated(session.id, nextNotes);
      setDraftContent('');
    } finally {
      setSavingNote(false);
    }
  }

  async function handleUpdateNote(note: StickyNote) {
    if (!editingContent.trim() || savingNote) return;
    setSavingNote(true);
    try {
      const updated: StickyNote = {
        ...note,
        content: editingContent.trim(),
        updated_at: new Date().toISOString(),
      };
      await localDB.saveStickyNote(updated);
      const nextNotes = notes.map((n) => (n.id === note.id ? updated : n));
      onNotesUpdated(session.id, nextNotes);
      setEditingNoteId(null);
      setEditingContent('');
    } finally {
      setSavingNote(false);
    }
  }

  async function handleTogglePin(note: StickyNote) {
    const updated: StickyNote = {
      ...note,
      is_pinned: !note.is_pinned,
      updated_at: new Date().toISOString(),
    };
    await localDB.saveStickyNote(updated);
    const nextNotes = notes.map((n) => (n.id === note.id ? updated : n));
    onNotesUpdated(session.id, nextNotes);
  }

  async function handleDeleteNote(noteId: string) {
    await localDB.deleteStickyNote(noteId);
    const nextNotes = notes.filter((n) => n.id !== noteId);
    onNotesUpdated(session.id, nextNotes);
  }

  async function triggerDeleteSession() {
    if (deleting) return;
    setDeleting(true);
    await onConfirmDelete(session.id);
  }

  const detailItems = [
    {
      label: 'Exam Category',
      value: examCategory,
      icon: Layers,
    },
    {
      label: 'Subject',
      value: subjects.length > 0 ? subjects.join(', ') : 'Not specified',
      icon: BookOpen,
    },
    {
      label: 'Topic',
      value: topics.length > 0 ? topics.slice(0, 3).join(', ') : 'Not specified',
      icon: Target,
    },
    {
      label: 'Examination Date',
      value: formattedDate,
      icon: Calendar,
    },
    {
      label: 'Time Taken',
      value: formatExamDuration(totalTimeSpent),
      icon: Clock,
    },
    {
      label: 'Questions Answered',
      value: `${answeredCount} of ${session.total_questions}`,
      icon: Check,
    },
    {
      label: 'Marks',
      value: hasEval
        ? `${totalScore} / ${totalMarksDisplay}`
        : `— / ${totalMarksDisplay} total`,
      icon: Award,
    },
    {
      label: 'Submission Status',
      value: statusInfo.label,
      icon: FolderOpen,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Exam Folder: ${session.title}`}
      className="fixed inset-0 z-[70] flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
        {/* Soft Atmospheric Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/35 dark:bg-black/70 backdrop-blur-md"
        />

        {/* Interactive 3D Open Folder Theater */}
        <div
          className={cn(
            'relative z-10 w-full my-auto transition-all duration-300',
            notesDrawerOpen ? 'max-w-5xl' : 'max-w-3xl'
          )}
          style={{ perspective: 1400 }}
        >
          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-4 sm:gap-5">
            {/* Primary Opened Folder Container */}
            <motion.div
              initial={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.9, y: 24 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.92, y: 20 }
              }
              transition={{ type: 'spring', stiffness: 310, damping: 28 }}
              className="relative flex-1 min-w-0 pt-10"
            >
              {/* Back Folder Tab */}
              <div className="absolute top-0 left-3 right-0 h-14 pointer-events-none select-none">
                <div
                  className={cn(
                    'inline-flex items-center gap-2 h-9 pt-0.5 pb-1 px-5 rounded-tl-[20px] rounded-tr-[16px] bg-gradient-to-r text-white shadow-[0_8px_22px_-6px_rgba(67,56,202,0.45)]',
                    palette.lightBack,
                    palette.darkBack
                  )}
                >
                  <span className="w-2 h-2 rounded-full bg-white/80" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-white leading-none">
                    {examCategory} Archive
                  </span>
                </div>
              </div>

              {/* Backplate Leaf behind the Sheet */}
              <div
                aria-hidden="true"
                className={cn(
                  'absolute inset-x-0 top-7 bottom-0 rounded-[32px] bg-gradient-to-br shadow-[0_28px_70px_-14px_rgba(30,27,75,0.38)] dark:shadow-[0_32px_80px_-12px_rgba(0,0,0,0.82)]',
                  palette.lightBack,
                  palette.darkBack
                )}
              />

              {/* Emerged Inner Archival Exam Sheet (Steps 2–6) */}
              <motion.div
                initial={
                  prefersReduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: 54, scale: 0.96 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 270,
                  damping: 26,
                  delay: prefersReduced ? 0 : 0.08,
                }}
                className="relative z-20 mx-2.5 sm:mx-4 mb-5 rounded-[28px] bg-white dark:bg-[#111B30] shadow-[0_20px_60px_-12px_rgba(15,23,42,0.22)] dark:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.75)] overflow-hidden"
              >
                {/* Step 3: Exam Header & Title */}
                <motion.div
                  initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: prefersReduced ? 0 : 0.16 }}
                  className="px-5 sm:px-7 pt-5 sm:pt-6 pb-4 flex items-start justify-between gap-4 bg-gradient-to-b from-[#F8F7FF] to-white dark:from-[#16233E] dark:to-[#111B30]"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white dark:bg-[#1C2A4A] p-1 shadow-[0_8px_22px_-6px_rgba(99,91,255,0.28)] dark:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.5)] flex items-center justify-center shrink-0 overflow-hidden">
                      {examLogo && !logoFailed ? (
                        <Image
                          src={examLogo}
                          alt={examCategory}
                          width={56}
                          height={56}
                          onError={() => setLogoFailed(true)}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : session.mode === 'quick_battle' ||
                        session.mode === 'speed_battle' ? (
                        <Zap className="w-6 h-6 text-[#635BFF] dark:text-[#A5B4FC]" />
                      ) : (
                        <GraduationCap className="w-6 h-6 text-[#635BFF] dark:text-[#A5B4FC]" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-[#EAE6F5] text-[#4F46E5] dark:bg-[#231B45] dark:text-[#C4B5FD]">
                          {examCategory}
                        </span>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
                            statusInfo.lightPill,
                            statusInfo.darkPill
                          )}
                        >
                          <span
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              statusInfo.dotColor
                            )}
                          />
                          {statusInfo.label}
                        </span>
                      </div>

                      <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                        {session.title}
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close exam folder"
                    className="p-2 rounded-2xl bg-stone-100/90 hover:bg-[#EAE6F5] dark:bg-[#1A2640] dark:hover:bg-[#253352] text-slate-600 dark:text-slate-300 transition-colors outline-none focus:outline-none cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>

                {/* Main Inner Sheet Content */}
                <div className="px-5 sm:px-7 py-4 sm:py-5 space-y-5 max-h-[58dvh] sm:max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {/* Step 4: Sequential Exam Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                    {detailItems.map((detail, i) => {
                      const Icon = detail.icon;
                      return (
                        <motion.div
                          key={detail.label}
                          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.25,
                            delay: prefersReduced ? 0 : 0.2 + i * 0.025,
                          }}
                          className="rounded-2xl bg-[#F6F5FC] dark:bg-[#17233D] px-3.5 py-2.5"
                        >
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <Icon className="w-3 h-3 text-[#635BFF] dark:text-[#A5B4FC] shrink-0" />
                            <span className="truncate">{detail.label}</span>
                          </div>
                          <p
                            title={detail.value}
                            className="mt-1 text-xs sm:text-[13px] font-semibold text-slate-900 dark:text-white truncate"
                          >
                            {detail.value}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Step 5: Final Percentage & Evaluation Accuracy Meters */}
                  <motion.div
                    initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: prefersReduced ? 0 : 0.36 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
                  >
                    {/* Final Percentage Card */}
                    <div className="rounded-2xl bg-[#F4F3FF] dark:bg-[#182142] p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                          Final Score &amp; Percentage
                        </span>
                        <span className="text-sm font-bold text-[#4F46E5] dark:text-[#C4B5FD] tabular-nums">
                          {hasEval
                            ? `${totalScore}/${totalMarksDisplay} (${scorePercent}%)`
                            : 'Pending Evaluation'}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-indigo-950/10 dark:bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${hasEval ? Math.max(4, scorePercent) : answerCompletionPct}%`,
                          }}
                          transition={{
                            duration: 0.55,
                            delay: prefersReduced ? 0 : 0.42,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="h-full rounded-full bg-gradient-to-r from-[#6366F1] via-[#6C63FF] to-[#8B5CF6]"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {hasEval
                          ? `Scored ${scorePercent}% across ${totalMarksDisplay} evaluated marks`
                          : `${answeredCount} of ${session.total_questions} questions answered so far`}
                      </p>
                    </div>

                    {/* Evaluation Accuracy Card */}
                    <div className="rounded-2xl bg-[#F2F6FF] dark:bg-[#15243E] p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                          Evaluation Accuracy
                        </span>
                        <span
                          className={cn(
                            'text-sm font-bold tabular-nums',
                            accuracyPercent === null
                              ? 'text-slate-500 dark:text-slate-400'
                              : accuracyPercent >= 60
                                ? 'text-emerald-600 dark:text-emerald-300'
                                : 'text-amber-600 dark:text-amber-300'
                          )}
                        >
                          {accuracyPercent !== null
                            ? `${accuracyPercent}%`
                            : 'Not Evaluated'}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-900/10 dark:bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${accuracyPercent !== null ? Math.max(4, accuracyPercent) : 0}%`,
                          }}
                          transition={{
                            duration: 0.55,
                            delay: prefersReduced ? 0 : 0.46,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className={cn(
                            'h-full rounded-full bg-gradient-to-r',
                            accuracyPercent !== null && accuracyPercent >= 60
                              ? 'from-emerald-500 to-teal-400'
                              : 'from-indigo-500 to-violet-500'
                          )}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {accuracyPercent !== null
                          ? `Evaluated across ${item.evaluations.length} response${item.evaluations.length === 1 ? '' : 's'}`
                          : 'Submit & evaluate this session to unlock accuracy metrics'}
                      </p>
                    </div>
                  </motion.div>

                  {/* Minimal Inline Delete Confirmation */}
                  <AnimatePresence>
                    {deleteConfirmOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-2xl bg-rose-50 dark:bg-rose-950/45 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-rose-950 dark:text-rose-100">
                            Remove this exam folder from your archive?
                          </p>
                          <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 mt-0.5">
                            This deletes the session record permanently from local history.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            disabled={deleting}
                            onClick={() => setDeleteConfirmOpen(false)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#19233C] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-[#223050] transition-colors outline-none focus:outline-none cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                          <button
                            type="button"
                            disabled={deleting}
                            onClick={triggerDeleteSession}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-xs font-semibold text-white shadow-[0_6px_18px_-4px_rgba(225,29,72,0.45)] transition-colors outline-none focus:outline-none cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{deleting ? 'Deleting...' : 'Confirm Delete'}</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Step 6: Bottom Action Bar (Reference 2: Sticky Notes | Delete | Print + Primary Route CTA) */}
                <motion.div
                  initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: prefersReduced ? 0 : 0.42 }}
                  className="px-5 sm:px-7 py-3.5 sm:py-4 bg-[#F7F6FC] dark:bg-[#0D1527] flex flex-wrap items-center justify-between gap-2.5"
                >
                  {/* Reference 2 Compact Trio */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setNotesDrawerOpen((v) => !v)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all outline-none focus:outline-none cursor-pointer',
                        notesDrawerOpen
                          ? 'bg-amber-400 text-amber-950 shadow-[0_6px_18px_-4px_rgba(245,158,11,0.45)]'
                          : 'bg-white dark:bg-[#17233D] text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-[#232032] shadow-[0_2px_10px_rgba(15,23,42,0.05)]'
                      )}
                    >
                      <StickyNoteIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
                      <span>Sticky Notes</span>
                      {notes.length > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-900 dark:text-amber-200">
                          {notes.length}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmOpen((v) => !v)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all outline-none focus:outline-none cursor-pointer',
                        deleteConfirmOpen
                          ? 'bg-rose-600 text-white shadow-[0_6px_18px_-4px_rgba(225,29,72,0.4)]'
                          : 'bg-white dark:bg-[#17233D] text-slate-700 dark:text-slate-200 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/50 dark:hover:text-rose-300 shadow-[0_2px_10px_rgba(15,23,42,0.05)]'
                      )}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>

                    {session.status !== 'in_progress' || answeredCount > 0 ? (
                      <Link
                        href={`/report?session=${session.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-[#17233D] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-[#EAE6F5] hover:text-[#4F46E5] dark:hover:bg-[#232A4B] dark:hover:text-[#DDD6FE] shadow-[0_2px_10px_rgba(15,23,42,0.05)] transition-all outline-none focus:outline-none"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </Link>
                    ) : (
                      <span
                        title="Answer or submit the session to generate a printable report"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/60 dark:bg-[#17233D]/55 text-xs font-medium text-slate-400 dark:text-slate-500 cursor-not-allowed"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </span>
                    )}
                  </div>

                  {/* Primary Session Route Action */}
                  {session.status === 'in_progress' ? (
                    <Link
                      href={`/exam/session?resume=${session.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#6366F1] via-[#6C63FF] to-[#564AE6] hover:brightness-105 text-white text-xs font-semibold shadow-[0_8px_22px_-6px_rgba(99,91,255,0.5)] transition-all outline-none focus:outline-none"
                    >
                      <span>Resume Exam</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href={`/results?session=${session.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#6366F1] via-[#6C63FF] to-[#564AE6] hover:brightness-105 text-white text-xs font-semibold shadow-[0_8px_22px_-6px_rgba(99,91,255,0.5)] transition-all outline-none focus:outline-none"
                    >
                      <span>View Full Analysis</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </motion.div>
              </motion.div>

              {/* Hinged 3D Front Folder Flap at the Bottom-Front (tilted open in 3D space!) */}
              <motion.div
                aria-hidden="true"
                initial={
                  prefersReduced
                    ? false
                    : { rotateX: 0, y: -10 }
                }
                animate={
                  prefersReduced
                    ? { rotateX: 0, y: 0 }
                    : { rotateX: -28, y: 4 }
                }
                transition={{ type: 'spring', stiffness: 250, damping: 26 }}
                style={{ transformOrigin: 'bottom center' }}
                className={cn(
                  'pointer-events-none relative z-30 -mt-7 h-10 mx-1 rounded-b-[28px] rounded-t-[14px] bg-gradient-to-r shadow-[0_14px_32px_-8px_rgba(67,56,202,0.35)]',
                  palette.lightFlap,
                  palette.darkFlap
                )}
              >
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/75 dark:via-white/25 to-transparent" />
              </motion.div>
            </motion.div>

            {/* Floating Layered-Paper Sticky Notes Drawer (Section 4) */}
            <AnimatePresence>
              {notesDrawerOpen && (
                <motion.aside
                  initial={
                    prefersReduced
                      ? { opacity: 0 }
                      : { opacity: 0, x: 24, y: 12, scale: 0.96 }
                  }
                  animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  exit={
                    prefersReduced
                      ? { opacity: 0 }
                      : { opacity: 0, x: 20, scale: 0.96 }
                  }
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  className="w-full lg:w-[340px] shrink-0 rounded-[28px] bg-white dark:bg-[#111B30] p-4 sm:p-5 shadow-[0_24px_60px_-14px_rgba(15,23,42,0.24)] dark:shadow-[0_28px_70px_-14px_rgba(0,0,0,0.82)] flex flex-col max-h-[68dvh] lg:max-h-[75vh]"
                >
                  <div className="flex items-center justify-between gap-2 pb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-8 h-8 rounded-2xl bg-amber-400/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                        <StickyNoteIcon className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          Session Sticky Notes
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          Saved automatically with this exam
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotesDrawerOpen(false)}
                      aria-label="Close sticky notes panel"
                      className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-[#192540] dark:hover:bg-[#243354] text-slate-500 dark:text-slate-300 transition-colors outline-none focus:outline-none cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* New Layered Paper Composer */}
                  <div
                    className={cn(
                      'rounded-2xl p-3 space-y-2.5 shadow-[0_8px_22px_-8px_rgba(15,23,42,0.12)] transition-colors',
                      FOLDER_NOTE_TINTS[draftColor].card
                    )}
                  >
                    <textarea
                      rows={3}
                      value={draftContent}
                      onChange={(e) => setDraftContent(e.target.value)}
                      placeholder="Write a personal observation, formula reminder, or mistake analysis..."
                      className="w-full bg-transparent text-xs leading-relaxed placeholder:opacity-60 resize-none outline-none focus:outline-none"
                    />
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-1.5">
                        {FOLDER_NOTE_COLOR_IDS.map((colorId) => {
                          const cfg = getColorConfig(colorId);
                          const selected = draftColor === colorId;
                          return (
                            <button
                              key={colorId}
                              type="button"
                              aria-label={`Use ${cfg.label} note paper`}
                              onClick={() => setDraftColor(colorId)}
                              className={cn(
                                'w-4 h-4 rounded-full transition-transform outline-none focus:outline-none cursor-pointer',
                                cfg.swatch,
                                selected ? 'scale-125 shadow-sm' : 'opacity-65 hover:opacity-100'
                              )}
                            />
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        disabled={!draftContent.trim() || savingNote}
                        onClick={handleSaveNewNote}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity outline-none focus:outline-none cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Save Note</span>
                      </button>
                    </div>
                  </div>

                  {/* Saved Notes List */}
                  <div className="mt-3 flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-0.5 custom-scrollbar">
                    {notes.length === 0 ? (
                      <div className="rounded-2xl bg-[#F6F5FC] dark:bg-[#17233D] py-8 px-4 text-center space-y-1">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                          No sticky notes yet
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Jot down takeaways above to keep them inside this exam folder.
                        </p>
                      </div>
                    ) : (
                      notes.map((note, idx) => {
                        const tint =
                          FOLDER_NOTE_TINTS[note.color || 'yellow'] ||
                          FOLDER_NOTE_TINTS.yellow;
                        const isEditing = editingNoteId === note.id;

                        return (
                          <motion.div
                            key={note.id}
                            layout
                            initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.2,
                              delay: Math.min(idx * 0.03, 0.15),
                            }}
                            className={cn(
                              'rounded-2xl p-3 space-y-2 shadow-[0_6px_18px_-6px_rgba(15,23,42,0.1)]',
                              tint.card
                            )}
                          >
                            {isEditing ? (
                              <div className="space-y-2">
                                <textarea
                                  rows={3}
                                  value={editingContent}
                                  onChange={(e) => setEditingContent(e.target.value)}
                                  className="w-full bg-white/60 dark:bg-black/25 rounded-xl p-2 text-xs leading-relaxed resize-none outline-none focus:outline-none"
                                />
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingNoteId(null);
                                      setEditingContent('');
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 text-[11px] font-medium outline-none focus:outline-none cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    disabled={!editingContent.trim() || savingNote}
                                    onClick={() => handleUpdateNote(note)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-semibold outline-none focus:outline-none cursor-pointer"
                                  >
                                    Update
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">
                                  {note.content}
                                </p>
                                <div className="flex items-center justify-between gap-2 pt-1">
                                  <span
                                    className={cn(
                                      'px-2 py-0.5 rounded-full text-[10px] font-medium',
                                      tint.chip
                                    )}
                                  >
                                    {new Date(note.updated_at).toLocaleDateString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                    })}
                                  </span>

                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleTogglePin(note)}
                                      aria-label={note.is_pinned ? 'Unpin note' : 'Pin note'}
                                      className={cn(
                                        'p-1.5 rounded-lg transition-colors outline-none focus:outline-none cursor-pointer',
                                        note.is_pinned
                                          ? 'bg-black/10 dark:bg-white/15'
                                          : 'opacity-65 hover:opacity-100'
                                      )}
                                    >
                                      <Pin className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingNoteId(note.id);
                                        setEditingContent(note.content);
                                      }}
                                      aria-label="Edit note"
                                      className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors outline-none focus:outline-none cursor-pointer"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteNote(note.id)}
                                      aria-label="Delete note"
                                      className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-500/15 transition-colors outline-none focus:outline-none cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
  );
}
