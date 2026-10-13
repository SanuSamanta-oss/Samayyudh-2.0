"""
Data cleaning, sanitization, validation and deduplication for question banks.
"""

import re
import unicodedata
from typing import List, Dict, Any, Tuple, Optional
from data_manager.models import Question, QuestionOption


def sanitize_text(text: Optional[str]) -> str:
    """
    Cleans raw text:
    - Normalizes mathematical unicode characters (NFKC) -> standard ASCII characters
    - Normalizes smart quotes and apostrophes
    - Replaces non-breaking spaces
    - Cleans duplicate whitespace while preserving standard paragraphs
    """
    if not text:
        return ""

    # Unicode NFKC normalization (turns styled math italic x, y, z into standard x, y, z)
    cleaned = unicodedata.normalize("NFKC", str(text))

    # Standardize quotes
    cleaned = re.sub(r'[\u2018\u2019\u201a\u201b`]', "'", cleaned)
    cleaned = re.sub(r'[\u201c\u201d\u201e\u201f]', '"', cleaned)

    # Standardize dashes and hyphens
    cleaned = re.sub(r'[\u2013\u2014]', '-', cleaned)

    # Standardize arrows
    cleaned = cleaned.replace('\u2192', '→')

    # Non-breaking spaces and special spaces
    cleaned = re.sub(r'[\u00a0\u1680\u2000-\u200b\u202f\u205f\u3000]', ' ', cleaned)

    # Replace multiple horizontal spaces with a single space
    cleaned = re.sub(r'[ \t]+', ' ', cleaned)

    # Trim lines
    lines = [line.strip() for line in cleaned.splitlines()]
    # Remove excessive blank lines
    cleaned = "\n".join(lines).strip()
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)

    return cleaned


def clean_options(options: Optional[List[QuestionOption]], correct_answer: Optional[Any] = None) -> Tuple[Optional[List[QuestionOption]], Optional[Any]]:
    """
    Normalizes options, standardizes IDs (opt_a, opt_b, opt_c, opt_d)
    and syncs is_correct flags with correct_answer.
    """
    if not options:
        return None, correct_answer

    standard_keys = ['opt_a', 'opt_b', 'opt_c', 'opt_d', 'opt_e', 'opt_f']
    cleaned_options: List[QuestionOption] = []
    
    # Track correct options
    correct_ids = []
    if isinstance(correct_answer, list):
        correct_ids = [str(x).strip().lower() for x in correct_answer]
    elif correct_answer:
        correct_ids = [str(correct_answer).strip().lower()]

    for idx, opt in enumerate(options):
        # Determine normalized id
        if opt.id and (opt.id.startswith('opt_') or opt.id in standard_keys):
            opt_id = opt.id
        elif idx < len(standard_keys):
            opt_id = standard_keys[idx]
        else:
            opt_id = f"opt_{idx + 1}"

        opt_text = sanitize_text(opt.text)
        is_corr = opt.is_correct

        # Check if option matched correct_answer (e.g. 'a', 'A', 'opt_a', or matched text)
        letter = chr(ord('a') + idx)
        if (opt_id in correct_ids or 
            opt.id in correct_ids or 
            letter in correct_ids or 
            f"opt_{letter}" in correct_ids or 
            opt_text.lower() in correct_ids):
            is_corr = True

        cleaned_options.append(QuestionOption(
            id=opt_id,
            text=opt_text,
            is_correct=is_corr
        ))

    # Reconcile correct_answer
    found_correct = [o.id for o in cleaned_options if o.is_correct]
    if len(found_correct) == 1:
        reconciled_answer = found_correct[0]
    elif len(found_correct) > 1:
        reconciled_answer = found_correct
    else:
        # If no option marked correct, use existing correct_answer if provided
        reconciled_answer = correct_answer

    return cleaned_options, reconciled_answer


def clean_question(q: Question) -> Question:
    """
    Cleans and normalizes an entire Question object.
    """
    q.question_text = sanitize_text(q.question_text)
    q.subject = sanitize_text(q.subject) or "General"
    q.topic = sanitize_text(q.topic) or "General"
    if q.subtopic:
        q.subtopic = sanitize_text(q.subtopic)
    q.model_answer = sanitize_text(q.model_answer)
    q.evaluation_rubric = sanitize_text(q.evaluation_rubric)
    q.expected_points = [sanitize_text(p) for p in q.expected_points if p.strip()]
    q.keywords = [sanitize_text(k) for k in q.keywords if k.strip()]

    # Clean options
    if q.options:
        q.options, q.correct_answer = clean_options(q.options, q.correct_answer)
        correct_count = sum(1 for o in q.options if o.is_correct)
        if correct_count > 1:
            q.question_type = "msq"
        else:
            q.question_type = "mcq"

    # Time rules
    if not q.recommended_minutes or q.recommended_minutes <= 0:
        if q.marks <= 2:
            q.recommended_minutes = 2
        elif q.marks <= 5:
            q.recommended_minutes = 6
        else:
            q.recommended_minutes = 12

    return q


def validate_question(q: Question) -> List[str]:
    """
    Returns validation issues for a question. Empty list = valid.
    """
    issues = []
    if not q.question_text.strip():
        issues.append("Question text is empty")
    if not q.exam_code.strip():
        issues.append("Exam code is missing")
    if q.marks <= 0:
        issues.append(f"Invalid marks: {q.marks}")

    if q.question_type in ["mcq", "msq"]:
        if not q.options or len(q.options) < 2:
            issues.append(f"Objective question ({q.question_type}) requires at least 2 options")
        else:
            has_correct = any(o.is_correct for o in q.options)
            if not has_correct and not q.correct_answer:
                issues.append("No correct option marked")
            for idx, opt in enumerate(q.options):
                if not opt.text.strip():
                    issues.append(f"Option {idx + 1} has empty text")

    return issues


def deduplicate_questions(questions: List[Question]) -> Tuple[List[Question], int]:
    """
    Removes duplicate questions based on (exam_code, normalized_text).
    Returns (unique_questions, duplicates_count).
    """
    seen = set()
    unique = []
    duplicates = 0

    for q in questions:
        # Create a simplified key
        key = (
            q.exam_code.strip().upper(),
            re.sub(r'[^a-zA-Z0-9]', '', q.question_text.lower()[:120])
        )
        if key in seen:
            duplicates += 1
            continue
        seen.add(key)
        unique.append(q)

    return unique, duplicates
