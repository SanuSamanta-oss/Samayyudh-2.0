'use client';

import { cn } from '@/lib/utils';
import { QUESTION_STATE_CONFIG } from '@/lib/constants';
import type { AnswerStatus } from '@/types';
import { CheckCircle2, Circle, Eye, Pencil, Flag, AlertCircle } from 'lucide-react';

interface QuestionNavigatorProps {
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

const statusIcons: Record<AnswerStatus, React.ReactNode> = {
  not_visited: <Circle className="w-3 h-3" />,
  visited: <Eye className="w-3 h-3" />,
  in_progress: <Pencil className="w-3 h-3" />,
  answered: <CheckCircle2 className="w-3 h-3" />,
  flagged: <Flag className="w-3 h-3" />,
  submitted: <CheckCircle2 className="w-3 h-3" />,
};

export function QuestionNavigator({
  totalQuestions,
  currentIndex,
  getQuestionStatus,
  questionIds,
  onNavigate,
  stats,
}: QuestionNavigatorProps) {
  return (
    <div className="bg-white border border-border rounded-xl p-4 space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Answered: <strong>{stats.answered}</strong></span>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span>Visited: <strong>{stats.visited}</strong></span>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-2">
          <span className="w-2 h-2 rounded-full bg-violet-400" />
          <span>Not Visited: <strong>{stats.notVisited}</strong></span>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-2">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span>Flagged: <strong>{stats.flagged}</strong></span>
        </div>
      </div>

      {/* Separator */}
      <div className="h-px bg-border" />

      {/* Question Grid */}
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const qId = questionIds[i];
          const status = qId ? getQuestionStatus(qId) : 'not_visited';
          const config = QUESTION_STATE_CONFIG[status];
          const isCurrent = i === currentIndex;

          return (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={cn(
                'relative w-full aspect-square flex items-center justify-center',
                'rounded-lg text-sm font-medium border transition-all duration-200',
                'hover:scale-105 hover:shadow-sm',
                'focus-visible:ring-2 focus-visible:ring-brand-500',
                config.bgClass, config.textClass, config.borderClass,
                isCurrent && 'ring-2 ring-brand-500 ring-offset-1 scale-105 shadow-md',
                status === 'answered' && 'state-answered',
                status === 'flagged' && 'state-flagged',
              )}
              title={`Question ${i + 1} — ${config.label}`}
              aria-label={`Go to question ${i + 1}, status: ${config.label}`}
              aria-current={isCurrent ? 'true' : undefined}
            >
              {i + 1}
              {/* Status icon */}
              <span className="absolute -top-1 -right-1">
                {statusIcons[status]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="space-y-1.5 pt-2 border-t border-border">
        <p className="text-xs font-medium text-muted mb-2">Legend</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {Object.entries(QUESTION_STATE_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={cn('w-2.5 h-2.5 rounded-full', config.dotClass)} />
              <span>{config.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
