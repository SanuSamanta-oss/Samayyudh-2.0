'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Clock, ChevronRight, ChevronLeft, Zap, FileText, Target, Award, Sliders, BookOpen, Check, Sparkles, ArrowRight, Flame, Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EXAM_CATEGORIES, EXAM_MODES, EXAM_DURATIONS, getExamDisplayName } from '@/lib/constants';
import { NewspaperBattleSummary } from '@/components/practice/NewspaperBattleSummary';
import { OmnitrixLoader } from '@/components/OmnitrixLoader';
import {
  isStructuredExam,
  getExamSyllabus,
  ChapterTopic,
  SubjectSyllabus,
} from '@/data/examSyllabus';
import { ExamWorkspace } from '@/components/exam/ExamWorkspace';
import { GateLandingPage } from '@/components/gate/GateLandingPage';
import { WbjeeLandingPage } from '@/components/wbjee/WbjeeLandingPage';
import { WbjeeChapter, WbjeeSubject } from '@/data/wbjee/wbjeeSyllabus';
import { UpscLandingPage } from '@/components/upsc/UpscLandingPage';
import { getGatePaperByCode } from '@/data/gateSyllabus';
import type { ExamMode } from '@/types';

const MODE_ICON_MAP: Record<string, { icon: React.ReactNode; bg: string; border: string }> = {
  quick_battle: {
    icon: <Zap className="w-5 h-5 text-amber-500" />,
    bg: 'bg-amber-500/10 dark:bg-amber-400/15',
    border: 'border-amber-500/30',
  },
  practice_battle: {
    icon: <FileText className="w-5 h-5 text-blue-500" />,
    bg: 'bg-blue-500/10 dark:bg-blue-400/15',
    border: 'border-blue-500/30',
  },
  half_century: {
    icon: <Target className="w-5 h-5 text-emerald-500" />,
    bg: 'bg-emerald-500/10 dark:bg-emerald-400/15',
    border: 'border-emerald-500/30',
  },
  full_century: {
    icon: <Award className="w-5 h-5 text-purple-500" />,
    bg: 'bg-purple-500/10 dark:bg-purple-400/15',
    border: 'border-purple-500/30',
  },
  custom: {
    icon: <Sliders className="w-5 h-5 text-brand-500" />,
    bg: 'bg-brand-500/10 dark:bg-brand-400/15',
    border: 'border-brand-500/30',
  },
};

function PracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0); // 0: category, 1: syllabus/branch, 2: mode, 3: duration, 4: confirm
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string | null>(null);
  const [selectedExamCode, setSelectedExamCode] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectSyllabus | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<ChapterTopic | null>(null);
  const [selectedMode, setSelectedMode] = useState<ExamMode | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [customCount, setCustomCount] = useState(20);

  // Pre-select category or mode if passed in URL query
  useEffect(() => {
    const examParam = searchParams.get('exam');
    const modeParam = searchParams.get('mode') as ExamMode | null;

    if (examParam) {
      const cleanParam = examParam.trim();
      const isGateParam = cleanParam === 'ENGINEERING' || cleanParam === 'GATE' || cleanParam.startsWith('GATE-');
      const structured = getExamSyllabus(cleanParam);

      if (isGateParam) {
        setSelectedCategoryCode('ENGINEERING');
        const paperParam = searchParams.get('paper') || (cleanParam.startsWith('GATE-') ? cleanParam : null);
        const sectionParam = searchParams.get('section');
        const chapterParam = searchParams.get('chapter');

        if (paperParam) {
          const gatePaper = getGatePaperByCode(paperParam);
          if (gatePaper) {
            setSelectedExamCode(gatePaper.code);
            if (sectionParam) {
              const sec = gatePaper.sections.find((s) => s.id === sectionParam || s.code === sectionParam);
              if (sec) {
                const ch = chapterParam ? sec.chapters.find((c) => c.id === chapterParam || String(c.number) === chapterParam) : null;
                setSelectedSubject({
                  id: sec.id,
                  name: `${gatePaper.code} — ${sec.name}`,
                  color: 'brand',
                  iconName: 'BookOpen',
                  chapters: sec.chapters as any,
                });
                setSelectedChapter(ch ? {
                  id: ch.id,
                  number: ch.number,
                  name: ch.name,
                  description: ch.description,
                } : null);
                setStep(2); // Jump straight to Mode selection
                return;
              }
            }
          }
        }
        setStep(1); // Go to GATE paper workspace
      } else if (structured) {
        setSelectedCategoryCode(structured.code);
        setSelectedExamCode(null);

        // Check if subject or chapter was also passed in the URL
        const subjectParam = searchParams.get('subject');
        const chapterParam = searchParams.get('chapter');
        let matchedSubject: SubjectSyllabus | null = null;
        let matchedChapter: ChapterTopic | null = null;

        if (subjectParam) {
          const sLower = subjectParam.toLowerCase().trim();
          matchedSubject =
            structured.subjects.find(
              (s) => s.name.toLowerCase() === sLower || s.id.toLowerCase() === sLower
            ) || null;
        }

        if (chapterParam) {
          const cLower = chapterParam.toLowerCase().trim();
          if (matchedSubject) {
            matchedChapter =
              matchedSubject.chapters.find(
                (c) => c.id.toLowerCase() === cLower || c.name.toLowerCase() === cLower
              ) || null;
          } else {
            for (const s of structured.subjects) {
              const c = s.chapters.find(
                (ch) => ch.id.toLowerCase() === cLower || ch.name.toLowerCase() === cLower
              );
              if (c) {
                matchedChapter = c;
                matchedSubject = s;
                break;
              }
            }
          }
        }

        setSelectedSubject(matchedSubject);
        setSelectedChapter(matchedChapter);

        // If subject or chapter was specifically pre-selected via link/query, jump to Mode selection
        if (matchedSubject) {
          setStep(2);
        } else {
          setStep(1); // Go straight to the dedicated Subject & Chapter workspace
        }
      } else {
        const cat = EXAM_CATEGORIES.find(
          (c) => c.code.toLowerCase() === cleanParam.toLowerCase() || c.name.toLowerCase() === cleanParam.toLowerCase()
        );
        if (cat) {
          setSelectedCategoryCode(cat.code);
          if (cat.exams && cat.exams.length > 0) {
            setStep(1); // Go to branch selection (e.g. GATE)
          } else {
            setSelectedExamCode(null);
            setStep(2); // Skip to mode selection
          }
        }
      }
    }

    if (modeParam && EXAM_MODES.some((m) => m.mode === modeParam)) {
      setSelectedMode(modeParam);
    }
  }, [searchParams]);

  const structuredSyllabus = getExamSyllabus(selectedCategoryCode || selectedExamCode);
  const isGate = selectedCategoryCode === 'ENGINEERING' || selectedCategoryCode === 'GATE' || !!selectedExamCode?.startsWith('GATE');
  const isWbjee = selectedCategoryCode === 'STATE_ENTRANCE' || selectedCategoryCode === 'WBJEE';
  const isUpsc = selectedCategoryCode === 'CIVIL_SERVICES' || selectedCategoryCode === 'UPSC';
  const gatePaper = isGate ? getGatePaperByCode(selectedExamCode) : null;
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
    if (selectedSubject) {
      params.set('subject', selectedSubject.name.toLowerCase());
    }
    if (selectedChapter) {
      params.set('chapter', selectedChapter.id);
      params.set('chapter_name', selectedChapter.name);
    }
    
    // Simulate loading time so user can see the loading screen
    setTimeout(() => {
      setFinished(true);
      setTimeout(() => {
        router.push(`/exam/session?${params.toString()}`);
      }, 800);
    }, 2000);
  };

  const examDisplayName =
    (gatePaper ? `GATE — ${gatePaper.name} (${gatePaper.code})` : null) ||
    structuredSyllabus?.name ||
    subExam?.exam_name ||
    examCategory?.name ||
    'EXAM';

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
          logoUrl={isGate ? '/logos/gate.jpg' : (structuredSyllabus?.logo || examCategory?.logo)}
        />
      </div>
    );
  }

  // Generate step labels based on whether sub-exam / syllabus is active
  const hasSubExams = (examCategory && examCategory.exams && examCategory.exams.length > 0) || !!structuredSyllabus || isGate || isWbjee || isUpsc;
  const stepLabels = hasSubExams 
    ? ['Exam', structuredSyllabus ? 'Syllabus' : isGate ? 'Paper' : isWbjee ? 'Subject' : isUpsc ? 'Stage' : 'Branch', 'Mode', 'Duration', 'Ready'] 
    : ['Exam', 'Mode', 'Duration', 'Ready'];

  const handleCategorySelect = (code: string) => {
    setSelectedCategoryCode(code);
    setSelectedSubject(null);
    setSelectedChapter(null);

    if (code === 'ENGINEERING' || code === 'GATE') {
      setSelectedExamCode(null);
      setStep(1); // Open dedicated GATE workspace
      return;
    }

    if (code === 'STATE_ENTRANCE' || code === 'WBJEE') {
      setSelectedExamCode(null);
      setStep(1); // Open dedicated WBJEE workspace
      return;
    }

    if (code === 'CIVIL_SERVICES' || code === 'UPSC') {
      setSelectedExamCode(null);
      setStep(1); // Open dedicated UPSC workspace
      return;
    }

    if (isStructuredExam(code)) {
      setSelectedExamCode(null);
      setStep(1); // Open dedicated Subject & Chapter workspace
      return;
    }

    const cat = EXAM_CATEGORIES.find(c => c.code === code);
    if (cat && cat.exams && cat.exams.length > 0) {
      setStep(1); // Go to branch selection (e.g. GATE)
    } else {
      setSelectedExamCode(null);
      setStep(2); // Skip to mode selection
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6 md:py-10">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold tracking-wide mb-2.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exam Battle Arena</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Start a Battle
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          {structuredSyllabus ? `${structuredSyllabus.fullName} Workspace` : 'Set up your personalized battle session'}
        </p>
      </motion.div>

      {/* Modern Illuminated Stepper */}
      <div className="mb-8 p-3 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-sm shadow-slate-950/5">
        <div className="flex items-center justify-between max-w-xl mx-auto px-1 sm:px-4">
          {stepLabels.map((label, index) => {
            let actualStepForIndex = index;
            if (!hasSubExams && index >= 1) actualStepForIndex = index + 1;
            const isActive = actualStepForIndex === step;
            const isCompleted = actualStepForIndex < step;
            const isUpcoming = actualStepForIndex > step;

            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <motion.button
                    onClick={() => {
                      if (actualStepForIndex < step) setStep(actualStepForIndex);
                    }}
                    disabled={isUpcoming}
                    whileHover={isCompleted ? { scale: 1.1 } : {}}
                    whileTap={isCompleted ? { scale: 0.95 } : {}}
                    className={cn(
                      'relative w-9 h-9 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center transition-all duration-200',
                      isActive && 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 ring-4 ring-indigo-500/20 scale-105',
                      isCompleted && 'bg-emerald-500 dark:bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/25 hover:bg-emerald-600 cursor-pointer',
                      isUpcoming && 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 border border-slate-200/60 dark:border-slate-700/60 cursor-default'
                    )}
                    title={label}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <span className="relative z-10">{index + 1}</span>
                    )}
                  </motion.button>
                  <span
                    className={cn(
                      'mt-1.5 text-[10px] sm:text-xs font-semibold tracking-tight transition-colors hidden sm:block',
                      isActive && 'text-indigo-600 dark:text-indigo-400 font-bold',
                      isCompleted && 'text-slate-700 dark:text-slate-300',
                      isUpcoming && 'text-slate-400 dark:text-slate-500'
                    )}
                  >
                    {label}
                  </span>
                </div>

                {index < stepLabels.length - 1 && (
                  <div className="flex-1 mx-2 sm:mx-3 h-1 sm:h-1.5 rounded-full overflow-hidden bg-slate-200/80 dark:bg-slate-800">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-indigo-600"
                      initial={false}
                      animate={{
                        scaleX: actualStepForIndex < step ? 1 : 0,
                      }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      style={{ transformOrigin: 'left' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {EXAM_CATEGORIES.map((cat) => (
                <button
                  key={cat.code}
                  onClick={() => handleCategorySelect(cat.code)}
                  className={cn(
                    'w-full h-20 min-h-[80px] flex items-center gap-3.5 px-4 py-3 rounded-xl border-2 transition-all text-left cursor-pointer group',
                    selectedCategoryCode === cat.code
                      ? 'border-brand-500 bg-brand-50 shadow-sm'
                      : 'border-border bg-card hover:border-brand-200 hover:shadow-sm',
                  )}
                >
                  {cat.logo ? (
                    <div className="w-9 h-9 rounded-full bg-white dark:bg-stone-950 border border-border p-1 overflow-hidden shrink-0 flex items-center justify-center">
                      <Image src={cat.logo} alt={cat.name} width={36} height={36} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0">
                      <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-brand-600 transition-colors truncate">{cat.name}</p>
                    <p className="text-xs text-stone-500 truncate mt-0.5">{cat.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Syllabus & Subject Workspace OR Branch Selection */}
        {step === 1 && (
          structuredSyllabus ? (
            <ExamWorkspace
              syllabus={structuredSyllabus}
              onBackToExamSelect={() => setStep(0)}
              onSelectChapterForBattle={(chapter, subject) => {
                setSelectedChapter(chapter);
                setSelectedSubject(subject);
                setStep(2); // Move to Choose Mode with this chapter pre-selected!
              }}
              onSelectSubjectForBattle={(subject) => {
                setSelectedSubject(subject);
                setSelectedChapter(null);
                setStep(2); // Move to Choose Mode with full subject pre-selected!
              }}
            />
          ) : isGate ? (
            <GateLandingPage
              onBackToExamSelect={() => setStep(0)}
              initialPaperCode={selectedExamCode}
              onSelectChapterForBattle={(chapter, section, paper) => {
                setSelectedExamCode(paper.code);
                setSelectedSubject({
                  id: section.id,
                  name: `${paper.code} — ${section.name}`,
                  color: 'brand',
                  iconName: 'BookOpen',
                  chapters: section.chapters as any,
                });
                setSelectedChapter({
                  id: chapter.id,
                  number: chapter.number,
                  name: chapter.name,
                  description: chapter.description,
                });
                setStep(2);
              }}
              onSelectSectionForBattle={(section, paper) => {
                setSelectedExamCode(paper.code);
                setSelectedSubject({
                  id: section.id,
                  name: `${paper.code} — ${section.name}`,
                  color: 'brand',
                  iconName: 'BookOpen',
                  chapters: section.chapters as any,
                });
                setSelectedChapter(null);
                setStep(2);
              }}
              onSelectPaperForBattle={(paper) => {
                setSelectedExamCode(paper.code);
                setSelectedSubject({
                  id: paper.code,
                  name: `${paper.name} (${paper.code})`,
                  color: 'brand',
                  iconName: 'BookOpen',
                  chapters: [],
                });
                setSelectedChapter(null);
                setStep(2);
              }}
            />
          ) : isWbjee ? (
            <WbjeeLandingPage
              onBackToExamSelect={() => setStep(0)}
              onSelectChapterForBattle={(chapter: WbjeeChapter, subject: WbjeeSubject) => {
                setSelectedExamCode('WBJEE');
                setSelectedSubject({
                  id: subject.id,
                  name: subject.name,
                  color: subject.color,
                  iconName: subject.iconName,
                  chapters: subject.chapters.map((c) => ({
                    id: c.id,
                    number: c.number,
                    name: c.name,
                    description: c.description,
                  })),
                });
                setSelectedChapter({
                  id: chapter.id,
                  number: chapter.number,
                  name: chapter.name,
                  description: chapter.description,
                });
                setStep(2);
              }}
              onSelectSubjectForBattle={(subject: WbjeeSubject) => {
                setSelectedExamCode('WBJEE');
                setSelectedSubject({
                  id: subject.id,
                  name: subject.name,
                  color: subject.color,
                  iconName: subject.iconName,
                  chapters: subject.chapters.map((c) => ({
                    id: c.id,
                    number: c.number,
                    name: c.name,
                    description: c.description,
                  })),
                });
                setSelectedChapter(null);
                setStep(2);
              }}
            />
          ) : isUpsc ? (
            <UpscLandingPage
              onBackToExamSelect={() => setStep(0)}
              onSelectTopicForBattle={(topic, paper) => {
                setSelectedExamCode('UPSC');
                setSelectedSubject({
                  id: paper.id,
                  name: `${paper.name} — ${topic.name}`,
                  color: 'brand',
                  iconName: 'BookOpen',
                  chapters: [
                    {
                      id: topic.id,
                      number: topic.number,
                      name: topic.name,
                      description: topic.description,
                    },
                  ],
                });
                setSelectedChapter({
                  id: topic.id,
                  number: topic.number,
                  name: topic.name,
                  description: topic.description,
                });
                setStep(2);
              }}
            />
          ) : examCategory && examCategory.exams && examCategory.exams.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Choose Branch / Topic</h2>
              <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-2 pb-2">
                {examCategory.exams.map((exam) => (
                  <button
                    key={exam.exam_code}
                    onClick={() => { setSelectedExamCode(exam.exam_code); setStep(2); }}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left cursor-pointer',
                      selectedExamCode === exam.exam_code
                        ? 'border-brand-500 bg-brand-50 shadow-sm'
                        : 'border-border bg-card hover:border-brand-200 hover:shadow-sm',
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{exam.exam_name}</p>
                      <p className="text-xs text-stone-500 truncate">{exam.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(0)} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 pt-2 cursor-pointer">
                <ChevronLeft className="w-4 h-4" /> Back to Categories
              </button>
            </div>
          ) : null
        )}

        {/* Step 2: Choose Mode */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Header + Subject Pill */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200/80 dark:border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Choose Battle Mode
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Select a calibrated drill format or customize your question volume
                </p>
              </div>

              {selectedSubject && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs backdrop-blur-xs">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="text-xs font-semibold tracking-tight truncate max-w-[260px]">
                    {selectedSubject.name} {selectedChapter ? `• ${selectedChapter.name}` : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Mode Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  mode: 'quick_battle' as ExamMode,
                  title: 'Quick Battle',
                  badge: '10 Qs · ~10m',
                  badgeStyle: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25',
                  description: 'Rapid-fire warmup to test core recall and prime your speed.',
                  icon: Zap,
                  gradient: 'from-amber-500 to-orange-500',
                  iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
                  hoverBorder: 'hover:border-amber-500/50 dark:hover:border-amber-400/50',
                  glow: 'hover:shadow-amber-500/15',
                },
                {
                  mode: 'practice_battle' as ExamMode,
                  title: 'Practice Battle',
                  badge: '25 Qs · Most Popular',
                  badgeStyle: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/25',
                  description: 'Ideal comprehensive drill balancing analytical depth and accuracy.',
                  icon: Flame,
                  gradient: 'from-indigo-500 to-blue-500',
                  iconBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
                  hoverBorder: 'hover:border-indigo-500/50 dark:hover:border-indigo-400/50',
                  glow: 'hover:shadow-indigo-500/15',
                },
                {
                  mode: 'half_century' as ExamMode,
                  title: 'Half Century',
                  badge: '50 Qs · Section Drill',
                  badgeStyle: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
                  description: 'Deep endurance workout targeting syllabus mastery and mental stamina.',
                  icon: Target,
                  gradient: 'from-emerald-500 to-teal-500',
                  iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
                  hoverBorder: 'hover:border-emerald-500/50 dark:hover:border-emerald-400/50',
                  glow: 'hover:shadow-emerald-500/15',
                },
                {
                  mode: 'full_century' as ExamMode,
                  title: 'Full Century',
                  badge: '100 Qs · Full Simulation',
                  badgeStyle: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25',
                  description: 'The ultimate high-stakes simulation matching standard competitive exam rigors.',
                  icon: Award,
                  gradient: 'from-purple-500 to-pink-500',
                  iconBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
                  hoverBorder: 'hover:border-purple-500/50 dark:hover:border-purple-400/50',
                  glow: 'hover:shadow-purple-500/15',
                },
              ].map((m) => {
                const IconComponent = m.icon;
                const isSelected = selectedMode === m.mode;

                return (
                  <motion.button
                    key={m.mode}
                    type="button"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedMode(m.mode);
                      setStep(3);
                    }}
                    className={cn(
                      'group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 text-left cursor-pointer overflow-hidden backdrop-blur-xl',
                      'bg-white/80 dark:bg-slate-900/70',
                      isSelected
                        ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/15'
                        : cn('border-slate-200/90 dark:border-white/10 hover:shadow-lg', m.hoverBorder, m.glow)
                    )}
                  >
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 shadow-xs', m.iconBg)}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className={cn('text-[11px] font-bold px-2.5 py-1 rounded-full border', m.badgeStyle)}>
                        {m.badge}
                      </span>
                    </div>

                    {/* Middle: Title & Description */}
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {m.title}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-indigo-500 transition-all duration-200" />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {m.description}
                      </p>
                    </div>

                    {/* Bottom subtle accent line */}
                    <div className="h-0.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={cn('h-full w-0 group-hover:w-full transition-all duration-300 bg-gradient-to-r', m.gradient)} />
                    </div>
                  </motion.button>
                );
              })}

              {/* Custom Battle Card: Spans 2 columns */}
              <motion.div
                layout
                className={cn(
                  'sm:col-span-2 rounded-2xl border transition-all duration-200 p-5 sm:p-6 backdrop-blur-xl relative overflow-hidden',
                  'bg-white/80 dark:bg-slate-900/70',
                  selectedMode === 'custom'
                    ? 'border-indigo-500/80 dark:border-indigo-400 ring-2 ring-indigo-500/25 shadow-xl shadow-indigo-500/10'
                    : 'border-slate-200/90 dark:border-white/10 hover:border-pink-500/40 hover:shadow-lg'
                )}
              >
                <div
                  onClick={() => setSelectedMode('custom')}
                  className="flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-pink-500/30 bg-pink-500/15 text-pink-600 dark:text-pink-400 shadow-xs">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          Custom Battle
                        </h3>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-700 dark:text-pink-300 border border-pink-500/20">
                          {customCount} Questions Selected
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 font-normal">
                        Tailor the exact number of questions from 1 to 100 according to your schedule.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMode('custom');
                    }}
                    className={cn(
                      'text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer border',
                      selectedMode === 'custom'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    )}
                  >
                    {selectedMode === 'custom' ? 'Configuring' : 'Configure'}
                  </button>
                </div>

                {/* Unfolded Custom Configuration Drawer */}
                {selectedMode === 'custom' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-5 pt-5 border-t border-slate-200/80 dark:border-white/10 space-y-4"
                  >
                    {/* Quick Presets */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                        Quick Presets
                      </label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {[10, 20, 30, 50, 75, 100].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setCustomCount(num)}
                            className={cn(
                              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer',
                              customCount === num
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20 scale-105'
                                : 'bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                            )}
                          >
                            {num} Qs
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Slider */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                        <span>Adjust Slider</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                          {customCount} questions (~{Math.round(customCount * 1.5)} mins)
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={100}
                        value={customCount}
                        onChange={(e) => setCustomCount(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>1 Q</span>
                        <span>25 Qs</span>
                        <span>50 Qs</span>
                        <span>75 Qs</span>
                        <span>100 Qs</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all cursor-pointer"
                      >
                        <span>Continue with {customCount} Questions</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Back Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setStep(hasSubExams ? 1 : 0)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800/70 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-all border border-slate-200/80 dark:border-white/5 cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Choose Duration */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-200/80 dark:border-white/10">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Set Exam Duration
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Pick the time limit for your {questionCount}-question session
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20 text-xs font-semibold">
                <Timer className="w-3.5 h-3.5 text-brand-500" />
                <span>{questionCount} Questions</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {EXAM_DURATIONS.map((dur) => {
                const isSelected = selectedDuration === dur.seconds;
                const paceBadges: Record<number, string> = {
                  1800: '⚡ Sprint Pace',
                  3600: '⏱️ Standard Pace',
                  5400: '🎯 In-depth Pace',
                  7200: '🔥 Full Drill',
                  10800: '🏆 Real Mock',
                  14400: '🧘 Marathon',
                };
                return (
                  <motion.button
                    key={dur.seconds}
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDurationSelect(dur.seconds)}
                    className={cn(
                      'group relative flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-200 text-center cursor-pointer backdrop-blur-xl',
                      'bg-white/80 dark:bg-slate-900/70',
                      isSelected
                        ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/15'
                        : 'border-slate-200/90 dark:border-white/10 hover:border-indigo-400 hover:shadow-md'
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2.5 group-hover:scale-105 transition-transform">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {dur.label}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      {paceBadges[dur.seconds] || 'Custom Pace'}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800/70 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-all border border-slate-200/80 dark:border-white/5 cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Mode</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="space-y-6">
            <NewspaperBattleSummary
              examCode={selectedExamCode || selectedCategoryCode}
              examName={
                structuredSyllabus?.name ||
                subExam?.exam_name ||
                examCategory?.name ||
                'University'
              }
              subjectName={selectedSubject?.name}
              chapterName={selectedChapter?.name}
              modeName={modeConfig?.label || 'Quick Battle'}
              modeKey={selectedMode || 'quick_battle'}
              questionCount={questionCount}
              durationLabel={durationConfig?.label || '30 minutes'}
              estimatedMarks={questionCount * 4}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-stone-600 border border-border hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
              </button>
              <button
                onClick={handleStart}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm sm:text-base font-extrabold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-accent-600 hover:from-brand-500 hover:to-accent-500 shadow-xl shadow-brand-500/35 hover:shadow-brand-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ring-1 ring-white/20"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Start Battle</span>
                <ChevronRight className="w-4 h-4" />
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
