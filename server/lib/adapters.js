// server/lib/adapters.js
// CommonJS + Node 18 global fetch + node-html-parser
const { parse } = require("node-html-parser");
const { URL } = require("url");

// Normalize to your schema
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
  // collapse spaces, trim, keep it readable
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= maxChars) return t;
  // cut at sentence end if possible
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

/** Generic HTML scrape */
async function scrapeHtmlPage(url, { state, topic }) {
  const html = await fetchHtml(url);
  const root = parse(html);

  // Try a few likely spots for a paragraph summary
  const firstArticleP = root.querySelector("article p");
  const firstMainP = root.querySelector("main p");
  const firstP = root.querySelector("p");

  const summary = tidy(
    (firstArticleP && firstArticleP.text) ||
      (firstMainP && firstMainP.text) ||
      (firstP && firstP.text) ||
      "No summary available from source."
  );

  // Collect a few links for citations
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

/** Site-specific: lgbtmap.org profile pages */
async function scrapeLgbtMap(url, { state, topic }) {
  const html = await fetchHtml(url);
  const root = parse(html);

  // Heuristics: MAP profile pages usually have a main content area with descriptive paragraphs.
  // Try common containers; fall back to first meaningful paragraph.
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
  if (!text) {
    const firstP = root.querySelector("p");
    text = firstP ? firstP.text : "";
  }
  const summary = tidy(text || "No summary available from source.");

  const links = [{ label: "Source (MAP)", url }];

  return normalize({ state, topic, summary, links });
}

function isLgbtMap(u) {
  try {
    const host = new URL(u).hostname;
    return /(^|\.)lgbtmap\.org$/i.test(host);
  } catch {
    return false;
  }
}

module.exports = {
  async getAbortionSnapshot(state, url) {
    // Generic for now (we’ll add a site-specific adapter when you provide an abortion source)
    return scrapeHtmlPage(url, { state, topic: "abortion" });
  },
  async getParentageSnapshot(state, url) {
    if (isLgbtMap(url)) {
      return scrapeLgbtMap(url, { state, topic: "parentage" });
    }
    return scrapeHtmlPage(url, { state, topic: "parentage" });
  },
};
