# Handwriting review and PR filters

Review handwritten and mixed cards first, inspect every raw image (both sides where present), and compare the independent reading with Claude and any existing Gemini transcription. Preserve raw assets and provenance. Add confirmed corrections to the existing recipe branch. Merge complete, confident transcriptions; leave uncertain ones open with specific comments. Owner-requested corrections on `pending-correction` / `pending-corrections` follow the exception in `AGENTS.md`, ending with the exact label `manully-corrected`.

## GitHub filters

- [Open handwritten PRs](https://github.com/YuvalWS/Ilanas-Recipes/pulls?q=is%3Apr+is%3Aopen+label%3Ahandwritten): `is:pr is:open label:handwritten`
- [Unknown or uncertain titles](https://github.com/YuvalWS/Ilanas-Recipes/pulls?q=is%3Apr+is%3Aopen+label%3Atitle-needs-review): `is:pr is:open label:title-needs-review`
- [Handwritten notes with unknown titles](https://github.com/YuvalWS/Ilanas-Recipes/pulls?q=is%3Apr+is%3Aopen+label%3Ahandwritten+label%3Atitle-needs-review): `is:pr is:open label:handwritten label:title-needs-review`

`title-needs-review` covers missing headings, partially legible titles, and uncertainty about what constitutes the title. It does not mean every other field is complete. A confirmed generic title such as עוגה remains the literal title; do not replace it with a more descriptive invented name. Unresolved person names belong to source uncertainties when the recipe heading itself is clear.

## Independent Gemini prompt

Attach all relevant sides or pages in an available Chrome/Gemini session. Obtain its independent reading before providing Claude’s interpretation, then compare both readings with the actual ink. AI agreement alone does not establish confidence.

> זה מתכון של סבתא שלי, אילנה. רוב המתכונים כוללים כותרת ואת שם האדם ממנו קיבלה את המתכון. ייתכן שיש כמה מתכונים באותו דף או המשך בצד השני.
>
> חלץ במדויק את הטקסט מכל התמונות: כותרת, שם המקור, מצרכים, כמויות, הוראות והערות. הפרד בין כותרת המתכון לבין שם האדם. אל תמציא כותרת לפי המצרכים, ואל תשלים כמויות, יחידות או הוראות שלא כתובות.
>
> אם אינך בטוח במילה או במספר, סמן `[?]` בתמלול. ציין בנפרד את הניחוש הטוב ביותר ואת הסיבה לחוסר הוודאות. אל תכניס ניחוש לתמלול כאילו הוא ודאי.
>
> תאר את סדר הקריאה ואת מיקום ההערות בצד, למעלה או בין השורות. ציין מחיקות ותיקונים. סימני חזרה כמו ״ עשויים להעתיק מילה או יחידה מהשורה שמעל; הרחב אותם רק כשההקשר ברור וציין שהורחבו. התעלם מלוגו ומטקסט מודפס שאינם חלק מהמתכון.
>
> בסוף רשום בדיוק אילו קטעים עדיין דורשים בדיקה בתמונה ברורה יותר. אם תמונה היא המשך בלי כותרת, ציין זאת.

## Scan improvements

For faded, torn or clipped cards, photograph or scan the complete card flat at 300–600 dpi, with both sides and all margins visible. A dark backing helps reduce show-through. A new image can improve faint handwriting; a missing physical fragment requires locating the original continuation. The per-PR review comments identify the affected words and quantities.

During the 2026-10-05 cloud review, Chromium could not reach Gemini (`ERR_TUNNEL_CONNECTION_FAILED`), and no signed-in interactive Chrome session was available. No new Gemini consultation was performed; existing Gemini files were cross-referenced where present.
