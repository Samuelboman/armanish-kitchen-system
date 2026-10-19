import FoodImage from "../ui/FoodImage";
import { CATEGORIES } from "../../config/menu";
import { cx } from "../../lib/cx";

// Pick a picture for each category: the first item in it that has a photo.
// "All" uses the logo; categories without photos get the branded placeholder.
function categoryImages(items) {
  const images = { all: "/images/logo.png" };
  for (const item of items) {
    if (item.image && !images[item.category]) images[item.category] = item.image;
  }
  return images;
}

// Horizontally swipeable category filter with pictures and an underline on the active one.
export default function CategoryStrip({ items, active, onSelect }) {
  const images = categoryImages(items);

  return (
    <div className="scrollbar-none -mx-4 flex snap-x gap-1 overflow-x-auto px-4 sm:mx-0 sm:justify-center sm:gap-4 sm:px-0">
      {CATEGORIES.map((category) => {
        const isActive = category.value === active;
        return (
          <button
            key={category.value}
            type="button"
            onClick={() => onSelect(category.value)}
            aria-pressed={isActive}
            className="group flex min-w-[4.75rem] shrink-0 snap-start flex-col items-center gap-2 rounded-2xl px-2 pb-1 pt-2"
          >
            <span
              className={cx(
                "size-16 overflow-hidden rounded-full ring-2 transition-transform group-hover:scale-105",
                isActive ? "ring-ink" : "ring-line",
                category.value === "all" && "bg-yellow/35 p-2"
              )}
            >
              <FoodImage
                src={images[category.value]}
                alt=""
                className={cx("size-full", category.value === "all" ? "object-contain" : "object-cover")}
              />
            </span>
            <span
              className={cx(
                "border-b-[3px] pb-1 font-display text-xs uppercase tracking-wide",
                isActive ? "border-ink font-bold" : "border-transparent font-semibold text-muted"
              )}
            >
              {category.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
