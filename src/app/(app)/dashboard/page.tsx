"use client";

import { useState, useMemo } from 'react';
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
import { EXAM_CATEGORIES } from '@/lib/constants';
import { OmnitrixLoader } from '@/components/OmnitrixLoader';
import { useAuth } from '@/components/providers/AuthProvider';

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

  const displayName: string =
    user?.user_metadata?.display_name ||
    user?.email?.split('@')[0] ||
    'Student';

  const initials = useMemo(() => getInitials(displayName), [displayName]);
  const greeting = getGreeting();

  const handleExamClick = (code: string) => {
    setLoadingExam(code);
    setTimeout(() => {
      setFinished(true);
      setTimeout(() => router.push(`/practice?exam=${code}`), 800);
    }, 2000);
  };

  const stats = [
    { label: 'Questions', value: '0', icon: Target, color: 'text-brand-600', bg: 'bg-brand-50 dark:bg-brand-100/10' },
    { label: 'Avg Score', value: '—', icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Study Time', value: '0m', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Day Streak', value: '0', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
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
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-xl md:text-2xl font-extrabold shadow-lg">
                {initials}
              </div>
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
            <div className="ml-auto hidden sm:flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 flex-shrink-0">
              <Flame className="w-4 h-4 text-amber-300" />
              <span className="text-white text-xs font-semibold">0 Day Streak</span>
            </div>
          </div>

          {/* Quick stats row inside hero */}
          <div className="relative mt-5 grid grid-cols-3 gap-3">
            {[
              { label: 'Sessions', value: '0', icon: Zap },
              { label: 'Questions', value: '0', icon: Target },
              { label: 'This Week', value: '0h', icon: TrendingUp },
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
                onClick={() => handleExamClick('UNIVERSITY')}
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
                  onClick={() => handleExamClick(cat.code)}
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
              onClick={() => handleExamClick('UNIVERSITY')}
              className="inline-flex items-center gap-2 mt-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <Swords className="w-4 h-4" />
              Start Practicing
            </button>
          </motion.div>
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
            className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-4"
          >
            <OmnitrixLoader
              finished={finished}
              text={`PREPARING ${loadingExam.toUpperCase()}...`}
              logoUrl={EXAM_CATEGORIES.find((c) => c.code === loadingExam)?.logo}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
