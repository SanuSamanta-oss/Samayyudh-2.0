// ============================================================
// SamayYudh 2.0 — Hybrid Precision Evaluator
// Fast-path deterministic evaluation for MCQs, MSQs, & Numericals
// with rich examiner-grade feedback in 0 milliseconds.
// ============================================================

import type { Answer, AnswerEvaluation, CorrectnessLevel, Question, QuestionOption, TimeAssessment } from '@/types';
import { getRecommendedTime } from '@/lib/constants';
import { generateId, now } from '@/lib/utils';

/**
 * Normalizes an option identifier for comparison.
 * Handles 'opt_a', 'a', 'OPT_A', 'A', '1', etc.
 */
export function normalizeOptionId(raw: string | undefined | null): string {
  if (!raw) return '';
  return String(raw).trim().toLowerCase().replace(/^opt_/, '');
}

/**
 * Extracts normalized option IDs selected by the user.
 * Gracefully parses:
 * - answer.selected_options (array)
 * - answer.selected_option (string)
 * - answer.answer_text containing "opt_x", raw letter "(A)", or option text
 */
export function extractUserSelectedOptionIds(question: Question, answer: Answer): string[] {
  const ids = new Set<string>();

  // 1. Array of selected options (MSQ)
  if (Array.isArray(answer.selected_options) && answer.selected_options.length > 0) {
    for (const id of answer.selected_options) {
      const norm = normalizeOptionId(id);
      if (norm) ids.add(norm);
    }
  }

  // 2. Single selected option
  if (answer.selected_option) {
    const norm = normalizeOptionId(answer.selected_option);
    if (norm) ids.add(norm);
  }

  // 3. Parse answer_text
  const text = (answer.answer_text || '').trim();
  if (text) {
    // If it's a direct option id like 'opt_a' or 'opt_1'
    if (/^opt_[a-z0-9_]+$/i.test(text)) {
      ids.add(normalizeOptionId(text));
    }
    // If it's a single letter like 'a' or 'A'
    else if (/^[a-dA-D]$/i.test(text)) {
      ids.add(text.toLowerCase());
    }
    // If it's formatted like "Selected Option: (A) text" or "(A)"
    else {
      const letterMatch = text.match(/\(([a-dA-D])\)/);
      if (letterMatch && letterMatch[1]) {
        ids.add(letterMatch[1].toLowerCase());
      } else if (question.options && question.options.length > 0) {
        // Check if text directly matches any option's text
        const lowerText = text.toLowerCase();
        for (const opt of question.options) {
          if (opt.text && opt.text.trim().toLowerCase() === lowerText) {
            ids.add(normalizeOptionId(opt.id));
          }
        }
      }
    }
  }

  return Array.from(ids);
}

/**
 * Extracts normalized correct option IDs from a question.
 * Checks both `question.correct_answer` and `options[].is_correct`.
 */
export function getCorrectOptionIds(question: Question): string[] {
  const correct = new Set<string>();

  // 1. From question.correct_answer
  if (question.correct_answer) {
    if (Array.isArray(question.correct_answer)) {
      for (const ans of question.correct_answer) {
        const norm = normalizeOptionId(ans);
        if (norm) correct.add(norm);
      }
    } else if (typeof question.correct_answer === 'string') {
      const str = question.correct_answer.trim();
      // Try parsing JSON array if present
      if (str.startsWith('[') && str.endsWith(']')) {
        try {
          const parsed = JSON.parse(str);
          if (Array.isArray(parsed)) {
            for (const item of parsed) {
              const norm = normalizeOptionId(String(item));
              if (norm) correct.add(norm);
            }
          }
        } catch {
          // fall through
        }
      }

      if (correct.size === 0) {
        const norm = normalizeOptionId(str);
        if (norm) correct.add(norm);
      }
    }
  }

  // 2. From question.options with is_correct: true
  if (question.options && Array.isArray(question.options)) {
    for (const opt of question.options) {
      if (opt.is_correct) {
        const norm = normalizeOptionId(opt.id);
        if (norm) correct.add(norm);
      }
    }
  }

  return Array.from(correct);
}

/**
 * Checks whether a question can be evaluated deterministically (without LLM).
 */
export function canEvaluateDeterministically(question: Question): boolean {
  // A. Has options (MCQ, MSQ, True/False)
  if (question.options && question.options.length > 0) {
    const correctIds = getCorrectOptionIds(question);
    if (correctIds.length > 0) {
      return true;
    }
  }

  // B. Explicit question type with known options
  if (question.question_type === 'mcq' || question.question_type === 'msq' || question.question_type === 'true_false') {
    const correctIds = getCorrectOptionIds(question);
    if (correctIds.length > 0) {
      return true;
    }
  }

  // C. Numerical with exact parseable target
  if (question.question_type === 'numerical') {
    const numericTarget = extractNumericValue(question.correct_answer) ?? extractNumericValue(question.model_answer);
    if (numericTarget !== null) {
      return true;
    }
  }

  return false;
}

