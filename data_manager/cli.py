"""
Command Line Interface for SamayYudh 2.0 Python Data Manager.
"""

import argparse
import sys
import json
import re
from pathlib import Path

# Fix Windows console unicode issues
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from data_manager.models import Question
from data_manager.repository import QuestionRepository
from data_manager.cleaner import clean_question, validate_question, deduplicate_questions
from data_manager.extractors.json_extractor import JSONExtractor
from data_manager.extractors.csv_extractor import CSVExtractor
from data_manager.extractors.pdf_extractor import PDFExtractor
from data_manager.extractors.raw_text_extractor import RawTextExtractor
from data_manager.exporters.ts_exporter import TSExporter
from data_manager.exporters.sql_exporter import SQLExporter
from data_manager.exporters.supabase_syncer import SupabaseSyncer
from data_manager.exporters.stats_reporter import StatsReporter
from data_manager.sample_data import get_curated_sample_questions


def cmd_init_repo(args, repo: QuestionRepository):
    """
    Ingests existing questions from src/lib/questions.ts into data/questions/
    """
    workspace_root = Path(__file__).resolve().parent.parent
    ts_file = workspace_root / "src" / "lib" / "questions.ts"

    if not ts_file.exists():
        print(f"Error: Could not find {ts_file}")
        return 1

    print(f"📖 Reading existing questions from {ts_file.name}...")
    with open(ts_file, "r", encoding="utf-8") as f:
        content = f.read()

    match = re.search(r'const rawQuestions:.*?=\s*(\[[\s\S]*?\]);\s*export const SAMPLE_QUESTIONS', content)
    if not match:
        print("Error: Could not locate rawQuestions array in questions.ts")
        return 1

    try:
        raw_data = json.loads(match.group(1))
    except Exception as e:
        print(f"Error parsing rawQuestions JSON: {e}")
        return 1

    questions = [clean_question(Question.from_dict(d)) for d in raw_data if isinstance(d, dict)]
    counts = repo.save_all(questions)
    print(f"✅ Successfully ingested {len(questions)} questions across {len(counts)} exams into data/questions/:")
    for code, cnt in sorted(counts.items()):
        print(f"   • {code}: {cnt} questions")
    return 0


def cmd_seed_samples(args, repo: QuestionRepository):
    """
    Seeds curated sample questions for GATE CS, JEE Mains, WBJEE, UPSC, NEET.
    """
    samples = get_curated_sample_questions()
    print(f"🌱 Adding {len(samples)} curated competitive exam questions...")
    counts = repo.save_all(samples)
    for code, cnt in sorted(counts.items()):
        print(f"   • {code}: added/updated questions")
    print("✅ Seed completed.")
    return 0


def cmd_stats(args, repo: QuestionRepository):
    questions = repo.load_all()
    StatsReporter.print_summary(questions)
    return 0


def cmd_validate(args, repo: QuestionRepository):
    questions = repo.load_all()
    print(f"🔍 Validating {len(questions)} questions across all exams...\n")
    issues_by_exam = {}
    total_issues = 0

    for q in questions:
        issues = validate_question(q)
        if issues:
            total_issues += len(issues)
            issues_by_exam.setdefault(q.exam_code, []).append((q.id, q.question_number, issues))

    if total_issues == 0:
        print("🎉 All questions passed validation with zero errors!")
    else:
        print(f"⚠️  Found {total_issues} issues:")
        for exam_code, q_issues in sorted(issues_by_exam.items()):
            print(f"\n[{exam_code}] ({len(q_issues)} questions with issues):")
            for q_id, q_num, issues in q_issues[:5]:  # show top 5
                print(f"  • Q#{q_num} ({q_id}): {', '.join(issues)}")
            if len(q_issues) > 5:
                print(f"  ... and {len(q_issues) - 5} more.")
    return 0


def cmd_clean(args, repo: QuestionRepository):
    print("🧹 Cleaning and normalizing all questions in repository...")
    all_qs = repo.load_all()
    cleaned = [clean_question(q) for q in all_qs]
    unique_qs, dupes = deduplicate_questions(cleaned)
    repo.save_all(unique_qs)
    print(f"✅ Cleaned {len(all_qs)} questions. Removed {dupes} duplicates.")
    return 0


