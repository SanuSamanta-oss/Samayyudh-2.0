'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, Clock, GraduationCap, StickyNote, Zap } from 'lucide-react';
import { cn, percentage } from '@/lib/utils';
import {
  formatExamDuration,
  getFolderThemePalette,
  STATUS_DISPLAY,
  type SessionArchiveMeta,
} from './history-helpers';

interface ExamFolderCardProps {
  item: SessionArchiveMeta;
  index: number;
  isSelected: boolean;
  onOpen: (item: SessionArchiveMeta) => void;
}

export function ExamFolderCard({
  item,
  index,
  isSelected,
  onOpen,
}: ExamFolderCardProps) {
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
  const statusInfo = STATUS_DISPLAY[session.status] || STATUS_DISPLAY.completed;
  const hasEval = scorePercent !== null && totalMaxScore > 0;
  const completionPct = hasEval
    ? scorePercent
    : percentage(answeredCount, Math.max(1, session.total_questions));

  const formattedDate = new Date(session.started_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      layout
      initial={prefersReduced ? false : { opacity: 0, y: 18, scale: 0.97 }}
      animate={{
        opacity: isSelected ? 0.45 : 1,
        y: 0,
        scale: isSelected ? 0.97 : 1,
      }}
      exit={
        prefersReduced
          ? { opacity: 0 }
          : {
              opacity: 0,
              scale: 0.86,
              y: 18,
              transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
            }
      }
      transition={{
        layout: { type: 'spring', stiffness: 360, damping: 32 },
        opacity: { duration: 0.24 },
        y: { duration: 0.32, delay: Math.min(index * 0.035, 0.24), ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.24 },
      }}
      className="relative"
      style={{ perspective: 1100 }}
    >
      <button
        type="button"
        onClick={() => onOpen(item)}
        aria-label={`Open exam folder: ${session.title}`}
        className={cn(
          'group relative block w-full text-left pt-9 pb-0.5 rounded-[28px] outline-none focus:outline-none focus-visible:outline-none cursor-pointer touch-manipulation transition-transform duration-200 ease-out',
          !prefersReduced && 'hover:-translate-y-1.5 active:scale-[0.985] focus-visible:-translate-y-1.5'
        )}
      >
        {/* Backplate Top-Left Sculpted Folder Tab (text sits cleanly in upper 0..26px, never overlapped) */}
        <div className="absolute top-0 left-0 right-0 h-12 pointer-events-none select-none overflow-visible">
          <div
            className={cn(
              'relative inline-flex items-start gap-1.5 h-11 pt-2 pl-4 pr-5 rounded-tl-[20px] rounded-tr-[14px] bg-gradient-to-r text-white shadow-[0_6px_16px_-6px_rgba(67,56,202,0.35)]',
              palette.lightBack,
              palette.darkBack
            )}
          >
            <span className="text-[10px] font-semibold tracking-wide uppercase truncate max-w-[135px] text-white/95 leading-none">
              {examCategory}
            </span>
          </div>
        </div>

        {/* Folder Rear Leaf */}
        <div
          className={cn(
            'absolute inset-x-0 top-7 bottom-0.5 rounded-tr-[26px] rounded-b-[26px] rounded-tl-[10px] bg-gradient-to-br transition-shadow duration-250',
            palette.lightBack,
            palette.darkBack,
            palette.lightShadow,
            palette.darkShadow,
            'group-hover:shadow-[0_24px_52px_-14px_rgba(79,70,229,0.36)] dark:group-hover:shadow-[0_26px_56px_-14px_rgba(79,70,229,0.45)]'
          )}
        />

        {/* Peeking Inner Archival Paper Sheet */}
        <div
          aria-hidden="true"
          className={cn(
            'relative z-10 mx-3.5 mt-0 h-7 rounded-t-[16px] bg-white/95 dark:bg-[#16213B] px-3.5 pt-1.5 shadow-[0_-4px_14px_rgba(15,23,42,0.08)] dark:shadow-[0_-4px_14px_rgba(0,0,0,0.45)] transition-transform duration-200 ease-out flex items-start justify-between',
            !prefersReduced && 'group-hover:-translate-y-1.5'
          )}
        >
          <span className="h-1.5 w-14 rounded-full bg-indigo-200/80 dark:bg-indigo-400/25 mt-1" />
          <span className="text-[9px] font-mono text-slate-400 dark:text-slate-400 leading-none mt-0.5">
            {answeredCount}/{session.total_questions} Qs
          </span>
        </div>

        {/* 3D Front Folder Flap */}
        <div
          style={{ transformOrigin: 'bottom center' }}
          className={cn(
            'relative z-20 -mt-2.5 rounded-[24px] bg-gradient-to-br overflow-hidden transition-all duration-200 ease-out transform-gpu',
            palette.lightFlap,
            palette.darkFlap,
            !prefersReduced && 'group-hover:[transform:rotateX(-7deg)]',
            'shadow-[0_-2px_12px_rgba(30,27,75,0.08)] dark:shadow-[0_-4px_18px_rgba(0,0,0,0.35)]'
          )}
        >
          {/* Subtle Specular Top Lighting Edge (no outline/border) */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent" />

          {/* Upper Flap: Time Taken + Status Badge + Exam Identity Centerpiece */}
          <div className="px-4 pt-3.5 pb-3 space-y-3">
            <div className="flex items-center justify-between gap-2">
              {/* Time Taken Pill (Reference 2 Top-Left) */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/75 dark:bg-white/14 text-[11px] font-semibold text-indigo-950 dark:text-white/95 shadow-[0_2px_8px_rgba(49,46,129,0.06)]">
                <Clock className="w-3 h-3 text-indigo-600 dark:text-indigo-200 shrink-0" />
                <span>{formatExamDuration(totalTimeSpent)}</span>
              </span>

              <div className="flex items-center gap-1.5">
                {notes.length > 0 && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-400/25 dark:bg-amber-300/20 text-[10px] font-semibold text-amber-950 dark:text-amber-100"
                    title={`${notes.length} sticky note${notes.length > 1 ? 's' : ''}`}
                  >
                    <StickyNote className="w-2.5 h-2.5" />
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
                  <span className={cn('w-1.5 h-1.5 rounded-full', statusInfo.dotColor)} />
                  <span>{statusInfo.label}</span>
                </span>
              </div>
            </div>

            {/* Center Exam Logo Pedestal (Reference 2 Center) */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-14 h-14 rounded-full bg-white/90 dark:bg-white/16 p-1 shadow-[0_10px_24px_-6px_rgba(67,56,202,0.22)] dark:shadow-[0_10px_26px_-6px_rgba(0,0,0,0.55)] flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105">
                {examLogo && !logoFailed ? (
                  <Image
                    src={examLogo}
                    alt={examCategory}
                    width={56}
                    height={56}
                    onError={() => setLogoFailed(true)}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : session.mode === 'quick_battle' || session.mode === 'speed_battle' ? (
                  <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-100" />
                ) : (
                  <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-100" />
                )}
              </div>
            </div>
          </div>

          {/* Lower Flap Partition Band: Full Exam Name, Date/Time & Results (Reference 2 Bottom) */}
          <div
            className={cn(
              'px-4 py-3.5 backdrop-blur-sm space-y-2',
              palette.lightLip,
              'dark:bg-black/22'
            )}
          >
            <div>
              <h3
                title={session.title}
                className="text-sm font-semibold text-slate-900 dark:text-white truncate leading-snug"
              >
                {session.title}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-600 dark:text-indigo-100/75">
                <Calendar className="w-3 h-3 shrink-0 opacity-80" />
                <span className="truncate">{formattedDate}</span>
              </div>
            </div>

            {/* Result / Score Row + Smooth Progress Bar */}
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="font-medium text-slate-600 dark:text-indigo-100/80">
                  {answeredCount}/{session.total_questions} answered
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
                  style={{ width: `${Math.max(4, Math.min(100, completionPct))}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

