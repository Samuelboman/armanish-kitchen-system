import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

// Modal built on the native <dialog>: focus is kept inside, Escape closes, and the
// page behind is inert. Content only renders while open, so forms start fresh.
export default function Dialog({ open, onClose, title, children }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-lg overflow-y-auto rounded-card bg-surface p-0 text-ink shadow-lift backdrop:bg-ink/60"
    >
      {open && (
        <div className="p-5 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 id={titleId} className="font-display text-xl font-bold">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-full hover:bg-ink/5"
              aria-label="Close"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
