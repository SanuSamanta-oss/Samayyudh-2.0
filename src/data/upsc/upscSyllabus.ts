// ============================================================
// SamayYudh 2.0 — UPSC Civil Services Examination Syllabus
// Source: Official UPSC CSE Notification & Syllabus
// ============================================================

export interface UpscTopic {
  id: string;
  number: number;
  name: string;
  description: string;
  paperCode: string;
}

export interface UpscPaper {
  id: string;
  code: string;
  name: string;
  title: string;
  stage: 'PRELIMS' | 'MAINS';
  isQualifying?: boolean;
  qualifyingPercentage?: number;
  totalMarks: number;
  durationHours: number;
  totalQuestions?: number;
  type: 'OBJECTIVE' | 'DESCRIPTIVE';
  topics: UpscTopic[];
}

export interface UpscOptionalSubject {
  id: string;
  name: string;
  code: string;
  paper1Topics: UpscTopic[];
  paper2Topics: UpscTopic[];
}

export interface UpscInterviewSection {
  id: string;
  number: number;
  name: string;
  description: string;
  category: 'DAF' | 'AWARENESS' | 'SITUATIONAL' | 'PRACTICE';
}

// ── 1. PRELIMS PAPERS ──────────────────────────────────────────

export const UPSC_PRELIMS_PAPERS: UpscPaper[] = [
  {
    id: 'gs1',
    code: 'GS-1',
    name: 'General Studies Paper I',
    title: 'General Studies — Paper I (Merit Ranking for Prelims)',
    stage: 'PRELIMS',
    totalMarks: 200,
    durationHours: 2,
    totalQuestions: 100,
    type: 'OBJECTIVE',
    topics: [
      { id: 'pre-cur-affairs', number: 1, name: 'Current Events of National and International Importance', description: 'Major national developments, international summits, treaties, awards, science breakthroughs and bilateral events.', paperCode: 'GS-1' },
      { id: 'pre-hist-india', number: 2, name: 'History of India', description: 'Ancient, medieval and early modern Indian history, cultural developments, administrations and socio-economic life.', paperCode: 'GS-1' },
      { id: 'pre-inm', number: 3, name: 'Indian National Movement', description: 'Rise of nationalism, revolutionary movements, Gandhian era, socio-religious reforms and transfer of power 1947.', paperCode: 'GS-1' },
      { id: 'pre-world-geo', number: 4, name: 'Indian and World Geography', description: 'Physical, social and economic geography of India and the world.', paperCode: 'GS-1' },
      { id: 'pre-phys-geo', number: 5, name: 'Physical Geography', description: 'Geomorphology, climatology, oceanography, biogeography and major earth systems.', paperCode: 'GS-1' },
      { id: 'pre-ind-geo', number: 6, name: 'Indian Geography', description: 'Physiographic divisions, drainage systems, monsoons, minerals, agriculture, industries and transport.', paperCode: 'GS-1' },
      { id: 'pre-eco-soc-dev', number: 7, name: 'Economic and Social Development', description: 'Macroeconomics, national income, fiscal policy, monetary policy, banking, inflation and inclusive growth.', paperCode: 'GS-1' },
      { id: 'pre-sust-dev', number: 8, name: 'Sustainable Development', description: 'Sustainable development goals, climate resilient economy, green finance and renewable transitions.', paperCode: 'GS-1' },
      { id: 'pre-pov-inc', number: 9, name: 'Poverty and Inclusion', description: 'Poverty measurement, inequality, financial inclusion, public distribution system and social safety nets.', paperCode: 'GS-1' },
      { id: 'pre-demographics', number: 10, name: 'Demographics', description: 'Census trends, demographic dividend, migration, urbanization and human development indicators.', paperCode: 'GS-1' },
      { id: 'pre-soc-sec', number: 11, name: 'Social Sector Initiatives', description: 'Health, education, nutrition, women and child welfare, vulnerable sections and skilling programs.', paperCode: 'GS-1' },
      { id: 'pre-ind-polity', number: 12, name: 'Indian Polity', description: 'Preamble, fundamental rights, directive principles, fundamental duties and constitutional framework.', paperCode: 'GS-1' },
      { id: 'pre-constitution', number: 13, name: 'Constitution of India', description: 'Historical background, salient features, amendments, emergency provisions and basic structure doctrine.', paperCode: 'GS-1' },
      { id: 'pre-pol-sys', number: 14, name: 'Political System', description: 'Parliament, Union executive, state executive, judiciary, elections and political parties.', paperCode: 'GS-1' },
      { id: 'pre-panchayat', number: 15, name: 'Panchayati Raj', description: '73rd and 74th Constitutional Amendment Acts, local self-government, finances and decentralization.', paperCode: 'GS-1' },
      { id: 'pre-pub-policy', number: 16, name: 'Public Policy', description: 'Policy formulation, implementation, digital governance, welfare schemes and administrative reforms.', paperCode: 'GS-1' },
      { id: 'pre-rights', number: 17, name: 'Rights Issues', description: 'Human rights, fundamental freedoms, civil liberties, consumer rights and statutory commissions.', paperCode: 'GS-1' },
      { id: 'pre-env-eco', number: 18, name: 'General Issues on Environmental Ecology', description: 'Ecosystem concepts, food chains, energy flow, biome types and ecological succession.', paperCode: 'GS-1' },
      { id: 'pre-biodiversity', number: 19, name: 'Biodiversity', description: 'Flora, fauna, hotspots, endangered species, national parks, wildlife sanctuaries and Biosphere reserves.', paperCode: 'GS-1' },
      { id: 'pre-climate-chg', number: 20, name: 'Climate Change', description: 'Global warming, greenhouse effect, UNFCCC, Kyoto protocol, Paris agreement and national mission.', paperCode: 'GS-1' },
      { id: 'pre-gen-science', number: 21, name: 'General Science', description: 'Everyday applications of Physics, Chemistry, Biology, biotechnology, space, defense and IT.', paperCode: 'GS-1' },
    ],
  },
  {
    id: 'csat',
    code: 'CSAT',
    name: 'General Studies Paper II — CSAT',
    title: 'General Studies Paper II (CSAT — Qualifying, 33% Minimum)',
    stage: 'PRELIMS',
    isQualifying: true,
    qualifyingPercentage: 33,
    totalMarks: 200,
    durationHours: 2,
    totalQuestions: 80,
    type: 'OBJECTIVE',
    topics: [
      { id: 'csat-comprehension', number: 1, name: 'Comprehension', description: 'Reading comprehension passages, author assumptions, main inference and contextual vocabulary.', paperCode: 'CSAT' },
      { id: 'csat-interpersonal', number: 2, name: 'Interpersonal Skills', description: 'Interpersonal interaction, teamwork dynamics and workplace communication skills.', paperCode: 'CSAT' },
      { id: 'csat-comm-skills', number: 3, name: 'Communication Skills', description: 'Verbal reasoning, sentence restructuring and effective language synthesis.', paperCode: 'CSAT' },
      { id: 'csat-logic-reason', number: 4, name: 'Logical Reasoning', description: 'Syllogisms, statements and assumptions, blood relations, directions and sequence logic.', paperCode: 'CSAT' },
      { id: 'csat-analytical', number: 5, name: 'Analytical Ability', description: 'Puzzles, seating arrangements, grouping, comparisons, coding-decoding and series completion.', paperCode: 'CSAT' },
      { id: 'csat-dec-making', number: 6, name: 'Decision Making', description: 'Situational analysis, administrative decisions and ethical course of action.', paperCode: 'CSAT' },
      { id: 'csat-prob-solving', number: 7, name: 'Problem Solving', description: 'Multi-step analytical scenarios, critical thinking and solution derivation.', paperCode: 'CSAT' },
      { id: 'csat-gen-mental', number: 8, name: 'General Mental Ability', description: 'Venn diagrams, cubes and dice, clocks, calendars and spatial orientation.', paperCode: 'CSAT' },
      { id: 'csat-basic-num', number: 9, name: 'Basic Numeracy', description: 'Numbers, fractions, percentages, ratio and proportion, averages and simple interest.', paperCode: 'CSAT' },
      { id: 'csat-num-sys', number: 10, name: 'Number Systems', description: 'Divisibility rules, primes, LCM and HCF, unit digits, remainders and recurring decimals.', paperCode: 'CSAT' },
      { id: 'csat-order-mag', number: 11, name: 'Orders of Magnitude', description: 'Class X level arithmetic sequences, powers, exponents and proportional approximations.', paperCode: 'CSAT' },
      { id: 'csat-data-interp', number: 12, name: 'Data Interpretation', description: 'Reading and analyzing complex numeric datasets under time constraints.', paperCode: 'CSAT' },
      { id: 'csat-charts-graphs', number: 13, name: 'Charts and Graphs', description: 'Bar graphs, line charts, pie charts, radar plots and comparative trends.', paperCode: 'CSAT' },
      { id: 'csat-tables', number: 14, name: 'Tables', description: 'Tabular datasets, frequency distributions, cross-tabulation and metric calculations.', paperCode: 'CSAT' },
      { id: 'csat-data-suff', number: 15, name: 'Data Sufficiency', description: 'Evaluating sufficiency of statements for solving algebraic and arithmetic questions.', paperCode: 'CSAT' },
      { id: 'csat-eng-comp', number: 16, name: 'English Language Comprehension Skills', description: 'Passage comprehension testing Class X level analytical English vocabulary and grammar.', paperCode: 'CSAT' },
    ],
  },
];

