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
import { canEvaluateDeterministically } from '@/lib/evaluation/hybrid-evaluator';
import { questionBank } from '@/lib/questions';
import type { ExamSession, Answer, AnswerEvaluation, Question } from '@/types';
import { processCompletedMockTest } from '@/lib/achievements/client';
import { AchievementUnlockModal } from '@/components/achievements/AchievementUnlockModal';
import type { AchievementDefinition, UserAchievement } from '@/types/achievements';

// --- Correctness badge helpers ---
const correctnessConfig = {
  correct: {
    label: 'Correct',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/60 dark:border-emerald-800/80',
    icon: CheckCircle2,
  },
  mostly_correct: {
    label: 'Mostly Correct',
    color: 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-950/60 dark:border-blue-800/80',
    icon: TrendingUp,
  },
  partially_correct: {
    label: 'Partial',
    color: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950/60 dark:border-amber-800/80',
    icon: AlertTriangle,
  },
  incorrect: {
    label: 'Incorrect',
    color: 'text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-950/60 dark:border-red-800/80',
    icon: XCircle,
  },
};

const timeConfig = {
  too_fast: { label: 'Too Fast', color: 'text-amber-600 dark:text-amber-400', icon: '⚡' },
  on_time: { label: 'On Time', color: 'text-emerald-600 dark:text-emerald-400', icon: '✓' },
  slightly_slow: { label: 'Slightly Slow', color: 'text-orange-600 dark:text-orange-400', icon: '⏱️' },
  too_slow: { label: 'Too Slow', color: 'text-red-600 dark:text-red-400', icon: '🐢' },
};

function userDisplayAnswer(q: Question, answer?: Answer): string {
  if (!answer) return 'Not attempted';
  const text = (answer.answer_text || '').trim();
  const selected = answer.selected_option || (text.startsWith('opt_') ? text : null);
  if (selected && q.options) {
    const opt = q.options.find(o => o.id === selected || o.id.replace('opt_', '') === selected.replace('opt_', ''));
    if (opt) {
      return `(${opt.id.replace('opt_', '').toUpperCase()}) ${opt.text}`;
    }
  }
  return text || 'No answer provided';
}

