'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Shield,
  UserCheck,
  Ban,
  RotateCcw,
  Archive,
  Activity,
  Award,
  Target,
} from 'lucide-react';
import { SmoothSelect } from '@/components/ui/SmoothSelect';
import type { CommandRole } from '@/types/admin';

interface DirectoryRow {
  user_id: string;
  public_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  preferred_exam: string;
  role: CommandRole;
  account_status: 'active' | 'suspended' | 'archived';
  sessions_count: number;
  avg_score: number;
}

interface StudentDirectorySectionProps {
  viewerRole: CommandRole;
  viewerUserId: string;
}

const ROLE_TABS: Array<{ id: '' | CommandRole; label: string }> = [
  { id: '', label: 'All' },
  { id: 'student', label: 'Students' },
  { id: 'teacher', label: 'Teachers' },
  { id: 'admin', label: 'Admins' },
  { id: 'super_admin', label: 'Super Admins' },
];

function roleBadgeClasses(role: CommandRole): string {
  switch (role) {
    case 'super_admin':
      return 'bg-[#635BFF]/15 text-[#564AE6] dark:bg-[#6D28D9]/35 dark:text-[#DDD6FE]';
    case 'admin':
      return 'bg-indigo-500/12 text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-200';
    case 'teacher':
      return 'bg-emerald-500/12 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300';
    default:
      return 'bg-[#EAE6F5] text-[#6D28D9] dark:bg-[#231B3E] dark:text-[#C4B5FD]';
  }
}

