import { useEffect, useState } from "react";

// A short confirmation that clears itself after a few seconds, e.g. "Saved Masa."
// Returns [notice, setNotice]; notice is { text, tone: "error" | undefined } or null.
export function useNotice() {
  const [notice, setNotice] = useState(null);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);
  return [notice, setNotice];
}
