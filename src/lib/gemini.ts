// ============================================================
// SamayYudh 2.0 — Gemini AI Evaluation Client
// ============================================================

import type { AnswerEvaluation, Question, Answer } from '@/types';
import { getRecommendedTime } from '@/lib/constants';
import { generateId, now } from '@/lib/utils';

interface EvaluateAnswerParams {
  question: Question;
  answer: Answer;
}

interface APIEvaluationResponse {
  score: number;
  max_score: number;
  percentage: number;
  correctness: 'correct' | 'mostly_correct' | 'partially_correct' | 'incorrect';
  time_assessment: 'too_fast' | 'on_time' | 'slightly_slow' | 'too_slow';
  ideal_word_range: { min: number; max: number };
  over_explaining: boolean;
  under_explaining: boolean;
  missing_points: string[];
  incorrect_points: string[];
  strengths: string[];
  improvements: string[];
  shorter_exam_version: string;
  corrected_answer: string;
  examiner_feedback: string;
  confidence: number;
  error?: string;
  message?: string;
}

/**
 * Evaluate a single answer using the Gemini API.
 * Returns a full AnswerEvaluation object or throws on failure.
 */
export async function evaluateAnswer({ question, answer }: EvaluateAnswerParams): Promise<AnswerEvaluation> {
  const recommendedTime = getRecommendedTime(question.marks);

  const response = await fetch('/api/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question_text: question.options 
        ? `${question.question_text}\n\nOptions:\n${question.options.map(o => `(${o.id.replace('opt_', '').toUpperCase()}) ${o.text}`).join('\n')}`
        : question.question_text,
      question_type: question.question_type,
      marks: question.marks,
      difficulty: question.difficulty,
      subject: question.subject,
      topic: question.topic,
      expected_points: question.expected_points,
      model_answer: question.model_answer,
      evaluation_rubric: question.evaluation_rubric,
      answer_text: answer.answer_text,
      time_spent_seconds: answer.time_spent_seconds,
      recommended_time_seconds: recommendedTime,
      word_count: answer.word_count,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({})) as APIEvaluationResponse;
    throw new Error(errData.message || errData.error || `Evaluation failed (${response.status})`);
  }

  const data = await response.json() as APIEvaluationResponse;

  if (data.error) {
    throw new Error(data.message || data.error);
  }

  // Map API response to AnswerEvaluation type
  const evaluation: AnswerEvaluation = {
    id: generateId(),
    answer_id: answer.id,
    question_id: question.id,
    score: data.score,
    max_score: data.max_score,
    percentage: data.percentage,
    correctness: data.correctness,
    time_assessment: data.time_assessment,
    word_count: answer.word_count,
    ideal_word_range: data.ideal_word_range,
    actual_time_seconds: answer.time_spent_seconds,
    recommended_time_seconds: recommendedTime,
    over_explaining: data.over_explaining,
    under_explaining: data.under_explaining,
    missing_points: data.missing_points,
    incorrect_points: data.incorrect_points,
    strengths: data.strengths,
    improvements: data.improvements,
    shorter_exam_version: data.shorter_exam_version,
    corrected_answer: data.corrected_answer,
    examiner_feedback: data.examiner_feedback,
    confidence: data.confidence,
    created_at: now(),
  };

  return evaluation;
}

/**
 * Evaluate multiple answers in sequence (with rate limiting).
 * Returns evaluations for successfully evaluated answers.
 */
export async function evaluateSession(
  questions: Question[],
  answers: Map<string, Answer>,
  onProgress?: (completed: number, total: number, questionId: string) => void,
): Promise<Map<string, AnswerEvaluation>> {
  const evaluations = new Map<string, AnswerEvaluation>();

  const answeredQuestions = questions.filter(q => {
    const answer = answers.get(q.id);
    return answer && answer.answer_text.trim().length > 0;
  });

  for (let i = 0; i < answeredQuestions.length; i++) {
    const question = answeredQuestions[i];
    const answer = answers.get(question.id);
    if (!answer) continue;

    let success = false;
    let attempts = 0;
    const maxAttempts = 3;

    while (!success && attempts < maxAttempts) {
      try {
        attempts++;
        const evaluation = await evaluateAnswer({ question, answer });
        evaluations.set(question.id, evaluation);
        success = true;
      } catch (err) {
        if (attempts >= maxAttempts) {
          // Log as a warning instead of error so Next.js doesn't pop up a fatal overlay
          console.warn(`Failed to evaluate question ${question.id} after ${maxAttempts} attempts:`, err);
        } else {
          // Wait 2 seconds before retrying if it's a 503 overloaded error
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    onProgress?.(i + 1, answeredQuestions.length, question.id);

    // Rate limiting: 500ms between calls
    if (i < answeredQuestions.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return evaluations;
}

/**
 * Check if the Gemini API is configured and reachable.
 */
export async function checkGeminiStatus(): Promise<{ configured: boolean; error?: string }> {
  try {
    const response = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_text: 'test',
        answer_text: '',
        marks: 1,
        expected_points: [],
        model_answer: '',
        evaluation_rubric: '',
        subject: '',
        topic: '',
        question_type: 'short_answer',
        difficulty: 'easy',
        time_spent_seconds: 0,
        recommended_time_seconds: 60,
        word_count: 0,
      }),
    });

    if (response.status === 503) {
      const data = await response.json() as APIEvaluationResponse;
      return { configured: false, error: data.message || 'API key not configured' };
    }

    return { configured: true };
  } catch {
    return { configured: false, error: 'Failed to connect to evaluation API' };
  }
}
