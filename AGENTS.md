# AGENTS.md - instructions for anyone (human or AI) working on this repo

This file preserves the project owner's (Yuval's) original instructions, verbatim, followed by the standing rules derived from them and from later messages.

## Original instructions (verbatim)

> My grandma, Ilnana, collected a lot of recipes. In Hebrew. Most of them are handwrited, on memo notes (which my contain a company logo or unrelevant text) Her handwriting became shakey when she got old. Some of them are double sided, so you uwil sleep following pictures which are the same recipe. Most of the recipes have title, and the source (a person, most of the time). I want full digitization of them. I want to document for each of the fields, if exists: title, source, handwriten / paper clip, ingredients, instructions, additional notes, the raw files, batch number. Use json format, for easy processing later. She kept them in batches. Try to title each batch. After digitization, I will want a static website which will allow to browse and search them. Do not invent anything. Do not fill gaps unless you are 100% sure - and in that case, note it. In any case you are not certain - mark as needed humen verification, and ask for help. Rotate raw pictures if they are not in the right direction. How do you recommend parsing them? With you own AI engine? OCR? Train OCR or other model on her handwriting? (Might be useful for other documents she wrote, we can create and manage a training set manually or with AI) If you can handle it yourself one by one without model - go for it. Make the project a git repo. Think in advance how the folders could be uses for the website. I want search. Each recipe sould be committed separately, and in a separate PR. If you are 100% sure - you can merge. Else, keep the PR open for review. the website should be able to run on github pages or cloudflare pages. use the remote git@github.com:YuvalWS/Ilana-s-Recipes.git, not initialized yet. If some scan quality is poor and you think the rescanning will help - tell me.

## Follow-up instructions from the owner

- Unclear text: "Flag plus my best guess" - mark the spot as uncertain and record the best guess separately (never in the main text).
- Work autonomously: "don't wait for my confirmation, go ahead as long as you didn't reach the session limit."
- "make sure to create all the files you metioned, even if you can't use git" - every file must physically exist in the project folder, independent of git.
- Batch numbering: Batch 4 is intentionally empty (the number was skipped by mistake); keep the folder and do not renumber. See `docs/BATCH_NUMBERING.md`.

- Git/PR handling (Claude Code session, 2026-10-05): merge PRs with high confidence, keep medium and low open. In practice a PR is merged only when `confidence` is `high` **and** no `[?]` remains in the recipe text. Retry parsing (Opus subagents, see `docs/REPARSE_PROMPT.md`) while usage limits allow; results are added as extra commits to the recipe's open PR (`tools/update_prs.py`).
- **Ditto marks:** in Ilana's handwriting, ditto marks (״, ", //, or a vertical tick under a word) mean "copy the word(s) from the row above" - she used them to save time. Transcribe them as the copied words (expanded) and add a note `ditto marks expanded`.
- **Gemini transcriptions:** the owner added `gemini_transcribtion.txt` files inside some recipe folders (see `docs/GEMINI_TRANSCRIPTIONS.md`). They are an independent second reading, not ground truth: use them to fill `[?]` gaps only where the reading is confirmed on the scan or agrees with an earlier independent reading (policy: `docs/GEMINI_RECONCILE_PROMPT.md`).
- **Stop using Opus subagents** for new re-reads (owner instruction, 2026-10-05); finish the ones already started.
- **Review every open PR** (owner instruction, 2026-10-05). Independently read every recipe's scans and cross-reference Claude's transcription. Track the full open-PR list so a partial batch is not reported as a complete review. Correct confirmed readings on the existing PR branch; comment with specific unresolved text and leave uncertain PRs open.
- **Owner-requested corrections:** a PR labeled `pending-correction` (or the repository's existing `pending-corrections` spelling) may be fixed and merged after applying the requested corrections and validating the result. Check its discussion for the owner's corrections, preserve any remaining uncertainty honestly, and never invent missing text. After the fixes, replace the pending-correction label with the exact label `manully-corrected` (owner's spelling). This is the owner's explicit exception to the ordinary high-confidence-only merge rule; do not treat AI review as human verification.
- **Newspaper / magazine clippings** (`medium: clipping`) get a Hebrew legal notice on the recipe page (see `assets/app.js`, `LEGAL_NOTICE_CLIPPING`).
- **Website:** every recipe page has a "report a mistake" link (opens a pre-filled GitHub issue from `.github/ISSUE_TEMPLATE/recipe-mistake.yml`) and a "share" button (Web Share API with the recipe title and URL).

## Standing rules

1. **Do not invent anything.** Do not fill gaps unless 100% sure, and then say so in `notes` / `uncertainties`.
2. **Uncertain = mark and ask.** Use `[?]` in the text, explain each one in `uncertainties`, set `needs_human_verification`, lower `confidence`.
3. **Rotate raw scans upright** (clockwise degrees recorded in `raw_files[].rotation_applied_cw_degrees`); keep original file names and `original_path`.
4. **Double-sided or multi-scan recipes** are one recipe with several `raw_files` (`front`/`back`).
5. **One recipe = one folder = one commit = one PR.** Add follow-up correction commits to the existing recipe PR. Merge only when 100% sure; otherwise leave the PR open for review, except for the owner's `pending-correction` workflow above.
6. **Remote:** `git@github.com:YuvalWS/Ilanas-Recipes.git` (the repo was renamed from `Ilana-s-Recipes`; the first instruction above is verbatim and still shows the old name).
7. **Website:** static, runs on GitHub Pages or Cloudflare Pages, with search. It reads `data/recipes.json`, generated by `tools/build_index.py`.
8. **Tell the owner which scans would benefit from rescanning** (see `docs/NEEDS_REVIEW.md`).
9. **Never put secrets (tokens, keys) in chat or in the repo.**

## Workflow

```
python tools/validate.py        # check every recipe.json against schema/recipe.schema.json
python tools/build_index.py     # rebuild data/recipes.json for the website
python tools/make_branches.py   # one branch + one commit per recipe (local)
python tools/publish_prs.py     # push branches and open one PR per recipe (needs a GitHub token)
python tools/update_prs.py ID.. # add a re-transcription commit to existing PR branches (--merge-high merges if high & no [?])
python tools/build_index.py --merged-only   # website index from merged recipes only
python tools/needs_review.py    # regenerate docs/NEEDS_REVIEW.md
```
