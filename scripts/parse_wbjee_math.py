import re
import json

with open('wbjee_2023_math_sample.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Split by pages
pages = text.split('=== PAGE ')
print(f"Total page sections: {len(pages)}")

# Print pages 3, 4, 5, 6
for p in pages[3:7]:
    lines = p.split('\n')
    page_header = lines[0]
    content = '\n'.join(lines[1:35])
    print(f"\n--- Page {page_header} ---")
    # Clean non-ascii for terminal display
    print(re.sub(r'[^\x00-\x7F]+', ' ', content[:600]))

