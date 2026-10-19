import { ArrowDown } from "lucide-react";
import Button from "../ui/Button";
import Pill from "../ui/Pill";
import DecorCircles from "../ui/DecorCircles";
import SectionLink from "../layout/SectionLink";
import { BUSINESS } from "../../config/business";

// Big uppercase tagline, a short line, the flyer badges, "Order now" and a food photo
// on the hero colour. No price badge: prices are placeholders and there are no promotions.
export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden bg-hero text-on-hero">
      <DecorCircles variant="hero" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 pb-16 pt-8 sm:px-6 sm:pb-20 md:grid-cols-[1.1fr_1fr] md:pt-12 lg:px-8 lg:pb-24">
        <div className="space-y-5">
          <h1 id="hero-heading" className="display-heading text-[2.6rem] sm:text-6xl lg:text-7xl">
            {BUSINESS.tagline}
          </h1>
          <p className="max-w-md text-lg">
            {BUSINESS.description} from Lugbe, Abuja. Order for delivery or pickup.
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="What we're about">
            {BUSINESS.badges.map((badge) => (
              <li key={badge}>
                <Pill tone="white" className="normal-case tracking-normal text-sm font-semibold">
                  {badge}
                </Pill>
              </li>
            ))}
          </ul>
          <Button as={SectionLink} id="menu" variant="outline" size="lg">
            Order now <ArrowDown className="size-5" aria-hidden="true" />
          </Button>
        </div>

        <div className="relative mx-auto w-full max-w-[18rem] sm:max-w-sm md:max-w-md">
          <div aria-hidden="true" className="absolute inset-[6%] rounded-full bg-yellow/70" />
          <img
            src="/images/masa-bowls.jpg"
            alt="Three takeaway bowls of masa with meat, salad and a small pot of spice"
            width="478"
            height="571"
            fetchPriority="high"
            className="relative aspect-square w-full rounded-full object-cover shadow-lift ring-8 ring-white/40"
          />
        </div>
      </div>
    </section>
  );
}
