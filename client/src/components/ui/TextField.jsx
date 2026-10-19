import { useId } from "react";
import { cx } from "../../lib/cx";

export const fieldClass =
  "block w-full min-h-12 rounded-xl border-2 border-field bg-surface px-4 py-2.5 text-base text-ink " +
  "placeholder:text-muted/80 focus-visible:border-ink focus-visible:outline-3 focus-visible:outline-offset-1 " +
  "aria-[invalid=true]:border-red";

// Labelled input with optional hint and error text, wired up for screen readers.
// Pass multiline for a <textarea>.
export default function TextField({ label, hint, error, multiline = false, className, ...inputProps }) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const Input = multiline ? "textarea" : "input";

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {inputProps.required && <span className="text-muted font-normal"> (required)</span>}
      </label>
      {hint && (
        <p id={hintId} className="mb-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      <Input
        id={id}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={cx(hintId, errorId) || undefined}
        className={cx(fieldClass, multiline && "min-h-24 resize-y")}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-red">
          {error}
        </p>
      )}
    </div>
  );
}
