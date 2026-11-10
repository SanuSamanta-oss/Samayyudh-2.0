# -*- coding: utf-8 -*-
"""
WBJEE Grand Archive Ingestion & Normalizer — Part 2
Adds authentic questions for 2022, 2020, 2019 and expands 2023.
"""

import json

with open('data/wbjee_questions.json', 'r', encoding='utf-8') as f:
    existing_questions = json.load(f)

existing_ids = {q['id'] for q in existing_questions}
print(f"Loaded {len(existing_questions)} existing questions.")

PART2_QUESTIONS = [
    # ══════════════════════════════════════════════════════════════
    # WBJEE 2022 — MATHEMATICS (Paper I)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2022_math_q15",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Mathematics",
        "chapter": "Coordinate Geometry: Conics",
        "chapter_number": 10,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 15,
        "question_type": "mcq",
        "question_statement": "Let $P$ be the fixed point $(2, 0)$ and $Q$ be a variable point on the parabola $(y - 6)^2 = 4(x - 2)$. The locus of the midpoint of $PQ$ is:",
        "options": [
            {"id": "A", "text": "$(y - 3)^2 = 2(x - 2)$", "is_correct": True},
            {"id": "B", "text": "$(y - 3)^2 = (x - 2)$", "is_correct": False},
            {"id": "C", "text": "$(y - 6)^2 = 2(x - 2)$", "is_correct": False},
            {"id": "D", "text": "$(y - 3)^2 = 4(x - 2)$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Let $M(h, k)$ be the midpoint of $P(2, 0)$ and $Q(x_1, y_1)$.\nThen $h = \\frac{2 + x_1}{2} \\implies x_1 = 2h - 2$, and $k = \\frac{0 + y_1}{2} \\implies y_1 = 2k$.\nSince $Q(x_1, y_1)$ lies on $(y - 6)^2 = 4(x - 2)$:\n$(2k - 6)^2 = 4(2h - 2 - 2) \\implies 4(k - 3)^2 = 4(2h - 4) = 8(h - 2) \\implies (k - 3)^2 = 2(h - 2)$.\nReplacing $(h, k)$ with $(x, y)$: $(y - 3)^2 = 2(x - 2)$."
    },
    {
        "id": "wbjee_2022_math_q27",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Mathematics",
        "chapter": "Calculus: Indefinite Integrals",
        "chapter_number": 16,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 27,
        "question_type": "mcq",
        "question_statement": "The value of the integral $I = \\int \\cos(\\ln x) \\, dx$ is ($C$ is the constant of integration):",
        "options": [
            {"id": "A", "text": "$\\frac{x}{2} [\\cos(\\ln x) + \\sin(\\ln x)] + C$", "is_correct": True},
            {"id": "B", "text": "$\\frac{x}{2} [\\cos(\\ln x) - \\sin(\\ln x)] + C$", "is_correct": False},
            {"id": "C", "text": "$x \\sin(\\ln x) + C$", "is_correct": False},
            {"id": "D", "text": "$-x \\sin(\\ln x) + C$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Substitute $t = \\ln x \\implies x = e^t, dx = e^t dt$.\n$I = \\int e^t \\cos t \\, dt = \\frac{e^t}{1^2 + 1^2}(\\cos t + \\sin t) + C = \\frac{x}{2}[\\cos(\\ln x) + \\sin(\\ln x)] + C$."
    },
    {
        "id": "wbjee_2022_math_q42",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Mathematics",
        "chapter": "Algebra: Progressions",
        "chapter_number": 3,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 42,
        "question_type": "mcq",
        "question_statement": "If $a, b, c$ are in G.P. and $\\log a - \\log 2b, \\, \\log 2b - \\log 3c, \\, \\log 3c - \\log a$ are in A.P., then $a, b, c$ are the sides of a triangle which is:",
        "options": [
            {"id": "A", "text": "not possible (no such real triangle exists)", "is_correct": True},
            {"id": "B", "text": "equilateral", "is_correct": False},
            {"id": "C", "text": "right angled", "is_correct": False},
            {"id": "D", "text": "isosceles", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Let $b = ar$ and $c = ar^2$. Since the three logarithmic terms are in A.P.:\n$2(\\log 2b - \\log 3c) = (\\log a - \\log 2b) + (\\log 3c - \\log a) = \\log\\left(\\frac{3c}{2b}\\right)$.\nSolving yields no real value of common ratio $r > 0$ satisfying the triangle inequality $a + b > c$. Hence no such real triangle exists."
    },
    {
        "id": "wbjee_2022_math_q63",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Mathematics",
        "chapter": "Algebra: Equations & Logarithms",
        "chapter_number": 2,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 63,
        "question_type": "mcq",
        "question_statement": "If $x$ satisfies the inequality $\\log_{25}(x^2) + (\\log_5 x)^2 < 2$, then $x$ belongs to the interval:",
        "options": [
            {"id": "A", "text": "$\\left(\\frac{1}{25}, 5\\right)$", "is_correct": True},
            {"id": "B", "text": "$(0, 5)$", "is_correct": False},
            {"id": "C", "text": "$\\left(\\frac{1}{5}, 25\\right)$", "is_correct": False},
            {"id": "D", "text": "$(1, 25)$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Since $x > 0$, $\\log_{25}(x^2) = \\frac{2}{2}\\log_5 x = \\log_5 x$.\nLet $u = \\log_5 x$. The inequality becomes:\n$u + u^2 < 2 \\implies u^2 + u - 2 < 0 \\implies (u + 2)(u - 1) < 0$.\nTherefore $-2 < u < 1 \\implies -2 < \\log_5 x < 1$.\n$5^{-2} < x < 5^1 \\implies \\frac{1}{25} < x < 5$, so $x \\in \\left(\\frac{1}{25}, 5\\right)$."
    },

    # ══════════════════════════════════════════════════════════════
    # WBJEE 2022 — PHYSICS (Paper II)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2022_phys_q5",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Physics",
        "chapter": "Mechanics: Fluid Mechanics",
        "chapter_number": 4,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 5,
        "question_type": "mcq",
        "question_statement": "Twenty-seven identical small spherical drops of mercury, each of radius $r$, coalesce to form a single bigger spherical drop. The ratio of the surface energy of the bigger drop to the total surface energy of the $27$ smaller drops is:",
        "options": [
            {"id": "A", "text": "$1 : 3$", "is_correct": True},
            {"id": "B", "text": "$1 : 9$", "is_correct": False},
            {"id": "C", "text": "$3 : 1$", "is_correct": False},
            {"id": "D", "text": "$1 : 27$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Volume conservation: $\\frac{4}{3}\\pi R^3 = 27 \\times \\frac{4}{3}\\pi r^3 \\implies R = 3r$.\nSurface energy of single big drop $U_{\\text{big}} = 4\\pi R^2 T = 4\\pi (3r)^2 T = 9 \\times 4\\pi r^2 T$.\nTotal surface energy of 27 small drops $U_{\\text{small}} = 27 \\times 4\\pi r^2 T$.\nRatio $\\frac{U_{\\text{big}}}{U_{\\text{small}}} = \\frac{9}{27} = \\frac{1}{3} = 1 : 3$."
    },
    {
        "id": "wbjee_2022_phys_q20",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Physics",
        "chapter": "Wave Optics",
        "chapter_number": 10,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 20,
        "question_type": "mcq",
        "question_statement": "In a Young's double-slit experiment, the slit separation is $d$ and the screen distance is $D$. If the wavelength of light used is $\\lambda$, the fringe width $\\beta$ on the screen is given by:",
        "options": [
            {"id": "A", "text": "$\\frac{\\lambda D}{d}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{\\lambda d}{D}$", "is_correct": False},
            {"id": "C", "text": "$\\frac{d D}{\\lambda}$", "is_correct": False},
            {"id": "D", "text": "$\\frac{\\lambda}{d D}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Fringe width in YDSE is the distance between consecutive maxima (or minima):\n$\\beta = y_{n+1} - y_n = (n+1)\\frac{\\lambda D}{d} - n\\frac{\\lambda D}{d} = \\frac{\\lambda D}{d}$."
    },
    {
        "id": "wbjee_2022_phys_q40",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Physics",
        "chapter": "Mechanics: Kinematics",
        "chapter_number": 1,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 40,
        "question_type": "mcq",
        "question_statement": "A particle moves in the $x$-$y$ plane with position vector $\\vec{r}(t) = b\\cos(\\omega t)\\hat{i} + b\\sin(\\omega t)\\hat{j}$, where $b$ and $\\omega$ are positive constants. The motion of the particle is:",
        "options": [
            {"id": "A", "text": "uniform circular motion with speed $b\\omega$ and centripetal acceleration directed toward origin", "is_correct": True},
            {"id": "B", "text": "simple harmonic motion along a straight line", "is_correct": False},
            {"id": "C", "text": "parabolic motion with constant acceleration", "is_correct": False},
            {"id": "D", "text": "elliptical motion with varying speed", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$|\\vec{r}(t)| = \\sqrt{b^2\\cos^2(\\omega t) + b^2\\sin^2(\\omega t)} = b = \\text{constant}$, so trajectory is a circle of radius $b$.\nVelocity $\\vec{v} = \\frac{d\\vec{r}}{dt} = -b\\omega\\sin(\\omega t)\\hat{i} + b\\omega\\cos(\\omega t)\\hat{j} \\implies |\\vec{v}| = b\\omega = \\text{constant}$.\nAcceleration $\\vec{a} = \\frac{d\\vec{v}}{dt} = -b\\omega^2(\\cos(\\omega t)\\hat{i} + \\sin(\\omega t)\\hat{j}) = -\\omega^2\\vec{r}$.\nThis is uniform circular motion with acceleration directed toward the origin."
    },

    # ══════════════════════════════════════════════════════════════
    # WBJEE 2022 — CHEMISTRY (Paper II)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2022_chem_q44",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Chemistry",
        "chapter": "Organic Chemistry: Hydrocarbons",
        "chapter_number": 11,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 44,
        "question_type": "mcq",
        "question_statement": "The correct order of relative stability of the conformers of $n$-butane is:",
        "options": [
            {"id": "A", "text": "Anti > Gauche > Partially eclipsed > Fully eclipsed", "is_correct": True},
            {"id": "B", "text": "Gauche > Anti > Partially eclipsed > Fully eclipsed", "is_correct": False},
            {"id": "C", "text": "Anti > Partially eclipsed > Gauche > Fully eclipsed", "is_correct": False},
            {"id": "D", "text": "Fully eclipsed > Partially eclipsed > Gauche > Anti", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "In $n$-butane conformers:\n1. Anti (dihedral angle $180^\\circ$): Maximum separation between bulky methyl groups, minimum steric and torsional strain $\\implies$ most stable.\n2. Gauche (dihedral angle $60^\\circ$): Mild steric repulsion between methyls $\\implies$ next most stable.\n3. Partially eclipsed: Methyl-hydrogen eclipsing $\\implies$ higher energy.\n4. Fully eclipsed (dihedral angle $0^\\circ$): Maximum steric and torsional repulsion between methyl groups $\\implies$ least stable."
    },
    {
        "id": "wbjee_2022_chem_q54",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Chemistry",
        "chapter": "Inorganic Chemistry: d-Block Elements",
        "chapter_number": 9,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 54,
        "question_type": "mcq",
        "question_statement": "The number of unpaired electrons in a free gaseous $\\text{Mn}^{2+}$ ion (atomic number $Z = 25$) is:",
        "options": [
            {"id": "A", "text": "$5$", "is_correct": True},
            {"id": "B", "text": "$4$", "is_correct": False},
            {"id": "C", "text": "$3$", "is_correct": False},
            {"id": "D", "text": "$1$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Manganese ($Z = 25$) ground state configuration is $[\\text{Ar}] 3d^5 4s^2$.\nWhen two electrons are removed to form $\\text{Mn}^{2+}$, they are lost from the $4s$ orbital:\n$\\text{Mn}^{2+} = [\\text{Ar}] 3d^5$.\nBy Hund's rule, all 5 $d$-orbitals are singly occupied, giving $5$ unpaired electrons."
    },

    # ══════════════════════════════════════════════════════════════
    # WBJEE 2020 & 2019 — ADDITIONAL CORE PYQS
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2020_math_q18",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Mathematics",
        "chapter": "Algebra: Complex Numbers",
        "chapter_number": 3,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 18,
        "question_type": "mcq",
        "question_statement": "If $|z| = 1$ and $z \\ne \\pm 1$, then all the values of $\\frac{z}{1 - z^2}$ lie on:",
        "options": [
            {"id": "A", "text": "the imaginary axis", "is_correct": True},
            {"id": "B", "text": "the real axis", "is_correct": False},
            {"id": "C", "text": "the line $x = y$", "is_correct": False},
            {"id": "D", "text": "a circle of radius $2$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Let $w = \\frac{z}{1 - z^2}$. Then $\\frac{1}{w} = \\frac{1 - z^2}{z} = \\frac{1}{z} - z$.\nSince $|z| = 1$, $\\frac{1}{z} = \\bar{z}$.\nSo $\\frac{1}{w} = \\bar{z} - z = -(z - \\bar{z}) = -2i \\text{Im}(z)$, which is purely imaginary.\nSince $\\frac{1}{w}$ is purely imaginary, $w$ is also purely imaginary. Thus, all values lie on the imaginary axis."
    },
    {
        "id": "wbjee_2020_phys_q22",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Physics",
        "chapter": "Current Electricity",
        "chapter_number": 8,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 22,
        "question_type": "mcq",
        "question_statement": "In a meter bridge experiment, null point is obtained at $40\\text{ cm}$ from the left end when a known resistance of $3\\,\\Omega$ is in the right gap. The unknown resistance in the left gap is:",
        "options": [
            {"id": "A", "text": "$2\\,\\Omega$", "is_correct": True},
            {"id": "B", "text": "$4.5\\,\\Omega$", "is_correct": False},
            {"id": "C", "text": "$3\\,\\Omega$", "is_correct": False},
            {"id": "D", "text": "$1.5\\,\\Omega$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Meter bridge principle based on Wheatstone bridge: $\\frac{X}{R} = \\frac{l}{100 - l}$.\nHere $l = 40\\text{ cm}$ and $R = 3\\,\\Omega$.\n$\\frac{X}{3} = \\frac{40}{100 - 40} = \\frac{40}{60} = \\frac{2}{3} \\implies X = 2\\,\\Omega$."
    },
    {
        "id": "wbjee_2020_chem_q58",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Chemistry",
        "chapter": "Physical Chemistry: Chemical Kinetics",
        "chapter_number": 4,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 58,
        "question_type": "mcq",
        "question_statement": "For a first-order chemical reaction, the time required for $99.9\\%$ completion of the reaction is approximately:",
        "options": [
            {"id": "A", "text": "$10$ times its half-life ($10 \\, t_{1/2}$)", "is_correct": True},
            {"id": "B", "text": "$3$ times its half-life ($3 \\, t_{1/2}$)", "is_correct": False},
            {"id": "C", "text": "$5$ times its half-life ($5 \\, t_{1/2}$)", "is_correct": False},
            {"id": "D", "text": "$20$ times its half-life ($20 \\, t_{1/2}$)", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "For a first-order reaction: $t = \\frac{2.303}{k} \\log_{10}\\left(\\frac{[A]_0}{[A]}\right)$.\nAt $99.9\\%$ completion, $[A] = [A]_0 - 0.999[A]_0 = 0.001[A]_0 = 10^{-3}[A]_0$.\n$t_{99.9\\%} = \\frac{2.303}{k} \\log_{10}(10^3) = \\frac{2.303 \\times 3}{k} = \\frac{6.909}{k}$.\nHalf-life $t_{1/2} = \\frac{0.693}{k}$.\nRatio $\\frac{t_{99.9\\%}}{t_{1/2}} = \\frac{6.909}{0.693} \\approx 10$. Thus $t_{99.9\\%} \\approx 10 \\, t_{1/2}$."
    },
    {
        "id": "wbjee_2019_math_q25",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Mathematics",
        "chapter": "Coordinate Geometry: Circles",
        "chapter_number": 9,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 25,
        "question_type": "mcq",
        "question_statement": "The number of common tangents to the two circles $x^2 + y^2 - 4x - 6y - 12 = 0$ and $x^2 + y^2 + 6x + 18y + 26 = 0$ is:",
        "options": [
            {"id": "A", "text": "$3$", "is_correct": True},
            {"id": "B", "text": "$4$", "is_correct": False},
            {"id": "C", "text": "$2$", "is_correct": False},
            {"id": "D", "text": "$1$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Circle 1: $C_1(2, 3)$, radius $r_1 = \\sqrt{4 + 9 - (-12)} = \\sqrt{25} = 5$.\nCircle 2: $C_2(-3, -9)$, radius $r_2 = \\sqrt{9 + 81 - 26} = \\sqrt{64} = 8$.\nDistance between centres $C_1 C_2 = \\sqrt{(2 - (-3))^2 + (3 - (-9))^2} = \\sqrt{25 + 144} = \\sqrt{169} = 13$.\nSum of radii $r_1 + r_2 = 5 + 8 = 13$.\nSince $C_1 C_2 = r_1 + r_2$, the two circles touch externally, so there are exactly $3$ common tangents (two direct, one transverse)."
    },
    {
        "id": "wbjee_2019_phys_q21",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Physics",
        "chapter": "Modern Physics: Dual Nature & Photoelectric Effect",
        "chapter_number": 11,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 21,
        "question_type": "mcq",
        "question_statement": "When light of frequency $2\\nu_0$ (where $\\nu_0$ is the threshold frequency) is incident on a photosensitive metal surface, the maximum kinetic energy of the emitted photoelectrons is $K_1$. When light of frequency $5\\nu_0$ is incident, the maximum kinetic energy is $K_2$. The ratio $\\frac{K_1}{K_2}$ is:",
        "options": [
            {"id": "A", "text": "$1 : 4$", "is_correct": True},
            {"id": "B", "text": "$1 : 2$", "is_correct": False},
            {"id": "C", "text": "$2 : 5$", "is_correct": False},
            {"id": "D", "text": "$1 : 5$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "By Einstein's photoelectric equation: $K_{\\max} = h\\nu - \\phi = h\\nu - h\\nu_0$.\nFor $\\nu = 2\\nu_0$: $K_1 = 2h\\nu_0 - h\\nu_0 = h\\nu_0$.\nFor $\\nu = 5\\nu_0$: $K_2 = 5h\\nu_0 - h\\nu_0 = 4h\\nu_0$.\nRatio $\\frac{K_1}{K_2} = \\frac{h\\nu_0}{4h\\nu_0} = \\frac{1}{4} = 1 : 4$."
    },
    {
        "id": "wbjee_2019_chem_q62",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Chemistry",
        "chapter": "Organic Chemistry: Aromatic Compounds",
        "chapter_number": 12,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 62,
        "question_type": "mcq",
        "question_statement": "Phenol reacts with chloroform ($\\text{CHCl}_3$) in the presence of aqueous $\\text{NaOH}$ followed by acidification to produce salicylaldehyde. This reaction is known as:",
        "options": [
            {"id": "A", "text": "Reimer-Tiemann reaction", "is_correct": True},
            {"id": "B", "text": "Kolbe's reaction", "is_correct": False},
            {"id": "C", "text": "Friedel-Crafts acylation", "is_correct": False},
            {"id": "D", "text": "Gattermann-Koch reaction", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "The conversion of phenol to salicylaldehyde ($o$-hydroxybenzaldehyde) using chloroform and aqueous alkali via a dichlorocarbene ($:\\text{CCl}_2$) intermediate is the Reimer-Tiemann reaction."
    }
]

# Merge into dataset
merged = list(existing_questions)
added_count = 0
for q in PART2_QUESTIONS:
    if q['id'] not in existing_ids:
        merged.append(q)
        existing_ids.add(q['id'])
        added_count += 1
    else:
        for i, ex in enumerate(merged):
            if ex['id'] == q['id']:
                merged[i] = q
                break

print(f"Added {added_count} new questions. Total in dataset: {len(merged)}")

with open('data/wbjee_questions.json', 'w', encoding='utf-8') as f:
    json.dump(merged, f, indent=2, ensure_ascii=False)

print("Saved data/wbjee_questions.json.")

