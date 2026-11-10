import urllib.request
import re
from bs4 import BeautifulSoup

url = 'https://wbjeeb.nic.in/old-question-paper-wbjee/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode('utf-8', errors='ignore')

    # Look for tables or links
    # Search for all links with pdf or text
    link_pattern = re.compile(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', re.I | re.S)
    matches = link_pattern.findall(html)

    print(f"Total links found: {len(matches)}")
    pdf_links = []
    for href, text in matches:
        clean_text = re.sub(r'<[^>]+>', '', text).strip()
        if '.pdf' in href.lower() or 'wbjee' in href.lower() or any(yr in clean_text for yr in ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017']):
            pdf_links.append((clean_text, href))
            print(f"[{clean_text}] -> {href}")

    # Also search for table rows
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.I | re.S)
    print(f"\nTotal table rows found: {len(rows)}")
    for r in rows[:20]:
        cols = re.findall(r'<td[^>]*>(.*?)</td>', r, re.I | re.S)
        if cols:
            cleaned_cols = [re.sub(r'<[^>]+>', ' ', c).strip() for c in cols]
            # check for pdf link inside cols
            hrefs = re.findall(r'href=["\']([^"\']+)["\']', r)
            print("ROW:", cleaned_cols, "HREFS:", hrefs)

except Exception as e:
    print("Error:", e)

