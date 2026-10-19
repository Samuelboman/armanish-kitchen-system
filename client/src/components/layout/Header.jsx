import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";
import SectionLink from "./SectionLink";
import { useCart } from "../../context/cart-context";
import { BUSINESS } from "../../config/business";

const navLinks = [
  { id: "menu", label: "Menu" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

// Logo left, Menu / About / Contact, and the cart with its item count.
// No account icon: customers check out as guests.
export default function Header() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-30 bg-hero text-on-hero shadow-[0_1px_0_rgb(1_1_1/0.08)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-h-11 shrink-0 items-center rounded-lg">
          <img
            src="/images/logo.png"
            alt={`${BUSINESS.name} home`}
            width="315"
            height="246"
            className="h-10 w-auto sm:h-14"
          />
        </Link>

        <nav aria-label="Main" className="flex items-center gap-0.5 sm:gap-2">
          {navLinks.map((link) => (
            <SectionLink
              key={link.id}
              id={link.id}
              className="inline-flex min-h-11 items-center rounded-full px-2 font-display text-[0.8rem] font-semibold uppercase hover:bg-ink/10 sm:px-4 sm:text-sm sm:tracking-wide"
            >
              {link.label}
            </SectionLink>
          ))}
        </nav>

        <Link
          to="/cart"
          className="relative grid size-11 shrink-0 place-items-center rounded-full bg-white text-ink shadow-card transition-transform hover:scale-105 sm:size-12"
          aria-label={count > 0 ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart, empty"}
        >
          <ShoppingBag className="size-5" aria-hidden="true" />
          {count > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] font-bold leading-none text-white"
            >
              {count > 99 ? "99+" : count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
