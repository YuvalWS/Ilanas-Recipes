#!/usr/bin/env python3
"""Browser checks for site features (complements tools/test_website.py). Requires Playwright; see README.md.

Covers: filter setup with recipes that have no source (regression: empty source list, dead filters),
always-visible clear-filters button, source.names, chef grouping, proofread badges, suggested titles,
recipe-page layout (share icon in the title row, report button under the transcription, collapsed notes,
no rotation note), card interlinks, header photo, favicon and wording.
"""
import copy
import functools
import json
import os
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parent.parent


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def new_fixture_page(browser, base, fixture, errors):
    context = browser.new_context()
    context.route("**/data/recipes.json", lambda route: route.fulfill(json=fixture))
    page = context.new_page()
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(base)
    return context, page


def make_fixture(data):
    """Four controlled recipes taken from real ones (so scans and thumbnails exist)."""
    fixture = copy.deepcopy(data)
    fixture["recipes"] = copy.deepcopy([r for r in data["recipes"] if r["raw_files"]][:4])
    a, b, c, d = fixture["recipes"]
    for r in (a, b, c, d):
        r.pop("card", None)
        r.pop("proofread", None)
        r.pop("assigned_title", None)
        r.pop("assigned_title_status", None)
    # a: no source at all (the case that once broke the whole filter bar)
    a.update(title="מתכון בלי מקור", source=None, medium="handwritten")
    # b: one source line naming two people + proofread fields + a note and a rotated scan
    b.update(title="מתכון עם שני שמות", medium="handwritten", needs_human_verification=True,
             source={"text": "דנה (רונית)", "names": ["דנה", "רונית"], "type": "person", "as_written": "דנה (רונית)", "uncertain": False},
             notes=["הערת בדיקה אחת", "הערת בדיקה שנייה"],
             proofread={"title": {"by": "Yuval (owner)", "date": "2026-10-06", "via": "test", "scope": None},
                        "source": {"by": "Yuval (owner)", "date": "2026-10-06", "via": "test", "scope": "השם הראשון בלבד"},
                        "ingredients": {"by": "Yuval (owner)", "date": "2026-10-06", "via": "test", "scope": None}})
    b["raw_files"][0]["rotation_applied_cw_degrees"] = 180
    # c: a chef (a person, listed with the publication writers) + AI-suggested title
    c.update(title=None, assigned_title="שם מוצע לבדיקה", assigned_title_status="ai_suggested", medium="handwritten",
             source={"text": "שף בדיקה", "type": "person", "as_written": "שף בדיקה", "uncertain": False, "role": "chef"})
    # d: one of two recipes on the same note
    d.update(title="מתכון שני על אותו פתק", medium="handwritten", source=None,
             proofread={"source": {"by": "Yuval (owner)", "date": "2026-10-06", "via": "test", "scope": "confirmed: no source on the card"}})
    a["card"] = {"id": "t-card-1", "kind": "handwritten_note", "recipes": [a["id"], d["id"]], "position": "למעלה", "note": None}
    d["card"] = {"id": "t-card-1", "kind": "handwritten_note", "recipes": [a["id"], d["id"]], "position": "למטה", "note": None}
    return fixture, a, b, c, d


