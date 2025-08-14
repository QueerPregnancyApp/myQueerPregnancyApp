const { fetch } = require("undici");
const cheerio = require("cheerio");

// Shared normalizer to your schema
function normalize({ state, topic, summary, links }) {
  return {
    ok: true,
    state,
    lastUpdated: new Date().toISOString(),
    // Put per-topic summaries in their fields; callers will merge topics
    parentage_summary: topic === "parentage" ? summary : undefined,
    abortion_summary: topic === "abortion" ? summary : undefined,
    links: links || [],
  };
}

/**
 * Example HTML adapter.
 * Replace selectors once you pick real sources.
 */
async function scrapeHtmlPage(url, { state, topic }) {
  const res = await fetch(url, {
    headers: { "User-Agent": "myQueerPregnancyApp/1.0" },
  });
  if (!res.ok) throw new Error(`Fetch failed (${res.status}) for ${url}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  // TODO: update selectors for the chosen source
  const summary =
    $("article p").first().text().trim() || $("p").first().text().trim();

  // Gather obvious links on page for citation purposes
  const links = [];
  $("a[href]")
    .slice(0, 10)
    .each((_, a) => {
      const href = $(a).attr("href");
      if (href && /^https?:\/\//.test(href))
        links.push({ label: $(a).text().trim() || href, url: href });
    });

  return normalize({
    state,
    topic,
    summary,
    links: [{ label: "Source", url }, ...links],
  });
}

module.exports = {
  async getAbortionSnapshot(state, url) {
    return scrapeHtmlPage(url, { state, topic: "abortion" });
  },
  async getParentageSnapshot(state, url) {
    return scrapeHtmlPage(url, { state, topic: "parentage" });
  },
};
