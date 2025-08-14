const pLimit = require("p-limit");
const { get, set } = require("../lib/cache");
const sources = require("../data/rights.sources");
const {
  getAbortionSnapshot,
  getParentageSnapshot,
} = require("../lib/adapters");

const limit = pLimit(4);

function key(state) {
  return `rights:${state}`;
}

async function fetchLive(state) {
  const tasks = [];

  const abUrl = sources.abortion[state];
  if (abUrl) tasks.push(limit(() => getAbortionSnapshot(state, abUrl)));

  const paUrl = sources.parentage[state];
  if (paUrl) tasks.push(limit(() => getParentageSnapshot(state, paUrl)));

  const parts = await Promise.allSettled(tasks);

  // Merge parts into one record
  const merged = {
    ok: true,
    state,
    lastUpdated: new Date().toISOString(),
    parentage_summary: null,
    abortion_summary: null,
    links: [],
    _parts: [], // internal debug (optional)
  };

  for (const p of parts) {
    if (p.status === "fulfilled") {
      const d = p.value;
      merged.parentage_summary =
        d.parentage_summary ?? merged.parentage_summary;
      merged.abortion_summary = d.abortion_summary ?? merged.abortion_summary;
      if (Array.isArray(d.links)) merged.links.push(...d.links);
      merged._parts.push({ ok: true });
    } else {
      merged._parts.push({ ok: false, error: String(p.reason) });
    }
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
