"""
Data models for SamayYudh 2.0 Question Bank and Exam Management.
Compatible with TypeScript types defined in src/types/database.ts.
"""

from dataclasses import dataclass, field, asdict
from enum import Enum
from typing import List, Optional, Union, Dict, Any
from datetime import datetime, timezone
import json
import uuid


class ExamCategoryCode(str, Enum):
    ENGINEERING = "ENGINEERING"
    ENGINEERING_ENTRANCE = "ENGINEERING_ENTRANCE"
    JEE_MAINS = "JEE_MAINS"
    JEE_ADVANCED = "JEE_ADVANCED"
    STATE_ENTRANCE = "STATE_ENTRANCE"
    CIVIL_SERVICES = "CIVIL_SERVICES"
    UNIVERSITY = "UNIVERSITY"
    COMPETITIVE = "COMPETITIVE"
    MEDICAL = "MEDICAL"
    MANAGEMENT = "MANAGEMENT"
    LAW = "LAW"
    SCHOOL = "SCHOOL"
    PROFESSIONAL = "PROFESSIONAL"
    CUSTOM = "CUSTOM"


class QuestionType(str, Enum):
    MCQ = "mcq"
    MSQ = "msq"
    NUMERICAL = "numerical"
    SHORT_ANSWER = "short_answer"
    LONG_ANSWER = "long_answer"
    DESCRIPTIVE = "descriptive"
    ESSAY = "essay"
    TRUE_FALSE = "true_false"
    FILL_BLANK = "fill_blank"
    MATCH_FOLLOWING = "match_following"
    CODE = "code"
    CUSTOM = "custom"


class Difficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


@dataclass
class QuestionOption:
    id: str
    text: str
    is_correct: bool = False

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "text": self.text,
            "is_correct": self.is_correct
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'QuestionOption':
        return cls(
            id=str(data.get("id", "")).strip(),
            text=str(data.get("text", "")).strip(),
            is_correct=bool(data.get("is_correct", False))
        )


@dataclass
class Question:
    id: str
    question_number: int
    question_text: str
    exam_code: str
    subject: str
    topic: str
    marks: int = 1
    difficulty: str = "medium"
    recommended_minutes: int = 2
    exam_category: str = "ENGINEERING"
    question_type: str = "mcq"
    expected_points: List[str] = field(default_factory=list)
    keywords: List[str] = field(default_factory=list)
    model_answer: str = ""
    evaluation_rubric: str = ""
    options: Optional[List[QuestionOption]] = None
    correct_answer: Optional[Union[str, List[str]]] = None
    subtopic: Optional[str] = None
    year: Optional[str] = "2024"
    source: Optional[str] = ""
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def __post_init__(self):
        # Auto-calculate recommended_minutes if unset
        if not self.recommended_minutes or self.recommended_minutes <= 0:
            if self.marks <= 2:
                self.recommended_minutes = 2
            elif self.marks <= 5:
                self.recommended_minutes = 6
            else:
                self.recommended_minutes = 12

        # Auto-infer question_type if default
        if self.options and len(self.options) > 0:
            correct_count = sum(1 for opt in self.options if opt.is_correct)
            if correct_count > 1:
                self.question_type = "msq"
            else:
                self.question_type = "mcq"
        elif not self.question_type or self.question_type == "mcq":
            if self.marks <= 2:
                self.question_type = "short_answer"
            elif self.marks <= 5:
                self.question_type = "long_answer"
            else:
                self.question_type = "descriptive"

        # Auto-map exam_category from exam_code if still default
        if self.exam_category == "ENGINEERING":
            code_upper = self.exam_code.upper()
            if "JEE-MAIN" in code_upper or "JEE_MAIN" in code_upper:
                self.exam_category = "JEE_MAINS"
            elif "JEE-ADV" in code_upper or "JEE_ADV" in code_upper:
                self.exam_category = "JEE_ADVANCED"
            elif "WBJEE" in code_upper:
                self.exam_category = "STATE_ENTRANCE"
            elif "UPSC" in code_upper:
                self.exam_category = "CIVIL_SERVICES"
            elif "NEET" in code_upper:
                self.exam_category = "MEDICAL"
            elif "CAT" in code_upper:
                self.exam_category = "MANAGEMENT"
            elif "SSC" in code_upper or "BANK" in code_upper or "RAILWAY" in code_upper:
                self.exam_category = "COMPETITIVE"
            elif "UNIV" in code_upper or "COLLEGE" in code_upper:
                self.exam_category = "UNIVERSITY"

    def to_dict(self) -> Dict[str, Any]:
        d = {
            "id": self.id,
            "question_number": self.question_number,
            "question_text": self.question_text,
            "exam_code": self.exam_code,
            "exam_category": self.exam_category,
            "subject": self.subject,
            "topic": self.topic,
            "marks": self.marks,
            "difficulty": self.difficulty,
            "recommended_minutes": self.recommended_minutes,
            "question_type": self.question_type,
            "expected_points": self.expected_points or [],
            "keywords": self.keywords or [],
            "model_answer": self.model_answer or "",
            "evaluation_rubric": self.evaluation_rubric or f"{self.marks} mark{'s' if self.marks > 1 else ''}",
            "year": self.year or "2024",
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
        if self.subtopic:
            d["subtopic"] = self.subtopic
        if self.source:
            d["source"] = self.source
        if self.options is not None:
            d["options"] = [opt.to_dict() for opt in self.options]
        if self.correct_answer is not None:
            d["correct_answer"] = self.correct_answer
        return d

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Question':
        opts = None
        if "options" in data and data["options"] is not None:
            opts = [QuestionOption.from_dict(o) for o in data["options"] if isinstance(o, dict)]

        q_id = str(data.get("id") or f"q-{uuid.uuid4().hex[:8]}")
        return cls(
            id=q_id,
            question_number=int(data.get("question_number", 1)),
            question_text=str(data.get("question_text", "")).strip(),
            exam_code=str(data.get("exam_code", "CUSTOM")).strip(),
            exam_category=str(data.get("exam_category", "ENGINEERING")),
            subject=str(data.get("subject", "General")).strip(),
            topic=str(data.get("topic", "General")).strip(),
            subtopic=data.get("subtopic"),
            marks=int(data.get("marks", 1)),
            difficulty=str(data.get("difficulty", "medium")).lower(),
            recommended_minutes=int(data.get("recommended_minutes", 0)),
            question_type=str(data.get("question_type", "mcq")).lower(),
            expected_points=list(data.get("expected_points") or []),
            keywords=list(data.get("keywords") or []),
            model_answer=str(data.get("model_answer", "")),
            evaluation_rubric=str(data.get("evaluation_rubric", "")),
            options=opts,
            correct_answer=data.get("correct_answer"),
            year=str(data.get("year", "2024")),
            source=data.get("source"),
            created_at=str(data.get("created_at") or datetime.now(timezone.utc).isoformat()),
            updated_at=str(data.get("updated_at") or datetime.now(timezone.utc).isoformat()),
        )
