import { cx } from "../../lib/cx";

// Empty, error and "not found" states: an icon, a heading, a line of text and actions.
// role="alert" for errors so screen readers announce them.
export default function StatusMessage({ icon: Icon, title, children, actions, tone = "neutral", className }) {
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={cx("mx-auto flex max-w-md flex-col items-center px-4 py-10 text-center", className)}
    >
      {Icon && (
        <span
          className={cx(
            "mb-4 grid size-16 place-items-center rounded-full",
            tone === "error" ? "bg-red text-white" : "bg-yellow text-ink"
          )}
        >
          <Icon className="size-8" aria-hidden="true" />
        </span>
      )}
      <h2 className="font-display text-xl font-bold">{title}</h2>
      {children && <div className="mt-2 text-muted">{children}</div>}
      {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
}
