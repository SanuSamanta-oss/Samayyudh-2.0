#!/usr/bin/env python3
"""
scripts/sanitize_pyq_data.py - comprehensive symbol translation (clean)
Cleans and normalizes all 352 questions in data/pyq_database.json.
"""

import json
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = 'data/pyq_database.json'

with open(DB_PATH, 'r', encoding='utf-8') as f:
    db = json.load(f)

questions = db['questions']
papers = db['papers']

UNICODE_MAP = {
    '\uf06d': r'\mu ',
    '\uf065': r'\varepsilon ',
    '\uf0de': r'\implies ',
    '\uf0ba': r'\equiv ',
    '\uf0f2': r'\int ',
    '\uf0b4': r'\times ',
    '\uf044': r'\Delta ',
    '\uf072': r'\rho ',
    '\uf074': r'\tau ',
    '\uf077': r'\omega ',
    '\uf070': r'\pi ',
    '\uf061': r'\alpha ',
    '\uf062': r'\beta ',
    '\uf067': r'\gamma ',
    '\uf071': r'\theta ',
    '\uf06c': r'\lambda ',
    '\uf073': r'\sigma ',
    '\uf064': r'\delta ',
    '\uf057': r'\Omega ',
    '\uf066': r'\phi ',
    '\uf0a5': r'\infty ',
    '\uf0b9': r'\neq ',
    '\uf0a3': r'\leq ',
    '\uf03c': '<',
    '\uf03e': '>',
    '\uf03d': '=',
    '\uf02b': '+',
    '\uf02d': '-',
    '\uf0ae': r'\rightarrow ',
    '\uf0b0': r'^\circ',
    '\uf0ce': r'\in ',
    '\uf0c7': r'\cap ',
    '\uf0c8': r'\cup ',
    '\uf05b': '[',
    '\uf05d': ']',
    '\uf02c': ',',
    '\uf0a2': "'",
    '\uf0e6': '(',
    '\uf0f6': ')',
    '\uf0e7': '(',
    '\uf0f7': ')',
    '\uf0e8': '(',
    '\uf0f8': ')',
    '\uf0e9': '[',
    '\uf0ea': '[',
    '\uf0eb': '[',
    '\uf0f9': ']',
    '\uf0fa': ']',
    '\uf0fb': ']',
    '\uf8f1': '{',
    '\uf8f2': '',
    '\uf8f3': '',
    '\uf8eb': '(',
    '\uf8ec': '',
    '\uf8ed': '',
    '\uf8f6': ')',
    '\uf8f7': '',
    '\uf8f8': '',
    '\uf8ee': '[',
    '\uf8ef': '',
    '\uf8f0': '',
    '\uf8f9': ']',
    '\uf8fa': '',
    '\uf8fb': ']',
    '\u2013': '-',
    '\u2014': '-',
    '\u2212': '-',
    '': r'\neq ',
}

def clean_text_symbols(text: str) -> str:
    if not text:
        return ''
    for k, v in UNICODE_MAP.items():
        text = text.replace(k, v)
    return text

def clean_sentence_flow(text: str) -> str:
    text = clean_text_symbols(text)
    paragraphs = text.split('\n\n')
    cleaned_paras = []
    
    for para in paragraphs:
        lines = [l.strip() for l in para.split('\n') if l.strip()]
        if not lines:
            continue
        
        reconstructed = []
        for line in lines:
            if re.match(r'^(?:\([a-zA-Z0-9ivxLCDM]+\)|[a-zA-Z0-9ivxLCDM]+\.|\-|\*)\s+', line):
                reconstructed.append('\n' + line)
            elif reconstructed and not reconstructed[-1].endswith('\n') and not reconstructed[-1].endswith(':'):
                if reconstructed[-1].endswith('-'):
                    reconstructed[-1] = reconstructed[-1][:-1] + line
                else:
                    reconstructed[-1] += ' ' + line
            else:
                reconstructed.append(line)
        cleaned_paras.append(' '.join(reconstructed).strip())
        
    res = '\n\n'.join(cleaned_paras)
    res = re.sub(r'[ \t]+', ' ', res)
    return res.strip()

