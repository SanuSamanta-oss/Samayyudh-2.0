'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronRight,
  Search,
  X,
  BookOpen,
  Edit3,
  Globe,
  Sliders,
  Check,
  Award,
} from 'lucide-react';
import {
  UPSC_MAINS_PAPERS,
  UPSC_OPTIONAL_SUBJECTS,
  UPSC_INDIAN_LANGUAGES,
  UpscPaper,
  UpscTopic,
  UpscOptionalSubject,
} from '@/data/upsc/upscSyllabus';

interface UpscMainsWorkspaceProps {
  onBackToStages: () => void;
  onSelectTopic: (topic: UpscTopic, paper: UpscPaper) => void;
}

export function UpscMainsWorkspace({
  onBackToStages,
  onSelectTopic,
}: UpscMainsWorkspaceProps) {
  const papers = UPSC_MAINS_PAPERS;
  const [activePaperId, setActivePaperId] = useState<string>('paper-1'); // Default to Essay or GS I
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Hindi');
  const [selectedOptionalId, setSelectedOptionalId] = useState<string>('geography');
  const [optionalPaperNumber, setOptionalPaperNumber] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [optionalSearchQuery, setOptionalSearchQuery] = useState('');
  const [isOptionalSelectorOpen, setIsOptionalSelectorOpen] = useState(false);

  const activePaper = papers.find((p) => p.id === activePaperId) || papers[0];
  const isOptionalPaper = activePaperId === 'optional';
  const selectedOptional =
    UPSC_OPTIONAL_SUBJECTS.find((o) => o.id === selectedOptionalId) ||
    UPSC_OPTIONAL_SUBJECTS[0];

  const currentOptionalPaperTopics: UpscTopic[] =
    optionalPaperNumber === 1
      ? selectedOptional.paper1Topics
      : selectedOptional.paper2Topics;

  const displayedTopics: UpscTopic[] = isOptionalPaper
    ? currentOptionalPaperTopics
    : activePaper.topics;

  const filteredTopics = displayedTopics.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOptionalSubjects = UPSC_OPTIONAL_SUBJECTS.filter((s) =>
    s.name.toLowerCase().includes(optionalSearchQuery.toLowerCase())
  );

  const virtualOptionalPaper: UpscPaper = {
    id: `opt-${selectedOptional.id}-${optionalPaperNumber}`,
    code: `OPTIONAL-${optionalPaperNumber}`,
    name: `${selectedOptional.name} — Paper ${optionalPaperNumber === 1 ? 'I' : 'II'}`,
    title: `Optional Subject: ${selectedOptional.name} (Paper ${optionalPaperNumber === 1 ? 'I' : 'II'})`,
    stage: 'MAINS',
    totalMarks: 250,
    durationHours: 3,
    type: 'DESCRIPTIVE',
    topics: currentOptionalPaperTopics,
  };

  return (
    <div className="space-y-6">
      {/* ── Top Bar ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <button
          onClick={onBackToStages}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-foreground transition-colors cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to UPSC Stages</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-400 font-medium">Stage 2:</span>
          <span className="font-bold text-foreground">9 Papers · 1750 Merit Marks + 600 Qualifying</span>
        </div>
      </div>

      {/* ── Mains Header & Architecture Banner ────────────────── */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-xs space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-lg text-xs font-black tracking-wider bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
            STAGE 2
          </span>
          <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-0.5 rounded-md border border-brand-200 dark:border-brand-800">
            DESCRIPTIVE WRITTEN EXAMINATION
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            UPSC CIVIL SERVICES — MAIN EXAMINATION
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-3xl leading-relaxed mt-1">
            Comprehensive subjective test consisting of 2 qualifying language papers (Paper A &amp; Paper B) and 7 merit-ranking papers (Essay, GS I, GS II, GS III, GS IV, and 2 Optional Papers) totaling 1750 marks.
          </p>
        </div>

        {/* Paper Groups Info Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-surface/50 border border-border/80 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-foreground">Qualifying Papers (A &amp; B)</p>
              <p className="text-[11px] text-stone-400">Indian Language &amp; English · 300 Marks each (25% pass mark)</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-border">
              Non-Merit
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface/50 border border-border/80 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-foreground">Merit-Ranking Papers (I to VII)</p>
              <p className="text-[11px] text-stone-400">Essay, GS I–IV, Optional I &amp; II · 250 Marks each (1750 Total)</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Rank Deciding
            </span>
          </div>
        </div>
      </div>

      {/* ── Mains Paper Navigation Tabs (Equal Balanced Size) ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Select Mains Paper
          </span>
          <span className="text-[11px] font-medium text-stone-400">
            {isOptionalPaper ? `${selectedOptional.name} Paper ${optionalPaperNumber}` : activePaper.name}
          </span>
        </div>

        <div className="p-1.5 rounded-2xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full">
          {/* Qualifying Papers */}
          <button
            onClick={() => { setActivePaperId('paper-a'); setSearchQuery(''); }}
            className={`relative flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center truncate shrink-0 ${
              activePaperId === 'paper-a'
                ? 'text-white'
                : 'text-stone-700 dark:text-stone-300 hover:text-foreground hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
            }`}
          >
            {activePaperId === 'paper-a' && (
              <motion.div
                layoutId="upscMainsActivePaperPill"
                className="absolute inset-0 rounded-xl bg-brand-600 dark:bg-brand-500 shadow-md ring-1 ring-brand-400/30"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">Paper A: Lang</span>
          </button>

          <button
            onClick={() => { setActivePaperId('paper-b'); setSearchQuery(''); }}
            className={`relative flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center truncate shrink-0 ${
              activePaperId === 'paper-b'
                ? 'text-white'
                : 'text-stone-700 dark:text-stone-300 hover:text-foreground hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
            }`}
          >
            {activePaperId === 'paper-b' && (
              <motion.div
                layoutId="upscMainsActivePaperPill"
                className="absolute inset-0 rounded-xl bg-brand-600 dark:bg-brand-500 shadow-md ring-1 ring-brand-400/30"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">Paper B: Eng</span>
          </button>

          {/* Merit Papers I to V */}
          {[
            { id: 'paper-1', label: 'Paper I: Essay' },
            { id: 'paper-2', label: 'Paper II: GS I' },
            { id: 'paper-3', label: 'Paper III: GS II' },
            { id: 'paper-4', label: 'Paper IV: GS III' },
            { id: 'paper-5', label: 'Paper V: GS IV' },
          ].map((item) => {
            const isActive = activePaperId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActivePaperId(item.id); setSearchQuery(''); }}
                className={`relative flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center truncate shrink-0 ${
                  isActive
                    ? 'text-white'
                    : 'text-stone-700 dark:text-stone-300 hover:text-foreground hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="upscMainsActivePaperPill"
                    className="absolute inset-0 rounded-xl bg-brand-600 dark:bg-brand-500 shadow-md ring-1 ring-brand-400/30"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}

          {/* Optional Subject Tab */}
          <button
            onClick={() => { setActivePaperId('optional'); setSearchQuery(''); }}
            className={`relative flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center truncate shrink-0 ${
              isOptionalPaper
                ? 'text-white'
                : 'text-stone-700 dark:text-stone-300 hover:text-foreground hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
            }`}
          >
            {isOptionalPaper && (
              <motion.div
                layoutId="upscMainsActivePaperPill"
                className="absolute inset-0 rounded-xl bg-brand-600 dark:bg-brand-500 shadow-md ring-1 ring-brand-400/30"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">Optional (VI &amp; VII)</span>
          </button>
        </div>
      </div>

      {/* ── Language Selector for Paper A ─────────────────────── */}
      {activePaperId === 'paper-a' && (
        <div className="p-4 rounded-2xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-foreground">Select Indian Language (8th Schedule)</p>
              <p className="text-[11px] text-stone-400">22 constitutionally recognized languages supported</p>
            </div>
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-surface text-xs font-bold text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          >
            {UPSC_INDIAN_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      )}

      {/* ── Optional Subject Dedicated Control Panel ──────────── */}
      {isOptionalPaper && (
        <div className="p-5 rounded-3xl border border-border bg-card space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                Official Optional Subject Selection
              </span>
              <h3 className="text-lg font-black text-foreground mt-1">
                Selected: {selectedOptional.name} ({selectedOptional.code})
              </h3>
            </div>

            <button
              onClick={() => setIsOptionalSelectorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-surface hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold text-foreground cursor-pointer transition-colors shrink-0"
            >
              <Sliders className="w-3.5 h-3.5 text-brand-600" />
              <span>Change Optional ({UPSC_OPTIONAL_SUBJECTS.length} Subjects)</span>
            </button>
          </div>

          {/* Equal Balanced Optional Paper I & II Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setOptionalPaperNumber(1); setSearchQuery(''); }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                optionalPaperNumber === 1
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-surface border border-border text-stone-600 dark:text-stone-300 hover:border-brand-300'
              }`}
            >
              Paper VI: {selectedOptional.name} — Paper I
            </button>

            <button
              onClick={() => { setOptionalPaperNumber(2); setSearchQuery(''); }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                optionalPaperNumber === 2
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-surface border border-border text-stone-600 dark:text-stone-300 hover:border-brand-300'
              }`}
            >
              Paper VII: {selectedOptional.name} — Paper II
            </button>
          </div>
        </div>
      )}

      {/* ── Search Bar ───────────────────────────────────────── */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${isOptionalPaper ? selectedOptional.name : activePaper.name} topics...`}
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-card border border-border text-xs sm:text-sm text-foreground placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Topic Cards Grid ─────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activePaperId}-${optionalPaperNumber}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic, isOptionalPaper ? virtualOptionalPaper : activePaper)}
              className="group p-4 rounded-2xl border border-border bg-card hover:border-brand-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    TOPIC {topic.number}
                  </span>
                  <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 group-hover:underline flex items-center gap-0.5">
                    Explore PYQs <ChevronRight className="w-3 h-3" />
                  </span>
                </div>

                <h4 className="text-sm font-bold text-foreground group-hover:text-brand-600 transition-colors line-clamp-1">
                  {topic.name}
                </h4>

                {topic.description && (
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-400 font-medium">
                  Descriptive Answer Bank
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-600">
                  <Edit3 className="w-3 h-3" />
                  <span>Draft Answer</span>
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ── Searchable Optional Subject Selection Modal ──────── */}
      <AnimatePresence>
        {isOptionalSelectorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOptionalSelectorOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-foreground">Select UPSC Optional Subject</h3>
                  <p className="text-xs text-stone-500">Choose from 25 official disciplines</p>
                </div>
                <button
                  onClick={() => setIsOptionalSelectorOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    value={optionalSearchQuery}
                    onChange={(e) => setOptionalSearchQuery(e.target.value)}
                    placeholder="Search optional subject (e.g., PSIR, Sociology, Geography)..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="p-4 overflow-y-auto space-y-1.5 flex-1">
                {filteredOptionalSubjects.map((sub) => {
                  const isSelected = sub.id === selectedOptionalId;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setSelectedOptionalId(sub.id);
                        setIsOptionalSelectorOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-300 dark:border-brand-700'
                          : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-foreground'
                      }`}
                    >
                      <span>{sub.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-brand-600" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

