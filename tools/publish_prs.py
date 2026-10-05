#!/usr/bin/env python3
"""Push every local branch `recipe/bNN-rMM` and open one pull request per branch.

usage: python tools/publish_prs.py [--dry-run] [--merge-confident] [--only recipe/b01-r03 ...]

* Needs `git` push access to origin and the GitHub CLI (`gh auth login`).
* Idempotent: branches that already have a PR are skipped.
* --merge-confident merges PRs whose recipe is `confidence: high`, `needs_human_verification: false`
  and has no `uncertainties`. Everything else stays open for review.
"""
import json, subprocess, sys

DRY = "--dry-run" in sys.argv
MERGE = "--merge-confident" in sys.argv
ONLY = sys.argv[sys.argv.index("--only") + 1:] if "--only" in sys.argv else None
BASE = "main"


def run(*cmd, check=True, capture=True):
    print("+", " ".join(cmd))
    if DRY and cmd[0] in ("git", "gh") and cmd[1] in ("push", "pr"):
        if not (cmd[1] == "pr" and cmd[2] in ("list", "view")):
            return ""
    r = subprocess.run(cmd, check=check, capture_output=capture, text=True)
    return r.stdout.strip() if capture else ""


def recipe_json(branch):
    rid = branch.split("/", 1)[1]
    batch = rid.split("-")[0][1:]
    path = f"recipes/batch-{batch}/{rid}/recipe.json"
    return json.loads(run("git", "show", f"{branch}:{path}"))


def body(r):
    unc = "\n".join(
        f"- **{u['field']}**: {u['reason']}" + (f" (guess, unverified: `{u['best_guess']}`)" if u.get("best_guess") else "")
        for u in r["uncertainties"]) or "- none"
    files = "\n".join(f"- `{f['original_path']}` ({f['side']}, rotated {f['rotation_applied_cw_degrees']}° cw)" for f in r["raw_files"])
    return f"""## {r['id']}: {r['title'] or '(untitled)'}

- Source: {r['source']['text'] if r['source'] else '-'}
- Medium: {r['medium']}
- Confidence: **{r['confidence']}**
- Needs human verification: **{'yes' if r['needs_human_verification'] else 'no'}**

### Scans
{files}

### Uncertainties
{unc}

### Review checklist
- [ ] Title and source match the scan
- [ ] Ingredients and quantities match the scan
- [ ] Instructions match the scan
- [ ] Every `[?]` resolved or confirmed unreadable
- [ ] If fully verified: set `needs_human_verification: false` and `transcription.human_verified: true`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
"""


branches = [b.strip() for b in run("git", "for-each-ref", "--format=%(refname:short)", "refs/heads/recipe/").splitlines() if b.strip()]
if ONLY:
    branches = [b for b in branches if b in ONLY]
for br in sorted(branches):
    existing = run("gh", "pr", "list", "--head", br, "--state", "all", "--json", "number", "--jq", ".[0].number", check=False)
    if existing:
        print(f"{br}: PR #{existing} exists, skipping"); continue
    r = recipe_json(br)
    run("git", "push", "-u", "origin", br)
    title = f"Add recipe {r['id']}: {r['title'] or '(untitled)'}"
    out = run("gh", "pr", "create", "--base", BASE, "--head", br, "--title", title, "--body", body(r))
    print(out)
    sure = r["confidence"] == "high" and not r["needs_human_verification"] and not r["uncertainties"]
    if MERGE and sure and not DRY:
        run("gh", "pr", "merge", br, "--squash", "--delete-branch")
