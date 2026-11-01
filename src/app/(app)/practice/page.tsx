'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Clock, ChevronRight, ChevronLeft, Zap, FileText, Target, Award, Sliders, BookOpen
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
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Start a Battle</h1>
        <p className="text-stone-500 mt-1">
          {structuredSyllabus ? `${structuredSyllabus.fullName} Workspace` : 'Set up your exam session'}
        </p>
      </motion.div>

      {/* Step progression slider matching Picture 3 */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-8">
        {stepLabels.map((label, index) => {
          let actualStepForIndex = index;
          if (!hasSubExams && index >= 1) actualStepForIndex = index + 1;
          const isActive = actualStepForIndex === step;
          const isCompleted = actualStepForIndex < step;
          const isUpcoming = actualStepForIndex > step;

          return (
            <div key={label} className="flex items-center gap-1.5 sm:gap-3">
              <motion.button
                onClick={() => {
                  if (actualStepForIndex < step) setStep(actualStepForIndex);
                }}
                whileHover={isCompleted ? { scale: 1.08 } : {}}
                whileTap={isCompleted ? { scale: 0.95 } : {}}
                className={cn(
                  'relative w-9 h-9 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center transition-colors',
                  isActive && 'text-white font-black',
                  isCompleted && 'bg-[#e0e7ff] dark:bg-indigo-950/80 text-[#4338ca] dark:text-indigo-300 hover:bg-[#d5dffc] cursor-pointer',
                  isUpcoming && 'bg-[#f3f4f6] dark:bg-stone-800 text-[#9ca3af] dark:text-stone-500 cursor-default'
                )}
                title={label}
              >
                {isActive && (
                  <motion.div
                    layoutId="stepSliderActivePill"
                    className="absolute inset-0 rounded-full bg-[#5b52f9] shadow-md shadow-indigo-500/35"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{index + 1}</span>
              </motion.button>

              {index < stepLabels.length - 1 && (
                <div className="relative w-7 sm:w-12 h-1 rounded-full overflow-hidden bg-[#e5e7eb] dark:bg-stone-800">
                  <motion.div
                    className="absolute inset-0 bg-[#818cf8] dark:bg-indigo-500"
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
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg font-semibold text-foreground">Choose Mode</h2>
              {selectedSubject && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  {selectedSubject.name} {selectedChapter ? `• ${selectedChapter.name}` : ''}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXAM_MODES.filter(m => ['quick_battle', 'practice_battle', 'half_century', 'full_century', 'custom'].includes(m.mode)).map((mode) => {
                const isSelected = selectedMode === mode.mode;
                const iconInfo = MODE_ICON_MAP[mode.mode] || {
                  icon: <Zap className="w-5 h-5 text-brand-500" />,
                  bg: 'bg-brand-500/10 dark:bg-brand-400/15',
                  border: 'border-brand-500/30',
                };
                return (
                  <button
                    key={mode.mode}
                    onClick={() => { setSelectedMode(mode.mode); setStep(3); }}
                    className={cn(
                      'flex items-center gap-3.5 p-4 rounded-2xl border-2 transition-all text-left cursor-pointer group',
                      isSelected
                        ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-950/50 shadow-sm ring-1 ring-brand-500/30'
                        : 'border-border bg-card hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-xs'
                    )}
                  >
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105', iconInfo.bg, iconInfo.border)}>
                      {iconInfo.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {mode.label}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{mode.description}</p>
                      {mode.questionCount > 0 && (
                        <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold mt-0.5">
                          {mode.questionCount} questions
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
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
                  className="mt-3 w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-brand cursor-pointer"
                >
                  Continue
                </button>
              </div>
            )}
            <button onClick={() => setStep(hasSubExams ? 1 : 0)} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 cursor-pointer">
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
                    'flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all cursor-pointer',
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
            <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 cursor-pointer">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
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
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-brand hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/25 cursor-pointer"
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
