import os
import sys
import re
import json
import urllib.request
import urllib.error

sys.stdout.reconfigure(encoding='utf-8')

def fetch_chemistry_chapters():
    with open('data/jee_adv_chapters.json', 'r', encoding='utf-8') as f:
        all_chaps = json.load(f)

    chem_chaps = [c for c in all_chaps if c['subject'] == 'Chemistry']
    out_dir = os.path.join('data', 'jee_adv_raw', 'chemistry')
    os.makedirs(out_dir, exist_ok=True)

    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

    print(f"Total Chemistry Chapters to fetch: {len(chem_chaps)}")

    for i, chap in enumerate(chem_chaps):
        cname = chap['chapter']
        url = chap['url']
        slug = re.sub(r'[^a-z0-9]+', '_', cname.lower()).strip('_')
        out_file = os.path.join(out_dir, f"{slug}.html")

        if os.path.exists(out_file) and os.path.getsize(out_file) > 1000:
            print(f"[{i+1}/{len(chem_chaps)}] Already cached: {cname}")
            continue

        print(f"[{i+1}/{len(chem_chaps)}] Fetching: {cname} from {url}")
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as resp:
                content = resp.read().decode('utf-8', errors='replace')
                with open(out_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"  -> Saved {len(content)} chars to {out_file}")
        except urllib.error.HTTPError as e:
            print(f"  -> HTTP Error {e.code} for {url}")
            # Try alternate URL variations if 404
            if e.code == 404:
                # e.g., carboxylic acid typos
                alt_url = url.replace('caboxylic', 'carboxylic')
                try:
                    req = urllib.request.Request(alt_url, headers=headers)
                    with urllib.request.urlopen(req, timeout=15) as resp:
                        content = resp.read().decode('utf-8', errors='replace')
                        with open(out_file, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"  -> Fetched via ALT URL {alt_url}")
                except Exception as e2:
                    print(f"  -> Alt URL also failed: {e2}")
        except Exception as e:
            print(f"  -> Error: {e}")

    print("Chemistry fetch complete!")

if __name__ == '__main__':
    fetch_chemistry_chapters()

