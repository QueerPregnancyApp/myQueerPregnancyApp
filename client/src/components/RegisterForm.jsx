import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, me } from "../lib/api.js";

export default function RegisterForm({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      await register({ username, password }); // sets httpOnly cookie
      const u = await me();
      if (u?.id) {
        setUser(u);
        navigate("/");
      } else {
        setErr("Registration failed. Please try again.");
      }
    } catch (e) {
      setErr("Registration error. Please try again.");
      console.error(e);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 520 }}>
      <h2 className="h2">Create account</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="reg-username">Username</label>
        <input
          id="reg-username"
          type="text"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          autoComplete="username"
          required
        />
        <label htmlFor="reg-password" style={{ marginTop: 8 }}>Password</label>
        <input
          id="reg-password"
          type="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          autoComplete="new-password"
          required
        />
        <div style={{ marginTop: 12 }}>
          <button className="btn primary" type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}

