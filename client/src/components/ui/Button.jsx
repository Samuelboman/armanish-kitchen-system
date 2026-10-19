import { cx } from "../../lib/cx";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold " +
  "transition-colors duration-150 select-none active:scale-[0.98] " +
  "disabled:pointer-events-none disabled:opacity-50";

// Orange and yellow buttons always use near-black text (white fails contrast on both).
const variants = {
  primary: "bg-orange text-ink hover:bg-orange-hover", // main actions
  dark: "bg-ink text-white hover:bg-ink/85", // strong secondary action
  outline: "border-2 border-ink text-ink hover:bg-ink hover:text-white", // hero "Order now"
  ghost: "text-ink hover:bg-ink/5", // low-emphasis actions
  danger: "bg-red text-white hover:bg-red/90", // delete (admin)
};

// Every size is at least 44px tall, the minimum comfortable tap target.
const sizes = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-12 px-6 text-base",
  lg: "min-h-14 px-8 text-lg",
  icon: "size-11 shrink-0",
};

// A pill button. Renders a <button> by default; pass `as` to render a link
// (e.g. as={Link} to="/cart", or as="a" href="...") with the same look.
export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  ...props
}) {
  const defaults = Component === "button" && !props.type ? { type: "button" } : {};
  return (
    <Component
      className={cx(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...defaults}
      {...props}
    />
  );
}
