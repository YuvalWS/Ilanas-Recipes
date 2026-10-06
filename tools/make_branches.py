#!/usr/bin/env python3
"""Create one local branch (one commit) per recipe, plus a scaffold branch, a branch per batch.json and an index branch.

usage: python tools/make_branches.py [--base main]

For every folder recipes/batch-NN/bNN-rMM/ that is not yet on its own branch this creates
  recipe/bNN-rMM       - exactly that folder, branched from <base>
and additionally
  scaffold             - README, .gitignore, schema/, tools/, index.html, assets/
  batch-meta/NN        - recipes/batch-NN/batch.json (batch title + description)
  index/update         - data/recipes.json (regenerate with tools/build_index.py first)

The files stay in your working tree: branches are built with git plumbing and a temporary index,
so nothing is checked out or removed. Existing branches are never touched. Afterwards run
tools/publish_prs.py to push them and open the pull requests.
"""
import glob, json, os, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = sys.argv[sys.argv.index("--base") + 1] if "--base" in sys.argv else "main"
TRAILER = ("\n\nCo-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
           "\nClaude-Session: https://claude.ai/code/session_01DXrbcg72ahUfoy3cPPUZTm\n")


def git(*args, env=None, inp=None):
    e = dict(os.environ); e.update(env or {})
    r = subprocess.run(["git", "-C", ROOT, *args], capture_output=True, text=True, env=e, input=inp)
    if r.returncode:
        raise SystemExit(f"git {' '.join(args)} failed: {r.stderr}")
    return r.stdout.strip()


def branch_exists(name):
    return subprocess.run(["git", "-C", ROOT, "show-ref", "--verify", "--quiet", f"refs/heads/{name}"]).returncode == 0


def make(branch, paths, message):
    if branch_exists(branch):
        return False
    paths = [p for p in paths if os.path.exists(os.path.join(ROOT, p))]
    if not paths:
        return False
    with tempfile.TemporaryDirectory() as td:
        env = {"GIT_INDEX_FILE": os.path.join(td, "index")}
        git("read-tree", BASE, env=env)
        git("add", "-f", "--", *paths, env=env)
        tree = git("write-tree", env=env)
    if tree == git("rev-parse", f"{BASE}^{{tree}}"):
        return False                      # nothing new relative to base
    commit = git("commit-tree", tree, "-p", BASE, "-m", message + TRAILER)
    git("update-ref", f"refs/heads/{branch}", commit)
    return True


made = []
if make("scaffold", ["README.md", ".gitignore", "schema", "tools", "index.html", "assets"],
        "Add project scaffold: schema, tools and static search website"):
    made.append("scaffold")

for rdir in sorted(glob.glob(os.path.join(ROOT, "recipes", "batch-*", "b*-r*"))):
    rid = os.path.basename(rdir)
    rel = os.path.relpath(rdir, ROOT).replace(os.sep, "/")
    try:
        title = json.load(open(os.path.join(rdir, "recipe.json"), encoding="utf-8"))["title"] or "(untitled)"
    except Exception as ex:
        raise SystemExit(f"{rid}: {ex}")
    if make(f"recipe/{rid}", [rel], f"Add recipe {rid}: {title}"):
        made.append(f"recipe/{rid}")

for bj in sorted(glob.glob(os.path.join(ROOT, "recipes", "batch-*", "batch.json"))):
    b = json.load(open(bj, encoding="utf-8"))
    rel = os.path.relpath(bj, ROOT).replace(os.sep, "/")
    if make(f"batch-meta/{b['batch']:02d}", [rel], f"Add batch {b['batch']} title and description: {b['title']}"):
        made.append(f"batch-meta/{b['batch']:02d}")

if make("index/update", ["data/recipes.json"], "Update search index (data/recipes.json)"):
    made.append("index/update")

print(f"created {len(made)} branches")
for m in made:
    print(" ", m)
