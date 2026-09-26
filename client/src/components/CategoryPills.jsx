const categories = [
  { value: "all", label: "All" },
  { value: "masa", label: "Masa" }, 
  { value: "yamarita", label: "Yamarita" },
  { value: "drinks", label: "Drinks" },
];

export default function CategoryPills({ activeCategory, onSelect }) {
  return (
    <div className="flex gap-3 overflow-x-auto px-5 py-4">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onSelect(cat.value)}
            className={`whitespace-nowrap rounded-full px-4 py-2 font-body text-sm font-medium transition-colors ${
              isActive
                ? "bg-amber text-indigo-dark"
                : "bg-white text-charcoal/70 hover:bg-amber/20"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}