import { useCallback, useEffect, useMemo, useState } from "react";
import { CartContext } from "./cart-context";

const STORAGE_KEY = "armanish-delight-cart-v1";
export const MAX_QUANTITY = 99; // same limit as the server

// One line per menu item + option, so adding "Masa with Yaji" twice gives one line
// with quantity 2, while "Masa with Miyan Gyada" is a separate line (B3).
const lineKey = (menuItemId, accompaniment) => `${menuItemId}|${accompaniment || ""}`;

const isValidLine = (line) =>
  line &&
  typeof line.menuItemId === "string" &&
  typeof line.name === "string" &&
  Number.isFinite(line.price) &&
  Number.isInteger(line.quantity) &&
  line.quantity >= 1;

// The cart is kept in the browser so a refresh doesn't empty it. Storage can be
// unavailable (private mode, blocked), so every access is guarded.
function loadLines() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved
      .filter(isValidLine)
      .map((line) => ({ ...line, accompaniment: line.accompaniment || "", key: lineKey(line.menuItemId, line.accompaniment) }));
  } catch {
    return [];
  }
}

function saveLines(lines) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Not saved; the cart still works for this visit.
  }
}

export default function CartProvider({ children }) {
  const [lines, setLines] = useState(loadLines);

  useEffect(() => saveLines(lines), [lines]);

  const addItem = useCallback((item, accompaniment = "", quantity = 1) => {
    const key = lineKey(item._id, accompaniment);
    setLines((current) => {
      const existing = current.find((line) => line.key === key);
      if (existing) {
        return current.map((line) =>
          line.key === key ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + quantity) } : line
        );
      }
      return [
        ...current,
        {
          key,
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit || "",
          image: item.image || "",
          accompaniment: accompaniment || "",
          quantity: Math.min(MAX_QUANTITY, quantity),
        },
      ];
    });
  }, []);

  const setQuantity = useCallback((key, quantity) => {
    setLines((current) =>
      current.map((line) =>
        line.key === key ? { ...line, quantity: Math.max(1, Math.min(MAX_QUANTITY, quantity)) } : line
      )
    );
  }, []);

  const removeLine = useCallback((key) => {
    setLines((current) => current.filter((line) => line.key !== key));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  // Bring names, prices and photos up to date with the latest menu, so the cart
  // shows what the server will charge. Lines for items no longer on the menu are
  // kept (the cart page flags them) rather than silently dropped.
  const refreshFromMenu = useCallback((menuItems) => {
    const byId = new Map(menuItems.map((item) => [item._id, item]));
    setLines((current) => {
      let changed = false;
      const next = current.map((line) => {
        const item = byId.get(line.menuItemId);
        if (!item) return line;
        const updated = { ...line, name: item.name, price: item.price, unit: item.unit || "", image: item.image || "" };
        if (updated.name !== line.name || updated.price !== line.price || updated.unit !== line.unit || updated.image !== line.image) {
          changed = true;
          return updated;
        }
        return line;
      });
      return changed ? next : current;
    });
  }, []);

  const value = useMemo(() => {
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
    return { lines, count, subtotal, addItem, setQuantity, removeLine, clearCart, refreshFromMenu };
  }, [lines, addItem, setQuantity, removeLine, clearCart, refreshFromMenu]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
