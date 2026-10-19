import { ArrowUp } from "lucide-react";
import Button from "../ui/Button";
import DecorCircles from "../ui/DecorCircles";
import SectionLink from "../layout/SectionLink";
import { BUSINESS } from "../../config/business";

const steps = [
  {
    title: "Order on this site",
    text: "Choose your food, then delivery or pickup, and place your order.",
  },
  {
    title: "Send it on WhatsApp",
    text: "Tap “Send order on WhatsApp” on the confirmation page. Your order details are filled in for you.",
  },
  {
    title: "Pay by bank transfer",
    text: `Transfer the total to our ${BUSINESS.bank.name} account, then send the receipt in the same WhatsApp chat.`,
  },
];

// Yellow band in the style of the reference's app banner (no app badges): the three steps.
export default function HowToOrder() {
  return (
    <section
      id="how-to-order"
      aria-labelledby="how-heading"
      className="relative scroll-mt-20 overflow-hidden bg-yellow text-ink"
    >
      <DecorCircles variant="band" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1fr_1.4fr] lg:px-8">
        <div aria-hidden="true" className="relative mx-auto hidden h-72 w-72 md:block lg:h-80 lg:w-80">
          <img
            src="/images/kunun-aya.jpg"
            alt=""
            className="absolute left-0 top-0 size-48 rounded-full object-cover shadow-lift ring-8 ring-white/60 lg:size-56"
          />
          <img
            src="/images/yoghurt.jpg"
            alt=""
            className="absolute bottom-0 right-0 size-44 rounded-full object-cover shadow-lift ring-8 ring-white/60 lg:size-48"
          />
        </div>

        <div>
          <h2 id="how-heading" className="display-heading text-3xl sm:text-4xl">
            How to order
          </h2>
          <ol className="mt-6 space-y-5">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-ink font-display text-lg font-bold text-white"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold">{step.title}</h3>
                  <p className="mt-0.5">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <Button as={SectionLink} id="menu" variant="dark" size="lg" className="mt-8">
            Start your order <ArrowUp className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
