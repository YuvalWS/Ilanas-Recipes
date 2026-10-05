# Independent transcription review — 2026-10-05

The original inventory contained 240 open recipe PRs. The final full-inventory check found new handwritten PR #302; it was inspected too. All 241 recipe PRs were independently reviewed against their raw images and Claude’s transcriptions. Existing Gemini readings were cross-referenced where available.

Outcome: **26 recipe PRs merged**, **215 left open with review comments**. Confirmed transcription changes were pushed on 174 existing recipe branches. Every reviewed recipe JSON passed schema validation; raw-file IDs, batch IDs and provenance were preserved. No AI reread was marked human-verified.

Open queue at this snapshot: **189 handwritten/mixed PRs**, **86 unknown/uncertain titles**. Labels describe the current PR head, including title corrections made during this review.

## Filters and follow-up

See [HANDWRITING_REVIEW.md](HANDWRITING_REVIEW.md) for clickable filters, the Gemini prompt and rescan guidance. The complete review is represented by the PR links below; earlier comments retain detailed correction history when a later title audit added a follow-up comment.

Owner corrections were applied to #291, #294 and #296, which were merged and labeled `manully-corrected`; their pending-correction labels were removed. Remaining uncertain AI readings are not treated as owner verification.

Gemini in Chrome was unavailable in this cloud environment (`ERR_TUNNEL_CONNECTION_FAILED`; no signed-in interactive session). No new Gemini consultation was performed.

The website index was rebuilt from the 80 recipe folders tracked on main. Validation and browser checks passed: all indexed recipes, Hebrew search, batch/verification filters, details, scan loading, report/share controls, clipping notices and indexed image HTTP responses.

## Coverage ledger

