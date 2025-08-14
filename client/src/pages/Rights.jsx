import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE || "http://localhost:8080";

const STATE_NAMES = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
  PR: "Puerto Rico",
};

export default function Rights() {
  const [states, setStates] = useState([]);
  const [stateCode, setStateCode] = useState("CA");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // get list of states from server
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/rights`);
        const json = await res.json();
        if (json?.ok && Array.isArray(json.states)) {
          setStates(json.states);
        } else {
          // fallback if server didn’t return states for some reason
          setStates(["CA", "TX", "NY", "WA", "OR", "FL"]);
        }
      } catch {
        setStates(["CA", "TX", "NY", "WA", "OR", "FL"]);
      }
    })();
  }, []);

  async function fetchRights(code) {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${API}/api/rights/${code}`);
      const json = await res.json();
      if (!res.ok || json?.ok === false) {
        throw new Error(json?.message || "Failed to load");
      }
      setData(json);
    } catch (e) {
      setErr(e.message || "Error fetching rights");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  // fetch first state when page loads
  useEffect(() => {
    fetchRights(stateCode);
  }, [stateCode]);

  const lastUpdated = data?.lastUpdated
    ? new Date(data.lastUpdated).toLocaleString()
    : "—";
  return (
    <div className="card">
      <h2>Know Your Rights</h2>
      <p style={{ color: "var(--muted)", marginTop: -8 }}>
        This is an informational snapshot, not legal advice. Always verify with
        the linked sources.
      </p>

      <p style={{ fontSize: 12, opacity: 0.8 }}>
        This page fetches live summaries from trusted sources and may change as
        policies update.
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <label htmlFor="state">State</label>
        <select
          id="state"
          value={stateCode}
          onChange={(e) => setStateCode(e.target.value)}
          style={{ padding: 8, borderRadius: 8 }}
        >
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          className="button"
          onClick={() => fetchRights(stateCode)}
          disabled={loading}
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {err ? (
        <p style={{ color: "crimson" }}>{err}</p>
      ) : (
        <>
          {/* This is the new block */}
          <h3 style={{ marginBottom: 0 }}>
            {STATE_NAMES[stateCode] || stateCode}
          </h3>
          <p style={{ color: "var(--muted)", marginTop: 4 }}>
            Last updated: {lastUpdated}
          </p>
          {/* End of new block */}

          <section style={{ display: "grid", gap: 12 }}>
            <article className="card">
              <h3 style={{ marginTop: 0 }}>Parentage</h3>
              <p>{data?.parentage_summary ?? "No snapshot available yet."}</p>
            </article>

            <article className="card">
              <h3 style={{ marginTop: 0 }}>Abortion Access</h3>
              <p>{data?.abortion_summary ?? "No snapshot available yet."}</p>
            </article>

            {!!data?.links?.length && (
              <article className="card">
                <h3 style={{ marginTop: 0 }}>Resources</h3>
                <ul>
                  {data.links.map((l, i) => (
                    <li key={i}>
                      <a href={l.url} target="_blank" rel="noreferrer">
                        {l.label || l.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            )}
          </section>
        </>
      )}
    </div>
  );
}
