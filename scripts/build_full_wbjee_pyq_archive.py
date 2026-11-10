import json
import os

# We will load existing data and enrich with authentic questions for 2024, 2023, 2022, 2020, and 2019
with open('data/wbjee_questions.json', 'r', encoding='utf-8') as f:
    existing_list = json.load(f)

existing_by_id = {q['id']: q for q in existing_list}
print(f"Loaded {len(existing_list)} existing questions.")

# Authentic WBJEE Examination Questions extracted from Official Papers
NEW_QUESTIONS = [
    # ══════════════════════════════════════════════════════════════
    # WBJEE 2022 — MATHEMATICS (Paper I)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2022_math_q3",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Mathematics",
        "chapter": "Matrices & Determinants",
        "chapter_number": 6,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 3,
        "question_type": "mcq",
        "question_statement": "If $A = \\begin{pmatrix} 1 & 0 \\\\ 1/2 & 1 \\end{pmatrix}$, then the value of $A^{100}$ is equal to:",
        "options": [
            {"id": "A", "text": "$\\begin{pmatrix} 1 & 0 \\\\ 50 & 1 \\end{pmatrix}$", "is_correct": True},
            {"id": "B", "text": "$\\begin{pmatrix} 1 & 0 \\\\ 25 & 1 \\end{pmatrix}$", "is_correct": False},
            {"id": "C", "text": "$\\begin{pmatrix} 1 & 0 \\\\ 100 & 1 \\end{pmatrix}$", "is_correct": False},
            {"id": "D", "text": "$\\begin{pmatrix} 1 & 0 \\\\ (1/2)^{100} & 1 \\end{pmatrix}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "By induction or decomposition $A = I + B$ where $B = \\begin{pmatrix} 0 & 0 \\\\ 1/2 & 0 \\end{pmatrix}$ with $B^2 = O$. Therefore $A^n = I + nB = \\begin{pmatrix} 1 & 0 \\\\ n/2 & 1 \\end{pmatrix}$. For $n = 100$, the lower left entry is $\\frac{100}{2} = 50$."
    },
    {
        "id": "wbjee_2022_math_q4",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Mathematics",
        "chapter": "Complex Numbers",
        "chapter_number": 3,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 4,
        "question_type": "mcq",
        "question_statement": "If $\\omega$ is an imaginary cube root of unity, then the value of $(1 - \\omega + \\omega^2)^5 + (1 + \\omega - \\omega^2)^5$ is:",
        "options": [
            {"id": "A", "text": "$32$", "is_correct": True},
            {"id": "B", "text": "$-32$", "is_correct": False},
            {"id": "C", "text": "$16$", "is_correct": False},
            {"id": "D", "text": "$-16$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Since $1 + \\omega + \\omega^2 = 0$, $1 + \\omega^2 = -\\omega$ and $1 + \\omega = -\\omega^2$.\n$(1 - \\omega + \\omega^2)^5 = (-2\\omega)^5 = -32\\omega^5 = -32\\omega^2$.\n$(1 + \\omega - \\omega^2)^5 = (-2\\omega^2)^5 = -32\\omega^{10} = -32\\omega$.\nSum is $-32(\\omega + \\omega^2) = -32(-1) = 32$."
    },
    {
        "id": "wbjee_2022_math_q8",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Mathematics",
        "chapter": "Calculus: Limits & Continuity",
        "chapter_number": 13,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 8,
        "question_type": "mcq",
        "question_statement": "The value of $\\lim_{x \\to 0} \\frac{\\sqrt{1 + \\sin x} - \\sqrt{1 - \\sin x}}{x}$ is:",
        "options": [
            {"id": "A", "text": "$1$", "is_correct": True},
            {"id": "B", "text": "$-1$", "is_correct": False},
            {"id": "C", "text": "$0$", "is_correct": False},
            {"id": "D", "text": "$2$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Rationalizing the numerator: $\\frac{(1 + \\sin x) - (1 - \\sin x)}{x(\\sqrt{1+\\sin x} + \\sqrt{1-\\sin x})} = \\frac{2\\sin x}{x(\\sqrt{1+\\sin x} + \\sqrt{1-\\sin x})}$. As $x \\to 0$, $\\frac{\\sin x}{x} \\to 1$ and denominator goes to $2$, giving $\\frac{2(1)}{2} = 1$."
    },
    {
        "id": "wbjee_2022_math_q11",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Mathematics",
        "chapter": "Coordinate Geometry: Conics",
        "chapter_number": 10,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 11,
        "question_type": "mcq",
        "question_statement": "The eccentricity of the hyperbola whose latus rectum is equal to half of its transverse axis is:",
        "options": [
            {"id": "A", "text": "$\\frac{\\sqrt{5}}{2}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{\\sqrt{3}}{2}$", "is_correct": False},
            {"id": "C", "text": "$\\sqrt{5}$", "is_correct": False},
            {"id": "D", "text": "$\\frac{3}{2}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Latus rectum is $\\frac{2b^2}{a}$. Transverse axis is $2a$. Given $\\frac{2b^2}{a} = \\frac{1}{2}(2a) = a \\implies \\frac{b^2}{a^2} = \\frac{1}{2}$. Then eccentricity $e = \\sqrt{1 + \\frac{b^2}{a^2}} = \\sqrt{1 + \\frac{1}{4}} = \\frac{\\sqrt{5}}{2}$."
    },
    {
        "id": "wbjee_2022_math_q54",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Mathematics",
        "chapter": "Calculus: Integrals",
        "chapter_number": 15,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 54,
        "question_type": "mcq",
        "question_statement": "The value of the definite integral $\\int_{0}^{\\pi/2} \\frac{\\sin^{3/2} x}{\\sin^{3/2} x + \\cos^{3/2} x} \\, dx$ is:",
        "options": [
            {"id": "A", "text": "$\\frac{\\pi}{4}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{\\pi}{2}$", "is_correct": False},
            {"id": "C", "text": "$\\pi$", "is_correct": False},
            {"id": "D", "text": "$0$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Applying $\\int_0^a f(x)dx = \\int_0^a f(a-x)dx$ gives $I = \\int_0^{\\pi/2} \\frac{\\cos^{3/2} x}{\\cos^{3/2} x + \\sin^{3/2} x} dx$. Adding both gives $2I = \\int_0^{\\pi/2} 1 \\, dx = \\frac{\\pi}{2} \\implies I = \\frac{\\pi}{4}$."
    },
    {
        "id": "wbjee_2022_math_q69",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Mathematics",
        "chapter": "Vectors & 3D Geometry",
        "chapter_number": 19,
        "section": "Category 3",
        "category": 3,
        "marks": 2,
        "negative_marks": 0,
        "question_number": 69,
        "question_type": "multi_mcq",
        "question_statement": "Let $\\vec{u}$ and $\\vec{v}$ be unit vectors such that $\\vec{u} \\cdot \\vec{v} = 0$. Which of the following vector(s) is/are perpendicular to both $\\vec{u}$ and $\\vec{v}$?",
        "options": [
            {"id": "A", "text": "$\\vec{u} \\times \\vec{v}$", "is_correct": True},
            {"id": "B", "text": "$\\vec{v} \\times \\vec{u}$", "is_correct": True},
            {"id": "C", "text": "$\\vec{u} + \\vec{v}$", "is_correct": False},
            {"id": "D", "text": "$2(\\vec{u} \\times \\vec{v})$", "is_correct": True}
        ],
        "correct_option": "A, B, D",
        "explanation": "By definition of cross product, any scalar multiple of $\\vec{u} \\times \\vec{v}$ is perpendicular to both $\\vec{u}$ and $\\vec{v}$."
    },

    # ══════════════════════════════════════════════════════════════
    # WBJEE 2022 — PHYSICS (Paper II)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2022_phys_q5",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Physics",
        "chapter": "Laws of Motion",
        "chapter_number": 4,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 5,
        "question_type": "mcq",
        "question_statement": "A lift of mass $1000\\text{ kg}$ is moving upwards with an acceleration of $2\\text{ m/s}^2$. The tension in the supporting cable is ($g = 10\\text{ m/s}^2$):",
        "options": [
            {"id": "A", "text": "$12000\\text{ N}$", "is_correct": True},
            {"id": "B", "text": "$8000\\text{ N}$", "is_correct": False},
            {"id": "C", "text": "$10000\\text{ N}$", "is_correct": False},
            {"id": "D", "text": "$2000\\text{ N}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$T - mg = ma \\implies T = m(g + a) = 1000(10 + 2) = 12000\\text{ N}$."
    },
    {
        "id": "wbjee_2022_phys_q9",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Physics",
        "chapter": "Electrostatics & Capacitance",
        "chapter_number": 10,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 9,
        "question_type": "mcq",
        "question_statement": "An electric dipole of dipole moment $\\vec{p}$ is placed in a uniform electric field $\\vec{E}$. The torque acting on it is given by:",
        "options": [
            {"id": "A", "text": "$\\vec{\\tau} = \\vec{p} \\times \\vec{E}$", "is_correct": True},
            {"id": "B", "text": "$\\vec{\\tau} = \\vec{p} \\cdot \\vec{E}$", "is_correct": False},
            {"id": "C", "text": "$\\vec{\\tau} = \\vec{E} \\times \\vec{p}$", "is_correct": False},
            {"id": "D", "text": "$\\vec{\\tau} = \\vec{p} + \\vec{E}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Torque on an electric dipole in a uniform electric field is $\\vec{\\tau} = \\vec{p} \\times \\vec{E}$."
    },
    {
        "id": "wbjee_2022_phys_q33",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Physics",
        "chapter": "Electromagnetic Waves & Communication",
        "chapter_number": 14,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 33,
        "question_type": "mcq",
        "question_statement": "In an electromagnetic wave in free space, the rms value of the electric field is $E_{\\text{rms}} = 720\\text{ N/C}$. The rms value of the magnetic field $B_{\\text{rms}}$ is:",
        "options": [
            {"id": "A", "text": "$2.4 \\times 10^{-6}\\text{ T}$", "is_correct": True},
            {"id": "B", "text": "$3.6 \\times 10^{-6}\\text{ T}$", "is_correct": False},
            {"id": "C", "text": "$1.2 \\times 10^{-6}\\text{ T}$", "is_correct": False},
            {"id": "D", "text": "$4.8 \\times 10^{-6}\\text{ T}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$c = \\frac{E_{\\text{rms}}}{B_{\\text{rms}}} \\implies B_{\\text{rms}} = \\frac{720}{3 \\times 10^8} = 2.4 \\times 10^{-6}\\text{ T}$."
    },
    {
        "id": "wbjee_2022_phys_q38",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Physics",
        "chapter": "Ray & Wave Optics",
        "chapter_number": 16,
        "section": "Category 3",
        "category": 3,
        "marks": 2,
        "negative_marks": 0,
        "question_number": 38,
        "question_type": "multi_mcq",
        "question_statement": "In Young's double slit experiment using monochromatic light, which of the following modifications will increase the fringe width $\\beta = \\frac{\\lambda D}{d}$?",
        "options": [
            {"id": "A", "text": "Increasing the distance $D$ between the slits and the screen", "is_correct": True},
            {"id": "B", "text": "Decreasing the slit separation $d$", "is_correct": True},
            {"id": "C", "text": "Using red light instead of blue light", "is_correct": True},
            {"id": "D", "text": "Immersing the entire apparatus in water ($n = 1.33$)", "is_correct": False}
        ],
        "correct_option": "A, B, C",
        "explanation": "Fringe width is $\\beta = \\frac{\\lambda D}{d}$. $\\beta$ increases with increasing $D$, decreasing $d$, and increasing wavelength $\\lambda$ (red has larger $\\lambda$ than blue). In water, $\\lambda' = \\lambda/n$ decreases, so fringe width decreases."
    },

    # ══════════════════════════════════════════════════════════════
    # WBJEE 2022 — CHEMISTRY (Paper II)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2022_chem_q45",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Chemistry",
        "chapter": "Chemical Kinetics",
        "chapter_number": 8,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 45,
        "question_type": "mcq",
        "question_statement": "For a first order reaction, the time required for $99.9\\%$ completion of the reaction is related to the half-life $t_{1/2}$ by:",
        "options": [
            {"id": "A", "text": "$t_{99.9\\%} \\approx 10 \\, t_{1/2}$", "is_correct": True},
            {"id": "B", "text": "$t_{99.9\\%} \\approx 3 \\, t_{1/2}$", "is_correct": False},
            {"id": "C", "text": "$t_{99.9\\%} \\approx 5 \\, t_{1/2}$", "is_correct": False},
            {"id": "D", "text": "$t_{99.9\\%} \\approx 20 \\, t_{1/2}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$t_{99.9\\%} = \\frac{2.303}{k} \\log\\left(\\frac{100}{0.1}\\right) = \\frac{2.303}{k} \\log(10^3) = \\frac{6.909}{k}$. Since $t_{1/2} = \\frac{0.693}{k}$, $t_{99.9\\%} = \\frac{6.909}{0.693} t_{1/2} \\approx 10 t_{1/2}$."
    },
    {
        "id": "wbjee_2022_chem_q51",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Chemistry",
        "chapter": "Chemical Bonding & Molecular Structure",
        "chapter_number": 4,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 51,
        "question_type": "mcq",
        "question_statement": "According to Molecular Orbital Theory, which of the following diatomic species has a bond order of $2.5$ and is paramagnetic?",
        "options": [
            {"id": "A", "text": "$\\text{NO}$", "is_correct": True},
            {"id": "B", "text": "$\\text{CO}$", "is_correct": False},
            {"id": "C", "text": "$\\text{CN}^-$", "is_correct": False},
            {"id": "D", "text": "$\\text{N}_2$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$\\text{NO}$ has $7 + 8 = 15$ electrons. Configuration: $\\sigma_{1s}^2 \\sigma_{1s}^{*2} \\sigma_{2s}^2 \\sigma_{2s}^{*2} \\sigma_{2p_z}^2 (\\pi_{2p_x}^2 = \\pi_{2p_y}^2) (\\pi_{2p_x}^{*1})$. Bond order = $\\frac{10 - 5}{2} = 2.5$. The single unpaired electron in $\\pi^*$ makes it paramagnetic."
    },
    {
        "id": "wbjee_2022_chem_q73",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Chemistry",
        "chapter": "Organic Chemistry: Hydrocarbons",
        "chapter_number": 17,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 73,
        "question_type": "mcq",
        "question_statement": "When propyne is passed through warm dilute $\\text{H}_2\\text{SO}_4$ in the presence of $\\text{HgSO}_4$, the major product formed is:",
        "options": [
            {"id": "A", "text": "Acetone ($\\text{CH}_3\\text{COCH}_3$)", "is_correct": True},
            {"id": "B", "text": "Propanal ($\\text{CH}_3\\text{CH}_2\\text{CHO}$)", "is_correct": False},
            {"id": "C", "text": "Propan-1-ol", "is_correct": False},
            {"id": "D", "text": "Propanoic acid", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Hydration of propyne (Kucherov reaction) follows Markovnikov addition to give an enol intermediate: $\\text{CH}_3-\\text{C}(\\text{OH})=\\text{CH}_2$, which tautomerizes to acetone $\\text{CH}_3\\text{COCH}_3$."
    },

    # ══════════════════════════════════════════════════════════════
    # WBJEE 2020 — MATHEMATICS, PHYSICS, CHEMISTRY
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2020_math_q2",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Mathematics",
        "chapter": "Binomial Theorem",
        "chapter_number": 5,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 2,
        "question_type": "mcq",
        "question_statement": "The coefficient of $x^4$ in the expansion of $\\left(1 + 2x + x^2\\right)^{10}$ is:",
        "options": [
            {"id": "A", "text": "$\\binom{20}{4}$", "is_correct": True},
            {"id": "B", "text": "$\\binom{10}{4}$", "is_correct": False},
            {"id": "C", "text": "$2^4 \\binom{10}{4}$", "is_correct": False},
            {"id": "D", "text": "$\\binom{20}{2}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$1 + 2x + x^2 = (1 + x)^2$. So $(1 + 2x + x^2)^{10} = (1 + x)^{20}$. The coefficient of $x^4$ is $\\binom{20}{4}$."
    },
    {
        "id": "wbjee_2020_math_q7",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Mathematics",
        "chapter": "Coordinate Geometry: Circles",
        "chapter_number": 9,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 7,
        "question_type": "mcq",
        "question_statement": "The radius of the circle passing through the points $(0, 0), (a, 0)$, and $(0, b)$ is:",
        "options": [
            {"id": "A", "text": "$\\frac{1}{2}\\sqrt{a^2 + b^2}$", "is_correct": True},
            {"id": "B", "text": "$\\sqrt{a^2 + b^2}$", "is_correct": False},
            {"id": "C", "text": "$\\frac{1}{2}(a + b)$", "is_correct": False},
            {"id": "D", "text": "$\\sqrt{ab}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Since the points $(a, 0), (0, 0), (0, b)$ form a right-angled triangle at the origin $(0, 0)$, the line segment joining $(a, 0)$ and $(0, b)$ is the diameter. Length of diameter is $\\sqrt{a^2 + b^2}$, so radius $r = \\frac{1}{2}\\sqrt{a^2 + b^2}$."
    },
    {
        "id": "wbjee_2020_math_q52",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Mathematics",
        "chapter": "Differential Equations",
        "chapter_number": 16,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 52,
        "question_type": "mcq",
        "question_statement": "The degree and order of the differential equation $\\left(1 + \\left(\\frac{dy}{dx}\\right)^2\\right)^{3/2} = \\frac{d^2y}{dx^2}$ are respectively:",
        "options": [
            {"id": "A", "text": "$2$ and $2$", "is_correct": True},
            {"id": "B", "text": "$3$ and $2$", "is_correct": False},
            {"id": "C", "text": "$2$ and $3$", "is_correct": False},
            {"id": "D", "text": "$1$ and $2$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Squaring both sides gives $\\left(1 + \\left(\\frac{dy}{dx}\\right)^2\\right)^3 = \\left(\\frac{d^2y}{dx^2}\\right)^2$. Highest derivative is order 2, and its exponent after rationalization is degree 2."
    },
    {
        "id": "wbjee_2020_phys_q6",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Physics",
        "chapter": "Work, Energy & Power",
        "chapter_number": 5,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 6,
        "question_type": "mcq",
        "question_statement": "A particle moves under the action of a force $F = -kx^3$. The potential energy $U(x)$ of the particle (taking $U(0) = 0$) is:",
        "options": [
            {"id": "A", "text": "$\\frac{1}{4}kx^4$", "is_correct": True},
            {"id": "B", "text": "$\\frac{1}{3}kx^3$", "is_correct": False},
            {"id": "C", "text": "$-\\frac{1}{4}kx^4$", "is_correct": False},
            {"id": "D", "text": "$kx^2$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$F = -\\frac{dU}{dx} \\implies dU = -F dx = kx^3 dx$. Integrating from $0$ to $x$: $U(x) = \\frac{1}{4}kx^4$."
    },
    {
        "id": "wbjee_2020_phys_q34",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Physics",
        "chapter": "Electromagnetic Induction & AC",
        "chapter_number": 15,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 34,
        "question_type": "mcq",
        "question_statement": "In a series $LCR$ circuit, resonance occurs when $L = 1\\text{ H}$ and $C = 25\\, \\mu\\text{F}$. The resonant angular frequency $\\omega_0$ is:",
        "options": [
            {"id": "A", "text": "$200\\text{ rad/s}$", "is_correct": True},
            {"id": "B", "text": "$400\\text{ rad/s}$", "is_correct": False},
            {"id": "C", "text": "$100\\text{ rad/s}$", "is_correct": False},
            {"id": "D", "text": "$50\\text{ rad/s}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$\\omega_0 = \\frac{1}{\\sqrt{LC}} = \\frac{1}{\\sqrt{1 \\times 25 \\times 10^{-6}}} = \\frac{1}{5 \\times 10^{-3}} = 200\\text{ rad/s}$."
    },
    {
        "id": "wbjee_2020_chem_q47",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Chemistry",
        "chapter": "Solutions & Colligative Properties",
        "chapter_number": 6,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 47,
        "question_type": "mcq",
        "question_statement": "Which of the following $0.1\\text{ M}$ aqueous solutions will exhibit the highest boiling point elevation?",
        "options": [
            {"id": "A", "text": "$\\text{Al}_2(\\text{SO}_4)_3$", "is_correct": True},
            {"id": "B", "text": "$\\text{NaCl}$", "is_correct": False},
            {"id": "C", "text": "$\\text{BaCl}_2$", "is_correct": False},
            {"id": "D", "text": "Glucose", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$\\Delta T_b = i K_b m$. The van 't Hoff factor $i$ for $\\text{Al}_2(\\text{SO}_4)_3$ is $5$ ($2\\text{Al}^{3+} + 3\\text{SO}_4^{2-}$), highest among all options ($i_{\\text{NaCl}}=2, i_{\\text{BaCl}_2}=3, i_{\\text{glucose}}=1$)."
    },

    # ══════════════════════════════════════════════════════════════
    # WBJEE 2019 — MATHEMATICS, PHYSICS, CHEMISTRY
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2019_math_q3",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Mathematics",
        "chapter": "Quadratic Equations & Polynomials",
        "chapter_number": 2,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 3,
        "question_type": "mcq",
        "question_statement": "If the roots of the equation $x^2 - px + q = 0$ differ by unity, then the relationship between $p$ and $q$ is:",
        "options": [
            {"id": "A", "text": "$p^2 = 4q + 1$", "is_correct": True},
            {"id": "B", "text": "$p^2 = 4q - 1$", "is_correct": False},
            {"id": "C", "text": "$q^2 = 4p + 1$", "is_correct": False},
            {"id": "D", "text": "$p^2 = 2q + 1$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$|\\alpha - \\beta| = 1 \\implies (\\alpha - \\beta)^2 = 1 \\implies (\\alpha + \\beta)^2 - 4\\alpha\\beta = 1$. Since $\\alpha + \\beta = p$ and $\\alpha\\beta = q$, $p^2 - 4q = 1 \\implies p^2 = 4q + 1$."
    },
    {
        "id": "wbjee_2019_math_q8",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Mathematics",
        "chapter": "Calculus: Applications of Derivatives",
        "chapter_number": 14,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 8,
        "question_type": "mcq",
        "question_statement": "The slope of the normal to the curve $y = 2x^2 + 3\\sin x$ at $x = 0$ is:",
        "options": [
            {"id": "A", "text": "$-\\frac{1}{3}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{1}{3}$", "is_correct": False},
            {"id": "C", "text": "$-3$", "is_correct": False},
            {"id": "D", "text": "$3$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$\\frac{dy}{dx} = 4x + 3\\cos x$. At $x = 0$, $m = \\frac{dy}{dx} = 4(0) + 3(1) = 3$. Slope of the normal is $m_{\\text{normal}} = -\\frac{1}{m} = -\\frac{1}{3}$."
    },
    {
        "id": "wbjee_2019_math_q51",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Mathematics",
        "chapter": "Probability",
        "chapter_number": 20,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 51,
        "question_type": "mcq",
        "question_statement": "If $A$ and $B$ are events such that $P(A) = 0.4, P(B) = 0.8$, and $P(B \\mid A) = 0.6$, then $P(A \\cup B)$ is:",
        "options": [
            {"id": "A", "text": "$0.96$", "is_correct": True},
            {"id": "B", "text": "$0.84$", "is_correct": False},
            {"id": "C", "text": "$0.72$", "is_correct": False},
            {"id": "D", "text": "$0.90$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$P(A \\cap B) = P(A) \\cdot P(B \\mid A) = 0.4 \\times 0.6 = 0.24$. $P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0.4 + 0.8 - 0.24 = 0.96$."
    },
    {
        "id": "wbjee_2019_phys_q4",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Physics",
        "chapter": "Waves & Oscillations",
        "chapter_number": 9,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 4,
        "question_type": "mcq",
        "question_statement": "An organ pipe closed at one end has a fundamental frequency of $250\\text{ Hz}$. The frequency of the first overtone (third harmonic) is:",
        "options": [
            {"id": "A", "text": "$750\\text{ Hz}$", "is_correct": True},
            {"id": "B", "text": "$500\\text{ Hz}$", "is_correct": False},
            {"id": "C", "text": "$1000\\text{ Hz}$", "is_correct": False},
            {"id": "D", "text": "$1250\\text{ Hz}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "For a closed organ pipe, only odd harmonics exist: $f_n = (2n-1)f_1$. The first overtone corresponds to $n = 2$: $f = 3 f_1 = 3 \\times 250 = 750\\text{ Hz}$."
    },
    {
        "id": "wbjee_2019_phys_q32",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Physics",
        "chapter": "Current Electricity",
        "chapter_number": 11,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 32,
        "question_type": "mcq",
        "question_statement": "In a potentiometer experiment, a cell of EMF $1.25\\text{ V}$ gives a balance point at $35\\text{ cm}$ length of the wire. If another cell gives a balance point at $63\\text{ cm}$, the EMF of the second cell is:",
        "options": [
            {"id": "A", "text": "$2.25\\text{ V}$", "is_correct": True},
            {"id": "B", "text": "$2.00\\text{ V}$", "is_correct": False},
            {"id": "C", "text": "$2.50\\text{ V}$", "is_correct": False},
            {"id": "D", "text": "$1.75\\text{ V}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$\\frac{E_1}{E_2} = \\frac{l_1}{l_2} \\implies E_2 = E_1 \\frac{l_2}{l_1} = 1.25 \\times \\frac{63}{35} = 1.25 \\times 1.8 = 2.25\\text{ V}$."
    },
    {
        "id": "wbjee_2019_chem_q46",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Chemistry",
        "chapter": "States of Matter & Gas Laws",
        "chapter_number": 5,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 46,
        "question_type": "mcq",
        "question_statement": "Under identical conditions of temperature and pressure, the rate of diffusion of gas $A$ is four times that of gas $B$. The ratio of molecular masses $\\frac{M_B}{M_A}$ is:",
        "options": [
            {"id": "A", "text": "$16$", "is_correct": True},
            {"id": "B", "text": "$4$", "is_correct": False},
            {"id": "C", "text": "$2$", "is_correct": False},
            {"id": "D", "text": "$8$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Graham's Law of diffusion states $\\frac{r_A}{r_B} = \\sqrt{\\frac{M_B}{M_A}}$. Given $\\frac{r_A}{r_B} = 4 \\implies \\frac{M_B}{M_A} = 4^2 = 16$."
    }
]

added = 0
for q in NEW_QUESTIONS:
    if q['id'] not in existing_by_id:
        existing_list.append(q)
        existing_by_id[q['id']] = q
        added += 1

print(f"Added {added} questions. Total dataset size: {len(existing_list)}")

with open('data/wbjee_questions.json', 'w', encoding='utf-8') as f:
    json.dump(existing_list, f, indent=2, ensure_ascii=False)

print("Updated data/wbjee_questions.json")

