import { useState } from "react";
import { Loader2 } from "lucide-react";
import Button from "../ui/Button";
import TextField from "../ui/TextField";
import SelectField from "../ui/SelectField";
import Switch from "../ui/Switch";
import ImagePicker from "./ImagePicker";
import OptionsEditor from "./OptionsEditor";
import { CATEGORIES } from "../../config/menu";
import { isValidImagePath } from "../../config/images";
import { useAuth } from "../../context/auth-context";

const emptyItem = {
  name: "",
  category: "masa",
  price: "",
  unit: "",
  description: "",
  accompaniments: [],
  available: true,
  image: "",
};

// Add or edit a menu item. `item` is null for a new one. Calls onSaved(savedItem).
export default function MenuItemForm({ item, onSaved, onCancel }) {
  const { authFetch } = useAuth();
  const [form, setForm] = useState(() =>
    item
      ? {
          ...emptyItem,
          ...item,
          price: String(item.price ?? ""),
          accompaniments: item.accompaniments ?? [],
          unit: item.unit ?? "",
          image: item.image ?? "",
          description: item.description ?? "",
        }
      : emptyItem
  );
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (field) => (value) => setForm((f) => ({ ...f, [field]: value }));
  const setFromEvent = (field) => (event) => set(field)(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = {};
    const price = Number(form.price);
    if (!form.name.trim()) found.name = "Enter a name";
    if (form.price === "" || !Number.isFinite(price) || price < 0) found.price = "Enter a price of 0 or more";
    if (!isValidImagePath(form.image.trim())) found.image = "Fix the image path";
    setErrors(found);
    if (Object.keys(found).length) return;

    setBusy(true);
    setServerError("");
    try {
      const body = {
        name: form.name.trim(),
        category: form.category,
        price,
        unit: form.unit.trim(),
        description: form.description.trim(),
        accompaniments: form.accompaniments,
        available: form.available,
        image: form.image.trim(),
      };
      const result = item
        ? await authFetch(`/api/menu/${item._id}`, { method: "PUT", body })
        : await authFetch("/api/menu", { method: "POST", body });
      onSaved(result.data);
    } catch (error) {
      setBusy(false);
      setServerError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <TextField
        label="Name"
        required
        value={form.name}
        onChange={setFromEvent("name")}
        error={errors.name}
        maxLength={100}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Category" value={form.category} onChange={setFromEvent("category")}>
          {CATEGORIES.filter((c) => c.value !== "all").map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </SelectField>
        <TextField
          label="Price (₦)"
          required
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          value={form.price}
          onChange={setFromEvent("price")}
          error={errors.price}
        />
      </div>
      <TextField
        label="Unit"
        hint='How it is sold, e.g. "per plate" or "50cl bottle".'
        value={form.unit}
        onChange={setFromEvent("unit")}
        maxLength={60}
      />
      <TextField
        label="Description"
        multiline
        rows={3}
        value={form.description}
        onChange={setFromEvent("description")}
        maxLength={500}
      />
      <OptionsEditor value={form.accompaniments} onChange={set("accompaniments")} />
      <ImagePicker value={form.image} onChange={set("image")} />
      <Switch checked={form.available} onChange={set("available")} label="Available to order" />

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
          {item ? "Save changes" : "Add item"}
        </Button>
      </div>
    </form>
  );
}
