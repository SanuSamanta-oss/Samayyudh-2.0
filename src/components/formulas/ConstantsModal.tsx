'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Search, Hash, Globe, Zap, Flame, Atom, Layers, ExternalLink } from 'lucide-react';
import { physicalConstants } from '@/data/formulas/constants';
import { MathRenderer } from './MathRenderer';
import type { ConstantCategory, PhysicalConstant } from '@/types/formulas';
import { cn } from '@/lib/utils';

interface ConstantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubjectTab?: () => void;
}

const modalTabs: { id: ConstantCategory; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'universal', label: 'Universal', icon: Globe },
  { id: 'electromagnetism', label: 'Electromagnetism', icon: Zap },
  { id: 'thermodynamics', label: 'Thermodynamics', icon: Flame },
  { id: 'atomic-nuclear', label: 'Atomic & Nuclear', icon: Atom },
];

export function ConstantsModal({ isOpen, onClose, onSelectSubjectTab }: ConstantsModalProps) {
  const [activeCategory, setActiveCategory] = useState<ConstantCategory>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return physicalConstants.filter((c) => {
      const matchesCategory =
        activeCategory === 'all' || c.category === activeCategory;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q) ||
        c.unit.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const handleCopy = async (item: PhysicalConstant) => {
    try {
      await navigator.clipboard.writeText(`${item.name} (${item.symbol}): ${item.value} ${item.unit} | Formula: ${item.formulaLatex}`);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // fallback
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl max-h-[88vh] flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] shadow-2xl overflow-hidden z-10"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/80 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
                  <Hash className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Physical Constants Reference
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Standard universal constants, defining formulas, and SI units
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onSelectSubjectTab && (
                  <button
                    onClick={() => {
                      onClose();
                      onSelectSubjectTab();
                    }}
                    type="button"
                    title="Open Full Constants Dashboard"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/80 hover:bg-indigo-100 transition-colors"
                  >
                    <span>Full Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  type="button"
                  aria-label="Close constants modal"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Category Tabs & Search Bar */}
            <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 space-y-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {modalTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeCategory === tab.id;
                  const count =
                    tab.id === 'all'
                      ? physicalConstants.length
                      : physicalConstants.filter((c) => c.category === tab.id).length;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategory(tab.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0',
                        isActive
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                          : 'border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                      <span
                        className={cn(
                          'text-[10px] font-bold px-1.5 py-0.2 rounded-full',
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Field */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter constants by name, symbol, or unit..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* List of Constants with Defining Formulas */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-200/80 dark:divide-slate-800/80">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">
                  No matching physical constant found.
                </div>
              ) : (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#111A2E]/80 border border-slate-200 dark:border-slate-800/80 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all"
                  >
                    {/* Top Row: Symbol, Name, Category, Value, Units, Copy Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="min-w-[42px] h-[42px] rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/80 flex items-center justify-center px-2 text-indigo-700 dark:text-indigo-300 font-bold shrink-0">
                          <MathRenderer
                            latex={item.symbolLatex}
                            displayMode={false}
                            formulaId={`modal-sym-${item.id}`}
                            fallbackText={item.symbol}
                            className="text-base font-bold text-indigo-700 dark:text-indigo-300"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                              {item.name}
                            </h4>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200/50 dark:border-indigo-800/50">
                              {item.category.replace('-', ' & ')}
                            </span>
                            {item.dimensions && (
                              <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                Dim: {item.dimensions}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/50">
                        <div className="text-left sm:text-right">
                          <div className="font-mono text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                            <MathRenderer
                              latex={item.valueLatex}
                              displayMode={false}
                              formulaId={`modal-val-${item.id}`}
                              fallbackText={item.value}
                              className="font-extrabold text-slate-900 dark:text-white"
                            />
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-300 font-mono font-semibold">
                            <MathRenderer
                              latex={item.unitLatex}
                              displayMode={false}
                              formulaId={`modal-unit-${item.id}`}
                              fallbackText={item.unit}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => handleCopy(item)}
                          type="button"
                          aria-label={`Copy value and formula of ${item.name}`}
                          className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Dedicated Large Typeset Governing Formula Box */}
                    <div className="my-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200/90 dark:border-slate-800/90 overflow-x-auto shadow-2xs">
                      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200/70 dark:border-slate-800/80 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        <span>Governing Formula</span>
                        <span className="text-slate-500 font-normal lowercase font-sans">typeset definition</span>
                      </div>
                      <div className="py-1.5 text-center text-slate-900 dark:text-white">
                        <MathRenderer
                          latex={item.formulaLatex}
                          displayMode={true}
                          formulaId={`modal-formula-${item.id}`}
                          className="text-base sm:text-lg md:text-xl font-bold"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-5 font-medium">
              <span>{filtered.length} constants shown</span>
              <span>Values in standard SI units</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
