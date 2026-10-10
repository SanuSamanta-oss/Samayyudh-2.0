'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3, TrendingUp, Clock, Target, Award, Zap,
  Brain, BookOpen, Loader2, ArrowUpRight
} from 'lucide-react';
import { cn, formatDuration } from '@/lib/utils';
import * as localDB from '@/lib/store/local-db';
import type { ExamSession, Answer, AnswerEvaluation } from '@/types';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Area, AreaChart
} from 'recharts';

// Chart color palette
const COLORS = {
  brand: '#6366F1',
  accent: '#8B5CF6',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
  blue: '#3B82F6',
  slate: '#94A3B8',
};

const PIE_COLORS = [COLORS.emerald, COLORS.blue, COLORS.amber, COLORS.rose, COLORS.slate];

interface AnalyticsData {
  sessions: ExamSession[];
  answers: Answer[];
  evaluations: AnswerEvaluation[];
  // Computed
  totalSessions: number;
  totalQuestions: number;
  totalTimeMinutes: number;
  avgScore: number;
  avgTimePerQuestion: number;
  scoreOverTime: { date: string; score: number; session: string }[];
  correctnessDistribution: { name: string; value: number }[];
  timeAssessmentDistribution: { name: string; value: number }[];
  subjectPerformance: { subject: string; score: number; count: number }[];
  dailyActivity: { day: string; questions: number; minutes: number }[];
  difficultyBreakdown: { difficulty: string; avgScore: number; count: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadAnalytics() {
    setLoading(true);
    const sessions = await localDB.getAllSessions();
    const answers = await localDB.getAllAnswers();
    const evaluations = await localDB.getAllEvaluations();

    const totalSessions = sessions.length;
    const totalQuestions = answers.filter(a => a.answer_text.trim()).length;
    const totalTimeSec = answers.reduce((s, a) => s + a.time_spent_seconds, 0);
    const totalTimeMinutes = Math.round(totalTimeSec / 60);
    const avgTimePerQuestion = totalQuestions > 0 ? Math.round(totalTimeSec / totalQuestions) : 0;

    // Average score
    const totalScore = evaluations.reduce((s, e) => s + e.score, 0);
    const totalMax = evaluations.reduce((s, e) => s + e.max_score, 0);
    const avgScore = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

    // Score over time (by session)
    const evalBySession = new Map<string, AnswerEvaluation[]>();
    const answerSessionMap = new Map(answers.map(a => [a.id, a.session_id]));
    evaluations.forEach(e => {
      const sid = answerSessionMap.get(e.answer_id);
      if (sid) {
        const list = evalBySession.get(sid) || [];
        list.push(e);
        evalBySession.set(sid, list);
      }
    });

    const scoreOverTime = sessions
      .sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime())
      .map(s => {
        const evals = evalBySession.get(s.id) || [];
        const sc = evals.reduce((sum, e) => sum + e.score, 0);
        const mx = evals.reduce((sum, e) => sum + e.max_score, 0);
        return {
          date: new Date(s.started_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          score: mx > 0 ? Math.round((sc / mx) * 100) : 0,
          session: s.title.slice(0, 20),
        };
      })
      .filter(s => s.score > 0);

    // Correctness distribution
    const corrCounts: Record<string, number> = { correct: 0, mostly_correct: 0, partially_correct: 0, incorrect: 0 };
    evaluations.forEach(e => { if (corrCounts[e.correctness] !== undefined) corrCounts[e.correctness]++; });
    const correctnessDistribution = [
      { name: 'Correct', value: corrCounts.correct },
      { name: 'Mostly Correct', value: corrCounts.mostly_correct },
      { name: 'Partial', value: corrCounts.partially_correct },
      { name: 'Incorrect', value: corrCounts.incorrect },
    ].filter(d => d.value > 0);

    // Time assessment distribution
    const timeCounts: Record<string, number> = { too_fast: 0, on_time: 0, slightly_slow: 0, too_slow: 0 };
    evaluations.forEach(e => { if (timeCounts[e.time_assessment] !== undefined) timeCounts[e.time_assessment]++; });
    const timeAssessmentDistribution = [
      { name: 'Too Fast', value: timeCounts.too_fast },
      { name: 'On Time', value: timeCounts.on_time },
      { name: 'Slightly Slow', value: timeCounts.slightly_slow },
      { name: 'Too Slow', value: timeCounts.too_slow },
    ].filter(d => d.value > 0);

    // Subject performance (from question bank — we need to cross-reference)
    const { questionBank } = await import('@/lib/questions');
    const customQs = await localDB.getAllCustomQuestions();
    const allQuestions = [...questionBank, ...customQs];
    const qMap = new Map(allQuestions.map(q => [q.id, q]));
    const subjectScores = new Map<string, { total: number; max: number; count: number }>();
    evaluations.forEach(e => {
      const q = qMap.get(e.question_id);
      if (q) {
        const entry = subjectScores.get(q.subject) || { total: 0, max: 0, count: 0 };
        entry.total += e.score;
        entry.max += e.max_score;
        entry.count++;
        subjectScores.set(q.subject, entry);
      }
    });
    const subjectPerformance = Array.from(subjectScores.entries()).map(([subject, data]) => ({
      subject: subject.length > 15 ? subject.slice(0, 14) + '…' : subject,
      score: data.max > 0 ? Math.round((data.total / data.max) * 100) : 0,
      count: data.count,
    }));

    // Daily activity (last 14 days)
    const now = Date.now();
    const dailyMap = new Map<string, { questions: number; minutes: number }>();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const key = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      dailyMap.set(key, { questions: 0, minutes: 0 });
    }
    answers.forEach(a => {
      const d = new Date(a.last_saved_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      const entry = dailyMap.get(d);
      if (entry) {
        entry.questions++;
        entry.minutes += Math.round(a.time_spent_seconds / 60);
      }
    });
    const dailyActivity = Array.from(dailyMap.entries()).map(([day, data]) => ({
      day,
      questions: data.questions,
      minutes: data.minutes,
    }));

    // Difficulty breakdown
    const diffScores = new Map<string, { total: number; max: number; count: number }>();
    evaluations.forEach(e => {
      const q = qMap.get(e.question_id);
      if (q) {
        const entry = diffScores.get(q.difficulty) || { total: 0, max: 0, count: 0 };
        entry.total += e.score;
        entry.max += e.max_score;
        entry.count++;
        diffScores.set(q.difficulty, entry);
      }
    });
    const difficultyBreakdown = ['easy', 'medium', 'hard'].map(d => {
      const entry = diffScores.get(d);
      return {
        difficulty: d.charAt(0).toUpperCase() + d.slice(1),
        avgScore: entry && entry.max > 0 ? Math.round((entry.total / entry.max) * 100) : 0,
        count: entry?.count || 0,
      };
    });

    setData({
      sessions, answers, evaluations,
      totalSessions, totalQuestions, totalTimeMinutes, avgScore, avgTimePerQuestion,
      scoreOverTime, correctnessDistribution, timeAssessmentDistribution,
      subjectPerformance, dailyActivity, difficultyBreakdown,
    });
    setLoading(false);
  }

  useEffect(() => {
    setTimeout(() => {
      loadAnalytics();
    }, 0);
  }, []);



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto" />
          <p className="text-sm text-stone-500">Crunching your numbers...</p>
        </div>
      </div>
    );
  }

  if (!data || data.totalSessions === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 md:py-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-600" /> Analytics
        </h1>
        <p className="text-stone-500 mt-1">Your performance insights</p>
        <div className="mt-8 text-center py-16 space-y-3">
          <BarChart3 className="w-12 h-12 mx-auto text-stone-300" />
          <p className="text-stone-500">Complete exams to see your analytics and time efficiency reports.</p>
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity"
          >
            <Zap className="w-4 h-4" /> Start Practicing
          </Link>
        </div>
      </div>
    );
  }

  const hasEvaluations = data.evaluations.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 md:py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-600" /> Analytics
        </h1>
        <p className="text-stone-500 mt-1">Your performance insights across {data.totalSessions} sessions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard icon={<BookOpen className="w-5 h-5" />} label="Sessions" value={String(data.totalSessions)} color="text-brand-600 bg-brand-50" />
        <StatCard icon={<Target className="w-5 h-5" />} label="Questions" value={String(data.totalQuestions)} color="text-emerald-600 bg-emerald-50" />
        <StatCard icon={<Clock className="w-5 h-5" />} label="Study Time" value={formatDuration(data.totalTimeMinutes * 60)} color="text-blue-600 bg-blue-50" />
        <StatCard icon={<Award className="w-5 h-5" />} label="Avg Score" value={hasEvaluations ? `${data.avgScore}%` : '—'} color="text-amber-600 bg-amber-50" />
        <StatCard icon={<Zap className="w-5 h-5" />} label="Avg Time/Q" value={`${data.avgTimePerQuestion}s`} color="text-rose-600 bg-rose-50" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <ChartCard title="Daily Activity" subtitle="Last 14 days" icon={<TrendingUp className="w-4 h-4" />}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.dailyActivity} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.brand} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={COLORS.brand} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#78716C' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#78716C' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #E7E5E4', fontSize: 12 }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="questions" stroke={COLORS.brand} fill="url(#gradActivity)" strokeWidth={2} name="Questions" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Score Over Time */}
        {data.scoreOverTime.length > 0 && (
          <ChartCard title="Score Trend" subtitle="Per session" icon={<TrendingUp className="w-4 h-4" />}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.scoreOverTime} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#78716C' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#78716C' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E7E5E4', fontSize: 12 }}
                  formatter={(value) => [`${value}%`, 'Score']}
                />
                <Line type="monotone" dataKey="score" stroke={COLORS.emerald} strokeWidth={2.5} dot={{ fill: COLORS.emerald, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Correctness Distribution */}
        {data.correctnessDistribution.length > 0 && (
          <ChartCard title="Answer Quality" subtitle="Correctness breakdown" icon={<Target className="w-4 h-4" />}>
            <div className="flex items-center justify-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={data.correctnessDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {data.correctnessDistribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E7E5E4', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {data.correctnessDistribution.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-stone-600">{entry.name}</span>
                    <span className="font-semibold text-foreground">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        )}

        {/* Time Assessment */}
        {data.timeAssessmentDistribution.length > 0 && (
          <ChartCard title="Time Management" subtitle="Speed assessment" icon={<Clock className="w-4 h-4" />}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.timeAssessmentDistribution} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#78716C' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#78716C' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E7E5E4', fontSize: 12 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Count">
                  {data.timeAssessmentDistribution.map((_, i) => (
                    <Cell key={i} fill={[COLORS.amber, COLORS.emerald, COLORS.blue, COLORS.rose][i] || COLORS.slate} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Subject Performance */}
        {data.subjectPerformance.length > 0 && (
          <ChartCard title="Subject Performance" subtitle="Average score by subject" icon={<BookOpen className="w-4 h-4" />}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.subjectPerformance} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#78716C' }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="subject" tick={{ fontSize: 10, fill: '#78716C' }} tickLine={false} axisLine={false} width={100} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E7E5E4', fontSize: 12 }}
                  formatter={(value) => [`${value}%`, 'Score']}
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]} fill={COLORS.brand} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Difficulty Breakdown */}
        {data.difficultyBreakdown.some(d => d.count > 0) && (
          <ChartCard title="Difficulty Analysis" subtitle="Score by difficulty level" icon={<Brain className="w-4 h-4" />}>
            <div className="space-y-4 pt-2">
              {data.difficultyBreakdown.map(d => (
                <div key={d.difficulty} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{d.difficulty}</span>
                    <span className="text-stone-500 text-xs">{d.count} questions · {d.avgScore}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-700',
                        d.avgScore >= 70 ? 'bg-emerald-500' :
                        d.avgScore >= 40 ? 'bg-amber-500' : 'bg-red-400'
                      )}
                      style={{ width: `${d.avgScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        )}
      </div>

      {/* No evaluation data notice */}
      {!hasEvaluations && data.totalSessions > 0 && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 text-center space-y-2">
          <Brain className="w-8 h-8 mx-auto text-brand-600" />
          <h3 className="font-semibold text-brand-800">Unlock Full Analytics</h3>
          <p className="text-sm text-brand-700 max-w-md mx-auto">
            Run AI evaluation on your completed exams to see score trends, correctness breakdown, and subject-level insights.
          </p>
          <Link
            href="/history"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-brand-700 bg-card border border-brand-200 hover:bg-brand-100 transition-colors mt-2"
          >
            View History <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

// --- Subcomponents ---

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card">
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', color)}>
        {icon}
      </div>
      <span className="text-xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-stone-500">{label}</span>
    </div>
  );
}

function ChartCard({ title, subtitle, icon, children }: { title: string; subtitle: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-brand-600">{icon}</span>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-[10px] text-stone-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
