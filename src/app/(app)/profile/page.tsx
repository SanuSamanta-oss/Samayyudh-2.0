'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import {
  User,
  History,
  Trophy,
  BarChart3,
  Settings,
  LogOut,
  LogIn,
  CheckCircle2,
  Shield,
  Database,
  Trash2,
  ArrowUpRight,
  Check,
  Sparkles,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import * as localDB from '@/lib/store/local-db';
import { processSync } from '@/lib/store/sync-engine';
import { appUsageTracker, type DailyUsageBucket } from '@/lib/usage/tracker';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { questionBank } from '@/lib/questions';
import { processAnalyticsData, type ProcessedAnalytics } from '@/lib/analytics/data-processor';
import { STANDARD_ACHIEVEMENTS } from '@/lib/achievements/definitions';
import { getAchievementSystemData, getLocalAchievementSnapshot } from '@/lib/achievements/client';
import type { AchievementDefinition, UserAchievement, UserStreak } from '@/types/achievements';
import type { Answer, AnswerEvaluation, ExamSession, Question, StickyNote } from '@/types';
import {
  buildSessionArchiveItems,
  type SessionArchiveMeta,
} from '@/components/history/history-helpers';
import { ProfileSessionsPanel } from '@/components/profile/ProfileSessionsPanel';
import {
  getSelectedAvatar,
  setSelectedAvatarId,
  clearSelectedAvatar,
  type AvatarDef,
} from '@/lib/avatars';
import { ProfileBannerHeader } from '@/components/profile/ProfileBannerHeader';
import { ProfileStatsGrid } from '@/components/profile/ProfileStatsGrid';
import { SubjectTopicDistributionCard } from '@/components/profile/SubjectTopicDistributionCard';
import {
  ProfileRightSidebar,
  type RecentBadgeItem,
} from '@/components/profile/ProfileRightSidebar';

const PerformanceBadge = dynamic(
  () =>
    import('@/components/achievements/PerformanceBadge').then(
      (m) => m.PerformanceBadge
    ),
  { ssr: false }
);

const StreakMedal = dynamic(
  () =>
    import('@/components/achievements/StreakMedal').then((m) => m.StreakMedal),
  { ssr: false }
);

const ProfilePictureModal = dynamic(
  () => import('@/components/ProfilePictureModal').then((m) => m.ProfilePictureModal),
  { ssr: false }
);

const ReminderSettingsPanel = dynamic(
  () =>
    import('@/components/notifications/ReminderSettingsPanel').then(
      (m) => m.ReminderSettingsPanel
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 rounded-3xl bg-white dark:bg-[#111A2E] animate-pulse" />
    ),
  }
);

const ContributionHeatmapCard = dynamic(
  () =>
    import('@/components/profile/ContributionHeatmapCard').then(
      (m) => m.ContributionHeatmapCard
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-56 rounded-3xl bg-white dark:bg-[#111A2E] animate-pulse" />
    ),
  }
);

const StudentIdentityCard = dynamic(
  () =>
    import('@/components/profile/StudentIdentityCard').then(
      (m) => m.StudentIdentityCard
    ),
  { ssr: false }
);

type SidebarTab = 'profile' | 'sessions' | 'achievements' | 'analytics' | 'settings';

interface ProfileStats {
  totalSessions: number;
  completedSessions: number;
  totalQuestionsAnswered: number;
  totalEvaluations: number;
  averageScore: number;
  bestScore: number;
  totalStudySeconds: number;
  activeDays: number;
  totalWordsWritten: number;
}

interface SessionDisplayItem {
  id: string;
  title: string;
  exam_code: string;
  mode: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  answerCount: number;
  scorePercent: number | null;
  timeSpentSeconds: number;
}

const DISPLAY_NAME_STORAGE_KEY = 'samayyudh:display_name';

