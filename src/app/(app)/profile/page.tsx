'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, BookOpen, BarChart3, History as HistoryIcon, Trophy,
  StickyNote, Settings, Trash2, Loader2, Shield, Calendar,
  Zap, Clock, Target, Award, Star, ChevronRight, Edit3,
  CheckCircle2, Lock, Flame, LogIn, LogOut, KeyRound, Sparkles
} from 'lucide-react';
import { cn, formatDuration } from '@/lib/utils';
import * as localDB from '@/lib/store/local-db';
import { useAuth } from '@/components/providers/AuthProvider';
import { AVATARS, getSelectedAvatar, setSelectedAvatarId, clearSelectedAvatar, type AvatarDef } from '@/lib/avatars';

type SidebarTab = 'profile' | 'sessions' | 'achievements' | 'analytics' | 'settings';

interface ProfileStats {
  totalSessions: number;
  totalQuestions: number;
  totalAnswered: number;
  totalTimeSeconds: number;
  avgScore: number;
  bestScore: number;
  streakDays: number;
  memberSince: string | null;
  subjectsCovered: number;
  notesTaken: number;
  recentSessions: RecentSession[];
}

interface RecentSession {
  id: string;
  title: string;
  mode: string;
  status: string;
  startedAt: string;
  answered: number;
  total: number;
  scorePct: number;
  hasEval: boolean;
}

const SESSION_MODE_ICON: Record<string, string> = {
  quick_battle: '⚡',
  practice_battle: '📝',
  half_century: '🏏',
  full_century: '🏆',
  speed_battle: '🏎️',
};

