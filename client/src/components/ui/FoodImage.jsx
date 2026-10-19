import { useState } from "react";
import { cx } from "../../lib/cx";

// Branded stand-in for items without a photo (or whose photo fails to load):
// the logo on a soft yellow field with faint circles.
function BrandPlaceholder({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cx("relative grid place-items-center overflow-hidden bg-yellow/35", className)}
    >
      <span className="absolute -right-8 -top-10 size-32 rounded-full bg-white/40" />
      <span className="absolute -bottom-12 -left-10 size-36 rounded-full border-[18px] border-orange/25" />
      <img src="/images/logo.png" alt="" className="relative w-2/5 max-w-36 opacity-90" />
    </div>
  );
}

// A food photo that fills its box, or the branded placeholder when there's no photo.
// `unavailable` turns the photo grey.
export default function FoodImage({ src, alt, unavailable = false, className }) {
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return <BrandPlaceholder className={className} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={cx("object-cover", unavailable && "grayscale", className)}
    />
  );
}
