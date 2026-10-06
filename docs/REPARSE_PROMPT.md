# Re-transcription worker instructions

You are re-reading ONE recipe from Ilana's collection (Hebrew, mostly shaky handwriting) to improve an earlier AI transcription.

Project root: `C:\Users\yuval\Documents\Ilana's Recipes`. Your recipe folder: `recipes/batch-NN/<id>/` containing `recipe.json` and `raw/*.jpg`.

## Method
1. Read `recipe.json` (the previous attempt) and view every file in `raw/` (images are already upright).
2. For handwriting that is hard to read, DO NOT rely on the one full-page view. Use Python + PIL (scratch files go in your own temp dir, never in the project) to crop the scan into horizontal strips (e.g. 4-8 overlapping strips), upscale 2x, boost contrast, and view each strip. Read line by line. Use context (recipe type, quantities, typical Hebrew cooking vocabulary, the title, the other lines) to disambiguate letters.
3. Re-transcribe the whole card: title, source, ingredients (with groups if the card has them), instructions, notes, incidental_text (logos/ads/page numbers that are not part of the recipe).
4. Rewrite `recipe.json` in place (UTF-8, indent 2, `ensure_ascii=False`), keeping the exact schema in `schema/recipe.schema.json`. Keep `id`, `batch`, `raw_files` untouched.

## Hard rules
- **Do not invent.** Only write what is on the card. A word you cannot read is `[?]`; a word you can read only by guessing is written as `[?]` in the text and the guess goes in `uncertainties[].best_guess` - never in the main text. Prefer the previous transcription's text where you cannot improve on it; never make it worse.
- A quantity/digit you are not certain of (e.g. 150 vs 130) must stay `[?]` in the text, with your reading only as `best_guess` - never put an unsure reading in the main text, even if you are 80% sure.
- A previous `[?]` you now read clearly with high certainty may be replaced. Be honest: when in doubt keep the `[?]`.
- Every `[?]` (or group of them in one line) needs an entry in `uncertainties` (`field`, `text`, `best_guess` or null, `reason`).
- `confidence`: `high` only if the full text is legible and you are essentially certain of every word and every quantity (no `[?]` that matters; numbers/quantities certain). `medium` if a few words/quantities are doubtful. `low` if much is unreadable. `needs_human_verification` = true unless confidence is `high` and there are no uncertainties.
- Set `transcription`: `{"method": "ai_reread_opus_crops", "date": "2026-10-05", "human_verified": false, "verified_by": null, "verified_at": null}`.
- If the card has a title or source the old version missed, add it. If the old version's title/source was wrong, fix it.
- Do NOT run git, do NOT touch any other recipe folder, do NOT edit `thumb.jpg` or raw files.
- Validate before finishing: `python tools/validate.py` (reports problems for all recipes; only yours matters).

## Final answer (keep it under 80 words)
`<id>: confidence old->new, [?] count old->new, one-line note (e.g. "now fully legible", "still shaky, rescan would help", "scan is cut off at bottom edge")`.
