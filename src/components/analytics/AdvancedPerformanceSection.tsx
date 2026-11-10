'use client';

import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from 'recharts';
import { TrendingUp, Award, Target, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProcessedAnalytics } from '@/lib/analytics/data-processor';

interface AdvancedPerformanceSectionProps {
  dailyActivity: ProcessedAnalytics['dailyActivityTrend'];
  scoreTrend: ProcessedAnalytics['scoreTrend'];
  answerQuality: ProcessedAnalytics['answerQualityDistribution'];
  timeManagement: ProcessedAnalytics['timeManagementBreakdown'];
}

/**
 * Advanced Performance Charts (Smooth, No Outlines, Refined Sizing)
 */
export function AdvancedPerformanceSection({
  dailyActivity,
  scoreTrend,
  answerQuality,
  timeManagement,
}: AdvancedPerformanceSectionProps) {
  const timeBarData = [
    { name: 'On Time', count: timeManagement.onTime, color: '#10B981' },
    { name: 'Too Fast', count: timeManagement.tooFast, color: '#F59E0B' },
    { name: 'Slightly Slow', count: timeManagement.slightlySlow, color: '#3B82F6' },
    { name: 'Too Slow', count: timeManagement.tooSlow, color: '#EF4444' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. Daily Activity Trend Area Chart (Smooth, No Outline) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="p-5 sm:p-6 rounded-[30px] bg-white dark:bg-[#111A2E] shadow-sm space-y-3.5">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Daily Practice Cadence</span>
          </h3>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
            Questions solved per day over selected period
          </p>
        </div>

        <div className="h-52 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="purpleGradSmooth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#243556" opacity={0.2} vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#888' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#888' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111A2E',
                  borderRadius: 12,
                  border: 'none',
                  color: '#fff',
                  fontSize: 11,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              />
              <Area
                type="monotone"
                dataKey="questions"
                stroke="#8B5CF6"
                strokeWidth={2.5}
                fill="url(#purpleGradSmooth)"
                name="Questions Solved"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. Score Trend Across Sessions (Smooth, No Outline) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="p-5 sm:p-6 rounded-[30px] bg-white dark:bg-[#111A2E] shadow-sm space-y-3.5">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Score & Accuracy Progression</span>
          </h3>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
            Evaluation percentages across chronological sessions
          </p>
        </div>

        <div className="h-52 w-full pt-1">
          {scoreTrend.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="text-xs font-bold text-stone-500">No scored sessions yet</p>
              <p className="text-[10px] text-stone-400 mt-0.5">Complete exams to track your scores</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243556" opacity={0.2} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#888' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#888' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111A2E',
                    borderRadius: 12,
                    border: 'none',
                    color: '#fff',
                    fontSize: 11,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                  formatter={(val) => [`${val}%`, 'Score']}
                />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ fill: '#10B981', r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Accuracy %"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. Answer Quality Breakdown (Smooth, No Outline) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="p-5 sm:p-6 rounded-[30px] bg-white dark:bg-[#111A2E] shadow-sm space-y-3.5">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
            <Target className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Answer Correctness Breakdown</span>
          </h3>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
            Evaluation outcome distribution
          </p>
        </div>

        {answerQuality.length === 0 ? (
          <div className="py-10 text-center text-[11px] font-semibold text-stone-500">
            Submit tests for AI evaluation to review answer quality.
          </div>
        ) : (
          <div className="space-y-2.5 pt-1">
            {answerQuality.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-mono font-bold text-stone-900 dark:text-white">
                    {item.value} ({item.percentage}%)
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-stone-100 dark:bg-[#18233C] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. Time Management & Speed Assessment (Smooth, No Outline) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="p-5 sm:p-6 rounded-[30px] bg-white dark:bg-[#111A2E] shadow-sm space-y-3.5">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Time Cadence Assessment</span>
          </h3>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
            Questions solved relative to standard exam benchmarks
          </p>
        </div>

        <div className="h-44 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#243556" opacity={0.2} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#888' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#888' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111A2E',
                  borderRadius: 12,
                  border: 'none',
                  color: '#fff',
                  fontSize: 11,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Questions">
                {timeBarData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
