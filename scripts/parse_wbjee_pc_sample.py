import re

with open('wbjee_2023_pc.txt', 'r', encoding='utf-8') as f:
    text = f.read()

pages = text.split('=== PAGE ')
print(f"Total PC pages: {len(pages)}")

# Print Physics samples from pages 3, 4, 5
print("=== PHYSICS SAMPLE ===")
for p in pages[3:6]:
    lines = p.split('\n')
    print(re.sub(r'[^\x00-\x7F]+', ' ', '\n'.join(lines[1:25])))

# Chemistry starts around page 15-18
print("\n=== CHEMISTRY SAMPLE ===")
for p in pages[16:19]:
    lines = p.split('\n')
    print(re.sub(r'[^\x00-\x7F]+', ' ', '\n'.join(lines[1:25])))

