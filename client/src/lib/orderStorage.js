// Remembers the secret token for orders placed in this browser, so the confirmation
// page can show the full order (name, address) after a refresh. The server only
// gives the token once, when the order is placed. Kept for the last few orders.

const STORAGE_KEY = "armanish-delight-orders-v1";
const MAX_ORDERS = 20;

function readAll() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter((o) => o && typeof o.id === "string" && typeof o.token === "string") : [];
  } catch {
    return [];
  }
}

export function saveOrderToken(id, token) {
  if (!id || !token) return;
  try {
    const others = readAll().filter((o) => o.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id, token }, ...others].slice(0, MAX_ORDERS)));
  } catch {
    // Storage unavailable: the page still works now, just not after a refresh.
  }
}

export function getOrderToken(id) {
  return readAll().find((o) => o.id === id)?.token ?? null;
}
