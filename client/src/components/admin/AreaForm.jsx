import { useState } from "react";
import { Loader2 } from "lucide-react";
import Button from "../ui/Button";
import TextField from "../ui/TextField";
import Switch from "../ui/Switch";
import { useAuth } from "../../context/auth-context";

// Add or edit a delivery area. `area` is null for a new one. Calls onSaved(savedArea).
export default function AreaForm({ area, onSaved, onCancel }) {
  const { authFetch } = useAuth();
  const [name, setName] = useState(area?.name ?? "");
  const [fee, setFee] = useState(area ? String(area.fee) : "");
  const [active, setActive] = useState(area?.active ?? true);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = {};
    const feeNumber = Number(fee);
    if (!name.trim()) found.name = "Enter the area name";
    if (fee === "" || !Number.isFinite(feeNumber) || feeNumber < 0) found.fee = "Enter a fee of 0 or more";
    setErrors(found);
    if (Object.keys(found).length) return;

    setBusy(true);
    setServerError("");
    try {
      const body = { name: name.trim(), fee: feeNumber, active };
      const result = area
        ? await authFetch(`/api/delivery-areas/${area._id}`, { method: "PUT", body })
        : await authFetch("/api/delivery-areas", { method: "POST", body });
      onSaved(result.data);
    } catch (error) {
      setBusy(false);
      setServerError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <TextField label="Area name" required value={name} onChange={(e) => setName(e.target.value)} error={errors.name} maxLength={80} />
      <TextField
        label="Delivery fee (₦)"
        required
        type="number"
        inputMode="decimal"
        min="0"
        step="any"
        value={fee}
        onChange={(e) => setFee(e.target.value)}
        error={errors.fee}
      />
      <Switch checked={active} onChange={setActive} label="Offer this area at checkout" />
      {serverError && (
        <p role="alert" className="rounded-2xl bg-red p-3 text-white">
          {serverError}
        </p>
      )}
      <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button type="submit" disabled={busy}>
          {busy && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}
          {area ? "Save changes" : "Add area"}
        </Button>
      </div>
    </form>
  );
}
