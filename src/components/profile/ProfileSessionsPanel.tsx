'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight,
  Calendar,
  ChevronDown,
  Clock,
  FolderArchive,
  GraduationCap,
  History,
  StickyNote as StickyNoteIcon,
  Zap,
} from 'lucide-react';
import { cn, percentage } from '@/lib/utils';
import type { StickyNote } from '@/types';
import {
  formatExamDuration,
  getFolderThemePalette,
  STATUS_DISPLAY,
  type SessionArchiveMeta,
} from '@/components/history/history-helpers';
import { OpenFolderModal } from '@/components/history/OpenFolderModal';

interface ProfileSessionsPanelProps {
  items: SessionArchiveMeta[];
  onDeleteSession: (sessionId: string) => Promise<void>;
  onNotesUpdated: (sessionId: string, notes: StickyNote[]) => void;
}

interface MiniSessionFolderProps {
  item: SessionArchiveMeta;
  index: number;
  onOpen: (item: SessionArchiveMeta) => void;
}

const INITIAL_VISIBLE_COUNT = 6;

function MiniSessionFolder({ item, index, onOpen }: MiniSessionFolderProps) {
  const prefersReduced = useReducedMotion();
  const [logoFailed, setLogoFailed] = useState(false);

  const {
    session,
    answeredCount,
    totalTimeSpent,
    totalScore,
    totalMaxScore,
    scorePercent,
    examCategory,
    examLogo,
    notes,
  } = item;

  const palette = getFolderThemePalette(examCategory, session.id);
  const statusInfo =
    STATUS_DISPLAY[session.status] || {
      label: session.status.replace('_', ' '),
      lightPill: 'bg-indigo-600/12 text-indigo-900',
      darkPill: 'dark:bg-white/15 dark:text-white',
      dotColor: 'bg-indigo-500',
    };

  const hasEval = item.evaluations.length > 0 && scorePercent !== null;
  const completionPct =
    hasEval && scorePercent !== null
      ? scorePercent
      : percentage(answeredCount, Math.max(1, session.total_questions));

  const dateStr = new Date(
    session.started_at || session.created_at
  ).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <motion.div
      layout={!prefersReduced}
      initial={prefersReduced ? false : { opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={
        prefersReduced
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.9, y: 12 }
      }
      transition={{
        layout: { type: 'spring', stiffness: 340, damping: 30 },
        opacity: { duration: 0.22 },
        y: {
          duration: 0.28,
          delay: Math.min(index * 0.035, 0.2),
          ease: [0.22, 1, 0.36, 1],
        },
        scale: { duration: 0.22 },
      }}
      className="relative"
      style={{ perspective: 1000 }}
    >
      <button
        type="button"
        onClick={() => onOpen(item)}
        aria-label={`Open session folder: ${session.title}`}
        className={cn(
          'group relative block w-full text-left pt-7 pb-0.5 rounded-[24px] outline-none focus:outline-none focus-visible:outline-none cursor-pointer touch-manipulation transition-transform duration-200 ease-out',
          !prefersReduced &&
            'hover:-translate-y-1 active:scale-[0.985] focus-visible:-translate-y-1'
        )}
      >
        {/* Top-Left Folder Tab (label stays cleanly inside upper 0..22px crown) */}
        <div className="absolute top-0 left-0 right-0 h-10 pointer-events-none select-none overflow-visible">
          <div
            className={cn(
              'relative inline-flex items-start h-8 pt-1.5 pl-4 pr-4 rounded-tl-[16px] rounded-tr-[12px] bg-gradient-to-r text-white shadow-[0_5px_14px_-5px_rgba(67,56,202,0.3)]',
              palette.lightBack,
              palette.darkBack
            )}
          >
            <span className="text-[10px] font-semibold tracking-wide uppercase truncate max-w-[140px] text-white/95 leading-none">
              {examCategory}
            </span>
          </div>
        </div>

        {/* Folder Rear Leaf */}
        <div
          className={cn(
            'absolute inset-x-0 top-5 bottom-0.5 rounded-tr-[22px] rounded-b-[22px] rounded-tl-[10px] bg-gradient-to-br transition-shadow duration-200',
            palette.lightBack,
            palette.darkBack,
            palette.lightShadow,
            palette.darkShadow,
            'group-hover:shadow-[0_20px_42px_-12px_rgba(79,70,229,0.3)] dark:group-hover:shadow-[0_22px_46px_-12px_rgba(79,70,229,0.42)]'
          )}
        />

        {/* Clean Minimal Peeking Paper Edge (no clipped text) */}
        <div
          aria-hidden="true"
          className={cn(
            'relative z-10 mx-3.5 mt-0 h-3.5 rounded-t-[12px] bg-white/95 dark:bg-[#18233F] shadow-[0_-2px_8px_rgba(15,23,42,0.05)] dark:shadow-[0_-2px_8px_rgba(0,0,0,0.35)] transition-transform duration-200 ease-out',
            !prefersReduced && 'group-hover:-translate-y-1'
          )}
        />

        {/* Compact 3D Front Flap */}
        <div
          style={{ transformOrigin: 'bottom center' }}
          className={cn(
            'relative z-20 -mt-1 rounded-[20px] bg-gradient-to-br overflow-hidden transition-all duration-200 ease-out transform-gpu',
            palette.lightFlap,
            palette.darkFlap,
            !prefersReduced && 'group-hover:[transform:rotateX(-7deg)]',
            'shadow-[0_-2px_10px_rgba(30,27,75,0.06)] dark:shadow-[0_-3px_14px_rgba(0,0,0,0.32)]'
          )}
        >
          {/* Specular Top Sheen */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/80 dark:via-white/25 to-transparent" />

          {/* Upper Body */}
          <div className="px-4 sm:px-5 pt-3.5 pb-3 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 dark:bg-white/14 text-[11px] font-semibold text-indigo-950 dark:text-white/95">
                <Clock className="w-3 h-3 text-indigo-600 dark:text-indigo-200 shrink-0" />
                <span>{formatExamDuration(totalTimeSpent)}</span>
              </span>

              <div className="flex items-center gap-1.5">
                {notes.length > 0 && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/25 dark:bg-amber-300/20 text-[10px] font-semibold text-amber-950 dark:text-amber-100"
                    title={`${notes.length} sticky note${notes.length > 1 ? 's' : ''}`}
                  >
                    <StickyNoteIcon className="w-2.5 h-2.5" />
                    <span>{notes.length}</span>
                  </span>
                )}
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold',
                    statusInfo.lightPill,
                    statusInfo.darkPill
                  )}
                >
                  <span
                    className={cn('w-1.5 h-1.5 rounded-full', statusInfo.dotColor)}
                  />
                  <span>{statusInfo.label}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full bg-white/95 dark:bg-white/16 p-1 shadow-[0_6px_18px_-4px_rgba(67,56,202,0.18)] dark:shadow-[0_6px_18px_-4px_rgba(0,0,0,0.48)] flex items-center justify-center shrink-0 overflow-hidden transition-transform duration-200 group-hover:scale-105">
                {examLogo && !logoFailed ? (
                  <Image
                    src={examLogo}
                    alt={examCategory}
                    width={44}
                    height={44}
                    onError={() => setLogoFailed(true)}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : session.mode === 'quick_battle' ||
                  session.mode === 'speed_battle' ? (
                  <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-100" />
                ) : (
                  <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-100" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  title={session.title}
                  className="text-sm font-semibold text-slate-900 dark:text-white truncate leading-snug"
                >
                  {session.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-600 dark:text-indigo-100/75">
                  <Calendar className="w-3 h-3 shrink-0 opacity-80" />
                  <span className="truncate">{dateStr}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lower Partition Band */}
          <div
            className={cn(
              'px-4 sm:px-5 py-3 backdrop-blur-sm space-y-2',
              palette.lightLip,
              'dark:bg-black/22'
            )}
          >
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span className="font-medium text-slate-600 dark:text-indigo-100/80">
                {answeredCount} {answeredCount === 1 ? 'answer' : 'answers'}
              </span>
              {hasEval ? (
                <span
                  className={cn(
                    'font-bold tabular-nums',
                    scorePercent >= 60
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-indigo-900 dark:text-amber-200'
                  )}
                >
                  {totalScore}/{totalMaxScore} ({scorePercent}%)
                </span>
              ) : (
                <span className="font-semibold text-indigo-800 dark:text-indigo-200 tabular-nums">
                  {session.total_marks} marks
                </span>
              )}
            </div>

            <div className="h-1.5 w-full rounded-full bg-indigo-950/10 dark:bg-white/15 overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full bg-gradient-to-r transition-all duration-500',
                  palette.accentBar
                )}
                style={{
                  width: `${Math.max(5, Math.min(100, completionPct))}%`,
                }}
              />
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

export function ProfileSessionsPanel({
  items,
  onDeleteSession,
  onNotesUpdated,
}: ProfileSessionsPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleItems = useMemo(
    () => (showAll ? items : items.slice(0, INITIAL_VISIBLE_COUNT)),
    [items, showAll]
  );

  const selectedItem = useMemo(
    () => items.find((entry) => entry.session.id === selectedId) ?? null,
    [items, selectedId]
  );

  return (
    <section className="space-y-5">
      {/* Header Card (Borderless & Smooth) */}
      <div className="rounded-3xl bg-white/95 dark:bg-[#111A2E]/95 p-5 sm:p-6 shadow-[0_8px_28px_-10px_rgba(79,70,229,0.12)] dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6366F1] via-[#6C63FF] to-[#4F46E5] flex items-center justify-center text-white shadow-[0_8px_20px_-6px_rgba(99,91,255,0.45)] shrink-0">
            <FolderArchive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              My Sessions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {items.length}{' '}
              {items.length === 1 ? 'practice session' : 'practice sessions'}{' '}
              recorded
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Link
            href="/history"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/15 dark:bg-indigo-400/15 dark:hover:bg-indigo-400/25 text-indigo-700 dark:text-indigo-200 transition-colors outline-none focus:outline-none"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Full Archive</span>
          </Link>
          <Link
            href="/practice"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold bg-gradient-to-r from-[#6366F1] via-[#6C63FF] to-[#5448E6] hover:brightness-105 text-white shadow-[0_8px_20px_-6px_rgba(99,91,255,0.45)] transition-all outline-none focus:outline-none"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>New Session</span>
          </Link>
        </div>
      </div>

      {/* Empty State or Spacious 2-Column Small Animated Folder Grid */}
      {items.length === 0 ? (
        <div className="rounded-3xl bg-white/95 dark:bg-[#111A2E]/95 p-10 text-center shadow-[0_8px_28px_-10px_rgba(15,23,42,0.08)] dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.48)]">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/12 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-300 mx-auto mb-3">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            No sessions recorded yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Start your first exam simulation or practice drill to collect your session folders here.
          </p>
          <Link
            href="/practice"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold bg-gradient-to-r from-[#6366F1] via-[#6C63FF] to-[#5448E6] text-white shadow-[0_8px_20px_-6px_rgba(99,91,255,0.45)] outline-none focus:outline-none"
          >
            <span>Start Practicing</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {visibleItems.map((item, idx) => (
                <MiniSessionFolder
                  key={item.session.id}
                  item={item}
                  index={idx}
                  onOpen={(entry) => setSelectedId(entry.session.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {items.length > INITIAL_VISIBLE_COUNT && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/95 dark:bg-[#111A2E]/95 hover:bg-indigo-50 dark:hover:bg-[#18223C] text-xs font-semibold text-indigo-700 dark:text-indigo-200 shadow-[0_6px_20px_-6px_rgba(79,70,229,0.16)] dark:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.45)] transition-all cursor-pointer outline-none focus:outline-none"
              >
                <span>
                  {showAll
                    ? `Show Recent ${INITIAL_VISIBLE_COUNT}`
                    : `Show All ${items.length} Session Folders`}
                </span>
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 transition-transform duration-200',
                    showAll && 'rotate-180'
                  )}
                />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Signature 3D Open Folder Modal */}
      <AnimatePresence>
        {selectedItem && (
          <OpenFolderModal
            key={selectedItem.session.id}
            item={selectedItem}
            onClose={() => setSelectedId(null)}
            onConfirmDelete={async (sessionId) => {
              await onDeleteSession(sessionId);
              setSelectedId(null);
            }}
            onNotesUpdated={onNotesUpdated}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
