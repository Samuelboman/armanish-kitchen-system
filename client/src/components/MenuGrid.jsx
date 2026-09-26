import MenuCard from "./MenuCard";

export default function MenuGrid({ items, activeCategory, onAddToCart }) {
  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  if (filteredItems.length === 0) {
    return (
      <p className="px-5 py-10 text-center text-charcoal/50">
        No items in this category yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-5 py-2 sm:grid-cols-2 md:grid-cols-3">
      {filteredItems.map((item) => (
        <MenuCard key={item._id} item={item} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
