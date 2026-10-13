'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Printer, ArrowLeft, Brain, 
  CheckCircle2, XCircle, TrendingUp, Sparkles,
  Clock, Timer, FileText
} from 'lucide-react';
import { formatDuration, formatTime, formatMathText } from '@/lib/utils';
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
            <div className="text-center sm:text-right border-2 border-purple-200 rounded-lg p-5 bg-purple-50">
              <div className="text-4xl font-bold text-black">{scorePercentage}%</div>
              <div className="text-sm font-bold text-purple-700 uppercase tracking-widest mt-1">Final Score</div>
              <div className="text-xs font-semibold text-purple-500 mt-1">{totalScore} out of {totalMaxScore} marks</div>
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
                <div className="bg-purple-50/50 p-5 border-b border-purple-100">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-block bg-purple-900 text-white text-xs font-bold px-2.5 py-1 rounded-md mb-3 shadow-sm">
                        Q{idx + 1}
                      </span>
                      <h4 className="text-base font-semibold text-black leading-relaxed whitespace-pre-line">{formatMathText(q.question_text)}</h4>
                    </div>
                    {evaluation && (
                      <div className="text-right shrink-0 bg-white px-3 py-2 rounded-lg border border-purple-100 shadow-sm">
                        <div className="text-lg font-bold text-black">{evaluation.score}/{evaluation.max_score}</div>
                        <div className="text-[10px] text-purple-600 uppercase font-bold tracking-wider">{evaluation.correctness.replace('_', ' ')}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Answer Section */}
                <div className="p-5 bg-white border-b border-purple-100">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">Your Answer</h5>
                  {isAnswered ? (
                    <p className="text-sm font-medium text-black leading-relaxed whitespace-pre-wrap">{answer.answer_text}</p>
                  ) : (
                    <p className="text-sm italic text-stone-400">Not answered</p>
                  )}
                  
                  {isAnswered && (
                    <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-purple-50 text-xs font-medium text-stone-500">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Taken: {formatTime(answer.time_spent_seconds)}</span>
                      {evaluation && <span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5" /> Recommended: {formatTime(evaluation.recommended_time_seconds)}</span>}
                      <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Words: {answer.word_count}</span>
                    </div>
                  )}
                </div>

                {/* Evaluation Section */}
                {evaluation && (
                  <div className="p-5 bg-purple-50/30">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-3 flex items-center gap-1.5">
                      <img src="/gemini-logo.jpg" alt="Gemini" className="w-4 h-4 object-cover" /> AI Examiner Feedback
                    </h5>
                    
                    <p className="text-sm mb-5 bg-white text-black p-4 border border-purple-100 rounded-lg shadow-sm leading-relaxed font-medium">
                      {evaluation.examiner_feedback}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                      {evaluation.strengths.length > 0 && (
                        <div className="bg-green-50/50 p-3 rounded-lg border border-green-100">
                          <h6 className="font-bold flex items-center gap-1.5 mb-2 text-green-700">
                            <CheckCircle2 className="w-4 h-4" /> Core Concepts Mastered
                          </h6>
                          <ul className="list-disc pl-5 space-y-1.5 text-black font-medium">
                            {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                      
                      {evaluation.improvements.length > 0 && (
                        <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                          <h6 className="font-bold flex items-center gap-1.5 mb-2 text-amber-700">
                            <TrendingUp className="w-4 h-4" /> Areas for Improvement
                          </h6>
                          <ul className="list-disc pl-5 space-y-1.5 text-black font-medium">
                            {evaluation.improvements.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                      
                      {(evaluation.missing_points.length > 0 || evaluation.incorrect_points.length > 0) && (
                        <div className="md:col-span-2 bg-red-50/50 p-3 rounded-lg border border-red-100">
                          <h6 className="font-bold flex items-center gap-1.5 mb-2 text-red-700">
                            <XCircle className="w-4 h-4" /> Wrong / Missing Concepts
                          </h6>
                          <ul className="list-disc pl-5 space-y-1.5 text-black font-medium">
                            {evaluation.incorrect_points.map((s, i) => <li key={`inc-${i}`}>{s}</li>)}
                            {evaluation.missing_points.map((s, i) => <li key={`mis-${i}`}>{s}</li>)}
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
