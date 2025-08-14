// server/services/rights.service.js
const { get, set } = require("../cache");
const sources = require("../data/rights.sources");
const {
  getAbortionSnapshot,
  getParentageSnapshot,
} = require("../lib/adapters");

function key(state) {
  return `rights:${state}`;
}

async function fetchLive(state) {
  const merged = {
    ok: true,
    state,
    lastUpdated: new Date().toISOString(),
    parentage_summary: null,
    abortion_summary: null,
    links: [],
    _parts: [],
  };

  try {
    const abUrl = sources.abortion[state];
    if (abUrl) {
      const d = await getAbortionSnapshot(state, abUrl);
      merged.abortion_summary = d.abortion_summary ?? merged.abortion_summary;
      if (Array.isArray(d.links)) merged.links.push(...d.links);
      merged._parts.push({ ok: true, topic: "abortion" });
    }
  } catch (e) {
    merged._parts.push({ ok: false, topic: "abortion", error: String(e) });
  }

  try {
    const paUrl = sources.parentage[state];
    if (paUrl) {
      const d = await getParentageSnapshot(state, paUrl);
      merged.parentage_summary =
        d.parentage_summary ?? merged.parentage_summary;
      if (Array.isArray(d.links)) merged.links.push(...d.links);
      merged._parts.push({ ok: true, topic: "parentage" });
    }
  } catch (e) {
    merged._parts.push({ ok: false, topic: "parentage", error: String(e) });
  }

  return merged;
}

async function getRights(state, { ttl = "12h", refresh = false } = {}) {
  if (!refresh) {
    const cached = get(key(state), ttl);
    if (cached) return { ...cached, cached: true };
  }
  const fresh = await fetchLive(state);
  set(key(state), fresh);
  return { ...fresh, cached: false };
}

module.exports = { getRights };
