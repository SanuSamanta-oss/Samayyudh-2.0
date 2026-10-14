// ============================================================
// SamayYudh 2.0 — Study Reminders & Notification Settings Types
// ============================================================

export type ReminderTone = 'chime' | 'gong' | 'bell' | 'marimba' | 'custom' | string;

export type TaskCategory =
  | 'quick_battle'
  | 'practice_battle'
  | 'century'
  | 'full_exam'
  | 'questions'
  | 'history'
  | 'analytics'
  | 'streak'
  | 'notes'
  // Legacy compatibility fallbacks
  | 'practice'
  | 'revision'
  | 'mock'
  | 'gk'
  | 'vocab'
  | 'math'
  | 'general';

export interface CustomTaskReminder {
  id: string;
  title: string;
  time: string; // 24h format "HH:mm" (e.g., "07:30")
  days: number[]; // Days of the week (0 = Sun, 1 = Mon, ..., 6 = Sat)
  enabled: boolean;
  category: TaskCategory;
  tone?: ReminderTone;
  customToneName?: string;
  notes?: string;
  lastTriggeredDate?: string | null;
  completedDate?: string | null; // e.g. "2026-10-14" when student marks done
}

export interface ReminderSettings {
  /** Master toggle for daily study reminders */
  enabled: boolean;
  /** Scheduled alarm time in 24h format "HH:mm" (e.g., "20:00" for 8:00 PM) */
  studyTime: string;
  /** Days of the week to remind (0 = Sunday, 1 = Monday, ..., 6 = Saturday) */
  days: number[];
  /** Alert 2 hours before midnight if daily practice is not yet completed */
  streakProtection: boolean;
  /** Play pleasant study chime / gong sound when reminder triggers */
  soundEnabled: boolean;
  /** Device vibration for mobile browsers / PWA */
  vibrationEnabled: boolean;
  /** Selected sound tone */
  reminderTone: ReminderTone;
  /** Optional custom uploaded audio tune name */
  customToneName?: string;
  /** Optional custom uploaded audio tune size */
  customToneSize?: string;
  /** Custom motivational message */
  customNote?: string;
  /** ISO date string (YYYY-MM-DD) of when the alarm was last fired */
  lastTriggeredDate?: string | null;
  /** Epoch timestamp until which reminders are snoozed */
  snoozedUntil?: number | null;
  /** Browser push subscription status */
  pushSubscribed?: boolean;
  /** Student custom day-to-day task reminders */
  customTasks: CustomTaskReminder[];
}

export const DEFAULT_STUDENT_TASKS: CustomTaskReminder[] = [
  {
    id: 'task-morning-quick-battle',
    title: 'Morning Quick Battle (10 Qs)',
    time: '07:30',
    days: [1, 2, 3, 4, 5, 6], // Mon - Sat
    enabled: true,
    category: 'quick_battle',
    notes: 'Warm up with 10 fast timed questions in Practice mode.',
  },
  {
    id: 'task-afternoon-pyq',
    title: 'Question Bank & PYQ Drill',
    time: '14:30',
    days: [1, 2, 3, 4, 5],
    enabled: true,
    category: 'questions',
    notes: 'Solve targeted questions from the Question Bank library.',
  },
  {
    id: 'task-evening-mock',
    title: 'Full Exam Mock Simulation',
    time: '18:30',
    days: [0, 2, 4, 6],
    enabled: true,
    category: 'full_exam',
    notes: 'Complete mock paper under official exam hall timer rules.',
  },
  {
    id: 'task-night-history',
    title: 'History & Mistakes Review',
    time: '21:30',
    days: [1, 2, 3, 4, 5, 6],
    enabled: true,
    category: 'history',
    notes: 'Analyze incorrect questions and review step-by-step solutions.',
  },
];

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enabled: false,
  studyTime: '20:00', // Default 8:00 PM
  days: [0, 1, 2, 3, 4, 5, 6], // Every day by default
  streakProtection: true,
  soundEnabled: true,
  vibrationEnabled: true,
  reminderTone: 'chime',
  customNote: 'Time for your daily Battle with the Clock! ⚔️',
  lastTriggeredDate: null,
  snoozedUntil: null,
  pushSubscribed: false,
  customTasks: DEFAULT_STUDENT_TASKS,
};

export const DAY_LABELS = [
  { day: 0, short: 'Sun', letter: 'S' },
  { day: 1, short: 'Mon', letter: 'M' },
  { day: 2, short: 'Tue', letter: 'T' },
  { day: 3, short: 'Wed', letter: 'W' },
  { day: 4, short: 'Thu', letter: 'T' },
  { day: 5, short: 'Fri', letter: 'F' },
  { day: 6, short: 'Sat', letter: 'S' },
];

export const TIME_PRESETS = [
  { label: 'Morning Focus', time: '07:00', icon: '🌅' },
  { label: 'Afternoon Boost', time: '14:00', icon: '☀️' },
  { label: 'Evening Battle', time: '20:00', icon: '🌆' },
  { label: 'Night Sprint', time: '22:00', icon: '🌙' },
];

