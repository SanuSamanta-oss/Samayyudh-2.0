'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight,
  Check,
  Edit3,
  MoreHorizontal,
  Power,
  Trash2,
} from 'lucide-react';
import { CATEGORY_META, type TaskCategory } from '@/types/reminders';
import { CategoryIcon } from './category-icons';

export interface ReminderRowProps {
  id: string;
  kind: 'custom' | 'battle' | 'streak';
  title: string;
  description?: string;
  category: TaskCategory;
  formattedTime: string;
  countdown?: string;
  enabled: boolean;
  completed?: boolean;
  canComplete?: boolean;
  canDelete?: boolean;
  onToggleEnabled: () => void;
  onToggleCompleted?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function ReminderRow({
  kind,
  title,
  description,
  category,
  formattedTime,
  countdown,
  enabled,
  completed = false,
  canComplete = false,
  canDelete = false,
  onToggleEnabled,
  onToggleCompleted,
  onEdit,
  onDelete,
}: ReminderRowProps) {
  const prefersReducedMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const meta = CATEGORY_META[category] || CATEGORY_META.custom;

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const statusText = completed ? 'Completed' : enabled ? 'Active' : 'Paused';

  return (
    <motion.div
      layout
      initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: completed ? 0.68 : 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
      transition={{ duration: prefersReducedMotion ? 0.1 : 0.24, ease: EASE }}
      className={`group relative rounded-[16px] px-3.5 py-3 sm:px-4 sm:py-3.5 transition-colors duration-200 ${
        completed
          ? 'bg-[#F0EDF8]/55 dark:bg-[#20202C]/55'
          : kind === 'streak'
            ? 'bg-amber-500/[0.06] hover:bg-amber-500/[0.1] dark:bg-amber-500/[0.08] dark:hover:bg-amber-500/[0.12]'
            : 'bg-[#F0EDF8]/75 hover:bg-[#EAE6F5] dark:bg-[#20202C] dark:hover:bg-[#29283A]'
      }`}
    >
      <div className="flex items-start sm:items-center justify-between gap-3">
        {/* Left: Completion Trigger / Category Icon + Content */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {canComplete && onToggleCompleted ? (
            <button
              type="button"
              onClick={onToggleCompleted}
              aria-label={completed ? `Mark "${title}" incomplete` : `Mark "${title}" completed`}
              className={`mt-0.5 w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7667C8]/45 ${
                completed
                  ? 'bg-emerald-500 text-white shadow-[0_2px_8px_rgba(16,185,129,0.28)]'
                  : 'bg-white dark:bg-[#181822] text-[#7667C8] dark:text-[#8D7BE0] hover:bg-[#EAE5FA] dark:hover:bg-[#302A48] shadow-[0_2px_8px_rgba(30,25,60,0.035)]'
              }`}
              title={completed ? 'Completed today (click to undo)' : 'Mark completed'}
            >
              {completed ? (
                <motion.span
                  initial={prefersReducedMotion ? false : { scale: 0.7 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2, ease: EASE }}
                >
                  <Check className="w-4 h-4 stroke-[2.6]" />
                </motion.span>
              ) : (
                <CategoryIcon category={category} className="w-4 h-4 stroke-[1.9]" />
              )}
            </button>
          ) : (
            <div
              className={`mt-0.5 w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(30,25,60,0.035)] ${
                kind === 'streak'
                  ? 'bg-amber-500/14 text-amber-600 dark:bg-amber-500/18 dark:text-amber-400'
                  : 'bg-white dark:bg-[#181822] text-[#7667C8] dark:text-[#8D7BE0]'
              }`}
            >
              <CategoryIcon category={category} className="w-4 h-4 stroke-[1.9]" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
              <h4
                className={`text-[14px] sm:text-[15px] font-semibold tracking-tight transition-colors ${
                  completed
                    ? 'line-through text-[#77758A] dark:text-[#858195]'
                    : 'text-[#25233A] dark:text-[#F5F3FF]'
                }`}
              >
                {title}
              </h4>
              <span className="text-[11px] font-medium text-[#77758A] dark:text-[#B0ADBF]">
                {meta.label}
              </span>
            </div>

            {description && (
              <p className="text-xs text-[#77758A] dark:text-[#B0ADBF] mt-0.5 line-clamp-1">
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs">
              <span className="font-semibold tabular-nums text-[#7667C8] dark:text-[#8D7BE0]">
                {formattedTime}
              </span>

              {countdown && enabled && !completed && (
                <span className="text-[11px] font-medium text-[#A19EB1] dark:text-[#858195]">
                  {countdown}
                </span>
              )}

              <Link
                href={meta.route}
                className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#77758A] hover:text-[#7667C8] dark:text-[#B0ADBF] dark:hover:text-[#8D7BE0] transition-colors"
              >
                <span>{meta.sectionName}</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Status, Switch & More Menu */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span
            className={`hidden sm:inline-block text-[11px] font-medium ${
              completed
                ? 'text-emerald-600 dark:text-emerald-400'
                : enabled
                  ? 'text-[#7667C8] dark:text-[#8D7BE0]'
                  : 'text-[#A19EB1] dark:text-[#858195]'
            }`}
          >
            {statusText}
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label={`Toggle ${title}`}
            onClick={onToggleEnabled}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7667C8]/45 ${
              enabled
                ? 'bg-[#7667C8] dark:bg-[#8D7BE0]'
                : 'bg-[#D9D4EA] dark:bg-[#302A48]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'
              }`}
            />
          </button>

          {/* Contextual Options Dropdown */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={`More options for ${title}`}
              aria-expanded={menuOpen}
              className="w-7 h-7 rounded-[10px] flex items-center justify-center text-[#77758A] hover:text-[#25233A] hover:bg-white dark:text-[#B0ADBF] dark:hover:text-[#F5F3FF] dark:hover:bg-[#181822] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7667C8]/45"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-9 z-40 w-44 rounded-[14px] bg-white dark:bg-[#181822] p-1.5 shadow-[0_16px_40px_rgba(30,25,60,0.12)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
              >
                {onEdit && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-[10px] text-xs font-medium text-[#25233A] dark:text-[#F5F3FF] hover:bg-[#F0EDF8] dark:hover:bg-[#29283A] transition-colors cursor-pointer text-left"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#7667C8] dark:text-[#8D7BE0]" />
                    <span>Edit reminder</span>
                  </button>
                )}

                {canComplete && onToggleCompleted && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onToggleCompleted();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-[10px] text-xs font-medium text-[#25233A] dark:text-[#F5F3FF] hover:bg-[#F0EDF8] dark:hover:bg-[#29283A] transition-colors cursor-pointer text-left"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{completed ? 'Mark active' : 'Mark completed'}</span>
                  </button>
                )}

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onToggleEnabled();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-[10px] text-xs font-medium text-[#25233A] dark:text-[#F5F3FF] hover:bg-[#F0EDF8] dark:hover:bg-[#29283A] transition-colors cursor-pointer text-left"
                >
                  <Power className="w-3.5 h-3.5 text-[#77758A] dark:text-[#B0ADBF]" />
                  <span>{enabled ? 'Disable' : 'Enable'}</span>
                </button>

                {canDelete && onDelete && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-[10px] text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/35 transition-colors cursor-pointer text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

