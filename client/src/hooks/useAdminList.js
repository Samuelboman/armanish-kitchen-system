import { useCallback, useEffect, useState } from "react";

// Loads a list for an admin page and lets the page edit it locally after saves.
// `load(signal)` returns a promise of an array. Returns { items, setItems, status, error, reload }.
export function useAdminList(load) {
  const [state, setState] = useState({ items: [], status: "loading", error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal)
      .then((items) => setState({ items: items ?? [], status: "ready", error: null }))
      .catch((error) => {
        if (error.name !== "AbortError") setState((s) => ({ ...s, status: "error", error }));
      });
    return () => controller.abort();
  }, [load, attempt]);

  const reload = useCallback(() => {
    setState((s) => ({ ...s, status: "loading", error: null }));
    setAttempt((n) => n + 1);
  }, []);

  const setItems = useCallback((update) => {
    setState((s) => ({ ...s, items: typeof update === "function" ? update(s.items) : update }));
  }, []);

  return { ...state, setItems, reload };
}
