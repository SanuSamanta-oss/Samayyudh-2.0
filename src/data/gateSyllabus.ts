// ============================================================
// SamayYudh 2.0 — Official GATE 2026 Examination Syllabus & Architecture
// Complete test papers (30 papers), section structures & chapter mapping
// ============================================================

import { SAMPLE_QUESTIONS } from '@/lib/questions';

export type GateCategoryKey =
  | 'all'
  | 'engineering'
  | 'computer'
  | 'science'
  | 'interdisciplinary'
  | 'humanities';

export interface GateCategoryTab {
  key: GateCategoryKey;
  label: string;
  description: string;
}

export const GATE_CATEGORY_TABS: GateCategoryTab[] = [
  { key: 'all', label: 'All Papers', description: 'Browse all 30 official GATE papers' },
  { key: 'engineering', label: 'Engineering', description: 'Core and applied engineering disciplines' },
  { key: 'computer', label: 'Computer & Technology', description: 'Computer Science, IT, Data Science and AI' },
  { key: 'science', label: 'Science', description: 'Physical, Chemical, Earth and Life Sciences' },
  { key: 'interdisciplinary', label: 'Interdisciplinary', description: 'Engineering Sciences, Life Sciences, Geomatics' },
  { key: 'humanities', label: 'Architecture & Humanities', description: 'Architecture, Planning and Humanities' },
];

export interface GateChapter {
  id: string;
  number: number;
  name: string;
  description?: string;
  subtopics?: string[];
}

export interface GateSection {
  id: string;
  code: string;
  name: string;
  isCompulsory: boolean;
  type: 'aptitude' | 'math' | 'core' | 'compulsory' | 'optional';
  marksAllocation?: string;
  description?: string;
  chapters: GateChapter[];
}

export interface GatePaper {
  code: string;
  name: string;
  category: GateCategoryKey;
  description: string;
  hasEnggMath: boolean;
  sections: GateSection[];
  historicalSessions?: string[];
  totalMarks?: number;
  durationMinutes?: number;
}

// ── Common General Aptitude Syllabus (15 Marks, across all 30 papers) ─────
export const COMMON_GENERAL_APTITUDE_SECTION: GateSection = {
  id: 'ga',
  code: 'GA',
  name: 'General Aptitude',
  isCompulsory: true,
  type: 'aptitude',
  marksAllocation: '15 Marks',
  description: 'Common section across all GATE test papers: Verbal, Quantitative, Analytical and Spatial Reasoning.',
  chapters: [
    {
      id: 'ga-verbal',
      number: 1,
      name: 'Verbal Aptitude',
      description: 'Basic English grammar, sentence completion, verbal analogies, word groups, instructions, critical reasoning and verbal deduction.',
      subtopics: ['English Grammar', 'Sentence Completion', 'Verbal Analogies', 'Word Groups', 'Critical Reasoning'],
    },
    {
      id: 'ga-quantitative',
      number: 2,
      name: 'Quantitative Aptitude',
      description: 'Data interpretation (data graphs, tables), numerical computation, elementary statistics, probability, mensuration and geometry.',
      subtopics: ['Data Interpretation', 'Numerical Computation', 'Numerical Estimation', 'Elementary Statistics', 'Probability'],
    },
    {
      id: 'ga-analytical',
      number: 3,
      name: 'Analytical Aptitude',
      description: 'Logic: deduction and induction, analogy, numerical reasoning and complex relations.',
      subtopics: ['Deductive Reasoning', 'Inductive Reasoning', 'Analogy', 'Numerical Reasoning', 'Pattern Recognition'],
    },
    {
      id: 'ga-spatial',
      number: 4,
      name: 'Spatial Aptitude',
      description: 'Transformation of shapes: translation, rotation, scaling, mirroring, paper folding, cutting and patterns in 2D and 3D.',
      subtopics: ['2D Transformation', '3D Shape Assembly', 'Paper Folding & Cutting', 'Mirroring & Inversion'],
    },
  ],
};

// ── Standard Engineering Mathematics Chapters (13 Marks) ─────────────────
const STANDARD_ENGG_MATH_CHAPTERS: GateChapter[] = [
  {
    id: 'em-linear-algebra',
    number: 1,
    name: 'Linear Algebra',
    description: 'Matrices and determinants, linear equations, eigenvalues and eigenvectors, Cayley-Hamilton theorem.',
    subtopics: ['Matrix Algebra', 'Systems of Linear Equations', 'Eigenvalues & Eigenvectors', 'LU Decomposition'],
  },
  {
    id: 'em-calculus',
    number: 2,
    name: 'Calculus',
    description: 'Functions of single variable, limit, continuity, mean value theorems, evaluation of definite and improper integrals, partial derivatives, maxima and minima.',
    subtopics: ['Limits & Continuity', 'Mean Value Theorems', 'Definite Integrals', 'Partial Derivatives', 'Multiple Integrals'],
  },
  {
    id: 'em-differential-equations',
    number: 3,
    name: 'Differential Equations',
    description: 'First order equations (linear and nonlinear), higher order linear differential equations with constant coefficients, Cauchy-Euler equations, Laplace transforms.',
    subtopics: ['First Order ODEs', 'Higher Order Linear ODEs', 'Cauchy-Euler Equations', 'Laplace Transforms'],
  },
  {
    id: 'em-complex-variables',
    number: 4,
    name: 'Complex Variables',
    description: 'Analytic functions, Cauchy-Riemann equations, Cauchy integral theorem and integral formula, Taylor and Laurent series, residue theorem.',
    subtopics: ['Analytic Functions', 'Cauchy-Riemann Equations', 'Cauchy Integral Theorem', 'Taylor & Laurent Series', 'Residue Calculus'],
  },
  {
    id: 'em-probability-statistics',
    number: 5,
    name: 'Probability and Statistics',
    description: 'Sampling theorems, conditional probability, mean, median, mode and standard deviation, random variables, binomial, Poisson and normal distributions.',
    subtopics: ['Conditional Probability', 'Random Variables', 'Probability Distributions', 'Hypothesis Testing', 'Correlation & Regression'],
  },
  {
    id: 'em-numerical-methods',
    number: 6,
    name: 'Numerical Methods',
    description: 'Numerical solutions of linear and non-linear algebraic equations, integration by trapezoidal and Simpson rules, single and multi-step methods for ODEs.',
    subtopics: ['Root Finding Algorithms', 'Newton-Raphson Method', 'Trapezoidal & Simpson Rules', 'Runge-Kutta Methods'],
  },
];

const STANDARD_ENGG_MATH_SECTION: GateSection = {
  id: 'em',
  code: 'EM',
  name: 'Engineering Mathematics',
  isCompulsory: true,
  type: 'math',
  marksAllocation: '13 Marks',
  description: 'Foundational mathematical concepts for engineering analysis and computation.',
  chapters: STANDARD_ENGG_MATH_CHAPTERS,
};