function subscribeOnline(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getOnlineSnapshot() {
  return navigator.onLine;
}

function getOnlineServerSnapshot() {
  return true;
}

function formatDurationCompact(seconds: number): string {
  if (seconds <= 0) return '0m';
  if (seconds < 60) return `${seconds}s`;
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

export default function ProfilePage() {
  const { user, isAuthenticated, signOut, revokeAllSessions, refreshSession } =
    useAuth();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const [activeTab, setActiveTab] = useState<SidebarTab>('profile');
  const [selectedAvatar, setSelectedAvatarState] = useState<AvatarDef | null>(null);
  const [customDisplayName, setCustomDisplayName] = useState<string>('');
  const [showPictureModal, setShowPictureModal] = useState(false);

  // Raw real user records
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [evaluations, setEvaluations] = useState<AnswerEvaluation[]>([]);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [appUsageBuckets, setAppUsageBuckets] = useState<Record<string, DailyUsageBucket>>({});

  // Achievements state from existing module
  const [achDefinitions, setAchDefinitions] = useState<AchievementDefinition[]>(STANDARD_ACHIEVEMENTS);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [streakData, setStreakData] = useState<UserStreak | null>(null);

  // Aggregated dashboard metrics
  const [stats, setStats] = useState<ProfileStats>({
    totalSessions: 0,
    completedSessions: 0,
    totalQuestionsAnswered: 0,
    totalEvaluations: 0,
    averageScore: 0,
    bestScore: 0,
    totalStudySeconds: 0,
    activeDays: 0,
    totalWordsWritten: 0,
  });
  const [sessionItems, setSessionItems] = useState<SessionDisplayItem[]>([]);
  const [archiveSessionItems, setArchiveSessionItems] = useState<SessionArchiveMeta[]>([]);
  const [practiceSince, setPracticeSince] = useState<string>('Not started');
  const [notesCount, setNotesCount] = useState<number>(0);

  // Sync & online connectivity
  const isOnline = useSyncExternalStore(
    subscribeOnline,
    getOnlineSnapshot,
    getOnlineServerSnapshot
  );
  const [unsyncedCount, setUnsyncedCount] = useState<number>(0);
  const [syncing, setSyncing] = useState<boolean>(false);

  // Security / data actions
  const [revokingTokens, setRevokingTokens] = useState(false);
  const [revokeMessage, setRevokeMessage] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearingData, setClearingData] = useState(false);
  const syncedUserRef = useRef<string | null>(null);

  const loadAvatar = useCallback(() => {
    setSelectedAvatarState(getSelectedAvatar());
  }, []);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      loadAvatar();
      const savedLocalName =
        typeof window !== 'undefined' ? localStorage.getItem(DISPLAY_NAME_STORAGE_KEY) || '' : '';
      if (savedLocalName) setCustomDisplayName(savedLocalName);
    });

    const handleAvatarChange = () => loadAvatar();
    window.addEventListener('samayyudh:avatar-change', handleAvatarChange);
    return () => {
      active = false;
      window.removeEventListener('samayyudh:avatar-change', handleAvatarChange);
    };
  }, [loadAvatar]);

  const authUserId = user?.id ?? null;

  const loadAllProfileData = useCallback(
    async (
      prefetchedSystemData?: Awaited<ReturnType<typeof getAchievementSystemData>> | null
    ) => {
      try {
        appUsageTracker.init();
        const userId = authUserId || 'local-user';

        // Fast-path local IndexedDB read (<20ms) with zero network blocking
        const [
          allSessions,
          allAnswers,
          allEvals,
          allNotes,
          customQs,
          unsynced,
          localSnap,
        ] = await Promise.all([
          localDB.getAllSessions(),
          localDB.getAllAnswers(),
          localDB.getAllEvaluations(),
          localDB.getAllStickyNotes(),
          localDB.getAllCustomQuestions(),
          localDB.getUnsyncedItems(),
          getLocalAchievementSnapshot(userId),
        ]);

        const systemData = prefetchedSystemData ?? null;
        const usageBuckets = appUsageTracker.getAllStoredBuckets();

        setSessions(allSessions);
        setAnswers(allAnswers);
        setEvaluations(allEvals);
        setCustomQuestions(customQs);
        setAppUsageBuckets(usageBuckets);
        setNotesCount(allNotes.length);
        setUnsyncedCount(unsynced.length);

        const resolvedDefs =
          systemData?.definitions && systemData.definitions.length > 0
            ? systemData.definitions
            : localSnap.definitions.length > 0
              ? localSnap.definitions
              : STANDARD_ACHIEVEMENTS;
        const resolvedUserAchs =
          systemData?.userAchievements && systemData.userAchievements.length >= localSnap.userAchievements.length
            ? systemData.userAchievements
            : localSnap.userAchievements;
        const resolvedStreak = systemData?.streak || localSnap.streak || null;

        setAchDefinitions(resolvedDefs);
        setUserAchievements(resolvedUserAchs);
        setStreakData(resolvedStreak);

      const evalMap = new Map(allEvals.map((e) => [e.answer_id, e]));
      const answersBySession = new Map<string, Answer[]>();
      allAnswers.forEach((a) => {
        const list = answersBySession.get(a.session_id) || [];
        list.push(a);
        answersBySession.set(a.session_id, list);
      });

      const sessionScores: number[] = [];
      const builtSessions: SessionDisplayItem[] = allSessions
        .slice()
        .sort(
          (a, b) =>
            new Date(b.started_at || b.created_at).getTime() -
            new Date(a.started_at || a.created_at).getTime()
        )
        .map((s) => {
          const sAnswers = answersBySession.get(s.id) || [];
          const answeredCount = sAnswers.filter(
            (a) => (a.answer_text || a.selected_option || '').trim().length > 0
          ).length;
          const timeSpent = sAnswers.reduce((sum, a) => sum + (a.time_spent_seconds || 0), 0);

          const sEvals = sAnswers
            .map((a) => evalMap.get(a.id))
            .filter(Boolean) as AnswerEvaluation[];
          let scorePct: number | null = null;
          if (sEvals.length > 0) {
            const totalSc = sEvals.reduce((sum, e) => sum + e.score, 0);
            const totalMax = sEvals.reduce((sum, e) => sum + e.max_score, 0);
            if (totalMax > 0) {
              scorePct = Math.round((totalSc / totalMax) * 100);
              sessionScores.push(scorePct);
            }
          }

          return {
            id: s.id,
            title: s.title,
            exam_code: s.exam_code,
            mode: s.mode,
            status: s.status,
            started_at: s.started_at || s.created_at,
            completed_at: s.completed_at,
            answerCount: answeredCount,
            scorePercent: scorePct,
            timeSpentSeconds: timeSpent,
          };
        });

      setSessionItems(builtSessions);
      setArchiveSessionItems(
        buildSessionArchiveItems({
          sessions: allSessions,
          answers: allAnswers,
          evaluations: allEvals,
          questions: [...questionBank, ...customQs],
          notes: allNotes,
        })
      );

      // Unique active dates across answers, sessions, and usage tracker
      const activeDayKeys = new Set<string>();
      allAnswers.forEach((a) => {
        const hasAttempt =
          (a.answer_text || a.selected_option || '').trim().length > 0 ||
          (a.time_spent_seconds || 0) > 0;
        if (!hasAttempt) return;
        const ts = a.last_saved_at || a.started_at;
        if (ts) activeDayKeys.add(new Date(ts).toISOString().slice(0, 10));
      });
      allSessions.forEach((s) => {
        const ts = s.started_at || s.created_at;
        if (ts) activeDayKeys.add(new Date(ts).toISOString().slice(0, 10));
      });
      Object.values(usageBuckets).forEach((b) => {
        if (b?.date && b.totalActiveSeconds > 60) {
          activeDayKeys.add(b.date);
        }
      });

      const answerStudySec = allAnswers.reduce((sum, a) => sum + (a.time_spent_seconds || 0), 0);
      const usageTotalSec = Object.values(usageBuckets).reduce(
        (sum, b) => sum + (b?.totalActiveSeconds || 0),
        0
      );
      const totalStudySec = Math.max(answerStudySec, usageTotalSec);

      const totalWords = allAnswers.reduce((sum, a) => sum + (a.word_count || 0), 0);
      const totalAnswered = allAnswers.filter(
        (a) => (a.answer_text || a.selected_option || '').trim().length > 0
      ).length;
      const completedCount = allSessions.filter(
        (s) => s.status === 'completed' || s.status === 'evaluated' || Boolean(s.completed_at)
      ).length;

      const avgScore =
        sessionScores.length > 0
          ? Math.round(sessionScores.reduce((sum, s) => sum + s, 0) / sessionScores.length)
          : 0;
      const bestScore = sessionScores.length > 0 ? Math.max(...sessionScores) : 0;

      setStats({
        totalSessions: allSessions.length,
        completedSessions: completedCount,
        totalQuestionsAnswered: totalAnswered,
        totalEvaluations: allEvals.length,
        averageScore: avgScore,
        bestScore,
        totalStudySeconds: totalStudySec,
        activeDays: activeDayKeys.size,
        totalWordsWritten: totalWords,
      });

      if (allSessions.length > 0) {
        const sortedOldest = [...allSessions].sort(
          (a, b) =>
            new Date(a.started_at || a.created_at).getTime() -
            new Date(b.started_at || b.created_at).getTime()
        );
        const earliest = new Date(sortedOldest[0].started_at || sortedOldest[0].created_at);
        setPracticeSince(
          earliest.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        );
      } else {
        setPracticeSince('Not started yet');
      }
    } catch (err) {
      console.error('Failed to load profile dashboard data:', err);
    }
  }, [authUserId]);

  // 1. Immediate local IndexedDB hydration (<20ms)
  useEffect(() => {
    Promise.resolve().then(() => {
      void loadAllProfileData();
    });
  }, [loadAllProfileData]);

  // 2. Non-blocking background cloud sync so UI never waits on remote API calls
  useEffect(() => {
    if (!authUserId || !isOnline || syncedUserRef.current === authUserId) return;
    syncedUserRef.current = authUserId;
    let cancelled = false;
    void getAchievementSystemData(authUserId)
      .then((systemData) => {
        if (!cancelled && systemData) {
          void loadAllProfileData(systemData);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [authUserId, isOnline, loadAllProfileData]);

  // Analytics module reuse for Subject & Topic Distribution
  const analyticsData: ProcessedAnalytics = useMemo(() => {
    const allQuestions = [...questionBank, ...customQuestions];
    return processAnalyticsData({
      sessions,
      answers,
      evaluations,
      allQuestions,
      achievements: userAchievements,
      streak: streakData,
      timeRange: 'all',
      activityPeriod: 'daily',
      appUsageBuckets,
    });
  }, [
    sessions,
    answers,
    evaluations,
    customQuestions,
    userAchievements,
    streakData,
    appUsageBuckets,
  ]);

  // Recent achievements list for right widget & full Achievements tab
  const achievementEntries: RecentBadgeItem[] = useMemo(() => {
    const unlockedMap = new Map(
      userAchievements.map((ua) => [ua.achievement_definition_id, ua])
    );

    const mapped = achDefinitions
      .filter((def) => def.is_active)
      .map((def) => {
        const record = unlockedMap.get(def.id);
        let progressText: string | undefined;

        if (!record) {
          if (def.category === 'test_completion') {
            progressText = `${Math.min(stats.completedSessions, def.threshold)}/${def.threshold}`;
          } else if (def.category === 'streak') {
            const cur = streakData?.longest_streak ?? streakData?.current_streak ?? stats.activeDays;
            progressText = `${Math.min(cur, def.threshold)}/${def.threshold}d`;
          } else if (def.code === 'PERFECT_SCORE') {
            progressText = `${stats.bestScore}/100%`;
          }
        }

        return {
          definition: def,
          unlocked: Boolean(record),
          earnedAt: record?.earned_at,
          progressText,
        };
      });

    // Put recently unlocked badges first (most recent earned_at), followed by locked targets
    return mapped.sort((a, b) => {
      if (a.unlocked && !b.unlocked) return -1;
      if (!a.unlocked && b.unlocked) return 1;
      if (a.unlocked && b.unlocked) {
        return (
          new Date(b.earnedAt || 0).getTime() - new Date(a.earnedAt || 0).getTime()
        );
      }
      return a.definition.threshold - b.definition.threshold;
    });
  }, [achDefinitions, userAchievements, stats.completedSessions, stats.activeDays, stats.bestScore, streakData]);

  const unlockedAchievementsCount = useMemo(
    () => achievementEntries.filter((item) => item.unlocked).length,
    [achievementEntries]
  );

  // Derived user identity fields
  const rawMetadataName =
    user?.user_metadata?.display_name || user?.user_metadata?.full_name || '';
  const email = user?.email || 'local-session';
  const emailPrefix = email.includes('@') ? email.split('@')[0] : 'aspirant';
  const displayName = customDisplayName || rawMetadataName || emailPrefix || 'Aspirant';
  const usernameHandle = (
    user?.user_metadata?.username ||
    emailPrefix.replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase() ||
    'aspirant'
  );
  const initials = displayName.slice(0, 2).toUpperCase();

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Local Session';

  const handleSaveDisplayName = async (newName: string) => {
    setCustomDisplayName(newName);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DISPLAY_NAME_STORAGE_KEY, newName);
    }
    if (isAuthenticated && isSupabaseConfigured) {
      try {
        const supabase = createClient();
        await supabase.auth.updateUser({ data: { display_name: newName } });
        await refreshSession();
      } catch (err) {
        console.error('Could not sync display name to cloud:', err);
      }
    }
  };

  const handleDeleteArchiveSession = useCallback(async (sessionId: string) => {
    await localDB.deleteSession(sessionId);
    setArchiveSessionItems((prev) =>
      prev.filter((item) => item.session.id !== sessionId)
    );
    setSessionItems((prev) => prev.filter((item) => item.id !== sessionId));
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setStats((prev) => ({
      ...prev,
      totalSessions: Math.max(0, prev.totalSessions - 1),
    }));
  }, []);

  const handleArchiveNotesUpdated = useCallback(
    (sessionId: string, updatedNotes: StickyNote[]) => {
      setArchiveSessionItems((prev) => {
        const currentEntry = prev.find((item) => item.session.id === sessionId);
        const delta = updatedNotes.length - (currentEntry?.notes.length ?? 0);
        if (delta !== 0) {
          setNotesCount((n) => Math.max(0, n + delta));
        }
        return prev.map((item) =>
          item.session.id === sessionId ? { ...item, notes: updatedNotes } : item
        );
      });
    },
    []
  );

  const handleManualSync = async () => {
    if (!isAuthenticated || !isOnline || syncing) return;
    setSyncing(true);
    try {
      await processSync();
      const remaining = await localDB.getUnsyncedItems();
      setUnsyncedCount(remaining.length);
    } catch (err) {
      console.error('Manual sync error:', err);
    } finally {
      setSyncing(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleRevokeAllTokens = async () => {
    setRevokingTokens(true);
    setRevokeMessage(null);
    const ok = await revokeAllSessions();
    setRevokingTokens(false);
    if (ok) {
      setRevokeMessage('All sessions revoked across every device.');
      setTimeout(() => router.push('/'), 1800);
    } else {
      setRevokeMessage('Failed to revoke tokens. Please try again.');
    }
  };

  const handleClearLocalData = async () => {
    setClearingData(true);
    try {
      const req = indexedDB.deleteDatabase('samayyudh-v2');
      req.onsuccess = () => window.location.reload();
      req.onerror = () => setClearingData(false);
      req.onblocked = () => window.location.reload();
    } catch {
      setClearingData(false);
    }
  };

  const navItems: {
    id: SidebarTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    {
      id: 'sessions',
      label: 'My Sessions',
      icon: History,
      badge: stats.totalSessions > 0 ? stats.totalSessions : undefined,
    },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-[85vh] max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
      {/* Mobile / Tablet Navigation Bar */}
      <div className="lg:hidden mb-5 overflow-x-auto pb-1 -mx-4 px-4">
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-[#111A2E] shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.45)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'text-violet-700 dark:text-violet-200'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="profile-mobile-nav-pill"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.1 }
                        : { type: 'spring', stiffness: 420, damping: 32 }
                    }
                    className="absolute inset-0 rounded-xl bg-violet-500/12 dark:bg-violet-500/20"
                  />
                )}
                <Icon className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Three-Column Desktop Dashboard Shell */}
      <div className="grid grid-cols-1 lg:grid-cols-[232px_minmax(0,1fr)] xl:grid-cols-[232px_minmax(0,1fr)_316px] gap-6 items-start">
        {/* LEFT COLUMN — Minimal Borderless Sidebar */}
        <aside className="hidden lg:flex flex-col justify-between sticky top-24 min-h-[600px] rounded-3xl bg-white dark:bg-[#111A2E] p-4 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)]">
          <div>
            {/* Profile Avatar & Identity Header */}
            <div className="flex flex-col items-center text-center pt-2 pb-5">
              <button
                type="button"
                onClick={() => setShowPictureModal(true)}
                aria-label="Preview profile avatar"
                className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950/80 dark:to-indigo-950/80 shadow-md hover:scale-105 transition-transform cursor-pointer flex items-center justify-center"
              >
                {selectedAvatar ? (
                  <img
                    src={selectedAvatar.src}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold text-violet-700 dark:text-violet-300">
                    {initials}
                  </span>
                )}
              </button>

              <p className="text-sm font-bold text-slate-900 dark:text-white mt-3 truncate max-w-full px-2">
                {displayName}
              </p>
              <p className="text-[11px] font-medium text-violet-600 dark:text-violet-400 truncate max-w-full px-2">
                @{usernameHandle}
              </p>
            </div>

            {/* Sidebar Navigation Links */}
            <nav aria-label="Profile dashboard sections" className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[13px] font-medium transition-colors cursor-pointer ${
                      active
                        ? 'text-violet-700 dark:text-violet-200 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-stone-50 dark:hover:bg-[#162032]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="profile-sidebar-active"
                        transition={
                          prefersReducedMotion
                            ? { duration: 0.1 }
                            : { type: 'spring', stiffness: 420, damping: 34 }
                        }
                        className="absolute inset-0 rounded-2xl bg-violet-500/12 dark:bg-violet-500/20"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          active
                            ? 'text-violet-600 dark:text-violet-300'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      />
                      <span>{item.label}</span>
                    </span>
                    {item.badge !== undefined && (
                      <span
                        className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          active
                            ? 'bg-violet-600 text-white dark:bg-violet-500'
                            : 'bg-stone-100 dark:bg-[#18233C] text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Auth Action */}
          <div className="pt-4 mt-6">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-[13px] font-medium text-rose-600 dark:text-rose-400 bg-rose-500/6 hover:bg-rose-500/12 dark:bg-rose-500/10 dark:hover:bg-rose-500/18 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-[13px] font-semibold text-violet-700 dark:text-violet-300 bg-violet-500/10 hover:bg-violet-500/18 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </aside>

        {/* CENTER COLUMN — Main Profile Dashboard & Sub-views */}
        <main className="min-w-0 space-y-5">
          {activeTab === 'profile' && (
            <>
              <ProfileBannerHeader
                displayName={displayName}
                usernameHandle={usernameHandle}
                email={email}
                joinedDate={joinedDate}
                practiceSince={practiceSince}
                totalStudyTime={formatDurationCompact(stats.totalStudySeconds)}
                avatar={selectedAvatar}
                initials={initials}
                onSaveName={handleSaveDisplayName}
                onSelectPresetAvatar={(id) => {
                  setSelectedAvatarId(id);
                  loadAvatar();
                }}
                onClearAvatar={() => {
                  clearSelectedAvatar();
                  loadAvatar();
                }}
                onOpenPictureModal={() => setShowPictureModal(true)}
              />

              <ProfileStatsGrid
                totalSessions={stats.totalSessions}
                questionsAttempted={stats.totalQuestionsAnswered}
                averageScore={stats.averageScore}
                activeDays={stats.activeDays}
                currentStreak={streakData?.current_streak ?? 0}
              />

              {isAuthenticated && <StudentIdentityCard />}

              <SubjectTopicDistributionCard
                subjectDistribution={analyticsData.subjectDistribution}
                topicDistribution={analyticsData.topicDistribution}
              />

              <ContributionHeatmapCard
                answers={answers}
                sessions={sessions}
                appUsageBuckets={appUsageBuckets}
              />

              {/* Stacked Right Sidebar Widgets for Mobile & Tablet (< xl) */}
              <div className="xl:hidden">
                <ProfileRightSidebar
                  bestScore={stats.bestScore}
                  totalSessions={stats.totalSessions}
                  completedSessions={stats.completedSessions}
                  recentBadges={achievementEntries}
                  onViewAllAchievements={() => setActiveTab('achievements')}
                  isAuthenticated={isAuthenticated}
                  userEmail={email}
                  isOnline={isOnline}
                  unsyncedCount={unsyncedCount}
                  syncing={syncing}
                  onManualSync={handleManualSync}
                />
              </div>
            </>
          )}

          {/* TAB: MY SESSIONS (Mini Animated Exam Folders, Borderless & Emoji-free) */}
          {activeTab === 'sessions' && (
            <ProfileSessionsPanel
              items={archiveSessionItems}
              onDeleteSession={handleDeleteArchiveSession}
              onNotesUpdated={handleArchiveNotesUpdated}
            />
          )}

          {/* TAB: ACHIEVEMENTS (Borderless, Existing Vector Artwork, Zero Emojis) */}
          {activeTab === 'achievements' && (
            <section className="space-y-4">
              <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 sm:p-6 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Achievements & Milestones
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {unlockedAchievementsCount} of {achievementEntries.length} badges unlocked
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 rounded-full bg-stone-100 dark:bg-[#18233C] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-violet-600 transition-all duration-500"
                      style={{
                        width: `${
                          achievementEntries.length > 0
                            ? Math.round(
                                (unlockedAchievementsCount / achievementEntries.length) * 100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <Link
                    href="/achievements"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline whitespace-nowrap"
                  >
                    Honor Hall
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {achievementEntries.map(({ definition, unlocked, earnedAt, progressText }) => (
                  <div
                    key={definition.id}
                    className={`rounded-3xl p-4 sm:p-5 flex items-center gap-4 shadow-[0_2px_14px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.45)] transition-colors ${
                      unlocked
                        ? 'bg-white dark:bg-[#111A2E]'
                        : 'bg-white/75 dark:bg-[#111A2E]/75 opacity-80'
                    }`}
                  >
                    <div className="relative w-14 h-14 rounded-2xl bg-stone-50 dark:bg-[#162032] flex items-center justify-center overflow-hidden shrink-0">
                      <div className="scale-[0.42] origin-center pointer-events-none">
                        {definition.visual_type === 'medal' ? (
                          <StreakMedal
                            tier={definition.badge_asset}
                            milestoneDays={definition.threshold}
                            size="sm"
                            isUnlocked={unlocked}
                            animate={false}
                          />
                        ) : (
                          <PerformanceBadge
                            tier={definition.badge_asset}
                            title={definition.title}
                            size="sm"
                            isUnlocked={unlocked}
                            showLimbs={false}
                            animate={false}
                          />
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {definition.title}
                        </h3>
                        {unlocked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 shrink-0">
                            <Check className="w-3 h-3" />
                            Unlocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 dark:bg-[#18233C] text-slate-500 dark:text-slate-400 shrink-0">
                            <Lock className="w-2.5 h-2.5" />
                            {progressText || 'Locked'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {definition.description}
                      </p>
                      {unlocked && earnedAt && (
                        <p className="text-[10px] text-violet-600 dark:text-violet-400 font-medium mt-1.5">
                          Earned{' '}
                          {new Date(earnedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB: ANALYTICS PREVIEW (Borderless, Reuses Analytics Data) */}
          {activeTab === 'analytics' && (
            <section className="space-y-5">
              <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 sm:p-6 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Performance Analytics
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Real-time metrics synthesized from your practice sessions and evaluations
                  </p>
                </div>
                <Link
                  href="/analytics"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors self-start sm:self-auto"
                >
                  Open Full Analytics
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {[
                  {
                    label: 'Total Sessions',
                    value: stats.totalSessions,
                    accent: 'text-violet-600 dark:text-violet-400',
                  },
                  {
                    label: 'Questions Answered',
                    value: stats.totalQuestionsAnswered,
                    accent: 'text-emerald-600 dark:text-emerald-400',
                  },
                  {
                    label: 'Evaluated Avg',
                    value: `${stats.averageScore}%`,
                    accent: 'text-amber-600 dark:text-amber-400',
                  },
                  {
                    label: 'Words Written',
                    value: stats.totalWordsWritten.toLocaleString(),
                    accent: 'text-indigo-600 dark:text-indigo-400',
                  },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-3xl bg-white dark:bg-[#111A2E] p-4 sm:p-5 shadow-[0_2px_14px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.45)]"
                  >
                    <p className={`text-2xl font-bold tabular-nums ${kpi.accent}`}>
                      {kpi.value}
                    </p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                      {kpi.label}
                    </p>
                  </div>
                ))}
              </div>

              <SubjectTopicDistributionCard
                subjectDistribution={analyticsData.subjectDistribution}
                topicDistribution={analyticsData.topicDistribution}
              />

              <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 sm:p-6 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)]">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                  Score Progression by Recent Session
                </h3>
                {sessionItems.filter((s) => s.scorePercent !== null).length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                    Complete and evaluate an exam session to unlock score trend insights.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {sessionItems
                      .filter((s) => s.scorePercent !== null)
                      .slice(0, 6)
                      .map((s) => (
                        <div key={s.id} className="flex items-center gap-3">
                          <span className="text-xs text-slate-600 dark:text-slate-300 w-36 truncate shrink-0">
                            {s.title}
                          </span>
                          <div className="flex-1 h-2.5 rounded-full bg-stone-100 dark:bg-[#18233C] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                (s.scorePercent || 0) >= 70
                                  ? 'bg-emerald-500'
                                  : (s.scorePercent || 0) >= 40
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                              }`}
                              style={{ width: `${s.scorePercent}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold tabular-nums w-10 text-right text-slate-800 dark:text-slate-100">
                            {s.scorePercent}%
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* TAB: SETTINGS (Borderless, Preserves ReminderSettingsPanel, Revocation, Storage) */}
          {activeTab === 'settings' && (
            <section className="space-y-5">
              {/* Notification & Reminder Settings */}
              <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 sm:p-6 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)]">
                <ReminderSettingsPanel />
              </div>

              {/* Local Storage Overview */}
              <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 sm:p-6 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)]">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-violet-500/12 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Local Storage & Offline Sync
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Offline-first IndexedDB store on this device
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Sessions', value: stats.totalSessions },
                    { label: 'Answers', value: answers.length },
                    { label: 'Sticky Notes', value: notesCount },
                    { label: 'Pending Sync', value: unsyncedCount },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl bg-stone-50/90 dark:bg-[#162032] p-3.5 text-center"
                    >
                      <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                        {item.value}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Security & Quick Actions */}
              <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 sm:p-6 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)] space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/12 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Account Security & Shortcuts
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Manage active sessions and jump to core workspaces
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <Link
                    href="/practice"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold bg-stone-100 hover:bg-stone-200/80 dark:bg-[#18233C] dark:hover:bg-[#223050] text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                    Practice Studio
                  </Link>
                  <Link
                    href="/analytics"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold bg-stone-100 hover:bg-stone-200/80 dark:bg-[#18233C] dark:hover:bg-[#223050] text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-violet-500" />
                    Analytics Overview
                  </Link>
                  <Link
                    href="/achievements"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold bg-stone-100 hover:bg-stone-200/80 dark:bg-[#18233C] dark:hover:bg-[#223050] text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    Honor Hall
                  </Link>
                </div>

                {isAuthenticated && (
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-stone-50/90 dark:bg-[#162032] p-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        Sign Out All Devices
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Revoke all active OAuth & session tokens everywhere.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRevokeAllTokens}
                      disabled={revokingTokens}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#1F2D4A] text-slate-700 dark:text-slate-200 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/15 dark:hover:text-rose-400 transition-colors disabled:opacity-60 cursor-pointer shrink-0"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {revokingTokens ? 'Revoking...' : 'Revoke All Sessions'}
                    </button>
                  </div>
                )}

                {revokeMessage && (
                  <p className="text-xs font-medium text-violet-600 dark:text-violet-400">
                    {revokeMessage}
                  </p>
                )}
              </div>

              {/* Danger Zone — Soft Tinted Surface, Zero Borders */}
              <div className="rounded-3xl bg-rose-50/90 dark:bg-rose-950/25 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-rose-500/12 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-rose-700 dark:text-rose-300">
                      Clear Local Data
                    </h3>
                    <p className="text-xs text-rose-600/80 dark:text-rose-300/80 mt-1">
                      Remove all locally stored IndexedDB sessions, answers, evaluations, and sticky notes from this browser.
                    </p>

                    <div className="mt-4">
                      {!confirmClear ? (
                        <button
                          type="button"
                          onClick={() => setConfirmClear(true)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Clear All Local Data
                        </button>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                            Confirm permanent local wipe?
                          </span>
                          <button
                            type="button"
                            onClick={handleClearLocalData}
                            disabled={clearingData}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors disabled:opacity-60 cursor-pointer"
                          >
                            {clearingData ? 'Clearing...' : 'Yes, Delete Everything'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmClear(false)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#18233C] text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>

        {/* RIGHT COLUMN — Performance, Achievements & Sync Widgets (Desktop xl+) */}
        <aside className="hidden xl:block sticky top-24">
          <ProfileRightSidebar
            bestScore={stats.bestScore}
            totalSessions={stats.totalSessions}
            completedSessions={stats.completedSessions}
            recentBadges={achievementEntries}
            onViewAllAchievements={() => setActiveTab('achievements')}
            isAuthenticated={isAuthenticated}
            userEmail={email}
            isOnline={isOnline}
            unsyncedCount={unsyncedCount}
            syncing={syncing}
            onManualSync={handleManualSync}
          />
        </aside>
      </div>

      {/* Existing Profile Picture Modal preserved */}
      <ProfilePictureModal
        isOpen={showPictureModal}
        onClose={() => setShowPictureModal(false)}
        avatarUrl={selectedAvatar?.src || null}
        avatarLabel={selectedAvatar?.label || displayName}
        displayName={displayName}
        initials={initials}
      />
    </div>
  );
}
