// Joins class names, skipping false, null and undefined: cx("a", isOn && "b").
export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}
