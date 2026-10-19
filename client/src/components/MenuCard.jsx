import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Pill from "./ui/Pill";
import FoodImage from "./ui/FoodImage";
import OptionPicker from "./ui/OptionPicker";
import QuantityStepper from "./ui/QuantityStepper";
import { formatNaira } from "../lib/format";
import { cx } from "../lib/cx";

// One menu item: photo, name, price, unit, description, option choice, quantity and Add.
// Unavailable items stay visible but greyed out, with a "Not available" label and no Add.
export default function MenuCard({ item, onAdd }) {
  const options = item.accompaniments ?? [];
  const [option, setOption] = useState(options[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(0); // quantity just added, 0 when idle
  const available = item.available !== false;

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(0), 1600);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const handleAdd = () => {
    onAdd?.(item, option, quantity);
    setJustAdded(quantity);
    setQuantity(1);
  };

  return (
    <Card as="article" className={cx("flex w-full flex-col overflow-hidden", !available && "bg-page")}>
      {/* The image is absolutely positioned so a tall photo can't stretch the 4:3 box. */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <FoodImage
          src={item.image}
          alt={item.name}
          unavailable={!available}
          className={cx("absolute inset-0 size-full", !available && "opacity-70")}
        />
        {!available && (
          <Pill tone="subtle" className="absolute left-3 top-3 shadow-card">
            Not available
          </Pill>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className={cx("font-display text-lg font-bold leading-snug", !available && "text-muted")}>
              {item.name}
            </h3>
            <p className={cx("shrink-0 font-display text-lg font-bold", !available && "text-muted")}>
              {formatNaira(item.price)}
            </p>
          </div>
          {item.unit && <p className="text-sm text-muted">{item.unit}</p>}
        </div>

        {item.description && <p className="text-sm leading-relaxed text-muted">{item.description}</p>}

        {available ? (
          <>
            {options.length > 0 && (
              <OptionPicker legend="Serve with" options={options} value={option} onChange={setOption} />
            )}
            <div className="mt-auto flex items-center gap-3 pt-1">
              <QuantityStepper value={quantity} onChange={setQuantity} label={item.name} />
              <Button onClick={handleAdd} className="flex-1">
                {justAdded ? (
                  <>
                    <Check className="size-5" aria-hidden="true" /> Added
                  </>
                ) : (
                  <>
                    <Plus className="size-5" aria-hidden="true" /> Add
                    <span className="sr-only"> {item.name} to cart</span>
                  </>
                )}
              </Button>
            </div>
            <p role="status" className="sr-only">
              {justAdded ? `Added ${justAdded} ${item.name} to cart` : ""}
            </p>
          </>
        ) : (
          <p className="mt-auto text-sm font-medium text-muted">You can't order this right now.</p>
        )}
      </div>
    </Card>
  );
}
