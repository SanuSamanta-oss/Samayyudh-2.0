'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn, formatTime } from '@/lib/utils';
import { TIMER_WARNING_THRESHOLD, TIMER_CRITICAL_THRESHOLD } from '@/lib/constants';
import { Clock, AlertTriangle } from 'lucide-react';

interface ExamTimerProps {
  endsAt: string;
  onTimeUp: () => void;
  className?: string;
}

export function ExamTimer({ endsAt, onTimeUp, className }: ExamTimerProps) {
  const [remaining, setRemaining] = useState<number>(0);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const calculateRemaining = useCallback(() => {
    const end = new Date(endsAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((end - now) / 1000));
  }, [endsAt]);

  useEffect(() => {
    setRemaining(calculateRemaining());

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
  }, [calculateRemaining, onTimeUp, isTimeUp]);

  const isWarning = remaining <= TIMER_WARNING_THRESHOLD && remaining > TIMER_CRITICAL_THRESHOLD;
  const isCritical = remaining <= TIMER_CRITICAL_THRESHOLD && remaining > 0;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-semibold transition-all duration-300',
        isTimeUp && 'bg-red-600 text-white',
        isCritical && 'bg-red-100 text-red-700 timer-critical',
        isWarning && 'bg-amber-100 text-amber-700 timer-warning',
        !isWarning && !isCritical && !isTimeUp && 'bg-brand-50 text-brand-700',
        className
      )}
      role="timer"
      aria-live="polite"
      aria-label={`Time remaining: ${formatTime(remaining)}`}
    >
      {isCritical || isTimeUp ? (
        <AlertTriangle className="w-5 h-5" />
      ) : (
        <Clock className="w-5 h-5" />
      )}
      <span>{isTimeUp ? 'TIME UP' : formatTime(remaining)}</span>
    </div>
  );
}
