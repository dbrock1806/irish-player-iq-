#!/usr/bin/env python3
"""Safely sync Notre Dame's 2026-27 football roster and official profile-photo URLs.

The sync is deliberately fail-closed: if the official roster PDF cannot be found or
parsed with enough confidence, the existing roster.json is left untouched.
"""
from __future__ import annotations
import datetime as dt
import html
import json
import os
import re
import subprocess
import tempfile
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROSTER_PAGE = "https://fightingirish.com/sports/football/roster/season/2026-27/"
FALLBACK_PDF = "https://fightingirish.com/wp-content/uploads/2026/06/2026-Notre-Dame-June-Roster.pdf"
ROSTER_OUT = ROOT / "roster.json"
PHOTOS_OUT = ROOT / "photo-candidates.json"
STATUS_OUT = ROOT / "sync-status.json"
POSITIONS = {"QB","RB","WR","TE","OL","DL","LB","CB","S","K","P","LS"}
UA = "Mozilla/5.0 (Irish-Player-IQ roster sync; +https://github.com/)"


def get(url: str, timeout: int = 30) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def find_latest_pdf(page: str) -> str:
    urls = re.findall(r'https?://[^\"\'<> ]+?\.pdf(?:\?[^\"\'<> ]*)?', page, re.I)
    candidates = []
    for u in urls:
        u = html.unescape(u)
        if "fightingirish.com/wp-content/uploads/" in u.lower() and "roster" in u.lower() and "2026" in u:
            candidates.append(u)
    if candidates:
        return candidates[0]
    return FALLBACK_PDF


def parse_pdf(pdf_bytes: bytes) -> list[dict]:
    with tempfile.TemporaryDirectory() as td:
        pdf = Path(td) / "roster.pdf"
        txt = Path(td) / "roster.txt"
        pdf.write_bytes(pdf_bytes)
        subprocess.run(["pdftotext", "-layout", str(pdf), str(txt)], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        text = txt.read_text("utf-8", errors="ignore")

    # Each numerical roster row is rendered as: NUMBER NAME POSITION.
    # -layout preserves the two-column PDF as separate row-like regions on a line.
    pattern = re.compile(r"(?<!\d)(\d{1,2})\s+([A-Za-zÀ-ÖØ-öø-ÿ0-9'’ʿʾ.\-]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ0-9'’ʿʾ.\-]+){0,5}?)\s+(QB|RB|WR|TE|OL|DL|LB|CB|S|K|P|LS)(?=\s|$)")
    found = []
    for raw in text.splitlines():
        line = " ".join(raw.split())
        for m in pattern.finditer(line):
            num, name, pos = m.groups()
            name = re.sub(r"\s+", " ", name).strip(" .")
            if name.lower() in {"name", "player", "position"} or len(name) < 2 or len(name) > 45:
                continue
            found.append({"num": num, "name": name, "pos": pos})

    unique = []
    seen = set()
    for p in found:
        key = (p["num"], p["name"], p["pos"])
        if key not in seen:
            seen.add(key)
            unique.append(p)
    if len(unique) < 100:
        raise RuntimeError(f"Roster parser found only {len(unique)} players; refusing to replace roster.json")
    return unique


def slug(name: str) -> str:
    s = name.lower().replace("’", "'")
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s


def official_photo_url(name: str) -> str | None:
    url = f"https://fightingirish.com/roster/{slug(name)}/"
    try:
        page = get(url, timeout=15).decode("utf-8", "ignore")
    except Exception:
        return None
    m = re.search(r'<meta[^>]+property=[\"\']og:image[\"\'][^>]+content=[\"\']([^\"\']+)', page, re.I)
    if not m:
        m = re.search(r'<meta[^>]+content=[\"\']([^\"\']+)[\"\'][^>]+property=[\"\']og:image[\"\']', page, re.I)
    return html.unescape(m.group(1)) if m else None


def load_json(path: Path, default):
    try:
        return json.loads(path.read_text())
    except Exception:
        return default


def main() -> None:
    checked = dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    old = load_json(ROSTER_OUT, [])
    page = get(ROSTER_PAGE).decode("utf-8", "ignore")
    pdf_url = find_latest_pdf(page)
    pdf = get(pdf_url)
    new = parse_pdf(pdf)

    # Keep the app's compact schema while adding source metadata.
    old_by_name = {p.get("name"): p for p in old if isinstance(p, dict)}
    for p in new:
        if p["name"] in old_by_name:
            for k in ("height", "weight", "class", "hometown", "high_school"):
                if k in old_by_name[p["name"]]:
                    p[k] = old_by_name[p["name"]][k]
    ROSTER_OUT.write_text(json.dumps(new, ensure_ascii=False, indent=2) + "\n")

    photo_map = load_json(PHOTOS_OUT, {})
    if not isinstance(photo_map, dict):
        photo_map = {}
    # Only replace/add URLs that we can verify from the official player page.
    photo_failures = 0
    for p in new:
        u = official_photo_url(p["name"])
        if u:
            photo_map[p["name"]] = u
        else:
            photo_failures += 1
    # Remove players no longer on the official roster.
    active_names = {p["name"] for p in new}
    photo_map = {k: v for k, v in photo_map.items() if k in active_names}
    PHOTOS_OUT.write_text(json.dumps(photo_map, ensure_ascii=False, indent=2) + "\n")

    old_set = {(p.get("num"), p.get("name"), p.get("pos")) for p in old if isinstance(p, dict)}
    new_set = {(p["num"], p["name"], p["pos"]) for p in new}
    added = sorted(new_set - old_set)
    removed = sorted(old_set - new_set)
    status = {
        "checked_at": checked,
        "season": "2026-27",
        "source_page": ROSTER_PAGE,
        "source_pdf": pdf_url,
        "player_count": len(new),
        "photo_url_count": len(photo_map),
        "photo_lookup_failures": photo_failures,
        "added": [{"num":n,"name":name,"pos":pos} for n,name,pos in added],
        "removed": [{"num":n,"name":name,"pos":pos} for n,name,pos in removed],
        "status": "verified"
    }
    STATUS_OUT.write_text(json.dumps(status, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(status, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
