'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { MockTestRecord } from '@/types/achievements';

export interface PerformanceTrendChartProps {
  mockTests: MockTestRecord[];
  className?: string;
}

export function PerformanceTrendChart({
  mockTests,
  className = '',
}: PerformanceTrendChartProps) {
  // Sort tests by date ascending
  const sortedTests = [...mockTests].sort(
    (a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
  );

  const chartData = sortedTests.slice(-10).map((t, idx) => ({
    name: `Test ${idx + 1}`,
    score: Math.round(t.percentage),
    category: t.exam_category,
    date: new Date(t.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  if (chartData.length < 2) {
    return (
      <div className={`rounded-3xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center min-h-[220px] ${className}`}>
        <TrendingUp className="w-10 h-10 text-stone-300 mb-2" />
        <h4 className="font-bold text-foreground text-sm">Performance Trend</h4>
        <p className="text-xs text-stone-500 max-w-xs mt-1">
          Complete at least 2 mock tests to unlock your historical percentage trajectory and improvement curve.
        </p>
      </div>
    );
  }

  const latestScore = chartData[chartData.length - 1].score;
  const initialScore = chartData[0].score;
  const netDelta = latestScore - initialScore;

  return (
    <div className={`rounded-3xl border border-border bg-card p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-foreground text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Performance Growth Curve
          </h4>
          <p className="text-xs text-stone-500">Mock test score trajectory (recent attempts)</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>{netDelta >= 0 ? `+${netDelta}%` : `${netDelta}%`} Net Change</span>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="w-full h-56 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888888' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#888888' }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-border bg-card p-3 shadow-lg text-xs space-y-1">
                      <p className="font-bold text-foreground">{data.name} · {data.date}</p>
                      <p className="text-amber-600 dark:text-amber-400 font-extrabold text-sm">
                        Score: {data.score}%
                      </p>
                      <p className="text-stone-400 text-[10px] uppercase">{data.category}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#F59E0B"
              strokeWidth={3.5}
              dot={{ r: 5, fill: '#F59E0B', stroke: '#FFF', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: '#D97706' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
