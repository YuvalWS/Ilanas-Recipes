#!/usr/bin/env python3
"""Validate every recipe.json against schema/recipe.schema.json and check the files it points to.

usage: python tools/validate.py [recipes/batch-01/b01-r01 ...]   (default: all recipes)
Needs: pip install jsonschema
"""
import json, os, sys, glob
from jsonschema import Draft202012Validator

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
schema = json.load(open(os.path.join(ROOT, "schema", "recipe.schema.json"), encoding="utf-8"))
validator = Draft202012Validator(schema)

dirs = sys.argv[1:] or sorted(glob.glob(os.path.join(ROOT, "recipes", "batch-*", "b*-r*")))
errors = 0
seen = set()
cards = {}
for d in dirs:
    d = os.path.abspath(d)
    p = os.path.join(d, "recipe.json")
    if not os.path.exists(p):
        print(f"MISSING recipe.json: {d}"); errors += 1; continue
    doc = json.load(open(p, encoding="utf-8"))
    rid = os.path.basename(d)
    if doc.get("id") != rid:
        print(f"{rid}: id {doc.get('id')!r} does not match folder name"); errors += 1
    if rid in seen:
        print(f"{rid}: duplicate id"); errors += 1
    seen.add(rid)
    for e in validator.iter_errors(doc):
        print(f"{rid}: {'/'.join(map(str, e.path))}: {e.message}"); errors += 1
    for rf in doc.get("raw_files", []):
        if not os.path.exists(os.path.join(d, rf["file"])):
            print(f"{rid}: missing raw file {rf['file']}"); errors += 1
    if not os.path.exists(os.path.join(d, "thumb.jpg")):
        print(f"{rid}: missing thumb.jpg"); errors += 1
    card = doc.get("card")
    if card:
        if rid not in card["recipes"]:
            print(f"{rid}: card.recipes does not list the recipe itself"); errors += 1
        cards.setdefault(card["id"], {})[rid] = sorted(card["recipes"])
    # every [?] in the text must be backed by at least one uncertainty entry
    blob = json.dumps([doc["title"], doc["ingredients"], doc["instructions"], doc["notes"]], ensure_ascii=False)
    if "[?]" in blob and not doc["uncertainties"]:
        print(f"{rid}: contains [?] but no uncertainties entry"); errors += 1
    if "[?]" in blob and not doc["needs_human_verification"]:
        print(f"{rid}: contains [?] but needs_human_verification is false"); errors += 1
for cid, members in cards.items():       # interlinks: same list in every merged member; absent (not yet merged) members are fine
    lists = {tuple(v) for v in members.values()}
    if len(lists) != 1 or not set(members) <= set(next(iter(lists))):
        print(f"card {cid}: recipes {sorted(members)} do not agree on card.recipes"); errors += 1
cp = os.path.join(ROOT, "data", "classics.json")      # the curated list must only name existing recipes
if os.path.exists(cp) and not sys.argv[1:]:
    for cid in json.load(open(cp, encoding="utf-8")).get("ids", []):
        if cid not in seen:
            print(f"data/classics.json: unknown recipe id {cid}"); errors += 1
sp = os.path.join(ROOT, "data", "story.json")         # story items need text, and their pictures must exist
if os.path.exists(sp) and not sys.argv[1:]:
    for it in json.load(open(sp, encoding="utf-8")).get("items", []):
        if not it.get("text"):
            print(f"data/story.json: item {it.get('id')} has no text"); errors += 1
        if it.get("image") and not os.path.exists(os.path.join(ROOT, it["image"])):
            print(f"data/story.json: missing picture {it['image']}"); errors += 1
print(f"checked {len(dirs)} recipes, {errors} problem(s)")
sys.exit(1 if errors else 0)
