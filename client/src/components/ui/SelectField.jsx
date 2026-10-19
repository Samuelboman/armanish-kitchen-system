import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { fieldClass } from "./TextField";
import { cx } from "../../lib/cx";

// Labelled native <select> (best on phones) styled like TextField.
export default function SelectField({ label, hint, error, children, className, ...selectProps }) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {selectProps.required && <span className="font-normal text-muted"> (required)</span>}
      </label>
      {hint && (
        <p id={hintId} className="mb-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={cx(hintId, errorId) || undefined}
          className={cx(fieldClass, "appearance-none pr-11")}
          {...selectProps}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2" aria-hidden="true" />
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-red">
          {error}
        </p>
      )}
    </div>
  );
}
