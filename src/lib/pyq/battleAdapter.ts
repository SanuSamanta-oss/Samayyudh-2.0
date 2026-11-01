/**
 * src/lib/pyq/battleAdapter.ts
 * Bridges PYQ questions into the SamayYudh Battle / Exam Session engine.
 */

import type { PyqQuestion } from '@/lib/pyq/types';
import type { Question, QuestionOption } from '@/types';

export function pyqToBattleQuestion(q: PyqQuestion): Question {
  const options: QuestionOption[] = (q.options || []).map((opt) => ({
    id: `opt_${opt.key}`,
    text: opt.text,
    is_correct: false,
  }));

  return {
    id: q.id,
    question_number: q.question_number,
    question_text: q.question_statement,
    exam_category: 'ENGINEERING_ENTRANCE',
    exam_code: 'JEE_MAINS',
    subject: q.subject,
    topic: `${q.exam_date_str} (${q.shift})`,
    subtopic: q.section,
    question_type: q.question_type === 'Numerical Value' ? 'numerical' : 'mcq',
    marks: 4,
    difficulty: q.question_type === 'Numerical Value' ? 'hard' : 'medium',
    recommended_minutes: 2,
    expected_points: [],
    keywords: [q.subject, q.exam_date_str, q.shift],
    model_answer: q.question_type === 'Numerical Value' ? 'Enter numerical integer' : 'See options',
    evaluation_rubric: '+4 for correct, -1 for incorrect',
    options: options.length > 0 ? options : undefined,
    correct_answer: options.length > 0 ? options[0].id : undefined,
    diagram_url: q.diagram_url || undefined,
    year: String(q.year || 2025),
    source: q.source_reference || 'JEE Main 2025 B.Tech PYQ',
    created_at: q.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function convertPyqListToBattle(questions: PyqQuestion[]): Question[] {
  return questions.map(pyqToBattleQuestion);
}

