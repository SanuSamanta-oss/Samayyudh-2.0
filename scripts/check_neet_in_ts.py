import re

with open('src/lib/questions.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'"exam_code":\s*"(NEET[^"]*)"', text)
print("exam_code matches:", len(matches), set(matches))

ids = re.findall(r'"id":\s*"(neet-[^"]+)"', text)
print("IDs starting with neet-:", len(ids), ids[:10])

