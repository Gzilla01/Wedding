import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "https://ovmtavyxmwvbvsftzrmx.supabase.co").rstrip("/")
SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
WEDDING_SLUG = os.environ.get("NEXT_PUBLIC_WEDDING_SLUG", "aleksandra-pawel-2028")
SNAPSHOT_PATH = Path("supabase/ap-wesele-snapshot.json")


def request(method, path, payload=None):
    body = None if payload is None else json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{SUPABASE_URL}{path}",
        data=body,
        method=method,
        headers={
            "apikey": SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation,resolution=merge-duplicates",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            text = response.read().decode("utf-8")
            return json.loads(text) if text else None
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Supabase HTTP {error.code}: {detail}") from error


def main():
    if not SERVICE_ROLE_KEY:
        print("Missing SUPABASE_SERVICE_ROLE_KEY env var", file=sys.stderr)
        return 2

    snapshot = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))
    slug = urllib.parse.quote(WEDDING_SLUG, safe="")
    rows = request("GET", f"/rest/v1/weddings?slug=eq.{slug}&select=id,slug")
    if not rows:
        raise RuntimeError(f"Wedding slug not found in Supabase: {WEDDING_SLUG}")

    wedding_id = rows[0]["id"]
    result = request(
        "POST",
        "/rest/v1/wedding_admin_snapshots?on_conflict=wedding_id",
        {"wedding_id": wedding_id, "data": snapshot},
    )
    print(json.dumps({
        "ok": True,
        "wedding_id": wedding_id,
        "guests": len(snapshot.get("guests", [])),
        "expenses": len(snapshot.get("planning", {}).get("expenses", [])),
        "updated_rows": len(result or []),
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
