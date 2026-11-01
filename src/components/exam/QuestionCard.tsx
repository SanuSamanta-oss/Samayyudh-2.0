'use client';

import { cn, formatTime } from '@/lib/utils';
import { getRecommendedTime } from '@/lib/constants';
import type { Question, Answer } from '@/types';
import { Award, Clock, Hash, Image as ImageIcon } from 'lucide-react';
import { MathText } from '@/components/pyq/MathText';

interface QuestionCardProps {
  question: Question;
  answer?: Answer;
  questionIndex: number;
  totalQuestions: number;
}

export function QuestionCard({ question, answer, questionIndex, totalQuestions }: QuestionCardProps) {
  const recommendedSeconds = getRecommendedTime(question.marks);
  const actualSeconds = answer?.time_spent_seconds ?? 0;
  const timeDiff = actualSeconds - recommendedSeconds;
  const isOverTime = timeDiff > 0;

  return (
    <div className="space-y-4">
      {/* Question Header */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 text-sm font-medium text-muted bg-surface-2 px-3 py-1 rounded-lg">
          <Hash className="w-3.5 h-3.5" />
          Question {questionIndex + 1} of {totalQuestions}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-brand-700 bg-brand-50 px-3 py-1 rounded-lg">
          <Award className="w-3.5 h-3.5" />
          {question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}
        </span>
        <span className={cn(
          'text-xs font-medium px-2.5 py-1 rounded-full',
          question.difficulty === 'easy' && 'bg-emerald-100 text-emerald-700',
          question.difficulty === 'medium' && 'bg-amber-100 text-amber-700',
          question.difficulty === 'hard' && 'bg-red-100 text-red-700',
        )}>
          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
        </span>
      </div>

      {/* Question Text */}
      <div className="bg-white dark:bg-[#0f1424] border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 md:p-8 space-y-5 shadow-xs dark:shadow-md">
        <div className="p-5 md:p-6 rounded-2xl bg-stone-50/90 dark:bg-[#151D33] border border-stone-200/90 dark:border-stone-800/90">
          <MathText
            text={question.question_text}
            block
            className="text-base sm:text-lg md:text-xl leading-relaxed text-stone-900 dark:text-stone-50 font-medium"
          />
        </div>

        {question.diagram_url && (
          <div className="p-4 rounded-2xl border-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 max-w-lg shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300 mb-2">
              <ImageIcon className="w-4 h-4" />
              <span>Reference Figure</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={question.diagram_url}
              alt={`Diagram for question ${questionIndex + 1}`}
              className="max-w-full rounded-xl"
            />
          </div>
        )}
      </div>

      {/* Time Info */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted">
          <Clock className="w-4 h-4" />
          <span>Recommended: <strong className="text-foreground">{formatTime(recommendedSeconds)}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-muted">
          <Clock className="w-4 h-4" />
          <span>Actual: <strong className={cn(
            isOverTime ? 'text-red-600' : 'text-emerald-600'
          )}>{formatTime(actualSeconds)}</strong></span>
        </div>
        {actualSeconds > 0 && (
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            isOverTime ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
          )}>
            {isOverTime ? `${formatTime(timeDiff)} Over Time` : 'On Track'}
          </span>
        )}
      </div>
    </div>
  );
}
