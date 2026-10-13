"""
SamayYudh 2.0 — Python Data Management Suite
"""

from data_manager.models import Question, QuestionOption, QuestionType, ExamCategoryCode, Difficulty
from data_manager.repository import QuestionRepository
from data_manager.cleaner import clean_question, sanitize_text, validate_question, deduplicate_questions
from data_manager.extractors import JSONExtractor, CSVExtractor, PDFExtractor, RawTextExtractor
from data_manager.exporters import TSExporter, SQLExporter, SupabaseSyncer, StatsReporter

__version__ = "2.0.0"

__all__ = [
    "Question",
    "QuestionOption",
    "QuestionType",
    "ExamCategoryCode",
    "Difficulty",
    "QuestionRepository",
    "clean_question",
    "sanitize_text",
    "validate_question",
    "deduplicate_questions",
    "JSONExtractor",
    "CSVExtractor",
    "PDFExtractor",
    "RawTextExtractor",
    "TSExporter",
    "SQLExporter",
    "SupabaseSyncer",
    "StatsReporter",
]
