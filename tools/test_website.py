#!/usr/bin/env python3
"""Browser regression checks. Requires Playwright; see README.md for setup."""
import copy
import functools
import json
import os
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parent.parent


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def params(page):
    return {key: values[0] for key, values in parse_qs(urlparse(page.url).query).items()}


def card_ids(page):
    return page.locator("#grid .card a").evaluate_all("links => links.map(a => a.hash.slice(2))")


def check_filters(page, values):
    for selector, value in values.items():
        expect(page.locator(selector)).to_have_value(value)


def run(browser, base):
    data = json.loads((ROOT / "data/recipes.json").read_text(encoding="utf-8"))
    recipes = data["recipes"]
    page = browser.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(base)
    expect(page.locator("#grid .card")).to_have_count(len(recipes))
    assert page.locator("#f-source optgroup").all_text_contents()
    assert page.locator("#f-source optgroup").evaluate_all("groups => groups.map(g => g.label)") == [
        "אנשים", "כותבים ומקורות בפרסומים"
    ]

    chosen = next(r for r in recipes if r["medium"] == "handwritten" and r["source"] and r["title"])
    values = {"#q": chosen["title"], "#f-batch": str(chosen["batch"]), "#f-medium": "handwritten",
              "#f-source": "person:" + chosen["source"]["text"],
              "#f-verify": "need" if chosen["needs_human_verification"] else "ok", "#f-sort": "title"}
    page.locator("#q").fill(values["#q"])
    for selector, value in values.items():
        if selector != "#q":
            page.locator(selector).select_option(value)
    expect(page.locator("#grid .card")).to_have_count(1)
    assert card_ids(page) == [chosen["id"]]
    shared_url = page.url
    assert params(page) == {"q": values["#q"], "batch": values["#f-batch"], "medium": "handwritten",
                            "source": values["#f-source"], "proofreading": values["#f-verify"], "sort": "title"}
    page.reload()
    check_filters(page, values)
    expect(page.locator("#grid .card")).to_have_count(1)

    # A fresh browser context must restore the shared URL without local storage.
    other = browser.new_context()
    fresh = other.new_page()
    fresh.goto(shared_url)
    expect(fresh.locator("#grid .card")).to_have_count(1)
    check_filters(fresh, values)
    other.close()

    page.locator("#grid .card a").click()
    expect(page.locator("#detail-view h2")).to_have_text(chosen["title"])
    report_params = parse_qs(urlparse(page.locator(".actions > a").get_attribute("href")).query)
    assert params(page) == {key: val[0] for key, val in parse_qs(urlparse(report_params["page_url"][0]).query).items()}
    page.reload()
    expect(page.locator("#detail-view h2")).to_have_text(chosen["title"])
    page.locator(".back a").click()
    expect(page.locator("#grid .card")).to_have_count(1)
    check_filters(page, values)
    page.locator("#f-medium").select_option("clipping")
    expect(page.locator("#grid .card")).to_have_count(0)
    page.go_back()
    expect(page.locator("#grid .card")).to_have_count(1)
    check_filters(page, values)
    page.go_forward()
    expect(page.locator("#grid .card")).to_have_count(0)
    expect(page.locator("#f-medium")).to_have_value("clipping")
    print("PASS: all URL controls, reload, fresh-context sharing, recipe navigation, Back/Forward")

    page.goto(base + "?batch=bad&medium=bad&source=bad&proofreading=bad&sort=bad&campaign=family")
    expect(page.locator("#grid .card")).to_have_count(len(recipes))
    check_filters(page, {"#f-batch": "", "#f-medium": "", "#f-source": "", "#f-verify": "", "#f-sort": "rel"})
    page.locator("#q").fill("מילה & another?")
    expect(page.locator("#grid .card")).to_have_count(0)
    assert params(page) == {"q": "מילה & another?", "campaign": "family"}, params(page)
    page.locator("#q").fill("")
    expect(page.locator("#grid .card")).to_have_count(len(recipes))
    assert params(page) == {"campaign": "family"}
    print("PASS: invalid parameters, Hebrew/special characters, clearing defaults, unrelated parameters")

    # Controlled data exercises behavior absent from the current merged collection.
    fixture = copy.deepcopy(data)
    fixture["recipes"] = copy.deepcopy(recipes[:3])
    unnamed, original, no_name = fixture["recipes"]
    unnamed.update(title=None, assigned_title="שם עריכה ייחודי", medium="handwritten",
                   source={"text": "שם משותף", "type": "person"}, needs_human_verification=True)
    original.update(title="כותרת מקור ייחודית", assigned_title="כינוי נוסף ייחודי", medium="clipping",
                    source={"text": "שם משותף", "type": "person"})
    no_name.update(title=None, source=None)
    no_name.pop("assigned_title", None)
    context = browser.new_context()
    context.route("**/data/recipes.json", lambda route: route.fulfill(json=fixture))
    fixture_page = context.new_page()
    fixture_page.on("pageerror", lambda error: errors.append(str(error)))
    fixture_page.goto(base)
    expect(fixture_page.locator("#grid .card")).to_have_count(3)
    fixture_page.locator("#f-source").select_option("person:שם משותף")
    expect(fixture_page.locator("#grid .card")).to_have_count(1)
    assert card_ids(fixture_page) == [unnamed["id"]]
    fixture_page.locator("#f-source").select_option("publication:שם משותף")
    expect(fixture_page.locator(f'#grid a[href="#/{original["id"]}"]')).to_have_count(1)
    assert card_ids(fixture_page) == [original["id"]]
    fixture_page.locator("#f-source").select_option("")
    fixture_page.locator("#q").fill(unnamed["assigned_title"])
    expect(fixture_page.locator("#grid h3")).to_have_text(unnamed["assigned_title"])
    expect(fixture_page.locator("#grid .tags")).to_contain_text("כותרת שניתנה למתכון")
    expect(fixture_page.locator("#grid .tags")).to_contain_text("דורש הגהה")
    fixture_page.locator("#grid .card a").click()
    expect(fixture_page.locator("#detail-view h2")).to_have_text(unnamed["assigned_title"])
    expect(fixture_page.locator(".text")).to_contain_text("אינה כותרת שתומללה מהמקור")
    expect(fixture_page.locator(".banner")).to_contain_text("הגהה אנושית")
    assert unnamed["assigned_title"] in fixture_page.title()
    report = parse_qs(urlparse(fixture_page.locator(".actions > a").get_attribute("href")).query)
    assert report["recipe_title"] == [unnamed["assigned_title"]]
    fixture_page.locator(".actions > button").click()
    expect(fixture_page.locator(".share-menu")).to_be_visible()
    shared_text = parse_qs(urlparse(fixture_page.get_by_text("WhatsApp", exact=True).get_attribute("href")).query)["text"][0]
    assert unnamed["assigned_title"] in shared_text and "אינה כותרת שתומללה מהמקור" in shared_text
    assert "אימות" not in fixture_page.locator("body").inner_text()
    fixture_page.locator(".back a").click()
    for query in (original["assigned_title"], original["title"]):
        fixture_page.locator("#q").fill(query)
        expect(fixture_page.locator("#grid h3")).to_have_text(original["title"])
    fixture_page.locator("#grid .card a").click()
    expect(fixture_page.locator("#detail-view h2")).to_have_text(original["title"])
    expect(fixture_page.locator(".text")).to_contain_text("כותרת נוספת לחיפוש: " + original["assigned_title"])
    fixture_page.locator(".back a").click()
    fixture_page.locator("#q").fill("")
    expect(fixture_page.locator(f'#grid a[href="#/{no_name["id"]}"] h3')).to_have_text("(ללא כותרת)")
    fixture_page.locator("#f-sort").select_option("title")
    expected = sorted([unnamed, original], key=lambda r: r["title"] or r["assigned_title"])
    expect(fixture_page.locator("#grid h3")).to_have_text([r["title"] or r["assigned_title"] for r in expected] + ["(ללא כותרת)"])
    assert card_ids(fixture_page) == [r["id"] for r in expected] + [no_name["id"]]
    context.close()
    assert not errors, errors
    page.close()
    print("PASS: source bylines and duplicate names; assigned/original/absent titles, search, sort, report and share")


if __name__ == "__main__":
    handler = functools.partial(QuietHandler, directory=str(ROOT))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
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