function expectedDisplayAnswer(q: Question, evaluation?: AnswerEvaluation): string {
  if (q.options && q.options.length > 0) {
    const correctOpts = q.options.filter(o => o.is_correct || q.correct_answer === o.id || q.correct_answer === o.id.replace('opt_', ''));
    if (correctOpts.length > 0) {
      return correctOpts.map(o => `(${o.id.replace('opt_', '').toUpperCase()}) ${o.text}`).join(', ');
    }
  }
  if (evaluation?.shorter_exam_version) {
    return evaluation.shorter_exam_version;
  }
  if (q.correct_answer && typeof q.correct_answer === 'string') {
    return q.correct_answer;
  }
  return q.model_answer || 'See rubric';
}

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
  const [unlockedAchievement, setUnlockedAchievement] = useState<{
    achievement: AchievementDefinition;
    record: UserAchievement;
  } | null>(null);

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
      if (evalMap.size > 0) {
        setExpandedCards(new Set(matched.map(q => q.id)));
      }

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
      setExpandedCards(new Set(questions.map(q => q.id)));

      // Update session evaluation status
      if (session) {
        const updated = { ...session, evaluation_status: 'completed' as const };
        await localDB.saveSession(updated);
        setSession(updated);

        // Calculate final score & evaluate achievements
        let finalScore = 0;
        let finalMaxScore = 0;
        for (const ev of results.values()) {
          finalScore += ev.score;
          finalMaxScore += ev.max_score;
        }

        const totalTimeSpent = answers.reduce((sum, a) => sum + a.time_spent_seconds, 0);

        try {
          const achResult = await processCompletedMockTest({
            userId: session.user_id || 'local-user',
            testId: session.id,
            title: session.title,
            examCategory: (questions[0]?.exam_category as string) || session.exam_code || 'MOCK_EXAM',
            examCode: session.exam_code,
            score: finalScore,
            maximumMarks: finalMaxScore || session.total_marks || 100,
            durationSeconds: totalTimeSpent,
          });

          // If a new achievement was earned, trigger celebratory popup
          if (achResult.new_achievements.length > 0) {
            setUnlockedAchievement(achResult.new_achievements[0]);
          }
        } catch (achErr) {
          console.warn('Achievement evaluation error:', achErr);
        }
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
          <p className="text-sm text-stone-500 dark:text-slate-400">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto text-amber-400 mb-3" />
        <h2 className="text-xl font-bold text-foreground mb-2">Session not found</h2>
        <p className="text-stone-500 dark:text-slate-400 mb-6">This exam session couldn&apos;t be loaded.</p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-brand">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
      </div>
    );
  }

  // Compute aggregate stats
  const answeredCount = answers.filter(a => 
    (a.answer_text && a.answer_text.trim().length > 0) ||
    a.selected_option ||
    (a.selected_options && a.selected_options.length > 0)
  ).length;
  const hasSubjectiveAnswers = questions.some(q => {
    const ans = answers.find(a => a.question_id === q.id);
    if (!ans) return false;
    const isAnswered = (ans.answer_text && ans.answer_text.trim().length > 0) ||
      ans.selected_option ||
      (ans.selected_options && ans.selected_options.length > 0);
    return isAnswered && !canEvaluateDeterministically(q);
  });
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
        <p className="text-stone-500 dark:text-slate-400 text-sm">{session.title}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-foreground">
            {hasEvaluations ? `${totalScore}/${totalMaxScore}` : '—'}
          </span>
          <span className="text-xs text-stone-500 dark:text-slate-400">Score</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-foreground">{formatDuration(totalTimeSpent)}</span>
          <span className="text-xs text-stone-500 dark:text-slate-400">Time Used</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60">
            <Target className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-foreground">
            {hasEvaluations ? `${scorePercentage}%` : '—'}
          </span>
          <span className="text-xs text-stone-500 dark:text-slate-400">Accuracy</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-foreground">{timeEfficiency}%</span>
          <span className="text-xs text-stone-500 dark:text-slate-400">Time Efficiency</span>
        </div>
      </div>

      {/* Completion bar */}
      <div className="bg-card rounded-xl border border-border p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Questions Answered</span>
          <span className="text-stone-500 dark:text-slate-400">{answeredCount}/{session.total_questions}</span>
        </div>
        <div className="h-2 rounded-full bg-stone-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-brand transition-all duration-700"
            style={{ width: `${percentage(answeredCount, session.total_questions)}%` }}
          />
        </div>
      </div>

      {/* AI Evaluation Section */}
      {!hasEvaluations ? (
        <div className="bg-gradient-to-br from-brand-50 to-accent-50 dark:from-slate-900/90 dark:to-brand-950/40 border border-brand-200 dark:border-brand-900/60 rounded-2xl p-6 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-card shadow-sm overflow-hidden">
            <img src="/gemini-logo.jpg" alt="Gemini" className="w-10 h-10 object-cover" />
          </div>
          <h3 className="text-lg font-bold text-foreground">AI-Powered Evaluation</h3>
          <p className="text-sm text-stone-600 dark:text-slate-300 max-w-md mx-auto">
            Get detailed AI feedback on every answer — scores, missing concepts, time assessment, and a rewritten exam-optimized version.
          </p>

          {hasSubjectiveAnswers && apiConfigured === false && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4" />
              <span>{apiError || 'Add GEMINI_API_KEY to .env.local to evaluate written answers'}</span>
            </div>
          )}

          {apiError && apiConfigured !== false && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
              <XCircle className="w-4 h-4" />
              <span>{apiError}</span>
            </div>
          )}

          {isEvaluating ? (
            <div className="space-y-3 max-w-xs mx-auto">
              <div className="flex items-center justify-center gap-2 text-sm text-brand-700 dark:text-brand-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                Evaluating {evalProgress.done}/{evalProgress.total} answers...
              </div>
              <div className="h-2 rounded-full bg-brand-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-brand transition-all duration-300"
                  style={{ width: `${evalProgress.total > 0 ? (evalProgress.done / evalProgress.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={runEvaluation}
              disabled={(hasSubjectiveAnswers && apiConfigured === false) || answeredCount === 0}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" /> Evaluate Answers (Instant Hybrid)
            </button>
          )}
        </div>
      ) : (
        /* Score overview when evaluations exist */
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center overflow-hidden shrink-0">
                <img src="/gemini-logo.jpg" alt="Gemini" className="w-8 h-8 rounded-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">AI Evaluation Complete</h3>
                <p className="text-xs text-stone-500 dark:text-slate-400">{evaluations.size} answers evaluated · {Math.round(avgConfidence * 100)}% confidence</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={runEvaluation}
                disabled={isEvaluating}
                className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-stone-50 dark:hover:bg-slate-800 text-foreground disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isEvaluating ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Re-evaluating...</>
                ) : (
                  <><Brain className="w-3.5 h-3.5 text-brand-500" /> Re-evaluate</>
                )}
              </button>
              <div className="border border-purple-200 dark:border-purple-800/60 bg-purple-50/80 dark:bg-purple-950/40 rounded-xl px-4 py-2.5 min-w-[120px] text-center shadow-xs">
                <div className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">{scorePercentage}%</div>
                <div className="text-xs text-purple-700 dark:text-purple-300 font-semibold">{totalScore}/{totalMaxScore} marks</div>
              </div>
            </div>
          </div>

          {/* Score bar */}
          <div className="h-2.5 rounded-full bg-stone-100 dark:bg-slate-800 overflow-hidden">
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              Question-by-Question Breakdown
            </h3>
            <button
              onClick={() => {
                if (expandedCards.size === questions.length) {
                  setExpandedCards(new Set());
                } else {
                  setExpandedCards(new Set(questions.map(q => q.id)));
                }
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-600 dark:text-slate-300 hover:text-foreground dark:hover:text-white transition-colors cursor-pointer"
            >
              {expandedCards.size === questions.length ? 'Collapse All' : 'Expand All'}
            </button>
          </div>

          {questions.map((q, idx) => {
            const answer = answers.find(a => a.question_id === q.id);
            const evaluation = evaluations.get(q.id);
            const isExpanded = expandedCards.has(q.id);
            const corr = evaluation ? correctnessConfig[evaluation.correctness] : null;
            const timeAssess = evaluation ? timeConfig[evaluation.time_assessment] : null;

            return (
              <div key={q.id} className="bg-card rounded-xl border border-border overflow-hidden transition-all duration-200">
                {/* Card Header */}
                <button
                  onClick={() => toggleCard(q.id)}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-stone-50 dark:hover:bg-slate-800/40 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <span className="text-xs font-bold text-stone-400 dark:text-slate-400 shrink-0 w-6">Q{idx + 1}</span>
                    <p className="text-sm font-medium text-foreground truncate">{q.question_text.slice(0, 80)}…</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {evaluation ? (
                      <>
                        <span className={cn('text-sm font-bold', scoreColor(evaluation.percentage))}>
                          {evaluation.score}/{evaluation.max_score}
                        </span>
                        {corr && (
                          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs', corr.color)}>
                            {corr.label}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-stone-400 dark:text-slate-500">Not answered</span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-stone-400 dark:text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 dark:text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Card Body */}
                {isExpanded && evaluation && (
                  <div className="px-4 pb-5 pt-2 border-t border-border space-y-4">
                    {/* Full Question Text */}
                    <div className="bg-stone-50 dark:bg-slate-900/70 p-4 rounded-xl border border-stone-200 dark:border-slate-800 mt-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
                          Question Statement
                        </span>
                        <span className="text-[10px] font-semibold text-stone-400 dark:text-slate-400 uppercase tracking-wider">
                          {(q.question_type || 'question').replace('_', ' ')} · {q.marks || 1} mark{(q.marks || 1) > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-sm text-stone-800 dark:text-slate-100 font-medium leading-relaxed whitespace-pre-wrap select-text">
                        {q.question_text}
                      </p>
                    </div>

                    {/* Submitted vs Expected Answer Banner */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* User's Answer */}
                      <div className={cn(
                        "p-3.5 rounded-xl border transition-all",
                        evaluation.correctness === 'correct'
                          ? "bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60"
                          : "bg-red-500/10 dark:bg-red-950/40 border-red-200 dark:border-red-800/60"
                      )}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-slate-300">
                            Your Submitted Answer
                          </span>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border",
                            evaluation.correctness === 'correct'
                              ? "bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700/60"
                              : "bg-red-100/80 dark:bg-red-900/60 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700/60"
                          )}>
                            {evaluation.correctness === 'correct' ? 'Matched' : 'Incorrect'}
                          </span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          {evaluation.correctness === 'correct' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0">
                            <span className={cn(
                              "text-sm font-semibold leading-relaxed break-words",
                              evaluation.correctness === 'correct'
                                ? "text-emerald-950 dark:text-emerald-100"
                                : "text-red-950 dark:text-red-100"
                            )}>
                              {userDisplayAnswer(q, answer)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Correct Solution */}
                      <div className="p-3.5 rounded-xl border bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-slate-300">
                            Correct / Expected Solution
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700/60">
                            Key
                          </span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="text-sm font-semibold text-emerald-950 dark:text-emerald-100 leading-relaxed break-words">
                              {expectedDisplayAnswer(q, evaluation)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 text-xs py-0.5">
                      <span className="flex items-center gap-1.5 text-stone-500 dark:text-slate-400">
                        <Timer className="w-3.5 h-3.5 text-stone-400 dark:text-slate-500" />
                        <span className="font-medium text-stone-700 dark:text-slate-300">{formatTime(evaluation.actual_time_seconds)}</span> / {formatTime(evaluation.recommended_time_seconds)} recommended
                      </span>
                      <span className="text-stone-300 dark:text-slate-700">·</span>
                      {timeAssess && (
                        <span className={cn('font-semibold flex items-center gap-1', timeAssess.color)}>
                          <span>{timeAssess.icon}</span>
                          <span>{timeAssess.label}</span>
                        </span>
                      )}
                      <span className="text-stone-300 dark:text-slate-700">·</span>
                      <span className="text-stone-500 dark:text-slate-400">
                        <span className="font-medium text-stone-700 dark:text-slate-300">{answer?.word_count ?? 0}</span> words (ideal: {evaluation.ideal_word_range.min}–{evaluation.ideal_word_range.max})
                      </span>
                    </div>

                    {/* Strengths */}
                    {evaluation.strengths.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                        </h4>
                        <ul className="space-y-1">
                          {evaluation.strengths.map((s, i) => (
                            <li key={i} className="text-xs text-stone-700 dark:text-slate-200 pl-4 relative leading-relaxed before:content-['•'] before:absolute before:left-1 before:font-bold before:text-emerald-500 dark:before:text-emerald-400">{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Improvements */}
                    {evaluation.improvements.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1.5 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5" /> Improvements
                        </h4>
                        <ul className="space-y-1">
                          {evaluation.improvements.map((s, i) => (
                            <li key={i} className="text-xs text-stone-700 dark:text-slate-200 pl-4 relative leading-relaxed before:content-['•'] before:absolute before:left-1 before:font-bold before:text-amber-500 dark:before:text-amber-400">{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Missing Points */}
                    {evaluation.missing_points.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-red-700 dark:text-red-400 mb-1.5 flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5" /> Missing Concepts
                        </h4>
                        <ul className="space-y-1">
                          {evaluation.missing_points.map((s, i) => (
                            <li key={i} className="text-xs text-stone-700 dark:text-slate-200 pl-4 relative leading-relaxed before:content-['•'] before:absolute before:left-1 before:font-bold before:text-red-500 dark:before:text-red-400">{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Incorrect Points */}
                    {evaluation.incorrect_points && evaluation.incorrect_points.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 mb-1.5 flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect Concepts
                        </h4>
                        <ul className="space-y-1">
                          {evaluation.incorrect_points.map((s, i) => (
                            <li key={i} className="text-xs text-stone-700 dark:text-slate-200 pl-4 relative leading-relaxed before:content-['•'] before:absolute before:left-1 before:font-bold before:text-rose-500 dark:before:text-rose-400">{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Examiner Feedback */}
                    <div className="bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl p-3.5 border border-indigo-200 dark:border-indigo-800/60">
                      <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1.5 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Examiner Feedback
                      </h4>
                      <p className="text-xs text-indigo-950 dark:text-indigo-100 font-medium leading-relaxed">{evaluation.examiner_feedback}</p>
                    </div>

                    {/* Shorter Exam Version */}
                    {evaluation.shorter_exam_version && (
                      <details className="group">
                        <summary className="text-xs font-semibold text-stone-600 dark:text-slate-300 cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5 select-none">
                          <Zap className="w-3.5 h-3.5 text-amber-500" /> View Exam-Optimized Answer
                        </summary>
                        <div className="mt-2 p-3.5 rounded-xl bg-stone-50 dark:bg-slate-900/70 border border-stone-200 dark:border-slate-800">
                          <p className="text-xs text-stone-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{evaluation.shorter_exam_version}</p>
                        </div>
                      </details>
                    )}

                    {/* Corrected Answer */}
                    {evaluation.corrected_answer && (
                      <details className="group">
                        <summary className="text-xs font-semibold text-stone-600 dark:text-slate-300 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 select-none">
                          <FileText className="w-3.5 h-3.5 text-emerald-500" /> View Corrected Answer
                        </summary>
                        <div className="mt-2 p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                          <p className="text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed whitespace-pre-wrap">{evaluation.corrected_answer}</p>
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
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-border bg-card hover:bg-stone-50 dark:hover:bg-slate-800 text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <Link
          href="/history"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-border bg-card hover:bg-stone-50 dark:hover:bg-slate-800 text-foreground transition-colors"
        >
          <Clock className="w-4 h-4" /> History
        </Link>
        <Link
          href={`/report?session=${session.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-border bg-card hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950/40 dark:hover:text-brand-300 hover:border-brand-200 dark:hover:border-brand-800 transition-colors"
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

      {/* Achievement Unlock Popup */}
      <AchievementUnlockModal
        unlockedItem={unlockedAchievement}
        onClose={() => setUnlockedAchievement(null)}
        onViewCollection={() => {
          setUnlockedAchievement(null);
          window.location.href = '/achievements';
        }}
      />
    </div>
  );
}

function scoreColor(pct: number): string {
  if (pct >= 80) return 'text-emerald-600 dark:text-emerald-400';
  if (pct >= 60) return 'text-blue-600 dark:text-blue-400';
  if (pct >= 40) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
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