def cmd_import_file(args, repo: QuestionRepository):
    filepath = Path(args.path)
    if not filepath.exists():
        print(f"Error: File not found: {filepath}")
        return 1

    suffix = filepath.suffix.lower()
    exam_code = args.exam or "CUSTOM"
    subject = args.subject or "General"

    print(f"📥 Ingesting file: {filepath.name} ({suffix})")
    questions = []

    if suffix == ".json":
        questions = JSONExtractor.extract_from_file(filepath)
    elif suffix in (".csv", ".tsv"):
        questions = CSVExtractor.extract_from_file(filepath, default_exam_code=exam_code, default_subject=subject)
    elif suffix == ".pdf":
        questions = PDFExtractor.extract_from_file(filepath, exam_code=exam_code, subject=subject)
    elif suffix in (".txt", ".log"):
        questions = RawTextExtractor.extract_from_file(filepath, exam_code=exam_code, subject=subject)
    else:
        print(f"Unsupported file format: {suffix}. Supported formats: .json, .csv, .tsv, .pdf, .txt")
        return 1

    if not questions:
        print("⚠️ No questions found or parsed from file.")
        return 1

    print(f"✅ Extracted {len(questions)} questions.")
    counts = repo.save_all(questions)
    for code, cnt in counts.items():
        print(f"   • Saved to {code}.json: {cnt} questions")
    return 0


def cmd_export_ts(args, repo: QuestionRepository):
    questions = repo.load_all()
    if not questions:
        print("⚠️ Repository has no questions to export. Run 'init-repo' or 'seed-samples' first.")
        return 1

    print(f"🚀 Exporting {len(questions)} questions to src/lib/questions.ts...")
    ts_path = TSExporter.export_to_typescript(questions)
    json_path = TSExporter.export_to_json_bundle(questions)
    print(f"✅ Generated TypeScript bank: {ts_path}")
    print(f"✅ Generated JSON bundle: {json_path}")
    return 0


def cmd_export_sql(args, repo: QuestionRepository):
    questions = repo.load_all()
    print("📝 Generating Supabase schema & SQL seeds...")
    schema_path = SQLExporter.generate_schema_sql()
    seed_path = SQLExporter.generate_seed_sql(questions)
    print(f"✅ Generated schema: {schema_path}")
    print(f"✅ Generated seed ({len(questions)} questions): {seed_path}")
    return 0


def cmd_sync_supabase(args, repo: QuestionRepository):
    questions = repo.load_all()
    if not questions:
        print("⚠️ No questions to sync.")
        return 1

    print(f"☁️ Syncing {len(questions)} questions to Supabase cloud...")
    syncer = SupabaseSyncer()
    res = syncer.sync_questions(questions, batch_size=args.batch_size)
    if res["success"]:
        print(f"✅ Successfully uploaded {res['uploaded']}/{res['total']} questions to Supabase!")
        return 0
    else:
        print(f"❌ Supabase sync failed: {res.get('error') or res.get('errors')}")
        return 1


def main():
    parser = argparse.ArgumentParser(
        description="SamayYudh 2.0 — Python Data Management CLI for Question Banks & Exams",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    subparsers = parser.add_subparsers(dest="command", help="Data Management Commands")

    # init-repo
    subparsers.add_parser("init-repo", help="Ingest existing questions from questions.ts into structured JSON repository")

    # seed-samples
    subparsers.add_parser("seed-samples", help="Seed standard curated questions for GATE CS, JEE, WBJEE, UPSC, NEET")

    # stats
    subparsers.add_parser("stats", help="Show question bank counts, subjects, and validation health")

    # validate
    subparsers.add_parser("validate", help="Validate all questions against schemas and rules")

    # clean
    subparsers.add_parser("clean", help="Clean unicode, trim whitespace, and deduplicate questions")

    # import-file
    p_import = subparsers.add_parser("import-file", help="Import questions from PDF, CSV, JSON, or TXT file")
    p_import.add_argument("--path", required=True, help="Path to input file")
    p_import.add_argument("--exam", default="CUSTOM", help="Exam code (e.g. GATE-CS-1, JEE-MAINS)")
    p_import.add_argument("--subject", default="General", help="Subject name")

    # export-ts
    subparsers.add_parser("export-ts", help="Export question banks to src/lib/questions.ts and public/data/questions.json")

    # export-sql
    subparsers.add_parser("export-sql", help="Export Supabase PostgreSQL schema and seed SQL files")

    # sync-supabase
    p_sync = subparsers.add_parser("sync-supabase", help="Push questions directly to Supabase cloud database")
    p_sync.add_argument("--batch-size", type=int, default=50, help="Batch size for upsert requests")

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        return 0

    repo = QuestionRepository()

    commands = {
        "init-repo": cmd_init_repo,
        "seed-samples": cmd_seed_samples,
        "stats": cmd_stats,
        "validate": cmd_validate,
        "clean": cmd_clean,
        "import-file": cmd_import_file,
        "export-ts": cmd_export_ts,
        "export-sql": cmd_export_sql,
        "sync-supabase": cmd_sync_supabase,
    }

    cmd_fn = commands.get(args.command)
    if cmd_fn:
        return cmd_fn(args, repo)
    else:
        parser.print_help()
        return 1


if __name__ == "__main__":
    sys.exit(main())
