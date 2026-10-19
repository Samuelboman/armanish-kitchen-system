import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Bike, CircleAlert, Loader2, MapPin, RefreshCw, ShoppingBag, Store } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import TextField from "../components/ui/TextField";
import SelectField from "../components/ui/SelectField";
import StatusMessage from "../components/ui/StatusMessage";
import SectionLink from "../components/layout/SectionLink";
import OrderSummary from "../components/OrderSummary";
import BankDetails from "../components/BankDetails";
import { useCart } from "../context/cart-context";
import { useCartCheck } from "../hooks/useCartCheck";
import { usePageTitle } from "../hooks/usePageTitle";
import { apiFetch } from "../lib/api";
import { saveOrderToken } from "../lib/orderStorage";
import { formatNaira } from "../lib/format";
import { cx } from "../lib/cx";
import { BUSINESS } from "../config/business";

// Server error codes that mean "something in the cart is wrong".
const CART_ERRORS = ["ITEM_NOT_FOUND", "ITEM_UNAVAILABLE", "INVALID_OPTION", "INVALID_ITEM", "INVALID_QUANTITY", "NO_ITEMS", "TOO_MANY_ITEMS"];
// Server error codes that belong to a form field.
const FIELD_ERRORS = { NAME_REQUIRED: "name", ORDER_TYPE_REQUIRED: "orderType", AREA_REQUIRED: "area", AREA_UNAVAILABLE: "area", ADDRESS_REQUIRED: "address" };

