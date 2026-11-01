"""
Push pyq_database.json directly to Supabase via REST API.
Uses the anon key — works if RLS policies allow inserts (USING true WITH CHECK true).
"""
import json
import sys
import os
import urllib.request
import urllib.error

sys.stdout.reconfigure(encoding="utf-8")

BASE = r"c:\Users\chang\OneDrive\Desktop\Projects\Samayyudh 2.0"
DB_PATH = os.path.join(BASE, "data", "pyq_database.json")

SUPABASE_URL = "https://xzpmpxlrhcgreivzesyr.supabase.co"
ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    ".eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cG1weGxyaGNncmVpdnplc3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MjQ3MDUsImV4cCI6MjEwNjAwMDcwNX0"
    ".gfp8oLKXvhfZSEEAwkXhhjnb_332gvXGC0l8ZO6VT0A"
)


def post_json(endpoint, payload):
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "apikey": ANON_KEY,
            "Authorization": f"Bearer {ANON_KEY}",
            "Prefer": "return=minimal,resolution=ignore-duplicates",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        return e.code, body


with open(DB_PATH, encoding="utf-8") as f:
    db = json.load(f)

papers = db.get("papers", [])
questions = db.get("questions", [])

print(f"Loaded {len(papers)} papers and {len(questions)} questions.")

# --- Insert Papers ---
print("\nInserting papers...")
status, body = post_json("pyq_exam_papers", papers)
print(f"  Status: {status}")
if status not in (200, 201, 204):
    print(f"  Response: {body[:500]}")
    print("\nERROR: Cannot insert via anon key. You must paste supabase/pyq_insert.sql into the SQL Editor.")
    sys.exit(1)
else:
    print(f"  Papers inserted OK.")

# --- Insert Questions in batches of 50 ---
print(f"\nInserting {len(questions)} questions in batches of 50...")
batch_size = 50
ok_count = 0
for i in range(0, len(questions), batch_size):
    batch = questions[i : i + batch_size]
    status, body = post_json("pyq_questions", batch)
    if status not in (200, 201, 204):
        print(f"  Batch {i//batch_size + 1} FAILED (status {status}): {body[:300]}")
        break
    else:
        ok_count += len(batch)
        print(f"  Batch {i//batch_size + 1}: {len(batch)} questions OK ({ok_count}/{len(questions)} total)")

print(f"\nDone. {ok_count}/{len(questions)} questions pushed to Supabase.")

