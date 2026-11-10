'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Upload, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import JeeMainPyqExplorer from '@/components/pyq/JeeMainPyqExplorer';
import WbjeePyqExplorer from '@/components/pyq/WbjeePyqExplorer';
import NeetPyqExplorer from '@/components/pyq/NeetPyqExplorer';
import { PyqAdminUpload } from '@/components/pyq/PyqAdminUpload';

type ExamView = 'home' | 'jee_main' | 'jee_advanced' | 'wbjee' | 'neet' | 'admin_upload';

interface ExamEntry {
  key: ExamView;
  label: string;
  sublabel: string;
  description: string;
  status: 'active' | 'soon';
  accentColor: string;
  glowBorder: string;
  accentText: string;
}

const examEntries: ExamEntry[] = [
  {
    key: 'jee_main',
    label: 'JEE Main',
    sublabel: '2025 B.Tech • 5 Papers Live',
    description: 'Physics, Chemistry and Mathematics — 358 questions across 5 official examination dates and shifts.',
    status: 'active',
    accentColor: 'from-blue-500 to-cyan-500',
    glowBorder: 'hover:border-blue-500/70 dark:hover:border-blue-400/80',
    accentText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
  },
  {
    key: 'jee_advanced',
    label: 'JEE Advanced',
    sublabel: 'Full Archive Live • 994 Questions',
    description: 'Physics (362), Chemistry (309), and Mathematics (323) across 95 chapters with KaTeX formulas and diagrams.',
    status: 'active',
    accentColor: 'from-purple-500 to-indigo-600',
    glowBorder: 'hover:border-purple-500/70 dark:hover:border-purple-400/80',
    accentText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
  },
  {
    key: 'wbjee',
    label: 'WBJEE',
    sublabel: '2019–2024 Archive Live • 210 Questions',
    description: 'Mathematics (Paper I), Physics & Chemistry (Paper II) with Category 1, 2, 3 marking and topic battles.',
    status: 'active',
    accentColor: 'from-violet-500 to-pink-500',
    glowBorder: 'hover:border-violet-500/70 dark:hover:border-violet-400/80',
    accentText: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
  },
  {
    key: 'neet',
    label: 'NEET UG',
    sublabel: '2019–2024 Archive Live • 700 Questions',
    description: 'Physics (175), Chemistry (175), Botany (175), Zoology (175) with Section A & B (+4 / -1) and NCERT solutions.',
    status: 'active',
    accentColor: 'from-emerald-500 to-teal-600',
    glowBorder: 'hover:border-emerald-500/70 dark:hover:border-emerald-400/80',
    accentText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
  },
];

export default function ExplorePYQPage() {
  const [view, setView] = useState<ExamView>('home');
  const [showAdminUpload, setShowAdminUpload] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6 md:py-8 space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Explore PYQ</h1>
          <p className="text-stone-500 mt-1">
            Previous Year Questions — organized by exam, date and subject.
          </p>
        </div>
        <button
          onClick={() => setShowAdminUpload((s) => !s)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:shadow-sm hover:border-brand-300 transition-all text-sm font-semibold text-stone-600 dark:text-stone-300 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          Import PDFs
        </button>
      </motion.div>

      {/* Admin Upload Panel */}
      <AnimatePresence>
        {showAdminUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Upload className="w-4 h-4 text-brand-500" />
                  Import JEE Main 2025 PDF Papers
                </h2>
                <button
                  onClick={() => setShowAdminUpload(false)}
                  className="text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  Close
                </button>
              </div>
              <PyqAdminUpload onComplete={() => {
                setShowAdminUpload(false);
                // Trigger re-render of explorer if visible
                if (view === 'jee_main') {
                  setView('home');
                  setTimeout(() => setView('jee_main'), 50);
                }
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="space-y-4"
          >
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                Select Examination
              </p>
              <div className="grid sm:grid-cols-2 gap-4 items-stretch">
                {examEntries.map((entry, i) => (
                  <motion.div
                    key={entry.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="h-full"
                  >
                    <motion.button
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.985 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      disabled={entry.status === 'soon'}
                      onClick={() => entry.status === 'active' && setView(entry.key)}
                      className={cn(
                        'relative w-full h-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all overflow-hidden flex flex-col justify-between',
                        entry.status === 'active'
                          ? cn(
                              'bg-white dark:bg-[#111A2E] border-stone-200/90 dark:border-[#243556] cursor-pointer group shadow-xs hover:shadow-md dark:hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.5)]',
                              entry.glowBorder
                            )
                          : 'border-dashed border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 cursor-not-allowed opacity-60'
                      )}
                    >
                      {/* Top Animated Color Bar */}
                      <div
                        className={cn(
                          'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity duration-300',
                          entry.accentColor
                        )}
                      />

                      {/* Card Content Top */}
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <h3
                            className={cn(
                              'text-base sm:text-lg font-extrabold text-stone-900 dark:text-white tracking-tight transition-colors',
                              entry.accentText
                            )}
                          >
                            {entry.label}
                          </h3>

                          {/* Live Pulse Badge */}
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60 shadow-2xs shrink-0">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                            </span>
                            <span>Live</span>
                          </span>
                        </div>

                        <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-2">
                          {entry.sublabel}
                        </p>

                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-2">
                          {entry.description}
                        </p>
                      </div>

                      {/* Card Bottom / Arrow Row */}
                      <div className="pt-3.5 mt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                          Explore PYQ Archive
                        </span>
                        <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : view === 'wbjee' ? (
          <motion.div
            key="wbjee"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-4">
              <button
                onClick={() => setView('home')}
                className="hover:text-brand-600 font-medium cursor-pointer transition-colors"
              >
                Explore PYQ
              </button>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-bold text-foreground">
                WBJEE — Official PYQ Archive (2019–2024)
              </span>
            </div>

            <WbjeePyqExplorer onBack={() => setView('home')} />
          </motion.div>
        ) : view === 'neet' ? (
          <motion.div
            key="neet"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-4">
              <button
                onClick={() => setView('home')}
                className="hover:text-brand-600 font-medium cursor-pointer transition-colors"
              >
                Explore PYQ
              </button>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-bold text-foreground">
                NEET UG — Official PYQ Archive (2019–2024)
              </span>
            </div>

            <NeetPyqExplorer onBack={() => setView('home')} />
          </motion.div>
        ) : (
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-4">
              <button
                onClick={() => setView('home')}
                className="hover:text-brand-600 font-medium cursor-pointer transition-colors"
              >
                Explore PYQ
              </button>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-bold text-foreground">
                {view === 'jee_advanced' ? 'JEE Advanced — Chapter-wise Archive' : 'JEE Main 2025 — B.Tech'}
              </span>
            </div>

            <JeeMainPyqExplorer
              examName={view === 'jee_advanced' ? 'JEE Advanced' : 'JEE Main'}
              defaultTitle={view === 'jee_advanced' ? 'JEE Advanced — Chapter-wise Archive (PCM)' : 'JEE Main 2025 — B.Tech'}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

