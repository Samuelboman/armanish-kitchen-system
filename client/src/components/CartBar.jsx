export default function CartBar({ cartItems, total, onCheckout }) {
  if (cartItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-charcoal/10 bg-white px-5 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div>
          <p className="text-sm text-charcoal/60">
            {cartItems.length} item{cartItems.length > 1 ? "s" : ""} in cart
          </p>
          <p className="font-display text-lg font-bold text-indigo">₦{total}</p>
        </div>
        <button
          onClick={onCheckout}
          className="rounded-full bg-amber px-6 py-3 font-display font-semibold text-indigo-dark transition-colors hover:bg-amber/90"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}