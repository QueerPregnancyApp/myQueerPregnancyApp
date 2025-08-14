import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE || "http://localhost:8080";

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
          <p style={{ color: "var(--muted)" }}>Last updated: {lastUpdated}</p>

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
