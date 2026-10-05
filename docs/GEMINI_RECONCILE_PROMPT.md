# Reconciling a recipe with its Gemini transcription

Project root: `C:\Users\yuval\Documents\Ilana's Recipes`. Your recipe folder `recipes/batch-NN/<id>/` holds `recipe.json` (our current reading), `raw/*.jpg` (the scan) and `gemini_transcribtion.txt` (an independent reading by Google Gemini, added by the owner).

## What Gemini's file is - and is not
A **second opinion**, not ground truth. On a sample of 66 recipes it agrees with our confident words ~86% and our numbers ~98% of the time, so it is often right where we have `[?]`. But it also:
- paraphrases and *embellishes* (adds temperatures, techniques, "stir gently" type phrases, tidy full sentences) that are not on the card;
- fills unreadable words with plausible guesses and states "full certainty" every time;
- sometimes merges or invents steps/quantities (e.g. a raisin amount that the card does not show).

## Procedure
1. Read `recipe.json`, `gemini_transcribtion.txt`, and view the scan. For shaky handwriting, crop strips with PIL (upscale 2x, boost contrast; scratch files in your own temp dir, outside the project) and read line by line.
2. For every `[?]` / uncertainty in `recipe.json`, find what Gemini wrote at that spot and **check it yourself on the zoomed crop**:
   - Visually consistent with the ink -> replace the `[?]` with the word, and remove/adjust the matching `uncertainties` entry.
   - Gemini and our `best_guess` agree **and** the crop does not contradict it -> replace.
   - Different readings, or you cannot confirm -> keep `[?]`, and record both readings in `best_guess` (e.g. `"Gemini: 100; earlier reading: 200"`).
3. Also compare the parts that are not `[?]`: where Gemini differs from our confident text, look again at the scan and fix our text only if the scan shows we were wrong.
4. **Never copy** anything from Gemini that is not visible on the card (embellished verbs, temperatures, extra steps, "to taste", tips, etc.). If Gemini has a whole line we do not, add it only if you can see it on the card.
5. **Ditto marks** (״, ", //, a vertical tick under a word) mean "copy the word(s) from the row above" (the grandmother's time saver). Write the copied words in the text and add a note `ditto marks expanded`. Remove any note saying they were left as written.
6. A quantity/digit you are not certain of stays `[?]` (reading goes in `best_guess`), even if you are 80% sure.
7. `confidence`: `high` only if every word and quantity is certain and no `[?]` remains in title/ingredients/instructions/notes; `medium` for a few doubts; `low` for many. `needs_human_verification` = true unless `high` with no `uncertainties`. Keep `source.uncertain` honest.
8. `transcription`: `{"method": "ai_reread_with_gemini_second_opinion", "date": "2026-10-05", "human_verified": false, "verified_by": null, "verified_at": null}`.
9. Rewrite `recipe.json` in place (UTF-8, indent 2, `ensure_ascii=False`), same schema (`schema/recipe.schema.json`); keep `id`, `batch`, `raw_files`. Do NOT run git, touch other folders, `thumb.jpg`, raw files or the Gemini file. Run `python tools/validate.py` before finishing.

## Final answer (under 70 words)
`<id>: confidence old->new, [?] old->new, how many gaps Gemini filled / how many you rejected, one-line note.`
