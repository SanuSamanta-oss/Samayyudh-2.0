'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Trophy, Clock, Target, BarChart3, ChevronRight, Download, ArrowLeft } from 'lucide-react';

function ResultsInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-5xl">🏆</span>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Exam Complete!</h1>
        <p className="text-stone-500">Session: {sessionId?.slice(0, 8) || '—'}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Score', value: '—', icon: Trophy, color: 'text-brand-600 bg-brand-50' },
          { label: 'Time Used', value: '—', icon: Clock, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Accuracy', value: '—', icon: Target, color: 'text-amber-600 bg-amber-50' },
          { label: 'Efficiency', value: '—', icon: BarChart3, color: 'text-rose-600 bg-rose-50' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-white">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-foreground">{stat.value}</span>
            <span className="text-xs text-stone-500">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* AI Evaluation Notice */}
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 text-center space-y-2">
        <h3 className="font-semibold text-brand-800">AI Evaluation</h3>
        <p className="text-sm text-brand-700">
          Connect your Gemini API key to enable AI-powered answer evaluation with detailed feedback,
          missing concepts analysis, and time pressure insights.
        </p>
        <p className="text-xs text-brand-500">Phase 4 feature — coming soon</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <Link
          href="/practice"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity"
        >
          Start New Battle <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <ResultsInner />
    </Suspense>
  );
}
