// ============================================================
// SamayYudh 2.0 — Official Syllabus Data Architecture
// Dedicated Subject & Chapter Hierarchy for JEE Main, JEE Advanced, and NEET UG
// Each examination maintains an independent mapping and PYQ storage schema.
// ============================================================

export interface ChapterTopic {
  id: string;
  number: number;
  name: string;
  description?: string;
  importantFormulasCount?: number;
  totalPYQs?: number;
}

export interface SubjectSyllabus {
  id: string;
  name: string; // Must be strictly one of: 'Physics' | 'Mathematics' | 'Chemistry' | 'Biology'
  color: string;
  iconName: string;
  chapters: ChapterTopic[];
}

export interface ExamSyllabusConfig {
  code: string; // 'JEE_MAINS' | 'JEE_ADVANCED' | 'NEET'
  name: string;
  fullName: string;
  description: string;
  logo: string;
  subjects: SubjectSyllabus[];
}

export const EXAM_SYLLABUS_REGISTRY: Record<string, ExamSyllabusConfig> = {
  // ── 1. JEE MAIN ──────────────────────────────────────────────
  JEE_MAINS: {
    code: 'JEE_MAINS',
    name: 'JEE Main',
    fullName: 'Joint Entrance Examination — Main',
    description: 'National level engineering entrance examination conducted by NTA for admission to NITs, IIITs and CFTIs.',
    logo: '/logos/jee_mains.png',
    subjects: [
      {
        id: 'physics',
        name: 'Physics',
        color: '#0284c7', // Sky Blue
        iconName: 'Atom',
        chapters: [
          { id: 'physics-measurement', number: 1, name: 'Physics and Measurement', description: 'Units, dimensions, errors in measurement and dimensional analysis.' },
          { id: 'kinematics', number: 2, name: 'Kinematics', description: 'Motion in a straight line, projectile motion and relative velocity.' },
          { id: 'laws-of-motion', number: 3, name: 'Laws of Motion', description: "Newton's laws, impulse, friction and circular dynamics." },
          { id: 'work-energy-power', number: 4, name: 'Work, Energy and Power', description: 'Work-energy theorem, conservative forces, potential energy and collisions.' },
          { id: 'rotational-motion', number: 5, name: 'Rotational Motion', description: 'Centre of mass, torque, angular momentum and moment of inertia.' },
          { id: 'gravitation', number: 6, name: 'Gravitation', description: "Universal law, Kepler's laws, gravitational potential and orbital velocity." },
          { id: 'properties-solids-liquids', number: 7, name: 'Properties of Solids and Liquids', description: "Elasticity, surface tension, viscosity, Bernoulli's theorem and fluids." },
          { id: 'thermodynamics', number: 8, name: 'Thermodynamics', description: 'Laws of thermodynamics, heat engines, refrigerators and Carnot cycle.' },
          { id: 'kinetic-theory-gases', number: 9, name: 'Kinetic Theory of Gases', description: 'Equipartition of energy, mean free path and gas laws.' },
          { id: 'oscillations-waves', number: 10, name: 'Oscillations and Waves', description: 'Simple harmonic motion, wave motion, superposition and Doppler effect.' },
          { id: 'electrostatics', number: 11, name: 'Electrostatics', description: "Coulomb's law, electric field, potential, Gauss's law and capacitors." },
          { id: 'current-electricity', number: 12, name: 'Current Electricity', description: "Ohm's law, Kirchhoff's rules, Wheatstone bridge and potentiometer." },
          { id: 'magnetic-effects-current', number: 13, name: 'Magnetic Effects of Current and Magnetism', description: 'Biot-Savart law, Ampere law, magnetic dipole and Lorentz force.' },
          { id: 'emi-ac', number: 14, name: 'Electromagnetic Induction and Alternating Currents', description: "Faraday's law, Lenz's law, inductance, AC circuits, resonance and transformers." },
          { id: 'em-waves', number: 15, name: 'Electromagnetic Waves', description: 'Displacement current, characteristics of EM waves and electromagnetic spectrum.' },
          { id: 'optics', number: 16, name: 'Optics', description: 'Ray optics, reflection, refraction, lenses, wave optics and interference.' },
          { id: 'dual-nature', number: 17, name: 'Dual Nature of Matter and Radiation', description: 'Photoelectric effect, de Broglie relation and matter waves.' },
          { id: 'atoms-nuclei', number: 18, name: 'Atoms and Nuclei', description: 'Bohr model, hydrogen spectrum, radioactivity, mass defect and nuclear binding energy.' },
          { id: 'electronic-devices', number: 19, name: 'Electronic Devices', description: 'Semiconductors, p-n junction diode, LEDs and basic digital electronics.' },
          { id: 'experimental-skills', number: 20, name: 'Experimental Skills', description: 'Vernier callipers, screw gauge, simple pendulum, meter bridge and error analysis.' },
        ],
      },
      {
        id: 'mathematics',
        name: 'Mathematics',
        color: '#7c3aed', // Purple
        iconName: 'Calculator',
        chapters: [
          { id: 'sets-relations-functions', number: 1, name: 'Sets, Relations and Functions', description: 'Types of relations, domain, range and inverse functions.' },
          { id: 'complex-numbers-quadratics', number: 2, name: 'Complex Numbers and Quadratic Equations', description: 'Argand plane, modulus, argument, quadratic roots and inequalities.' },
          { id: 'matrices-determinants', number: 3, name: 'Matrices and Determinants', description: 'Matrix operations, adjoint, inverse and Cramer’s rule.' },
          { id: 'permutations-combinations', number: 4, name: 'Permutations and Combinations', description: 'Fundamental counting principle, arrangements, selections and circular permutations.' },
          { id: 'binomial-theorem', number: 5, name: 'Binomial Theorem', description: 'Positive integral indices, general term and binomial coefficients.' },
          { id: 'sequences-series', number: 6, name: 'Sequences and Series', description: 'Arithmetic and geometric progressions, means and special series.' },
          { id: 'limits-continuity-diff', number: 7, name: 'Limits, Continuity and Differentiability', description: 'Limits, L’Hopital’s rule, continuous functions and derivatives.' },
          { id: 'integral-calculus', number: 8, name: 'Integral Calculus', description: 'Indefinite integrals, definite integrals and properties, area under curves.' },
          { id: 'differential-equations', number: 9, name: 'Differential Equations', description: 'First order first degree equations, integrating factors and separation of variables.' },
          { id: 'coordinate-geometry', number: 10, name: 'Coordinate Geometry', description: 'Straight lines, circles, parabola, ellipse and hyperbola.' },
          { id: 'three-dimensional-geometry', number: 11, name: 'Three-Dimensional Geometry', description: 'Direction cosines, planes, straight lines in space and shortest distance.' },
          { id: 'vector-algebra', number: 12, name: 'Vector Algebra', description: 'Dot and cross products, scalar triple product and vector applications.' },
          { id: 'statistics-probability', number: 13, name: 'Statistics and Probability', description: 'Mean, variance, standard deviation, conditional probability and Bayes theorem.' },
          { id: 'trigonometry', number: 14, name: 'Trigonometry', description: 'Identities, equations, inverse trigonometric functions and height & distances.' },
        ],
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        color: '#059669', // Emerald
        iconName: 'FlaskConical',
        chapters: [
          { id: 'basic-concepts-chemistry', number: 1, name: 'Some Basic Concepts in Chemistry', description: 'Mole concept, stoichiometry, atomic and molecular masses.' },
          { id: 'atomic-structure', number: 2, name: 'Atomic Structure', description: 'Bohr model, quantum numbers, de Broglie wavelength and electronic configurations.' },
          { id: 'chemical-bonding', number: 3, name: 'Chemical Bonding and Molecular Structure', description: 'Ionic, covalent bonds, VSEPR theory, hybridization and molecular orbital theory.' },
          { id: 'chemical-thermodynamics', number: 4, name: 'Chemical Thermodynamics', description: 'First and second laws, enthalpy, entropy, Gibbs energy and spontaneity.' },
          { id: 'solutions', number: 5, name: 'Solutions', description: 'Raoult’s law, colligative properties, van’t Hoff factor and depression of freezing point.' },
          { id: 'equilibrium', number: 6, name: 'Equilibrium', description: 'Chemical equilibrium, Le Chatelier principle, pH, buffer solutions and solubility product.' },
          { id: 'redox-electrochemistry', number: 7, name: 'Redox Reactions and Electrochemistry', description: 'Oxidation numbers, Nernst equation, conductance, galvanic and electrolytic cells.' },
          { id: 'chemical-kinetics', number: 8, name: 'Chemical Kinetics', description: 'Rate laws, order of reaction, half-life, Arrhenius equation and activation energy.' },
          { id: 'periodicity-elements', number: 9, name: 'Classification of Elements and Periodicity', description: 'Modern periodic table, ionization enthalpy, electron gain enthalpy and electronegativity.' },
          { id: 'p-block-elements', number: 10, name: 'p-Block Elements', description: 'Groups 13 to 18 elements, allotropes, oxides and trends in properties.' },
          { id: 'd-f-block-elements', number: 11, name: 'd- and f-Block Elements', description: 'Transition elements, lanthanoids, actinoids, oxidation states and magnetic properties.' },
          { id: 'coordination-compounds', number: 12, name: 'Coordination Compounds', description: 'Werner theory, IUPAC nomenclature, crystal field theory and isomerism.' },
          { id: 'purification-organic', number: 13, name: 'Purification and Characterisation of Organic Compounds', description: 'Qualitative and quantitative analysis, chromatography and empirical formulas.' },
          { id: 'basic-principles-organic', number: 14, name: 'Some Basic Principles of Organic Chemistry', description: 'Inductive, electromeric, resonance and hyperconjugation effects, reaction mechanisms.' },
          { id: 'hydrocarbons', number: 15, name: 'Hydrocarbons', description: 'Alkanes, alkenes, alkynes, aromatic hydrocarbons and electrophilic substitutions.' },
          { id: 'organic-halogens', number: 16, name: 'Organic Compounds Containing Halogens', description: 'Alkyl and aryl halides, SN1 and SN2 mechanisms, properties and reactions.' },
          { id: 'organic-oxygen', number: 17, name: 'Organic Compounds Containing Oxygen', description: 'Alcohols, phenols, ethers, aldehydes, ketones, carboxylic acids and derivatives.' },
          { id: 'organic-nitrogen', number: 18, name: 'Organic Compounds Containing Nitrogen', description: 'Amines, diazotization, nitro compounds and basic character.' },
          { id: 'biomolecules', number: 19, name: 'Biomolecules', description: 'Carbohydrates, proteins, enzymes, nucleic acids and vitamins.' },
          { id: 'practical-chemistry', number: 20, name: 'Principles Related to Practical Chemistry', description: 'Systematic qualitative analysis of cations and anions, volumetric titration.' },
        ],
      },
    ],
  },

  // ── 2. JEE ADVANCED ──────────────────────────────────────────
  JEE_ADVANCED: {
    code: 'JEE_ADVANCED',
    name: 'JEE Advanced',
    fullName: 'Joint Entrance Examination — Advanced (IIT)',
    description: 'Premier entrance examination for admission into the Indian Institutes of Technology (IITs).',
    logo: '/logos/jee_advanced.jpg',
    subjects: [
      {
        id: 'physics',
        name: 'Physics',
        color: '#0284c7',
        iconName: 'Atom',
        chapters: [
          { id: 'general-physics', number: 1, name: 'General Physics', description: 'Units, dimensional analysis, significant figures, vernier callipers and screw gauge.' },
          { id: 'mechanics', number: 2, name: 'Mechanics', description: 'Kinematics in 1D and 2D, Newton’s laws, momentum, work-energy, rotational dynamics, gravitation and fluids.' },
          { id: 'thermal-physics', number: 3, name: 'Thermal Physics', description: 'Thermal expansion, calorimetry, heat transfer, laws of thermodynamics and ideal gases.' },
          { id: 'electricity-magnetism', number: 4, name: 'Electricity and Magnetism', description: 'Electrostatics, electric currents, magnetic fields, Ampere’s law, electromagnetic induction and AC circuits.' },
          { id: 'em-waves', number: 5, name: 'Electromagnetic Waves', description: 'Wave equations, polarization and electromagnetic wave characteristics.' },
          { id: 'optics', number: 6, name: 'Optics', description: 'Ray optics, wave optics, diffraction, interference and optical instruments.' },
          { id: 'modern-physics', number: 7, name: 'Modern Physics', description: 'Photoelectric effect, Bohr’s theory, de Broglie wavelength, nuclear reactions and radioactivity.' },
        ],
      },
      {
        id: 'mathematics',
        name: 'Mathematics',
        color: '#7c3aed',
        iconName: 'Calculator',
        chapters: [
          { id: 'sets-relations-functions', number: 1, name: 'Sets, Relations and Functions', description: 'Sets, composite and inverse functions, injective and surjective mappings.' },
          { id: 'algebra', number: 2, name: 'Algebra', description: 'Complex numbers, quadratic equations, permutations & combinations, binomial theorem and sequences & series.' },
          { id: 'matrices-determinants', number: 3, name: 'Matrices and Determinants', description: 'Matrix algebra, determinants, inverse, system of linear equations and transformations.' },
          { id: 'probability-statistics', number: 4, name: 'Probability and Statistics', description: 'Conditional probability, Bayes’ theorem, random variables and probability distributions.' },
          { id: 'trigonometry', number: 5, name: 'Trigonometry', description: 'Trigonometric functions, identities, equations, inverse functions and properties of triangles.' },
          { id: 'analytical-geometry', number: 6, name: 'Analytical Geometry', description: 'Straight lines, pair of lines, circles, conics (parabola, ellipse, hyperbola) and 3D geometry.' },
          { id: 'differential-calculus', number: 7, name: 'Differential Calculus', description: 'Limits, continuity, derivatives, Rolle’s theorem, mean value theorems, tangents and extrema.' },
          { id: 'integral-calculus', number: 8, name: 'Integral Calculus', description: 'Integration techniques, fundamental theorem of calculus, areas and differential equations.' },
          { id: 'vectors', number: 9, name: 'Vectors', description: 'Scalar and vector triple products, vector geometries and geometric applications.' },
        ],
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        color: '#059669',
        iconName: 'FlaskConical',
        chapters: [
          { id: 'general-topics', number: 1, name: 'General Topics', description: 'Mole concept, stoichiometry, balancing redox reactions and equivalent weight.' },
          { id: 'states-of-matter', number: 2, name: 'States of Matter', description: 'Gas laws, ideal gas equation, van der Waals equation and liquefaction of gases.' },
          { id: 'atomic-structure', number: 3, name: 'Atomic Structure', description: 'Bohr model, quantum numbers, wave-particle duality and electronic configurations.' },
          { id: 'chemical-bonding', number: 4, name: 'Chemical Bonding and Molecular Structure', description: 'Orbital overlap, hybridization, VSEPR, MO theory and hydrogen bonding.' },
          { id: 'chemical-thermodynamics', number: 5, name: 'Chemical Thermodynamics', description: 'State functions, enthalpy, entropy, free energy, spontaneity and Hess’s law.' },
          { id: 'chemical-ionic-equilibrium', number: 6, name: 'Chemical and Ionic Equilibrium', description: 'Law of mass action, Le Chatelier principle, pH, buffers, salts and solubility equilibria.' },
          { id: 'electrochemistry', number: 7, name: 'Electrochemistry', description: 'Galvanic cells, Nernst equation, electrolytic cells and Faraday’s laws.' },
          { id: 'chemical-kinetics', number: 8, name: 'Chemical Kinetics', description: 'Rates of reaction, rate constant, order and molecularity, Arrhenius equation.' },
          { id: 'solid-state', number: 9, name: 'Solid State', description: 'Crystal lattices, unit cells, packing efficiency and crystal defects.' },
          { id: 'solutions', number: 10, name: 'Solutions', description: 'Colligative properties, Raoult’s law, molecular mass determinations.' },
          { id: 'surface-chemistry', number: 11, name: 'Surface Chemistry', description: 'Adsorption isotherms, colloids, emulsions and catalysis.' },
          { id: 'periodicity-elements', number: 12, name: 'Classification of Elements and Periodicity', description: 'Periodic trends in ionization energy, electron affinity, radii and electronegativity.' },
          { id: 'hydrogen', number: 13, name: 'Hydrogen', description: 'Position in periodic table, isotopes, hydrides and water.' },
          { id: 's-block-elements', number: 14, name: 's-Block Elements', description: 'Alkali and alkaline earth metals, physical and chemical characteristics.' },
          { id: 'p-block-elements', number: 15, name: 'p-Block Elements', description: 'Boron, carbon, nitrogen, oxygen, halogen and noble gas chemistry.' },
          { id: 'd-f-block-elements', number: 16, name: 'd- and f-Block Elements', description: 'Transition metal series, coordination complexes, lanthanoid and actinoid contraction.' },
          { id: 'coordination-compounds', number: 17, name: 'Coordination Compounds', description: 'IUPAC naming, crystal field theory, Jahn-Teller effect and isomerism.' },
          { id: 'metallurgy', number: 18, name: 'Metallurgy', description: 'Extraction principles, Ellingham diagram, roasting, smelting and refining.' },
          { id: 'environmental-chemistry', number: 19, name: 'Environmental Chemistry', description: 'Atmospheric pollution, greenhouse effect and water quality standards.' },
          { id: 'basic-principles-organic', number: 20, name: 'Basic Principles of Organic Chemistry', description: 'Hybridization, reactive intermediates (carbocations, carbanions, free radicals) and resonance.' },
          { id: 'hydrocarbons', number: 21, name: 'Hydrocarbons', description: 'Alkanes, alkenes, alkynes, aromaticity, and electrophilic aromatic substitutions.' },
          { id: 'organic-halogens', number: 22, name: 'Organic Compounds Containing Halogens', description: 'Nucleophilic substitution mechanisms, Grignard reagents and polyhalogen compounds.' },
          { id: 'organic-oxygen', number: 23, name: 'Organic Compounds Containing Oxygen', description: 'Alcohols, phenols, ethers, carbonyls, carboxylic acids and esterifications.' },
          { id: 'organic-nitrogen', number: 24, name: 'Organic Compounds Containing Nitrogen', description: 'Amines, nitro compounds, diazonium salts and synthetic transformations.' },
          { id: 'biomolecules', number: 25, name: 'Biomolecules', description: 'Carbohydrates, amino acids, peptide bonds and nucleic acids.' },
          { id: 'polymers', number: 26, name: 'Polymers', description: 'Addition and condensation polymerizations, natural and synthetic polymers.' },
          { id: 'chemistry-everyday-life', number: 27, name: 'Chemistry in Everyday Life', description: 'Medicines, antibiotics, analgesics, food preservatives and detergents.' },
        ],
      },
    ],
  },

  // ── 3. NEET UG ───────────────────────────────────────────────
  NEET: {
    code: 'NEET',
    name: 'NEET UG',
    fullName: 'National Eligibility cum Entrance Test (UG)',
    description: 'Single national-level undergraduate medical entrance examination for MBBS, BDS, and AYUSH admissions.',
    logo: '/logos/neet.jpg',
    subjects: [
      {
        id: 'physics',
        name: 'Physics',
        color: '#0284c7',
        iconName: 'Atom',
        chapters: [
          { id: 'physics-measurement', number: 1, name: 'Physics and Measurement', description: 'Physical quantities, units and dimensions, error in measurements.' },
          { id: 'kinematics', number: 2, name: 'Kinematics', description: 'Motion in one and two dimensions, velocity-time graphs and vectors.' },
          { id: 'laws-of-motion', number: 3, name: 'Laws of Motion', description: 'Force, momentum, Newton’s laws, friction and circular motion.' },
          { id: 'work-energy-power', number: 4, name: 'Work, Energy and Power', description: 'Kinetic energy, potential energy, work-energy theorem and power.' },
          { id: 'rotational-motion', number: 5, name: 'Rotational Motion', description: 'Rotational kinematics, torque, angular momentum and moment of inertia.' },
          { id: 'gravitation', number: 6, name: 'Gravitation', description: 'Gravitational field, potential, escape velocity and orbital satellites.' },
          { id: 'properties-solids-liquids', number: 7, name: 'Properties of Solids and Liquids', description: 'Hooke’s law, fluid statics, viscosity, surface tension and heat transfer.' },
          { id: 'thermodynamics', number: 8, name: 'Thermodynamics', description: 'First and second laws, isothermal and adiabatic processes.' },
          { id: 'kinetic-theory-gases', number: 9, name: 'Kinetic Theory of Gases', description: 'Kinetic pressure, temperature interpretation and degrees of freedom.' },
          { id: 'oscillations-waves', number: 10, name: 'Oscillations and Waves', description: 'Periodic motion, resonance, sound waves, standing waves and beats.' },
          { id: 'electrostatics', number: 11, name: 'Electrostatics', description: 'Electric charges, Coulomb’s law, Gauss theorem and capacitance.' },
          { id: 'current-electricity', number: 12, name: 'Current Electricity', description: 'Electric current, drift velocity, Ohm’s law and circuit networks.' },
          { id: 'magnetic-effects-current', number: 13, name: 'Magnetic Effects of Current and Magnetism', description: 'Magnetic fields, Biot-Savart law, cyclotron and magnetic materials.' },
          { id: 'emi-ac', number: 14, name: 'Electromagnetic Induction and Alternating Currents', description: 'Electromagnetic induction, eddy currents, AC circuits and power.' },
          { id: 'em-waves', number: 15, name: 'Electromagnetic Waves', description: 'Electromagnetic spectrum and electromagnetic wave propagation.' },
          { id: 'optics', number: 16, name: 'Optics', description: 'Geometrical optics, optical instruments, wave optics and interference.' },
          { id: 'dual-nature', number: 17, name: 'Dual Nature of Matter and Radiation', description: 'Einstein’s photoelectric equation and matter waves.' },
          { id: 'atoms-nuclei', number: 18, name: 'Atoms and Nuclei', description: 'Rutherford and Bohr models, atomic spectra, nuclear fission and fusion.' },
          { id: 'electronic-devices', number: 19, name: 'Electronic Devices', description: 'Semiconductor diode, rectification, zener diode and logic circuits.' },
          { id: 'experimental-skills', number: 20, name: 'Experimental Skills', description: 'Measurement tools, calibration, error calculation and focal lengths.' },
        ],
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        color: '#059669',
        iconName: 'FlaskConical',
        chapters: [
          { id: 'basic-concepts-chemistry', number: 1, name: 'Some Basic Concepts in Chemistry', description: 'Matter, laws of chemical combination, mole concept and concentration terms.' },
          { id: 'atomic-structure', number: 2, name: 'Atomic Structure', description: 'Subatomic particles, dual nature of light and matter, orbital shapes.' },
          { id: 'chemical-bonding', number: 3, name: 'Chemical Bonding and Molecular Structure', description: 'Octet rule, dipole moments, VSEPR model and hybrid orbitals.' },
          { id: 'chemical-thermodynamics', number: 4, name: 'Chemical Thermodynamics', description: 'System and surroundings, internal energy, enthalpy and Gibbs energy.' },
          { id: 'solutions', number: 5, name: 'Solutions', description: 'Solubility of gases, ideal and non-ideal solutions and colligative effects.' },
          { id: 'equilibrium', number: 6, name: 'Equilibrium', description: 'Dynamic equilibrium, acids and bases, pH calculation and common ion effect.' },
          { id: 'redox-electrochemistry', number: 7, name: 'Redox Reactions and Electrochemistry', description: 'Redox balancing, standard electrode potentials and cell EMF.' },
          { id: 'chemical-kinetics', number: 8, name: 'Chemical Kinetics', description: 'Reaction rates, collision theory, factors affecting rates.' },
          { id: 'periodicity-elements', number: 9, name: 'Classification of Elements and Periodicity', description: 'Electronic configurations, atomic radii and periodic properties.' },
          { id: 'p-block-elements', number: 10, name: 'p-Block Elements', description: 'Group 13 to 18 elements, preparation, properties and uses.' },
          { id: 'd-f-block-elements', number: 11, name: 'd- and f-Block Elements', description: 'General trends of transition metals, lanthanoids and actinoids.' },
          { id: 'coordination-compounds', number: 12, name: 'Coordination Compounds', description: 'Coordination number, ligands, crystal field splitting and stability.' },
          { id: 'purification-organic', number: 13, name: 'Purification and Characterisation of Organic Compounds', description: 'Distillation, crystallization, chromatography and elemental analysis.' },
          { id: 'basic-principles-organic', number: 14, name: 'Some Basic Principles of Organic Chemistry', description: 'IUPAC nomenclature, isomerism, carbocations and free radical reactions.' },
          { id: 'hydrocarbons', number: 15, name: 'Hydrocarbons', description: 'Alkanes, alkenes, alkynes and aromatic compounds.' },
          { id: 'organic-halogens', number: 16, name: 'Organic Compounds Containing Halogens', description: 'Haloalkanes and haloarenes, mechanisms and environmental effects.' },
          { id: 'organic-oxygen', number: 17, name: 'Organic Compounds Containing Oxygen', description: 'Alcohols, phenols, aldehydes, ketones and carboxylic acids.' },
          { id: 'organic-nitrogen', number: 18, name: 'Organic Compounds Containing Nitrogen', description: 'Primary, secondary and tertiary amines, diazonium chemistry.' },
          { id: 'biomolecules', number: 19, name: 'Biomolecules', description: 'Monosaccharides, amino acids, protein structure and DNA/RNA.' },
          { id: 'practical-chemistry', number: 20, name: 'Principles Related to Practical Chemistry', description: 'Salt analysis, titrations, functional group identification.' },
        ],
      },
      {
        id: 'biology',
        name: 'Biology',
        color: '#16a34a', // Green
        iconName: 'Leaf',
        chapters: [
          { id: 'diversity-living-world', number: 1, name: 'Diversity in Living World', description: 'What is living, biodiversity, taxonomic categories and aids.' },
          { id: 'biological-classification', number: 2, name: 'Biological Classification', description: 'Five kingdom system, Monera, Protista, Fungi, viruses and viroids.' },
          { id: 'plant-kingdom', number: 3, name: 'Plant Kingdom', description: 'Algae, Bryophytes, Pteridophytes, Gymnosperms and Angiosperms.' },
          { id: 'animal-kingdom', number: 4, name: 'Animal Kingdom', description: 'Non-chordates to chordates classification and salient features.' },
          { id: 'morphology-flowering-plants', number: 5, name: 'Morphology of Flowering Plants', description: 'Root, stem, leaf, inflorescence, flower, fruit and seed anatomy.' },
          { id: 'anatomy-flowering-plants', number: 6, name: 'Anatomy of Flowering Plants', description: 'Tissues, tissue systems, primary and secondary growth in dicots and monocots.' },
          { id: 'structural-organisation-animals', number: 7, name: 'Structural Organisation in Animals', description: 'Animal tissues, organ systems and morphology of model organisms.' },
          { id: 'cell-unit-of-life', number: 8, name: 'Cell: The Unit of Life', description: 'Prokaryotic and eukaryotic cells, organelles and endomembrane system.' },
          { id: 'biomolecules-bio', number: 9, name: 'Biomolecules', description: 'Proteins, carbohydrates, lipids, nucleic acids and enzymes.' },
          { id: 'cell-cycle-cell-division', number: 10, name: 'Cell Cycle and Cell Division', description: 'Mitosis, meiosis and their physiological significance.' },
          { id: 'photosynthesis-higher-plants', number: 11, name: 'Photosynthesis in Higher Plants', description: 'Light reaction, Calvin cycle, C4 pathway and photorespiration.' },
          { id: 'respiration-in-plants', number: 12, name: 'Respiration in Plants', description: 'Glycolysis, Krebs cycle, electron transport system and fermentation.' },
          { id: 'plant-growth-development', number: 13, name: 'Plant Growth and Development', description: 'Phytohormones, photoperiodism, vernalization and seed dormancy.' },
          { id: 'breathing-exchange-gases', number: 14, name: 'Breathing and Exchange of Gases', description: 'Respiratory organs, mechanism of breathing and gas transport.' },
          { id: 'body-fluids-circulation', number: 15, name: 'Body Fluids and Circulation', description: 'Blood composition, heart structure, cardiac cycle and ECG.' },
          { id: 'excretory-products-elimination', number: 16, name: 'Excretory Products and Their Elimination', description: 'Nephron structure, urine formation, regulation and dialysis.' },
          { id: 'locomotion-movement', number: 17, name: 'Locomotion and Movement', description: 'Skeletal system, joints, sliding filament theory of muscle contraction.' },
          { id: 'neural-control-coordination', number: 18, name: 'Neural Control and Coordination', description: 'Neuron, nerve impulse conduction, central and peripheral nervous systems.' },
          { id: 'chemical-coordination-integration', number: 19, name: 'Chemical Coordination and Integration', description: 'Endocrine glands, hormones and hormonal feedback mechanisms.' },
          { id: 'sexual-reproduction-flowering', number: 20, name: 'Sexual Reproduction in Flowering Plants', description: 'Microsporogenesis, megasporogenesis, pollination and double fertilization.' },
          { id: 'human-reproduction', number: 21, name: 'Human Reproduction', description: 'Male and female reproductive systems, gametogenesis, menstrual cycle and pregnancy.' },
          { id: 'reproductive-health', number: 22, name: 'Reproductive Health', description: 'Population stabilization, contraception, STDs and assisted reproductive techniques.' },
          { id: 'principles-inheritance-variation', number: 23, name: 'Principles of Inheritance and Variation', description: 'Mendelian inheritance, linkage, chromosomal disorders and sex determination.' },
          { id: 'molecular-basis-inheritance', number: 24, name: 'Molecular Basis of Inheritance', description: 'DNA replication, transcription, genetic code, translation and lac operon.' },
          { id: 'evolution', number: 25, name: 'Evolution', description: 'Origin of life, Darwinian evolution, Hardy-Weinberg principle and human evolution.' },
          { id: 'human-health-disease', number: 26, name: 'Human Health and Disease', description: 'Pathogens, immunity, vaccination, AIDS, cancer and drug abuse.' },
          { id: 'microbes-human-welfare', number: 27, name: 'Microbes in Human Welfare', description: 'Microbes in household products, industrial production, sewage and biofertilizers.' },
          { id: 'biotechnology-principles', number: 28, name: 'Biotechnology: Principles and Processes', description: 'Recombinant DNA technology, restriction enzymes and gene vectors.' },
          { id: 'biotechnology-applications', number: 29, name: 'Biotechnology and Its Applications', description: 'Applications in agriculture, medicine, gene therapy and biosafety issues.' },
          { id: 'organisms-populations', number: 30, name: 'Organisms and Populations', description: 'Organisms and environment, population growth curves and interactions.' },
          { id: 'ecosystem', number: 31, name: 'Ecosystem', description: 'Ecosystem structure, productivity, energy flow and ecological pyramids.' },
          { id: 'biodiversity-conservation', number: 32, name: 'Biodiversity and Conservation', description: 'Patterns of biodiversity, biodiversity loss, in-situ and ex-situ conservation.' },
        ],
      },
    ],
  },
};

// Aliases helper
export function resolveExamSyllabusKey(codeOrName: string | null | undefined): string | null {
  if (!codeOrName) return null;
  const key = codeOrName.trim().toUpperCase().replace(/[\s-]/g, '_');
  if (key === 'JEE' || key === 'JEE_MAIN' || key === 'JEE_MAINS') return 'JEE_MAINS';
  if (key === 'JEE_ADV' || key === 'JEE_ADVANCED' || key === 'IIT_JEE') return 'JEE_ADVANCED';
  if (key === 'NEET' || key === 'NEET_UG' || key === 'MEDICAL') return 'NEET';
  return null;
}

export function isStructuredExam(codeOrName: string | null | undefined): boolean {
  return resolveExamSyllabusKey(codeOrName) !== null;
}

export function getExamSyllabus(codeOrName: string | null | undefined): ExamSyllabusConfig | null {
  const resolvedKey = resolveExamSyllabusKey(codeOrName);
  return resolvedKey ? EXAM_SYLLABUS_REGISTRY[resolvedKey] : null;
}