// ── Complete Official Syllabus for All 30 GATE Papers ─────────────────────
export const GATE_PAPERS_CONFIG: GatePaper[] = [
  // ── 1. Computer Science & Information Technology (CS) ─────────────────
  {
    code: 'CS',
    name: 'Computer Science and Information Technology',
    category: 'computer',
    description: 'Digital Logic, Architecture, Algorithms, OS, Databases, Networks, Theory of Computation and Discrete Mathematics.',
    hasEnggMath: true,
    historicalSessions: ['GATE-CS-1', 'GATE-CS-2'],
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      {
        id: 'cs-math',
        code: 'EM',
        name: 'Engineering Mathematics',
        isCompulsory: true,
        type: 'math',
        marksAllocation: '13 Marks',
        chapters: [
          { id: 'cs-discrete-math', number: 1, name: 'Discrete Mathematics', description: 'Propositional and first order logic, sets, relations, functions, partial orders and lattices, groups, combinatorics, graph theory.' },
          { id: 'cs-linear-algebra', number: 2, name: 'Linear Algebra', description: 'Matrices, determinants, system of linear equations, eigenvalues and eigenvectors, LU decomposition.' },
          { id: 'cs-calculus', number: 3, name: 'Calculus', description: 'Limits, continuity and differentiability, maxima and minima, mean value theorem, integration.' },
          { id: 'cs-probability', number: 4, name: 'Probability and Statistics', description: 'Random variables, uniform, normal, exponential, Poisson and binomial distributions, mean, median, mode, standard deviation, conditional probability.' },
        ],
      },
      {
        id: 'cs-core',
        code: 'CS-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '72 Marks',
        chapters: [
          { id: 'cs-digital-logic', number: 1, name: 'Digital Logic', description: 'Boolean algebra, combinational and sequential circuits, minimization, number representations and computer arithmetic.' },
          { id: 'cs-coa', number: 2, name: 'Computer Organization and Architecture', description: 'Machine instructions and addressing modes, ALU, data-path and control unit, instruction pipelining, pipeline hazards, memory hierarchy, I/O interface.' },
          { id: 'cs-prog-ds', number: 3, name: 'Programming and Data Structures', description: 'Programming in C, recursion, arrays, stacks, queues, linked lists, trees, binary search trees, binary heaps, graphs.' },
          { id: 'cs-algorithms', number: 4, name: 'Algorithms', description: 'Searching, sorting, hashing, asymptotic analysis, greedy algorithms, dynamic programming, divide-and-conquer, graph search, minimum spanning trees, shortest paths.' },
          { id: 'cs-toc', number: 5, name: 'Theory of Computation', description: 'Regular expressions and finite automata, context-free grammars and push-down automata, regular and context-free languages, Turing machines and undecidability.' },
          { id: 'cs-compiler', number: 6, name: 'Compiler Design', description: 'Lexical analysis, parsing, syntax-directed translation, runtime environments, intermediate code generation, code optimization and data flow analysis.' },
          { id: 'cs-os', number: 7, name: 'Operating Systems', description: 'Processes, threads, inter-process communication, concurrency and synchronization, deadlocks, CPU and I/O scheduling, memory management and virtual memory, file systems.' },
          { id: 'cs-dbms', number: 8, name: 'Databases', description: 'ER-model, relational model, relational algebra, tuple calculus, SQL, integrity constraints, normal forms, transactions and concurrency control, file organization and indexing.' },
          { id: 'cs-cn', number: 9, name: 'Computer Networks', description: 'Concept of layering, LAN technologies, Flow and error control techniques, routing algorithms, IPv4/IPv6, routers, TCP/UDP and sockets, congestion control, application layer protocols, network security.' },
        ],
      },
    ],
  },

  // ── 2. Data Science and Artificial Intelligence (DA) ──────────────────
  {
    code: 'DA',
    name: 'Data Science and Artificial Intelligence',
    category: 'computer',
    description: 'Foundations of Data Science, Machine Learning, Deep Learning, AI, Databases, Big Data and Optimization.',
    hasEnggMath: false,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      {
        id: 'da-core',
        code: 'DA-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '85 Marks',
        chapters: [
          { id: 'da-prob-stats', number: 1, name: 'Probability and Statistics', description: 'Counting, axiomatic probability, Bayes theorem, random variables, distributions, central limit theorem, hypothesis testing.' },
          { id: 'da-linear-algebra', number: 2, name: 'Linear Algebra', description: 'Vector spaces, subspace, linear dependence and independence, matrices, eigenvalues and eigenvectors, SVD, PCA.' },
          { id: 'da-calculus-opt', number: 3, name: 'Calculus and Optimization', description: 'Functions of single and several variables, partial derivatives, gradient vector, directional derivative, convex sets and functions, unconstrained and constrained optimization.' },
          { id: 'da-prog-ds', number: 4, name: 'Programming, Data Structures and Algorithms', description: 'Python programming, basic data structures (stacks, queues, linked lists, trees, hash tables), search and sorting algorithms, graph algorithms.' },
          { id: 'da-dbms', number: 5, name: 'Database Management and Warehousing', description: 'Relational data model, relational algebra, SQL, integrity constraints, normal forms, indexing, data warehousing concepts.' },
          { id: 'da-ml', number: 6, name: 'Machine Learning', description: 'Supervised learning: regression, classification, decision trees, SVM, k-NN; Unsupervised learning: clustering (k-means, hierarchical), dimensionality reduction.' },
          { id: 'da-ai', number: 7, name: 'Artificial Intelligence', description: 'Search strategies: informed, uninformed, adversarial; knowledge representation, propositional and predicate logic, reasoning under uncertainty.' },
        ],
      },
    ],
  },

  // ── 3. Aerospace Engineering (AE) ─────────────────────────────────────
  {
    code: 'AE',
    name: 'Aerospace Engineering',
    category: 'engineering',
    description: 'Aerodynamics, Flight Mechanics, Space Dynamics, Aircraft Structures and Rocket Propulsion.',
    hasEnggMath: true,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      STANDARD_ENGG_MATH_SECTION,
      {
        id: 'ae-core',
        code: 'AE-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '72 Marks',
        chapters: [
          { id: 'ae-flight-mechanics', number: 1, name: 'Flight Mechanics', description: 'Atmosphere: Standard atmosphere; Aircraft performance, static and dynamic stability, controls.' },
          { id: 'ae-space-dynamics', number: 2, name: 'Space Dynamics', description: 'Central force motion, Kepler laws, orbital transfers, satellite orbit perturbations, orbit determination.' },
          { id: 'ae-aerodynamics', number: 3, name: 'Aerodynamics', description: 'Potential flow theory, airfoil and wing aerodynamics, compressible aerodynamics, boundary layer theory, shock waves.' },
          { id: 'ae-structures', number: 4, name: 'Structures', description: 'Strength of materials, flight vehicle structures, structural dynamics, aeroelasticity, theory of elasticity.' },
          { id: 'ae-propulsion', number: 5, name: 'Propulsion', description: 'Aircraft engines, thermodynamics of gas turbine components, rocket engines (solid, liquid and hybrid).' },
        ],
      },
    ],
  },

  // ── 4. Agricultural Engineering (AG) ──────────────────────────────────
  {
    code: 'AG',
    name: 'Agricultural Engineering',
    category: 'engineering',
    description: 'Farm Machinery, Farm Power, Soil and Water Conservation, Irrigation and Dairy Processing.',
    hasEnggMath: true,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      STANDARD_ENGG_MATH_SECTION,
      {
        id: 'ag-core',
        code: 'AG-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '72 Marks',
        chapters: [
          { id: 'ag-farm-power', number: 1, name: 'Farm Power', description: 'Sources of power on the farm, IC engines, tractor systems and controls, mechanics of tractor chassis.' },
          { id: 'ag-farm-machinery', number: 2, name: 'Farm Machinery', description: 'Tillage, planting, plant protection, harvesting and threshing equipment, machinery cost economics.' },
          { id: 'ag-soil-water', number: 3, name: 'Soil and Water Conservation', description: 'Hydrology, soil erosion, watershed management, design of soil conservation structures.' },
          { id: 'ag-irrigation', number: 4, name: 'Irrigation and Drainage Engineering', description: 'Soil-water-plant relationships, design of irrigation methods, tube-well hydraulics, drainage systems.' },
          { id: 'ag-processing', number: 5, name: 'Agricultural Processing Engineering', description: 'Drying, storage, size reduction, separation, material handling, dairy and food engineering.' },
        ],
      },
    ],
  },

  // ── 5. Biomedical Engineering (BM) ────────────────────────────────────
  {
    code: 'BM',
    name: 'Biomedical Engineering',
    category: 'engineering',
    description: 'Biomedical Instrumentation, Biomechanics, Signals & Systems, Medical Imaging and Biomaterials.',
    hasEnggMath: true,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      STANDARD_ENGG_MATH_SECTION,
      {
        id: 'bm-core',
        code: 'BM-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '72 Marks',
        chapters: [
          { id: 'bm-circuits-signals', number: 1, name: 'Electrical Circuits and Signals', description: 'Circuit elements, Kirchhoff laws, network theorems, transient analysis, continuous and discrete signals and systems.' },
          { id: 'bm-analog-digital', number: 2, name: 'Analog and Digital Electronics', description: 'Op-amps, active filters, ADC/DAC, microprocessors and microcontrollers, digital circuits.' },
          { id: 'bm-measurements-sensors', number: 3, name: 'Sensors and Bioinstrumentation', description: 'Transducers, biomedical electrodes, ECG, EEG, EMG acquisition, patient monitoring and safety.' },
          { id: 'bm-anatomy-physiology', number: 4, name: 'Human Anatomy and Medical Imaging', description: 'Cardiovascular, respiratory, nervous systems; X-ray, CT, MRI, Ultrasound and PET imaging principles.' },
          { id: 'bm-biomechanics', number: 5, name: 'Biomechanics and Biomaterials', description: 'Fluid mechanics in cardiovascular systems, musculoskeletal biomechanics, biocompatibility, tissue engineering.' },
        ],
      },
    ],
  },

  // ── 6. Biotechnology (BT) ─────────────────────────────────────────────
  {
    code: 'BT',
    name: 'Biotechnology',
    category: 'engineering',
    description: 'Bioprocess Engineering, Recombinant DNA Technology, Genetics, Molecular Biology and Bioinformatics.',
    hasEnggMath: true,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      STANDARD_ENGG_MATH_SECTION,
      {
        id: 'bt-core',
        code: 'BT-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '72 Marks',
        chapters: [
          { id: 'bt-gen-biology', number: 1, name: 'General Biology and Genetics', description: 'Evolution, cellular organization, Mendelian inheritance, gene mapping, population genetics.' },
          { id: 'bt-mol-biology', number: 2, name: 'Biochemistry and Molecular Biology', description: 'Structure and function of biomolecules, enzyme kinetics, DNA replication, transcription, translation.' },
          { id: 'bt-bioengineering', number: 3, name: 'Fundamentals of Biological Engineering', description: 'Engineering principles of biological systems, mass and energy balance in bioprocesses, heat and mass transfer.' },
          { id: 'bt-bioprocess', number: 4, name: 'Bioprocess Engineering & Biotechnology', description: 'Bioreactor design, sterilization, aeration, agitation, downstream processing, fermentation technology.' },
          { id: 'bt-rdna-tools', number: 5, name: 'Recombinant DNA Technology and Tools', description: 'Restriction enzymes, cloning vectors, PCR, gene therapy, transgenic plants and animals, bioinformatics.' },
        ],
      },
    ],
  },

  // ── 7. Civil Engineering (CE) ─────────────────────────────────────────
  {
    code: 'CE',
    name: 'Civil Engineering',
    category: 'engineering',
    description: 'Structural Analysis, Geotechnical, Water Resources, Environmental, Transportation and Geomatics.',
    hasEnggMath: true,
    historicalSessions: ['GATE-CE-1', 'GATE-CE-2'],
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      STANDARD_ENGG_MATH_SECTION,
      {
        id: 'ce-core',
        code: 'CE-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '72 Marks',
        chapters: [
          { id: 'ce-structures', number: 1, name: 'Structural Engineering', description: 'Engineering mechanics, solid mechanics, structural analysis, construction materials & management, concrete and steel structures.' },
          { id: 'ce-geotech', number: 2, name: 'Geotechnical Engineering', description: 'Soil mechanics, permeability, seepage, consolidation, shear strength, earth pressure theories, shallow and deep foundations.' },
          { id: 'ce-water-resources', number: 3, name: 'Water Resources Engineering', description: 'Fluid mechanics, hydraulics, hydrology, flood estimation, reservoir routing, irrigation and canal design.' },
          { id: 'ce-environmental', number: 4, name: 'Environmental Engineering', description: 'Water and wastewater quality and treatment, air pollution, municipal solid waste management, noise pollution.' },
          { id: 'ce-transportation', number: 5, name: 'Transportation Engineering', description: 'Geometric design of highways, traffic engineering, highway pavements design, railway track and airport runway design.' },
          { id: 'ce-geomatics', number: 6, name: 'Geomatics Engineering', description: 'Principles of surveying, errors and adjustments, leveling, triangulation, photogrammetry, remote sensing and GIS.' },
        ],
      },
    ],
  },

  // ── 8. Chemical Engineering (CH) ──────────────────────────────────────
  {
    code: 'CH',
    name: 'Chemical Engineering',
    category: 'engineering',
    description: 'Process Calculations, Thermodynamics, Fluid & Particle Mechanics, Heat & Mass Transfer and Kinetics.',
    hasEnggMath: true,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      STANDARD_ENGG_MATH_SECTION,
      {
        id: 'ch-core',
        code: 'CH-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '72 Marks',
        chapters: [
          { id: 'ch-process-calc', number: 1, name: 'Process Calculations and Thermodynamics', description: 'Laws of conservation of mass and energy, recycle/bypass, PVT behavior, phase equilibria, chemical reaction equilibria.' },
          { id: 'ch-fluid-mechanics', number: 2, name: 'Fluid Mechanics and Mechanical Operations', description: 'Fluid statics, Newtonian and non-Newtonian fluids, Bernoulli equation, particle size reduction, filtration, fluidization.' },
          { id: 'ch-heat-transfer', number: 3, name: 'Heat Transfer', description: 'Conduction, convection and radiation, heat exchangers design, boiling and condensation, evaporators.' },
          { id: 'ch-mass-transfer', number: 4, name: 'Mass Transfer', description: 'Fick law, molecular diffusion, mass transfer coefficients, distillation, absorption, extraction, drying, membrane separations.' },
          { id: 'ch-reaction-engg', number: 5, name: 'Chemical Reaction Engineering', description: 'Theories of reaction rates, ideal reactors (batch, CSTR, PFR), residence time distribution, catalysis.' },
          { id: 'ch-control-design', number: 6, name: 'Instrumentation, Control and Plant Design', description: 'Process control dynamics, feedback controllers, stability analysis, process economics and plant design.' },
        ],
      },
    ],
  },

  // ── 9. Electronics and Communication Engineering (EC) ─────────────────
  {
    code: 'EC',
    name: 'Electronics and Communication Engineering',
    category: 'engineering',
    description: 'Signals & Systems, Electronic Devices, Analog & Digital Circuits, Control Systems, Communications and Electromagnetics.',
    hasEnggMath: true,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      STANDARD_ENGG_MATH_SECTION,
      {
        id: 'ec-core',
        code: 'EC-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '72 Marks',
        chapters: [
          { id: 'ec-networks', number: 1, name: 'Networks, Signals and Systems', description: 'Network solution methods, continuous and discrete-time signals, Fourier transform, Laplace, Z-transform, sampling theorem.' },
          { id: 'ec-devices', number: 2, name: 'Electronic Devices', description: 'Energy bands, carrier transport, p-n junction, Zener diode, BJT, MOS capacitor, MOSFET, optoelectronic devices.' },
          { id: 'ec-analog', number: 3, name: 'Analog Circuits', description: 'Small signal equivalent circuits of diodes, BJTs and MOSFETs, feedback amplifiers, op-amp circuits, active filters, oscillators.' },
          { id: 'ec-digital', number: 4, name: 'Digital Circuits', description: 'Combinational circuits, arithmetic circuits, code converters, sequential circuits, microprocessors and memories.' },
          { id: 'ec-control', number: 5, name: 'Control Systems', description: 'Transfer function, transient and steady-state analysis, Routh-Hurwitz, Nyquist criteria, Bode plots, state-space models.' },
          { id: 'ec-comm', number: 6, name: 'Communications', description: 'Random processes, analog communications (AM, FM), digital communications (PCM, PSK, QAM), information theory, error-correcting codes.' },
          { id: 'ec-emft', number: 7, name: 'Electromagnetics', description: 'Maxwell equations, wave propagation, transmission lines, Smith chart, waveguides, antenna radiation patterns.' },
        ],
      },
    ],
  },

  // ── 10. Electrical Engineering (EE) ───────────────────────────────────
  {
    code: 'EE',
    name: 'Electrical Engineering',
    category: 'engineering',
    description: 'Electric Circuits, Electromagnetic Fields, Signals, Electrical Machines, Power Systems, Control and Power Electronics.',
    hasEnggMath: true,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      STANDARD_ENGG_MATH_SECTION,
      {
        id: 'ee-core',
        code: 'EE-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '72 Marks',
        chapters: [
          { id: 'ee-circuits', number: 1, name: 'Electric Circuits', description: 'Network graph, KCL, KVL, node and mesh analysis, network theorems, transient response of DC and AC networks, resonance.' },
          { id: 'ee-fields', number: 2, name: 'Electromagnetic Fields', description: 'Coulomb law, Gauss law, Biot-Savart law, Ampere law, Faraday law, Maxwell equations, inductance, capacitance.' },
          { id: 'ee-signals', number: 3, name: 'Signals and Systems', description: 'Representation of continuous and discrete-time signals, LTI systems, Fourier series and transforms, Laplace and Z-transforms.' },
          { id: 'ee-machines', number: 4, name: 'Electrical Machines', description: 'Single and three-phase transformers, DC machines, induction motors, synchronous machines, fractional horsepower motors.' },
          { id: 'ee-power-systems', number: 5, name: 'Power Systems', description: 'Power generation concepts, transmission line models, power flow analysis, symmetrical and unsymmetrical fault analysis, protection, stability.' },
          { id: 'ee-control', number: 6, name: 'Control Systems', description: 'Principles of feedback, root loci, frequency response, state variable representation, lead-lag compensators.' },
          { id: 'ee-measurements', number: 7, name: 'Electrical Measurements', description: 'Bridges and potentiometers, measurement of voltage, current, power, energy, digital voltmeters and multimeters.' },
          { id: 'ee-power-elec', number: 8, name: 'Power Electronics', description: 'Characteristics of semiconductor devices (SCR, MOSFET, IGBT), DC-DC converters, AC-DC rectifiers, inverters.' },
        ],
      },
    ],
  },

  // ── 11. Environmental Science and Engineering (ES) ────────────────────
  {
    code: 'ES',
    name: 'Environmental Science and Engineering',
    category: 'engineering',
    description: 'Environmental Chemistry, Microbiology, Water Resources, Waste Management and Environmental Impact.',
    hasEnggMath: true,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      STANDARD_ENGG_MATH_SECTION,
      {
        id: 'es-core',
        code: 'ES-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '72 Marks',
        chapters: [
          { id: 'es-chemistry-micro', number: 1, name: 'Environmental Chemistry and Microbiology', description: 'Fundamentals of chemistry, organic and inorganic pollutants, microbial ecology, pathogenic organisms in water and air.' },
          { id: 'es-water-hydraulics', number: 2, name: 'Water Resources and Environmental Hydraulics', description: 'Surface water hydrology, groundwater flow, Darcy law, flow in pipes and open channels, hydraulic structures.' },
          { id: 'es-water-treatment', number: 3, name: 'Water and Wastewater Treatment', description: 'Water quality parameters, physical and chemical treatment, biological wastewater processes, advanced oxidation processes.' },
          { id: 'es-air-noise', number: 4, name: 'Air and Noise Pollution', description: 'Criteria air pollutants, plume dispersion models, air pollution control devices, sound measurement and noise mitigation.' },
          { id: 'es-solid-waste', number: 5, name: 'Solid and Hazardous Waste Management', description: 'Municipal solid waste generation, composting, incineration, sanitary landfill design, hazardous waste remediation.' },
          { id: 'es-eia', number: 6, name: 'Global Environmental Issues and EIA', description: 'Climate change, greenhouse effect, ozone layer depletion, Environmental Impact Assessment methodologies, green regulations.' },
        ],
      },
    ],
  },

  // ── 12. Instrumentation Engineering (IN) ──────────────────────────────
  {
    code: 'IN',
    name: 'Instrumentation Engineering',
    category: 'engineering',
    description: 'Transducers, Industrial Instrumentation, Control Systems, Signals & Systems and Optical Sensors.',
    hasEnggMath: true,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      STANDARD_ENGG_MATH_SECTION,
      {
        id: 'in-core',
        code: 'IN-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '72 Marks',
        chapters: [
          { id: 'in-circuits-signals', number: 1, name: 'Electricity and Circuits', description: 'Kirchhoff laws, network theorems, AC circuits, mutual inductance, resonance, continuous and discrete signals and systems.' },
          { id: 'in-control', number: 2, name: 'Control Systems', description: 'Feedback principles, Routh-Hurwitz, root locus, Nyquist criterion, Bode plots, state space analysis, PID controllers.' },
          { id: 'in-analog-digital', number: 3, name: 'Analog and Digital Electronics', description: 'Operational amplifiers, signal conditioning circuits, DACs, ADCs, logic gates, microprocessors and microcontrollers.' },
          { id: 'in-sensors', number: 4, name: 'Sensors and Industrial Instrumentation', description: 'Resistive, capacitive, inductive, piezoelectric and optical sensors; measurement of temperature, pressure, flow and level.' },
          { id: 'in-optics', number: 5, name: 'Communication and Optical Instrumentation', description: 'Telemetry systems, optical sources, detectors, fiber optic sensors, laser instrumentation, smart transmitters.' },
        ],
      },
    ],
  },

  // ── 13. Mechanical Engineering (ME) ───────────────────────────────────
  {
    code: 'ME',
    name: 'Mechanical Engineering',
    category: 'engineering',
    description: 'Applied Mechanics, Fluid Mechanics, Thermal Sciences, Manufacturing and Industrial Engineering.',
    hasEnggMath: true,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      STANDARD_ENGG_MATH_SECTION,
      {
        id: 'me-core',
        code: 'ME-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '72 Marks',
        chapters: [
          { id: 'me-mechanics-materials', number: 1, name: 'Engineering Mechanics and SOM', description: 'Free-body diagrams, trusses, friction, stress and strain, Mohr circle, bending and shear stress, deflection of beams, columns.' },
          { id: 'me-tom-design', number: 2, name: 'Theory of Machines and Vibrations', description: 'Displacement, velocity and acceleration analysis, cams, gears, flywheels, governors, free and forced single-degree vibrations.' },
          { id: 'me-machine-design', number: 3, name: 'Machine Design', description: 'Design for static and fatigue strength, failure theories, design of bolted, riveted and welded joints, shafts, gears, bearings.' },
          { id: 'me-fluid-mechanics', number: 4, name: 'Fluid Mechanics and Turbo-machinery', description: 'Fluid properties, manometry, Bernoulli equation, pipe flow, boundary layer, impulse and reaction turbines, pumps.' },
          { id: 'me-thermodynamics', number: 5, name: 'Thermal Sciences & Heat Transfer', description: 'Thermodynamic laws, power and refrigeration cycles, psychrometry, conduction, convection and radiation, heat exchangers.' },
          { id: 'me-manufacturing', number: 6, name: 'Materials and Manufacturing Processes', description: 'Engineering materials, phase diagrams, casting, forming, joining, machining, CNC, metrology, inspection.' },
          { id: 'me-industrial-or', number: 7, name: 'Industrial Engineering and Operations Research', description: 'Production planning, forecasting, inventory models, linear programming, network models (PERT/CPM), queuing models.' },
        ],
      },
    ],
  },

  // ── 14. Mining Engineering (MN) ───────────────────────────────────────
  {
    code: 'MN',
    name: 'Mining Engineering',
    category: 'engineering',
    description: 'Geomechanics, Surface and Underground Mining Methods, Ventilation, Mine Surveying and Economics.',
    hasEnggMath: true,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      STANDARD_ENGG_MATH_SECTION,
      {
        id: 'mn-core',
        code: 'MN-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '72 Marks',
        chapters: [
          { id: 'mn-geomechanics', number: 1, name: 'Geomechanics and Ground Control', description: 'Rock properties, stress and strain analysis, rock mass classification, slope stability, underground opening supports, rockburst.' },
          { id: 'mn-methods-machinery', number: 2, name: 'Mining Methods and Machinery', description: 'Surface mining equipment, opencast blasting, underground coal and metal mining methods, continuous mining technology.' },
          { id: 'mn-ventilation', number: 3, name: 'Mine Ventilation and Environment', description: 'Mine gases, ventilation networks, fan laws, natural ventilation, heat and humidity, mine fires and explosions.' },
          { id: 'mn-survey-economics', number: 4, name: 'Mine Surveying and Economics', description: 'Triangulation, leveling, correlation of surface and underground surveys, GIS, mineral resource estimation, mine economics.' },
        ],
      },
    ],
  },

  // ── 15. Metallurgical Engineering (MT) ────────────────────────────────
  {
    code: 'MT',
    name: 'Metallurgical Engineering',
    category: 'engineering',
    description: 'Thermodynamics of Materials, Extractive, Physical and Mechanical Metallurgy and Manufacturing.',
    hasEnggMath: true,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      STANDARD_ENGG_MATH_SECTION,
      {
        id: 'mt-core',
        code: 'MT-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '72 Marks',
        chapters: [
          { id: 'mt-thermodynamics', number: 1, name: 'Thermodynamics and Rate Processes', description: 'First, second, third laws of thermodynamics, Ellingham diagrams, phase equilibria, heat and mass transfer kinetics.' },
          { id: 'mt-extractive', number: 2, name: 'Extractive Metallurgy', description: 'Mineral dressing, iron and steel making, extraction of non-ferrous metals (Al, Cu, Zn), hydrometallurgy, electrometallurgy.' },
          { id: 'mt-physical', number: 3, name: 'Physical Metallurgy', description: 'Crystal structure, X-ray diffraction, point defects, dislocations, phase transformations, TTT and CCT diagrams, heat treatment.' },
          { id: 'mt-mechanical', number: 4, name: 'Mechanical Metallurgy and Manufacturing', description: 'Elasticity, plasticity, fracture, fatigue, creep, tensile testing, metal working processes, welding and casting technology.' },
        ],
      },
    ],
  },

  // ── 16. Naval Architecture and Marine Engineering (NM) ────────────────
  {
    code: 'NM',
    name: 'Naval Architecture and Marine Engineering',
    category: 'engineering',
    description: 'Ship Hydrodynamics, Marine Propulsion, Ship Structures, Resistance and Marine Machinery.',
    hasEnggMath: true,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      STANDARD_ENGG_MATH_SECTION,
      {
        id: 'nm-core',
        code: 'NM-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '72 Marks',
        chapters: [
          { id: 'nm-hydrodynamics', number: 1, name: 'Marine Hydrodynamics', description: 'Fluid mechanics, ocean waves, wave-body interaction, boundary layers, ship resistance components, model testing.' },
          { id: 'nm-naval-arch', number: 2, name: 'Naval Architecture', description: 'Ship geometry, hydrostatics, intact and damage stability, launch calculations, cargo handling, tonnage and regulations.' },
          { id: 'nm-structures', number: 3, name: 'Ship Structures', description: 'Longitudinal strength of ships, plating, stiffened panels, grillage analysis, fatigue and fracture of marine structures.' },
          { id: 'nm-propulsion', number: 4, name: 'Ship Propulsion and Marine Systems', description: 'Propeller geometry, cavitation, propeller-engine interaction, marine diesel engines, steam and gas turbines, auxiliary systems.' },
        ],
      },
    ],
  },

  // ── 17. Petroleum Engineering (PE) ────────────────────────────────────
  {
    code: 'PE',
    name: 'Petroleum Engineering',
    category: 'engineering',
    description: 'Drilling Technology, Reservoir Engineering, Petroleum Production Operations and Formation Evaluation.',
    hasEnggMath: true,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      STANDARD_ENGG_MATH_SECTION,
      {
        id: 'pe-core',
        code: 'PE-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '72 Marks',
        chapters: [
          { id: 'pe-geology-exploration', number: 1, name: 'Petroleum Exploration and Drilling', description: 'Origin and migration of hydrocarbons, trap mechanisms, drilling fluids, casing and cementing, directional drilling.' },
          { id: 'pe-reservoir', number: 2, name: 'Reservoir Engineering', description: 'Petrophysical properties, fluid PVT behavior, drive mechanisms, material balance equation, Darcy law, well testing.' },
          { id: 'pe-production', number: 3, name: 'Petroleum Production Operations', description: 'Well completion, nodal analysis, artificial lift methods (gas lift, ESP, sucker rod), surface separation facilities.' },
          { id: 'pe-eor-offshore', number: 4, name: 'Enhanced Oil Recovery and Offshore Operations', description: 'Secondary and tertiary recovery methods (water flooding, chemical flooding, thermal EOR), offshore platforms and subsea systems.' },
        ],
      },
    ],
  },

  // ── 18. Production and Industrial Engineering (PI) ────────────────────
  {
    code: 'PI',
    name: 'Production and Industrial Engineering',
    category: 'engineering',
    description: 'Manufacturing Technology, Metrology, Operations Research, Quality Engineering and Supply Chain.',
    hasEnggMath: true,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      STANDARD_ENGG_MATH_SECTION,
      {
        id: 'pi-core',
        code: 'PI-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '72 Marks',
        chapters: [
          { id: 'pi-general-engg', number: 1, name: 'General Engineering', description: 'Engineering materials, mechanics of solids, fluid mechanics, thermal and electrical engineering fundamentals.' },
          { id: 'pi-manufacturing', number: 2, name: 'Manufacturing Processes', description: 'Casting, metal forming, joining processes, conventional and advanced machining processes, computer-integrated manufacturing.' },
          { id: 'pi-quality', number: 3, name: 'Quality and Reliability', description: 'Statistical quality control, control charts, process capability, reliability analysis, Six Sigma methodologies.' },
          { id: 'pi-industrial', number: 4, name: 'Industrial Engineering and Operations Management', description: 'Work design, facility layout, demand forecasting, aggregate planning, inventory management, supply chain networks.' },
          { id: 'pi-or', number: 5, name: 'Operations Research', description: 'Linear programming, simplex method, duality, transportation and assignment models, dynamic programming, queuing theory.' },
        ],
      },
    ],
  },

  // ── 19. Textile Engineering and Fibre Science (TF) ────────────────────
  {
    code: 'TF',
    name: 'Textile Engineering and Fibre Science',
    category: 'engineering',
    description: 'Textile Fibres, Yarn & Fabric Manufacture, Textile Testing and Chemical Processing.',
    hasEnggMath: true,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      STANDARD_ENGG_MATH_SECTION,
      {
        id: 'tf-core',
        code: 'TF-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '72 Marks',
        chapters: [
          { id: 'tf-fibres', number: 1, name: 'Textile Fibres', description: 'Natural and synthetic fibres, polymerization, melt/wet/dry spinning, fibre structure, morphology and characterization.' },
          { id: 'tf-yarn', number: 2, name: 'Yarn Manufacture and Texturing', description: 'Carding, drawing, combing, roving, ring spinning, rotor spinning, friction spinning, false-twist texturing.' },
          { id: 'tf-fabric', number: 3, name: 'Fabric Manufacture', description: 'Winding, warping, sizing, weaving mechanisms, shuttle-less looms, knitting technology, nonwoven fabric production.' },
          { id: 'tf-testing-processing', number: 4, name: 'Textile Testing and Chemical Processing', description: 'Physical testing of fibres, yarns and fabrics; scouring, bleaching, dyeing, printing, finishing and effluent treatment.' },
        ],
      },
    ],
  },

  // ── 20. Chemistry (CY) ────────────────────────────────────────────────
  {
    code: 'CY',
    name: 'Chemistry',
    category: 'science',
    description: 'Physical Chemistry, Inorganic Chemistry and Organic Chemistry.',
    hasEnggMath: false,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      {
        id: 'cy-core',
        code: 'CY-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '85 Marks',
        chapters: [
          { id: 'cy-physical', number: 1, name: 'Physical Chemistry', description: 'Quantum mechanics, atomic structure, spectroscopy, chemical thermodynamics, statistical thermodynamics, electrochemistry, kinetics.' },
          { id: 'cy-inorganic', number: 2, name: 'Inorganic Chemistry', description: 'Periodic properties, main group chemistry, transition elements, coordination chemistry, organometallics, bioinorganic chemistry.' },
          { id: 'cy-organic', number: 3, name: 'Organic Chemistry', description: 'Stereochemistry, reaction mechanisms, reactive intermediates, pericyclic reactions, synthesis, natural products, spectroscopy (NMR, IR, UV, MS).' },
        ],
      },
    ],
  },

  // ── 21. Physics (PH) ──────────────────────────────────────────────────
  {
    code: 'PH',
    name: 'Physics',
    category: 'science',
    description: 'Classical Mechanics, Quantum Mechanics, EM Theory, Thermodynamics, Condensed Matter and Nuclear Physics.',
    hasEnggMath: false,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      {
        id: 'ph-core',
        code: 'PH-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '85 Marks',
        chapters: [
          { id: 'ph-math-phys', number: 1, name: 'Mathematical Physics', description: 'Vector calculus, linear differential equations, complex variables, Fourier and Laplace transforms, tensors.' },
          { id: 'ph-classical', number: 2, name: 'Classical Mechanics', description: 'Lagrangian and Hamiltonian formulations, central force motion, rigid body dynamics, small oscillations, special relativity.' },
          { id: 'ph-emft', number: 3, name: 'Electromagnetic Theory', description: 'Electrostatics, magnetostatics, Maxwell equations, electromagnetic waves in media, radiation from moving charges.' },
          { id: 'ph-quantum', number: 4, name: 'Quantum Mechanics', description: 'Schrodinger equation, harmonic oscillator, hydrogen atom, angular momentum, perturbation theory, scattering theory.' },
          { id: 'ph-thermo-stat', number: 5, name: 'Thermodynamics and Statistical Physics', description: 'Laws of thermodynamics, thermodynamic potentials, ensembles, Maxwell-Boltzmann, Bose-Einstein, Fermi-Dirac statistics.' },
          { id: 'ph-atomic-molecular', number: 6, name: 'Atomic and Molecular Physics', description: 'Spectra of one- and many-electron atoms, LS and jj coupling, Zeeman and Stark effects, rotational and vibrational spectra, lasers.' },
          { id: 'ph-condensed-matter', number: 7, name: 'Solid State Physics', description: 'Crystal structure, reciprocal lattice, phonons, electron theory of metals, band theory, semiconductors, superconductivity.' },
          { id: 'ph-nuclear-particle', number: 8, name: 'Nuclear and Particle Physics', description: 'Nuclear properties, nuclear models, radioactive decay, nuclear reactions, elementary particles and standard model.' },
        ],
      },
    ],
  },

  // ── 22. Mathematics (MA) ──────────────────────────────────────────────
  {
    code: 'MA',
    name: 'Mathematics',
    category: 'science',
    description: 'Calculus, Linear Algebra, Real & Complex Analysis, ODE, PDE, Algebra, Topology and Functional Analysis.',
    hasEnggMath: false,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      {
        id: 'ma-core',
        code: 'MA-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '85 Marks',
        chapters: [
          { id: 'ma-linear-algebra', number: 1, name: 'Linear Algebra', description: 'Vector spaces, linear transformations, matrices, Jordan canonical form, inner product spaces, spectral theorem.' },
          { id: 'ma-real-analysis', number: 2, name: 'Real Analysis', description: 'Metric spaces, sequences and series, Riemann-Stieltjes integral, Lebesgue measure and integration, multivariable calculus.' },
          { id: 'ma-complex-analysis', number: 3, name: 'Complex Analysis', description: 'Analytic functions, conformal mappings, Cauchy integral formula, singularities, residue calculus, maximum modulus principle.' },
          { id: 'ma-ode-pde', number: 4, name: 'Ordinary and Partial Differential Equations', description: 'Initial value problems, Sturm-Liouville problems, classification of second order PDEs, Laplace, heat and wave equations.' },
          { id: 'ma-algebra', number: 5, name: 'Algebra and Topology', description: 'Groups, rings, fields, Galois theory, topological spaces, connectedness, compactness, separation axioms.' },
          { id: 'ma-functional-num', number: 6, name: 'Functional Analysis and Numerical Methods', description: 'Banach spaces, Hilbert spaces, Hahn-Banach theorem, numerical solutions of ODEs, linear programming.' },
        ],
      },
    ],
  },

  // ── 23. Statistics (ST) ───────────────────────────────────────────────
  {
    code: 'ST',
    name: 'Statistics',
    category: 'science',
    description: 'Probability Theory, Stochastic Processes, Inference, Multivariate Analysis and Regression.',
    hasEnggMath: false,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      {
        id: 'st-core',
        code: 'ST-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '85 Marks',
        chapters: [
          { id: 'st-calc-linear', number: 1, name: 'Calculus and Matrix Theory', description: 'Differential calculus, multiple integrals, matrices, quadratic forms, eigenvalues and generalized inverses.' },
          { id: 'st-probability', number: 2, name: 'Probability and Stochastic Processes', description: 'Axiomatic probability, random vectors, limit theorems, Markov chains, Poisson processes, renewal theory.' },
          { id: 'st-inference', number: 3, name: 'Statistical Inference', description: 'Sufficient statistics, UMVUE, maximum likelihood, Neyman-Pearson lemma, likelihood ratio tests, Bayesian inference.' },
          { id: 'st-multivariate-reg', number: 4, name: 'Multivariate Analysis and Regression', description: 'Multivariate normal distribution, Wishart distribution, linear regression models, ANOVA, principal component analysis.' },
        ],
      },
    ],
  },

  // ── 24. Geology and Geophysics (GG) ───────────────────────────────────
  {
    code: 'GG',
    name: 'Geology and Geophysics',
    category: 'science',
    description: 'Earth Sciences, Mineralogy, Geodynamics, Seismology and Geophysical Exploration.',
    hasEnggMath: false,
    historicalSessions: ['GATE-GG-1', 'GATE-GG-2'],
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      {
        id: 'gg-part-a',
        code: 'PART-A',
        name: 'Common Section',
        isCompulsory: true,
        type: 'compulsory',
        marksAllocation: '25 Marks',
        description: 'Compulsory Common Section: Earth and planetary system, geodynamics, structural geology and mineralogy.',
        chapters: [
          { id: 'gg-earth-system', number: 1, name: 'Earth and Planetary System', description: 'Solar system, origin of earth, radioactivity and age of earth, gravity and magnetic fields, paleomagnetism.' },
          { id: 'gg-geodynamics', number: 2, name: 'Geodynamics and Structural Geology', description: 'Plate tectonics, continental drift, seafloor spreading, seismic zones, folds, faults, joints and unconformities.' },
        ],
      },
      {
        id: 'gg-geology',
        code: 'PART-B-GEO',
        name: 'Geology (Part B1)',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '60 Marks',
        description: 'Optional Section: Geomorphology, mineralogy, petrology, stratigraphy, economic geology.',
        chapters: [
          { id: 'gg-mineralogy-petro', number: 1, name: 'Mineralogy and Petrology', description: 'Crystal chemistry, optical mineralogy, igneous, sedimentary and metamorphic petrology, phase diagrams.' },
          { id: 'gg-strat-paleo', number: 2, name: 'Stratigraphy and Paleontology', description: 'Stratigraphic principles, Indian stratigraphy, invertebrate and vertebrate paleontology, micropaleontology.' },
          { id: 'gg-econ-geology', number: 3, name: 'Economic and Applied Geology', description: 'Ore genesis, mineral deposits of India, petroleum geology, hydrogeology, remote sensing in exploration.' },
        ],
      },
      {
        id: 'gg-geophysics',
        code: 'PART-B-GP',
        name: 'Geophysics (Part B2)',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '60 Marks',
        description: 'Optional Section: Seismology, gravity and magnetic methods, electrical and electromagnetic methods.',
        chapters: [
          { id: 'gg-solid-earth', number: 1, name: 'Solid Earth Geophysics and Seismology', description: 'Elastic wave propagation, earthquake mechanisms, seismic waves, internal structure of the earth.' },
          { id: 'gg-potential-fields', number: 2, name: 'Gravity, Magnetic and Electrical Methods', description: 'Instruments, data acquisition, anomaly interpretation, DC resistivity, IP, magnetotelluric and GPR methods.' },
          { id: 'gg-seismic-exploration', number: 3, name: 'Seismic and Well Logging Methods', description: 'Seismic reflection and refraction, synthetic seismograms, well logging methods, borehole geophysics.' },
        ],
      },
    ],
  },

  // ── 25. Ecology and Evolution (EY) ────────────────────────────────────
  {
    code: 'EY',
    name: 'Ecology and Evolution',
    category: 'science',
    description: 'Population Ecology, Evolutionary Genetics, Behavioural Ecology and Conservation Biology.',
    hasEnggMath: false,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      {
        id: 'ey-core',
        code: 'EY-CORE',
        name: 'Core Subject',
        isCompulsory: true,
        type: 'core',
        marksAllocation: '85 Marks',
        chapters: [
          { id: 'ey-ecology', number: 1, name: 'Ecology', description: 'Abiotic environment, physiological ecology, population dynamics, community structure, ecosystem processes.' },
          { id: 'ey-evolution', number: 2, name: 'Evolution', description: 'Origin of life, natural selection, adaptation, speciation, molecular phylogenetics, evolutionary developmental biology.' },
          { id: 'ey-behaviour', number: 3, name: 'Behavioural Ecology', description: 'Foraging strategies, mating systems, sexual selection, social behaviour, parental care, kin selection.' },
          { id: 'ey-applied', number: 4, name: 'Applied Ecology and Quantitative Methods', description: 'Conservation biology, biodiversity threats, climate change impacts, ecological modelling, statistics in ecology.' },
        ],
      },
    ],
  },

  // ── 26. Engineering Sciences (XE) ─────────────────────────────────────
  {
    code: 'XE',
    name: 'Engineering Sciences',
    category: 'interdisciplinary',
    description: 'Interdisciplinary Engineering: Compulsory Mathematics + Fluid Mechanics, Materials, Thermodynamics and Mechanics.',
    hasEnggMath: true,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      {
        id: 'xe-sec-a',
        code: 'SEC-A',
        name: 'Section A — Engineering Mathematics',
        isCompulsory: true,
        type: 'compulsory',
        marksAllocation: '15 Marks',
        description: 'Compulsory Section A: Linear Algebra, Calculus, Differential Equations, Complex Variables and Numerical Methods.',
        chapters: STANDARD_ENGG_MATH_CHAPTERS,
      },
      {
        id: 'xe-sec-b',
        code: 'SEC-B',
        name: 'Section B — Fluid Mechanics',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '35 Marks',
        description: 'Optional Section: Fluid statics, kinematics, dynamics, viscous flow, potential flow, boundary layer, compressible flow.',
        chapters: [
          { id: 'xe-b-statics-kinematics', number: 1, name: 'Fluid Statics and Kinematics', description: 'Hydrostatic forces on surfaces, buoyancy, velocity field, stream function, vorticity and circulation.' },
          { id: 'xe-b-dynamics', number: 2, name: 'Fluid Dynamics and Viscous Flows', description: 'Navier-Stokes equations, exact solutions, flow through pipes, laminar and turbulent flows, boundary layers.' },
        ],
      },
      {
        id: 'xe-sec-c',
        code: 'SEC-C',
        name: 'Section C — Materials Science',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '35 Marks',
        description: 'Optional Section: Structure and defects, phase diagrams, mechanical properties, electrical and magnetic properties.',
        chapters: [
          { id: 'xe-c-structures', number: 1, name: 'Structure and Properties of Materials', description: 'Crystal structures, point defects, dislocations, solid solutions, phase rule and binary phase diagrams.' },
          { id: 'xe-c-mechanical', number: 2, name: 'Mechanical Behavior and Degradation', description: 'Elastic, plastic behavior, creep, fatigue, fracture, corrosion mechanisms and prevention.' },
        ],
      },
      {
        id: 'xe-sec-d',
        code: 'SEC-D',
        name: 'Section D — Solid Mechanics',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '35 Marks',
        description: 'Optional Section: Mechanics of rigid and deformable bodies, stress, strain, bending, torsion and structural stability.',
        chapters: [
          { id: 'xe-d-stress-strain', number: 1, name: 'Stress, Strain and Equilibrium', description: 'State of stress and strain, generalized Hooke law, equilibrium equations, plane stress and plane strain.' },
          { id: 'xe-d-beams-torsion', number: 2, name: 'Beams, Torsion and Stability', description: 'Bending of beams, shear stresses, deflection, torsion of circular shafts, buckling of columns, energy methods.' },
        ],
      },
      {
        id: 'xe-sec-e',
        code: 'SEC-E',
        name: 'Section E — Thermodynamics',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '35 Marks',
        description: 'Optional Section: First and second laws, properties of pure substances, thermodynamic relations and power cycles.',
        chapters: [
          { id: 'xe-e-laws', number: 1, name: 'Thermodynamic Laws and Relations', description: 'Closed and open systems, first and second laws, entropy, exergy, Maxwell relations, real gas behaviour.' },
          { id: 'xe-e-cycles', number: 2, name: 'Cycles and Reactive Systems', description: 'Vapor power, gas power and refrigeration cycles, combustion thermodynamics and chemical equilibrium.' },
        ],
      },
      {
        id: 'xe-sec-f',
        code: 'SEC-F',
        name: 'Section F — Polymer Science and Engineering',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '35 Marks',
        description: 'Optional Section: Chemistry of polymers, polymer physics, processing and characterization.',
        chapters: [
          { id: 'xe-f-synthesis', number: 1, name: 'Polymer Synthesis and Characterization', description: 'Step-growth, chain-growth, molecular weight determination, glass transition and thermal analysis.' },
          { id: 'xe-f-processing', number: 2, name: 'Polymer Rheology and Processing', description: 'Viscoelasticity, extrusion, injection moulding, blow moulding, fiber spinning and composite materials.' },
        ],
      },
      {
        id: 'xe-sec-g',
        code: 'SEC-G',
        name: 'Section G — Food Technology',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '35 Marks',
        description: 'Optional Section: Food chemistry, microbiology, food engineering operations and preservation.',
        chapters: [
          { id: 'xe-g-chemistry-micro', number: 1, name: 'Food Chemistry and Microbiology', description: 'Water activity, proteins, carbohydrates, lipids, enzymes, food-borne pathogens, fermentations.' },
          { id: 'xe-g-operations', number: 2, name: 'Food Process Engineering', description: 'Thermal processing, freezing, drying, dehydration, membrane filtration, packaging technology.' },
        ],
      },
      {
        id: 'xe-sec-h',
        code: 'SEC-H',
        name: 'Section H — Atmospheric and Oceanic Sciences',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '35 Marks',
        description: 'Optional Section: Meteorology, atmospheric thermodynamics, physical oceanography and climate dynamics.',
        chapters: [
          { id: 'xe-h-atmosphere', number: 1, name: 'Atmospheric Physics and Dynamics', description: 'Structure of atmosphere, radiation budget, Coriolis effect, planetary boundary layer, monsoons, cyclones.' },
          { id: 'xe-h-ocean', number: 2, name: 'Ocean Dynamics and Climate', description: 'Ocean circulation, thermohaline flow, El Niño, air-sea interaction, numerical weather prediction.' },
        ],
      },
      {
        id: 'xe-sec-i',
        code: 'SEC-I',
        name: 'Section I — Energy Science',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '35 Marks',
        description: 'Optional Section: Solar energy, wind, biomass, energy storage, fuel cells and energy economics.',
        chapters: [
          { id: 'xe-i-renewables', number: 1, name: 'Renewable Energy Technologies', description: 'Solar photovoltaics, solar thermal, wind turbine aerodynamics, biomass conversion, geothermal energy.' },
          { id: 'xe-i-storage-audit', number: 2, name: 'Energy Storage and Management', description: 'Battery technologies, fuel cells, supercapacitors, energy auditing, conservation and carbon footprint.' },
        ],
      },
    ],
  },

  // ── 27. Life Sciences (XL) ────────────────────────────────────────────
  {
    code: 'XL',
    name: 'Life Sciences',
    category: 'interdisciplinary',
    description: 'Compulsory Chemistry (Section P) + Biochemistry, Botany, Microbiology, Zoology and Food Tech.',
    hasEnggMath: false,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      {
        id: 'xl-sec-p',
        code: 'SEC-P',
        name: 'Section P — Chemistry',
        isCompulsory: true,
        type: 'compulsory',
        marksAllocation: '25 Marks',
        description: 'Compulsory Section P: Atomic structure, chemical bonding, s/p/d block elements, thermodynamics and reaction mechanisms.',
        chapters: [
          { id: 'xl-p-structure-bonding', number: 1, name: 'Atomic Structure and Chemical Bonding', description: 'Bohr theory, quantum numbers, hybridization, VSEPR, MO theory, coordination complexes.' },
          { id: 'xl-p-thermo-kinetics', number: 2, name: 'Thermodynamics, Kinetics and Organic Chemistry', description: 'Chemical equilibrium, electrochemistry, reaction mechanisms, biomolecules, stereochemistry.' },
        ],
      },
      {
        id: 'xl-sec-q',
        code: 'SEC-Q',
        name: 'Section Q — Biochemistry',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '30 Marks',
        description: 'Optional Section: Biomolecules, bioenergetics, enzyme kinetics, metabolism, membranes and cell signalling.',
        chapters: [
          { id: 'xl-q-biomolecules', number: 1, name: 'Biomolecules and Metabolism', description: 'Amino acids, proteins, lipids, carbohydrates, glycolysis, TCA cycle, oxidative phosphorylation, lipid metabolism.' },
          { id: 'xl-q-enzymes-signalling', number: 2, name: 'Enzyme Kinetics and Cell Signaling', description: 'Michaelis-Menten kinetics, inhibition, biological membranes, transport mechanisms, signal transduction pathways.' },
        ],
      },
      {
        id: 'xl-sec-r',
        code: 'SEC-R',
        name: 'Section R — Botany',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '30 Marks',
        description: 'Optional Section: Plant systematics, plant anatomy, physiology, genetics, breeding and biotechnology.',
        chapters: [
          { id: 'xl-r-anatomy-physiology', number: 1, name: 'Plant Anatomy and Physiology', description: 'Plant tissues, photosynthesis (C3, C4, CAM), respiration, nitrogen metabolism, plant hormones, stress physiology.' },
          { id: 'xl-r-systematics-biotech', number: 2, name: 'Systematics, Genetics and Plant Biotech', description: 'Angiosperm taxonomy, Mendelian genetics, plant tissue culture, transgenic plants, secondary metabolites.' },
        ],
      },
      {
        id: 'xl-sec-s',
        code: 'SEC-S',
        name: 'Section S — Microbiology',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '30 Marks',
        description: 'Optional Section: Microbial diversity, microbial growth, pathogenesis, immunology, microbial genetics.',
        chapters: [
          { id: 'xl-s-diversity-growth', number: 1, name: 'Microbial Diversity and Physiology', description: 'Bacteria, archaea, viruses, microbial nutrition, growth kinetics, antimicrobial agents, control of microorganisms.' },
          { id: 'xl-s-genetics-immunology', number: 2, name: 'Microbial Genetics and Immunology', description: 'Conjugation, transformation, transduction, innate and adaptive immunity, antibodies, antigen-antibody reactions.' },
        ],
      },
      {
        id: 'xl-sec-t',
        code: 'SEC-T',
        name: 'Section T — Zoology',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '30 Marks',
        description: 'Optional Section: Animal taxonomy, developmental biology, animal physiology, evolution, ecology.',
        chapters: [
          { id: 'xl-t-taxonomy-physiology', number: 1, name: 'Animal Diversity and Physiology', description: 'Invertebrates, vertebrates, organ systems physiology: nervous, endocrine, circulatory, respiratory, excretory.' },
          { id: 'xl-t-development-evolution', number: 2, name: 'Developmental Biology and Evolution', description: 'Gametogenesis, fertilization, cleavage, gastrulation, organogenesis, mechanisms of evolution, animal behaviour.' },
        ],
      },
      {
        id: 'xl-sec-u',
        code: 'SEC-U',
        name: 'Section U — Food Technology',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '30 Marks',
        description: 'Optional Section: Food processing, preservation, quality control, food biotechnology and safety regulations.',
        chapters: [
          { id: 'xl-u-composition-preservation', number: 1, name: 'Food Chemistry and Preservation', description: 'Macronutrients, micronutrients, food spoilage mechanisms, pasteurization, canning, refrigeration, dehydration.' },
          { id: 'xl-u-processing-quality', number: 2, name: 'Food Processing and Quality Standards', description: 'Cereal, dairy, meat and poultry processing, sensory evaluation, HACCP, FSSAI standards, food packaging.' },
        ],
      },
    ],
  },

  // ── 28. Geomatics Engineering (GE) ────────────────────────────────────
  {
    code: 'GE',
    name: 'Geomatics Engineering',
    category: 'interdisciplinary',
    description: 'Part A (Common Compulsory) + Part B1 (Surveying & Mapping) or Part B2 (Image Processing & GIS).',
    hasEnggMath: false,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      {
        id: 'ge-part-a',
        code: 'PART-A',
        name: 'Part A — Common Section',
        isCompulsory: true,
        type: 'compulsory',
        marksAllocation: '55 Marks',
        description: 'Compulsory Part A: Mathematics, remote sensing basics, GNSS and GIS fundamentals.',
        chapters: [
          { id: 'ge-math-survey', number: 1, name: 'Engineering Mathematics and Surveying', description: 'Linear algebra, calculus, probability, coordinate systems, map projections, horizontal and vertical controls.' },
          { id: 'ge-remote-sensing-gis', number: 2, name: 'Remote Sensing, GNSS and GIS', description: 'Electromagnetic spectrum, satellite sensors, GPS/GLONASS/Galileo/NavIC, raster and vector GIS data models.' },
        ],
      },
      {
        id: 'ge-part-b1',
        code: 'PART-B1',
        name: 'Part B1 — Surveying and Mapping',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '30 Marks',
        description: 'Optional Section B1: Geodesy, photogrammetry, hydrography, airborne LiDAR and cartography.',
        chapters: [
          { id: 'ge-geodesy-photogrammetry', number: 1, name: 'Geodesy, Photogrammetry and LiDAR', description: 'Geoid, ellipsoid, aerial photography, stereoscopy, orthorectification, LiDAR point cloud processing, UAV surveying.' },
        ],
      },
      {
        id: 'ge-part-b2',
        code: 'PART-B2',
        name: 'Part B2 — Image Processing and Analysis',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '30 Marks',
        description: 'Optional Section B2: Digital image processing, classification algorithms, spatial analysis and web GIS.',
        chapters: [
          { id: 'ge-dip-spatial', number: 1, name: 'Digital Image Processing and Spatial Analysis', description: 'Image enhancement, filtering, supervised and unsupervised classification, indices (NDVI), spatial interpolation, web GIS.' },
        ],
      },
    ],
  },

  // ── 29. Architecture and Planning (AR) ────────────────────────────────
  {
    code: 'AR',
    name: 'Architecture and Planning',
    category: 'humanities',
    description: 'Part A (Common Compulsory) + Part B1 (Architecture) or Part B2 (Planning).',
    hasEnggMath: false,
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      {
        id: 'ar-part-a',
        code: 'PART-A',
        name: 'Part A — Common Section',
        isCompulsory: true,
        type: 'compulsory',
        marksAllocation: '60 Marks',
        description: 'Compulsory Part A: Architecture history, building construction, sustainability, urban design and housing.',
        chapters: [
          { id: 'ar-history-design', number: 1, name: 'Architecture History, Theory and Design', description: 'Indian and Western architectural history, contemporary movements, principles of design, climate-responsive design.' },
          { id: 'ar-building-construction', number: 2, name: 'Building Construction and Structural Systems', description: 'Building materials, construction techniques, advanced structures (shells, domes, tensile), earthquake-resistant building.' },
          { id: 'ar-services-sustainability', number: 3, name: 'Building Services and Sustainability', description: 'Water supply, sanitation, HVAC, acoustics, illumination, fire safety, green buildings and sustainability rating.' },
          { id: 'ar-urban-housing', number: 4, name: 'Urban Design, Planning and Housing', description: 'Urban renewal, master planning, public spaces, housing typologies, real estate economics and building bylaws.' },
        ],
      },
      {
        id: 'ar-part-b1',
        code: 'PART-B1',
        name: 'Part B1 — Architecture',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '25 Marks',
        description: 'Optional Section B1: Architectural heritage conservation, landscape design, professional practice.',
        chapters: [
          { id: 'ar-heritage-landscape', number: 1, name: 'Heritage Conservation and Landscape Design', description: 'Historic conservation charters, structural restoration, landscape architecture, plants, site grading.' },
        ],
      },
      {
        id: 'ar-part-b2',
        code: 'PART-B2',
        name: 'Part B2 — Planning',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '25 Marks',
        description: 'Optional Section B2: Regional planning, transportation planning, infrastructure and governance.',
        chapters: [
          { id: 'ar-regional-transport', number: 1, name: 'Regional Planning and Transport', description: 'Regional development theories, urban transportation planning, travel demand modeling, environmental planning regulations.' },
        ],
      },
    ],
  },

  // ── 30. Humanities and Social Sciences (XH) ───────────────────────────
  {
    code: 'XH',
    name: 'Humanities and Social Sciences',
    category: 'humanities',
    description: 'Compulsory Section B1 (Reasoning & Comprehension) + Optional Economics, English, Linguistics, Philosophy, Psychology or Sociology.',
    hasEnggMath: false,
    historicalSessions: ['GATE-XH-C1', 'GATE-XH-C2', 'GATE-XH-C3', 'GATE-XH-C4', 'GATE-XH-C5', 'GATE-XH-C6'],
    sections: [
      COMMON_GENERAL_APTITUDE_SECTION,
      {
        id: 'xh-sec-b1',
        code: 'SEC-B1',
        name: 'Section B1 — Reasoning and Comprehension',
        isCompulsory: true,
        type: 'compulsory',
        marksAllocation: '25 Marks',
        description: 'Compulsory Section B1: Reading comprehension, critical reasoning, expression and analytical abilities.',
        chapters: [
          { id: 'xh-b1-comprehension', number: 1, name: 'Reading Comprehension', description: 'Understanding complex passages, structure, narrative sequence, identifying explicit and implied arguments.' },
          { id: 'xh-b1-critical', number: 2, name: 'Critical Reasoning and Analysis', description: 'Logical consistency, analyzing fallacies, evaluating premises and conclusions, deductive and inductive inferences.' },
        ],
      },
      {
        id: 'xh-sec-c1',
        code: 'SEC-C1',
        name: 'Section C1 — Economics',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '60 Marks',
        description: 'Optional Section C1: Microeconomics, macroeconomics, development economics, public economics and econometrics.',
        chapters: [
          { id: 'xh-c1-micro-macro', number: 1, name: 'Micro and Macro Economics', description: 'Consumer theory, production theory, market structures, national income, IS-LM model, inflation and monetary policy.' },
          { id: 'xh-c1-growth-econometrics', number: 2, name: 'Growth, Development and Econometrics', description: 'Growth models, international trade, balance of payments, classical regression model, hypothesis testing in econometrics.' },
        ],
      },
      {
        id: 'xh-sec-c2',
        code: 'SEC-C2',
        name: 'Section C2 — English',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '60 Marks',
        description: 'Optional Section C2: British, American and World literatures, literary theory, cultural studies and postcolonialism.',
        chapters: [
          { id: 'xh-c2-literature', number: 1, name: 'Literary History and Forms', description: 'Poetry, drama, fiction across British, American, Indian and World English literatures from Renaissance to Contemporary era.' },
          { id: 'xh-c2-theory-criticism', number: 2, name: 'Literary Theory and Cultural Studies', description: 'Formalism, structuralism, post-structuralism, psychoanalysis, Marxism, feminism, postcolonialism and ecocriticism.' },
        ],
      },
      {
        id: 'xh-sec-c3',
        code: 'SEC-C3',
        name: 'Section C3 — Linguistics',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '60 Marks',
        description: 'Optional Section C3: Phonetics, phonology, morphology, syntax, semantics and sociolinguistics.',
        chapters: [
          { id: 'xh-c3-phon-morph', number: 1, name: 'Phonetics, Phonology and Morphology', description: 'Acoustic and articulatory phonetics, phonemes, allophones, morphological processes, inflection and derivation.' },
          { id: 'xh-c3-syntax-semantics', number: 2, name: 'Syntax, Semantics and Sociolinguistics', description: 'X-bar theory, transformational grammar, lexical semantics, pragmatics, language contact and linguistic diversity in India.' },
        ],
      },
      {
        id: 'xh-sec-c4',
        code: 'SEC-C4',
        name: 'Section C4 — Philosophy',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '60 Marks',
        description: 'Optional Section C4: Classical Indian philosophy, Western philosophy, ethics and logic.',
        chapters: [
          { id: 'xh-c4-indian-western', number: 1, name: 'Classical Indian and Western Philosophy', description: 'Vedic, Buddhist, Jaina, Nyaya, Vaisesika, Samkhya, Yoga, Mimamsa, Vedanta; Greek, Modern rationalism and empiricism.' },
          { id: 'xh-c4-ethics-logic', number: 2, name: 'Ethics, Applied Philosophy and Logic', description: 'Deontology, utilitarianism, virtue ethics, symbolic logic, contemporary analytic and continental philosophy.' },
        ],
      },
      {
        id: 'xh-sec-c5',
        code: 'SEC-C5',
        name: 'Section C5 — Psychology',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '60 Marks',
        description: 'Optional Section C5: Cognitive processes, biological bases of behavior, developmental, social and clinical psychology.',
        chapters: [
          { id: 'xh-c5-cognitive-bio', number: 1, name: 'Cognitive and Biological Bases', description: 'Sensation, perception, attention, memory, learning theories, thinking, language, neurobiology of behavior.' },
          { id: 'xh-c5-social-clinical', number: 2, name: 'Personality, Social and Clinical Psychology', description: 'Theories of personality, psychological testing, psychopathology, psychotherapy, attitudes, group dynamics.' },
        ],
      },
      {
        id: 'xh-sec-c6',
        code: 'SEC-C6',
        name: 'Section C6 — Sociology',
        isCompulsory: false,
        type: 'optional',
        marksAllocation: '60 Marks',
        description: 'Optional Section C6: Sociological theories, research methodology, social stratification, change and Indian society.',
        chapters: [
          { id: 'xh-c6-theories-methods', number: 1, name: 'Sociological Theory and Methodology', description: 'Classical theorists (Marx, Weber, Durkheim), contemporary theories, quantitative and qualitative research methods.' },
          { id: 'xh-c6-indian-society', number: 2, name: 'Indian Society, Stratification and Change', description: 'Caste, class, tribe, kinship, agrarian relations, industrialization, urbanization, social movements and development.' },
        ],
      },
    ],
  },
];