def sanitize_option_text(text: str) -> str:
    if not text:
        return ''
    text = clean_text_symbols(text)
    text = re.sub(r'^\s*(?:\([1-4a-dA-D]\)|[1-4a-dA-D]\.|\b[1-4]\b)\s*', '', text)
    text = re.sub(r'\s*\([1-4]\)\s*$', '', text)
    text = re.sub(r'\s*\([1-4]\)\s*', ' ', text)
    
    m_frac = re.match(r'^(\d+)\s*\n\s*(\d+)(?:\s*([a-zA-Z]+))?$', text.strip())
    if m_frac:
        num, den, unit = m_frac.groups()
        unit_str = f" {unit}" if unit else ""
        return f"$\\frac{{{num}}}{{{den}}}{unit_str}$"
        
    m_frac2 = re.match(r'^(\d+)\s*\n\s*(\d+)\s*\n\s*([a-zA-Z]+)$', text.strip())
    if m_frac2:
        num, den, unit = m_frac2.groups()
        return f"$\\frac{{{num}}}{{{den}}}{unit}$"
        
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    cleaned = ' '.join(lines)
    cleaned = re.sub(r'[ \t]+', ' ', cleaned).strip()
    
    # ensure space after \mu
    cleaned = re.sub(r'\\mu([a-zA-Z])', r'\\mu \1', cleaned)
    
    if r'\Delta' in cleaned or r'\mu' in cleaned or r'\varepsilon' in cleaned or r'\neq' in cleaned:
        if not cleaned.startswith('$') and not cleaned.endswith('$'):
            cleaned = f"${cleaned}$"
            
    return cleaned

def format_math_expressions(statement: str, subject: str) -> str:
    statement = re.sub(r'\b10-(\d+)\b', r'$10^{-\1}$', statement)
    statement = re.sub(r'(-?\d+)\s*(?:°C|° C)\b', r'$\1^\\circ\\text{C}$', statement)
    
    statement = re.sub(r'\bHe\+\b', r'$\\text{He}^+$', statement)
    statement = re.sub(r'\bAl3\+\b', r'$\\text{Al}^{3+}$', statement)
    statement = re.sub(r'\bMg2\+\b', r'$\\text{Mg}^{2+}$', statement)
    statement = re.sub(r'\bNa\+\b', r'$\\text{Na}^+$', statement)
    statement = re.sub(r'\bF-\b', r'$\\text{F}^-$', statement)
    statement = re.sub(r'\\mu([a-zA-Z])', r'\\mu \1', statement)
    statement = re.sub(r'\$\$+', r'$', statement)
    return statement

