'use client';

import { motion } from 'framer-motion';
import {
  Users,
  GraduationCap,
  FileQuestion,
  FolderOpen,
  ClipboardCheck,
  UserPlus,
  BookOpen,
  ArrowUpRight,
  Clock,
  AlertTriangle,
  Plus,
  Upload,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import type { AdminOverviewPayload, AdminSectionId } from '@/types/admin';

interface OverviewSectionProps {
  overview: AdminOverviewPayload | null;
  loading: boolean;
  onNavigate: (section: AdminSectionId) => void;
  onOpenNewQuestion: () => void;
  onOpenUploadResource: () => void;
}

export function OverviewSection({
  overview,
  loading,
  onNavigate,
  onOpenNewQuestion,
  onOpenUploadResource,
}: OverviewSectionProps) {
  if (loading && !overview) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-3xl bg-white dark:bg-[#111A2E] animate-pulse p-6"
          />
        ))}
      </div>
    );
  }

  const stats = overview?.stats;
  const kpiCards = [
    {
      label: 'Total Students',
      value: stats?.total_students ?? 0,
      sub: 'Registered learners',
      icon: Users,
      tint: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300',
      section: 'students' as AdminSectionId,
    },
    {
      label: 'Faculty & Admins',
      value: stats?.total_teachers ?? 0,
      sub: 'Authorized command roles',
      icon: GraduationCap,
      tint: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300',
      section: 'students' as AdminSectionId,
    },
    {
      label: 'Question Bank',
      value: stats?.total_questions ?? 0,
      sub: `${stats?.custom_questions ?? 0} DB + ${stats?.builtin_questions ?? 0} built-in`,
      icon: FileQuestion,
      tint: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300',
      section: 'questions' as AdminSectionId,
    },
    {
      label: 'Resource Library',
      value: stats?.total_resources ?? 0,
      sub: `${stats?.recent_uploads_7d ?? 0} uploaded last 7d`,
      icon: FolderOpen,
      tint: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300',
      section: 'resources' as AdminSectionId,
    },
    {
      label: 'Assignments',
      value: stats?.total_assignments ?? 0,
      sub: 'Published & draft tasks',
      icon: ClipboardCheck,
      tint: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
      section: 'assignments' as AdminSectionId,
    },
    {
      label: 'Active Classrooms',
      value: stats?.active_classrooms ?? 0,
      sub: 'Live cohorts',
      icon: BookOpen,
      tint: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
      section: 'classrooms' as AdminSectionId,
    },
    {
      label: 'Pending Connections',
      value: stats?.pending_connections ?? 0,
      sub: 'Incoming requests',
      icon: UserPlus,
      tint: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
      section: 'connections' as AdminSectionId,
    },
  ];

  return (
    <div className="space-y-6">
      {overview && !overview.schema_ready && (
        <div className="rounded-3xl bg-amber-50/90 dark:bg-amber-950/35 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Supabase Schema Migration Pending</p>
              <p className="text-xs mt-1 opacity-90 leading-relaxed">
                Run <code className="px-1.5 py-0.5 rounded bg-white/70 dark:bg-[#0B1120] font-mono">supabase/admin_command_center.sql</code> inside your Supabase SQL Editor to enable full question authoring, private resources, classrooms, SY-ID connections, and audit trails.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className="shrink-0 px-4 py-2 rounded-2xl bg-amber-900 text-white dark:bg-amber-400 dark:text-slate-950 text-xs font-semibold cursor-pointer"
          >
            Inspect Readiness
          </button>
        </div>
      )}

      <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-6 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] dark:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.45)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6D28D9] dark:text-[#A78BFA]">
            Global Educational Workspace
          </p>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-1">
            Build Assessments, Manage Classrooms &amp; Track Student Mastery
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            All changes synchronize live with SamayYudh practice sessions and student portals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenNewQuestion}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-medium transition-colors shadow-[0_6px_18px_-4px_rgba(109,40,217,0.4)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Question</span>
          </button>
          <button
            type="button"
            onClick={onOpenUploadResource}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-[#162032] hover:bg-[#EAE6F5] dark:hover:bg-[#231B3E] text-slate-800 dark:text-slate-100 text-sm font-medium transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#6D28D9] dark:text-[#C4B5FD]" />
            <span>Upload PDF / Sheet</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.button
              key={card.label}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: Math.min(idx * 0.04, 0.24), ease: 'easeOut' }}
              onClick={() => onNavigate(card.section)}
              className="group text-left rounded-3xl bg-white dark:bg-[#111A2E] p-5 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] dark:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 transition-all outline-none focus:outline-none cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${card.tint}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-[#6D28D9] dark:group-hover:text-[#C4B5FD] transition-colors" />
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                {card.value.toLocaleString()}
              </p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-0.5">
                {card.label}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{card.sub}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-6 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] dark:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.45)]">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              7-Day Platform Activity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Exam sessions &amp; newly authored questions
            </p>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overview?.charts.growth_series || []}>
                <defs>
                  <linearGradient id="cmdPurpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6D28D9" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6D28D9" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="sessions"
                  name="Sessions"
                  stroke="#6D28D9"
                  strokeWidth={2.5}
                  fill="url(#cmdPurpleGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="questions_added"
                  name="Questions Added"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-6 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] dark:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.45)]">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Question Bank by Subject
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Combined built-in + faculty bank distribution
            </p>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={overview?.charts.subject_distribution || []}
                margin={{ top: 8, right: 12, bottom: 8, left: 0 }}
                barCategoryGap="24%"
              >
                <XAxis
                  dataKey="subject"
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  tickFormatter={(val: string) => (val.length > 10 ? `${val.slice(0, 9)}...` : val)}
                  tickMargin={8}
                  axisLine={false}
                  tickLine={false}
                />
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
                <Bar dataKey="count" name="Questions" fill="#7C3AED" radius={[10, 10, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-6 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] dark:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Recent Resource Uploads
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('resources')}
              className="text-xs font-medium text-[#6D28D9] dark:text-[#C4B5FD] hover:underline cursor-pointer"
            >
              Open Library
            </button>
          </div>
          {(overview?.recent_resources || []).length === 0 ? (
            <div className="py-8 text-center rounded-2xl bg-stone-50/90 dark:bg-[#162032] text-xs text-slate-500 dark:text-slate-400">
              No resources uploaded yet. Upload PDFs, MCQ sheets, or study notes in Resource Library.
            </div>
          ) : (
            <div className="space-y-2">
              {overview?.recent_resources.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-stone-50/90 dark:bg-[#162032]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#111A2E] text-[#6D28D9] dark:text-[#C4B5FD] flex items-center justify-center shrink-0">
                      <FolderOpen className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {r.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {r.subject || r.category} · {r.visibility}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white dark:bg-[#111A2E] text-slate-600 dark:text-slate-300">
                    {r.exam_code || 'GEN'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-6 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] dark:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Security &amp; Command Audit Feed
            </h3>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          {(overview?.recent_audit || []).length === 0 ? (
            <div className="py-8 text-center rounded-2xl bg-stone-50/90 dark:bg-[#162032] text-xs text-slate-500 dark:text-slate-400">
              No recent audit events recorded yet.
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {overview?.recent_audit.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl bg-stone-50/90 dark:bg-[#162032]"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold font-mono text-slate-800 dark:text-slate-200 truncate">
                      {entry.action}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {entry.target_type || 'system'} · {entry.actor_role}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {new Date(entry.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
