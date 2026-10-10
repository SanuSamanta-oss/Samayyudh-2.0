'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ExamProvider, useExam } from '@/lib/store/exam-store';
import { ExamTimer } from '@/components/exam/ExamTimer';
import { QuestionCard } from '@/components/exam/QuestionCard';
import { AnswerEditor } from '@/components/exam/AnswerEditor';
import { QuestionNavigator } from '@/components/exam/QuestionNavigator';
import { StickyNote } from '@/components/exam/StickyNote';
import { NotesBoard } from '@/components/exam/NotesBoard';
import { MobileQuestionDrawer } from '@/components/exam/MobileQuestionDrawer';
import { questionBank } from '@/lib/questions';
import * as localDB from '@/lib/store/local-db';
import { generateId, now, formatDuration } from '@/lib/utils';
import type { ExamSession, ExamMode, BoardNote, StickyNoteColor } from '@/types';
import {
  ChevronLeft, ChevronRight, Flag, Grid3X3, Send, Award,
  AlertTriangle, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

function ExamSessionInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    state, initSession, goToQuestion, updateAnswer, updateStickyNote,
    flagQuestion, submitExam, currentQuestion, currentAnswer, currentStickyNote,
    getQuestionStatus, stats
  } = useExam();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showMilestone, setShowMilestone] = useState<string | null>(null);
  const [boardNotes, setBoardNotes] = useState<BoardNote[]>([]);

  const handlePin = (content: string, color: StickyNoteColor) => {
    if (!currentQuestion || !state.session) return;
    const note: BoardNote = {
      id: generateId(),
      session_id: state.session.id,
      question_id: currentQuestion.id,
      question_index: state.currentQuestionIndex,
      content,
      color,
      pinned_at: now(),
    };
    setBoardNotes((prev) => [...prev, note]);
  };

  const handleDeleteBoardNote = (id: string) => {
    setBoardNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleBoardNoteColorChange = (id: string, color: StickyNoteColor) => {
    setBoardNotes((prev) => prev.map((n) => n.id === id ? { ...n, color } : n));
  };

  // Initialize session from URL params
  useEffect(() => {
    if (state.session) return; // Already initialized

    const mode = (searchParams.get('mode') || 'quick_battle') as ExamMode;
    const questionCount = Number(searchParams.get('questions') || 10);
    const duration = Number(searchParams.get('duration') || 3600);

    localDB.getAllCustomQuestions().then(customQs => {
      // Select random questions from the combined bank
      const allQuestions = [...questionBank, ...customQs];
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

      const startTime = now();
      const endTime = new Date(Date.now() + duration * 1000).toISOString();

      const session: ExamSession = {
        id: generateId(),
        user_id: 'local-user',
        title: `${mode.replace(/_/g, ' ')} — ${new Date().toLocaleDateString()}`,
        exam_code: searchParams.get('exam') || 'UNIVERSITY',
        mode,
        status: 'in_progress',
        total_questions: selected.length,
        total_marks: selected.reduce((sum, q) => sum + q.marks, 0),
        duration_seconds: duration,
        started_at: startTime,
        ends_at: endTime,
        completed_at: null,
        current_question_index: 0,
        evaluation_status: 'not_started',
        created_at: startTime,
      };

      initSession(session, selected);
    });
  }, [searchParams, state.session, initSession]);

  const handleTimeUp = useCallback(() => {
    // Time up — preserve everything, allow review
  }, []);

  const handlePrev = useCallback(() => {
    goToQuestion(state.currentQuestionIndex - 1);
  }, [goToQuestion, state.currentQuestionIndex]);

  const handleNext = useCallback(() => {
    // Check milestones
    const nextIdx = state.currentQuestionIndex + 1;
    if (nextIdx === 50 && state.questions.length >= 50) {
      setShowMilestone('half_century');
      setTimeout(() => setShowMilestone(null), 3000);
    }
    if (nextIdx === 100 && state.questions.length >= 100) {
      setShowMilestone('century');
      setTimeout(() => setShowMilestone(null), 3000);
    }
    goToQuestion(nextIdx);
  }, [goToQuestion, state.currentQuestionIndex, state.questions.length]);

  const handleSubmit = useCallback(async () => {
    await submitExam();
    setShowSubmitDialog(false);
    router.push('/results?session=' + state.session?.id);
  }, [submitExam, router, state.session?.id]);

  // Warn before leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.session?.status === 'in_progress') {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.session?.status]);

  if (!state.session || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-stone-500">Preparing your battle...</p>
        </div>
      </div>
    );
  }

  const questionIds = state.questions.map(q => q.id);
  const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Milestone Overlay */}
      {showMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="text-center space-y-4 animate-bounce">
            <span className="text-7xl">{showMilestone === 'half_century' ? '🏏' : '🏆'}</span>
            <h2 className="text-3xl font-bold text-white">
              {showMilestone === 'half_century' ? 'HALF CENTURY!' : 'CENTURY!'}
            </h2>
            <p className="text-white/80">{stats.answered} questions answered!</p>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className="sticky top-0 z-20 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-3 md:px-6 flex items-center justify-between h-14 gap-3">
          {/* Left: Title + Progress */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-sm font-semibold text-gradient-brand hidden sm:block">সময়যুদ্ধ</span>
            <div className="text-xs text-stone-500 hidden md:block">
              <span className="font-medium text-foreground">{stats.answered}</span>/{stats.total} answered
            </div>
            {/* Progress bar */}
            <div className="hidden md:block w-24 h-1.5 rounded-full bg-stone-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-brand transition-all duration-500"
                style={{ width: `${(stats.answered / stats.total) * 100}%` }}
              />
            </div>
          </div>

          {/* Center: Marks */}
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Award className="w-4 h-4 text-brand-600" />
            <span><strong className="text-foreground">{state.session.total_marks}</strong> marks</span>
          </div>

          {/* Right: Timer + Actions */}
          <div className="flex items-center gap-2">
            <ExamTimer endsAt={state.session.ends_at} onTimeUp={handleTimeUp} />
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden p-2 rounded-lg border border-border hover:bg-stone-50"
              aria-label="Question navigator"
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-3 md:px-6 py-4 md:py-6">
        <div className="flex gap-6">
          {/* Left: Question + Answer */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Question */}
            <QuestionCard
              question={currentQuestion}
              answer={currentAnswer}
              questionIndex={state.currentQuestionIndex}
              totalQuestions={state.questions.length}
            />

            {/* Answer Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-foreground">Your Answer</h3>
                <div className="flex items-center gap-2">
                  <StickyNote
                    content={currentStickyNote?.content || ''}
                    onChange={(c) => updateStickyNote(currentQuestion.id, c)}
                    onPin={handlePin}
                  />
                  <button
                    onClick={() => flagQuestion(currentQuestion.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all border',
                      currentAnswer?.status === 'flagged'
                        ? 'border-red-300 bg-red-50 text-red-700'
                        : 'border-border text-stone-500 hover:bg-stone-50',
                    )}
                    aria-label={currentAnswer?.status === 'flagged' ? 'Unflag question' : 'Flag question'}
                  >
                    <Flag className="w-4 h-4" />
                    <span className="hidden sm:inline">{currentAnswer?.status === 'flagged' ? 'Flagged' : 'Flag'}</span>
                  </button>
                </div>
              </div>
              <AnswerEditor
                value={currentAnswer?.answer_text || ''}
                onChange={(text) => updateAnswer(currentQuestion.id, text)}
                saveStatus={state.saveStatus}
                disabled={state.isTimeUp}
                options={currentQuestion.options}
              />

              {/* Notes Board */}
              <NotesBoard
                notes={boardNotes}
                onDelete={handleDeleteBoardNote}
                onColorChange={handleBoardNoteColorChange}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrev}
                disabled={state.currentQuestionIndex === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-border bg-card hover:bg-stone-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-2">
                {isLastQuestion ? (
                  <button
                    onClick={() => setShowSubmitDialog(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/25"
                  >
                    <Send className="w-4 h-4" /> Submit Exam
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Navigator (Desktop) */}
          <div className="hidden md:block w-64 lg:w-72 shrink-0">
            <div className="sticky top-20">
              <QuestionNavigator
                totalQuestions={state.questions.length}
                currentIndex={state.currentQuestionIndex}
                getQuestionStatus={getQuestionStatus}
                questionIds={questionIds}
                onNavigate={goToQuestion}
                stats={stats}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigator Drawer */}
      <MobileQuestionDrawer
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        totalQuestions={state.questions.length}
        currentIndex={state.currentQuestionIndex}
        getQuestionStatus={getQuestionStatus}
        questionIds={questionIds}
        onNavigate={goToQuestion}
        stats={stats}
      />

      {/* Submit Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-5">
            <div className="text-center">
              <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-3" />
              <h3 className="text-lg font-bold text-foreground">Submit Exam?</h3>
              <p className="text-sm text-stone-500 mt-1">Review your answers before submitting.</p>
            </div>

            <div className="bg-surface rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Total Questions</span>
                <span className="font-semibold">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Answered</span>
                <span className="font-semibold text-emerald-600">{stats.answered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Unanswered</span>
                <span className="font-semibold text-red-600">{stats.total - stats.answered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Flagged</span>
                <span className="font-semibold text-amber-600">{stats.flagged}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-stone-500">Total Marks</span>
                <span className="font-bold text-foreground">{state.session?.total_marks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Duration</span>
                <span className="font-semibold">{formatDuration(state.session?.duration_seconds || 0)}</span>
              </div>
            </div>

            {stats.total - stats.answered > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>You have {stats.total - stats.answered} unanswered question(s).</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitDialog(false)}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-stone-50"
              >
                Review
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-brand"
              >
                <CheckCircle2 className="w-4 h-4" /> Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExamSessionPage() {
  return (
    <ExamProvider>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <ExamSessionInner />
      </Suspense>
    </ExamProvider>
  );
}
