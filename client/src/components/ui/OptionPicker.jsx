import { useId } from "react";
import { Check } from "lucide-react";

// A row of pill-shaped radio buttons, e.g. "Serve with: Miyan Gyada | Yaji".
// Real radio inputs underneath, so arrow keys and screen readers work as expected.
export default function OptionPicker({ legend, options, value, onChange }) {
  const name = useId();

  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option;
          return (
            <label key={option} className="cursor-pointer">
              <input
                type="radio"
                name={name}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                className="peer sr-only"
              />
              <span
                className={
                  "inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 px-4 text-sm font-medium transition-colors " +
                  "peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink " +
                  (selected ? "border-ink bg-yellow text-ink" : "border-field bg-surface text-ink hover:bg-page")
                }
              >
                {selected && <Check className="size-4" aria-hidden="true" />}
                {option}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
