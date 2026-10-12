'use client';

// ============================================================
// SamayYudh 2.0 — SOKHA Avatar & Status Component
// ============================================================

import React from 'react';
import { Sparkles, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SokhaAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  isThinking?: boolean;
  className?: string;
  showOnlineBadge?: boolean;
}

export function SokhaAvatar({
  size = 'md',
  isThinking = false,
  className,
  showOnlineBadge = false,
}: SokhaAvatarProps) {
  const sizeMap = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const iconSizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={cn('relative flex-shrink-0 flex items-center justify-center', className)}>
      {/* Outer ambient glow */}
      <div
        className={cn(
          'absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 blur-sm opacity-60 transition-opacity',
          isThinking && 'opacity-90 animate-pulse'
        )}
      />

      {/* Main avatar bubble */}
      <div
        className={cn(
          'relative rounded-2xl bg-gradient-to-br from-[#1E1238] via-[#121936] to-[#0A0E27] border border-purple-400/40 shadow-inner flex items-center justify-center text-white overflow-hidden',
          sizeMap[size]
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent pointer-events-none" />
        <Bot className={cn('text-purple-300 drop-shadow', iconSizeMap[size])} />
        {isThinking && (
          <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-300 animate-spin" />
        )}
      </div>

      {/* Online indicator */}
      {showOnlineBadge && (
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0B1120] ring-1 ring-emerald-400/50" />
      )}
    </div>
  );
}
