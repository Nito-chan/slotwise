/* Slotwise single source of truth for brand strings (§0, §12).
   Renaming the product is a one-file change: edit SITE.name only. */

export const SITE = {
  name: "Slotwise",
  tagline: "Fewer empty chairs. More booked days.",
  localeNote: "Made in Doha",
  currency: "USD",
  currencySymbol: "$",
  year: new Date().getFullYear(),
  themeColor: "#0E3B34",
};

export const CTAS = {
  primary: { label: "Start free trial", href: "/book-demo.html?plan=trial" },
  secondary: { label: "See how it works", href: "#how" },
  tertiary: { label: "Book a 15-min demo", href: "/book-demo.html" },
  login: { label: "Log in", href: "#" },
};

export const ANNOUNCEMENT = {
  text: "New: WhatsApp reminders are live.",
  href: "#features",
  storageKey: "slotwise-announce-dismissed",
};

export const NAV_LINKS = [
  { label: "Product", href: "/#how" },
  { label: "Industries", href: "/#industries" },
  { label: "Pricing", href: "/pricing.html" },
  { label: "FAQ", href: "/#faq" },
];

export const MICRO_TRUST = [
  "14-day free trial",
  "No credit card",
  "Cancel anytime",
];

export const PRICING = [
  {
    id: "starter",
    name: "Starter",
    monthly: 29,
    annual: 24,
    blurb: "For one location getting started.",
    features: [
      "1 location",
      "Up to 150 reminders/mo",
      "SMS + email",
      "Basic reports",
    ],
    cta: { label: "Start free trial", href: "/book-demo.html?plan=starter" },
  },
  {
    id: "growth",
    name: "Growth",
    monthly: 79,
    annual: 66,
    badge: "Most popular",
    blurb: "For busy calendars that fill gaps fast.",
    features: [
      "Up to 800 reminders/mo",
      "WhatsApp reminders",
      "Waitlist auto-refill",
      "Win-back flows",
    ],
    cta: { label: "Start free trial", href: "/book-demo.html?plan=growth" },
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 159,
    annual: 132,
    blurb: "For teams and multiple locations.",
    features: [
      "Multi-location (up to 5)",
      "Unlimited reminders, fair use",
      "Deposits",
      "Priority support",
      "Custom sender name",
    ],
    cta: { label: "Start free trial", href: "/book-demo.html?plan=pro" },
  },
];

export const BILLING = {
  monthlyNote: "per month, billed monthly",
  annualNote: "per month, billed annually",
  annualBadge: "Save 17%",
};

export const LEGAL = {
  conceptNotice:
    "Concept project. All names, figures and testimonials are fictional placeholders.",
  privacyNote: "Sample policy for a concept project.",
};
