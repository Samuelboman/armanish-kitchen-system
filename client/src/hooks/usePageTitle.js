import { useEffect } from "react";
import { BUSINESS } from "../config/business";

// Sets the browser tab title, e.g. "Cart | Armanish Delight".
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BUSINESS.name}` : BUSINESS.name;
  }, [title]);
}
