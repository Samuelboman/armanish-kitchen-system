// Order statuses (same values as the server) and how they are shown to people.

export const ORDER_STATUSES = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"];

const LABELS = {
  pending: "Order received",
  confirmed: "Confirmed",
  preparing: "Being prepared",
  ready: "Ready",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

const PICKUP_LABELS = { ...LABELS, ready: "Ready for pickup", delivered: "Collected" };

// Steps a customer sees. Pickup orders never go "out for delivery".
export const statusSteps = (orderType) =>
  orderType === "pickup" ? ORDER_STATUSES.filter((s) => s !== "out_for_delivery") : ORDER_STATUSES;

export const statusLabel = (status, orderType) =>
  (orderType === "pickup" ? PICKUP_LABELS : LABELS)[status] ?? status;
