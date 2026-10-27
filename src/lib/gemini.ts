// ============================================================
// SamayYudh 2.0 — Gemini AI Evaluation Client
// ============================================================

import type { AnswerEvaluation, Question, Answer } from '@/types';
import { getRecommendedTime } from '@/lib/constants';
import { generateId, now } from '@/lib/utils';
import { canEvaluateDeterministically, evaluateDeterministicAnswer } from '@/lib/evaluation/hybrid-evaluator';

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
 * Evaluate a single answer using the fast-path hybrid engine or Gemini API.
 * Returns a full AnswerEvaluation object or throws on failure.
 */
export async function evaluateAnswer({ question, answer }: EvaluateAnswerParams): Promise<AnswerEvaluation> {
  // 1. Fast-Path: evaluate deterministically in 0ms if applicable (MCQ, MSQ, Numerical)
  if (canEvaluateDeterministically(question)) {
    return evaluateDeterministicAnswer(question, answer);
  }

  // 2. AI-Path: evaluate subjective / descriptive answers using Gemini
  const recommendedTime = (question.recommended_minutes && question.recommended_minutes > 0)
    ? question.recommended_minutes * 60
    : getRecommendedTime(question.marks);

  let finalAnswerText = answer.answer_text;
  
  // If answer_text is just an option ID (like "opt_a") or if it's completely empty but selected_option is set
  const isJustOptionId = finalAnswerText && finalAnswerText.trim().startsWith('opt_') && finalAnswerText.trim().length <= 10;
  
  if (!finalAnswerText || finalAnswerText.trim() === '' || isJustOptionId) {
    const selectedOption = isJustOptionId ? finalAnswerText.trim() : answer.selected_option;
    
    if (selectedOption && question.options) {
      const opt = question.options.find(o => o.id === selectedOption);
      if (opt) {
        finalAnswerText = `Selected Option: (${opt.id.replace('opt_', '').toUpperCase()}) ${opt.text}`;
      } else {
        finalAnswerText = selectedOption;
      }
    } else if (answer.selected_options && question.options) {
      const opts = answer.selected_options.map(id => {
        const o = question.options!.find(opt => opt.id === id);
        return o ? `(${o.id.replace('opt_', '').toUpperCase()}) ${o.text}` : id;
      });
      finalAnswerText = `Selected Options: ${opts.join(', ')}`;
    }
  }

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
      answer_text: finalAnswerText,
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
 * Evaluate multiple answers in sequence.
 * Uses hybrid architecture:
 * - Deterministic questions (MCQ/MSQ/Numerical) evaluate instantly in < 1ms.
 * - Subjective/descriptive questions evaluate via Gemini API.
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
    if (!answer) return false;
    const hasText = answer.answer_text && answer.answer_text.trim().length > 0;
    const hasOption = !!answer.selected_option;
    const hasOptions = answer.selected_options && answer.selected_options.length > 0;
    return hasText || hasOption || hasOptions;
  });

  if (answeredQuestions.length === 0) {
    return evaluations;
  }

  // Split into fast-path deterministic questions and subjective questions
  const deterministicQuestions: Question[] = [];
  const subjectiveQuestions: Question[] = [];

  for (const q of answeredQuestions) {
    if (canEvaluateDeterministically(q)) {
      deterministicQuestions.push(q);
    } else {
      subjectiveQuestions.push(q);
    }
  }

  let completed = 0;

  // 1. Instant execution for deterministic questions (0ms - instant)
  for (const question of deterministicQuestions) {
    const answer = answers.get(question.id);
    if (!answer) continue;

    try {
      const evaluation = evaluateDeterministicAnswer(question, answer);
      evaluations.set(question.id, evaluation);
    } catch (detErr) {
      console.warn(`Deterministic evaluation failed for question ${question.id}, falling back to AI:`, detErr);
      subjectiveQuestions.push(question);
      continue;
    }

    completed++;
    onProgress?.(completed, answeredQuestions.length, question.id);
  }

  // 2. AI evaluation ONLY for remaining subjective questions (if any)
  if (subjectiveQuestions.length > 0) {
    const CONCURRENCY = Math.min(3, subjectiveQuestions.length);

    for (let i = 0; i < subjectiveQuestions.length; i += CONCURRENCY) {
      const chunk = subjectiveQuestions.slice(i, i + CONCURRENCY);
      
      await Promise.all(chunk.map(async (question) => {
        const answer = answers.get(question.id);
        if (!answer) return;

        let success = false;
        let attempts = 0;
        const maxAttempts = 3;

        while (!success && attempts < maxAttempts) {
          try {
            attempts++;
            const evaluation = await evaluateAnswer({ question, answer });
            evaluations.set(question.id, evaluation);
            success = true;
          } catch (err: unknown) {
            if (attempts >= maxAttempts) {
              console.warn(`Failed to evaluate question ${question.id} after ${maxAttempts} attempts:`, err);
            } else {
              const errStr = String(err instanceof Error ? err.message : err);
              if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED')) {
                // Rate limit hit (free tier quota limit).
                console.warn(`Rate limit hit on question ${question.id}, waiting 15s...`);
                await new Promise(resolve => setTimeout(resolve, 15000));
              } else {
                // Exponential backoff for 503 overloaded errors
                await new Promise(resolve => setTimeout(resolve, 1500 * attempts));
              }
            }
          }
        }
        
        completed++;
        onProgress?.(completed, answeredQuestions.length, question.id);
      }));

      // Small pause between subjective chunks to avoid burst limits
      if (i + CONCURRENCY < subjectiveQuestions.length) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
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
