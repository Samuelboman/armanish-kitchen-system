import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Check } from "lucide-react";
import Card from "./ui/Card";
import { API_URL } from "../lib/api";
import { cx } from "../lib/cx";
import { statusLabel, statusSteps } from "../config/orderStatus";

// Live order status. Starts from the status the page loaded with (B4: it used to always
// start at "pending"), then follows updates the server broadcasts when an admin changes
// the status or assigns a rider.
export default function OrderTracker({ orderId, initialStatus = "pending", orderType }) {
  const [status, setStatus] = useState(initialStatus);
  const steps = statusSteps(orderType);

  useEffect(() => {
    // Listen only for THIS order's event: `order-status-<orderId>`.
    const socket = io(API_URL || undefined, { transports: ["websocket", "polling"] });
    socket.on(`order-status-${orderId}`, (data) => {
      if (data?.status) setStatus(data.status);
    });
    // Close the connection when the page is left.
    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  const currentIndex = Math.max(0, steps.indexOf(status));

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-display text-xl font-bold">Order status</h2>
      <p className="mt-1 text-muted" aria-live="polite">
        {statusLabel(status, orderType)}
      </p>
      <ol className="mt-4 space-y-1">
        {steps.map((step, index) => {
          const done = index < currentIndex;
          const current = index === currentIndex;
          return (
            <li key={step} aria-current={current ? "step" : undefined} className="flex items-center gap-3 py-1">
              <span
                aria-hidden="true"
                className={cx(
                  "grid size-7 shrink-0 place-items-center rounded-full border-2",
                  done && "border-ink bg-ink text-white",
                  current && "border-ink bg-orange",
                  !done && !current && "border-field bg-surface"
                )}
              >
                {done && <Check className="size-4" />}
              </span>
              <span className={cx(current ? "font-semibold" : done ? "" : "text-muted")}>
                {statusLabel(step, orderType)}
                {done && <span className="sr-only"> (done)</span>}
                {current && <span className="sr-only"> (current)</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
