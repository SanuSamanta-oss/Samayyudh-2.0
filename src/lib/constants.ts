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
    exams: [
      { id: 'gate-ae-24', exam_code: 'GATE-AE', exam_name: 'Aerospace Engineering (AE)', category: 'ENGINEERING', description: 'GATE 2024 Aerospace Engineering', icon: '🚀', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-ag-24', exam_code: 'GATE-AG', exam_name: 'Agricultural Engineering (AG)', category: 'ENGINEERING', description: 'GATE 2024 Agricultural Engineering', icon: '🌾', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-ar-24', exam_code: 'GATE-AR', exam_name: 'Architecture and Planning (AR)', category: 'ENGINEERING', description: 'GATE 2024 Architecture and Planning', icon: '🏛️', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-bm-24', exam_code: 'GATE-BM', exam_name: 'Biomedical Engineering (BM)', category: 'ENGINEERING', description: 'GATE 2024 Biomedical Engineering', icon: '🧬', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-bt-24', exam_code: 'GATE-BT', exam_name: 'Biotechnology (BT)', category: 'ENGINEERING', description: 'GATE 2024 Biotechnology', icon: '🧪', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-ce1-24', exam_code: 'GATE-CE-1', exam_name: 'Civil Engineering (CE-1) (Forenoon)', category: 'ENGINEERING', description: 'GATE 2024 Civil Engineering Forenoon', icon: '🏗️', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-ce2-24', exam_code: 'GATE-CE-2', exam_name: 'Civil Engineering (CE-2) (Afternoon)', category: 'ENGINEERING', description: 'GATE 2024 Civil Engineering Afternoon', icon: '🏗️', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-ch-24', exam_code: 'GATE-CH', exam_name: 'Chemical Engineering (CH)', category: 'ENGINEERING', description: 'GATE 2024 Chemical Engineering', icon: '⚗️', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-cs1-24', exam_code: 'GATE-CS-1', exam_name: 'Computer Science and Information Technology (CS-1) (Forenoon)', category: 'ENGINEERING', description: 'GATE 2024 CS & IT Forenoon', icon: '💻', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-cs2-24', exam_code: 'GATE-CS-2', exam_name: 'Computer Science and Information Technology (CS-2) (Afternoon)', category: 'ENGINEERING', description: 'GATE 2024 CS & IT Afternoon', icon: '💻', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-cy-24', exam_code: 'GATE-CY', exam_name: 'Chemistry (CY)', category: 'ENGINEERING', description: 'GATE 2024 Chemistry', icon: '🔬', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-da-24', exam_code: 'GATE-DA', exam_name: 'Data Science and Artificial Intelligence (DA)', category: 'ENGINEERING', description: 'GATE 2024 Data Science and AI', icon: '🧠', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-ec-24', exam_code: 'GATE-EC', exam_name: 'Electronics and Communication Engineering (EC)', category: 'ENGINEERING', description: 'GATE 2024 ECE', icon: '📡', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-ee-24', exam_code: 'GATE-EE', exam_name: 'Electrical Engineering (EE)', category: 'ENGINEERING', description: 'GATE 2024 Electrical Engineering', icon: '⚡', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-es-24', exam_code: 'GATE-ES', exam_name: 'Environmental Science & Engineering (ES)', category: 'ENGINEERING', description: 'GATE 2024 Environmental Science', icon: '🌍', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-ey-24', exam_code: 'GATE-EY', exam_name: 'Ecology and Evolution (EY)', category: 'ENGINEERING', description: 'GATE 2024 Ecology', icon: '🌱', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-ge-24', exam_code: 'GATE-GE', exam_name: 'Geomatics Engineering (GE)', category: 'ENGINEERING', description: 'GATE 2024 Geomatics', icon: '🗺️', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-gg1-24', exam_code: 'GATE-GG-1', exam_name: 'Geology and Geophysics - Geology (GG-1)', category: 'ENGINEERING', description: 'GATE 2024 Geology', icon: '🪨', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-gg2-24', exam_code: 'GATE-GG-2', exam_name: 'Geology and Geophysics - Geophysics (GG-2)', category: 'ENGINEERING', description: 'GATE 2024 Geophysics', icon: '🌋', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-in-24', exam_code: 'GATE-IN', exam_name: 'Instrumentation Engineering (IN)', category: 'ENGINEERING', description: 'GATE 2024 Instrumentation', icon: '🎛️', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-ma-24', exam_code: 'GATE-MA', exam_name: 'Mathematics (MA)', category: 'ENGINEERING', description: 'GATE 2024 Mathematics', icon: '🔢', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-me-24', exam_code: 'GATE-ME', exam_name: 'Mechanical Engineering (ME)', category: 'ENGINEERING', description: 'GATE 2024 Mechanical Engineering', icon: '⚙️', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-mn-24', exam_code: 'GATE-MN', exam_name: 'Mining Engineering (MN)', category: 'ENGINEERING', description: 'GATE 2024 Mining', icon: '⛏️', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-mt-24', exam_code: 'GATE-MT', exam_name: 'Metallurgical Engineering (MT)', category: 'ENGINEERING', description: 'GATE 2024 Metallurgical', icon: '🏭', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-nm-24', exam_code: 'GATE-NM', exam_name: 'Naval Architecture and Marine Engineering (NM)', category: 'ENGINEERING', description: 'GATE 2024 Naval Architecture', icon: '🚢', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-pe-24', exam_code: 'GATE-PE', exam_name: 'Petroleum Engineering (PE)', category: 'ENGINEERING', description: 'GATE 2024 Petroleum', icon: '🛢️', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-ph-24', exam_code: 'GATE-PH', exam_name: 'Physics (PH)', category: 'ENGINEERING', description: 'GATE 2024 Physics', icon: '⚛️', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-pi-24', exam_code: 'GATE-PI', exam_name: 'Production and Industrial Engineering (PI)', category: 'ENGINEERING', description: 'GATE 2024 Production', icon: '🏗️', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-st-24', exam_code: 'GATE-ST', exam_name: 'Statistics (ST)', category: 'ENGINEERING', description: 'GATE 2024 Statistics', icon: '📊', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-tf-24', exam_code: 'GATE-TF', exam_name: 'Textile Engineering and Fibre Science (TF)', category: 'ENGINEERING', description: 'GATE 2024 Textile', icon: '🧵', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-xe-24', exam_code: 'GATE-XE', exam_name: 'Engineering Sciences (XE)', category: 'ENGINEERING', description: 'GATE 2024 Engineering Sciences', icon: '🔧', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-xh-c1-24', exam_code: 'GATE-XH-C1', exam_name: 'Humanities & Social Sciences - Economics (XH-C1)', category: 'ENGINEERING', description: 'GATE 2024 Economics', icon: '📈', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-xh-c2-24', exam_code: 'GATE-XH-C2', exam_name: 'Humanities & Social Sciences - English (XH-C2)', category: 'ENGINEERING', description: 'GATE 2024 English', icon: '📖', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-xh-c3-24', exam_code: 'GATE-XH-C3', exam_name: 'Humanities & Social Sciences - Linguistics (XH-C3)', category: 'ENGINEERING', description: 'GATE 2024 Linguistics', icon: '🗣️', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-xh-c4-24', exam_code: 'GATE-XH-C4', exam_name: 'Humanities & Social Sciences - Philosophy (XH-C4)', category: 'ENGINEERING', description: 'GATE 2024 Philosophy', icon: '🤔', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-xh-c5-24', exam_code: 'GATE-XH-C5', exam_name: 'Humanities & Social Sciences - Psychology (XH-C5)', category: 'ENGINEERING', description: 'GATE 2024 Psychology', icon: '🧠', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-xh-c6-24', exam_code: 'GATE-XH-C6', exam_name: 'Humanities & Social Sciences - Sociology (XH-C6)', category: 'ENGINEERING', description: 'GATE 2024 Sociology', icon: '👥', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
      { id: 'gate-xl-24', exam_code: 'GATE-XL', exam_name: 'Life Sciences (XL)', category: 'ENGINEERING', description: 'GATE 2024 Life Sciences', icon: '🧬', duration_seconds: 10800, total_questions: 65, total_marks: 100, negative_marking: true, marking_rules: [], question_types: ['mcq', 'numerical', 'msq'], subjects: [], sections: [], time_rules: [], is_active: true, created_at: '', updated_at: '' },
    ],
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
    description: 'National Eligibility cum Entrance Test (UG)',
    icon: '🩺',
    logo: '/logos/neet.jpg',
    exams: [
      {
        id: 'neet-2024',
        exam_code: 'NEET',
        exam_name: 'NEET UG 2024 (Rigud Q4 Official Paper)',
        category: 'MEDICAL',
        description: 'Actual 200 Questions (Physics, Chemistry, Botany, Zoology)',
        icon: '🩺',
        duration_seconds: 12000,
        total_questions: 200,
        total_marks: 720,
        negative_marking: true,
        marking_rules: [],
        question_types: ['mcq'],
        subjects: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
        sections: [],
        time_rules: [],
        is_active: true,
        created_at: '',
        updated_at: ''
      }
    ],
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

export function getExamDisplayName(identifier?: string | null): string {
  if (!identifier) return 'EXAM';
  const clean = identifier.trim();

  // 1. Direct match on category code or name
  const cat = EXAM_CATEGORIES.find(
    (c) => c.code.toLowerCase() === clean.toLowerCase() || c.name.toLowerCase() === clean.toLowerCase()
  );
  if (cat) return cat.name;

  // 2. Direct match on sub-exam code or name
  for (const c of EXAM_CATEGORIES) {
    const sub = c.exams?.find(
      (e) => e.exam_code.toLowerCase() === clean.toLowerCase() || e.exam_name.toLowerCase() === clean.toLowerCase()
    );
    if (sub) return sub.exam_name;
  }

  // 3. Fallback: clean underscores
  return clean.replace(/_/g, ' ');
}

