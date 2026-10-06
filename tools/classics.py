#!/usr/bin/env python3
"""Manage "הקלאסיים", the curated family list shown on the site (data/classics.json).

usage: python tools/classics.py list
       python tools/classics.py add b01-r03 b09-r09 ...
       python tools/classics.py remove b01-r03
Only recipes that exist (merged) can be added. Commit the change in a PR; the site picks it up on the next release.
"""
import glob, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, "data", "classics.json")
known = {os.path.basename(os.path.dirname(p)) for p in glob.glob(os.path.join(ROOT, "recipes", "batch-*", "b*-r*", "recipe.json"))}
data = json.load(open(PATH, encoding="utf-8")) if os.path.exists(PATH) else {"ids": []}
cmd, ids = (sys.argv[1] if len(sys.argv) > 1 else "list"), sys.argv[2:]
if cmd == "add":
    bad = [i for i in ids if i not in known]
    if bad:
        raise SystemExit(f"unknown recipe ids: {bad}")
    data["ids"] = sorted(set(data["ids"]) | set(ids))
elif cmd == "remove":
    data["ids"] = [i for i in data["ids"] if i not in ids]
elif cmd != "list":
    raise SystemExit(__doc__)
json.dump(data, open(PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(len(data["ids"]), "classics:", ", ".join(data["ids"]) or "(none yet)")
