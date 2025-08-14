const fetch = require("node-fetch");
const { withCache } = require("../lib/cache"); // your existing cache util

// Simple adapter registry so you can test/swap sources later
const adapters = [
  {
    name: "lgbtmap-profile",
    url: (state) =>
      `https://www.lgbtmap.org/equality_maps/profile_state/${state}`,
    parse: async (html) => {
      // TODO: parse just what you need; keep it minimal & robust.
      // For now, return a placeholder shape you already render in the client:
      return {
        citations: ["https://www.lgbtmap.org/equality_maps"],
        sections: [],
      };
    },
  },
];

async function fetchFromAdapter(adapter, state) {
  const res = await fetch(adapter.url(state), {
    headers: { "user-agent": "mqpa/1.0" },
  });
  if (!res.ok) throw new Error(`Adapter failed: ${adapter.name} ${res.status}`);
  const text = await res.text();
  return adapter.parse(text);
}

async function getRightsByState(state) {
  return withCache(`rights:${state}`, 60 * 60, async () => {
    for (const a of adapters) {
      try {
        return await fetchFromAdapter(a, state);
      } catch (e) {
        /* try next */
      }
    }
    throw new Error("All adapters failed");
  });
}

module.exports = { getRightsByState };
