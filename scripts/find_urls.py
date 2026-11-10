import json
import re

transcript_path = r'C:\Users\chang\.gemini\antigravity\brain\dd662657-a6f2-4e59-aa9a-a88b0b9ef9a2\.system_generated\logs\transcript.jsonl'

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        if 's3waas' in line or '202412' in line or '202311' in line:
            urls = re.findall(r'https://cdnbbsr\.s3waas\.gov\.in[^\s\"\'\<\>]+', line)
            for u in set(urls):
                print(u)

