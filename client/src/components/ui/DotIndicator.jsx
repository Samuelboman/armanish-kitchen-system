import { cx } from "../../lib/cx";

const dotClass = (isActive) =>
  cx("block h-2 rounded-full transition-all duration-200", isActive ? "w-6 bg-ink" : "w-2 bg-field");

// Small dots under a swipeable row. With onSelect, each dot is a button with a 44px
// tap area; without it, the dots are decorative and hidden from screen readers.
export default function DotIndicator({ count, active, onSelect, label = "Item", className }) {
  if (!onSelect) {
    return (
      <div aria-hidden="true" className={cx("flex items-center justify-center gap-1.5", className)}>
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={dotClass(i === active)} />
        ))}
      </div>
    );
  }

  return (
    <div className={cx("flex items-center justify-center", className)}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`${label} ${i + 1} of ${count}`}
          aria-current={i === active ? "true" : undefined}
          className="grid h-11 min-w-6 place-items-center px-1"
        >
          <span className={dotClass(i === active)} />
        </button>
      ))}
    </div>
  );
}
