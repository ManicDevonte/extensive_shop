const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:4000" : "");
const TOKEN_KEY = "ea_auth_token";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function storeSession(data) {
  localStorage.setItem(TOKEN_KEY, data.token);
  return data.user;
}

export async function signIn(credentials) {
  return storeSession(await request("/api/auth/login", { method: "POST", body: JSON.stringify(credentials) }));
}

export async function signUp(details) {
  return storeSession(await request("/api/auth/signup", { method: "POST", body: JSON.stringify(details) }));
}

export async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  try {
    return (await request("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })).user;
  } catch {
    clearToken();
    return null;
  }
}
