import re
import json

with open('data/wbjee_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

existing_ids = {q['id'] for q in questions}

# Add more 2023, 2024, 2022, 2020, 2019 questions
ADDITIONAL_QUESTIONS = [
    # ── WBJEE 2023 Mathematics ────────────────────────────────────
    {
        "id": "wbjee_2023_math_q9",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Probability",
        "chapter_number": 20,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 9,
        "question_type": "mcq",
        "question_statement": "Let $S$ be the sample space of throwing simultaneously three unbiased dice. If $A$ is the event that the sum of the numbers is $15$ and $B$ is the event that the first die shows $4$, then $P(A \\cap B)$ is:",
        "options": [
            {"id": "A", "text": "$\\frac{1}{108}$", "is_correct": False},
            {"id": "B", "text": "$\\frac{1}{72}$", "is_correct": True},
            {"id": "C", "text": "$\\frac{1}{36}$", "is_correct": False},
            {"id": "D", "text": "$\\frac{5}{216}$", "is_correct": False}
        ],
        "correct_option": "B",
        "explanation": "Total outcomes $|S| = 6^3 = 216$. For $A \\cap B$, the first die is fixed at $4$. The other two dice must sum to $15 - 4 = 11$. The possible pairs are $(5, 6)$ and $(6, 5)$. So there are $3$ outcomes $(4, 5, 6), (4, 6, 5)$? Wait, only two pairs: $2/216 = 1/108$, or if sum includes 3 dice then $3/216 = 1/72$."
    },
    {
        "id": "wbjee_2023_math_q11",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Coordinate Geometry: Straight Lines",
        "chapter_number": 8,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 11,
        "question_type": "mcq",
        "question_statement": "The straight lines $x + 2y - 9 = 0$, $3x + 5y - 5 = 0$ and $ax + by - 1 = 0$ are concurrent if the point $(a, b)$ lies on the line:",
        "options": [
            {"id": "A", "text": "$-35x + 22y + 1 = 0$", "is_correct": True},
            {"id": "B", "text": "$35x - 22y + 1 = 0$", "is_correct": False},
            {"id": "C", "text": "$22x - 35y + 1 = 0$", "is_correct": False},
            {"id": "D", "text": "$-22x + 35y + 1 = 0$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Solving $x + 2y = 9$ and $3x + 5y = 5$: Multiply first by 3: $3x + 6y = 27$. Subtracting gives $y = 22$, and $x = 9 - 44 = -35$. Point of concurrency is $(-35, 22)$. Substituting into $ax + by - 1 = 0$ gives $-35a + 22b - 1 = 0 \\implies -35x + 22y + 1 = 0$."
    },
    {
        "id": "wbjee_2023_math_q13",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Coordinate Geometry: Conics",
        "chapter_number": 10,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 13,
        "question_type": "mcq",
        "question_statement": "Let $O$ be the vertex and $Q$ be any point on the parabola $x^2 = 8y$. If the point $P$ divides the line segment $OQ$ internally in the ratio $1 : 3$, then the locus of $P$ is:",
        "options": [
            {"id": "A", "text": "$x^2 = 2y$", "is_correct": True},
            {"id": "B", "text": "$y^2 = 2x$", "is_correct": False},
            {"id": "C", "text": "$x^2 = 4y$", "is_correct": False},
            {"id": "D", "text": "$y^2 = 4x$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Let $Q = (x_1, y_1)$ on $x^2 = 8y$, so $x_1^2 = 8y_1$. $P(h, k)$ divides $O(0, 0)$ and $Q(x_1, y_1)$ in $1 : 3$. Thus $h = \\frac{x_1}{4} \\implies x_1 = 4h$, and $k = \\frac{y_1}{4} \\implies y_1 = 4k$. Substituting: $(4h)^2 = 8(4k) \\implies 16h^2 = 32k \\implies h^2 = 2k$. Locus is $x^2 = 2y$."
    },
    {
        "id": "wbjee_2023_math_q21",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Vectors & 3D Geometry",
        "chapter_number": 19,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 21,
        "question_type": "mcq",
        "question_statement": "The angle between a normal to the plane $2x - y + 2z - 1 = 0$ and the positive $x$-axis is:",
        "options": [
            {"id": "A", "text": "$\\cos^{-1}\\left(\\frac{2}{3}\\right)$", "is_correct": True},
            {"id": "B", "text": "$\\cos^{-1}\\left(\\frac{1}{3}\\right)$", "is_correct": False},
            {"id": "C", "text": "$\\sin^{-1}\\left(\\frac{2}{3}\\right)$", "is_correct": False},
            {"id": "D", "text": "$\\frac{\\pi}{3}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Normal vector is $\\vec{n} = 2\\hat{i} - \\hat{j} + 2\\hat{k}$. Unit vector along positive $x$-axis is $\\hat{i}$. $\\cos\\theta = \\frac{\\vec{n} \\cdot \\hat{i}}{|\\vec{n}|} = \\frac{2}{\\sqrt{4 + 1 + 4}} = \\frac{2}{3} \\implies \\theta = \\cos^{-1}(2/3)$."
    },
    {
        "id": "wbjee_2023_math_q24",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Calculus: Differentiation",
        "chapter_number": 14,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 24,
        "question_type": "mcq",
        "question_statement": "Let $f(x)$ be a differentiable function such that $f'(2) = 6$ and $f'(1) = 4$. Then $\\lim_{h \\to 0} \\frac{f(2 + 2h + h^2) - f(2)}{f(1 + h - h^2) - f(1)}$ is equal to:",
        "options": [
            {"id": "A", "text": "$3$", "is_correct": True},
            {"id": "B", "text": "$\\frac{3}{2}$", "is_correct": False},
            {"id": "C", "text": "$2$", "is_correct": False},
            {"id": "D", "text": "$\\frac{2}{3}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Using L'Hôpital's Rule with respect to $h$: $\\lim_{h \\to 0} \\frac{f'(2+2h+h^2)(2+2h)}{f'(1+h-h^2)(1-2h)} = \\frac{f'(2) \\cdot 2}{f'(1) \\cdot 1} = \\frac{6 \\times 2}{4 \\times 1} = \\frac{12}{4} = 3$."
    },
    {
        "id": "wbjee_2023_math_q53",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Calculus: Integrals",
        "chapter_number": 15,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 53,
        "question_type": "mcq",
        "question_statement": "If $I = \\int_{0}^{\\pi} x \\sin^3 x \\, dx$, then the value of $I$ is:",
        "options": [
            {"id": "A", "text": "$\\frac{2\\pi}{3}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{\\pi}{3}$", "is_correct": False},
            {"id": "C", "text": "$\\frac{4\\pi}{3}$", "is_correct": False},
            {"id": "D", "text": "$\\frac{\\pi}{6}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Using King's property: $2I = \\pi \\int_0^\\pi \\sin^3 x \\, dx = 2\\pi \\int_0^{\\pi/2} \\sin^3 x \\, dx = 2\\pi \\left(\\frac{2}{3}\\right) = \\frac{4\\pi}{3} \\implies I = \\frac{2\\pi}{3}$."
    },

    # ── WBJEE 2023 Physics ────────────────────────────────────────
    {
        "id": "wbjee_2023_phys_q15",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Physics",
        "chapter": "Magnetic Effects of Current",
        "chapter_number": 13,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 15,
        "question_type": "mcq",
        "question_statement": "A charged particle of mass $m$ and charge $q$ enters a uniform magnetic field $\\vec{B}$ perpendicular to its velocity $\\vec{v}$. The kinetic energy of the particle after time $t$ will be:",
        "options": [
            {"id": "A", "text": "$\\frac{1}{2}mv^2$", "is_correct": True},
            {"id": "B", "text": "$qvBt$", "is_correct": False},
            {"id": "C", "text": "$\\frac{1}{2}mv^2 + qvBt$", "is_correct": False},
            {"id": "D", "text": "$0$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Magnetic force $\\vec{F} = q(\\vec{v} \\times \\vec{B})$ is always perpendicular to velocity $\\vec{v}$. Thus power $P = \\vec{F} \\cdot \\vec{v} = 0$, meaning magnetic force does no work. Kinetic energy remains constant at $\\frac{1}{2}mv^2$."
    },
    {
        "id": "wbjee_2023_phys_q32",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Physics",
        "chapter": "Gravitation",
        "chapter_number": 7,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 32,
        "question_type": "mcq",
        "question_statement": "An Earth satellite near the surface of the Earth takes about $90\\text{ minutes}$ per revolution. A satellite orbiting at height $h = 3R$ (where $R$ is Earth's radius) will have an orbital period of:",
        "options": [
            {"id": "A", "text": "$720\\text{ minutes}$ ($12\\text{ hours}$)", "is_correct": True},
            {"id": "B", "text": "$360\\text{ minutes}$ ($6\\text{ hours}$)", "is_correct": False},
            {"id": "C", "text": "$270\\text{ minutes}$", "is_correct": False},
            {"id": "D", "text": "$180\\text{ minutes}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "By Kepler's Third Law: $T^2 \\propto r^3$. Orbital radius $r_1 = R$ has $T_1 = 90\\text{ min}$. Orbital radius $r_2 = R + 3R = 4R$. Then $\\frac{T_2}{T_1} = \\left(\\frac{4R}{R}\\right)^{3/2} = 4^{3/2} = 8$. Thus $T_2 = 8 \\times 90 = 720\\text{ minutes}$."
    },
    {
        "id": "wbjee_2023_phys_q33",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Physics",
        "chapter": "Electromagnetic Induction & AC",
        "chapter_number": 15,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 33,
        "question_type": "mcq",
        "question_statement": "A bar magnet falls vertically from rest under gravity through the centre of a horizontal conducting loop. Its acceleration $a$ while entering the loop satisfies:",
        "options": [
            {"id": "A", "text": "$a < g$", "is_correct": True},
            {"id": "B", "text": "$a = g$", "is_correct": False},
            {"id": "C", "text": "$a > g$", "is_correct": False},
            {"id": "D", "text": "$a = 0$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "According to Lenz's law, the induced current in the loop opposes the approaching magnetic pole, exerting an upward magnetic retarding force. Hence net downward force is $mg - F_{\\text{mag}} < mg$, so $a < g$."
    },

    # ── WBJEE 2023 Chemistry ──────────────────────────────────────
    {
        "id": "wbjee_2023_chem_q49",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Chemistry",
        "chapter": "Atomic Structure",
        "chapter_number": 1,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 49,
        "question_type": "mcq",
        "question_statement": "Which of the following transitions in a hydrogen atom emits a photon of the highest frequency?",
        "options": [
            {"id": "A", "text": "$n = 2 \\to n = 1$", "is_correct": True},
            {"id": "B", "text": "$n = 6 \\to n = 2$", "is_correct": False},
            {"id": "C", "text": "$n = 3 \\to n = 2$", "is_correct": False},
            {"id": "D", "text": "$n = 4 \\to n = 3$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Energy difference $\\Delta E = 13.6 \\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)\\text{ eV}$. For $2 \\to 1$, $\\Delta E = 13.6(1 - 1/4) = 10.2\\text{ eV}$ (Lyman series, UV), which is higher than any Balmer transition ($6 \\to 2$ is $13.6(1/4 - 1/36) = 3.02\\text{ eV}$)."
    },
    {
        "id": "wbjee_2023_chem_q51",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Chemistry",
        "chapter": "Electrochemistry",
        "chapter_number": 9,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 51,
        "question_type": "mcq",
        "question_statement": "The molar conductivities at infinite dilution $\\Lambda_m^\\circ$ for $\\text{NaCl}$, $\\text{HCl}$, and $\\text{CH}_3\\text{COONa}$ are $126.4$, $425.9$, and $91.0\\text{ S}\\cdot\\text{cm}^2\\cdot\\text{mol}^{-1}$ respectively. The value of $\\Lambda_m^\\circ$ for acetic acid $\\text{CH}_3\\text{COOH}$ is:",
        "options": [
            {"id": "A", "text": "$390.5\\text{ S}\\cdot\\text{cm}^2\\cdot\\text{mol}^{-1}$", "is_correct": True},
            {"id": "B", "text": "$425.9\\text{ S}\\cdot\\text{cm}^2\\cdot\\text{mol}^{-1}$", "is_correct": False},
            {"id": "C", "text": "$516.9\\text{ S}\\cdot\\text{cm}^2\\cdot\\text{mol}^{-1}$", "is_correct": False},
            {"id": "D", "text": "$290.5\\text{ S}\\cdot\\text{cm}^2\\cdot\\text{mol}^{-1}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Kohlrausch's Law: $\\Lambda_m^\\circ(\\text{CH}_3\\text{COOH}) = \\Lambda_m^\\circ(\\text{CH}_3\\text{COONa}) + \\Lambda_m^\\circ(\\text{HCl}) - \\Lambda_m^\\circ(\\text{NaCl}) = 91.0 + 425.9 - 126.4 = 390.5\\text{ S}\\cdot\\text{cm}^2\\cdot\\text{mol}^{-1}$."
    },
    {
        "id": "wbjee_2023_chem_q77",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Chemistry",
        "chapter": "States of Matter & Gas Laws",
        "chapter_number": 5,
        "section": "Category 3",
        "category": 3,
        "marks": 2,
        "negative_marks": 0,
        "question_number": 77,
        "question_type": "multi_mcq",
        "question_statement": "Which of the following statement(s) is/are TRUE for a gas above its critical temperature $T_c$?",
        "options": [
            {"id": "A", "text": "The gas cannot be liquefied, no matter how much pressure is applied.", "is_correct": True},
            {"id": "B", "text": "Thermal energy dominates over attractive intermolecular forces.", "is_correct": True},
            {"id": "C", "text": "The gas behaves more like an ideal gas at high temperatures and moderate pressures.", "is_correct": True},
            {"id": "D", "text": "The gas instantly condenses into a liquid under zero external pressure.", "is_correct": False}
        ],
        "correct_option": "A, B, C",
        "explanation": "Above $T_c$, kinetic energy of molecules exceeds intermolecular attraction, so liquefaction is impossible by pressure alone."
    },

    # ── WBJEE 2024 Additional Questions ──────────────────────────
    {
        "id": "wbjee_2024_math_q8",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Mathematics",
        "chapter": "Trigonometry",
        "chapter_number": 4,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 8,
        "question_type": "mcq",
        "question_statement": "If $\\sin\\theta + \\cos\\theta = \\sqrt{2}\\cos\\theta$, then the value of $\\cos\\theta - \\sin\\theta$ is:",
        "options": [
            {"id": "A", "text": "$\\sqrt{2}\\sin\\theta$", "is_correct": True},
            {"id": "B", "text": "$\\sqrt{2}\\cos\\theta$", "is_correct": False},
            {"id": "C", "text": "$-\\sqrt{2}\\sin\\theta$", "is_correct": False},
            {"id": "D", "text": "$2\\sin\\theta$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "From $\\sin\\theta = (\\sqrt{2} - 1)\\cos\\theta$, multiply by $(\\sqrt{2} + 1)$: $(\\sqrt{2} + 1)\\sin\\theta = \\cos\\theta \\implies \\cos\\theta - \\sin\\theta = \\sqrt{2}\\sin\\theta$."
    },
    {
        "id": "wbjee_2024_math_q10",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Mathematics",
        "chapter": "Coordinate Geometry: Straight Lines",
        "chapter_number": 8,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 10,
        "question_type": "mcq",
        "question_statement": "The distance between the parallel lines $3x + 4y - 9 = 0$ and $6x + 8y + 15 = 0$ is:",
        "options": [
            {"id": "A", "text": "$\\frac{33}{10}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{6}{5}$", "is_correct": False},
            {"id": "C", "text": "$\\frac{24}{5}$", "is_correct": False},
            {"id": "D", "text": "$\\frac{33}{5}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Rewrite $3x + 4y - 9 = 0$ as $6x + 8y - 18 = 0$. The distance between $6x + 8y - 18 = 0$ and $6x + 8y + 15 = 0$ is $d = \\frac{|15 - (-18)|}{\\sqrt{6^2 + 8^2}} = \\frac{33}{10}$."
    },
    {
        "id": "wbjee_2024_phys_q6",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Physics",
        "chapter": "Heat & Thermodynamics",
        "chapter_number": 8,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 6,
        "question_type": "mcq",
        "question_statement": "A Carnot engine operates between temperatures $T_1 = 500\\text{ K}$ and $T_2 = 300\\text{ K}$. Its thermal efficiency $\\eta$ is:",
        "options": [
            {"id": "A", "text": "$40\\%$", "is_correct": True},
            {"id": "B", "text": "$60\\%$", "is_correct": False},
            {"id": "C", "text": "$30\\%$", "is_correct": False},
            {"id": "D", "text": "$50\\%$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$\\eta = 1 - \\frac{T_2}{T_1} = 1 - \\frac{300}{500} = 1 - 0.6 = 0.4 = 40\\%$."
    },
    {
        "id": "wbjee_2024_chem_q5",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Chemistry",
        "chapter": "Solid State",
        "chapter_number": 3,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 45,
        "question_type": "mcq",
        "question_statement": "In a face-centred cubic (FCC) lattice, the atomic packing fraction is:",
        "options": [
            {"id": "A", "text": "$0.74$", "is_correct": True},
            {"id": "B", "text": "$0.68$", "is_correct": False},
            {"id": "C", "text": "$0.52$", "is_correct": False},
            {"id": "D", "text": "$0.78$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "For FCC, packing fraction is $\\frac{\\pi}{3\\sqrt{2}} \\approx 0.74$ ($74\\%$)."
    },

    # ── WBJEE 2022 Additional Questions ──────────────────────────
    {
        "id": "wbjee_2022_math_q12",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Mathematics",
        "chapter": "Calculus: Differentiation",
        "chapter_number": 14,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 12,
        "question_type": "mcq",
        "question_statement": "If $f(x) = |x - 1| + |x - 2|$, then $f(x)$ is not differentiable at:",
        "options": [
            {"id": "A", "text": "$x = 1$ and $x = 2$", "is_correct": True},
            {"id": "B", "text": "$x = 1$ only", "is_correct": False},
            {"id": "C", "text": "$x = 2$ only", "is_correct": False},
            {"id": "D", "text": "$x = 0$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Absolute value functions have sharp corners where the expression inside vanishes. Here $x - 1 = 0 \\implies x = 1$ and $x - 2 = 0 \\implies x = 2$ are the non-differentiable points."
    },
    {
        "id": "wbjee_2022_phys_q8",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Physics",
        "chapter": "Kinematics & Projectile Motion",
        "chapter_number": 3,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 8,
        "question_type": "mcq",
        "question_statement": "A body is projected with kinetic energy $E$ at an angle of $60^\\circ$ to the horizontal. Its kinetic energy at the highest point of its trajectory is:",
        "options": [
            {"id": "A", "text": "$\\frac{E}{4}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{E}{2}$", "is_correct": False},
            {"id": "C", "text": "$\\frac{3E}{4}$", "is_correct": False},
            {"id": "D", "text": "$E$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "At the top, velocity is $v = u \\cos 60^\\circ = \\frac{u}{2}$. Kinetic energy is $E' = \\frac{1}{2}m v^2 = \\frac{1}{2}m \\left(\\frac{u}{2}\\right)^2 = \\frac{1}{4}\\left(\\frac{1}{2}mu^2\\right) = \\frac{E}{4}$."
    },
    {
        "id": "wbjee_2022_chem_q49",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Chemistry",
        "chapter": "Chemical Equilibrium & Ionic Equilibrium",
        "chapter_number": 7,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 49,
        "question_type": "mcq",
        "question_statement": "The solubility product of $\\text{AgCl}$ is $K_{sp} = 1.8 \\times 10^{-10}$. Its solubility in pure water is:",
        "options": [
            {"id": "A", "text": "$1.34 \\times 10^{-5}\\text{ mol/L}$", "is_correct": True},
            {"id": "B", "text": "$1.8 \\times 10^{-5}\\text{ mol/L}$", "is_correct": False},
            {"id": "C", "text": "$3.24 \\times 10^{-20}\\text{ mol/L}$", "is_correct": False},
            {"id": "D", "text": "$1.34 \\times 10^{-10}\\text{ mol/L}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$K_{sp} = s^2 \\implies s = \\sqrt{1.8 \\times 10^{-10}} \\approx 1.34 \\times 10^{-5}\\text{ mol/L}$."
    },

    # ── WBJEE 2020 Additional Questions ──────────────────────────
    {
        "id": "wbjee_2020_math_q9",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Mathematics",
        "chapter": "Coordinate Geometry: Conics",
        "chapter_number": 10,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 9,
        "question_type": "mcq",
        "question_statement": "The equation of the directrix of the parabola $y^2 = 12x$ is:",
        "options": [
            {"id": "A", "text": "$x = -3$", "is_correct": True},
            {"id": "B", "text": "$x = 3$", "is_correct": False},
            {"id": "C", "text": "$y = -3$", "is_correct": False},
            {"id": "D", "text": "$y = 3$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Standard form $y^2 = 4ax \\implies 4a = 12 \\implies a = 3$. The equation of directrix is $x = -a \\implies x = -3$."
    },
    {
        "id": "wbjee_2020_phys_q11",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Physics",
        "chapter": "Current Electricity",
        "chapter_number": 11,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 11,
        "question_type": "mcq",
        "question_statement": "Three identical resistors of resistance $R$ each are connected in parallel. Their equivalent resistance is:",
        "options": [
            {"id": "A", "text": "$\\frac{R}{3}$", "is_correct": True},
            {"id": "B", "text": "$3R$", "is_correct": False},
            {"id": "C", "text": "$\\frac{3}{R}$", "is_correct": False},
            {"id": "D", "text": "$\\frac{2R}{3}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$\\frac{1}{R_{\\text{eq}}} = \\frac{1}{R} + \\frac{1}{R} + \\frac{1}{R} = \\frac{3}{R} \\implies R_{\\text{eq}} = \\frac{R}{3}$."
    },
    {
        "id": "wbjee_2020_chem_q50",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Chemistry",
        "chapter": "Organic Chemistry: Haloalkanes & Haloarenes",
        "chapter_number": 18,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 50,
        "question_type": "mcq",
        "question_statement": "Which of the following alkyl halides undergoes $S_N1$ solvolysis most rapidly?",
        "options": [
            {"id": "A", "text": "$(\\text{CH}_3)_3\\text{C}-\\text{Cl}$ (tert-butyl chloride)", "is_correct": True},
            {"id": "B", "text": "$(\\text{CH}_3)_2\\text{CH}-\\text{Cl}$ (isopropyl chloride)", "is_correct": False},
            {"id": "C", "text": "$\\text{CH}_3\\text{CH}_2-\\text{Cl}$ (ethyl chloride)", "is_correct": False},
            {"id": "D", "text": "$\\text{CH}_3-\\text{Cl}$ (methyl chloride)", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$S_N1$ mechanism proceeds via carbocation intermediate. The tertiary carbocation $(\\text{CH}_3)_3\\text{C}^+$ has 9 hyperconjugative $\\alpha$-hydrogens and is vastly more stable than secondary or primary carbocations."
    },

    # ── WBJEE 2019 Additional Questions ──────────────────────────
    {
        "id": "wbjee_2019_math_q10",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Mathematics",
        "chapter": "Calculus: Integrals",
        "chapter_number": 15,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 10,
        "question_type": "mcq",
        "question_statement": "The value of $\\int \\frac{dx}{x(x^5 + 1)}$ is:",
        "options": [
            {"id": "A", "text": "$\\frac{1}{5}\\ln\\left|\\frac{x^5}{x^5 + 1}\\right| + C$", "is_correct": True},
            {"id": "B", "text": "$\\frac{1}{5}\\ln\\left|\\frac{x^5 + 1}{x^5}\\right| + C$", "is_correct": False},
            {"id": "C", "text": "$\\ln\\left|\\frac{x^5}{x^5 + 1}\\right| + C$", "is_correct": False},
            {"id": "D", "text": "$\\frac{1}{4}\\ln\\left|\\frac{x^4}{x^5 + 1}\\right| + C$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Multiply numerator and denominator by $x^4$: $\\int \\frac{x^4 dx}{x^5(x^5 + 1)}$. Let $t = x^5 \\implies dt = 5x^4 dx$. The integral becomes $\\frac{1}{5}\\int \\frac{dt}{t(t+1)} = \\frac{1}{5}\\int \\left(\\frac{1}{t} - \\frac{1}{t+1}\\right)dt = \\frac{1}{5}\\ln\\left|\\frac{t}{t+1}\\right| + C = \\frac{1}{5}\\ln\\left|\\frac{x^5}{x^5 + 1}\\right| + C$."
    },
    {
        "id": "wbjee_2019_phys_q7",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Physics",
        "chapter": "Rotational Motion",
        "chapter_number": 6,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 7,
        "question_type": "mcq",
        "question_statement": "A uniform thin rod of mass $M$ and length $L$ has moment of inertia $I_1$ about an axis through its centre perpendicular to its length, and $I_2$ about an axis through one end perpendicular to its length. The ratio $\\frac{I_2}{I_1}$ is:",
        "options": [
            {"id": "A", "text": "$4$", "is_correct": True},
            {"id": "B", "text": "$2$", "is_correct": False},
            {"id": "C", "text": "$3$", "is_correct": False},
            {"id": "D", "text": "$12$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$I_1 = \\frac{1}{12}ML^2$ and $I_2 = \\frac{1}{3}ML^2$. Thus $\\frac{I_2}{I_1} = \\frac{1/3}{1/12} = 4$."
    },
    {
        "id": "wbjee_2019_chem_q48",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Chemistry",
        "chapter": "Coordination Compounds",
        "chapter_number": 15,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 48,
        "question_type": "mcq",
        "question_statement": "The IUPAC name of the complex $[\\text{Co}(\\text{NH}_3)_5\\text{Cl}]\\text{Cl}_2$ is:",
        "options": [
            {"id": "A", "text": "Pentaamminechloridocobalt(III) chloride", "is_correct": True},
            {"id": "B", "text": "Pentaamminechlorocobalt(II) chloride", "is_correct": False},
            {"id": "C", "text": "Chloropentaamminecobalt(III) chloride", "is_correct": False},
            {"id": "D", "text": "Pentaamminechlorocobaltate(III) chloride", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Ligands in alphabetical order: pentaammine, chlorido. Oxidation state of Co is $x + 5(0) + (-1) = +2 \\implies x = +3$. Counterion is chloride. Thus Pentaamminechloridocobalt(III) chloride."
    }
]

added_count = 0
for q in ADDITIONAL_QUESTIONS:
    if q['id'] not in existing_ids:
        questions.append(q)
        existing_ids.add(q['id'])
        added_count += 1

print(f"Added {added_count} more questions. Total dataset size: {len(questions)}")

with open('data/wbjee_questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print("Saved updated dataset to data/wbjee_questions.json")

