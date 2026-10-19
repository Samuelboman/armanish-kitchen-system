import { useRef, useState } from "react";
import { Bike, Store } from "lucide-react";
import InfoCard from "../InfoCard";
import DotIndicator from "../ui/DotIndicator";
import { WhatsAppIcon } from "../icons/BrandIcons";
import { BUSINESS } from "../../config/business";

const cards = [
  {
    icon: Bike,
    title: "Delivery across Abuja",
    text: "Choose your area at checkout. Its delivery fee is shown before you place your order.",
  },
  {
    icon: Store,
    title: "Pickup at Monarch Estate, Lugbe",
    text: `Collect your order from ${BUSINESS.pickupPoint}. No delivery fee.`,
  },
  {
    icon: WhatsAppIcon,
    title: "Order on WhatsApp",
    text: `After you order, one tap sends it to us on WhatsApp at ${BUSINESS.phoneDisplay}.`,
  },
];

// "About" target: a short intro (placeholder until the owner supplies it) and the
// info cards. Up to tablet width the cards are a swipeable row with dots; on desktop, a grid.
export default function AboutSection() {
  const rowRef = useRef(null);
  const [active, setActive] = useState(0);

  const handleScroll = () => {
    const row = rowRef.current;
    if (!row) return;
    const cardWidth = row.firstElementChild?.getBoundingClientRect().width || row.clientWidth;
    setActive(Math.min(cards.length - 1, Math.round(row.scrollLeft / cardWidth)));
  };

  const scrollTo = (index) => {
    const row = rowRef.current;
    row?.children[index]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-20 bg-page">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <h2 id="about-heading" className="display-heading text-3xl sm:text-4xl">
            About {BUSINESS.name}
          </h2>
          <p className="mt-3 text-muted">[About text coming]</p>
        </div>

        {/* Focusable so keyboard users can scroll the row with the arrow keys on phones. */}
        <ul
          ref={rowRef}
          onScroll={handleScroll}
          tabIndex={0}
          aria-label="Delivery, pickup and ordering on WhatsApp"
          className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0"
        >
          {cards.map((card) => (
            <li key={card.title} className="w-[85%] shrink-0 snap-start sm:w-[55%] lg:w-auto">
              <InfoCard icon={card.icon} title={card.title}>
                {card.text}
              </InfoCard>
            </li>
          ))}
        </ul>
        <DotIndicator count={cards.length} active={active} onSelect={scrollTo} label="Card" className="mt-2 lg:hidden" />
      </div>
    </section>
  );
}