| PR | Recipe | Title after review | Outcome | Confidence | Title needs review | Reviewed head |
|---|---|---|---|---|---|---|
| [#2](https://github.com/YuvalWS/Ilanas-Recipes/pull/2) | b01-r02 | עוגיות שושנה | open — unresolved | low | yes | `f791815f4b` |
| [#3](https://github.com/YuvalWS/Ilanas-Recipes/pull/3) | b01-r03 | עוגת שקדים | open — unresolved | medium | no | `f3008a25ec` |
| [#4](https://github.com/YuvalWS/Ilanas-Recipes/pull/4) | b01-r04 | עוגת אגוזים | open — unresolved | medium | no | `5230bd4ace` |
| [#5](https://github.com/YuvalWS/Ilanas-Recipes/pull/5) | b01-r05 | עוגת פירות יבשים (קופ"ח) | open — unresolved | medium | no | `5b573cf2fe` |
| [#6](https://github.com/YuvalWS/Ilanas-Recipes/pull/6) | b01-r06 | בצק פריך | open — unresolved | medium | no | `d720f7a097` |
| [#7](https://github.com/YuvalWS/Ilanas-Recipes/pull/7) | b01-r07 | טורט | open — unresolved | low | no | `9add37bd91` |
| [#8](https://github.com/YuvalWS/Ilanas-Recipes/pull/8) | b01-r08 | עוגת תפוזים | open — unresolved | medium | no | `fbe4f7f7c3` |
| [#9](https://github.com/YuvalWS/Ilanas-Recipes/pull/9) | b01-r09 | קרם לביסקויט | open — unresolved | medium | no | `0d3bf94b5e` |
| [#10](https://github.com/YuvalWS/Ilanas-Recipes/pull/10) | b01-r10 | רולדה שוקולד | open — unresolved | medium | no | `c0a68ab865` |
| [#12](https://github.com/YuvalWS/Ilanas-Recipes/pull/12) | b01-r12 | עוגת תפו"ע | open — unresolved | medium | no | `2ffdca6a33` |
| [#13](https://github.com/YuvalWS/Ilanas-Recipes/pull/13) | b01-r13 | עוגת שיש | open — unresolved | medium | no | `0cbeaad984` |
| [#14](https://github.com/YuvalWS/Ilanas-Recipes/pull/14) | b01-r14 | עוגת שבע ברכות (3 שכבות) | open — unresolved | medium | no | `f64cb79000` |
| [#15](https://github.com/YuvalWS/Ilanas-Recipes/pull/15) | b01-r15 | טורט עם קקאו וקוניאק | open — unresolved | medium | no | `d39617478a` |
| [#18](https://github.com/YuvalWS/Ilanas-Recipes/pull/18) | b16-r08 | (no title) | open — unresolved | medium | yes | `078d3c58e7` |
| [#20](https://github.com/YuvalWS/Ilanas-Recipes/pull/20) | b01-r18 | עוגת שרלוטה | open — unresolved | medium | no | `ac16d2df39` |
| [#21](https://github.com/YuvalWS/Ilanas-Recipes/pull/21) | b16-r09 | קינואה | open — unresolved | medium | no | `9f994c90b1` |
| [#22](https://github.com/YuvalWS/Ilanas-Recipes/pull/22) | b01-r19 | עוגה | open — unresolved | low | no | `7fa25bcfb9` |
| [#24](https://github.com/YuvalWS/Ilanas-Recipes/pull/24) | b01-r20 | (no title) | open — unresolved | low | yes | `1fcbe3f0f0` |
| [#26](https://github.com/YuvalWS/Ilanas-Recipes/pull/26) | b01-r21 | עוגת שמרים עם פירורים | open — unresolved | low | yes | `9ef313157d` |
| [#27](https://github.com/YuvalWS/Ilanas-Recipes/pull/27) | b17-r02 | (no title) | open — unresolved | medium | yes | `6f2f459da6` |
| [#28](https://github.com/YuvalWS/Ilanas-Recipes/pull/28) | b01-r22 | [?] | open — unresolved | low | yes | `67d905d79d` |
| [#30](https://github.com/YuvalWS/Ilanas-Recipes/pull/30) | b17-r03 | (no title) | open — unresolved | medium | yes | `52482535b1` |
| [#31](https://github.com/YuvalWS/Ilanas-Recipes/pull/31) | b01-r23 | עוגת קוקוס / 3 שכבות | open — unresolved | medium | no | `da271dab86` |
| [#33](https://github.com/YuvalWS/Ilanas-Recipes/pull/33) | b01-r24 | (no title) | open — unresolved | low | yes | `970fab6926` |
| [#34](https://github.com/YuvalWS/Ilanas-Recipes/pull/34) | b17-r05 | שוקיים עם כרשה ושזיפים | open — unresolved | medium | no | `13e813f412` |
| [#35](https://github.com/YuvalWS/Ilanas-Recipes/pull/35) | b02-r01 | מוס | open — unresolved | medium | no | `065b42ed16` |
| [#36](https://github.com/YuvalWS/Ilanas-Recipes/pull/36) | b17-r06 | עופות קטנים וירקות | open — unresolved | medium | yes | `9b40c0264b` |
| [#37](https://github.com/YuvalWS/Ilanas-Recipes/pull/37) | b02-r02 | בצק לפטיפורים | open — unresolved | medium | no | `3800948dae` |
| [#39](https://github.com/YuvalWS/Ilanas-Recipes/pull/39) | b02-r03 | טורט פרג | open — unresolved | medium | no | `4c271595c7` |
| [#40](https://github.com/YuvalWS/Ilanas-Recipes/pull/40) | b17-r08 | 10 שוקיים | open — unresolved | low | yes | `225d2e5cc1` |
| [#41](https://github.com/YuvalWS/Ilanas-Recipes/pull/41) | b02-r04 | עוגיות במילוי אינסטנט | open — unresolved | low | no | `01cb27333a` |
| [#44](https://github.com/YuvalWS/Ilanas-Recipes/pull/44) | b17-r10 | עוף בתנור | open — unresolved | low | no | `e0553278b5` |
| [#45](https://github.com/YuvalWS/Ilanas-Recipes/pull/45) | b02-r06 | פונטש | open — unresolved | medium | no | `5c9e5015b4` |
| [#46](https://github.com/YuvalWS/Ilanas-Recipes/pull/46) | b17-r11 | עוף | open — unresolved | low | no | `9556da41e1` |
| [#47](https://github.com/YuvalWS/Ilanas-Recipes/pull/47) | b02-r07 | (no title) | open — unresolved | medium | yes | `1e959e48ab` |
| [#48](https://github.com/YuvalWS/Ilanas-Recipes/pull/48) | b09-r01 | [?] בקר | open — unresolved | medium | yes | `68a0318ec0` |
| [#49](https://github.com/YuvalWS/Ilanas-Recipes/pull/49) | b13-r01 | עוגת ביסקויט | open — unresolved | low | no | `565a2b9d6f` |
| [#50](https://github.com/YuvalWS/Ilanas-Recipes/pull/50) | b17-r12 | עוף בתנור | open — unresolved | low | no | `bd89de3c4f` |
| [#51](https://github.com/YuvalWS/Ilanas-Recipes/pull/51) | b13-r02 | [?] | open — unresolved | medium | yes | `9a400ca2b0` |
| [#53](https://github.com/YuvalWS/Ilanas-Recipes/pull/53) | b09-r02 | צלי בקר ברוטב | merged | high | no | `9c9c2624b6` |
| [#54](https://github.com/YuvalWS/Ilanas-Recipes/pull/54) | b17-r13 | עוף | open — unresolved | low | no | `3764964376` |
| [#55](https://github.com/YuvalWS/Ilanas-Recipes/pull/55) | b13-r03 | עוגת גבינה | open — unresolved | low | no | `837005d10c` |
| [#56](https://github.com/YuvalWS/Ilanas-Recipes/pull/56) | b02-r09 | רפרפת שזיפים וצימוקים | open — unresolved | medium | no | `55258bd36f` |
| [#58](https://github.com/YuvalWS/Ilanas-Recipes/pull/58) | b17-r14 | עוף [?] | open — unresolved | low | yes | `857b17cfa1` |
| [#59](https://github.com/YuvalWS/Ilanas-Recipes/pull/59) | b13-r04 | עוגת גבינה | open — unresolved | low | no | `110cb518ec` |
| [#60](https://github.com/YuvalWS/Ilanas-Recipes/pull/60) | b03-r01 | [?] | open — unresolved | low | yes | `ecd6134441` |
| [#61](https://github.com/YuvalWS/Ilanas-Recipes/pull/61) | b09-r04 | בקר - [?] | open — unresolved | low | yes | `3231d60004` |
| [#62](https://github.com/YuvalWS/Ilanas-Recipes/pull/62) | b17-r15 | עוף [?] | open — unresolved | low | yes | `46fb2dff64` |
| [#63](https://github.com/YuvalWS/Ilanas-Recipes/pull/63) | b03-r02 | פרגיות | open — unresolved | low | no | `4ef46aa97f` |
| [#65](https://github.com/YuvalWS/Ilanas-Recipes/pull/65) | b09-r05 | צלי בקר ביין אדום | open — unresolved | medium | yes | `88c8c8d852` |
| [#66](https://github.com/YuvalWS/Ilanas-Recipes/pull/66) | b18-r01 | (no title) | open — unresolved | low | yes | `32ccf72c2a` |
| [#67](https://github.com/YuvalWS/Ilanas-Recipes/pull/67) | b03-r03 | (no title) | open — unresolved | low | yes | `73eec2bb63` |
| [#68](https://github.com/YuvalWS/Ilanas-Recipes/pull/68) | b09-r06 | בקר | open — unresolved | medium | no | `6261942bc0` |
| [#69](https://github.com/YuvalWS/Ilanas-Recipes/pull/69) | b13-r06 | עוגת גבינה מופחתת קלוריות בציפוי שמנת קלה | open — unresolved | medium | no | `3b70a88b93` |
| [#70](https://github.com/YuvalWS/Ilanas-Recipes/pull/70) | b18-r02 | (no title) | open — unresolved | low | yes | `bcb28305b0` |
| [#71](https://github.com/YuvalWS/Ilanas-Recipes/pull/71) | b03-r04 | בקר וירקות שורש | open — unresolved | medium | no | `e367d44033` |
| [#72](https://github.com/YuvalWS/Ilanas-Recipes/pull/72) | b09-r07 | (no title) | open — unresolved | medium | yes | `d18e411557` |
| [#75](https://github.com/YuvalWS/Ilanas-Recipes/pull/75) | b03-r05 | (no title) | open — unresolved | medium | yes | `80f3c722ed` |
| [#77](https://github.com/YuvalWS/Ilanas-Recipes/pull/77) | b09-r08 | [?] | open — unresolved | low | yes | `082b6eaa2f` |
| [#78](https://github.com/YuvalWS/Ilanas-Recipes/pull/78) | b13-r08 | עוגת גבינה | open — unresolved | low | no | `1b3ea273ee` |
| [#79](https://github.com/YuvalWS/Ilanas-Recipes/pull/79) | b03-r06 | תערובת הודו, אורז | open — unresolved | low | no | `098691a9c9` |
| [#81](https://github.com/YuvalWS/Ilanas-Recipes/pull/81) | b09-r09 | צלי עגל | open — unresolved | low | no | `2912627f3d` |
| [#82](https://github.com/YuvalWS/Ilanas-Recipes/pull/82) | b14-r01 | [?] | open — unresolved | low | yes | `b9bb70c47a` |
| [#83](https://github.com/YuvalWS/Ilanas-Recipes/pull/83) | b03-r07 | גולש בקר | merged | high | no | `26febe8544` |
| [#85](https://github.com/YuvalWS/Ilanas-Recipes/pull/85) | b09-r10 | (no title) | open — unresolved | low | yes | `4214696654` |
| [#86](https://github.com/YuvalWS/Ilanas-Recipes/pull/86) | b14-r02 | עוגת מוס | merged | high | no | `3142170687` |
| [#88](https://github.com/YuvalWS/Ilanas-Recipes/pull/88) | b18-r07 | [?] | open — unresolved | low | yes | `9f6953666a` |
| [#89](https://github.com/YuvalWS/Ilanas-Recipes/pull/89) | b14-r03 | עוגיות טחינה ללא גלוטן | merged | high | no | `d041d487bc` |
| [#90](https://github.com/YuvalWS/Ilanas-Recipes/pull/90) | b09-r11 | בקר | open — unresolved | low | no | `123ff7d88c` |
| [#92](https://github.com/YuvalWS/Ilanas-Recipes/pull/92) | b18-r08 | מוס מנצח | merged | high | no | `2ac5ecbaf1` |
| [#93](https://github.com/YuvalWS/Ilanas-Recipes/pull/93) | b14-r04 | עוגיות שקדים | merged | high | no | `1a03c327e5` |
| [#94](https://github.com/YuvalWS/Ilanas-Recipes/pull/94) | b09-r12 | בשר בקר | open — unresolved | low | no | `67f4257deb` |
| [#96](https://github.com/YuvalWS/Ilanas-Recipes/pull/96) | b18-r09 | עוגה [?] | open — unresolved | low | yes | `c26f9f1944` |
| [#98](https://github.com/YuvalWS/Ilanas-Recipes/pull/98) | b09-r13 | (no title) | open — unresolved | low | yes | `10e8d2cf9e` |
| [#99](https://github.com/YuvalWS/Ilanas-Recipes/pull/99) | b05-r04 | [?] / קציצות | open — unresolved | low | yes | `0eca1acdc7` |
| [#100](https://github.com/YuvalWS/Ilanas-Recipes/pull/100) | b18-r10 | עוגת פירות | open — unresolved | low | no | `83bd12be21` |
| [#102](https://github.com/YuvalWS/Ilanas-Recipes/pull/102) | b09-r14 | (no title) | open — unresolved | low | yes | `82f09a8f8f` |
| [#103](https://github.com/YuvalWS/Ilanas-Recipes/pull/103) | b05-r05 | קציצות | open — unresolved | medium | no | `970fda5de1` |
| [#105](https://github.com/YuvalWS/Ilanas-Recipes/pull/105) | b18-r11 | סלפר? [?] / [?] | open — unresolved | low | yes | `2eef926381` |
| [#107](https://github.com/YuvalWS/Ilanas-Recipes/pull/107) | b05-r06 | קציצות עוף [?] | open — unresolved | medium | yes | `f44f733664` |
| [#108](https://github.com/YuvalWS/Ilanas-Recipes/pull/108) | b14-r08 | עוגת שוקולד | open — unresolved | low | no | `accea543ad` |
| [#109](https://github.com/YuvalWS/Ilanas-Recipes/pull/109) | b18-r12 | עוגת פירות יבשים | merged | high | no | `37af56cadc` |
| [#110](https://github.com/YuvalWS/Ilanas-Recipes/pull/110) | b09-r16 | [?] | open — unresolved | low | yes | `a2aad90219` |
| [#111](https://github.com/YuvalWS/Ilanas-Recipes/pull/111) | b05-r07 | (no title) | open — unresolved | low | yes | `0e3c5c1f49` |
| [#112](https://github.com/YuvalWS/Ilanas-Recipes/pull/112) | b15-r01 | לביבות תפוחי אדמה [?] | open — unresolved | medium | yes | `633a4070a8` |
| [#113](https://github.com/YuvalWS/Ilanas-Recipes/pull/113) | b18-r13 | לביבות | merged | high | no | `94f563ac6a` |
| [#114](https://github.com/YuvalWS/Ilanas-Recipes/pull/114) | b09-r17 | בשר בקר | open — unresolved | low | no | `163e84731f` |
| [#115](https://github.com/YuvalWS/Ilanas-Recipes/pull/115) | b05-r08 | (no title) | open — unresolved | low | yes | `3e3af2a758` |
| [#116](https://github.com/YuvalWS/Ilanas-Recipes/pull/116) | b15-r02 | חביתות בשכבות | open — unresolved | low | no | `ebb10dc78b` |
| [#117](https://github.com/YuvalWS/Ilanas-Recipes/pull/117) | b10-r01 | (no title) | open — unresolved | medium | yes | `ca7542f49e` |
| [#118](https://github.com/YuvalWS/Ilanas-Recipes/pull/118) | b19-r01 | מרק [?] | open — unresolved | low | yes | `d8284efb12` |
| [#119](https://github.com/YuvalWS/Ilanas-Recipes/pull/119) | b05-r09 | קציצות ברוטב | open — unresolved | medium | no | `ba8f63697d` |
| [#120](https://github.com/YuvalWS/Ilanas-Recipes/pull/120) | b15-r03 | לביבות תירס | open — unresolved | low | no | `8e76d7793c` |
| [#121](https://github.com/YuvalWS/Ilanas-Recipes/pull/121) | b10-r02 | סלט כרוב וחמוציות | open — unresolved | low | no | `214f4bdc4b` |
| [#122](https://github.com/YuvalWS/Ilanas-Recipes/pull/122) | b19-r02 | פלפל ממולא | open — unresolved | low | no | `9c85464c70` |
| [#123](https://github.com/YuvalWS/Ilanas-Recipes/pull/123) | b05-r10 | (no title) | open — unresolved | low | yes | `7daa260e43` |
| [#124](https://github.com/YuvalWS/Ilanas-Recipes/pull/124) | b15-r04 | קוגל אטריות | open — unresolved | low | no | `a375eeec83` |
| [#125](https://github.com/YuvalWS/Ilanas-Recipes/pull/125) | b10-r03 | [?] | open — unresolved | low | yes | `b311af63f0` |
| [#126](https://github.com/YuvalWS/Ilanas-Recipes/pull/126) | b19-r03 | פלפלים ממולאים | open — unresolved | low | no | `a6304611f2` |
| [#129](https://github.com/YuvalWS/Ilanas-Recipes/pull/129) | b10-r04 | (no title) | open — unresolved | low | yes | `ef400ddfea` |
| [#130](https://github.com/YuvalWS/Ilanas-Recipes/pull/130) | b19-r04 | (no title) | open — unresolved | low | yes | `0140316072` |
| [#131](https://github.com/YuvalWS/Ilanas-Recipes/pull/131) | b05-r12 | קציצות שווארמה אפויות | open — unresolved | medium | no | `b72d8655d6` |
| [#133](https://github.com/YuvalWS/Ilanas-Recipes/pull/133) | b10-r05 | כרובית צלויה בשמן זית | open — unresolved | medium | no | `104d80440c` |
| [#134](https://github.com/YuvalWS/Ilanas-Recipes/pull/134) | b19-r05 | פלפל ממולא | open — unresolved | medium | no | `2d262ee8ae` |
| [#135](https://github.com/YuvalWS/Ilanas-Recipes/pull/135) | b05-r13 | קציצות עוף הונגריות | open — unresolved | medium | no | `59b1ebc0ad` |
| [#136](https://github.com/YuvalWS/Ilanas-Recipes/pull/136) | b15-r07 | פשטידת ברוקלי | open — unresolved | low | no | `9c20652cb8` |
| [#140](https://github.com/YuvalWS/Ilanas-Recipes/pull/140) | b15-r08 | ברוקלי כרובית | open — unresolved | low | no | `ba9a147430` |
| [#143](https://github.com/YuvalWS/Ilanas-Recipes/pull/143) | b19-r08 | פלפל ממולא | open — unresolved | low | no | `1f59e5f7f6` |
| [#144](https://github.com/YuvalWS/Ilanas-Recipes/pull/144) | b15-r09 | מאפה קישואים וברוקולי | open — unresolved | medium | no | `c11a4a2a7a` |
| [#146](https://github.com/YuvalWS/Ilanas-Recipes/pull/146) | b05-r15 | קציצות ברוטב עגבניות | open — unresolved | medium | no | `743e1c9bf2` |
| [#149](https://github.com/YuvalWS/Ilanas-Recipes/pull/149) | b15-r10 | פשטידת קישואים | open — unresolved | low | no | `2ef0f605cb` |
| [#151](https://github.com/YuvalWS/Ilanas-Recipes/pull/151) | b20-r02 | סלט [?] | open — unresolved | low | yes | `746a7f428c` |
| [#152](https://github.com/YuvalWS/Ilanas-Recipes/pull/152) | b11-r04 | מרק ירקות | open — unresolved | low | no | `e85f3b1ef5` |
| [#153](https://github.com/YuvalWS/Ilanas-Recipes/pull/153) | b15-r11 | פשטידת אנטי פסטי | open — unresolved | medium | no | `5e3038bad6` |
| [#154](https://github.com/YuvalWS/Ilanas-Recipes/pull/154) | b05-r17 | קצי׳ בשר | open — unresolved | low | no | `accb17db47` |
| [#155](https://github.com/YuvalWS/Ilanas-Recipes/pull/155) | b20-r03 | רוטב ויניגרט | merged | high | no | `1ed4291280` |
| [#156](https://github.com/YuvalWS/Ilanas-Recipes/pull/156) | b11-r05 | (no title) | open — unresolved | low | yes | `dd6e2e3a15` |
| [#157](https://github.com/YuvalWS/Ilanas-Recipes/pull/157) | b15-r12 | פשטידת ברוקולי וגבינה | open — unresolved | low | no | `e69f2179e6` |
| [#158](https://github.com/YuvalWS/Ilanas-Recipes/pull/158) | b06-r01 | [?] | open — unresolved | low | yes | `e5f5e45833` |
| [#159](https://github.com/YuvalWS/Ilanas-Recipes/pull/159) | b20-r04 | סלט חסה אלגנטי | merged | high | no | `a3cfda0ab9` |
| [#160](https://github.com/YuvalWS/Ilanas-Recipes/pull/160) | b11-r06 | [?] | open — unresolved | low | yes | `b73a777aed` |
| [#161](https://github.com/YuvalWS/Ilanas-Recipes/pull/161) | b15-r13 | פשטידת פטריות | open — unresolved | low | no | `20de241fab` |
| [#162](https://github.com/YuvalWS/Ilanas-Recipes/pull/162) | b06-r02 | דג סול | open — unresolved | low | no | `43e5730b02` |
| [#164](https://github.com/YuvalWS/Ilanas-Recipes/pull/164) | b20-r05 | סלט כרוב | merged | high | no | `b2eedde6c4` |
| [#165](https://github.com/YuvalWS/Ilanas-Recipes/pull/165) | b15-r14 | פשטידה [?] | open — unresolved | low | yes | `47f7fc4ca1` |
| [#166](https://github.com/YuvalWS/Ilanas-Recipes/pull/166) | b06-r03 | דגים ממולאים | open — unresolved | low | no | `2653e3838f` |
| [#167](https://github.com/YuvalWS/Ilanas-Recipes/pull/167) | b11-r08 | מרק דלעת - חדש | open — unresolved | low | no | `6404ce2df1` |
| [#168](https://github.com/YuvalWS/Ilanas-Recipes/pull/168) | b20-r06 | סלט עם רימונים | open — unresolved | medium | no | `7724891fb3` |
| [#169](https://github.com/YuvalWS/Ilanas-Recipes/pull/169) | b20-r07 | סלט רענן עם סמלי החג | open — unresolved | medium | no | `073d087f7a` |
| [#170](https://github.com/YuvalWS/Ilanas-Recipes/pull/170) | b06-r04 | (no title) | open — unresolved | low | yes | `05e7bbb865` |
| [#171](https://github.com/YuvalWS/Ilanas-Recipes/pull/171) | b11-r09 | (no title) | open — unresolved | medium | yes | `fc4b835346` |
| [#173](https://github.com/YuvalWS/Ilanas-Recipes/pull/173) | b20-r08 | סלט כרובית | open — unresolved | low | no | `bd92c5b18b` |
| [#174](https://github.com/YuvalWS/Ilanas-Recipes/pull/174) | b06-r05 | דגים ממולאים | open — unresolved | medium | no | `ad5db5a8a6` |
| [#175](https://github.com/YuvalWS/Ilanas-Recipes/pull/175) | b11-r10 | מרק תירס | merged | high | no | `f2a021d51a` |
| [#176](https://github.com/YuvalWS/Ilanas-Recipes/pull/176) | b15-r16 | לביבות ירק אפויות | open — unresolved | low | no | `2da42196db` |
| [#177](https://github.com/YuvalWS/Ilanas-Recipes/pull/177) | b06-r06 | (no title) | open — unresolved | low | yes | `3e3d6db31c` |
| [#179](https://github.com/YuvalWS/Ilanas-Recipes/pull/179) | b15-r17 | פשטידת גבינות | open — unresolved | low | no | `c2f0cdd8f4` |
| [#180](https://github.com/YuvalWS/Ilanas-Recipes/pull/180) | b20-r09 | (no title) | open — unresolved | low | yes | `98f854a5d4` |
| [#181](https://github.com/YuvalWS/Ilanas-Recipes/pull/181) | b15-r18 | פשטידת תירס | open — unresolved | low | no | `dc9b5e81a4` |
| [#182](https://github.com/YuvalWS/Ilanas-Recipes/pull/182) | b06-r07 | (no title) | open — unresolved | medium | yes | `12853382b1` |
| [#183](https://github.com/YuvalWS/Ilanas-Recipes/pull/183) | b11-r12 | מרק אפונה | open — unresolved | low | no | `50c1e9d04b` |
| [#185](https://github.com/YuvalWS/Ilanas-Recipes/pull/185) | b15-r19 | פשטידת גבינות | open — unresolved | low | no | `ac738a3de2` |
| [#186](https://github.com/YuvalWS/Ilanas-Recipes/pull/186) | b11-r13 | מרק עדשים בשתי שניות | open — unresolved | medium | no | `95e8511706` |
| [#187](https://github.com/YuvalWS/Ilanas-Recipes/pull/187) | b06-r08 | (no title) | open — unresolved | low | yes | `e15ba2c41a` |
| [#188](https://github.com/YuvalWS/Ilanas-Recipes/pull/188) | b15-r20 | פשטידת זיתים | open — unresolved | low | no | `c644a60d80` |
| [#190](https://github.com/YuvalWS/Ilanas-Recipes/pull/190) | b11-r14 | מרק עדשים | merged | high | no | `1599e39c76` |
| [#191](https://github.com/YuvalWS/Ilanas-Recipes/pull/191) | b15-r21 | [?] גמבה קלויה ממולאת [?] | open — unresolved | low | yes | `4e1e672bf6` |
| [#192](https://github.com/YuvalWS/Ilanas-Recipes/pull/192) | b20-r12 | ספגטי | merged | high | no | `8182d6df4c` |
| [#193](https://github.com/YuvalWS/Ilanas-Recipes/pull/193) | b06-r09 | דג סלמון | open — unresolved | medium | no | `8e62cf8508` |
| [#194](https://github.com/YuvalWS/Ilanas-Recipes/pull/194) | b11-r15 | (no title) | open — unresolved | low | yes | `44aa73ac23` |
| [#195](https://github.com/YuvalWS/Ilanas-Recipes/pull/195) | b06-r10 | רוטב לקציצות [?] [?] | open — unresolved | low | yes | `1f40f4ca5e` |
| [#196](https://github.com/YuvalWS/Ilanas-Recipes/pull/196) | b20-r13 | פתיתים | merged | high | no | `2f931d629c` |
| [#197](https://github.com/YuvalWS/Ilanas-Recipes/pull/197) | b15-r22 | פשטידת כרובית | open — unresolved | low | no | `b2ec076286` |
| [#198](https://github.com/YuvalWS/Ilanas-Recipes/pull/198) | b11-r16 | מרק אפונה ירוקה | open — unresolved | low | no | `2eaa7f805e` |
| [#199](https://github.com/YuvalWS/Ilanas-Recipes/pull/199) | b20-r14 | (no title) | open — unresolved | medium | yes | `1efe5017da` |
| [#200](https://github.com/YuvalWS/Ilanas-Recipes/pull/200) | b06-r11 | סלמון | open — unresolved | medium | no | `001192979b` |
| [#201](https://github.com/YuvalWS/Ilanas-Recipes/pull/201) | b15-r23 | לזניה [?] | open — unresolved | low | yes | `bec70b11f8` |
| [#202](https://github.com/YuvalWS/Ilanas-Recipes/pull/202) | b11-r17 | (no title) | open — unresolved | low | yes | `0098321953` |
| [#203](https://github.com/YuvalWS/Ilanas-Recipes/pull/203) | b20-r15 | (no title) | open — unresolved | low | yes | `c9fbf2a25a` |
| [#204](https://github.com/YuvalWS/Ilanas-Recipes/pull/204) | b06-r12 | (no title) | open — unresolved | low | yes | `92238f7842` |
| [#205](https://github.com/YuvalWS/Ilanas-Recipes/pull/205) | b15-r24 | בצק לעוגת שכבות | open — unresolved | low | no | `430245fe49` |
| [#206](https://github.com/YuvalWS/Ilanas-Recipes/pull/206) | b11-r18 | (no title) | open — unresolved | low | yes | `b21cb57eee` |
| [#207](https://github.com/YuvalWS/Ilanas-Recipes/pull/207) | b20-r16 | (no title) | open — unresolved | low | yes | `b03d64dfbb` |
| [#208](https://github.com/YuvalWS/Ilanas-Recipes/pull/208) | b06-r13 | מושט | open — unresolved | medium | no | `07323eb711` |
| [#210](https://github.com/YuvalWS/Ilanas-Recipes/pull/210) | b20-r17 | (no title) | open — unresolved | low | yes | `26dcec30d8` |
| [#211](https://github.com/YuvalWS/Ilanas-Recipes/pull/211) | b12-r01 | פרגיות | open — unresolved | low | no | `d3f27564d3` |
| [#212](https://github.com/YuvalWS/Ilanas-Recipes/pull/212) | b06-r14 | מושט | open — unresolved | low | no | `1bb4232615` |
| [#213](https://github.com/YuvalWS/Ilanas-Recipes/pull/213) | b16-r01 | איטריות ואורז | open — unresolved | low | no | `741417c5f9` |
| [#214](https://github.com/YuvalWS/Ilanas-Recipes/pull/214) | b12-r02 | (no title) | open — unresolved | low | yes | `07d72dc0bb` |
| [#215](https://github.com/YuvalWS/Ilanas-Recipes/pull/215) | b20-r18 | סלט סיני | open — unresolved | low | no | `5170ab72eb` |
| [#216](https://github.com/YuvalWS/Ilanas-Recipes/pull/216) | b06-r15 | סלמון | open — unresolved | low | no | `778b5a4840` |
| [#217](https://github.com/YuvalWS/Ilanas-Recipes/pull/217) | b16-r02 | ספגטי בולונז [?] | open — unresolved | low | yes | `e09b56b9c4` |
| [#218](https://github.com/YuvalWS/Ilanas-Recipes/pull/218) | b12-r03 | (no title) | open — unresolved | low | yes | `b03c608631` |
| [#220](https://github.com/YuvalWS/Ilanas-Recipes/pull/220) | b06-r16 | (no title) | open — unresolved | low | yes | `43858f75d5` |
| [#221](https://github.com/YuvalWS/Ilanas-Recipes/pull/221) | b16-r03 | מג'דרה | open — unresolved | low | no | `da8efdcf1d` |
| [#222](https://github.com/YuvalWS/Ilanas-Recipes/pull/222) | b12-r04 | עוף עם אורז בסיר | open — unresolved | low | no | `64cc0c594f` |
| [#225](https://github.com/YuvalWS/Ilanas-Recipes/pull/225) | b06-r17 | סלמון | open — unresolved | low | no | `0600a59e2a` |
| [#227](https://github.com/YuvalWS/Ilanas-Recipes/pull/227) | b12-r05 | עוף בתנור | open — unresolved | low | no | `a5acee30c6` |
| [#228](https://github.com/YuvalWS/Ilanas-Recipes/pull/228) | b16-r05 | אורז עם ירקות | open — unresolved | low | no | `ecd4ab89ab` |
| [#229](https://github.com/YuvalWS/Ilanas-Recipes/pull/229) | b06-r18 | (no title) | open — unresolved | medium | yes | `e86cf37e16` |
| [#230](https://github.com/YuvalWS/Ilanas-Recipes/pull/230) | b20-r22 | עגבניות שרי צנוברים | open — unresolved | low | no | `78a0887018` |
| [#231](https://github.com/YuvalWS/Ilanas-Recipes/pull/231) | b12-r06 | [?] | open — unresolved | medium | yes | `3c70a2da5d` |
| [#232](https://github.com/YuvalWS/Ilanas-Recipes/pull/232) | b16-r06 | איטריות [?] | open — unresolved | low | yes | `5c34a1ac13` |
| [#233](https://github.com/YuvalWS/Ilanas-Recipes/pull/233) | b06-r19 | סלמון | open — unresolved | medium | no | `dd72ced3cf` |
| [#234](https://github.com/YuvalWS/Ilanas-Recipes/pull/234) | b20-r23 | עגבניות שרי | merged | high | no | `fe5b0394e1` |
| [#235](https://github.com/YuvalWS/Ilanas-Recipes/pull/235) | b12-r07 | עוף בבצל | open — unresolved | low | no | `2307e6c849` |
| [#236](https://github.com/YuvalWS/Ilanas-Recipes/pull/236) | b16-r07 | כוסמת | open — unresolved | medium | no | `e3e452003b` |
| [#237](https://github.com/YuvalWS/Ilanas-Recipes/pull/237) | b07-r01 | וויניגרט רוטב לסלט | merged | high | no | `bbb206e5d5` |
| [#239](https://github.com/YuvalWS/Ilanas-Recipes/pull/239) | b12-r08 | (no title) | open — unresolved | medium | yes | `317b22e6e1` |
| [#240](https://github.com/YuvalWS/Ilanas-Recipes/pull/240) | b07-r02 | רוטב | open — unresolved | medium | no | `32237e54c2` |
| [#241](https://github.com/YuvalWS/Ilanas-Recipes/pull/241) | b20-r25 | פלפלים ממולאים בגבינה | open — unresolved | medium | no | `0f1dcc21b4` |
| [#242](https://github.com/YuvalWS/Ilanas-Recipes/pull/242) | b07-r03 | (no title) | open — unresolved | low | yes | `addf873848` |
| [#243](https://github.com/YuvalWS/Ilanas-Recipes/pull/243) | b12-r09 | פרגיות | open — unresolved | medium | no | `58ef6f53fe` |
| [#244](https://github.com/YuvalWS/Ilanas-Recipes/pull/244) | b20-r26 | סלט כרוב אדום עם אפרסמון ונענע | open — unresolved | medium | no | `4161c16734` |
| [#245](https://github.com/YuvalWS/Ilanas-Recipes/pull/245) | b12-r10 | (no title) | open — unresolved | low | yes | `075c5357c6` |
| [#246](https://github.com/YuvalWS/Ilanas-Recipes/pull/246) | b07-r04 | (no title) | open — unresolved | low | yes | `63785400a7` |
| [#248](https://github.com/YuvalWS/Ilanas-Recipes/pull/248) | b07-r05 | כרוב גזר | merged | high | no | `72f037648c` |
| [#249](https://github.com/YuvalWS/Ilanas-Recipes/pull/249) | b21-r02 | שניצל | open — unresolved | medium | no | `d128dbf111` |
| [#250](https://github.com/YuvalWS/Ilanas-Recipes/pull/250) | b07-r06 | סלט סלק גזר | open — unresolved | medium | no | `c4e68b2743` |
| [#251](https://github.com/YuvalWS/Ilanas-Recipes/pull/251) | b21-r03 | שניצלים של בית | open — unresolved | medium | no | `8885a134d6` |
| [#252](https://github.com/YuvalWS/Ilanas-Recipes/pull/252) | b07-r07 | חסה | open — unresolved | low | no | `3e821c44f3` |
| [#254](https://github.com/YuvalWS/Ilanas-Recipes/pull/254) | b07-r08 | סלט תערובת ירקות | open — unresolved | low | no | `2aeac4d267` |
| [#255](https://github.com/YuvalWS/Ilanas-Recipes/pull/255) | b21-r05 | רוטב [?] | open — unresolved | low | yes | `f50a2a41ba` |
| [#256](https://github.com/YuvalWS/Ilanas-Recipes/pull/256) | b07-r09 | (no title) | open — unresolved | medium | yes | `eece5dd9da` |
| [#258](https://github.com/YuvalWS/Ilanas-Recipes/pull/258) | b07-r10 | סלט חסה | merged | high | no | `67bc27b902` |
| [#259](https://github.com/YuvalWS/Ilanas-Recipes/pull/259) | b21-r07 | (no title) | open — unresolved | low | yes | `570a4fc4b4` |
| [#260](https://github.com/YuvalWS/Ilanas-Recipes/pull/260) | b07-r11 | (no title) | open — unresolved | low | yes | `d4e04d8692` |
| [#262](https://github.com/YuvalWS/Ilanas-Recipes/pull/262) | b07-r12 | לקט עלים | merged | high | no | `8d1fae24b2` |
| [#263](https://github.com/YuvalWS/Ilanas-Recipes/pull/263) | b21-r09 | שניצל מגולגל | open — unresolved | low | no | `d43ef5f58a` |
| [#265](https://github.com/YuvalWS/Ilanas-Recipes/pull/265) | b21-r10 | שניצל ממולא | open — unresolved | low | no | `fa069c7c48` |
| [#266](https://github.com/YuvalWS/Ilanas-Recipes/pull/266) | b07-r14 | סלט כרוב | open — unresolved | medium | no | `6760ea1e6b` |
| [#267](https://github.com/YuvalWS/Ilanas-Recipes/pull/267) | b21-r11 | שניצלים | open — unresolved | low | no | `f2e35f4997` |
| [#268](https://github.com/YuvalWS/Ilanas-Recipes/pull/268) | b07-r15 | (no title) | open — unresolved | medium | yes | `f5d80be693` |
| [#269](https://github.com/YuvalWS/Ilanas-Recipes/pull/269) | b21-r12 | גלילות עוף עם חזה אווז | open — unresolved | medium | no | `128c4f1fb6` |
| [#270](https://github.com/YuvalWS/Ilanas-Recipes/pull/270) | b07-r16 | סלט הפתעות | open — unresolved | medium | no | `e5bd697924` |
| [#271](https://github.com/YuvalWS/Ilanas-Recipes/pull/271) | b22-r01 | עוגת גבינה ואוכמניות | open — unresolved | medium | no | `c6d1dc60fd` |
| [#272](https://github.com/YuvalWS/Ilanas-Recipes/pull/272) | b07-r17 | סלט הפתעות | open — unresolved | medium | no | `8fbac869ed` |
| [#273](https://github.com/YuvalWS/Ilanas-Recipes/pull/273) | b22-r02 | פשטידת קישואים | open — unresolved | low | no | `0dcc3bacfc` |
| [#274](https://github.com/YuvalWS/Ilanas-Recipes/pull/274) | b08-r01 | קציצות [?] | open — unresolved | low | yes | `86cda649d6` |
| [#275](https://github.com/YuvalWS/Ilanas-Recipes/pull/275) | b22-r03 | עוגת ביסקויט | open — unresolved | low | no | `ad2628d2f4` |
| [#276](https://github.com/YuvalWS/Ilanas-Recipes/pull/276) | b08-r02 | [?] | open — unresolved | low | yes | `2f23d6843a` |
| [#277](https://github.com/YuvalWS/Ilanas-Recipes/pull/277) | b22-r04 | עוגת גבינה קרה | open — unresolved | medium | no | `d3d7ea2aa2` |
| [#278](https://github.com/YuvalWS/Ilanas-Recipes/pull/278) | b22-r05 | עוגת [?] של 6 ביצים | open — unresolved | low | yes | `10ecd14f60` |
| [#279](https://github.com/YuvalWS/Ilanas-Recipes/pull/279) | b22-r06 | עוגת ביסקויט (משולש) | open — unresolved | low | no | `7faba828ba` |
| [#282](https://github.com/YuvalWS/Ilanas-Recipes/pull/282) | b22-r09 | בסיס-בצק לגבינה | open — unresolved | low | no | `37abc54be3` |
| [#283](https://github.com/YuvalWS/Ilanas-Recipes/pull/283) | b22-r10 | עוגת גבינה | open — unresolved | low | no | `29064cd470` |
| [#284](https://github.com/YuvalWS/Ilanas-Recipes/pull/284) | b22-r11 | עוגת גבינה | open — unresolved | low | no | `dcb27f48ee` |
| [#285](https://github.com/YuvalWS/Ilanas-Recipes/pull/285) | b23-r01 | עוגת אגוזים | open — unresolved | low | no | `21b2ce6ab7` |
| [#286](https://github.com/YuvalWS/Ilanas-Recipes/pull/286) | b23-r02 | [?] | open — unresolved | low | yes | `f22f405441` |
| [#287](https://github.com/YuvalWS/Ilanas-Recipes/pull/287) | b23-r03 | עוגת תפוחים | merged | high | no | `ce85add346` |
| [#288](https://github.com/YuvalWS/Ilanas-Recipes/pull/288) | b23-r04 | עוגה 7×7 | open — unresolved | low | no | `37c1e89c16` |
| [#289](https://github.com/YuvalWS/Ilanas-Recipes/pull/289) | b23-r05 | עוגת שזיפים עם קצף | open — unresolved | medium | no | `5c60dd808c` |
| [#290](https://github.com/YuvalWS/Ilanas-Recipes/pull/290) | b23-r06 | בצק פריך מתוק | open — unresolved | medium | no | `e7d54a26d4` |
| [#291](https://github.com/YuvalWS/Ilanas-Recipes/pull/291) | b23-r07 | עוגיות שומשום | merged | high | no | `b3ead031ff` |
| [#292](https://github.com/YuvalWS/Ilanas-Recipes/pull/292) | b23-r08 | עוגה | open — unresolved | medium | no | `8f45bad6f4` |
| [#293](https://github.com/YuvalWS/Ilanas-Recipes/pull/293) | b23-r09 | (no title) | open — unresolved | low | yes | `86a59d67d3` |
| [#294](https://github.com/YuvalWS/Ilanas-Recipes/pull/294) | b23-r10 | קסטה | merged | high | no | `3b40d7058e` |
| [#295](https://github.com/YuvalWS/Ilanas-Recipes/pull/295) | b23-r11 | בצק פריך / ריבה ופירורים | merged | high | no | `716e018597` |
| [#296](https://github.com/YuvalWS/Ilanas-Recipes/pull/296) | b99-r01 | עוגת גלידה | merged | high | no | `de9b30524f` |
| [#299](https://github.com/YuvalWS/Ilanas-Recipes/pull/299) | b01-r11 | קרם לרולדה | merged | high | no | `62506f4bda` |
| [#302](https://github.com/YuvalWS/Ilanas-Recipes/pull/302) | b99-r02 | חרוסת | open — unresolved | medium | no | `81349cfe96` |
