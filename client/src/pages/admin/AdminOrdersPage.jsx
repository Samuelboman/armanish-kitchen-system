import { useCallback, useState } from "react";
import { Inbox, Loader2, MapPin, RefreshCw, Store } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import SelectField from "../../components/ui/SelectField";
import StatusMessage from "../../components/ui/StatusMessage";
import CopyButton from "../../components/ui/CopyButton";
import NoticeBar from "../../components/admin/NoticeBar";
import { useAuth } from "../../context/auth-context";
import { useAdminList } from "../../hooks/useAdminList";
import { useNotice } from "../../hooks/useNotice";
import { usePageTitle } from "../../hooks/usePageTitle";
import { formatNaira } from "../../lib/format";
import { statusLabel, statusSteps } from "../../config/orderStatus";
import { BUSINESS } from "../../config/business";

const ORDER_LIMIT = 50;

const dateFormat = new Intl.DateTimeFormat("en-NG", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Lagos",
});

function OrderCard({ order, onStatusChange, saving }) {
  // Pickup orders skip "Out for delivery"; keep it listed if an order already has it.
  const steps = statusSteps(order.orderType);
  const options = steps.includes(order.status) ? steps : [...steps, order.status];

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <div>
          <p className="font-display text-lg font-bold">{order.customerName}</p>
          <p className="text-sm text-muted">{order.createdAt ? dateFormat.format(new Date(order.createdAt)) : ""}</p>
        </div>
        <p className="font-display text-lg font-bold">{formatNaira(order.totalPrice)}</p>
      </div>

      <p className="mt-1 flex flex-wrap items-center gap-x-1 text-sm text-muted">
        Order ID: <span className="font-mono text-ink">{order._id}</span>
        <CopyButton value={order._id} label={`order ID for ${order.customerName}`} className="-ml-1" />
      </p>

      <p className="mt-2 flex items-start gap-2 text-sm">
        {order.orderType === "delivery" ? (
          <>
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              <strong>Delivery</strong>
              {order.deliveryAreaName ? ` to ${order.deliveryAreaName}` : ""} ({formatNaira(order.deliveryFee ?? 0)})
              {order.deliveryAddress && <span className="block text-muted">{order.deliveryAddress}</span>}
            </span>
          </>
        ) : order.orderType === "pickup" ? (
          <>
            <Store className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              <strong>Pickup</strong> at {BUSINESS.pickupPoint}
            </span>
          </>
        ) : (
          <span className="text-muted">Delivery or pickup not recorded (older order)</span>
        )}
      </p>

      <ul className="mt-3 space-y-0.5 text-sm">
        {order.items.map((item, index) => (
          <li key={item._id ?? index}>
            {item.quantity} x {item.name ?? item.menuItem?.name ?? "Item"}
            {item.accompaniment ? ` (${item.accompaniment})` : ""}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-end gap-3 border-t border-line pt-4">
        <SelectField
          label="Status"
          className="w-full max-w-xs"
          value={order.status}
          disabled={saving}
          onChange={(e) => onStatusChange(order, e.target.value)}
        >
          {options.map((status) => (
            <option key={status} value={status}>
              {statusLabel(status, order.orderType)}
            </option>
          ))}
        </SelectField>
        {saving && (
          <span className="mb-3 flex items-center gap-1.5 text-sm text-muted">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Saving
          </span>
        )}
      </div>
    </Card>
  );
}

// Recent orders, newest first, with a status the customer sees on their order page
// (decision 6b). Orders and payment are handled on WhatsApp; this only sets the status.
export default function AdminOrdersPage() {
  usePageTitle("Admin: orders");
  const { authFetch } = useAuth();
  const loadOrders = useCallback(
    (signal) => authFetch(`/api/orders?limit=${ORDER_LIMIT}`, { signal }).then((result) => result.data),
    [authFetch]
  );
  const { items: orders, setItems: setOrders, status, reload } = useAdminList(loadOrders);
  const [savingId, setSavingId] = useState(null);
  const [notice, setNotice] = useNotice();

  const changeStatus = async (order, next) => {
    const previous = order.status;
    setSavingId(order._id);
    setOrders((list) => list.map((o) => (o._id === order._id ? { ...o, status: next } : o)));
    try {
      await authFetch(`/api/orders/${order._id}/status`, { method: "PUT", body: { status: next } });
      setNotice({ text: `${order.customerName}: ${statusLabel(next, order.orderType)}. The customer's page updates now.` });
    } catch (error) {
      setOrders((list) => list.map((o) => (o._id === order._id ? { ...o, status: previous } : o)));
      setNotice({ text: `Couldn't update the status: ${error.message}`, tone: "error" });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="display-heading text-2xl sm:text-3xl">Orders</h1>
          <p className="text-muted">
            The latest {ORDER_LIMIT} orders. Changing a status updates the customer&apos;s order page. Payment is
            confirmed on WhatsApp.
          </p>
        </div>
        <Button variant="dark" onClick={reload} disabled={status === "loading"}>
          <RefreshCw className="size-5" aria-hidden="true" /> Refresh
        </Button>
      </div>

      <NoticeBar notice={notice} />

      {status === "loading" && (
        <p role="status" className="py-10 text-center text-muted">
          Loading orders
        </p>
      )}
      {status === "error" && (
        <Card>
          <StatusMessage tone="error" icon={RefreshCw} title="We couldn't load the orders" actions={<Button onClick={reload}>Try again</Button>} />
        </Card>
      )}
      {status === "ready" && orders.length === 0 && (
        <Card>
          <StatusMessage icon={Inbox} title="No orders yet">
            New orders appear here as soon as customers place them.
          </StatusMessage>
        </Card>
      )}
      {status === "ready" && orders.length > 0 && (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order._id}>
              <OrderCard order={order} onStatusChange={changeStatus} saving={savingId === order._id} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
