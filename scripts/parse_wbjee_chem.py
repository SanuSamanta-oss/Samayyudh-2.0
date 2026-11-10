import re

with open('wbjee_2023_pc.txt', 'r', encoding='utf-8') as f:
    text = f.read()

pages = text.split('=== PAGE ')
print("=== CHEMISTRY CATEGORY 1 ===")
for p in pages[19:22]:
    lines = p.split('\n')
    print(re.sub(r'[^\x00-\x7F]+', ' ', '\n'.join(lines[1:25])))

