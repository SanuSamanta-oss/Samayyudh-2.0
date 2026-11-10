import urllib.request
import pypdf
import io
import os
import re

PAPERS = {
    # 2024
    "2024_math": "https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2024/12/2024120291.pdf",
    "2024_pc": "https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2024/12/2024121353.pdf",
    # 2023
    "2023_math": "https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2024/01/2024010974.pdf",
    "2023_pc": "https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2024/01/2024010970.pdf",
    # 2022
    "2022_math": "https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2023/11/2023111533-3.pdf",
    "2022_pc": "https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2023/11/2023111596.pdf",
    # 2020
    "2020_math": "https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2023/11/2023111597.pdf",
    "2020_pc": "https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2023/11/2023111570.pdf",
    # 2019
    "2019_math": "https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2023/11/2023111546.pdf",
    "2019_pc": "https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2023/11/2023111547.pdf",
}

os.makedirs('data/wbjee_raw_text', exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for key, url in PAPERS.items():
    out_path = f"data/wbjee_raw_text/{key}.txt"
    if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
        print(f"Skipping {key}, already downloaded ({os.path.getsize(out_path)} bytes)")
        continue
    print(f"Downloading {key} from {url}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
        reader = pypdf.PdfReader(io.BytesIO(data))
        print(f"  {key}: {len(reader.pages)} pages extracted.")
        with open(out_path, 'w', encoding='utf-8') as out_f:
            for i, page in enumerate(reader.pages):
                out_f.write(f"\n--- PAGE {i+1} ---\n")
                out_f.write(page.extract_text() or '')
    except Exception as e:
        print(f"  Failed {key}: {e}")

print("Download complete!")

