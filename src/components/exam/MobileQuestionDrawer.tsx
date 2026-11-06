'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { Answer, AnswerStatus } from '@/types';
import { X } from 'lucide-react';
import { QuestionNavigator } from './QuestionNavigator';

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
    inProgress?: number;
    correct?: number;
    wrong?: number;
  };
  answers?: Map<string, Answer>;
  onToggleFlag?: (questionId: string) => void;
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
  answers,
  onToggleFlag,
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
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavigate = useCallback(
    (index: number) => {
      onNavigate(index);
      onClose();
    },
    [onNavigate, onClose]
  );

  if (!mounted && !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300 md:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out max-h-[85vh] overflow-y-auto md:hidden border-t border-border',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
        onTransitionEnd={() => {
          if (!isOpen) setMounted(false);
        }}
      >
        {/* Handle & Close */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm px-4 pt-3 pb-2 flex items-center justify-between border-b border-border/60">
          <div className="w-8" />
          <div className="w-10 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close question drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          <QuestionNavigator
            totalQuestions={totalQuestions}
            currentIndex={currentIndex}
            getQuestionStatus={getQuestionStatus}
            questionIds={questionIds}
            onNavigate={handleNavigate}
            stats={stats}
            answers={answers}
            onToggleFlag={onToggleFlag}
            isMobileDrawer
          />
        </div>
      </div>
    </>
  );
}
