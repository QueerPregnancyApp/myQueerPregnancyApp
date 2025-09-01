import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, me } from "../lib/api.js"; // uses credentials:'include'

export default function LoginForm({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      await login({ username, password }); // sets httpOnly cookie on success
      const u = await me();                // fetch current user
      if (u?.id) {
        setUser(u);
        navigate("/");
      } else {
        setErr("Login failed. Please check your credentials.");
      }
    } catch (e) {
      setErr("Login error. Please try again.");
      console.error(e);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 480 }}>
      <h2 className="h2">Login</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          autoComplete="username"
          required
        />
        <label htmlFor="password" style={{ marginTop: 8 }}>Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          autoComplete="current-password"
          required
        />
        <div style={{ marginTop: 12 }}>
          <button className="btn primary" type="submit">Log in</button>
        </div>
      </form>
    </div>
  );
}
