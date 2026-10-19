import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

// Loads the public menu (GET /api/menu), including unavailable items.
// Returns { items, status: "loading" | "ready" | "error", error, reload }.
export function useMenu() {
  const [state, setState] = useState({ items: [], status: "loading", error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    apiFetch("/api/menu", { signal: controller.signal })
      .then((result) => setState({ items: result.data ?? [], status: "ready", error: null }))
      .catch((error) => {
        if (error.name !== "AbortError") setState((s) => ({ ...s, status: "error", error }));
      });
    return () => controller.abort();
  }, [attempt]);

  const reload = useCallback(() => {
    setState((s) => ({ ...s, status: "loading", error: null }));
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, reload };
}
