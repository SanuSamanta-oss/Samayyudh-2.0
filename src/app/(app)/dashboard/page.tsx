"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Variants } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords, GraduationCap, BarChart3, Clock, Target,
  TrendingUp, ChevronRight, BookOpen, Trophy, Flame,
  Zap, Calendar, ArrowRight
} from 'lucide-react';
import { EXAM_CATEGORIES, getExamDisplayName } from '@/lib/constants';
import { OmnitrixLoader } from '@/components/OmnitrixLoader';
import { useAuth } from '@/components/providers/AuthProvider';
import * as localDB from '@/lib/store/local-db';
import type { ExamSession } from '@/types';
import { getSelectedAvatar } from '@/lib/avatars';
import { ProfilePictureModal } from '@/components/ProfilePictureModal';

/* ─── Helpers ────────────────────────────────────────────────── */

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/* ─── Animation variants ─────────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

/* ─── Sub-components ─────────────────────────────────────────── */

function StatCard({
  label, value, icon: Icon, color, bg, delay,
}: {
  label: string; value: string; icon: React.ElementType;
  color: string; bg: string; delay: number;
}) {
  return (
    <motion.div
      custom={delay}
      variants={fadeUp}
      className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card hover:shadow-md hover:border-border-hover transition-all duration-300"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>
        <Icon className={`w-4.5 h-4.5 ${color}`} />
      </div>
      <div>
        <p className="text-xl font-bold text-foreground leading-tight">{value}</p>
        <p className="text-xs text-muted mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

function ActionCard({
  label, desc, icon: Icon, gradient, onClick, delay,
}: {
  label: string; desc: string; icon: React.ElementType;
  gradient: string; onClick: () => void; delay: number;
}) {
  return (
    <motion.div custom={delay} variants={fadeUp}>
      <button
        onClick={onClick}
        className="w-full group text-left flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-transparent hover:-translate-y-0.5 transition-all duration-300"
      >
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground group-hover:text-brand-600 transition-colors truncate">{label}</p>
          <p className="text-xs text-muted truncate">{desc}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted ml-auto opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all" />
      </button>
    </motion.div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loadingExam, setLoadingExam] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [activeStreak, setActiveStreak] = useState<number>(0);
  const [achievementCount, setAchievementCount] = useState<number>(0);

  useEffect(() => {
    async function loadSessionsAndStreaks() {
      const all = await localDB.getAllSessions();
      all.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
      setSessions(all);

      const userId = user?.id || 'local-user';
      const streak = await localDB.getUserStreak(userId);
      if (streak) {
        setActiveStreak(streak.current_streak || 0);
      } else if (all.length > 0) {
        setActiveStreak(1);
      }

      const achs = await localDB.getUserAchievements(userId);
      setAchievementCount(achs.length);
    }
    loadSessionsAndStreaks();
  }, [user]);

  const [mounted, setMounted] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState<ReturnType<typeof getSelectedAvatar>>(null);

  useEffect(() => {
    setMounted(true);
    setCurrentAvatar(getSelectedAvatar());

    const handleAvatarChange = () => {
      setCurrentAvatar(getSelectedAvatar());
    };

    window.addEventListener('samayyudh:avatar-change', handleAvatarChange);
    return () => {
      window.removeEventListener('samayyudh:avatar-change', handleAvatarChange);
    };
  }, []);

  const displayName: string =
    user?.user_metadata?.display_name ||
    user?.email?.split('@')[0] ||
    'Student';

  const initials = useMemo(() => getInitials(displayName), [displayName]);
  const greeting = getGreeting();
  const selectedAvatar = mounted ? currentAvatar : null;

  const handleExamClick = (code: string, customName?: string) => {
    const displayName = customName || getExamDisplayName(code);
    setLoadingExam(displayName);
    setTimeout(() => {
      setFinished(true);
      setTimeout(() => router.push(`/practice?exam=${code}`), 800);
    }, 2000);
  };

  // Profile picture modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);

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
    { label: 'Sessions', value: totalSessions.toString(), icon: Target, color: 'text-brand-600', bg: 'bg-brand-50 dark:bg-brand-100/10' },
    { label: 'Badges', value: achievementCount.toString(), icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Avg Score', value: '—', icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Day Streak', value: streakCount.toString(), icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  ];

  const actions = [
    { label: 'Quick Battle', desc: '10 questions · ~10 min', icon: Swords, gradient: 'from-brand-500 to-accent-500', mode: 'quick_battle' },
    { label: 'Practice', desc: '25 questions · ~25 min', icon: BookOpen, gradient: 'from-emerald-500 to-teal-500', mode: 'practice_battle' },
    { label: 'Half Century', desc: '50 questions · ~50 min', icon: Trophy, gradient: 'from-amber-500 to-orange-500', mode: 'half_century' },
    { label: 'Full Century', desc: '100 questions · ~100 min', icon: Flame, gradient: 'from-rose-500 to-pink-500', mode: 'full_century' },
  ];

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6 md:py-8 space-y-8">

        {/* ── Hero Banner ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 p-6 md:p-8"
        >
          {/* Decorative shapes */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 -left-8 w-32 h-32 rounded-full bg-white/5 blur-xl" />
            <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-white/5 blur-lg" />
          </div>

          <div className="relative flex items-center gap-4 md:gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={handleOpenProfileModal}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-xl md:text-2xl font-extrabold shadow-lg overflow-hidden clickable-avatar"
                aria-label="View profile picture"
              >
                {selectedAvatar ? (
                  selectedAvatar.src.startsWith('data:') ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={selectedAvatar.src} alt={selectedAvatar.label} className="w-full h-full object-cover" />
                  ) : (
                    <Image src={selectedAvatar.src} alt={selectedAvatar.label} width={80} height={80} className="w-full h-full object-cover" />
                  )
                ) : (
                  initials
                )}
              </button>
              {/* Online dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-sm" />
            </div>

            <div className="min-w-0">
              <p className="text-white/75 text-sm font-medium">{greeting},</p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white truncate">
                {displayName}! 👋
              </h1>
              <p className="text-white/70 text-sm mt-0.5">Ready for your next battle?</p>
            </div>

            {/* Streak badge — right side */}
            <Link
              href="/achievements"
              className="ml-auto hidden sm:flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition-colors backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 flex-shrink-0 shadow-lg cursor-pointer"
            >
              <motion.div
                animate={{ 
                  scaleX: [1, 1.15, 0.85, 1.05, 1],
                  scaleY: [1, 0.85, 1.15, 0.95, 1],
                  rotate: [0, -12, 12, -6, 6, 0],
                  y: [0, -3, 1, -1, 0]
                }}
                transition={{
                  duration: 0.7,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="origin-bottom drop-shadow-[0_0_10px_rgba(251,146,60,1)]"
              >
                <span className="text-base leading-none block">🔥</span>
              </motion.div>
              <span className="text-white text-xs font-semibold">{streakCount} Day Streak</span>
            </Link>
          </div>

          {/* Quick stats row inside hero */}
          <div className="relative mt-5 grid grid-cols-3 gap-3">
            {[
              { label: 'Sessions', value: totalSessions.toString(), icon: Zap },
              { label: 'Questions', value: '—', icon: Target },
              { label: 'This Week', value: totalSessions > 0 ? 'Active' : '0', icon: TrendingUp },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 bg-white/10 backdrop-blur-sm rounded-2xl py-3 px-2">
                <s.icon className="w-4 h-4 text-white/80" />
                <p className="text-white text-base font-bold leading-tight">{s.value}</p>
                <p className="text-white/65 text-[10px] font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Stats Grid ─────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground">Your Progress</h2>
            <Link href="/analytics" className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors">
              View analytics <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {stats.map((s, i) => (
              <StatCard key={s.label} {...s} delay={i} />
            ))}
          </motion.div>
        </section>

        {/* ── Quick Actions ───────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground">Start Practicing</h2>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {actions.map((a, i) => (
              <ActionCard
                key={a.label}
                label={a.label}
                desc={a.desc}
                icon={a.icon}
                gradient={a.gradient}
                delay={i}
                onClick={() => {
                  setLoadingExam(a.label);
                  setTimeout(() => {
                    setFinished(true);
                    setTimeout(() => router.push(`/practice?mode=${a.mode}`), 800);
                  }, 2000);
                }}
              />
            ))}
          </motion.div>
        </section>

        {/* ── Exam Selection ──────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground">What are you preparing for?</h2>
            <Link href="/exams" className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {EXAM_CATEGORIES.filter((c) => c.code !== 'CUSTOM').map((cat, i) => (
              <motion.div
                key={cat.code}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <button
                  onClick={() => handleExamClick(cat.code, cat.name)}
                  className="w-full group text-left flex items-center gap-3 p-3.5 rounded-2xl border border-border bg-card hover:shadow-md hover:border-brand-200 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {cat.logo ? (
                    <Image
                      src={cat.logo}
                      alt={cat.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-contain shrink-0"
                    />
                  ) : (
                    <span className="text-2xl shrink-0">{cat.icon}</span>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-brand-600 transition-colors truncate">
                      {cat.name}
                    </p>
                    <p className="text-xs text-muted truncate">{cat.description}</p>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Recent Sessions ─────────────────────────────── */}
        <section className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground">Recent Sessions</h2>
            <Link href="/history" className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          {sessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl border border-border p-10 flex flex-col items-center justify-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-muted" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">No sessions yet</p>
                <p className="text-xs text-muted mt-0.5">Start your first battle to see your history here</p>
              </div>
              <button
                onClick={() => router.push('/practice')}
                className="inline-flex items-center gap-2 mt-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 active:scale-[0.98] transition-all"
              >
                <Swords className="w-4 h-4" />
                Start Practicing
              </button>
            </motion.div>
          ) : (
            <div className="grid gap-3">
              {sessions.slice(0, 3).map((session) => {
                const isCompleted = session.status === 'completed' || session.status === 'evaluated' || session.evaluation_status === 'completed';
                const cat = EXAM_CATEGORIES.find(c => c.code === session.exam_code);
                
                return (
                  <div key={session.id}>
                    <Link
                      href={isCompleted ? `/results?session=${session.id}` : `/exam/session?id=${session.id}`}
                      className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:shadow-md hover:border-brand-200 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-50 text-brand-600'}`}>
                          {isCompleted ? <Trophy className="w-6 h-6" /> : <Swords className="w-6 h-6" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-foreground truncate group-hover:text-brand-600 transition-colors">
                            {cat?.name || getExamDisplayName(session.exam_code) || 'Exam Session'}
                          </h3>
                          <p className="text-xs text-muted flex items-center gap-2 mt-0.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(session.started_at).toLocaleDateString()} at {new Date(session.started_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 sm:pl-4 sm:border-l border-border">
                        <div className="text-left sm:text-right">
                          <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {isCompleted ? 'Completed' : 'In Progress'}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Today card ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-100/10 flex items-center justify-center">
            <Calendar className="w-4.5 h-4.5 text-brand-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <p className="text-xs text-muted">Practice daily to maintain your streak 🔥</p>
          </div>
        </motion.div>

      </div>

      {/* ── Exam loading overlay ────────────────────────── */}
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
              logoUrl={EXAM_CATEGORIES.find((c) => c.code === loadingExam || c.name.toLowerCase() === loadingExam.toLowerCase())?.logo}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instagram-style Profile Picture Modal */}
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
