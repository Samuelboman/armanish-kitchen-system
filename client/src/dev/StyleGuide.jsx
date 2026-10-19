// Development-only page at /styleguide showing the design tokens and UI pieces.
// It is not part of the production build (see main.jsx).
import { useState } from "react";
import { ArrowRight, Bike, MapPin, ShoppingBag, Store, Trash2 } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Pill from "../components/ui/Pill";
import TextField from "../components/ui/TextField";
import OptionPicker from "../components/ui/OptionPicker";
import QuantityStepper from "../components/ui/QuantityStepper";
import DotIndicator from "../components/ui/DotIndicator";
import DecorCircles from "../components/ui/DecorCircles";
import MenuCard from "../components/MenuCard";
import InfoCard from "../components/InfoCard";
import { WhatsAppIcon, InstagramIcon } from "../components/icons/BrandIcons";

// WCAG contrast ratio between two hex colours.
function contrast(a, b) {
  const lum = (hex) => {
    const [r, g, bl] = hex
      .replace("#", "")
      .match(/../g)
      .map((h) => parseInt(h, 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const INK = "#010101";
const WHITE = "#FFFFFF";

const swatches = [
  { token: "orange", hex: "#F0AC15", note: "Hero, footer bar, main buttons", text: INK },
  { token: "yellow", hex: "#FEC607", note: "MENU tab, banner band, selected option", text: INK },
  { token: "page", hex: "#FFF9EE", note: "Page background (warm off-white)", text: INK },
  { token: "surface", hex: "#FFFFFF", note: "Cards and panels", text: INK },
  { token: "ink", hex: "#010101", note: "Text; footer bottom; dark button", text: WHITE },
  { token: "muted", hex: "#5C5346", note: "Secondary text on white / off-white only", text: WHITE },
  { token: "field", hex: "#8A7E6B", note: "Form field borders (3:1 needed)", text: WHITE, against: "#FFFFFF", againstLabel: "Border vs white card" },
  { token: "subtle", hex: "#EFE7D8", note: "'Not available' pill, placeholders", text: INK },
  { token: "red", hex: "#AA0103", note: "Logo red. Errors and delete only", text: WHITE },
];

// Real items and placeholder prices from the current database; descriptions and
// units don't exist yet, so they show the placeholders the owner will replace.
const sampleItems = [
  {
    _id: "s1",
    name: "Masa",
    price: 500,
    unit: "[Unit coming]",
    description: "[Description coming]",
    accompaniments: ["Miyan Gyada", "Yaji"],
    image: "/images/masa-plates.jpg",
    available: true,
  },
  {
    _id: "s2",
    name: "Kunu Gyada",
    price: 300,
    unit: "[Unit coming]",
    description: "[Description coming]",
    accompaniments: [],
    image: "",
    available: true,
  },
  {
    _id: "s3",
    name: "Kunun Aya",
    price: 300,
    unit: "[Unit coming]",
    description: "[Description coming]",
    accompaniments: [],
    image: "/images/kunun-aya.jpg",
    available: false,
  },
];

function Section({ title, children }) {
  return (
    <section className="space-y-4">
      <h2 className="display-heading text-xl">{title}</h2>
      {children}
    </section>
  );
}

export default function StyleGuide() {
  const [option, setOption] = useState("Miyan Gyada");
  const [qty, setQty] = useState(2);
  const [dot, setDot] = useState(1);

  return (
    <main className="mx-auto max-w-6xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <Pill tone="ink">Dev only</Pill>
        <h1 className="display-heading text-3xl sm:text-4xl">Armanish Delight design system</h1>
        <p className="max-w-2xl text-muted">
          Tokens live in <code>client/src/index.css</code>. Contrast ratios below are calculated live
          (WCAG AA: 4.5 for text, 3 for large text and UI borders).
        </p>
      </header>

      <Section title="Colours">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {swatches.map((s) => (
            <Card key={s.token} className="flex items-center gap-4 p-3">
              <div
                className="grid size-16 shrink-0 place-items-center rounded-xl font-display text-lg font-bold ring-1 ring-line"
                style={{ background: s.hex, color: s.text }}
              >
                Aa
              </div>
              <div className="min-w-0 text-sm">
                <p className="font-semibold">
                  {s.token} <span className="font-normal text-muted">{s.hex}</span>
                </p>
                <p className="text-muted">{s.note}</p>
                <p className="mt-0.5 text-xs">
                  {s.againstLabel ?? `${s.text === INK ? "Ink" : "White"} text`}:{" "}
                  <strong>{contrast(s.hex, s.against ?? s.text).toFixed(2)}</strong>
                </p>
              </div>
            </Card>
          ))}
        </div>
        <Card className="space-y-1 p-4 text-sm">
          <p className="font-semibold">Never on orange or yellow</p>
          <p className="text-muted">
            White on orange {contrast(WHITE, "#F0AC15").toFixed(2)}, white on yellow{" "}
            {contrast(WHITE, "#FEC607").toFixed(2)}, muted on orange {contrast("#5C5346", "#F0AC15").toFixed(2)}:
            all fail, so text on orange and yellow is always full near-black.
          </p>
        </Card>
      </Section>

      <Section title="Hero and footer colour">
        <p className="max-w-2xl text-sm text-muted">
          One switch: <code>data-hero</code> on <code>&lt;html&gt;</code> in <code>client/index.html</code>{" "}
          (&quot;orange&quot; now, or &quot;red&quot;). Text colour follows. Headline and copy below are
          placeholders until the hero copy is confirmed.
        </p>
        <div className="relative overflow-hidden rounded-card bg-hero text-on-hero">
          <DecorCircles variant="hero" />
          <div className="relative grid items-center gap-6 p-6 sm:p-10 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="display-heading text-4xl sm:text-5xl">[Headline coming]</h3>
              <p className="max-w-sm text-base">[Short line of text coming]</p>
              <Button variant="outline" size="lg">
                Order now <ArrowRight className="size-5" aria-hidden="true" />
              </Button>
              <DotIndicator count={3} active={0} className="justify-start pt-2" />
            </div>
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute inset-4 rounded-full bg-yellow/60" aria-hidden="true" />
              <img
                src="/images/masa-bowls.jpg"
                alt="Bowls of masa with meat and salad"
                className="relative aspect-square w-full rounded-full object-cover shadow-lift ring-8 ring-white/40"
              />
            </div>
          </div>
        </div>
        <div className="on-dark overflow-hidden rounded-card">
          <div className="flex items-center gap-3 bg-hero px-5 py-4 text-on-hero">
            <img src="/images/logo.png" alt="" className="h-10 w-auto" />
            <span className="font-display font-semibold">Footer bar (hero colour)</span>
          </div>
          <div className="bg-ink px-5 py-4 text-sm text-white">Footer bottom: near-black with white text</div>
        </div>
      </Section>

      <Section title="Type">
        <Card className="space-y-3 p-5">
          <p className="display-heading text-4xl">Display heading</p>
          <p className="font-display text-2xl font-bold">Sora bold, section and card titles</p>
          <p className="font-display text-lg font-semibold">Sora semibold, prices and labels</p>
          <p>Inter regular for body text. Northern Nigerian native food, Lugbe, Abuja.</p>
          <p className="text-sm text-muted">Inter small, muted: hints and secondary details.</p>
        </Card>
      </Section>

      <Section title="Buttons">
        <Card className="space-y-5 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <Button>
              <ShoppingBag className="size-5" aria-hidden="true" /> Primary
            </Button>
            <Button variant="dark">Dark</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">
              <Trash2 className="size-5" aria-hidden="true" /> Delete
            </Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small (44px)</Button>
            <Button size="md">Medium (48px)</Button>
            <Button size="lg">Large (56px)</Button>
          </div>
          <Button size="lg" fullWidth className="sm:max-w-sm">
            <WhatsAppIcon className="size-6" /> Send order on WhatsApp
          </Button>
        </Card>
        <div className="flex flex-wrap items-center gap-3 rounded-card bg-hero p-5 text-on-hero">
          <span className="text-sm font-semibold">On the hero:</span>
          <Button variant="outline">Order now</Button>
          <Button variant="dark">Dark</Button>
        </div>
      </Section>

      <Section title="Labels and controls">
        <Card className="space-y-5 p-5">
          <div className="flex flex-wrap gap-2">
            <Pill tone="yellow">Menu</Pill>
            <Pill tone="orange">Pickup</Pill>
            <Pill tone="subtle">Not available</Pill>
            <Pill tone="ink">Admin</Pill>
          </div>
          <OptionPicker legend="Serve with" options={["Miyan Gyada", "Yaji"]} value={option} onChange={setOption} />
          <QuantityStepper value={qty} onChange={setQty} label="Masa" />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Your name" required placeholder="Name for the order" />
            <TextField label="Delivery address" hint="House number, street and a landmark" error="Please enter your delivery address" />
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold">Dots (clickable)</p>
            <DotIndicator count={4} active={dot} onSelect={setDot} label="Card" className="justify-start" />
          </div>
          <div className="flex items-center gap-4">
            <InstagramIcon className="size-6" />
            <WhatsAppIcon className="size-6" />
            <MapPin className="size-6" aria-hidden="true" />
          </div>
        </Card>
      </Section>

      <Section title="Menu cards">
        <p className="text-sm text-muted">
          With photo; without photo (branded placeholder); unavailable (greyed out, label, no Add).
          Names and prices are from the current menu; units and descriptions are placeholders.
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sampleItems.map((item) => (
            <MenuCard key={item._id} item={item} onAdd={() => {}} />
          ))}
        </div>
      </Section>

      <Section title="Info cards">
        <div className="relative overflow-hidden rounded-card bg-page py-2">
          <DecorCircles variant="page" />
          <div className="relative grid grid-cols-1 gap-4 md:grid-cols-3">
            <InfoCard icon={Bike} title="Delivery across Abuja">
              [Copy coming]
            </InfoCard>
            <InfoCard icon={Store} title="Pickup at Monarch Estate">
              House 10, Monarch Estate, Lugbe, Abuja
            </InfoCard>
            <InfoCard icon={WhatsAppIcon} title="Order on WhatsApp">
              [Copy coming]
            </InfoCard>
          </div>
        </div>
      </Section>

      <Section title="Banner band">
        <div className="relative overflow-hidden rounded-card bg-yellow px-6 py-8 text-ink">
          <DecorCircles variant="band" />
          <p className="relative display-heading text-2xl">How to order (yellow band)</p>
        </div>
      </Section>
    </main>
  );
}
