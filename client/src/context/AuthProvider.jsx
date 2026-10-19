import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
import { ApiError, apiFetch } from "../lib/api";

const STORAGE_KEY = "armanish-delight-admin-v1";

function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return saved && typeof saved.token === "string" && saved.user?.role === "admin" ? saved : null;
  } catch {
    return null;
  }
}

function save(session) {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Not saved: the admin stays signed in for this visit only.
  }
}

// Admin sign-in. The token from POST /api/auth/login is kept in this browser and
// checked against GET /api/auth/me on load. Only the admin role is let in.
export default function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSaved); // { token, user } or null
  const [status, setStatus] = useState(() => (loadSaved() ? "checking" : "signedOut"));
  const [notice, setNotice] = useState(""); // e.g. "Your session has ended..."

  const logout = useCallback((message = "") => {
    save(null);
    setSession(null);
    setStatus("signedOut");
    setNotice(message);
  }, []);

  // Check a saved login once, when the app loads.
  useEffect(() => {
    if (status !== "checking" || !session) return;
    apiFetch("/api/auth/me", { token: session.token })
      .then((result) => {
        if (result.user?.role === "admin") setStatus("signedIn");
        else logout("This account no longer has admin access.");
      })
      .catch((error) => {
        if (error.status === 401) logout("Your session has ended. Please log in again.");
        else setStatus("signedIn"); // server unreachable: let pages show their own errors
      });
  }, [status, session, logout]);

  const login = useCallback(async (email, password) => {
    const result = await apiFetch("/api/auth/login", { method: "POST", body: { email, password } });
    if (result.user?.role !== "admin") {
      throw new ApiError("This account doesn't have admin access.", { status: 403 });
    }
    const next = { token: result.token, user: result.user };
    save(next);
    setSession(next);
    setStatus("signedIn");
    setNotice("");
  }, []);

  // apiFetch with the admin token. A 401 means the login has expired: sign out.
  const authFetch = useCallback(
    async (path, options = {}) => {
      try {
        return await apiFetch(path, { ...options, token: session?.token });
      } catch (error) {
        if (error.status === 401) logout("Your session has ended. Please log in again.");
        throw error;
      }
    },
    [session, logout]
  );

  const value = useMemo(
    () => ({ status, user: session?.user ?? null, notice, login, logout, authFetch }),
    [status, session, notice, login, logout, authFetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
