import { EXAM_CATEGORIES } from '@/lib/constants';
import { formatDuration } from '@/lib/utils';
import type { Answer, AnswerEvaluation, ExamSession, StickyNote } from '@/types';

export interface SessionArchiveMeta {
  session: ExamSession;
  answers: Answer[];
  evaluations: AnswerEvaluation[];
  notes: StickyNote[];
  answeredCount: number;
  totalTimeSpent: number;
  totalScore: number;
  totalMaxScore: number;
  scorePercent: number | null;
  accuracyPercent: number | null;
  examCategory: string;
  examLogo: string | null;
  subjects: string[];
  topics: string[];
  firstQuestionId: string;
}

export interface FolderGradientTheme {
  id: string;
  /** Light-mode folder backplate gradient (tab + rear leaf) */
  lightBack: string;
  /** Light-mode folder front flap gradient */
  lightFlap: string;
  /** Light-mode hover flap gradient boost */
  lightFlapHover: string;
  /** Light-mode ambient shadow */
  lightShadow: string;
  /** Light-mode lower partition wash */
  lightLip: string;
  /** Dark-mode folder backplate gradient */
  darkBack: string;
  /** Dark-mode folder front flap gradient */
  darkFlap: string;
  /** Dark-mode ambient shadow */
  darkShadow: string;
  /** Accent bar gradient */
  accentBar: string;
}

const FOLDER_PALETTES: FolderGradientTheme[] = [
  {
    id: 'electric-indigo',
    lightBack: 'from-[#6366F1] via-[#5B54F5] to-[#4F46E5]',
    lightFlap: 'from-[#F1EEFF] via-[#E5E2FF] to-[#D6D8FF]',
    lightFlapHover: 'from-[#ECE8FF] via-[#DDD9FF] to-[#CCD0FF]',
    lightShadow: 'shadow-[0_14px_34px_-12px_rgba(79,70,229,0.28)]',
    lightLip: 'bg-white/60',
    darkBack: 'dark:from-[#3730A3] dark:via-[#2E278A] dark:to-[#1E1B4B]',
    darkFlap: 'dark:from-[#4F46E5] dark:via-[#4338CA] dark:to-[#312E81]',
    darkShadow: 'dark:shadow-[0_20px_44px_-14px_rgba(30,27,75,0.85)]',
    accentBar: 'from-[#6366F1] to-[#8B5CF6]',
  },
  {
    id: 'royal-cobalt',
    lightBack: 'from-[#4F6AF5] via-[#455CE8] to-[#3B49DF]',
    lightFlap: 'from-[#EDF3FF] via-[#E0EAFF] to-[#CFDFFF]',
    lightFlapHover: 'from-[#E6EFFF] via-[#D6E3FF] to-[#C2D6FF]',
    lightShadow: 'shadow-[0_14px_34px_-12px_rgba(59,73,223,0.26)]',
    lightLip: 'bg-white/62',
    darkBack: 'dark:from-[#2C44B5] dark:via-[#233794] dark:to-[#16225E]',
    darkFlap: 'dark:from-[#425AE5] dark:via-[#3449C7] dark:to-[#243294]',
    darkShadow: 'dark:shadow-[0_20px_44px_-14px_rgba(15,23,66,0.85)]',
    accentBar: 'from-[#4F6AF5] to-[#6366F1]',
  },
  {
    id: 'amethyst-violet',
    lightBack: 'from-[#7C5DF6] via-[#714AEF] to-[#6338E2]',
    lightFlap: 'from-[#F4EEFF] via-[#EAE0FF] to-[#DDD0FF]',
    lightFlapHover: 'from-[#EFE6FF] via-[#E3D5FF] to-[#D4C2FF]',
    lightShadow: 'shadow-[0_14px_34px_-12px_rgba(109,40,217,0.26)]',
    lightLip: 'bg-white/60',
    darkBack: 'dark:from-[#5428A8] dark:via-[#431E8A] dark:to-[#2B125E]',
    darkFlap: 'dark:from-[#6D41D9] dark:via-[#5B2EC0] dark:to-[#3F1D8E]',
    darkShadow: 'dark:shadow-[0_20px_44px_-14px_rgba(32,12,68,0.85)]',
    accentBar: 'from-[#8B5CF6] to-[#6366F1]',
  },
  {
    id: 'periwinkle-dusk',
    lightBack: 'from-[#6C63FF] via-[#5E54F0] to-[#4E44DC]',
    lightFlap: 'from-[#F0EFFF] via-[#E4E3FF] to-[#D4D6FF]',
    lightFlapHover: 'from-[#EAE9FF] via-[#DCD9FF] to-[#CACBFF]',
    lightShadow: 'shadow-[0_14px_34px_-12px_rgba(99,91,255,0.27)]',
    lightLip: 'bg-white/60',
    darkBack: 'dark:from-[#3D359C] dark:via-[#302880] dark:to-[#1E1957]',
    darkFlap: 'dark:from-[#564EE2] dark:via-[#463EC4] dark:to-[#2F2890]',
    darkShadow: 'dark:shadow-[0_20px_44px_-14px_rgba(20,16,66,0.85)]',
    accentBar: 'from-[#6C63FF] to-[#A78BFA]',
  },
  {
    id: 'soft-lavender-indigo',
    lightBack: 'from-[#7068F4] via-[#6056E8] to-[#5246D8]',
    lightFlap: 'from-[#F5F2FF] via-[#ECE7FF] to-[#DFE1FF]',
    lightFlapHover: 'from-[#EFEBFF] via-[#E4DDFF] to-[#D5D7FF]',
    lightShadow: 'shadow-[0_14px_34px_-12px_rgba(88,80,236,0.25)]',
    lightLip: 'bg-white/62',
    darkBack: 'dark:from-[#433399] dark:via-[#34267D] dark:to-[#1F174F]',
    darkFlap: 'dark:from-[#5E4BD6] dark:via-[#4D3BB8] dark:to-[#352687]',
    darkShadow: 'dark:shadow-[0_20px_44px_-14px_rgba(24,18,64,0.85)]',
    accentBar: 'from-[#7C3AED] to-[#4F46E5]',
  },
];

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Selects a harmonized folder gradient palette deterministically based on
 * the exam category and session identity so folders look distinct yet cohesive.
 */
