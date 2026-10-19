// Business facts shown on the site, in one place. All confirmed by the owner
// (Build Data Pack v6, sections 6 and 13). Change them here, not in components.

const WHATSAPP_INTERNATIONAL = "2347030462212";

export const BUSINESS = {
  name: "Armanish Delight",
  description: "Northern Nigerian native food",

  address: "House 10, Monarch Estate, Lugbe, Abuja",
  pickupPoint: "House 10, Monarch Estate, Lugbe, Abuja",

  phoneDisplay: "07030462212", // also the WhatsApp number
  phoneHref: "tel:+2347030462212",
  whatsappNumber: WHATSAPP_INTERNATIONAL,
  whatsappUrl: `https://wa.me/${WHATSAPP_INTERNATIONAL}`,

  instagramUrl: "https://www.instagram.com/armanish_delight",
  instagramHandle: "@armanish_delight",

  bank: {
    name: "Moniepoint",
    accountNumber: "7030462212",
    accountName: "Lovinnah Edward",
  },

  // From the owner's flyer (decided 11 Oct 2026 to use as site copy).
  tagline: "Your go-to when you miss mama.",
  badges: ["Fresh • Homemade • Authentic", "Tasty • Made with love"],
  contactLine: "Contact us via WhatsApp or call for orders & catering",
};

// Opens WhatsApp with the business chat and, optionally, a pre-filled message.
export function whatsappLink(message) {
  return message ? `${BUSINESS.whatsappUrl}?text=${encodeURIComponent(message)}` : BUSINESS.whatsappUrl;
}
