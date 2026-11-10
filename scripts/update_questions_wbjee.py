with open('src/lib/questions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

import re

old_block = """const MAPPED_WBJEE_QUESTIONS: Question[] = WBJEE_QUESTIONS_DATA.map((q, idx) => ({
  id: q.id,
  question_number: idx + 1,
  question_text: q.question_statement,
  exam_category: 'STATE_ENTRANCE' as ExamCategoryCode,
  exam_code: 'WBJEE',
  subject: q.subject,
  topic: q.chapter,
  subtopic: q.section,
  question_type: (q.category === 3 ? 'msq' : 'mcq') as QuestionType,
  marks: q.marks,
  difficulty: (q.category === 1 ? 'easy' : q.category === 2 ? 'medium' : 'hard') as Difficulty,
  recommended_minutes: q.category === 1 ? 1 : 2,
  expected_points: [q.correct_option],
  keywords: [q.subject, q.chapter, `WBJEE ${q.year}`],
  model_answer: q.explanation,
  evaluation_rubric: `Correct option: ${q.correct_option}. Marks: +${q.marks}, Negative: -${q.negative_marks}`,
  options: q.options.map((opt) => ({
    id: opt.id,
    text: opt.text,
    is_correct: opt.is_correct,
  })),
}));"""

new_block = """const MAPPED_WBJEE_QUESTIONS: Question[] = WBJEE_QUESTIONS_DATA.map((q, idx) => ({
  id: q.id,
  question_number: idx + 1,
  question_text: q.question_statement,
  exam_category: 'STATE_ENTRANCE' as ExamCategoryCode,
  exam_code: 'WBJEE',
  subject: q.subject,
  topic: q.chapter,
  subtopic: q.section,
  question_type: (q.category === 3 ? 'msq' : 'mcq') as QuestionType,
  marks: q.marks,
  difficulty: (q.category === 1 ? 'easy' : q.category === 2 ? 'medium' : 'hard') as Difficulty,
  recommended_minutes: q.category === 1 ? 1 : 2,
  expected_points: [q.correct_option],
  keywords: [q.subject, q.chapter, `WBJEE ${q.year}`],
  model_answer: q.explanation,
  evaluation_rubric: `Correct option: ${q.correct_option}. Marks: +${q.marks}, Negative: -${q.negative_marks}`,
  options: q.options.map((opt) => ({
    id: opt.id,
    text: opt.text,
    is_correct: opt.is_correct,
  })),
  correct_answer: q.correct_option,
  year: String(q.year),
  source: 'WBJEEB Official Question Paper',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open('src/lib/questions.ts', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated MAPPED_WBJEE_QUESTIONS in src/lib/questions.ts successfully!')
else:
    print('Could not find old_block')
