// Menu categories, in display order. "all" is the filter for everything.
// The values match MenuItem.category on the server.
export const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "masa", label: "Masa" },
  { value: "yamarita", label: "Yamarita" },
  { value: "drinks", label: "Drinks" },
  { value: "other", label: "Other" },
];

export const categoryLabel = (value) => CATEGORIES.find((c) => c.value === value)?.label ?? value;