// Loads the active delivery areas: { areas, status, reload }.
function useDeliveryAreas() {
  const [state, setState] = useState({ areas: [], status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    apiFetch("/api/delivery-areas", { signal: controller.signal })
      .then((result) => setState({ areas: result.data ?? [], status: "ready" }))
      .catch((error) => {
        if (error.name !== "AbortError") setState({ areas: [], status: "error" });
      });
    return () => controller.abort();
  }, [attempt]);

  const reload = useCallback(() => {
    setState({ areas: [], status: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, reload };
}

// Large radio card for Delivery / Pickup.
function OrderTypeChoice({ value, checked, onChange, disabled, icon: Icon, title, note, inputRef }) {
  return (
    <label className={cx("block", disabled ? "cursor-not-allowed" : "cursor-pointer")}>
      <input
        ref={inputRef}
        type="radio"
        name="orderType"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        disabled={disabled}
        className="peer sr-only"
      />
      <span
        className={cx(
          "flex h-full items-start gap-3 rounded-2xl border-2 p-4 transition-colors",
          "peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink",
          checked ? "border-ink bg-yellow" : "border-field bg-surface hover:bg-page",
          disabled && "opacity-60"
        )}
      >
        <span className={cx("grid size-10 shrink-0 place-items-center rounded-full", checked ? "bg-white" : "bg-yellow/40")}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span>
          <span className="block font-display font-bold">{title}</span>
          <span className="block text-sm">{note}</span>
        </span>
      </span>
    </label>
  );
}

export default function CheckoutPage() {
  usePageTitle("Checkout");
  const navigate = useNavigate();
  const { lines, subtotal, clearCart } = useCart();
  const { hasProblems } = useCartCheck();
  const deliveryAreas = useDeliveryAreas();

  const [name, setName] = useState("");
  const [orderType, setOrderType] = useState("");
  const [areaId, setAreaId] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null); // { message, cart: bool }
  const [submitting, setSubmitting] = useState(false);

  const nameRef = useRef(null);
  const orderTypeRef = useRef(null);
  const areaRef = useRef(null);
  const addressRef = useRef(null);
  const serverErrorRef = useRef(null);

  // Editing a field clears its error message.
  const clearError = (field) => setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  const chooseOrderType = (value) => {
    setOrderType(value);
    clearError("orderType");
  };

  // An area that is no longer in the list (e.g. after reloading it) counts as not chosen.
  const area = deliveryAreas.areas.find((a) => a._id === areaId);
  const selectedAreaId = area ? areaId : "";
  const noAreas = deliveryAreas.status === "ready" && deliveryAreas.areas.length === 0;

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
          Add something from the menu before checking out.
        </StatusMessage>
      </div>
    );
  }

  let deliveryFee = null;
  let deliveryNote = "Choose delivery or pickup";
  if (orderType === "pickup") deliveryFee = 0;
  if (orderType === "delivery") {
    if (area) deliveryFee = area.fee;
    else deliveryNote = "Choose your area";
  }

  const validate = () => {
    const found = {};
    if (!name.trim()) found.name = "Please enter your name";
    if (!orderType) found.orderType = "Choose delivery or pickup";
    if (orderType === "delivery") {
      if (!selectedAreaId) found.area = "Choose your delivery area";
      if (!address.trim()) found.address = "Please enter your delivery address";
    }
    return found;
  };

  const focusFirstError = (found) => {
    const fields = [
      ["name", nameRef],
      ["orderType", orderTypeRef],
      ["area", areaRef],
      ["address", addressRef],
    ];
    fields.find(([field]) => found[field])?.[1].current?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setServerError(null);

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(found);
      return;
    }

    setSubmitting(true);
    try {
      const result = await apiFetch("/api/orders", {
        method: "POST",
        body: {
          customerName: name.trim(),
          orderType,
          ...(orderType === "delivery" ? { deliveryArea: selectedAreaId, deliveryAddress: address.trim() } : {}),
          items: lines.map((line) => ({
            menuItem: line.menuItemId,
            quantity: line.quantity,
            accompaniment: line.accompaniment || undefined,
          })),
        },
      });

      const { accessToken, ...order } = result.data;
      saveOrderToken(order._id, accessToken);
      navigate(`/order/${order._id}`, { replace: true, state: { order } });
      clearCart();
    } catch (error) {
      setSubmitting(false);
      const field = FIELD_ERRORS[error.code];
      if (field) {
        const found = { [field]: error.message };
        setErrors(found);
        if (error.code === "AREA_UNAVAILABLE") deliveryAreas.reload();
        focusFirstError(found);
        return;
      }
      setServerError({ message: error.message, cart: CART_ERRORS.includes(error.code) });
      requestAnimationFrame(() => serverErrorRef.current?.focus());
    }
  };

  const summaryLines = lines.map((line) => ({ ...line, unitPrice: line.price }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="display-heading text-3xl sm:text-4xl">Checkout</h1>

      {hasProblems && (
        <p role="alert" className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl bg-red px-4 py-3 font-medium text-white">
          <CircleAlert className="size-5 shrink-0" aria-hidden="true" />
          Some items in your cart can&apos;t be ordered right now.
          <Link to="/cart" className="underline underline-offset-4">
            Review your cart
          </Link>
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <Card className="space-y-5 p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold">Your details</h2>
            <TextField
              ref={nameRef}
              label="Your name"
              required
              autoComplete="name"
              maxLength={100}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError("name");
              }}
              error={errors.name}
              placeholder="Name for the order"
            />
          </Card>

          <Card className="space-y-5 p-5 sm:p-6">
            <fieldset aria-describedby={errors.orderType ? "order-type-error" : undefined}>
              <legend className="font-display text-xl font-bold">Delivery or pickup?</legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <OrderTypeChoice
                  inputRef={noAreas ? undefined : orderTypeRef}
                  value="delivery"
                  checked={orderType === "delivery"}
                  onChange={chooseOrderType}
                  disabled={noAreas}
                  icon={Bike}
                  title="Delivery"
                  note={noAreas ? "Not available yet. Please choose pickup." : "Fixed fee for your area"}
                />
                <OrderTypeChoice
                  inputRef={noAreas ? orderTypeRef : undefined}
                  value="pickup"
                  checked={orderType === "pickup"}
                  onChange={chooseOrderType}
                  icon={Store}
                  title="Pickup"
                  note="No fee. Collect at Monarch Estate, Lugbe"
                />
              </div>
              {errors.orderType && (
                <p id="order-type-error" className="mt-2 text-sm font-medium text-red">
                  {errors.orderType}
                </p>
              )}
            </fieldset>

            {orderType === "delivery" && (
              <div className="space-y-5">
                {deliveryAreas.status === "loading" && (
                  <p className="flex items-center gap-2 text-muted" role="status">
                    <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Loading delivery areas
                  </p>
                )}
                {deliveryAreas.status === "error" && (
                  <div role="alert" className="rounded-2xl bg-subtle p-4">
                    <p className="font-semibold">We couldn&apos;t load the delivery areas.</p>
                    <p className="mt-1 text-sm text-muted">Try again, or choose pickup.</p>
                    <Button variant="dark" size="sm" className="mt-3" onClick={deliveryAreas.reload}>
                      <RefreshCw className="size-4" aria-hidden="true" /> Try again
                    </Button>
                  </div>
                )}
                {deliveryAreas.status === "ready" && (
                  <SelectField
                    ref={areaRef}
                    label="Delivery area"
                    required
                    value={selectedAreaId}
                    onChange={(e) => {
                      setAreaId(e.target.value);
                      clearError("area");
                    }}
                    error={errors.area}
                    hint="The fee for your area is added to your total."
                  >
                    <option value="">Choose your area</option>
                    {deliveryAreas.areas.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.name} ({formatNaira(a.fee)})
                      </option>
                    ))}
                  </SelectField>
                )}
                <TextField
                  ref={addressRef}
                  multiline
                  label="Delivery address"
                  required
                  autoComplete="street-address"
                  maxLength={300}
                  rows={3}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    clearError("address");
                  }}
                  error={errors.address}
                  hint="House number, street and a nearby landmark."
                />
              </div>
            )}

            {orderType === "pickup" && (
              <div className="flex items-start gap-3 rounded-2xl bg-page p-4">
                <MapPin className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Pickup address</p>
                  <p>{BUSINESS.pickupPoint}</p>
                  <p className="mt-1 text-sm text-muted">No delivery fee.</p>
                </div>
              </div>
            )}
          </Card>

          <Card className="space-y-4 p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold">Payment</h2>
            <p className="text-muted">
              Bank transfer only. After you place your order, send it to us on WhatsApp, pay the total by transfer,
              and send the receipt in the same WhatsApp chat.
            </p>
            <BankDetails />
          </Card>
        </div>

        <Card className="p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold">Your order</h2>
          <OrderSummary
            lines={summaryLines}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            deliveryNote={deliveryNote}
            total={subtotal + (deliveryFee ?? 0)}
          />
          <p className="mt-3 text-sm text-muted">Prices are checked again when you place your order.</p>

          {serverError && (
            <div
              ref={serverErrorRef}
              tabIndex={-1}
              role="alert"
              className="mt-4 rounded-2xl bg-red p-4 text-white outline-none"
            >
              <p className="font-semibold">We couldn&apos;t place your order.</p>
              <p className="mt-1">{serverError.message}</p>
              {serverError.cart && (
                <Link to="/cart" className="mt-2 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
                  Review your cart
                </Link>
              )}
            </div>
          )}

          <Button type="submit" size="lg" fullWidth className="mt-5" disabled={submitting || hasProblems}>
            {submitting ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Placing your order
              </>
            ) : (
              "Place order"
            )}
          </Button>
          <Button as={Link} to="/cart" variant="ghost" fullWidth className="mt-2">
            Back to cart
          </Button>
        </Card>
      </form>
    </div>
  );
}
