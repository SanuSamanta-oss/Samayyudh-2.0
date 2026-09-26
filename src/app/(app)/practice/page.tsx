'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Clock, Hash, Award, ChevronRight, ChevronLeft, Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EXAM_CATEGORIES, EXAM_MODES, EXAM_DURATIONS } from '@/lib/constants';
import type { ExamMode } from '@/types';

export default function PracticePage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: exam, 1: mode, 2: duration, 3: confirm
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<ExamMode | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [customCount, setCustomCount] = useState(20);

  const examCategory = EXAM_CATEGORIES.find(c => c.code === selectedExam);
  const modeConfig = EXAM_MODES.find(m => m.mode === selectedMode);
  const questionCount = modeConfig?.questionCount || customCount;
  const durationConfig = EXAM_DURATIONS.find(d => d.seconds === selectedDuration);

  const handleStart = () => {
    // Build session params and navigate to exam
    const params = new URLSearchParams({
      exam: selectedExam || 'UNIVERSITY',
      mode: selectedMode || 'quick_battle',
      questions: String(questionCount),
      duration: String(selectedDuration || 3600),
    });
    router.push(`/exam/session?${params.toString()}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6 md:py-10">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Start a Battle</h1>
        <p className="text-stone-500 mt-1">Set up your exam session</p>
      </motion.div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {['Exam', 'Mode', 'Duration', 'Ready'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              className={cn(
                'w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all',
                i === step && 'bg-gradient-brand text-white shadow-md',
                i < step && 'bg-brand-100 text-brand-700 cursor-pointer',
                i > step && 'bg-stone-100 text-stone-400',
              )}
            >
              {i + 1}
            </button>
            {i < 3 && <div className={cn('w-8 h-0.5 rounded', i < step ? 'bg-brand-300' : 'bg-stone-200')} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Step 0: Choose Exam */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Choose Your Exam</h2>
            <div className="grid grid-cols-2 gap-3">
              {EXAM_CATEGORIES.map((cat) => (
                <button
                  key={cat.code}
                  onClick={() => { setSelectedExam(cat.code); setStep(1); }}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left',
                    selectedExam === cat.code
                      ? 'border-brand-500 bg-brand-50 shadow-sm'
                      : 'border-border bg-white hover:border-brand-200 hover:shadow-sm',
                  )}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{cat.name}</p>
                    <p className="text-xs text-stone-500 truncate">{cat.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Choose Mode */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Choose Mode</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXAM_MODES.filter(m => ['quick_battle', 'practice_battle', 'half_century', 'full_century', 'custom'].includes(m.mode)).map((mode) => (
                <button
                  key={mode.mode}
                  onClick={() => { setSelectedMode(mode.mode); setStep(2); }}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left',
                    selectedMode === mode.mode
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-border bg-white hover:border-brand-200',
                  )}
                >
                  <span className="text-2xl">{mode.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{mode.label}</p>
                    <p className="text-xs text-stone-500">{mode.description}</p>
                    {mode.questionCount > 0 && (
                      <p className="text-xs text-brand-600 font-medium mt-0.5">{mode.questionCount} questions</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
            {selectedMode === 'custom' && (
              <div className="bg-white rounded-xl border border-border p-4">
                <label className="text-sm font-medium text-foreground block mb-2">Number of Questions</label>
                <input
                  type="number"
                  value={customCount}
                  onChange={(e) => setCustomCount(Math.min(100, Math.max(1, Number(e.target.value))))}
                  min={1} max={100}
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
                <button
                  onClick={() => setStep(2)}
                  className="mt-3 w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-brand"
                >
                  Continue
                </button>
              </div>
            )}
            <button onClick={() => setStep(0)} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          </div>
        )}

        {/* Step 2: Choose Duration */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Set Duration</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {EXAM_DURATIONS.map((dur) => (
                <button
                  key={dur.seconds}
                  onClick={() => { setSelectedDuration(dur.seconds); setStep(3); }}
                  className={cn(
                    'flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all',
                    selectedDuration === dur.seconds
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-border bg-white hover:border-brand-200',
                  )}
                >
                  <Clock className="w-5 h-5 text-brand-600" />
                  <span className="text-sm font-semibold text-foreground">{dur.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Battle Summary</h2>
            <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-stone-500">Exam</span>
                <span className="text-sm font-semibold flex items-center gap-2">
                  {examCategory?.icon} {examCategory?.name || 'University'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-stone-500">Mode</span>
                <span className="text-sm font-semibold flex items-center gap-2">
                  {modeConfig?.icon} {modeConfig?.label}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-stone-500 flex items-center gap-1"><Hash className="w-3.5 h-3.5" /> Questions</span>
                <span className="text-sm font-semibold">{questionCount}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-stone-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Duration</span>
                <span className="text-sm font-semibold">{durationConfig?.label}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-stone-500 flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Estimated Marks</span>
                <span className="text-sm font-semibold">~{questionCount * 5}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-stone-600 border border-border hover:bg-stone-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
              </button>
              <button
                onClick={handleStart}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/25"
              >
                Start Battle <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
