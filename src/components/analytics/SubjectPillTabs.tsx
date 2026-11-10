'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Calculator, Atom, FlaskConical, Cpu,
  Layers, Sparkles, Binary, Stethoscope, Compass
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubjectPillTabsProps {
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
  subjects: { name: string; count: number }[];
}

/**
 * Rounded-Corner Subject Pill Tabs (Smooth, No Outlines, Refined Sizing)
 * Features:
 * - Rounded-2xl pill containers with vector icons
 * - Clean dual-theme styling (Light mode: soft white pills; Dark mode: dark navy pills)
 * - Zero harsh border strokes or outlines
 */
export function SubjectPillTabs({
  selectedSubject,
  onSelectSubject,
  subjects,
}: SubjectPillTabsProps) {
  const getSubjectIcon = (name: string) => {
    const s = name.toLowerCase();
    if (s.includes('math') || s.includes('algebra') || s.includes('calculus')) {
      return <Calculator className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
    }
    if (s.includes('physic') || s.includes('mechanic') || s.includes('electro')) {
      return <Atom className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />;
    }
    if (s.includes('chem') || s.includes('organic') || s.includes('bond')) {
      return <FlaskConical className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
    }
    if (s.includes('comput') || s.includes('gate') || s.includes('algorithm') || s.includes('data struct')) {
      return <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
    }
    if (s.includes('bio') || s.includes('botany') || s.includes('zoology') || s.includes('neet')) {
      return <Stethoscope className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
    }
    return <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
  };

  const allItems = [
    { name: 'All Subjects', count: subjects.reduce((sum, s) => sum + s.count, 0) },
    ...subjects,
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
      {allItems.map((sub) => {
        const isSelected = selectedSubject === sub.name;
        return (
          <motion.button
            key={sub.name}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelectSubject(sub.name)}
            className={cn(
              'relative flex items-center gap-2 px-3.5 py-2 rounded-2xl transition-all cursor-pointer whitespace-nowrap text-[11px] font-bold shadow-xs group',
              isSelected
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-[#111A2E] text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            )}
          >
            {/* Subject Icon */}
            <span className={cn('shrink-0 transition-transform group-hover:scale-110', isSelected && 'brightness-200 contrast-200')}>
              {sub.name === 'All Subjects' ? (
                <Layers className={cn('w-3.5 h-3.5', isSelected ? 'text-white' : 'text-purple-600 dark:text-purple-400')} />
              ) : (
                getSubjectIcon(sub.name)
              )}
            </span>

            {/* Subject Label */}
            <span>{sub.name}</span>

            {/* Question Count Badge */}
            {sub.count > 0 && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold transition-colors',
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-100 dark:bg-[#1E2D4A] text-stone-600 dark:text-stone-300'
                )}
              >
                {sub.count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