// ── Query & Calculation Helpers ──────────────────────────────────────────

/** Returns all 30 official test papers */
export function getAllGatePapers(): GatePaper[] {
  return GATE_PAPERS_CONFIG;
}

/** Get paper by code (case-insensitive, supports "GATE-CS", "CS", "CS-1", etc.) */
export function getGatePaperByCode(rawCode: string | null | undefined): GatePaper | null {
  if (!rawCode) return null;
  const cleaned = rawCode.trim().toUpperCase().replace(/^GATE-?/, '');
  
  // Direct match on code
  const exact = GATE_PAPERS_CONFIG.find((p) => p.code === cleaned);
  if (exact) return exact;

  // Match by historical session (e.g. CS-1 -> CS, CE-2 -> CE, XH-C3 -> XH)
  const historical = GATE_PAPERS_CONFIG.find((p) => {
    if (p.historicalSessions?.some((s) => s.toUpperCase().includes(cleaned))) return true;
    if (cleaned.startsWith(p.code + '-') || cleaned.startsWith(p.code)) return true;
    return false;
  });
  if (historical) return historical;

  // Partial name match
  const byName = GATE_PAPERS_CONFIG.find((p) =>
    p.name.toUpperCase().includes(cleaned)
  );
  return byName || null;
}

/** Filter papers by category tab key */
export function getGatePapersByCategory(category: GateCategoryKey): GatePaper[] {
  if (category === 'all') return GATE_PAPERS_CONFIG;
  return GATE_PAPERS_CONFIG.filter((p) => p.category === category);
}

