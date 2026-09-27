import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const statusSteps = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"];

export default function OrderTracker({ orderId }) {
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    // Open a live connection to the backend
    const socket = io("http://localhost:5000");

    // Listen specifically for updates to THIS order — matches the
    // event name pattern the backend emits: `order-status-<orderId>`
    socket.on(`order-status-${orderId}`, (data) => {
      setStatus(data.status);
    });

    // Cleanup: close the connection when this component is no longer shown,
    // so we don't leave sockets open forever in the background.
    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  const currentIndex = statusSteps.indexOf(status);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="font-display text-lg font-bold text-indigo">Order Status</h3>
      <div className="mt-4 flex items-center gap-2">
        {statusSteps.map((step, i) => (
          <div key={step} className="flex flex-1 flex-col items-center">
            <div
              className={`h-3 w-3 rounded-full ${
                i <= currentIndex ? "bg-amber" : "bg-charcoal/15"
              }`}
            />
            <span className="mt-1 text-center text-[10px] capitalize text-charcoal/60">
              {step.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}