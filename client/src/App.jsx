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

function fmtTally(t) {
  if (!t) return "";
  const score =
    typeof t.score === "number"
      ? (Math.round(t.score * 100) / 100).toString()
      : String(t.score);
  const max = t.max ?? 49;
  const level = t.level ? ` ${t.level}` : "";
  return `${score}/${max}${level}`;
}

// NEW: pretty percent helper (12.3% or 12%)
function fmtPercent(n) {
  if (typeof n !== "number" || !Number.isFinite(n)) return null;
  const decimals = Number.isInteger(n) ? 0 : 1;
  return `${n.toFixed(decimals)}%`;
}

export default function Rights() {
  const [states, setStates] = useState([]);
  const [stateCode, setStateCode] = useState("CA");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/rights`);
        const json = await res.json();
        if (json?.ok && Array.isArray(json.states)) {
          setStates(json.states);
        } else {
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

  useEffect(() => {
    fetchRights(stateCode);
  }, [stateCode]);

  const lastUpdated = data?.lastUpdated
    ? new Date(data.lastUpdated).toLocaleString()
    : "—";

  const parentageLink =
    data?.links?.find((l) => /lgbtmap\.org/i.test(l.url)) || null;

  const abortionLink =
    data?.links?.find((l) => /reproductiverights\.org/i.test(l.url)) || null;

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
          <h3 style={{ marginBottom: 0 }}>
            {STATE_NAMES[stateCode] || stateCode}
          </h3>
          <p style={{ color: "var(--muted)", marginTop: 4 }}>
            Last updated: {lastUpdated}
          </p>

          <section style={{ display: "grid", gap: 12 }}>
            <article className="card">
              <h3 style={{ marginTop: 0 }}>
                {parentageLink ? (
                  <a href={parentageLink.url} target="_blank" rel="noreferrer">
                    Parentage
                  </a>
                ) : (
                  "Parentage"
                )}
              </h3>

              {/* NEW: the specific MAP stat */}
              <p style={{ fontSize: 14 }}>
                <strong>Percent of LGBTQ Adults (25+) Raising Children:</strong>{" "}
                {fmtPercent(data?.parentage_children_pct) ?? "—"}
              </p>

              {/* Context summary (if present) */}
              <p>{data?.parentage_summary ?? "No snapshot available yet."}</p>

              {/* Always show tally */}
              <p style={{ fontSize: 14, color: "var(--muted)" }}>
                Overall Tally:{" "}
                {data?.parentage_tally ? (
                  <>
                    <strong>{fmtTally(data.parentage_tally)}</strong>{" "}
                    <span
                      style={{
                        fontWeight: "bold",
                        color:
                          {
                            Negative: "crimson",
                            Low: "goldenrod",
                            Fair: "#ddd",
                            Medium: "lightgreen",
                            High: "green",
                          }[data.parentage_tally.level] || "inherit",
                      }}
                    >
                      {data.parentage_tally.level}
                    </span>
                  </>
                ) : (
                  "—"
                )}
              </p>
            </article>

            <article className="card">
              <h3 style={{ marginTop: 0 }}>
                {abortionLink ? (
                  <a href={abortionLink.url} target="_blank" rel="noreferrer">
                    Abortion Access
                  </a>
                ) : (
                  "Abortion Access"
                )}
              </h3>
              <p>{data?.abortion_summary ?? "No snapshot available yet."}</p>
            </article>

            {!!(data?.links && data.links.length) && (
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
