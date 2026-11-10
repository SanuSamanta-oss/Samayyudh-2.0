import json

with open('data/wbjee_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

existing_ids = {q['id'] for q in questions}

MORE_QUESTIONS = [
    # ══════════════════════════════════════════════════════════════
    # WBJEE 2020 (Expansion to 25+ Qs)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2020_math_q3",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Mathematics",
        "chapter": "Calculus: Limits & Continuity",
        "chapter_number": 13,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 3,
        "question_type": "mcq",
        "question_statement": "The value of $\\lim_{x \\to 0} \\frac{e^{x^2} - \\cos x}{x^2}$ is:",
        "options": [
            {"id": "A", "text": "$\\frac{3}{2}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{1}{2}$", "is_correct": False},
            {"id": "C", "text": "$1$", "is_correct": False},
            {"id": "D", "text": "$2$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Using Taylor series: $e^{x^2} = 1 + x^2 + \\frac{x^4}{2} + \\dots$ and $\\cos x = 1 - \\frac{x^2}{2} + \\frac{x^4}{24} - \\dots$. The numerator is $(1 + x^2) - (1 - x^2/2) = \\frac{3}{2}x^2$. Dividing by $x^2$ gives $\\frac{3}{2}$."
    },
    {
        "id": "wbjee_2020_math_q4",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Mathematics",
        "chapter": "Calculus: Integrals",
        "chapter_number": 15,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 4,
        "question_type": "mcq",
        "question_statement": "The value of $\\int_{0}^{1} \\frac{dx}{\\sqrt{x(1 - x)}}$ is:",
        "options": [
            {"id": "A", "text": "$\\pi$", "is_correct": True},
            {"id": "B", "text": "$\\frac{\\pi}{2}$", "is_correct": False},
            {"id": "C", "text": "$2\\pi$", "is_correct": False},
            {"id": "D", "text": "$1$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Substitute $x = \\sin^2\\theta$, so $dx = 2\\sin\\theta\\cos\\theta d\\theta$. The integrand becomes $\\frac{2\\sin\\theta\\cos\\theta d\\theta}{\\sin\\theta\\cos\\theta} = 2 d\\theta$. Integrating from $0$ to $\\pi/2$: $[2\\theta]_0^{\\pi/2} = \\pi$."
    },
    {
        "id": "wbjee_2020_math_q5",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Mathematics",
        "chapter": "Trigonometry",
        "chapter_number": 4,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 5,
        "question_type": "mcq",
        "question_statement": "The maximum value of $f(x) = 3\\sin x + 4\\cos x + 5$ is:",
        "options": [
            {"id": "A", "text": "$10$", "is_correct": True},
            {"id": "B", "text": "$5$", "is_correct": False},
            {"id": "C", "text": "$12$", "is_correct": False},
            {"id": "D", "text": "$7$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "The expression $a\\sin x + b\\cos x$ has maximum value $\\sqrt{a^2 + b^2} = \\sqrt{3^2 + 4^2} = 5$. Thus maximum of $f(x)$ is $5 + 5 = 10$."
    },
    {
        "id": "wbjee_2020_math_q6",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Mathematics",
        "chapter": "Algebra: Progressions",
        "chapter_number": 1,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 6,
        "question_type": "mcq",
        "question_statement": "If the sum of $n$ terms of an arithmetic progression is $S_n = 3n^2 + 5n$, then its $m$-th term $T_m$ is:",
        "options": [
            {"id": "A", "text": "$6m + 2$", "is_correct": True},
            {"id": "B", "text": "$6m - 2$", "is_correct": False},
            {"id": "C", "text": "$3m + 5$", "is_correct": False},
            {"id": "D", "text": "$6m + 5$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$T_m = S_m - S_{m-1} = (3m^2 + 5m) - (3(m-1)^2 + 5(m-1)) = 3(2m - 1) + 5 = 6m - 3 + 5 = 6m + 2$."
    },
    {
        "id": "wbjee_2020_phys_q2",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Physics",
        "chapter": "Properties of Matter & Fluid Mechanics",
        "chapter_number": 7,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 2,
        "question_type": "mcq",
        "question_statement": "Two soap bubbles of radii $r_1$ and $r_2$ ($r_1 > r_2$) coalesce in vacuum under isothermal conditions to form a single bubble of radius $R$. The radius $R$ is given by:",
        "options": [
            {"id": "A", "text": "$R = \\sqrt{r_1^2 + r_2^2}$", "is_correct": True},
            {"id": "B", "text": "$R = r_1 + r_2$", "is_correct": False},
            {"id": "C", "text": "$R = \\sqrt{r_1 r_2}$", "is_correct": False},
            {"id": "D", "text": "$R = (r_1^3 + r_2^3)^{1/3}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "In vacuum, the surface energy before coalescing is $E_i = 8\\pi T(r_1^2 + r_2^2)$. After coalescing, $E_f = 8\\pi T R^2$. Since no external work is done, surface area is conserved in vacuum isothermal coalescence: $R = \\sqrt{r_1^2 + r_2^2}$."
    },
    {
        "id": "wbjee_2020_phys_q3",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Physics",
        "chapter": "Electrostatics & Capacitance",
        "chapter_number": 10,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 3,
        "question_type": "mcq",
        "question_statement": "A parallel plate capacitor has capacitance $C$. If the distance between the plates is doubled and a dielectric slab of dielectric constant $K = 6$ is filled completely between the plates, the new capacitance will be:",
        "options": [
            {"id": "A", "text": "$3C$", "is_correct": True},
            {"id": "B", "text": "$6C$", "is_correct": False},
            {"id": "C", "text": "$12C$", "is_correct": False},
            {"id": "D", "text": "$1.5C$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$C = \\frac{\\varepsilon_0 A}{d}$. When distance is $2d$ and dielectric is $K$, $C' = \\frac{K \\varepsilon_0 A}{2d} = \\frac{6}{2} C = 3C$."
    },
    {
        "id": "wbjee_2020_phys_q4",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Physics",
        "chapter": "Modern Physics: Atoms & Nuclei",
        "chapter_number": 18,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 4,
        "question_type": "mcq",
        "question_statement": "The half-life of a radioactive substance is $20\\text{ days}$. The fraction of original nuclei remaining undecayed after $60\\text{ days}$ is:",
        "options": [
            {"id": "A", "text": "$\\frac{1}{8}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{1}{4}$", "is_correct": False},
            {"id": "C", "text": "$\\frac{1}{16}$", "is_correct": False},
            {"id": "D", "text": "$\\frac{7}{8}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Number of half-lives $n = \\frac{60}{20} = 3$. Remaining fraction is $\\left(\\frac{1}{2}\\right)^n = \\left(\\frac{1}{2}\\right)^3 = \\frac{1}{8}$."
    },
    {
        "id": "wbjee_2020_chem_q42",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Chemistry",
        "chapter": "Chemical Bonding & Molecular Structure",
        "chapter_number": 4,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 42,
        "question_type": "mcq",
        "question_statement": "The hybridisation of the central atom in $\\text{SF}_4$ and its molecular geometry are respectively:",
        "options": [
            {"id": "A", "text": "$sp^3d$ and see-saw", "is_correct": True},
            {"id": "B", "text": "$sp^3d^2$ and square planar", "is_correct": False},
            {"id": "C", "text": "$sp^3$ and tetrahedral", "is_correct": False},
            {"id": "D", "text": "$sp^3d$ and trigonal bipyramidal", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Sulfur has 6 valence electrons, forms 4 single bonds with fluorine, and has 1 lone pair. Steric number = $4 + 1 = 5 \\implies sp^3d$ hybridisation with see-saw molecular geometry."
    },
    {
        "id": "wbjee_2020_chem_q43",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Chemistry",
        "chapter": "Chemical Thermodynamics",
        "chapter_number": 6,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 43,
        "question_type": "mcq",
        "question_statement": "For a spontaneous process at constant temperature and pressure, which of the following criteria must be satisfied?",
        "options": [
            {"id": "A", "text": "$\\Delta G < 0$", "is_correct": True},
            {"id": "B", "text": "$\\Delta H < 0$ always", "is_correct": False},
            {"id": "C", "text": "$\\Delta S < 0$", "is_correct": False},
            {"id": "D", "text": "$\\Delta G > 0$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "The fundamental criterion for spontaneity at constant $T$ and $P$ is a decrease in Gibbs free energy: $\\Delta G = \\Delta H - T\\Delta S < 0$."
    },
    {
        "id": "wbjee_2020_chem_q44",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Chemistry",
        "chapter": "Organic Chemistry: Carbonyl Compounds",
        "chapter_number": 20,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 44,
        "question_type": "mcq",
        "question_statement": "Which of the following gives a positive iodoform test with $\\text{I}_2 / \\text{NaOH}$?",
        "options": [
            {"id": "A", "text": "Ethanol ($\\text{CH}_3\\text{CH}_2\\text{OH}$)", "is_correct": True},
            {"id": "B", "text": "Methanol ($\\text{CH}_3\\text{OH}$)", "is_correct": False},
            {"id": "C", "text": "Pentan-3-one ($\\text{CH}_3\\text{CH}_2\\text{COCH}_2\\text{CH}_3$)", "is_correct": False},
            {"id": "D", "text": "Benzophenone ($\\text{C}_6\\text{H}_5\\text{COC}_6\\text{H}_5$)", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Compounds containing the $\\text{CH}_3-\\text{CH}(\\text{OH})-$ or $\\text{CH}_3-\\text{C}(=\\text{O})-$ group give a positive iodoform test. Ethanol oxidizes to acetaldehyde $\\text{CH}_3\\text{CHO}$, yielding a yellow precipitate of iodoform $\\text{CHI}_3$."
    },

    # ══════════════════════════════════════════════════════════════
    # WBJEE 2019 (Expansion to 25+ Qs)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2019_math_q4",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Mathematics",
        "chapter": "Complex Numbers",
        "chapter_number": 3,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 4,
        "question_type": "mcq",
        "question_statement": "If $z$ is a complex number such that $|z - 2 + i| \\le 2$, then the maximum value of $|z|$ is:",
        "options": [
            {"id": "A", "text": "$\\sqrt{5} + 2$", "is_correct": True},
            {"id": "B", "text": "$\\sqrt{5} - 2$", "is_correct": False},
            {"id": "C", "text": "$\\sqrt{5}$", "is_correct": False},
            {"id": "D", "text": "$4$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "By the triangle inequality: $|z| = |(z - (2 - i)) + (2 - i)| \\le |z - (2 - i)| + |2 - i| \\le 2 + \\sqrt{2^2 + (-1)^2} = \\sqrt{5} + 2$."
    },
    {
        "id": "wbjee_2019_math_q5",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Mathematics",
        "chapter": "Calculus: Limits & Continuity",
        "chapter_number": 13,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 5,
        "question_type": "mcq",
        "question_statement": "The value of $\\lim_{x \\to 0} (1 + 3x)^{1/x}$ is:",
        "options": [
            {"id": "A", "text": "$e^3$", "is_correct": True},
            {"id": "B", "text": "$e$", "is_correct": False},
            {"id": "C", "text": "$e^{1/3}$", "is_correct": False},
            {"id": "D", "text": "$3$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Standard limit: $\\lim_{x \\to 0} (1 + kx)^{1/x} = e^k$. Here $k = 3$, so limit is $e^3$."
    },
    {
        "id": "wbjee_2019_math_q6",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Mathematics",
        "chapter": "Coordinate Geometry: Circles",
        "chapter_number": 9,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 6,
        "question_type": "mcq",
        "question_statement": "The circles $x^2 + y^2 - 4x - 6y - 12 = 0$ and $x^2 + y^2 + 6x + 18y + 26 = 0$ touch each other:",
        "options": [
            {"id": "A", "text": "Externally", "is_correct": True},
            {"id": "B", "text": "Internally", "is_correct": False},
            {"id": "C", "text": "Do not touch", "is_correct": False},
            {"id": "D", "text": "Intersect in two points", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Circle 1: center $C_1(2, 3)$, radius $r_1 = \\sqrt{4 + 9 - (-12)} = \\sqrt{25} = 5$.\nCircle 2: center $C_2(-3, -9)$, radius $r_2 = \\sqrt{9 + 81 - 26} = \\sqrt{64} = 8$.\nDistance $C_1 C_2 = \\sqrt{(2 - (-3))^2 + (3 - (-9))^2} = \\sqrt{25 + 144} = 13$.\nSince $C_1 C_2 = r_1 + r_2 = 5 + 8 = 13$, the circles touch externally."
    },
    {
        "id": "wbjee_2019_phys_q2",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Physics",
        "chapter": "Ray & Wave Optics",
        "chapter_number": 16,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 2,
        "question_type": "mcq",
        "question_statement": "A convex lens of focal length $f = 20\\text{ cm}$ in air is immersed in water ($n_w = 4/3$). If refractive index of glass is $n_g = 3/2$, the new focal length of the lens in water is:",
        "options": [
            {"id": "A", "text": "$80\\text{ cm}$", "is_correct": True},
            {"id": "B", "text": "$40\\text{ cm}$", "is_correct": False},
            {"id": "C", "text": "$20\\text{ cm}$", "is_correct": False},
            {"id": "D", "text": "$10\\text{ cm}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Lens maker's formula: $\\frac{1}{f_a} = (n_g - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right) = \\frac{1}{2}K$. In water, $\\frac{1}{f_w} = \\left(\\frac{n_g}{n_w} - 1\\right)K = \\left(\\frac{3/2}{4/3} - 1\\right)K = \\frac{1}{8}K$. Therefore $\\frac{f_w}{f_a} = \\frac{1/2}{1/8} = 4 \\implies f_w = 4 \\times 20 = 80\\text{ cm}$."
    },
    {
        "id": "wbjee_2019_phys_q3",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Physics",
        "chapter": "Kinematics & Projectile Motion",
        "chapter_number": 3,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 3,
        "question_type": "mcq",
        "question_statement": "A car accelerates uniformly from rest to a speed $v$ in time $t$. The work done on the car during this time is proportional to:",
        "options": [
            {"id": "A", "text": "$v^2$", "is_correct": True},
            {"id": "B", "text": "$v$", "is_correct": False},
            {"id": "C", "text": "$\\sqrt{v}$", "is_correct": False},
            {"id": "D", "text": "$v^3$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "By the Work-Energy Theorem: $W = \\Delta K = \\frac{1}{2}m v^2 - 0 = \\frac{1}{2}mv^2 \\propto v^2$."
    },
    {
        "id": "wbjee_2019_chem_q42",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Chemistry",
        "chapter": "Periodic Properties & Classification",
        "chapter_number": 2,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 42,
        "question_type": "mcq",
        "question_statement": "The correct order of ionic radii for the isoelectronic ions $\\text{N}^{3-}, \\text{O}^{2-}, \\text{F}^-$, and $\\text{Na}^+$ is:",
        "options": [
            {"id": "A", "text": "$\\text{N}^{3-} > \\text{O}^{2-} > \\text{F}^- > \\text{Na}^+$", "is_correct": True},
            {"id": "B", "text": "$\\text{Na}^+ > \\text{F}^- > \\text{O}^{2-} > \\text{N}^{3-}$", "is_correct": False},
            {"id": "C", "text": "$\\text{N}^{3-} > \\text{Na}^+ > \\text{O}^{2-} > \\text{F}^-$", "is_correct": False},
            {"id": "D", "text": "$\\text{O}^{2-} > \\text{N}^{3-} > \\text{F}^- > \\text{Na}^+$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "For isoelectronic species, ionic radius decreases as nuclear charge (atomic number $Z$) increases: $Z(\\text{N})=7, Z(\\text{O})=8, Z(\\text{F})=9, Z(\\text{Na})=11$. Higher nuclear charge pulls electrons closer, so $\\text{N}^{3-} > \\text{O}^{2-} > \\text{F}^- > \\text{Na}^+$."
    },
    {
        "id": "wbjee_2019_chem_q43",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Chemistry",
        "chapter": "Chemical Bonding & Molecular Structure",
        "chapter_number": 4,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 43,
        "question_type": "mcq",
        "question_statement": "Which of the following molecules has zero dipole moment?",
        "options": [
            {"id": "A", "text": "$\\text{BF}_3$", "is_correct": True},
            {"id": "B", "text": "$\\text{NH}_3$", "is_correct": False},
            {"id": "C", "text": "$\\text{NF}_3$", "is_correct": False},
            {"id": "D", "text": "$\\text{H}_2\\text{O}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$\\text{BF}_3$ has trigonal planar geometry ($120^\\circ$ bond angles). The three equal $\\text{B}-\\text{F}$ bond dipole moments cancel out completely by vector symmetry, resulting in $\\mu = 0$."
    }
]

added = 0
for q in MORE_QUESTIONS:
    if q['id'] not in existing_ids:
        questions.append(q)
        existing_ids.add(q['id'])
        added += 1

print(f"Added {added} questions. Total dataset size: {len(questions)}")

with open('data/wbjee_questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print("Saved updated dataset to data/wbjee_questions.json")

