import re
import os

file_path = r'src/lib/questions.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('"options": null,', '')
content = content.replace('"correct_answer": null,', '')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
