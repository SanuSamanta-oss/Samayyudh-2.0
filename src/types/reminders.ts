// ============================================================
// SamayYudh 2.0 — Study Reminders & Notification Settings Types
// ============================================================

export type ReminderTone = 'chime' | 'gong' | 'bell' | 'marimba' | 'custom' | string;

export type RepeatFrequency = 'once' | 'daily' | 'weekdays' | 'weekly' | 'custom';

export type TaskCategory =
  | 'study'
  | 'practice'
  | 'quick_battle'
  | 'practice_battle'
  | 'century'
  | 'full_exam'
  | 'current_affairs'
  | 'questions'
  | 'history'
  | 'analytics'
  | 'streak'
  | 'notes'
  | 'custom'
  // Legacy compatibility fallbacks
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
  repeatType?: RepeatFrequency;
  scheduledDate?: string | null; // YYYY-MM-DD when repeatType === 'once'
  enabled: boolean;
  category: TaskCategory;
  tone?: ReminderTone;
  customToneName?: string;
  notes?: string;
  browserNotification?: boolean;
  pushNotification?: boolean;
  lastTriggeredDate?: string | null;
  completedDate?: string | null; // e.g. "2026-11-11" when marked done
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
    days: [1, 2, 3, 4, 5, 6],
    repeatType: 'custom',
    enabled: true,
    category: 'quick_battle',
    browserNotification: true,
    notes: 'Warm up with 10 fast timed questions in Practice mode.',
  },
  {
    id: 'task-afternoon-pyq',
    title: 'PYQ & Speed Drill',
    time: '14:30',
    days: [1, 2, 3, 4, 5],
    repeatType: 'weekdays',
    enabled: true,
    category: 'practice_battle',
    browserNotification: true,
    notes: 'Solve targeted PYQ questions under exam conditions.',
  },
  {
    id: 'task-evening-mock',
    title: 'Full Exam Mock Simulation',
    time: '18:30',
    days: [0, 2, 4, 6],
    repeatType: 'custom',
    enabled: true,
    category: 'full_exam',
    browserNotification: true,
    notes: 'Complete mock paper under official exam hall timer rules.',
  },
  {
    id: 'task-night-history',
    title: 'History & Mistakes Review',
    time: '21:30',
    days: [1, 2, 3, 4, 5, 6],
    repeatType: 'custom',
    enabled: true,
    category: 'history',
    browserNotification: true,
    notes: 'Analyze incorrect questions and review step-by-step solutions.',
  },
];

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enabled: false,
  studyTime: '20:00',
  days: [0, 1, 2, 3, 4, 5, 6],
  streakProtection: true,
  soundEnabled: true,
  vibrationEnabled: true,
  reminderTone: 'chime',
  customNote: 'Time for your daily Battle with the Clock.',
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
  { label: 'Morning Focus', time: '07:00', icon: 'sunrise' as const },
  { label: 'Afternoon Boost', time: '14:00', icon: 'sun' as const },
  { label: 'Evening Battle', time: '20:00', icon: 'sunset' as const },
  { label: 'Night Sprint', time: '22:00', icon: 'moon' as const },
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
  study: {
    label: 'Study Session',
    sectionName: 'Practice Studio',
    route: '/practice',
    icon: 'book-open',
    color: 'bg-[#EAE5FA] text-[#7667C8]',
    darkColor: 'dark:bg-[#302A48] dark:text-[#C5B9F2]',
  },
  quick_battle: {
    label: 'Quick Battle',
    sectionName: 'Practice Mode',
    route: '/practice?mode=quick_battle',
    icon: 'zap',
    color: 'bg-amber-500/12 text-amber-700',
    darkColor: 'dark:bg-amber-500/15 dark:text-amber-300',
  },
  practice_battle: {
    label: 'Practice Battle',
    sectionName: 'Practice Mode',
    route: '/practice?mode=practice_battle',
    icon: 'swords',
    color: 'bg-[#EAE5FA] text-[#7667C8]',
    darkColor: 'dark:bg-[#302A48] dark:text-[#C5B9F2]',
  },
  century: {
    label: 'Century Challenge',
    sectionName: 'Century Challenge',
    route: '/practice?mode=half_century',
    icon: 'trophy',
    color: 'bg-rose-500/12 text-rose-700',
    darkColor: 'dark:bg-rose-500/15 dark:text-rose-300',
  },
  full_exam: {
    label: 'Exam Simulation',
    sectionName: 'Exams Section',
    route: '/exams',
    icon: 'graduation-cap',
    color: 'bg-purple-500/12 text-purple-700',
    darkColor: 'dark:bg-purple-500/15 dark:text-purple-300',
  },
  current_affairs: {
    label: 'Current Affairs',
    sectionName: 'Practice Hub',
    route: '/practice',
    icon: 'newspaper',
    color: 'bg-sky-500/12 text-sky-700',
    darkColor: 'dark:bg-sky-500/15 dark:text-sky-300',
  },
  questions: {
    label: 'PYQ Practice',
    sectionName: 'PYQ Hub',
    route: '/pyq',
    icon: 'book-open',
    color: 'bg-emerald-500/12 text-emerald-700',
    darkColor: 'dark:bg-emerald-500/15 dark:text-emerald-300',
  },
  history: {
    label: 'Mistake Review',
    sectionName: 'History Section',
    route: '/history',
    icon: 'history',
    color: 'bg-blue-500/12 text-blue-700',
    darkColor: 'dark:bg-blue-500/15 dark:text-blue-300',
  },
  analytics: {
    label: 'Analytics',
    sectionName: 'Analytics Section',
    route: '/analytics',
    icon: 'bar-chart',
    color: 'bg-cyan-500/12 text-cyan-700',
    darkColor: 'dark:bg-cyan-500/15 dark:text-cyan-300',
  },
  streak: {
    label: 'Daily Routine',
    sectionName: 'Badges & Goals',
    route: '/achievements',
    icon: 'flame',
    color: 'bg-orange-500/12 text-orange-700',
    darkColor: 'dark:bg-orange-500/15 dark:text-orange-300',
  },
  notes: {
    label: 'Study Notes',
    sectionName: 'Notes Section',
    route: '/notes',
    icon: 'file-text',
    color: 'bg-emerald-500/12 text-emerald-700',
    darkColor: 'dark:bg-emerald-500/15 dark:text-emerald-300',
  },
  custom: {
    label: 'Custom Task',
    sectionName: 'Practice Mode',
    route: '/practice',
    icon: 'target',
    color: 'bg-[#EAE5FA] text-[#7667C8]',
    darkColor: 'dark:bg-[#302A48] dark:text-[#C5B9F2]',
  },

  // Legacy fallbacks
  practice: {
    label: 'Practice',
    sectionName: 'Practice Mode',
    route: '/practice',
    icon: 'swords',
    color: 'bg-[#EAE5FA] text-[#7667C8]',
    darkColor: 'dark:bg-[#302A48] dark:text-[#C5B9F2]',
  },
  revision: {
    label: 'Revision',
    sectionName: 'Formulas & Notes',
    route: '/formulas',
    icon: 'book-open',
    color: 'bg-purple-500/12 text-purple-700',
    darkColor: 'dark:bg-purple-500/15 dark:text-purple-300',
  },
  mock: {
    label: 'Mock Test',
    sectionName: 'Exams Section',
    route: '/exams',
    icon: 'graduation-cap',
    color: 'bg-emerald-500/12 text-emerald-700',
    darkColor: 'dark:bg-emerald-500/15 dark:text-emerald-300',
  },
  gk: {
    label: 'Current Affairs',
    sectionName: 'Practice Section',
    route: '/practice',
    icon: 'newspaper',
    color: 'bg-amber-500/12 text-amber-700',
    darkColor: 'dark:bg-amber-500/15 dark:text-amber-300',
  },
  vocab: {
    label: 'Mistake Review',
    sectionName: 'History Section',
    route: '/history',
    icon: 'history',
    color: 'bg-pink-500/12 text-pink-700',
    darkColor: 'dark:bg-pink-500/15 dark:text-pink-300',
  },
  math: {
    label: 'Quick Battle',
    sectionName: 'Practice Mode',
    route: '/practice?mode=quick_battle',
    icon: 'zap',
    color: 'bg-cyan-500/12 text-cyan-700',
    darkColor: 'dark:bg-cyan-500/15 dark:text-cyan-300',
  },
  general: {
    label: 'Custom Task',
    sectionName: 'Practice Mode',
    route: '/practice',
    icon: 'target',
    color: 'bg-[#EAE5FA] text-[#7667C8]',
    darkColor: 'dark:bg-[#302A48] dark:text-[#C5B9F2]',
  },
};
