#!/usr/bin/env python3
"""Build data/recipes.json (the file the website loads) from recipes/**/recipe.json and batch.json.

usage: python tools/build_index.py [--merged-only]
The website is plain static files, so this file is committed. Re-run it after merging recipes.
--merged-only indexes just the recipes whose recipe.json is tracked by git (i.e. merged to the checked-out
branch), so the site never links to scans that are not in the repo yet.
"""
import hashlib, json, os, glob, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recipes, batches = [], {}


def fhash(path, n=8):
    """Short content hash; text files are hashed with LF newlines so Windows and CI agree."""
    data = open(path, "rb").read()
    if path.endswith((".json", ".js", ".css", ".html")):
        data = data.replace(b"\r\n", b"\n")
    return hashlib.sha1(data).hexdigest()[:n]


for bj in sorted(glob.glob(os.path.join(ROOT, "recipes", "batch-*", "batch.json"))):
    b = json.load(open(bj, encoding="utf-8"))
    batches[b["batch"]] = b

tracked = None
if "--merged-only" in sys.argv:
    tracked = set(subprocess.run(["git", "-C", ROOT, "ls-files", "recipes"], capture_output=True, text=True,
                                 encoding="utf-8").stdout.splitlines())

for p in sorted(glob.glob(os.path.join(ROOT, "recipes", "batch-*", "b*-r*", "recipe.json"))):
    if tracked is not None and os.path.relpath(p, ROOT).replace(os.sep, "/") not in tracked:
        continue
    r = json.load(open(p, encoding="utf-8"))
    base = os.path.relpath(os.path.dirname(p), ROOT).replace(os.sep, "/")
    r["path"] = base
    # ?v=<content hash>: a rotated/replaced scan gets a new URL, so phones never keep showing the old picture
    r["thumb"] = f"{base}/thumb.jpg?v={fhash(os.path.join(ROOT, base, 'thumb.jpg'))}"
    r["images"] = [f"{base}/{f['file']}?v={fhash(os.path.join(ROOT, base, f['file']))}" for f in r["raw_files"]]
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

# version.json: one short id for the whole site build (data + code). index.html loads it uncached and asks for
# app.js / style.css / data/recipes.json with ?v=<id>, so every release is fetched fresh without clearing caches.
version = hashlib.sha1("".join(fhash(os.path.join(ROOT, p), 40) for p in
                               ("data/recipes.json", "assets/app.js", "assets/style.css", "index.html")).encode()).hexdigest()[:10]
with open(os.path.join(ROOT, "version.json"), "w", encoding="utf-8") as f:
    json.dump({"v": version}, f)
print("version.json:", version)
