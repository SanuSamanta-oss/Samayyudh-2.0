import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import re

with open('src/lib/questions.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Find NEET_QUESTIONS export or array
matches = re.findall(r'\{\s*"id":\s*"(neet-2024-q\d+)",.*?"subject":\s*"([^"]+)",.*?"topic":\s*"([^"]+)"', text, re.DOTALL)
print(f"Total NEET 2024 questions found: {len(matches)}")
from collections import Counter
subjects = Counter([m[1] for m in matches])
print("Subjects:", dict(subjects))

