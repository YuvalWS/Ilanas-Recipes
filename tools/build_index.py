#!/usr/bin/env python3
"""Build data/recipes.json (the file the website loads) from recipes/**/recipe.json and batch.json.

usage: python tools/build_index.py
The website is plain static files, so this file is committed. Re-run it after merging recipes.
"""
import json, os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recipes, batches = [], {}

for bj in sorted(glob.glob(os.path.join(ROOT, "recipes", "batch-*", "batch.json"))):
    b = json.load(open(bj, encoding="utf-8"))
    batches[b["batch"]] = b

for p in sorted(glob.glob(os.path.join(ROOT, "recipes", "batch-*", "b*-r*", "recipe.json"))):
    r = json.load(open(p, encoding="utf-8"))
    base = os.path.relpath(os.path.dirname(p), ROOT).replace(os.sep, "/")
    r["path"] = base
    r["thumb"] = f"{base}/thumb.jpg"
    r["images"] = [f"{base}/{f['file']}" for f in r["raw_files"]]
    # plain-text fields the browser can search without re-walking the structure
    r["ingredients_text"] = "\n".join(i for g in r["ingredients"] for i in ([g["group"]] if g["group"] else []) + g["items"])
    r["instructions_text"] = "\n".join(s for g in r["instructions"] for s in ([g["group"]] if g["group"] else []) + g["steps"])
    recipes.append(r)
    batches.setdefault(r["batch"], {"batch": r["batch"], "title": None})

recipes.sort(key=lambda r: r["id"])
out = {"batches": [batches[k] for k in sorted(batches)], "recipes": recipes}
os.makedirs(os.path.join(ROOT, "data"), exist_ok=True)
with open(os.path.join(ROOT, "data", "recipes.json"), "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
print(f"{len(recipes)} recipes in {len(batches)} batches -> data/recipes.json")
