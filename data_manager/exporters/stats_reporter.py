"""
Question Bank Statistics & Quality Reporter.
"""

from typing import List, Dict, Any
from data_manager.models import Question
from data_manager.cleaner import validate_question


class StatsReporter:
    @staticmethod
    def print_summary(questions: List[Question]):
        total = len(questions)
        if total == 0:
            print("Question repository is empty.")
            return

        by_exam: Dict[str, List[Question]] = {}
        by_category: Dict[str, int] = {}
        by_type: Dict[str, int] = {}
        by_diff: Dict[str, int] = {}
        issues_count = 0

        for q in questions:
            by_exam.setdefault(q.exam_code, []).append(q)
            by_category[q.exam_category] = by_category.get(q.exam_category, 0) + 1
            by_type[q.question_type] = by_type.get(q.question_type, 0) + 1
            by_diff[q.difficulty] = by_diff.get(q.difficulty, 0) + 1
            issues = validate_question(q)
            if issues:
                issues_count += 1

        print("\n" + "=" * 65)
        print(f"📊  SAMAYYUDH 2.0 — QUESTION BANK REPORT")
        print("=" * 65)
        print(f"Total Questions    : {total}")
        print(f"Total Exams        : {len(by_exam)}")
        print(f"Validation Health  : {round((total - issues_count)/total * 100, 1)}% valid ({issues_count} with warnings)")
        print("-" * 65)
        
        print("\n📚 Breakdown by Exam Code:")
        print(f"{'Exam Code':<16} | {'Count':<6} | {'Subject':<25} | {'Marks Range'}")
        print("-" * 65)
        for code, qs in sorted(by_exam.items()):
            subj = qs[0].subject if qs else "N/A"
            min_m = min(q.marks for q in qs)
            max_m = max(q.marks for q in qs)
            m_range = f"{min_m}m" if min_m == max_m else f"{min_m}-{max_m}m"
            print(f"{code:<16} | {len(qs):<6} | {subj[:24]:<25} | {m_range}")

        print("\n🏷️  Breakdown by Category:")
        for cat, cnt in sorted(by_category.items(), key=lambda x: -x[1]):
            print(f"  • {cat:<22} : {cnt} questions")

        print("\n🎯 Breakdown by Question Type:")
        for q_type, cnt in sorted(by_type.items(), key=lambda x: -x[1]):
            print(f"  • {q_type:<18} : {cnt} questions")

        print("\n⚡ Breakdown by Difficulty:")
        for diff, cnt in sorted(by_diff.items()):
            print(f"  • {diff:<18} : {cnt} questions")
        print("=" * 65 + "\n")
