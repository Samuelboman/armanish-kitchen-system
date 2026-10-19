import { cx } from "../../lib/cx";

// Big, faint circles behind a section for depth (a style trait of the design reference).
// Purely decorative. The parent needs `relative overflow-hidden`; put content in a
// sibling with `relative` so it sits above the circles.
const presets = {
  hero: [
    "size-80 -right-24 -top-28 bg-white/15",
    "size-56 -left-24 bottom-6 border-[36px] border-white/15",
    "size-24 right-1/3 bottom-[-3rem] bg-ink/5",
  ],
  page: [
    "size-[28rem] -left-48 -top-24 bg-orange/10",
    "size-72 -right-28 bottom-[-6rem] border-[40px] border-yellow/25",
  ],
  band: [
    "size-72 -right-20 -top-32 bg-white/20",
    "size-40 left-[-4rem] bottom-[-5rem] border-[28px] border-white/20",
  ],
  footer: ["size-64 -right-20 -top-24 bg-white/15", "size-32 left-1/4 bottom-[-4rem] bg-ink/5"],
};

export default function DecorCircles({ variant = "page", className }) {
  return (
    <div aria-hidden="true" className={cx("pointer-events-none absolute inset-0", className)}>
      {presets[variant].map((shape) => (
        <span key={shape} className={cx("absolute rounded-full", shape)} />
      ))}
    </div>
  );
}
