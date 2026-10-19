import { cx } from "../../lib/cx";

// Shows the message from useNotice(); announced to screen readers.
export default function NoticeBar({ notice }) {
  return (
    <div role="status" aria-live="polite">
      {notice && (
        <p className={cx("mb-4 rounded-2xl p-3 font-medium text-white", notice.tone === "error" ? "bg-red" : "bg-ink")}>
          {notice.text}
        </p>
      )}
    </div>
  );
}