export function getFolderThemePalette(
  examCategory: string,
  sessionId: string
): FolderGradientTheme {
  const seed = hashString(`${examCategory}:${sessionId}`);
  return FOLDER_PALETTES[seed % FOLDER_PALETTES.length];
}

/**
 * Resolves the human-readable exam category and optional asset logo path
 * strictly from EXAM_CATEGORIES metadata and known exam code prefixes.
 */
export function resolveExamIdentity(
  examCode?: string | null,
  sessionTitle?: string | null
): { categoryName: string; logo: string | null } {
  const code = (examCode || '').trim();
  const title = (sessionTitle || '').trim();
  const combined = `${code} ${title}`.toUpperCase();

  // 1. Exact category or sub-exam lookup
  for (const cat of EXAM_CATEGORIES) {
    if (
      cat.code.toUpperCase() === code.toUpperCase() ||
      cat.name.toUpperCase() === code.toUpperCase()
    ) {
      return { categoryName: cat.name, logo: cat.logo || null };
    }
    const sub = cat.exams?.find(
      (e) =>
        e.exam_code.toUpperCase() === code.toUpperCase() ||
        e.exam_name.toUpperCase() === code.toUpperCase()
    );
    if (sub) {
      return { categoryName: cat.name, logo: cat.logo || null };
    }
  }

  // 2. Prefix / keyword match on code or title
  if (combined.includes('GATE')) {
    return { categoryName: 'GATE', logo: '/logos/gate.png' };
  }
  if (combined.includes('JEE_ADVANCED') || combined.includes('JEE ADVANCED')) {
    return { categoryName: 'JEE Advanced', logo: '/logos/jee_advanced.jpg' };
  }
  if (combined.includes('JEE')) {
    return { categoryName: 'JEE Main', logo: '/logos/jee_mains.png' };
  }
  if (combined.includes('NEET')) {
    return { categoryName: 'NEET UG', logo: '/logos/neet.jpg' };
  }
  if (combined.includes('WBJEE') || combined.includes('STATE_ENTRANCE')) {
    return { categoryName: 'WBJEE', logo: '/logos/wbjee.jpg' };
  }
  if (combined.includes('UPSC') || combined.includes('CIVIL_SERVICES')) {
    return { categoryName: 'UPSC', logo: '/logos/upsc.jpg' };
  }
  if (combined.includes('UNIVERSITY')) {
    return { categoryName: 'University', logo: '/logos/university.jpg' };
  }
  if (combined.includes('SSC') || combined.includes('COMPETITIVE')) {
    return { categoryName: 'Competitive Exams', logo: '/logos/ssc.jpg' };
  }

  if (code) {
    return { categoryName: code.replace(/_/g, ' '), logo: null };
  }
  return { categoryName: 'Practice Exam', logo: null };
}

/**
 * Formats duration in seconds cleanly, showing seconds when under one minute
 * while preserving the existing `0m` display when truly 0 seconds.
 */
export function formatExamDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0m';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  return formatDuration(seconds);
}

export const STATUS_DISPLAY: Record<
  string,
  { label: string; lightPill: string; darkPill: string; dotColor: string }
> = {
  completed: {
    label: 'Completed',
    lightPill: 'bg-emerald-500/15 text-emerald-800',
    darkPill: 'dark:bg-emerald-400/20 dark:text-emerald-200',
    dotColor: 'bg-emerald-500',
  },
  submitted: {
    label: 'Submitted',
    lightPill: 'bg-indigo-600/12 text-indigo-900',
    darkPill: 'dark:bg-white/18 dark:text-white',
    dotColor: 'bg-indigo-500 dark:bg-indigo-300',
  },
  evaluated: {
    label: 'Evaluated',
    lightPill: 'bg-violet-600/15 text-violet-900',
    darkPill: 'dark:bg-violet-300/20 dark:text-violet-100',
    dotColor: 'bg-violet-500 dark:bg-violet-300',
  },
  in_progress: {
    label: 'In Progress',
    lightPill: 'bg-amber-500/18 text-amber-900',
    darkPill: 'dark:bg-amber-400/22 dark:text-amber-200',
    dotColor: 'bg-amber-500 dark:bg-amber-300',
  },
  paused: {
    label: 'Paused',
    lightPill: 'bg-slate-900/10 text-slate-700',
    darkPill: 'dark:bg-white/15 dark:text-slate-200',
    dotColor: 'bg-slate-500',
  },
  setup: {
    label: 'Draft Setup',
    lightPill: 'bg-slate-900/10 text-slate-700',
    darkPill: 'dark:bg-white/15 dark:text-slate-200',
    dotColor: 'bg-slate-400',
  },
};