/**
 * Extracts a numeric float value from string if present.
 */
export function extractNumericValue(raw: unknown): number | null {
  if (typeof raw === 'number' && !isNaN(raw)) return raw;
  if (typeof raw !== 'string') return null;
  const match = raw.match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const parsed = parseFloat(match[0]);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Calculates standard exam time assessment category.
 */
export function calculateTimeAssessment(actualSeconds: number, recommendedSeconds: number): TimeAssessment {
  if (recommendedSeconds <= 0) return 'on_time';
  const ratio = actualSeconds / recommendedSeconds;
  if (ratio < 0.5) return 'too_fast';
  if (ratio <= 1.2) return 'on_time';
  if (ratio <= 1.8) return 'slightly_slow';
  return 'too_slow';
}

/**
 * Formats an option for human display: "(A) Text"
 */
function formatOptionHuman(opt: QuestionOption): string {
  const letter = normalizeOptionId(opt.id).toUpperCase();
  const text = (opt.text || '').trim();
  return `(${letter}) ${text}`;
}

/**
 * Deterministically evaluates an objective/numerical question in < 1ms.
 */
export function evaluateDeterministicAnswer(question: Question, answer: Answer): AnswerEvaluation {
  const maxScore = question.marks || 1;
  const recommendedTime = (question.recommended_minutes && question.recommended_minutes > 0)
    ? question.recommended_minutes * 60
    : getRecommendedTime(maxScore);
  const actualTime = answer.time_spent_seconds || 0;
  const timeAssessment = calculateTimeAssessment(actualTime, recommendedTime);

  // --- NUMERICAL QUESTION EVALUATION ---
  if (question.question_type === 'numerical' && (!question.options || question.options.length === 0)) {
    const userVal = extractNumericValue(answer.answer_text);
    const targetVal = extractNumericValue(question.correct_answer) ?? extractNumericValue(question.model_answer);

    const isMatch = userVal !== null && targetVal !== null && Math.abs(userVal - targetVal) <= 0.05;
    const score = isMatch ? maxScore : 0;
    const percentage = isMatch ? 100 : 0;
    const correctness: CorrectnessLevel = isMatch ? 'correct' : 'incorrect';

    const explanation = question.model_answer || question.evaluation_rubric || '';

    return {
      id: generateId(),
      answer_id: answer.id,
      question_id: question.id,
      score,
      max_score: maxScore,
      percentage,
      correctness,
      time_assessment: timeAssessment,
      word_count: answer.word_count || (answer.answer_text ? 1 : 0),
      ideal_word_range: { min: 1, max: 10 },
      actual_time_seconds: actualTime,
      recommended_time_seconds: recommendedTime,
      over_explaining: false,
      under_explaining: userVal === null,
      missing_points: isMatch ? [] : [targetVal !== null ? `Calculated value: ${targetVal}` : 'Correct numerical calculation'],
      incorrect_points: isMatch ? [] : (userVal !== null ? [`Entered value: ${userVal}`] : ['No numerical answer entered']),
      strengths: isMatch ? ['Accurate numerical calculation', `Correct answer: ${targetVal}`] : [],
      improvements: isMatch
        ? (actualTime > 1.2 * recommendedTime ? ['Optimize calculation steps to save time on exam day'] : ['Solid execution'])
        : ['Verify formula steps and calculation arithmetic', `Target solution: ${targetVal ?? 'See model answer'}`],
      shorter_exam_version: targetVal !== null ? `${targetVal}` : '',
      corrected_answer: targetVal !== null ? `${targetVal}` : (question.model_answer || ''),
      examiner_feedback: isMatch
        ? `✓ Correct! Your calculated value of ${userVal} matches the expected answer (${targetVal}).${explanation ? ' ' + explanation : ''}`
        : `✗ Incorrect. You entered ${userVal !== null ? userVal : 'nothing'}, but the correct value is ${targetVal}.${explanation ? ' ' + explanation : ''}`,
      confidence: 1.0,
      created_at: now(),
    };
  }

  // --- MCQ / MSQ / TRUE_FALSE EVALUATION ---
  const correctIds = getCorrectOptionIds(question);
  const userIds = extractUserSelectedOptionIds(question, answer);
  const isMsq = question.question_type === 'msq';

  // Build lookup maps for readable text
  const optionsMap = new Map<string, QuestionOption>();
  if (question.options) {
    for (const opt of question.options) {
      optionsMap.set(normalizeOptionId(opt.id), opt);
    }
  }

  // Format readable labels
  const formatList = (ids: string[]) => {
    return ids.map(id => {
      const opt = optionsMap.get(id);
      return opt ? formatOptionHuman(opt) : `(${id.toUpperCase()})`;
    }).join(', ');
  };

  const correctDisplay = formatList(correctIds);
  const userDisplay = userIds.length > 0 ? formatList(userIds) : 'No option selected';

  let score = 0;
  let correctness: CorrectnessLevel = 'incorrect';

  if (userIds.length === 0) {
    score = 0;
    correctness = 'incorrect';
  } else if (!isMsq) {
    // Single choice MCQ: Exact match
    const userChoice = userIds[0];
    const isCorrect = correctIds.includes(userChoice);
    if (isCorrect) {
      score = maxScore;
      correctness = 'correct';
    } else {
      score = 0;
      correctness = 'incorrect';
    }
  } else {
    // MSQ: Multiple Select Questions
    const correctSet = new Set(correctIds);

    const hasWrongOption = userIds.some(id => !correctSet.has(id));
    const matchedCount = userIds.filter(id => correctSet.has(id)).length;

    if (!hasWrongOption && matchedCount === correctSet.size) {
      score = maxScore;
      correctness = 'correct';
    } else if (!hasWrongOption && matchedCount > 0) {
      // Partial credit for MSQ if no incorrect option was chosen
      score = Math.round((matchedCount / correctSet.size) * maxScore * 10) / 10;
      correctness = 'partially_correct';
    } else {
      score = 0;
      correctness = 'incorrect';
    }
  }

  const percentage = Math.round((score / maxScore) * 100);
  const isFullCorrect = correctness === 'correct';
  const explanation = (question.model_answer && question.model_answer.toLowerCase() !== 'see options')
    ? question.model_answer.trim()
    : '';

  // Examiner feedback string
  let examinerFeedback = '';
  if (isFullCorrect) {
    examinerFeedback = `✓ Correct! You accurately identified ${correctDisplay}.${explanation ? ' ' + explanation : ''}`;
  } else if (correctness === 'partially_correct') {
    examinerFeedback = `⚠ Partially Correct. You selected ${userDisplay}, but the complete answer is ${correctDisplay}.${explanation ? ' ' + explanation : ''}`;
  } else {
    examinerFeedback = `✗ Incorrect. You selected ${userDisplay}, but the correct answer is ${correctDisplay}.${explanation ? ' ' + explanation : ''}`;
  }

  // Strengths
  const strengths: string[] = [];
  if (isFullCorrect) {
    strengths.push(`Accurately selected ${correctDisplay}`);
    strengths.push(`Strong conceptual grasp of ${question.topic || question.subject}`);
  } else if (correctness === 'partially_correct') {
    strengths.push(`Identified valid key options (${userDisplay}) without picking distractors`);
  } else if (actualTime > 0 && actualTime <= recommendedTime && userIds.length > 0) {
    strengths.push('Disciplined time management under exam conditions');
  }

  // Improvements
  const improvements: string[] = [];
  if (isFullCorrect) {
    if (actualTime > 1.2 * recommendedTime) {
      improvements.push(`Speed up execution: took ${actualTime}s (target: ${recommendedTime}s)`);
    } else {
      improvements.push(`Maintain high consistency and pace on ${question.subject} problems`);
    }
  } else {
    improvements.push(`Study ${question.topic || question.subject}: revise why ${correctDisplay} is correct`);
    improvements.push('Practice option elimination to avoid tempting distractors');
  }

  // Missing & incorrect points
  const missingPoints: string[] = [];
  const incorrectPoints: string[] = [];

  if (!isFullCorrect) {
    missingPoints.push(`Correct Option: ${correctDisplay}${explanation ? ' — ' + explanation : ''}`);
    if (userIds.length > 0 && correctness === 'incorrect') {
      incorrectPoints.push(`Selected incorrect choice: ${userDisplay}`);
    } else if (userIds.length === 0) {
      incorrectPoints.push('Question was not attempted');
    }
  }

  return {
    id: generateId(),
    answer_id: answer.id,
    question_id: question.id,
    score,
    max_score: maxScore,
    percentage,
    correctness,
    time_assessment: timeAssessment,
    word_count: answer.word_count || 1,
    ideal_word_range: { min: 1, max: 10 },
    actual_time_seconds: actualTime,
    recommended_time_seconds: recommendedTime,
    over_explaining: false,
    under_explaining: userIds.length === 0,
    missing_points: missingPoints,
    incorrect_points: incorrectPoints,
    strengths,
    improvements,
    shorter_exam_version: correctDisplay,
    corrected_answer: `Option ${correctDisplay}`,
    examiner_feedback: examinerFeedback,
    confidence: 1.0,
    created_at: now(),
  };
}
