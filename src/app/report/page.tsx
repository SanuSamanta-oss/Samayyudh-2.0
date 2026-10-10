'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Printer, ArrowLeft, Brain, 
  CheckCircle2, XCircle, TrendingUp, Sparkles
} from 'lucide-react';
import { formatDuration, formatTime } from '@/lib/utils';
import * as localDB from '@/lib/store/local-db';
import { questionBank } from '@/lib/questions';
import type { ExamSession, Answer, AnswerEvaluation, Question } from '@/types';

function ReportInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');

  const [session, setSession] = useState<ExamSession | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [evaluations, setEvaluations] = useState<Map<string, AnswerEvaluation>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      setLoading(true);
      const sess = await localDB.getSession(sessionId);
      if (!sess) { setLoading(false); return; }
      setSession(sess);

      const ans = await localDB.getAnswersBySession(sessionId);
      setAnswers(ans);

      const questionIds = new Set(ans.map(a => a.question_id));
      const customQs = await localDB.getAllCustomQuestions();
      const allQuestions = [...questionBank, ...customQs];
      const matched = allQuestions.filter(q => questionIds.has(q.id));
      setQuestions(matched);

      const answerIds = ans.map(a => a.id);
      const cached = await localDB.getEvaluationsByAnswerIds(answerIds);
      const evalMap = new Map<string, AnswerEvaluation>();
      cached.forEach(e => evalMap.set(e.question_id, e));
      setEvaluations(evalMap);

      setLoading(false);
    })();
  }, [sessionId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-2xl font-bold mb-4">Session Not Found</h1>
        <Link href="/history" className="text-brand-600 hover:underline">Return to History</Link>
      </div>
    );
  }

  const answeredCount = answers.filter(a => a.answer_text.trim()).length;
  const totalTimeSpent = answers.reduce((sum, a) => sum + a.time_spent_seconds, 0);
  const hasEvaluations = evaluations.size > 0;

  let totalScore = 0;
  let totalMaxScore = 0;
  if (hasEvaluations) {
    for (const ev of evaluations.values()) {
      totalScore += ev.score;
      totalMaxScore += ev.max_score;
    }
  }
  const scorePercentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-8 font-sans">
      {/* Non-printable controls */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between print:hidden bg-stone-50 p-4 rounded-xl border border-stone-200">
        <Link href={`/results?session=${session.id}`} className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-black">
          <ArrowLeft className="w-4 h-4" /> Back to Results
        </Link>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-stone-800"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      {/* Printable Report Document */}
      <div className="max-w-4xl mx-auto space-y-8 bg-white print:m-0 print:p-0 print:block">
        
        {/* Report Header */}
        <div className="border-b-2 border-black pb-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">SamayYudh 2.0 Report</h1>
            <h2 className="text-xl font-medium text-stone-600">{session.title}</h2>
            <p className="text-sm text-stone-500 mt-2">
              Date: {new Date(session.started_at).toLocaleString('en-IN')}
            </p>
          </div>
          {hasEvaluations && (
            <div className="text-center sm:text-right border-2 border-black rounded-lg p-4 bg-stone-50">
              <div className="text-4xl font-bold">{scorePercentage}%</div>
              <div className="text-sm font-medium text-stone-600 uppercase tracking-widest mt-1">Final Score</div>
              <div className="text-xs text-stone-500 mt-1">{totalScore} out of {totalMaxScore} marks</div>
            </div>
          )}
        </div>

        {/* Global Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 border border-stone-300 rounded-lg">
            <div className="text-stone-500 text-xs font-bold uppercase mb-1">Questions</div>
            <div className="text-xl font-semibold">{answeredCount} / {session.total_questions} answered</div>
          </div>
          <div className="p-4 border border-stone-300 rounded-lg">
            <div className="text-stone-500 text-xs font-bold uppercase mb-1">Time Used</div>
            <div className="text-xl font-semibold">{formatDuration(totalTimeSpent)}</div>
          </div>
          <div className="p-4 border border-stone-300 rounded-lg">
            <div className="text-stone-500 text-xs font-bold uppercase mb-1">Exam Mode</div>
            <div className="text-xl font-semibold capitalize">{session.mode.replace('_', ' ')}</div>
          </div>
          <div className="p-4 border border-stone-300 rounded-lg">
            <div className="text-stone-500 text-xs font-bold uppercase mb-1">Evaluated By</div>
            <div className="text-xl font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5" /> Gemini AI
            </div>
          </div>
        </div>

        {/* Detailed Feedback Loop */}
        <div className="space-y-12">
          <h3 className="text-2xl font-bold border-b border-stone-200 pb-2 mb-6">Detailed Analysis</h3>
          
          {questions.map((q, idx) => {
            const answer = answers.find(a => a.question_id === q.id);
            const evaluation = evaluations.get(q.id);
            const isAnswered = answer && answer.answer_text.trim().length > 0;

            return (
              <div key={q.id} className="border border-stone-300 rounded-xl overflow-hidden print:break-inside-avoid">
                {/* Question Header */}
                <div className="bg-stone-100 p-4 border-b border-stone-300">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-block bg-black text-white text-xs font-bold px-2 py-1 rounded mb-2">
                        Q{idx + 1}
                      </span>
                      <h4 className="text-base font-semibold">{q.question_text}</h4>
                    </div>
                    {evaluation && (
                      <div className="text-right shrink-0">
                        <div className="text-lg font-bold">{evaluation.score}/{evaluation.max_score}</div>
                        <div className="text-xs uppercase font-medium">{evaluation.correctness.replace('_', ' ')}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Answer Section */}
                <div className="p-4 bg-white border-b border-stone-200">
                  <h5 className="text-xs font-bold uppercase text-stone-500 mb-2">Your Answer</h5>
                  {isAnswered ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{answer.answer_text}</p>
                  ) : (
                    <p className="text-sm italic text-stone-400">Not answered</p>
                  )}
                  
                  {isAnswered && (
                    <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-stone-100 text-xs text-stone-500">
                      <span>Time taken: {formatTime(answer.time_spent_seconds)}</span>
                      {evaluation && <span>Recommended time: {formatTime(evaluation.recommended_time_seconds)}</span>}
                      <span>Word count: {answer.word_count}</span>
                    </div>
                  )}
                </div>

                {/* Evaluation Section */}
                {evaluation && (
                  <div className="p-4 bg-stone-50">
                    <h5 className="text-xs font-bold uppercase text-stone-500 mb-3 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" /> AI Examiner Feedback
                    </h5>
                    
                    <p className="text-sm mb-4 bg-white p-3 border border-stone-200 rounded">{evaluation.examiner_feedback}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {evaluation.strengths.length > 0 && (
                        <div>
                          <h6 className="font-semibold flex items-center gap-1 mb-1 text-emerald-800">
                            <CheckCircle2 className="w-4 h-4" /> Strengths
                          </h6>
                          <ul className="list-disc pl-5 space-y-1 text-stone-700">
                            {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                      
                      {evaluation.improvements.length > 0 && (
                        <div>
                          <h6 className="font-semibold flex items-center gap-1 mb-1 text-amber-800">
                            <TrendingUp className="w-4 h-4" /> Areas for Improvement
                          </h6>
                          <ul className="list-disc pl-5 space-y-1 text-stone-700">
                            {evaluation.improvements.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                      
                      {evaluation.missing_points.length > 0 && (
                        <div className="md:col-span-2">
                          <h6 className="font-semibold flex items-center gap-1 mb-1 text-red-800">
                            <XCircle className="w-4 h-4" /> Missing Concepts
                          </h6>
                          <ul className="list-disc pl-5 space-y-1 text-stone-700">
                            {evaluation.missing_points.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t border-stone-300 text-center text-xs text-stone-500 font-medium pb-8">
          Generated by SamayYudh 2.0 • The Battle Between You & The Clock
        </div>

      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ReportInner />
    </Suspense>
  );
}
