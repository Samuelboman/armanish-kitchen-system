import { cx } from "../../lib/cx";

// On/off switch with a 44px tap target. The label stays the same; the state is
// read out as "on" or "off" (role="switch").
export default function Switch({ checked, onChange, label, hideLabel = false, disabled = false, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={cx("inline-flex min-h-11 items-center gap-2 rounded-full disabled:opacity-50", className)}
    >
      <span
        aria-hidden="true"
        className={cx(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-ink" : "bg-field"
        )}
      >
        <span
          className={cx(
            "absolute left-0 top-1 size-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </span>
      <span className={cx("text-sm font-semibold", hideLabel && "sr-only")}>{label}</span>
    </button>
  );
}
