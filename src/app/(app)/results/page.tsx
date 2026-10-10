'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import {
  Trophy, Clock, Target, BarChart3, ChevronRight, ArrowLeft,
  CheckCircle2, XCircle, AlertTriangle, Zap, ChevronDown, ChevronUp,
  Sparkles, Brain, TrendingUp, FileText, Timer, Loader2, Printer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDuration, formatTime, percentage } from '@/lib/utils';
import * as localDB from '@/lib/store/local-db';
import { evaluateSession, checkGeminiStatus } from '@/lib/gemini';
import { questionBank } from '@/lib/questions';
import type { ExamSession, Answer, AnswerEvaluation, Question } from '@/types';

// --- Correctness badge helpers ---
const correctnessConfig = {
  correct: { label: 'Correct', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  mostly_correct: { label: 'Mostly Correct', color: 'text-blue-700 bg-blue-50 border-blue-200', icon: TrendingUp },
  partially_correct: { label: 'Partial', color: 'text-amber-700 bg-amber-50 border-amber-200', icon: AlertTriangle },
  incorrect: { label: 'Incorrect', color: 'text-red-700 bg-red-50 border-red-200', icon: XCircle },
};

const timeConfig = {
  too_fast: { label: 'Too Fast', color: 'text-amber-600', icon: '⚡' },
  on_time: { label: 'On Time', color: 'text-emerald-600', icon: '✓' },
  slightly_slow: { label: 'Slightly Slow', color: 'text-orange-600', icon: '⏱️' },
  too_slow: { label: 'Too Slow', color: 'text-red-600', icon: '🐢' },
};

function ResultsInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');

  const [session, setSession] = useState<ExamSession | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [evaluations, setEvaluations] = useState<Map<string, AnswerEvaluation>>(new Map());
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalProgress, setEvalProgress] = useState({ done: 0, total: 0 });
  const [apiConfigured, setApiConfigured] = useState<boolean | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load session data from IndexedDB
  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      setLoading(true);
      const sess = await localDB.getSession(sessionId);
      if (!sess) { setLoading(false); return; }
      setSession(sess);

      const ans = await localDB.getAnswersBySession(sessionId);
      setAnswers(ans);

      // Match questions from the bank
      const questionIds = new Set(ans.map(a => a.question_id));
      const customQs = await localDB.getAllCustomQuestions();
      const allQuestions = [...questionBank, ...customQs];
      const matched = allQuestions.filter(q => questionIds.has(q.id));
      setQuestions(matched);

      // Load cached evaluations
      const answerIds = ans.map(a => a.id);
      const cached = await localDB.getEvaluationsByAnswerIds(answerIds);
      const evalMap = new Map<string, AnswerEvaluation>();
      cached.forEach(e => evalMap.set(e.question_id, e));
      setEvaluations(evalMap);

      // Check API
      const status = await checkGeminiStatus();
      setApiConfigured(status.configured);
      if (!status.configured) setApiError(status.error || null);

      setLoading(false);
    })();
  }, [sessionId]);

  const runEvaluation = useCallback(async () => {
    if (!session || isEvaluating) return;
    setIsEvaluating(true);
    setApiError(null);

    const answerMap = new Map<string, Answer>();
    answers.forEach(a => answerMap.set(a.question_id, a));

    try {
      const results = await evaluateSession(
        questions,
        answerMap,
        (done, total) => setEvalProgress({ done, total }),
      );

      // Save each evaluation to IndexedDB
      for (const evaluation of results.values()) {
        await localDB.saveEvaluation(evaluation);
      }

      if (results.size === 0 && answerMap.size > 0) {
        throw new Error("The AI rejected the evaluation requests. Please ensure you are not hitting rate limits and try again.");
      }

      setEvaluations(results);

      // Update session evaluation status
      if (session) {
        const updated = { ...session, evaluation_status: 'completed' as const };
        await localDB.saveSession(updated);
        setSession(updated);
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Evaluation failed');
    } finally {
      setIsEvaluating(false);
    }
  }, [session, answers, questions, isEvaluating]);

  const toggleCard = (questionId: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-stone-500">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto text-amber-400 mb-3" />
        <h2 className="text-xl font-bold text-foreground mb-2">Session not found</h2>
        <p className="text-stone-500 mb-6">This exam session couldn&apos;t be loaded.</p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-brand">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
      </div>
    );
  }

  // Compute aggregate stats
  const answeredCount = answers.filter(a => a.answer_text.trim()).length;
  const totalTimeSpent = answers.reduce((sum, a) => sum + a.time_spent_seconds, 0);
  const hasEvaluations = evaluations.size > 0;

  let totalScore = 0;
  let totalMaxScore = 0;
  let avgConfidence = 0;
  if (hasEvaluations) {
    for (const ev of evaluations.values()) {
      totalScore += ev.score;
      totalMaxScore += ev.max_score;
      avgConfidence += ev.confidence;
    }
    avgConfidence = evaluations.size > 0 ? avgConfidence / evaluations.size : 0;
  }
  const scorePercentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

  const timeEfficiency = session.duration_seconds > 0
    ? Math.round((totalTimeSpent / session.duration_seconds) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6 md:py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-brand text-white text-3xl shadow-lg shadow-brand-500/25">
          🏆
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Exam Complete!</h1>
        <p className="text-stone-500 text-sm">{session.title}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-brand-600 bg-brand-50">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-foreground">
            {hasEvaluations ? `${totalScore}/${totalMaxScore}` : '—'}
          </span>
          <span className="text-xs text-stone-500">Score</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-emerald-600 bg-emerald-50">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-foreground">{formatDuration(totalTimeSpent)}</span>
          <span className="text-xs text-stone-500">Time Used</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-amber-600 bg-amber-50">
            <Target className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-foreground">
            {hasEvaluations ? `${scorePercentage}%` : '—'}
          </span>
          <span className="text-xs text-stone-500">Accuracy</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-rose-600 bg-rose-50">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-foreground">{timeEfficiency}%</span>
          <span className="text-xs text-stone-500">Time Efficiency</span>
        </div>
      </div>

      {/* Completion bar */}
      <div className="bg-card rounded-xl border border-border p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Questions Answered</span>
          <span className="text-stone-500">{answeredCount}/{session.total_questions}</span>
        </div>
        <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-brand transition-all duration-700"
            style={{ width: `${percentage(answeredCount, session.total_questions)}%` }}
          />
        </div>
      </div>

      {/* AI Evaluation Section */}
      {!hasEvaluations ? (
        <div className="bg-gradient-to-br from-brand-50 to-accent-50 border border-brand-200 rounded-2xl p-6 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-card shadow-sm overflow-hidden">
            <img src="/gemini-logo.jpg" alt="Gemini" className="w-10 h-10 object-cover" />
          </div>
          <h3 className="text-lg font-bold text-foreground">AI-Powered Evaluation</h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Get detailed AI feedback on every answer — scores, missing concepts, time assessment, and a rewritten exam-optimized version.
          </p>

          {apiConfigured === false && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700">
              <AlertTriangle className="w-4 h-4" />
              <span>{apiError || 'Add GEMINI_API_KEY to .env.local'}</span>
            </div>
          )}

          {apiError && apiConfigured !== false && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <XCircle className="w-4 h-4" />
              <span>{apiError}</span>
            </div>
          )}

          {isEvaluating ? (
            <div className="space-y-3 max-w-xs mx-auto">
              <div className="flex items-center justify-center gap-2 text-sm text-brand-700">
                <Loader2 className="w-4 h-4 animate-spin" />
                Evaluating {evalProgress.done}/{evalProgress.total} answers...
              </div>
              <div className="h-2 rounded-full bg-brand-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-brand transition-all duration-300"
                  style={{ width: `${evalProgress.total > 0 ? (evalProgress.done / evalProgress.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={runEvaluation}
              disabled={apiConfigured === false || answeredCount === 0}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src="/gemini-logo.jpg" alt="Gemini" className="w-4 h-4 rounded-full" /> Evaluate with Gemini AI
            </button>
          )}
        </div>
      ) : (
        /* Score overview when evaluations exist */
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center overflow-hidden">
                <img src="/gemini-logo.jpg" alt="Gemini" className="w-8 h-8 rounded-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">AI Evaluation Complete</h3>
                <p className="text-xs text-stone-500">{evaluations.size} answers evaluated · {Math.round(avgConfidence * 100)}% confidence</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-right">
              <button
                onClick={runEvaluation}
                disabled={isEvaluating}
                className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg border border-border bg-background hover:bg-stone-50 disabled:opacity-50 transition-colors"
              >
                {isEvaluating ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Re-evaluating...</>
                ) : (
                  <><Brain className="w-3.5 h-3.5" /> Re-evaluate</>
                )}
              </button>
              <div className="border-l border-border pl-4">
                <div className="text-3xl font-bold text-gradient-brand">{scorePercentage}%</div>
                <div className="text-xs text-stone-500">{totalScore}/{totalMaxScore} marks</div>
              </div>
            </div>
          </div>

          {/* Score bar */}
          <div className="h-3 rounded-full bg-stone-100 overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-1000',
                scorePercentage >= 80 ? 'bg-emerald-500' :
                scorePercentage >= 60 ? 'bg-blue-500' :
                scorePercentage >= 40 ? 'bg-amber-500' : 'bg-red-500'
              )}
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Per-Question Results */}
      {hasEvaluations && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600" />
            Question-by-Question Breakdown
          </h3>

          {questions.map((q, idx) => {
            const answer = answers.find(a => a.question_id === q.id);
            const evaluation = evaluations.get(q.id);
            const isExpanded = expandedCards.has(q.id);
            const corr = evaluation ? correctnessConfig[evaluation.correctness] : null;
            const timeAssess = evaluation ? timeConfig[evaluation.time_assessment] : null;

            return (
              <div key={q.id} className="bg-card rounded-xl border border-border overflow-hidden">
                {/* Card Header */}
                <button
                  onClick={() => toggleCard(q.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-stone-400 w-6">Q{idx + 1}</span>
                    <p className="text-sm font-medium text-foreground truncate">{q.question_text.slice(0, 80)}…</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {evaluation ? (
                      <>
                        <span className={cn('text-sm font-bold', scoreColor(evaluation.percentage))}>
                          {evaluation.score}/{evaluation.max_score}
                        </span>
                        {corr && (
                          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', corr.color)}>
                            {corr.label}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-stone-400">Not answered</span>
                    )}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </div>
                </button>

                {/* Card Body */}
                {isExpanded && evaluation && (
                  <div className="px-4 pb-4 pt-1 border-t border-border space-y-4">
                    {/* Meta row */}
                    <div className="flex flex-wrap gap-3 text-xs">
                      <span className="flex items-center gap-1 text-stone-500">
                        <Timer className="w-3.5 h-3.5" />
                        {formatTime(evaluation.actual_time_seconds)} / {formatTime(evaluation.recommended_time_seconds)} recommended
                      </span>
                      {timeAssess && (
                        <span className={cn('font-medium', timeAssess.color)}>
                          {timeAssess.icon} {timeAssess.label}
                        </span>
                      )}
                      <span className="text-stone-500">
                        {answer?.word_count ?? 0} words (ideal: {evaluation.ideal_word_range.min}–{evaluation.ideal_word_range.max})
                      </span>
                    </div>

                    {/* Strengths */}
                    {evaluation.strengths.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-emerald-700 mb-1.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                        </h4>
                        <ul className="space-y-1">
                          {evaluation.strengths.map((s, i) => (
                            <li key={i} className="text-xs text-stone-600 pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-emerald-400">{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Improvements */}
                    {evaluation.improvements.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-amber-700 mb-1.5 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" /> Improvements
                        </h4>
                        <ul className="space-y-1">
                          {evaluation.improvements.map((s, i) => (
                            <li key={i} className="text-xs text-stone-600 pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-amber-400">{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Missing Points */}
                    {evaluation.missing_points.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-red-700 mb-1.5 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Missing Concepts
                        </h4>
                        <ul className="space-y-1">
                          {evaluation.missing_points.map((s, i) => (
                            <li key={i} className="text-xs text-stone-600 pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-red-400">{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Examiner Feedback */}
                    <div className="bg-brand-50 rounded-lg p-3 border border-brand-100">
                      <h4 className="text-xs font-semibold text-brand-700 mb-1 flex items-center gap-1">
                        <img src="/gemini-logo.jpg" alt="Gemini" className="w-3.5 h-3.5 object-cover" /> Examiner Feedback
                      </h4>
                      <p className="text-xs text-brand-800 leading-relaxed">{evaluation.examiner_feedback}</p>
                    </div>

                    {/* Shorter Exam Version */}
                    {evaluation.shorter_exam_version && (
                      <details className="group">
                        <summary className="text-xs font-semibold text-stone-600 cursor-pointer hover:text-brand-600 transition-colors flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" /> View Exam-Optimized Answer
                        </summary>
                        <div className="mt-2 p-3 rounded-lg bg-stone-50 border border-stone-200">
                          <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">{evaluation.shorter_exam_version}</p>
                        </div>
                      </details>
                    )}

                    {/* Corrected Answer */}
                    {evaluation.corrected_answer && (
                      <details className="group">
                        <summary className="text-xs font-semibold text-stone-600 cursor-pointer hover:text-brand-600 transition-colors flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> View Corrected Answer
                        </summary>
                        <div className="mt-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                          <p className="text-xs text-emerald-800 leading-relaxed whitespace-pre-wrap">{evaluation.corrected_answer}</p>
                        </div>
                      </details>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/dashboard"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <Link
          href="/history"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-stone-50 transition-colors"
        >
          <Clock className="w-4 h-4" /> History
        </Link>
        <Link
          href={`/report?session=${session.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors"
        >
          <Printer className="w-4 h-4" /> Full Report
        </Link>
        <Link
          href="/practice"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity"
        >
          New Battle <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function scoreColor(pct: number): string {
  if (pct >= 80) return 'text-emerald-600';
  if (pct >= 60) return 'text-blue-600';
  if (pct >= 40) return 'text-amber-600';
  return 'text-red-600';
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResultsInner />
    </Suspense>
  );
}
