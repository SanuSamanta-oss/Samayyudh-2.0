import json

with open('data/wbjee_questions.json', 'r', encoding='utf-8') as f:
    existing = json.load(f)

print(f"Loaded {len(existing)} existing questions. Appending verified WBJEE paper items...")

MORE_QUESTIONS = [
    # ── Mathematics: Algebra & Calculus ──────────────────────────
    {
        "id": "wbjee_2023_math_q3",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Quadratic Equations & Polynomials",
        "chapter_number": 2,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 3,
        "question_type": "mcq",
        "question_statement": "If $\\alpha$ and $\\beta$ are the roots of the quadratic equation $x^2 - 2x + 4 = 0$, then the value of $\\alpha^n + \\beta^n$ is:",
        "options": [
            {"id": "A", "text": "$2^{n+1} \\cos\\left(\\frac{n\\pi}{3}\\right)$", "is_correct": True},
            {"id": "B", "text": "$2^n \\cos\\left(\\frac{n\\pi}{3}\\right)$", "is_correct": False},
            {"id": "C", "text": "$2^{n+1} \\sin\\left(\\frac{n\\pi}{3}\\right)$", "is_correct": False},
            {"id": "D", "text": "$2^n \\sin\\left(\\frac{n\\pi}{3}\\right)$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$x^2 - 2x + 4 = 0 \\implies x = 1 \\pm i\\sqrt{3} = 2\\left(\\cos\\frac{\\pi}{3} \\pm i\\sin\\frac{\\pi}{3}\\right)$. By De Moivre's theorem, $\\alpha^n + \\beta^n = 2^n \\left[2\\cos\\left(\\frac{n\\pi}{3}\\right)\\right] = 2^{n+1}\\cos\\left(\\frac{n\\pi}{3}\\right)$."
    },
    {
        "id": "wbjee_2023_math_q15",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Calculus: Differentiation",
        "chapter_number": 14,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 15,
        "question_type": "mcq",
        "question_statement": "If $y = (\\sin x)^{\\ln x}$, then $\\frac{dy}{dx}$ at $x = \\frac{\\pi}{2}$ is equal to:",
        "options": [
            {"id": "A", "text": "$0$", "is_correct": True},
            {"id": "B", "text": "$1$", "is_correct": False},
            {"id": "C", "text": "$\\ln\\left(\\frac{\\pi}{2}\\right)$", "is_correct": False},
            {"id": "D", "text": "$\\frac{2}{\\pi}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Taking logarithms: $\\ln y = \\ln x \\cdot \\ln(\\sin x)$. Differentiating gives $\\frac{1}{y}\\frac{dy}{dx} = \\frac{1}{x}\\ln(\\sin x) + \\ln x \\cdot \\cot x$. At $x = \\frac{\\pi}{2}$, $\\sin(\\pi/2) = 1 \\implies \\ln(\\sin(\\pi/2)) = 0$, and $\\cot(\\pi/2) = 0$. Since $y = 1^0 = 1$, $\\frac{dy}{dx} = 1(0 + 0) = 0$."
    },
    {
        "id": "wbjee_2023_math_q52",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Calculus: Integrals",
        "chapter_number": 15,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 52,
        "question_type": "mcq",
        "question_statement": "The value of $\\int_{0}^{1} x \\sqrt{\\frac{1 - x^2}{1 + x^2}} \\, dx$ is:",
        "options": [
            {"id": "A", "text": "$\\frac{\\pi - 2}{4}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{\\pi + 2}{4}$", "is_correct": False},
            {"id": "C", "text": "$\\frac{\\pi - 1}{4}$", "is_correct": False},
            {"id": "D", "text": "$\\frac{\\pi - 2}{2}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Substitute $x^2 = \\cos 2\\theta$, so $2x dx = -2\\sin 2\\theta d\\theta \\implies x dx = -\\sin 2\\theta d\\theta$. The integrand becomes $\\sqrt{\\frac{1 - \\cos 2\\theta}{1 + \\cos 2\\theta}} = \\tan\\theta$. Thus $I = \\int_0^{\\pi/4} \\tan\\theta \\cdot \\sin 2\\theta d\\theta = 2\\int_0^{\\pi/4} \\sin^2\\theta d\\theta = \\int_0^{\\pi/4} (1 - \\cos 2\\theta) d\\theta = \\left[\\theta - \\frac{\\sin 2\\theta}{2}\\right]_0^{\\pi/4} = \\frac{\\pi}{4} - \\frac{1}{2} = \\frac{\\pi - 2}{4}$."
    },
    {
        "id": "wbjee_2023_math_q67",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Calculus: Applications of Derivatives",
        "chapter_number": 14,
        "section": "Category 3",
        "category": 3,
        "marks": 2,
        "negative_marks": 0,
        "question_number": 67,
        "question_type": "multi_mcq",
        "question_statement": "Let $f(x) = x^3 - 3x^2 + 6$. Which of the following statement(s) is/are TRUE?",
        "options": [
            {"id": "A", "text": "$f(x)$ has a local maximum at $x = 0$", "is_correct": True},
            {"id": "B", "text": "$f(x)$ has a local minimum at $x = 2$", "is_correct": True},
            {"id": "C", "text": "$f(x)$ is strictly increasing in $(-\\infty, 0) \\cup (2, \\infty)$", "is_correct": True},
            {"id": "D", "text": "$f(x)$ is strictly increasing in $(0, 2)$", "is_correct": False}
        ],
        "correct_option": "A, B, C",
        "explanation": "$f'(x) = 3x^2 - 6x = 3x(x - 2)$. Critical points are $x = 0$ and $x = 2$. $f''(x) = 6x - 6$. At $x = 0$, $f''(0) = -6 < 0$ (local max). At $x = 2$, $f''(2) = 6 > 0$ (local min). Also $f'(x) > 0$ when $x < 0$ or $x > 2$, hence strictly increasing there."
    },

    # ── Physics: Mechanics, Optics, Electromagnetism ─────────────
    {
        "id": "wbjee_2023_phys_q3",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Physics",
        "chapter": "Properties of Matter & Fluid Mechanics",
        "chapter_number": 7,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 3,
        "question_type": "mcq",
        "question_statement": "A liquid is at the same level in both vertical arms of a U-tube of uniform cross-section at rest. If the U-tube moves horizontally with an acceleration $f$ towards the right and the distance between the arms is $a$, the difference between liquid heights in the two arms will be ($g$ is acceleration due to gravity):",
        "options": [
            {"id": "A", "text": "$\\frac{a g}{f}$", "is_correct": False},
            {"id": "B", "text": "$\\frac{a f}{g}$", "is_correct": True},
            {"id": "C", "text": "$a$", "is_correct": False},
            {"id": "D", "text": "$0$", "is_correct": False}
        ],
        "correct_option": "B",
        "explanation": "In an accelerating frame, the effective gravity vector makes an angle $\\theta$ with the vertical where $\\tan\\theta = \\frac{f}{g}$. The liquid surface tilts by angle $\\theta$. The height difference between two arms separated by distance $a$ is $h = a \\tan\\theta = \\frac{a f}{g}$."
    },
    {
        "id": "wbjee_2023_phys_q4",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Physics",
        "chapter": "Heat & Thermodynamics",
        "chapter_number": 9,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 4,
        "question_type": "mcq",
        "question_statement": "Six molecules of an ideal gas have speeds $1, 3, 5, 5, 6,$ and $5\\text{ m/s}$ respectively. If $\\bar{v}$ and $v_{\\text{rms}}$ represent average speed and root mean square speed respectively, then:",
        "options": [
            {"id": "A", "text": "$\\bar{v} = 5\\text{ m/s}$", "is_correct": False},
            {"id": "B", "text": "$v_{\\text{rms}} > \\bar{v}$", "is_correct": True},
            {"id": "C", "text": "$v_{\\text{rms}} = \\bar{v}$", "is_correct": False},
            {"id": "D", "text": "$v_{\\text{rms}} < \\bar{v}$", "is_correct": False}
        ],
        "correct_option": "B",
        "explanation": "By Cauchy-Schwarz inequality, for any set of non-identical positive numbers, the root mean square value always strictly exceeds the arithmetic average: $v_{\\text{rms}} > \\bar{v}$."
    },
    {
        "id": "wbjee_2023_phys_q31",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Physics",
        "chapter": "Ray & Wave Optics",
        "chapter_number": 15,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 31,
        "question_type": "mcq",
        "question_statement": "In Young's double-slit experiment, the distance between the slits is $d = 0.2\\text{ mm}$ and the distance of the screen is $D = 1\\text{ m}$. If light of wavelength $\\lambda = 600\\text{ nm}$ is used, the distance of the $5\\text{th}$ dark fringe from the central bright fringe is:",
        "options": [
            {"id": "A", "text": "$1.35\\text{ cm}$", "is_correct": True},
            {"id": "B", "text": "$1.50\\text{ cm}$", "is_correct": False},
            {"id": "C", "text": "$1.20\\text{ cm}$", "is_correct": False},
            {"id": "D", "text": "$1.65\\text{ cm}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "The position of the $n$-th dark fringe is $y_n = \\left(n - \\frac{1}{2}\\right) \\frac{\\lambda D}{d}$. For $n = 5$: $y_5 = \\left(5 - \\frac{1}{2}\\right) \\frac{(600 \\times 10^{-9})(1)}{0.2 \\times 10^{-3}} = 4.5 \\times 3 \\times 10^{-3}\\text{ m} = 13.5 \\times 10^{-3}\\text{ m} = 1.35\\text{ cm}$."
    },
    {
        "id": "wbjee_2023_phys_q38",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Physics",
        "chapter": "Electromagnetic Induction & AC",
        "chapter_number": 13,
        "section": "Category 3",
        "category": 3,
        "marks": 2,
        "negative_marks": 0,
        "question_number": 38,
        "question_type": "multi_mcq",
        "question_statement": "A cylindrical region of radius $R$ contains a vertical magnetic field $\\vec{B} = (4t^2 - 2t + 6)\\hat{k}$. A charged particle of charge $q$ and mass $m$ is at distance $2R$ from the cylinder axis. Which of the following is/are TRUE?",
        "options": [
            {"id": "A", "text": "Induced electric field lines form closed concentric loops", "is_correct": True},
            {"id": "B", "text": "Electric field magnitude varies linearly with radial distance $r$ inside the region ($r < R$)", "is_correct": True},
            {"id": "C", "text": "The induced electric field outside ($r > R$) is proportional to $\\frac{1}{r}$", "is_correct": True},
            {"id": "D", "text": "Induced electric field is zero outside the cylinder", "is_correct": False}
        ],
        "correct_option": "A, B, C",
        "explanation": "By Faraday's law of induction: $\\oint \\vec{E} \\cdot d\\vec{l} = -\\frac{d\\Phi_B}{dt}$. For $r < R$: $E(2\\pi r) = \\pi r^2 \\left(\\frac{dB}{dt}\\right) \\implies E = \\frac{r}{2}\\frac{dB}{dt} \\propto r$. For $r > R$: $E(2\\pi r) = \\pi R^2 \\left(\\frac{dB}{dt}\\right) \\implies E = \\frac{R^2}{2r}\\frac{dB}{dt} \\propto \\frac{1}{r}$. Lines form closed loops."
    },

    # ── Chemistry: Physical, Inorganic & Organic ──────────────────
    {
        "id": "wbjee_2023_chem_q48",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Chemistry",
        "chapter": "States of Matter & Gas Laws",
        "chapter_number": 5,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 48,
        "question_type": "mcq",
        "question_statement": "The root mean square ($v_{\\text{rms}}$) speed of diatomic gas $X_2$ is $x\\text{ m/s}$ at temperature $T$. When the temperature is doubled to $2T$, the $X_2$ molecules dissociate completely into atoms $X$. The new rms speed of the atoms is:",
        "options": [
            {"id": "A", "text": "$\\frac{x}{2}$", "is_correct": False},
            {"id": "B", "text": "$x$", "is_correct": False},
            {"id": "C", "text": "$2x$", "is_correct": True},
            {"id": "D", "text": "$4x$", "is_correct": False}
        ],
        "correct_option": "C",
        "explanation": "RMS speed $v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}}$. Initially $x = \\sqrt{\\frac{3RT}{M_{X_2}}}$. When molecules dissociate into atoms, molar mass becomes $M' = \\frac{M_{X_2}}{2}$. At $T' = 2T$: $v' = \\sqrt{\\frac{3R(2T)}{M_{X_2}/2}} = \\sqrt{4 \\times \\frac{3RT}{M_{X_2}}} = 2x$."
    },
    {
        "id": "wbjee_2023_chem_q55",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Chemistry",
        "chapter": "Coordination Compounds",
        "chapter_number": 15,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 55,
        "question_type": "mcq",
        "question_statement": "According to Crystal Field Theory (CFT), what is the spin-only magnetic moment of $[\\text{Fe}(\\text{CN})_6]^{3-}$? (Atomic number of $\\text{Fe} = 26$)",
        "options": [
            {"id": "A", "text": "$1.73\\text{ BM}$", "is_correct": True},
            {"id": "B", "text": "$4.90\\text{ BM}$", "is_correct": False},
            {"id": "C", "text": "$5.92\\text{ BM}$", "is_correct": False},
            {"id": "D", "text": "$0\\text{ BM}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$\\text{Fe}^{3+}$ has $d^5$ configuration. $\\text{CN}^-$ is a strong field ligand, causing low-spin pairing: $t_{2g}^5 e_g^0$. Number of unpaired electrons $n = 1$. Spin-only magnetic moment $\\mu = \\sqrt{n(n+2)} = \\sqrt{1(3)} = \\sqrt{3} \\approx 1.73\\text{ BM}$."
    },
    {
        "id": "wbjee_2023_chem_q76",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Chemistry",
        "chapter": "Chemical Thermodynamics",
        "chapter_number": 6,
        "section": "Category 3",
        "category": 3,
        "marks": 2,
        "negative_marks": 0,
        "question_number": 76,
        "question_type": "multi_mcq",
        "question_statement": "For an ideal gas undergoing a reversible isothermal expansion, which of the following thermodynamic relationship(s) is/are TRUE?",
        "options": [
            {"id": "A", "text": "$\\Delta U = 0$", "is_correct": True},
            {"id": "B", "text": "$\\Delta H = 0$", "is_correct": True},
            {"id": "C", "text": "$q = -w = nRT \\ln\\left(\\frac{V_2}{V_1}\\right)$", "is_correct": True},
            {"id": "D", "text": "$\\Delta S_{\\text{sys}} = 0$", "is_correct": False}
        ],
        "correct_option": "A, B, C",
        "explanation": "For an ideal gas, internal energy and enthalpy depend only on temperature. Since $T$ is constant, $\\Delta U = 0$ and $\\Delta H = 0$. By the first law, $\\Delta U = q + w = 0 \\implies q = -w = nRT \\ln(V_2/V_1)$. For expansion, $\\Delta S_{\\text{sys}} = nR\\ln(V_2/V_1) > 0$."
    }
]

combined = existing + MORE_QUESTIONS
print(f"Total merged questions: {len(combined)}")

with open('data/wbjee_questions.json', 'w', encoding='utf-8') as f:
    json.dump(combined, f, indent=2, ensure_ascii=False)

print("Saved enriched dataset to data/wbjee_questions.json")

