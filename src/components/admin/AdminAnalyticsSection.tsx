'use client';

import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { Download, TrendingUp, Layers, ShieldCheck } from 'lucide-react';
import type { AdminOverviewPayload } from '@/types/admin';

interface AdminAnalyticsSectionProps {
  overview: AdminOverviewPayload | null;
}

export function AdminAnalyticsSection({ overview }: AdminAnalyticsSectionProps) {
  function exportMetricsCsv() {
    if (!overview) return;
    const rows = [
      ['Metric', 'Value'],
      ['Total Students', String(overview.stats.total_students)],
      ['Total Teachers/Admins', String(overview.stats.total_teachers)],
      ['Total Questions', String(overview.stats.total_questions)],
      ['Custom DB Questions', String(overview.stats.custom_questions)],
      ['Uploaded Resources', String(overview.stats.total_resources)],
      ['Assignments', String(overview.stats.total_assignments)],
      ['Active Classrooms', String(overview.stats.active_classrooms)],
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `samayyudh-command-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-6 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] dark:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.45)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Academic &amp; Platform Intelligence
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Live database metrics across exam preparation attempts, question bank depth, and classroom cohorts.
          </p>
        </div>

        <button
          type="button"
          onClick={exportMetricsCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#EAE6F5] dark:bg-[#231B3E] text-[#6D28D9] dark:text-[#C4B5FD] text-xs sm:text-sm font-semibold cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: 0 }}
          className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] dark:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 transition-transform"
        >
          <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-950/50 text-[#6D28D9] dark:text-[#C4B5FD] flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {(overview?.charts.growth_series || []).reduce((acc, d) => acc + d.sessions, 0)}
          </p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-0.5">
            Sessions Last 7 Days
          </p>
          <p className="text-xs text-slate-400 mt-1">Measured from exam_sessions table</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: 0.05 }}
          className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] dark:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 transition-transform"
        >
          <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-300 flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {(overview?.charts.subject_distribution || []).length}
          </p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-0.5">
            Active Subject Domains
          </p>
          <p className="text-xs text-slate-400 mt-1">Across JEE, NEET, GATE, WBJEE &amp; more</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: 0.1 }}
          className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] dark:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 transition-transform"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {overview?.stats.custom_questions ?? 0}
          </p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-0.5">
            Faculty-Authored Questions
          </p>
          <p className="text-xs text-slate-400 mt-1">Stored securely with audit trails</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-6 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)]">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
            Daily Practice Velocity vs Content Authoring
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overview?.charts.growth_series || []}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.12} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    backgroundColor: '#1E293B',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="sessions" name="Student Sessions" stroke="#6D28D9" fill="#6D28D9" fillOpacity={0.18} strokeWidth={2.5} />
                <Area type="monotone" dataKey="questions_added" name="Questions Created" stroke="#10B981" fill="#10B981" fillOpacity={0.12} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-6 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)]">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-5">
            Subject Coverage Breakdown
          </h3>
          <div
            className="w-full"
            style={{
              height: `${Math.max(320, (overview?.charts.subject_distribution?.length || 0) * 44)}px`,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={overview?.charts.subject_distribution || []}
                layout="vertical"
                margin={{ top: 4, right: 24, bottom: 8, left: 4 }}
                barCategoryGap="26%"
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} horizontal={false} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                />
                <YAxis
                  type="category"
                  dataKey="subject"
                  width={175}
                  tick={{ fontSize: 12, fill: '#64748B' }}
                  tickFormatter={(val: string) => (val.length > 24 ? `${val.slice(0, 22)}...` : val)}
                  tickMargin={14}
                  interval={0}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(139, 92, 246, 0.06)' }}
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    backgroundColor: '#1E293B',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Questions" fill="#8B5CF6" barSize={20} radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
