'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Upload, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import JeeMainPyqExplorer from '@/components/pyq/JeeMainPyqExplorer';
import { PyqAdminUpload } from '@/components/pyq/PyqAdminUpload';

type ExamView = 'home' | 'jee_main' | 'jee_advanced' | 'admin_upload';

const examEntries = [
  {
    key: 'jee_main' as const,
    label: 'JEE Main',
    sublabel: '2025 B.Tech — 5 Papers Imported',
    description: 'Physics, Chemistry and Mathematics — 358 questions across 5 examination dates and shifts.',
    status: 'active' as const,
  },
  {
    key: 'jee_advanced' as const,
    label: 'JEE Advanced',
    sublabel: 'Full Archive Live — 994 Questions',
    description: 'Physics (362), Chemistry (309), and Mathematics (323) across 95 chapters with KaTeX formulas, reaction schemes & diagrams.',
    status: 'active' as const,
  },
  {
    key: 'wbjee' as const,
    label: 'WBJEE',
    sublabel: 'Coming Soon',
    description: 'West Bengal Joint Entrance Examination PYQs.',
    status: 'soon' as const,
  },
  {
    key: 'neet' as const,
    label: 'NEET UG',
    sublabel: 'Coming Soon',
    description: 'National Eligibility cum Entrance Test previous year questions.',
    status: 'soon' as const,
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
              <div className="grid sm:grid-cols-2 gap-3">
                {examEntries.map((entry, i) => (
                  <motion.div
                    key={entry.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <button
                      disabled={entry.status === 'soon'}
                      onClick={() => entry.status === 'active' && setView(entry.key)}
                      className={cn(
                        'w-full text-left p-5 rounded-2xl border transition-all',
                        entry.status === 'active'
                          ? 'border-border bg-card hover:shadow-lg hover:border-brand-200 cursor-pointer group'
                          : 'border-dashed border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 cursor-not-allowed opacity-60'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={cn(
                              'font-bold text-foreground',
                              entry.status === 'active' && 'group-hover:text-brand-600 transition-colors'
                            )}>
                              {entry.label}
                            </h3>
                            <span className={cn(
                              'text-[10px] px-2 py-0.5 rounded-full font-bold',
                              entry.status === 'active'
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                            )}>
                              {entry.status === 'active' ? 'Live' : 'Coming Soon'}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-stone-500 mb-1.5">{entry.sublabel}</p>
                          <p className="text-xs text-stone-400 leading-relaxed">{entry.description}</p>
                        </div>
                        {entry.status === 'active' && (
                          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-brand-500 shrink-0 mt-1 transition-colors" />
                        )}
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
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