// ── 2. MAINS PAPERS ───────────────────────────────────────────

export const UPSC_MAINS_PAPERS: UpscPaper[] = [
  // Qualifying Papers
  {
    id: 'paper-a',
    code: 'PAPER-A',
    name: 'Paper A — Indian Language',
    title: 'Qualifying Paper A: One Indian Language Selected from 8th Schedule',
    stage: 'MAINS',
    isQualifying: true,
    qualifyingPercentage: 25,
    totalMarks: 300,
    durationHours: 3,
    type: 'DESCRIPTIVE',
    topics: [
      { id: 'lang-comp', number: 1, name: 'Comprehension of Given Passages', description: 'Reading comprehension and analytical answering in chosen Indian language.', paperCode: 'PAPER-A' },
      { id: 'lang-precis', number: 2, name: 'Precis Writing', description: 'Summarizing long passages to one-third length preserving core ideas.', paperCode: 'PAPER-A' },
      { id: 'lang-usage', number: 3, name: 'Usage and Vocabulary', description: 'Idioms, sentence correction, synonyms, antonyms and grammatical syntax.', paperCode: 'PAPER-A' },
      { id: 'lang-essay', number: 4, name: 'Short Essays', description: 'Topic-based descriptive essay in the selected Indian language.', paperCode: 'PAPER-A' },
      { id: 'lang-trans-eng', number: 5, name: 'Translation from English to Indian Language', description: 'Accurate and contextual translation of English prose.', paperCode: 'PAPER-A' },
      { id: 'lang-trans-ind', number: 6, name: 'Translation from Indian Language to English', description: 'Faithful and idiomatically sound translation into English.', paperCode: 'PAPER-A' },
    ],
  },
  {
    id: 'paper-b',
    code: 'PAPER-B',
    name: 'Paper B — English',
    title: 'Qualifying Paper B: English Language',
    stage: 'MAINS',
    isQualifying: true,
    qualifyingPercentage: 25,
    totalMarks: 300,
    durationHours: 3,
    type: 'DESCRIPTIVE',
    topics: [
      { id: 'eng-comp', number: 1, name: 'Comprehension of Given Passages', description: 'Analytical response writing based on advanced prose comprehension.', paperCode: 'PAPER-B' },
      { id: 'eng-precis', number: 2, name: 'Precis Writing', description: 'Crisp, structured precis writing within prescribed word counts.', paperCode: 'PAPER-B' },
      { id: 'eng-usage', number: 3, name: 'Usage and Vocabulary', description: 'Standard English syntax, grammar, idioms, phrasal verbs and active vocabulary.', paperCode: 'PAPER-B' },
      { id: 'eng-short-essays', number: 4, name: 'Short Essays', description: 'Coherent essay writing demonstrating logical flow and articulation.', paperCode: 'PAPER-B' },
    ],
  },

  // Merit Papers
  {
    id: 'paper-1',
    code: 'PAPER-1',
    name: 'Paper I — Essay',
    title: 'Merit Paper I: Essay (Section A & Section B)',
    stage: 'MAINS',
    totalMarks: 250,
    durationHours: 3,
    type: 'DESCRIPTIVE',
    topics: [
      { id: 'essay-phil', number: 1, name: 'Philosophical Essays', description: 'Abstract, philosophical, and moral prompts testing multi-dimensional thinking.', paperCode: 'PAPER-1' },
      { id: 'essay-soc', number: 2, name: 'Social Issues', description: 'Gender equality, caste dynamics, education, healthcare, and social cohesion.', paperCode: 'PAPER-1' },
      { id: 'essay-pol', number: 3, name: 'Political Issues', description: 'Democracy, federalism, civic duty, sovereignty, and constitutional morality.', paperCode: 'PAPER-1' },
      { id: 'essay-eco', number: 4, name: 'Economic Issues', description: 'Inclusive growth, digital economy, industrialization, and poverty alleviation.', paperCode: 'PAPER-1' },
      { id: 'essay-env', number: 5, name: 'Environmental Issues', description: 'Climate emergency, sustainable development, and biodiversity conservation.', paperCode: 'PAPER-1' },
      { id: 'essay-st', number: 6, name: 'Science and Technology', description: 'Artificial Intelligence, space, ethical dimensions of technological innovation.', paperCode: 'PAPER-1' },
      { id: 'essay-ir', number: 7, name: 'International Relations', description: 'Multilateralism, geopolitics, global peace, and foreign policy perspectives.', paperCode: 'PAPER-1' },
      { id: 'essay-edu', number: 8, name: 'Education and Society', description: 'Pedagogy, scientific temper, skill-building, and cultural transmission.', paperCode: 'PAPER-1' },
      { id: 'essay-eth', number: 9, name: 'Ethics and Values', description: 'Character, public service ethics, truth, compassion, and human integrity.', paperCode: 'PAPER-1' },
      { id: 'essay-pyq', number: 10, name: 'Previous Year Essay Questions (2013–2025)', description: 'Chronological repository of all official UPSC Civil Services Mains Essay prompts.', paperCode: 'PAPER-1' },
    ],
  },
  {
    id: 'paper-2',
    code: 'PAPER-2',
    name: 'Paper II — General Studies I',
    title: 'General Studies I: Indian Heritage, Culture, History & Geography of the World & Society',
    stage: 'MAINS',
    totalMarks: 250,
    durationHours: 3,
    type: 'DESCRIPTIVE',
    topics: [
      { id: 'gs1-art', number: 1, name: 'Indian Art Forms', description: 'Paintings, classical dances, music, folk traditions and performing arts.', paperCode: 'PAPER-2' },
      { id: 'gs1-lit', number: 2, name: 'Indian Literature', description: 'Vedic, classical, medieval, regional and modern Indian literary traditions.', paperCode: 'PAPER-2' },
      { id: 'gs1-arch', number: 3, name: 'Architecture', description: 'Rock-cut, temple, Indo-Islamic, colonial and contemporary architecture.', paperCode: 'PAPER-2' },
      { id: 'gs1-anc-hist', number: 4, name: 'Ancient Indian History', description: 'Harappan civilization, Vedic age, Mahajanapadas, Mauryas, Guptas and Post-Gupta.', paperCode: 'PAPER-2' },
      { id: 'gs1-med-hist', number: 5, name: 'Medieval Indian History', description: 'Delhi Sultanate, Vijayanagara Empire, Mughals, Marathas, Bhakti and Sufi movements.', paperCode: 'PAPER-2' },
      { id: 'gs1-mod-hist', number: 6, name: 'Modern Indian History', description: 'Advent of Europeans, British expansion, socio-religious reforms and British policies.', paperCode: 'PAPER-2' },
      { id: 'gs1-freedom', number: 7, name: 'Freedom Struggle', description: 'Phases of national movement, leadership, ideological strands and mass mobilizations.', paperCode: 'PAPER-2' },
      { id: 'gs1-post-ind', number: 8, name: 'Post-Independence Consolidation', description: 'Integration of princely states, linguistic reorganization, planning and tribal consolidation.', paperCode: 'PAPER-2' },
      { id: 'gs1-world-hist', number: 9, name: 'World History', description: 'Enlightenment, American and French revolutions, nationalism and unification.', paperCode: 'PAPER-2' },
      { id: 'gs1-ind-rev', number: 10, name: 'Industrial Revolution', description: 'Causes, phases, global economic shifts, labor movements and social impacts.', paperCode: 'PAPER-2' },
      { id: 'gs1-world-wars', number: 11, name: 'World Wars', description: 'Causes and geopolitical fallout of World War I, League of Nations, World War II and UN.', paperCode: 'PAPER-2' },
      { id: 'gs1-decolon', number: 12, name: 'Colonization and Decolonization', description: 'Imperialism in Asia and Africa, anti-colonial struggles and liberation movements.', paperCode: 'PAPER-2' },
      { id: 'gs1-pol-phil', number: 13, name: 'Political Philosophies', description: 'Communism, capitalism, socialism — their forms and effect on global societies.', paperCode: 'PAPER-2' },
      { id: 'gs1-society', number: 14, name: 'Indian Society', description: 'Family, caste, kinship, rural-urban continuum and social institutions.', paperCode: 'PAPER-2' },
      { id: 'gs1-diversity', number: 15, name: 'Diversity of India', description: 'Linguistic, religious, cultural and ethnic pluralism in contemporary India.', paperCode: 'PAPER-2' },
      { id: 'gs1-women', number: 16, name: 'Role of Women', description: 'Women movements, female workforce participation, gender violence and empowerment.', paperCode: 'PAPER-2' },
      { id: 'gs1-population', number: 17, name: 'Population and Associated Issues', description: 'Fertility trends, demographic transition, aging, youth bulge and policy measures.', paperCode: 'PAPER-2' },
      { id: 'gs1-poverty', number: 18, name: 'Poverty and Developmental Issues', description: 'Structural poverty, regional disparities, multi-dimensional deprivation and solutions.', paperCode: 'PAPER-2' },
      { id: 'gs1-urban', number: 19, name: 'Urbanization', description: 'Urban governance, slums, housing, transport, municipal infrastructure and smart cities.', paperCode: 'PAPER-2' },
      { id: 'gs1-global', number: 20, name: 'Globalization', description: 'Impact of economic, cultural and technological globalization on Indian society.', paperCode: 'PAPER-2' },
      { id: 'gs1-empower', number: 21, name: 'Social Empowerment', description: 'Upliftment of SCs, STs, OBCs, minorities, persons with disabilities and seniors.', paperCode: 'PAPER-2' },
      { id: 'gs1-communal', number: 22, name: 'Communalism', description: 'Origins, manifestations, identity politics, communal harmony and state action.', paperCode: 'PAPER-2' },
      { id: 'gs1-regional', number: 23, name: 'Regionalism', description: 'Sub-nationalism, interstate disputes, development imbalances and national integration.', paperCode: 'PAPER-2' },
      { id: 'gs1-secular', number: 24, name: 'Secularism', description: 'Western vs Indian models of secularism, challenges and constitutional safeguards.', paperCode: 'PAPER-2' },
      { id: 'gs1-phys-geo', number: 25, name: 'Physical Geography of the World', description: 'Plate tectonics, volcanism, earthquakes, tsunamis, landforms and climate zones.', paperCode: 'PAPER-2' },
      { id: 'gs1-resources', number: 26, name: 'Distribution of Natural Resources', description: 'Minerals, energy, water, forests and agricultural regions across South Asia and world.', paperCode: 'PAPER-2' },
      { id: 'gs1-geophys', number: 27, name: 'Geophysical Phenomena', description: 'Cyclones, el nino, la nina, polar vortex, monsoons and cryospheric shifts.', paperCode: 'PAPER-2' },
      { id: 'gs1-geo-changes', number: 28, name: 'Geographical Features and Changes', description: 'Glacial retreats, desertification, changes in water bodies and ecosystems.', paperCode: 'PAPER-2' },
    ],
  },
  {
    id: 'paper-3',
    code: 'PAPER-3',
    name: 'Paper III — General Studies II',
    title: 'General Studies II: Governance, Constitution, Polity, Social Justice & International Relations',
    stage: 'MAINS',
    totalMarks: 250,
    durationHours: 3,
    type: 'DESCRIPTIVE',
    topics: [
      { id: 'gs2-const', number: 1, name: 'Indian Constitution', description: 'Preamble, fundamental features, philosophical underpinnings and evolution.', paperCode: 'PAPER-3' },
      { id: 'gs2-hist-back', number: 2, name: 'Historical Background of the Constitution', description: 'Government of India Acts, Constituent Assembly debates and landmark judgments.', paperCode: 'PAPER-3' },
      { id: 'gs2-amend', number: 3, name: 'Constitutional Amendments', description: 'Article 368 procedure, major amendments (42nd, 44th, 73rd, 86th, 101st GST) and impact.', paperCode: 'PAPER-3' },
      { id: 'gs2-basic-struct', number: 4, name: 'Basic Structure', description: 'Kesavananda Bharati doctrine, Minerva Mills, judicial review and constitutional supremacy.', paperCode: 'PAPER-3' },
      { id: 'gs2-govts', number: 5, name: 'Union and State Governments', description: 'Functions and responsibilities of executive and legislative wings at Union and State levels.', paperCode: 'PAPER-3' },
      { id: 'gs2-parl', number: 6, name: 'Parliament', description: 'Structure, functioning, parliamentary committees, budget process and privileges.', paperCode: 'PAPER-3' },
      { id: 'gs2-state-leg', number: 7, name: 'State Legislatures', description: 'Composition, legislative procedure, bicameral states and executive accountability.', paperCode: 'PAPER-3' },
      { id: 'gs2-exec', number: 8, name: 'Executive', description: 'President, Prime Minister, Cabinet, Governor and Chief Minister — powers and checks.', paperCode: 'PAPER-3' },
      { id: 'gs2-judiciary', number: 9, name: 'Judiciary', description: 'Supreme Court, High Courts, collegium system, judicial activism and pending cases.', paperCode: 'PAPER-3' },
      { id: 'gs2-federal', number: 10, name: 'Federalism', description: 'Cooperative federalism, asymmetric federalism, interstate council and finance commission.', paperCode: 'PAPER-3' },
      { id: 'gs2-centre-state', number: 11, name: 'Centre-State Relations', description: 'Legislative, administrative, and financial relations and dispute resolution.', paperCode: 'PAPER-3' },
      { id: 'gs2-local-gov', number: 12, name: 'Local Self-Government', description: 'Devolution of powers to PRIs and ULBs, municipal bonds and civic capacity.', paperCode: 'PAPER-3' },
      { id: 'gs2-sep-powers', number: 13, name: 'Separation of Powers', description: 'Doctrine of checks and balances between legislature, executive and judiciary.', paperCode: 'PAPER-3' },
      { id: 'gs2-const-bodies', number: 14, name: 'Constitutional Bodies', description: 'ECI, UPSC, CAG, Finance Commission, National Commissions for SC/ST/BC.', paperCode: 'PAPER-3' },
      { id: 'gs2-stat-bodies', number: 15, name: 'Statutory and Regulatory Bodies', description: 'NHRC, CIC, CVC, Lokpal, CBI, SEBI, CCI, TRAI and RBI governance.', paperCode: 'PAPER-3' },
      { id: 'gs2-policies', number: 16, name: 'Government Policies', description: 'Public policy design, implementation bottlenecks and outcome evaluation.', paperCode: 'PAPER-3' },
      { id: 'gs2-dev-proc', number: 17, name: 'Development Processes', description: 'Role of NGOs, SHGs, civil society, donor agencies and philanthropic trusts.', paperCode: 'PAPER-3' },
      { id: 'gs2-welfare', number: 18, name: 'Welfare Schemes', description: 'Targeting, DBT, exclusion errors, social audit and performance of flagship schemes.', paperCode: 'PAPER-3' },
      { id: 'gs2-soc-issues', number: 19, name: 'Social Sector Issues', description: 'Access, equity and quality in social infrastructure across rural and urban India.', paperCode: 'PAPER-3' },
      { id: 'gs2-health', number: 20, name: 'Health', description: 'Public healthcare delivery, primary health centers, Ayushman Bharat and digital health.', paperCode: 'PAPER-3' },
      { id: 'gs2-education', number: 21, name: 'Education', description: 'National Education Policy 2020, higher education reforms, skilling and learning poverty.', paperCode: 'PAPER-3' },
      { id: 'gs2-human-res', number: 22, name: 'Human Resources', description: 'Skill development, labor productivity, employment generation and demographic yield.', paperCode: 'PAPER-3' },
      { id: 'gs2-poverty-hunger', number: 23, name: 'Poverty and Hunger', description: 'Global Hunger Index metrics, NFSA, POSHAN Abhiyaan and nutritional security.', paperCode: 'PAPER-3' },
      { id: 'gs2-governance', number: 24, name: 'Governance', description: 'Good governance tenets, administrative accountability, civil services and public value.', paperCode: 'PAPER-3' },
      { id: 'gs2-transparency', number: 25, name: 'Transparency and Accountability', description: 'RTI Act, whistleblowers protection, grievance redressal and open data.', paperCode: 'PAPER-3' },
      { id: 'gs2-egov', number: 26, name: 'E-Governance', description: 'Digital India, public service platforms, AI in governance and cyber privacy.', paperCode: 'PAPER-3' },
      { id: 'gs2-citizens', number: 27, name: 'Citizen Charters', description: 'Service delivery standards, citizen charters implementation and Sevottam model.', paperCode: 'PAPER-3' },
      { id: 'gs2-civil-services', number: 28, name: 'Role of Civil Services', description: 'Role of bureaucracy in a democracy, steel frame modernization and Mission Karmayogi.', paperCode: 'PAPER-3' },
      { id: 'gs2-neighbours', number: 29, name: 'India and Neighbouring Countries', description: 'Neighbourhood First policy, SAARC, BIMSTEC, border disputes and connectivity.', paperCode: 'PAPER-3' },
      { id: 'gs2-bilateral', number: 30, name: 'Bilateral Relations', description: 'India with US, Russia, China, EU, Japan, Central Asia, West Asia and Africa.', paperCode: 'PAPER-3' },
      { id: 'gs2-groupings', number: 31, name: 'Regional and Global Groupings', description: 'G20, Quad, BRICS, SCO, ASEAN, I2U2 and maritime coalitions.', paperCode: 'PAPER-3' },
      { id: 'gs2-inst', number: 32, name: 'International Institutions', description: 'UN, UNSC reforms, WTO, IMF, World Bank, WHO and international law.', paperCode: 'PAPER-3' },
    ],
  },
  {
    id: 'paper-4',
    code: 'PAPER-4',
    name: 'Paper IV — General Studies III',
    title: 'General Studies III: Technology, Economic Development, Biodiversity, Environment, Security & Disaster Management',
    stage: 'MAINS',
    totalMarks: 250,
    durationHours: 3,
    type: 'DESCRIPTIVE',
    topics: [
      { id: 'gs3-ind-econ', number: 1, name: 'Indian Economy', description: 'Macro-economic indicators, growth targets, structural transformation and investment.', paperCode: 'PAPER-4' },
      { id: 'gs3-planning', number: 2, name: 'Planning and Resource Mobilization', description: 'NITI Aayog, tax mobilization, GST regime and disinvestments.', paperCode: 'PAPER-4' },
      { id: 'gs3-growth', number: 3, name: 'Growth and Development', description: 'Sustainable GDP growth, human development index and multi-sectoral linkages.', paperCode: 'PAPER-4' },
      { id: 'gs3-employ', number: 4, name: 'Employment', description: 'Informal economy, formalization, gig workers, labor codes and job creation.', paperCode: 'PAPER-4' },
      { id: 'gs3-inclusive', number: 5, name: 'Inclusive Growth', description: 'Financial inclusion, regional equality, MSME promotion and social mobility.', paperCode: 'PAPER-4' },
      { id: 'gs3-budget', number: 6, name: 'Government Budgeting', description: 'Union budget components, fiscal deficit, revenue deficit, FRBM Act and Capex.', paperCode: 'PAPER-4' },
      { id: 'gs3-agri', number: 7, name: 'Agriculture', description: 'Cropping systems, farm productivity, MSP regime, fertilizer subsidies and reforms.', paperCode: 'PAPER-4' },
      { id: 'gs3-crop-pat', number: 8, name: 'Cropping Patterns', description: 'Shifts in cropping patterns, climate-resilient crops, millets and horticulture.', paperCode: 'PAPER-4' },
      { id: 'gs3-irrigation', number: 9, name: 'Irrigation Systems', description: 'Micro-irrigation, PMKSY, groundwater depletion, dam safety and canal networks.', paperCode: 'PAPER-4' },
      { id: 'gs3-agri-mktg', number: 10, name: 'Agricultural Marketing', description: 'APMC markets, e-NAM, supply chains, cold storage infrastructure and FPOs.', paperCode: 'PAPER-4' },
      { id: 'gs3-e-tech', number: 11, name: 'E-Technology in Agriculture', description: 'Drones, precision farming, satellite crop monitoring and mobile advisory.', paperCode: 'PAPER-4' },
      { id: 'gs3-food-proc', number: 12, name: 'Food Processing', description: 'Upstream and downstream linkages, mega food parks, value addition and exports.', paperCode: 'PAPER-4' },
      { id: 'gs3-land-ref', number: 13, name: 'Land Reforms', description: 'Tenancy reforms, land ceiling, land pooling, digitization and SVAMITVA.', paperCode: 'PAPER-4' },
      { id: 'gs3-infrastr', number: 14, name: 'Infrastructure', description: 'PM GatiShakti, highways, railways, ports, airports, national grid and renewable energy.', paperCode: 'PAPER-4' },
      { id: 'gs3-invest', number: 15, name: 'Investment Models', description: 'Public-Private Partnerships (PPP), BOT, HAM, EPC and National Monetization Pipeline.', paperCode: 'PAPER-4' },
      { id: 'gs3-sci-tech', number: 16, name: 'Science and Technology', description: 'National research policies, R&D funding and technological applications in daily life.', paperCode: 'PAPER-4' },
      { id: 'gs3-achieve-st', number: 17, name: 'Achievements in Science and Technology', description: 'Contributions of Indian scientists from ancient to modern era.', paperCode: 'PAPER-4' },
      { id: 'gs3-indigen', number: 18, name: 'Indigenization of Technology', description: 'Make in India in defense, semiconductors, indigenous vaccines and hardware.', paperCode: 'PAPER-4' },
      { id: 'gs3-it-comp', number: 19, name: 'IT and Computers', description: 'Supercomputing, quantum computing, digital public infrastructure and 5G/6G.', paperCode: 'PAPER-4' },
      { id: 'gs3-robot-ai', number: 20, name: 'Robotics and AI', description: 'Artificial intelligence ethics, generative AI, machine learning and industrial automation.', paperCode: 'PAPER-4' },
      { id: 'gs3-space', number: 21, name: 'Space Technology', description: 'ISRO missions (Chandrayaan, Gaganyaan, Aditya-L1), satellite launch systems and private space.', paperCode: 'PAPER-4' },
      { id: 'gs3-biotech', number: 22, name: 'Biotechnology', description: 'CRISPR, gene editing, GM crops, stem cell research and biopharma.', paperCode: 'PAPER-4' },
      { id: 'gs3-ipr', number: 23, name: 'Intellectual Property Rights', description: 'Patents Act, TRIPS compliance, compulsory licensing, GI tags and copyright.', paperCode: 'PAPER-4' },
      { id: 'gs3-env-cons', number: 24, name: 'Environmental Conservation', description: 'Air and water act, EIA process, green tribunals, coastal regulation zones and LIFE mission.', paperCode: 'PAPER-4' },
      { id: 'gs3-biodiv', number: 25, name: 'Biodiversity', description: 'Biological diversity act, access and benefit sharing, national targets and Ramsar sites.', paperCode: 'PAPER-4' },
      { id: 'gs3-climate-chg', number: 26, name: 'Climate Change', description: 'India Panchamrit goals, net-zero 2070, carbon markets and adaptation strategies.', paperCode: 'PAPER-4' },
      { id: 'gs3-pollution', number: 27, name: 'Environmental Pollution', description: 'Vehicular emissions, stubble burning, plastic waste, e-waste and river clean-up.', paperCode: 'PAPER-4' },
      { id: 'gs3-disaster', number: 28, name: 'Disaster Management', description: 'NDMA framework, Sendai Framework, early warning systems and resilient building.', paperCode: 'PAPER-4' },
      { id: 'gs3-int-sec', number: 29, name: 'Internal Security', description: 'Left-wing extremism, insurgency in Northeast, cross-border terrorism and AFSPA.', paperCode: 'PAPER-4' },
      { id: 'gs3-cyber-sec', number: 30, name: 'Cyber Security', description: 'Cyber warfare, CERT-In, data protection laws, dark web and critical infrastructure.', paperCode: 'PAPER-4' },
      { id: 'gs3-money-laun', number: 31, name: 'Money Laundering', description: 'PMLA provisions, FATF guidelines, shell companies and hawala networks.', paperCode: 'PAPER-4' },
      { id: 'gs3-border-mgmt', number: 32, name: 'Border Management', description: 'Smart fencing, border infrastructure, coastal security and immigration management.', paperCode: 'PAPER-4' },
      { id: 'gs3-sec-forces', number: 33, name: 'Security Forces and Agencies', description: 'Mandate and role of CAPFs, Army, Navy, Air Force, IB, RAW and NIA.', paperCode: 'PAPER-4' },
    ],
  },
  {
    id: 'paper-5',
    code: 'PAPER-5',
    name: 'Paper V — General Studies IV',
    title: 'General Studies IV: Ethics, Integrity & Aptitude (Theory & Case Studies)',
    stage: 'MAINS',
    totalMarks: 250,
    durationHours: 3,
    type: 'DESCRIPTIVE',
    topics: [
      { id: 'gs4-ethics-human', number: 1, name: 'Ethics and Human Interface', description: 'Essence, determinants and consequences of ethics in human actions; dimensions of ethics.', paperCode: 'PAPER-5' },
      { id: 'gs4-human-val', number: 2, name: 'Human Values', description: 'Lessons from the lives and teachings of great leaders, reformers and administrators.', paperCode: 'PAPER-5' },
      { id: 'gs4-attitude', number: 3, name: 'Attitude', description: 'Content, structure, function, moral and political attitudes, social influence and persuasion.', paperCode: 'PAPER-5' },
      { id: 'gs4-aptitude', number: 4, name: 'Aptitude and Foundational Values', description: 'Integrity, impartiality, non-partisanship, objectivity, dedication to public service and empathy.', paperCode: 'PAPER-5' },
      { id: 'gs4-ei', number: 5, name: 'Emotional Intelligence', description: 'Concepts, utilities and application of emotional intelligence in administration and governance.', paperCode: 'PAPER-5' },
      { id: 'gs4-thinkers', number: 6, name: 'Contributions of Moral Thinkers', description: 'Philosophers and thinkers from India (Kautilya, Gandhi, Ambedkar) and the world (Socrates, Kant, Mill).', paperCode: 'PAPER-5' },
      { id: 'gs4-pub-values', number: 7, name: 'Public Service Values', description: 'Status and problems, ethical concerns and dilemmas in government and private institutions.', paperCode: 'PAPER-5' },
      { id: 'gs4-pub-admin-eth', number: 8, name: 'Ethics in Public Administration', description: 'Laws, rules, regulations and conscience as sources of ethical guidance; accountability.', paperCode: 'PAPER-5' },
      { id: 'gs4-account', number: 9, name: 'Accountability', description: 'Ethical governance, strengthening of ethical and moral values in governance.', paperCode: 'PAPER-5' },
      { id: 'gs4-probity', number: 10, name: 'Probity in Governance', description: 'Concept of public service, philosophical basis of governance and probity, information sharing.', paperCode: 'PAPER-5' },
      { id: 'gs4-transp', number: 11, name: 'Transparency', description: 'Right to Information, codes of ethics, codes of conduct and citizen charters.', paperCode: 'PAPER-5' },
      { id: 'gs4-citizen-chart', number: 12, name: 'Citizen Charters', description: 'Citizen-centric administration, service delivery standards and accountability.', paperCode: 'PAPER-5' },
      { id: 'gs4-work-cult', number: 13, name: 'Work Culture', description: 'Quality of service delivery, workplace ethos, teamwork and bureaucratic ethics.', paperCode: 'PAPER-5' },
      { id: 'gs4-service-del', number: 14, name: 'Quality of Service Delivery', description: 'Citizen grievance redressal, responsiveness, public feedback and institutional empathy.', paperCode: 'PAPER-5' },
      { id: 'gs4-pub-funds', number: 15, name: 'Utilization of Public Funds', description: 'Prudent financial management, prevention of leakages, value-for-money and audit ethics.', paperCode: 'PAPER-5' },
      { id: 'gs4-corruption', number: 16, name: 'Challenges of Corruption', description: 'Causes, manifestations, anti-corruption machinery (Lokpal, CVC, CBI) and remedies.', paperCode: 'PAPER-5' },
      { id: 'gs4-cases', number: 17, name: 'Case Studies on Ethics and Governance', description: 'Comprehensive real-world administrative ethical dilemmas, stakeholder maps and resolution strategies.', paperCode: 'PAPER-5' },
    ],
  },
];

