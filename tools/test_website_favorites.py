#!/usr/bin/env python3
"""Browser checks for favorites (device-local) and "הקלאסיים" (curated list). Requires Playwright; see README.md."""
import functools
import json
import os
import threading
from http.server import ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import expect, sync_playwright

from test_website_features import QuietHandler, make_fixture, new_fixture_page

ROOT = Path(__file__).resolve().parent.parent
KEY = "ilanas-recipes:favorites:v1"
NO_SHARE = """
  window.__copied = null;
  try { Object.defineProperty(navigator, 'share', { value: undefined }); } catch (e) {}
  try { Object.defineProperty(navigator, 'clipboard', { value: { writeText: t => { window.__copied = t; return Promise.resolve(); } } }); } catch (e) {}
"""


def card_heart(page, rid):
    return page.locator(f'#grid li:has(a[href="#/{rid}"]) button.heart')


def stored(page):
    return page.evaluate(f"JSON.parse(localStorage.getItem('{KEY}') || '[]')")


def run(browser, base):
    errors = []
    data = json.loads((ROOT / "data/recipes.json").read_text(encoding="utf-8"))
    fixture, a, b, c, d = make_fixture(data)
    fixture["_classics"] = [b["id"], c["id"]]
    ctx, page = new_fixture_page(browser, base, fixture, errors)
    page.add_init_script(NO_SHARE)
    page.goto(base)

    # ---- start state ----
    expect(page.locator("#grid .card")).to_have_count(4)
    expect(page.locator("#t-favs")).to_have_text("♥ המועדפים שלי (0)")
    expect(page.locator("#fav-share")).to_be_hidden()                 # sharing/importing favorites is hidden for now
    expect(page.locator("#fav-import")).to_be_hidden()
    expect(page.locator("#t-classics")).to_have_text("★ הקלאסיים (2)")
    page.locator("#t-favs").click()
    expect(page.locator("#grid .empty")).to_contain_text("עדיין אין מועדפים")
    page.locator("#t-favs").click()

    # ---- heart on a thumbnail: toggles, does not navigate, persists ----
    heart = card_heart(page, a["id"])
    expect(heart).to_have_attribute("aria-pressed", "false")
    heart.click()
    expect(heart).to_have_attribute("aria-pressed", "true")
    assert "#/" not in page.url, "clicking the heart must not open the recipe"
    expect(page.locator("#t-favs")).to_have_text("♥ המועדפים שלי (1)")
    assert stored(page) == [a["id"]]
    page.reload()
    expect(card_heart(page, a["id"])).to_have_attribute("aria-pressed", "true")
    print("PASS: heart on thumbnails toggles, does not navigate, persists across reload")

    # ---- favorites filter in the URL, clear button ----
    page.locator("#t-favs").click()
    expect(page.locator("#grid .card")).to_have_count(1)
    assert "favs=1" in page.url
    page.reload()
    expect(page.locator("#t-favs")).to_have_attribute("aria-pressed", "true")
    expect(page.locator("#grid .card")).to_have_count(1)
    expect(page.locator("#clear-filters")).to_be_enabled()
    page.locator("#clear-filters").click()
    expect(page.locator("#grid .card")).to_have_count(4)
    expect(page.locator("#t-favs")).to_have_attribute("aria-pressed", "false")
    assert "favs" not in page.url
    print("PASS: favorites filter (URL param, reload, clear button)")

    # ---- heart on the recipe page, removal inside the favorites view ----
    page.locator(f'#grid a[href="#/{b["id"]}"]').click()
    wide = page.locator(".title-actions button.heart")
    expect(wide).to_contain_text("הוספה למועדפים")
    wide.click()
    expect(wide).to_contain_text("במועדפים")
    expect(page.locator("#t-favs")).to_have_text("♥ המועדפים שלי (2)")
    page.locator(".back a").click()
    page.locator("#t-favs").click()
    expect(page.locator("#grid .card")).to_have_count(2)
    card_heart(page, a["id"]).click()                          # un-favorite while viewing favorites
    expect(page.locator("#grid .card")).to_have_count(1)
    assert stored(page) == [b["id"]]
    page.locator("#t-favs").click()
    print("PASS: heart on the recipe page; removing inside the favorites view")

    # ---- classics ----
    page.locator("#t-classics").click()
    expect(page.locator("#grid .card")).to_have_count(2)
    expect(page.locator("#grid .tag.classic")).to_have_count(2)
    assert "classics=1" in page.url
    page.locator("#t-favs").click()                            # both toggles combine (AND): only b is both
    expect(page.locator("#grid .card")).to_have_count(1)
    page.locator("#clear-filters").click()
    page.locator(f'#grid a[href="#/{b["id"]}"]').click()
    expect(page.locator(".titlewrap .tag.classic")).to_contain_text("מהקלאסיים")
    print("PASS: הקלאסיים toggle, tags, combination with favorites, badge on the recipe page")

    # ---- share link + import in a fresh browser context ----
    page.goto(base + "?favtransfer=1")                                  # the hidden switch brings the feature back
    card_heart(page, c["id"]).click()
    expect(page.locator("#fav-share")).to_be_enabled()
    page.locator("#fav-share").click()
    link = page.evaluate("window.__copied")
    assert link and "?addfavs=" in link and b["id"] in link and c["id"] in link and a["id"] not in link, link
    ctx2, p2 = new_fixture_page(browser, base, fixture, errors)
    p2.goto(base.rstrip("/") + "/?favtransfer=1&addfavs=" + link.split("?addfavs=")[1] + ",zz-99-r99")
    expect(p2.locator("#fav-banner")).to_contain_text("2 מתכונים חדשים")
    p2.locator("#fav-banner button", has_text="הוספה למועדפים").click()
    expect(p2.locator("#t-favs")).to_have_text("♥ המועדפים שלי (2)")
    assert "addfavs" not in p2.url
    assert sorted(stored(p2)) == sorted([b["id"], c["id"]])
    p2.goto(base)
    expect(p2.locator("#fav-banner")).to_be_hidden()
    ctx2.close()
    # without the switch an ?addfavs= link does nothing
    ctx4, p4 = new_fixture_page(browser, base, fixture, errors)
    p4.goto(base.rstrip("/") + "/?addfavs=" + link.split("?addfavs=")[1])
    expect(p4.locator("#grid .card").first).to_be_visible()
    expect(p4.locator("#fav-banner")).to_be_hidden()
    expect(p4.locator("#t-favs")).to_have_text("♥ המועדפים שלי (0)")
    ctx4.close()
    # manual import (paste a link or ids)
    ctx3, p3 = new_fixture_page(browser, base, fixture, errors)
    p3.goto(base + "?favtransfer=1")
    p3.once("dialog", lambda dlg: dlg.accept(f"{a['id']}, {d['id']}"))
    p3.locator("#fav-import").click()
    expect(p3.locator("#fav-banner")).to_contain_text("2 מתכונים חדשים")
    p3.locator("#fav-banner button", has_text="הוספה למועדפים").click()
    expect(p3.locator("#t-favs")).to_have_text("♥ המועדפים שלי (2)")
    ctx3.close()
    print("PASS: share link, import via link (unknown ids ignored), import by paste")

    # ---- hostile storage ----
    cases = (
        ("corrupted JSON", f"try {{ localStorage.setItem('{KEY}', '{{{{not json'); }} catch (e) {{}}", "♥ המועדפים שלי (0)"),
        ("unknown ids", f"try {{ localStorage.setItem('{KEY}', JSON.stringify(['zz-00-r00', '{a['id']}', 5])); }} catch (e) {{}}", "♥ המועדפים שלי (1)"),
    )
    for label, script, expected in cases:
        cx, pg = new_fixture_page(browser, base, fixture, errors)
        pg.add_init_script(script)
        pg.goto(base)
        expect(pg.locator("#grid .card")).to_have_count(4)
        expect(pg.locator("#t-favs")).to_have_text(expected)
        cx.close()
    cx, pg = new_fixture_page(browser, base, fixture, errors)       # storage that refuses writes (private mode)
    pg.add_init_script("Storage.prototype.setItem = function () { throw new Error('blocked'); };")
    pg.goto(base)
    card_heart(pg, a["id"]).click()
    expect(card_heart(pg, a["id"])).to_have_attribute("aria-pressed", "true")   # still works for this visit
    expect(pg.locator("#toast")).to_contain_text("לא ניתן לשמור")
    cx.close()
    print("PASS: corrupted storage, unknown ids, blocked storage")

    # ---- missing classics.json hides the toggle ----
    cx = browser.new_context()
    cx.route("**/data/classics.json*", lambda r: r.fulfill(status=404, body="no"))
    pg = cx.new_page()
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.goto(base)
    expect(pg.locator("#grid .card")).to_have_count(len(data["recipes"]))
    expect(pg.locator("#t-classics")).to_be_hidden()
    cx.close()
    ctx.close()
    assert not errors, errors
    print("PASS: no classics.json -> the toggle is hidden and nothing breaks")


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
