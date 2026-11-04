# ============================================================
# SamayYudh 2.0 — Enhanced JEE Advanced Chemistry Parser
# Extracts complete question statements, chemical reaction schemes,
# KaTeX formulas, option tabs, solutions, and reaction diagrams.
# ============================================================

import sys
import os
import re
import json
import urllib.request
from bs4 import BeautifulSoup, Tag

sys.stdout.reconfigure(encoding='utf-8')

UNICODE_SYMBOL_MAP = {
    '\uf077': r'\omega',
    '\uf06d': r'\mu',
    '\uf065': r'\varepsilon',
    '\uf0de': r'\implies',
    '\uf0ba': r'\equiv',
    '\uf0f2': r'\int',
    '\uf0b4': r'\times',
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
    '\u2013': '-',
    '\u2014': '-',
    '\u2212': '-',
    '': r'\rightarrow',
    '⇌': r'\rightleftharpoons',
    '⇄': r'\rightleftharpoons',
    '→': r'\rightarrow',
    '↔': r'\leftrightarrow',
    '∆': r'\Delta',
    'Δ': r'\Delta',
    '°': r'^{\circ}',
    '': r'\alpha',
    '': r'\beta',
    '': r'\gamma',
    '': r'\pi',
    '': r'\sigma',
    '': r'\lambda',
    '': r'\theta',
}

def clean_chemistry_latex(text: str) -> str:
    """Cleans up raw text and normalizes chemical/physical notations into KaTeX."""
    for char, rep in UNICODE_SYMBOL_MAP.items():
        text = text.replace(char, rep)

    # Standardize units and chemical constants
    text = re.sub(r'(\d+)\s*kJ\s*/\s*mol\b', r'$\1\\text{ kJ/mol}$', text)
    text = re.sub(r'(\d+)\s*kcal\s*/\s*mol\b', r'$\1\\text{ kcal/mol}$', text)
    text = re.sub(r'(\d+)\s*J\s*/\s*mol\b', r'$\1\\text{ J/mol}$', text)
    text = re.sub(r'(\d+)\s*kJ\b', r'$\1\\text{ kJ}$', text)
    text = re.sub(r'(\d+)\s*atm\b', r'$\1\\text{ atm}$', text)
    text = re.sub(r'(\d+)\s*bar\b', r'$\1\\text{ bar}$', text)
    text = re.sub(r'(\d+)\s*mol\s*L\^\{-1\}', r'$\1\\text{ mol L}^{-1}$', text)
    text = re.sub(r'(\d+)\s*g\s*mol\^\{-1\}', r'$\1\\text{ g mol}^{-1}$', text)
    text = re.sub(r'(\d+)\s*mol\b', r'$\1\\text{ mol}$', text)
    text = re.sub(r'(\d+)\s*pm\b', r'$\1\\text{ pm}$', text)
    text = re.sub(r'(\d+)\s*Å\b', r'$\1\\text{ \\AA}$', text)
    text = re.sub(r'(\d+)\s*K\b', r'$\1\\text{ K}$', text)

    # Clean multiple spaces and blank lines
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n\s*\n', '\n\n', text)
    return text.strip()

def fix_unbalanced_dollars(text: str) -> str:
    count = text.count('$')
    if count % 2 != 0:
        if text.endswith('$') and not text.startswith('$'):
            text = '$' + text
        elif text.startswith('$') and not text.endswith('$'):
            text = text + '$'
    return text

