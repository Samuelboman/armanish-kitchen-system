import { Link } from "react-router";
import { MapPin } from "lucide-react";
import SectionLink from "./SectionLink";
import DecorCircles from "../ui/DecorCircles";
import { WhatsAppIcon, InstagramIcon } from "../icons/BrandIcons";
import { BUSINESS } from "../../config/business";

const linkClass = "inline-flex min-h-11 items-center hover:underline underline-offset-4";

// Hero-colour bar with logo and contact details, then a near-black strip with
// links and the copyright line. This is the "Contact" target in the header.
export default function Footer() {
  return (
    <footer id="contact" className="scroll-mt-20">
      <div className="relative overflow-hidden bg-hero text-on-hero">
        <DecorCircles variant="footer" />
        <div className="relative mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-[auto_1fr_auto] md:items-center lg:px-8">
          <img src="/images/logo.png" alt={BUSINESS.name} width="315" height="246" className="h-20 w-auto" />

          <div className="space-y-2">
            <h2 className="display-heading text-lg">Contact</h2>
            <a href={BUSINESS.whatsappUrl} target="_blank" rel="noreferrer" className={`${linkClass} gap-2 font-semibold`}>
              <WhatsAppIcon className="size-5" />
              {BUSINESS.phoneDisplay}
              <span className="sr-only">(WhatsApp, opens in a new tab)</span>
            </a>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <span>{BUSINESS.address}</span>
            </p>
            <p className="text-sm">{BUSINESS.contactLine}</p>
          </div>

          <div className="flex gap-3">
            <a
              href={BUSINESS.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="grid size-12 place-items-center rounded-full bg-ink text-white transition-transform hover:scale-105"
              aria-label={`Instagram ${BUSINESS.instagramHandle} (opens in a new tab)`}
            >
              <InstagramIcon className="size-5" />
            </a>
            <a
              href={BUSINESS.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="grid size-12 place-items-center rounded-full bg-ink text-white transition-transform hover:scale-105"
              aria-label="WhatsApp (opens in a new tab)"
            >
              <WhatsAppIcon className="size-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="on-dark bg-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5">
              <li>
                <SectionLink id="menu" className={linkClass}>Menu</SectionLink>
              </li>
              <li>
                <SectionLink id="about" className={linkClass}>About</SectionLink>
              </li>
              <li>
                <SectionLink id="how-to-order" className={linkClass}>How to order</SectionLink>
              </li>
              <li>
                <Link to="/cart" className={linkClass}>Cart</Link>
              </li>
              <li>
                <Link to="/admin/login" className={`${linkClass} text-white/75`}>Staff login</Link>
              </li>
            </ul>
          </nav>
          <p className="text-white/75">
            © {new Date().getFullYear()} {BUSINESS.name}. {BUSINESS.description}, Lugbe, Abuja.
          </p>
        </div>
      </div>
    </footer>
  );
}
