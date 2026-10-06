/* Ilana's Recipes - static browse + search. No dependencies, no build step. */
(function () {
  "use strict";

  // ---- Hebrew-aware normalization -------------------------------------------------
  var FINAL = { "ך": "כ", "ם": "מ", "ן": "נ", "ף": "פ", "ץ": "צ" };
  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[֑-ׇ]/g, "")            // niqqud + cantillation
      .replace(/[ךםןףץ]/g, function (c) { return FINAL[c]; })
      .replace(/["'`´׳״“”‘’\[\]?]/g, "")          // quotes, geresh, our [?] marker
      .replace(/[-–—_/\\.,;:()]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  var PREFIX = /^[והבלמכש]/;

  var REPO = "YuvalWS/Ilanas-Recipes";
  var LEGAL_NOTICE_CLIPPING =
    "המתכון המצורף הוא גזיר עיתון מתוך אוסף המתכונים שסבתא אילנה ליקטה והכינה. " +
    "אם מקור העיתון ידוע לכם, נשמח שתדווחו לנו עליו. " +
    "פרסום המתכון נעשה במסגרת שימוש הוגן וללא כוונה לפגוע בזכויות היוצרים. " +
    "אם זכויותיכם נפגעו ואתם מעוניינים שנסיר את המתכון, ";

  function anyHas(t) {
    for (var i = 0; i < ALL.length; i++) {
      var f = ALL[i]._f;
      if (f.title.indexOf(t) >= 0 || f.source.indexOf(t) >= 0 || f.ing.indexOf(t) >= 0 ||
          f.ins.indexOf(t) >= 0 || f.notes.indexOf(t) >= 0 || f.batch.indexOf(t) >= 0) return true;
    }
    return false;
  }

  // Each query word becomes a list of alternatives. A Hebrew prefix letter (e.g. the ב of "בתפוזים")
  // is only stripped when the word as typed matches nothing at all, so words that really start
  // with ש/מ/כ/ה/ו/ל/ב are not widened by accident.
  function tokensOf(q) {
    var out = [];
    norm(q).split(" ").forEach(function (t) {
      if (!t) return;
      var alts = [t];
      if (t.length >= 4 && PREFIX.test(t) && !anyHas(t)) alts.push(t.slice(1));
      out.push(alts);
    });
    return out;
  }

  // ---- data -----------------------------------------------------------------------
  var DATA = null, BATCH = {}, ALL = [];
  var $ = function (id) { return document.getElementById(id); };

  // ---- favorites (this device only) and "הקלאסיים" (curated family list) ----------
  var FAV_KEY = "ilanas-recipes:favorites:v1";
  var FAVS = [], favStorageOk = true, CLASSICS = {};
  var onlyFavs = false, onlyClassics = false, onlySuggested = false;
  function loadFavs() {
    try {
      var v = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
      FAVS = Array.isArray(v) ? v.filter(function (x) { return typeof x === "string"; }) : [];
    } catch (e) { FAVS = []; favStorageOk = false; }
  }
  function saveFavs() {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(FAVS)); favStorageOk = true; }
    catch (e) { favStorageOk = false; toast("לא ניתן לשמור בדפדפן הזה (מצב פרטי?). המועדפים יישמרו רק בביקור הנוכחי."); }
  }
  function isFav(id) { return FAVS.indexOf(id) >= 0; }
  function validFavs() { return FAVS.filter(function (id) { return ALL.some(function (r) { return r.id === id; }); }); }
  function toggleFav(id) {
    if (isFav(id)) FAVS = FAVS.filter(function (x) { return x !== id; }); else FAVS.push(id);
    saveFavs();
    refreshFavUi();
  }
  function toast(msg) {
    var t = $("toast");
    if (!t) { t = el("div", "toast"); t.id = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.hidden = true; }, 4000);
  }
  function heartIcon() {                       // standard heart; filled via CSS when the recipe is a favorite
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("width", "20"); svg.setAttribute("height", "20");
    svg.setAttribute("aria-hidden", "true"); svg.setAttribute("class", "heart-icon");
    var p = document.createElementNS(NS, "path");
    p.setAttribute("d", "M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.7 5 6 5c2.1 0 3.4 1.2 4.2 2.4h3.6C14.6 6.2 15.9 5 18 5c3.3 0 5.1 3.4 3.6 6.8C19.5 16.4 12 21 12 21z");
    p.setAttribute("stroke", "currentColor"); p.setAttribute("stroke-width", "1.8"); p.setAttribute("stroke-linejoin", "round");
    svg.appendChild(p); return svg;
  }
  function heartButton(r, withLabel) {
    var b = el("button", "heart" + (withLabel ? " heart-wide" : ""));
    b.type = "button"; b.setAttribute("data-fav-id", r.id);
    b.appendChild(heartIcon());
    if (withLabel) b.appendChild(el("span", "heart-label"));
    b.addEventListener("click", function (ev) { ev.preventDefault(); ev.stopPropagation(); toggleFav(r.id); });
    syncHeart(b);
    return b;
  }
  function syncHeart(b) {
    var on = isFav(b.getAttribute("data-fav-id"));
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.setAttribute("aria-label", on ? "הסרה מהמועדפים" : "הוספה למועדפים");
    b.title = on ? "הסרה מהמועדפים" : "הוספה למועדפים";
    var l = b.querySelector(".heart-label"); if (l) l.textContent = on ? "במועדפים" : "הוספה למועדפים";
  }
  function refreshFavUi() { updateFavLabels(); if (onlyFavs && !$("list-view").hidden) renderList(); }   // a heart removed in the favorites view drops its card
  function updateFavLabels() {
    Array.prototype.forEach.call(document.querySelectorAll("button.heart"), syncHeart);
    var n = validFavs().length;
    $("t-favs").textContent = "♥ המועדפים שלי (" + n + ")";
    $("t-favs").setAttribute("aria-pressed", onlyFavs ? "true" : "false");
    var cn = Object.keys(CLASSICS).length;
    $("t-classics").hidden = !cn;
    $("t-classics").textContent = "★ הקלאסיים (" + cn + ")";
    $("t-classics").setAttribute("aria-pressed", onlyClassics ? "true" : "false");
    var sn = ALL.filter(isSuggestedTitle).length;
    $("t-suggested").hidden = !sn;
    $("t-suggested").textContent = "⚠ כותרת מוצעת (" + sn + ")";
    $("t-suggested").setAttribute("aria-pressed", onlySuggested ? "true" : "false");
    $("fav-share").disabled = !n;
  }
  function favLink() { return location.origin + location.pathname + "?addfavs=" + validFavs().join(","); }
  function parseFavIds(text) {
    var m = String(text || "").match(/b\d{2}-r\d{2,3}/g) || [];
    return m.filter(function (id, i) { return m.indexOf(id) === i && ALL.some(function (r) { return r.id === id; }); });
  }
  function offerImport(ids, fromUrl) {
    var fresh = ids.filter(function (id) { return !isFav(id); });
    var box = $("fav-banner"); box.textContent = ""; box.hidden = false;
    if (!ids.length) { box.appendChild(el("span", null, "לא נמצאו מתכונים תקינים ברשימה שהתקבלה.")); }
    else if (!fresh.length) { box.appendChild(el("span", null, "כל " + ids.length + " המתכונים שברשימה כבר במועדפים שלכם.")); }
    else {
      box.appendChild(el("span", null, "התקבלה רשימת מועדפים עם " + fresh.length + " מתכונים חדשים."));
      var add = el("button", "btn btn-small", "הוספה למועדפים"); add.type = "button";
      add.addEventListener("click", function () { fresh.forEach(function (id) { FAVS.push(id); }); saveFavs(); refreshFavUi(); box.hidden = true; toast("נוספו " + fresh.length + " מתכונים למועדפים"); });
      box.appendChild(add);
    }
    var skip = el("button", "btn btn-small", "סגירה"); skip.type = "button";
    skip.addEventListener("click", function () { box.hidden = true; });
    box.appendChild(skip);
    if (fromUrl) {                               // the link has done its job: drop the parameter
      var u = new URL(location.href); u.searchParams.delete("addfavs"); history.replaceState(null, "", u.href);
    }
  }
  function setupFavUi() {
    $("t-favs").addEventListener("click", function () { onlyFavs = !onlyFavs; writeFiltersToUrl("pushState"); refreshFavUi(); renderList(); });
    $("t-classics").addEventListener("click", function () { onlyClassics = !onlyClassics; writeFiltersToUrl("pushState"); refreshFavUi(); renderList(); });
    $("t-suggested").addEventListener("click", function () { onlySuggested = !onlySuggested; writeFiltersToUrl("pushState"); refreshFavUi(); renderList(); });
    $("fav-share").addEventListener("click", function () {
      var url = favLink(), text = "מועדפים מהמתכונים של אילנה (" + validFavs().length + " מתכונים)";
      if (navigator.share) navigator.share({ title: text, text: text, url: url }).catch(function () {});
      else if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () { toast("הקישור למועדפים הועתק"); }, function () { window.prompt("העתיקו את הקישור:", url); });
      else window.prompt("העתיקו את הקישור:", url);
    });
    $("fav-import").addEventListener("click", function () {
      var t = window.prompt("הדביקו כאן קישור מועדפים (או רשימת מזהי מתכונים):", "");
      if (t) offerImport(parseFavIds(t), false);
    });
  }

  fetch("data/recipes.json?v=" + (window.SITE_VERSION || Date.now()))
    .then(function (r) { return r.json(); })
    .then(function (d) {
      DATA = d;
      d.batches.forEach(function (b) { BATCH[b.batch] = b; });
      ALL = d.recipes.map(prepare);
      return fetch("data/classics.json?v=" + (window.SITE_VERSION || Date.now()))
        .then(function (r) { return r.ok ? r.json() : { ids: [] }; })
        .catch(function () { return { ids: [] }; })
        .then(function (c) {
          CLASSICS = {};
          (c.ids || []).forEach(function (id) { if (ALL.some(function (r) { return r.id === id; })) CLASSICS[id] = true; });
          loadFavs();
          fillFilters();
          setupFavUi();
          route();
          var add = new URLSearchParams(location.search).get("addfavs");
          if (add !== null) offerImport(parseFavIds(add), true);
        });
    })
    .catch(function (e) {
      $("count").textContent = "שגיאה בטעינת הנתונים (data/recipes.json): " + e;
    });

  // "מודפס" (printed) was merged into "גזירי עיתון" (newspaper clippings): old data/URLs still work.
  function mediumKey(r) { return r.medium === "printed" ? "clipping" : r.medium; }
  function srcText(r) { return r.source ? r.source.text : ""; }
  // Where a recipe stands on its source. "none-confirmed" = no source and the owner checked the card
  // (a proofread.source record exists); "none-unchecked" = no source recorded, nobody has confirmed it.
  function sourceStatus(r) {
    if (!r.source) return r.proofread && r.proofread.source ? "none-confirmed" : "none-unchecked";
    if (r.source.uncertain || /\[\?\]/.test(r.source.text || "")) return r.proofread && r.proofread.source ? "unsure-checked" : "unsure";
    return "known";
  }
  var SOURCE_STATUS = { "none-confirmed": "ללא מקור (אושר: אין מקור על הפתק)", "none-unchecked": "ללא מקור (טרם נבדק)", "unsure-checked": "מקור לא בטוח או לא קריא (נבדק: נשאר לא ודאי)", unsure: "מקור לא בטוח או לא קריא (טרם נבדק)" };
  // One source line can name several people (source.names): the filter lists the recipe under each of them.
  function srcNames(r) { return !r.source ? [] : (r.source.names && r.source.names.length ? r.source.names : (r.source.text ? [r.source.text] : [])); }
  function recipeTitle(r) { return r.title || r.assigned_title || "(ללא כותרת)"; }
  function usesAssignedTitle(r) { return !r.title && !!r.assigned_title; }
  // A title that is only a proposal (not written on the card and not yet approved by the owner).
  function isSuggestedTitle(r) { return usesAssignedTitle(r) && (r.assigned_title_status === "ai_suggested" || r.assigned_title_status === "owner_suggested"); }
  // How an assigned_title is described to readers (it is never the heading written on the card).
  function assignedKind(r) {
    var st = r.assigned_title_status;
    if (!r.assigned_title) return null;
    if (st === "ai_suggested") return { tag: "כותרת מוצעת", note: "כותרת מוצעת (הצעה אוטומטית, טרם אושרה): היא אינה כתובה על הפתק." };
    if (st === "owner_suggested") return { tag: "כותרת מוצעת", note: "כותרת מוצעת על ידי בעל האתר: היא אינה כתובה על הפתק." };
    return { tag: "כותרת שניתנה למתכון", note: "כותרת שניתנה למתכון לצורך חיפוש; אינה כותרת שתומללה מהמקור." };
  }
  function sourceGroup(r) {
    if (!r.source) return "person";                       // recipes without a source never reach the source filter
    // A clipping's byline can have type "person"; it is still a publication writer.
    // Chefs (source.role === "chef") are people but professional sources: they sit with the publication writers.
    return r.source.type === "publication" || r.source.type === "company" || r.source.role === "chef" ||
      r.medium === "clipping" || r.medium === "printed" ? "publication" : "person";
  }
  function prepare(r) {
    r._f = {
      title: norm((r.title || "") + " " + (r.assigned_title || "")),
      source: norm(srcText(r) + " " + (r.source && r.source.as_written || "")),
      ing: norm(r.ingredients_text),
      ins: norm(r.instructions_text),
      notes: norm((r.notes || []).concat(r.incidental_text || []).join(" ")),
      batch: norm(batchTitle(r.batch))
    };
    return r;
  }
  function batchTitle(n) {
    var b = BATCH[n];
    return "אוסף " + n + (b && b.title ? " - " + b.title : "");
  }

  // ---- per-field proofreading (r.proofread) -----------------------------------------
  var PF_NAMES = { title: "כותרת", assigned_title: "כותרת מוצעת", source: "מקור", medium: "סוג", ingredients: "מרכיבים",
    instructions: "אופן הכנה", notes: "הערות", incidental_text: "טקסט נלווה", raw_files: "סריקה", card: "קישור בין מתכונים" };
  function pfInfo(r, f) {
    var p = r.proofread && r.proofread[f];
    if (!p) return null;
    return "הוגה על ידי " + p.by + " · " + p.date + (p.via ? " · " + p.via : "") + (p.scope ? " · " + p.scope : "");
  }
  function pfBadge(r, f) {
    var t = pfInfo(r, f);
    if (!t) return null;
    var b = el("span", "pf", "✓ הוגה"); b.title = t; return b;
  }
  function pfFields(r) { return Object.keys(r.proofread || {}).filter(function (f) { return PF_NAMES[f]; }); }

  // ---- search ---------------------------------------------------------------------
  function score(r, toks) {
    var total = 0;
    for (var i = 0; i < toks.length; i++) {
      var best = 0;
      for (var j = 0; j < toks[i].length; j++) {
        var t = toks[i][j], s = 0;
        if (r._f.title.indexOf(t) >= 0) s = Math.max(s, 10);
        if (r._f.source.indexOf(t) >= 0) s = Math.max(s, 6);
        if (r._f.ing.indexOf(t) >= 0) s = Math.max(s, 4);
        if (r._f.batch.indexOf(t) >= 0) s = Math.max(s, 3);
        if (r._f.ins.indexOf(t) >= 0) s = Math.max(s, 2);
        if (r._f.notes.indexOf(t) >= 0) s = Math.max(s, 1);
        if (s > best) best = s;
      }
      if (!best) return 0;            // every word must match somewhere
      total += best;
    }
    return total || 1;
  }

  function fillFilters() {
    var fb = $("f-batch");
    DATA.batches.forEach(function (b) {
      var o = document.createElement("option");
      o.value = b.batch; o.textContent = batchTitle(b.batch);
      fb.appendChild(o);
    });
    var seen = { person: new Map(), publication: new Map() };
    ALL.forEach(function (r) {
      if (!r.source) return;                                // many recipes have no source
      var group = seen[sourceGroup(r)];
      srcNames(r).forEach(function (s) { group.set(s, (group.get(s) || 0) + 1); });
    });
    var fs = $("f-source");
    var counts = {};
    ALL.forEach(function (r) { var st = sourceStatus(r); counts[st] = (counts[st] || 0) + 1; });
    var sg = document.createElement("optgroup");
    sg.label = "מצב המקור";
    Object.keys(SOURCE_STATUS).forEach(function (st) {
      if (!counts[st]) return;
      var o = document.createElement("option");
      o.value = "status:" + st; o.textContent = SOURCE_STATUS[st] + " (" + counts[st] + ")";
      sg.appendChild(o);
    });
    if (sg.children.length) fs.appendChild(sg);
    ["person", "publication"].forEach(function (category) {
      if (!seen[category].size) return;
      var group = document.createElement("optgroup");
      group.label = category === "person" ? "אנשים" : "שפים, כותבים ומקורות בפרסומים";
      Array.from(seen[category].keys()).sort(function (a, b) { return a.localeCompare(b, "he"); }).forEach(function (s) {
        var o = document.createElement("option");
        // Include the category: one name may occur in both handwritten and printed recipes.
        o.value = category + ":" + s; o.textContent = s + " (" + seen[category].get(s) + ")";
        group.appendChild(o);
      });
      fs.appendChild(group);
    });
    $("clear-filters").addEventListener("click", function () {
      Object.keys(FILTER_PARAMS).forEach(function (id) { $(id).value = id === "f-sort" ? "rel" : ""; });
      onlyFavs = false; onlyClassics = false; onlySuggested = false;
      writeFiltersToUrl("pushState"); refreshFavUi();
      renderList();
    });
    ["q", "f-batch", "f-medium", "f-source", "f-verify", "f-sort"].forEach(function (id) {
      $(id).addEventListener(id === "q" ? "input" : "change", function () {
        writeFiltersToUrl(id === "q" ? "replaceState" : "pushState");
        renderList();
      });
    });
  }

  // Search parameters work on static hosts; recipe navigation remains in the hash.
  var FILTER_PARAMS = { q: "q", "f-batch": "batch", "f-medium": "medium",
    "f-source": "source", "f-verify": "proofreading", "f-sort": "sort" };
  function readFiltersFromUrl() {
    var params = new URLSearchParams(location.search);
    onlyFavs = params.get("favs") === "1"; onlyClassics = params.get("classics") === "1"; onlySuggested = params.get("suggested") === "1";
    Object.keys(FILTER_PARAMS).forEach(function (id) {
      var control = $(id), fallback = id === "f-sort" ? "rel" : "";
      var value = params.get(FILTER_PARAMS[id]);
      if (id === "f-medium" && value === "printed") value = "clipping";   // old shared links
      control.value = value === null ? fallback : value;
      // Unknown select values must not silently turn the result list empty.
      if (control.tagName === "SELECT" && control.selectedIndex < 0) control.value = fallback;
    });
  }
  function writeFiltersToUrl(method) {
    var url = new URL(location.href);
    Object.keys(FILTER_PARAMS).forEach(function (id) {
      var value = $(id).value, param = FILTER_PARAMS[id];
      if (!value || (id === "f-sort" && value === "rel")) url.searchParams.delete(param);
      else url.searchParams.set(param, value);
    });
    if (onlyFavs) url.searchParams.set("favs", "1"); else url.searchParams.delete("favs");
    if (onlyClassics) url.searchParams.set("classics", "1"); else url.searchParams.delete("classics");
    if (onlySuggested) url.searchParams.set("suggested", "1"); else url.searchParams.delete("suggested");
    if (url.href !== location.href) history[method](null, "", url.href);
  }

  function currentResults() {
    var toks = tokensOf($("q").value);
    var fb = $("f-batch").value, fm = $("f-medium").value, fsrc = $("f-source").value, fv = $("f-verify").value;
    var rows = [];
    ALL.forEach(function (r) {
      if (onlyFavs && !isFav(r.id)) return;
      if (onlyClassics && !CLASSICS[r.id]) return;
      if (onlySuggested && !isSuggestedTitle(r)) return;
      if (fb && String(r.batch) !== fb) return;
      if (fm && mediumKey(r) !== fm) return;
      if (fsrc && fsrc.indexOf("status:") === 0) { if ("status:" + sourceStatus(r) !== fsrc) return; }
      else if (fsrc && (!r.source || srcNames(r).map(function (nm) { return sourceGroup(r) + ":" + nm; }).indexOf(fsrc) < 0)) return;
      if (fv === "need" && !r.needs_human_verification) return;
      if (fv === "ok" && r.needs_human_verification) return;
      var s = toks.length ? score(r, toks) : 1;
      if (!s) return;
      rows.push({ r: r, s: s });
    });
    var sort = $("f-sort").value;
    if (sort === "title") rows.sort(function (a, b) {
      var at = a.r.title || a.r.assigned_title, bt = b.r.title || b.r.assigned_title;
      if (!at || !bt) return at ? -1 : bt ? 1 : a.r.id.localeCompare(b.r.id);
      return at.localeCompare(bt, "he");
    });
    else if (toks.length) rows.sort(function (a, b) { return b.s - a.s || (a.r.id < b.r.id ? -1 : 1); });
    return rows;
  }

  // ---- list view ------------------------------------------------------------------
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function filtersActive() {
    return onlyFavs || onlyClassics || onlySuggested || Object.keys(FILTER_PARAMS).some(function (id) { return $(id).value && !(id === "f-sort" && $(id).value === "rel"); });
  }
  function renderList() {
    $("clear-filters").disabled = !filtersActive();
    var rows = currentResults();
    var grid = $("grid");
    grid.textContent = "";
    $("count").textContent = rows.length + " מתכונים" + (rows.length !== ALL.length ? " (מתוך " + ALL.length + ")" : "");
    if (!rows.length && onlyFavs && !validFavs().length) grid.appendChild(el("li", "empty", "עדיין אין מועדפים. לחצו על הלב ♥ בתמונת מתכון כדי להוסיף."));
    rows.forEach(function (x) {
      var r = x.r;
      var li = el("li", "card");
      var a = el("a"); a.href = "#/" + r.id;
      var img = el("img"); img.loading = "lazy"; img.src = r.thumb; img.alt = "סריקה: " + recipeTitle(r);
      a.appendChild(img);
      var body = el("div", "card-body");
      body.appendChild(el("h3", null, recipeTitle(r)));
      var meta = el("p", "meta", (srcText(r) ? srcText(r) + " · " : "") + mediumLabel(r.medium));
      body.appendChild(meta);
      var tags = el("p", "tags");
      tags.appendChild(el("span", "tag", batchTitle(r.batch).replace(" - ", " · ")));
      if (CLASSICS[r.id]) tags.appendChild(el("span", "tag classic", "★ קלאסי"));
      if (r.card) tags.appendChild(el("span", "tag", "1 מתוך " + r.card.recipes.length + " באותו " + CARD_KIND[r.card.kind].one));
      if (usesAssignedTitle(r)) tags.appendChild(el("span", isSuggestedTitle(r) ? "tag warn" : "tag", (isSuggestedTitle(r) ? "⚠ " : "") + assignedKind(r).tag));
      if (pfFields(r).length) { var pt = el("span", "tag ok", "✓ הוגה: " + pfFields(r).map(function (f) { return PF_NAMES[f]; }).join(", ")); tags.appendChild(pt); }
      if (r.needs_human_verification) tags.appendChild(el("span", "tag warn", "דורש הגהה"));
      body.appendChild(tags);
      a.appendChild(body);
      li.appendChild(a);
      li.appendChild(heartButton(r, false));
      grid.appendChild(li);
    });
  }
  var CARD_KIND = {
    handwritten_note: { one: "פתק", full: "פתק בכתב יד" },
    clipping: { one: "גזיר", full: "גזיר עיתון" },
    printed_sheet: { one: "דף", full: "דף מודפס" },
    other: { one: "פריט", full: "פריט" }
  };
  function mediumLabel(m) {
    return { handwritten: "כתב יד", clipping: "גזיר עיתון", printed: "גזיר עיתון", mixed: "מעורב" }[m] || m;
  }

  // ---- share + report a mistake ---------------------------------------------------
  function qs(o) {
    return Object.keys(o).map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(o[k]); }).join("&");
  }
  function pageUrl(r) { return location.origin + location.pathname + location.search + "#/" + r.id; }
  function absUrl(p) { return new URL(p, location.href).href; }
  function plainText(r) {
    var out = [recipeTitle(r)];
    if (usesAssignedTitle(r)) out.push(assignedKind(r).note);
    else if (r.assigned_title) out.push("כינוי / כותרת נוספת לחיפוש: " + r.assigned_title);
    if (r.source) out.push("מקור: " + r.source.text);
    if (r.ingredients.length) {
      out.push("", "מרכיבים:");
      r.ingredients.forEach(function (g) { if (g.group) out.push(g.group + ":"); g.items.forEach(function (i) { out.push("- " + i); }); });
    }
    if (r.instructions.length) {
      out.push("", "אופן הכנה:");
      r.instructions.forEach(function (g) { if (g.group) out.push(g.group + ":"); g.steps.forEach(function (x) { out.push(x); }); });
    }
    return out.join("\n");
  }
  function reportUrl(r) {
    var text = plainText(r), url;
    do {                                   // GitHub rejects very long URLs: shorten the prefilled transcription
      url = "https://github.com/" + REPO + "/issues/new?" + qs({
        template: "recipe-mistake.yml",
        title: "[טעות במתכון] " + r.id + (r.title || r.assigned_title ? " " + recipeTitle(r) : ""),
        recipe_id: r.id, recipe_title: r.title || r.assigned_title || "", page_url: pageUrl(r),
        scan_url: r.images[0] ? absUrl(r.images[0]) : "", current_text: text
      });
      if (url.length <= 7000 || text.length < 40) break;
      text = text.slice(0, Math.floor(text.length * 0.8)) + "…";
    } while (true);
    return url;
  }
  function reportLink(r) {
    var box = el("div", "actions");
    var report = el("a", "btn", "⚠ דווחו על טעות במתכון");
    report.href = reportUrl(r); report.target = "_blank"; report.rel = "noopener";
    box.appendChild(report);
    return box;
  }
  function shareIcon() {                  // the usual share glyph: three nodes joined by two lines
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("width", "18"); svg.setAttribute("height", "18");
    svg.setAttribute("aria-hidden", "true"); svg.setAttribute("class", "share-icon");
    [["line", { x1: 8.3, y1: 10.9, x2: 15.7, y2: 6.6 }], ["line", { x1: 8.3, y1: 13.1, x2: 15.7, y2: 17.4 }],
     ["circle", { cx: 18, cy: 5.5, r: 3 }], ["circle", { cx: 6, cy: 12, r: 3 }], ["circle", { cx: 18, cy: 18.5, r: 3 }]].forEach(function (x) {
      var n = document.createElementNS(NS, x[0]);
      Object.keys(x[1]).forEach(function (k) { n.setAttribute(k, x[1][k]); });
      if (x[0] === "line") { n.setAttribute("stroke", "currentColor"); n.setAttribute("stroke-width", "1.8"); n.setAttribute("stroke-linecap", "round"); }
      else n.setAttribute("fill", "currentColor");
      svg.appendChild(n);
    });
    return svg;
  }
  function shareBox(r) {
    var box = el("div", "sharebox");
    var share = el("button", "btn btn-share");
    share.appendChild(shareIcon());
    share.appendChild(document.createTextNode(" שיתוף"));
    share.type = "button";
    var menu = el("div", "share-menu"); menu.hidden = true;
    var url = pageUrl(r), text = plainText(r), title = (r.title || r.assigned_title || r.id) + " · המתכונים של אילנה";
    function link(label, href) { var a = el("a", null, label); a.href = href; a.target = "_blank"; a.rel = "noopener"; menu.appendChild(a); }
    link("WhatsApp", "https://wa.me/?" + qs({ text: text + "\n\n" + url }));
    link("Telegram", "https://t.me/share/url?" + qs({ url: url, text: text }));
    link("אימייל", "mailto:?" + qs({ subject: title, body: text + "\n\n" + url }).replace(/\+/g, "%20"));
    var copy = el("button", null, "העתקת קישור"); copy.type = "button";
    copy.addEventListener("click", function () {
      var done = function () { copy.textContent = "הקישור הועתק ✓"; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { window.prompt("העתיקו את הקישור:", url); });
      else window.prompt("העתיקו את הקישור:", url);
    });
    menu.appendChild(copy);
    share.addEventListener("click", function () {
      if (navigator.share) {               // native share dialog (phones, Safari, Edge, ...)
        navigator.share({ title: title, text: text, url: url }).catch(function () {});
      } else {
        menu.hidden = !menu.hidden;        // desktop browsers without the Web Share API
      }
    });
    box.appendChild(share); box.appendChild(menu);
    return box;
  }

  // ---- several recipes on one physical item (note / newspaper page) ----------------
  function cardBox(r) {
    var k = CARD_KIND[r.card.kind] || CARD_KIND.other;
    var box = el("aside", "cardbox");
    box.appendChild(el("p", "cardbox-h", "מתכון זה הוא אחד מ-" + r.card.recipes.length + " מתכונים על אותו " + k.one + " (" + k.full + ")"));
    if (r.card.position) box.appendChild(el("p", "muted", "מיקום ב" + k.one + ": " + r.card.position));
    box.appendChild(el("p", "muted", "אם משהו נראה חסר, בדקו גם את המתכונים האחרים על אותו " + k.one + ":"));
    var ul = el("ul");
    r.card.recipes.forEach(function (id) {
      var li = el("li");
      var o = ALL.filter(function (x) { return x.id === id; })[0];
      if (id === r.id) li.appendChild(el("strong", null, (o ? recipeTitle(o) : "(ללא כותרת)") + " (המתכון הנוכחי)"));
      else if (o) { var a = el("a", null, recipeTitle(o)); a.href = "#/" + id; li.appendChild(a); }
      else li.appendChild(document.createTextNode(id + " (עדיין לא פורסם באתר)"));
      ul.appendChild(li);
    });
    box.appendChild(ul);
    if (r.card.note) box.appendChild(el("p", "muted", r.card.note));
    return box;
  }

  // ---- detail view ----------------------------------------------------------------
  // Glossary hints: a term that appears in recipe text gets a tooltip (hover on a computer, tap on a phone).
  // To add a hint for all current and future recipes, add one entry here (and see AGENTS.md).
  var GLOSSARY = [
    { term: "קמח אוסם", hint: "קמח אוסם - ככל הנראה הכוונה לקמח תופח" }
  ];
  function reEscape(t) { return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  var MARK_RE = new RegExp("(\\[\\?\\]|" + GLOSSARY.map(function (g) { return reEscape(g.term); }).join("|") + ")");
  function glossaryHint(term) { for (var i = 0; i < GLOSSARY.length; i++) if (GLOSSARY[i].term === term) return GLOSSARY[i].hint; return null; }

  function withMarks(text) {
    // highlight the [?] marker used for unreadable words; add tooltips to glossary terms
    var frag = document.createDocumentFragment();
    String(text).split(MARK_RE).forEach(function (part) {
      if (part === "[?]") { var m = el("mark", "q", "[?]"); m.title = "מילה שלא נקראה"; frag.appendChild(m); }
      else if (part && glossaryHint(part)) {
        var h = el("span", "hint", part); h.tabIndex = 0; h.setAttribute("role", "button"); h.setAttribute("data-hint", glossaryHint(part));
        frag.appendChild(h);
      }
      else if (part) frag.appendChild(document.createTextNode(part));
    });
    return frag;
  }

  // One shared tooltip bubble: hover/focus on a computer, tap (click) on a phone.
  (function () {
    var pop = null, pinned = null;
    function ensure() { if (!pop) { pop = el("div", "hint-pop"); pop.id = "hint-pop"; pop.setAttribute("role", "tooltip"); pop.hidden = true; document.body.appendChild(pop); } return pop; }
    function show(t) {
      var p = ensure(); p.textContent = t.getAttribute("data-hint"); p.hidden = false;
      var b = t.getBoundingClientRect(), w = p.offsetWidth, left = b.left + b.width / 2 - w / 2;
      left = Math.max(8, Math.min(left, document.documentElement.clientWidth - w - 8));
      var top = b.top - p.offsetHeight - 8; if (top < 8) top = b.bottom + 8;
      p.style.left = (left + window.pageXOffset) + "px"; p.style.top = (top + window.pageYOffset) + "px";
    }
    function hide() { if (pop) pop.hidden = true; pinned = null; }
    function hintOf(e) { return e.target.closest ? e.target.closest(".hint") : null; }
    document.addEventListener("mouseover", function (e) { var t = hintOf(e); if (t && !pinned) show(t); });
    document.addEventListener("mouseout", function (e) { var t = hintOf(e); if (t && !pinned) hide(); });
    document.addEventListener("focusin", function (e) { var t = hintOf(e); if (t) show(t); });
    document.addEventListener("focusout", function (e) { if (hintOf(e) && !pinned) hide(); });
    document.addEventListener("click", function (e) {
      var t = hintOf(e);
      if (t) { if (pinned === t) hide(); else { show(t); pinned = t; } } else hide();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") hide(); });
    window.addEventListener("hashchange", hide);
  })();

  // Frames (raw_files[].regions, fractions of the scan) around each recipe of a multi-recipe sheet or clipping.
  function sceneFrames(r, rf) {
    var out = [];
    function add(rec, regions, mine) {
      regions.forEach(function (g, k) {
        var d = el("div", "frame" + (mine ? " mine" : " other"));
        d.style.left = (g.x * 100) + "%"; d.style.top = (g.y * 100) + "%"; d.style.width = (g.w * 100) + "%"; d.style.height = (g.h * 100) + "%";
        if (k === 0) d.appendChild(el("span", "frame-label", mine ? "המתכון הזה" : recipeTitle(rec)));
        d.setAttribute("data-recipe", rec.id); out.push(d);
      });
    }
    if (!r.card || !(rf.regions || []).length) return out;
    ALL.forEach(function (o) {
      if (o.id === r.id || r.card.recipes.indexOf(o.id) < 0) return;
      (o.raw_files || []).forEach(function (of) { if (of.original_path === rf.original_path && (of.regions || []).length) add(o, of.regions, false); });
    });
    add(r, rf.regions, true);
    return out;
  }

  function renderDetail(id) {
    var r = ALL.filter(function (x) { return x.id === id; })[0];
    var v = $("detail-view");
    $("list-view").hidden = true; v.hidden = false; v.textContent = "";
    if (!r) { v.appendChild(el("p", null, "המתכון לא נמצא.")); return; }
    document.title = (r.title || r.assigned_title || r.id) + " · המתכונים של אילנה";

    var nav = el("p", "back"); var back = el("a", null, "← חזרה לרשימה"); back.href = "#/"; nav.appendChild(back); v.appendChild(nav);

    var wrap = el("div", "detail");
    // scans (always shown next to the text so the transcription can be checked)
    var scans = el("div", "scans");
    r.images.forEach(function (src, i) {
      var f = r.raw_files[i];
      var fig = el("figure");
      var a = el("a"); a.href = src; a.target = "_blank"; a.rel = "noopener";
      var img = el("img"); img.src = src; img.alt = "סריקה " + (i + 1);
      a.appendChild(img);
      var frames = sceneFrames(r, f);                       // several recipes on one sheet/clipping: frame each recipe
      if (frames.length) { var box = el("div", "scanbox"); box.appendChild(a); frames.forEach(function (fr) { box.appendChild(fr); }); fig.appendChild(box); }
      else fig.appendChild(a);
      var cap = {single: "", front: "צד קדמי", back: "צד אחורי", unknown: ""}[f.side] || "";
      if (cap) fig.appendChild(el("figcaption", null, cap));
      if (frames.length) fig.appendChild(el("figcaption", "frames-note", "המסגרת הצבעונית מסמנת היכן המתכון הזה בדף; מסגרות מקווקוות הן מתכונים אחרים על אותו דף (המסגרות משוערות)."));
      scans.appendChild(fig);
    });
    wrap.appendChild(scans);

    var txt = el("div", "text");
    var tbar = el("div", "titlebar");
    var tw = el("div", "titlewrap");
    tw.appendChild(el("h2", null, recipeTitle(r)));
    var tb = pfBadge(r, "title") || pfBadge(r, "assigned_title"); if (tb) tw.appendChild(tb);
    if (CLASSICS[r.id]) { var cb = el("span", "tag classic", "★ מהקלאסיים"); cb.title = "מתכון שנבחר לרשימת הקלאסיים של המשפחה"; tw.appendChild(cb); }
    tbar.appendChild(tw);
    var acts = el("div", "title-actions");
    acts.appendChild(heartButton(r, true));
    acts.appendChild(shareBox(r));
    tbar.appendChild(acts);
    txt.appendChild(tbar);
    if (isSuggestedTitle(r)) txt.appendChild(el("p", "banner warn suggested-warning", "⚠ שימו לב: הכותרת שמוצגת כאן היא הצעה בלבד (טרם אושרה): אינה כתובה על הפתק. " + (r.assigned_title_basis ? "בסיס ההצעה: " + r.assigned_title_basis + ". " : "") + "בדקו מול הסריקה."));
    else if (usesAssignedTitle(r)) txt.appendChild(el("p", "muted", assignedKind(r).note));
    else if (r.assigned_title) txt.appendChild(el("p", "muted", "כינוי / כותרת נוספת לחיפוש: " + r.assigned_title));
    if (r.needs_human_verification) {
      var warn = el("p", "banner warn", "תמלול זה דורש הגהה אנושית. השוו מול הסריקה. רמת ביטחון: " + ({high: "גבוהה", medium: "בינונית", low: "נמוכה"}[r.confidence] || r.confidence));
      txt.appendChild(warn);
    }
    if (pfFields(r).length) {
      var pbox = el("p", "banner ok", "חלקים שהוגהו בידי אדם: " + pfFields(r).map(function (f) { return PF_NAMES[f] + (r.proofread[f].scope ? " (" + r.proofread[f].scope + ")" : ""); }).join(" · ") + ". שאר השדות עדיין לא הוגהו.");
      pbox.title = pfFields(r).map(function (f) { return PF_NAMES[f] + ": " + pfInfo(r, f); }).join("\n");
      txt.appendChild(pbox);
    }
    var facts = el("p", "meta");
    var bits = [];
    if (r.source) bits.push("מקור: " + r.source.text + (r.source.uncertain ? " (לא בטוח)" : ""));
    bits.push(mediumLabel(r.medium));
    bits.push(batchTitle(r.batch));
    facts.textContent = bits.join(" · ");
    var sb = pfBadge(r, "source"); if (sb) { facts.appendChild(document.createTextNode(" ")); facts.appendChild(sb); }
    txt.appendChild(facts);

    if (r.card) txt.appendChild(cardBox(r));

    if (r.ingredients.length) {
      var hi = el("h3", null, "מרכיבים"); var bi = pfBadge(r, "ingredients"); if (bi) { hi.appendChild(document.createTextNode(" ")); hi.appendChild(bi); } txt.appendChild(hi);
      r.ingredients.forEach(function (g) {
        if (g.group) txt.appendChild(el("h4", null, g.group));
        var ul = el("ul");
        g.items.forEach(function (i) { var li = el("li"); li.appendChild(withMarks(i)); ul.appendChild(li); });
        txt.appendChild(ul);
      });
    }
    if (r.instructions.length) {
      var hs = el("h3", null, "אופן הכנה"); var bs = pfBadge(r, "instructions"); if (bs) { hs.appendChild(document.createTextNode(" ")); hs.appendChild(bs); } txt.appendChild(hs);
      r.instructions.forEach(function (g) {
        if (g.group) txt.appendChild(el("h4", null, g.group));
        var ol = el("ol");
        g.steps.forEach(function (s) { var li = el("li"); li.appendChild(withMarks(s)); ol.appendChild(li); });
        txt.appendChild(ol);
      });
    }
    if (!r.ingredients.length && !r.instructions.length) txt.appendChild(el("p", "muted", "לא תומלל תוכן (ראו סריקה)."));
    txt.appendChild(reportLink(r));      // right under the transcription
    if (r.notes.length) {
      var nd = el("details", "notes");     // collapsed by default
      nd.appendChild(el("summary", null, "הערות (" + r.notes.length + ")"));
      var nl = el("ul"); r.notes.forEach(function (n) { var li = el("li"); li.appendChild(withMarks(n)); nl.appendChild(li); });
      nd.appendChild(nl); txt.appendChild(nd);
    }
    if (r.incidental_text.length) {
      txt.appendChild(el("h3", null, "טקסט נלווה (לא חלק מהמתכון)"));
      var il = el("ul", "muted"); r.incidental_text.forEach(function (n) { il.appendChild(el("li", null, n)); }); txt.appendChild(il);
    }
    if (r.uncertainties.length) {
      var det = el("details", "uncertain");
      det.appendChild(el("summary", null, "נקודות לא ודאיות (" + r.uncertainties.length + ")"));
      var ul = el("ul");
      r.uncertainties.forEach(function (u) {
        var li = el("li");
        var s = u.field + ": " + u.reason;
        if (u.best_guess) s += " · ניחוש (לא ודאי): " + u.best_guess;
        li.textContent = s; ul.appendChild(li);
      });
      det.appendChild(ul); txt.appendChild(det);
    }
    if (mediumKey(r) === "clipping") {
      var legal = el("p", "legal", LEGAL_NOTICE_CLIPPING);
      var la = el("a", null, "פנו אלינו");
      la.href = "https://github.com/" + REPO + "/issues/new?" + qs({ title: "בקשת הסרה: " + r.id, body: "מתכון: " + pageUrl(r) + "\n\nסיבת הבקשה:\n" });
      la.target = "_blank"; la.rel = "noopener";
      legal.appendChild(la); legal.appendChild(document.createTextNode("."));
      txt.appendChild(legal);
    }
    txt.appendChild(el("p", "muted id", r.id + " · " + r.path));
    wrap.appendChild(txt);
    v.appendChild(wrap);
    window.scrollTo(0, 0);
  }

  // ---- routing --------------------------------------------------------------------
  // ---- "סיפורים מהאוסף": anecdotes from data/story.json (text = the owner's own words) ---------------
  function renderStory() {
    var v = $("story-view");
    $("list-view").hidden = true; $("detail-view").hidden = true; v.hidden = false; v.textContent = "";
    document.title = "סיפורים מהאוסף · המתכונים של אילנה";
    var nav = el("p", "back"); var back = el("a", null, "← חזרה לרשימה"); back.href = "#/"; nav.appendChild(back); v.appendChild(nav);
    v.appendChild(el("h2", null, "סיפורים מהאוסף"));
    var box = el("div", "stories"); v.appendChild(box);
    fetch("data/story.json?v=" + (window.SITE_VERSION || Date.now()))
      .then(function (r) { return r.ok ? r.json() : { items: [] }; })
      .catch(function () { return { items: [] }; })
      .then(function (d) {
        if (!(d.items || []).length) { box.appendChild(el("p", "muted", "אין עדיין סיפורים.")); return; }
        d.items.forEach(function (it) {
          var f = el("figure", "story");
          if (it.image) { var img = el("img"); img.src = it.image; img.alt = it.image_alt || ""; img.loading = "lazy"; f.appendChild(img); }
          var body = el("div", "story-body");
          body.appendChild(el("h3", null, it.title || ""));
          body.appendChild(el("p", "story-text", it.text || ""));
          if (it.caption) body.appendChild(el("p", "muted story-caption", it.caption));
          f.appendChild(body); box.appendChild(f);
        });
      });
  }

  function route() {
    if (!DATA) return;
    readFiltersFromUrl();
    updateFavLabels();
    var m = location.hash.match(/^#\/(b\d+-r\d+)$/);
    $("story-view").hidden = true;
    if (location.hash === "#/story") return renderStory();
    if (m) return renderDetail(m[1]);
    document.title = "המתכונים של אילנה";
    $("detail-view").hidden = true; $("list-view").hidden = false;
    renderList();
  }
  window.addEventListener("hashchange", route);
  window.addEventListener("popstate", route);
})();
