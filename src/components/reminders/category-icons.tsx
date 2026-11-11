'use client';

import React from 'react';
import {
  BarChart3,
  BookOpen,
  FileText,
  Flame,
  GraduationCap,
  History,
  Moon,
  Newspaper,
  Sun,
  Sunrise,
  Sunset,
  Swords,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import type { TaskCategory } from '@/types/reminders';

export function CategoryIcon({
  category,
  className = 'w-4 h-4',
}: {
  category: TaskCategory;
  className?: string;
}) {
  switch (category) {
    case 'quick_battle':
    case 'math':
      return <Zap className={className} />;
    case 'practice_battle':
    case 'practice':
      return <Swords className={className} />;
    case 'century':
      return <Trophy className={className} />;
    case 'full_exam':
    case 'mock':
      return <GraduationCap className={className} />;
    case 'current_affairs':
    case 'gk':
      return <Newspaper className={className} />;
    case 'questions':
    case 'study':
    case 'revision':
      return <BookOpen className={className} />;
    case 'history':
    case 'vocab':
      return <History className={className} />;
    case 'analytics':
      return <BarChart3 className={className} />;
    case 'streak':
      return <Flame className={className} />;
    case 'notes':
      return <FileText className={className} />;
    case 'custom':
    case 'general':
    default:
      return <Target className={className} />;
  }
}

export function PresetTimeIcon({
  preset,
  className = 'w-4 h-4',
}: {
  preset: 'sunrise' | 'sun' | 'sunset' | 'moon';
  className?: string;
}) {
  switch (preset) {
    case 'sunrise':
      return <Sunrise className={className} />;
    case 'sun':
      return <Sun className={className} />;
    case 'sunset':
      return <Sunset className={className} />;
    case 'moon':
      return <Moon className={className} />;
  }
}

