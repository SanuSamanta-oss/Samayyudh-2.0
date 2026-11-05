// ============================================================
// SamayYudh 2.0 — SOKHA Bot Complete Platform Knowledge & Memory
// Comprehensive architectural guide, routes, features, exam coverage,
// time-pressure mechanics, and future-ready contextual knowledge.
// ============================================================

export interface PlatformSectionInfo {
  title: string;
  path: string;
  description: string;
  keyFeatures: string[];
}

export const PLATFORM_SECTIONS: Record<string, PlatformSectionInfo> = {
  dashboard: {
    title: 'Dashboard',
    path: '/dashboard',
    description: 'Central command center showing active streaks, speed vs. score telemetry, recent exam battles, and quick-start battle buttons.',
    keyFeatures: [
      'Daily study streak counter with fire badges',
      'Recent battle history and evaluated scores',
      'Speed vs. accuracy ratio performance chart',
      'One-click Quick Battle launcher',
    ],
  },
  pyq: {
    title: 'Explore PYQs',
    path: '/pyq',
    description: 'Full Previous Year Question (PYQ) database for competitive exams, complete with authentic diagrams, step-by-step LaTeX solutions, and battle mode.',
    keyFeatures: [
      'JEE Main 2025: 22 January Shift 1 & Shift 2 with Section A (20 MCQs) and Section B (5 Numerical Value Questions with direct numerical answer inputs)',
      'JEE Advanced: Complete archive of all 95 chapters across Physics (33 ch, 388 Qs), Chemistry (31 ch, 306 Qs), and Mathematics (31 ch, 300 Qs) — 994 questions total',
      '394 local high-definition diagrams and real organic chemical reaction schemes in public/jee_advanced_diagrams/',
      'Rigorous mathematical and chemical notation rendered via KaTeX',
      'Direct "Solve in Battle" button on every question to practice under live clock pressure',
      '"Battle This Section" button to convert an entire paper section into a timed battle',
      'Filters by Subject, Chapter, Exam Level, Year, Shift, and Section',
    ],
  },
  formulas: {
    title: 'Formula Library',
    path: '/formulas',
    description: 'Comprehensive mathematical, physical, and scientific formula library with interactive KaTeX rendering, variable definitions, and slide-in detail drawers.',
    keyFeatures: [
      'Physics Formula Library: Class 10, Class 11, Class 12, and Higher Education across Kinematics, Dynamics, Thermodynamics, Waves, Electromagnetism, and Modern Physics',
      'Physical Constants: Standard SI constants database (speed of light c, Planck h, G, electron charge e, Boltzmann kB, Avogadro NA, etc.) with values, units, dimensions, and defining equations',
      'Mathematics Formula Library: All 6 Core Divisions & 21 Subtopics populated with 206+ formulas:',
      '  • Division 1: Algebra and Polynomials (Quadratic Equations, AP, Binomial Theorem, Matrices and Determinants, Complex Numbers)',
      '  • Division 2: Differential & Integral Calculus (Limits & Continuity, Derivatives & Chain Rule, Definite/Indefinite Integrals, Differential Equations)',
      '  • Division 3: Trigonometry & Inverse Functions (Ratios & Identities, Multiple/Submultiple Angles, Inverse Trigonometric Functions)',
      '  • Division 4: Coordinate Geometry & Conic Sections (Straight Lines & Slopes, Circles & Tangents, Parabolas, Ellipses, Hyperbolas)',
      '  • Division 5: Vectors & Three-Dimensional Geometry (Dot & Cross Products, Direction Cosines & Ratios, Planes & Skew Lines)',
      '  • Division 6: Probability & Statistics (Central Tendency & Dispersion, Bayes\' Theorem, Probability Distributions)',
      'Smooth slide-in formula detail modal with keyboard navigation (Arrow keys + Escape)',
      'Copy LaTeX code and typeset equation toggle',
      'Search across names, expressions, symbols, and concepts',
    ],
  },
  exams: {
    title: 'Exams Catalog',
    path: '/exams',
    description: 'Extensive syllabus and chapter breakdown for premier competitive examinations in India.',
    keyFeatures: [
      'Engineering: JEE Main, JEE Advanced, GATE (CS, ME, CE, EE, EC), WBJEE',
      'Medical: NEET UG (Physics, Chemistry, Biology)',
      'Civil Services & Government: UPSC CSE (Prelims & Mains), SSC CGL, Banking (IBPS PO, SBI PO), Railways (RRB NTPC)',
      'Management: CAT (Quantitative Aptitude, DILR, Verbal Ability)',
      'University & Custom Exams: Custom curriculum creator to add custom papers and syllabus tracks',
    ],
  },
  practice: {
    title: 'Practice Arena',
    path: '/practice',
    description: 'Choose your battle format and time-pressure endurance level.',
    keyFeatures: [
      'Quick Battle: 10 questions (~10 minutes) — best for daily warmups',
      'Practice Battle: 25 questions (~25 minutes) — standard chapter revision',
      'Half Century: 50 questions (~50 minutes) — endurance workout',
      'Full Century: 100 questions (~100 minutes) — full marathon simulation',
      'Real-time timer tracking and speed metrics',
    ],
  },
  activeExam: {
    title: 'Active Exam Workspace',
    path: '/exam/session',
    description: 'Split-view examination battle interface engineered for deep focus under clock pressure.',
    keyFeatures: [
      'Split layout: Question prompt and mark weightage on left, answer editor with Markdown/LaTeX support on right',
      'Auto-save every 2 seconds to local IndexedDB (zero loss on accidental close or connection drop)',
      'Persistent timer that survives page reloads and browser restarts',
      'Built-in Sticky Notes drawer for quick calculations and scratchpad thoughts without leaving the exam',
      'Full-screen distraction-free battle mode',
    ],
  },
  history: {
    title: 'History & Evaluations',
    path: '/history',
    description: 'Review previous exam sessions, speed metrics, and in-depth AI evaluation reports.',
    keyFeatures: [
      'AI Evaluator powered by Gemini AI with rubric-based scoring',
      'Time management analysis: detects if student answered "Too fast", "On time", or "Too slow"',
      'Point-by-point breakdown: missing concepts, examiner remarks, model answers',
    ],
  },
  analytics: {
    title: 'Analytics & Telemetry',
    path: '/analytics',
    description: 'Deep performance analytics, accuracy distribution, time spent per subject, and speed curves.',
    keyFeatures: [
      'Speed vs accuracy telemetry',
      'Weakness detection across chapters',
      'Study time graphs and daily productivity metrics',
    ],
  },
  achievements: {
    title: 'Badges & Achievements',
    path: '/achievements',
    description: 'Milestones, streaks, speed medals, and century celebrations.',
    keyFeatures: [
      'Streak badges for consecutive daily battles',
      'Half Century 🏏 and Full Century 🏆 medals',
      'Speed Demon, Precision Master, and Endurance Badges',
    ],
  },
  notes: {
    title: 'Notes & Scratchpad',
    path: '/notes',
    description: 'Archive of all sticky notes and important formulas saved during exam battles.',
    keyFeatures: [
      'Searchable notes archive',
      'Organized by exam session and date',
      'Export notes for quick offline revision',
    ],
  },
  profile: {
    title: 'Student Profile',
    path: '/profile',
    description: 'Personalized identity, custom avatar selection or photo upload, total study hours, and academic targets.',
    keyFeatures: [
      'Custom avatar gallery and photo upload',
      'Total hours spent in battle',
      'Target exam settings and graduation milestones',
    ],
  },
  settings: {
    title: 'Settings',
    path: '/settings',
    description: 'System configurations, theme engine, study alarms, and notification controls.',
    keyFeatures: [
      'Dual high-contrast Dark and Light theme engine',
      'Daily study battle alarms (e.g., 8:00 PM reminder)',
      'Audio chimes and vibration alerts for timer countdowns',
      'Streak shield alerts and offline storage clearing tools',
    ],
  },
};

