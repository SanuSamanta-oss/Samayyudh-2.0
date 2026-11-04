import os
import sys
import re
import json
import urllib.request
import urllib.error

sys.stdout.reconfigure(encoding='utf-8')

def fetch_math_chapters():
    with open('data/jee_adv_chapters.json', 'r', encoding='utf-8') as f:
        all_chaps = json.load(f)

    math_chaps = [c for c in all_chaps if c['subject'] == 'Mathematics']
    out_dir = os.path.join('data', 'jee_adv_raw', 'mathematics')
    os.makedirs(out_dir, exist_ok=True)

    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

    print(f"Total Mathematics Chapters to fetch: {len(math_chaps)}")

    for i, chap in enumerate(math_chaps):
        cname = chap['chapter']
        url = chap['url']
        slug = re.sub(r'[^a-z0-9]+', '_', cname.lower()).strip('_')
        out_file = os.path.join(out_dir, f"{slug}.html")

        if os.path.exists(out_file) and os.path.getsize(out_file) > 1000:
            print(f"[{i+1}/{len(math_chaps)}] Already cached: {cname}")
            continue

        print(f"[{i+1}/{len(math_chaps)}] Fetching: {cname} from {url}")
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as resp:
                content = resp.read().decode('utf-8', errors='replace')
                with open(out_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"  -> Saved {len(content)} chars to {out_file}")
        except urllib.error.HTTPError as e:
            print(f"  -> HTTP Error {e.code} for {url}")
        except Exception as e:
            print(f"  -> Error: {e}")

    print("Mathematics fetch complete!")

if __name__ == '__main__':
    fetch_math_chapters()

