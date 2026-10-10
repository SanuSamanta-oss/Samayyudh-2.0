// ============================================================
// SamayYudh 2.0 — Exam Categories & Configuration
// ============================================================

import { ExamCategory, ExamModeConfig, ExamDurationOption, MarkTimeRule } from '@/types';

export const EXAM_CATEGORIES: ExamCategory[] = [
  {
    code: 'ENGINEERING',
    name: 'GATE',
    description: 'Graduate Aptitude Test in Engineering',
    icon: '🎓',
    logo: '/logos/gate.jpg',
    exams: [],
  },
  {
    code: 'JEE_MAINS',
    name: 'JEE Mains',
    description: 'Joint Entrance Examination — Mains',
    icon: '🚀',
    logo: '/logos/jee_mains.png',
    exams: [],
  },
  {
    code: 'JEE_ADVANCED',
    name: 'JEE Advanced',
    description: 'Joint Entrance Examination — Advanced (IIT)',
    icon: '⭐',
    logo: '/logos/jee_advanced.jpg',
    exams: [],
  },
  {
    code: 'STATE_ENTRANCE',
    name: 'WBJEE',
    description: 'West Bengal Joint Entrance Examination',
    icon: '📐',
    logo: '/logos/wbjee.jpg',
    exams: [],
  },
  {
    code: 'CIVIL_SERVICES',
    name: 'UPSC',
    description: 'Union Public Service Commission',
    icon: '🏛️',
    logo: '/logos/upsc.jpg',
    exams: [],
  },
  {
    code: 'UNIVERSITY',
    name: 'University',
    description: 'University & College Examinations',
    icon: '🏫',
    logo: '/logos/university.jpg',
    exams: [],
  },
  {
    code: 'COMPETITIVE',
    name: 'Competitive Exams',
    description: 'SSC · Banking · Railway · CAT · State Exams',
    icon: '⚔️',
    logo: '/logos/ssc.jpg',
    exams: [],
  },
  {
    code: 'MEDICAL',
    name: 'NEET',
    description: 'National Eligibility cum Entrance Test',
    icon: '🩺',
    logo: '/logos/neet.jpg',
    exams: [],
  },
  {
    code: 'CUSTOM',
    name: 'Custom Exam',
    description: 'Create your own practice exam',
    icon: '⚙️',
    exams: [],
  },
];

export const EXAM_MODES: ExamModeConfig[] = [
  { mode: 'quick_battle', label: 'Quick Battle', description: '10 questions to warm up', questionCount: 10, icon: '⚡' },
  { mode: 'practice_battle', label: 'Practice Battle', description: '25 questions for a solid session', questionCount: 25, icon: '📝' },
  { mode: 'half_century', label: 'Half Century', description: '50 questions — earn your 🏏', questionCount: 50, icon: '🏏' },
  { mode: 'full_century', label: 'Full Century', description: '100 questions — the ultimate test', questionCount: 100, icon: '🏆' },
  { mode: 'full_exam', label: 'Full Exam', description: 'Complete exam simulation', questionCount: 0, icon: '📋' },
  { mode: 'topic_practice', label: 'Topic Practice', description: 'Focus on specific topics', questionCount: 0, icon: '🎯' },
  { mode: 'previous_year', label: 'Previous Year', description: 'Practice with past questions', questionCount: 0, icon: '📚' },
  { mode: 'speed_battle', label: 'Speed Battle', description: 'Race against the clock', questionCount: 0, icon: '🏎️' },
  { mode: 'custom', label: 'Custom', description: 'Choose your own settings', questionCount: 0, icon: '⚙️' },
];

export const EXAM_DURATIONS: ExamDurationOption[] = [
  { label: '30 minutes', minutes: 30, seconds: 1800 },
  { label: '1 hour', minutes: 60, seconds: 3600 },
  { label: '1.5 hours', minutes: 90, seconds: 5400 },
  { label: '2 hours', minutes: 120, seconds: 7200 },
  { label: '3 hours', minutes: 180, seconds: 10800 },
  { label: '4 hours', minutes: 240, seconds: 14400 },
];

export const MAX_EXAM_DURATION_SECONDS = 14400;

export const DEFAULT_MARK_TIME_RULES: MarkTimeRule[] = [
  { id: 'rule-1', marks: 1, time_seconds: 60, label: '1 minute' },
  { id: 'rule-2', marks: 2, time_seconds: 120, label: '2 minutes' },
  { id: 'rule-3', marks: 3, time_seconds: 180, label: '3 minutes' },
  { id: 'rule-4', marks: 4, time_seconds: 240, label: '4 minutes' },
  { id: 'rule-5', marks: 5, time_seconds: 360, label: '6 minutes' },
  { id: 'rule-10', marks: 10, time_seconds: 720, label: '12 minutes' },
];

export function getRecommendedTime(marks: number): number {
  const rule = DEFAULT_MARK_TIME_RULES.find((r) => r.marks === marks);
  return rule?.time_seconds ?? marks * 60;
}

export const QUESTION_STATE_CONFIG = {
  not_visited: { label: 'Not Visited', bgClass: 'bg-violet-100', textClass: 'text-violet-700', borderClass: 'border-violet-300', dotClass: 'bg-violet-400', icon: '○' },
  visited: { label: 'Visited', bgClass: 'bg-indigo-100', textClass: 'text-indigo-700', borderClass: 'border-indigo-300', dotClass: 'bg-indigo-400', icon: '◐' },
  in_progress: { label: 'In Progress', bgClass: 'bg-amber-100', textClass: 'text-amber-700', borderClass: 'border-amber-300', dotClass: 'bg-amber-400', icon: '✎' },
  answered: { label: 'Answered', bgClass: 'bg-emerald-100', textClass: 'text-emerald-700', borderClass: 'border-emerald-300', dotClass: 'bg-emerald-500', icon: '✓' },
  flagged: { label: 'Flagged', bgClass: 'bg-red-100', textClass: 'text-red-700', borderClass: 'border-red-300', dotClass: 'bg-red-400', icon: '⚑' },
  submitted: { label: 'Submitted', bgClass: 'bg-emerald-200', textClass: 'text-emerald-800', borderClass: 'border-emerald-400', dotClass: 'bg-emerald-600', icon: '✓✓' },
} as const;

export const SCORING_WEIGHTS = {
  coverage: 0.4,
  correctness: 0.35,
  time_efficiency: 0.15,
  relevance: 0.1,
};

export const TIMER_WARNING_THRESHOLD = 600;
export const TIMER_CRITICAL_THRESHOLD = 300;
export const AUTOSAVE_DEBOUNCE_MS = 2000;

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/practice', label: 'Practice', icon: 'Swords' },
  { href: '/exams', label: 'Exams', icon: 'GraduationCap' },
  { href: '/questions', label: 'Question Bank', icon: 'Library' },
  { href: '/history', label: 'History', icon: 'History' },
  { href: '/analytics', label: 'Analytics', icon: 'BarChart3' },
  { href: '/notes', label: 'Notes', icon: 'StickyNote' },
] as const;
