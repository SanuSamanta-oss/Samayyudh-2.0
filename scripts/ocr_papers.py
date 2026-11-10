import fitz
from rapidocr_onnxruntime import RapidOCR
import os
import sys

engine = RapidOCR()

def ocr_pdf(pdf_path, out_txt_path, max_pages=None):
    if os.path.exists(out_txt_path) and os.path.getsize(out_txt_path) > 10000:
        print(f"Already OCR'd {pdf_path} ({os.path.getsize(out_txt_path)} bytes)")
        return
    print(f"Starting OCR on {pdf_path}...")
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    pages_to_process = min(total_pages, max_pages) if max_pages else total_pages
    
    with open(out_txt_path, 'w', encoding='utf-8') as out_f:
        for p_idx in range(pages_to_process):
            page = doc[p_idx]
            pix = page.get_pixmap(dpi=150)
            img_bytes = pix.tobytes('png')
            result, _ = engine(img_bytes)
            out_f.write(f"\n--- PAGE {p_idx+1} ---\n")
            if result:
                for line in result:
                    out_f.write(line[1] + '\n')
            print(f"  Page {p_idx+1}/{pages_to_process} completed.")

if __name__ == '__main__':
    paper_key = sys.argv[1] if len(sys.argv) > 1 else '2024_math'
    pdf = f"data/wbjee_pdfs/{paper_key}.pdf"
    out = f"data/wbjee_raw_text/{paper_key}_ocr.txt"
    ocr_pdf(pdf, out)

