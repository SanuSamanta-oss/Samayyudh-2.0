"""
Supabase REST API Syncer: directly uploads and syncs questions to Supabase cloud.
"""

import os
import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from data_manager.models import Question


class SupabaseSyncer:
    def __init__(self, supabase_url: Optional[str] = None, supabase_key: Optional[str] = None):
        self.supabase_url = supabase_url
        self.supabase_key = supabase_key

        if not self.supabase_url or not self.supabase_key:
            self._load_from_env_file()

    def _load_from_env_file(self):
        env_path = Path(__file__).resolve().parent.parent.parent / ".env.local"
        if env_path.exists():
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("#") or "=" not in line:
                        continue
                    k, v = line.split("=", 1)
                    k = k.strip()
                    v = v.strip().strip('"').strip("'")
                    if k == "NEXT_PUBLIC_SUPABASE_URL" and not self.supabase_url:
                        self.supabase_url = v
                    elif k in ("NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY") and not self.supabase_key:
                        self.supabase_key = v

    def sync_questions(self, questions: List[Question], batch_size: int = 50) -> Dict[str, Any]:
        """
        Uploads questions in batches to Supabase /rest/v1/questions using PostgREST upsert.
        """
        if not self.supabase_url or not self.supabase_key:
            return {
                "success": False,
                "error": "Missing Supabase URL or API key. Configure .env.local first."
            }

        try:
            import requests
        except ImportError:
            return {"success": False, "error": "requests library is required for sync"}

        endpoint = f"{self.supabase_url.rstrip('/')}/rest/v1/questions"
        headers = {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
        }

        total = len(questions)
        uploaded = 0
        errors = []

        for i in range(0, total, batch_size):
            batch = questions[i:i + batch_size]
            payload = []
            for q in batch:
                d = q.to_dict()
                payload.append(d)

            try:
                resp = requests.post(endpoint, headers=headers, json=payload, timeout=20)
                if resp.status_code in (200, 201, 204):
                    uploaded += len(batch)
                else:
                    errors.append(f"Batch {i//batch_size + 1} failed: {resp.status_code} - {resp.text}")
            except Exception as e:
                errors.append(f"Batch {i//batch_size + 1} exception: {str(e)}")

        return {
            "success": len(errors) == 0,
            "total": total,
            "uploaded": uploaded,
            "errors": errors
        }
