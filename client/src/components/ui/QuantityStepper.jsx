import { Minus, Plus } from "lucide-react";
import { cx } from "../../lib/cx";

// − 2 + control. `label` names what is being counted, e.g. "Masa", for screen readers.
export default function QuantityStepper({ value, onChange, min = 1, max = 99, label, className }) {
  const buttonClass =
    "grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 " +
    "disabled:pointer-events-none disabled:opacity-35";

  return (
    <div
      role="group"
      aria-label={label ? `Quantity of ${label}` : "Quantity"}
      className={cx("inline-flex items-center rounded-full bg-page ring-1 ring-field", className)}
    >
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={label ? `One less ${label}` : "Decrease quantity"}
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <span className="min-w-7 text-center font-display font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={label ? `One more ${label}` : "Increase quantity"}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