export function getPlatformKnowledgePrompt(currentPath?: string): string {
  const normalizedPath = currentPath ? currentPath.toLowerCase().trim() : '';
  let currentPageContext = '';

  if (normalizedPath) {
    if (normalizedPath.includes('pyq')) {
      currentPageContext = `\nSTUDENT'S CURRENT LOCATION: The student is currently browsing the [Explore PYQs](/pyq) section. Highlight relevant previous year papers, shifts, section A/B questions, or offer guidance on solving them in Battle Mode.`;
    } else if (normalizedPath.includes('formula')) {
      currentPageContext = `\nSTUDENT'S CURRENT LOCATION: The student is currently browsing the [Formula Library](/formulas). Help them with mathematical or physics formulas, derivations, variable definitions, or navigating between the 6 Mathematics divisions and Physics levels.`;
    } else if (normalizedPath.includes('practice')) {
      currentPageContext = `\nSTUDENT'S CURRENT LOCATION: The student is on the [Practice Arena](/practice). Guide them to select the right battle mode (Quick Battle, Practice, Half Century, Full Century) for their available time.`;
    } else if (normalizedPath.includes('exam')) {
      currentPageContext = `\nSTUDENT'S CURRENT LOCATION: The student is on an Exam page or Active Battle session. Focus on pacing, clock management, answer structuring, and remaining calm under time pressure.`;
    } else if (normalizedPath.includes('analytics')) {
      currentPageContext = `\nSTUDENT'S CURRENT LOCATION: The student is inspecting [Analytics](/analytics). Offer actionable insights on improving their speed vs. score ratio and tackling weak chapters.`;
    } else if (normalizedPath.includes('dashboard')) {
      currentPageContext = `\nSTUDENT'S CURRENT LOCATION: The student is on their [Dashboard](/dashboard). Welcome them warmly, review their streak progress, and recommend an immediate battle session.`;
    }
  }

  return `
EXTENSIVE PLATFORM KNOWLEDGE — SAMAYYUDH 2.0 (সময়যুদ্ধ 2.0):

1. CORE MISSION & PHILOSOPHY:
   - "The Battle Between You & The Clock": An advanced, universal examination time-pressure simulator and comprehensive learning ecosystem.
   - Core Philosophy: Most capable students fail competitive exams not from lack of knowledge, but from clock panic, poor pacing, and freezing under pressure. SamayYudh trains the mental muscle to write concise, high-scoring answers rapidly.
   - PWA & 100% Offline Resilience: Works offline using client-side service worker caching and IndexedDB. Practice battles, formulas, and notes remain accessible even with zero internet.

2. TIME-MANAGEMENT SCORING RULES:
   - 2-Mark Questions: 2 minutes recommended time.
   - 5-Mark Questions: 6 minutes recommended time.
   - 10-Mark Questions: 12 minutes recommended time.
   - Timers persist across reloads (timestamp-based tracking).
   - "Golden Rule of SamayYudh": Allocate time strictly proportional to marks. Write the core formulation/equation first, state assumptions, compute methodically, and conclude.

3. EXPLORE PREVIOUS YEAR QUESTIONS (PYQ) SECTION ([Explore PYQs](/pyq)):
   - JEE Main 2025: Fully digitized archive of 22 January Shift 1 and Shift 2 papers.
     • Section A: 20 Multiple Choice Questions with verified answer keys, detailed explanations, and instant options checking.
     • Section B: 5 Numerical Value Questions with direct numerical input fields.
     • Interactive "Solve in Battle" button on every question to practice under real timer pressure.
     • "Battle This Section" button to attempt all 25 questions in the shift as a timed simulation.
   - JEE Advanced: Comprehensive chapterwise archive of 95 complete chapters:
     • Physics: 33 Chapters (Kinematics, Laws of Motion, Rotational Dynamics, Thermodynamics, Optics, Modern Physics — 388 Questions).
     • Chemistry: 31 Chapters (Physical Chemistry, Inorganic, Organic Reactions, Coordination Chemistry, Biomolecules — 306 Questions).
     • Mathematics: 31 Chapters (Calculus, Conic Sections, Vectors & 3D, Probability, Matrices — 300 Questions).
     • Total Database: 994 JEE Advanced questions, 1,352 questions across all PYQ archives.
     • All 394 local diagram graphics in public/jee_advanced_diagrams/ with zero broken images.
     • Rigorous KaTeX mathematical rendering and standard IUPAC chemical reactions.

4. FORMULA LIBRARY SECTION ([Formula Library](/formulas)):
   - Physics Formula Library: Complete topic-wise catalog for Class 10, Class 11, Class 12, and Higher Education.
   - Physical Constants Database: 20 fundamental SI physical constants (Universal, Electromagnetism, Thermodynamics, Atomic/Nuclear) with standard numerical values, SI units, dimensional formulas, and defining relationships.
   - Mathematics Formula Library: Fully populated with 206+ formulas across all 6 core divisions:
     • Division 1: Algebra and Polynomials (Quadratic Equations, Arithmetic Progressions, Binomial Theorem, Matrices and Determinants, Complex Numbers).
     • Division 2: Differential and Integral Calculus (Limits and Continuity, Derivatives and Chain Rule, Definite and Indefinite Integrals, Differential Equations).
     • Division 3: Trigonometry and Inverse Functions (Trigonometric Ratios and Identities, Multiple and Submultiple Angles, Inverse Trigonometric Functions).
     • Division 4: Coordinate Geometry and Conic Sections (Straight Lines and Slopes, Circles and Tangents, Parabolas, Ellipses, Hyperbolas).
     • Division 5: Vectors and Three-Dimensional Geometry (Dot and Cross Products, Direction Cosines and Direction Ratios, Planes and Shortest Distance Between Lines).
     • Division 6: Probability and Statistics (Measures of Central Tendency and Dispersion, Conditional Probability and Bayes' Theorem, Probability Distributions).
   - Features: Smooth spring slide-in detail drawer, keyboard shortcuts (Left/Right arrow keys for prev/next formula, Esc to close), variable breakdown tables, domain constraints, and one-click LaTeX code copying.

5. PRACTICE MODES ([Practice Arena](/practice)):
   - Quick Battle: 10 questions (~10 minutes) for daily streak maintenance.
   - Practice Battle: 25 questions (~25 minutes) standard revision session.
   - Half Century: 50 questions (~50 minutes) endurance workout.
   - Full Century: 100 questions (~100 minutes) full marathon test.

6. ACTIVE EXAM WORKSPACE ([Active Exam](/exam/session)):
   - Split layout: question prompt on left, countdown timer on top, answer text editor with Markdown and LaTeX support on right.
   - Auto-saves every 2 seconds to local IndexedDB.
   - Timer persistence: timer survives page reloads and browser restarts.
   - Built-in Sticky Notes drawer for quick scratchpad work without leaving the battle.
   - Full-screen distraction-free battle mode.

7. AI EVALUATION ENGINE ([History & Evaluations](/history)):
   - Powered by Gemini AI. Scores answers against rubrics and marks.
   - Analyzes time management: classifies answer pace into "Too fast" (rushed, lacking key steps), "On time" (balanced), or "Too slow" (time overrun penalty).
   - Identifies missing points, provides model answers, and examiner feedback.

8. COMPLETE NAVIGATION LINKS GUIDE (ALWAYS USE CLEAN MARKDOWN):
   - [Dashboard](/dashboard)
   - [Explore PYQs](/pyq)
   - [Formula Library](/formulas)
   - [Explore Exams](/exams)
   - [Practice Arena](/practice)
   - [Active Exam](/exam/session)
   - [History & Evaluations](/history)
   - [Analytics & Telemetry](/analytics)
   - [Badges & Achievements](/achievements)
   - [Notes & Scratchpad](/notes)
   - [Student Profile](/profile)
   - [Settings](/settings)

9. FUTURE PLATFORM CHANGES & ADAPTABILITY:
   - SOKHA has a living memory. When students ask about upcoming features (e.g., additional years of JEE shifts, NEET Mock series, multiplayer peer battles, custom PDF test generation):
     • Enthusiastically confirm that SamayYudh 2.0 is actively expanding.
     • Point them to the current live equivalent (e.g., recommend [Explore PYQs](/pyq) for solving real questions, or [Practice Arena](/practice) for custom battle runs).
     • Never claim a feature is completely absent if it is already in the platform. Always consult this comprehensive platform guide first!
${currentPageContext}`;
}