export function StudentDirectorySection({
  viewerRole,
  viewerUserId,
}: StudentDirectorySectionProps) {
  const [items, setItems] = useState<DirectoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [scopedToTeacher, setScopedToTeacher] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'' | CommandRole>('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadDirectory = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (search.trim()) qs.set('search', search.trim());
      if (roleFilter) qs.set('role', roleFilter);
      const res = await fetch(`/api/admin/students?${qs.toString()}`);
      if (res.ok) {
        const data = (await res.json()) as {
          items?: DirectoryRow[];
          scopedToTeacher?: boolean;
        };
        setItems(data.items || []);
        setScopedToTeacher(Boolean(data.scopedToTeacher));
      }
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    Promise.resolve().then(() => {
      void loadDirectory();
    });
  }, [loadDirectory]);

  async function updateUserAccount(
    targetUserId: string,
    payload: { role?: CommandRole; account_status?: 'active' | 'suspended' | 'archived' }
  ) {
    setUpdatingId(targetUserId);
    try {
      const res = await fetch('/api/admin/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, ...payload }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setFeedback(data.error || 'Action failed.');
        return;
      }
      setFeedback('Account permissions updated.');
      await loadDirectory();
    } finally {
      setUpdatingId(null);
    }
  }

  const canManageAccounts = viewerRole === 'super_admin' || viewerRole === 'admin';
  const activeCount = items.filter((u) => u.account_status === 'active').length;

  return (
    <div className="space-y-4">
      {/* Modern Glass Search + Animated Segmented Role Tabs */}
      <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-4 sm:p-5 shadow-[0_8px_28px_-8px_rgba(88,28,135,0.06)] dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.45)] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, @username, or SY-XXXXXXXX..."
              className="w-full rounded-2xl bg-stone-100/90 dark:bg-[#162032] focus:bg-white dark:focus:bg-[#19263F] pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:outline-none focus:shadow-[0_6px_20px_-4px_rgba(99,91,255,0.22)] transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-[#162032] text-slate-700 dark:text-slate-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#635BFF]" />
              {scopedToTeacher
                ? `${items.length} cohort learner(s)`
                : `${items.length} registered account(s)`}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {activeCount} active
            </span>
          </div>
        </div>

        {/* Smooth Sliding Role Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 rounded-2xl bg-stone-100/85 dark:bg-[#0D1526]">
          {ROLE_TABS.map((tab) => {
            const selected = roleFilter === tab.id;
            return (
              <button
                key={tab.id || 'all'}
                type="button"
                onClick={() => setRoleFilter(tab.id)}
                className={`relative shrink-0 px-3.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer whitespace-nowrap ${
                  selected
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                }`}
              >
                {selected && (
                  <motion.div
                    layoutId="directory-role-filter-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-xl bg-white dark:bg-[#1D2942] shadow-sm"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-2xl bg-[#EAE6F5] dark:bg-[#231B3E] px-4 py-2.5 text-xs font-medium text-[#564AE6] dark:text-[#DDD6FE]"
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Individual Floating Account Cards */}
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 h-24 animate-pulse shadow-[0_6px_24px_-6px_rgba(88,28,135,0.04)]"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl bg-white dark:bg-[#111A2E] py-14 px-6 text-center shadow-[0_8px_28px_-8px_rgba(88,28,135,0.06)] space-y-2.5">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EAE6F5] dark:bg-[#231B3E] text-[#635BFF] dark:text-[#C4B5FD] flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            No Matching Learners Found
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {scopedToTeacher
              ? 'Enroll students into a classroom or accept connections to see their performance metrics here.'
              : 'No registered accounts match your current search or role filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((u, idx) => {
            const isSelf = u.user_id === viewerUserId;
            const busy = updatingId === u.user_id;

            return (
              <motion.div
                key={u.user_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.22,
                  delay: Math.min(idx * 0.03, 0.24),
                  ease: 'easeOut',
                }}
                className="group rounded-3xl bg-white dark:bg-[#111A2E] p-4 sm:p-5 shadow-[0_6px_24px_-8px_rgba(88,28,135,0.06)] dark:shadow-[0_10px_28px_-8px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(99,91,255,0.14)] dark:hover:shadow-[0_14px_32px_-8px_rgba(0,0,0,0.65)] transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6C63FF]/15 via-[#8B5CF6]/15 to-[#635BFF]/25 dark:from-[#6D28D9]/40 dark:to-[#4C1D95]/50 text-[#564AE6] dark:text-[#DDD6FE] flex items-center justify-center font-bold text-sm">
                      {u.display_name.slice(0, 2).toUpperCase()}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full shadow-[0_0_0_2px_rgba(255,255,255,0.95)] dark:shadow-[0_0_0_2px_#111A2E] ${
                        u.account_status === 'active'
                          ? 'bg-emerald-500'
                          : u.account_status === 'suspended'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {u.display_name}
                      </p>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-stone-100 dark:bg-[#162032] text-slate-700 dark:text-slate-200">
                        {u.public_id}
                      </span>
                      {u.username && (
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          @{u.username}
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${roleBadgeClasses(
                          u.role
                        )}`}
                      >
                        {u.role.replace('_', ' ')}
                      </span>
                      {u.account_status !== 'active' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/12 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300 capitalize">
                          {u.account_status}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-100/80 dark:bg-[#162032]">
                        <Activity className="w-3.5 h-3.5 text-[#635BFF] dark:text-[#A78BFA]" />
                        {u.sessions_count} sessions
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-100/80 dark:bg-[#162032]">
                        <Award className="w-3.5 h-3.5 text-emerald-500" />
                        {u.avg_score}% avg accuracy
                      </span>
                      {u.preferred_exam && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-100/80 dark:bg-[#162032]">
                          <Target className="w-3.5 h-3.5 text-amber-500" />
                          {u.preferred_exam}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {canManageAccounts && !isSelf && (
                  <div className="flex flex-wrap items-center gap-2 shrink-0 sm:pl-14 lg:pl-0">
                    <SmoothSelect
                      disabled={busy}
                      value={u.role}
                      onChange={(val) =>
                        updateUserAccount(u.user_id, {
                          role: val as CommandRole,
                        })
                      }
                      ariaLabel={`Change role for ${u.display_name}`}
                      size="sm"
                      align="right"
                      menuMinWidth={168}
                      options={[
                        { value: 'student', label: 'Student' },
                        { value: 'teacher', label: 'Teacher' },
                        ...(viewerRole === 'super_admin'
                          ? [
                              { value: 'admin', label: 'Admin' },
                              { value: 'super_admin', label: 'Super Admin' },
                            ]
                          : []),
                      ]}
                    />

                    {u.account_status === 'active' ? (
                      <>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            updateUserAccount(u.user_id, { account_status: 'suspended' })
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold text-amber-700 dark:text-amber-300 transition-colors cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Suspend</span>
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            updateUserAccount(u.user_id, { account_status: 'archived' })
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-300 transition-colors cursor-pointer"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          <span>Archive</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          updateUserAccount(u.user_id, { account_status: 'active' })
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore Active</span>
                      </button>
                    )}
                  </div>
                )}

                {isSelf && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#EAE6F5]/75 dark:bg-[#231B3E] text-xs font-semibold text-[#564AE6] dark:text-[#C4B5FD] self-start lg:self-center">
                    <Shield className="w-3.5 h-3.5" />
                    Your Account
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
