# ============================================================
# SamayYudh 2.0 — Math & Physics Notation Normalizer
# Ensures all questions & options use authentic LaTeX typography,
# exact physics symbols, proper units, and complete option sets.
# ============================================================

import json
import re
import hashlib
import os

def fp(s):
    return hashlib.sha256(s.strip().encode('utf-8')).hexdigest()

def normalize_all():
    db_path = os.path.join('data', 'pyq_database.json')
    with open(db_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    questions = data['questions']
    q_map = {q['id']: q for q in questions}

    # ============================================================
    # 1. Targeted Fixes for JEE Main 2025 Jan 22 Shift 1
    # ============================================================
    p = 'jee_main_2025_btech_20250122_shift1'

    # Phys Q6 - Diode bias
    qid = f'{p}_phys_q6'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'From the given options, identify the semiconductor diode circuit connected in forward bias:'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$p$-side at $+2\text{ V}$, $n$-side at $-2\text{ V}$ (Forward Bias)'},
            {'key': '2', 'text': r'$p$-side at $-3\text{ V}$, $n$-side at $-1\text{ V}$ (Reverse Bias)'},
            {'key': '3', 'text': r'$p$-side at $0\text{ V}$, $n$-side at $+3\text{ V}$ (Reverse Bias)'},
            {'key': '4', 'text': r'$p$-side at $-2\text{ V}$, $n$-side at $+2\text{ V}$ (Reverse Bias)'}
        ]
        q_map[qid]['correct_option'] = '1'

    # Phys Q7
    qid = f'{p}_phys_q7'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'The radius of an electron in the ground state of hydrogen is $a_0$. '
            r'The radius of an electron in $\text{He}^+$ ion in its $3^{\text{rd}}$ excited state ($n = 4$) is $a$. '
            r'Then the ratio $\frac{a_0}{a}$ is equal to:'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$\frac{1}{2}$'},
            {'key': '2', 'text': r'$\frac{1}{4}$'},
            {'key': '3', 'text': r'$\frac{1}{16}$'},
            {'key': '4', 'text': r'$\frac{1}{8}$'}
        ]
        q_map[qid]['correct_option'] = '4'

    # Phys Q8
    qid = f'{p}_phys_q8'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'Ice at $-10^\circ\text{C}$ is to be converted into steam at $110^\circ\text{C}$. '
            r'The mass of ice is $m = 10^{-3}\text{ kg} = 1\text{ g}$. '
            r'(Given: specific heat of ice $s_{\text{ice}} = 0.5\text{ cal}\cdot\text{g}^{-1}\cdot{^\circ\text{C}}^{-1}$, '
            r'latent heat of fusion $L_f = 80\text{ cal/g}$, specific heat of water $s_w = 1\text{ cal}\cdot\text{g}^{-1}\cdot{^\circ\text{C}}^{-1}$, '
            r'latent heat of vaporization $L_v = 540\text{ cal/g}$, specific heat of steam $s_{\text{steam}} = 0.5\text{ cal}\cdot\text{g}^{-1}\cdot{^\circ\text{C}}^{-1}$). '
            r'What total amount of heat $\Delta Q$ is required?'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$\Delta Q = 730\text{ cal}$'},
            {'key': '2', 'text': r'$\Delta Q = 900\text{ cal}$'},
            {'key': '3', 'text': r'$\Delta Q = 1210\text{ cal}$'},
            {'key': '4', 'text': r'$\Delta Q = 870\text{ cal}$'}
        ]
        q_map[qid]['correct_option'] = '1'

    # Phys Q9
    qid = f'{p}_phys_q9'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'A point charge $q$ is placed at the center of an edge of an imaginary cube of side $a$ as shown in the figure. '
            r'Find the net electric flux $\Phi$ passing through this cube:'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$\frac{q}{\varepsilon_0}$'},
            {'key': '2', 'text': r'$\frac{q}{4\varepsilon_0}$'},
            {'key': '3', 'text': r'$\frac{q}{8\varepsilon_0}$'},
            {'key': '4', 'text': r'$\frac{q}{2\varepsilon_0}$'}
        ]
        q_map[qid]['correct_option'] = '2'

    # Phys Q10
    qid = f'{p}_phys_q10'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'A closed organ pipe vibrating in its $9^{\text{th}}$ harmonic resonates with the $4^{\text{th}}$ harmonic '
            r'of an open organ pipe. If the length of the closed organ pipe is $l_{\text{closed}} = 10\text{ cm}$, '
            r'find the length $L_0$ of the open organ pipe:'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$L_0 = \frac{100}{9}\text{ cm}$'},
            {'key': '2', 'text': r'$L_0 = \frac{110}{7}\text{ cm}$'},
            {'key': '3', 'text': r'$L_0 = \frac{80}{9}\text{ cm}$'},
            {'key': '4', 'text': r'$L_0 = 15\text{ cm}$'}
        ]
        q_map[qid]['correct_option'] = '3'

    # Phys Q12
    qid = f'{p}_phys_q12'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'Which of the following graphs correctly represents the variation of electrical resistivity $\rho$ '
            r'with absolute temperature $T$ for a semiconductor?'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'Resistivity $\rho$ decreases exponentially with temperature $T$'},
            {'key': '2', 'text': r'Resistivity $\rho$ increases linearly with temperature $T$'},
            {'key': '3', 'text': r'Resistivity $\rho$ remains constant with temperature $T$'},
            {'key': '4', 'text': r'Resistivity $\rho$ is proportional to $T^2$'}
        ]
        q_map[qid]['correct_option'] = '1'

    # Phys Q13
    qid = f'{p}_phys_q13'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'If the entire Young’s Double Slit Experiment (YDSE) apparatus is immersed in a liquid of refractive index $\mu$, '
            r'then what is the effect on the fringe width $\beta$?'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'Fringe width increases by a factor of $\mu$'},
            {'key': '2', 'text': r'Fringe width decreases to $\beta / \mu$'},
            {'key': '3', 'text': r'Fringe width remains unchanged'},
            {'key': '4', 'text': r'Fringe pattern completely disappears'}
        ]
        q_map[qid]['correct_option'] = '2'

    # Chem Q1
    qid = f'{p}_chem_q1'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'For the coordination complex ion $[\text{NiCl}_4]^{2-}$, what is the oxidation state on the nickel atom '
            r'and the spatial geometry of the complex respectively?'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$+2$, Tetrahedral'},
            {'key': '2', 'text': r'$+2$, Square Planar'},
            {'key': '3', 'text': r'$+4$, Tetrahedral'},
            {'key': '4', 'text': r'$+4$, Square Planar'}
        ]
        q_map[qid]['correct_option'] = '1'

    # Chem Q2
    qid = f'{p}_chem_q2'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'Compare the boiling points of the following given aqueous solutions:'
            r'\n(i) $10^{-4}\text{ M NaCl}$'
            r'\n(ii) $10^{-3}\text{ M NaCl}$'
            r'\n(iii) $10^{-2}\text{ M NaCl}$'
            r'\n(iv) $10^{-4}\text{ M Urea}$'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$\text{I} > \text{II} > \text{III} > \text{IV}$'},
            {'key': '2', 'text': r'$\text{III} > \text{II} > \text{I} > \text{IV}$'},
            {'key': '3', 'text': r'$\text{II} > \text{I} > \text{III} > \text{IV}$'},
            {'key': '4', 'text': r'$\text{III} > \text{I} > \text{II} > \text{IV}$'}
        ]
        q_map[qid]['correct_option'] = '2'

    # Chem Q3
    qid = f'{p}_chem_q3'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'Which of the following represents the correct decreasing order of electronegativity for the halogens?'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$\text{F} > \text{Cl} > \text{I} > \text{Br}$'},
            {'key': '2', 'text': r'$\text{Cl} > \text{F} > \text{Br} > \text{I}$'},
            {'key': '3', 'text': r'$\text{F} > \text{Cl} > \text{Br} > \text{I}$'},
            {'key': '4', 'text': r'$\text{Br} > \text{F} > \text{I} > \text{Cl}$'}
        ]
        q_map[qid]['correct_option'] = '3'

    # Chem Q4
    qid = f'{p}_chem_q4'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'Which of the following isoelectronic ions has the maximum ionic radius?'
            r'\n$\text{Al}^{3+}, \text{Mg}^{2+}, \text{F}^-, \text{Na}^+$'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$\text{Al}^{3+}$'},
            {'key': '2', 'text': r'$\text{Mg}^{2+}$'},
            {'key': '3', 'text': r'$\text{F}^-$'},
            {'key': '4', 'text': r'$\text{Na}^+$'}
        ]
        q_map[qid]['correct_option'] = '3'

    # Chem Q7
    qid = f'{p}_chem_q7'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'Consider the heterogeneous chemical equilibrium: '
            r'$\text{CO}_2(g) + \text{C}(s) \rightleftharpoons 2\text{CO}(g)$. '
            r'If the initial pressure of $\text{CO}_2$ is $0.6\text{ atm}$ and the total pressure at equilibrium is $0.8\text{ atm}$, '
            r'find the equilibrium constant $K_p$ (in $\text{atm}$):'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$0.4\text{ atm}$'},
            {'key': '2', 'text': r'$0.2\text{ atm}$'},
            {'key': '3', 'text': r'$0.6\text{ atm}$'},
            {'key': '4', 'text': r'$0.8\text{ atm}$'}
        ]
        q_map[qid]['correct_option'] = '1'

    # Chem Q10
    qid = f'{p}_chem_q10'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'An electron of a $\text{He}^+$ ion is in its $3^{\text{rd}}$ excited state ($n = 4$). '
            r'Find its de Broglie wavelength $\lambda$:'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$6.64\,\text{\AA}$'},
            {'key': '2', 'text': r'$66\,\text{\AA}$'},
            {'key': '3', 'text': r'$3.32\,\text{\AA}$'},
            {'key': '4', 'text': r'$13.28\,\text{\AA}$'}
        ]
        q_map[qid]['correct_option'] = '1'

    # Chem Q13
    qid = f'{p}_chem_q13'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'If the partial pressure of $\text{CO}_2$ gas at equilibrium is $0.4\text{ atm}$ and the total pressure is $1.0\text{ atm}$, '
            r'find the value of $K_p$ for the decomposition reaction:'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$0.027\text{ atm}^3$'},
            {'key': '2', 'text': r'$0.064\text{ atm}^3$'},
            {'key': '3', 'text': r'$0.144\text{ atm}^3$'},
            {'key': '4', 'text': r'$0.216\text{ atm}^3$'}
        ]
        q_map[qid]['correct_option'] = '3'

    # Math Q3
    qid = f'{p}_math_q3'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'Let set $A = \{1, 2, 3\}$. The total number of non-empty equivalence relations that can be defined on set $A$ is:'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$5$'},
            {'key': '2', 'text': r'$6$'},
            {'key': '3', 'text': r'$8$'},
            {'key': '4', 'text': r'$9$'}
        ]
        q_map[qid]['correct_option'] = '1'

    # Math Q4
    qid = f'{p}_math_q4'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'If $f(x) = 16(\sec^{-1}x)^2 + (\csc^{-1}x)^2$, then the minimum value of $f(x)$ is:'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$\frac{4\pi^2}{17}$'},
            {'key': '2', 'text': r'$\frac{16\pi^2}{17}$'},
            {'key': '3', 'text': r'$\frac{\pi^2}{4}$'},
            {'key': '4', 'text': r'$\frac{1105\pi^2}{68}$'}
        ]
        q_map[qid]['correct_option'] = '1'

    # Math Q8
    qid = f'{p}_math_q8'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'Find the coefficient of $x^{2012}$ in the algebraic expansion of $(1 - x)^{2008}(1 + x + x^2)^{2007}$:'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$-{^{2007}C_{670}}$'},
            {'key': '2', 'text': r'${^{2007}C_{671}}$'},
            {'key': '3', 'text': r'$0$'},
            {'key': '4', 'text': r'${^{2008}C_{671}}$'}
        ]
        q_map[qid]['correct_option'] = '1'

    # ============================================================
    # 2. Targeted Fixes for 22 Jan Shift 2
    # ============================================================
    p = 'jee_main_2025_btech_20250122_shift2'

    # Phys Q5
    qid = f'{p}_phys_q5'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'A conducting circular ring of radius $r$ is moving with a constant velocity $\vec{v}$ in a uniform magnetic field $\vec{B}$ '
            r'directed perpendicular to the plane of the ring. Find the motional electromotive force (EMF) induced between two diametrically opposite points:'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$2 B v r$'},
            {'key': '2', 'text': r'$B v r$'},
            {'key': '3', 'text': r'$0$'},
            {'key': '4', 'text': r'$\pi B v r$'}
        ]
        q_map[qid]['correct_option'] = '3'

    # Phys Q7
    qid = f'{p}_phys_q7'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'In a series LCR circuit, the maximum amplitude of current at electrical resonance is $I_0$. '
            r'If the quality factor of the circuit is $Q$ and bandwidth is $\Delta\omega$, find the current amplitude at the half-power frequencies:'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$\frac{I_0}{\sqrt{2}}$'},
            {'key': '2', 'text': r'$\frac{I_0}{2}$'},
            {'key': '3', 'text': r'$\frac{I_0}{\sqrt{3}}$'},
            {'key': '4', 'text': r'$I_0 \sqrt{2}$'}
        ]
        q_map[qid]['correct_option'] = '1'

    # Phys Q16
    qid = f'{p}_phys_q16'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'In the RC circuit shown in the diagram, at steady state (when the capacitor $C$ is fully charged), '
            r'find the total electrical current $I$ drawn from the battery of potential $V$:'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$\frac{3V}{5R}$'},
            {'key': '2', 'text': r'$\frac{8V}{13R}$'},
            {'key': '3', 'text': r'$\frac{13V}{8R}$'},
            {'key': '4', 'text': r'$\frac{5V}{3R}$'}
        ]
        q_map[qid]['correct_option'] = '2'

    # Phys Q17
    qid = f'{p}_phys_q17'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'A glass slab of refractive index $\mu_g = 1.44$ is coated with a thin film of refractive index $\mu_f = 2.0$. '
            r'The minimum thickness $t_{\text{min}}$ of the film so that maximum transmission of green light '
            r'of wavelength $\lambda = 5000\,\text{\AA}$ (incident normally) takes place is:'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$0.500\,\mu\text{m}$'},
            {'key': '2', 'text': r'$0.250\,\mu\text{m}$'},
            {'key': '3', 'text': r'$0.125\,\mu\text{m}$'},
            {'key': '4', 'text': r'$1.000\,\mu\text{m}$'}
        ]
        q_map[qid]['correct_option'] = '3'

    # Chem Q2
    qid = f'{p}_chem_q2'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'The density of a $3\text{ M}$ aqueous $\text{NaOH}$ solution is $1.25\text{ g/mL}$. '
            r'The molality $m$ (in $\text{mol}\cdot\text{kg}^{-1}$) of this solution is:'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$2.65\text{ m}$'},
            {'key': '2', 'text': r'$2.50\text{ m}$'},
            {'key': '3', 'text': r'$2.80\text{ m}$'},
            {'key': '4', 'text': r'$3.00\text{ m}$'}
        ]
        q_map[qid]['correct_option'] = '1'

    # Chem Q14
    qid = f'{p}_chem_q14'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'What is the relation between solubility product $K_{\text{sp}}$ and molar solubility $S$ for the sparingly soluble salt $\text{Zr}_3(\text{PO}_4)_4$?'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$K_{\text{sp}} = 6912\,S^7$'},
            {'key': '2', 'text': r'$S = \left(\frac{K_{\text{sp}}}{6912}\right)^{1/7}$'},
            {'key': '3', 'text': r'$K_{\text{sp}} = 108\,S^5$'},
            {'key': '4', 'text': r'$K_{\text{sp}} = 256\,S^4$'}
        ]
        q_map[qid]['correct_option'] = '2'

    # ============================================================
    # 3. Targeted Fixes for 24 Jan Shift 1
    # ============================================================
    p = 'jee_main_2025_btech_20250124_shift1'

    # Phys Q1
    qid = f'{p}_phys_q1'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'If an alternating current is expressed as $I = I_A \sin(\omega t) + I_B \cos(\omega t)$, '
            r'then find the root-mean-square value $I_{\text{rms}}$ of the current:'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$\sqrt{\frac{I_A^2 + I_B^2}{2}}$'},
            {'key': '2', 'text': r'$\frac{I_A + I_B}{\sqrt{2}}$'},
            {'key': '3', 'text': r'$\sqrt{I_A^2 + I_B^2}$'},
            {'key': '4', 'text': r'$\frac{\sqrt{I_A I_B}}{2}$'}
        ]
        q_map[qid]['correct_option'] = '1'

    # Phys Q2
    qid = f'{p}_phys_q2'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'What is the relative shift in focal length $\frac{\Delta f}{f}$ of a convex lens '
            r'when optical light of wavelength $\lambda_1 = 400\text{ nm}$ is replaced by light of wavelength $\lambda_2 = 700\text{ nm}$?'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$\frac{\Delta f}{f} = \frac{\Delta \mu}{\mu - 1}$'},
            {'key': '2', 'text': r'$\frac{\Delta f}{f} = \frac{\mu - 1}{\Delta \mu}$'},
            {'key': '3', 'text': r'$\frac{\Delta f}{f} = -\frac{\Delta \mu}{\mu - 1}$'},
            {'key': '4', 'text': r'$\frac{\Delta f}{f} = 0$'}
        ]
        q_map[qid]['correct_option'] = '3'

    # Phys Q11
    qid = f'{p}_phys_q11'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'A plano-convex lens of refractive index $\mu = 1.5$ has a curved surface of radius of curvature $R = 20\text{ cm}$. '
            r'Find the focal length $f$ of the lens in air:'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$f = 40\text{ cm}$'},
            {'key': '2', 'text': r'$f = 20\text{ cm}$'},
            {'key': '3', 'text': r'$f = 10\text{ cm}$'},
            {'key': '4', 'text': r'$f = 30\text{ cm}$'}
        ]
        q_map[qid]['correct_option'] = '1'

    # Phys Q15
    qid = f'{p}_phys_q15'
    if qid in q_map:
        q_map[qid]['question_statement'] = (
            r'In simple harmonic motion (SHM) given by $x = A \sin(\omega t)$ with time period $T = 2\text{ s}$, '
            r'find the minimum time taken by the oscillating particle to move from the mean position to $x = \frac{A}{2}$:'
        )
        q_map[qid]['options'] = [
            {'key': '1', 'text': r'$t = \frac{1}{6}\text{ s}$'},
            {'key': '2', 'text': r'$t = \frac{1}{12}\text{ s}$'},
            {'key': '3', 'text': r'$t = \frac{1}{4}\text{ s}$'},
            {'key': '4', 'text': r'$t = \frac{1}{3}\text{ s}$'}
        ]
        q_map[qid]['correct_option'] = '1'

    # ============================================================
    # 4. Universal Text Sanitizer across All Remaining Questions
    # ============================================================
    # Normalizes units and math notation in statement & options
    REPLACEMENTS = [
        (r'\b106\s*m/s\b', r'$10^6\\text{ m/s}$'),
        (r'\b105\s*m/s\b', r'$10^5\\text{ m/s}$'),
        (r'\b10\^6\s*m/s\b', r'$10^6\\text{ m/s}$'),
        (r'\b(\d+)\s*m/s\b', r'$\1\\text{ m/s}$'),
        (r'\b(\d+)\s*cm\b', r'$\1\\text{ cm}$'),
        (r'\b(\d+)\s*mm\b', r'$\1\\text{ mm}$'),
        (r'\b(\d+)\s*nm\b', r'$\1\\text{ nm}$'),
        (r'\b(\d+)\s*eV\b', r'$\1\\text{ eV}$'),
        (r'\b(\d+)\s*kg\b', r'$\1\\text{ kg}$'),
        (r'\b(\d+)\s*Hz\b', r'$\1\\text{ Hz}$'),
        (r'\b(\d+)\s*K\b', r'$\1\\text{ K}$'),
        (r'\b(\d+)\s*V\b', r'$\1\\text{ V}$'),
        (r'\b(\d+)\s*A\b', r'$\1\\text{ A}$'),
        (r'\b(\d+)\s*ohm\b', r'$\1\\,\\Omega$'),
        (r'\b(\d+)\s*Ohm\b', r'$\1\\,\\Omega$'),
        (r'\\mu\s*g\b', r'\\mu_g'),
        (r'\\mu\s*f\b', r'\\mu_f'),
    ]

    for q in questions:
        stmt = q['question_statement']
        for pat, rep in REPLACEMENTS:
            stmt = re.sub(pat, rep, stmt)
        q['question_statement'] = stmt
        q['fingerprint'] = fp(stmt)

        # Options normalization
        if q.get('options'):
            for opt in q['options']:
                txt = opt['text']
                # Wrap bare standalone fractions in $...$
                if txt.startswith(r'\frac') and not txt.startswith('$'):
                    opt['text'] = f"${txt}$"
                elif txt.startswith(r'\sqrt') and not txt.startswith('$'):
                    opt['text'] = f"${txt}$"
                elif re.match(r'^[0-9\+\-\*/\.\s]+$', txt.strip()) and len(txt.strip()) > 0 and not txt.startswith('$'):
                    opt['text'] = f"${txt.strip()}$"

    with open(db_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print("Mathematical & Physics Sign normalization complete across all questions!")

if __name__ == '__main__':
    normalize_all()

