"""
Generate SQL INSERT file from pyq_database.json
to be pasted into Supabase SQL Editor.
"""
import json
import sys
import os

sys.stdout.reconfigure(encoding="utf-8")

BASE = r"c:\Users\chang\OneDrive\Desktop\Projects\Samayyudh 2.0"
DB_PATH = os.path.join(BASE, "data", "pyq_database.json")
OUT_PATH = os.path.join(BASE, "supabase", "pyq_insert.sql")

with open(DB_PATH, encoding="utf-8") as f:
    db = json.load(f)

papers = db.get("papers", [])
questions = db.get("questions", [])


def esc(v):
    """Escape a scalar value for SQL."""
    if v is None:
        return "NULL"
    s = str(v).replace("'", "''")
    return f"'{s}'"


def esc_json(v):
    """Escape a Python object as a JSON string for SQL."""
    if v is None:
        return "NULL"
    s = json.dumps(v, ensure_ascii=False).replace("'", "''")
    return f"'{s}'"


def esc_bool(v):
    return "TRUE" if v else "FALSE"


lines = []
lines.append("-- SamayYudh 2.0 PYQ Import SQL")
lines.append("-- Generated from data/pyq_database.json")
lines.append("-- 5 papers, 352 questions — JEE Main 2025 B.Tech")
lines.append("")
lines.append("-- ================================================")
lines.append("-- STEP 1: Make sure tables exist.")
lines.append("--   Run supabase/pyq_schema.sql in SQL Editor first.")
lines.append("-- ================================================")
lines.append("")
lines.append("-- STEP 2: Insert Papers (5 rows)")

for p in papers:
    cols = (
        "id,exam,year,course,exam_date,exam_date_str,shift,session,"
        "source_filename,source_classification,checksum,"
        "total_questions,physics_count,chemistry_count,mathematics_count,"
        "import_status,created_at,updated_at"
    )
    vals = ",".join([
        esc(p["id"]),
        esc(p["exam"]),
        str(p["year"]),
        esc(p["course"]),
        esc(p["exam_date"]),
        esc(p["exam_date_str"]),
        esc(p["shift"]),
        esc(p.get("session")),
        esc(p["source_filename"]),
        esc(p["source_classification"]),
        esc(p.get("checksum")),
        str(p["total_questions"]),
        str(p["physics_count"]),
        str(p["chemistry_count"]),
        str(p["mathematics_count"]),
        esc(p["import_status"]),
        "now()",
        "now()",
    ])
    sql = (
        f"INSERT INTO public.pyq_exam_papers ({cols}) "
        f"VALUES ({vals}) ON CONFLICT (id) DO NOTHING;"
    )
    lines.append(sql)

lines.append("")
lines.append(f"-- STEP 3: Insert Questions ({len(questions)} rows)")

for q in questions:
    cols = (
        "id,paper_id,exam,year,course,exam_date_str,shift,session,"
        "subject,question_number,section,question_type,"
        "question_statement,options,diagram_url,"
        "review_required,review_reason,source_reference,fingerprint,"
        "created_at,updated_at"
    )
    vals = ",".join([
        esc(q["id"]),
        esc(q["paper_id"]),
        esc(q["exam"]),
        str(q["year"]),
        esc(q["course"]),
        esc(q["exam_date_str"]),
        esc(q["shift"]),
        esc(q.get("session")),
        esc(q["subject"]),
        str(q["question_number"]),
        esc(q["section"]),
        esc(q["question_type"]),
        esc(q["question_statement"]),
        esc_json(q.get("options")),
        esc(q.get("diagram_url")),
        esc_bool(q.get("review_required", False)),
        esc(q.get("review_reason")),
        esc(q.get("source_reference")),
        esc(q.get("fingerprint")),
        "now()",
        "now()",
    ])
    sql = (
        f"INSERT INTO public.pyq_questions ({cols}) "
        f"VALUES ({vals}) ON CONFLICT (id) DO NOTHING;"
    )
    lines.append(sql)

lines.append("")
lines.append("-- Done. Run SELECT COUNT(*) FROM public.pyq_questions; to verify.")

with open(OUT_PATH, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"Written {len(lines)} lines to supabase/pyq_insert.sql")
print(f"  Papers : {len(papers)}")
print(f"  Questions : {len(questions)}")
print(f"  Output : {OUT_PATH}")

