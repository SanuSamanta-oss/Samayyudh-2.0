'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { EXAM_CATEGORIES } from '@/lib/constants';
import { ChevronRight } from 'lucide-react';
import { OmnitrixLoader } from '@/components/OmnitrixLoader';

export default function ExamsPage() {
  const router = useRouter();
  const [loadingExam, setLoadingExam] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const handleExamClick = (code: string) => {
    setLoadingExam(code);
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
            >
              <button
                onClick={() => handleExamClick(cat.code)}
                className="w-full text-left group flex items-start gap-4 p-5 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-brand-200 transition-all duration-300"
              >
                {cat.logo ? (
                  <Image src={cat.logo} alt={cat.name} width={40} height={40} className="w-10 h-10 rounded-full object-contain shrink-0 mt-0.5" />
                ) : (
                  <span className="text-3xl mt-0.5 shrink-0">{cat.icon}</span>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-brand-600 transition-colors">{cat.name}</h3>
                  <p className="text-sm text-stone-500 mt-0.5">{cat.description}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-brand-600">
                    Start practicing <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
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
              text={`PREPARING ${loadingExam.toUpperCase()}...`} 
              logoUrl={EXAM_CATEGORIES.find(c => c.code === loadingExam)?.logo}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
