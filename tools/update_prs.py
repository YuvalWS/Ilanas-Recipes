#!/usr/bin/env python3
"""Commit re-transcribed recipes onto their existing PR branches and refresh the PRs.

usage: python tools/update_prs.py [--merge-high] b01-r05 b02-r03 ...

For each recipe id: if recipes/batch-NN/<id>/ differs from branch recipe/<id>, add one commit on top
of that branch (git plumbing, working tree untouched), push it, and update the PR title/body.
Safe for parallel editing: it fetches first and always builds on the REMOTE tip origin/recipe/<id> (so work
pushed by someone else is never overwritten), and never force-pushes. If a recipe's remote branch has
commits you have not seen, they are listed so you can look before your folder replaces theirs.
--merge-high then squash-merges the PR if the recipe is now `confidence: high`.
"""
import glob, json, os, subprocess, sys, tempfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import publish_prs as pp

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRAILER = "\n\nCo-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>\n"
MERGE = "--merge-high" in sys.argv


def git(*args, env=None):
    e = dict(os.environ); e.update(env or {})
    r = subprocess.run(["git", "-C", ROOT, *args], capture_output=True, text=True, encoding="utf-8", env=e)
    if r.returncode:
        raise SystemExit(f"git {' '.join(args)} failed: {r.stderr}")
    return r.stdout.strip()


def has_ref(ref):
    return subprocess.run(["git", "-C", ROOT, "show-ref", "--verify", "--quiet", ref]).returncode == 0


git("fetch", "origin", "--prune")
for rid in [a for a in sys.argv[1:] if not a.startswith("--")]:
    branch = f"recipe/{rid}"
    folder = f"recipes/batch-{rid.split('-')[0][1:]}/{rid}"
    if has_ref(f"refs/remotes/origin/{branch}"):
        remote = git("rev-parse", f"origin/{branch}")
        if has_ref(f"refs/heads/{branch}") and git("rev-parse", branch) != remote:
            behind = git("log", "--format=%h %an: %s", f"{branch}..origin/{branch}")
            if behind:
                print(f"{rid}: remote branch has commits you did not have (building on top of them):" + ("\n  " + behind.replace("\n", "\n  ")))
        git("update-ref", f"refs/heads/{branch}", remote)       # local ref follows the remote tip
    if not has_ref(f"refs/heads/{branch}"):
        # the recipe PR was already merged: open a follow-up branch from origin/main
        branch = f"recipe/{rid}-reread"
        if not has_ref(f"refs/heads/{branch}"):
            git("update-ref", f"refs/heads/{branch}", "origin/main")
        old = json.loads(git("show", f"origin/main:{folder}/recipe.json"))
    else:
        old = json.loads(git("show", f"{branch}:{folder}/recipe.json"))
    new = json.load(open(os.path.join(ROOT, folder, "recipe.json"), encoding="utf-8"))
    with tempfile.TemporaryDirectory() as td:
        env = {"GIT_INDEX_FILE": os.path.join(td, "index")}
        git("read-tree", branch, env=env)
        git("add", "-f", "--", folder, env=env)
        tree = git("write-tree", env=env)
    if tree == git("rev-parse", f"{branch}^{{tree}}"):
        print(f"{rid}: unchanged"); continue
    msg = os.environ.get("UPDATE_MSG") or (f"Re-transcribe {rid}: confidence {old['confidence']} -> {new['confidence']}\n\n"
           "Second reading from enlarged crops of the scan; unreadable words stay [?].")
    commit = git("commit-tree", tree, "-p", branch, "-m", msg + TRAILER)
    git("update-ref", f"refs/heads/{branch}", commit)
    git("push", "origin", branch)
    title = f"Add recipe {rid}: {new['title'] or '(untitled)'}"
    if branch.endswith("-reread"):
        title = f"Re-read {rid}: {new['title'] or '(untitled)'} (confidence {old['confidence']} -> {new['confidence']})"
        subprocess.run(["gh", "pr", "create", "--base", "main", "--head", branch, "--title", title, "--body", pp.body(new)], check=False)
    subprocess.run(["gh", "pr", "edit", branch, "--title", title, "--body", pp.body(new)], check=False)  # PR may not exist yet
    others = ",".join(f"confidence: {c}" for c in ("high", "medium", "low") if c != new["confidence"])
    subprocess.run(["gh", "pr", "edit", branch, "--add-label", f"confidence: {new['confidence']}", "--remove-label", others],
                   capture_output=True)                         # keep the confidence label in sync
    print(f"{rid}: updated ({old['confidence']} -> {new['confidence']})")
    if MERGE and new["confidence"] == "high" and "[?]" not in json.dumps([new["title"], new["ingredients"], new["instructions"], new["notes"]], ensure_ascii=False):
        subprocess.run(["gh", "pr", "merge", branch, "--squash", "--delete-branch"], check=True)
        print(f"{rid}: merged")
