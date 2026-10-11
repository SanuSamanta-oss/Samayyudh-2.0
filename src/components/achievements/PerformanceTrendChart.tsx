'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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

  // Calculate dynamic adaptive domain so slopes and surges are clearly visible
  const minScore = Math.min(...chartData.map(d => d.score));
  const maxScore = Math.max(...chartData.map(d => d.score));
  const yMin = Math.max(0, Math.floor((minScore - 15) / 10) * 10);
  const yMax = Math.min(100, Math.ceil((maxScore + 15) / 10) * 10);

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
      <div className="w-full h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.12} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#888888', fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 80]}
              ticks={[0, 20, 40, 60, 80]}
              tick={{ fontSize: 11, fill: '#888888' }}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-2xl border border-amber-300/30 bg-card p-3.5 shadow-xl text-xs space-y-1.5">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-bold text-foreground text-sm">{data.name}</span>
                        <span className="text-[11px] text-stone-400 font-medium">{data.date}</span>
                      </div>
                      <p className="text-amber-500 font-black text-base">
                        Score: {data.score}%
                      </p>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-bold text-stone-500 uppercase tracking-wide">
                        {data.category}
                      </span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#F59E0B"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#scoreGrowthGradient)"
              dot={{ r: 6, fill: '#F59E0B', stroke: '#FFF', strokeWidth: 2.5 }}
              activeDot={{ r: 8, fill: '#D97706', stroke: '#FFF', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
