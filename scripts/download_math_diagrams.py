import os, json, sys, urllib.request
sys.stdout.reconfigure(encoding='utf-8')

def download_math_diagrams():
    with open('data/questions/JEE_ADVANCED/JEE_ADVANCED_MATHEMATICS.json', 'r', encoding='utf-8') as f:
        math_data = json.load(f)

    img_dir = os.path.join('public', 'jee_advanced_diagrams')
    os.makedirs(img_dir, exist_ok=True)

    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    downloaded = 0
    failed = 0

    for q in math_data:
        raw_imgs = q.get('raw_imgs', [])
        slug = q['id'].replace('jee_adv_math_', '').rsplit('_q', 1)[0]
        q_num = q['question_number']

        for img_idx, img_url in enumerate(raw_imgs):
            ext = os.path.splitext(img_url)[1] or '.webp'
            filename = f"jee_adv_math_{slug}_q{q_num}_img{img_idx+1}{ext}"
            local_path = os.path.join(img_dir, filename)

            if not os.path.exists(local_path):
                try:
                    req = urllib.request.Request(img_url, headers=headers)
                    with urllib.request.urlopen(req, timeout=12) as resp, open(local_path, 'wb') as out_f:
                        out_f.write(resp.read())
                    downloaded += 1
                    if downloaded % 10 == 0:
                        print(f"Downloaded {downloaded} math diagrams...")
                except Exception as e:
                    failed += 1
                    print(f"Failed {img_url}: {e}")

    print(f"Math diagram download complete: {downloaded} downloaded, {failed} failed.")

if __name__ == '__main__':
    download_math_diagrams()

