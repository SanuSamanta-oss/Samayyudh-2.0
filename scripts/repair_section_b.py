import json
import hashlib
import fitz

def fp(s):
    return hashlib.sha256(s.strip().encode('utf-8')).hexdigest()

# 1. Extract and save diagram for 24 Jan Shift 1 Phys Q21, Q22, Q23
doc24 = fitz.open('data/pyq_uploads/134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf')
page24 = doc24[5]
for xref, out in [
    (148, 'public/pyq_diagrams/jee_main_2025_btech_20250124_shift1_physics_q21.png'),
    (150, 'public/pyq_diagrams/jee_main_2025_btech_20250124_shift1_physics_q22.png'),
    (152, 'public/pyq_diagrams/jee_main_2025_btech_20250124_shift1_physics_q23.png')
]:
    base = doc24.extract_image(xref)
    with open(out, 'wb') as f:
        f.write(base['image'])
    print('Extracted:', out)

# 2. Extract and save diagram for 22 Jan Shift 2 Phys Q22
doc22_s2 = fitz.open('data/pyq_uploads/122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf')
base = doc22_s2.extract_image(256)
with open('public/pyq_diagrams/jee_main_2025_btech_20250122_shift2_physics_q22.png', 'wb') as f:
    f.write(base['image'])
print('Extracted: public/pyq_diagrams/jee_main_2025_btech_20250122_shift2_physics_q22.png')

