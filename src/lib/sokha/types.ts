// ============================================================
// SamayYudh 2.0 — Assistant Types & Motivational Prompts
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
  badge?: string;
}

export const WARRIOR_MANTRAS = [
  {
    sanskrit: 'উত্তিষ্ঠত জাগ্রত প্রাপ্য বরান নিবোধত',
    english: 'Arise, awake, and stop not till the goal is reached.',
    author: 'Katha Upanishad / Swami Vivekananda',
  },
  {
    sanskrit: 'কর্মণ্যেবাধিকারস্তে মা ফলেষু কদাচন',
    english: 'You have a right to your effort, but never to the fruits alone. Focus on the battle of this moment.',
    author: 'Bhagavad Gita 2.47',
  },
  {
    sanskrit: 'বীরভোগ্যা বসুন্ধরা',
    english: 'The earth belongs to the brave. The rank belongs to the disciplined.',
    author: 'Ancient Warrior Creed',
  },
  {
    sanskrit: 'তেজস্বী নাবধীতমস্তু',
    english: 'May our study be filled with brilliance, fire, and unwavering clarity.',
    author: 'Taittiriya Upanishad',
  },
  {
    sanskrit: 'সময়যুদ্ধে একাগ্রতাই বিজয়',
    english: 'In the battle against time, razor-sharp focus is ultimate victory.',
    author: 'SamayYudh Sankalpa',
  },
];

export const SAMAYYUDH_QUICK_PROMPTS: QuickActionPrompt[] = [
  {
    icon: '🔥',
    label: 'Power Motivation Surge',
    prompt: 'Give me a fierce warrior mindset boost to defeat procrastination and conquer my study targets right now!',
    badge: 'Warrior Focus',
  },
  {
    icon: '⚔️',
    label: '2-Hour Battle War Plan',
    prompt: 'Create a high-impact, distraction-free 2-hour battle sprint for my syllabus today.',
    badge: 'Strategy',
  },
  {
    icon: '🧘',
    label: 'Convert Anxiety into Confidence',
    prompt: 'How do top rankers eliminate exam anxiety and stay razor-sharp under intense clock pressure?',
    badge: 'Mindset',
  },
  {
    icon: '⚡',
    label: 'Start Quick Battle (10 Min)',
    prompt: 'How do I start a 10-minute Quick Battle session in SamayYudh 2.0 to test my speed under time pressure?',
    routeHref: '/practice',
    badge: 'Action',
  },
  {
    icon: '🏆',
    label: 'Check Badges & Daily Streak',
    prompt: 'How do I earn streaks, qualifying study days, and Century badges?',
    routeHref: '/achievements',
    badge: 'Progress',
  },
  {
    icon: '📝',
    label: 'Sticky Notes & Scratchpad',
    prompt: 'Can I take sticky notes during active exams, and where are they saved?',
    routeHref: '/notes',
  },
];
