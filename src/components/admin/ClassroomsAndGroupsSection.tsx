'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Users,
  Plus,
  Copy,
  Check,
  UserPlus,
  Trash2,
  Megaphone,
  RefreshCw,
  ShieldOff,
  Sparkles,
  KeyRound,
  Lock,
  BookOpen,
} from 'lucide-react';
import { SmoothSelect } from '@/components/ui/SmoothSelect';
import type { ClassroomItem, StudentGroupItem } from '@/types/admin';

interface ClassroomsAndGroupsSectionProps {
  classrooms: ClassroomItem[];
  groups: StudentGroupItem[];
  onRefresh: () => Promise<void>;
}

const EXAM_CATEGORIES = ['ENGINEERING', 'MEDICAL', 'UPSC', 'UNIVERSITY', 'COMPETITIVE'];

export function ClassroomsAndGroupsSection({
  classrooms,
  groups,
  onRefresh,
}: ClassroomsAndGroupsSectionProps) {
  const [tab, setTab] = useState<'classrooms' | 'groups'>('classrooms');

  const [clsName, setClsName] = useState('');
  const [clsSubject, setClsSubject] = useState('');
  const [clsExam, setClsExam] = useState('ENGINEERING');
  const [clsDesc, setClsDesc] = useState('');
  const [creatingCls, setCreatingCls] = useState(false);

  const [activeClsId, setActiveClsId] = useState<string>('');
  const [inviteIdentifier, setInviteIdentifier] = useState('');
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [grpName, setGrpName] = useState('');
  const [grpDesc, setGrpDesc] = useState('');
  const [grpClassroomId, setGrpClassroomId] = useState('');
  const [grpMemberIdent, setGrpMemberIdent] = useState('');
  const [activeGrpId, setActiveGrpId] = useState<string>('');
  const [creatingGrp, setCreatingGrp] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const selectedClassroom =
    classrooms.find((c) => c.id === activeClsId) || classrooms[0] || null;
  const selectedGroup = groups.find((g) => g.id === activeGrpId) || groups[0] || null;

  async function handleCreateClassroom() {
    if (!clsName.trim()) return;
    setCreatingCls(true);
    try {
      const res = await fetch('/api/admin/classrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_classroom',
          name: clsName,
          subject: clsSubject,
          exam_category: clsExam,
          description: clsDesc,
        }),
      });
      if (res.ok) {
        setClsName('');
        setClsSubject('');
        setClsDesc('');
        setFeedback('Classroom created with a 7-day invite code.');
        await onRefresh();
      }
    } finally {
      setCreatingCls(false);
    }
  }

  async function classroomAction(payload: Record<string, unknown>, msg: string) {
    const res = await fetch('/api/admin/classrooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setFeedback(data.error || 'Operation failed.');
      return;
    }
    setFeedback(msg);
    await onRefresh();
  }

  async function handleCreateGroup() {
    if (!grpName.trim()) return;
    setCreatingGrp(true);
    try {
      const res = await fetch('/api/admin/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_group',
          name: grpName,
          description: grpDesc,
          classroomId: grpClassroomId || null,
        }),
      });
      if (res.ok) {
        setGrpName('');
        setGrpDesc('');
        setFeedback('Private student group created.');
        await onRefresh();
      }
    } finally {
      setCreatingGrp(false);
    }
  }

  async function handleGroupAction(payload: Record<string, unknown>, msg: string) {
    const res = await fetch('/api/admin/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setFeedback(data.error || 'Group update failed.');
      return;
    }
    setFeedback(msg);
    await onRefresh();
  }

  return (
    <div className="space-y-5">
      {/* Top Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-2xl bg-white dark:bg-[#111A2E] p-1.5 shadow-[0_8px_24px_-6px_rgba(88,28,135,0.06)] dark:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.45)]">
          <button
            type="button"
            onClick={() => setTab('classrooms')}
            className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              tab === 'classrooms'
                ? 'text-white'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab === 'classrooms' && (
              <motion.div
                layoutId="classrooms-tab-pill"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#564AE6] dark:from-[#5B21B6] dark:to-[#4C1D95] shadow-md"
              />
            )}
            <GraduationCap className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Classrooms ({classrooms.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('groups')}
            className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              tab === 'groups'
                ? 'text-white'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab === 'groups' && (
              <motion.div
                layoutId="classrooms-tab-pill"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#564AE6] dark:from-[#5B21B6] dark:to-[#4C1D95] shadow-md"
              />
            )}
            <Users className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Private Student Groups ({groups.length})</span>
          </button>
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="px-4 py-1.5 rounded-full bg-[#EAE6F5] dark:bg-[#231B3E] text-xs font-semibold text-[#564AE6] dark:text-[#DDD6FE]"
            >
              {feedback}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'classrooms' ? (
          <motion.div
            key="classrooms-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
          >
            {/* Left Column: Composer + Classroom Cards */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 sm:p-6 shadow-[0_8px_30px_-8px_rgba(88,28,135,0.07)] dark:shadow-[0_14px_34px_-8px_rgba(0,0,0,0.5)] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#564AE6] text-white flex items-center justify-center shrink-0 shadow-[0_8px_18px_-4px_rgba(99,91,255,0.45)]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Create Teacher Classroom
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Generates an instant revocable CLS invite code
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                      Classroom / Batch Title
                    </label>
                    <input
                      type="text"
                      value={clsName}
                      onChange={(e) => setClsName(e.target.value)}
                      placeholder="e.g. JEE Advanced Morning Physics"
                      className="w-full rounded-2xl bg-stone-100/90 dark:bg-[#162032] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#19263F] outline-none focus:outline-none focus:shadow-[0_6px_20px_-4px_rgba(99,91,255,0.22)] transition-all transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                      Subject Focus
                    </label>
                    <input
                      type="text"
                      value={clsSubject}
                      onChange={(e) => setClsSubject(e.target.value)}
                      placeholder="e.g. Physics, Organic Chemistry, Polity"
                      className="w-full rounded-2xl bg-stone-100/90 dark:bg-[#162032] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#19263F] outline-none focus:outline-none focus:shadow-[0_6px_20px_-4px_rgba(99,91,255,0.22)] transition-all transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                      Exam Track
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {EXAM_CATEGORIES.map((cat) => {
                        const chosen = clsExam === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setClsExam(cat)}
                            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
                              chosen
                                ? 'bg-[#635BFF] text-white shadow-sm dark:bg-[#6D28D9]'
                                : 'bg-stone-100 dark:bg-[#162032] text-slate-600 dark:text-slate-300 hover:bg-[#EAE6F5] dark:hover:bg-[#1E2A45]'
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                      Cohort Description
                    </label>
                    <textarea
                      rows={2}
                      value={clsDesc}
                      onChange={(e) => setClsDesc(e.target.value)}
                      placeholder="Syllabus milestones, test schedule, or expectations..."
                      className="w-full rounded-2xl bg-stone-100/90 dark:bg-[#162032] p-3.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#19263F] outline-none focus:outline-none focus:shadow-[0_6px_20px_-4px_rgba(99,91,255,0.22)] transition-all transition-shadow resize-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!clsName.trim() || creatingCls}
                  onClick={handleCreateClassroom}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-[#6C63FF] via-[#635BFF] to-[#564AE6] hover:brightness-105 disabled:opacity-50 text-white text-xs font-semibold shadow-[0_10px_24px_-6px_rgba(99,91,255,0.48)] transition-all hover:-translate-y-0.5 cursor-pointer disabled:hover:translate-y-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{creatingCls ? 'Creating Classroom...' : 'Create Classroom'}</span>
                </button>
              </div>

              {/* Existing Classroom Selector List */}
              {classrooms.length > 0 && (
                <div className="space-y-2.5">
                  {classrooms.map((c, idx) => {
                    const active = selectedClassroom?.id === c.id;
                    return (
                      <motion.button
                        key={c.id}
                        type="button"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.2) }}
                        onClick={() => setActiveClsId(c.id)}
                        className={`w-full text-left rounded-3xl p-4 transition-all duration-200 cursor-pointer ${
                          active
                            ? 'bg-gradient-to-r from-[#6C63FF]/14 to-[#564AE6]/10 dark:from-[#5B21B6]/35 dark:to-[#3B2A82]/35 shadow-[0_10px_28px_-6px_rgba(99,91,255,0.2)]'
                            : 'bg-white dark:bg-[#111A2E] hover:-translate-y-0.5 shadow-[0_6px_22px_-8px_rgba(88,28,135,0.06)]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={`text-sm font-semibold truncate ${
                              active
                                ? 'text-[#564AE6] dark:text-white'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {c.name}
                          </p>
                          <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-[#162032] text-slate-700 dark:text-slate-200 shrink-0">
                            {c.member_count ?? 0} students
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="px-2 py-0.5 rounded-lg bg-stone-100/90 dark:bg-[#162032]">
                            {c.subject || 'General'}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-[#EAE6F5]/80 dark:bg-[#231B3E] text-[#564AE6] dark:text-[#C4B5FD] font-semibold">
                            {c.exam_category || 'GENERAL'}
                          </span>
                          {c.active_invite_code && (
                            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                              {c.active_invite_code}
                            </span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Active Classroom Studio or Atmospheric Empty Guide */}
            <div className="lg:col-span-7">
              {!selectedClassroom ? (
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#111A2E] p-8 sm:p-10 shadow-[0_8px_30px_-8px_rgba(88,28,135,0.07)] dark:shadow-[0_14px_34px_-8px_rgba(0,0,0,0.5)] text-center space-y-6">
                  <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#6C63FF]/10 dark:bg-[#6D28D9]/15 blur-3xl" />

                  <div className="relative z-10 w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-[#6C63FF] to-[#564AE6] text-white flex items-center justify-center shadow-[0_12px_28px_-6px_rgba(99,91,255,0.45)]">
                    <Sparkles className="w-7 h-7" />
                  </div>

                  <div className="relative z-10 space-y-2 max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Your Classroom Workspace
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      Create your first classroom on the left to manage enrolled learners, rotate join codes, and publish instant cohort updates.
                    </p>
                  </div>

                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
                    <div className="rounded-2xl bg-stone-50 dark:bg-[#162032] p-4 space-y-1.5">
                      <KeyRound className="w-4 h-4 text-[#635BFF] dark:text-[#A78BFA]" />
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        Invite Codes
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Share 7-day revocable CLS join links safely
                      </p>
                    </div>
                    <div className="rounded-2xl bg-stone-50 dark:bg-[#162032] p-4 space-y-1.5">
                      <UserPlus className="w-4 h-4 text-emerald-500" />
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        SY-ID Roster
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Enroll directly by @handle or SY-XXXXXXXX
                      </p>
                    </div>
                    <div className="rounded-2xl bg-stone-50 dark:bg-[#162032] p-4 space-y-1.5">
                      <Megaphone className="w-4 h-4 text-amber-500" />
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        Broadcasts
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Push exam alerts to every student in batch
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 sm:p-6 shadow-[0_8px_30px_-8px_rgba(88,28,135,0.07)] dark:shadow-[0_14px_34px_-8px_rgba(0,0,0,0.5)] space-y-6">
                  {/* Active Classroom Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAE6F5] dark:bg-[#231B3E] text-[#564AE6] dark:text-[#C4B5FD]">
                          {selectedClassroom.exam_category || 'GENERAL'}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 dark:bg-[#162032] text-slate-700 dark:text-slate-200">
                          <BookOpen className="w-3 h-3" />
                          {selectedClassroom.subject || 'All Subjects'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {selectedClassroom.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {selectedClassroom.description || 'Active SamayYudh teaching cohort'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        await fetch('/api/admin/classrooms', {
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id: selectedClassroom.id }),
                        });
                        await onRefresh();
                      }}
                      className="p-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 transition-colors cursor-pointer"
                      title="Delete classroom"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Invite Codes Section */}
                  <div className="rounded-2xl bg-stone-50/90 dark:bg-[#162032] p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 inline-flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-[#635BFF] dark:text-[#A78BFA]" />
                        Classroom Invite Codes
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          classroomAction(
                            {
                              action: 'create_invite',
                              classroomId: selectedClassroom.id,
                              expiresInHours: 168,
                            },
                            'Generated fresh 7-day classroom invite code.'
                          )
                        }
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white dark:bg-[#111A2E] text-xs font-semibold text-[#564AE6] dark:text-[#C4B5FD] shadow-xs cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Rotate Code</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(selectedClassroom.invitations || []).slice(0, 3).map((inv) => (
                        <div
                          key={inv.id}
                          className="flex items-center justify-between gap-2 rounded-2xl bg-white dark:bg-[#111A2E] px-3.5 py-2.5 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-slate-900 dark:text-white tracking-wide">
                              {inv.invite_code}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                inv.status === 'revoked'
                                  ? 'bg-rose-500/12 text-rose-600 dark:text-rose-300'
                                  : 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
                              }`}
                            >
                              {inv.status === 'revoked' ? 'Revoked' : `${inv.uses_count} joined`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(inv.invite_code);
                                setCopiedCode(inv.invite_code);
                                setTimeout(() => setCopiedCode(null), 1500);
                              }}
                              className="p-1.5 rounded-xl bg-stone-100 dark:bg-[#162032] hover:bg-[#EAE6F5] dark:hover:bg-[#231B3E] transition-colors cursor-pointer"
                            >
                              {copiedCode === inv.invite_code ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                              )}
                            </button>
                            {inv.status === 'active' && (
                              <button
                                type="button"
                                onClick={() =>
                                  classroomAction(
                                    {
                                      action: 'revoke_invite',
                                      classroomId: selectedClassroom.id,
                                      inviteId: inv.id,
                                    },
                                    'Invite code revoked.'
                                  )
                                }
                                className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer"
                                title="Revoke invite code"
                              >
                                <ShieldOff className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Direct Roster Enrollment */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Enroll Student by @username or SY-ID
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={inviteIdentifier}
                        onChange={(e) => setInviteIdentifier(e.target.value)}
                        placeholder="Enter @username or SY-XXXXXXXX"
                        className="flex-1 rounded-2xl bg-stone-100 dark:bg-[#162032] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#19263F] outline-none focus:outline-none focus:shadow-[0_6px_20px_-4px_rgba(99,91,255,0.22)] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          classroomAction(
                            {
                              action: 'add_member',
                              classroomId: selectedClassroom.id,
                              identifier: inviteIdentifier,
                            },
                            'Student added to classroom roster.'
                          );
                          setInviteIdentifier('');
                        }}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#635BFF] hover:bg-[#564AE6] text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Enroll</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {(selectedClassroom.members || []).length === 0 ? (
                        <p className="text-xs text-slate-400 py-2">No students enrolled yet.</p>
                      ) : (
                        selectedClassroom.members?.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-[#162032] text-xs"
                          >
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {m.profile?.display_name || 'Student'}
                              </span>
                              <span className="ml-2 font-mono text-[11px] text-slate-500">
                                {m.profile?.public_id || ''}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                classroomAction(
                                  {
                                    action: 'remove_member',
                                    classroomId: selectedClassroom.id,
                                    userId: m.user_id,
                                  },
                                  'Removed member from classroom.'
                                )
                              }
                              className="px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-300 font-semibold cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Announcements */}
                  <div className="rounded-2xl bg-stone-50/90 dark:bg-[#162032] p-4 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100">
                      <Megaphone className="w-4 h-4 text-[#635BFF] dark:text-[#A78BFA]" />
                      <span>Post Classroom Announcement</span>
                    </div>
                    <input
                      type="text"
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      placeholder="Announcement title"
                      className="w-full rounded-2xl bg-white dark:bg-[#111A2E] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={annMessage}
                        onChange={(e) => setAnnMessage(e.target.value)}
                        placeholder="Write update for enrolled students..."
                        className="flex-1 rounded-2xl bg-white dark:bg-[#111A2E] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          classroomAction(
                            {
                              action: 'post_announcement',
                              classroomId: selectedClassroom.id,
                              title: annTitle,
                              message: annMessage,
                            },
                            'Announcement posted to classroom.'
                          );
                          setAnnTitle('');
                          setAnnMessage('');
                        }}
                        className="px-4 py-2.5 rounded-2xl bg-[#635BFF] hover:bg-[#564AE6] text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="groups-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
          >
            {/* Left Column: Private Group Composer */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 sm:p-6 shadow-[0_8px_30px_-8px_rgba(88,28,135,0.07)] dark:shadow-[0_14px_34px_-8px_rgba(0,0,0,0.5)] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#564AE6] text-white flex items-center justify-center shrink-0 shadow-[0_8px_18px_-4px_rgba(99,91,255,0.45)]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Create Private Student Group
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Restrict tests &amp; PDFs to selected cohorts
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                      Group Name
                    </label>
                    <input
                      type="text"
                      value={grpName}
                      onChange={(e) => setGrpName(e.target.value)}
                      placeholder="e.g. Rankers Batch A"
                      className="w-full rounded-2xl bg-stone-100/90 dark:bg-[#162032] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#19263F] outline-none focus:outline-none focus:shadow-[0_6px_20px_-4px_rgba(99,91,255,0.22)] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                      Parent Classroom (Optional)
                    </label>
                    <SmoothSelect
                      value={grpClassroomId}
                      onChange={setGrpClassroomId}
                      ariaLabel="Parent Classroom"
                      className="w-full"
                      options={[
                        { value: '', label: 'Standalone Private Group' },
                        ...classrooms.map((c) => ({
                          value: c.id,
                          label: `Subgroup inside ${c.name}`,
                        })),
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                      Purpose / Target Notes
                    </label>
                    <input
                      type="text"
                      value={grpDesc}
                      onChange={(e) => setGrpDesc(e.target.value)}
                      placeholder="Confidential test prep cohort notes"
                      className="w-full rounded-2xl bg-stone-100/90 dark:bg-[#162032] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#19263F] outline-none focus:outline-none focus:shadow-[0_6px_20px_-4px_rgba(99,91,255,0.22)] transition-all"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!grpName.trim() || creatingGrp}
                  onClick={handleCreateGroup}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-[#6C63FF] via-[#635BFF] to-[#564AE6] hover:brightness-105 disabled:opacity-50 text-white text-xs font-semibold shadow-[0_10px_24px_-6px_rgba(99,91,255,0.48)] transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{creatingGrp ? 'Creating Group...' : 'Create Private Group'}</span>
                </button>
              </div>

              {groups.length > 0 && (
                <div className="space-y-2.5">
                  {groups.map((g) => {
                    const active = selectedGroup?.id === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setActiveGrpId(g.id)}
                        className={`w-full text-left rounded-3xl p-4 cursor-pointer transition-all duration-200 ${
                          active
                            ? 'bg-gradient-to-r from-[#6C63FF]/14 to-[#564AE6]/10 dark:from-[#5B21B6]/35 dark:to-[#3B2A82]/35 shadow-[0_10px_28px_-6px_rgba(99,91,255,0.2)]'
                            : 'bg-white dark:bg-[#111A2E] hover:-translate-y-0.5 shadow-[0_6px_22px_-8px_rgba(88,28,135,0.06)]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {g.name}
                          </p>
                          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-[#162032] text-slate-700 dark:text-slate-200">
                            {g.member_ids.length} members
                          </span>
                        </div>
                        {g.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                            {g.description}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Private Group Roster Studio */}
            <div className="lg:col-span-7">
              {!selectedGroup ? (
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#111A2E] p-8 sm:p-10 shadow-[0_8px_30px_-8px_rgba(88,28,135,0.07)] dark:shadow-[0_14px_34px_-8px_rgba(0,0,0,0.5)] text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-[#6C63FF] to-[#564AE6] text-white flex items-center justify-center shadow-[0_12px_28px_-6px_rgba(99,91,255,0.45)]">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5 max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Confidential Study Cohorts
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      Create a private student group to target selective assignments, Olympiad drills, and confidential PDF packs to specific learners.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 sm:p-6 shadow-[0_8px_30px_-8px_rgba(88,28,135,0.07)] dark:shadow-[0_14px_34px_-8px_rgba(0,0,0,0.5)] space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {selectedGroup.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {selectedGroup.description || 'Private cohort'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        await fetch('/api/admin/groups', {
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id: selectedGroup.id }),
                        });
                        await onRefresh();
                      }}
                      className="p-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={grpMemberIdent}
                      onChange={(e) => setGrpMemberIdent(e.target.value)}
                      placeholder="Add student by @username or SY-XXXXXXXX"
                      className="flex-1 rounded-2xl bg-stone-100 dark:bg-[#162032] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#19263F] outline-none focus:outline-none focus:shadow-[0_6px_20px_-4px_rgba(99,91,255,0.22)] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleGroupAction(
                          {
                            action: 'add_member',
                            groupId: selectedGroup.id,
                            identifier: grpMemberIdent,
                          },
                          'Added student to private group.'
                        );
                        setGrpMemberIdent('');
                      }}
                      className="px-4 py-2.5 rounded-2xl bg-[#635BFF] hover:bg-[#564AE6] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Add Member
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(selectedGroup.members || []).map((m) => (
                      <div
                        key={m.user_id}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-[#162032] text-xs"
                      >
                        <span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {m.display_name}
                          </span>{' '}
                          <span className="font-mono text-slate-500 dark:text-slate-400">
                            ({m.public_id})
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleGroupAction(
                              {
                                action: 'remove_member',
                                groupId: selectedGroup.id,
                                userId: m.user_id,
                              },
                              'Removed student from group.'
                            )
                          }
                          className="px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-300 font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
