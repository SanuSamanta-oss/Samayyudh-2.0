'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardCheck,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react';
import { SmoothSelect } from '@/components/ui/SmoothSelect';
import type { AssignmentItem, ClassroomItem, StudentGroupItem } from '@/types/admin';

interface AssignmentsSectionProps {
  classrooms: ClassroomItem[];
  groups: StudentGroupItem[];
}

export function AssignmentsSection({ classrooms, groups }: AssignmentsSectionProps) {
  const [items, setItems] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [dueAt, setDueAt] = useState('');
  const [submissionType, setSubmissionType] = useState<'mcq' | 'pdf' | 'descriptive' | 'mixed'>('mixed');
  const [classroomId, setClassroomId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [saving, setSaving] = useState(false);

  const loadAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/assignments');
      if (res.ok) {
        const data = (await res.json()) as { items?: AssignmentItem[] };
        setItems(data.items || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      void loadAssignments();
    });
  }, [loadAssignments]);

  async function createAssignment() {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          max_marks: maxMarks,
          time_limit_minutes: durationMinutes,
          due_at: dueAt || null,
          submission_type: submissionType,
          classroom_id: classroomId || null,
          group_id: groupId || null,
          status: 'published',
        }),
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        setComposerOpen(false);
        await loadAssignments();
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteAssignment(id: string) {
    const res = await fetch('/api/admin/assignments', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) await loadAssignments();
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Assignments &amp; Timed Assessments
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign mock sets or worksheets to classrooms, private student groups, or cohorts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setComposerOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#6D28D9] text-white text-xs sm:text-sm font-medium cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 h-24 animate-pulse shadow-[0_6px_24px_-6px_rgba(88,28,135,0.04)]"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl bg-white dark:bg-[#111A2E] py-14 px-6 text-center shadow-[0_8px_28px_-8px_rgba(88,28,135,0.06)] space-y-2.5">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EAE6F5] dark:bg-[#231B3E] text-[#635BFF] dark:text-[#C4B5FD] flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            No Assignments Created Yet
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click New Assignment to schedule a timed test or practice worksheet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((a, idx) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: Math.min(idx * 0.03, 0.24), ease: 'easeOut' }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111A2E] shadow-[0_6px_24px_-8px_rgba(88,28,135,0.06)] dark:shadow-[0_10px_28px_-8px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(99,91,255,0.14)] transition-all duration-200"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAE6F5] dark:bg-[#231B3E] text-[#564AE6] dark:text-[#C4B5FD] uppercase">
                    {a.submission_type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 dark:bg-[#162032] text-slate-700 dark:text-slate-200 capitalize">
                    {a.status}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/12 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    {a.submission_count ?? 0} submissions
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{a.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex flex-wrap items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-lg bg-stone-100/80 dark:bg-[#162032]">{a.max_marks} marks</span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-stone-100/80 dark:bg-[#162032]">{a.time_limit_minutes} min</span>
                  {a.due_at && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-stone-100/80 dark:bg-[#162032]">
                      <Clock className="w-3 h-3" />
                      Due {new Date(a.due_at).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => deleteAssignment(a.id)}
                className="p-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 self-end sm:self-center transition-colors cursor-pointer"
                title="Delete assignment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {composerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#111A2E] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Create Assignment
              </h3>
              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                className="p-1.5 rounded-xl bg-stone-100 dark:bg-[#162032]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Assignment Title"
              className="w-full rounded-xl bg-stone-100 dark:bg-[#162032] px-3.5 py-2.5 text-xs focus:outline-none"
            />
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Instructions for students"
              className="w-full rounded-xl bg-stone-100 dark:bg-[#162032] p-3 text-xs focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value || 100))}
                placeholder="Max Marks"
                className="rounded-xl bg-stone-100 dark:bg-[#162032] px-3 py-2 text-xs focus:outline-none"
              />
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value || 60))}
                placeholder="Duration (min)"
                className="rounded-xl bg-stone-100 dark:bg-[#162032] px-3 py-2 text-xs focus:outline-none"
              />
              <input
                type="date"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                className="rounded-xl bg-stone-100 dark:bg-[#162032] px-3 py-2 text-xs focus:outline-none"
              />
              <SmoothSelect
                value={submissionType}
                onChange={(v) =>
                  setSubmissionType(v as 'mcq' | 'pdf' | 'descriptive' | 'mixed')
                }
                ariaLabel="Submission Format"
                size="sm"
                options={[
                  { value: 'mixed', label: 'Mixed Format' },
                  { value: 'mcq', label: 'Objective MCQ' },
                  { value: 'pdf', label: 'PDF Upload' },
                  { value: 'descriptive', label: 'Descriptive' },
                ]}
              />
            </div>

            {classrooms.length > 0 && (
              <SmoothSelect
                value={classroomId}
                onChange={setClassroomId}
                ariaLabel="Target Classroom"
                size="sm"
                className="w-full"
                options={[
                  { value: '', label: 'Optional: Target Classroom' },
                  ...classrooms.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
            )}

            {groups.length > 0 && (
              <SmoothSelect
                value={groupId}
                onChange={setGroupId}
                ariaLabel="Target Private Group"
                size="sm"
                className="w-full"
                options={[
                  { value: '', label: 'Optional: Target Private Group' },
                  ...groups.map((g) => ({ value: g.id, label: g.name })),
                ]}
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                className="px-4 py-2 rounded-2xl bg-stone-100 dark:bg-[#162032] text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving || !title.trim()}
                onClick={createAssignment}
                className="px-5 py-2 rounded-2xl bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer"
              >
                {saving ? 'Publishing...' : 'Publish Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
