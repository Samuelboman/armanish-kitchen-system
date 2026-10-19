import { Link } from "react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../context/cart-context";
import { formatNaira } from "../lib/format";

// Sticky bar at the bottom of the menu page once something is in the cart.
// Renders a spacer too, so the bar never covers the end of the page.
export default function CartBar() {
  const { count, subtotal } = useCart();
  if (count === 0) return null;

  return (
    <>
      <div aria-hidden="true" className="h-24" />
      <div className="fixed inset-x-0 bottom-0 z-20 px-3 pb-3 sm:px-6 sm:pb-5">
        <Link
          to="/cart"
          className="mx-auto flex min-h-14 max-w-xl items-center justify-between gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-white shadow-lift"
        >
          <span className="flex items-center gap-3">
            <ShoppingBag className="size-5" aria-hidden="true" />
            <span className="text-sm">
              <span className="font-semibold">
                {count} item{count === 1 ? "" : "s"}
              </span>{" "}
              · {formatNaira(subtotal)}
            </span>
          </span>
          <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-orange px-5 font-display font-semibold text-ink">
            View cart <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </Link>
      </div>
    </>
  );
}
