import MenuCard from "./MenuCard";

// Responsive grid of menu cards. Receives the items to show; filtering happens once,
// in MenuSection (B1).
export default function MenuGrid({ items, onAdd }) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item._id} className="flex">
          <MenuCard item={item} onAdd={onAdd} />
        </li>
      ))}
    </ul>
  );
}
