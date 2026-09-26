import { useState } from "react";

export default function MenuCard({ item, onAddToCart }) {
  const hasOptions = item.accompaniments && item.accompaniments.length > 0;
  const [selectedOption, setSelectedOption] = useState(
    hasOptions ? item.accompaniments[0] : null
  );

  const handleAdd = () => {
    onAddToCart(item, selectedOption);
  };

  return (
    <div className="flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-charcoal/5">
      {/* Colored icon block standing in for a food photo */}
      <div className="mb-3 flex h-28 items-center justify-center rounded-xl bg-amber/15 font-display text-4xl font-bold text-amber">
        {item.name.charAt(0)}
      </div>

      <h3 className="font-display text-lg font-semibold text-charcoal">
        {item.name}
      </h3>
      {item.description && (
        <p className="mt-1 text-sm text-charcoal/60">{item.description}</p>
      )}

      {hasOptions && (
        <div className="mt-3">
          <label className="mb-1 block text-xs font-medium text-charcoal/50">
            Serve with
          </label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm"
          >
            {item.accompaniments.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="font-display text-lg font-bold text-indigo">
          ₦{item.price}
        </span>
        <button
          onClick={handleAdd}
          className="rounded-full bg-indigo px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-indigo-dark"
        >
          Add
        </button>
      </div>
    </div>
  );
}