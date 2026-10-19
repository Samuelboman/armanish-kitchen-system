import { cx } from "../../lib/cx";

// Rounded white card with a soft shadow, the base of menu, info and form cards.
export default function Card({ as: Component = "div", interactive = false, className, ...props }) {
  return (
    <Component
      className={cx(
        "rounded-card bg-surface shadow-card",
        interactive && "transition-shadow duration-200 hover:shadow-lift",
        className
      )}
      {...props}
    />
  );
}
