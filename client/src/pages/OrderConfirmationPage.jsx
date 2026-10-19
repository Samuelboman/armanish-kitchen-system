import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { CircleCheck, MapPin, RefreshCw, SearchX, Store, WifiOff } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import CopyButton from "../components/ui/CopyButton";
import StatusMessage from "../components/ui/StatusMessage";
import OrderSummary from "../components/OrderSummary";
import BankDetails from "../components/BankDetails";
import OrderTracker from "../components/OrderTracker";
import { WhatsAppIcon } from "../components/icons/BrandIcons";
import { usePageTitle } from "../hooks/usePageTitle";
import { apiFetch } from "../lib/api";
import { getOrderToken } from "../lib/orderStorage";
import { orderWhatsappLink } from "../lib/whatsapp";
import { formatNaira } from "../lib/format";
import { BUSINESS } from "../config/business";

// Loads the order. Straight after checkout the order is shown at once from router state,
// but it is always fetched again too, so the status is current (B4). The fetch sends
// this browser's order token so the full details (name, address) come back.
function useOrder(id) {
  const location = useLocation();
  const fromCheckout = location.state?.order?._id === id ? location.state.order : null;
  const [state, setState] = useState(
    fromCheckout ? { order: fromCheckout, status: "ready" } : { order: null, status: "loading" }
  );
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const token = getOrderToken(id);
    apiFetch(`/api/orders/${encodeURIComponent(id)}`, {
      signal: controller.signal,
      headers: token ? { "X-Order-Token": token } : {},
    })
      .then((result) => setState({ order: result.data, status: "ready" }))
      .catch((error) => {
        if (error.name === "AbortError") return;
        const notFound = error.status === 404 || error.status === 400;
        // Already showing the order from checkout: keep it rather than replace it with an error.
        setState((current) =>
          current.order && !notFound ? current : { order: null, status: notFound ? "notfound" : "error", error }
        );
      });
    return () => controller.abort();
  }, [id, attempt]);

  const reload = () => {
    setState({ order: null, status: "loading" });
    setAttempt((n) => n + 1);
  };

  return { ...state, reload };
}

const steps = [
  "Send your order to us on WhatsApp.",
  "Transfer the total to our bank account.",
  "Send the transfer receipt in the same WhatsApp chat.",
];

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const { order, status, error, reload } = useOrder(id);
  const [sent, setSent] = useState(false);
  usePageTitle(status === "ready" ? "Order placed" : "Your order");

  if (status === "loading") {
    return (
      <p role="status" className="px-4 py-24 text-center text-muted">
        Loading your order
      </p>
    );
  }

  if (status === "notfound") {
    return (
      <div className="px-4 py-16">
        <StatusMessage
          icon={SearchX}
          title="We couldn't find that order"
          actions={
            <Button as={Link} to="/">
              Go to the menu
            </Button>
          }
        >
          Check the link, or message us on WhatsApp at {BUSINESS.phoneDisplay} with your order ID.
        </StatusMessage>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="px-4 py-16">
        <StatusMessage
          icon={WifiOff}
          tone="error"
          title="We couldn't load your order"
          actions={
            <Button onClick={reload}>
              <RefreshCw className="size-5" aria-hidden="true" /> Try again
            </Button>
          }
        >
          {error?.message}
        </StatusMessage>
      </div>
    );
  }

  const summaryLines = order.items.map((item, index) => ({
    key: item._id ?? index,
    name: item.name ?? item.menuItem?.name ?? "Item",
    accompaniment: item.accompaniment,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  }));
  const isSummaryOnly = order.customerName === undefined; // opened without this browser's order token

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-orange">
          <CircleCheck className="size-9" aria-hidden="true" />
        </span>
        <h1 className="display-heading mt-4 text-3xl sm:text-4xl">
          {order.customerName ? `Thank you, ${order.customerName}!` : "Your order"}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-lg">
          Your order is saved. <strong>One more step:</strong> send it to us on WhatsApp so we can start.
        </p>
        <p className="mt-3 inline-flex flex-wrap items-center justify-center gap-x-1 rounded-2xl bg-surface px-4 py-1 text-sm shadow-card sm:rounded-full sm:pr-1">
          Order ID: <span className="font-mono font-semibold">{order._id}</span>
          <CopyButton value={order._id} label="order ID" />
        </p>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Card className="space-y-5 p-5 sm:p-6">
            <ol className="space-y-3">
              {steps.map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-ink font-display font-bold text-white"
                  >
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <Button
              as="a"
              href={orderWhatsappLink(order)}
              target="_blank"
              rel="noreferrer"
              size="lg"
              fullWidth
              className="min-h-16 px-4 text-base min-[400px]:text-lg sm:text-xl"
              onClick={() => setSent(true)}
            >
              <WhatsAppIcon className="size-6 shrink-0 sm:size-7" /> Send order on WhatsApp
              <span className="sr-only"> (opens WhatsApp)</span>
            </Button>
            <p className="text-center font-medium">
              After sending the order on WhatsApp, pay by transfer and send the receipt in the same chat.
            </p>
            {sent && (
              <p role="status" className="rounded-2xl bg-page p-3 text-center text-sm">
                WhatsApp didn&apos;t open? Message us at{" "}
                <a href={BUSINESS.whatsappUrl} target="_blank" rel="noreferrer" className="font-semibold underline">
                  {BUSINESS.phoneDisplay}
                </a>{" "}
                with your order ID.
              </p>
            )}

            <BankDetails amount={order.totalPrice} />
          </Card>

          <Card className="p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold">Order details</h2>
            {order.orderType === "delivery" && (
              <p className="mt-3 flex items-start gap-2">
                <MapPin className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <span>
                  <strong>Delivery</strong>
                  {order.deliveryAreaName && ` to ${order.deliveryAreaName}`}
                  {order.deliveryAddress && <span className="block text-muted">{order.deliveryAddress}</span>}
                </span>
              </p>
            )}
            {order.orderType === "pickup" && (
              <p className="mt-3 flex items-start gap-2">
                <Store className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <span>
                  <strong>Pickup</strong> at {BUSINESS.pickupPoint}
                </span>
              </p>
            )}
            <OrderSummary
              lines={summaryLines}
              subtotal={order.subtotal ?? order.totalPrice}
              deliveryFee={order.deliveryFee ?? 0}
              total={order.totalPrice}
              totalLabel="Total to pay"
            />
            {isSummaryOnly && (
              <p className="mt-4 text-sm text-muted">
                This is a summary. Your name and address show on the device you ordered from.
              </p>
            )}
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-24">
          <OrderTracker
            key={`${order._id}-${order.status}`}
            orderId={order._id}
            initialStatus={order.status}
            orderType={order.orderType}
          />
          <Card className="p-5 text-sm sm:p-6">
            <p className="font-semibold">Questions about your order?</p>
            <p className="mt-1 text-muted">
              Message us on WhatsApp at{" "}
              <a href={BUSINESS.whatsappUrl} target="_blank" rel="noreferrer" className="font-semibold text-ink underline">
                {BUSINESS.phoneDisplay}
              </a>
              . Total to pay: {formatNaira(order.totalPrice)}.
            </p>
            <Button as={Link} to="/" variant="ghost" className="mt-3 -ml-3">
              Back to the menu
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
