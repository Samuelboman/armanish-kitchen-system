import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

// { status: "checking" | "signedIn" | "signedOut", user, notice, login, logout, authFetch }
export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth must be used inside <AuthProvider>");
  return auth;
}
