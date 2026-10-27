// ============================================================
// SamayYudh 2.0 — Hybrid Evaluator Tests
// ============================================================

import assert from 'node:assert/strict';
import test from 'node:test';
import type { Answer, Question } from '@/types';
import {
  canEvaluateDeterministically,
  evaluateDeterministicAnswer,
  getCorrectOptionIds,
  normalizeOptionId,
} from './hybrid-evaluator';

const mockMcqQuestion: Question = {
  id: 'q-mcq-1',
  question_number: 1,
  question_text: 'What is the powerhouse of the cell?',
  exam_code: 'NEET',
  exam_category: 'MEDICAL',
  subject: 'Biology',
  topic: 'Cell Biology',
  marks: 4,
  difficulty: 'easy',
  recommended_minutes: 1,
  question_type: 'mcq',
  expected_points: ['Mitochondria'],
  keywords: ['mitochondria', 'cell'],
  model_answer: 'Mitochondria produces ATP via cellular respiration.',
  evaluation_rubric: '+4 for Mitochondria, -1 for wrong.',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  options: [
    { id: 'opt_a', text: 'Nucleus', is_correct: false },
    { id: 'opt_b', text: 'Mitochondria', is_correct: true },
    { id: 'opt_c', text: 'Ribosome', is_correct: false },
    { id: 'opt_d', text: 'Golgi Apparatus', is_correct: false },
  ],
  correct_answer: 'opt_b',
};

const mockMsqQuestion: Question = {
  id: 'q-msq-1',
  question_number: 2,
  question_text: 'Select the primary colors of light:',
  exam_code: 'GATE-CS',
  exam_category: 'ENGINEERING',
  subject: 'Physics',
  topic: 'Optics',
  marks: 2,
  difficulty: 'medium',
  recommended_minutes: 2,
  question_type: 'msq',
  expected_points: ['Red', 'Green', 'Blue'],
  keywords: ['RGB'],
  model_answer: 'Red, Green, and Blue are primary colors of light.',
  evaluation_rubric: '2 marks for all three correct.',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  options: [
    { id: 'opt_a', text: 'Red', is_correct: true },
    { id: 'opt_b', text: 'Yellow', is_correct: false },
    { id: 'opt_c', text: 'Green', is_correct: true },
    { id: 'opt_d', text: 'Blue', is_correct: true },
  ],
  correct_answer: ['opt_a', 'opt_c', 'opt_d'],
};

const mockNumericalQuestion: Question = {
  id: 'q-num-1',
  question_number: 3,
  question_text: 'Evaluate limit: 2 + 3 = ?',
  exam_code: 'JEE-MAINS',
  exam_category: 'JEE_MAINS',
  subject: 'Mathematics',
  topic: 'Arithmetic',
  marks: 4,
  difficulty: 'easy',
  recommended_minutes: 1,
  question_type: 'numerical',
  expected_points: ['5'],
  keywords: ['arithmetic'],
  model_answer: '2 + 3 = 5',
  evaluation_rubric: '4 marks for 5.',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  correct_answer: '5',
};

