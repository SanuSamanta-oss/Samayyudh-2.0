'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Users,
  Smartphone,
  Laptop,
  ShieldCheck,
  GraduationCap,
  Clock,
  RefreshCw,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface SessionItem {
  id: string;
  user_id: string;
  email: string | null;
  role: string;
  user_agent: string | null;
  ip_address: string | null;
  device_type: string | null;
  is_active: boolean;
  signed_in_at: string;
}

interface ActivityStats {
  totalLogins: number;
  uniqueUsers: number;
  roleDistribution: {
    super_admin: number;
    teacher: number;
    student: number;
  };
  deviceBreakdown: {
    mobile: number;
    desktop: number;
  };
}

function formatRelativeTime(isoString: string): string {
  try {
    const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  } catch {
    return 'Recently';
  }
}

export function LoginActivitySection() {
  const [range, setRange] = useState<'recent' | '7d' | '30d'>('recent');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [stats, setStats] = useState<ActivityStats>({
    totalLogins: 0,
    uniqueUsers: 0,
    roleDistribution: { super_admin: 0, teacher: 0, student: 0 },
    deviceBreakdown: { mobile: 0, desktop: 0 },
  });
  const [sessions, setSessions] = useState<SessionItem[]>([]);

  const fetchActivity = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await fetch(`/api/admin/login-activity?range=${range}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || {
          totalLogins: 0,
          uniqueUsers: 0,
          roleDistribution: { super_admin: 0, teacher: 0, student: 0 },
          deviceBreakdown: { mobile: 0, desktop: 0 },
        });
        setSessions(data.sessions || []);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error('Failed to load login activity:', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  // Auto-refresh interval (every 30s) without refreshing user auth tokens
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchActivity(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchActivity]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Login Activity &amp; Session Monitoring
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Real-time audit telemetry across all authentication sessions, platform roles, and client devices.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {lastUpdated && (
            <div className="text-[11px] text-neutral-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Updated: {lastUpdated}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              autoRefresh
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                : 'bg-neutral-100 dark:bg-[#201D2E] text-neutral-500'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                autoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'
              }`}
            />
            <span>{autoRefresh ? 'Live Poll ON' : 'Live Poll OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => fetchActivity()}
            disabled={loading}
            className="py-2 px-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-[#201D2E] dark:hover:bg-[#28253A] text-neutral-700 dark:text-neutral-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs with Smooth Sliding Pill */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-neutral-100 dark:bg-[#1C1A29] max-w-md">
        {[
          { id: 'recent', label: 'Recent (24h)' },
          { id: '7d', label: 'Last 7 Days' },
          { id: '30d', label: 'Last 30 Days' },
        ].map((tab) => {
          const active = range === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRange(tab.id as typeof range)}
              className={`group relative flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer outline-none focus:outline-none ${
                active
                  ? 'text-neutral-900 dark:text-white'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="login-activity-tab-pill"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  className="absolute inset-0 rounded-xl bg-white dark:bg-[#262238] shadow-[0_4px_16px_-2px_rgba(0,0,0,0.12)]"
                />
              )}
              <span className="relative z-10 flex items-center justify-center">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Logins */}
        <div className="p-5 rounded-[24px] bg-white dark:bg-[#181622] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Total Logins</span>
            <div className="p-2 rounded-xl bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            {stats.totalLogins}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">In selected timeframe</div>
        </div>

        {/* Unique Users */}
        <div className="p-5 rounded-[24px] bg-white dark:bg-[#181622] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Active Unique Users</span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            {stats.uniqueUsers}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Distinct authenticated accounts</div>
        </div>

        {/* Role Breakdown */}
        <div className="p-5 rounded-[24px] bg-white dark:bg-[#181622] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Role Breakdown</span>
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xs space-y-1 text-neutral-600 dark:text-neutral-300 font-medium">
            <div className="flex justify-between">
              <span>Super Admin:</span>
              <span className="font-bold text-neutral-900 dark:text-white">
                {stats.roleDistribution.super_admin}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Teachers:</span>
              <span className="font-bold text-neutral-900 dark:text-white">
                {stats.roleDistribution.teacher}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Students:</span>
              <span className="font-bold text-neutral-900 dark:text-white">
                {stats.roleDistribution.student}
              </span>
            </div>
          </div>
        </div>

        {/* Device Distribution */}
        <div className="p-5 rounded-[24px] bg-white dark:bg-[#181622] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Device Breakdown</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xs space-y-1 text-neutral-600 dark:text-neutral-300 font-medium">
            <div className="flex justify-between">
              <span>Desktop / Laptop:</span>
              <span className="font-bold text-neutral-900 dark:text-white">
                {stats.deviceBreakdown.desktop}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Mobile / PWA:</span>
              <span className="font-bold text-neutral-900 dark:text-white">
                {stats.deviceBreakdown.mobile}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed Table */}
      <div className="rounded-[28px] bg-white dark:bg-[#181622] p-4 sm:p-6 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)]">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-4">
          Session Activity Stream
        </h3>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 flex flex-col items-center justify-center gap-3 text-neutral-400"
            >
              <Loader2 className="w-6 h-6 animate-spin text-[#F59E0B]" />
              <span className="text-xs">Loading sessions...</span>
            </motion.div>
          ) : (
            <motion.div
              key={range}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              {sessions.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-400">
                  No login activity recorded in this timeframe.
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 dark:divide-[#242033]">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-[#201D2E] text-neutral-700 dark:text-neutral-300 flex items-center justify-center shrink-0">
                          {(session.device_type || '').toLowerCase().includes('mobile') ? (
                            <Smartphone className="w-4 h-4 text-[#F59E0B]" />
                          ) : (
                            <Laptop className="w-4 h-4 text-purple-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-900 dark:text-white">
                              {session.email || 'Anonymous User'}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                session.role === 'super_admin'
                                  ? 'bg-[#F59E0B]/20 text-[#B45309] dark:text-[#FBBF24]'
                                  : session.role === 'teacher'
                                  ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                                  : 'bg-neutral-200 dark:bg-[#28253A] text-neutral-600 dark:text-neutral-400'
                              }`}
                            >
                              {session.role}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-400 mt-0.5">
                            {session.device_type} • IP: {session.ip_address}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          <div className="font-semibold">{formatRelativeTime(session.signed_in_at)}</div>
                          <div className="text-[10px] text-neutral-400">
                            {new Date(session.signed_in_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

