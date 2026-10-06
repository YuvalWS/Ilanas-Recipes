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
- **Handwritten first:** prioritize `medium: handwritten` and `medium: mixed` over printed clippings. Add the GitHub label `handwritten` to their PRs so the owner can filter the open queue with `is:pr is:open label:handwritten`.
- **Searchable titles:** independently check the title on every scan, including additional headings on multi-recipe pages. Separate a recipe heading from the name of the person who supplied it; never infer a title from ingredients. Add `title-needs-review` when the heading is absent, unreadable, contains `[?]`, or has an unresolved title uncertainty. Remove that label when the heading is confirmed, even if ingredients, instructions or attribution still need review. Keep the JSON title and PR title consistent. Unknown-title filter: `is:pr is:open label:title-needs-review`; add `label:handwritten` for handwritten notes only.
- **Gemini in Chrome:** when handwriting remains difficult and browser access is available, the owner authorizes attaching the relevant picture(s) to Gemini for an independent reading. Use the Hebrew prompt in `docs/HANDWRITING_REVIEW.md`, ask for titles, source names, uncertain words and reading order, and inspect every suggested correction against the scan. Existing Gemini transcriptions remain second readings, not ground truth. If Chrome/Gemini is unavailable, record that limitation and keep unresolved PRs open; never claim a Gemini consultation took place.
- **Newspaper / magazine clippings** (`medium: clipping`) get a Hebrew legal notice on the recipe page (see `assets/app.js`, `LEGAL_NOTICE_CLIPPING`).
- **Website:** every recipe page has a "report a mistake" link (opens a pre-filled GitHub issue from `.github/ISSUE_TEMPLATE/recipe-mistake.yml`) and a "share" button (Web Share API with the recipe title and URL).
- **Website filters:** keep search, filter selections and sorting in URL query parameters so shared URLs, reloads and browser navigation restore the same state. Group source options into personal contacts and publication writers/sources. Use הגהה (proofreading) in the interface; retain existing verification JSON field names for compatibility.
- **Assigned titles:** `title` remains the heading transcribed from the scan, or `null` for an untitled card. An optional `assigned_title` is a separately chosen editorial name for browsing/search, clearly labeled when displayed. Do not invent assigned titles without an owner-provided name or an explicit request to name recipes. An assigned title is not a transcription correction, never resolves uncertainty about an original heading, and never changes confidence or human proofreading status.

- **One item, several recipes (2026-10-05):** when a note or newspaper page holds several recipes, split it into separate recipes (one folder each, all pointing at the same scan) and interlink them with the `card` field (`id`, `kind`, `recipes` = every recipe on the item incl. itself, `position`). `tools/validate.py` checks the lists are complete and symmetric; the website shows an "N recipes on the same note/clipping" box with links. Done first for batch 8 (`b08-card-01` = handwritten note, `b08-card-02` = newspaper page).
- **Owner-transcribed cards:** when the owner types a transcription himself, use it verbatim (`transcription.method: human_transcription_by_owner`); do not re-parse the handwriting.
- **Website wording (owner, 2026-10-06):** batches are called "אוסף" in the UI (not "אצווה"); the subtitle is just "ארכיון מתכונים סרוקים"; recipe pages have the share button in the title row, the "report a mistake" button directly under the transcription, and the notes section collapsed; the scan rotation note is not shown; the page header shows the owner's photo (`assets/site-photo.jpg`, favicon from it).
- **Suggested titles:** for untitled cards an AI may propose `assigned_title` with `assigned_title_status: "ai_suggested"` and a one-line `assigned_title_basis`; it is shown as "כותרת מוצעת (טרם אושרה)". The owner approves it (`owner_approved`) or replaces it; the transcribed `title` stays null. Recipes are merged only after their titles are settled.
- **Title-reviewed PRs:** a PR labelled `title-reviewed` had only its title checked by the owner; state that in the PR and leave the rest un-proofread.
- **Source names (owner, 2026-10-06):** the recipe source filter groups sources into people (personal contacts) and "שפים, כותבים ומקורות בפרסומים". A chef is a person (`source.type: person`) with `source.role: "chef"` and is listed in the second group. Known chefs: אהרוני, ניקי (= Niki B; normalized to `ניקי (Niki B)`). The earlier reading מיקי/מיכי was corrected to מירי (b06-r13, b07-r06).
- **Per-field proofreading (owner, 2026-10-06):** every manual correction by a human MUST be recorded in the recipe's `proofread` map - one key per corrected field (`title`, `assigned_title`, `source`, `medium`, `ingredients`, `instructions`, `notes`, `raw_files`, `card`), each with `by`, `date`, `via` (PR/issue/chat) and optional `scope` when only part of the field was checked (e.g. "first ingredient only", "confirmed untitled"). Even a one-word fix records its field. Absence of a field = still unproofread AI text. AI work never writes `proofread`; the site shows a green "✓ הוגה" badge per field. The record-wide `needs_human_verification` / `confidence` stay as they were.
- **Site changes need the browser tests:** run `python tools/test_website.py` and `python tools/test_website_features.py` before pushing any change to `assets/` or `index.html` (CI `Website tests` runs them too). Add a check for every new site feature. A missing run caused the empty-source-list regression of 2026-10-06.
- **Confirmed "no source":** `source: null` alone means "no source recorded, not yet checked". When the owner confirms the card really has no source, also set `proofread.source` with `scope: "confirmed: no source on the card"` (done for b16-r03). The site's source filter has a group "מצב המקור": no source (confirmed), no source (not yet checked), and unsure/unreadable source.

## Working in parallel (several people / tools edit this repo at the same time)

- **Never commit generated files.** `data/recipes.json` (the website index) and `docs/NEEDS_REVIEW.md` are rebuilt automatically by the `Rebuild search index` GitHub Action after every push to `main` that touches `recipes/**`. Do not include them in PRs (the `Validate recipes` check warns); for a local preview run `python tools/build_index.py` and do not `git add` the result.
- **One recipe = one branch `recipe/<id>` = one PR**; touch only that recipe's folder (plus its `batch.json` when a batch changes).
- **Check before you re-read or edit a recipe:** `git fetch`, then look at `git log origin/recipe/<id>` / the open PR - someone may already have pushed a newer reading. `tools/update_prs.py` always builds on the remote branch tip and never force-pushes, and it keeps the `confidence: ...` PR label in sync.
- **Do not `git pull` in a working tree that holds untracked recipe folders** (it aborts when `main` has since merged them). Use `git fetch` and a separate worktree (`git worktree add ../wt origin/main`) for merges and conflict fixing.
- `.gitattributes` forces LF line endings so Windows tools do not create CRLF noise.
- **Naming:** the owner names batches (`batch.json` `title`, `title_status: owner_set`) and may give a recipe an `assigned_title` nickname (e.g. b08-r07 "צימעס"); shown as an extra search title.

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