with open('data/pyq_database.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

q_map = {q['id']: q for q in db['questions']}

# --- 1. Shift 2 Phys Q22 ---
q_id = 'jee_main_2025_btech_20250122_shift2_phys_q22'
stmt = r'If equivalent resistance across AB is $\frac{NR}{2}$, find $N$.'
q_map[q_id] = {
    'id': q_id,
    'paper_id': 'jee_main_2025_btech_20250122_shift2',
    'exam': 'JEE Main',
    'year': 2025,
    'course': 'B.Tech',
    'exam_date_str': '22 January 2025',
    'shift': 'Shift 2',
    'session': 'Evening',
    'subject': 'Physics',
    'question_number': 22,
    'section': 'Section B',
    'question_type': 'Numerical Value',
    'question_statement': stmt,
    'options': None,
    'diagram_url': '/pyq_diagrams/jee_main_2025_btech_20250122_shift2_physics_q22.png',
    'review_required': False,
    'review_reason': None,
    'source_reference': '122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 6)',
    'fingerprint': fp(stmt),
    'created_at': '2026-11-01T12:00:00Z',
    'updated_at': '2026-11-01T12:00:00Z'
}

# --- 2. Shift 2 Math Q21 ---
q_id = 'jee_main_2025_btech_20250122_shift2_math_q21'
stmt = r'Let $\vec{a}$ and $\vec{b}$ be two unit vectors such that the angle between $\vec{a}$ and $\vec{b}$ is $\frac{\pi}{3}$. If $\lambda \vec{a} + 3\vec{b}$ and $2\vec{a} + \lambda \vec{b}$ are perpendicular to each other, then the product of all possible values of $\lambda$ is _____.'
q_map[q_id] = {
    'id': q_id,
    'paper_id': 'jee_main_2025_btech_20250122_shift2',
    'exam': 'JEE Main',
    'year': 2025,
    'course': 'B.Tech',
    'exam_date_str': '22 January 2025',
    'shift': 'Shift 2',
    'session': 'Evening',
    'subject': 'Mathematics',
    'question_number': 21,
    'section': 'Section B',
    'question_type': 'Numerical Value',
    'question_statement': stmt,
    'options': None,
    'diagram_url': None,
    'review_required': False,
    'review_reason': None,
    'source_reference': '122614-JEE-Main-2025-Question-Papers-With-Solutions-22-01-2025-Shift-2-PDF-Download.pdf (Page 16)',
    'fingerprint': fp(stmt),
    'created_at': '2026-11-01T12:00:00Z',
    'updated_at': '2026-11-01T12:00:00Z'
}

# --- 3. Shift 2 Math Q23 ---
q_id = 'jee_main_2025_btech_20250122_shift2_math_q23'
stmt = r'Consider two curves $E_1: \frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$ with eccentricity $e_1$ and $E_2: \frac{x^2}{A^2} + \frac{y^2}{B^2} = 1$ with eccentricity $e_2$. If $e_1 = \frac{1}{3} e_2$ and the distance between foci of both curves is $2\sqrt{3}$ and $a - A = 4$, then the sum of lengths of latus rectum of both curves is _____.'
if q_id in q_map:
    q_map[q_id]['question_statement'] = stmt
    q_map[q_id]['review_required'] = False
    q_map[q_id]['review_reason'] = None
    q_map[q_id]['fingerprint'] = fp(stmt)

# --- 4. Shift 2 Math Q24 ---
q_id = 'jee_main_2025_btech_20250122_shift2_math_q24'
stmt = r'The maximum number of common tangents to the curves $y = (x - 2)^2$ and $y^2 = 16 - 8x$ is _____.'
if q_id in q_map:
    q_map[q_id]['question_statement'] = stmt
    q_map[q_id]['review_required'] = False
    q_map[q_id]['review_reason'] = None
    q_map[q_id]['fingerprint'] = fp(stmt)

# --- 5. Shift 2 Math Q25 ---
q_id = 'jee_main_2025_btech_20250122_shift2_math_q25'
stmt = r'Let $P(10, -2, -1)$ and $Q$ be the point of perpendicular drawn from point $R(1, 7, 6)$ on the line joining the points $(2, -5, 11)$ and $(-6, 7, -5)$. Then the length $PQ$ is _____.'
if q_id in q_map:
    q_map[q_id]['question_statement'] = stmt
    q_map[q_id]['review_required'] = False
    q_map[q_id]['review_reason'] = None
    q_map[q_id]['fingerprint'] = fp(stmt)

# --- 6. 24 Jan Shift 1 Phys Q21-25 ---
q_id = 'jee_main_2025_btech_20250124_shift1_phys_q21'
if q_id in q_map:
    q_map[q_id]['diagram_url'] = '/pyq_diagrams/jee_main_2025_btech_20250124_shift1_physics_q21.png'
    q_map[q_id]['question_statement'] = r'The electric flux through the shaded area of square plate of side $a$ due to point charge placed at distance of $\frac{a}{2}$ from it as shown in figure, is $\frac{NQ}{48 \varepsilon_0}$. Then $N$ is _____.'

q_id = 'jee_main_2025_btech_20250124_shift1_phys_q22'
if q_id in q_map:
    q_map[q_id]['diagram_url'] = '/pyq_diagrams/jee_main_2025_btech_20250124_shift1_physics_q22.png'
    q_map[q_id]['question_statement'] = r'In a square loop of side length $a = \frac{1}{2\sqrt{2}}\text{ m}$, a current of $5\text{ A}$ is flowing. Find magnetic field at its centre in $(\mu\text{T})$.'

q_id = 'jee_main_2025_btech_20250124_shift1_phys_q23'
if q_id in q_map:
    q_map[q_id]['diagram_url'] = '/pyq_diagrams/jee_main_2025_btech_20250124_shift1_physics_q23.png'
    q_map[q_id]['question_statement'] = r'A wire of resistance $9\ \Omega$ is bent in the form of an equilateral triangle. Find the equivalent resistance between two vertices of triangle in $(\Omega)$.'

q_id = 'jee_main_2025_btech_20250124_shift1_phys_q24'
if q_id in q_map:
    q_map[q_id]['question_statement'] = r'Work done required to break a drop of radius $R$ into $27$ drops of equal radius is $10\text{ J}$. If work done to break drop of radius $R$ into $64$ drops of equal radii is $X\text{ J}$, then $X$ is _____.'

q_id = 'jee_main_2025_btech_20250124_shift1_phys_q25'
stmt = r'A particle moves on a straight line under the influence of a force $F = \alpha + \beta x^2$ where $x$ is the displacement, and $\beta = -12\text{ SI units}$. If the total work done for a displacement $x = 1\text{ m}$ is $12\text{ J}$, then $\alpha$ is _____ SI units.'
q_map[q_id] = {
    'id': q_id,
    'paper_id': 'jee_main_2025_btech_20250124_shift1',
    'exam': 'JEE Main',
    'year': 2025,
    'course': 'B.Tech',
    'exam_date_str': '24 January 2025',
    'shift': 'Shift 1',
    'session': 'Morning',
    'subject': 'Physics',
    'question_number': 25,
    'section': 'Section B',
    'question_type': 'Numerical Value',
    'question_statement': stmt,
    'options': None,
    'diagram_url': None,
    'review_required': False,
    'review_reason': None,
    'source_reference': '134331-JEE-Main-2025-Question-Papers-With-Solutions-24-Jan-2025-Shift-1-PDF-Download.pdf (Page 6)',
    'fingerprint': fp(stmt),
    'created_at': '2026-11-01T12:00:00Z',
    'updated_at': '2026-11-01T12:00:00Z'
}

# --- 7. 23 Jan Shift 1 Math Q23, Q24, Q25 ---
q_id = 'jee_main_2025_btech_20250123_shift1_math_q23'
stmt = r'If the equation $a(b - c)x^2 + b(c - a)x + c(a - b) = 0$ has equal roots and if $a + c = 5$ and $b = \frac{16}{5}$, then the value of $a^2 + c^2$ is equal to _____.'
q_map[q_id] = {
    'id': q_id,
    'paper_id': 'jee_main_2025_btech_20250123_shift1',
    'exam': 'JEE Main',
    'year': 2025,
    'course': 'B.Tech',
    'exam_date_str': '23 January 2025',
    'shift': 'Shift 1',
    'session': 'Morning',
    'subject': 'Mathematics',
    'question_number': 23,
    'section': 'Section B',
    'question_type': 'Numerical Value',
    'question_statement': stmt,
    'options': None,
    'diagram_url': None,
    'review_required': False,
    'review_reason': None,
    'source_reference': '192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 16)',
    'fingerprint': fp(stmt),
    'created_at': '2026-11-01T12:00:00Z',
    'updated_at': '2026-11-01T12:00:00Z'
}

q_id = 'jee_main_2025_btech_20250123_shift1_math_q24'
stmt = r'The area of the larger portion enclosed by curves $y = |x - 1|$ and $x^2 + y^2 = 25$ is equal to $\frac{1}{4}(\alpha\pi + \beta)\text{ sq. units}$ (where $\alpha, \beta$ are natural numbers), then $\alpha + \beta$ equals to _____.'
q_map[q_id] = {
    'id': q_id,
    'paper_id': 'jee_main_2025_btech_20250123_shift1',
    'exam': 'JEE Main',
    'year': 2025,
    'course': 'B.Tech',
    'exam_date_str': '23 January 2025',
    'shift': 'Shift 1',
    'session': 'Morning',
    'subject': 'Mathematics',
    'question_number': 24,
    'section': 'Section B',
    'question_type': 'Numerical Value',
    'question_statement': stmt,
    'options': None,
    'diagram_url': None,
    'review_required': False,
    'review_reason': None,
    'source_reference': '192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 16)',
    'fingerprint': fp(stmt),
    'created_at': '2026-11-01T12:00:00Z',
    'updated_at': '2026-11-01T12:00:00Z'
}

q_id = 'jee_main_2025_btech_20250123_shift1_math_q25'
stmt = 'Question 25'
q_map[q_id] = {
    'id': q_id,
    'paper_id': 'jee_main_2025_btech_20250123_shift1',
    'exam': 'JEE Main',
    'year': 2025,
    'course': 'B.Tech',
    'exam_date_str': '23 January 2025',
    'shift': 'Shift 1',
    'session': 'Morning',
    'subject': 'Mathematics',
    'question_number': 25,
    'section': 'Section B',
    'question_type': 'Numerical Value',
    'question_statement': stmt,
    'options': None,
    'diagram_url': None,
    'review_required': True,
    'review_reason': 'Question statement incomplete in memory-based PDF',
    'source_reference': '192951-JEE-Main-2025-Question-Papers-With-Solutions-23-Jan-2025-Shift-1-PDF-Download.pdf (Page 16)',
    'fingerprint': fp(stmt),
    'created_at': '2026-11-01T12:00:00Z',
    'updated_at': '2026-11-01T12:00:00Z'
}

# --- 8. 22 Jan Shift 1 Phys Q21 and Q22 diagrams ---
if 'jee_main_2025_btech_20250122_shift1_phys_q21' in q_map:
    q_map['jee_main_2025_btech_20250122_shift1_phys_q21']['diagram_url'] = '/pyq_diagrams/jee_main_2025_btech_20250122_shift1_physics_q21.png'
if 'jee_main_2025_btech_20250122_shift1_phys_q22' in q_map:
    q_map['jee_main_2025_btech_20250122_shift1_phys_q22']['diagram_url'] = '/pyq_diagrams/jee_main_2025_btech_20250122_shift1_physics_q22.png'

# Sort cleanly
sub_order = {'Physics': 1, 'Chemistry': 2, 'Mathematics': 3}
sorted_questions = sorted(q_map.values(), key=lambda q: (q['paper_id'], sub_order.get(q['subject'], 9), q['question_number']))

db['questions'] = sorted_questions
db['total_questions'] = len(sorted_questions)

with open('data/pyq_database.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print(f'Successfully updated database. Total questions: {len(sorted_questions)}')