const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
  evaluated: { label: 'Evaluated', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  submitted: { label: 'Submitted', cls: 'text-blue-700 bg-blue-50 border-blue-200' },
  completed: { label: 'Completed', cls: 'text-brand-700 bg-brand-50 border-brand-200' },
  in_progress: { label: 'In Progress', cls: 'text-amber-700 bg-amber-50 border-amber-200' },
  paused: { label: 'Paused', cls: 'text-stone-600 bg-stone-50 border-stone-200' },
};

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function ProfilePage() {
  const { user, revokeAllSessions } = useAuth();
  const [tab, setTab] = useState<SidebarTab>('profile');
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [revokeMessage, setRevokeMessage] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarDef | null>(null);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [justSelected, setJustSelected] = useState<string | null>(null);

  const displayName: string =
    user?.user_metadata?.display_name ||
    user?.email?.split('@')[0] ||
    'Student';

  const initials = getInitials(displayName);
  const memberEmail = user?.email || null;
  const joinedAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  useEffect(() => {
    setNameInput(displayName);
  }, [displayName]);

  // Load persisted avatar on mount
  useEffect(() => {
    setSelectedAvatar(getSelectedAvatar());
  }, []);

  const handleAvatarSelect = useCallback((avatar: AvatarDef) => {
    setSelectedAvatarId(avatar.id);
    setSelectedAvatar(avatar);
    setJustSelected(avatar.id);
    setTimeout(() => setJustSelected(null), 600);
  }, []);

  const handleAvatarClear = useCallback(() => {
    clearSelectedAvatar();
    setSelectedAvatar(null);
  }, []);

  useEffect(() => {
    setTimeout(() => loadStats(), 0);
  }, []);

  async function loadStats() {
    setLoading(true);
    const sessions = await localDB.getAllSessions();
    const answers = await localDB.getAllAnswers();
    const evaluations = await localDB.getAllEvaluations();
    const notes = await localDB.getAllStickyNotes();

    const totalSessions = sessions.length;
    const totalQuestions = sessions.reduce((s, sess) => s + sess.total_questions, 0);
    const totalAnswered = answers.filter(a => a.answer_text.trim()).length;
    const totalTimeSeconds = answers.reduce((s, a) => s + a.time_spent_seconds, 0);

    const totalScore = evaluations.reduce((s, e) => s + e.score, 0);
    const totalMaxScore = evaluations.reduce((s, e) => s + e.max_score, 0);
    const avgScore = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

    const answerSessionMap = new Map(answers.map(a => [a.id, a.session_id]));
    const sessionScores = new Map<string, { score: number; max: number }>();
    evaluations.forEach(e => {
      const sid = answerSessionMap.get(e.answer_id);
      if (sid) {
        const entry = sessionScores.get(sid) || { score: 0, max: 0 };
        entry.score += e.score; entry.max += e.max_score;
        sessionScores.set(sid, entry);
      }
    });
    let bestScore = 0;
    sessionScores.forEach(({ score, max }) => {
      if (max > 0) bestScore = Math.max(bestScore, Math.round((score / max) * 100));
    });

    const uniqueDays = new Set(answers.map(a => new Date(a.last_saved_at).toDateString()));
    const streakDays = uniqueDays.size;

    const memberSince = sessions.length > 0
      ? sessions.sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime())[0].started_at
      : null;

    const { questionBank } = await import('@/lib/questions');
    const customQs = await localDB.getAllCustomQuestions();
    const allQuestions = [...questionBank, ...customQs];
    const qMap = new Map(allQuestions.map(q => [q.id, q]));
    const subjects = new Set<string>();
    answers.forEach(a => { const q = qMap.get(a.question_id); if (q) subjects.add(q.subject); });

    // Build recent sessions
    const answersBySession = new Map<string, typeof answers>();
    answers.forEach(a => {
      const list = answersBySession.get(a.session_id) || [];
      list.push(a); answersBySession.set(a.session_id, list);
    });
    const evalByAnswer = new Map(evaluations.map(e => [e.answer_id, e]));

    const recentSessions: RecentSession[] = sessions
      .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
      .slice(0, 8)
      .map(session => {
        const ans = answersBySession.get(session.id) || [];
        const evals = ans.map(a => evalByAnswer.get(a.id)).filter(Boolean) as typeof evaluations;
        const answered = ans.filter(a => a.answer_text.trim()).length;
        const s = evals.reduce((sum, e) => sum + e.score, 0);
        const m = evals.reduce((sum, e) => sum + e.max_score, 0);
        return {
          id: session.id,
          title: session.title,
          mode: session.mode,
          status: session.status,
          startedAt: session.started_at,
          answered,
          total: session.total_questions,
          scorePct: m > 0 ? Math.round((s / m) * 100) : 0,
          hasEval: evals.length > 0,
        };
      });

    setStats({
      totalSessions, totalQuestions, totalAnswered, totalTimeSeconds,
      avgScore, bestScore, streakDays, memberSince,
      subjectsCovered: subjects.size,
      notesTaken: notes.filter(n => n.content.trim()).length,
      recentSessions,
    });
    setLoading(false);
  }

  async function clearAllData() {
    if (typeof window !== 'undefined') {
      const dbs = await window.indexedDB.databases();
      for (const db of dbs) { if (db.name) window.indexedDB.deleteDatabase(db.name); }
    }
    setShowClearConfirm(false);
    setStats(null);
    window.location.reload();
  }

  const achievements = stats ? [
    { emoji: '⚡', title: 'First Battle', desc: 'Completed your first exam', unlocked: stats.totalSessions >= 1, progress: stats.totalSessions < 1 ? `0/1` : undefined },
    { emoji: '🔥', title: 'On Fire', desc: 'Complete 5 exams', unlocked: stats.totalSessions >= 5, progress: stats.totalSessions < 5 ? `${stats.totalSessions}/5` : undefined },
    { emoji: '🏏', title: 'Half Century', desc: 'Answer 50 questions', unlocked: stats.totalAnswered >= 50, progress: stats.totalAnswered < 50 ? `${stats.totalAnswered}/50` : undefined },
    { emoji: '🏆', title: 'Century', desc: 'Answer 100 questions', unlocked: stats.totalAnswered >= 100, progress: stats.totalAnswered < 100 ? `${stats.totalAnswered}/100` : undefined },
    { emoji: '🎯', title: 'Sharpshooter', desc: 'Score 80%+ in a session', unlocked: stats.bestScore >= 80, progress: undefined },
    { emoji: '📚', title: 'Scholar', desc: 'Cover 5+ subjects', unlocked: stats.subjectsCovered >= 5, progress: stats.subjectsCovered < 5 ? `${stats.subjectsCovered}/5` : undefined },
    { emoji: '📝', title: 'Note Taker', desc: 'Write 10 sticky notes', unlocked: stats.notesTaken >= 10, progress: stats.notesTaken < 10 ? `${stats.notesTaken}/10` : undefined },
    { emoji: '⏱️', title: 'Marathon', desc: 'Study for 5+ hours', unlocked: stats.totalTimeSeconds >= 18000, progress: stats.totalTimeSeconds < 18000 ? formatDuration(stats.totalTimeSeconds) + '/5h' : undefined },
  ] : [];

  const navItems: { id: SidebarTab; icon: React.ElementType; label: string; count?: number }[] = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'sessions', icon: HistoryIcon, label: 'My Sessions', count: stats?.totalSessions },
    { id: 'achievements', icon: Trophy, label: 'Achievements' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto" />
          <p className="text-sm text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 md:py-8">
      <div className="flex gap-6">

        {/* ── LEFT SIDEBAR ─────────────────────────────────── */}
        <aside className="hidden md:flex flex-col w-52 shrink-0 gap-1">
          {/* Mini avatar */}
          <div className="flex flex-col items-center gap-2 p-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center text-white text-lg font-extrabold shadow-lg overflow-hidden">
              {selectedAvatar ? (
                <Image src={selectedAvatar.src} alt={selectedAvatar.label} width={56} height={56} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <p className="text-xs font-semibold text-foreground text-center truncate w-full">{displayName}</p>
          </div>

          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                tab === item.id
                  ? 'bg-brand-50 dark:bg-brand-100/10 text-brand-600 font-semibold'
                  : 'text-muted hover:bg-surface hover:text-foreground'
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className={cn(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                  tab === item.id ? 'bg-brand-100 text-brand-700' : 'bg-surface-2 text-muted'
                )}>
                  {item.count}
                </span>
              )}
            </button>
          ))}

          <div className="mt-auto pt-4 border-t border-border">
            <Link href="/auth" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-100/10 transition-all">
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          </div>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Mobile tab bar */}
          <div className="md:hidden flex gap-1 overflow-x-auto pb-3 mb-4 scrollbar-hide">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0',
                  tab === item.id
                    ? 'bg-brand-50 dark:bg-brand-100/10 text-brand-600'
                    : 'bg-surface text-muted hover:text-foreground'
                )}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* ── PROFILE TAB ─────────────── */}
            {tab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Profile Card */}
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  {/* Hero banner */}
                  <div className="relative h-32 bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute bottom-0 -left-4 w-24 h-24 rounded-full bg-white/5 blur-xl" />
                  </div>

                  <div className="px-6 pb-6">
                    {/* Avatar overlapping banner */}
                    <div className="relative -mt-10 mb-4 flex items-end justify-between">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-brand border-4 border-card shadow-xl flex items-center justify-center text-white text-2xl font-extrabold overflow-hidden">
                        {selectedAvatar ? (
                          <Image src={selectedAvatar.src} alt={selectedAvatar.label} width={80} height={80} className="w-full h-full object-cover" />
                        ) : (
                          initials
                        )}
                      </div>
                      <button
                        onClick={() => setEditingName(!editingName)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-border hover:bg-surface transition-all text-muted hover:text-foreground"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Profile
                      </button>
                    </div>

                    {/* Name + edit */}
                    {editingName ? (
                      <div className="flex gap-2 mb-3">
                        <input
                          value={nameInput}
                          onChange={e => setNameInput(e.target.value)}
                          placeholder="Your name"
                          className="flex-1 px-3 py-2 rounded-xl border border-border bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"
                          autoFocus
                        />
                        <button
                          onClick={() => setEditingName(false)}
                          className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <h2 className="text-xl font-bold text-foreground mb-0.5">{displayName}</h2>
                    )}

                    {/* Details grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 mt-3">
                      {[
                        { label: 'Joined', value: joinedAt || (stats?.memberSince ? new Date(stats.memberSince).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not yet') },
                        { label: 'Email', value: memberEmail || 'Local account' },
                        { label: 'Practice Since', value: stats?.memberSince ? new Date(stats.memberSince).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—' },
                        { label: 'Total Study Time', value: stats ? formatDuration(stats.totalTimeSeconds) : '0m' },
                      ].map(row => (
                        <div key={row.label} className="flex items-baseline gap-2">
                          <span className="text-xs text-muted shrink-0 w-28">{row.label}:</span>
                          <span className="text-xs font-medium text-foreground truncate">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Avatar Picker Section ──────────────── */}
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  <button
                    onClick={() => setAvatarPickerOpen(!avatarPickerOpen)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-foreground">Choose Avatar</p>
                        <p className="text-xs text-muted">Pick a character to represent you</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: avatarPickerOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {avatarPickerOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-1">
                          {/* Currently selected indicator */}
                          {selectedAvatar && (
                            <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-brand-50/50 dark:bg-brand-900/10 border border-brand-200/50 dark:border-brand-800/30">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-brand-400 shadow-md">
                                  <Image src={selectedAvatar.src} alt={selectedAvatar.label} width={40} height={40} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-brand-700 dark:text-brand-400">Current: {selectedAvatar.label}</p>
                                  <p className="text-[10px] text-brand-500/70">Your active avatar</p>
                                </div>
                              </div>
                              <button
                                onClick={handleAvatarClear}
                                className="text-[10px] font-medium text-muted hover:text-danger-500 px-2 py-1 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          )}

                          {/* Avatar grid */}
                          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                            {AVATARS.map((avatar, i) => {
                              const isActive = selectedAvatar?.id === avatar.id;
                              const isJustSelected = justSelected === avatar.id;
                              return (
                                <motion.button
                                  key={avatar.id}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                                  whileHover={{ scale: 1.08, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleAvatarSelect(avatar)}
                                  className={cn(
                                    'relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200',
                                    isActive
                                      ? 'bg-brand-50 dark:bg-brand-900/20 ring-2 ring-brand-500 shadow-lg shadow-brand-500/10'
                                      : 'hover:bg-surface-2 ring-1 ring-transparent hover:ring-border'
                                  )}
                                >
                                  {/* Glow on select */}
                                  <AnimatePresence>
                                    {isJustSelected && (
                                      <motion.div
                                        initial={{ scale: 0.5, opacity: 0.8 }}
                                        animate={{ scale: 1.8, opacity: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.6 }}
                                        className="absolute inset-0 rounded-xl bg-brand-400/30 pointer-events-none"
                                      />
                                    )}
                                  </AnimatePresence>

                                  <div className={cn(
                                    'w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all duration-200',
                                    isActive ? 'border-brand-500 shadow-md' : 'border-transparent'
                                  )}>
                                    <Image
                                      src={avatar.src}
                                      alt={avatar.label}
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <span className={cn(
                                    'text-[10px] font-medium truncate w-full text-center transition-colors',
                                    isActive ? 'text-brand-600 dark:text-brand-400' : 'text-muted'
                                  )}>
                                    {avatar.label}
                                  </span>

                                  {/* Checkmark */}
                                  {isActive && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shadow-md"
                                    >
                                      <CheckCircle2 className="w-3 h-3 text-white" />
                                    </motion.div>
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Sessions', value: String(stats?.totalSessions ?? 0), icon: BookOpen, color: 'text-brand-600', bg: 'bg-brand-50 dark:bg-brand-100/10' },
                    { label: 'Questions', value: String(stats?.totalAnswered ?? 0), icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: 'Avg Score', value: stats?.avgScore ? `${stats.avgScore}%` : '—', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    { label: 'Active Days', value: String(stats?.streakDays ?? 0), icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
                  ].map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3"
                    >
                      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', s.bg)}>
                        <s.icon className={cn('w-4 h-4', s.color)} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground leading-tight">{s.value}</p>
                        <p className="text-xs text-muted">{s.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Sign in CTA if not authenticated */}
                {!user && (
                  <Link
                    href="/auth"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-2xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/20"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In to Sync Progress Across Devices
                  </Link>
                )}
              </motion.div>
            )}

            {/* ── SESSIONS TAB ──────────────── */}
            {tab === 'sessions' && (
              <motion.div
                key="sessions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-foreground">My Sessions</h2>
                  <Link href="/history" className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 font-medium">
                    View all <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {!stats || stats.recentSessions.length === 0 ? (
                  <div className="bg-card rounded-2xl border border-border p-12 flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center">
                      <HistoryIcon className="w-7 h-7 text-muted" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">No sessions yet</p>
                    <p className="text-xs text-muted">Complete an exam to see it here</p>
                    <Link href="/practice" className="mt-1 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity">
                      Start Practicing
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {stats.recentSessions.map((s, i) => {
                      const badge = STATUS_STYLE[s.status] || STATUS_STYLE.completed;
                      return (
                        <motion.div
                          key={s.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                        >
                          <Link
                            href={`/results?session=${s.id}`}
                            className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-brand-200 hover:shadow-sm transition-all group"
                          >
                            {/* Mode icon */}
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-100/10 dark:to-accent-100/10 flex items-center justify-center text-xl shrink-0">
                              {SESSION_MODE_ICON[s.mode] ?? '📝'}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-foreground truncate group-hover:text-brand-600 transition-colors">
                                  {s.title}
                                </p>
                                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0', badge.cls)}>
                                  {badge.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(s.startedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Target className="w-3 h-3" />
                                  {s.answered}/{s.total}
                                </span>
                                {s.hasEval && (
                                  <span className={cn('font-semibold', s.scorePct >= 60 ? 'text-emerald-600' : 'text-amber-600')}>
                                    {s.scorePct}%
                                  </span>
                                )}
                              </div>
                              {/* Progress bar */}
                              <div className="mt-2 h-1 rounded-full bg-surface-2 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-brand transition-all"
                                  style={{ width: `${s.total > 0 ? (s.answered / s.total) * 100 : 0}%` }}
                                />
                              </div>
                            </div>

                            <ChevronRight className="w-4 h-4 text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── ACHIEVEMENTS TAB ──────────── */}
            {tab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-base font-bold text-foreground">Achievements</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {achievements.map((a, i) => (
                    <motion.div
                      key={a.title}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-2xl border transition-all',
                        a.unlocked
                          ? 'border-brand-200 bg-brand-50/50 dark:bg-brand-100/5'
                          : 'border-border bg-card opacity-60'
                      )}
                    >
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0',
                        a.unlocked ? 'bg-white dark:bg-surface shadow-sm' : 'bg-surface-2 grayscale'
                      )}>
                        {a.unlocked ? a.emoji : <Lock className="w-5 h-5 text-muted" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={cn('text-sm font-semibold', a.unlocked ? 'text-foreground' : 'text-muted')}>
                            {a.title}
                          </p>
                          {a.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                        </div>
                        <p className="text-xs text-muted mt-0.5 truncate">
                          {a.progress ?? a.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── ANALYTICS TAB ─────────────── */}
            {tab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-base font-bold text-foreground">Analytics</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {stats && [
                    { label: 'Total Sessions', value: String(stats.totalSessions), icon: BookOpen, color: 'text-brand-600', bg: 'bg-brand-50 dark:bg-brand-100/10' },
                    { label: 'Questions Done', value: String(stats.totalAnswered), icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: 'Study Time', value: formatDuration(stats.totalTimeSeconds), icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'Avg Score', value: stats.avgScore > 0 ? `${stats.avgScore}%` : '—', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    { label: 'Best Score', value: stats.bestScore > 0 ? `${stats.bestScore}%` : '—', icon: Trophy, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
                    { label: 'Active Days', value: String(stats.streakDays), icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                    { label: 'Subjects', value: String(stats.subjectsCovered), icon: StickyNote, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/20' },
                    { label: 'Notes', value: String(stats.notesTaken), icon: StickyNote, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                  ].map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-3"
                    >
                      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', s.bg)}>
                        <s.icon className={cn('w-4 h-4', s.color)} />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-foreground">{s.value}</p>
                        <p className="text-xs text-muted mt-0.5">{s.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Link href="/analytics" className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-brand-600 border border-brand-200 bg-brand-50 dark:bg-brand-100/10 hover:opacity-80 transition-opacity">
                  <BarChart3 className="w-4 h-4" />
                  View Full Analytics
                </Link>
              </motion.div>
            )}

            {/* ── SETTINGS TAB ──────────────── */}
            {tab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-base font-bold text-foreground">Settings</h2>

                {/* Storage info */}
                <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted" /> Local Storage
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Sessions', value: String(stats?.totalSessions ?? 0) },
                      { label: 'Questions Answered', value: String(stats?.totalAnswered ?? 0) },
                      { label: 'Notes', value: String(stats?.notesTaken ?? 0) },
                      { label: 'Storage', value: 'Local only' },
                    ].map(row => (
                      <div key={row.label} className="p-3 rounded-xl bg-surface">
                        <p className="text-sm font-bold text-foreground">{row.value}</p>
                        <p className="text-xs text-muted mt-0.5">{row.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick links */}
                <div className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden">
                  {[
                    { href: '/history', icon: HistoryIcon, label: 'Exam History', desc: 'View all past sessions' },
                    { href: '/analytics', icon: BarChart3, label: 'Analytics', desc: 'Performance insights & charts' },
                    { href: '/notes', icon: StickyNote, label: 'Notes', desc: 'Your sticky notes collection' },
                  ].map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface transition-colors group"
                    >
                      <item.icon className="w-4 h-4 text-muted" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>

                {/* Security & Token Revocation */}
                <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-brand-600" /> Account Security & Session Control
                      </h3>
                      <p className="text-xs text-muted mt-1">
                        Prevent unauthorized account access and terminate all sessions across other devices if compromised.
                      </p>
                    </div>
                  </div>

                  {revokeMessage && (
                    <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-600 font-medium">
                      {revokeMessage}
                    </div>
                  )}

                  <div className="space-y-3 pt-1">
                    {showRevokeConfirm ? (
                      <div className="p-3 rounded-xl bg-surface border border-border space-y-3">
                        <p className="text-xs text-muted leading-relaxed">
                          This will immediately invalidate your active JWT authentication tokens, refresh tokens, and log out all active sessions across all devices and browsers.
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setShowRevokeConfirm(false)}
                            className="flex-1 px-3 py-2 rounded-xl text-xs font-medium border border-border bg-card hover:bg-surface transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={isRevoking}
                            onClick={async () => {
                              setIsRevoking(true);
                              setRevokeMessage(null);
                              try {
                                const ok = await revokeAllSessions();
                                if (ok) {
                                  setRevokeMessage('All tokens revoked successfully. Redirecting...');
                                  setTimeout(() => {
                                    window.location.href = '/auth';
                                  }, 1000);
                                } else {
                                  setRevokeMessage('Failed to revoke tokens. Please try again.');
                                }
                              } catch {
                                setRevokeMessage('An error occurred during token revocation.');
                              } finally {
                                setIsRevoking(false);
                                setShowRevokeConfirm(false);
                              }
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors disabled:opacity-50"
                          >
                            {isRevoking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
                            Revoke All Sessions
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowRevokeConfirm(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-foreground border border-border bg-surface hover:bg-surface-2 transition-colors cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5 text-brand-600" />
                        Revoke All Active Tokens & Log Out Everywhere
                      </button>
                    )}
                  </div>
                </div>

                {/* Danger zone */}
                <div className="bg-card rounded-2xl border border-danger-500/20 p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Danger Zone</h3>
                  {showClearConfirm ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted">This will delete all sessions, answers, evaluations, and notes permanently.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowClearConfirm(false)}
                          className="flex-1 px-3 py-2 rounded-xl text-sm font-medium border border-border bg-card hover:bg-surface transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={clearAllData}
                          className="flex-1 px-3 py-2 rounded-xl text-sm font-semibold text-white bg-danger-500 hover:bg-danger-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 inline mr-1" />
                          Delete Everything
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-danger-600 border border-danger-500/30 hover:bg-danger-50 dark:hover:bg-danger-50/5 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All Data
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT PANEL ──────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-4">
          {/* Best score card */}
          <div className="bg-gradient-to-br from-brand-600 to-accent-500 rounded-2xl p-5 text-white">
            <p className="text-white/70 text-xs font-medium mb-1">Best Score</p>
            <p className="text-4xl font-extrabold">{stats?.bestScore ? `${stats.bestScore}%` : '—'}</p>
            <p className="text-white/60 text-xs mt-1">Across {stats?.totalSessions ?? 0} sessions</p>
            <div className="mt-4 h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white/80 transition-all"
                style={{ width: `${stats?.bestScore ?? 0}%` }}
              />
            </div>
          </div>

          {/* Quick achievements */}
          <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Recent Badges
            </h3>
            <div className="space-y-2">
              {achievements.slice(0, 4).map(a => (
                <div
                  key={a.title}
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-xl transition-all',
                    a.unlocked ? 'opacity-100' : 'opacity-40'
                  )}
                >
                  <span className={cn('text-lg', !a.unlocked && 'grayscale')}>{a.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{a.title}</p>
                    <p className="text-[10px] text-muted">{a.progress ?? a.desc}</p>
                  </div>
                  {a.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-auto" />}
                </div>
              ))}
            </div>
            <button
              onClick={() => setTab('achievements')}
              className="w-full text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors"
            >
              View all achievements →
            </button>
          </div>

          {/* Sign-in CTA */}
          <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-100/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Sync Your Progress</p>
              <p className="text-xs text-muted mt-0.5">Sign in to access your data on any device</p>
            </div>
            <ul className="space-y-1">
              {['Access from any device', 'Never lose your history', 'Track long-term progress'].map(t => (
                <li key={t} className="flex items-center gap-2 text-xs text-muted">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href="/auth"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In Free
            </Link>
          </div>
        </aside>

      </div>
    </div>
  );
}
