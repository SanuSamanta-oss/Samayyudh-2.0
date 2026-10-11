'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import type { Answer, AnswerStatus, ExamSession, Question, StickyNote } from '@/types';
import { generateId, now, countWords } from '@/lib/utils';
import * as localDB from '@/lib/store/local-db';
import { AUTOSAVE_DEBOUNCE_MS } from '@/lib/constants';
import { processCompletedMockTest } from '@/lib/achievements/client';

// --- State ---

interface ExamState {
  session: ExamSession | null;
  questions: Question[];
  answers: Map<string, Answer>;
  stickyNotes: Map<string, StickyNote>;
  currentQuestionIndex: number;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  isTimeUp: boolean;
  questionStartTime: number | null; // timestamp when current question was opened
}

type ExamAction =
  | { type: 'INIT_SESSION'; session: ExamSession; questions: Question[]; answers: Answer[]; notes: StickyNote[] }
  | { type: 'SET_QUESTION_INDEX'; index: number }
  | { type: 'UPDATE_ANSWER'; questionId: string; text: string }
  | { type: 'SET_ANSWER_STATUS'; questionId: string; status: AnswerStatus }
  | { type: 'UPDATE_STICKY_NOTE'; questionId: string; content: string }
  | { type: 'SET_SAVE_STATUS'; status: ExamState['saveStatus'] }
  | { type: 'SET_TIME_UP' }
  | { type: 'FLAG_QUESTION'; questionId: string }
  | { type: 'SUBMIT_EXAM' }
  | { type: 'TRACK_TIME'; questionId: string; seconds: number };

function examReducer(state: ExamState, action: ExamAction): ExamState {
  switch (action.type) {
    case 'INIT_SESSION': {
      const answersMap = new Map<string, Answer>();
      action.answers.forEach((a) => answersMap.set(a.question_id, a));
      const notesMap = new Map<string, StickyNote>();
      action.notes.forEach((n) => notesMap.set(n.question_id, n));
      return {
        ...state,
        session: action.session,
        questions: action.questions,
        answers: answersMap,
        stickyNotes: notesMap,
        currentQuestionIndex: action.session.current_question_index,
        questionStartTime: Date.now(),
      };
    }
    case 'SET_QUESTION_INDEX': {
      return {
        ...state,
        currentQuestionIndex: action.index,
        questionStartTime: Date.now(),
        session: state.session
          ? { ...state.session, current_question_index: action.index }
          : null,
      };
    }
    case 'UPDATE_ANSWER': {
      const existing = state.answers.get(action.questionId);
      const answer: Answer = existing
        ? {
            ...existing,
            answer_text: action.text,
            word_count: countWords(action.text),
            character_count: action.text.length,
            last_saved_at: now(),
            status: action.text.trim() ? 'answered' : 'visited',
          }
        : {
            id: generateId(),
            session_id: state.session?.id ?? '',
            question_id: action.questionId,
            user_id: state.session?.user_id ?? 'local',
            answer_text: action.text,
            word_count: countWords(action.text),
            character_count: action.text.length,
            started_at: now(),
            last_saved_at: now(),
            submitted_at: null,
            time_spent_seconds: 0,
            status: action.text.trim() ? 'answered' : 'visited',
          };
      const newAnswers = new Map(state.answers);
      newAnswers.set(action.questionId, answer);
      return { ...state, answers: newAnswers };
    }
    case 'SET_ANSWER_STATUS': {
      const existing = state.answers.get(action.questionId);
      if (!existing) {
        // Create a blank answer entry with the status
        const answer: Answer = {
          id: generateId(),
          session_id: state.session?.id ?? '',
          question_id: action.questionId,
          user_id: state.session?.user_id ?? 'local',
          answer_text: '',
          word_count: 0,
          character_count: 0,
          started_at: now(),
          last_saved_at: now(),
          submitted_at: null,
          time_spent_seconds: 0,
          status: action.status,
        };
        const newAnswers = new Map(state.answers);
        newAnswers.set(action.questionId, answer);
        return { ...state, answers: newAnswers };
      }
      const updated = { ...existing, status: action.status };
      const newAnswers = new Map(state.answers);
      newAnswers.set(action.questionId, updated);
      return { ...state, answers: newAnswers };
    }
    case 'UPDATE_STICKY_NOTE': {
      const existing = state.stickyNotes.get(action.questionId);
      const note: StickyNote = existing
        ? { ...existing, content: action.content, updated_at: now() }
        : {
            id: generateId(),
            user_id: state.session?.user_id ?? 'local',
            question_id: action.questionId,
            session_id: state.session?.id ?? '',
            content: action.content,
            created_at: now(),
            updated_at: now(),
          };
      const newNotes = new Map(state.stickyNotes);
      newNotes.set(action.questionId, note);
      return { ...state, stickyNotes: newNotes };
    }
    case 'SET_SAVE_STATUS':
      return { ...state, saveStatus: action.status };
    case 'SET_TIME_UP':
      return { ...state, isTimeUp: true };
    case 'FLAG_QUESTION': {
      const existing = state.answers.get(action.questionId);
      if (existing) {
        const newStatus = existing.status === 'flagged' ? (existing.answer_text.trim() ? 'answered' : 'visited') : 'flagged';
        const updated = { ...existing, status: newStatus as AnswerStatus };
        const newAnswers = new Map(state.answers);
        newAnswers.set(action.questionId, updated);
        return { ...state, answers: newAnswers };
      }
      return state;
    }
    case 'SUBMIT_EXAM':
      return {
        ...state,
        session: state.session
          ? { ...state.session, status: 'submitted', completed_at: now() }
          : null,
      };
    case 'TRACK_TIME': {
      const existing = state.answers.get(action.questionId);
      if (existing) {
        const updated = { ...existing, time_spent_seconds: existing.time_spent_seconds + action.seconds };
        const newAnswers = new Map(state.answers);
        newAnswers.set(action.questionId, updated);
        return { ...state, answers: newAnswers };
      }
      return state;
    }
    default:
      return state;
  }
}

