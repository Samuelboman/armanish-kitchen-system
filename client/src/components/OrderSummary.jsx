import { formatNaira } from "../lib/format";

// Items with option and quantity, then subtotal, delivery fee and total.
// `lines`: [{ key, name, accompaniment, quantity, unitPrice }].
// `deliveryFee`: a number, or null when not known yet (shown as `deliveryNote`).
export default function OrderSummary({ lines, subtotal, deliveryFee, deliveryNote, total, totalLabel = "Total" }) {
  return (
    <div>
      <ul className="divide-y divide-line">
        {lines.map((line) => (
          <li key={line.key} className="flex items-start justify-between gap-4 py-3">
            <div>
              <p className="font-semibold">
                {line.quantity} x {line.name}
              </p>
              {line.accompaniment && <p className="text-sm text-muted">with {line.accompaniment}</p>}
            </div>
            {Number.isFinite(line.unitPrice) && (
              <p className="shrink-0 tabular-nums">{formatNaira(line.unitPrice * line.quantity)}</p>
            )}
          </li>
        ))}
      </ul>
      <dl className="mt-2 space-y-2 border-t-2 border-ink pt-4">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Subtotal</dt>
          <dd className="tabular-nums">{formatNaira(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Delivery fee</dt>
          <dd className="text-right tabular-nums">{deliveryFee === null ? deliveryNote : formatNaira(deliveryFee)}</dd>
        </div>
        <div className="flex justify-between gap-4 font-display text-xl font-bold">
          <dt>{totalLabel}</dt>
          <dd className="tabular-nums">{formatNaira(total)}</dd>
        </div>
      </dl>
    </div>
  );
}
