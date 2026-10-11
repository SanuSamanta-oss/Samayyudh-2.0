'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, BarChart3, Brain,
  ChevronRight, PenLine,
  GraduationCap, FileText
} from 'lucide-react';
import { FeatureIdCards } from '@/components/home/FeatureIdCards';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PullBulbToggle } from '@/components/PullBulbToggle';
import { OmnitrixLoader } from '@/components/OmnitrixLoader';
import { DonationTicket } from '@/components/home/DonationTicket';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }),
};


const examCategories = [
  { name: 'GATE', desc: 'Graduate Aptitude Test', icon: '🎓', logo: '/logos/gate.jpg', color: 'from-indigo-500 to-violet-500' },
  { name: 'JEE', desc: 'Engineering Entrance', icon: '🚀', logo: '/logos/jee.jpg', color: 'from-blue-500 to-cyan-500' },
  { name: 'WBJEE', desc: 'WB Joint Entrance', icon: '📐', logo: '/logos/wbjee.jpg', color: 'from-emerald-500 to-teal-500' },
  { name: 'UPSC', desc: 'Civil Services', icon: '🏛️', logo: '/logos/upsc.jpg', color: 'from-amber-500 to-orange-500' },
  { name: 'University', desc: 'College Exams', icon: '🏫', logo: '/logos/university.jpg', color: 'from-rose-500 to-pink-500' },
  { name: 'Competitive', desc: 'SSC · Banking · Railway', icon: '⚔️', logo: '/logos/ssc.jpg', color: 'from-purple-500 to-fuchsia-500' },
];


export default function LandingPage() {
  const router = useRouter();
  const [loadingExam, setLoadingExam] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const handleExamClick = (name: string) => {
    setLoadingExam(name);
    setTimeout(() => {
      setFinished(true);
      setTimeout(() => {
        router.push('/practice');
      }, 800); // 800ms for unlocked animation
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gradient-brand">সময়যুদ্ধ</span>
            <span className="text-xs font-semibold text-brand-600 bg-brand-50 dark:bg-brand-950 dark:text-brand-400 px-1.5 py-0.5 rounded-md">2.0</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth" className="text-sm font-medium text-muted hover:text-foreground transition-colors px-3 py-2">
              Log In
            </Link>
            <div className="relative inline-flex items-center justify-center">
              <Link
                href="/auth"
                className="relative z-10 text-sm font-semibold text-white bg-gradient-brand px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>

              {/* Interactive Pull-Cord Hanging Bulb Theme Switcher */}
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 z-0 pointer-events-auto" 
                aria-label="Theme toggle bulb"
              >
                <PullBulbToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-transparent to-transparent dark:from-brand-950/40 dark:via-transparent dark:to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-200/20 dark:bg-brand-900/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent-200/20 dark:bg-accent-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 lg:px-6 pt-16 md:pt-24 pb-16 md:pb-20">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Bengali title */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-gradient-brand tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              সময়যুদ্ধ 2.0
            </motion.h1>

            {/* Tagline */}
            <motion.h2
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mt-4 md:mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The Battle Between You{' '}
              <span className="text-gradient-brand">&amp; The Clock</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-base md:text-lg text-muted leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Practice real exam questions under realistic time pressure. Write your answers,
              track your speed, and let AI tell you whether your answer is exam-ready.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                href="/practice"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-base font-semibold text-white bg-gradient-brand hover:!bg-white hover:!bg-none hover:text-black transition-all shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.8)]"
              >
                Start Your First Battle
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/questions"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-base font-semibold text-brand-700 bg-brand-50 hover:!bg-white hover:text-black transition-all border border-brand-200 hover:border-transparent hover:shadow-[0_0_30px_rgba(255,255,255,0.8)]"
              >
                <BookOpen className="w-5 h-5" />
                Explore Question Bank
              </Link>
            </motion.div>

            {/* Bengali phrase */}
            <motion.p
              className="text-sm text-muted italic pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              পরীক্ষায় সময়ের কাছে হারবে না।
            </motion.p>
          </div>
        </div>
      </section>

      {/* Exam Categories */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">Choose Your Exam</h3>
          <p className="text-muted mt-2">One engine. Every exam pattern.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {examCategories.map((cat, i) => (
            <motion.div
              key={cat.name}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <button
                onClick={() => handleExamClick(cat.name)}
                className="w-full text-left group flex flex-col items-center gap-3 p-5 md:p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-brand-200 transition-all duration-300"
              >
                {'logo' in cat && cat.logo ? (
                  <Image
                    src={cat.logo}
                    alt={`${cat.name} logo`}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-contain"
                  />
                ) : (
                  <span className="text-3xl">{cat.icon}</span>
                )}
                <div className="text-center">
                  <h4 className="font-semibold text-foreground group-hover:text-brand-600 transition-colors">{cat.name}</h4>
                  <p className="text-xs text-muted mt-0.5">{cat.desc}</p>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Defining Question */}
      <section className="bg-gradient-brand py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center text-white space-y-4">
          <motion.p
            className="text-sm font-medium uppercase tracking-widest opacity-80"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
          >
            The Defining Question
          </motion.p>
          <motion.h3
            className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            &ldquo;Can I write a complete answer before the clock beats me?&rdquo;
          </motion.h3>
          <motion.p
            className="text-base md:text-lg opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Know the answer. Beat the clock. SamayYudh doesn&apos;t just check if you know it —
            it tells you if you can write it in time.
          </motion.p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16 md:py-20 overflow-hidden">
        <div className="text-center mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">Built for Real Exams</h3>
          <p className="text-muted mt-2">Not a chatbot. An exam time simulator.</p>
        </div>
        <div className="flex justify-center pb-8">
          <FeatureIdCards />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">How It Works</h3>
          </div>
          <div className="space-y-0">
            {[
              { step: '1', icon: GraduationCap, title: 'Choose your exam', desc: 'GATE, JEE, UPSC, University — pick your target.' },
              { step: '2', icon: FileText, title: 'Select questions & duration', desc: 'Quick Battle (10) to Full Century (100). Set your time.' },
              { step: '3', icon: PenLine, title: 'Write under time pressure', desc: 'Full answer editor. Timer tracking every second.' },
              { step: '4', icon: Brain, title: 'Get AI-powered feedback', desc: 'Score, missing concepts, time analysis, improved answers.' },
              { step: '5', icon: BarChart3, title: 'Track your progress', desc: 'See where you\'re fast, slow, strong, or weak.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex gap-4 md:gap-6 py-5"
              >
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                  {i < 4 && <div className="w-0.5 flex-1 bg-brand-200 dark:bg-brand-800 mt-2" />}
                </div>
                <div className="pb-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-brand-600" />
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 lg:px-6 py-16 md:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-brand rounded-3xl p-8 md:p-12 text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-3">Ready to battle the clock?</h3>
          <p className="text-base opacity-90 mb-6 max-w-lg mx-auto">
            Join thousands of students who are mastering exam time management.
          </p>
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold text-brand-700 bg-card hover:!bg-white hover:text-black transition-all shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.8)]"
          >
            Start Your First Battle
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Donation Ticket Section */}
      <DonationTicket />

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gradient-brand">সময়যুদ্ধ 2.0</span>
            <span>— The Battle Between You &amp; The Clock</span>
          </div>
          <p>Built with 💜 for students who refuse to lose to time.</p>
        </div>
      </footer>
      <AnimatePresence>
        {loadingExam && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4"
          >
            <OmnitrixLoader finished={finished} text={`PREPARING ${loadingExam.toUpperCase()}...`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