KNOWN_CORRECTIONS = {
    'jee_main_2025_btech_20250122_shift1_phys_q1': {
        'statement': (
            "A parallel plate capacitor is charged by a battery and then the battery is disconnected. "
            "A dielectric slab of dielectric constant $K$ is now inserted between the plates. "
            "If the initial charge on the capacitor was $Q_1$ and the final charge is $Q_2$, find the ratio $\\frac{Q_1}{Q_2}$."
        ),
        'options': [
            {'key': '1', 'text': '$1$'},
            {'key': '2', 'text': '$\\frac{3}{2}$'},
            {'key': '3', 'text': '$2$'},
            {'key': '4', 'text': '$K$'},
        ]
    },
    'jee_main_2025_btech_20250122_shift1_phys_q2': {
        'statement': (
            "A solid sphere of mass $M$ and radius $R$ exerts a gravitational force $F$ on a point mass. "
            "Now a concentric spherical mass of $\\frac{7}{8} M$ is removed from the sphere. "
            "What is the new gravitational force exerted on the point mass?"
        ),
        'options': [
            {'key': '1', 'text': '$\\frac{7}{8} F$'},
            {'key': '2', 'text': '$\\frac{1}{8} F$'},
            {'key': '3', 'text': '$\\frac{5}{7} F$'},
            {'key': '4', 'text': '$\\frac{3}{7} F$'},
        ]
    },
    'jee_main_2025_btech_20250122_shift1_phys_q3': {
        'statement': "Find out the equivalent capacitance $C_{\\text{eq}}$ for the situation shown in the figure.",
        'options': [
            {'key': '1', 'text': '$\\frac{\\varepsilon_0 A}{d} \\left( \\frac{K_1 K_2}{K_1 + K_2} + K_3 \\right)$'},
            {'key': '2', 'text': '$\\frac{2 \\varepsilon_0 A}{d} \\left( \\frac{K_1 K_2 + K_2 K_3 + K_3 K_1}{K_1 + K_2} \\right)$'},
            {'key': '3', 'text': '$\\frac{\\varepsilon_0 A}{2d} \\left( \\frac{K_1 K_2}{K_1 + K_2} + 2K_3 \\right)$'},
            {'key': '4', 'text': '$\\frac{\\varepsilon_0 A}{d} \\left( \\frac{K_1 K_2 K_3}{K_1 + K_2 + K_3} \\right)$'},
        ]
    },
    'jee_main_2025_btech_20250122_shift1_phys_q4': {
        'statement': (
            "From a solid sphere of mass $M$ and radius $R$, a spherical cavity of radius $\\frac{R}{2}$ is created. "
            "Find the moment of inertia about an axis passing through the centre of the sphere and the cavity."
        ),
        'options': [
            {'key': '1', 'text': '$\\frac{31}{80} M R^2$'},
            {'key': '2', 'text': '$\\frac{13}{32} M R^2$'},
            {'key': '3', 'text': '$\\frac{21}{32} M R^2$'},
            {'key': '4', 'text': '$\\frac{31}{48} M R^2$'},
        ]
    },
    'jee_main_2025_btech_20250122_shift1_phys_q5': {
        'statement': "Find the radius of curvature $R$ of the common surface of two soap bubbles with radii $R_1$ and $R_2$ ($R_1 > R_2$).",
        'options': [
            {'key': '1', 'text': '$R = \\frac{R_1 R_2}{R_1 - R_2}$'},
            {'key': '2', 'text': '$R = \\frac{R_1 R_2}{R_1 + R_2}$'},
            {'key': '3', 'text': '$R = \\frac{R_1 - R_2}{R_1 R_2}$'},
            {'key': '4', 'text': '$R = \\sqrt{R_1 R_2}$'},
        ]
    },
    'jee_main_2025_btech_20250122_shift1_phys_q7': {
        'statement': (
            "The radius of electron in the ground state of hydrogen is $a_0$. "
            "The radius of electron in $\\text{He}^+$ ion in the 3rd excited state is $a$. "
            "Then the ratio $\\frac{a_0}{a}$ is:"
        ),
        'options': [
            {'key': '1', 'text': '$\\frac{1}{4}$'},
            {'key': '2', 'text': '$\\frac{1}{16}$'},
            {'key': '3', 'text': '$\\frac{1}{8}$'},
            {'key': '4', 'text': '$\\frac{1}{2}$'},
        ]
    },
    'jee_main_2025_btech_20250122_shift1_phys_q8': {
        'statement': "Ice at $-10^\\circ\\text{C}$ is to be converted into steam at $110^\\circ\\text{C}$. Mass of ice is $10^{-3}\\text{ kg}$. What amount of heat $\\Delta Q$ is required?",
        'options': [
            {'key': '1', 'text': '$\\Delta Q = 730\\text{ cal}$'},
            {'key': '2', 'text': '$\\Delta Q = 900\\text{ cal}$'},
            {'key': '3', 'text': '$\\Delta Q = 1210\\text{ cal}$'},
            {'key': '4', 'text': '$\\Delta Q = 870\\text{ cal}$'},
        ]
    },
    'jee_main_2025_btech_20250122_shift1_phys_q15': {
        'statement': "The equiconvex lens shown in figure is silvered on one side. For what distance of object from the lens is the image formed on the object itself?",
        'options': [
            {'key': '1', 'text': '$\\mu R$'},
            {'key': '2', 'text': '$\\frac{R}{2\\mu - 2}$'},
            {'key': '3', 'text': '$\\frac{R}{2\\mu - 1}$'},
            {'key': '4', 'text': '$\\frac{R}{\\mu}$'},
        ]
    },
    'jee_main_2025_btech_20250122_shift1_math_q1': {
        'statement': (
            "The shortest distance between the lines\n"
            "$$\\frac{x - 1}{2} = \\frac{y - 2}{3} = \\frac{z - 1}{4} \\quad \\text{and} \\quad \\frac{x + 2}{7} = \\frac{y - 2}{8} = \\frac{z + 1}{2}$$\n"
            "is:"
        ),
        'options': [
            {'key': '1', 'text': '$\\frac{88}{\\sqrt{1277}}$'},
            {'key': '2', 'text': '$\\frac{78}{\\sqrt{1277}}$'},
            {'key': '3', 'text': '$\\frac{55}{\\sqrt{1277}}$'},
            {'key': '4', 'text': '$\\frac{66}{\\sqrt{1277}}$'},
        ]
    },
    'jee_main_2025_btech_20250122_shift1_math_q2': {
        'statement': (
            "In a bag there are 6 white and 4 black balls. Two balls are drawn at random. "
            "The probability that both balls are white is:"
        ),
        'options': [
            {'key': '1', 'text': '$\\frac{1}{3}$'},
            {'key': '2', 'text': '$\\frac{1}{2}$'},
            {'key': '3', 'text': '$\\frac{2}{3}$'},
            {'key': '4', 'text': '$\\frac{1}{4}$'},
        ]
    },
}

for q in questions:
    qid = q['id']
    if qid in KNOWN_CORRECTIONS:
        q['question_statement'] = KNOWN_CORRECTIONS[qid]['statement']
        q['options'] = KNOWN_CORRECTIONS[qid]['options']
        continue
        
    stmt = q['question_statement']
    stmt = clean_sentence_flow(stmt)
    stmt = format_math_expressions(stmt, q['subject'])
    q['question_statement'] = stmt
    
    if q.get('options'):
        new_opts = []
        for opt in q['options']:
            opt_text = sanitize_option_text(opt['text'])
            if opt_text:
                new_opts.append({'key': str(opt['key']), 'text': opt_text})
        new_opts = sorted(new_opts, key=lambda o: str(o['key']))
        q['options'] = new_opts

with open(DB_PATH, 'w', encoding='utf-8') as f:
    json.dump({'papers': papers, 'questions': questions}, f, indent=2, ensure_ascii=False)

print("Comprehensive symbol sanitization completed successfully.")
