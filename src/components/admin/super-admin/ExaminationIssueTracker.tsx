'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  User,
  ShieldAlert,
  ChevronDown,
  X,
} from 'lucide-react';
import type { SupervisionIssueItem } from '@/types/admin';

export function ExaminationIssueTracker() {
  const [issues, setIssues] = useState<SupervisionIssueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<SupervisionIssueItem | null>(null);

  // New issue form
  const [examId, setExamId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SupervisionIssueItem['category']>('technical_glitch');
  const [priority, setPriority] = useState<SupervisionIssueItem['priority']>('medium');
  const [creating, setCreating] = useState(false);

  // Update status form
  const [updateStatus, setUpdateStatus] = useState<SupervisionIssueItem['status']>('open');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/issues?status=${statusFilter}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setIssues(data.items || []);
      }
    } catch (err) {
      console.error('[ExaminationIssueTracker] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [statusFilter]);

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examId || !title || !description) return;

    setCreating(true);
    try {
      const res = await fetch('/api/admin/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: examId,
          title,
          description,
          category,
          priority,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setTitle('');
        setDescription('');
        setExamId('');
        fetchIssues();
      }
    } catch (err) {
      console.error('[ExaminationIssueTracker] Create issue error:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;

    setUpdating(true);
    try {
      const res = await fetch('/api/admin/issues', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedIssue.id,
          status: updateStatus,
          resolution_notes: resolutionNotes || undefined,
        }),
      });

      if (res.ok) {
        setSelectedIssue(null);
        setResolutionNotes('');
        fetchIssues();
      }
    } catch (err) {
      console.error('[ExaminationIssueTracker] Update error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const formatIST = (isoString: string) => {
    try {
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  const priorityStyles: Record<string, string> = {
    critical: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    high: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    medium: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
    low: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
  };

  return (
    <div className="space-y-4 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-white dark:bg-[#111A2E] shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Supervision Incident & Issue Management ({issues.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log, track, and resolve proctoring violations, disconnects, and exam disputes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchIssues}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border-0 outline-none"
            title="Refresh issues"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer border-0 outline-none flex items-center gap-1.5 shadow-sm shadow-purple-600/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log New Incident</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(['all', 'open', 'under_review', 'waiting_teacher', 'resolved', 'closed'] as const).map(
          (st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border-0 outline-none capitalize shrink-0 ${
                statusFilter === st
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#111A2E] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          )
        )}
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-600" />
            <span>Loading issues...</span>
          </div>
        ) : issues.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-[#111A2E] text-center text-xs text-slate-400">
            No incidents reported for this filter.
          </div>
        ) : (
          issues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => {
                setSelectedIssue(issue);
                setUpdateStatus(issue.status);
                setResolutionNotes(issue.resolution_notes || '');
              }}
              className="p-5 rounded-3xl bg-white dark:bg-[#111A2E] shadow-xs hover:shadow-md transition-all cursor-pointer border-0 ring-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      priorityStyles[issue.priority] || priorityStyles.medium
                    }`}
                  >
                    {issue.priority}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-[10px] font-bold capitalize">
                    {issue.category.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Logged: {formatIST(issue.created_at)}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {issue.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-2xl">
                  {issue.description}
                </p>
                {issue.resolution_notes && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                    Resolution: {issue.resolution_notes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                    issue.status === 'resolved'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : issue.status === 'open'
                      ? 'bg-rose-500/10 text-rose-600'
                      : 'bg-amber-500/10 text-amber-600'
                  }`}
                >
                  {issue.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Issue Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#111A2E] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                Log New Examination Incident
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 cursor-pointer border-0 outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateIssue} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Examination ID or Code *
                </label>
                <input
                  type="text"
                  value={examId}
                  onChange={(e) => setExamId(e.target.value)}
                  placeholder="Enter custom_exam ID or code..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="technical_glitch">Technical Glitch</option>
                    <option value="proctoring_violation">Proctoring Violation</option>
                    <option value="disconnection">Disconnection</option>
                    <option value="time_dispute">Time Dispute</option>
                    <option value="cheating_flag">Cheating Flag</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Severity / Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Incident Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mass disconnection in Lab 3 during WBJEE Mock"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Description & Observations *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed notes regarding this event..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold transition-all cursor-pointer border-0 outline-none"
              >
                {creating ? 'Logging...' : 'Confirm Incident Log'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Update Issue Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#111A2E] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  Update Incident Status
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedIssue.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 cursor-pointer border-0 outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateIssue} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Lifecycle Status
                </label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none font-bold"
                >
                  <option value="open">Open (Unresolved)</option>
                  <option value="under_review">Under Review</option>
                  <option value="waiting_teacher">Waiting on Teacher Response</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed / Dismissed</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Resolution Notes / Actions Taken
                </label>
                <textarea
                  rows={4}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Explain actions taken to resolve this incident..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold transition-all cursor-pointer border-0 outline-none"
              >
                {updating ? 'Updating...' : 'Save Resolution'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
