'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  GraduationCap,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Loader2,
  ChevronRight,
  Eye,
  UserCheck,
  Lock,
  Unlock,
} from 'lucide-react';

interface SuperAdminItem {
  id: string;
  email: string | null;
  fullName: string;
  role: string;
  status: string;
  authorizedBy: string;
  createdAt: string;
}

interface TeacherItem {
  id: string;
  fullName: string;
  email: string;
  institutionalEmail?: string;
  institutionName?: string;
  department?: string;
  designation?: string;
  verificationStatus: 'verified' | 'pending' | 'rejected' | 'suspended';
  verificationMethod?: string;
  verificationScore?: number;
  verifiedAt?: string;
  createdAt: string;
}

interface StudentItem {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export function UserRoleManagementSection() {
  const [activeTab, setActiveTab] = useState<'teachers' | 'super_admins' | 'students'>('teachers');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [superAdmins, setSuperAdmins] = useState<SuperAdminItem[]>([]);
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [counts, setCounts] = useState({ super_admins: 0, teachers: 0, students: 0 });

  const [selectedTeacher, setSelectedTeacher] = useState<TeacherItem | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        tab: activeTab,
        search,
        status: statusFilter,
      });
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCounts(data.counts || { super_admins: 0, teachers: 0, students: 0 });
        if (activeTab === 'super_admins') {
          setSuperAdmins(data.items || []);
        } else if (activeTab === 'teachers') {
          setTeachers(data.items || []);
        } else {
          setStudents(data.items || []);
        }
      }
    } catch (err) {
      console.error('Failed to load user management data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadData]);

  async function handleTeacherAction(userId: string, action: 'approve_teacher' | 'revoke_teacher' | 'suspend_user' | 'restore_user') {
    setActionLoadingId(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, user_id: userId }),
      });
      if (res.ok) {
        await loadData();
        if (selectedTeacher && selectedTeacher.id === userId) {
          setSelectedTeacher(null);
        }
      }
    } catch (err) {
      console.error('Action error:', err);
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            User &amp; Role Management
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Supervise platform privileges across Super Admins, verified Teachers, and enrolled Students.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadData()}
          disabled={loading}
          className="self-start sm:self-auto py-2 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-[#201D2E] dark:hover:bg-[#28253A] text-neutral-700 dark:text-neutral-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Tabs with Smooth Sliding Pill */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-neutral-100 dark:bg-[#1C1A29]">
        {[
          {
            id: 'teachers',
            label: 'Teachers',
            icon: GraduationCap,
            count: counts.teachers,
            badgeClass: 'bg-[#F59E0B]/20 text-[#B45309] dark:text-[#FBBF24]',
          },
          {
            id: 'super_admins',
            label: 'Super Admins',
            icon: ShieldCheck,
            count: counts.super_admins,
            badgeClass: 'bg-neutral-200 dark:bg-[#342F4B] text-neutral-700 dark:text-neutral-300',
          },
          {
            id: 'students',
            label: 'Students',
            icon: Users,
            count: counts.students,
            badgeClass: 'bg-neutral-200 dark:bg-[#342F4B] text-neutral-700 dark:text-neutral-300',
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as typeof activeTab);
                setStatusFilter('all');
              }}
              className={`group relative flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer outline-none focus:outline-none ${
                active
                  ? 'text-neutral-900 dark:text-white'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="user-role-tab-pill"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  className="absolute inset-0 rounded-xl bg-white dark:bg-[#262238] shadow-[0_4px_16px_-2px_rgba(0,0,0,0.12)]"
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Icon className="w-4 h-4 text-[#F59E0B]" />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] ${tab.badgeClass}`}>
                  {tab.count}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeTab} by name, email, or institution...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#1C1A29] text-xs text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:outline-none shadow-sm"
          />
        </div>

        {activeTab === 'teachers' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#1C1A29] text-xs text-neutral-800 dark:text-neutral-200 outline-none focus:outline-none cursor-pointer shadow-sm"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Verification</option>
              <option value="verified">Verified Only</option>
              <option value="rejected">Rejected / Revoked</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Content Table / List with Smooth Transition */}
      <div className="rounded-[28px] bg-white dark:bg-[#181622] p-4 sm:p-6 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
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
              <span className="text-xs">Loading records...</span>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeTab === 'super_admins' ? (
                /* SUPER ADMINS LIST */
                superAdmins.length === 0 ? (
                  <div className="py-12 text-center text-xs text-neutral-400">
                    No Super Admin accounts found matching the criteria.
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100 dark:divide-[#242033]">
                    {superAdmins.map((admin) => (
                      <div
                        key={admin.id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-neutral-900 dark:text-white">
                              {admin.fullName}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                              {admin.email || 'System Super Admin'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24]">
                            Server Allowlist Authorized
                          </span>
                          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            Active
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : activeTab === 'teachers' ? (
                /* TEACHERS LIST */
                teachers.length === 0 ? (
                  <div className="py-12 text-center text-xs text-neutral-400">
                    No teacher profiles found matching your search.
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100 dark:divide-[#242033]">
                    {teachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                      >
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] flex items-center justify-center shrink-0">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                                {teacher.fullName}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  teacher.verificationStatus === 'verified'
                                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                    : teacher.verificationStatus === 'rejected'
                                    ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                }`}
                              >
                                {teacher.verificationStatus === 'verified'
                                  ? 'Verified'
                                  : teacher.verificationStatus === 'rejected'
                                  ? 'Rejected'
                                  : 'Pending'}
                              </span>
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                              {teacher.institutionName || 'Unknown Institution'} •{' '}
                              {teacher.institutionalEmail || teacher.email}
                            </div>
                            {teacher.designation && (
                              <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                                {teacher.designation}
                                {teacher.department ? ` • ${teacher.department}` : ''}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSelectedTeacher(teacher)}
                            className="py-1.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-[#201D2E] dark:hover:bg-[#28253A] text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>

                          {teacher.verificationStatus !== 'verified' ? (
                            <button
                              type="button"
                              disabled={actionLoadingId === teacher.id}
                              onClick={() => handleTeacherAction(teacher.id, 'approve_teacher')}
                              className="py-1.5 px-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-black text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              {actionLoadingId === teacher.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              )}
                              <span>Approve</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={actionLoadingId === teacher.id}
                              onClick={() => handleTeacherAction(teacher.id, 'revoke_teacher')}
                              className="py-1.5 px-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              {actionLoadingId === teacher.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5" />
                              )}
                              <span>Revoke</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* STUDENTS LIST */
                students.length === 0 ? (
                  <div className="py-12 text-center text-xs text-neutral-400">
                    No student accounts found.
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100 dark:divide-[#242033]">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-[#201D2E] text-neutral-700 dark:text-neutral-300 flex items-center justify-center shrink-0">
                            <UserCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-neutral-900 dark:text-white">
                              {student.fullName}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                              {student.email}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            Enrolled Student
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TEACHER INSPECTION MODAL */}
      <AnimatePresence>
        {selectedTeacher && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTeacher(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#181622] rounded-[32px] p-6 sm:p-8 shadow-2xl z-10 my-auto text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-[#221E31]">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Teacher Verification Details
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Inspect credential evidence and verification scoring
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTeacher(null)}
                  className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-[#201D2E] text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] text-neutral-400 font-medium">Full Name</div>
                    <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {selectedTeacher.fullName}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-neutral-400 font-medium">Status</div>
                    <div className="text-sm font-semibold text-neutral-900 dark:text-white capitalize">
                      {selectedTeacher.verificationStatus}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">
                    Institutional Email
                  </div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {selectedTeacher.institutionalEmail || 'None provided'}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Institution</div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {selectedTeacher.institutionName || 'Not specified'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] text-neutral-400 font-medium">Department</div>
                    <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {selectedTeacher.department || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-neutral-400 font-medium">Designation</div>
                    <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {selectedTeacher.designation || 'Faculty'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] text-neutral-400 font-medium">Method</div>
                    <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {selectedTeacher.verificationMethod || 'institutional_email'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-neutral-400 font-medium">
                      Verification Score
                    </div>
                    <div className="text-sm font-semibold text-[#F59E0B]">
                      {selectedTeacher.verificationScore || 100} / 100
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100 dark:border-[#221E31]">
                {selectedTeacher.verificationStatus !== 'verified' ? (
                  <button
                    type="button"
                    onClick={() => handleTeacherAction(selectedTeacher.id, 'approve_teacher')}
                    className="py-2.5 px-6 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold text-xs cursor-pointer"
                  >
                    Approve Teacher Privileges
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleTeacherAction(selectedTeacher.id, 'revoke_teacher')}
                    className="py-2.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs cursor-pointer"
                  >
                    Revoke Verification
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

