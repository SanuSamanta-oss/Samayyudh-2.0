'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { EXAM_CATEGORIES, getExamDisplayName } from '@/lib/constants';
import { ChevronRight, Sliders } from 'lucide-react';
import { OmnitrixLoader } from '@/components/OmnitrixLoader';
import { getExamSyllabus, ChapterTopic, SubjectSyllabus } from '@/data/examSyllabus';
import { ExamWorkspace } from '@/components/exam/ExamWorkspace';
import { GateLandingPage } from '@/components/gate/GateLandingPage';
import { WbjeeLandingPage } from '@/components/wbjee/WbjeeLandingPage';
import { WbjeeChapter, WbjeeSubject } from '@/data/wbjee/wbjeeSyllabus';
import { UpscLandingPage } from '@/components/upsc/UpscLandingPage';

export default function ExamsPage() {
  const router = useRouter();
  const [loadingExam, setLoadingExam] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [activeWorkspaceCode, setActiveWorkspaceCode] = useState<string | null>(null);

  const activeSyllabus = getExamSyllabus(activeWorkspaceCode);

  const handleExamClick = (code: string, customName?: string) => {
    // If GATE is selected, open dedicated GATE workspace in-place
    if (code === 'ENGINEERING' || code === 'GATE' || code.startsWith('GATE')) {
      setActiveWorkspaceCode('GATE');
      return;
    }

    // If WBJEE is selected, open dedicated WBJEE workspace in-place
    if (code === 'STATE_ENTRANCE' || code === 'WBJEE') {
      setActiveWorkspaceCode('WBJEE');
      return;
    }

    // If UPSC is selected, open dedicated UPSC workspace in-place
    if (code === 'CIVIL_SERVICES' || code === 'UPSC') {
      setActiveWorkspaceCode('UPSC');
      return;
    }

    // If it's a structured exam (JEE Main, JEE Advanced, NEET), open its dedicated workspace in-place
    const syllabus = getExamSyllabus(code);
    if (syllabus) {
      setActiveWorkspaceCode(syllabus.code);
      return;
    }

    // For other exams (GATE, WBJEE, UPSC, etc.), run existing flow
    const displayName = customName || getExamDisplayName(code);
    setLoadingExam(displayName);
    setTimeout(() => {
      setFinished(true);
      setTimeout(() => {
        router.push(`/practice?exam=${code}`);
      }, 800);
    }, 2000);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 md:py-8 space-y-8">
        {activeWorkspaceCode === 'GATE' ? (
          <motion.div
            key="GATE"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GateLandingPage
              onBackToExamSelect={() => setActiveWorkspaceCode(null)}
              onSelectChapterForBattle={(chapter, section, paper) => {
                router.push(
                  `/practice?exam=ENGINEERING&paper=${encodeURIComponent(
                    paper.code
                  )}&section=${encodeURIComponent(section.id)}&chapter=${encodeURIComponent(
                    chapter.id
                  )}`
                );
              }}
              onSelectSectionForBattle={(section, paper) => {
                router.push(
                  `/practice?exam=ENGINEERING&paper=${encodeURIComponent(
                    paper.code
                  )}&section=${encodeURIComponent(section.id)}`
                );
              }}
              onSelectPaperForBattle={(paper) => {
                router.push(
                  `/practice?exam=ENGINEERING&paper=${encodeURIComponent(paper.code)}`
                );
              }}
            />
          </motion.div>
        ) : activeWorkspaceCode === 'WBJEE' ? (
          <motion.div
            key="WBJEE"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WbjeeLandingPage
              onBackToExamSelect={() => setActiveWorkspaceCode(null)}
              onSelectChapterForBattle={(chapter: WbjeeChapter, subject: WbjeeSubject) => {
                router.push(
                  `/practice?exam=WBJEE&subject=${encodeURIComponent(
                    subject.name.toLowerCase()
                  )}&chapter=${encodeURIComponent(chapter.id)}`
                );
              }}
              onSelectSubjectForBattle={(subject: WbjeeSubject) => {
                router.push(
                  `/practice?exam=WBJEE&subject=${encodeURIComponent(
                    subject.name.toLowerCase()
                  )}`
                );
              }}
            />
          </motion.div>
        ) : activeWorkspaceCode === 'UPSC' ? (
          <motion.div
            key="UPSC"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <UpscLandingPage
              onBackToExamSelect={() => setActiveWorkspaceCode(null)}
              onSelectTopicForBattle={(topic, paper) => {
                router.push(
                  `/practice?exam=UPSC&paper=${encodeURIComponent(
                    paper.code
                  )}&topic=${encodeURIComponent(topic.id)}`
                );
              }}
            />
          </motion.div>
        ) : activeSyllabus ? (
          <motion.div
            key={activeSyllabus.code}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ExamWorkspace
              syllabus={activeSyllabus}
              onBackToExamSelect={() => setActiveWorkspaceCode(null)}
              onSelectChapterForBattle={(ch: ChapterTopic, subj: SubjectSyllabus) => {
                router.push(
                  `/practice?exam=${activeSyllabus.code}&subject=${encodeURIComponent(
                    subj.name.toLowerCase()
                  )}&chapter=${encodeURIComponent(ch.id)}`
                );
              }}
              onSelectSubjectForBattle={(subj: SubjectSyllabus) => {
                router.push(
                  `/practice?exam=${activeSyllabus.code}&subject=${encodeURIComponent(
                    subj.name.toLowerCase()
                  )}`
                );
              }}
            />
          </motion.div>
        ) : (
          <>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Choose Your Exam</h1>
              <p className="text-stone-500 mt-1">One engine. Every exam pattern.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {EXAM_CATEGORIES.map((cat, i) => (
                <motion.div
                  key={cat.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="h-full"
                >
                  <button
                    onClick={() => handleExamClick(cat.code, cat.name)}
                    className="w-full h-full text-left group flex flex-col justify-between p-5 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-brand-200 transition-all duration-300 cursor-pointer min-h-[160px]"
                  >
                    <div className="flex items-start gap-4 w-full">
                      {cat.logo ? (
                        <div className="w-11 h-11 rounded-full bg-white dark:bg-stone-950 border border-border p-1 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                          <Image
                            src={cat.logo}
                            alt={cat.name}
                            width={44}
                            height={44}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0 shadow-xs">
                          <Sliders className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-brand-600 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-stone-500 mt-1 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                    <div className="w-full pt-3 mt-auto flex items-center border-t border-border/40">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:translate-x-0.5 transition-transform">
                        {getExamSyllabus(cat.code) || cat.code === 'ENGINEERING' || cat.code === 'STATE_ENTRANCE' || cat.code === 'CIVIL_SERVICES'
                          ? 'Explore Stages & Syllabus'
                          : 'Start practicing'}{' '}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {loadingExam && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4"
          >
            <OmnitrixLoader 
              finished={finished} 
              text={`PREPARING ${getExamDisplayName(loadingExam).toUpperCase()}...`} 
              logoUrl={EXAM_CATEGORIES.find(c => c.code === loadingExam || c.name.toLowerCase() === loadingExam.toLowerCase())?.logo}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
