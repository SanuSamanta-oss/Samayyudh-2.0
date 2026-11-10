import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

with open('src/lib/questions.ts', 'r', encoding='utf-8') as f:
    text = f.read()

start_idx = text.find('"id": "neet-2024-q1"')
if start_idx != -1:
    chunk = text[start_idx-20:start_idx+1500]
    print("Snippet:")
    print(chunk)
