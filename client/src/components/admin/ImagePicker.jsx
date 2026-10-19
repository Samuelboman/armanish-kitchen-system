import { useId } from "react";
import { Check, ImageOff } from "lucide-react";
import FoodImage from "../ui/FoodImage";
import TextField from "../ui/TextField";
import { SITE_IMAGES, isValidImagePath } from "../../config/images";
import { cx } from "../../lib/cx";

// Pick one of the site's photos, no photo, or type a path (e.g. /images/new.jpg).
export default function ImagePicker({ value, onChange, error }) {
  const name = useId();
  const choices = [{ path: "", label: "No photo" }, ...SITE_IMAGES];

  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-semibold">Photo</legend>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {choices.map((choice) => {
          const selected = value === choice.path;
          return (
            <label key={choice.path || "none"} className="cursor-pointer">
              <input
                type="radio"
                name={name}
                checked={selected}
                onChange={() => onChange(choice.path)}
                className="peer sr-only"
              />
              <span
                className={cx(
                  "relative block aspect-square overflow-hidden rounded-xl border-[3px]",
                  "peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink",
                  selected ? "border-ink" : "border-transparent"
                )}
              >
                {choice.path ? (
                  <img src={choice.path} alt="" className="size-full object-cover" />
                ) : (
                  <span className="grid size-full place-items-center bg-subtle">
                    <ImageOff className="size-6" aria-hidden="true" />
                  </span>
                )}
                {selected && (
                  <span className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-ink text-white">
                    <Check className="size-4" aria-hidden="true" />
                  </span>
                )}
              </span>
              <span className="sr-only">{choice.label}</span>
            </label>
          );
        })}
      </div>
      <TextField
        className="mt-3"
        label="Or type an image path"
        hint="A file in client/public/images, e.g. /images/masa-plates.jpg, or a full https:// link."
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        error={error || (isValidImagePath(value) ? undefined : "Use a path starting with / (e.g. /images/masa-plates.jpg) or a full https:// link.")}
        placeholder="/images/..."
      />
      {value && isValidImagePath(value) && !SITE_IMAGES.some((img) => img.path === value) && (
        <div className="mt-3 flex items-center gap-3">
          <FoodImage src={value} alt="" className="size-16 rounded-xl" />
          <p className="text-sm text-muted">Preview. If it shows the logo, the path doesn&apos;t point to an image.</p>
        </div>
      )}
    </fieldset>
  );
}