const initialState: ExamState = {
  session: null,
  questions: [],
  answers: new Map(),
  stickyNotes: new Map(),
  currentQuestionIndex: 0,
  saveStatus: 'idle',
  isTimeUp: false,
  questionStartTime: null,
};

// --- Context ---

interface ExamContextValue {
  state: ExamState;
  initSession: (session: ExamSession, questions: Question[]) => Promise<void>;
  goToQuestion: (index: number) => void;
  updateAnswer: (questionId: string, text: string) => void;
  updateStickyNote: (questionId: string, content: string) => void;
  flagQuestion: (questionId: string) => void;
  submitExam: () => Promise<void>;
  currentQuestion: Question | null;
  currentAnswer: Answer | undefined;
  currentStickyNote: StickyNote | undefined;
  getQuestionStatus: (questionId: string) => AnswerStatus;
  stats: {
    total: number;
    answered: number;
    visited: number;
    flagged: number;
    notVisited: number;
  };
}

const ExamContext = createContext<ExamContextValue | null>(null);

export function ExamProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(examReducer, initialState);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeTrackingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Track time spent on current question
  useEffect(() => {
    if (timeTrackingRef.current) clearInterval(timeTrackingRef.current);
    if (state.session && state.questions.length > 0 && !state.isTimeUp) {
      const currentQ = state.questions[state.currentQuestionIndex];
      if (currentQ) {
        timeTrackingRef.current = setInterval(() => {
          dispatch({ type: 'TRACK_TIME', questionId: currentQ.id, seconds: 1 });
        }, 1000);
      }
    }
    return () => {
      if (timeTrackingRef.current) clearInterval(timeTrackingRef.current);
    };
  }, [state.currentQuestionIndex, state.session, state.questions, state.isTimeUp]);

  const persistAnswer = useCallback(async (answer: Answer) => {
    dispatch({ type: 'SET_SAVE_STATUS', status: 'saving' });
    try {
      await localDB.saveAnswer(answer);
      dispatch({ type: 'SET_SAVE_STATUS', status: 'saved' });
    } catch {
      dispatch({ type: 'SET_SAVE_STATUS', status: 'error' });
    }
  }, []);

  const initSession = useCallback(async (session: ExamSession, questions: Question[]) => {
    // Try to restore from IndexedDB
    const savedAnswers = await localDB.getAnswersBySession(session.id);
    const savedNotes = await localDB.getStickyNotesBySession(session.id);
    dispatch({ type: 'INIT_SESSION', session, questions, answers: savedAnswers, notes: savedNotes });
    await localDB.saveSession(session);
  }, []);

  const goToQuestion = useCallback((index: number) => {
    if (index < 0 || index >= state.questions.length) return;
    // Mark current question as visited if not answered
    const targetQ = state.questions[index];
    if (targetQ) {
      const existing = state.answers.get(targetQ.id);
      if (!existing || existing.status === 'not_visited') {
        dispatch({ type: 'SET_ANSWER_STATUS', questionId: targetQ.id, status: 'visited' });
      }
    }
    dispatch({ type: 'SET_QUESTION_INDEX', index });
    // Persist session state
    if (state.session) {
      localDB.saveSession({ ...state.session, current_question_index: index });
    }
  }, [state.questions, state.answers, state.session]);

  const updateAnswer = useCallback((questionId: string, text: string) => {
    if (state.isTimeUp) return;
    dispatch({ type: 'UPDATE_ANSWER', questionId, text });

    // Debounced persist
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const answer = state.answers.get(questionId);
      if (answer) {
        persistAnswer({
          ...answer,
          answer_text: text,
          word_count: countWords(text),
          character_count: text.length,
          last_saved_at: now(),
          status: text.trim() ? 'answered' : 'visited',
        });
      }
    }, AUTOSAVE_DEBOUNCE_MS);
  }, [state.isTimeUp, state.answers, persistAnswer]);

  const updateStickyNote = useCallback((questionId: string, content: string) => {
    dispatch({ type: 'UPDATE_STICKY_NOTE', questionId, content });
    // Persist immediately
    const note = state.stickyNotes.get(questionId);
    if (note) {
      localDB.saveStickyNote({ ...note, content, updated_at: now() });
    }
  }, [state.stickyNotes]);

  const flagQuestion = useCallback((questionId: string) => {
    dispatch({ type: 'FLAG_QUESTION', questionId });
  }, []);

  const submitExam = useCallback(async () => {
    dispatch({ type: 'SUBMIT_EXAM' });
    const completionTime = now();
    if (state.session) {
      await localDB.saveSession({ ...state.session, status: 'submitted', completed_at: completionTime });
    }
    // Persist all answers
    for (const answer of state.answers.values()) {
      await localDB.saveAnswer({ ...answer, submitted_at: completionTime, status: 'submitted' });
    }

    // Immediately record completed mock test attempt to credit student & unlock achievements
    if (state.session) {
      try {
        const answersList = Array.from(state.answers.values());
        const answeredCount = answersList.filter(
          a => (a.answer_text && a.answer_text.trim()) ||
               a.selected_option ||
               (a.selected_options && a.selected_options.length > 0)
        ).length;
        const totalMarks = state.session.total_marks || (state.questions.length * 4) || 100;
        const totalQ = Math.max(1, state.questions.length || 10);
        const answeredRatio = answeredCount / totalQ;
        const estimatedScore = Math.round(totalMarks * Math.max(0.5, answeredRatio * 0.85));
        const duration = answersList.reduce((sum, a) => sum + (a.time_spent_seconds || 0), 0) || state.session.duration_seconds || 600;

        await processCompletedMockTest({
          userId: state.session.user_id || 'local-user',
          testId: state.session.id,
          title: state.session.title || 'Mock Test',
          examCategory: state.session.exam_code || 'ENGINEERING',
          examCode: state.session.exam_code || 'ENGINEERING',
          score: estimatedScore,
          maximumMarks: totalMarks,
          durationSeconds: duration,
          startedAt: state.session.started_at,
          completedAt: completionTime,
        });
      } catch (achErr) {
        console.warn('Instant achievement processing on exam submission:', achErr);
      }
    }
  }, [state.session, state.answers, state.questions]);

  const currentQuestion = state.questions[state.currentQuestionIndex] ?? null;
  const currentAnswer = currentQuestion ? state.answers.get(currentQuestion.id) : undefined;
  const currentStickyNote = currentQuestion ? state.stickyNotes.get(currentQuestion.id) : undefined;

  const getQuestionStatus = useCallback((questionId: string): AnswerStatus => {
    return state.answers.get(questionId)?.status ?? 'not_visited';
  }, [state.answers]);

  const stats = {
    total: state.questions.length,
    answered: Array.from(state.answers.values()).filter((a) => a.status === 'answered' || a.status === 'submitted').length,
    visited: Array.from(state.answers.values()).filter((a) => a.status === 'visited').length,
    flagged: Array.from(state.answers.values()).filter((a) => a.status === 'flagged').length,
    notVisited: state.questions.length - state.answers.size + Array.from(state.answers.values()).filter((a) => a.status === 'not_visited').length,
  };

  return (
    <ExamContext.Provider
      value={{
        state,
        initSession,
        goToQuestion,
        updateAnswer,
        updateStickyNote,
        flagQuestion,
        submitExam,
        currentQuestion,
        currentAnswer,
        currentStickyNote,
        getQuestionStatus,
        stats,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const ctx = useContext(ExamContext);
  if (!ctx) throw new Error('useExam must be used within ExamProvider');
  return ctx;
}
