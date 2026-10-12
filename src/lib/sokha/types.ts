// ============================================================
// SamayYudh 2.0 — Assistant Types & Prompts
// ============================================================

export interface SokhaSource {
  title: string;
  url: string;
  domain: string;
}

export interface SokhaMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: SokhaSource[];
  redactedTypes?: string[];
  isError?: boolean;
}

export interface SokhaThread {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: SokhaMessage[];
}

export interface QuickActionPrompt {
  icon: string;
  label: string;
  prompt: string;
  routeHref?: string;
}

export const SAMAYYUDH_QUICK_PROMPTS: QuickActionPrompt[] = [
  {
    icon: '⚡',
    label: 'Start Quick Battle',
    prompt: 'How do I start a 10-minute Quick Battle session in SamayYudh 2.0?',
    routeHref: '/practice',
  },
  {
    icon: '⏱️',
    label: 'Exam Timer Rules',
    prompt: 'How do the recommended time limits (2-min, 5-min, 10-min) work during an exam?',
  },
  {
    icon: '🏆',
    label: 'Check My Badges & Streak',
    prompt: 'How do I earn streaks, qualifying study days, and Century badges?',
    routeHref: '/achievements',
  },
  {
    icon: '📊',
    label: 'AI Answer Evaluation',
    prompt: 'How does the AI evaluate my answers and time pace after submitting a test?',
  },
  {
    icon: '📝',
    label: 'Sticky Notes & Scratchpad',
    prompt: 'Can I take sticky notes during active exams, and where are they saved?',
    routeHref: '/notes',
  },
  {
    icon: '🎓',
    label: 'Explore Supported Exams',
    prompt: 'Which exams (GATE, JEE, WBJEE, UPSC, etc.) are available to practice?',
    routeHref: '/exams',
  },
];