export const CATEGORY_META: Record<
  TaskCategory,
  {
    label: string;
    sectionName: string;
    route: string;
    icon: string;
    color: string;
    darkColor: string;
  }
> = {
  quick_battle: {
    label: 'Quick Battle (10 Qs)',
    sectionName: 'Practice Mode',
    route: '/practice?mode=quick_battle',
    icon: '⚡',
    color: 'bg-amber-100 text-amber-700',
    darkColor: 'dark:bg-amber-950/60 dark:text-amber-300',
  },
  practice_battle: {
    label: 'Practice Battle (25 Qs)',
    sectionName: 'Practice Mode',
    route: '/practice?mode=practice_battle',
    icon: '⚔️',
    color: 'bg-indigo-100 text-indigo-700',
    darkColor: 'dark:bg-indigo-950/60 dark:text-indigo-300',
  },
  century: {
    label: 'Century Run (50/100 Qs)',
    sectionName: 'Century Challenge',
    route: '/practice?mode=half_century',
    icon: '🏆',
    color: 'bg-rose-100 text-rose-700',
    darkColor: 'dark:bg-rose-950/60 dark:text-rose-300',
  },
  full_exam: {
    label: 'Full Exam Simulation',
    sectionName: 'Exams Section',
    route: '/exams',
    icon: '🎓',
    color: 'bg-purple-100 text-purple-700',
    darkColor: 'dark:bg-purple-950/60 dark:text-purple-300',
  },
  questions: {
    label: 'Question Bank & PYQ',
    sectionName: 'Question Bank',
    route: '/questions',
    icon: '📚',
    color: 'bg-emerald-100 text-emerald-700',
    darkColor: 'dark:bg-emerald-950/60 dark:text-emerald-300',
  },
  history: {
    label: 'History & Mistake Review',
    sectionName: 'History Section',
    route: '/history',
    icon: '🕒',
    color: 'bg-blue-100 text-blue-700',
    darkColor: 'dark:bg-blue-950/60 dark:text-blue-300',
  },
  analytics: {
    label: 'Analytics & Speed Stats',
    sectionName: 'Analytics Section',
    route: '/analytics',
    icon: '📊',
    color: 'bg-cyan-100 text-cyan-700',
    darkColor: 'dark:bg-cyan-950/60 dark:text-cyan-300',
  },
  streak: {
    label: 'Streak Shield & Goal',
    sectionName: 'Badges & Goals',
    route: '/achievements',
    icon: '🔥',
    color: 'bg-orange-100 text-orange-700',
    darkColor: 'dark:bg-orange-950/60 dark:text-orange-300',
  },
  notes: {
    label: 'Formula & Study Notes',
    sectionName: 'Notes Section',
    route: '/notes',
    icon: '📝',
    color: 'bg-emerald-100 text-emerald-700',
    darkColor: 'dark:bg-emerald-950/60 dark:text-emerald-300',
  },

  // Legacy fallbacks
  practice: {
    label: 'Practice Battle',
    sectionName: 'Practice Mode',
    route: '/practice',
    icon: '⚔️',
    color: 'bg-indigo-100 text-indigo-700',
    darkColor: 'dark:bg-indigo-950/60 dark:text-indigo-300',
  },
  revision: {
    label: 'Concept Revision',
    sectionName: 'Question Bank',
    route: '/questions',
    icon: '📖',
    color: 'bg-purple-100 text-purple-700',
    darkColor: 'dark:bg-purple-950/60 dark:text-purple-300',
  },
  mock: {
    label: 'Full Mock Test',
    sectionName: 'Exams Section',
    route: '/exams',
    icon: '📝',
    color: 'bg-emerald-100 text-emerald-700',
    darkColor: 'dark:bg-emerald-950/60 dark:text-emerald-300',
  },
  gk: {
    label: 'GK & Question Bank',
    sectionName: 'Question Bank',
    route: '/questions',
    icon: '📰',
    color: 'bg-amber-100 text-amber-700',
    darkColor: 'dark:bg-amber-950/60 dark:text-amber-300',
  },
  vocab: {
    label: 'Mistake Review',
    sectionName: 'History Section',
    route: '/history',
    icon: '🧠',
    color: 'bg-pink-100 text-pink-700',
    darkColor: 'dark:bg-pink-950/60 dark:text-pink-300',
  },
  math: {
    label: 'Quick Battle',
    sectionName: 'Practice Mode',
    route: '/practice?mode=quick_battle',
    icon: '📐',
    color: 'bg-cyan-100 text-cyan-700',
    darkColor: 'dark:bg-cyan-950/60 dark:text-cyan-300',
  },
  general: {
    label: 'Daily Study Battle',
    sectionName: 'Practice Mode',
    route: '/practice',
    icon: '🎯',
    color: 'bg-violet-100 text-violet-700',
    darkColor: 'dark:bg-violet-950/60 dark:text-violet-300',
  },
};

