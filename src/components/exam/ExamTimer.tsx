'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn, formatTime } from '@/lib/utils';
import { TIMER_WARNING_THRESHOLD, TIMER_CRITICAL_THRESHOLD } from '@/lib/constants';
import { Clock, AlertTriangle } from 'lucide-react';

interface ExamTimerProps {
  endsAt: string;
  onTimeUp: () => void;
  className?: string;
  isPaused?: boolean;
}

export function ExamTimer({ endsAt, onTimeUp, className, isPaused = false }: ExamTimerProps) {
  const [remaining, setRemaining] = useState<number>(0);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const calculateRemaining = useCallback(() => {
    const end = new Date(endsAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((end - now) / 1000));
  }, [endsAt]);

  useEffect(() => {
    setTimeout(() => {
      setRemaining(calculateRemaining());
    }, 0);

    if (isPaused) return;

    const interval = setInterval(() => {
      const r = calculateRemaining();
      setRemaining(r);
      if (r <= 0 && !isTimeUp) {
        setIsTimeUp(true);
        onTimeUp();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateRemaining, onTimeUp, isTimeUp, isPaused]);

  const isWarning = remaining <= TIMER_WARNING_THRESHOLD && remaining > TIMER_CRITICAL_THRESHOLD;
  const isCritical = remaining <= TIMER_CRITICAL_THRESHOLD && remaining > 0;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full font-mono text-sm sm:text-base font-bold transition-all duration-200 border-0 outline-none select-none shadow-sm',
        isTimeUp && 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.5)]',
        isCritical && 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-200 animate-pulse',
        isWarning && 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-200',
        !isWarning && !isCritical && !isTimeUp &&
          'bg-purple-100/80 text-purple-700 hover:bg-purple-100 shadow-[0_2px_8px_rgba(147,51,234,0.08)] dark:bg-[#1E293B] dark:text-white dark:hover:bg-[#28354D] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)]',
        className
      )}
      role="timer"
      aria-live="polite"
      aria-label={`Time remaining: ${formatTime(remaining)}`}
    >
      {isCritical || isTimeUp ? (
        <AlertTriangle className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
      ) : (
        <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-purple-600 dark:text-white transition-colors" />
      )}
      <span className="tracking-tight">{isTimeUp ? 'TIME UP' : formatTime(remaining)}</span>
    </div>
  );
}