/**
 * Returns count and list of existing PYQs for a given GATE paper.
 * Queries actual questions loaded in `SAMPLE_QUESTIONS` from `src/lib/questions.ts`.
 */
export function getGatePYQStats(paperCode: string): {
  totalPYQs: number;
  hasQuestions: boolean;
  matchingExamCodes: string[];
} {
  const pCode = paperCode.toUpperCase().replace(/^GATE-?/, '');
  const prefix = `GATE-${pCode}`;

  // Find all questions in the bank matching this paper code or session
  const matched = SAMPLE_QUESTIONS.filter((q) => {
    const qCode = q.exam_code.toUpperCase();
    return (
      qCode === prefix ||
      qCode.startsWith(`${prefix}-`) ||
      qCode === paperCode.toUpperCase()
    );
  });

  const uniqueExamCodes = Array.from(new Set(matched.map((q) => q.exam_code)));

  return {
    totalPYQs: matched.length,
    hasQuestions: matched.length > 0,
    matchingExamCodes: uniqueExamCodes,
  };
}

/**
 * Retrieves the matching questions for this paper from the question bank.
 */
export function getGateQuestionsForPaper(paperCode: string): typeof SAMPLE_QUESTIONS {
  const pCode = paperCode.toUpperCase().replace(/^GATE-?/, '');
  const prefix = `GATE-${pCode}`;

  return SAMPLE_QUESTIONS.filter((q) => {
    const qCode = q.exam_code.toUpperCase();
    return (
      qCode === prefix ||
      qCode.startsWith(`${prefix}-`) ||
      qCode === paperCode.toUpperCase()
    );
  });
}

