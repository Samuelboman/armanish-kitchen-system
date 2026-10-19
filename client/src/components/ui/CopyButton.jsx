import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cx } from "../../lib/cx";

// Copies `value` to the clipboard. `label` says what is copied, for screen readers.
export default function CopyButton({ value, label, className }) {
  const [state, setState] = useState("idle"); // idle | copied | failed

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={cx(
          "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold hover:bg-ink/5",
          className
        )}
      >
        {state === "copied" ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
        {state === "copied" ? "Copied" : "Copy"}
        <span className="sr-only"> {label}</span>
      </button>
      <span role="status" className="sr-only">
        {state === "copied" ? `${label} copied` : state === "failed" ? "Couldn't copy. Please copy it by hand." : ""}
      </span>
    </>
  );
}
