import json
import re

transcript_full_path = r'C:\Users\chang\.gemini\antigravity\brain\dd662657-a6f2-4e59-aa9a-a88b0b9ef9a2\.system_generated\logs\transcript_full.jsonl'

with open(transcript_full_path, 'r', encoding='utf-8') as f:
    for line in f:
        if 'old-question-paper-wbjee' in line or '20231115' in line:
            # find all urls
            urls = re.findall(r'https?://[^\s\"\'\<\>]+', line)
            for u in set(urls):
                if '.pdf' in u.lower():
                    print(u)

