import urllib.request
import pypdf
import io
import re
import json

# URLs from official WBJEE portal
PAPERS = {
    "2024_math": "https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2024/12/2024120291.pdf",
    "2023_math": "https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2024/01/2024010974.pdf",
    "2023_phys_chem": "https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2024/01/2024010970.pdf"
}

def download_and_extract_text(url, output_file):
    print(f"Downloading {url}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as resp:
        pdf_bytes = resp.read()
    reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
    print(f"Downloaded {len(pdf_bytes)} bytes, {len(reader.pages)} pages.")
    with open(output_file, 'w', encoding='utf-8') as f:
        for i, page in enumerate(reader.pages):
            f.write(f"\n\n=== PAGE {i+1} ===\n\n")
            f.write(page.extract_text() or '')
    print(f"Saved text to {output_file}")

if __name__ == "__main__":
    download_and_extract_text(PAPERS["2023_phys_chem"], "wbjee_2023_pc.txt")

