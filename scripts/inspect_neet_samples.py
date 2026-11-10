import sys
sys.stdout.reconfigure(encoding='utf-8')
import json

with open('src/lib/questions.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect neet-2024-q101 (Botany) and neet-2024-q151 (Zoology)
for qid in ['neet-2024-q1', 'neet-2024-q51', 'neet-2024-q101', 'neet-2024-q151']:
    idx = text.find(f'"id": "{qid}"')
    if idx != -1:
        end_idx = text.find('},\n  {', idx)
        print(f"=== {qid} ===")
        print(text[idx:end_idx+1])

