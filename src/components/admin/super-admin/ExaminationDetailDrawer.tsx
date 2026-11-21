'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Video,
  Clock,
  Calendar,
  Users,
  FileSpreadsheet,
  Mail,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  FileText,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import type { PlatformExamSummary } from '@/types/admin';
import type { CustomExamParticipant } from '@/types/custom-exam';

interface ExaminationDetailDrawerProps {
  isOpen: boolean;
  exam: PlatformExamSummary | null;
  onClose: () => void;
  onEnterExamRoom: (examId: string, examCode?: string) => void;
  onContactTeacher: (teacherEmail: string, teacherName?: string, examId?: string, examCode?: string) => void;
}

export function ExaminationDetailDrawer({
  isOpen,
  exam,
  onClose,
  onEnterExamRoom,
  onContactTeacher,
}: ExaminationDetailDrawerProps) {
  const [participants, setParticipants] = useState<CustomExamParticipant[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'examinees' | 'reassign'>('overview');
  const [teachers, setTeachers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [reassigning, setReassigning] = useState(false);
  const [reassignSuccess, setReassignSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || !exam) return;

    setActiveTab('overview');
    setReassignSuccess(false);

    // Fetch participants for this exam
    const fetchParticipants = async () => {
      setLoadingParticipants(true);
      try {
        const res = await fetch(`/api/custom-exams/supervision/state?exam_id=${exam.id}`);
        if (res.ok) {
          const data = await res.json();
          setParticipants(data.participants || []);
        }
      } catch (err) {
        console.error('[ExaminationDetailDrawer] Failed to fetch participants:', err);
      } finally {
        setLoadingParticipants(false);
      }
    };

    // Fetch teachers list for reassignment
    const fetchTeachers = async () => {
      try {
        const res = await fetch('/api/admin/teachers/all');
        if (res.ok) {
          const data = await res.json();
          setTeachers(data.items || []);
        }
      } catch (err) {
        console.error('[ExaminationDetailDrawer] Failed to fetch teachers:', err);
      }
    };

    fetchParticipants();
    fetchTeachers();
  }, [isOpen, exam]);

  if (!isOpen || !exam) return null;

  const formatIST = (isoString?: string | null) => {
    if (!isoString) return 'Not Recorded';
    try {
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  const handleDownloadExcel = () => {
    window.open(`/api/custom-exams/${exam.exam_code}/export-excel`, '_blank');
  };

  const handleReassignProctor = async () => {
    if (!selectedTeacherId) return;
    const targetTeacher = teachers.find((t) => t.id === selectedTeacherId);
    if (!targetTeacher) return;

    setReassigning(true);
    try {
      const res = await fetch('/api/admin/exams/assign-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam.id,
          teacherId: targetTeacher.id,
          teacherName: targetTeacher.name,
          teacherEmail: targetTeacher.email,
        }),
      });

      if (res.ok) {
        setReassignSuccess(true);
        exam.assigned_teacher_id = targetTeacher.id;
        exam.assigned_teacher_name = targetTeacher.name;
        exam.assigned_teacher_email = targetTeacher.email;
        setTimeout(() => setReassignSuccess(false), 4000);
      }
    } catch (err) {
      console.error('[ExaminationDetailDrawer] Reassign proctor error:', err);
    } finally {
      setReassigning(false);
    }
  };

  // Compute duration elapsed
  const getElapsedDuration = () => {
    if (!exam.actual_start) return 'Not Started';
    const start = new Date(exam.actual_start).getTime();
    const end = exam.actual_end ? new Date(exam.actual_end).getTime() : Date.now();
    const diffMins = Math.max(0, Math.round((end - start) / 60000));
    return `${diffMins} minutes ${exam.actual_end ? '(Completed)' : '(Ongoing)'}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Drawer Content */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 380, damping: 36 }}
          className="relative w-full max-w-2xl h-full bg-white dark:bg-[#0E1526] shadow-2xl flex flex-col z-10 border-l border-slate-200 dark:border-white/5"
        >
          {/* Drawer Top Header */}
          <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-start justify-between gap-4 shrink-0 bg-slate-50/60 dark:bg-white/2">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-[11px] font-bold">
                  {exam.exam_code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-wider">
                  {exam.status}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight line-clamp-1">
                {exam.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Subject: {exam.subject} · {exam.total_marks} Marks · {exam.duration_minutes} Mins
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer border-0 outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Ribbon */}
          <div className="px-5 py-3 bg-purple-50/60 dark:bg-purple-950/20 border-b border-purple-100 dark:border-purple-900/30 flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => onEnterExamRoom(exam.id, exam.exam_code)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-1.5 shadow-sm shadow-purple-600/30"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Enter Control Room</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadExcel}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-1.5 shadow-sm shadow-emerald-600/30"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export 5-Sheet Excel</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onContactTeacher(
                  exam.creator_email || '',
                  exam.creator_name || 'Faculty',
                  exam.id,
                  exam.exam_code
                )
              }
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Teacher</span>
            </button>
          </div>

          {/* Navigation Tabs with Smooth Sliding Animation */}
          <div className="flex items-center px-5 gap-2 border-b border-slate-100 dark:border-white/5 shrink-0 bg-white dark:bg-[#0E1526]">
            {[
              { id: 'overview' as const, label: 'Overview & Timestamps' },
              { id: 'examinees' as const, label: `Examinees (${participants.length || exam.total_joined})` },
              { id: 'reassign' as const, label: 'Assign Proctor' },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="relative py-3.5 px-3 text-xs font-bold transition-colors duration-200 cursor-pointer border-0 outline-none"
                >
                  <span
                    className={`relative z-10 transition-colors duration-200 ${
                      active
                        ? 'text-purple-700 dark:text-purple-300 font-extrabold'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="examDetailTabIndicator"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full shadow-[0_0_8px_rgba(147,51,234,0.6)]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {activeTab === 'overview' && (
              <>
                {/* Official Timestamps (Asia/Kolkata) */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/3 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-500" />
                    Official Examination Timestamps (Asia/Kolkata — IST)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white dark:bg-white/5 space-y-1">
                      <span className="text-[11px] text-slate-400 block">Created At</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatIST(exam.created_at)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-white/5 space-y-1">
                      <span className="text-[11px] text-slate-400 block">Scheduled Start</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatIST(exam.scheduled_start)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-white/5 space-y-1">
                      <span className="text-[11px] text-slate-400 block">Actual Start Time</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatIST(exam.actual_start)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-white/5 space-y-1">
                      <span className="text-[11px] text-slate-400 block">Actual End Time</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatIST(exam.actual_end)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Total Duration Elapsed:</span>
                    <span className="font-black text-purple-600 dark:text-purple-400">
                      {getElapsedDuration()}
                    </span>
                  </div>
                </div>

                {/* Personnel Attribution: Creator Faculty vs Assigned Supervisor */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/3 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                    Faculty Attribution & Proctoring Authority
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white dark:bg-white/5 space-y-1">
                      <span className="text-[11px] text-slate-400 block">Original Creator Faculty</span>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {exam.creator_name || 'Faculty Member'}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {exam.creator_email || 'System Creator'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-white/5 space-y-1">
                      <span className="text-[11px] text-slate-400 block">Assigned Live Supervisor</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400 block">
                        {exam.assigned_teacher_name || exam.creator_name || 'Faculty Member'}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {exam.assigned_teacher_email || exam.creator_email || 'Direct Supervisor'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Examination Summary Metrics */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/3">
                    <div className="text-xl font-black text-slate-900 dark:text-white">
                      {exam.total_joined}
                    </div>
                    <span className="text-[11px] text-slate-400 font-semibold">Joined Candidates</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/3">
                    <div className="text-xl font-black text-rose-500">
                      {exam.total_suspended}
                    </div>
                    <span className="text-[11px] text-slate-400 font-semibold">Suspensions</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/3">
                    <div className="text-xl font-black text-amber-500">
                      {exam.total_flagged}
                    </div>
                    <span className="text-[11px] text-slate-400 font-semibold">Flagged Violations</span>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'examinees' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Examinees in Room ({participants.length})</span>
                  <span>Super Admin Live Status</span>
                </div>

                {loadingParticipants ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Loading candidate records...
                  </div>
                ) : participants.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/3 text-center text-xs text-slate-400">
                    No participants have entered this examination room yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {participants.map((p) => (
                      <div
                        key={p.student_id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-white/3 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {p.student_name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {p.student_lce_code} · {p.student_email || 'student'}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {p.is_suspended ? (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 text-[10px] font-bold">
                              Suspended
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                              Active
                            </span>
                          )}
                          {(p.warning_count || 0) > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold">
                              {p.warning_count} Warn
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reassign' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/3 space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Reassign Supervision Authority
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Assign a specific teacher or proctor to supervise this examination without altering the original creator record.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select New Assigned Proctor
                  </label>
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs outline-none"
                  >
                    <option value="">-- Choose Educator --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.email})
                      </option>
                    ))}
                  </select>
                </div>

                {reassignSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Supervision authority successfully reassigned!</span>
                  </div>
                )}

                <button
                  type="button"
                  disabled={!selectedTeacherId || reassigning}
                  onClick={handleReassignProctor}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold transition-all cursor-pointer border-0 outline-none"
                >
                  {reassigning ? 'Reassigning...' : 'Confirm Reassignment'}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
