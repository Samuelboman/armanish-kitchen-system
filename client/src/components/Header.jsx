export default function Header({ cartCount }) {
  return (
    <header className="sticky top-0 z-20 bg-indigo shadow-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-cream">
            Armanish Kitchen
          </h1>
          <p className="text-sm text-cream/70">Northern Nigerian native foods · Abuja</p>
        </div>

        <button className="relative rounded-full bg-amber px-4 py-2 font-display font-semibold text-indigo-dark">
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-clay text-xs font-bold text-cream">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}