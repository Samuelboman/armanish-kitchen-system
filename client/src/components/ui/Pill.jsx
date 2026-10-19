import { cx } from "../../lib/cx";

const tones = {
  yellow: "bg-yellow text-ink",
  orange: "bg-orange text-ink",
  subtle: "bg-subtle text-ink",
  ink: "bg-ink text-white",
  white: "bg-white text-ink",
};

// Small rounded label, e.g. the "MENU" tab or "Not available". Not clickable.
export default function Pill({ tone = "yellow", className, ...props }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 font-display text-xs font-bold uppercase tracking-wide",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
