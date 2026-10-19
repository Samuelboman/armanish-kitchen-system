import { useState } from "react";
import { Loader2 } from "lucide-react";
import Dialog from "./Dialog";
import Button from "./Button";

// "Are you sure?" dialog. onConfirm may be async; errors are shown in the dialog.
export default function ConfirmDialog({ open, onClose, title, children, confirmLabel = "Delete", onConfirm }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    if (busy) return;
    setError("");
    onClose();
  };

  const confirm = async () => {
    setBusy(true);
    setError("");
    try {
      await onConfirm();
      setBusy(false);
      onClose();
    } catch (err) {
      setBusy(false);
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={close} title={title}>
      <div className="text-muted">{children}</div>
      {error && (
        <p role="alert" className="mt-4 rounded-2xl bg-red p-3 text-white">
          {error}
        </p>
      )}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={close} disabled={busy}>
          Cancel
        </Button>
        <Button variant="danger" onClick={confirm} disabled={busy}>
          {busy && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
