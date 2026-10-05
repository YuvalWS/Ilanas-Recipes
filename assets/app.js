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

  fetch("data/recipes.json")
    .then(function (r) { return r.json(); })
    .then(function (d) {
      DATA = d;
      d.batches.forEach(function (b) { BATCH[b.batch] = b; });
      ALL = d.recipes.map(prepare);
      fillFilters();
      route();
    })
    .catch(function (e) {
      $("count").textContent = "שגיאה בטעינת הנתונים (data/recipes.json): " + e;
    });

  function srcText(r) { return r.source ? r.source.text : ""; }
  function recipeTitle(r) { return r.title || r.assigned_title || "(ללא כותרת)"; }
  function usesAssignedTitle(r) { return !r.title && !!r.assigned_title; }
  function sourceGroup(r) {
    // A clipping's byline can have type "person"; it is still a publication writer.
    return r.source.type === "publication" || r.source.type === "company" ||
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
    return "אצווה " + n + (b && b.title ? " - " + b.title : "");
  }

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
      var s = srcText(r);
      if (!s) return;
      var group = seen[sourceGroup(r)];
      group.set(s, (group.get(s) || 0) + 1);
    });
    var fs = $("f-source");
    ["person", "publication"].forEach(function (category) {
      if (!seen[category].size) return;
      var group = document.createElement("optgroup");
      group.label = category === "person" ? "אנשים" : "כותבים ומקורות בפרסומים";
      Array.from(seen[category].keys()).sort(function (a, b) { return a.localeCompare(b, "he"); }).forEach(function (s) {
        var o = document.createElement("option");
        // Include the category: one name may occur in both handwritten and printed recipes.
        o.value = category + ":" + s; o.textContent = s + " (" + seen[category].get(s) + ")";
        group.appendChild(o);
      });
      fs.appendChild(group);
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
    Object.keys(FILTER_PARAMS).forEach(function (id) {
      var control = $(id), fallback = id === "f-sort" ? "rel" : "";
      var value = params.get(FILTER_PARAMS[id]);
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
    if (url.href !== location.href) history[method](null, "", url.href);
  }

  function currentResults() {
    var toks = tokensOf($("q").value);
    var fb = $("f-batch").value, fm = $("f-medium").value, fsrc = $("f-source").value, fv = $("f-verify").value;
    var rows = [];
    ALL.forEach(function (r) {
      if (fb && String(r.batch) !== fb) return;
      if (fm && r.medium !== fm) return;
      if (fsrc && (!r.source || sourceGroup(r) + ":" + srcText(r) !== fsrc)) return;
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

  function renderList() {
    var rows = currentResults();
    var grid = $("grid");
    grid.textContent = "";
    $("count").textContent = rows.length + " מתכונים" + (rows.length !== ALL.length ? " (מתוך " + ALL.length + ")" : "");
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
      tags.appendChild(el("span", "tag", "אצווה " + r.batch));
      if (usesAssignedTitle(r)) tags.appendChild(el("span", "tag", "כותרת שניתנה למתכון"));
      if (r.needs_human_verification) tags.appendChild(el("span", "tag warn", "דורש הגהה"));
      body.appendChild(tags);
      a.appendChild(body);
      li.appendChild(a);
      grid.appendChild(li);
    });
  }
  function mediumLabel(m) {
    return { handwritten: "כתב יד", clipping: "גזיר", printed: "מודפס", mixed: "מעורב" }[m] || m;
  }

  // ---- share + report a mistake ---------------------------------------------------
  function qs(o) {
    return Object.keys(o).map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(o[k]); }).join("&");
  }
  function pageUrl(r) { return location.origin + location.pathname + location.search + "#/" + r.id; }
  function absUrl(p) { return new URL(p, location.href).href; }
  function plainText(r) {
    var out = [recipeTitle(r)];
    if (usesAssignedTitle(r)) out.push("כותרת שניתנה למתכון לצורך חיפוש; אינה כותרת שתומללה מהמקור.");
    else if (r.assigned_title) out.push("כותרת נוספת לחיפוש: " + r.assigned_title);
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
  function actions(r) {
    var box = el("div", "actions");
    var report = el("a", "btn", "⚠ דווחו על טעות במתכון");
    report.href = reportUrl(r); report.target = "_blank"; report.rel = "noopener";
    box.appendChild(report);

    var share = el("button", "btn", "↗ שיתוף");
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

  // ---- detail view ----------------------------------------------------------------
  function withMarks(text) {
    // highlight the [?] marker used for unreadable words
    var frag = document.createDocumentFragment();
    String(text).split(/(\[\?\])/).forEach(function (part) {
      if (part === "[?]") { var m = el("mark", "q", "[?]"); m.title = "מילה שלא נקראה"; frag.appendChild(m); }
      else if (part) frag.appendChild(document.createTextNode(part));
    });
    return frag;
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
      a.appendChild(img); fig.appendChild(a);
      var cap = {single: "", front: "צד קדמי", back: "צד אחורי", unknown: ""}[f.side] || "";
      if (f.rotation_applied_cw_degrees) cap += (cap ? " · " : "") + "הסריקה סובבה ב-" + f.rotation_applied_cw_degrees + "°";
      if (cap) fig.appendChild(el("figcaption", null, cap));
      scans.appendChild(fig);
    });
    wrap.appendChild(scans);

    var txt = el("div", "text");
    txt.appendChild(el("h2", null, recipeTitle(r)));
    if (usesAssignedTitle(r)) txt.appendChild(el("p", "muted", "כותרת שניתנה למתכון לצורך חיפוש; אינה כותרת שתומללה מהמקור."));
    else if (r.assigned_title) txt.appendChild(el("p", "muted", "כותרת נוספת לחיפוש: " + r.assigned_title));
    if (r.needs_human_verification) {
      var warn = el("p", "banner warn", "תמלול זה דורש הגהה אנושית. השוו מול הסריקה. רמת ביטחון: " + ({high: "גבוהה", medium: "בינונית", low: "נמוכה"}[r.confidence] || r.confidence));
      txt.appendChild(warn);
    }
    var facts = el("p", "meta");
    var bits = [];
    if (r.source) bits.push("מקור: " + r.source.text + (r.source.uncertain ? " (לא בטוח)" : ""));
    bits.push(mediumLabel(r.medium));
    bits.push(batchTitle(r.batch));
    facts.textContent = bits.join(" · ");
    txt.appendChild(facts);

    if (r.ingredients.length) {
      txt.appendChild(el("h3", null, "מרכיבים"));
      r.ingredients.forEach(function (g) {
        if (g.group) txt.appendChild(el("h4", null, g.group));
        var ul = el("ul");
        g.items.forEach(function (i) { var li = el("li"); li.appendChild(withMarks(i)); ul.appendChild(li); });
        txt.appendChild(ul);
      });
    }
    if (r.instructions.length) {
      txt.appendChild(el("h3", null, "אופן הכנה"));
      r.instructions.forEach(function (g) {
        if (g.group) txt.appendChild(el("h4", null, g.group));
        var ol = el("ol");
        g.steps.forEach(function (s) { var li = el("li"); li.appendChild(withMarks(s)); ol.appendChild(li); });
        txt.appendChild(ol);
      });
    }
    if (!r.ingredients.length && !r.instructions.length) txt.appendChild(el("p", "muted", "לא תומלל תוכן (ראו סריקה)."));
    if (r.notes.length) {
      txt.appendChild(el("h3", null, "הערות"));
      var nl = el("ul"); r.notes.forEach(function (n) { var li = el("li"); li.appendChild(withMarks(n)); nl.appendChild(li); }); txt.appendChild(nl);
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
    if (r.medium === "clipping") {
      var legal = el("p", "legal", LEGAL_NOTICE_CLIPPING);
      var la = el("a", null, "פנו אלינו");
      la.href = "https://github.com/" + REPO + "/issues/new?" + qs({ title: "בקשת הסרה: " + r.id, body: "מתכון: " + pageUrl(r) + "\n\nסיבת הבקשה:\n" });
      la.target = "_blank"; la.rel = "noopener";
      legal.appendChild(la); legal.appendChild(document.createTextNode("."));
      txt.appendChild(legal);
    }
    txt.appendChild(actions(r));
    txt.appendChild(el("p", "muted id", r.id + " · " + r.path));
    wrap.appendChild(txt);
    v.appendChild(wrap);
    window.scrollTo(0, 0);
  }

  // ---- routing --------------------------------------------------------------------
  function route() {
    if (!DATA) return;
    readFiltersFromUrl();
    var m = location.hash.match(/^#\/(b\d+-r\d+)$/);
    if (m) return renderDetail(m[1]);
    document.title = "המתכונים של אילנה";
    $("detail-view").hidden = true; $("list-view").hidden = false;
    renderList();
  }
  window.addEventListener("hashchange", route);
  window.addEventListener("popstate", route);
})();
