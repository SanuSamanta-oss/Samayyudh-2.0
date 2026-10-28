'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hash,
  Search,
  Copy,
  Check,
  Globe,
  Zap,
  Flame,
  Atom,
  Layers,
  X,
  Code2,
} from 'lucide-react';
import { physicalConstants } from '@/data/formulas/constants';
import { MathRenderer } from './MathRenderer';
import type { ConstantCategory, PhysicalConstant } from '@/types/formulas';
import { cn } from '@/lib/utils';

const categoryTabs: { id: ConstantCategory; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All Constants', icon: Layers },
  { id: 'universal', label: 'Universal & Fundamental', icon: Globe },
  { id: 'electromagnetism', label: 'Electromagnetism', icon: Zap },
  { id: 'thermodynamics', label: 'Thermodynamics & Gases', icon: Flame },
  { id: 'atomic-nuclear', label: 'Atomic & Nuclear', icon: Atom },
];

export function PhysicalConstantsSection() {
  const [activeCategory, setActiveCategory] = useState<ConstantCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredConstants = useMemo(() => {
    return physicalConstants.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.symbol.toLowerCase().includes(query) ||
        item.unit.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleCopy = async (item: PhysicalConstant) => {
    try {
      const copyText = `${item.name} (${item.symbol}): ${item.value} ${item.unit} | Formula: ${item.formulaLatex}`;
      await navigator.clipboard.writeText(copyText);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] p-6 md:p-8 shadow-xs"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/80 mb-3">
              <Hash className="w-3.5 h-3.5" />
              <span>SI Physical Constants Database</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Physical Constants &amp; Defining Formulas
            </h2>
            <p className="mt-1 text-sm md:text-base text-slate-600 dark:text-slate-300 font-normal">
              Standard universal values, governing relational equations, SI units, and dimensional formulas.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              {physicalConstants.length} Total Constants
            </span>
          </div>
        </div>

        {/* Dedicated Category Tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 border-t border-slate-200/80 dark:border-slate-800 pt-5 scrollbar-none">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon;
            const count =
              tab.id === 'all'
                ? physicalConstants.length
                : physicalConstants.filter((c) => c.category === tab.id).length;
            const isActive = activeCategory === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border shrink-0',
                  isActive
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'text-[10px] font-bold px-1.5 py-0.2 rounded-full',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter constants by name, symbol, unit, or description..."
          className="w-full pl-10 pr-10 py-2.5 rounded-2xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-2xs font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            type="button"
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Constants Grid */}
      {filteredConstants.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center bg-white dark:bg-[#111A2E]">
          <Search className="w-8 h-8 mx-auto text-slate-400 mb-3" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            No physical constant found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto font-medium">
            No constant matched &quot;{searchQuery}&quot;. Try clearing the search query or selecting a different tab.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Show All Constants
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConstants.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111A2E] p-5 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Symbol Badge, Name, Category, Copy Action */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="min-w-[42px] h-[42px] rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/80 flex items-center justify-center px-2 text-indigo-700 dark:text-indigo-300 font-bold shrink-0">
                      <MathRenderer
                        latex={item.symbolLatex}
                        displayMode={false}
                        formulaId={`sym-${item.id}`}
                        fallbackText={item.symbol}
                        className="text-base font-bold text-indigo-700 dark:text-indigo-300"
                      />
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200/50 dark:border-indigo-800/50">
                          {item.category.replace('-', ' & ')}
                        </span>
                        {item.dimensions && (
                          <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            Dim: {item.dimensions}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(item)}
                    type="button"
                    title="Copy constant details"
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Proper Defining Formula Display */}
                <div className="my-3.5 p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-2xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                    <span>Governing Formula</span>
                    <span className="text-slate-500 font-normal lowercase font-sans">typeset definition</span>
                  </div>
                  <div className="py-2 text-center text-slate-900 dark:text-white">
                    <MathRenderer
                      latex={item.formulaLatex}
                      displayMode={true}
                      formulaId={`formula-${item.id}`}
                      className="text-lg sm:text-xl md:text-2xl font-bold"
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-3">
                  {item.description}
                </p>
              </div>

              {/* Numerical Value and Unit Strip */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                    SI Value
                  </span>
                  <div className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white font-mono flex items-center gap-1">
                    <MathRenderer
                      latex={item.valueLatex}
                      displayMode={false}
                      formulaId={`val-${item.id}`}
                      fallbackText={item.value}
                      className="font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                    SI Units
                  </span>
                  <div className="font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 inline-block font-mono text-xs">
                    <MathRenderer
                      latex={item.unitLatex}
                      displayMode={false}
                      formulaId={`unit-${item.id}`}
                      fallbackText={item.unit}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
