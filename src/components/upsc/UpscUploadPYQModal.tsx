'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  FileText,
  Plus,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface UpscUploadPYQModalProps {
  isOpen: boolean;
  onClose: () => void;
  stageName: string;
  paperName: string;
  topicName: string;
  defaultType?: 'OBJECTIVE' | 'DESCRIPTIVE';
}

export function UpscUploadPYQModal({
  isOpen,
  onClose,
  stageName,
  paperName,
  topicName,
  defaultType = 'OBJECTIVE',
}: UpscUploadPYQModalProps) {
  const [tab, setTab] = useState<'single' | 'bulk' | 'pdf'>('single');
  const [examYear, setExamYear] = useState('2024');
  const [questionFormat, setQuestionFormat] = useState(defaultType);
  const [marks, setMarks] = useState(defaultType === 'OBJECTIVE' ? '2' : '15');
  const [negativeMarks, setNegativeMarks] = useState(defaultType === 'OBJECTIVE' ? '0.66' : '0');
  const [wordLimit, setWordLimit] = useState('250');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState<number>(0);
  const [modelAnswer, setModelAnswer] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleOptionChange = (idx: number, val: string) => {
    const next = [...options];
    next[idx] = val;
    setOptions(next);
  };

  const handleSave = (e: React.FormEvent) => {
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

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
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  UPSC PYQ Integration
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {stageName} • {paperName}
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground mt-0.5 truncate">
                Upload Question: {topicName}
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
              { id: 'single', label: 'Single Entry', icon: Plus },
              { id: 'bulk', label: 'Bulk JSON / CSV', icon: FileText },
              { id: 'pdf', label: 'PDF Official Paper', icon: Upload },
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
                <h4 className="text-base font-bold text-foreground">Question Schema Validated</h4>
                <p className="text-xs text-stone-500 max-w-sm">
                  Entry formatted for UPSC Civil Services question repository. Mapped to {paperName} &gt; {topicName}.
                </p>
              </div>
            ) : tab === 'single' ? (
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-amber-900 dark:text-amber-200">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-xs">UPSC Official Standard Adherence</p>
                    <p className="text-[11px] opacity-80 mt-0.5">
                      Verify examination year, official question numbering, and official answer key or model answer structure.
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
                    <label className="block text-stone-500 font-medium mb-1">Question Format</label>
                    <select
                      value={questionFormat}
                      onChange={(e) => {
                        const nextFmt = e.target.value as 'OBJECTIVE' | 'DESCRIPTIVE';
                        setQuestionFormat(nextFmt);
                        if (nextFmt === 'OBJECTIVE') {
                          setMarks('2');
                          setNegativeMarks('0.66');
                        } else {
                          setMarks('15');
                          setNegativeMarks('0');
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground font-medium"
                    >
                      <option value="OBJECTIVE">Objective MCQ (Prelims)</option>
                      <option value="DESCRIPTIVE">Descriptive Answer (Mains)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-500 font-medium mb-1">Marks (+ / -)</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        placeholder="Marks"
                        className="w-1/2 px-2 py-2 rounded-lg border border-border bg-surface text-foreground text-center"
                      />
                      <input
                        type="text"
                        value={negativeMarks}
                        onChange={(e) => setNegativeMarks(e.target.value)}
                        placeholder="Neg"
                        className="w-1/2 px-2 py-2 rounded-lg border border-border bg-surface text-foreground text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-500 font-medium mb-1">
                      {questionFormat === 'DESCRIPTIVE' ? 'Word Limit' : 'Difficulty'}
                    </label>
                    {questionFormat === 'DESCRIPTIVE' ? (
                      <select
                        value={wordLimit}
                        onChange={(e) => setWordLimit(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground font-medium"
                      >
                        <option value="150">150 Words (10 Marks)</option>
                        <option value="250">250 Words (15 Marks)</option>
                        <option value="1000">1000-1200 Words (Essay)</option>
                      </select>
                    ) : (
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground font-medium"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    )}
                  </div>
                </div>

                {/* Question Statement */}
                <div>
                  <label className="block text-stone-500 font-medium mb-1">
                    Question Statement
                  </label>
                  <textarea
                    rows={4}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Enter official UPSC question statement..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-stone-400 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                {/* Objective MCQ Options */}
                {questionFormat === 'OBJECTIVE' && (
                  <div className="space-y-2">
                    <label className="block text-stone-500 font-medium">Options (Select Correct)</label>
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
                          placeholder={`Option (${letter})`}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-surface text-foreground"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Model Answer / Solution */}
                <div>
                  <label className="block text-stone-500 font-medium mb-1">
                    {questionFormat === 'DESCRIPTIVE'
                      ? 'Model Answer / Structural Framework'
                      : 'Detailed Explanation & Key Takeaways'}
                  </label>
                  <textarea
                    rows={3}
                    value={modelAnswer}
                    onChange={(e) => setModelAnswer(e.target.value)}
                    placeholder={
                      questionFormat === 'DESCRIPTIVE'
                        ? 'Key points: Introduction, Core Dimensions, Government Initiatives, Way Forward...'
                        : 'Explanation, constitutional articles, committee reports...'
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground placeholder:text-stone-400 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-brand text-white font-bold shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Save to UPSC Question Bank
                  </button>
                </div>
              </form>
            ) : tab === 'bulk' ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Bulk JSON / CSV Ingestion</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                    Upload structured question set mapped to {paperName} &gt; {topicName}. Supports multi-statement questions, match lists, and descriptive answer guidelines.
                  </p>
                </div>
                <div className="border-2 border-dashed border-border rounded-xl p-6 hover:border-brand-300 transition-colors cursor-pointer bg-surface/30">
                  <Upload className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-foreground">Click to upload or drag and drop</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">JSON, CSV or TSV (max 15MB)</p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Official UPSC PDF Question Paper Ingestion</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                    Upload scanned or digital official UPSC question papers. The ingestion pipeline extracts questions and parses them into this topic.
                  </p>
                </div>
                <div className="border-2 border-dashed border-border rounded-xl p-6 hover:border-blue-300 transition-colors cursor-pointer bg-surface/30">
                  <Upload className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-foreground">Upload Official Question Paper PDF</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">Supports papers up to 50MB</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