// ── 3. OFFICIAL 25 OPTIONAL SUBJECTS ──────────────────────────

export const UPSC_OPTIONAL_SUBJECTS: UpscOptionalSubject[] = [
  {
    id: 'geography',
    name: 'Geography',
    code: 'GEO',
    paper1Topics: [
      { id: 'geo1-geomorph', number: 1, name: 'Geomorphology', description: 'Factors controlling landform development, endogenetic and exogenetic forces, plate tectonics.', paperCode: 'OPT-1' },
      { id: 'geo1-climatol', number: 2, name: 'Climatology', description: 'Temperature and pressure belts, air masses, frontogenesis, cyclones and climatic classification.', paperCode: 'OPT-1' },
      { id: 'geo1-oceanog', number: 3, name: 'Oceanography', description: 'Bottom topography, temperature and salinity, ocean currents, tides, marine resources and deposits.', paperCode: 'OPT-1' },
      { id: 'geo1-biogeo', number: 4, name: 'Biogeography', description: 'Genesis of soils, soil profile, classification, soil erosion, degradation and conservation.', paperCode: 'OPT-1' },
      { id: 'geo1-envgeo', number: 5, name: 'Environmental Geography', description: 'Ecosystems, ecological balance, human impact, environmental degradation and hazards.', paperCode: 'OPT-1' },
      { id: 'geo1-perspectives', number: 6, name: 'Perspectives in Human Geography', description: 'Areal differentiation, regional synthesis, dichotomy, dualism, environmentalism and positivism.', paperCode: 'OPT-1' },
      { id: 'geo1-economic', number: 7, name: 'Economic Geography', description: 'World economic development, energy crisis, theories of location, agricultural and industrial regions.', paperCode: 'OPT-1' },
      { id: 'geo1-population', number: 8, name: 'Population and Settlement Geography', description: 'Demographic transition, world population growth, migration, rural and urban settlements.', paperCode: 'OPT-1' },
      { id: 'geo1-regional', number: 9, name: 'Regional Planning', description: 'Concept of a region, types of regions, regional imbalances, multi-level planning and growth poles.', paperCode: 'OPT-1' },
      { id: 'geo1-models', number: 10, name: 'Models, Theories and Laws in Human Geography', description: 'Malthus, Ricardo, Von Thunen, Weber, Christaller, Losch, Rostow and Heart-land theories.', paperCode: 'OPT-1' },
    ],
    paper2Topics: [
      { id: 'geo2-phys', number: 1, name: 'Physical Setting of India', description: 'Space relationships, structure, relief, drainage, monsoons, soil types and natural vegetation.', paperCode: 'OPT-2' },
      { id: 'geo2-resources', number: 2, name: 'Resources of India', description: 'Land, surface and groundwater, energy, minerals, marine and forest resources.', paperCode: 'OPT-2' },
      { id: 'geo2-agri', number: 3, name: 'Agriculture in India', description: 'Infrastructure, institutional factors, cropping patterns, agricultural regionalisation and Green Revolution.', paperCode: 'OPT-2' },
      { id: 'geo2-industry', number: 4, name: 'Industry in India', description: 'Evolution, location factors, industrial clusters, new industrial policy and public sector undertakings.', paperCode: 'OPT-2' },
      { id: 'geo2-transport', number: 5, name: 'Transport, Communication and Trade', description: 'Roadways, railways, waterways, pipelines, ports, trade balance and export processing zones.', paperCode: 'OPT-2' },
      { id: 'geo2-cultural', number: 6, name: 'Cultural Setting', description: 'Historical perspective, racial and linguistic diversity, religious minorities and tribes.', paperCode: 'OPT-2' },
      { id: 'geo2-settlements', number: 7, name: 'Settlements', description: 'Types, patterns, morphology, urban agglomerations, slums and town planning.', paperCode: 'OPT-2' },
      { id: 'geo2-regional-dev', number: 8, name: 'Regional Development and Planning', description: 'Planning regions, backward area development, island development and river basin plans.', paperCode: 'OPT-2' },
      { id: 'geo2-political', number: 9, name: 'Political Aspects', description: 'Geographical basis of Indian federalism, state reorganization, cross-border issues and geopolitics.', paperCode: 'OPT-2' },
      { id: 'geo2-contemporary', number: 10, name: 'Contemporary Issues in India', description: 'Environmental hazards, desertification, river linking, food security, urban sprawl and globalization.', paperCode: 'OPT-2' },
    ],
  },
  {
    id: 'history',
    name: 'History',
    code: 'HIST',
    paper1Topics: [
      { id: 'hist1-sources', number: 1, name: 'Sources and Early Pastoral / Agricultural Communities', description: 'Archaeological sources, literary sources, epigraphy, numismatics, Neolithic-Chalcolithic cultures.', paperCode: 'OPT-1' },
      { id: 'hist1-indus', number: 2, name: 'Indus Valley Civilization', description: 'Origin, date, extent, characteristics, decline, survival and significance.', paperCode: 'OPT-1' },
      { id: 'hist1-vedic', number: 3, name: 'Vedic Period', description: 'Aryans, literature, religion, political institutions, social organization and economy.', paperCode: 'OPT-1' },
      { id: 'hist1-mahajanapadas', number: 4, name: 'Mahajanapadas, Buddhism and Jainism', description: 'Republics, rise of Magadha, heterodox sects, philosophy and urbanisation.', paperCode: 'OPT-1' },
      { id: 'hist1-mauryan', number: 5, name: 'Mauryan Empire', description: 'Chandragupta, Ashoka and his Dhamma, administration, economy, art and decline.', paperCode: 'OPT-1' },
      { id: 'hist1-post-maurya', number: 6, name: 'Post-Mauryan Period and Guptas', description: 'Indo-Greeks, Kushans, Satavahanas, Gupta empire, classical art and literature.', paperCode: 'OPT-1' },
      { id: 'hist1-early-med', number: 7, name: 'Early Medieval India (750–1200 CE)', description: 'Agrarian economy, feudalism debates, Cholas, Rajputs, temples and philosophy.', paperCode: 'OPT-1' },
      { id: 'hist1-sultanate', number: 8, name: 'Thirteenth and Fourteenth Century Sultanate', description: 'Ghurian invasion, Iltutmish, Balban, Alauddin Khalji, Muhammad Tughlaq and administration.', paperCode: 'OPT-1' },
      { id: 'hist1-mughals', number: 9, name: 'The Mughal Empire (1526–1707 CE)', description: 'Babur, Humayun, Akbar (mansabdari, religious policy), Jahangir, Shah Jahan, Aurangzeb.', paperCode: 'OPT-1' },
      { id: 'hist1-18th-century', number: 10, name: 'Eighteenth Century Economy, Society and Culture', description: 'Decline of Mughals, regional states, Maratha confederacy and socio-religious life.', paperCode: 'OPT-1' },
    ],
    paper2Topics: [
      { id: 'hist2-british-rule', number: 1, name: 'European Penetration and British Expansion', description: 'Carnatic wars, Bengal conquest, subsidiary alliance, doctrine of lapse and colonial policies.', paperCode: 'OPT-2' },
      { id: 'hist2-colonial-econ', number: 2, name: 'Economic Impact of British Rule', description: 'Land revenue settlements, deindustrialization, commercialization of agriculture, drain of wealth.', paperCode: 'OPT-2' },
      { id: 'hist2-reforms', number: 3, name: 'Social and Religious Reform Movements', description: 'Raja Ram Mohan Roy, Brahmo Samaj, Arya Samaj, Aligarh movement, caste movements.', paperCode: 'OPT-2' },
      { id: 'hist2-national-mov', number: 4, name: 'Indian Nationalism and Early Phase', description: 'Origins, Indian National Congress, Moderates, Extremists, Swadeshi movement, Home Rule.', paperCode: 'OPT-2' },
      { id: 'hist2-gandhi-era', number: 5, name: 'Gandhian Era and Mass Movements', description: 'Non-Cooperation, Civil Disobedience, Quit India, revolutionary nationalism and Left politics.', paperCode: 'OPT-2' },
      { id: 'hist2-partition', number: 6, name: 'Constitutional Developments and Independence', description: 'Acts of 1909, 1919, 1935, Cripps Mission, Cabinet Mission, Partition and integration.', paperCode: 'OPT-2' },
      { id: 'hist2-enlightenment', number: 7, name: 'Enlightenment and Modern Ideas', description: 'Major ideas of Enlightenment, Rousseau, Voltaire, spread of science and parliamentary reform.', paperCode: 'OPT-2' },
      { id: 'hist2-rev-wars', number: 8, name: 'Origins of Modern Politics: Revolutions and World Wars', description: 'American Revolution, French Revolution, Industrial Revolution, World War I and Russian Revolution.', paperCode: 'OPT-2' },
      { id: 'hist2-imperialism', number: 9, name: 'Imperialism, Colonialism and Fascism', description: 'Scramble for Africa, Chinese concession, rise of Fascism in Italy and Nazism in Germany.', paperCode: 'OPT-2' },
      { id: 'hist2-cold-war', number: 10, name: 'Cold War and Decolonization', description: 'NATO, Warsaw Pact, Korean and Vietnam wars, Non-Aligned Movement and disintegration of Soviet Union.', paperCode: 'OPT-2' },
    ],
  },
  {
    id: 'psir',
    name: 'Political Science and International Relations',
    code: 'PSIR',
    paper1Topics: [
      { id: 'psir1-pol-theory', number: 1, name: 'Political Theory: Meaning and Approaches', description: 'Traditional, behavioral, post-behavioral, feminist and Marxist approaches to politics.', paperCode: 'OPT-1' },
      { id: 'psir1-theories-state', number: 2, name: 'Theories of the State', description: 'Liberal, neo-liberal, Marxist, pluralist, post-colonial and feminist theories.', paperCode: 'OPT-1' },
      { id: 'psir1-justice-equality', number: 3, name: 'Justice, Equality, Rights and Democracy', description: 'Rawlsian theory of justice, affirmative action, human rights, procedural vs substantive democracy.', paperCode: 'OPT-1' },
      { id: 'psir1-ideologies', number: 4, name: 'Political Ideologies', description: 'Liberalism, socialism, Marxism, fascism, Gandhism and ecologism.', paperCode: 'OPT-1' },
      { id: 'psir1-western-thinkers', number: 5, name: 'Western Political Thought', description: 'Plato, Aristotle, Machiavelli, Hobbes, Locke, Mill, Marx, Gramsci, Hannah Arendt.', paperCode: 'OPT-1' },
      { id: 'psir1-indian-thinkers', number: 6, name: 'Indian Political Thought', description: 'Dharamshastra, Arthashastra, Buddhist traditions, Sir Syed, Aurobindo, Gandhi, Ambedkar, Roy.', paperCode: 'OPT-1' },
      { id: 'psir1-ind-nationalism', number: 7, name: 'Indian Nationalism and Constitution', description: 'Perspectives on Indian national movement, Constituent assembly, Preamble and fundamental rights.', paperCode: 'OPT-1' },
      { id: 'psir1-gov-organs', number: 8, name: 'Principal Organs of the Union and State Government', description: 'Executive, Legislature and Judiciary in theory and practice; constitutional functionings.', paperCode: 'OPT-1' },
      { id: 'psir1-grassroots', number: 9, name: 'Grassroots Democracy and Statutory Institutions', description: 'Panchayati Raj, statutory commissions, CAG, Election Commission and judicial review.', paperCode: 'OPT-1' },
      { id: 'psir1-federalism-party', number: 10, name: 'Federalism and Party System in India', description: 'Asymmetric federalism, coalition politics, pressure groups, regionalism and caste in politics.', paperCode: 'OPT-1' },
    ],
    paper2Topics: [
      { id: 'psir2-comp-politics', number: 1, name: 'Comparative Politics: Nature and Major Approaches', description: 'Political economy, political sociology approaches, limitations of comparative method.', paperCode: 'OPT-2' },
      { id: 'psir2-state-comp', number: 2, name: 'State in Comparative Perspective', description: 'Characteristics and changing nature of the State in capitalist and socialist societies.', paperCode: 'OPT-2' },
      { id: 'psir2-ir-theories', number: 3, name: 'Theories of International Relations', description: 'Realist, liberal, Marxist, constructivist, feminist and critical theories of IR.', paperCode: 'OPT-2' },
      { id: 'psir2-key-concepts', number: 4, name: 'Concepts in International Relations', description: 'National power, national interest, balance of power, collective security and nuclear deterrence.', paperCode: 'OPT-2' },
      { id: 'psir2-global-order', number: 5, name: 'Changing Global Political Order', description: 'Rise of superpowers, Cold War, collapse of USSR, unipolarity, multipolarity and rise of global South.', paperCode: 'OPT-2' },
      { id: 'psir2-un-institutions', number: 6, name: 'United Nations and Global Governance', description: 'Evolution, major organs, peacekeeping, UNSC reform debates and specialized agencies.', paperCode: 'OPT-2' },
      { id: 'psir2-foreign-policy', number: 7, name: 'India\'s Foreign Policy: Determinants and Evolution', description: 'Historical drivers, non-alignment, continuity and change in contemporary foreign policy.', paperCode: 'OPT-2' },
      { id: 'psir2-south-asia', number: 8, name: 'India and South Asia', description: 'Regional cooperation, SAARC, BIMSTEC, bilateral relations with Pakistan, Bangladesh, Sri Lanka, Nepal.', paperCode: 'OPT-2' },
      { id: 'psir2-major-powers', number: 9, name: 'India and the Global Centres of Power', description: 'Strategic partnerships with USA, Russia, China, European Union and Japan.', paperCode: 'OPT-2' },
      { id: 'psir2-global-issues', number: 10, name: 'India and the Global Issues', description: 'Nuclear doctrine, WTO negotiations, climate diplomacy, global terrorism and maritime security.', paperCode: 'OPT-2' },
    ],
  },
  {
    id: 'sociology',
    name: 'Sociology',
    code: 'SOC',
    paper1Topics: [
      { id: 'soc1-discipline', number: 1, name: 'Sociology — The Discipline', description: 'Modernity and social changes in Europe, emergence of sociology, scope and comparison with other social sciences.', paperCode: 'OPT-1' },
      { id: 'soc1-science', number: 2, name: 'Sociology as Science', description: 'Positivism and its critique, non-positivist methodologies, fact, value and objectivity.', paperCode: 'OPT-1' },
      { id: 'soc1-thinkers', number: 3, name: 'Research Methods and Sociological Thinkers', description: 'Marx, Durkheim, Weber, Parsons, Merton, Mead — theoretical frameworks and contributions.', paperCode: 'OPT-1' },
      { id: 'soc1-stratification', number: 4, name: 'Stratification and Mobility', description: 'Concepts, theories of social stratification (structural-functional, Marxist, Weberian), social mobility.', paperCode: 'OPT-1' },
      { id: 'soc1-work-econ', number: 5, name: 'Works and Economic Life', description: 'Social organization of work in different types of society, formal and informal organization of work.', paperCode: 'OPT-1' },
      { id: 'soc1-politics', number: 6, name: 'Politics and Society', description: 'Sociological theories of power, power elite, bureaucracy, pressure groups and political parties.', paperCode: 'OPT-1' },
      { id: 'soc1-religion', number: 7, name: 'Religion and Society', description: 'Sociological theories of religion, religious practices, animism, monotheism, sects and secularization.', paperCode: 'OPT-1' },
      { id: 'soc1-systems', number: 8, name: 'Systems of Kinship', description: 'Family, household, marriage, lineage, descent, types of kinship systems and contemporary trends.', paperCode: 'OPT-1' },
      { id: 'soc1-social-change', number: 9, name: 'Social Change in Modern Society', description: 'Sociological theories of social change, development, dependency, agents of social change.', paperCode: 'OPT-1' },
    ],
    paper2Topics: [
      { id: 'soc2-perspectives', number: 1, name: 'Perspectives on the Study of Indian Society', description: 'Indology (Ghurye), Structural-functionalism (Srinivas), Marxist sociology (Desai).', paperCode: 'OPT-2' },
      { id: 'soc2-caste', number: 2, name: 'Caste System', description: 'Perspectives on the study of caste, features of caste, untouchability, caste conflicts and politics.', paperCode: 'OPT-2' },
      { id: 'soc2-tribal', number: 3, name: 'Tribal Communities in India', description: 'Definitional problems, geographical spread, colonial policies and issues of integration.', paperCode: 'OPT-2' },
      { id: 'soc2-classes', number: 4, name: 'Social Classes in India', description: 'Agrarian class structure, industrial class structure, middle classes in India.', paperCode: 'OPT-2' },
      { id: 'soc2-kinship', number: 5, name: 'Systems of Kinship in India', description: 'Lineage and descent, types of kinship systems, family and marriage in India, patriarchy.', paperCode: 'OPT-2' },
      { id: 'soc2-religion-ind', number: 6, name: 'Religion and Society in India', description: 'Religious communities, problems of religious minorities, communalism and secularism.', paperCode: 'OPT-2' },
      { id: 'soc2-rural-trans', number: 7, name: 'Rural and Agrarian Transformation in India', description: 'Land reforms, Green revolution, rural labor, bonded labor, migration and agrarian crisis.', paperCode: 'OPT-2' },
      { id: 'soc2-industrial-ind', number: 8, name: 'Industrialization and Urbanization in India', description: 'Evolution of modern industry, growth of urban settlements, slums, working class.', paperCode: 'OPT-2' },
      { id: 'soc2-politics-ind', number: 9, name: 'Politics and Society in India', description: 'Nation, democracy, citizenship, political parties, pressure groups and regionalism.', paperCode: 'OPT-2' },
      { id: 'soc2-movements', number: 10, name: 'Social Movements in Modern India', description: 'Peasant movements, women\'s movement, backward classes movements, environmental movements.', paperCode: 'OPT-2' },
    ],
  },
  {
    id: 'public-administration',
    name: 'Public Administration',
    code: 'PUBAD',
    paper1Topics: [
      { id: 'pub1-intro', number: 1, name: 'Introduction to Public Administration', description: 'Meaning, scope, significance, Wilson\'s vision, evolution and New Public Administration.', paperCode: 'OPT-1' },
      { id: 'pub1-theories', number: 2, name: 'Administrative Thought', description: 'Taylor, Fayol, Weber, Follett, Elton Mayo, Chester Barnard, Herbert Simon, Riggs, Likert.', paperCode: 'OPT-1' },
      { id: 'pub1-behaviour', number: 3, name: 'Administrative Behaviour', description: 'Decision making, communication, leadership theories, theories of motivation (Maslow, Herzberg).', paperCode: 'OPT-1' },
      { id: 'pub1-organisations', number: 4, name: 'Organisations', description: 'Theories, systems, human relations, structures and forms: ministries, departments, corporations.', paperCode: 'OPT-1' },
      { id: 'pub1-accountability', number: 5, name: 'Accountability and Control', description: 'Legislative, executive and judicial control over administration, citizen and administration.', paperCode: 'OPT-1' },
      { id: 'pub1-admin-law', number: 6, name: 'Administrative Law', description: 'Meaning, scope, significance, delegated legislation, administrative tribunals, dicey on rule of law.', paperCode: 'OPT-1' },
      { id: 'pub1-comp-admin', number: 7, name: 'Comparative Public Administration', description: 'Historical, sociological and ecological factors in administrative systems, Riggsian models.', paperCode: 'OPT-1' },
      { id: 'pub1-dev-dynamics', number: 8, name: 'Development Dynamics', description: 'Concept of development, changing profile of development administration, anti-development thesis.', paperCode: 'OPT-1' },
      { id: 'pub1-personnel', number: 9, name: 'Personnel Administration', description: 'Importance of human resource development, recruitment, training, career advancement, performance appraisal.', paperCode: 'OPT-1' },
      { id: 'pub1-public-policy', number: 10, name: 'Public Policy', description: 'Models of policy-making and their critique, processes of conceptualization, planning, implementation.', paperCode: 'OPT-1' },
      { id: 'pub1-financial', number: 11, name: 'Financial Administration', description: 'Budget, budgetary process, performance and program budgeting, accounting, audit and CAG.', paperCode: 'OPT-1' },
    ],
    paper2Topics: [
      { id: 'pub2-evolution', number: 1, name: 'Evolution of Indian Administration', description: 'Kautilya, Mughal administration, British legacy, administrative developments since independence.', paperCode: 'OPT-2' },
      { id: 'pub2-const-framework', number: 2, name: 'Philosophical and Constitutional Framework of Government', description: 'Salient features, value premises, constitutionalism, political culture, bureaucracy and democracy.', paperCode: 'OPT-2' },
      { id: 'pub2-public-sector', number: 3, name: 'Public Sector Undertakings', description: 'Public sector in modern India, forms of management, problems of autonomy, accountability and disinvestment.', paperCode: 'OPT-2' },
      { id: 'pub2-union-gov', number: 4, name: 'Union Government and Administration', description: 'Executive, Parliament, Cabinet secretariat, PMO, Central Secretariat, ministries and departments.', paperCode: 'OPT-2' },
      { id: 'pub2-plans-priority', number: 5, name: 'Plans and Priorities', description: 'Machinery of planning, role of NITI Aayog, indicative planning, decentralised planning.', paperCode: 'OPT-2' },
      { id: 'pub2-state-admin', number: 6, name: 'State Government and Administration', description: 'Governor, Chief Minister, Council of Ministers, Chief Secretary, State Secretariat, Directorates.', paperCode: 'OPT-2' },
      { id: 'pub2-district-admin', number: 7, name: 'District Administration since Independence', description: 'Role of District Collector, law and order, developmental role, relationship with local bodies.', paperCode: 'OPT-2' },
      { id: 'pub2-civil-services', number: 8, name: 'Civil Services in India', description: 'Structure, recruitment, training, neutral vs committed bureaucracy, lateral entry and reforms.', paperCode: 'OPT-2' },
      { id: 'pub2-financial-mgmt', number: 9, name: 'Financial Management', description: 'Budgeting, parliamentary control over finance, Public Accounts Committee, Estimates Committee, CAG.', paperCode: 'OPT-2' },
      { id: 'pub2-law-order', number: 10, name: 'Law and Order Administration', description: 'Police administration, role of central police forces, criminalization of politics, police reforms.', paperCode: 'OPT-2' },
      { id: 'pub2-issues-admin', number: 11, name: 'Significant Issues in Indian Administration', description: 'Values in public service, corruption, citizen administration interface, disaster management and e-governance.', paperCode: 'OPT-2' },
    ],
  },
  {
    id: 'anthropology',
    name: 'Anthropology',
    code: 'ANTH',
    paper1Topics: [
      { id: 'anth1-meaning', number: 1, name: 'Meaning, Scope and Development of Anthropology', description: 'Relationships with other disciplines, main branches of anthropology, holism and comparative approach.', paperCode: 'OPT-1' },
      { id: 'anth1-evolution', number: 2, name: 'Human Evolution and Paleontology', description: 'Theories of evolution, primate adaptations, hominid fossils (Australopithecus, Homo erectus, Neanderthal).', paperCode: 'OPT-1' },
      { id: 'anth1-genetics', number: 3, name: 'Human Genetics and Population Variation', description: 'Mendelian genetics, genetic polymorphism, DNA technology in forensics and racial classifications.', paperCode: 'OPT-1' },
      { id: 'anth1-culture', number: 4, name: 'The Concept of Culture and Society', description: 'Culture, civilization, ethnocentrism, cultural relativism, social institutions and stratification.', paperCode: 'OPT-1' },
      { id: 'anth1-marriage-family', number: 5, name: 'Marriage, Family and Kinship', description: 'Types of marriage, family functions, kinship descent, terminology and alliance theory.', paperCode: 'OPT-1' },
      { id: 'anth1-theories', number: 6, name: 'Anthropological Theories', description: 'Evolutionism, diffusionism, historical particularism, functionalism, structuralism, culture and personality.', paperCode: 'OPT-1' },
    ],
    paper2Topics: [
      { id: 'anth2-evolution-ind', number: 1, name: 'Evolution of the Indian Culture and Civilization', description: 'Prehistoric cultures (Paleolithic, Mesolithic, Neolithic), Indus Valley, Vedic culture and epics.', paperCode: 'OPT-2' },
      { id: 'anth2-demographic', number: 2, name: 'Demographic Profile of India', description: 'Ethnic and linguistic elements in the Indian population, scheduled castes and scheduled tribes.', paperCode: 'OPT-2' },
      { id: 'anth2-caste', number: 3, name: 'The Caste System in India', description: 'Varna and Jati, dominant caste, Sanskritization, Westernization, modernization and changes.', paperCode: 'OPT-2' },
      { id: 'anth2-tribes', number: 4, name: 'Tribal Situation in India', description: 'Biogenetic variability, linguistic and socio-economic characteristics of tribal populations, problems of tribal communities.', paperCode: 'OPT-2' },
      { id: 'anth2-tribal-dev', number: 5, name: 'Tribal Development and Administration', description: 'Constitutional safeguards, tribal sub-plan, role of anthropology in tribal and rural development.', paperCode: 'OPT-2' },
    ],
  },
  {
    id: 'economics',
    name: 'Economics',
    code: 'ECON',
    paper1Topics: [
      { id: 'econ1-micro', number: 1, name: 'Advanced Microeconomics', description: 'Consumer behavior, theory of production and costs, market structures, welfare economics.', paperCode: 'OPT-1' },
      { id: 'econ1-macro', number: 2, name: 'Advanced Macroeconomics', description: 'National income accounting, classical and Keynesian models, IS-LM framework, inflation.', paperCode: 'OPT-1' },
      { id: 'econ1-money', number: 3, name: 'Money, Banking and Finance', description: 'Demand for and supply of money, monetary policy, central banking, financial markets.', paperCode: 'OPT-1' },
      { id: 'econ1-trade', number: 4, name: 'International Economics', description: 'Theories of international trade, terms of trade, balance of payments, exchange rates, WTO.', paperCode: 'OPT-1' },
      { id: 'econ1-growth', number: 5, name: 'Growth and Development', description: 'Theories of economic growth (Harrod-Domar, Solow, Lewis), human capital, poverty and inequality.', paperCode: 'OPT-1' },
    ],
    paper2Topics: [
      { id: 'econ2-pre-ind', number: 1, name: 'Indian Economy in Pre-Independence Era', description: 'Colonial economic impact, land systems, drain of wealth, commercialization of agriculture.', paperCode: 'OPT-2' },
      { id: 'econ2-post-ind', number: 2, name: 'Indian Economy in Post-Independence Era', description: 'Planning era, Nehruvian socialism, 1991 economic reforms, privatization, globalization.', paperCode: 'OPT-2' },
      { id: 'econ2-sectors', number: 3, name: 'Agricultural and Industrial Sectors', description: 'Agricultural pricing, food security, industrial policy, MSMEs, infrastructure development.', paperCode: 'OPT-2' },
      { id: 'econ2-external', number: 4, name: 'External Sector and Public Finance', description: 'Foreign trade trends, FDI, FII, fiscal policy, GST, Finance Commission and debt sustainability.', paperCode: 'OPT-2' },
    ],
  },
  { id: 'agriculture', name: 'Agriculture', code: 'AGRI', paper1Topics: [], paper2Topics: [] },
  { id: 'animal-husbandry', name: 'Animal Husbandry and Veterinary Science', code: 'AHVS', paper1Topics: [], paper2Topics: [] },
  { id: 'botany', name: 'Botany', code: 'BOT', paper1Topics: [], paper2Topics: [] },
  { id: 'chemistry', name: 'Chemistry', code: 'CHEM', paper1Topics: [], paper2Topics: [] },
  { id: 'civil-engineering', name: 'Civil Engineering', code: 'CE', paper1Topics: [], paper2Topics: [] },
  { id: 'commerce', name: 'Commerce and Accountancy', code: 'COMM', paper1Topics: [], paper2Topics: [] },
  { id: 'electrical-engineering', name: 'Electrical Engineering', code: 'EE', paper1Topics: [], paper2Topics: [] },
  { id: 'geology', name: 'Geology', code: 'GEOL', paper1Topics: [], paper2Topics: [] },
  { id: 'law', name: 'Law', code: 'LAW', paper1Topics: [], paper2Topics: [] },
  { id: 'management', name: 'Management', code: 'MGMT', paper1Topics: [], paper2Topics: [] },
  { id: 'mathematics', name: 'Mathematics', code: 'MATH', paper1Topics: [], paper2Topics: [] },
  { id: 'mechanical-engineering', name: 'Mechanical Engineering', code: 'ME', paper1Topics: [], paper2Topics: [] },
  { id: 'medical-science', name: 'Medical Science', code: 'MED', paper1Topics: [], paper2Topics: [] },
  { id: 'philosophy', name: 'Philosophy', code: 'PHIL', paper1Topics: [], paper2Topics: [] },
  { id: 'physics', name: 'Physics', code: 'PHYS', paper1Topics: [], paper2Topics: [] },
  { id: 'psychology', name: 'Psychology', code: 'PSYCH', paper1Topics: [], paper2Topics: [] },
  { id: 'statistics', name: 'Statistics', code: 'STAT', paper1Topics: [], paper2Topics: [] },
  { id: 'zoology', name: 'Zoology', code: 'ZOOL', paper1Topics: [], paper2Topics: [] },
];

