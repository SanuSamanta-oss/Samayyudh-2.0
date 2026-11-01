'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  PlusCircle,
  Swords,
  Bookmark,
  Layers,
  FileText,
  Save,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
} from 'lucide-react';
import { UpscTopic, UpscPaper } from '@/data/upsc/upscSyllabus';
import { UpscUploadPYQModal } from './UpscUploadPYQModal';

interface UpscTopicWorkspaceProps {
  stageName: string;
  paper: UpscPaper;
  topic: UpscTopic;
  onBackToPaper: () => void;
  onStartBattle: (topic: UpscTopic) => void;
}

export function UpscTopicWorkspace({
  stageName,
  paper,
  topic,
  onBackToPaper,
  onStartBattle,
}: UpscTopicWorkspaceProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Mains descriptive answer draft state
  const [answerText, setAnswerText] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  // GS IV Case study fields
  const isCaseStudyTopic = topic.id === 'gs4-cases' || topic.name.toLowerCase().includes('case studies');
  const [stakeholders, setStakeholders] = useState('');
  const [ethicalDilemmas, setEthicalDilemmas] = useState('');
  const [choices, setChoices] = useState('');
  const [justification, setJustification] = useState('');

  // Initial stats (strict empty state, zero fake data)
  const stats = {
    totalAvailable: 0,
    attempted: 0,
    correct: 0,
    incorrect: 0,
    accuracy: 0,
    bookmarked: isBookmarked ? 1 : 0,
  };

  const wordCount = answerText.trim() ? answerText.trim().split(/\s+/).length : 0;
  const wordLimit = paper.id === 'paper-1' ? 1200 : 250;

  const handleSaveDraft = () => {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const prelimsFilters = [
    { id: 'all', label: 'All Questions' },
    { id: 'years', label: 'Year-wise' },
    { id: 'attempted', label: 'Attempted' },
    { id: 'unattempted', label: 'Unattempted' },
    { id: 'bookmarked', label: 'Bookmarked' },
  ];

  const mainsFilters = [
    { id: 'all', label: 'All Questions' },
    { id: '10m', label: '10-Mark (150w)' },
    { id: '15m', label: '15-Mark (250w)' },
    { id: 'years', label: 'Year-wise' },
    { id: 'drafts', label: 'Saved Drafts' },
  ];

  const activeFilterList = paper.type === 'OBJECTIVE' ? prelimsFilters : mainsFilters;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Breadcrumb & Top Bar ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 flex-wrap">
          <button
            onClick={onBackToPaper}
            className="hover:text-brand-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>UPSC</span>
          </button>
          <span>/</span>
          <span className="text-stone-400">{stageName}</span>
          <span>/</span>
          <button onClick={onBackToPaper} className="hover:text-brand-600 transition-colors cursor-pointer">
            {paper.name}
          </button>
          <span>/</span>
          <span className="text-foreground font-bold">{topic.name}</span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isBookmarked
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-card border-border text-stone-600 dark:text-stone-300 hover:border-amber-400'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isBookmarked ? 'Bookmarked' : 'Bookmark Topic'}</span>
          </button>

          {paper.type === 'OBJECTIVE' && (
            <button
              onClick={() => onStartBattle(topic)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-brand hover:opacity-90 shadow-sm transition-all cursor-pointer"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Practice Prelims</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Topic Header ─────────────────────────────────────── */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-wider bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
            {paper.code} • TOPIC {topic.number}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            {paper.type === 'OBJECTIVE' ? 'Objective Screening' : 'Descriptive Answer Writing'}
          </span>
          {paper.isQualifying && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Qualifying Paper
            </span>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {topic.name}
        </h2>
        {topic.description && (
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-3xl">
            {topic.description}
          </p>
        )}
      </div>

      {/* ── Topic Overview Statistics (Initial Empty State) ───── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Available Questions', value: stats.totalAvailable, sub: 'in bank', color: 'text-foreground' },
          { label: 'Attempted', value: stats.attempted, sub: 'responses', color: 'text-foreground' },
          { label: paper.type === 'OBJECTIVE' ? 'Correct' : 'Reviewed', value: stats.correct, sub: 'verified', color: 'text-emerald-600 dark:text-emerald-400' },
          { label: paper.type === 'OBJECTIVE' ? 'Incorrect' : 'Incomplete', value: stats.incorrect, sub: 'review needed', color: 'text-rose-600 dark:text-rose-400' },
          { label: paper.type === 'OBJECTIVE' ? 'Accuracy' : 'Average Score', value: `${stats.accuracy}%`, sub: 'metric', color: 'text-brand-600' },
          { label: 'Bookmarked', value: stats.bookmarked, sub: 'saved for revision', color: 'text-amber-500' },
        ].map((s) => (
          <div key={s.label} className="p-3.5 rounded-2xl border border-border bg-card">
            <p className="text-[11px] font-medium text-stone-500">{s.label}</p>
            <p className={`text-xl font-black mt-0.5 ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-stone-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Filter Bar & Admin Upload Trigger ─────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card/60">
        <div className="p-1.5 rounded-2xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto">
          {activeFilterList.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'text-white'
                    : 'text-stone-700 dark:text-stone-300 hover:text-foreground hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="upscTopicFilterPill"
                    className="absolute inset-0 rounded-xl bg-brand-600 dark:bg-brand-500 shadow-md ring-1 ring-brand-400/30"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100/50 transition-colors self-start sm:self-auto cursor-pointer shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Upload PYQ Questions</span>
        </button>
      </div>

      {/* ── Case Study Interface (Only for GS IV Case Studies) ── */}
      {isCaseStudyTopic && (
        <div className="p-6 rounded-3xl border border-border bg-card space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                UPSC GS IV Dedicated Case Study Practice
              </span>
              <h3 className="text-base font-bold text-foreground mt-1">
                Ethical Dilemma &amp; Stakeholder Decision Simulator
              </h3>
            </div>
            <span className="text-xs text-stone-400 font-medium">20 Marks · 250 Words</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-500 font-bold mb-1">Key Stakeholders Involved</label>
              <textarea
                rows={3}
                value={stakeholders}
                onChange={(e) => setStakeholders(e.target.value)}
                placeholder="Identify primary and secondary stakeholders (e.g., General Public, District Administration, Local Politicians, Contractors)..."
                className="w-full p-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-stone-400"
              />
            </div>

            <div>
              <label className="block text-stone-500 font-bold mb-1">Core Ethical Dilemmas</label>
              <textarea
                rows={3}
                value={ethicalDilemmas}
                onChange={(e) => setEthicalDilemmas(e.target.value)}
                placeholder="E.g., Public Interest vs Political Pressure; Rule of Law vs Immediate Compassion; Personal Integrity vs Career Risk..."
                className="w-full p-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-stone-400"
              />
            </div>

            <div>
              <label className="block text-stone-500 font-bold mb-1">Available Choices &amp; Consequences</label>
              <textarea
                rows={3}
                value={choices}
                onChange={(e) => setChoices(e.target.value)}
                placeholder="Option 1: Comply with orders (Pros/Cons)&#10;Option 2: Outright refusal (Pros/Cons)&#10;Option 3: Legal & constructive resolution..."
                className="w-full p-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-stone-400"
              />
            </div>

            <div>
              <label className="block text-stone-500 font-bold mb-1">Recommended Course of Action &amp; Justification</label>
              <textarea
                rows={3}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Your decided administrative action, constitutional justification, prevention of future recurrence..."
                className="w-full p-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-stone-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Mains Descriptive Answer Writing Workspace ────────── */}
      {paper.type === 'DESCRIPTIVE' && !isCaseStudyTopic && (
        <div className="p-6 rounded-3xl border border-border bg-card space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                Descriptive Answer Writing Practice
              </span>
              <h3 className="text-base font-bold text-foreground mt-1">
                Draft Your Answer for: {topic.name}
              </h3>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span
                className={`font-mono font-bold ${
                  wordCount > wordLimit ? 'text-rose-600' : 'text-stone-500'
                }`}
              >
                Word Count: {wordCount} / {wordLimit}
              </span>
              <button
                onClick={handleSaveDraft}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-stone-100 dark:hover:bg-stone-800 text-foreground font-semibold cursor-pointer transition-colors"
              >
                <Save className="w-3.5 h-3.5 text-brand-600" />
                <span>{draftSaved ? 'Saved!' : 'Save Draft'}</span>
              </button>
            </div>
          </div>

          <textarea
            rows={10}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Structure your answer:
1. Introduction: Context / Constitutional Article / Defining the core premise (30-40 words)
2. Body Paragraphs: Multi-dimensional analysis (Social, Economic, Political, Environmental, Legal dimensions) with sub-headings & diagrams
3. Government Initiatives / Best Practices
4. Conclusion / Way Forward: Constructive constitutional outlook (30-40 words)..."
            className="w-full p-4 rounded-2xl border border-border bg-surface text-foreground placeholder:text-stone-400 text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all font-mono"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500 pt-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>AI Evaluation &amp; Peer Review activates when submission window opens.</span>
            </div>
            <button
              onClick={handleSaveDraft}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-brand hover:opacity-90 transition-opacity cursor-pointer self-start sm:self-auto"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Answer for Evaluation</span>
            </button>
          </div>
        </div>
      )}

      {/* ── PYQ Placeholder (Zero Fake Questions) ─────────────── */}
      <div className="p-8 sm:p-12 rounded-3xl border border-dashed border-border bg-card/40 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-100/70 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/60 dark:border-amber-800/40">
          <BookOpen className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            No Previous Year Questions uploaded yet.
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Questions for this topic will appear here once uploaded via the admin portal.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
          >
            Upload PYQ Questions
          </button>
        </div>
      </div>

      {/* ── Architecture Capability Info Card ─────────────────── */}
      <div className="p-5 rounded-2xl border border-border bg-surface/40 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <Layers className="w-4 h-4 text-brand-600" />
          <span>UPSC Question Format Ready</span>
        </div>
        <p className="text-xs text-stone-500 leading-relaxed">
          {paper.type === 'OBJECTIVE'
            ? 'The Prelims engine supports Single-Correct MCQs, Multi-Statement evaluation ("Which of the statements given above is/are correct?"), Assertion-Reasoning, Match-the-following pairs, and Passage Comprehension with standard 1/3rd negative marking.'
            : 'The Mains engine supports 10-mark (150 words) and 15-mark (250 words) questions, multi-part questions, GS IV Case Study frameworks, and Essay workspaces with real-time word counting and multi-year categorization.'}
        </p>
      </div>

      {/* Upload Modal */}
      <UpscUploadPYQModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        stageName={stageName}
        paperName={paper.name}
        topicName={topic.name}
        defaultType={paper.type}
      />
    </div>
  );
}

