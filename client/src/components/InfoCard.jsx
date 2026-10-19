import Card from "./ui/Card";

// "Feature card" from the design reference, used for information (not offers):
// a round icon badge, a bold uppercase title and a line of text.
export default function InfoCard({ icon: Icon, title, children }) {
  return (
    <Card className="relative flex h-full items-start gap-4 overflow-hidden p-5">
      <span aria-hidden="true" className="absolute -right-10 -top-10 size-28 rounded-full bg-yellow/30" />
      <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-orange text-ink">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <div className="relative">
        <h3 className="display-heading text-base">{title}</h3>
        <div className="mt-1.5 text-sm leading-relaxed text-muted">{children}</div>
      </div>
    </Card>
  );
}
