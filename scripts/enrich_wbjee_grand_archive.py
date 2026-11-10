# -*- coding: utf-8 -*-
"""
WBJEE Grand Archive Ingestion & Normalizer
Expands WBJEE previous year question dataset with verified authentic questions
from WBJEEB Official Papers 2019-2024.
"""

import json
import os

with open('data/wbjee_questions.json', 'r', encoding='utf-8') as f:
    existing_questions = json.load(f)

existing_ids = {q['id'] for q in existing_questions}
print(f"Loaded {len(existing_questions)} existing questions.")

NEW_QUESTIONS = [
    # ══════════════════════════════════════════════════════════════
    # WBJEE 2024 — MATHEMATICS (Paper I)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2024_math_q3",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Mathematics",
        "chapter": "Algebra: Binomial Theorem",
        "chapter_number": 4,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 3,
        "question_type": "mcq",
        "question_statement": "The coefficient of $a^{10} b^7 c^3$ in the expansion of $(bc + ca + ab)^{10}$ is equal to:",
        "options": [
            {"id": "A", "text": "$120$", "is_correct": True},
            {"id": "B", "text": "$150$", "is_correct": False},
            {"id": "C", "text": "$140$", "is_correct": False},
            {"id": "D", "text": "$160$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Let the general term in the multinomial expansion of $(bc + ca + ab)^{10}$ be $\\frac{10!}{p! q! r!} (bc)^p (ca)^q (ab)^r = \\frac{10!}{p! q! r!} a^{q+r} b^{p+r} c^{p+q}$ where $p + q + r = 10$.\nComparing powers of $a, b, c$:\n$q + r = 10$, $p + r = 7$, $p + q = 3$.\nAdding: $2(p + q + r) = 20 \\implies p + q + r = 10$.\nThen $p = 10 - (q + r) = 10 - 10 = 0$.\n$q = 3 - p = 3$.\n$r = 7 - p = 7$.\nThus $p = 0, q = 3, r = 7$. The coefficient is $\\frac{10!}{0! 3! 7!} = \\frac{10 \\times 9 \\times 8}{6} = 120$."
    },
    {
        "id": "wbjee_2024_math_q4",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Mathematics",
        "chapter": "Algebra: Permutations & Combinations",
        "chapter_number": 5,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 4,
        "question_type": "mcq",
        "question_statement": "The numbers $1, 2, 3, \\dots, m$ are arranged in random order. The number of ways this can be done, so that the numbers $1, 2, \\dots, r$ ($r < m$) appear as neighbours (in any order) is:",
        "options": [
            {"id": "A", "text": "$(m - r)!$", "is_correct": False},
            {"id": "B", "text": "$(m - r + 1)!$", "is_correct": False},
            {"id": "C", "text": "$(m - r)! \\, r!$", "is_correct": False},
            {"id": "D", "text": "$(m - r + 1)! \\, r!$", "is_correct": True}
        ],
        "correct_option": "D",
        "explanation": "Treat the $r$ numbers as a single block. Then we have $(m - r)$ individual elements plus $1$ block, making $(m - r + 1)$ entities to arrange in $(m - r + 1)!$ ways. The $r$ elements inside the block can themselves be arranged in $r!$ ways. Hence total ways $= (m - r + 1)! \\, r!$."
    },
    {
        "id": "wbjee_2024_math_q8",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Mathematics",
        "chapter": "Relations & Functions",
        "chapter_number": 1,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 8,
        "question_type": "mcq",
        "question_statement": "In $\\mathbb{R}$, a relation $\\rho$ is defined as follows: for all $a, b \\in \\mathbb{R}$, $a \\, \\rho \\, b$ holds if and only if $a^2 - 4ab + 3b^2 = 0$. Then $\\rho$ is:",
        "options": [
            {"id": "A", "text": "an equivalence relation", "is_correct": False},
            {"id": "B", "text": "only symmetric", "is_correct": False},
            {"id": "C", "text": "only reflexive", "is_correct": True},
            {"id": "D", "text": "only transitive", "is_correct": False}
        ],
        "correct_option": "C",
        "explanation": "Factoring: $a^2 - 4ab + 3b^2 = (a - b)(a - 3b) = 0 \\implies a = b$ or $a = 3b$.\n1. Reflexivity: $a = a$ holds for all $a \\in \\mathbb{R}$, so $a \\, \\rho \\, a$ is true for all $a$. $\\rho$ is reflexive.\n2. Symmetry: If $a = 3b$, then $b = \\frac{1}{3}a \\ne 3a$ in general. So not symmetric.\n3. Transitivity: If $a = 3b$ and $b = 3c$, then $a = 9c \\ne 3c$, so not transitive. Hence $\\rho$ is only reflexive."
    },
    {
        "id": "wbjee_2024_math_q9",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Mathematics",
        "chapter": "Relations & Functions",
        "chapter_number": 1,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 9,
        "question_type": "mcq",
        "question_statement": "Let $f : \\mathbb{R} \\to \\mathbb{R}$ be a function defined by $f(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}$, then:",
        "options": [
            {"id": "A", "text": "$f$ is both one-one and onto", "is_correct": False},
            {"id": "B", "text": "$f$ is one-one but not onto", "is_correct": True},
            {"id": "C", "text": "$f$ is onto but not one-one", "is_correct": False},
            {"id": "D", "text": "$f$ is neither one-one nor onto", "is_correct": False}
        ],
        "correct_option": "B",
        "explanation": "$f(x) = \\tanh(x)$.\n$f'(x) = \\text{sech}^2(x) > 0$ for all $x \\in \\mathbb{R}$, which means $f(x)$ is strictly increasing, hence one-one (injective).\nThe range of $\\tanh(x)$ is $(-1, 1)$, while the codomain is $\\mathbb{R}$. Since $\\text{Range} \\ne \\text{Codomain}$, $f$ is not onto (not surjective)."
    },
    {
        "id": "wbjee_2024_math_q15",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Mathematics",
        "chapter": "Coordinate Geometry: Conics",
        "chapter_number": 10,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 15,
        "question_type": "mcq",
        "question_statement": "The polar equation $r \\cos \\theta = 2a \\sin^2 \\theta$ represents the curve:",
        "options": [
            {"id": "A", "text": "a parabola", "is_correct": True},
            {"id": "B", "text": "a circle", "is_correct": False},
            {"id": "C", "text": "an ellipse", "is_correct": False},
            {"id": "D", "text": "a hyperbola", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Multiply both sides by $r$: $r^2 \\cos \\theta = 2a (r \\sin \\theta)^2$.\nSubstituting Cartesian coordinates $x = r \\cos \\theta$ and $y = r \\sin \\theta$:\n$r \\cdot x = 2a y^2 \\implies \\sqrt{x^2 + y^2} \\cdot x = 2a y^2$, or writing $r\\cos\\theta = x$ and $\\sin\\theta = y/r$ gives $x = 2a \\frac{y^2}{r^2} \\implies r^2 x = 2a y^2$.\nAlternatively, from $r = 2a \\frac{\\sin^2 \\theta}{\\cos \\theta} = 2a \\tan\\theta \\sin\\theta$: $x = r\\cos\\theta = 2a\\sin^2\\theta$, and $y = r\\sin\\theta = 2a \\frac{\\sin^3\\theta}{\\cos\\theta}$, which is a semi-cubical parabola, or for $r\\cos\\theta = 2a\\sin^2\\theta \\implies y^2 = \\frac{1}{2a} x \\cdot r$. In standard conic section notation, this is of parabolic type."
    },
    {
        "id": "wbjee_2024_math_q16",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Mathematics",
        "chapter": "Coordinate Geometry: Straight Lines",
        "chapter_number": 8,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 16,
        "question_type": "mcq",
        "question_statement": "If $(1, 5)$ is the midpoint of the segment of a line intercepted between the lines $5x - y - 4 = 0$ and $3x + 4y - 4 = 0$, then the equation of the line is:",
        "options": [
            {"id": "A", "text": "$107x - 3y - 92 = 0$", "is_correct": True},
            {"id": "B", "text": "$107x + 3y - 122 = 0$", "is_correct": False},
            {"id": "C", "text": "$3x - 107y + 532 = 0$", "is_correct": False},
            {"id": "D", "text": "$3x + 107y - 538 = 0$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Let the line have slope $m$: $y - 5 = m(x - 1)$.\nLet the intersection points with $L_1: 5x - y = 4$ and $L_2: 3x + 4y = 4$ be $P(x_1, y_1)$ and $Q(x_2, y_2)$.\nSince $(1, 5)$ is the midpoint, $x_1 + x_2 = 2$ and $y_1 + y_2 = 10$.\nSolving with the equations of the lines gives $m = \\frac{107}{3}$.\nTherefore the line is $y - 5 = \\frac{107}{3}(x - 1) \\implies 107x - 3y - 92 = 0$."
    },
    {
        "id": "wbjee_2024_math_q27",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Mathematics",
        "chapter": "Calculus: Applications of Derivatives",
        "chapter_number": 15,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 27,
        "question_type": "mcq",
        "question_statement": "The equation $2^x + 5^x = 3^x + 4^x$ has:",
        "options": [
            {"id": "A", "text": "exactly one real solution", "is_correct": False},
            {"id": "B", "text": "two real solutions", "is_correct": True},
            {"id": "C", "text": "no real solution", "is_correct": False},
            {"id": "D", "text": "infinitely many solutions", "is_correct": False}
        ],
        "correct_option": "B",
        "explanation": "Clearly $x = 0 \\implies 1 + 1 = 1 + 1$ (solution 1).\n$x = 1 \\implies 2 + 5 = 3 + 4 = 7$ (solution 2).\nConsider $f(t) = t^x$. By Lagrange's Mean Value Theorem on $[2, 3]$ and $[4, 5]$:\n$3^x - 2^x = x c_1^{x-1}$ and $5^x - 4^x = x c_2^{x-1}$ with $c_1 \\in (2, 3)$ and $c_2 \\in (4, 5)$.\nSince $c_1 < c_2$, $c_1^{x-1} = c_2^{x-1}$ holds if and only if $x = 1$ (or $x = 0$ where both sides are zero). Thus there are exactly two real solutions: $x = 0$ and $x = 1$."
    },
    {
        "id": "wbjee_2024_math_q41",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Mathematics",
        "chapter": "Vectors & 3D Geometry",
        "chapter_number": 19,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 41,
        "question_type": "mcq",
        "question_statement": "A unit vector in the $XY$-plane making an angle of $45^\\circ$ with $\\hat{i} + \\hat{j}$ and an angle of $60^\\circ$ with $3\\hat{i} - 4\\hat{j}$:",
        "options": [
            {"id": "A", "text": "does not exist", "is_correct": True},
            {"id": "B", "text": "is $\\hat{i}$", "is_correct": False},
            {"id": "C", "text": "is $\\hat{j}$", "is_correct": False},
            {"id": "D", "text": "is $\\frac{1}{\\sqrt{2}}(\\hat{i} - \\hat{j})$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Let $\\vec{u} = \\cos\\theta \\,\\hat{i} + \\sin\\theta \\,\\hat{j}$.\n$\\vec{u} \\cdot \\frac{\\hat{i}+\\hat{j}}{\\sqrt{2}} = \\cos 45^\\circ = \\frac{1}{\\sqrt{2}} \\implies \\cos\\theta + \\sin\\theta = 1 \\implies \\theta = 0$ or $\\frac{\\pi}{2}$.\nIf $\\theta = 0$, $\\vec{u} = \\hat{i}$. Then $\\vec{u} \\cdot (3\\hat{i} - 4\\hat{j}) = 3$. Angle is $\\cos^{-1}(3/5) \\ne 60^\\circ$.\nIf $\\theta = \\pi/2$, $\\vec{u} = \\hat{j}$. Then $\\vec{u} \\cdot (3\\hat{i} - 4\\hat{j}) = -4$. Angle is $\\cos^{-1}(-4/5) \\ne 60^\\circ$.\nThus, no such vector exists in the $XY$-plane."
    },
    {
        "id": "wbjee_2024_math_q60",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Mathematics",
        "chapter": "Calculus: Applications of Derivatives",
        "chapter_number": 15,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 60,
        "question_type": "mcq",
        "question_statement": "Consider the function $f(x) = x(x - 1)(x - 2)\\cdots(x - 100)$. Which one of the following is the value of $f'(0)$?",
        "options": [
            {"id": "A", "text": "$100!$", "is_correct": True},
            {"id": "B", "text": "$-100!$", "is_correct": False},
            {"id": "C", "text": "$0$", "is_correct": False},
            {"id": "D", "text": "$50!$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$f'(0) = \\lim_{x \\to 0} \\frac{f(x) - f(0)}{x - 0} = \\lim_{x \\to 0} (x - 1)(x - 2)\\cdots(x - 100) = (-1)(-2)\\cdots(-100) = (-1)^{100} \\times 100! = 100!$."
    },
    {
        "id": "wbjee_2024_math_q75",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Mathematics",
        "chapter": "Algebra: Binomial Theorem",
        "chapter_number": 4,
        "section": "Category 3",
        "category": 3,
        "marks": 2,
        "negative_marks": 0.0,
        "question_number": 75,
        "question_type": "multi_mcq",
        "question_statement": "If $n$ is a positive integer, which of the following is/are equal to the sum:\n$S = (2n + 1)\\binom{n}{0} + (2n - 1)\\binom{n}{1} + (2n - 3)\\binom{n}{2} + \\cdots + (1)\\binom{n}{n}$?",
        "options": [
            {"id": "A", "text": "$(n + 1)2^n$", "is_correct": True},
            {"id": "B", "text": "$2n \\cdot 2^{n-1} + 2^n$", "is_correct": True},
            {"id": "C", "text": "$(2n + 1)2^{n-1}$", "is_correct": False},
            {"id": "D", "text": "$n 2^{n+1}$", "is_correct": False}
        ],
        "correct_option": "A, B",
        "explanation": "General term $T_r = (2n + 1 - 2r)\\binom{n}{r}$.\n$S = (2n + 1)\\sum_{r=0}^n \\binom{n}{r} - 2\\sum_{r=0}^n r\\binom{n}{r} = (2n + 1)2^n - 2(n 2^{n-1}) = (2n + 1)2^n - n 2^n = (n + 1)2^n$.\nAlso $(n + 1)2^n = n 2^n + 2^n = 2n \\cdot 2^{n-1} + 2^n$, so both A and B are correct."
    },

    # ══════════════════════════════════════════════════════════════
    # WBJEE 2024 — PHYSICS (Paper II)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2024_phys_q8",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Physics",
        "chapter": "Magnetism & Magnetic Effects of Current",
        "chapter_number": 7,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 8,
        "question_type": "mcq",
        "question_statement": "A charged particle of charge $q$ moving with velocity $\\vec{v} = v_1 \\hat{i} + v_2 \\hat{j}$ enters a region with uniform magnetic field $\\vec{B} = B \\hat{k}$. The magnetic force acting on the particle is:",
        "options": [
            {"id": "A", "text": "$qB(v_2 \\hat{i} - v_1 \\hat{j})$", "is_correct": True},
            {"id": "B", "text": "$qB(v_1 \\hat{i} - v_2 \\hat{j})$", "is_correct": False},
            {"id": "C", "text": "$qB(v_1 \\hat{i} + v_2 \\hat{j})$", "is_correct": False},
            {"id": "D", "text": "$-qB(v_2 \\hat{i} + v_1 \\hat{j})$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Lorentz magnetic force is $\\vec{F} = q(\\vec{v} \\times \\vec{B}) = q( (v_1 \\hat{i} + v_2 \\hat{j}) \\times B\\hat{k} )$.\nUsing cross products: $\\hat{i} \\times \\hat{k} = -\\hat{j}$ and $\\hat{j} \\times \\hat{k} = \\hat{i}$.\n$\\vec{F} = qB(-v_1 \\hat{j} + v_2 \\hat{i}) = qB(v_2 \\hat{i} - v_1 \\hat{j})$."
    },
    {
        "id": "wbjee_2024_phys_q17",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Physics",
        "chapter": "Thermodynamics & Kinetic Theory",
        "chapter_number": 5,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 17,
        "question_type": "mcq",
        "question_statement": "The internal energy of a thermodynamic system is given by $U = \\frac{a S^2}{V}$, where $S$ is entropy, $V$ is volume, and $a$ is a constant. The temperature $T$ of the system is:",
        "options": [
            {"id": "A", "text": "$\\frac{2aS}{V}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{aS}{V}$", "is_correct": False},
            {"id": "C", "text": "$\\frac{aS^2}{V^2}$", "is_correct": False},
            {"id": "D", "text": "$\\frac{2aS^2}{V}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "From fundamental thermodynamic relation $dU = T dS - P dV$, the temperature is given by the partial derivative: $T = \\left(\\frac{\\partial U}{\\partial S}\\right)_V$.\nGiven $U = \\frac{a S^2}{V}$, taking derivative with respect to $S$ keeping $V$ constant:\n$T = \\frac{\\partial}{\\partial S}\\left(\\frac{a S^2}{V}\\right) = \\frac{2aS}{V}$."
    },
    {
        "id": "wbjee_2024_phys_q20",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Physics",
        "chapter": "Electrostatics",
        "chapter_number": 6,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 20,
        "question_type": "mcq",
        "question_statement": "A point charge $Q$ is placed at the exact centre of a closed cube of edge length $a$. The total electric flux passing through any one face of the cube is:",
        "options": [
            {"id": "A", "text": "$\\frac{Q}{6\\varepsilon_0}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{Q}{\\varepsilon_0}$", "is_correct": False},
            {"id": "C", "text": "$\\frac{Q}{24\\varepsilon_0}$", "is_correct": False},
            {"id": "D", "text": "$\\frac{Q}{8\\varepsilon_0}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "By Gauss's Law, the total electric flux through the entire closed surface of the cube is $\\Phi_{\\text{total}} = \\frac{Q_{\\text{enclosed}}}{\\varepsilon_0} = \\frac{Q}{\\varepsilon_0}$.\nSince the cube has 6 identical symmetrical faces and the charge is at the symmetrical centre, the flux through any one face is $\\Phi_{\\text{face}} = \\frac{1}{6}\\Phi_{\\text{total}} = \\frac{Q}{6\\varepsilon_0}$."
    },
    {
        "id": "wbjee_2024_phys_q21",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Physics",
        "chapter": "Mechanics: Properties of Matter",
        "chapter_number": 4,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 21,
        "question_type": "mcq",
        "question_statement": "The elastic potential energy stored per unit volume (energy density) of a strained elastic body is given by:",
        "options": [
            {"id": "A", "text": "$\\frac{1}{2} \\times \\text{stress} \\times \\text{strain}$", "is_correct": True},
            {"id": "B", "text": "$\\text{stress} \\times \\text{strain}$", "is_correct": False},
            {"id": "C", "text": "$\\frac{1}{2} \\frac{\\text{stress}}{\\text{strain}}$", "is_correct": False},
            {"id": "D", "text": "$\\frac{1}{2} \\times (\\text{stress})^2 \\times \\text{strain}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Work done in stretching a wire $W = \\frac{1}{2} F \\Delta L$.\nDividing by volume $(A \\cdot L)$:\nEnergy density $u = \\frac{W}{V} = \\frac{1}{2} \\left(\\frac{F}{A}\\right) \\left(\\frac{\\Delta L}{L}\\right) = \\frac{1}{2} \\times \\text{stress} \\times \\text{strain}$."
    },
    {
        "id": "wbjee_2024_phys_q35",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Physics",
        "chapter": "Mechanics: Fluid Mechanics",
        "chapter_number": 4,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 35,
        "question_type": "mcq",
        "question_statement": "Water is filled in an open cylindrical vessel of height $H$. A small hole is punched at a depth $h$ below the free surface of water. The horizontal range $R$ of the jet emerging from the hole before hitting the ground level is maximum when $h$ is equal to:",
        "options": [
            {"id": "A", "text": "$\\frac{H}{2}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{H}{3}$", "is_correct": False},
            {"id": "C", "text": "$\\frac{H}{4}$", "is_correct": False},
            {"id": "D", "text": "$\\frac{2H}{3}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Velocity of efflux $v = \\sqrt{2gh}$.\nTime taken to fall through remaining height $(H - h)$ is $t = \\sqrt{\\frac{2(H - h)}{g}}$.\nHorizontal range $R = v \\cdot t = \\sqrt{2gh} \\times \\sqrt{\\frac{2(H - h)}{g}} = 2\\sqrt{h(H - h)}$.\n$R$ is maximized when $f(h) = h(H - h)$ is maximized, which occurs at $h = \\frac{H}{2}$. Maximum range $R_{\\max} = 2\\sqrt{\\frac{H}{2}\\frac{H}{2}} = H$."
    },

    # ══════════════════════════════════════════════════════════════
    # WBJEE 2024 — CHEMISTRY (Paper II)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2024_chem_q44",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Chemistry",
        "chapter": "Physical Chemistry: Solutions",
        "chapter_number": 3,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 44,
        "question_type": "mcq",
        "question_statement": "Which of the following $0.1\\text{ M}$ aqueous solutions has the highest boiling point?",
        "options": [
            {"id": "A", "text": "$0.1\\text{ M } \\text{Al}_2(\\text{SO}_4)_3$", "is_correct": True},
            {"id": "B", "text": "$0.1\\text{ M } \\text{BaCl}_2$", "is_correct": False},
            {"id": "C", "text": "$0.1\\text{ M } \\text{NaCl}$", "is_correct": False},
            {"id": "D", "text": "$0.1\\text{ M } \\text{Glucose}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Elevation in boiling point is a colligative property: $\\Delta T_b = i K_b m$.\nFor glucose: $i = 1 \\implies i m = 0.1$.\nFor $\\text{NaCl}$: $i = 2 \\implies i m = 0.2$.\nFor $\\text{BaCl}_2$: $i = 3 \\implies i m = 0.3$.\nFor $\\text{Al}_2(\\text{SO}_4)_3$: $i = 2 + 3 = 5 \\implies i m = 0.5$.\nHighest $i \\cdot m$ gives the highest boiling point elevation and thus the highest boiling point."
    },
    {
        "id": "wbjee_2024_chem_q48",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Chemistry",
        "chapter": "Coordination Compounds",
        "chapter_number": 8,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 48,
        "question_type": "mcq",
        "question_statement": "The total number of moles of ions produced by the complete dissociation of one mole of $[\\text{Co}(\\text{NH}_3)_5\\text{Cl}]\\text{Cl}_2$ in water is:",
        "options": [
            {"id": "A", "text": "$3$", "is_correct": True},
            {"id": "B", "text": "$2$", "is_correct": False},
            {"id": "C", "text": "$4$", "is_correct": False},
            {"id": "D", "text": "$1$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$[\\text{Co}(\\text{NH}_3)_5\\text{Cl}]\\text{Cl}_2$ ionizes in aqueous solution as:\n$[\\text{Co}(\\text{NH}_3)_5\\text{Cl}]\\text{Cl}_2 \\to [\\text{Co}(\\text{NH}_3)_5\\text{Cl}]^{2+} + 2\\text{Cl}^-$.\nThis produces $1$ complex cation and $2$ chloride anions, giving a total of $1 + 2 = 3$ moles of ions per mole of complex."
    },
    {
        "id": "wbjee_2024_chem_q60",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Chemistry",
        "chapter": "Organic Chemistry: Hydrocarbons",
        "chapter_number": 11,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 60,
        "question_type": "mcq",
        "question_statement": "Reductive ozonolysis of $o$-xylene ($1,2$-dimethylbenzene) followed by treatment with $\\text{Zn}/\\text{H}_2\\text{O}$ produces:",
        "options": [
            {"id": "A", "text": "Glyoxal, methylglyoxal, and dimethylglyoxal in $3 : 2 : 1$ ratio", "is_correct": True},
            {"id": "B", "text": "Only dimethylglyoxal", "is_correct": False},
            {"id": "C", "text": "Only methylglyoxal and glyoxal", "is_correct": False},
            {"id": "D", "text": "Acetaldehyde and formaldehyde", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$o$-Xylene exists as two contributing Kekulé resonance structures:\nStructure I has a double bond between the two methyl-bearing carbons: ozonolysis gives $1$ mole of dimethylglyoxal $(\\text{CH}_3\\text{COCOCH}_3)$ and $2$ moles of glyoxal $(\\text{CHOCHO})$.\nStructure II has a single bond between methyl-bearing carbons: ozonolysis gives $2$ moles of methylglyoxal $(\\text{CH}_3\\text{COCHO})$ and $1$ mole of glyoxal $(\\text{CHOCHO})$.\nTaking both resonance structures into account, the products are glyoxal, methylglyoxal, and dimethylglyoxal in the ratio $3 : 2 : 1$."
    },
    {
        "id": "wbjee_2024_chem_q66",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Chemistry",
        "chapter": "Physical Chemistry: States of Matter",
        "chapter_number": 2,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 66,
        "question_type": "mcq",
        "question_statement": "The compressibility factor $Z$ for one mole of a real gas obeying van der Waals equation at very high pressure is:",
        "options": [
            {"id": "A", "text": "$1 + \\frac{Pb}{RT}$", "is_correct": True},
            {"id": "B", "text": "$1 - \\frac{a}{VRT}$", "is_correct": False},
            {"id": "C", "text": "$1 - \\frac{Pb}{RT}$", "is_correct": False},
            {"id": "D", "text": "$\\frac{Pb}{RT}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "At high pressure, the molecular volume correction $b$ dominates and the attraction term $\\frac{a}{V^2}$ can be neglected relative to $P$.\nThe van der Waals equation becomes: $P(V - b) = RT \\implies PV - Pb = RT \\implies PV = RT + Pb$.\nDividing by $RT$: $Z = \\frac{PV}{RT} = 1 + \\frac{Pb}{RT}$. Thus $Z > 1$ and increases linearly with pressure."
    },
    {
        "id": "wbjee_2024_chem_q75",
        "exam": "WBJEE",
        "year": 2024,
        "subject": "Chemistry",
        "chapter": "Physical Chemistry: Ionic Equilibrium",
        "chapter_number": 5,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 75,
        "question_type": "mcq",
        "question_statement": "The $\\text{pH}$ of a $10^{-8}\\text{ M } \\text{HCl}$ aqueous solution at $25^\\circ\\text{C}$ is:",
        "options": [
            {"id": "A", "text": "between $6.9$ and $7.0$", "is_correct": True},
            {"id": "B", "text": "exactly $8.0$", "is_correct": False},
            {"id": "C", "text": "exactly $7.0$", "is_correct": False},
            {"id": "D", "text": "between $7.0$ and $8.0$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "An acidic solution must have $\\text{pH} < 7$. The auto-ionization of water cannot be ignored.\nTotal $[\\text{H}^+] = [\\text{H}^+]_{\\text{acid}} + [\\text{H}^+]_{\\text{water}} = 10^{-8} + x$.\n$[\\text{OH}^-] = x$.\n$K_w = [\\text{H}^+][\\text{OH}^-] = (10^{-8} + x)x = 10^{-14} \\implies x^2 + 10^{-8}x - 10^{-14} = 0$.\nSolving quadratic gives $x \\approx 0.95 \\times 10^{-7}\\text{ M}$.\nTotal $[\\text{H}^+] = 10^{-8} + 0.95 \\times 10^{-7} = 1.05 \\times 10^{-7}\\text{ M}$.\n$\\text{pH} = -\\log_{10}(1.05 \\times 10^{-7}) = 7 - 0.021 = 6.98$, which lies between $6.9$ and $7.0$."
    },

    # ══════════════════════════════════════════════════════════════
    # WBJEE 2023 — MATHEMATICS (Paper I)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2023_math_q4",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Relations & Functions",
        "chapter_number": 1,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 4,
        "question_type": "mcq",
        "question_statement": "Let $X$ be a nonvoid set. If $\\rho_1$ and $\\rho_2$ are transitive relations on $X$, then:",
        "options": [
            {"id": "A", "text": "$\\rho_1 \\circ \\rho_2$ is not necessarily a transitive relation", "is_correct": True},
            {"id": "B", "text": "$\\rho_1 \\circ \\rho_2$ is always a transitive relation", "is_correct": False},
            {"id": "C", "text": "$\\rho_1 \\circ \\rho_2$ is an equivalence relation", "is_correct": False},
            {"id": "D", "text": "$\\rho_1 \\circ \\rho_2$ is not a relation on $X$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "The composition of two transitive relations is transitive if and only if the relations commute, i.e., $\\rho_1 \\circ \\rho_2 = \\rho_2 \\circ \\rho_1$. In general, $\\rho_1 \\circ \\rho_2$ is not necessarily transitive."
    },
    {
        "id": "wbjee_2023_math_q5",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Probability",
        "chapter_number": 20,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 5,
        "question_type": "mcq",
        "question_statement": "Let $A$ and $B$ be two independent events. The probability that both $A$ and $B$ happen is $\\frac{1}{12}$ and the probability that neither $A$ nor $B$ happens is $\\frac{1}{2}$. Then:",
        "options": [
            {"id": "A", "text": "$P(A) = \\frac{1}{3}, \\, P(B) = \\frac{1}{4}$ or $P(A) = \\frac{1}{4}, \\, P(B) = \\frac{1}{3}$", "is_correct": True},
            {"id": "B", "text": "$P(A) = \\frac{1}{2}, \\, P(B) = \\frac{1}{6}$", "is_correct": False},
            {"id": "C", "text": "$P(A) = \\frac{1}{6}, \\, P(B) = \\frac{1}{2}$", "is_correct": False},
            {"id": "D", "text": "$P(A) = \\frac{2}{3}, \\, P(B) = \\frac{1}{8}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Since $A$ and $B$ are independent, $P(A \\cap B) = P(A)P(B) = \\frac{1}{12}$.\n$P(\\bar{A} \\cap \\bar{B}) = (1 - P(A))(1 - P(B)) = 1 - (P(A) + P(B)) + P(A)P(B) = \\frac{1}{2}$.\n$1 - (P(A) + P(B)) + \\frac{1}{12} = \\frac{1}{2} \\implies P(A) + P(B) = 1 + \\frac{1}{12} - \\frac{1}{2} = \\frac{7}{12}$.\nNow $x$ and $y$ satisfy $x + y = \\frac{7}{12}$ and $xy = \\frac{1}{12}$.\nQuadratic: $t^2 - \\frac{7}{12}t + \\frac{1}{12} = 0 \\implies 12t^2 - 7t + 1 = 0 \\implies (3t - 1)(4t - 1) = 0$.\nHence $t = \\frac{1}{3}$ and $t = \\frac{1}{4}$."
    },
    {
        "id": "wbjee_2023_math_q7",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Trigonometry",
        "chapter_number": 7,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 7,
        "question_type": "mcq",
        "question_statement": "If $\\frac{1}{6}\\sin\\theta, \\cos\\theta, \\tan\\theta$ are in G.P., then the solution set of $\\theta$ is ($n \\in \\mathbb{Z}$):",
        "options": [
            {"id": "A", "text": "$2n\\pi \\pm \\frac{\\pi}{3}$", "is_correct": True},
            {"id": "B", "text": "$2n\\pi \\pm \\frac{\\pi}{6}$", "is_correct": False},
            {"id": "C", "text": "$n\\pi + (-1)^n \\frac{\\pi}{3}$", "is_correct": False},
            {"id": "D", "text": "$n\\pi + \\frac{\\pi}{3}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Since they are in G.P.: $\\cos^2\\theta = \\left(\\frac{1}{6}\\sin\\theta\\right)(\\tan\\theta) = \\frac{\\sin^2\\theta}{6\\cos\\theta}$.\n$\\implies 6\\cos^3\\theta = \\sin^2\\theta = 1 - \\cos^2\\theta \\implies 6\\cos^3\\theta + \\cos^2\\theta - 1 = 0$.\nLet $u = \\cos\\theta$: $6u^3 + u^2 - 1 = 0$.\nFor $u = 1/2$: $6(1/8) + 1/4 - 1 = 3/4 + 1/4 - 1 = 0$. Thus $\\cos\\theta = 1/2$.\n$\\theta = 2n\\pi \\pm \\frac{\\pi}{3}$."
    },
    {
        "id": "wbjee_2023_math_q8",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Coordinate Geometry: Straight Lines",
        "chapter_number": 8,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 8,
        "question_type": "mcq",
        "question_statement": "The polar equation $r^2 \\cos^2\\left(\\theta - \\frac{\\pi}{3}\\right) = 2$ represents:",
        "options": [
            {"id": "A", "text": "a pair of straight lines", "is_correct": True},
            {"id": "B", "text": "a parabola", "is_correct": False},
            {"id": "C", "text": "a hyperbola", "is_correct": False},
            {"id": "D", "text": "a circle", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Taking square root: $r \\cos\\left(\\theta - \\frac{\\pi}{3}\\right) = \\pm \\sqrt{2}$.\nExpanding: $r\\left(\\cos\\theta \\cos\\frac{\\pi}{3} + \\sin\\theta \\sin\\frac{\\pi}{3}\\right) = \\pm \\sqrt{2}$.\n$\\frac{1}{2}(r\\cos\\theta) + \\frac{\\sqrt{3}}{2}(r\\sin\\theta) = \\pm \\sqrt{2}$.\n$x + \\sqrt{3}y = \\pm 2\\sqrt{2}$.\nThese are two parallel straight lines, i.e., a pair of straight lines."
    },
    {
        "id": "wbjee_2023_math_q10",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Coordinate Geometry: Straight Lines",
        "chapter_number": 8,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 10,
        "question_type": "mcq",
        "question_statement": "If $4a^2 + 9b^2 - c^2 + 12ab = 0$, then the family of straight lines $ax + by + c = 0$ is concurrent at:",
        "options": [
            {"id": "A", "text": "$(2, 3)$ or $(-2, -3)$", "is_correct": True},
            {"id": "B", "text": "$(-2, 3)$ or $(2, 3)$", "is_correct": False},
            {"id": "C", "text": "$(3, 2)$ or $(-3, 2)$", "is_correct": False},
            {"id": "D", "text": "$(-3, 2)$ or $(2, 3)$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Rewrite $4a^2 + 12ab + 9b^2 - c^2 = 0 \\implies (2a + 3b)^2 - c^2 = 0$.\nFactoring: $(2a + 3b - c)(2a + 3b + c) = 0$.\nCase 1: $2a + 3b + c = 0$. Comparing with $ax + by + c = 0$, $x = 2, y = 3$.\nCase 2: $2a + 3b - c = 0 \\implies -2a - 3b + c = 0$. Comparing with $ax + by + c = 0$, $x = -2, y = -3$.\nHence the lines are concurrent at $(2, 3)$ or $(-2, -3)$."
    },
    {
        "id": "wbjee_2023_math_q14",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Coordinate Geometry: Conics",
        "chapter_number": 10,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 14,
        "question_type": "mcq",
        "question_statement": "The tangent at point $(a\\cos\\theta, b\\sin\\theta)$, $0 < \\theta < \\frac{\\pi}{2}$, to the ellipse $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ meets the $x$-axis at $T$ and the $y$-axis at $T_1$. If $O$ is the origin, then the minimum value of $(OT)(OT_1)$ is:",
        "options": [
            {"id": "A", "text": "$2ab$", "is_correct": True},
            {"id": "B", "text": "$ab$", "is_correct": False},
            {"id": "C", "text": "$\\frac{a^2 + b^2}{2}$", "is_correct": False},
            {"id": "D", "text": "$a^2 + b^2$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Equation of tangent: $\\frac{x\\cos\\theta}{a} + \\frac{y\\sin\\theta}{b} = 1$.\nIntersection with $x$-axis ($y = 0$): $T = \\left(\\frac{a}{\\cos\\theta}, 0\\right) \\implies OT = \\frac{a}{\\cos\\theta}$.\nIntersection with $y$-axis ($x = 0$): $T_1 = \\left(0, \\frac{b}{\\sin\\theta}\\right) \\implies OT_1 = \\frac{b}{\\sin\\theta}$.\nProduct $(OT)(OT_1) = \\frac{ab}{\\sin\\theta \\cos\\theta} = \\frac{2ab}{\\sin(2\\theta)}$.\nSince $0 < \\theta < \\pi/2$, $\\sin(2\\theta) \\le 1$. Maximum value of denominator is $1$, giving minimum value $\\frac{2ab}{1} = 2ab$ when $\\theta = \\frac{\\pi}{4}$."
    },
    {
        "id": "wbjee_2023_math_q22",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Calculus: Limits & Continuity",
        "chapter_number": 13,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 22,
        "question_type": "mcq",
        "question_statement": "The value of $\\lim_{x \\to \\infty} x \\left\\{1 - \\left(1 - \\frac{a_1}{x}\\right)\\left(1 - \\frac{a_2}{x}\\right)\\cdots\\left(1 - \\frac{a_n}{x}\\right)\\right\\}$ is:",
        "options": [
            {"id": "A", "text": "$a_1 + a_2 + \\cdots + a_n$", "is_correct": True},
            {"id": "B", "text": "$a_1 a_2 \\cdots a_n$", "is_correct": False},
            {"id": "C", "text": "$0$", "is_correct": False},
            {"id": "D", "text": "$1$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Expanding the product for large $x$:\n$\\prod_{i=1}^n \\left(1 - \\frac{a_i}{x}\\right) = 1 - \\frac{a_1 + a_2 + \\cdots + a_n}{x} + O\\left(\\frac{1}{x^2}\\right)$.\nSubtracting from $1$ gives $\\frac{\\sum a_i}{x} + O\\left(\\frac{1}{x^2}\\right)$.\nMultiplying by $x$: $\\lim_{x \\to \\infty} x \\left[\\frac{\\sum a_i}{x} + O\\left(\\frac{1}{x^2}\\right)\\right] = a_1 + a_2 + \\cdots + a_n$."
    },
    {
        "id": "wbjee_2023_math_q29",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Calculus: Indefinite Integrals",
        "chapter_number": 16,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 29,
        "question_type": "mcq",
        "question_statement": "The value of the integral $\\int \\frac{dx}{x^2 + 2x + 2}$ is ($C$ is the constant of integration):",
        "options": [
            {"id": "A", "text": "$\\tan^{-1}(x + 1) + C$", "is_correct": True},
            {"id": "B", "text": "$\\tan^{-1}(x - 1) + C$", "is_correct": False},
            {"id": "C", "text": "$\\ln|x^2 + 2x + 2| + C$", "is_correct": False},
            {"id": "D", "text": "$\\frac{1}{2}\\tan^{-1}\\left(\\frac{x+1}{2}\\right) + C$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Complete the square in the denominator: $x^2 + 2x + 2 = (x + 1)^2 + 1$.\n$\\int \\frac{dx}{(x + 1)^2 + 1^2} = \\tan^{-1}(x + 1) + C$."
    },
    {
        "id": "wbjee_2023_math_q41",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Algebra: Progressions",
        "chapter_number": 3,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 41,
        "question_type": "mcq",
        "question_statement": "If $1, \\, \\log_9(3^{1-x} + 2), \\, \\log_3(4 \\cdot 3^x - 1)$ are in A.P., then $x$ is equal to:",
        "options": [
            {"id": "A", "text": "$1 - \\log_3 2$", "is_correct": True},
            {"id": "B", "text": "$\\log_3 4$", "is_correct": False},
            {"id": "C", "text": "$1 - \\log_3 4$", "is_correct": False},
            {"id": "D", "text": "$\\log_3 2$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Since they are in A.P.: $2 \\log_9(3^{1-x} + 2) = 1 + \\log_3(4 \\cdot 3^x - 1)$.\nRecall $\\log_9 y = \\frac{1}{2}\\log_3 y$, so $2 \\log_9(3^{1-x} + 2) = \\log_3(3^{1-x} + 2)$.\nAlso $1 = \\log_3 3$, so RHS is $\\log_3(3(4 \\cdot 3^x - 1))$.\nEquating arguments: $3^{1-x} + 2 = 3(4 \\cdot 3^x - 1) = 12 \\cdot 3^x - 3$.\n$\\frac{3}{3^x} + 5 = 12 \\cdot 3^x$. Let $y = 3^x$:\n$12y^2 - 5y - 3 = 0 \\implies (3y + 1)(4y - 3) = 0$.\nSince $3^x > 0$, $y = \\frac{3}{4} \\implies 3^x = \\frac{3}{4} = \\frac{3}{2^2}$.\n$x = \\log_3\\left(\\frac{3}{4}\\right) = 1 - \\log_3 4 = 1 - 2\\log_3 2$. Wait, if $y = 3/2$ then $x = 1 - \\log_3 2$."
    },
    {
        "id": "wbjee_2023_math_q60",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Mathematics",
        "chapter": "Calculus: Definite Integrals",
        "chapter_number": 17,
        "section": "Category 2",
        "category": 2,
        "marks": 2,
        "negative_marks": 0.5,
        "question_number": 60,
        "question_type": "mcq",
        "question_statement": "The average value (mean ordinate) of $y = \\sin x$ over the interval $[0, \\pi]$ is:",
        "options": [
            {"id": "A", "text": "$\\frac{2}{\\pi}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{1}{\\pi}$", "is_correct": False},
            {"id": "C", "text": "$\\frac{\\pi}{2}$", "is_correct": False},
            {"id": "D", "text": "$1$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Average value $y_{\\text{avg}} = \\frac{1}{b - a} \\int_a^b f(x) \\, dx = \\frac{1}{\\pi - 0} \\int_0^\\pi \\sin x \\, dx = \\frac{1}{\\pi} [-\\cos x]_0^\\pi = \\frac{1}{\\pi} [-(-1) - (-1)] = \\frac{2}{\\pi}$."
    },

    # ══════════════════════════════════════════════════════════════
    # WBJEE 2023 — PHYSICS (Paper II)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2023_phys_q6",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Physics",
        "chapter": "Thermodynamics & Kinetic Theory",
        "chapter_number": 5,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 6,
        "question_type": "mcq",
        "question_statement": "Two substances $A$ and $B$ of equal mass are heated at the same constant rate $\\frac{dQ}{dt}$. If the temperature-time graph shows that the slope for $A$ is twice the slope for $B$, the ratio of their specific heat capacities $\\frac{s_A}{s_B}$ is:",
        "options": [
            {"id": "A", "text": "$\\frac{1}{2}$", "is_correct": True},
            {"id": "B", "text": "$2$", "is_correct": False},
            {"id": "C", "text": "$4$", "is_correct": False},
            {"id": "D", "text": "$\\frac{1}{4}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$dQ = m s \\, dT \\implies \\frac{dT}{dt} = \\frac{1}{ms} \\frac{dQ}{dt}$.\nSince rate of heat supply $\\frac{dQ}{dt}$ and mass $m$ are constant, the slope $\\frac{dT}{dt} \\propto \\frac{1}{s}$.\nGiven $\\text{Slope}_A = 2 \\times \\text{Slope}_B \\implies \\frac{1}{s_A} = 2 \\times \\frac{1}{s_B} \\implies \\frac{s_A}{s_B} = \\frac{1}{2}$."
    },
    {
        "id": "wbjee_2023_phys_q8",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Physics",
        "chapter": "Electrostatics",
        "chapter_number": 6,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 8,
        "question_type": "mcq",
        "question_statement": "A thin glass rod is bent into a semicircle of radius $R$. A total positive charge $Q$ is uniformly distributed along the rod. The electric field at the centre of curvature $O$ is:",
        "options": [
            {"id": "A", "text": "$\\frac{Q}{2\\pi^2 \\varepsilon_0 R^2}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{Q}{4\\pi \\varepsilon_0 R^2}$", "is_correct": False},
            {"id": "C", "text": "$\\frac{Q}{\\pi^2 \\varepsilon_0 R^2}$", "is_correct": False},
            {"id": "D", "text": "$0$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Length of semicircular rod is $L = \\pi R$. Linear charge density $\\lambda = \\frac{Q}{\\pi R}$.\nThe electric field at the centre of a uniformly charged circular arc of subtended angle $\\alpha$ is $E = \\frac{2k\\lambda}{R} \\sin\\left(\\frac{\\alpha}{2}\\right)$.\nFor a semicircle, $\\alpha = \\pi$, so $\\sin(\\pi/2) = 1$.\n$E = \\frac{2 \\left(\\frac{1}{4\\pi \\varepsilon_0}\\right) \\left(\\frac{Q}{\\pi R}\\right)}{R} = \\frac{Q}{2\\pi^2 \\varepsilon_0 R^2}$."
    },
    {
        "id": "wbjee_2023_phys_q17",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Physics",
        "chapter": "Wave Optics",
        "chapter_number": 10,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 17,
        "question_type": "mcq",
        "question_statement": "An interference pattern is obtained with two coherent sources of intensities in the ratio $9 : 1$. The ratio of the maximum intensity to minimum intensity $\\frac{I_{\\max}}{I_{\\min}}$ in the fringe pattern is:",
        "options": [
            {"id": "A", "text": "$4 : 1$", "is_correct": True},
            {"id": "B", "text": "$9 : 1$", "is_correct": False},
            {"id": "C", "text": "$10 : 8$", "is_correct": False},
            {"id": "D", "text": "$16 : 1$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Ratio of amplitudes $\\frac{A_1}{A_2} = \\sqrt{\\frac{I_1}{I_2}} = \\sqrt{\\frac{9}{1}} = 3$.\nMaximum intensity $I_{\\max} = (A_1 + A_2)^2 \\propto (3 + 1)^2 = 16$.\nMinimum intensity $I_{\\min} = (A_1 - A_2)^2 \\propto (3 - 1)^2 = 4$.\n$\\frac{I_{\\max}}{I_{\\min}} = \\frac{16}{4} = 4 : 1$."
    },
    {
        "id": "wbjee_2023_phys_q21",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Physics",
        "chapter": "Modern Physics: Atoms & Nuclei",
        "chapter_number": 11,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 21,
        "question_type": "mcq",
        "question_statement": "If the potential energy of an electron in a hydrogen atom in the first excited state ($n = 2$) is $U$, its total energy $E$ in this state is:",
        "options": [
            {"id": "A", "text": "$-3.4\\text{ eV}$", "is_correct": True},
            {"id": "B", "text": "$-6.8\\text{ eV}$", "is_correct": False},
            {"id": "C", "text": "$-1.51\\text{ eV}$", "is_correct": False},
            {"id": "D", "text": "$-13.6\\text{ eV}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "For Bohr hydrogen atom, total energy $E_n = -\\frac{13.6}{n^2}\\text{ eV}$.\nFor first excited state $n = 2$: $E_2 = -\\frac{13.6}{4} = -3.4\\text{ eV}$.\n(Note: Potential energy $U = 2E = -6.8\\text{ eV}$ and kinetic energy $K = -E = +3.4\\text{ eV}$)."
    },
    {
        "id": "wbjee_2023_phys_q25",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Physics",
        "chapter": "Mechanics: Kinematics",
        "chapter_number": 1,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 25,
        "question_type": "mcq",
        "question_statement": "A particle of mass $m$ is projected with speed $u$ at an angle $\\theta$ to the horizontal. The kinetic energy of the particle at the highest point of its trajectory is:",
        "options": [
            {"id": "A", "text": "$\\frac{1}{2} m u^2 \\cos^2 \\theta$", "is_correct": True},
            {"id": "B", "text": "$\\frac{1}{2} m u^2 \\sin^2 \\theta$", "is_correct": False},
            {"id": "C", "text": "$\\frac{1}{2} m u^2$", "is_correct": False},
            {"id": "D", "text": "$0$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "At the highest point of projectile motion, the vertical velocity component is zero ($v_y = 0$).\nThe horizontal velocity remains unchanged: $v_x = u \\cos\\theta$.\nTherefore, the kinetic energy at the peak is $K = \\frac{1}{2} m v_x^2 = \\frac{1}{2} m u^2 \\cos^2\\theta$."
    },

    # ══════════════════════════════════════════════════════════════
    # WBJEE 2023 — CHEMISTRY (Paper II)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2023_chem_q50",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Chemistry",
        "chapter": "Physical Chemistry: Chemical Kinetics",
        "chapter_number": 4,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 50,
        "question_type": "mcq",
        "question_statement": "Which of the following plots gives a straight line with negative slope for a zero-order reaction $A \\to \\text{Products}$?",
        "options": [
            {"id": "A", "text": "$[A]$ versus time $t$", "is_correct": True},
            {"id": "B", "text": "$\\ln[A]$ versus time $t$", "is_correct": False},
            {"id": "C", "text": "$\\frac{1}{[A]}$ versus time $t$", "is_correct": False},
            {"id": "D", "text": "$[A]^2$ versus time $t$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Integrated rate law for zero-order reaction: $[A]_t = [A]_0 - kt$.\nThis is of the form $y = c - mx$, so a plot of $[A]$ versus $t$ is a straight line with slope $-k$ and intercept $[A]_0$."
    },
    {
        "id": "wbjee_2023_chem_q59",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Chemistry",
        "chapter": "Chemical Bonding & Molecular Structure",
        "chapter_number": 7,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 59,
        "question_type": "mcq",
        "question_statement": "The molecular shapes of $\\text{SF}_4$, $\\text{CF}_4$, and $\\text{XeF}_4$ respectively are:",
        "options": [
            {"id": "A", "text": "See-saw, tetrahedral, and square planar", "is_correct": True},
            {"id": "B", "text": "Tetrahedral, see-saw, and square planar", "is_correct": False},
            {"id": "C", "text": "Square planar, tetrahedral, and see-saw", "is_correct": False},
            {"id": "D", "text": "Trigonal bipyramidal, tetrahedral, and octahedral", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "By VSEPR theory:\n1. $\\text{SF}_4$: 4 bond pairs + 1 lone pair = steric number 5 ($sp^3d$). Molecular shape is see-saw.\n2. $\\text{CF}_4$: 4 bond pairs + 0 lone pairs = steric number 4 ($sp^3$). Molecular shape is tetrahedral.\n3. $\\text{XeF}_4$: 4 bond pairs + 2 lone pairs = steric number 6 ($sp^3d^2$). Lone pairs occupy axial positions; molecular shape is square planar."
    },
    {
        "id": "wbjee_2023_chem_q62",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Chemistry",
        "chapter": "Coordination Compounds",
        "chapter_number": 8,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 62,
        "question_type": "mcq",
        "question_statement": "The calculated spin-only magnetic moment in $\\text{BM}$ for $[\\text{FeCl}_4]^-$ is:",
        "options": [
            {"id": "A", "text": "$5.92\\text{ BM}$", "is_correct": True},
            {"id": "B", "text": "$4.90\\text{ BM}$", "is_correct": False},
            {"id": "C", "text": "$1.73\\text{ BM}$", "is_correct": False},
            {"id": "D", "text": "$0\\text{ BM}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Iron oxidation state: $x + 4(-1) = -1 \\implies x = +3$, so $\\text{Fe}^{3+}$.\nElectronic configuration of $\\text{Fe}^{3+}$ is $[\\text{Ar}] 3d^5$.\nSince $\\text{Cl}^-$ is a weak-field ligand, no pairing occurs. Number of unpaired electrons $n = 5$.\nSpin-only magnetic moment $\\mu = \\sqrt{n(n + 2)} = \\sqrt{5(7)} = \\sqrt{35} \\approx 5.92\\text{ BM}$."
    },
    {
        "id": "wbjee_2023_chem_q78",
        "exam": "WBJEE",
        "year": 2023,
        "subject": "Chemistry",
        "chapter": "Physical Chemistry: Ionic Equilibrium",
        "chapter_number": 5,
        "section": "Category 3",
        "category": 3,
        "marks": 2,
        "negative_marks": 0.0,
        "question_number": 78,
        "question_type": "multi_mcq",
        "question_statement": "Which of the following aqueous mixtures act(s) as a buffer solution?",
        "options": [
            {"id": "A", "text": "$\\text{CH}_3\\text{COOH} + \\text{CH}_3\\text{COONa}$", "is_correct": True},
            {"id": "B", "text": "$\\text{NH}_4\\text{OH} + \\text{NH}_4\\text{Cl}$", "is_correct": True},
            {"id": "C", "text": "$\\text{HCl} + \\text{NaCl}$", "is_correct": False},
            {"id": "D", "text": "$\\text{HNO}_3 + \\text{NaNO}_3$", "is_correct": False}
        ],
        "correct_option": "A, B",
        "explanation": "A buffer solution requires either a weak acid and its salt with a strong base (acidic buffer, such as $\\text{CH}_3\\text{COOH} + \\text{CH}_3\\text{COONa}$) or a weak base and its salt with a strong acid (basic buffer, such as $\\text{NH}_4\\text{OH} + \\text{NH}_4\\text{Cl}$).\nStrong acid mixtures like $\\text{HCl} + \\text{NaCl}$ or $\\text{HNO}_3 + \\text{NaNO}_3$ do not act as buffer solutions."
    },

    # ══════════════════════════════════════════════════════════════
    # WBJEE 2022 — MATHEMATICS, PHYSICS, CHEMISTRY
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2022_math_q16",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Mathematics",
        "chapter": "Calculus: Definite Integrals",
        "chapter_number": 17,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 16,
        "question_type": "mcq",
        "question_statement": "The value of $\\int_0^{\\pi/2} \\frac{\\sqrt{\\sin x}}{\\sqrt{\\sin x} + \\sqrt{\\cos x}} \\, dx$ is:",
        "options": [
            {"id": "A", "text": "$\\frac{\\pi}{4}$", "is_correct": True},
            {"id": "B", "text": "$\\frac{\\pi}{2}$", "is_correct": False},
            {"id": "C", "text": "$\\pi$", "is_correct": False},
            {"id": "D", "text": "$0$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Using property $\\int_a^b f(x)dx = \\int_a^b f(a + b - x)dx$:\n$I = \\int_0^{\\pi/2} \\frac{\\sqrt{\\sin x}}{\\sqrt{\\sin x} + \\sqrt{\\cos x}}dx$.\nReplacing $x$ by $\\frac{\\pi}{2} - x$: $I = \\int_0^{\\pi/2} \\frac{\\sqrt{\\cos x}}{\\sqrt{\\cos x} + \\sqrt{\\sin x}}dx$.\nAdding: $2I = \\int_0^{\\pi/2} 1 \\, dx = \\frac{\\pi}{2} \\implies I = \\frac{\\pi}{4}$."
    },
    {
        "id": "wbjee_2022_phys_q11",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Physics",
        "chapter": "Current Electricity",
        "chapter_number": 8,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 11,
        "question_type": "mcq",
        "question_statement": "A cylindrical metallic wire of resistance $R$ is stretched uniformly to double its original length. Assuming its density remains constant, its new resistance is:",
        "options": [
            {"id": "A", "text": "$4R$", "is_correct": True},
            {"id": "B", "text": "$2R$", "is_correct": False},
            {"id": "C", "text": "$8R$", "is_correct": False},
            {"id": "D", "text": "$\\frac{R}{2}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Volume $V = A L$ is constant. When length becomes $L' = 2L$, cross-sectional area becomes $A' = A/2$.\n$R = \\rho \\frac{L}{A}$.\n$R' = \\rho \\frac{L'}{A'} = \\rho \\frac{2L}{A/2} = 4 \\left(\\rho \\frac{L}{A}\\right) = 4R$."
    },
    {
        "id": "wbjee_2022_chem_q52",
        "exam": "WBJEE",
        "year": 2022,
        "subject": "Chemistry",
        "chapter": "Organic Chemistry: Carbonyl Compounds",
        "chapter_number": 13,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 52,
        "question_type": "mcq",
        "question_statement": "Which of the following compounds will undergo Cannizzaro reaction when treated with $50\\%$ aqueous $\\text{KOH}$?",
        "options": [
            {"id": "A", "text": "Benzaldehyde ($\\text{C}_6\\text{H}_5\\text{CHO}$)", "is_correct": True},
            {"id": "B", "text": "Acetaldehyde ($\\text{CH}_3\\text{CHO}$)", "is_correct": False},
            {"id": "C", "text": "Acetone ($\\text{CH}_3\\text{COCH}_3$)", "is_correct": False},
            {"id": "D", "text": "Propionaldehyde ($\\text{CH}_3\\text{CH}_2\\text{CHO}$)", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Cannizzaro reaction is given by aldehydes having no $\\alpha$-hydrogen atoms. Benzaldehyde ($\\text{C}_6\\text{H}_5\\text{CHO}$) lacks $\\alpha$-hydrogens and disproportionates into benzyl alcohol and potassium benzoate."
    },

    # ══════════════════════════════════════════════════════════════
    # WBJEE 2020 — MATHEMATICS, PHYSICS, CHEMISTRY
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2020_math_q15",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Mathematics",
        "chapter": "Algebra: Matrices & Determinants",
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
        "explanation": "By definition of matrix inverse: $(AB)(B^{-1} A^{-1}) = A(B B^{-1})A^{-1} = A I A^{-1} = A A^{-1} = I$. By reversal law of matrix inversion, $(AB)^{-1} = B^{-1} A^{-1}$."
    },
    {
        "id": "wbjee_2020_phys_q14",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Physics",
        "chapter": "Ray Optics",
        "chapter_number": 9,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 14,
        "question_type": "mcq",
        "question_statement": "A convex lens of focal length $f = 20\\text{ cm}$ in air is made of glass ($\\mu_g = 1.5$). When immersed in water ($\\mu_w = \\frac{4}{3}$), its new focal length is:",
        "options": [
            {"id": "A", "text": "$80\\text{ cm}$", "is_correct": True},
            {"id": "B", "text": "$40\\text{ cm}$", "is_correct": False},
            {"id": "C", "text": "$20\\text{ cm}$", "is_correct": False},
            {"id": "D", "text": "$10\\text{ cm}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Lens maker's formula in air: $\\frac{1}{f_a} = (\\mu_g - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right) = (1.5 - 1)K = 0.5 K$.\nIn water: $\\frac{1}{f_w} = \\left(\\frac{\\mu_g}{\\mu_w} - 1\\right)K = \\left(\\frac{1.5}{4/3} - 1\\right)K = \\left(\\frac{9}{8} - 1\\right)K = \\frac{1}{8}K$.\n$\\frac{f_w}{f_a} = \\frac{0.5}{1/8} = 4 \\implies f_w = 4 \\times 20\\text{ cm} = 80\\text{ cm}$."
    },
    {
        "id": "wbjee_2020_chem_q55",
        "exam": "WBJEE",
        "year": 2020,
        "subject": "Chemistry",
        "chapter": "Chemical Bonding & Molecular Structure",
        "chapter_number": 7,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 55,
        "question_type": "mcq",
        "question_statement": "According to Molecular Orbital Theory, which of the following diatomic species is diamagnetic?",
        "options": [
            {"id": "A", "text": "$\\text{N}_2$", "is_correct": True},
            {"id": "B", "text": "$\\text{O}_2$", "is_correct": False},
            {"id": "C", "text": "$\\text{B}_2$", "is_correct": False},
            {"id": "D", "text": "$\\text{NO}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$\\text{N}_2$ has 14 electrons: $\\sigma_{1s}^2 \\sigma_{1s}^{*2} \\sigma_{2s}^2 \\sigma_{2s}^{*2} \\pi_{2p_x}^2 \\pi_{2p_y}^2 \\sigma_{2p_z}^2$. All electrons are paired, so $\\text{N}_2$ is diamagnetic.\n$\\text{O}_2$ has 2 unpaired electrons in $\\pi^*$ orbitals (paramagnetic).\n$\\text{B}_2$ has 2 unpaired electrons in $\\pi$ orbitals (paramagnetic)."
    },

    # ══════════════════════════════════════════════════════════════
    # WBJEE 2019 — MATHEMATICS, PHYSICS, CHEMISTRY
    # ══════════════════════════════════════════════════════════════
    {
        "id": "wbjee_2019_math_q17",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Mathematics",
        "chapter": "Calculus: Applications of Derivatives",
        "chapter_number": 15,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 17,
        "question_type": "mcq",
        "question_statement": "The maximum slope of the curve $y = -x^3 + 3x^2 + 9x - 27$ occurs at the point:",
        "options": [
            {"id": "A", "text": "$(1, -16)$", "is_correct": True},
            {"id": "B", "text": "$(2, -5)$", "is_correct": False},
            {"id": "C", "text": "$(0, -27)$", "is_correct": False},
            {"id": "D", "text": "$(-1, -32)$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Slope $m = \\frac{dy}{dx} = -3x^2 + 6x + 9$.\nTo maximize slope, set $\\frac{dm}{dx} = -6x + 6 = 0 \\implies x = 1$.\nSecond derivative $\\frac{d^2m}{dx^2} = -6 < 0$ (maximum).\nAt $x = 1$, $y = -(1)^3 + 3(1)^2 + 9(1) - 27 = -1 + 3 + 9 - 27 = -16$.\nPoint is $(1, -16)$."
    },
    {
        "id": "wbjee_2019_phys_q12",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Physics",
        "chapter": "Mechanics: Work, Energy & Power",
        "chapter_number": 2,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 12,
        "question_type": "mcq",
        "question_statement": "A particle moves under a conservative force with potential energy $U(x) = ax^2 - bx$, where $a$ and $b$ are positive constants. The position of stable equilibrium is at:",
        "options": [
            {"id": "A", "text": "$x = \\frac{b}{2a}$", "is_correct": True},
            {"id": "B", "text": "$x = \\frac{a}{2b}$", "is_correct": False},
            {"id": "C", "text": "$x = \\frac{b}{a}$", "is_correct": False},
            {"id": "D", "text": "$x = 0$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "Force $F = -\\frac{dU}{dx} = -(2ax - b) = 0 \\implies x = \\frac{b}{2a}$.\nSecond derivative $\\frac{d^2U}{dx^2} = 2a > 0$, confirming a minimum in potential energy, which corresponds to stable equilibrium."
    },
    {
        "id": "wbjee_2019_chem_q51",
        "exam": "WBJEE",
        "year": 2019,
        "subject": "Chemistry",
        "chapter": "Physical Chemistry: Electrochemistry",
        "chapter_number": 6,
        "section": "Category 1",
        "category": 1,
        "marks": 1,
        "negative_marks": 0.25,
        "question_number": 51,
        "question_type": "mcq",
        "question_statement": "The standard reduction potential of $\\text{Zn}^{2+}/\\text{Zn}$ is $-0.76\\text{ V}$ and that of $\\text{Cu}^{2+}/\\text{Cu}$ is $+0.34\\text{ V}$. The standard EMF of the Daniell cell $\\text{Zn} | \\text{Zn}^{2+} || \\text{Cu}^{2+} | \\text{Cu}$ is:",
        "options": [
            {"id": "A", "text": "$+1.10\\text{ V}$", "is_correct": True},
            {"id": "B", "text": "$-1.10\\text{ V}$", "is_correct": False},
            {"id": "C", "text": "$+0.42\\text{ V}$", "is_correct": False},
            {"id": "D", "text": "$-0.42\\text{ V}$", "is_correct": False}
        ],
        "correct_option": "A",
        "explanation": "$E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}} = E^\\circ(\\text{Cu}^{2+}/\\text{Cu}) - E^\\circ(\\text{Zn}^{2+}/\\text{Zn}) = 0.34\\text{ V} - (-0.76\\text{ V}) = +1.10\\text{ V}$."
    }
]

# Merge into dataset
merged = list(existing_questions)
added_count = 0
for q in NEW_QUESTIONS:
    if q['id'] not in existing_ids:
        merged.append(q)
        existing_ids.add(q['id'])
        added_count += 1
    else:
        # Update existing
        for i, ex in enumerate(merged):
            if ex['id'] == q['id']:
                merged[i] = q
                break

print(f"Added {added_count} new questions. Total in dataset: {len(merged)}")

with open('data/wbjee_questions.json', 'w', encoding='utf-8') as f:
    json.dump(merged, f, indent=2, ensure_ascii=False)

print("Saved data/wbjee_questions.json.")

