"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import {
  Swords,
  GraduationCap,
  BarChart3,
  Target,
  TrendingUp,
  ChevronRight,
  BookOpen,
  Trophy,
  Flame,
  Zap,
  Calendar,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { EXAM_CATEGORIES, getExamDisplayName } from '@/lib/constants';
import { OmnitrixLoader } from '@/components/OmnitrixLoader';
import { useAuth } from '@/components/providers/AuthProvider';
import * as localDB from '@/lib/store/local-db';
import type { Answer, AnswerEvaluation, ExamSession } from '@/types';
import { getSelectedAvatar, type AvatarDef } from '@/lib/avatars';
import { ProfilePictureModal } from '@/components/ProfilePictureModal';
import { FormulaGraphIcon } from '@/components/icons/FormulaGraphIcon';

/* ─── Constants & Helpers ───────────────────────────────────── */

const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'ST';
}

/* ─── Smooth Animated Counter ───────────────────────────────── */

function AnimatedNumber({
  value,
  suffix = '',
  inView,
  reducedMotion,
}: {
  value: number;
  suffix?: string;
  inView: boolean;
  reducedMotion: boolean | null;
}) {
  const [animatedDisplay, setAnimatedDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reducedMotion || value === 0) return;

    let rafId = 0;
    const duration = 620;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedDisplay(Math.round(value * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setAnimatedDisplay(value);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value, inView, reducedMotion]);

  const shown = reducedMotion ? value : inView && value > 0 ? animatedDisplay : 0;

  return (
    <span className="tabular-nums">
      {shown.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Sub-components (Borderless Profile Dashboard Style) ───── */

function StatCard({
  label,
  value,
  suffix = '',
  displayFallback,
  sublabel,
  icon: Icon,
  iconBg,
  iconColor,
  delay,
  inView,
  reducedMotion,
}: {
  label: string;
  value: number | null;
  suffix?: string;
  displayFallback?: string;
  sublabel: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  delay: number;
  inView: boolean;
  reducedMotion: boolean | null;
}) {
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.36, delay: delay * 0.055, ease: SMOOTH_EASE }}
      whileHover={reducedMotion ? undefined : { y: -2 }}
      className="rounded-3xl bg-white dark:bg-[#111A2E] p-4 sm:p-5 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)] hover:shadow-[0_10px_28px_-6px_rgba(91,33,182,0.12)] dark:hover:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.65)] transition-shadow duration-200 flex flex-col justify-between gap-3 h-full"
    >
      <div className="flex items-center justify-between gap-2">
        <div
          className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>

      <div>
        <p className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white leading-none">
          {value !== null ? (
            <AnimatedNumber
              value={value}
              suffix={suffix}
              inView={inView}
              reducedMotion={reducedMotion}
            />
          ) : (
            <span className="tabular-nums">{displayFallback || '—'}</span>
          )}
        </p>
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1.5">
          {label}
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5 truncate">
          {sublabel}
        </p>
      </div>
    </motion.div>
  );
}

