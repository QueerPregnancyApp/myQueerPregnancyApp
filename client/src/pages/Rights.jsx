import { useEffect, useState } from "react";

const STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DC",
  "DE",
  "FL",
  "GA",
  "HI",
  "IA",
  "ID",
  "IL",
  "IN",
  "KS",
  "KY",
  "LA",
  "MA",
  "MD",
  "ME",
  "MI",
  "MN",
  "MO",
  "MS",
  "MT",
  "NC",
  "ND",
  "NE",
  "NH",
  "NJ",
  "NM",
  "NV",
  "NY",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VA",
  "VT",
  "WA",
  "WI",
  "WV",
  "WY",
];

export default function Rights() {
  const [state, setState] = useState("CA");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`/api/rights/${state}`);
        const json = await res.json();
        if (!ignore) setData(json);
      } catch (e) {
        if (!ignore) setErr("Could not load rights info.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [state]);

  return (
    <section className="card">
      <h1>Know Your Rights</h1>
      <label>
        State:{" "}
        <select value={state} onChange={(e) => setState(e.target.value)}>
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      {loading && <p>Loading…</p>}
      {err && <p>{err}</p>}
      {data && (
        <>
          <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
            Sources:{" "}
            {Array.isArray(data.citations) &&
              data.citations.map((u, i) => (
                <a key={i} href={u} target="_blank" rel="noreferrer">
                  [{i + 1}]
                </a>
              ))}
          </p>
          {/* render sections once your adapter returns real content */}
        </>
      )}
    </section>
  );
}
