// ============================================================
// SamayYudh 2.0 — WBJEE Official Syllabus Architecture
// West Bengal Joint Entrance Examination
// Source: WBJEE 2026 Official Syllabus
// ============================================================

export interface WbjeeChapter {
  id: string;
  number: number;
  name: string;
  description: string;
  paperCode: 'PAPER_I' | 'PAPER_II';
}

export interface WbjeeSubject {
  id: string;
  name: 'Mathematics' | 'Physics' | 'Chemistry';
  color: string;
  iconName: string;
  paper: {
    code: string;
    name: string;
    totalQuestions: number;
    totalMarks: number;
  };
  chapters: WbjeeChapter[];
}

export interface WbjeeSyllabusConfig {
  code: 'WBJEE';
  name: string;
  fullName: string;
  description: string;
  logo: string;
  examPattern: {
    cat1: { label: string; marks: number; negativeMarks: number; type: string };
    cat2: { label: string; marks: number; negativeMarks: number; type: string };
    cat3: { label: string; marks: number; negativeMarks: number; type: string };
  };
  subjects: WbjeeSubject[];
}

// ── WBJEE Complete Syllabus ───────────────────────────────────

export const WBJEE_SYLLABUS: WbjeeSyllabusConfig = {
  code: 'WBJEE',
  name: 'WBJEE',
  fullName: 'West Bengal Joint Entrance Examination',
  description: 'Prepare smarter. Practice every subject. Master every question.',
  logo: '/logos/wbjee.jpg',

  examPattern: {
    cat1: {
      label: 'Category 1',
      marks: 1,
      negativeMarks: 0.25,
      type: 'Single correct option',
    },
    cat2: {
      label: 'Category 2',
      marks: 2,
      negativeMarks: 0.5,
      type: 'Single correct option',
    },
    cat3: {
      label: 'Category 3',
      marks: 2,
      negativeMarks: 0,
      type: 'One or more correct options (partial marking)',
    },
  },

  subjects: [
    // ── Mathematics (Paper I) ──────────────────────────────────
    {
      id: 'mathematics',
      name: 'Mathematics',
      color: '#7c3aed', // Violet
      iconName: 'Calculator',
      paper: {
        code: 'PAPER_I',
        name: 'Paper I — Mathematics',
        totalQuestions: 75,
        totalMarks: 100,
      },
      chapters: [
        {
          id: 'wbjee-math-algebra',
          number: 1,
          name: 'Algebra',
          description: 'A.P., G.P., H.P., complex numbers, polynomial equations, permutations and combinations, logarithms, binomial theorem, sets, relations and functions.',
          paperCode: 'PAPER_I',
        },
        {
          id: 'wbjee-math-logarithms',
          number: 2,
          name: 'Logarithms',
          description: 'Definition, general properties of logarithms, change of base formula and applications to numerical computation.',
          paperCode: 'PAPER_I',
        },
        {
          id: 'wbjee-math-complex-numbers',
          number: 3,
          name: 'Complex Numbers',
          description: 'Complex numbers as ordered pairs, Argand diagram, modulus, argument, triangle inequality, nth roots of unity and cube roots of unity.',
          paperCode: 'PAPER_I',
        },
        {
          id: 'wbjee-math-polynomial-equations',
          number: 4,
          name: 'Polynomial Equations',
          description: 'Quadratic equations with real and complex roots, relation between roots and coefficients, theory of equations and symmetric functions of roots.',
          paperCode: 'PAPER_I',
        },
        {
          id: 'wbjee-math-permutation-combination',
          number: 5,
          name: 'Permutation and Combination',
          description: 'Fundamental principle of counting, factorial notation, permutations, combinations and their applications.',
          paperCode: 'PAPER_I',
        },
        {
          id: 'wbjee-math-pmi',
          number: 6,
          name: 'Principle of Mathematical Induction',
          description: 'Statement and proof of the principle of mathematical induction, applications to sums of series and inequalities.',
          paperCode: 'PAPER_I',
        },
        {
          id: 'wbjee-math-binomial-theorem',
          number: 7,
          name: 'Binomial Theorem',
          description: 'Binomial theorem for positive integral indices, general term, middle term, greatest term and applications.',
          paperCode: 'PAPER_I',
        },
        {
          id: 'wbjee-math-matrices',
          number: 8,
          name: 'Matrices',
          description: 'Matrices up to 3rd order, operations on matrices, transpose, symmetric and skew-symmetric matrices, orthogonal and adjoint matrices.',
          paperCode: 'PAPER_I',
        },
        {
          id: 'wbjee-math-determinants',
          number: 9,
          name: 'Determinants',
          description: 'Determinants up to 3rd order, properties, Cramer\'s rule, consistency and inconsistency of linear equations.',
          paperCode: 'PAPER_I',
        },
        {
          id: 'wbjee-math-sets-relations-functions',
          number: 10,
          name: 'Sets, Relations and Functions',
          description: 'Sets and their representations, operations on sets, relations, types of relations, functions, domain, co-domain, range and composite functions.',
          paperCode: 'PAPER_I',
        },
        {
          id: 'wbjee-math-trigonometry',
          number: 11,
          name: 'Trigonometry',
          description: 'Trigonometric ratios, identities, inverse trigonometric functions, general and principal values, trigonometric equations and properties of triangles.',
          paperCode: 'PAPER_I',
        },
        {
          id: 'wbjee-math-coordinate-geometry',
          number: 12,
          name: 'Coordinate Geometry of Two Dimensions',
          description: 'Straight lines, circles, parabola, ellipse and hyperbola — equations, properties, intersection and locus problems.',
          paperCode: 'PAPER_I',
        },
        {
          id: 'wbjee-math-3d-geometry',
          number: 13,
          name: 'Three-Dimensional Geometry',
          description: 'Coordinates, direction cosines and ratios, equations of lines and planes, shortest distance, sphere and its intersection.',
          paperCode: 'PAPER_I',
        },
        {
          id: 'wbjee-math-differential-calculus',
          number: 14,
          name: 'Differential Calculus',
          description: 'Limits, continuity, differentiability, derivatives of standard functions, chain rule, implicit differentiation, higher-order derivatives and applications.',
          paperCode: 'PAPER_I',
        },
        {
          id: 'wbjee-math-integral-calculus',
          number: 15,
          name: 'Integral Calculus',
          description: 'Indefinite and definite integrals, standard methods of integration, properties of definite integrals, area under curves.',
          paperCode: 'PAPER_I',
        },
        {
          id: 'wbjee-math-differential-equations',
          number: 16,
          name: 'Differential Equations',
          description: 'Formation of differential equations, variable separable, homogeneous, linear first-order differential equations and their applications.',
          paperCode: 'PAPER_I',
        },
        {
          id: 'wbjee-math-probability',
          number: 17,
          name: 'Probability',
          description: 'Classical definition, addition and multiplication theorems, conditional probability, Bayes\' theorem, independent events and probability distributions.',
          paperCode: 'PAPER_I',
        },
        {
          id: 'wbjee-math-statistics',
          number: 18,
          name: 'Statistics',
          description: 'Measures of central tendency, measures of dispersion, mean, variance, standard deviation, correlation coefficient and regression lines.',
          paperCode: 'PAPER_I',
        },
        {
          id: 'wbjee-math-vectors',
          number: 19,
          name: 'Vectors',
          description: 'Types of vectors, addition, dot product, cross product, scalar triple product and vector applications in geometry.',
          paperCode: 'PAPER_I',
        },
      ],
    },

    // ── Physics (Paper II) ─────────────────────────────────────
    {
      id: 'physics',
      name: 'Physics',
      color: '#0369a1', // Sky Blue
      iconName: 'Atom',
      paper: {
        code: 'PAPER_II',
        name: 'Paper II — Physics & Chemistry',
        totalQuestions: 40,
        totalMarks: 50,
      },
      chapters: [
        {
          id: 'wbjee-phy-units-dimensions',
          number: 1,
          name: 'Physical World, Measurements, Units and Dimensions',
          description: 'Physical quantities, SI units, dimensional analysis, errors in measurement and significant figures.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-kinematics',
          number: 2,
          name: 'Motion in One and Two Dimensions',
          description: 'Scalars and vectors, equations of motion, projectile motion, circular motion and relative motion.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-laws-of-motion',
          number: 3,
          name: 'Laws of Motion',
          description: 'Newton\'s three laws, linear momentum, impulse, concurrent forces, equilibrium and Lami\'s theorem.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-work-power-energy',
          number: 4,
          name: 'Work, Power and Energy',
          description: 'Work-energy theorem, kinetic and potential energy, conservation of energy, power and collisions.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-gravitation',
          number: 5,
          name: 'Gravitation',
          description: 'Newton\'s law of gravitation, gravitational field, potential, Kepler\'s laws, orbital velocity and escape velocity.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-friction',
          number: 6,
          name: 'Friction',
          description: 'Static and kinetic friction, laws of friction, coefficients of friction and angle of friction.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-properties-matter',
          number: 7,
          name: 'Properties of Matter',
          description: 'Elasticity — stress, strain, Young\'s modulus, bulk modulus, rigidity modulus and Poisson\'s ratio.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-bulk-properties',
          number: 8,
          name: 'Bulk Properties of Matter',
          description: 'Pressure, buoyancy, surface tension, capillarity, viscosity, Stokes\' law and Bernoulli\'s theorem.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-thermodynamics',
          number: 9,
          name: 'Heat and Thermodynamics',
          description: 'Thermal expansion, specific heat, calorimetry, conduction, convection, radiation, laws of thermodynamics and Carnot engine.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-kinetic-theory',
          number: 10,
          name: 'Kinetic Theory of Gases',
          description: 'Ideal gas laws, kinetic theory, rms speed, mean speed, degrees of freedom and equipartition of energy.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-oscillations',
          number: 11,
          name: 'Oscillations',
          description: 'Simple harmonic motion, time period, amplitude, energy in SHM, damped and forced oscillations and resonance.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-waves',
          number: 12,
          name: 'Waves',
          description: 'Wave motion, sound waves, superposition, beats, standing waves, vibration of strings and columns and Doppler effect.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-electrostatics',
          number: 13,
          name: 'Electrostatics',
          description: 'Coulomb\'s law, electric field, Gauss\'s law, electric potential, dipole, conductors, dielectrics and capacitors.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-current-electricity',
          number: 14,
          name: 'Current Electricity',
          description: 'Ohm\'s law, resistivity, Kirchhoff\'s laws, Wheatstone bridge, potentiometer, electric power and heating effect.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-magnetic-effects',
          number: 15,
          name: 'Magnetic Effects of Current',
          description: 'Biot-Savart law, Ampere\'s theorem, solenoid, toroid, Lorentz force, galvanometer, ammeter and voltmeter.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-emi',
          number: 16,
          name: 'Electromagnetic Induction',
          description: 'Faraday\'s law, Lenz\'s law, self-induction, mutual induction and energy stored in a magnetic field.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-ac',
          number: 17,
          name: 'Alternating Current',
          description: 'AC circuits with R, L and C, phase relationships, resonance, power factor, transformer and rectifiers.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-em-waves',
          number: 18,
          name: 'Electromagnetic Waves',
          description: 'Displacement current, characteristics and spectrum of electromagnetic waves.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-optics',
          number: 19,
          name: 'Optics',
          description: 'Reflection, refraction, lenses, mirrors, prisms, wave optics — interference, diffraction and polarisation.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-atomic-physics',
          number: 20,
          name: 'Atomic Physics',
          description: 'Bohr\'s model, hydrogen spectrum, photoelectric effect, de Broglie waves, Compton effect and X-rays.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-nuclear-physics',
          number: 21,
          name: 'Nuclear Physics',
          description: 'Nuclear stability, mass defect, binding energy, radioactive decay laws, fission and fusion.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-phy-electronics',
          number: 22,
          name: 'Electronics and Semiconductor Devices',
          description: 'p-n junction, diode, rectifier, Zener diode, transistor, logic gates and basic digital circuits.',
          paperCode: 'PAPER_II',
        },
      ],
    },

    // ── Chemistry (Paper II) ───────────────────────────────────
    {
      id: 'chemistry',
      name: 'Chemistry',
      color: '#059669', // Emerald
      iconName: 'FlaskConical',
      paper: {
        code: 'PAPER_II',
        name: 'Paper II — Physics & Chemistry',
        totalQuestions: 40,
        totalMarks: 50,
      },
      chapters: [
        {
          id: 'wbjee-chem-basic-concepts',
          number: 1,
          name: 'Some Basic Concepts of Chemistry',
          description: 'Laws of chemical combination, atomic mass, mole concept, empirical and molecular formulae, stoichiometry.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-atomic-structure',
          number: 2,
          name: 'Atomic Structure',
          description: 'Atomic models, quantum mechanical model, quantum numbers, electronic configuration, aufbau principle and Hund\'s rule.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-chemical-bonding',
          number: 3,
          name: 'Chemical Bonding and Molecular Structure',
          description: 'Ionic, covalent and coordinate bonds, Lewis structure, VSEPR theory, valence bond theory, hybridisation and MO theory.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-thermodynamics',
          number: 4,
          name: 'Chemical Energetics and Thermodynamics',
          description: 'Laws of thermodynamics, enthalpy, entropy, Gibbs free energy, Hess\'s law and thermochemical equations.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-equilibrium',
          number: 5,
          name: 'Chemical Equilibrium',
          description: 'Law of mass action, Kp and Kc, Le Chatelier\'s principle and factors affecting equilibrium.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-ionic-equilibrium',
          number: 6,
          name: 'Ionic Equilibrium',
          description: 'Acids and bases (Arrhenius, Bronsted-Lowry and Lewis), Ka and Kb, buffer solutions, hydrolysis, pH and solubility product.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-redox',
          number: 7,
          name: 'Redox Reactions',
          description: 'Concept of oxidation and reduction, oxidation number, balancing redox reactions — ion-electron and oxidation number methods.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-electrochemistry',
          number: 8,
          name: 'Electrochemistry',
          description: 'Electrolytic cells, Faraday\'s laws, galvanic cells, electrode potentials, EMF, Nernst equation and batteries.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-kinetics',
          number: 9,
          name: 'Chemical Kinetics',
          description: 'Rate of reaction, rate law, order, molecularity, integrated rate equations, Arrhenius equation and activation energy.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-solutions',
          number: 10,
          name: 'Solutions',
          description: 'Types of solutions, concentration terms, vapour pressure, Raoult\'s law, colligative properties and van\'t Hoff factor.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-periodic-table',
          number: 11,
          name: 'Periodic Table and Periodicity',
          description: 'Long form of the periodic table, trends in atomic radius, ionization enthalpy, electron gain enthalpy, electronegativity and valency.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-s-block',
          number: 12,
          name: 's-Block Elements',
          description: 'Group 1 and 2 elements — electronic configuration, occurrence, physical and chemical properties, important compounds and anomalous behaviour of lithium and beryllium.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-p-block',
          number: 13,
          name: 'p-Block Elements',
          description: 'Groups 13 to 18 — important elements, properties, allotropes, compounds, oxoacids and industrial applications.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-d-f-block',
          number: 14,
          name: 'd- and f-Block Elements',
          description: 'Transition metals — electronic configuration, variable valency, magnetic properties, important compounds and lanthanides.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-coordination',
          number: 15,
          name: 'Coordination Compounds',
          description: 'Werner\'s theory, IUPAC nomenclature, isomerism, valence bond theory and crystal field theory.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-environmental',
          number: 16,
          name: 'Environmental Chemistry',
          description: 'Air, water and soil pollution, greenhouse effect, ozone depletion, acid rain and green chemistry.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-organic-basic',
          number: 17,
          name: 'Organic Chemistry — Basic Principles',
          description: 'Classification, IUPAC nomenclature, isomerism, electronic effects, reaction intermediates and stereo chemistry.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-hydrocarbons',
          number: 18,
          name: 'Hydrocarbons',
          description: 'Alkanes, alkenes, alkynes and arenes — preparation, physical and chemical properties and reactions.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-halogens',
          number: 19,
          name: 'Organic Compounds Containing Halogens',
          description: 'Haloalkanes and haloarenes — nomenclature, preparation, properties, reactions and uses.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-oxygen',
          number: 20,
          name: 'Organic Compounds Containing Oxygen',
          description: 'Alcohols, phenols, ethers, aldehydes, ketones and carboxylic acids — classification, preparation, reactions and important reactions.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-nitrogen',
          number: 21,
          name: 'Organic Compounds Containing Nitrogen',
          description: 'Amines and diazonium salts — classification, nomenclature, preparation, physical and chemical properties.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-biomolecules',
          number: 22,
          name: 'Biomolecules',
          description: 'Carbohydrates, proteins, enzymes, vitamins, nucleic acids — structure, classification and biological importance.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-polymers',
          number: 23,
          name: 'Polymers',
          description: 'Natural and synthetic polymers, types of polymerisation, important polymers and their uses.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-everyday-life',
          number: 24,
          name: 'Chemistry in Everyday Life',
          description: 'Drugs, medicines, food chemicals, cleaning agents and their chemical basis.',
          paperCode: 'PAPER_II',
        },
        {
          id: 'wbjee-chem-practical',
          number: 25,
          name: 'Practical Chemistry',
          description: 'Salt analysis, volumetric analysis, principles of qualitative analysis and laboratory safety.',
          paperCode: 'PAPER_II',
        },
      ],
    },
  ],
};

// ── Helper Accessors ──────────────────────────────────────────

export function getWbjeeSubject(subjectId: string): WbjeeSubject | null {
  return WBJEE_SYLLABUS.subjects.find((s) => s.id === subjectId) ?? null;
}

export function getWbjeeChapter(chapterId: string): { chapter: WbjeeChapter; subject: WbjeeSubject } | null {
  for (const subject of WBJEE_SYLLABUS.subjects) {
    const chapter = subject.chapters.find((c) => c.id === chapterId);
    if (chapter) return { chapter, subject };
  }
  return null;
}

