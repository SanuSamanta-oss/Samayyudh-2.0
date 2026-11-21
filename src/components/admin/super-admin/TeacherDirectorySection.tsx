'use client';

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Mail,
  Search,
  RefreshCw,
  Video,
  FileText,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import type { PlatformTeacherDirectoryItem } from '@/types/admin';

interface TeacherDirectorySectionProps {
  onContactTeacher: (email: string, name?: string) => void;
  onViewTeacherExams: (teacherId: string, teacherName: string) => void;
}

export function TeacherDirectorySection({
  onContactTeacher,
  onViewTeacherExams,
}: TeacherDirectorySectionProps) {
  const [teachers, setTeachers] = useState<PlatformTeacherDirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/teachers/all?search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setTeachers(data.items || []);
      }
    } catch (err) {
      console.error('[TeacherDirectorySection] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTeachers();
  };

  return (
    <div className="space-y-4 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 rounded-[28px] bg-white dark:bg-[#111A2E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-0 ring-0">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Platform Educators Directory ({teachers.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Oversee all faculty members, exam creation portfolios, and supervise proctoring assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search teacher by name or email..."
              className="pl-9 pr-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-white/5 text-xs text-slate-900 dark:text-white placeholder-slate-400 border-0 outline-none focus:ring-1 focus:ring-purple-500/50 w-52 sm:w-64"
            />
          </form>

          <button
            type="button"
            onClick={fetchTeachers}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border-0 outline-none shadow-xs"
            title="Refresh educators"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-600" />
            <span>Loading faculty directory...</span>
          </div>
        ) : teachers.length === 0 ? (
          <div className="col-span-full p-8 rounded-[28px] bg-white dark:bg-[#111A2E] text-center text-xs text-slate-400 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-0 ring-0">
            No educators found.
          </div>
        ) : (
          teachers.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-[26px] bg-white dark:bg-[#111A2E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all flex flex-col justify-between space-y-4 border-0 ring-0"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider">
                    {t.role}
                  </span>
                  {t.verified && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                  {t.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {t.email}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {t.institution || 'Faculty Member'}
                </p>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 text-center text-xs">
                <div>
                  <div className="font-black text-slate-900 dark:text-white">
                    {t.total_exams_created}
                  </div>
                  <span className="text-[10px] text-slate-400">Created</span>
                </div>
                <div>
                  <div className="font-black text-purple-600 dark:text-purple-400">
                    {t.total_exams_supervised}
                  </div>
                  <span className="text-[10px] text-slate-400">Proctored</span>
                </div>
                <div>
                  <div className="font-black text-rose-500">
                    {t.active_exams_now}
                  </div>
                  <span className="text-[10px] text-slate-400">Live Now</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onContactTeacher(t.email, t.name)}
                  className="flex-1 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-1.5 shadow-sm shadow-purple-600/30"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Notice</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
