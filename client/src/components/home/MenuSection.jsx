import { useMemo, useState } from "react";
import { RefreshCw, UtensilsCrossed, WifiOff } from "lucide-react";
import CategoryStrip from "./CategoryStrip";
import MenuGrid from "../MenuGrid";
import Pill from "../ui/Pill";
import Button from "../ui/Button";
import Card from "../ui/Card";
import StatusMessage from "../ui/StatusMessage";
import DecorCircles from "../ui/DecorCircles";
import { WhatsAppIcon } from "../icons/BrandIcons";
import { categoryLabel } from "../../config/menu";
import { BUSINESS } from "../../config/business";

function LoadingCards() {
  return (
    <div aria-busy="true" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <p className="sr-only" role="status">
        Loading the menu
      </p>
      {[0, 1, 2].map((i) => (
        <Card key={i} aria-hidden="true" className="overflow-hidden">
          <div className="aspect-[4/3] animate-pulse bg-subtle" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-2/3 animate-pulse rounded-full bg-subtle" />
            <div className="h-4 w-1/3 animate-pulse rounded-full bg-subtle" />
            <div className="h-12 animate-pulse rounded-full bg-subtle" />
          </div>
        </Card>
      ))}
    </div>
  );
}

const whatsappButton = (
  <Button as="a" href={BUSINESS.whatsappUrl} target="_blank" rel="noreferrer" variant="dark">
    <WhatsAppIcon className="size-5" /> Message us on WhatsApp
  </Button>
);

// MENU label, category strip and the menu grid, with loading, error and empty states.
export default function MenuSection({ menu, onAdd }) {
  const [category, setCategory] = useState("all");
  const { items, status, error, reload } = menu;

  // The only place items are filtered (B1). Available items come first.
  const visibleItems = useMemo(() => {
    const inCategory = category === "all" ? items : items.filter((item) => item.category === category);
    return [...inCategory].sort((a, b) => Number(b.available !== false) - Number(a.available !== false));
  }, [items, category]);

  let content;
  if (status === "loading") {
    content = <LoadingCards />;
  } else if (status === "error") {
    content = (
      <Card>
        <StatusMessage
          icon={WifiOff}
          tone="error"
          title="We couldn't load the menu"
          actions={
            <>
              <Button onClick={reload}>
                <RefreshCw className="size-5" aria-hidden="true" /> Try again
              </Button>
              {whatsappButton}
            </>
          }
        >
          {error?.message} You can also order by WhatsApp.
        </StatusMessage>
      </Card>
    );
  } else if (items.length === 0) {
    content = (
      <Card>
        <StatusMessage icon={UtensilsCrossed} title="The menu is being updated" actions={whatsappButton}>
          Please check back soon, or message us on WhatsApp to order.
        </StatusMessage>
      </Card>
    );
  } else if (visibleItems.length === 0) {
    content = (
      <Card>
        <StatusMessage
          icon={UtensilsCrossed}
          title={`No ${categoryLabel(category)} on the menu yet`}
          actions={<Button onClick={() => setCategory("all")}>See all items</Button>}
        >
          Check back soon, or have a look at everything else we&apos;re serving.
        </StatusMessage>
      </Card>
    );
  } else {
    content = <MenuGrid items={visibleItems} onAdd={onAdd} />;
  }

  return (
    <section id="menu" aria-labelledby="menu-heading" className="scroll-mt-20">
      <div className="relative bg-surface pb-4 shadow-card">
        <h2 id="menu-heading" className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <Pill tone="yellow" className="px-6 py-2 text-sm shadow-card">
            Menu
          </Pill>
        </h2>
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
          <CategoryStrip items={items} active={category} onSelect={setCategory} />
        </div>
      </div>

      <div className="relative overflow-hidden">
        <DecorCircles variant="page" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          {status === "ready" && items.length > 0 && (
            <p className="mb-5 text-sm text-muted" role="status">
              {category === "all" ? "All items" : categoryLabel(category)}: {visibleItems.length} item
              {visibleItems.length === 1 ? "" : "s"}
            </p>
          )}
          {content}
        </div>
      </div>
    </section>
  );
}
