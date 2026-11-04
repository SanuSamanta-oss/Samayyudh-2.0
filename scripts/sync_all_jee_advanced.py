import json, hashlib

def sync_master():
    with open('data/questions/JEE_ADVANCED/JEE_ADVANCED_PHYSICS.json', 'r', encoding='utf-8') as f:
        phys_data = json.load(f)
    with open('data/questions/JEE_ADVANCED/JEE_ADVANCED_CHEMISTRY.json', 'r', encoding='utf-8') as f:
        chem_data = json.load(f)
    with open('data/questions/JEE_ADVANCED/JEE_ADVANCED_MATHEMATICS.json', 'r', encoding='utf-8') as f:
        math_data = json.load(f)

    # 1. Combine all JEE Advanced questions
    all_adv = phys_data + chem_data + math_data
    with open('data/questions/JEE_ADVANCED/JEE-ADVANCED.json', 'w', encoding='utf-8') as f:
        json.dump(all_adv, f, indent=2, ensure_ascii=False)
    print(f"1. Saved {len(all_adv)} questions to data/questions/JEE_ADVANCED/JEE-ADVANCED.json")

    # 2. Update pyq_database.json
    with open('data/pyq_database.json', 'r', encoding='utf-8') as f:
        db = json.load(f)

    # Retain JEE Main questions
    main_questions = [q for q in db.get('questions', []) if q.get('exam') != 'JEE Advanced']
    main_papers = [p for p in db.get('papers', []) if p.get('exam') != 'JEE Advanced']

    # Create subject papers for JEE Advanced
    adv_papers = [
        {
            "id": "jee_adv_physics",
            "exam": "JEE Advanced",
            "year": 2024,
            "course": "B.Tech",
            "exam_date": "2024-05-26",
            "exam_date_str": "Chapter-wise Physics Archive",
            "shift": "Physics (33 Chapters)",
            "session": "All Chapters",
            "source_filename": "JEE_ADVANCED_PHYSICS.json",
            "source_classification": "Official Chapterwise",
            "total_questions": len(phys_data),
            "physics_count": len(phys_data),
            "chemistry_count": 0,
            "mathematics_count": 0,
            "import_status": "Successfully Imported",
            "created_at": "2026-11-04T00:00:00Z"
        },
        {
            "id": "jee_adv_chemistry",
            "exam": "JEE Advanced",
            "year": 2024,
            "course": "B.Tech",
            "exam_date": "2024-05-26",
            "exam_date_str": "Chapter-wise Chemistry Archive",
            "shift": "Chemistry (31 Chapters)",
            "session": "All Chapters",
            "source_filename": "JEE_ADVANCED_CHEMISTRY.json",
            "source_classification": "Official Chapterwise",
            "total_questions": len(chem_data),
            "physics_count": 0,
            "chemistry_count": len(chem_data),
            "mathematics_count": 0,
            "import_status": "Successfully Imported",
            "created_at": "2026-11-04T00:00:00Z"
        },
        {
            "id": "jee_adv_mathematics",
            "exam": "JEE Advanced",
            "year": 2024,
            "course": "B.Tech",
            "exam_date": "2024-05-26",
            "exam_date_str": "Chapter-wise Mathematics Archive",
            "shift": "Mathematics (31 Chapters)",
            "session": "All Chapters",
            "source_filename": "JEE_ADVANCED_MATHEMATICS.json",
            "source_classification": "Official Chapterwise",
            "total_questions": len(math_data),
            "physics_count": 0,
            "chemistry_count": 0,
            "mathematics_count": len(math_data),
            "import_status": "Successfully Imported",
            "created_at": "2026-11-04T00:00:00Z"
        }
    ]

    converted_adv = []
    for q in all_adv:
        opts = None
        if q.get('options'):
            opts = [{'key': o['key'], 'text': o['text']} for o in q['options']]

        yr = 2020
        if q.get('year'):
            try:
                yr = int(q['year'])
            except:
                yr = 2020

        q_type_str = "MCQ" if q.get('question_type') in ['mcq', 'multiple_correct'] else "Numerical Value"
        fp = hashlib.sha256(q['question_text'].encode('utf-8')).hexdigest()

        subj = q['subject']
        paper_id = f"jee_adv_{subj.lower()}"

        pyq_q = {
            "id": q['id'],
            "paper_id": paper_id,
            "exam": "JEE Advanced",
            "year": yr,
            "course": "B.Tech",
            "exam_date_str": f"JEE Advanced {yr}",
            "shift": q['chapter'],
            "session": "Chapterwise",
            "subject": subj,
            "question_number": q['question_number'],
            "section": q['chapter'],
            "question_type": q_type_str,
            "question_statement": q['question_text'],
            "options": opts,
            "diagram_url": q.get('diagram_url'),
            "review_required": False,
            "review_reason": None,
            "source_reference": f"JEE Advanced {yr} • {q['chapter']}",
            "fingerprint": fp,
            "created_at": "2026-11-04T00:00:00Z",
            "correct_option": q.get('correct_answer') or "",
            "is_placeholder": False,
            "clean_source": f"JEE Advanced {yr} • {q['chapter']}"
        }
        converted_adv.append(pyq_q)

    db['papers'] = main_papers + adv_papers
    db['questions'] = main_questions + converted_adv
    db['updated_at'] = "2026-11-04T22:00:00Z"

    with open('data/pyq_database.json', 'w', encoding='utf-8') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)

    print(f"2. Saved {len(db['questions'])} total questions to data/pyq_database.json:")
    print(f"   - JEE Main: {len(main_questions)}")
    print(f"   - JEE Advanced Physics: {len(phys_data)}")
    print(f"   - JEE Advanced Chemistry: {len(chem_data)}")
    print(f"   - JEE Advanced Mathematics: {len(math_data)}")
    print(f"   - Total JEE Advanced: {len(converted_adv)}")

if __name__ == '__main__':
    sync_master()

