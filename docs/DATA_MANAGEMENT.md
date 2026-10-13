# 🐍 Python Data Management — SamayYudh 2.0

> **Canonical Guide for Managing Question Banks, Exam Papers & Database Sync in SamayYudh 2.0.**

---

## 🌟 Overview

SamayYudh 2.0 uses a modular **Python 3 Data Management Pipeline** (`data_manager/`) to ingest, sanitize, validate, and export competitive exam questions across all supported streams (**GATE, JEE, WBJEE, UPSC, NEET, University, and Custom**).

### Why Python for Data Management?
- **High-Performance Ingestion:** Direct parsing of multi-page PDF question papers with PyMuPDF / PyPDF2.
- **Automated Text Sanitization:** Normalizes mathematical unicode (NFKC) and cleans formatting artifacts.
- **Tabular & OCR Support:** Ingest questions from CSV, TSV, JSON, or OCR dumps in seconds.
- **Zero-Friction Exports:** Seamlessly compiles to both frontend TypeScript (`src/lib/questions.ts`), lightweight JSON bundles (`public/data/questions.json`), and Supabase PostgreSQL SQL seeds (`supabase/seed_questions.sql`).

---

## 📂 Architecture

```text
SamayYudh 2.0/
├── data_manager/
│   ├── __init__.py           # Package exports and version
│   ├── __main__.py           # Entrypoint for python -m data_manager
│   ├── cli.py                # Command Line Interface (argparse)
│   ├── models.py             # Strongly-typed Question & Option models
│   ├── cleaner.py            # Sanitizer, NFKC normalizer, deduplicator
│   ├── repository.py         # JSON storage manager in data/questions/
│   ├── sample_data.py        # Curated questions for major exams
│   ├── extractors/
│   │   ├── pdf_extractor.py      # PyMuPDF / PyPDF2 question paper parser
│   │   ├── csv_extractor.py      # CSV / TSV tabular parser
│   │   ├── json_extractor.py     # JSON question bank parser
│   │   └── raw_text_extractor.py # Plain text and OCR dump parser
│   └── exporters/
│       ├── ts_exporter.py        # Compiles src/lib/questions.ts
│       ├── sql_exporter.py       # Generates supabase/seed_questions.sql
│       ├── supabase_syncer.py    # Direct Supabase REST API upsert
│       └── stats_reporter.py     # Terminal analytics and health checks
├── data/
│   ├── questions/            # Clean JSON datasets organized by exam code
│   │   ├── GATE-AE.json
│   │   ├── GATE-AG.json
│   │   ├── GATE-CS-1.json
│   │   ├── JEE-MAINS.json
│   │   ├── UPSC-PRELIMS.json
│   │   └── ...
│   └── raw/                  # Staging directory for raw input files (PDF/CSV)
└── supabase/
    ├── questions_schema.sql  # PostgreSQL table & RLS definitions
    └── seed_questions.sql    # Bulk SQL INSERT statements
```

---

## ⚡ CLI Command Reference

All data management commands are executed from the project root using:

```bash
python -m data_manager <command> [options]
```

### 1. View Question Bank Statistics
Display counts by exam, category, difficulty, question type, and validation health:
```bash
python -m data_manager stats
```

### 2. Validate Questions
Run deep schema validation (checks empty fields, MCQ options count, correct answer flags, and valid marks):
```bash
python -m data_manager validate
```

### 3. Clean & Deduplicate
Sanitize math characters, strip trailing whitespaces, and remove duplicate entries:
```bash
python -m data_manager clean
```

### 4. Ingest Existing Frontend Bank
Extract questions from `src/lib/questions.ts` into structured JSON files under `data/questions/`:
```bash
python -m data_manager init-repo
```

### 5. Seed Curated Multi-Exam Samples
Populate sample question sets for GATE CS, JEE Mains, WBJEE, UPSC, and NEET:
```bash
python -m data_manager seed-samples
```

### 6. Import from External Files

#### Import CSV or TSV:
```bash
python -m data_manager import-file --path data/raw/sample_questions.csv --exam GATE-DA --subject "Data Science and AI"
```

#### Import PDF Question Paper:
```bash
python -m data_manager import-file --path data/raw/gate_paper.pdf --exam GATE-ME --subject "Mechanical Engineering"
```

#### Import JSON File:
```bash
python -m data_manager import-file --path data/raw/jee_advanced.json
```

### 7. Export to Frontend TypeScript
Compile all questions from `data/questions/` directly into `src/lib/questions.ts` and `public/data/questions.json`:
```bash
python -m data_manager export-ts
```

### 8. Export to Supabase SQL
Generate PostgreSQL table schema and bulk SQL seed statements:
```bash
python -m data_manager export-sql
```
*Generated files:*
- `supabase/questions_schema.sql`
- `supabase/seed_questions.sql`

### 9. Sync Directly to Supabase Cloud
Push questions directly to Supabase via PostgREST using credentials from `.env.local`:
```bash
python -m data_manager sync-supabase --batch-size 50
```

---

## 📄 CSV Ingestion Format

To import questions via CSV, use standard column headers:

| Column | Required | Description | Example |
|---|---|---|---|
| `exam_code` | Yes | Exam identifier | `JEE-MAINS`, `GATE-CS-1` |
| `subject` | Yes | Subject name | `Physics`, `Computer Science` |
| `topic` | Yes | Chapter / Topic | `Kinematics`, `Data Structures` |
| `question_text` | Yes | The question statement | `What is the time complexity...?` |
| `marks` | Yes | Marks awarded | `1`, `2`, `4` |
| `difficulty` | No | `easy`, `medium`, or `hard` | `medium` |
| `option_a` | For MCQs | Option A text | `O(1)` |
| `option_b` | For MCQs | Option B text | `O(n)` |
| `option_c` | For MCQs | Option C text | `O(log n)` |
| `option_d` | For MCQs | Option D text | `O(n^2)` |
| `correct_answer` | For MCQs | Correct option key | `opt_b` or `b` |
| `model_answer` | No | Step-by-step solution | `In the worst case...` |
| `evaluation_rubric` | No | Examiner marking rubric | `2 marks for exact derivation.` |

---

## 🔒 Supabase Integration

1. In Supabase Dashboard → **SQL Editor**, run:
   ```sql
   -- Run contents of supabase/questions_schema.sql
   ```
2. Seed the questions:
   ```sql
   -- Run contents of supabase/seed_questions.sql
   ```
3. Or run the automated Python syncer:
   ```bash
   python -m data_manager sync-supabase
   ```
