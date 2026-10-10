// ============================================================
// SamayYudh 2.0 — Gemini AI Evaluation API Route
// ============================================================

import { GoogleGenAI } from '@google/genai';

export const maxDuration = 60; // Allow up to 60 seconds on Vercel to prevent 504 timeouts

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

interface EvaluationRequest {
  question_text: string;
  question_type: string;
  marks: number;
  difficulty: string;
  subject: string;
  topic: string;
  expected_points: string[];
  model_answer: string;
  evaluation_rubric: string;
  answer_text: string;
  time_spent_seconds: number;
  recommended_time_seconds: number;
  word_count: number;
}

interface EvaluationResponse {
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
}

const SYSTEM_PROMPT = `You are an expert academic examiner and AI evaluator for SamayYudh — an exam time-pressure simulator.

Your job is to evaluate student answers against model answers and rubrics, providing detailed, actionable feedback.

CRITICAL RULES:
1. Always return valid JSON matching the exact schema provided.
2. Be fair but rigorous — this is exam preparation, not flattery.
3. Score relative to the marks available (e.g., 7/10, not 7/100).
4. Assess time management honestly based on actual vs recommended time.
5. Be specific about missing points — name the concepts, don't be vague.
6. The "shorter_exam_version" should be a concise, exam-optimized rewrite.
7. The "corrected_answer" should fix errors while keeping the student's style.
8. Confidence should reflect how sure you are of your evaluation (0.0-1.0).

TIME ASSESSMENT RULES:
- too_fast: spent < 50% of recommended time
- on_time: spent 50%-120% of recommended time  
- slightly_slow: spent 120%-180% of recommended time
- too_slow: spent > 180% of recommended time

CORRECTNESS RULES:
- correct: 80-100% of expected points covered accurately
- mostly_correct: 60-80% covered, minor errors
- partially_correct: 30-60% covered, some significant errors
- incorrect: < 30% covered or fundamentally wrong`;

function buildEvaluationPrompt(req: EvaluationRequest): string {
  return `Evaluate this exam answer:

**Subject:** ${req.subject}
**Topic:** ${req.topic}
**Question Type:** ${req.question_type}
**Difficulty:** ${req.difficulty}
**Marks:** ${req.marks}

**Question:**
${req.question_text}

**Expected Key Points:**
${req.expected_points.map((p, i) => `${i + 1}. ${p}`).join('\n')}

**Model Answer:**
${req.model_answer}

**Evaluation Rubric:**
${req.evaluation_rubric}

---

**Student's Answer:**
${req.answer_text}

**Word Count:** ${req.word_count}
**Time Spent:** ${req.time_spent_seconds} seconds
**Recommended Time:** ${req.recommended_time_seconds} seconds

---

Return a JSON object with EXACTLY this schema (no markdown, no code fences, just raw JSON):
{
  "score": <number 0 to ${req.marks}>,
  "max_score": ${req.marks},
  "percentage": <number 0-100>,
  "correctness": "<correct|mostly_correct|partially_correct|incorrect>",
  "time_assessment": "<too_fast|on_time|slightly_slow|too_slow>",
  "ideal_word_range": { "min": <number>, "max": <number> },
  "over_explaining": <boolean>,
  "under_explaining": <boolean>,
  "missing_points": ["<specific missing concept>", ...],
  "incorrect_points": ["<specific error>", ...],
  "strengths": ["<specific strength>", ...],
  "improvements": ["<specific improvement>", ...],
  "shorter_exam_version": "<concise exam-optimized rewrite of the answer>",
  "corrected_answer": "<corrected version keeping student's style>",
  "examiner_feedback": "<2-3 sentence examiner-style feedback>",
  "confidence": <number 0.0 to 1.0>
}`;
}

export async function POST(request: Request) {
  try {
    // Validate API key
    if (!GEMINI_API_KEY) {
      return Response.json(
        {
          error: 'Gemini API key not configured',
          message: 'Add GEMINI_API_KEY to your .env.local file. Get one free at https://aistudio.google.com/apikey',
        },
        { status: 503 }
      );
    }

    // Parse request body
    const body = await request.json() as EvaluationRequest;

    // Validate required fields
    if (!body.question_text || !body.answer_text) {
      return Response.json(
        { error: 'Missing required fields: question_text and answer_text' },
        { status: 400 }
      );
    }

    // Empty answer shortcut
    if (!body.answer_text.trim()) {
      const emptyResult: EvaluationResponse = {
        score: 0,
        max_score: body.marks || 0,
        percentage: 0,
        correctness: 'incorrect',
        time_assessment: 'too_fast',
        ideal_word_range: { min: 50, max: 200 },
        over_explaining: false,
        under_explaining: true,
        missing_points: body.expected_points || ['No answer provided'],
        incorrect_points: [],
        strengths: [],
        improvements: ['Write an answer — even a partial attempt scores more than a blank.'],
        shorter_exam_version: '',
        corrected_answer: '',
        examiner_feedback: 'No answer was provided. Always attempt a question, even partially — it can earn you marks.',
        confidence: 1.0,
      };
      return Response.json(emptyResult);
    }

    // Call Gemini
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: buildEvaluationPrompt(body),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.3,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text ?? '';

    // Parse the JSON response
    let evaluation: EvaluationResponse;
    try {
      // Strip code fences if present
      const cleaned = text.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
      evaluation = JSON.parse(cleaned);
    } catch {
      return Response.json(
        { error: 'Failed to parse AI response', raw: text },
        { status: 502 }
      );
    }

    // Clamp score within bounds
    evaluation.score = Math.max(0, Math.min(evaluation.score, body.marks));
    evaluation.max_score = body.marks;
    evaluation.percentage = Math.round((evaluation.score / body.marks) * 100);

    return Response.json(evaluation);
  } catch (err) {
    console.error('Gemini evaluation error:', err);
    return Response.json(
      { error: 'Evaluation failed', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
