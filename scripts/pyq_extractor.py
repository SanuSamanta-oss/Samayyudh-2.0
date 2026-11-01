#!/usr/bin/env python3
# ============================================================
# SamayYudh 2.0 — JEE Main 2025 PYQ Question Extraction Engine
# Extracts ONLY questions, options & diagrams from PDF papers
# ============================================================

import sys
import os
import re
import json
import hashlib
from datetime import datetime, timezone
import pymupdf

# Character replacement map for specialized symbols & unicode ligatures in PDFs
UNICODE_SYMBOL_MAP = {
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
}

def clean_math_text(text: str) -> str:
    """Cleans up raw PDF extracted text and normalizes mathematical symbols."""
    for char, rep in UNICODE_SYMBOL_MAP.items():
        text = text.replace(char, rep)
    # Remove excessive blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def parse_filename_metadata(filename: str) -> dict:
    """Parses date, shift, exam and course from the filename."""
    meta = {
        'exam': 'JEE Main',
        'year': 2025,
        'course': 'B.Tech',
        'date': '2025-01-22',
        'date_str': '22 January 2025',
        'shift': 'Shift 1',
        'session': 'Morning',
        'source_classification': 'Memory Based'
    }
    
    # Date extraction
    m_date = re.search(r'(\d{2})[-_](\d{2})[-_](\d{4})', filename)
    if m_date:
        day, month, year = m_date.groups()
        meta['date'] = f"{year}-{month}-{day}"
        months = {'01': 'January', '02': 'February', '03': 'March', '04': 'April'}
        meta['date_str'] = f"{int(day)} {months.get(month, 'January')} {year}"
    else:
        m_date_text = re.search(r'(\d{1,2})[-_\s]*(Jan|Feb|March|Apr)[-_a-zA-Z]*[-_\s]*(\d{4})', filename, re.IGNORECASE)
        if m_date_text:
            day, month_str, year = m_date_text.groups()
            meta['date'] = f"{year}-01-{int(day):02d}"
            meta['date_str'] = f"{int(day)} January {year}"
            
    # Shift extraction
    if re.search(r'shift[-_\s]*2', filename, re.IGNORECASE):
        meta['shift'] = 'Shift 2'
        meta['session'] = 'Evening'
    elif re.search(r'shift[-_\s]*1', filename, re.IGNORECASE):
        meta['shift'] = 'Shift 1'
        meta['session'] = 'Morning'
        
    return meta

def verify_document_metadata(doc, meta: dict) -> dict:
    """Verifies and enriches metadata using document page 1 content."""
    p1_text = doc[0].get_text()
    if 'Evening' in p1_text:
        meta['shift'] = 'Shift 2'
        meta['session'] = 'Evening'
    elif 'Morning' in p1_text:
        meta['shift'] = 'Shift 1'
        meta['session'] = 'Morning'
        
    m_doc_date = re.search(r'(\d{2})/(\d{2})/(\d{4})', p1_text)
    if m_doc_date:
        d, m, y = m_doc_date.groups()
        meta['date'] = f"{y}-{m}-{d}"
        months = {'01': 'January', '02': 'February', '03': 'March', '04': 'April'}
        meta['date_str'] = f"{int(d)} {months.get(m, 'January')} {y}"
        
    if 'Memory Based' in p1_text:
        meta['source_classification'] = 'Memory Based'
    elif 'Official' in p1_text:
        meta['source_classification'] = 'Official'
        
    return meta

