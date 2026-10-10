'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { QUESTION_STATE_CONFIG } from '@/lib/constants';
import type { AnswerStatus } from '@/types';
import { X } from 'lucide-react';

interface MobileQuestionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  totalQuestions: number;
  currentIndex: number;
  getQuestionStatus: (questionId: string) => AnswerStatus;
  questionIds: string[];
  onNavigate: (index: number) => void;
  stats: {
    total: number;
    answered: number;
    visited: number;
    flagged: number;
    notVisited: number;
  };
}

export function MobileQuestionDrawer({
  isOpen,
  onClose,
  totalQuestions,
  currentIndex,
  getQuestionStatus,
  questionIds,
  onNavigate,
  stats,
}: MobileQuestionDrawerProps) {
  const [mounted, setMounted] = useState(isOpen);

  if (isOpen && !mounted) {
    setMounted(true);
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleNavigate = useCallback((index: number) => {
    onNavigate(index);
    onClose();
  }, [onNavigate, onClose]);

  if (!mounted && !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out max-h-[75vh] overflow-y-auto',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
        onTransitionEnd={() => { if (!isOpen) setMounted(false); }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-stone-300" />
        </div>

        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Question Navigator</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg bg-emerald-50">
              <span className="font-bold text-emerald-700">{stats.answered}</span>
              <span className="text-emerald-600">Done</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg bg-indigo-50">
              <span className="font-bold text-indigo-700">{stats.visited}</span>
              <span className="text-indigo-600">Seen</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg bg-violet-50">
              <span className="font-bold text-violet-700">{stats.notVisited}</span>
              <span className="text-violet-600">Left</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg bg-red-50">
              <span className="font-bold text-red-700">{stats.flagged}</span>
              <span className="text-red-600">Flag</span>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-6 gap-2 pb-4">
            {Array.from({ length: totalQuestions }, (_, i) => {
              const qId = questionIds[i];
              const status = qId ? getQuestionStatus(qId) : 'not_visited';
              const config = QUESTION_STATE_CONFIG[status];
              const isCurrent = i === currentIndex;

              return (
                <button
                  key={i}
                  onClick={() => handleNavigate(i)}
                  className={cn(
                    'aspect-square flex items-center justify-center',
                    'rounded-xl text-sm font-semibold border-2 transition-all',
                    'active:scale-95',
                    config.bgClass, config.textClass, config.borderClass,
                    isCurrent && 'ring-2 ring-brand-500 ring-offset-2 shadow-md',
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
