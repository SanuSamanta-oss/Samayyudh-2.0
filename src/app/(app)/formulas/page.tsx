'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Calculator,
  GraduationCap,
  Hash,
  X,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import {
  physicsAcademicLevels,
  searchPhysicsFormulas,
  getPhysicsStats,
} from '@/data/formulas/physics';
import { ChapterAccordion } from '@/components/formulas/ChapterAccordion';
import { FormulaCard } from '@/components/formulas/FormulaCard';
import { PhysicalConstantsSection } from '@/components/formulas/PhysicalConstantsSection';
import { MathematicsPlaceholder } from '@/components/formulas/MathematicsPlaceholder';
import { NeetPrepSection } from '@/components/formulas/NeetPrepSection';
import { ConstantsModal } from '@/components/formulas/ConstantsModal';
import type { SubjectId } from '@/types/formulas';
import { cn } from '@/lib/utils';

export default function FormulaLibraryPage() {
  const [activeSubject, setActiveSubject] = useState<SubjectId>('physics');
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConstantsModalOpen, setIsConstantsModalOpen] = useState(false);

  const stats = useMemo(() => getPhysicsStats(), []);

  // Filtered search results across physics
  const searchResults = useMemo(() => {
    return searchPhysicsFormulas(searchQuery, selectedLevelId, selectedChapterId);
  }, [searchQuery, selectedLevelId, selectedChapterId]);

  // Selected level object
  const currentLevel = useMemo(() => {
    if (!selectedLevelId) return null;
    return physicsAcademicLevels.find((lvl) => lvl.id === selectedLevelId) || null;
  }, [selectedLevelId]);

  // Selected chapter object
  const currentChapter = useMemo(() => {
    if (!selectedChapterId || !currentLevel) return null;
    return currentLevel.chapters.find((ch) => ch.id === selectedChapterId) || null;
  }, [selectedChapterId, currentLevel]);

  // Reset filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedLevelId(null);
    setSelectedChapterId(null);
  };

  const subjectTabs = [
    {
      id: 'physics' as SubjectId,
      name: 'Physics',
      icon: BookOpen,
      count: `${stats.totalFormulas} Formulas`,
      ready: true,
    },
    {
      id: 'constants' as SubjectId,
      name: 'Physical Constants',
      icon: Hash,
      count: '20 Constants',
      ready: true,
    },
    {
      id: 'mathematics' as SubjectId,
      name: 'Mathematics',
      icon: Calculator,
      count: 'Coming Soon',
      ready: false,
    },
    {
      id: 'neet' as SubjectId,
      name: 'NEET Preparation',
      icon: GraduationCap,
      count: 'MCQ Track',
      ready: false,
    },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-16 bg-background text-foreground">
      {/* Top Header & Page Identity */}
      <div className="border-b border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0B1120]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 md:py-8">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3 overflow-x-auto whitespace-nowrap"
          >
            <button
              onClick={() => {
                setActiveSubject('physics');
                setSelectedLevelId(null);
                setSelectedChapterId(null);
              }}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Formula Library
            </button>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <button
              onClick={() => {
                setSelectedLevelId(null);
                setSelectedChapterId(null);
              }}
              className={cn(
                'capitalize hover:text-slate-900 dark:hover:text-white transition-colors',
                !selectedLevelId && 'font-bold text-slate-900 dark:text-white'
              )}
            >
              {activeSubject === 'neet'
                ? 'NEET Preparation'
                : activeSubject === 'constants'
                ? 'Physical Constants'
                : activeSubject}
            </button>
            {activeSubject === 'physics' && currentLevel && (
              <>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <button
                  onClick={() => setSelectedChapterId(null)}
                  className={cn(
                    'hover:text-slate-900 dark:hover:text-white transition-colors',
                    !selectedChapterId && 'font-bold text-slate-900 dark:text-white'
                  )}
                >
                  {currentLevel.shortTitle}
                </button>
              </>
            )}
            {activeSubject === 'physics' && currentChapter && (
              <>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                  {currentChapter.title}
                </span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Formula Library
              </h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-1 font-normal">
                Explore important formulas, organised by subject and topic.
              </p>
            </div>

            {/* Quick Physical Constants Reference Trigger */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsConstantsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors shadow-2xs"
              >
                <Hash className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Physical Constants</span>
              </button>
            </div>
          </div>

          {/* Subject Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 border-b border-slate-200/90 dark:border-slate-800 scrollbar-none">
            {subjectTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubject === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSubject(tab.id);
                    setSearchQuery('');
                  }}
                  className={cn(
                    'flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0',
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 md:py-8">
        {/* Render Dedicated Physical Constants Section */}
        {activeSubject === 'constants' && <PhysicalConstantsSection />}

        {/* Render Mathematics Placeholder View */}
        {activeSubject === 'mathematics' && <MathematicsPlaceholder />}

        {/* Render NEET Preparation Track */}
        {activeSubject === 'neet' && <NeetPrepSection />}

        {/* Render Fully Populated Physics Section */}
        {activeSubject === 'physics' && (
          <div className="space-y-6">
            {/* Search and Filter Control Bar */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Field */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search formulas by name, topic, symbol, or keyword..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-2xs font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    type="button"
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Chapter Jump Selector Dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedChapterId || ''}
                  onChange={(e) => setSelectedChapterId(e.target.value || null)}
                  className="px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-2xs font-medium"
                >
                  <option value="">All Chapters ({stats.totalChapters})</option>
                  {(selectedLevelId ? currentLevel?.chapters || [] : physicsAcademicLevels.flatMap((l) => l.chapters)).map(
                    (ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.title}
                      </option>
                    )
                  )}
                </select>

                {(searchQuery || selectedLevelId || selectedChapterId) && (
                  <button
                    onClick={handleClearFilters}
                    type="button"
                    title="Reset all filters"
                    className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Academic Level Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => {
                  setSelectedLevelId(null);
                  setSelectedChapterId(null);
                }}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border',
                  selectedLevelId === null
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600'
                )}
              >
                All Academic Levels ({stats.totalLevels})
              </button>

              {physicsAcademicLevels.map((lvl) => {
                const isSelected = selectedLevelId === lvl.id;
                const chapterCount = lvl.chapters.length;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => {
                      setSelectedLevelId(isSelected ? null : lvl.id);
                      setSelectedChapterId(null);
                    }}
                    className={cn(
                      'px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5',
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600'
                    )}
                  >
                    <span>{lvl.title}</span>
                    <span className="text-[10px] opacity-75">({chapterCount} ch)</span>
                  </button>
                );
              })}
            </div>

            {/* Results Count & Current Filter Context */}
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <div>
                Showing <span className="font-extrabold text-slate-900 dark:text-white">{searchResults.length}</span>{' '}
                {searchResults.length === 1 ? 'formula' : 'formulas'}
                {selectedLevelId && (
                  <span>
                    {' '}
                    in <span className="font-extrabold text-slate-900 dark:text-white">{currentLevel?.title}</span>
                  </span>
                )}
                {selectedChapterId && (
                  <span>
                    {' '}
                    • Chapter: <span className="font-extrabold text-slate-900 dark:text-white">{currentChapter?.title}</span>
                  </span>
                )}
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-slate-900 dark:hover:text-white text-indigo-600 dark:text-indigo-400 font-bold"
                >
                  Clear search query
                </button>
              )}
            </div>

            {/* Main Content: Search Mode vs Chapter Hierarchy View */}
            {searchQuery ? (
              /* Flat Search Results List */
              <div>
                {searchResults.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center bg-white dark:bg-[#111A2E]">
                    <Search className="w-8 h-8 mx-auto text-slate-400 mb-3" />
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      No matching formulas found
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                      No formula matches &quot;{searchQuery}&quot;. Try searching with alternate terminology, symbol names, or keywords.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                      Reset Search
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {searchResults.map(({ formula, chapter, level }) => (
                      <FormulaCard
                        key={formula.id}
                        formula={formula}
                        chapterTitle={chapter.title}
                        levelTitle={level.shortTitle}
                        highlightQuery={searchQuery}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Categorized Academic Level & Chapter Hierarchy View */
              <div className="space-y-8">
                {(selectedLevelId
                  ? physicsAcademicLevels.filter((lvl) => lvl.id === selectedLevelId)
                  : physicsAcademicLevels
                ).map((level) => {
                  const chaptersToRender = selectedChapterId
                    ? level.chapters.filter((ch) => ch.id === selectedChapterId)
                    : level.chapters;

                  if (chaptersToRender.length === 0) return null;

                  return (
                    <section key={level.id} className="space-y-4">
                      {/* Academic Level Section Header */}
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b border-slate-200/90 dark:border-slate-800">
                        <div>
                          <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                            {level.title}
                          </h2>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                            {level.description}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
                          {chaptersToRender.length}{' '}
                          {chaptersToRender.length === 1 ? 'chapter' : 'chapters'}
                        </span>
                      </div>

                      {/* Chapters Accordions */}
                      <div className="space-y-3">
                        {chaptersToRender.map((chapter, chIdx) => (
                          <ChapterAccordion
                            key={chapter.id}
                            chapter={chapter}
                            levelTitle={level.shortTitle}
                            defaultExpanded={Boolean(selectedChapterId) || chIdx === 0}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Physical Constants Reference Modal */}
      <ConstantsModal
        isOpen={isConstantsModalOpen}
        onClose={() => setIsConstantsModalOpen(false)}
        onSelectSubjectTab={() => setActiveSubject('constants')}
      />
    </div>
  );
}
