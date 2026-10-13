'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Clock, ChevronRight, ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EXAM_CATEGORIES, EXAM_MODES, EXAM_DURATIONS, getExamDisplayName } from '@/lib/constants';
import { NewspaperBattleSummary } from '@/components/practice/NewspaperBattleSummary';
import { OmnitrixLoader } from '@/components/OmnitrixLoader';
import type { ExamMode } from '@/types';

function PracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0); // 0: category, 1: sub-exam, 2: mode, 3: duration, 4: confirm
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string | null>(null);
  const [selectedExamCode, setSelectedExamCode] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<ExamMode | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [customCount, setCustomCount] = useState(20);

  // Pre-select category or mode if passed in URL query
  useEffect(() => {
    const examParam = searchParams.get('exam');
    const modeParam = searchParams.get('mode') as ExamMode | null;

    if (examParam) {
      const cat = EXAM_CATEGORIES.find(
        (c) => c.code.toLowerCase() === examParam.toLowerCase() || c.name.toLowerCase() === examParam.toLowerCase()
      );
      if (cat) {
        setSelectedCategoryCode(cat.code);
        if (cat.exams && cat.exams.length > 0) {
          setStep(1); // Go to branch selection
        } else {
          setSelectedExamCode(null);
          setStep(2); // Skip to mode selection
        }
      }
    }

    if (modeParam && EXAM_MODES.some((m) => m.mode === modeParam)) {
      setSelectedMode(modeParam);
    }
  }, [searchParams]);

  const examCategory = EXAM_CATEGORIES.find(c => c.code === selectedCategoryCode);
  const subExam = examCategory?.exams?.find(e => e.exam_code === selectedExamCode);
  
  const modeConfig = EXAM_MODES.find(m => m.mode === selectedMode);
  const questionCount = modeConfig?.questionCount || customCount;
  const durationConfig = EXAM_DURATIONS.find(d => d.seconds === selectedDuration);

  const [isStarting, setIsStarting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [isLoadingSlot, setIsLoadingSlot] = useState(false);
  const [slotFinished, setSlotFinished] = useState(false);

  const handleDurationSelect = (seconds: number) => {
    setSelectedDuration(seconds);
    setIsLoadingSlot(true);
    setSlotFinished(false);

    // Exact animation cycle on black screen before transitioning to Battle Summary
    setTimeout(() => {
      setSlotFinished(true);
      setTimeout(() => {
        setIsLoadingSlot(false);
        setStep(4);
      }, 500);
    }, 1800);
  };

  const handleStart = () => {
    setIsStarting(true);
    // Build session params and navigate to exam
    const params = new URLSearchParams({
      exam: selectedExamCode || selectedCategoryCode || 'UNIVERSITY',
      mode: selectedMode || 'quick_battle',
      questions: String(questionCount),
      duration: String(selectedDuration || 3600),
    });
    
    // Simulate loading time so user can see the loading screen
    setTimeout(() => {
      setFinished(true);
      setTimeout(() => {
        router.push(`/exam/session?${params.toString()}`);
      }, 800);
    }, 2000);
  };

  const examDisplayName = subExam?.exam_name || examCategory?.name || 'EXAM';

  if (isLoadingSlot) {
    const durConfig = EXAM_DURATIONS.find(d => d.seconds === selectedDuration);
    const durLabel = durConfig?.label || 'CUSTOM TIME';
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
        <OmnitrixLoader 
          finished={slotFinished} 
          text={`CONFIGURING ${durLabel.toUpperCase()} FOR ${examDisplayName.toUpperCase()}...`} 
        />
      </div>
    );
  }

  if (isStarting) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
        <OmnitrixLoader 
          finished={finished} 
          text={`PREPARING ${examDisplayName.toUpperCase()}...`} 
          logoUrl={examCategory?.logo}
        />
      </div>
    );
  }

  // Generate step labels based on whether a sub-exam is required
  const hasSubExams = examCategory && examCategory.exams && examCategory.exams.length > 0;
  const stepLabels = hasSubExams 
    ? ['Category', 'Branch', 'Mode', 'Duration', 'Ready'] 
    : ['Category', 'Mode', 'Duration', 'Ready'];

  // Adjust step logic based on presence of sub-exams
  const getDisplayStep = (currentStep: number) => {
    if (!hasSubExams && currentStep >= 2) return currentStep - 1;
    return currentStep;
  };

  const handleCategorySelect = (code: string) => {
    setSelectedCategoryCode(code);
    const cat = EXAM_CATEGORIES.find(c => c.code === code);
    if (cat && cat.exams && cat.exams.length > 0) {
      setStep(1); // Go to branch selection
    } else {
      setSelectedExamCode(null);
      setStep(2); // Skip to mode selection
    }
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
        {stepLabels.map((label, index) => {
          // Map visual index to actual state step
          let actualStepForIndex = index;
          if (!hasSubExams && index >= 1) actualStepForIndex = index + 1;
          
          return (
            <div key={label} className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (actualStepForIndex < step) setStep(actualStepForIndex);
                }}
                className={cn(
                  'w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all',
                  actualStepForIndex === step && 'bg-gradient-brand text-white shadow-md',
                  actualStepForIndex < step && 'bg-brand-100 text-brand-700 cursor-pointer',
                  actualStepForIndex > step && 'bg-stone-100 text-stone-400',
                )}
              >
                {index + 1}
              </button>
              {index < stepLabels.length - 1 && (
                <div className={cn('w-8 h-0.5 rounded', actualStepForIndex < step ? 'bg-brand-300' : 'bg-stone-200')} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Step 0: Choose Category */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Choose Your Exam Category</h2>
            <div className="grid grid-cols-2 gap-3">
              {EXAM_CATEGORIES.map((cat) => (
                <button
                  key={cat.code}
                  onClick={() => handleCategorySelect(cat.code)}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left',
                    selectedCategoryCode === cat.code
                      ? 'border-brand-500 bg-brand-50 shadow-sm'
                      : 'border-border bg-card hover:border-brand-200 hover:shadow-sm',
                  )}
                >
                  {cat.logo ? (
                    <Image src={cat.logo} alt={cat.name} width={32} height={32} className="w-8 h-8 rounded-full object-contain shrink-0" />
                  ) : (
                    <span className="text-2xl shrink-0">{cat.icon}</span>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{cat.name}</p>
                    <p className="text-xs text-stone-500 truncate">{cat.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Choose Branch/Topic */}
        {step === 1 && examCategory && examCategory.exams && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Choose Branch / Topic</h2>
            <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-2 pb-2">
              {examCategory.exams.map((exam) => (
                <button
                  key={exam.exam_code}
                  onClick={() => { setSelectedExamCode(exam.exam_code); setStep(2); }}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left',
                    selectedExamCode === exam.exam_code
                      ? 'border-brand-500 bg-brand-50 shadow-sm'
                      : 'border-border bg-card hover:border-brand-200 hover:shadow-sm',
                  )}
                >
                  <span className="text-2xl shrink-0">{exam.icon || '📚'}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{exam.exam_name}</p>
                    <p className="text-xs text-stone-500 truncate">{exam.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(0)} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 pt-2">
              <ChevronLeft className="w-4 h-4" /> Back to Categories
            </button>
          </div>
        )}

        {/* Step 2: Choose Mode */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Choose Mode</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXAM_MODES.filter(m => ['quick_battle', 'practice_battle', 'half_century', 'full_century', 'custom'].includes(m.mode)).map((mode) => (
                <button
                  key={mode.mode}
                  onClick={() => { setSelectedMode(mode.mode); setStep(3); }}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left',
                    selectedMode === mode.mode
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-border bg-card hover:border-brand-200',
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
              <div className="bg-card rounded-xl border border-border p-4">
                <label className="text-sm font-medium text-foreground block mb-2">Number of Questions</label>
                <input
                  type="number"
                  value={customCount}
                  onChange={(e) => setCustomCount(Math.min(100, Math.max(1, Number(e.target.value))))}
                  min={1} max={100}
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
                <button
                  onClick={() => setStep(3)}
                  className="mt-3 w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-brand"
                >
                  Continue
                </button>
              </div>
            )}
            <button onClick={() => setStep(hasSubExams ? 1 : 0)} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          </div>
        )}

        {/* Step 3: Choose Duration */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Set Duration</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {EXAM_DURATIONS.map((dur) => (
                <button
                  key={dur.seconds}
                  onClick={() => handleDurationSelect(dur.seconds)}
                  className={cn(
                    'flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all',
                    selectedDuration === dur.seconds
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-border bg-card hover:border-brand-200',
                  )}
                >
                  <Clock className="w-5 h-5 text-brand-600" />
                  <span className="text-sm font-semibold text-foreground">{dur.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="space-y-6">
            <NewspaperBattleSummary
              examCode={selectedExamCode || selectedCategoryCode}
              examName={subExam?.exam_name || examCategory?.name || 'University'}
              modeName={modeConfig?.label || 'Quick Battle'}
              modeKey={selectedMode || 'quick_battle'}
              questionCount={questionCount}
              durationLabel={durationConfig?.label || '30 minutes'}
              estimatedMarks={questionCount * 5}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
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

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PracticeContent />
    </Suspense>
  );
}
