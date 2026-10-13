"""
Question Repository Manager: manages local JSON storage of question banks
organized by exam code in data/questions/.
"""

import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from data_manager.models import Question
from data_manager.cleaner import clean_question, deduplicate_questions


class QuestionRepository:
    def __init__(self, data_dir: Optional[Path] = None):
        if data_dir is None:
            # Default to <workspace_root>/data/questions
            workspace_root = Path(__file__).resolve().parent.parent
            self.data_dir = workspace_root / "data" / "questions"
        else:
            self.data_dir = Path(data_dir)

        self.data_dir.mkdir(parents=True, exist_ok=True)

    def _exam_filename(self, exam_code: str) -> Path:
        safe_code = "".join(c if c.isalnum() or c in ("-", "_") else "_" for c in exam_code)
        return self.data_dir / f"{safe_code}.json"

    def list_exam_files(self) -> List[Path]:
        return sorted(list(self.data_dir.glob("*.json")))

    def load_exam(self, exam_code: str) -> List[Question]:
        filepath = self._exam_filename(exam_code)
        if not filepath.exists():
            return []

        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        questions = [clean_question(Question.from_dict(d)) for d in data if isinstance(d, dict)]
        return questions

    def save_exam(self, exam_code: str, questions: List[Question]) -> Path:
        filepath = self._exam_filename(exam_code)
        # Deduplicate and sort by question_number
        unique_qs, _ = deduplicate_questions(questions)
        unique_qs.sort(key=lambda q: q.question_number)

        data = [q.to_dict() for q in unique_qs]
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        return filepath

    def load_all(self) -> List[Question]:
        all_questions: List[Question] = []
        for file in self.list_exam_files():
            try:
                with open(file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                if isinstance(data, list):
                    for d in data:
                        if isinstance(d, dict):
                            all_questions.append(clean_question(Question.from_dict(d)))
            except Exception as e:
                print(f"Warning: Failed to load {file.name}: {e}")

        all_questions.sort(key=lambda q: (q.exam_code, q.question_number))
        return all_questions

    def save_all(self, questions: List[Question]) -> Dict[str, int]:
        """
        Groups questions by exam_code and saves each to its respective JSON file.
        Returns a dict of {exam_code: count}.
        """
        grouped: Dict[str, List[Question]] = {}
        for q in questions:
            code = q.exam_code.strip() or "CUSTOM"
            if code not in grouped:
                grouped[code] = []
            grouped[code].append(q)

        counts = {}
        for code, qs in grouped.items():
            self.save_exam(code, qs)
            counts[code] = len(qs)

        return counts

    def get_stats(self) -> Dict[str, Any]:
        all_qs = self.load_all()
        by_exam = {}
        by_category = {}
        by_subject = {}
        by_difficulty = {"easy": 0, "medium": 0, "hard": 0}
        by_type = {}

        for q in all_qs:
            by_exam[q.exam_code] = by_exam.get(q.exam_code, 0) + 1
            by_category[q.exam_category] = by_category.get(q.exam_category, 0) + 1
            by_subject[q.subject] = by_subject.get(q.subject, 0) + 1
            by_type[q.question_type] = by_type.get(q.question_type, 0) + 1
            diff = q.difficulty.lower()
            if diff in by_difficulty:
                by_difficulty[diff] += 1
            else:
                by_difficulty[diff] = 1

        return {
            "total_questions": len(all_qs),
            "total_exams": len(by_exam),
            "by_exam": by_exam,
            "by_category": by_category,
            "by_subject": by_subject,
            "by_difficulty": by_difficulty,
            "by_type": by_type,
        }
