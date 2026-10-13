"""
CSV Question Extractor: loads and converts CSV/TSV tabular files into Question objects.
"""

import csv
from pathlib import Path
from typing import List, Union, Dict, Any, Optional
from data_manager.models import Question, QuestionOption
from data_manager.cleaner import clean_question


class CSVExtractor:
    COLUMN_ALIASES = {
        "question_text": ["question", "question_text", "problem", "prompt", "text"],
        "exam_code": ["exam_code", "exam", "code", "paper"],
        "subject": ["subject", "sub", "course"],
        "topic": ["topic", "chapter", "module"],
        "marks": ["marks", "mark", "points", "score"],
        "difficulty": ["difficulty", "level"],
        "correct_answer": ["correct_answer", "answer", "ans", "correct_option", "key"],
        "model_answer": ["model_answer", "explanation", "solution", "sol"],
        "rubric": ["rubric", "evaluation_rubric", "marking_rubric"],
        "year": ["year", "exam_year"],
    }

    @classmethod
    def _find_col(cls, row: Dict[str, str], field_name: str) -> Optional[str]:
        aliases = cls.COLUMN_ALIASES.get(field_name, [field_name])
        for key in row.keys():
            k_clean = key.strip().lower().replace(" ", "_")
            if k_clean in aliases:
                val = row[key]
                return val.strip() if val else None
        return None

    @classmethod
    def extract_from_file(cls, file_path: Union[str, Path], default_exam_code: str = "CUSTOM", default_subject: str = "General") -> List[Question]:
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        delimiter = "\t" if path.suffix.lower() == ".tsv" else ","
        questions: List[Question] = []

        with open(path, "r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f, delimiter=delimiter)
            for idx, row in enumerate(reader, start=1):
                q_text = cls._find_col(row, "question_text")
                if not q_text:
                    continue

                exam_code = cls._find_col(row, "exam_code") or default_exam_code
                subject = cls._find_col(row, "subject") or default_subject
                topic = cls._find_col(row, "topic") or "General"
                
                marks_str = cls._find_col(row, "marks") or "1"
                try:
                    marks = int(float(marks_str))
                except ValueError:
                    marks = 1

                difficulty = cls._find_col(row, "difficulty") or "medium"
                correct_ans = cls._find_col(row, "correct_answer")
                model_ans = cls._find_col(row, "model_answer") or ""
                rubric = cls._find_col(row, "rubric") or f"{marks} mark{'s' if marks > 1 else ''}"
                year = cls._find_col(row, "year") or "2024"

                # Extract options
                options: List[QuestionOption] = []
                opt_keys = [("a", "opt_a"), ("b", "opt_b"), ("c", "opt_c"), ("d", "opt_d")]
                for letter, opt_id in opt_keys:
                    opt_val = None
                    for k in row.keys():
                        k_clean = k.strip().lower().replace(" ", "_")
                        if k_clean in [f"option_{letter}", f"opt_{letter}", f"opt{letter}", letter]:
                            opt_val = row[k].strip() if row[k] else None
                            break
                    if opt_val:
                        is_corr = False
                        if correct_ans and (correct_ans.strip().lower() in [letter, opt_id, opt_val.lower()]):
                            is_corr = True
                        options.append(QuestionOption(id=opt_id, text=opt_val, is_correct=is_corr))

                q = Question(
                    id=f"{exam_code.lower().replace(' ', '-')}-csv-{idx}",
                    question_number=idx,
                    question_text=q_text,
                    exam_code=exam_code,
                    subject=subject,
                    topic=topic,
                    marks=marks,
                    difficulty=difficulty,
                    model_answer=model_ans,
                    evaluation_rubric=rubric,
                    options=options if options else None,
                    correct_answer=correct_ans,
                    year=year
                )
                q = clean_question(q)
                questions.append(q)

        return questions
