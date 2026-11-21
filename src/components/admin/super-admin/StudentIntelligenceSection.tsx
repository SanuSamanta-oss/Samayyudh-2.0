'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Award,
} from 'lucide-react';
import type { PlatformStudentDirectoryItem } from '@/types/admin';

export function StudentIntelligenceSection() {
  const [students, setStudents] = useState<PlatformStudentDirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/students/all?search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.items || []);
      }
    } catch (err) {
      console.error('[StudentIntelligenceSection] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  const formatIST = (isoString?: string | null) => {
    if (!isoString) return '—';
    try {
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-4 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-white dark:bg-[#111A2E] shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Student Intelligence & Proctoring Registry ({students.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Platform-wide student examinees, integrity violation aggregations, suspensions, and performance metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, email, or LCE code..."
              className="pl-9 pr-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-white/5 text-xs text-slate-900 dark:text-white placeholder-slate-400 border-0 outline-none focus:ring-1 focus:ring-purple-500/50 w-56 sm:w-72"
            />
          </form>

          <button
            type="button"
            onClick={fetchStudents}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border-0 outline-none"
            title="Refresh student directory"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-3xl bg-white dark:bg-[#111A2E] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-[11px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-white/2">
                <th className="py-3.5 px-4 font-bold">Candidate Details</th>
                <th className="py-3.5 px-3 font-bold text-center">Exams Attempted</th>
                <th className="py-3.5 px-3 font-bold text-center">Avg Accuracy</th>
                <th className="py-3.5 px-3 font-bold text-center">Integrity Warnings</th>
                <th className="py-3.5 px-3 font-bold text-center">Suspensions</th>
                <th className="py-3.5 px-4 font-bold text-right">Last Active (IST)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-600" />
                    <span>Loading student records...</span>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="font-bold text-slate-600 dark:text-slate-400">No students found.</p>
                  </td>
                </tr>
              ) : (
                students.map((st) => (
                  <tr
                    key={st.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-white/3 transition-colors"
                  >
                    {/* Candidate */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {st.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {st.lce_code ? `${st.lce_code} · ` : ''}{st.email}
                      </div>
                    </td>

                    {/* Exams Attempted */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {st.total_exams_taken}
                      </span>
                      {st.total_exams_in_progress > 0 && (
                        <div className="text-[10px] text-emerald-600 font-bold">
                          {st.total_exams_in_progress} In Progress
                        </div>
                      )}
                    </td>

                    {/* Avg Accuracy */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {st.average_accuracy}%
                      </span>
                    </td>

                    {/* Warnings */}
                    <td className="py-3.5 px-3 text-center">
                      {st.total_warnings_received > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                          {st.total_warnings_received} Warnings
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">0</span>
                      )}
                    </td>

                    {/* Suspensions */}
                    <td className="py-3.5 px-3 text-center">
                      {st.total_suspensions > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-bold text-[11px]">
                          {st.total_suspensions} Suspended
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">Clean</span>
                      )}
                    </td>

                    {/* Last Active */}
                    <td className="py-3.5 px-4 text-right text-slate-500 dark:text-slate-400">
                      {formatIST(st.last_exam_date || st.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
