import re
import json

# Let's inspect pages from wbjee_2023_math_sample.txt
with open('wbjee_2023_math_sample.txt', 'r', encoding='utf-8') as f:
    math_text = f.read()

# Let's find question blocks
# Questions typically start with "1.", "2.", ... up to "75."
# Let's see how question numbers are formatted
math_q_matches = re.findall(r'\n\s*(\d+)\.\s+([^\n]+(?:\n[^\n]+){1,10})', math_text)
print(f"Found {len(math_q_matches)} math questions")
for num, q_text in math_q_matches[:5]:
    print(f"\nQ{num}: {q_text[:120]}...")