function ActionCard({
  label,
  desc,
  icon: Icon,
  iconBg,
  iconColor,
  onClick,
  delay,
  reducedMotion,
}: {
  label: string;
  desc: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  onClick: () => void;
  delay: number;
  reducedMotion: boolean | null;
}) {
  const isQuickBattle = label === 'Quick Battle';
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: 0.12 + delay * 0.055, ease: SMOOTH_EASE }}
      whileHover={reducedMotion ? undefined : { y: -2 }}
      whileTap={reducedMotion ? undefined : { scale: 0.99 }}
    >
      <button
        type="button"
        onClick={onClick}
        className={`w-full group text-left flex items-center gap-3.5 p-4 rounded-3xl transition-all duration-200 cursor-pointer ${
          isQuickBattle
            ? 'bg-gradient-to-r from-violet-50/90 via-white to-indigo-50/70 dark:from-[#1B1738] dark:via-[#111A2E] dark:to-[#161F38] shadow-[0_6px_24px_-6px_rgba(124,58,237,0.18)] dark:shadow-[0_8px_28px_-6px_rgba(0,0,0,0.55)] hover:shadow-[0_12px_30px_-6px_rgba(124,58,237,0.26)]'
            : 'bg-white dark:bg-[#111A2E] shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)] hover:shadow-[0_10px_28px_-6px_rgba(91,33,182,0.12)] dark:hover:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.65)]'
        }`}
      >
        <div
          className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors truncate">
              {label}
            </p>
            {isQuickBattle && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-600 dark:bg-violet-500 text-white">
                Popular
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {desc}
          </p>
        </div>
        <div className="w-8 h-8 rounded-xl bg-stone-50 dark:bg-[#162032] group-hover:bg-violet-500/12 dark:group-hover:bg-violet-500/20 flex items-center justify-center shrink-0 transition-colors">
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-300 group-hover:translate-x-0.5 transition-all" />
        </div>
      </button>
    </motion.div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const statsGridRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsGridRef, { once: true, amount: 0.15 });

  const [loadingExam, setLoadingExam] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [activeStreak, setActiveStreak] = useState<number>(0);
  const [achievementCount, setAchievementCount] = useState<number>(0);
  const [questionsAttempted, setQuestionsAttempted] = useState<number>(0);
  const [averageScore, setAverageScore] = useState<number | null>(null);

  const [mounted, setMounted] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState<AvatarDef | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Load real sessions, streaks, badges, answers & evaluations asynchronously
  useEffect(() => {
    let active = true;

    async function loadDashboardData() {
      const userId = user?.id || 'local-user';
      const [allSessions, allAnswers, allEvals, streak, achs] = await Promise.all([
        localDB.getAllSessions(),
        localDB.getAllAnswers(),
        localDB.getAllEvaluations(),
        localDB.getUserStreak(userId),
        localDB.getUserAchievements(userId),
      ]);

      if (!active) return;

      allSessions.sort(
        (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
      );
      setSessions(allSessions);

      if (streak) {
        setActiveStreak(streak.current_streak || 0);
      } else if (allSessions.length > 0) {
        setActiveStreak(1);
      } else {
        setActiveStreak(0);
      }

      setAchievementCount(achs.length);

      const answeredCount = allAnswers.filter(
        (a) => (a.answer_text || a.selected_option || '').trim().length > 0
      ).length;
      setQuestionsAttempted(answeredCount);

      // Compute average score percentage from evaluated answers linked via session answers
      const evalMap = new Map(allEvals.map((e) => [e.answer_id, e]));
      const answersBySession = new Map<string, Answer[]>();
      for (const a of allAnswers) {
        const list = answersBySession.get(a.session_id) || [];
        list.push(a);
        answersBySession.set(a.session_id, list);
      }

      const sessionScores: number[] = [];
      for (const s of allSessions) {
        const sAnswers = answersBySession.get(s.id) || [];
        const sEvals = sAnswers
          .map((a) => evalMap.get(a.id))
          .filter(Boolean) as AnswerEvaluation[];
        if (sEvals.length > 0) {
          const totalSc = sEvals.reduce((sum, e) => sum + e.score, 0);
          const totalMax = sEvals.reduce((sum, e) => sum + e.max_score, 0);
          if (totalMax > 0) {
            sessionScores.push(Math.round((totalSc / totalMax) * 100));
          }
        }
      }
      if (sessionScores.length > 0) {
        const avg = Math.round(
          sessionScores.reduce((sum, val) => sum + val, 0) / sessionScores.length
        );
        setAverageScore(avg);
      } else {
        setAverageScore(null);
      }
    }

    void loadDashboardData();
    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      setMounted(true);
      setCurrentAvatar(getSelectedAvatar());
    });

    const handleAvatarChange = () => {
      setCurrentAvatar(getSelectedAvatar());
    };

    window.addEventListener('samayyudh:avatar-change', handleAvatarChange);
    return () => {
      active = false;
      window.removeEventListener('samayyudh:avatar-change', handleAvatarChange);
    };
  }, []);

  const displayName: string =
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Student';

  const initials = useMemo(() => getInitials(displayName), [displayName]);
  const greeting = getGreeting();
  const selectedAvatar = mounted ? currentAvatar : null;

  const handleExamClick = (code: string, customName?: string) => {
    const label = customName || getExamDisplayName(code);
    setLoadingExam(label);
    setTimeout(() => {
      setFinished(true);
      setTimeout(() => router.push(`/practice?exam=${code}`), 800);
    }, 2000);
  };

  const handleOpenProfileModal = useCallback(() => {
    setProfileModalOpen(true);
  }, []);

  const handleCloseProfileModal = useCallback(() => {
    setProfileModalOpen(false);
  }, []);

  const handleChangeAvatar = useCallback(() => {
    setProfileModalOpen(false);
    router.push('/profile');
  }, [router]);

  const totalSessions = sessions.length;
  const streakCount = activeStreak;

  const stats = [
    {
      label: 'Sessions',
      value: totalSessions,
      sublabel: 'Total exams',
      icon: Target,
      iconColor: 'text-violet-600 dark:text-violet-400',
      iconBg: 'bg-violet-500/12 dark:bg-violet-500/18',
    },
    {
      label: 'Badges',
      value: achievementCount,
      sublabel: 'Unlocked honors',
      icon: Trophy,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-500/12 dark:bg-amber-500/18',
    },
    {
      label: 'Avg Score',
      value: averageScore,
      suffix: '%',
      displayFallback: '—',
      sublabel: 'Evaluated accuracy',
      icon: BarChart3,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/12 dark:bg-emerald-500/18',
    },
    {
      label: 'Day Streak',
      value: streakCount,
      sublabel: 'Consistent focus',
      icon: Flame,
      iconColor: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-500/12 dark:bg-rose-500/18',
    },
  ];

  const actions = [
    {
      label: 'Quick Battle',
      desc: '10 questions · ~10 min',
      icon: Swords,
      iconBg: 'bg-violet-500/14 dark:bg-violet-500/22',
      iconColor: 'text-violet-600 dark:text-violet-300',
      mode: 'quick_battle',
    },
    {
      label: 'Practice',
      desc: '25 questions · ~25 min',
      icon: BookOpen,
      iconBg: 'bg-emerald-500/12 dark:bg-emerald-500/18',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      mode: 'practice_battle',
    },
    {
      label: 'Half Century',
      desc: '50 questions · ~50 min',
      icon: Trophy,
      iconBg: 'bg-amber-500/12 dark:bg-amber-500/18',
      iconColor: 'text-amber-600 dark:text-amber-400',
      mode: 'half_century',
    },
    {
      label: 'Full Century',
      desc: '100 questions · ~100 min',
      icon: Flame,
      iconBg: 'bg-rose-500/12 dark:bg-rose-500/18',
      iconColor: 'text-rose-600 dark:text-rose-400',
      mode: 'full_century',
    },
  ];

  return (
    <>
      <div className="min-h-[85vh] max-w-5xl lg:max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6 sm:space-y-7">
        {/* ── Hero Banner (Matches ProfileBannerHeader) ───────────── */}
        <motion.section
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: SMOOTH_EASE }}
          className="rounded-3xl bg-white dark:bg-[#111A2E] p-3 sm:p-4 shadow-[0_4px_24px_-6px_rgba(15,23,42,0.06)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]"
        >
          {/* Gradient Header Ribbon */}
          <div className="relative h-24 sm:h-32 rounded-2xl overflow-hidden bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#C4B5FD] dark:from-[#3B1878] dark:via-[#5B21B6] dark:to-[#8B5CF6]">
            {!prefersReducedMotion && (
              <motion.div
                aria-hidden="true"
                className="absolute -inset-1/2 opacity-45 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 28% 40%, rgba(255,255,255,0.42), transparent 55%), radial-gradient(circle at 75% 65%, rgba(233,213,255,0.45), transparent 50%)',
                }}
                animate={{ x: [0, 18, -10, 0], y: [0, -10, 8, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/10 pointer-events-none"
            />

            <div className="relative z-10 flex items-center justify-between px-4 pt-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/18 backdrop-blur-md text-white/95">
                <Sparkles className="w-3 h-3" />
                SamayYudh Arena
              </span>

              <Link
                href="/achievements"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/18 hover:bg-white/28 backdrop-blur-md text-white transition-colors"
              >
                <motion.span
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { scale: [1, 1.15, 1], rotate: [0, -6, 6, 0] }
                  }
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex items-center"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                </motion.span>
                <span>{streakCount} Day Streak</span>
              </Link>
            </div>
          </div>

          {/* Overlapping Avatar + Greeting + Primary CTA */}
          <div className="px-2 sm:px-4 pb-2">
            <div className="flex items-end justify-between gap-3 -mt-10 sm:-mt-11 mb-3.5 relative z-20">
              <motion.button
                type="button"
                onClick={handleOpenProfileModal}
                aria-label="View profile picture"
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.35, ease: SMOOTH_EASE }}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-white dark:bg-[#111A2E] p-1.5 shadow-[0_10px_28px_-6px_rgba(76,29,149,0.28)] dark:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.65)] shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 cursor-pointer"
              >
                <div className="w-full h-full rounded-[18px] overflow-hidden bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950/80 dark:to-indigo-950/80 flex items-center justify-center">
                  {selectedAvatar ? (
                    selectedAvatar.src.startsWith('data:') ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={selectedAvatar.src}
                        alt={selectedAvatar.label}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={selectedAvatar.src}
                        alt={selectedAvatar.label}
                        width={88}
                        height={88}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <span className="text-xl sm:text-2xl font-bold text-violet-700 dark:text-violet-300">
                      {initials}
                    </span>
                  )}
                </div>
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-sm" />
              </motion.button>

              <motion.button
                type="button"
                whileHover={prefersReducedMotion ? undefined : { y: -1 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                onClick={() => {
                  setLoadingExam('Quick Battle');
                  setTimeout(() => {
                    setFinished(true);
                    setTimeout(() => router.push('/practice?mode=quick_battle'), 800);
                  }, 1200);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 transition-colors shadow-[0_6px_18px_-4px_rgba(124,58,237,0.45)] cursor-pointer mb-1"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Battle Now</span>
              </motion.button>
            </div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05, ease: SMOOTH_EASE }}
            >
              <p className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                {greeting}
              </p>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
                {displayName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Ready for your next battle?
              </p>
            </motion.div>

            {/* Quick Summary Metrics Row Inside Hero */}
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-stone-50/90 dark:bg-[#162032] py-3 px-2">
                <Zap className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight tabular-nums">
                  {totalSessions}
                </p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Sessions
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-stone-50/90 dark:bg-[#162032] py-3 px-2">
                <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight tabular-nums">
                  {questionsAttempted > 0 ? questionsAttempted : '—'}
                </p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Questions
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-stone-50/90 dark:bg-[#162032] py-3 px-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {totalSessions > 0 ? 'Active' : 'Ready'}
                </p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  This Week
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Stats Grid (Your Progress) ────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3.5 px-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Your Progress
            </h2>
            <Link
              href="/analytics"
              className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:opacity-80 transition-opacity"
            >
              <span>View analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div ref={statsGridRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((s, i) => {
              const card = (
                <StatCard
                  label={s.label}
                  value={s.value}
                  suffix={s.suffix}
                  displayFallback={s.displayFallback}
                  sublabel={s.sublabel}
                  icon={s.icon}
                  iconBg={s.iconBg}
                  iconColor={s.iconColor}
                  delay={i}
                  inView={statsInView}
                  reducedMotion={prefersReducedMotion}
                />
              );

              if (s.label === 'Badges' || s.label === 'Day Streak') {
                return (
                  <Link
                    key={s.label}
                    href="/achievements"
                    className="block rounded-3xl"
                    title={`View ${s.label} in Honor Hall`}
                  >
                    {card}
                  </Link>
                );
              }
              return <div key={s.label}>{card}</div>;
            })}
          </div>
        </section>

        {/* ── Start Practicing ──────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3.5 px-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Start Practicing
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {actions.map((a, i) => (
              <ActionCard
                key={a.label}
                label={a.label}
                desc={a.desc}
                icon={a.icon}
                iconBg={a.iconBg}
                iconColor={a.iconColor}
                delay={i}
                reducedMotion={prefersReducedMotion}
                onClick={() => {
                  setLoadingExam(a.label);
                  setTimeout(() => {
                    setFinished(true);
                    setTimeout(() => router.push(`/practice?mode=${a.mode}`), 800);
                  }, 2000);
                }}
              />
            ))}
          </div>
        </section>

        {/* ── Formula Library Card ──────────────────────────────────── */}
        <motion.section
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.36, ease: SMOOTH_EASE }}
        >
          <Link
            href="/formulas"
            className="group block relative overflow-hidden rounded-3xl bg-white dark:bg-[#111A2E] p-4 sm:p-5 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)] hover:shadow-[0_10px_28px_-6px_rgba(91,33,182,0.12)] dark:hover:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.65)] hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-sky-500/12 dark:bg-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                  <FormulaGraphIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                      Formula Library
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/12 dark:bg-violet-500/22 text-violet-700 dark:text-violet-300">
                      New
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    Browse Class 10, 11, 12, and Higher Education Physics formulas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 shrink-0">
                <span>Explore</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.section>

        {/* ── Exam Selection ────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3.5 px-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              What are you preparing for?
            </h2>
            <Link
              href="/exams"
              className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:opacity-80 transition-opacity"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
            {EXAM_CATEGORIES.filter((c) => c.code !== 'CUSTOM').map((cat, i) => (
              <motion.div
                key={cat.code}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.32, delay: i * 0.035, ease: SMOOTH_EASE }}
                whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              >
                <button
                  type="button"
                  onClick={() => handleExamClick(cat.code, cat.name)}
                  className="w-full h-full group text-left flex items-center gap-3 p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-[#111A2E] shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)] hover:shadow-[0_10px_28px_-6px_rgba(91,33,182,0.12)] dark:hover:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.65)] transition-shadow duration-200 cursor-pointer"
                >
                  {cat.logo ? (
                    <Image
                      src={cat.logo}
                      alt={cat.name}
                      width={34}
                      height={34}
                      className="w-8.5 h-8.5 rounded-xl object-contain shrink-0 bg-stone-50 dark:bg-[#162032] p-0.5"
                    />
                  ) : (
                    <div className="w-8.5 h-8.5 rounded-xl bg-violet-500/12 dark:bg-violet-500/20 flex items-center justify-center shrink-0 text-violet-600 dark:text-violet-400">
                      <GraduationCap className="w-4.5 h-4.5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors truncate">
                      {cat.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {cat.description}
                    </p>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Recent Sessions ───────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3.5 px-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Sessions
            </h2>
            <Link
              href="/history"
              className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:opacity-80 transition-opacity"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {sessions.length === 0 ? (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, ease: SMOOTH_EASE }}
              className="rounded-3xl bg-white dark:bg-[#111A2E] shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)] p-10 flex flex-col items-center justify-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-violet-500/12 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  No sessions yet
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Start your first battle to see your history here
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/practice')}
                className="inline-flex items-center gap-2 mt-1 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Swords className="w-4 h-4" />
                <span>Start Practicing</span>
              </button>
            </motion.div>
          ) : (
            <div className="grid gap-3">
              {sessions.slice(0, 3).map((session, i) => {
                const isCompleted =
                  session.status === 'completed' ||
                  session.status === 'evaluated' ||
                  session.evaluation_status === 'completed';
                const cat = EXAM_CATEGORIES.find((c) => c.code === session.exam_code);

                return (
                  <motion.div
                    key={session.id}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.32, delay: i * 0.05, ease: SMOOTH_EASE }}
                    whileHover={prefersReducedMotion ? undefined : { y: -1.5 }}
                  >
                    <Link
                      href={
                        isCompleted
                          ? `/results?session=${session.id}`
                          : `/exam/session?id=${session.id}`
                      }
                      className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-3xl bg-white dark:bg-[#111A2E] shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)] hover:shadow-[0_10px_28px_-6px_rgba(91,33,182,0.12)] dark:hover:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.65)] transition-shadow duration-200"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/18 dark:text-emerald-400'
                              : 'bg-violet-500/12 text-violet-600 dark:bg-violet-500/18 dark:text-violet-400'
                          }`}
                        >
                          {isCompleted ? (
                            <Trophy className="w-5 h-5" />
                          ) : (
                            <Swords className="w-5 h-5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                            {cat?.name ||
                              getExamDisplayName(session.exam_code) ||
                              'Exam Session'}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {new Date(session.started_at).toLocaleDateString()} at{' '}
                              {new Date(session.started_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-500/12 text-emerald-700 dark:bg-emerald-500/18 dark:text-emerald-300'
                              : 'bg-amber-500/12 text-amber-700 dark:bg-amber-500/18 dark:text-amber-300'
                          }`}
                        >
                          {isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                        <ChevronRight className="w-4.5 h-4.5 text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-300 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Today Streak Reminder Card ────────────────────────────── */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35, ease: SMOOTH_EASE }}
          className="flex items-center gap-3.5 p-4 rounded-3xl bg-white dark:bg-[#111A2E] shadow-[0_2px_16px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)]"
        >
          <div className="w-10 h-10 rounded-2xl bg-violet-500/12 dark:bg-violet-500/18 flex items-center justify-center shrink-0">
            <Calendar className="w-4.5 h-4.5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Practice daily to maintain your streak
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Exam loading overlay ──────────────────────────────────── */}
      <AnimatePresence>
        {loadingExam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4"
          >
            <OmnitrixLoader
              finished={finished}
              text={`PREPARING ${getExamDisplayName(loadingExam).toUpperCase()}...`}
              logoUrl={
                EXAM_CATEGORIES.find(
                  (c) =>
                    c.code === loadingExam ||
                    c.name.toLowerCase() === loadingExam.toLowerCase()
                )?.logo
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Floating Social-Profile Picture Modal */}
      <ProfilePictureModal
        isOpen={profileModalOpen}
        onClose={handleCloseProfileModal}
        avatarUrl={selectedAvatar?.src ?? null}
        avatarLabel={selectedAvatar?.label ?? displayName}
        displayName={displayName}
        initials={initials}
        onChangeAvatar={handleChangeAvatar}
      />
    </>
  );
}