def run(browser, base):
    errors = []
    data = json.loads((ROOT / "data/recipes.json").read_text(encoding="utf-8"))

    # ---- real data: the filter bar must work even though many recipes have no source ----
    page = browser.new_page()
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(base)
    expect(page.locator("#grid .card")).to_have_count(len(data["recipes"]))
    assert any(r["source"] is None for r in data["recipes"]), "real data should contain recipes without a source"
    assert page.locator("#f-source option").count() > 5, "source list is empty"
    page.locator("#q").fill(data["recipes"][0]["title"] or "x")
    page.locator("#q").fill("")
    expect(page.locator("#grid .card")).to_have_count(len(data["recipes"]))
    assert not errors, errors
    print("PASS: real data (recipes without a source): filters set up, source list filled, no page errors")

    # header, wording, favicon
    expect(page.locator(".sub")).to_have_text("ארכיון מתכונים סרוקים")
    assert "עיון וחיפוש" not in page.locator("body").inner_text()
    assert "אצווה" not in page.locator("body").inner_text()
    assert "אוסף" in page.locator(".filters").inner_text()
    page.wait_for_function("document.querySelector('img.logo').complete && document.querySelector('img.logo').naturalWidth > 0")
    assert page.locator("link[rel=icon]").get_attribute("href").endswith(".png")
    assert page.request.get(base + page.locator("link[rel=icon]").get_attribute("href")).ok
    assert page.locator(".card .tag").first.inner_text().startswith("אוסף ")
    print("PASS: header photo, subtitle, favicon, אוסף wording and batch name on thumbnails")

    # ---- clear-filters button: always visible, disabled when idle ----
    clear = page.locator("#clear-filters")
    expect(clear).to_be_visible()
    expect(clear).to_be_disabled()
    page.locator("#f-medium").select_option("clipping")
    expect(clear).to_be_enabled()
    page.locator("#q").fill("משהו")
    clear.click()
    expect(clear).to_be_disabled()
    for selector, value in {"#q": "", "#f-batch": "", "#f-medium": "", "#f-source": "", "#f-verify": "", "#f-sort": "rel"}.items():
        expect(page.locator(selector)).to_have_value(value)
    expect(page.locator("#grid .card")).to_have_count(len(data["recipes"]))
    assert "?" not in page.url, page.url
    print("PASS: clear-filters button visible, enabled only with active filters, resets controls and URL")
    page.close()

    # ---- fixtures ----
    fixture, a, b, c, d = make_fixture(data)
    context, page = new_fixture_page(browser, base, fixture, errors)
    expect(page.locator("#grid .card")).to_have_count(4)
    groups = page.locator("#f-source optgroup").evaluate_all(
        "gs => gs.map(g => [g.label, [...g.querySelectorAll('option')].map(o => o.value)])")
    status = dict(groups)["מצב המקור"]
    assert status == ["status:none-confirmed", "status:none-unchecked"], status
    page.locator("#f-source").select_option("status:none-confirmed")          # no source, confirmed by the owner
    assert [h for h in page.locator("#grid .card a").evaluate_all("l => l.map(a => a.hash)")] == [f"#/{d['id']}"]
    page.locator("#f-source").select_option("status:none-unchecked")          # no source recorded, not yet checked
    assert page.locator("#grid .card a").evaluate_all("l => l.map(a => a.hash)") == [f"#/{a['id']}"]
    page.locator("#f-source").select_option("")
    expect(page.locator("#grid .card")).to_have_count(4)
    people = dict(groups)["אנשים"]
    pubs = dict(groups)["שפים, כותבים ומקורות בפרסומים"]
    assert "person:דנה" in people and "person:רונית" in people, groups      # source.names: listed under each name
    assert "person:דנה (רונית)" not in people, groups
    assert "publication:שף בדיקה" in pubs and "person:שף בדיקה" not in people, groups   # chef -> with the publication writers
    for name in ("person:דנה", "person:רונית"):
        page.locator("#f-source").select_option(name)
        expect(page.locator("#grid .card")).to_have_count(1)
        assert page.locator("#grid .card a").get_attribute("href") == f"#/{b['id']}"
    page.locator("#f-source").select_option("publication:שף בדיקה")
    assert page.locator("#grid .card a").get_attribute("href") == f"#/{c['id']}"
    page.locator("#f-source").select_option("")
    print("PASS: source.names filter under each name; chef grouped with publication writers; no-source recipes tolerated")

    # list tags: proofread, suggested title, same-note
    expect(page.locator(f'#grid a[href="#/{b["id"]}"] .tag.ok')).to_contain_text("הוגה: כותרת, מקור, מרכיבים")
    expect(page.locator(f'#grid a[href="#/{c["id"]}"] .tags')).to_contain_text("כותרת מוצעת")
    expect(page.locator(f'#grid a[href="#/{a["id"]}"] .tags')).to_contain_text("1 מתוך 2 באותו פתק")

    # ---- recipe page layout (recipe b) ----
    page.locator(f'#grid a[href="#/{b["id"]}"]').click()
    h2 = page.locator("#detail-view h2")
    expect(h2).to_have_text(b["title"])                                   # badge must not pollute the heading
    expect(page.locator(".titlewrap .pf")).to_have_count(1)
    expect(page.locator("#detail-view .pf")).to_have_count(3)             # title, source, ingredients (instructions not proofread)
    assert "הוגה על ידי Yuval (owner)" in page.locator(".titlewrap .pf").get_attribute("title")
    expect(page.locator(".banner.ok")).to_contain_text("חלקים שהוגהו בידי אדם")
    expect(page.locator(".banner.ok")).to_contain_text("השם הראשון בלבד")
    share = page.locator(".titlebar .sharebox > button")
    expect(share).to_be_visible()
    expect(share.locator("svg.share-icon")).to_have_count(1)
    assert "↗" not in share.inner_text()
    hb, sb = h2.bounding_box(), share.bounding_box()
    assert sb["x"] + sb["width"] <= hb["x"] + 1 or sb["x"] < hb["x"], ("share must be on the opposite (left) side of the title", hb, sb)
    # report button directly under the transcription, before the notes
    order = page.locator(".text").evaluate("t => [...t.children].map(e => e.tagName + '.' + e.className)")
    ri = next(i for i, x in enumerate(order) if x.startswith("DIV.actions"))
    ni = next(i for i, x in enumerate(order) if x.startswith("DETAILS.notes"))
    assert ri < ni and order[ri - 1].split(".")[0] in ("OL", "UL", "H4", "P"), order
    expect(page.locator("details.notes")).not_to_have_attribute("open", "")
    assert page.locator("details.notes").evaluate("d => d.open") is False
    page.locator("details.notes summary").click()
    assert page.locator("details.notes").evaluate("d => d.open") is True
    assert "סובבה" not in page.locator("#detail-view").inner_text()        # no "rotated by..." note
    assert not page.locator("figcaption").all_text_contents() or all("°" not in t for t in page.locator("figcaption").all_text_contents())
    # share menu fallback (no navigator.share in headless Chromium here)
    share.click()
    expect(page.locator(".share-menu")).to_be_visible()
    print("PASS: recipe page: proofread badges per field, share icon in the title row, report under the transcription, collapsed notes, no rotation note")

    # suggested title page + same-note box
    page.locator(".back a").click()
    page.locator(f'#grid a[href="#/{c["id"]}"]').click()
    expect(page.locator("#detail-view h2")).to_have_text("שם מוצע לבדיקה")
    expect(page.locator(".text")).to_contain_text("טרם אושרה")
    page.locator(".back a").click()
    page.locator(f'#grid a[href="#/{a["id"]}"]').click()
    expect(page.locator(".cardbox")).to_contain_text("אחד מ-2 מתכונים על אותו פתק")
    page.locator(f'.cardbox a[href="#/{d["id"]}"]').click()
    expect(page.locator("#detail-view h2")).to_have_text(d["title"])
    print("PASS: suggested-title labelling and same-note links")
    context.close()
    assert not errors, errors


if __name__ == "__main__":
    handler = functools.partial(QuietHandler, directory=str(ROOT))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        with sync_playwright() as playwright:
            options = {"headless": True, "args": ["--no-sandbox"]}
            if os.environ.get("CHROMIUM_PATH"):
                options["executable_path"] = os.environ["CHROMIUM_PATH"]
            browser = playwright.chromium.launch(**options)
            try:
                run(browser, f"http://127.0.0.1:{server.server_port}/")
            finally:
                browser.close()
    finally:
        server.shutdown()
        server.server_close()