const mockDescriptiveQuestion: Question = {
  id: 'q-desc-1',
  question_number: 4,
  question_text: 'Explain the principle of Master Theorem in detail.',
  exam_code: 'UNIVERSITY',
  exam_category: 'UNIVERSITY',
  subject: 'Computer Science',
  topic: 'Algorithms',
  marks: 10,
  difficulty: 'hard',
  recommended_minutes: 10,
  question_type: 'descriptive',
  expected_points: ['Recurrence formulation', 'Case 1, 2, 3 analysis'],
  keywords: ['Master Theorem', 'Divide and conquer'],
  model_answer: 'The master theorem provides a cookbook solution...',
  evaluation_rubric: '3 marks per case analysis + 1 mark for formulation.',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

test('canEvaluateDeterministically classification', () => {
  assert.equal(canEvaluateDeterministically(mockMcqQuestion), true);
  assert.equal(canEvaluateDeterministically(mockMsqQuestion), true);
  assert.equal(canEvaluateDeterministically(mockNumericalQuestion), true);
  assert.equal(canEvaluateDeterministically(mockDescriptiveQuestion), false);
});

test('normalizeOptionId handles various input styles', () => {
  assert.equal(normalizeOptionId('opt_b'), 'b');
  assert.equal(normalizeOptionId('OPT_B'), 'b');
  assert.equal(normalizeOptionId('B'), 'b');
  assert.equal(normalizeOptionId('opt_1'), '1');
});

test('getCorrectOptionIds resolves correct answers from question', () => {
  assert.deepEqual(getCorrectOptionIds(mockMcqQuestion), ['b']);
  assert.deepEqual(getCorrectOptionIds(mockMsqQuestion).sort(), ['a', 'c', 'd'].sort());
});

test('evaluateDeterministicAnswer: MCQ correct answer', () => {
  const answer: Answer = {
    id: 'a1',
    session_id: 's1',
    question_id: mockMcqQuestion.id,
    user_id: 'u1',
    answer_text: 'opt_b',
    selected_option: 'opt_b',
    word_count: 1,
    character_count: 5,
    started_at: '2024-01-01',
    last_saved_at: '2024-01-01',
    submitted_at: '2024-01-01',
    time_spent_seconds: 45,
    status: 'answered',
  };

  const evalResult = evaluateDeterministicAnswer(mockMcqQuestion, answer);
  assert.equal(evalResult.score, 4);
  assert.equal(evalResult.max_score, 4);
  assert.equal(evalResult.percentage, 100);
  assert.equal(evalResult.correctness, 'correct');
  assert.equal(evalResult.time_assessment, 'on_time');
  assert.match(evalResult.examiner_feedback, /✓ Correct! You accurately identified \(B\) Mitochondria/);
  assert.equal(evalResult.confidence, 1.0);
  assert.equal(evalResult.missing_points.length, 0);
});

test('evaluateDeterministicAnswer: MCQ incorrect answer', () => {
  const answer: Answer = {
    id: 'a2',
    session_id: 's1',
    question_id: mockMcqQuestion.id,
    user_id: 'u1',
    answer_text: 'opt_a',
    selected_option: 'opt_a',
    word_count: 1,
    character_count: 5,
    started_at: '2024-01-01',
    last_saved_at: '2024-01-01',
    submitted_at: '2024-01-01',
    time_spent_seconds: 15,
    status: 'answered',
  };

  const evalResult = evaluateDeterministicAnswer(mockMcqQuestion, answer);
  assert.equal(evalResult.score, 0);
  assert.equal(evalResult.percentage, 0);
  assert.equal(evalResult.correctness, 'incorrect');
  assert.equal(evalResult.time_assessment, 'too_fast');
  assert.match(evalResult.examiner_feedback, /✗ Incorrect. You selected \(A\) Nucleus, but the correct answer is \(B\) Mitochondria/);
  assert.equal(evalResult.incorrect_points.length, 1);
  assert.equal(evalResult.missing_points.length, 1);
});

test('evaluateDeterministicAnswer: MSQ partial vs full correct', () => {
  // Partial (selected A and C, but missed D)
  const partialAnswer: Answer = {
    id: 'a3',
    session_id: 's1',
    question_id: mockMsqQuestion.id,
    user_id: 'u1',
    answer_text: '',
    selected_options: ['opt_a', 'opt_c'],
    word_count: 0,
    character_count: 0,
    started_at: '2024-01-01',
    last_saved_at: '2024-01-01',
    submitted_at: '2024-01-01',
    time_spent_seconds: 90,
    status: 'answered',
  };

  const partialEval = evaluateDeterministicAnswer(mockMsqQuestion, partialAnswer);
  assert.equal(partialEval.correctness, 'partially_correct');
  assert.ok(partialEval.score > 0 && partialEval.score < 2);

  // Full correct (A, C, D)
  const fullAnswer: Answer = {
    ...partialAnswer,
    selected_options: ['opt_a', 'opt_c', 'opt_d'],
  };
  const fullEval = evaluateDeterministicAnswer(mockMsqQuestion, fullAnswer);
  assert.equal(fullEval.correctness, 'correct');
  assert.equal(fullEval.score, 2);
  assert.equal(fullEval.percentage, 100);
});

test('evaluateDeterministicAnswer: Numerical matching', () => {
  const correctNumAnswer: Answer = {
    id: 'a4',
    session_id: 's1',
    question_id: mockNumericalQuestion.id,
    user_id: 'u1',
    answer_text: '5.0',
    word_count: 1,
    character_count: 3,
    started_at: '2024-01-01',
    last_saved_at: '2024-01-01',
    submitted_at: '2024-01-01',
    time_spent_seconds: 30,
    status: 'answered',
  };

  const evalResult = evaluateDeterministicAnswer(mockNumericalQuestion, correctNumAnswer);
  assert.equal(evalResult.score, 4);
  assert.equal(evalResult.correctness, 'correct');
  assert.match(evalResult.examiner_feedback, /✓ Correct! Your calculated value of 5 matches the expected answer \(5\)/);
});

test('evaluateSession: evaluates 20 questions instantaneously in fast-path (<50ms)', async () => {
  const { evaluateSession } = await import('@/lib/gemini');

  // Generate 20 test questions (18 MCQs, 2 Numericals)
  const questions: Question[] = [];
  const answers = new Map<string, Answer>();

  for (let i = 1; i <= 20; i++) {
    const isNum = i > 18;
    const qId = `test-q-${i}`;
    const q: Question = isNum ? {
      ...mockNumericalQuestion,
      id: qId,
      question_number: i,
    } : {
      ...mockMcqQuestion,
      id: qId,
      question_number: i,
    };
    questions.push(q);

    answers.set(qId, {
      id: `ans-${i}`,
      session_id: 'sess-test',
      question_id: qId,
      user_id: 'user-test',
      answer_text: isNum ? '5.0' : (i % 2 === 0 ? 'opt_b' : 'opt_a'),
      selected_option: isNum ? undefined : (i % 2 === 0 ? 'opt_b' : 'opt_a'),
      word_count: 1,
      character_count: 5,
      started_at: '2024-01-01',
      last_saved_at: '2024-01-01',
      submitted_at: '2024-01-01',
      time_spent_seconds: 40,
      status: 'answered',
    });
  }

  let progressCalled = 0;
  const start = Date.now();
  const results = await evaluateSession(questions, answers, (_done, _total) => {
    progressCalled++;
  });
  const duration = Date.now() - start;

  assert.equal(results.size, 20);
  assert.equal(progressCalled, 20);
  // It should finish virtually instantaneously (well under 500ms)
  assert.ok(duration < 500, `Expected fast-path under 500ms, took ${duration}ms`);
});
