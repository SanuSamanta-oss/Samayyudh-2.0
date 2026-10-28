'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Clock,
} from 'lucide-react';

const upcomingMathModules = [
  {
    title: 'Algebra and Polynomials',
    levels: 'Class 10 - Class 12, Higher Education',
    topics: ['Quadratic Equations', 'Arithmetic Progressions', 'Binomial Theorem', 'Matrices and Determinants', 'Complex Numbers'],
  },
  {
    title: 'Differential and Integral Calculus',
    levels: 'Class 11 - Class 12, Engineering / University',
    topics: ['Limits and Continuity', 'Derivatives and Chain Rule', 'Definite and Indefinite Integrals', 'Differential Equations'],
  },
  {
    title: 'Trigonometry and Inverse Functions',
    levels: 'Class 10 - Class 12',
    topics: ['Trigonometric Ratios and Identities', 'Multiple and Submultiple Angles', 'Inverse Trigonometric Functions'],
  },
  {
    title: 'Coordinate Geometry and Conic Sections',
    levels: 'Class 10 - Class 12',
    topics: ['Straight Lines and Slopes', 'Circles and Tangents', 'Parabolas, Ellipses, and Hyperbolas'],
  },
  {
    title: 'Vectors and Three-Dimensional Geometry',
    levels: 'Class 12, Higher Education',
    topics: ['Dot and Cross Products', 'Direction Cosines and Direction Ratios', 'Planes and Shortest Distance Between Lines'],
  },
  {
    title: 'Probability and Statistics',
    levels: 'Class 10 - Class 12, Higher Education',
    topics: ['Measures of Central Tendency and Dispersion', 'Conditional Probability and Bayes Theorem', 'Probability Distributions'],
  },
];

export function MathematicsPlaceholder() {
  return (
    <div className="space-y-8">
      {/* Primary Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] p-6 md:p-10 shadow-xs"
      >
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/80 mb-4">
            <Clock className="w-3.5 h-3.5" />
            <span>Curriculum Staging Area</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Mathematics Formula Library
          </h2>

          <p className="mt-2 text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
            Mathematics formulas and topic-wise revision materials will be added here soon.
          </p>

          <p className="mt-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
            The mathematical data architecture is pre-configured to support Class 10, Class 11, Class 12, and undergraduate advanced modules.
          </p>
        </div>
      </motion.div>

      {/* Planned Structure Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Planned Curriculum Structure
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Architecture ready for academic level, chapter, topic, and formula type indexing.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E]">
            6 Core Divisions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingMathModules.map((mod, index) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] p-5 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200/60 dark:border-purple-800/80 flex items-center justify-center text-purple-700 dark:text-purple-300">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    {mod.title}
                  </h4>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">
                    {mod.levels}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                {mod.topics.map((topic) => (
                  <div
                    key={topic}
                    className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0" />
                    <span className="truncate">{topic}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
