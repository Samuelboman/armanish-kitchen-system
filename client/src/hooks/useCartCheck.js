import { useEffect, useMemo } from "react";
import { useMenu } from "./useMenu";
import { useCart } from "../context/cart-context";

// Checks the cart against the live menu: refreshes names and prices, and flags lines
// the server would refuse. Returns { menu, problems: Map(lineKey -> message), hasProblems }.
export function useCartCheck() {
  const menu = useMenu();
  const { lines, refreshFromMenu } = useCart();

  useEffect(() => {
    if (menu.status === "ready") refreshFromMenu(menu.items);
  }, [menu.status, menu.items, refreshFromMenu]);

  const problems = useMemo(() => {
    const found = new Map();
    if (menu.status !== "ready") return found;
    const byId = new Map(menu.items.map((item) => [item._id, item]));
    for (const line of lines) {
      const item = byId.get(line.menuItemId);
      const options = item?.accompaniments ?? [];
      if (!item) {
        found.set(line.key, "This item is no longer on the menu. Please remove it.");
      } else if (item.available === false) {
        found.set(line.key, "This item isn't available right now. Please remove it.");
      } else if (options.length > 0 ? !options.includes(line.accompaniment) : Boolean(line.accompaniment)) {
        found.set(line.key, "This option is no longer offered. Please remove it and add the item again.");
      }
    }
    return found;
  }, [menu.status, menu.items, lines]);

  return { menu, problems, hasProblems: problems.size > 0 };
}
