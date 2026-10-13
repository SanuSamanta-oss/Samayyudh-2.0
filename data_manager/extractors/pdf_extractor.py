"""
PDF Question Extractor: parses questions, options, and marks from exam question paper PDFs.
Supports PyMuPDF (fitz) with fallback to PyPDF2.
"""

import re
from pathlib import Path
from typing import List, Union, Dict, Any, Optional
from data_manager.models import Question, QuestionOption
from data_manager.cleaner import clean_question, sanitize_text


class PDFExtractor:
    @staticmethod
    def extract_text_from_pdf(pdf_path: Union[str, Path]) -> str:
        path = Path(pdf_path)
        if not path.exists():
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")

        extracted_text = []

        # Try PyMuPDF (fitz) first
        try:
            import fitz
            doc = fitz.open(str(path))
            for page in doc:
                extracted_text.append(page.get_text())
            doc.close()
            return "\n".join(extracted_text)
        except ImportError:
            pass

        # Fallback to PyPDF2
        try:
            import PyPDF2
            with open(path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        extracted_text.append(text)
            return "\n".join(extracted_text)
        except Exception as e:
            raise RuntimeError(f"Failed to extract text from PDF: {e}")

    @classmethod
    def extract_from_file(
        cls, 
        pdf_path: Union[str, Path], 
        exam_code: str = "GATE-EXAM", 
        subject: str = "Engineering", 
        year: str = "2024"
    ) -> List[Question]:
        raw_text = cls.extract_text_from_pdf(pdf_path)
        return cls.extract_from_text(raw_text, exam_code=exam_code, subject=subject, year=year)

    @classmethod
    def extract_from_text(
        cls, 
        text: str, 
        exam_code: str = "GATE-EXAM", 
        subject: str = "Engineering", 
        year: str = "2024"
    ) -> List[Question]:
        """
        Parses exam paper text into Question objects.
        """
        clean_doc = sanitize_text(text)
        
        # Regex to locate question start boundaries like:
        # Q.1, Q. 1, Question 1, Q1:
        q_pattern = re.compile(
            r'(?:^|\n)(?:Q\.?\s*(\d+)|\bQuestion\s*(\d+)|(\d+)\.\s+)',
            re.IGNORECASE
        )

        matches = list(q_pattern.finditer(clean_doc))
        if not matches:
            # Fallback: single question chunk
            return [clean_question(Question(
                id=f"{exam_code.lower()}-q1",
                question_number=1,
                question_text=clean_doc,
                exam_code=exam_code,
                subject=subject,
                topic="General",
                marks=1,
                year=year
            ))]

        questions: List[Question] = []

        for i in range(len(matches)):
            match = matches[i]
            q_num_str = match.group(1) or match.group(2) or match.group(3) or str(i + 1)
            try:
                q_num = int(q_num_str)
            except ValueError:
                q_num = i + 1

            start_idx = match.end()
            end_idx = matches[i + 1].start() if i + 1 < len(matches) else len(clean_doc)
            block = clean_doc[start_idx:end_idx].strip()

            # Parse marks from text e.g. [1 Mark] or (2 Marks) or marks: 1
            marks = 1
            marks_match = re.search(r'\[\s*(\d+)\s*Marks?\s*\]|\(\s*(\d+)\s*Marks?\s*\)', block, re.IGNORECASE)
            if marks_match:
                try:
                    marks = int(marks_match.group(1) or marks_match.group(2))
                except ValueError:
                    marks = 1

            # Parse options (A), (B), (C), (D)
            opt_pattern = re.compile(r'\(([A-D])\)\s*([^\n\(\)]+)', re.IGNORECASE)
            opt_matches = list(opt_pattern.finditer(block))

            options: List[QuestionOption] = []
            q_text_body = block

            if len(opt_matches) >= 2:
                # Question text is before first option
                q_text_body = block[:opt_matches[0].start()].strip()
                for opt_m in opt_matches:
                    letter = opt_m.group(1).lower()
                    opt_body = opt_m.group(2).strip()
                    options.append(QuestionOption(
                        id=f"opt_{letter}",
                        text=opt_body,
                        is_correct=False
                    ))

            # Clean trailing instructions
            q_text_body = re.sub(r'\[\s*\d+\s*Marks?\s*\]', '', q_text_body).strip()

            q_id = f"{exam_code.lower().replace(' ', '-')}-q{q_num}"
            q = Question(
                id=q_id,
                question_number=q_num,
                question_text=q_text_body,
                exam_code=exam_code,
                subject=subject,
                topic="General",
                marks=marks,
                options=options if options else None,
                year=year
            )
            questions.append(clean_question(q))

        return questions
