'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  History as HistoryIcon, Clock, Award, Target, ChevronRight,
  Trash2, Calendar, Zap, Search, Filter, Loader2, Printer
} from 'lucide-react';
import { cn, formatDuration, percentage } from '@/lib/utils';
import * as localDB from '@/lib/store/local-db';
import type { ExamSession, Answer, AnswerEvaluation } from '@/types';

interface SessionWithMeta {
  session: ExamSession;
  answers: Answer[];
  evaluations: AnswerEvaluation[];
  answeredCount: number;
  totalTimeSpent: number;
  totalScore: number;
  totalMaxScore: number;
}

const statusBadge: Record<string, { label: string; class: string }> = {
  completed: { label: 'Completed', class: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  submitted: { label: 'Submitted', class: 'text-blue-700 bg-blue-50 border-blue-200' },
  evaluated: { label: 'Evaluated', class: 'text-brand-700 bg-brand-50 border-brand-200' },
  in_progress: { label: 'In Progress', class: 'text-amber-700 bg-amber-50 border-amber-200' },
  paused: { label: 'Paused', class: 'text-stone-700 bg-stone-50 border-stone-200' },
  setup: { label: 'Setup', class: 'text-stone-500 bg-stone-50 border-stone-200' },
};

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SessionWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  async function loadSessions() {
    setLoading(true);
    const allSessions = await localDB.getAllSessions();
    const allAnswers = await localDB.getAllAnswers();
    const allEvals = await localDB.getAllEvaluations();

    // Build answer and evaluation maps by session
    const answersBySession = new Map<string, Answer[]>();
    allAnswers.forEach(a => {
      const list = answersBySession.get(a.session_id) || [];
      list.push(a);
      answersBySession.set(a.session_id, list);
    });

    const evalByAnswer = new Map<string, AnswerEvaluation>();
    allEvals.forEach(e => evalByAnswer.set(e.answer_id, e));

    const enriched: SessionWithMeta[] = allSessions
      .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
      .map(session => {
        const answers = answersBySession.get(session.id) || [];
        const evaluations = answers
          .map(a => evalByAnswer.get(a.id))
          .filter((e): e is AnswerEvaluation => !!e);

        const answeredCount = answers.filter(a => a.answer_text.trim()).length;
        const totalTimeSpent = answers.reduce((sum, a) => sum + a.time_spent_seconds, 0);
        const totalScore = evaluations.reduce((sum, e) => sum + e.score, 0);
        const totalMaxScore = evaluations.reduce((sum, e) => sum + e.max_score, 0);

        return { session, answers, evaluations, answeredCount, totalTimeSpent, totalScore, totalMaxScore };
      });

    setSessions(enriched);
    setLoading(false);
  }

  useEffect(() => {
    setTimeout(() => {
      loadSessions();
    }, 0);
  }, []);

  async function deleteSession(sessionId: string) {
    await localDB.deleteSession(sessionId);
    setSessions(prev => prev.filter(s => s.session.id !== sessionId));
  }

  async function clearAbandonedSessions() {
    const abandoned = sessions.filter(s => s.session.status === 'in_progress' && s.answeredCount === 0);
    if (abandoned.length === 0) return;
    for (const item of abandoned) {
      await localDB.deleteSession(item.session.id);
    }
    setSessions(prev => prev.filter(s => !(s.session.status === 'in_progress' && s.answeredCount === 0)));
  }

  const abandonedCount = sessions.filter(s => s.session.status === 'in_progress' && s.answeredCount === 0).length;

  const filtered = sessions.filter(s => {
    const matchesSearch = searchQuery === '' ||
      s.session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.session.exam_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || s.session.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto" />
          <p className="text-sm text-stone-500">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <HistoryIcon className="w-6 h-6 text-brand-600" />
          History
        </h1>
        <p className="text-stone-500 mt-1">Your past exam sessions and performance</p>
      </div>

      {/* Abandoned sessions cleanup banner */}
      {abandonedCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-amber-300/60 bg-amber-500/10 text-amber-200">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⚡</span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Found {abandonedCount} unsubmitted &quot;In Progress&quot; battle{abandonedCount > 1 ? 's' : ''} (0 questions answered)
              </p>
              <p className="text-xs text-stone-400">
                These were started without submitting. You can clean them up in one click.
              </p>
            </div>
          </div>
          <button
            onClick={clearAbandonedSessions}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg font-medium text-xs text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clean Up {abandonedCount} Draft{abandonedCount > 1 ? 's' : ''}
          </button>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <HistoryIcon className="w-12 h-12 mx-auto text-stone-300" />
          <p className="text-stone-500">
            {sessions.length === 0
              ? 'No sessions yet. Complete an exam to see it here.'
              : 'No sessions match your filters.'}
          </p>
          {sessions.length === 0 && (
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity"
            >
              <Zap className="w-4 h-4" /> Start Your First Battle
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(({ session, answeredCount, totalTimeSpent, totalScore, totalMaxScore, evaluations }) => {
            const badge = statusBadge[session.status] || statusBadge.completed;
            const hasEval = evaluations.length > 0;
            const scorePct = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

            return (
              <div
                key={session.id}
                className="bg-card rounded-xl border border-border hover:border-brand-200 transition-all group"
              >
                <div className="p-4 flex items-start gap-4">
                  {/* Icon */}
                  <div className="hidden sm:flex w-12 h-12 rounded-xl bg-gradient-to-br from-brand-50 to-accent-50 items-center justify-center shrink-0 text-xl">
                    {session.mode === 'quick_battle' ? '⚡' :
                     session.mode === 'half_century' ? '🏏' :
                     session.mode === 'full_century' ? '🏆' :
                     session.mode === 'speed_battle' ? '🏎️' : '📝'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground truncate">{session.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(session.started_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}</span>
                        </div>
                      </div>
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0', badge.class)}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Stats row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Target className="w-3.5 h-3.5" />
                        {answeredCount}/{session.total_questions} answered
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(totalTimeSpent)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        {session.total_marks} marks
                      </span>
                      {hasEval && (
                        <span className={cn('font-semibold', scorePct >= 60 ? 'text-emerald-600' : 'text-amber-600')}>
                          Score: {totalScore}/{totalMaxScore} ({scorePct}%)
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-brand transition-all duration-500"
                        style={{ width: `${percentage(answeredCount, session.total_questions)}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Delete session"
                      aria-label="Delete session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {session.status !== 'in_progress' && (
                      <Link
                        href={`/report?session=${session.id}`}
                        className="p-2 rounded-lg text-stone-400 hover:text-brand-400 hover:bg-brand-500/10 transition-colors hidden sm:inline-flex"
                        title="View printable report"
                        aria-label="View printable report"
                      >
                        <Printer className="w-4 h-4" />
                      </Link>
                    )}
                    {session.status === 'in_progress' ? (
                      <Link
                        href={`/exam/session?resume=${session.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-sm"
                        title="Resume battle"
                      >
                        Resume <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <Link
                        href={`/results?session=${session.id}`}
                        className="p-2 rounded-lg text-stone-400 hover:text-brand-400 hover:bg-brand-500/10 transition-colors"
                        title="View results"
                        aria-label="View results"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats Footer */}
      {sessions.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-border">
          <div className="text-center p-3">
            <div className="text-2xl font-bold text-gradient-brand">{sessions.length}</div>
            <div className="text-xs text-stone-500 mt-0.5">Total Sessions</div>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl font-bold text-foreground">
              {sessions.reduce((sum, s) => sum + s.answeredCount, 0)}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">Questions Answered</div>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl font-bold text-foreground">
              {formatDuration(sessions.reduce((sum, s) => sum + s.totalTimeSpent, 0))}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">Total Time</div>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl font-bold text-foreground">
              {(() => {
                const totalS = sessions.reduce((sum, s) => sum + s.totalScore, 0);
                const totalM = sessions.reduce((sum, s) => sum + s.totalMaxScore, 0);
                return totalM > 0 ? `${Math.round((totalS / totalM) * 100)}%` : '—';
              })()}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">Avg Score</div>
          </div>
        </div>
      )}
    </div>
  );
}
