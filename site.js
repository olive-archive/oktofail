/* ==========================================================
   SITE.JS — the "engine" of the site.
   You should never need to edit this file. It reads the JSON
   files in the /content folder and turns them into web pages.

   How it decides what to show:
     yoursite.com/          -> content/pages/home.json
     yoursite.com/about     -> content/pages/about.json
     yoursite.com/anything  -> content/pages/anything.json

   Blog posts live in content/posts/<year>.json (2026.json, 2027.json, ...).
   The home page shows the newest ones with a "Load more" button.
   ========================================================== */

(function () {
  "use strict";

  var contentEl = document.getElementById("content");
  var firstImageDone = false;

  /* ---------- Small helpers ---------- */

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isExternal(url) {
    return /^https?:\/\//i.test(url);
  }
  function isSafeUrl(url) {
    return /^(https?:\/\/|mailto:|\/|#)/i.test(url);
  }

  // When previewing the site yourself (e.g. VS Code Live Server), the preview tool
  // can't handle addresses like /about, so we use /?p=about there instead.
  // On your real website this does nothing and /about stays /about.
  // "Previewing yourself" includes: your own computer, other devices on your home
  // network (e.g. your phone), and common port-forwarding / tunnel addresses.
  function isPreviewHost(h) {
    h = String(h || "").toLowerCase();
    if (
      h === "localhost" ||
      h === "[::1]" ||
      /\.local$/.test(h) ||
      /\.localhost$/.test(h)
    ) {
      return true;
    }
    var m = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(h);
    if (m) {
      var a = +m[1],
        b = +m[2];
      return (
        a === 127 ||
        a === 10 ||
        (a === 192 && b === 168) ||
        (a === 172 && b >= 16 && b <= 31) ||
        (a === 169 && b === 254)
      );
    }
    return /\.(devtunnels\.ms|ngrok-free\.app|ngrok-free\.dev|ngrok\.app|ngrok\.io|ngrok\.dev|trycloudflare\.com|loca\.lt|github\.dev|gitpod\.io|csb\.app)$/.test(
      h,
    );
  }
  var isLocal = isPreviewHost(location.hostname);
  var queryLinks = isLocal; // can also be switched on with "cleanUrls": false in site.json
  function localHref(url) {
    if (!queryLinks) {
      return url;
    }
    var m = /^\/([a-z0-9][a-z0-9_-]*)\/?$/i.exec(url);
    return m ? "/?p=" + m[1].toLowerCase() : url;
  }

  // "images/photo.jpg" and "/images/photo.jpg" both work.
  function fixSrc(src) {
    src = String(src || "").trim();
    return /^(https?:\/\/|\/)/i.test(src) ? src : "/" + src;
  }

  function message(html, isError) {
    return (
      '<div class="message block' +
      (isError ? " error" : "") +
      '">' +
      html +
      "</div>"
    );
  }

  function warn(text) {
    return message("<strong>Problem on this page:</strong> " + esc(text), true);
  }

  /* Text formatting:  **bold**  *italic*  [link text](https://...)  \n = line break */
  function inline(text) {
    var s = esc(text);
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, url) {
      if (!isSafeUrl(url)) {
        return label;
      }
      var extra = isExternal(url)
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      return '<a href="' + localHref(url) + '"' + extra + ">" + label + "</a>";
    });
    s = s.replace(/\n/g, "<br>");
    return s;
  }

  function formatDate(str) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str || "");
    if (!m) {
      return String(str || "");
    }
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    if (isNaN(d.getTime())) {
      return String(str);
    }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }).format(d);
  }

  function isIsoDate(str) {
    return /^\d{4}-\d{2}-\d{2}$/.test(str || "");
  }

  /* ---------- Loading JSON (with friendly errors) ---------- */

  function loadJSON(url) {
    return fetch(url, { cache: "no-cache" })
      .then(function (res) {
        if (res.status === 404) {
          var nf = new Error("Not found: " + url);
          nf.kind = "notfound";
          throw nf;
        }
        if (!res.ok) {
          throw new Error(
            "Could not load " + url + " (error " + res.status + ")",
          );
        }
        return res.text();
      })
      .then(function (text) {
        // Cloudflare answers unknown files with the home page instead of a 404.
        if (/^\s*</.test(text)) {
          var nf = new Error("Not found: " + url);
          nf.kind = "notfound";
          throw nf;
        }
        try {
          return JSON.parse(text);
        } catch (e) {
          var err = new Error(
            "The file " + url + " has a typing mistake in it.",
          );
          err.kind = "parse";
          var detail = e.message || "";
          var pos = /position (\d+)/.exec(detail);
          if (pos) {
            var line = text.slice(0, +pos[1]).split("\n").length;
            detail += "\n(Look near line " + line + " of the file.)";
          }
          err.detail = detail;
          throw err;
        }
      });
  }

  function showError(err) {
    if (err && err.kind === "notfound") {
      contentEl.innerHTML = message(
        '<strong>Page not found.</strong> <a href="/">Back to the home page</a>',
      );
      document.title = "Page not found";
      return;
    }
    var html =
      "<strong>Something is wrong with the site content.</strong><br>" +
      esc((err && err.message) || "Unknown error");
    if (err && err.detail) {
      html += "<code>" + esc(err.detail) + "</code>";
    }
    contentEl.insertAdjacentHTML("afterbegin", message(html, true));
  }

  /* ---------- Rendering blocks ---------- */

  function imgTag(im) {
    var attrs =
      ' src="' + esc(fixSrc(im.src)) + '" alt="' + esc(im.alt || "") + '"';
    var w = parseInt(im.width, 10),
      h = parseInt(im.height, 10);
    if (w > 0 && h > 0) {
      attrs += ' width="' + w + '" height="' + h + '"';
    }
    if (!firstImageDone) {
      attrs += ' fetchpriority="high"';
      firstImageDone = true;
    } else {
      attrs += ' loading="lazy"';
    }
    return "<img" + attrs + ' decoding="async">';
  }

  function figure(im, extraClass) {
    var inner = imgTag(im);
    if (im.link && isSafeUrl(im.link)) {
      var ext = isExternal(im.link)
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      inner =
        '<a href="' +
        esc(localHref(im.link)) +
        '"' +
        ext +
        ">" +
        inner +
        "</a>";
    }
    var cap = im.caption
      ? "<figcaption>" + inline(im.caption) + "</figcaption>"
      : "";
    return (
      '<figure class="block' +
      (extraClass || "") +
      '">' +
      inner +
      cap +
      "</figure>"
    );
  }

  // Builds the <li> items of a list. An item that is itself a list ( [ ... ] )
  // becomes an indented sub-list under the item before it.
  function listHtml(items, tag) {
    var out = "";
    items.forEach(function (it) {
      if (Array.isArray(it)) {
        var nested = "<" + tag + ">" + listHtml(it, tag) + "</" + tag + ">";
        if (out.slice(-5) === "</li>") {
          out = out.slice(0, -5) + nested + "</li>";
        } else {
          out += "<li>" + nested + "</li>";
        }
      } else {
        out += "<li>" + inline(String(it)) + "</li>";
      }
    });
    return out;
  }

  function renderBlock(b, where) {
    if (!b || typeof b !== "object") {
      return warn(where + ": this block is not written correctly.");
    }
    var type = String(b.type || "").toLowerCase();

    switch (type) {
      case "image":
        if (!b.src) {
          return warn(where + ': the image block has no "src".');
        }
        return figure(b, "");

      case "row":
      case "images": {
        var list = b.images;
        if (!Array.isArray(list) || list.length === 0) {
          return warn(where + ': the row block needs an "images" list.');
        }
        var cells = list
          .map(function (im) {
            if (!im || !im.src) {
              return warn(where + ': an image in the row has no "src".');
            }
            return figure(im, "").replace('class="block"', 'class="cell"');
          })
          .join("");
        return (
          '<div class="block row" style="--cols:' +
          Math.min(list.length, 4) +
          '">' +
          cells +
          "</div>"
        );
      }

      case "text": {
        var paras = b.text !== undefined ? b.text : b.paragraphs;
        if (typeof paras === "string") {
          paras = [paras];
        }
        if (!Array.isArray(paras)) {
          return warn(where + ': the text block needs a "text" entry.');
        }
        var cls =
          "block text" +
          (b.align === "center" ? " center" : "") +
          (b.small ? " small" : "") +
          (b.indent ? " indent" : "");
        return (
          '<div class="' +
          cls +
          '">' +
          paras
            .map(function (p) {
              return "<p>" + inline(p) + "</p>";
            })
            .join("") +
          "</div>"
        );
      }

      case "list": {
        if (!Array.isArray(b.items) || b.items.length === 0) {
          return warn(where + ': the list block needs an "items" list.');
        }
        var tag =
          String(b.style || "").toLowerCase() === "numbers" ? "ol" : "ul";
        return (
          "<" +
          tag +
          ' class="block list' +
          (b.indent ? " indent" : "") +
          '">' +
          listHtml(b.items, tag) +
          "</" +
          tag +
          ">"
        );
      }

      case "heading": {
        if (!b.text) {
          return warn(where + ': the heading block has no "text".');
        }
        var lvl = parseInt(b.level, 10);
        if (!(lvl >= 1 && lvl <= 3)) {
          lvl = 2;
        }
        return (
          "<h" + lvl + ' class="block">' + inline(b.text) + "</h" + lvl + ">"
        );
      }

      case "links": {
        if (!Array.isArray(b.items) || b.items.length === 0) {
          return warn(where + ': the links block needs an "items" list.');
        }
        var out = b.items
          .map(function (it) {
            if (!it || !it.label || !it.url || !isSafeUrl(it.url)) {
              return "";
            }
            var ext = isExternal(it.url)
              ? ' target="_blank" rel="noopener noreferrer"'
              : "";
            return (
              '<a href="' +
              esc(localHref(it.url)) +
              '"' +
              ext +
              ">" +
              esc(it.label) +
              "</a>"
            );
          })
          .join("");
        return '<div class="block links">' + out + "</div>";
      }

      case "divider":
        return '<hr class="block">';

      case "spacer": {
        var h = parseInt(b.height, 10);
        if (!(h >= 0)) {
          h = 48;
        }
        return (
          '<div class="block" style="height:' +
          Math.min(h, 400) +
          'px;margin:0" aria-hidden="true"></div>'
        );
      }

      case "embed": {
        if (!b.url || !/^https:\/\/[^"\s]+$/i.test(b.url)) {
          return warn(
            where + ': the embed block needs a "url" starting with https://',
          );
        }
        var eh = parseInt(b.height, 10);
        if (!(eh > 0)) {
          eh = 320;
        }
        return (
          '<div class="block"><iframe src="' +
          esc(b.url) +
          '" title="' +
          esc(b.title || "Embedded form") +
          '" width="100%" height="' +
          Math.min(eh, 1200) +
          '" frameborder="0" scrolling="no" loading="lazy" style="border:0;max-width:100%;background:transparent"></iframe></div>'
        );
      }

      default:
        return warn(
          where +
            ': unknown block type "' +
            (b.type || "(missing)") +
            '". Allowed types are image, row, text, list, heading, links, divider, spacer.',
        );
    }
  }

  function renderBlocks(blocks, where) {
    if (!Array.isArray(blocks)) {
      return warn(where + ': "blocks" must be a list written inside [ ].');
    }
    return blocks
      .map(function (b, i) {
        return renderBlock(b, where + ", block " + (i + 1));
      })
      .join("");
  }

  /* ---------- Posts ---------- */

  var usedIds = {};
  var reservedIds = {
    content: 1,
    "site-title": 1,
    "site-nav": 1,
    "site-footer": 1,
  };

  function slugify(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
  }

  // Each post gets a link name (used after the # in its shareable link).
  // You can set your own with "id"; otherwise it is made from the date and title.
  function postId(p) {
    var base = slugify(p.id ? p.id : (p.date || "") + "-" + (p.title || ""));
    if (!base) {
      return "";
    }
    if (reservedIds[base]) {
      base = "post-" + base;
    }
    var id = base,
      n = 2;
    while (usedIds[id]) {
      id = base + "-" + n;
      n += 1;
    }
    usedIds[id] = true;
    return id;
  }

  // Drops drafts. If every post has a date like 2026-11-03, sorts newest first.
  function sortedLive(posts) {
    var items = [];
    posts.forEach(function (p, i) {
      if (p && typeof p === "object" && !p.draft) {
        items.push({ p: p, i: i });
      }
    });
    if (
      items.length &&
      items.every(function (it) {
        return isIsoDate(it.p.date);
      })
    ) {
      items.sort(function (a, b) {
        return a.p.date < b.p.date ? 1 : a.p.date > b.p.date ? -1 : 0;
      });
    }
    return items;
  }

  function postLabel(source, it) {
    return (
      source +
      ", post " +
      (it.i + 1) +
      (it.p.title ? ' ("' + it.p.title + '")' : "")
    );
  }

  function renderPost(p, label) {
    var id = postId(p);
    var head = "";
    if (p.date || p.title || id) {
      head = '<header class="post-meta">';
      if (p.date || id) {
        head += '<div class="post-top">';
        if (p.date) {
          head +=
            '<time class="post-date"' +
            (isIsoDate(p.date) ? ' datetime="' + esc(p.date) + '"' : "") +
            ">" +
            esc(formatDate(p.date)) +
            "</time>";
        } else {
          head += "<span></span>";
        }
        if (id) {
          head +=
            '<a class="post-link" href="#' +
            esc(id) +
            '" data-id="' +
            esc(id) +
            '">Copy link</a>';
        }
        head += "</div>";
      }
      if (p.title) {
        head += '<h2 class="post-title">' + inline(p.title) + "</h2>";
      }
      head += "</header>";
    }
    return (
      '<article class="post"' +
      (id ? ' id="' + esc(id) + '"' : "") +
      ">" +
      head +
      renderBlocks(p.blocks || [], label) +
      "</article>"
    );
  }

  // Posts written directly inside a page file ("posts": [ ... ]).
  function renderPosts(posts) {
    if (!Array.isArray(posts)) {
      return warn('"posts" must be a list written inside [ ].');
    }
    return sortedLive(posts)
      .map(function (it) {
        return renderPost(it.p, postLabel("Page", it));
      })
      .join("");
  }

  // If a picture file can't be found, say so plainly instead of showing a broken icon.
  function watchImages(root) {
    Array.prototype.forEach.call(root.querySelectorAll("img"), function (img) {
      img.addEventListener("error", function () {
        var box = document.createElement("div");
        box.className = "message error";
        box.textContent =
          "Could not load image: " +
          img.getAttribute("src") +
          " — check the file is in the images folder and that the spelling and capital letters match exactly.";
        if (img.parentNode) {
          img.parentNode.replaceChild(box, img);
        }
      });
    });
  }

  function hashId() {
    var h = location.hash.replace(/^#/, "");
    try {
      h = decodeURIComponent(h);
    } catch (e) {
      /* ignore */
    }
    return h.toLowerCase();
  }

  /* The blog feed: posts come from content/posts/<year>.json files, newest year first.
     Only a few posts are shown at a time; "Load more" shows the next batch. */
  function startFeed(site) {
    var perLoad = parseInt(site.postsPerLoad, 10);
    if (!(perLoad > 0)) {
      perLoad = 10;
    }
    var thisYear = new Date().getFullYear();
    var first = parseInt(site.firstYear, 10);
    if (!(first >= 1000 && first <= thisYear)) {
      first = thisYear;
    }

    var years = [];
    for (var y = thisYear; y >= first; y--) {
      years.push(y);
    }

    var buffer = []; // posts loaded from files but not yet shown
    var yi = 0; // next year file to look at
    var busy = false;

    var wrap = document.createElement("div");
    wrap.className = "feed";
    var list = document.createElement("div");
    var more = document.createElement("div");
    more.className = "load-more-wrap";
    more.hidden = true;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "load-more";
    btn.textContent = "Load more";
    more.appendChild(btn);
    wrap.appendChild(list);
    wrap.appendChild(more);
    contentEl.appendChild(wrap);

    // Make sure at least n posts are waiting in the buffer (or no more files remain).
    function fillBuffer(n) {
      if (buffer.length >= n || yi >= years.length) {
        return Promise.resolve();
      }
      var year = years[yi];
      yi += 1;
      var source = "posts/" + year + ".json";
      return loadJSON("/content/" + source)
        .then(
          function (data) {
            if (!data || !Array.isArray(data.posts)) {
              list.insertAdjacentHTML(
                "beforeend",
                warn(
                  "The file content/" +
                    source +
                    ' needs a "posts" list written inside [ ].',
                ),
              );
              return;
            }
            buffer = buffer.concat(
              sortedLive(data.posts).map(function (it) {
                return { p: it.p, label: postLabel(source, it) };
              }),
            );
          },
          function (err) {
            if (err && err.kind === "notfound") {
              return;
            } // no file for that year: skip it
            var html =
              "<strong>Problem in content/" +
              esc(source) +
              ":</strong> " +
              esc((err && err.message) || "Unknown error");
            if (err && err.detail) {
              html += "<code>" + esc(err.detail) + "</code>";
            }
            list.insertAdjacentHTML("beforeend", message(html, true));
          },
        )
        .then(function () {
          return fillBuffer(n);
        });
    }

    function showNext() {
      var batch = buffer.splice(0, perLoad);
      var tpl = document.createElement("template");
      tpl.innerHTML = batch
        .map(function (it) {
          return renderPost(it.p, it.label);
        })
        .join("");
      watchImages(tpl.content);
      list.appendChild(tpl.content);
    }

    function refreshButton() {
      more.hidden = buffer.length === 0;
      btn.disabled = false;
      btn.textContent = "Load more";
    }

    function loadMore() {
      return fillBuffer(perLoad)
        .then(function () {
          showNext();
          return fillBuffer(1);
        })
        .then(refreshButton);
    }

    // A shared link like site.com/#my-post: keep loading until that post is on the page.
    function revealHash() {
      var id = hashId();
      if (!id) {
        return Promise.resolve();
      }
      var el = document.getElementById(id);
      if (el) {
        el.scrollIntoView();
        // Images above the post may finish loading and nudge the page, so settle twice.
        var touched = false;
        ["wheel", "touchstart", "keydown", "mousedown"].forEach(function (ev) {
          window.addEventListener(
            ev,
            function () {
              touched = true;
            },
            { once: true, passive: true },
          );
        });
        [400, 1200].forEach(function (ms) {
          setTimeout(function () {
            if (!touched) {
              el.scrollIntoView();
            }
          }, ms);
        });
        return Promise.resolve();
      }
      if (buffer.length === 0 && yi >= years.length) {
        return Promise.resolve();
      } // not found anywhere
      return loadMore().then(revealHash);
    }

    btn.addEventListener("click", function () {
      if (busy) {
        return;
      }
      busy = true;
      btn.disabled = true;
      btn.textContent = "Loading…";
      loadMore().then(function () {
        busy = false;
      });
    });

    window.addEventListener("hashchange", function () {
      revealHash();
    });

    return fillBuffer(perLoad)
      .then(function () {
        showNext();
        if (list.children.length === 0) {
          list.insertAdjacentHTML(
            "beforeend",
            message("There are no posts yet."),
          );
        }
        return fillBuffer(1);
      })
      .then(function () {
        refreshButton();
        return revealHash();
      });
  }

  // "Copy link" under each post: copies the address of that post.
  function copyPostLink(e) {
    var a = e.target.closest ? e.target.closest("a.post-link") : null;
    if (!a) {
      return;
    }
    var url =
      location.origin +
      location.pathname +
      location.search +
      "#" +
      a.getAttribute("data-id");
    try {
      navigator.clipboard.writeText(url).then(
        function () {
          a.textContent = "Link copied";
          setTimeout(function () {
            a.textContent = "Copy link";
          }, 1800);
        },
        function () {
          /* clipboard not allowed: the address bar still shows the link */
        },
      );
    } catch (err) {
      /* same */
    }
  }

  /* ---------- Page chrome (header, nav, footer) ---------- */

  function normPath(p) {
    return String(p || "")
      .replace(/index\.html$/i, "")
      .replace(/\.html$/i, "")
      .replace(/\/+$/, "")
      .toLowerCase();
  }

  function renderChrome(site) {
    var title = site.title || "My Portfolio";
    var titleEl = document.getElementById("site-title");
    titleEl.textContent = title;

    // Optional image logo instead of the text name (set "logo" in site.json).
    var logo = String(site.logo || "").trim();
    if (logo) {
      var logoH = parseInt(site.logoHeight, 10);
      if (!(logoH >= 10 && logoH <= 200)) {
        logoH = 40;
      }
      var img = document.createElement("img");
      img.className = "site-logo";
      img.src = fixSrc(logo);
      img.alt = title;
      img.style.height = logoH + "px";
      // If the logo file can't be found, fall back to the text name.
      img.addEventListener("error", function () {
        titleEl.textContent = title;
        titleEl.parentNode.classList.remove("has-logo");
      });
      titleEl.textContent = "";
      titleEl.appendChild(img);
      titleEl.parentNode.classList.add("has-logo");
    }

    var slugNow = currentSlug();
    var here = slugNow === "home" ? "" : "/" + slugNow;
    var nav = (Array.isArray(site.nav) ? site.nav : [])
      .filter(function (it) {
        return it && it.label && it.url && isSafeUrl(it.url);
      })
      .map(function (it) {
        var current =
          !isExternal(it.url) && normPath(it.url) === here
            ? ' aria-current="page"'
            : "";
        var ext = isExternal(it.url)
          ? ' target="_blank" rel="noopener noreferrer"'
          : "";
        return (
          '<a href="' +
          esc(localHref(it.url)) +
          '"' +
          current +
          ext +
          ">" +
          esc(it.label) +
          "</a>"
        );
      })
      .join("");
    document.getElementById("site-nav").innerHTML = nav;

    var footer = String(site.footer || "").replace(
      /\{year\}/g,
      String(new Date().getFullYear()),
    );
    document.getElementById("site-footer").innerHTML = footer
      ? inline(footer)
      : "";
  }

  // Sticky top bar: remembers its height (so jumps to a post stop just below it)
  // and shows a thin line under it once the page has scrolled.
  function setupHeader() {
    var header = document.querySelector(".site-header");
    if (!header) {
      return;
    }
    function measure() {
      document.documentElement.style.setProperty(
        "--header-h",
        header.offsetHeight + "px",
      );
    }
    function onScroll() {
      header.classList.toggle("is-stuck", window.scrollY > 4);
    }
    measure();
    onScroll();
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    if ("ResizeObserver" in window) {
      new ResizeObserver(measure).observe(header);
    }
  }

  function setMeta(site, page, slug) {
    var siteTitle = site.title || "My Portfolio";
    document.title =
      slug === "home" || !page.title
        ? siteTitle
        : page.title + " — " + siteTitle;
    var desc = page.description || site.description || "";
    var meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", desc);
    }
  }

  /* ---------- Start ---------- */

  function currentSlug() {
    // /?p=about works on the home address everywhere (used by preview links).
    var qp = new URLSearchParams(location.search).get("p");
    if (qp && /^\/?(index\.html)?$/i.test(location.pathname)) {
      return String(qp).toLowerCase();
    }
    var p = location.pathname;
    try {
      p = decodeURIComponent(p);
    } catch (e) {
      /* ignore */
    }
    p = p
      .replace(/index\.html$/i, "")
      .replace(/\.html$/i, "")
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase();
    return p === "" ? "home" : p;
  }

  function broken(err) {
    return err && err.kind !== "notfound";
  }

  function init() {
    var slug = currentSlug();
    var validSlug = /^[a-z0-9][a-z0-9_-]*$/.test(slug);

    var siteError = null;
    var siteReq = loadJSON("/content/site.json").catch(function (e) {
      siteError = e;
      return {};
    });
    var pageReq = validSlug
      ? loadJSON("/content/pages/" + slug + ".json")
      : Promise.reject(
          Object.assign(new Error("bad address"), { kind: "notfound" }),
        );

    // Never let a page error stop the site chrome from drawing.
    var pageError = null;
    pageReq = pageReq.catch(function (e) {
      pageError = e;
      return null;
    });

    Promise.all([siteReq, pageReq]).then(function (res) {
      var site = res[0] || {};
      var page = res[1];
      if (site.cleanUrls === false) {
        queryLinks = true;
      }

      renderChrome(site);
      setupHeader();
      if (siteError) {
        showError(
          siteError.kind === "notfound"
            ? new Error("content/site.json is missing.")
            : siteError,
        );
      }

      if (pageError) {
        if (!broken(pageError)) {
          document.title = "Page not found — " + (site.title || "");
        }
        showError(pageError);
        return;
      }

      setMeta(site, page || {}, slug);

      var html = "";
      var feed = page.feed === true;
      if (Array.isArray(page.blocks)) {
        html += renderBlocks(page.blocks, "Page");
      }
      if (Array.isArray(page.posts)) {
        html += renderPosts(page.posts);
      }
      if (!feed && !Array.isArray(page.posts) && !Array.isArray(page.blocks)) {
        html = warn(
          'This page file needs a "blocks" list, a "posts" list, or "feed": true.',
        );
      }
      contentEl.insertAdjacentHTML("beforeend", html);
      watchImages(contentEl);
      contentEl.addEventListener("click", copyPostLink);

      if (feed) {
        startFeed(site);
      }
    });
  }

  init();
})();
