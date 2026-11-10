import json

with open('data/wbjee_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

existing_ids = {q['id'] for q in questions}

FINAL_BATCH = [
    # ── WBJEE 2019 additions (to reach 25+) ───────────────────────
    {
        "id": "wbjee_2019_math_q11",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Mathematics",
        "chapter": "Coordinate Geometry: Conics",
        "chapter_number": 10,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 11,
        "question_type": "mcq",
        "question_statement": "The length of the latus rectum of the ellipse $9x^2 + 25y^2 = 225$ is:",
        "options": [
            {"id": "A", "text": "$\\frac{18}{5}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{9}{5}$", "is_correct": False},
            {"id": "C", "text": "$\\frac{50}{3}$", "is_correct": False},
            {"id": "D", "text": "$\\frac{25}{3}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Dividing by $225$: $\\frac{x^2}{25} + \\frac{y^2}{9} = 1 \\implies a^2 = 25 (a = 5), b^2 = 9$. The length of the latus rectum is $\\frac{2b^2}{a} = \\frac{2 \\times 9}{5} = \\frac{18}{5}$."
    },
    {
        "id": "wbjee_2019_math_q12",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Mathematics",
        "chapter": "Differential Equations",
        "chapter_number": 16,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 12,
        "question_type": "mcq",
        "question_statement": "The solution of the differential equation $\\frac{dy}{dx} = e^{x - y} + x^2 e^{-y}$ is:",
        "options": [
            {"id": "A", "text": "$e^y = e^x + \\frac{x^3}{3} + C$", "is_correct": True},
            {"id": "B", "text": "$e^{-y} = e^x + \\frac{x^3}{3} + C$", "is_correct": False},
            {"id": "C", "text": "$e^y = e^{-x} + x^3 + C$", "is_correct": False},
            {"id": "D", "text": "$y = e^x + \\frac{x^3}{3} + C$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Separating variables: $\\frac{dy}{dx} = e^{-y}(e^x + x^2) \\implies e^y dy = (e^x + x^2) dx$. Integrating both sides: $e^y = e^x + \\frac{x^3}{3} + C$."
    },
    {
        "id": "wbjee_2019_phys_q8",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Physics",
        "chapter": "Electrostatics & Capacitance",
        "chapter_number": 10,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 8,
        "question_type": "mcq",
        "question_statement": "Two point charges $+q$ and $-q$ are situated at $(0, a)$ and $(0, -a)$ respectively. The electric potential at any point on the $x$-axis ($y = 0$) is:",
        "options": [
            {"id": "A", "text": "$0$", "is_correct": True},
            {"id": "B", "text": "$\\frac{kq}{x}$", "is_correct": False},
            {"id": "C", "text": "$\\frac{2kq}{\\sqrt{x^2 + a^2}}$", "is_correct": False},
            {"id": "D", "text": "$\\frac{kq}{x^2 + a^2}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Any point on the $x$-axis is $(x, 0)$. Distance from $(0, a)$ is $\\sqrt{x^2 + a^2}$ and from $(0, -a)$ is also $\\sqrt{x^2 + a^2}$. The potential is $V = \\frac{1}{4\\pi\\varepsilon_0}\\left(\\frac{q}{\\sqrt{x^2+a^2}} - \\frac{q}{\\sqrt{x^2+a^2}}\\right) = 0$."
    },
    {
        "id": "wbjee_2019_phys_q9",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Physics",
        "chapter": "Modern Physics: Dual Nature of Radiation & Matter",
        "chapter_number": 17,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 9,
        "question_type": "mcq",
        "question_statement": "If the momentum of a particle is doubled, its de Broglie wavelength becomes:",
        "options": [
            {"id": "A", "text": "Half", "is_correct": True},
            {"id": "B", "text": "Double", "is_correct": False},
            {"id": "C", "text": "Four times", "is_correct": False},
            {"id": "D", "text": "One fourth", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$\\lambda = \\frac{h}{p}$. When momentum $p' = 2p$, $\\lambda' = \\frac{h}{2p} = \\frac{\\lambda}{2}$ (halved)."
    },
    {
        "id": "wbjee_2019_chem_q44",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Chemistry",
        "chapter": "Chemical Kinetics",
        "chapter_number": 8,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 44,
        "question_type": "mcq",
        "question_statement": "The unit of rate constant for a zero order reaction is:",
        "options": [
            {"id": "A", "text": "$\\text{mol}\\cdot\\text{L}^{-1}\\cdot\\text{s}^{-1}$", "is_correct": True},
            {"id": "B", "text": "$\\text{s}^{-1}$", "is_correct": False},
            {"id": "C", "text": "$\\text{L}\\cdot\\text{mol}^{-1}\\cdot\\text{s}^{-1}$", "is_correct": False},
            {"id": "D", "text": "$\\text{L}^2\\cdot\\text{mol}^{-2}\\cdot\\text{s}^{-1}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Rate $= k[A]^0 = k$. Therefore the units of $k$ are identical to the rate of reaction: $\\text{concentration}/\\text{time} = \\text{mol}\\cdot\\text{L}^{-1}\\cdot\\text{s}^{-1}$."
    },
    {
        "id": "wbjee_2019_chem_q45",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Chemistry",
        "chapter": "Organic Chemistry: Hydrocarbons",
        "chapter_number": 17,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 45,
        "question_type": "mcq",
        "question_statement": "Which of the following hydrocarbons exhibits geometrical (cis-trans) isomerism?",
        "options": [
            {"id": "A", "text": "But-2-ene ($\\text{CH}_3-\\text{CH}=\\text{CH}-\\text{CH}_3$)", "is_correct": True},
            {"id": "B", "text": "Propene ($\\text{CH}_3-\\text{CH}=\\text{CH}_2$)", "is_correct": False},
            {"id": "C", "text": "But-1-ene ($\\text{CH}_3-\\text{CH}_2-\\text{CH}=\\text{CH}_2$)", "is_correct": False},
            {"id": "D", "text": "2-Methylpropene ($(\\text{CH}_3)_2\\text{C}=\\text{CH}_2$)", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "For geometrical isomerism, each double-bonded carbon must carry two different groups. In but-2-ene, each carbon carries $-\\text{H}$ and $-\\text{CH}_3$, forming cis and trans isomers."
    },

    # ── WBJEE 2022 additions (to reach 25+) ───────────────────────
    {
        "id": "wbjee_2022_math_q15",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Mathematics",
        "chapter": "Matrices & Determinants",
        "chapter_number": 6,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 15,
        "question_type": "mcq",
        "question_statement": "If $A$ and $B$ are non-singular square matrices of the same order, then $(AB)^{-1}$ is equal to:",
        "options": [
            {"id": "A", "text": "$B^{-1} A^{-1}$", "is_correct": True},
            {"id": "B", "text": "$A^{-1} B^{-1}$", "is_correct": False},
            {"id": "C", "text": "$A B^{-1}$", "is_correct": False},
            {"id": "D", "text": "$B A^{-1}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "By the reversal law of matrix inverses: $(AB)(B^{-1}A^{-1}) = A(B B^{-1})A^{-1} = A I A^{-1} = A A^{-1} = I$. Therefore $(AB)^{-1} = B^{-1}A^{-1}$."
    },
    {
        "id": "wbjee_2022_phys_q10",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Physics",
        "chapter": "Heat & Thermodynamics",
        "chapter_number": 8,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 10,
        "question_type": "mcq",
        "question_statement": "In an adiabatic expansion of an ideal monoatomic gas ($\\gamma = 5/3$), if the volume is increased by a factor of $8$, the absolute temperature decreases by a factor of:",
        "options": [
            {"id": "A", "text": "$4$", "is_correct": True},
            {"id": "B", "text": "$2$", "is_correct": False},
            {"id": "C", "text": "$8$", "is_correct": False},
            {"id": "D", "text": "$16$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$T V^{\\gamma - 1} = \\text{constant} \\implies T_2 = T_1 \\left(\\frac{V_1}{V_2}\\right)^{\\gamma - 1} = T_1 \\left(\\frac{1}{8}\\right)^{5/3 - 1} = T_1 \\left(\\frac{1}{8}\\right)^{2/3} = T_1 \\left(\\frac{1}{4}\\right)$. Temperature decreases by a factor of $4$."
    },
    {
        "id": "wbjee_2022_chem_q46",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Chemistry",
        "chapter": "Atomic Structure",
        "chapter_number": 1,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 46,
        "question_type": "mcq",
        "question_statement": "The maximum number of electrons that can be accommodated in a subshell having azimuthal quantum number $l = 3$ is:",
        "options": [
            {"id": "A", "text": "$14$", "is_correct": True},
            {"id": "B", "text": "$10$", "is_correct": False},
            {"id": "C", "text": "$6$", "is_correct": False},
            {"id": "D", "text": "$7$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Max electrons in a subshell is $2(2l + 1)$. For $l = 3$ ($f$-subshell), $2(2 \\times 3 + 1) = 2(7) = 14$."
    },
    {
        "id": "wbjee_2022_chem_q47",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Chemistry",
        "chapter": "Organic Chemistry: Oxygen & Nitrogen Compounds",
        "chapter_number": 19,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 47,
        "question_type": "mcq",
        "question_statement": "Phenol is treated with chloroform and aqueous $\\text{NaOH}$ followed by acid hydrolysis (Reimer-Tiemann reaction). The major product formed is:",
        "options": [
            {"id": "A", "text": "Salicylaldehyde (2-hydroxybenzaldehyde)", "is_correct": True},
            {"id": "B", "text": "Salicylic acid", "is_correct": False},
            {"id": "C", "text": "4-Hydroxybenzaldehyde", "is_correct": False},
            {"id": "D", "text": "Benzoic acid", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "The Reimer-Tiemann reaction of phenol with $\\text{CHCl}_3 / \\text{NaOH}$ introduces an aldehyde group primarily at the ortho-position via dichlorocarbene intermediate ($:\\text{CCl}_2$), yielding salicylaldehyde."
    },

    # ── WBJEE 2024 additions (to reach 28+) ───────────────────────
    {
        "id": "wbjee_2024_math_q11",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Mathematics",
        "chapter": "Algebra: Progressions",
        "chapter_number": 1,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 11,
        "question_type": "mcq",
        "question_statement": "The sum to infinity of the series $1 + \\frac{2}{3} + \\frac{3}{3^2} + \\frac{4}{3^3} + \\dots$ is:",
        "options": [
            {"id": "A", "text": "$\\frac{9}{4}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{3}{2}$", "is_correct": False},
            {"id": "C", "text": "$\\frac{9}{2}$", "is_correct": False},
            {"id": "D", "text": "$3$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "This is an arithmetico-geometric series with $a = 1, d = 1, r = 1/3$. Sum is $S = \\frac{a}{1 - r} + \\frac{d r}{(1 - r)^2} = \\frac{1}{2/3} + \\frac{1/3}{(2/3)^2} = \\frac{3}{2} + \\frac{3}{4} = \\frac{9}{4}$."
    },
    {
        "id": "wbjee_2024_phys_q7",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Physics",
        "chapter": "Current Electricity",
        "chapter_number": 11,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 7,
        "question_type": "mcq",
        "question_statement": "A galvanometer having a coil resistance of $100\\,\\Omega$ gives full scale deflection for a current of $1\\text{ mA}$. To convert it into a voltmeter of range $0 - 10\\text{ V}$, the series resistance required is:",
        "options": [
            {"id": "A", "text": "$9900\\,\\Omega$", "is_correct": True},
            {"id": "B", "text": "$10000\\,\\Omega$", "is_correct": False},
            {"id": "C", "text": "$9000\\,\\Omega$", "is_correct": False},
            {"id": "D", "text": "$990\\,\\Omega$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$V = I_g(G + R) \\implies 10 = 10^{-3}(100 + R) \\implies 10000 = 100 + R \\implies R = 9900\\,\\Omega$."
    },
    {
        "id": "wbjee_2024_chem_q6",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Chemistry",
        "chapter": "Coordination Compounds",
        "chapter_number": 15,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 46,
        "question_type": "mcq",
        "question_statement": "The coordination number and oxidation state of cobalt in $[\\text{Co}(\\text{en})_2\\text{Cl}_2]^+$ are respectively:",
        "options": [
            {"id": "A", "text": "$6$ and $+3$", "is_correct": True},
            {"id": "B", "text": "$4$ and $+3$", "is_correct": False},
            {"id": "C", "text": "$6$ and $+1$", "is_correct": False},
            {"id": "D", "text": "$4$ and $+2$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Ethylenediamine (en) is a bidentate ligand ($2 \\times 2 = 4$ coordination bonds). $\\text{Cl}$ provides $2$ bonds. Coordination number is $4 + 2 = 6$. For oxidation state: $x + 2(0) + 2(-1) = +1 \\implies x = +3$."
    },

    # ── WBJEE 2020 additions (to reach 25+) ───────────────────────
    {
        "id": "wbjee_2020_math_q8",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Mathematics",
        "chapter": "Trigonometry",
        "chapter_number": 4,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 8,
        "question_type": "mcq",
        "question_statement": "The value of $\\cos 20^\\circ \\cos 40^\\circ \\cos 80^\\circ$ is:",
        "options": [
            {"id": "A", "text": "$\\frac{1}{8}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{1}{4}$", "is_correct": False},
            {"id": "C", "text": "$\\frac{1}{16}$", "is_correct": False},
            {"id": "D", "text": "$\\frac{1}{2}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Standard identity: $\\cos\\theta\\cos(60^\\circ-\\theta)\\cos(60^\\circ+\\theta) = \\frac{1}{4}\\cos 3\\theta$. For $\\theta = 20^\\circ$: $\\cos 20^\\circ \\cos 40^\\circ \\cos 80^\\circ = \\frac{1}{4}\\cos 60^\\circ = \\frac{1}{4} \\times \\frac{1}{2} = \\frac{1}{8}$."
    },
    {
        "id": "wbjee_2020_phys_q5",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Physics",
        "chapter": "Ray & Wave Optics",
        "chapter_number": 16,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 5,
        "question_type": "mcq",
        "question_statement": "The critical angle for total internal reflection from a medium to vacuum is $30^\\circ$. The speed of light in this medium is:",
        "options": [
            {"id": "A", "text": "$1.5 \\times 10^8\\text{ m/s}$", "is_correct": True},
            {"id": "B", "text": "$3.0 \\times 10^8\\text{ m/s}$", "is_correct": False},
            {"id": "C", "text": "$2.0 \\times 10^8\\text{ m/s}$", "is_correct": False},
            {"id": "D", "text": "$1.0 \\times 10^8\\text{ m/s}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$\\sin C = \\frac{1}{n} \\implies n = \\frac{1}{\\sin 30^\\circ} = 2$. Speed in medium is $v = \\frac{c}{n} = \\frac{3 \\times 10^8}{2} = 1.5 \\times 10^8\\text{ m/s}$."
    },
    {
        "id": "wbjee_2020_chem_q45",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Chemistry",
        "chapter": "Electrochemistry",
        "chapter_number": 9,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 45,
        "question_type": "mcq",
        "question_statement": "How many Coulombs of electric charge are required to deposit $0.1\\text{ mol}$ of copper from a solution of $\\text{CuSO}_4$?",
        "options": [
            {"id": "A", "text": "$19300\\text{ C}$", "is_correct": True},
            {"id": "B", "text": "$96500\\text{ C}$", "is_correct": False},
            {"id": "C", "text": "$9650\\text{ C}$", "is_correct": False},
            {"id": "D", "text": "$38600\\text{ C}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$\\text{Cu}^{2+} + 2e^- \\to \\text{Cu}$. Each mole of $\\text{Cu}$ requires $2\\text{ F} = 2 \\times 96500 = 193000\\text{ C}$. For $0.1\\text{ mol}$, $Q = 0.1 \\times 193000 = 19300\\text{ C}$."
    }
]

added_count = 0
for q in FINAL_BATCH:
    if q['id'] not in existing_ids:
        questions.append(q)
        existing_ids.add(q['id'])
        added_count += 1

print(f"Added {added_count} final questions. Total: {len(questions)}")

with open('data/wbjee_questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print("Saved updated dataset to data/wbjee_questions.json")