def parse_chemistry_segment(chap_name: str, chap_slug: str, q_num: int, collected_nodes: list) -> dict:
    q_div = collected_nodes[0]
    qt_el = q_div.find('div', class_='esquestion-text')
    qs_el = q_div.find('div', class_='esquestion-solution')

    q_imgs = []
    sol_imgs = []

    if qt_el:
        for img in qt_el.find_all('img', src=True):
            src = img['src']
            if 'upload' in src.lower() and 'logo' not in src.lower() and src not in q_imgs:
                q_imgs.append(src)
    if qs_el:
        for img in qs_el.find_all('img', src=True):
            src = img['src']
            if 'upload' in src.lower() and 'logo' not in src.lower() and src not in sol_imgs:
                sol_imgs.append(src)

    raw_statement = qt_el.get_text().strip() if qt_el else q_div.get_text().strip()
    raw_solution = qs_el.get_text().strip() if qs_el else ""

    sibling_options = []
    year = None
    sibling_sol_parts = []
    found_sol_start = False

    for node in collected_nodes[1:]:
        if hasattr(node, 'find_all'):
            for img in node.find_all('img', src=True):
                src = img['src']
                if 'upload' in src.lower() and 'logo' not in src.lower():
                    if found_sol_start:
                        if src not in sol_imgs:
                            sol_imgs.append(src)
                    else:
                        if src not in q_imgs:
                            q_imgs.append(src)

        txt = node.get_text().strip() if hasattr(node, 'get_text') else str(node).strip()
        if not txt:
            continue

        m_y = re.search(r'\[(JEE Advanced|JEE Advance|JEE|IIT)\s*[-–]?\s*(\d{4})\]', txt, re.IGNORECASE)
        if m_y and not year:
            year = m_y.group(2)

        if 'Ans.' in txt or 'Ans ' in txt:
            found_sol_start = True
            ans_split = re.split(r'Ans\.\s*|Ans\s+', txt, maxsplit=1)
            before_ans = ans_split[0].strip()
            after_ans = ans_split[1].strip() if len(ans_split) > 1 else ""

            if before_ans:
                m_opt = re.search(r'(?:\$?\s*\(\s*\\mathrm\{\s*([A-D1-4])\s*\}\s*\)\s*\$?|\$?\s*\\mathrm\{\s*\(([A-D1-4])\)\s*\}\s*\$?|\(([A-D1-4])\))\s*(.+)', before_ans)
                if m_opt:
                    k = m_opt.group(1) or m_opt.group(2) or m_opt.group(3)
                    sibling_options.append((k, m_opt.group(4).strip()))
                elif not year:
                    m_y2 = re.search(r'\[(JEE Advanced|JEE Advance|JEE|IIT)\s*[-–]?\s*(\d{4})\]', before_ans, re.IGNORECASE)
                    if m_y2:
                        year = m_y2.group(2)

            if after_ans:
                sibling_sol_parts.append(after_ans)
            continue

        if found_sol_start:
            sibling_sol_parts.append(txt)
        else:
            m_opt = re.search(r'^(?:\$?\s*\(\s*\\mathrm\{\s*([A-D1-4])\s*\}\s*\)\s*\$?|\$?\s*\\mathrm\{\s*\(([A-D1-4])\)\s*\}\s*\$?|\(([A-D1-4])\))\s*(.+)', txt)
            if m_opt:
                k = m_opt.group(1) or m_opt.group(2) or m_opt.group(3)
                sibling_options.append((k, m_opt.group(4).strip()))
            else:
                if not year and not sibling_options:
                    raw_statement += " " + txt

    if not raw_solution and sibling_sol_parts:
        raw_solution = " ".join(sibling_sol_parts)

    if not year:
        m_y = re.search(r'\[(JEE Advanced|JEE Advance|JEE|IIT)\s*[-–]?\s*(\d{4})\]', raw_statement, re.IGNORECASE)
        if m_y:
            year = m_y.group(2)
            raw_statement = raw_statement.replace(m_y.group(0), '').strip()
    if not year:
        year = "2020"

    clean_statement = re.sub(r'^\s*Q\.\s*', '', raw_statement).strip()

    options_list = []
    key_map = {'1': 'A', '2': 'B', '3': 'C', '4': 'D'}

    if len(sibling_options) >= 2:
        seen_keys = set()
        for k, text in sibling_options:
            mk = key_map.get(k.upper(), k.upper())
            if mk in seen_keys:
                continue
            seen_keys.add(mk)
            text = re.sub(r'\[(JEE Advanced|JEE Advance|JEE|IIT)\s*[-–]?\s*\d{4}\].*$', '', text, flags=re.IGNORECASE).strip()
            text = fix_unbalanced_dollars(text)
            options_list.append({
                'id': f'opt_{mk.lower()}',
                'key': mk,
                'text': clean_chemistry_latex(text),
                'is_correct': False
            })
    else:
        opt_pattern = re.compile(r'(?:\$?\s*\(\s*\\mathrm\{\s*([A-D1-4])\s*\}\s*\)\s*\$?|\$?\s*\\mathrm\{\s*\(([A-D1-4])\)\s*\}\s*\$?|\(([A-D1-4])\))')
        matches = []
        for m in opt_pattern.finditer(clean_statement):
            letter = (m.group(1) or m.group(2) or m.group(3)).upper()
            matches.append((key_map.get(letter, letter), m.start(), m.end(), m.group(0)))

        best_seq = None
        for i in range(len(matches) - 1, -1, -1):
            if matches[i][0] == 'A':
                sub = matches[i:]
                keys = [x[0] for x in sub]
                expected = ['A', 'B', 'C', 'D']
                valid_len = 0
                for idx, k in enumerate(keys[:4]):
                    if k == expected[idx]:
                        valid_len += 1
                    else:
                        break
                if valid_len >= 2:
                    if best_seq is None or valid_len > len(best_seq):
                        best_seq = sub[:valid_len]
                        if valid_len == 4:
                            break

        if best_seq:
            full_stmt_for_opts = clean_statement
            clean_statement = clean_statement[:best_seq[0][1]].strip()
            clean_statement = re.sub(r'[\s\-:]+$', '', clean_statement)
            seen_keys = set()
            for idx, (k, s, e, orig) in enumerate(best_seq):
                if k in seen_keys:
                    continue
                seen_keys.add(k)
                end_pos = best_seq[idx+1][1] if idx+1 < len(best_seq) else len(full_stmt_for_opts)
                opt_str = full_stmt_for_opts[e:end_pos].strip()
                if idx == len(best_seq) - 1:
                    opt_str = re.sub(r'\[(JEE Advanced|JEE Advance|JEE|IIT)\s*[-–]?\s*\d{4}\].*$', '', opt_str, flags=re.IGNORECASE).strip()
                if orig.startswith('$') and not orig.endswith('$') and opt_str.endswith('$'):
                    opt_str = '$' + opt_str
                opt_str = fix_unbalanced_dollars(opt_str)
                options_list.append({
                    'id': f'opt_{k.lower()}',
                    'key': k,
                    'text': clean_chemistry_latex(opt_str),
                    'is_correct': False
                })

    clean_statement = clean_chemistry_latex(clean_statement)

    correct_ans = None
    m_ans = re.search(r'Ans\.\s*\(?([A-D](?:\s*,\s*[A-D])*)\)?', raw_solution, re.IGNORECASE)
    if not m_ans:
        m_ans = re.search(r'Ans\.\s*([0-9\.\-]+)', raw_solution, re.IGNORECASE)
        if m_ans:
            correct_ans = m_ans.group(1).strip()
    else:
        correct_ans = m_ans.group(1).replace(' ', '')
        ans_keys = [k.strip().upper() for k in correct_ans.split(',') if k.strip()]
        for opt in options_list:
            if opt['key'] in ans_keys:
                opt['is_correct'] = True

    if len(options_list) == 0:
        question_type = "numerical"
    elif correct_ans and (',' in correct_ans or len([o for o in options_list if o['is_correct']]) > 1):
        question_type = "multiple_correct"
    else:
        question_type = "mcq"

    diagrams = []
    for img_idx, img_url in enumerate(q_imgs):
        ext = os.path.splitext(img_url)[1] or '.webp'
        img_name = f"jee_adv_chem_{chap_slug}_q{q_num}_img{img_idx+1}{ext}"
        diagrams.append(f"/jee_advanced_diagrams/{img_name}")

    clean_sol = re.sub(r'^Ans\..*?\n', '', raw_solution).strip()
    clean_sol = clean_chemistry_latex(clean_sol)

    return {
        'id': f"jee_adv_chem_{chap_slug}_q{q_num}",
        'question_number': q_num,
        'question_text': clean_statement,
        'exam_code': 'JEE-ADVANCED',
        'exam_category': 'JEE_ADVANCED',
        'subject': 'Chemistry',
        'topic': chap_name,
        'chapter': chap_name,
        'marks': 4 if question_type in ['multiple_correct', 'numerical'] else 3,
        'difficulty': 'hard',
        'recommended_minutes': 3,
        'question_type': question_type,
        'options': options_list if options_list else None,
        'correct_answer': correct_ans,
        'model_answer': clean_sol if clean_sol else "Refer to official step-by-step JEE Advanced chemical reaction derivation.",
        'diagram_url': diagrams[0] if diagrams else None,
        'diagram_urls': diagrams if len(diagrams) > 1 else None,
        'year': year,
        'raw_imgs': q_imgs,
        'created_at': '2026-11-04T00:00:00Z',
        'updated_at': '2026-11-04T00:00:00Z'
    }

