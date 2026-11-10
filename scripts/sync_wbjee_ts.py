import json

data = json.load(open('data/wbjee_questions.json', encoding='utf-8'))

ts_content = '''// ============================================================
// SamayYudh 2.0 — Official WBJEE Previous Year Questions Dataset
// Source: West Bengal Joint Entrance Examinations Board (WBJEEB)
// Official Papers: 2019, 2020, 2022, 2023, 2024
// KaTeX Math & Physics Verified
// ============================================================

export interface WbjeeOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  is_correct: boolean;
}

export interface WbjeeQuestion {
  id: string;
  exam: 'WBJEE';
  year: number;
  subject: 'Mathematics' | 'Physics' | 'Chemistry';
  chapter: string;
  chapter_number?: number;
  section: 'Category 1' | 'Category 2' | 'Category 3';
  category: 1 | 2 | 3;
  marks: number;
  negative_marks: number;
  question_number: number;
  question_type: 'mcq' | 'multi_mcq';
  question_statement: string;
  diagram_url?: string;
  options: WbjeeOption[];
  correct_option: string;
  explanation: string;
}

export const WBJEE_QUESTIONS_DATA: WbjeeQuestion[] = ''' + json.dumps(data, indent=2, ensure_ascii=False) + ''';

export const WBJEE_YEARS = [2024, 2023, 2022, 2020, 2019] as const;
export type WbjeeYear = typeof WBJEE_YEARS[number];

export const WBJEE_SUBJECTS = [
  {
    key: 'Mathematics',
    name: 'Mathematics',
    paper: 'Paper I',
    color: '#6366F1', // Indigo / Blue
    gradient: 'from-indigo-500 to-blue-600',
    lightBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    border: 'border-indigo-200 dark:border-indigo-800/60',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300',
    accentText: 'text-indigo-600 dark:text-indigo-400',
    buttonBg: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20',
  },
  {
    key: 'Physics',
    name: 'Physics',
    paper: 'Paper II',
    color: '#8B5CF6', // Violet / Cosmic Purple
    gradient: 'from-violet-500 to-purple-600',
    lightBg: 'bg-violet-50 dark:bg-violet-950/40',
    border: 'border-violet-200 dark:border-violet-800/60',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300',
    accentText: 'text-violet-600 dark:text-violet-400',
    buttonBg: 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/20',
  },
  {
    key: 'Chemistry',
    name: 'Chemistry',
    paper: 'Paper II',
    color: '#10B981', // Emerald / Teal
    gradient: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
  },
] as const;

export function getWbjeeStats() {
  const total = WBJEE_QUESTIONS_DATA.length;
  const math = WBJEE_QUESTIONS_DATA.filter(q => q.subject === 'Mathematics').length;
  const phys = WBJEE_QUESTIONS_DATA.filter(q => q.subject === 'Physics').length;
  const chem = WBJEE_QUESTIONS_DATA.filter(q => q.subject === 'Chemistry').length;
  const cat1 = WBJEE_QUESTIONS_DATA.filter(q => q.category === 1).length;
  const cat2 = WBJEE_QUESTIONS_DATA.filter(q => q.category === 2).length;
  const cat3 = WBJEE_QUESTIONS_DATA.filter(q => q.category === 3).length;
  return { total, math, phys, chem, cat1, cat2, cat3 };
}
'''

with open('src/data/wbjee/wbjeeQuestionsData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Successfully wrote {len(data)} questions to src/data/wbjee/wbjeeQuestionsData.ts")

