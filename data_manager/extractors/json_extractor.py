"""
JSON Question Extractor: loads and validates questions from JSON files or strings.
"""

import json
from pathlib import Path
from typing import List, Union, Dict, Any
from data_manager.models import Question
from data_manager.cleaner import clean_question


class JSONExtractor:
    @staticmethod
    def extract_from_file(file_path: Union[str, Path]) -> List[Question]:
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        return JSONExtractor.extract_from_data(data)

    @staticmethod
    def extract_from_data(data: Union[List[Dict[str, Any]], Dict[str, Any]]) -> List[Question]:
        items = []
        if isinstance(data, list):
            items = data
        elif isinstance(data, dict):
            if "questions" in data and isinstance(data["questions"], list):
                items = data["questions"]
            elif "data" in data and isinstance(data["data"], list):
                items = data["data"]
            elif "SAMPLE_QUESTIONS" in data and isinstance(data["SAMPLE_QUESTIONS"], list):
                items = data["SAMPLE_QUESTIONS"]
            else:
                items = [data]
        else:
            raise ValueError("Invalid JSON data format for question extraction.")

        questions: List[Question] = []
        for item in items:
            if not isinstance(item, dict):
                continue
            try:
                q = Question.from_dict(item)
                q = clean_question(q)
                questions.append(q)
            except Exception as e:
                print(f"Warning: Failed to parse question item: {e}")

        return questions
