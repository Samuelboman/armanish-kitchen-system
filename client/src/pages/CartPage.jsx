import { Link } from "react-router";
import { ArrowRight, CircleAlert, ShoppingBag, Trash2 } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import FoodImage from "../components/ui/FoodImage";
import QuantityStepper from "../components/ui/QuantityStepper";
import StatusMessage from "../components/ui/StatusMessage";
import SectionLink from "../components/layout/SectionLink";
import { useCart } from "../context/cart-context";
import { MAX_QUANTITY } from "../context/CartProvider";
import { useCartCheck } from "../hooks/useCartCheck";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatNaira } from "../lib/format";
import { cx } from "../lib/cx";

function CartLine({ line, problem, onQuantity, onRemove }) {
  const label = line.accompaniment ? `${line.name} with ${line.accompaniment}` : line.name;
  return (
    <li className={cx("flex gap-4 py-4", problem && "rounded-2xl bg-red/5 px-3")}>
      <FoodImage src={line.image} alt="" className="size-20 shrink-0 rounded-image sm:size-24" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display font-bold leading-snug">{line.name}</p>
            {line.accompaniment && <p className="text-sm text-muted">with {line.accompaniment}</p>}
            <p className="text-sm text-muted">
              {formatNaira(line.price)} each{line.unit ? ` · ${line.unit}` : ""}
            </p>
          </div>
          <p className="shrink-0 font-display font-bold tabular-nums">{formatNaira(line.price * line.quantity)}</p>
        </div>

        {problem && (
          <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {problem}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between gap-3">
          <QuantityStepper value={line.quantity} onChange={onQuantity} max={MAX_QUANTITY} label={label} />
          {/* Icon only on phones (the label still reads "Remove ..." to screen readers). */}
          <Button variant="ghost" size="sm" onClick={onRemove} className="min-w-11 px-3 sm:px-4">
            <Trash2 className="size-4 shrink-0" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Remove</span>
            <span className="sr-only"> {label}</span>
          </Button>
        </div>
      </div>
    </li>
  );
}

// Cart: change quantities, remove lines, see the subtotal, go to checkout.
export default function CartPage() {
  usePageTitle("Your cart");
  const { lines, count, subtotal, setQuantity, removeLine } = useCart();
  const { menu, problems, hasProblems } = useCartCheck();

  if (lines.length === 0) {
    return (
      <div className="px-4 py-16">
        <StatusMessage
          icon={ShoppingBag}
          title="Your cart is empty"
          actions={
            <Button as={SectionLink} id="menu" size="lg">
              Browse the menu
            </Button>
          }
        >
          Add something from the menu and it will show up here.
        </StatusMessage>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="display-heading text-3xl sm:text-4xl">Your cart</h1>
      <p className="mt-1 text-muted">
        {count} item{count === 1 ? "" : "s"}
      </p>

      {hasProblems && (
        <p role="alert" className="mt-5 flex items-start gap-2 rounded-2xl bg-red px-4 py-3 font-medium text-white">
          <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          Some items can&apos;t be ordered right now. Remove them to continue.
        </p>
      )}
      {menu.status === "error" && (
        <p className="mt-5 rounded-2xl bg-subtle px-4 py-3 text-sm">
          We couldn&apos;t check the latest menu. Prices are confirmed again when you place your order.
        </p>
      )}

      <Card className="mt-6 px-4 sm:px-6">
        <ul className="divide-y divide-line">
          {lines.map((line) => (
            <CartLine
              key={line.key}
              line={line}
              problem={problems.get(line.key)}
              onQuantity={(quantity) => setQuantity(line.key, quantity)}
              onRemove={() => removeLine(line.key)}
            />
          ))}
        </ul>
      </Card>

      <Card className="mt-5 p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-display text-lg font-bold">Subtotal</p>
          <p className="font-display text-2xl font-bold tabular-nums">{formatNaira(subtotal)}</p>
        </div>
        <p className="mt-1 text-sm text-muted">Delivery fee, if any, is added at checkout. Pickup is free.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row-reverse sm:justify-between">
          <Button
            as={hasProblems ? "button" : Link}
            to={hasProblems ? undefined : "/checkout"}
            disabled={hasProblems || undefined}
            size="lg"
          >
            Go to checkout <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
          <Button as={SectionLink} id="menu" variant="ghost" size="lg">
            Add more food
          </Button>
        </div>
      </Card>
    </div>
  );
}
