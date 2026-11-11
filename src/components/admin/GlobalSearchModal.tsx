'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  FileQuestion,
  FolderOpen,
  ClipboardCheck,
  GraduationCap,
  Users,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import type { AdminSectionId, GlobalSearchResult } from '@/types/admin';

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (section: AdminSectionId) => void;
}

const CATEGORY_LABELS: Record<GlobalSearchResult['category'], string> = {
  questions: 'Questions',
  resources: 'Resources',
  assignments: 'Assignments',
  classrooms: 'Classrooms',
  groups: 'Private Groups',
  students: 'Students & Users',
};

const CATEGORY_ICONS: Record<GlobalSearchResult['category'], typeof Search> = {
  questions: FileQuestion,
  resources: FolderOpen,
  assignments: ClipboardCheck,
  classrooms: GraduationCap,
  groups: Users,
  students: UserCheck,
};

export function GlobalSearchModal({ open, onClose, onNavigate }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }

    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = (await res.json()) as { results?: GlobalSearchResult[] };
          setResults(data.results || []);
        }
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(handle);
  }, [query, open]);

  const grouped = results.reduce<Record<string, GlobalSearchResult[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="relative z-10 w-full max-w-2xl rounded-3xl bg-white dark:bg-[#111A2E] shadow-[0_28px_72px_-12px_rgba(15,23,42,0.35)] overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 bg-stone-50/80 dark:bg-[#162032]">
              <Search className="w-5 h-5 text-[#6D28D9] dark:text-[#A78BFA] shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.trim().length < 2) setResults([]);
                }}
                placeholder="Search questions, PDFs, assignments, classrooms, @username or SY-..."
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close global search"
                className="p-1.5 rounded-xl bg-white dark:bg-[#111A2E] text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {query.trim().length < 2 ? (
                <div className="py-10 text-center text-xs text-slate-500 dark:text-slate-400">
                  Type at least 2 characters to search across the Command Center.
                </div>
              ) : loading ? (
                <div className="py-10 text-center text-xs text-slate-500 dark:text-slate-400">
                  Searching across indexed entities...
                </div>
              ) : results.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-500 dark:text-slate-400">
                  No matching questions, resources, classrooms, or users found.
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(grouped).map(([category, items]) => {
                    const Icon =
                      CATEGORY_ICONS[category as GlobalSearchResult['category']] || Search;
                    return (
                      <div key={category}>
                        <p className="px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {CATEGORY_LABELS[category as GlobalSearchResult['category']] || category}
                        </p>
                        <div className="space-y-1">
                          {items.map((item) => (
                            <button
                              key={`${category}-${item.id}`}
                              type="button"
                              onClick={() => {
                                onNavigate(item.section);
                                onClose();
                              }}
                              className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl bg-stone-50/70 dark:bg-[#162032]/70 hover:bg-[#EAE6F5] dark:hover:bg-[#231B3E] text-left transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#111A2E] text-[#6D28D9] dark:text-[#C4B5FD] flex items-center justify-center shrink-0">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {item.title}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {item.subtitle}
                                  </p>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

