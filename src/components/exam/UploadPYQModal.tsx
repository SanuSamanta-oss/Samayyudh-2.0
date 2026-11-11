'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  FileText,
  Plus,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { SmoothSelect } from '@/components/ui/SmoothSelect';

interface UploadPYQModalProps {
  isOpen: boolean;
  onClose: () => void;
  examName: string;
  subjectName: string;
  chapterName: string;
}

export function UploadPYQModal({
  isOpen,
  onClose,
  examName,
  subjectName,
  chapterName,
}: UploadPYQModalProps) {
  const [tab, setTab] = useState<'single' | 'bulk' | 'pdf'>('single');
  const [questionText, setQuestionText] = useState('');
  const [examYear, setExamYear] = useState('2024');
  const [questionType, setQuestionType] = useState('mcq_single');
  const [difficulty, setDifficulty] = useState('medium');
  const [marks, setMarks] = useState('4');
  const [negativeMarks, setNegativeMarks] = useState('1');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState<number>(0);
  const [explanation, setExplanation] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleOptionChange = (idx: number, val: string) => {
    const next = [...options];
    next[idx] = val;
    setOptions(next);
  };

  const handleSavePlaceholder = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                  Admin PYQ Integration
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {examName} • {subjectName}
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground mt-0.5 truncate">
                Upload Questions for: {chapterName}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="flex border-b border-border px-6 pt-3 gap-2 bg-stone-50/50 dark:bg-stone-900/30">
            {[
              { id: 'single', label: 'Single Question Entry', icon: Plus },
              { id: 'bulk', label: 'Bulk JSON / CSV', icon: FileText },
              { id: 'pdf', label: 'PDF Paper Ingestion', icon: Upload },
            ].map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as any)}
                  className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    active
                      ? 'border-brand-600 text-brand-600'
                      : 'border-transparent text-stone-500 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto space-y-4">
            {savedSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-foreground">Schema Form Validated</h4>
                <p className="text-xs text-stone-500 max-w-sm">
                  Placeholder saved. When Supabase migration is linked, questions will persist directly into the official PYQ bank for this chapter.
                </p>
              </div>
            ) : tab === 'single' ? (
              <form onSubmit={handleSavePlaceholder} className="space-y-4 text-xs">
                {/* Notice banner */}
                <div className="flex items-start gap-2 p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40 text-purple-900 dark:text-purple-200">
                  <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-xs">Strict Zero-Fake-PYQ Policy</p>
                    <p className="text-[11px] opacity-80 mt-0.5">
                      Only verified Previous Year Questions with official exam years and answer keys are to be committed.
                    </p>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-stone-500 font-medium mb-1">Exam Year</label>
                    <input
                      type="text"
                      value={examYear}
                      onChange={(e) => setExamYear(e.target.value)}
                      placeholder="e.g. 2024"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-medium mb-1">Question Type</label>
                    <SmoothSelect
                      value={questionType}
                      onChange={setQuestionType}
                      ariaLabel="Question Type"
                      size="sm"
                      className="w-full"
                      options={[
                        { value: 'mcq_single', label: 'Single Correct MCQ' },
                        { value: 'mcq_multi', label: 'Multiple Correct MSQ' },
                        { value: 'numerical', label: 'Numerical Answer Type' },
                        { value: 'integer', label: 'Integer Type' },
                        { value: 'assertion', label: 'Assertion & Reason' },
                        { value: 'match', label: 'Match the Following' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-medium mb-1">Difficulty</label>
                    <SmoothSelect
                      value={difficulty}
                      onChange={setDifficulty}
                      ariaLabel="Difficulty"
                      size="sm"
                      align="right"
                      className="w-full"
                      options={[
                        { value: 'easy', label: 'Easy' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'hard', label: 'Hard' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-medium mb-1">Marks (+ / -)</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        placeholder="+4"
                        className="w-1/2 px-2 py-2 rounded-lg border border-border bg-surface text-foreground text-center"
                      />
                      <input
                        type="text"
                        value={negativeMarks}
                        onChange={(e) => setNegativeMarks(e.target.value)}
                        placeholder="-1"
                        className="w-1/2 px-2 py-2 rounded-lg border border-border bg-surface text-foreground text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Question Statement */}
                <div>
                  <label className="block text-stone-500 font-medium mb-1">
                    Question Statement (Supports LaTeX math syntax)
                  </label>
                  <textarea
                    rows={3}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Enter full question text or LaTeX expression..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-stone-400 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                {/* MCQ Options */}
                {questionType.startsWith('mcq') && (
                  <div className="space-y-2">
                    <label className="block text-stone-500 font-medium">Options (Select correct choice)</label>
                    {['A', 'B', 'C', 'D'].map((letter, idx) => (
                      <div key={letter} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCorrectOption(idx)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center ${
                            correctOption === idx
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'border-border bg-surface text-stone-500 hover:border-emerald-300'
                          }`}
                        >
                          {letter}
                        </button>
                        <input
                          type="text"
                          value={options[idx]}
                          onChange={(e) => handleOptionChange(idx, e.target.value)}
                          placeholder={`Option ${letter}`}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-surface text-foreground"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Explanation */}
                <div>
                  <label className="block text-stone-500 font-medium mb-1">
                    Detailed Solution &amp; Answer Rationale
                  </label>
                  <textarea
                    rows={2}
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Step-by-step derivation or solution key..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-stone-400 text-xs"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-brand text-white font-bold shadow-md hover:opacity-90 transition-opacity"
                  >
                    Save to PYQ Bank
                  </button>
                </div>
              </form>
            ) : tab === 'bulk' ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center mx-auto border border-purple-200 dark:border-purple-800">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Bulk JSON / CSV Upload</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                    Upload structured JSON or CSV containing questions mapped to chapter <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-[11px]">{chapterName}</code>.
                  </p>
                </div>
                <div className="border-2 border-dashed border-border rounded-xl p-6 hover:border-brand-300 transition-colors cursor-pointer bg-surface/30">
                  <Upload className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-foreground">Click to upload or drag and drop</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">JSON, CSV or TSV (max 10MB)</p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">PyMuPDF Paper Ingestion</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                    Integrated with SamayYudh <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-[11px]">data_manager</code>. PDF papers will be parsed, cleaned with unicode NFKC, and categorized into this chapter.
                  </p>
                </div>
                <div className="border-2 border-dashed border-border rounded-xl p-6 hover:border-blue-300 transition-colors cursor-pointer bg-surface/30">
                  <Upload className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-foreground">Upload Official PDF Question Paper</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">Scanned or Digital PDF (up to 50MB)</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