def run_chemistry_parser():
    with open('data/jee_adv_chapters.json', 'r', encoding='utf-8') as f:
        all_chaps = json.load(f)

    chem_chaps = [c for c in all_chaps if c['subject'] == 'Chemistry']
    raw_dir = os.path.join('data', 'jee_adv_raw', 'chemistry')

    all_chemistry_questions = []

    for idx, chap in enumerate(chem_chaps):
        cname = chap['chapter']
        slug = re.sub(r'[^a-z0-9]+', '_', cname.lower()).strip('_')
        raw_file = os.path.join(raw_dir, f"{slug}.html")

        if not os.path.exists(raw_file):
            print(f"[{idx+1}/{len(chem_chaps)}] Missing raw file for {cname}")
            continue

        with open(raw_file, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')

        qs = soup.find_all('div', class_='esquestion')
        chap_questions = []

        for q_idx, q in enumerate(qs):
            top_el = q
            while top_el.parent and top_el.parent.name == 'span':
                top_el = top_el.parent
            
            collected_nodes = [q]
            curr = top_el
            while True:
                curr = curr.next_sibling
                if not curr:
                    break
                if isinstance(curr, Tag):
                    if curr.name == 'div' and 'esquestion' in (curr.get('class') or []):
                        break
                    if curr.find('div', class_='esquestion'):
                        break
                if hasattr(curr, 'get_text') and re.match(r'^\s*Q\.\s*', curr.get_text()):
                    break
                collected_nodes.append(curr)

            q_obj = parse_chemistry_segment(cname, slug, q_idx + 1, collected_nodes)
            chap_questions.append(q_obj)

        all_chemistry_questions.extend(chap_questions)
        opt_count = sum(1 for q in chap_questions if q.get('options'))
        num_count = sum(1 for q in chap_questions if q['question_type'] == 'numerical')
        diag_count = sum(1 for q in chap_questions if q.get('diagram_url'))
        print(f"[{idx+1}/{len(chem_chaps)}] {cname}: {len(chap_questions)} Qs (MCQ: {opt_count}, Num: {num_count}, Diags: {diag_count})")

    output_path = os.path.join('data', 'questions', 'JEE_ADVANCED', 'JEE_ADVANCED_CHEMISTRY.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_chemistry_questions, f, indent=2, ensure_ascii=False)

    print("\n" + "="*60)
    print(f"CHEMISTRY EXTRACTION COMPLETE!")
    print(f"Total Chemistry Questions Processed: {len(all_chemistry_questions)}")
    print(f"Total MCQs with Options: {sum(1 for q in all_chemistry_questions if q.get('options'))}")
    print(f"Total Numerical Questions: {sum(1 for q in all_chemistry_questions if q['question_type'] == 'numerical')}")
    print(f"Total Questions with Diagrams: {sum(1 for q in all_chemistry_questions if q.get('diagram_url'))}")
    print(f"Saved to: {output_path}")
    print("="*60)

if __name__ == '__main__':
    run_chemistry_parser()

