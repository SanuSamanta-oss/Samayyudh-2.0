'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Swords, GraduationCap, BarChart3, Clock, Target,
  TrendingUp, ChevronRight, BookOpen, Trophy, Flame
} from 'lucide-react';
import { EXAM_CATEGORIES } from '@/lib/constants';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 md:py-8 space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Good to see you! 👋</h1>
        <p className="text-stone-500 mt-1">Ready for another battle against the clock?</p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Quick Battle', desc: '10 questions', icon: Swords, href: '/practice?mode=quick_battle', gradient: 'from-brand-500 to-accent-500' },
          { label: 'Practice', desc: '25 questions', icon: BookOpen, href: '/practice?mode=practice_battle', gradient: 'from-emerald-500 to-teal-500' },
          { label: 'Half Century', desc: '50 questions', icon: Trophy, href: '/practice?mode=half_century', gradient: 'from-amber-500 to-orange-500' },
          { label: 'Full Century', desc: '100 questions', icon: Flame, href: '/practice?mode=full_century', gradient: 'from-rose-500 to-pink-500' },
        ].map((action, i) => (
          <motion.div key={action.label} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <Link
              href={action.href}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-white hover:shadow-lg hover:border-transparent transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-sm`}>
                <action.icon className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{action.label}</p>
                <p className="text-xs text-stone-500">{action.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Exam Selection */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">What are you preparing for?</h2>
          <Link href="/exams" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {EXAM_CATEGORIES.filter(c => c.code !== 'CUSTOM').map((cat, i) => (
            <motion.div key={cat.code} custom={i} variants={fadeUp} initial="hidden" animate="visible">
              <Link
                href={`/practice?exam=${cat.code}`}
                className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-white hover:shadow-md hover:border-brand-200 transition-all"
              >
                <span className="text-2xl">{cat.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-brand-600 transition-colors truncate">{cat.name}</p>
                  <p className="text-xs text-stone-500 truncate">{cat.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Overview */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">Your Progress</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Questions', value: '0', icon: Target, color: 'text-brand-600 bg-brand-50' },
            { label: 'Avg Score', value: '—', icon: BarChart3, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Time Efficiency', value: '—', icon: Clock, color: 'text-amber-600 bg-amber-50' },
            { label: 'Streak', value: '0 days', icon: TrendingUp, color: 'text-rose-600 bg-rose-50' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-white"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-stone-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Sessions */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Sessions</h2>
        <div className="bg-white rounded-xl border border-border p-6 text-center">
          <GraduationCap className="w-10 h-10 mx-auto text-stone-300 mb-3" />
          <p className="text-sm text-stone-500">No sessions yet. Start your first battle!</p>
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity"
          >
            <Swords className="w-4 h-4" />
            Start Practicing
          </Link>
        </div>
      </section>
    </div>
  );
}