def extract_pdf_questions(pdf_path: str, output_img_dir: str) -> dict:
    """Extracts all questions, options, diagrams, and metadata from a JEE Main PDF."""
    filename = os.path.basename(pdf_path)
    with open(pdf_path, 'rb') as f:
        file_bytes = f.read()
    checksum = hashlib.sha256(file_bytes).hexdigest()
    
    meta = parse_filename_metadata(filename)
    doc = pymupdf.open(pdf_path)
    meta = verify_document_metadata(doc, meta)
    
    paper_id = f"jee_main_2025_btech_{meta['date'].replace('-', '')}_{meta['shift'].lower().replace(' ', '')}"
    
    paper_record = {
        'id': paper_id,
        'exam': meta['exam'],
        'year': meta['year'],
        'course': meta['course'],
        'exam_date': meta['date'],
        'exam_date_str': meta['date_str'],
        'shift': meta['shift'],
        'session': meta['session'],
        'source_filename': filename,
        'source_classification': meta['source_classification'],
        'checksum': checksum,
        'total_questions': 0,
        'physics_count': 0,
        'chemistry_count': 0,
        'mathematics_count': 0,
        'import_status': 'Ready to Import',
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    
    extracted_questions = []
    
    current_subject = None
    current_section = 'Section A'
    current_q_num = None
    q_statement_blocks = []
    q_page_num = 1
    q_bbox = None
    
    def finalize_question(subject, section, q_num, page_num, raw_text, bbox):
        if q_num is None or not subject:
            return None
            
        clean_text = clean_math_text(raw_text)
        
        # Check if question is purely numerical or MCQ
        q_type = 'Numerical Value' if (section == 'Section B' or q_num > 20) else 'MCQ'
        
        options = []
        statement = clean_text
        
        if q_type == 'MCQ':
            # Split options (1), (2), (3), (4)
            # Find occurrences of (1), (2), (3), (4)
            opt_pattern = re.compile(r'\((1|2|3|4)\)\s*([^\n\(\)]+)')
            matches = list(opt_pattern.finditer(clean_text))
            
            if len(matches) >= 3:
                first_opt_idx = matches[0].start()
                statement = clean_text[:first_opt_idx].strip()
                # Parse each option
                for i in range(len(matches)):
                    k = matches[i].group(1)
                    end_idx = matches[i+1].start() if i+1 < len(matches) else len(clean_text)
                    opt_content = clean_text[matches[i].start():end_idx].strip()
                    # Strip leading (1)
                    opt_content = re.sub(r'^\(' + k + r'\)\s*', '', opt_content).strip()
                    options.append({
                        'key': k,
                        'text': opt_content
                    })
            else:
                # Fallback: look for option lines
                opt_lines = re.findall(r'^\s*\(([1-4])\)\s*(.+)$', clean_text, re.MULTILINE)
                if opt_lines:
                    first_opt_match = re.search(r'^\s*\(([1-4])\)', clean_text, re.MULTILINE)
                    if first_opt_match:
                        statement = clean_text[:first_opt_match.start()].strip()
                    for k, val in opt_lines:
                        options.append({'key': k, 'text': val.strip()})
        
        # Clean statement of leading question number
        statement = re.sub(r'^\d{1,2}\.\s*', '', statement).strip()
        
        # Extract diagram if there is an image on this page within or near this question's bbox
        diagram_url = None
        if bbox:
            page = doc[page_num - 1]
            img_infos = page.get_image_info()
            # Find non-logo images whose bbox overlaps or sits inside the question area
            for info in img_infos:
                img_bbox = info['bbox']
                # Skip header/footer banner images
                if img_bbox[1] < 60 or img_bbox[3] > 740:
                    continue
                # If image is in the same column and within the vertical range of the question
                x_center = (img_bbox[0] + img_bbox[2]) / 2
                col_match = (x_center < 305 and bbox[0] < 305) or (x_center >= 305 and bbox[0] >= 305)
                y_overlap = (img_bbox[1] >= bbox[1] - 10) and (img_bbox[3] <= bbox[3] + 20)
                
                if col_match and y_overlap:
                    # Clip diagram
                    clip_rect = pymupdf.Rect(img_bbox[0] - 5, img_bbox[1] - 5, img_bbox[2] + 5, img_bbox[3] + 5)
                    diag_filename = f"{paper_id}_{subject.lower()}_q{q_num}.png"
                    diag_path = os.path.join(output_img_dir, diag_filename)
                    try:
                        pix = page.get_pixmap(clip=clip_rect, dpi=200)
                        if pix.width > 20 and pix.height > 20:
                            pix.save(diag_path)
                            diagram_url = f"/pyq_diagrams/{diag_filename}"
                            break
                    except Exception as e:
                        pass
        
        # Check if question needs review
        review_required = False
        review_reason = None
        if len(statement) < 10:
            review_required = True
            review_reason = 'Question statement incomplete in memory-based PDF'
        elif q_type == 'MCQ' and len(options) < 2 and not diagram_url:
            review_required = True
            review_reason = 'Options incomplete or rendered as diagram'
            
        fp_str = f"{meta['exam']}_{meta['year']}_{meta['course']}_{meta['date']}_{meta['shift']}_{subject}_{q_num}"
        fingerprint = hashlib.sha256(fp_str.encode('utf-8')).hexdigest()
        
        q_id = f"{paper_id}_{subject.lower()[:4]}_q{q_num}"
        
        return {
            'id': q_id,
            'paper_id': paper_id,
            'exam': meta['exam'],
            'year': meta['year'],
            'course': meta['course'],
            'exam_date_str': meta['date_str'],
            'shift': meta['shift'],
            'session': meta['session'],
            'subject': subject,
            'question_number': q_num,
            'section': section,
            'question_type': q_type,
            'question_statement': statement if statement else f"Question {q_num}",
            'options': options if options else None,
            'diagram_url': diagram_url,
            'review_required': review_required,
            'review_reason': review_reason,
            'source_reference': f"{filename} (Page {page_num})",
            'fingerprint': fingerprint,
            'created_at': datetime.now(timezone.utc).isoformat()
        }

    # Iterate over pages
    for p_idx in range(len(doc)):
        page = doc[p_idx]
        blocks = page.get_text('blocks')
        
        # Filter out header/footer blocks
        filtered = []
        for b in blocks:
            b_text = b[4].strip()
            if 'www.esaral.com' in b_text or 'Download eSaral App' in b_text:
                continue
            if re.match(r'^\d+$', b_text) and (b[1] > 750 or b[1] < 45):
                continue
            if 'JEE (Main)-2025' in b_text and b[1] > 740:
                continue
            filtered.append(b)
            
        # Two-column sort: left col (x < 305) first, then right col (x >= 305)
        sorted_blocks = sorted(filtered, key=lambda b: (0 if b[0] < 305 else 1, b[1]))
        
        for b in sorted_blocks:
            b_text = b[4].strip()
            lines = [l.strip() for l in b_text.split('\n') if l.strip()]
            if not lines:
                continue
                
            first_line = lines[0]
            
            # Subject headers
            if first_line in ['PHYSICS', 'CHEMISTRY', 'MATHEMATICS']:
                if current_q_num is not None:
                    q_obj = finalize_question(current_subject, current_section, current_q_num, q_page_num, '\n'.join(q_statement_blocks), q_bbox)
                    if q_obj: extracted_questions.append(q_obj)
                    current_q_num = None
                    q_statement_blocks = []
                current_subject = first_line.capitalize()
                if current_subject == 'Mathematics':
                    current_subject = 'Mathematics'
                current_section = 'Section A'
                continue
                
            if 'SECTION - A' in first_line or 'SECTION-A' in first_line:
                current_section = 'Section A'
                continue
            if 'SECTION - B' in first_line or 'SECTION-B' in first_line:
                current_section = 'Section B'
                continue
            if 'Multiple Choice Questions:' in b_text or 'Numerical Value Type Questions:' in b_text:
                continue
                
            if not current_subject:
                continue
                
            # Check for question start (e.g. '1.', '2.', '21.')
            m_q = re.match(r'^(\d{1,2})\.\s*(.*)', first_line)
            is_new_q = False
            if m_q:
                num = int(m_q.group(1))
                if 1 <= num <= 30:
                    is_new_q = True
                    
            if is_new_q:
                # Finalize previous question
                if current_q_num is not None:
                    q_obj = finalize_question(current_subject, current_section, current_q_num, q_page_num, '\n'.join(q_statement_blocks), q_bbox)
                    if q_obj: extracted_questions.append(q_obj)
                current_q_num = num
                q_page_num = p_idx + 1
                q_statement_blocks = [b_text]
                q_bbox = (b[0], b[1], b[2], b[3])
                continue
                
            if current_q_num is not None:
                # If answer or solution starts, do NOT include it!
                if b_text.startswith('Answer') or 'Answer (' in b_text or b_text.startswith('Sol.') or b_text == 'Sol.':
                    # Stop accumulating question text
                    q_obj = finalize_question(current_subject, current_section, current_q_num, q_page_num, '\n'.join(q_statement_blocks), q_bbox)
                    if q_obj: extracted_questions.append(q_obj)
                    current_q_num = None
                    q_statement_blocks = []
                else:
                    q_statement_blocks.append(b_text)
                    if q_bbox:
                        q_bbox = (min(q_bbox[0], b[0]), min(q_bbox[1], b[1]), max(q_bbox[2], b[2]), max(q_bbox[3], b[3]))
                        
    # Finalize last question if any
    if current_q_num is not None:
        q_obj = finalize_question(current_subject, current_section, current_q_num, q_page_num, '\n'.join(q_statement_blocks), q_bbox)
        if q_obj: extracted_questions.append(q_obj)
        
    # Deduplicate questions by (subject, question_number) keeping the richest one
    unique_map = {}
    for q in extracted_questions:
        key = (q['subject'], q['question_number'])
        if key not in unique_map or len(q['question_statement']) > len(unique_map[key]['question_statement']):
            unique_map[key] = q
            
    final_questions = sorted(unique_map.values(), key=lambda q: (
        0 if q['subject'] == 'Physics' else (1 if q['subject'] == 'Chemistry' else 2),
        q['question_number']
    ))
    
    p_count = sum(1 for q in final_questions if q['subject'] == 'Physics')
    c_count = sum(1 for q in final_questions if q['subject'] == 'Chemistry')
    m_count = sum(1 for q in final_questions if q['subject'] == 'Mathematics')
    
    paper_record['total_questions'] = len(final_questions)
    paper_record['physics_count'] = p_count
    paper_record['chemistry_count'] = c_count
    paper_record['mathematics_count'] = m_count
    paper_record['import_status'] = 'Successfully Imported'
    
    return {
        'paper': paper_record,
        'questions': final_questions
    }

def main():
    pdf_dir = 'data/pyq_uploads'
    out_img_dir = 'public/pyq_diagrams'
    out_db_path = 'data/pyq_database.json'
    
    if not os.path.exists(out_img_dir):
        os.makedirs(out_img_dir)
        
    all_papers = []
    all_questions = []
    
    # Load existing database if available to support continuous uploads
    if os.path.exists(out_db_path):
        try:
            with open(out_db_path, 'r', encoding='utf-8') as f:
                existing_db = json.load(f)
                all_papers = existing_db.get('papers', [])
                all_questions = existing_db.get('questions', [])
                print(f"Loaded existing database: {len(all_papers)} papers, {len(all_questions)} questions.")
        except Exception as e:
            print(f"Error loading existing database: {e}")
            
    existing_checksums = {p.get('checksum') for p in all_papers if p.get('checksum')}
    existing_fingerprints = {q.get('fingerprint') for q in all_questions if q.get('fingerprint')}
    
    pdf_files = sorted([f for f in os.listdir(pdf_dir) if f.endswith('.pdf')])
    print(f"Found {len(pdf_files)} PDFs to process in {pdf_dir}...")
    
    new_papers_count = 0
    new_questions_count = 0
    
    for fname in pdf_files:
        fpath = os.path.join(pdf_dir, fname)
        print(f"\nProcessing {fname}...")
        try:
            result = extract_pdf_questions(fpath, out_img_dir)
            paper = result['paper']
            qs = result['questions']
            
            # Check duplicate paper by checksum
            if paper['checksum'] in existing_checksums:
                print(f"  [Duplicate Detected] Paper with checksum {paper['checksum'][:8]} already imported. Skipping.")
                continue
                
            # Add new paper
            all_papers.append(paper)
            existing_checksums.add(paper['checksum'])
            new_papers_count += 1
            
            # Add questions avoiding duplicates by fingerprint
            added_for_paper = 0
            for q in qs:
                if q['fingerprint'] not in existing_fingerprints:
                    all_questions.append(q)
                    existing_fingerprints.add(q['fingerprint'])
                    added_for_paper += 1
                    new_questions_count += 1
                    
            print(f"  Success: Extracted {paper['total_questions']} questions (Physics: {paper['physics_count']}, Chemistry: {paper['chemistry_count']}, Math: {paper['mathematics_count']})")
            print(f"  Added {added_for_paper} new question records.")
        except Exception as e:
            print(f"  Error processing {fname}: {e}")
            import traceback
            traceback.print_exc()
            
    # Save combined database
    with open(out_db_path, 'w', encoding='utf-8') as f:
        json.dump({
            'papers': all_papers,
            'questions': all_questions,
            'updated_at': datetime.now(timezone.utc).isoformat()
        }, f, indent=2, ensure_ascii=False)
        
    print("\n============================================================")
    print("EXTRACTION COMPLETE")
    print(f"Total Papers in Database: {len(all_papers)} (+{new_papers_count} new)")
    print(f"Total Questions in Database: {len(all_questions)} (+{new_questions_count} new)")
    print(f"Database saved to {out_db_path}")
    print("============================================================")

if __name__ == '__main__':
    main()
