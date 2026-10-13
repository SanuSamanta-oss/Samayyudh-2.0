'use client';

import { cn, formatTime, formatMathText } from '@/lib/utils';
import { getRecommendedTime } from '@/lib/constants';
import type { Question, Answer } from '@/types';
import { Award, Clock, Hash } from 'lucide-react';

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
      <div className="bg-card border border-border rounded-xl p-5 md:p-6">
        <p className="text-base md:text-lg leading-relaxed text-foreground whitespace-pre-line">
          {formatMathText(question.question_text)}
        </p>
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
