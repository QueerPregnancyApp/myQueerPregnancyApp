// server/lib/adapters.js
// Node 18 global fetch + node-html-parser
const { parse } = require("node-html-parser");
const { URL } = require("url");

function normalize({ state, topic, summary, links }) {
  return {
    ok: true,
    state,
    lastUpdated: new Date().toISOString(),
    parentage_summary: topic === "parentage" ? summary : undefined,
    abortion_summary: topic === "abortion" ? summary : undefined,
    links: links || [],
  };
}

function tidy(text = "", maxChars = 600) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= maxChars) return t;
  const cut = t.slice(0, maxChars);
  const lastDot = cut.lastIndexOf(". ");
  return (lastDot > 200 ? cut.slice(0, lastDot + 1) : cut) + " …";
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "myQueerPregnancyApp/1.0" },
  });
  if (!res.ok) throw new Error(`Fetch failed (${res.status}) for ${url}`);
  return res.text();
}

/* ---------- Generic fallback scraper ---------- */
async function scrapeHtmlPage(url, { state, topic }) {
  const html = await fetchHtml(url);
  const root = parse(html);

  const firstArticleP = root.querySelector("article p");
  const firstMainP = root.querySelector("main p");
  const firstP = root.querySelector("p");

  const summary = tidy(
    (firstArticleP && firstArticleP.text) ||
      (firstMainP && firstMainP.text) ||
      (firstP && firstP.text) ||
      "No summary available from source."
  );

  const links = [{ label: "Source", url }];
  root
    .querySelectorAll("a[href]")
    .slice(0, 10)
    .forEach((a) => {
      const href = a.getAttribute("href");
      if (href && /^https?:\/\//.test(href)) {
        const label = (a.text || "").trim() || href;
        links.push({ label, url: href });
      }
    });

  return normalize({ state, topic, summary, links });
}

/* ---------- Site-specific: lgbtmap.org (parentage/equality) ---------- */
function isLgbtMap(u) {
  try {
    return /(^|\.)lgbtmap\.org$/i.test(new URL(u).hostname);
  } catch {
    return false;
  }
}

async function scrapeLgbtMap(url, { state, topic }) {
  const html = await fetchHtml(url);
  const root = parse(html);

  const candidates = [
    "main p",
    ".content p",
    "article p",
    ".state-profile p",
    ".state-profile__summary p",
  ];

  let text = "";
  for (const sel of candidates) {
    const el = root.querySelector(sel);
    if (el && el.text && el.text.trim().length > 60) {
      text = el.text;
      break;
    }
  }
  if (!text) text = root.querySelector("p")?.text || "";

  const summary = tidy(text || "No summary available from source.");
  const links = [{ label: "Source (MAP)", url }];
  return normalize({ state, topic, summary, links });
}

/* ---------- Site-specific: reproductiverights.org (CRR) ---------- */
function isCRR(u) {
  try {
    return /(^|\.)reproductiverights\.org$/i.test(new URL(u).hostname);
  } catch {
    return false;
  }
}

async function scrapeCRR(url, { state, topic }) {
  const html = await fetchHtml(url);
  const root = parse(html);

  // Try to target the first meaningful paragraph in the page body.
  // CRR pages often have content inside <main>, sometimes within .entry-content or article.
  const candidates = [
    "main .entry-content p",
    "main article p",
    "article .entry-content p",
    "article p",
    "main p",
  ];

  let text = "";
  for (const sel of candidates) {
    const el = root.querySelector(sel);
    if (el && el.text && el.text.trim().length > 60) {
      text = el.text;
      break;
    }
  }
  if (!text) text = root.querySelector("p")?.text || "";

  const summary = tidy(text || "No summary available from source.");
  const links = [{ label: "Source (CRR)", url }];
  return normalize({ state, topic, summary, links });
}

/* ---------- Public API ---------- */
module.exports = {
  async getAbortionSnapshot(state, url) {
    if (isCRR(url)) return scrapeCRR(url, { state, topic: "abortion" });
    return scrapeHtmlPage(url, { state, topic: "abortion" });
  },
  async getParentageSnapshot(state, url) {
    if (isLgbtMap(url))
      return scrapeLgbtMap(url, { state, topic: "parentage" });
    return scrapeHtmlPage(url, { state, topic: "parentage" });
  },
};
