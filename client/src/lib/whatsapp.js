import { BUSINESS, whatsappLink } from "../config/business.js";
import { formatNaira } from "./format.js";

// The pre-filled WhatsApp message the customer sends to the business after ordering.
// Built from the order the server returned, so prices and totals are the server's.
// Contains: order ID, name, items with option and quantity, order type, area and
// address (or pickup), subtotal, delivery fee, total, and the receipt line.
export function buildOrderMessage(order) {
  const lines = [`Hello ${BUSINESS.name}, I'd like to place this order.`, ""];

  lines.push(`Order ID: ${order._id}`);
  if (order.customerName) lines.push(`Name: ${order.customerName}`);
  lines.push("", "Items:");

  for (const item of order.items ?? []) {
    const option = item.accompaniment ? ` (${item.accompaniment})` : "";
    const lineTotal = Number.isFinite(item.unitPrice) ? `: ${formatNaira(item.unitPrice * item.quantity)}` : "";
    lines.push(`- ${item.quantity} x ${item.name}${option}${lineTotal}`);
  }
  lines.push("");

  if (order.orderType === "delivery") {
    lines.push("Order type: Delivery");
    if (order.deliveryAreaName) lines.push(`Area: ${order.deliveryAreaName}`);
    if (order.deliveryAddress) lines.push(`Address: ${order.deliveryAddress}`);
    lines.push("");
  } else if (order.orderType === "pickup") {
    lines.push(`Order type: Pickup (${BUSINESS.pickupPoint})`, "");
  }

  const subtotal = order.subtotal ?? order.totalPrice;
  lines.push(`Subtotal: ${formatNaira(subtotal)}`);
  lines.push(`Delivery fee: ${formatNaira(order.deliveryFee ?? 0)}`);
  lines.push(`Total: ${formatNaira(order.totalPrice)}`);
  lines.push("", "I will pay by bank transfer and send the transfer receipt in this chat.");

  return lines.join("\n");
}

// https://wa.me/2347030462212?text=<URL-encoded message>
export function orderWhatsappLink(order) {
  return whatsappLink(buildOrderMessage(order));
}
