import { useId, useState } from "react";
import { Plus, X } from "lucide-react";
import Button from "../ui/Button";
import { fieldClass } from "../ui/TextField";

// Edit an item's options (accompaniments), e.g. "Miyan Gyada", "Yaji".
// Customers must pick one of these when the list isn't empty.
export default function OptionsEditor({ value, onChange }) {
  const [draft, setDraft] = useState("");
  const inputId = useId();

  const add = () => {
    const option = draft.trim();
    if (option && !value.includes(option)) onChange([...value, option]);
    setDraft("");
  };

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold">
        Options (&quot;Serve with&quot;)
      </label>
      <p className="mb-2 text-sm text-muted">Leave empty if the item has no choices.</p>
      {value.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-2">
          {value.map((option) => (
            <li key={option} className="inline-flex items-center gap-0.5 rounded-full bg-yellow pl-4 text-sm font-medium">
              {option}
              <button
                type="button"
                onClick={() => onChange(value.filter((o) => o !== option))}
                className="grid size-11 place-items-center rounded-full hover:bg-ink/10"
                aria-label={`Remove option ${option}`}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          id={inputId}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="e.g. Yaji"
          className={fieldClass}
        />
        <Button variant="dark" onClick={add} disabled={!draft.trim()} className="shrink-0">
          <Plus className="size-5" aria-hidden="true" /> Add
        </Button>
      </div>
    </div>
  );
}
