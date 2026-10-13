"""
Raw Text / OCR Dump Extractor.
"""

from pathlib import Path
from typing import List, Union
from data_manager.models import Question
from data_manager.extractors.pdf_extractor import PDFExtractor


class RawTextExtractor:
    @staticmethod
    def extract_from_file(
        file_path: Union[str, Path], 
        exam_code: str = "CUSTOM", 
        subject: str = "General", 
        year: str = "2024"
    ) -> List[Question]:
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()

        return PDFExtractor.extract_from_text(text, exam_code=exam_code, subject=subject, year=year)
