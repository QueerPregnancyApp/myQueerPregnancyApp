export const API = import.meta.env.VITE_API_BASE || "/api";
const json = (r) => r.ok ? r.json() : Promise.reject(r);

export const register = (user) => fetch(`${API}/auth/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(user),
}).then(json);

export const login = (user) => fetch(`${API}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(user),
}).then(json);

export const me = () => fetch(`${API}/auth/me`, { credentials: "include" }).then(json);
export const logout = () => fetch(`${API}/auth/logout`, { method:"POST", credentials:"include" });
