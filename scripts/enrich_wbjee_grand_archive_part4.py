# -*- coding: utf-8 -*-
"""
WBJEE Grand Archive Ingestion & Normalizer — Part 4
Adds authentic questions from 2020 and 2019 OCR papers.
"""

import json

with open('data/wbjee_questions.json', 'r', encoding='utf-8') as f:
    existing_questions = json.load(f)

existing_ids = {q['id'] for q in existing_questions}
print(f"Loaded {len(existing_questions)} existing questions.")

PART4_QUESTIONS = [
    # ── WBJEE 2019 Mathematics ────────────────────────────────────
    {
        "id": "wbjee_2019_math_q38",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Mathematics",
        "chapter": "Calculus: Applications of Derivatives",
        "chapter_number": 15,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 38,
        "question_type": "mcq",
        "question_statement": "If the radius of a spherical balloon increases by $0.1\\%$, then its volume increases approximately by:",
        "options": [
            {"id": "A", "text": "$0.3\\%$", "is_correct": True},
            {"id": "B", "text": "$0.1\\%$", "is_correct": False},
            {"id": "C", "text": "$0.001\\%$", "is_correct": False},
            {"id": "D", "text": "$0.2\\%$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Volume of a sphere $V = \\frac{4}{3}\\pi r^3$.\nTaking natural logarithm: $\\ln V = \\ln\\left(\\frac{4}{3}\\pi\\right) + 3\\ln r$.\nDifferentiating: $\\frac{dV}{V} = 3\\frac{dr}{r}$.\nPercentage change in volume $\\frac{\\Delta V}{V} \\times 100 = 3\\left(\\frac{\\Delta r}{r} \\times 100\\right) = 3(0.1\\%) = 0.3\\%$."
    },
    {
        "id": "wbjee_2019_math_q44",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Mathematics",
        "chapter": "Algebra: Permutations & Combinations",
        "chapter_number": 5,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 44,
        "question_type": "mcq",
        "question_statement": "A candidate is required to answer $6$ out of $12$ questions which are divided into two groups, each containing $6$ questions. He is not permitted to attempt more than $4$ questions from each group. The number of choices available to him is:",
        "options": [
            {"id": "A", "text": "$850$", "is_correct": True},
            {"id": "B", "text": "$924$", "is_correct": False},
            {"id": "C", "text": "$650$", "is_correct": False},
            {"id": "D", "text": "$720$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "The candidate can choose $(2, 4)$, $(3, 3)$, or $(4, 2)$ questions from Group 1 and Group 2 respectively:\n1. 2 from Group 1, 4 from Group 2: $\\binom{6}{2} \\times \\binom{6}{4} = 15 \\times 15 = 225$.\n2. 3 from Group 1, 3 from Group 2: $\\binom{6}{3} \\times \\binom{6}{3} = 20 \\times 20 = 400$.\n3. 4 from Group 1, 2 from Group 2: $\\binom{6}{4} \\times \\binom{6}{2} = 15 \\times 15 = 225$.\nTotal choices $= 225 + 400 + 225 = 850$."
    },
    {
        "id": "wbjee_2019_math_q60",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Mathematics",
        "chapter": "Calculus: Limits & Continuity",
        "chapter_number": 13,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 60,
        "question_type": "mcq",
        "question_statement": "Let $a = \\min\\{x^2 + 2x + 3 : x \\in \\mathbb{R}\\}$ and $b = \\lim_{\\theta \\to 0} \\frac{1 - \\cos\\theta}{\\theta^2}$. Then the value of $\\sum_{r=0}^n a^r b^{n-r}$ is:",
        "options": [
            {"id": "A", "text": "$\\frac{2^{n+1} - 2^{-n}}{3}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{2^{n+1} - 1}{3}$", "is_correct": False},
            {"id": "C", "text": "$\\frac{2^n - 1}{3}$", "is_correct": False},
            {"id": "D", "text": "$2^{n+1} - 1$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$x^2 + 2x + 3 = (x + 1)^2 + 2 \\implies a = 2$.\n$b = \\lim_{\\theta \\to 0} \\frac{1 - \\cos\\theta}{\\theta^2} = \\frac{1}{2}$.\n$\\sum_{r=0}^n a^r b^{n-r} = b^n \\sum_{r=0}^n \\left(\\frac{a}{b}\\right)^r = \\left(\\frac{1}{2}\\right)^n \\sum_{r=0}^n 4^r = \\frac{1}{2^n} \\frac{4^{n+1} - 1}{3} = \\frac{2^{2n+2} - 1}{3 \\cdot 2^n} = \\frac{2^{n+2} - 2^{-n}}{3}$."
    },

    # ── WBJEE 2020 Mathematics & Physics ──────────────────────────
    {
        "id": "wbjee_2020_math_q12",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Mathematics",
        "chapter": "Vectors & 3D Geometry",
        "chapter_number": 19,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 12,
        "question_type": "mcq",
        "question_statement": "The distance of the point $(1, -2, 3)$ from the plane $x - y + z = 5$ measured parallel to the line $\\frac{x}{2} = \\frac{y}{3} = \\frac{z}{-6}$ is:",
        "options": [
            {"id": "A", "text": "$1$", "is_correct": True},
            {"id": "B", "text": "$7$", "is_correct": False},
            {"id": "C", "text": "$\\frac{1}{7}$", "is_correct": False},
            {"id": "D", "text": "$\\sqrt{7}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Equation of line through $(1, -2, 3)$ parallel to direction $(2, 3, -6)$ is:\n$\\frac{x - 1}{2} = \\frac{y + 2}{3} = \\frac{z - 3}{-6} = t$.\nAny point on line is $P(1 + 2t, -2 + 3t, 3 - 6t)$.\nSubstitute into plane $x - y + z = 5$:\n$(1 + 2t) - (-2 + 3t) + (3 - 6t) = 5 \\implies 6 - 7t = 5 \\implies 7t = 1 \\implies t = \\frac{1}{7}$.\nDistance $= \\sqrt{(2t)^2 + (3t)^2 + (-6t)^2} = |t|\\sqrt{4 + 9 + 36} = |t|\\sqrt{49} = 7|t| = 7\\left(\\frac{1}{7}\\right) = 1$."
    },
    {
        "id": "wbjee_2020_phys_q18",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Physics",
        "chapter": "Electromagnetic Induction & AC",
        "chapter_number": 8,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 18,
        "question_type": "mcq",
        "question_statement": "In a series $RLC$ circuit at resonance, the impedance of the circuit is:",
        "options": [
            {"id": "A", "text": "minimum and equal to resistance $R$", "is_correct": True},
            {"id": "B", "text": "maximum and equal to resistance $R$", "is_correct": False},
            {"id": "C", "text": "zero", "is_correct": False},
            {"id": "D", "text": "purely inductive", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Impedance of series $RLC$ circuit is $Z = \\sqrt{R^2 + (\\omega L - \\frac{1}{\\omega C})^2}$.\nAt resonance, $\\omega L = \\frac{1}{\\omega C}$, so the reactive part is zero and $Z = R$ (minimum), resulting in maximum current."
    },
    {
        "id": "wbjee_2020_chem_q48",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Chemistry",
        "chapter": "Chemical Bonding & Molecular Structure",
        "chapter_number": 7,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 48,
        "question_type": "mcq",
        "question_statement": "The bond order of $\\text{O}_2^+$ ion according to Molecular Orbital Theory is:",
        "options": [
            {"id": "A", "text": "$2.5$", "is_correct": True},
            {"id": "B", "text": "$2.0$", "is_correct": False},
            {"id": "C", "text": "$1.5$", "is_correct": False},
            {"id": "D", "text": "$3.0$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$\\text{O}_2^+$ has $16 - 1 = 15$ electrons: $N_b = 10, N_a = 5$.\n$\\text{Bond Order} = \\frac{N_b - N_a}{2} = \\frac{10 - 5}{2} = \\frac{5}{2} = 2.5$."
    }
]

merged = list(existing_questions)
added_count = 0
for q in PART4_QUESTIONS:
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

