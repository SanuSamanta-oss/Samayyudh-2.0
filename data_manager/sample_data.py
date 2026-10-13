"""
Curated standard sample questions for major competitive exams
(GATE CS, JEE Mains, WBJEE, UPSC, NEET) to seed the multi-exam question bank.
"""

from typing import List
from data_manager.models import Question, QuestionOption


def get_curated_sample_questions() -> List[Question]:
    questions: List[Question] = [
        # --- GATE CS ---
        Question(
            id="gate-cs-q1",
            question_number=1,
            question_text="Consider a binary search tree (BST) with n distinct keys. What is the worst-case time complexity of searching for an element in this BST?",
            exam_code="GATE-CS-1",
            exam_category="ENGINEERING",
            subject="Computer Science",
            topic="Data Structures & Algorithms",
            marks=1,
            difficulty="easy",
            recommended_minutes=2,
            options=[
                QuestionOption(id="opt_a", text="O(1)", is_correct=False),
                QuestionOption(id="opt_b", text="O(log n)", is_correct=False),
                QuestionOption(id="opt_c", text="O(n)", is_correct=True),
                QuestionOption(id="opt_d", text="O(n log n)", is_correct=False),
            ],
            correct_answer="opt_c",
            model_answer="In the worst case (a degenerate or skewed tree where elements are inserted in sorted order), the BST behaves like a linked list, requiring O(n) search time.",
            evaluation_rubric="1 mark for identifying O(n) due to tree skewness.",
            keywords=["BST", "skewed tree", "worst-case", "O(n)"],
            expected_points=["Worst case occurs in a skewed tree", "Tree height becomes n", "Search time is O(n)"]
        ),
        Question(
            id="gate-cs-q2",
            question_number=2,
            question_text="Which of the following page replacement algorithms does NOT suffer from Belady's Anomaly?",
            exam_code="GATE-CS-1",
            exam_category="ENGINEERING",
            subject="Computer Science",
            topic="Operating Systems",
            marks=1,
            difficulty="medium",
            recommended_minutes=2,
            options=[
                QuestionOption(id="opt_a", text="FIFO (First-In, First-Out)", is_correct=False),
                QuestionOption(id="opt_b", text="LRU (Least Recently Used)", is_correct=True),
                QuestionOption(id="opt_c", text="Second Chance Algorithm", is_correct=False),
                QuestionOption(id="opt_d", text="Random Page Replacement", is_correct=False),
            ],
            correct_answer="opt_b",
            model_answer="LRU is a stack algorithm. Stack algorithms satisfy the inclusion property and therefore never suffer from Belady's Anomaly.",
            evaluation_rubric="1 mark for LRU and stack algorithm property.",
            keywords=["Belady anomaly", "LRU", "stack algorithm", "page replacement"],
            expected_points=["LRU satisfies inclusion property", "FIFO suffers from Belady's Anomaly"]
        ),
        Question(
            id="gate-cs-q3",
            question_number=3,
            question_text="In an IPv4 packet, the Total Length field is 1200 bytes and the Header Length (IHL) is 5. What is the size of the payload (data) in bytes?",
            exam_code="GATE-CS-1",
            exam_category="ENGINEERING",
            subject="Computer Science",
            topic="Computer Networks",
            marks=2,
            difficulty="medium",
            recommended_minutes=3,
            options=[
                QuestionOption(id="opt_a", text="1180 bytes", is_correct=True),
                QuestionOption(id="opt_b", text="1195 bytes", is_correct=False),
                QuestionOption(id="opt_c", text="1200 bytes", is_correct=False),
                QuestionOption(id="opt_d", text="1175 bytes", is_correct=False),
            ],
            correct_answer="opt_a",
            model_answer="The IHL field represents length in 32-bit (4-byte) words. Header size = 5 * 4 = 20 bytes. Payload = Total Length - Header Length = 1200 - 20 = 1180 bytes.",
            evaluation_rubric="2 marks for correctly multiplying IHL by 4 and subtracting from 1200.",
            keywords=["IPv4", "IHL", "payload", "header length"]
        ),

        # --- JEE MAINS ---
        Question(
            id="jee-main-q1",
            question_number=1,
            question_text="A projectile is thrown with an initial velocity of 20 m/s at an angle of 30° with the horizontal. Taking g = 10 m/s², what is the maximum height reached by the projectile?",
            exam_code="JEE-MAINS",
            exam_category="JEE_MAINS",
            subject="Physics",
            topic="Kinematics",
            marks=4,
            difficulty="medium",
            recommended_minutes=3,
            options=[
                QuestionOption(id="opt_a", text="5 m", is_correct=True),
                QuestionOption(id="opt_b", text="10 m", is_correct=False),
                QuestionOption(id="opt_c", text="15 m", is_correct=False),
                QuestionOption(id="opt_d", text="20 m", is_correct=False),
            ],
            correct_answer="opt_a",
            model_answer="H_max = (u * sin θ)² / (2g) = (20 * sin 30°)² / (2 * 10) = (20 * 0.5)² / 20 = 100 / 20 = 5 meters.",
            evaluation_rubric="+4 for correct option, -1 for negative marking.",
            keywords=["projectile motion", "maximum height", "kinematics"]
        ),
        Question(
            id="jee-main-q2",
            question_number=2,
            question_text="Which of the following compounds exhibits optical isomerism?",
            exam_code="JEE-MAINS",
            exam_category="JEE_MAINS",
            subject="Chemistry",
            topic="Organic Chemistry",
            marks=4,
            difficulty="medium",
            recommended_minutes=2,
            options=[
                QuestionOption(id="opt_a", text="2-Chlorobutane", is_correct=True),
                QuestionOption(id="opt_b", text="1-Chlorobutane", is_correct=False),
                QuestionOption(id="opt_c", text="2-Chloropropane", is_correct=False),
                QuestionOption(id="opt_d", text="Chloroethane", is_correct=False),
            ],
            correct_answer="opt_a",
            model_answer="2-Chlorobutane has a chiral carbon center (C2 is bonded to -H, -Cl, -CH3, and -C2H5), giving rise to non-superimposable mirror images (enantiomers).",
            evaluation_rubric="+4 for 2-chlorobutane.",
            keywords=["chiral carbon", "optical isomerism", "enantiomers"]
        ),
        Question(
            id="jee-main-q3",
            question_number=3,
            question_text="Evaluate the limit: lim (x -> 0) [(sin 3x) / x].",
            exam_code="JEE-MAINS",
            exam_category="JEE_MAINS",
            subject="Mathematics",
            topic="Calculus",
            marks=4,
            difficulty="easy",
            recommended_minutes=2,
            options=[
                QuestionOption(id="opt_a", text="1", is_correct=False),
                QuestionOption(id="opt_b", text="3", is_correct=True),
                QuestionOption(id="opt_c", text="0", is_correct=False),
                QuestionOption(id="opt_d", text="Undefined", is_correct=False),
            ],
            correct_answer="opt_b",
            model_answer="lim (x -> 0) [sin(3x) / x] = 3 * lim (x -> 0) [sin(3x) / 3x] = 3 * 1 = 3.",
            evaluation_rubric="+4 for 3.",
            keywords=["limits", "trigonometric limit", "calculus"]
        ),

        # --- WBJEE ---
        Question(
            id="wbjee-q1",
            question_number=1,
            question_text="If the roots of the quadratic equation x² - px + q = 0 differ by 1, then:",
            exam_code="WBJEE",
            exam_category="STATE_ENTRANCE",
            subject="Mathematics",
            topic="Algebra",
            marks=1,
            difficulty="medium",
            recommended_minutes=2,
            options=[
                QuestionOption(id="opt_a", text="p² = 4q + 1", is_correct=True),
                QuestionOption(id="opt_b", text="p² = 4q - 1", is_correct=False),
                QuestionOption(id="opt_c", text="q² = 4p + 1", is_correct=False),
                QuestionOption(id="opt_d", text="q² = 4p - 1", is_correct=False),
            ],
            correct_answer="opt_a",
            model_answer="|α - β| = 1 => (α - β)² = 1 => (α + β)² - 4αβ = 1 => p² - 4q = 1 => p² = 4q + 1.",
            evaluation_rubric="1 mark for p² = 4q + 1.",
            keywords=["quadratic equations", "roots difference", "algebra"]
        ),

        # --- UPSC PRELIMS ---
        Question(
            id="upsc-prelims-q1",
            question_number=1,
            question_text="Under the Constitution of India, which one of the following is NOT a Fundamental Right?",
            exam_code="UPSC-PRELIMS",
            exam_category="CIVIL_SERVICES",
            subject="Indian Polity",
            topic="Fundamental Rights",
            marks=2,
            difficulty="easy",
            recommended_minutes=2,
            options=[
                QuestionOption(id="opt_a", text="Right to Equality", is_correct=False),
                QuestionOption(id="opt_b", text="Right to Property", is_correct=True),
                QuestionOption(id="opt_c", text="Right to Freedom of Religion", is_correct=False),
                QuestionOption(id="opt_d", text="Right to Constitutional Remedies", is_correct=False),
            ],
            correct_answer="opt_b",
            model_answer="Right to Property was deleted from the list of Fundamental Rights by the 44th Amendment Act, 1978, and made a legal right under Article 300A in Part XII of the Constitution.",
            evaluation_rubric="2 marks for Right to Property.",
            keywords=["Right to Property", "44th Amendment", "Article 300A", "Fundamental Rights"]
        ),
        Question(
            id="upsc-prelims-q2",
            question_number=2,
            question_text="The Monetary Policy Committee (MPC) in India is headed by:",
            exam_code="UPSC-PRELIMS",
            exam_category="CIVIL_SERVICES",
            subject="Indian Economy",
            topic="Banking & Monetary Policy",
            marks=2,
            difficulty="medium",
            recommended_minutes=2,
            options=[
                QuestionOption(id="opt_a", text="The Union Finance Minister", is_correct=False),
                QuestionOption(id="opt_b", text="The Governor of the Reserve Bank of India", is_correct=True),
                QuestionOption(id="opt_c", text="The Chief Economic Advisor", is_correct=False),
                QuestionOption(id="opt_d", text="The Prime Minister of India", is_correct=False),
            ],
            correct_answer="opt_b",
            model_answer="The Governor of the Reserve Bank of India is the ex-officio Chairperson of the Monetary Policy Committee (MPC).",
            evaluation_rubric="2 marks for RBI Governor.",
            keywords=["MPC", "RBI Governor", "Monetary Policy", "Economy"]
        ),

        # --- NEET ---
        Question(
            id="neet-q1",
            question_number=1,
            question_text="Which organelle is known as the 'powerhouse of the cell' responsible for generating cellular ATP?",
            exam_code="NEET",
            exam_category="MEDICAL",
            subject="Biology",
            topic="Cell Biology",
            marks=4,
            difficulty="easy",
            recommended_minutes=1,
            options=[
                QuestionOption(id="opt_a", text="Mitochondria", is_correct=True),
                QuestionOption(id="opt_b", text="Ribosome", is_correct=False),
                QuestionOption(id="opt_c", text="Endoplasmic Reticulum", is_correct=False),
                QuestionOption(id="opt_d", text="Golgi Apparatus", is_correct=False),
            ],
            correct_answer="opt_a",
            model_answer="Mitochondria generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy through oxidative phosphorylation.",
            evaluation_rubric="+4 for Mitochondria.",
            keywords=["Mitochondria", "ATP", "powerhouse", "cellular respiration"]
        ),
        Question(
            id="neet-q2",
            question_number=2,
            question_text="During which phase of meiosis do homologous chromosomes cross over and exchange genetic material?",
            exam_code="NEET",
            exam_category="MEDICAL",
            subject="Biology",
            topic="Genetics & Cell Division",
            marks=4,
            difficulty="medium",
            recommended_minutes=2,
            options=[
                QuestionOption(id="opt_a", text="Leptotene", is_correct=False),
                QuestionOption(id="opt_b", text="Zygotene", is_correct=False),
                QuestionOption(id="opt_c", text="Pachytene", is_correct=True),
                QuestionOption(id="opt_d", text="Diplotene", is_correct=False),
            ],
            correct_answer="opt_c",
            model_answer="Crossing over takes place during the Pachytene stage of Prophase I of Meiosis, mediated by the recombinase enzyme complex.",
            evaluation_rubric="+4 for Pachytene.",
            keywords=["Pachytene", "crossing over", "Prophase I", "Meiosis"]
        )
    ]
    return questions