// ── 4. OFFICIAL 22 EIGHTH SCHEDULE LANGUAGES ───────────────────

export const UPSC_INDIAN_LANGUAGES = [
  'Assamese', 'Bengali', 'Bodo', 'Dogri', 'Gujarati', 'Hindi',
  'Kannada', 'Kashmiri', 'Konkani', 'Maithili', 'Malayalam', 'Manipuri',
  'Marathi', 'Nepali', 'Odia', 'Punjabi', 'Sanskrit', 'Santhali',
  'Sindhi', 'Tamil', 'Telugu', 'Urdu',
];

// ── 5. PERSONALITY TEST / INTERVIEW SECTIONS ───────────────────

export const UPSC_INTERVIEW_SECTIONS: UpscInterviewSection[] = [
  { id: 'int-daf-summary', number: 1, name: 'DAF-Based Questions', description: 'Comprehensive interrogation of Detailed Application Form: hometown, hobbies, service preferences and achievements.', category: 'DAF' },
  { id: 'int-personal-bg', number: 2, name: 'Personal Background', description: 'Family origin, schooling, extracurricular milestones, personal values and formative experiences.', category: 'DAF' },
  { id: 'int-education', number: 3, name: 'Educational Background', description: 'Undergraduate discipline, university projects, academic choices and application of graduation skills in administration.', category: 'DAF' },
  { id: 'int-hometown', number: 4, name: 'Home State and District Profile', description: 'Socio-economic challenges, cultural heritage, industrial hubs, demographic dynamics and local governance of your home district.', category: 'DAF' },
  { id: 'int-current-affairs', number: 5, name: 'Current Affairs & Hot Topics', description: 'Daily editorial analysis, judicial verdicts, government initiatives, legislative bills and national debates.', category: 'AWARENESS' },
  { id: 'int-national-issues', number: 6, name: 'National Issues', description: 'Federal friction points, economic policies, electoral reforms, internal security and social cohesion.', category: 'AWARENESS' },
  { id: 'int-int-relations', number: 7, name: 'International Relations', description: 'India foreign policy stance, global conflicts, bilateral diplomacy, WTO/UN positions and trade agreements.', category: 'AWARENESS' },
  { id: 'int-gov-policies', number: 8, name: 'Government Policies & Schemes', description: 'Critical evaluation of flagship programs, delivery mechanisms, implementation hurdles and reform pathways.', category: 'AWARENESS' },
  { id: 'int-situational', number: 9, name: 'Situational & Crisis Questions', description: 'On-the-spot administrative emergency scenarios: communal clash, disaster relief, mob management and law and order.', category: 'SITUATIONAL' },
  { id: 'int-ethical-dilemmas', number: 10, name: 'Ethical Dilemmas', description: 'Testing moral courage, public interest vs executive pressure, whistleblowing and integrity under duress.', category: 'SITUATIONAL' },
  { id: 'int-opinions', number: 11, name: 'Opinion-Based Questions', description: 'Articulating balanced, reasoned, constitutionally sound viewpoints on contentious national topics.', category: 'SITUATIONAL' },
  { id: 'int-mock-practice', number: 12, name: 'Mock Interview Practice Workspace', description: 'Structured practice simulator with timer, answer note taking, self-assessment and feedback metrics.', category: 'PRACTICE' },
];

// ── 6. HELPER SELECTORS ────────────────────────────────────────

export function getUpscPaperById(paperId: string): UpscPaper | null {
  const allPapers = [...UPSC_PRELIMS_PAPERS, ...UPSC_MAINS_PAPERS];
  return allPapers.find((p) => p.id === paperId) || null;
}

export function getUpscOptionalSubject(subjectId: string): UpscOptionalSubject | null {
  return UPSC_OPTIONAL_SUBJECTS.find((s) => s.id === subjectId) || null;
}

