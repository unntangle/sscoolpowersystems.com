import type { Localized } from "@/i18n";
import type { ProductCard } from "@/lib/shopify/mappers";
import type { PricingMode } from "@/lib/shopify/metafields";

/**
 * LOCAL CATALOGUE — the products currently listed on SS Cool Power Systems' website (page 1 of 2,
 * transcribed from a screenshot on 2026-11-08). Used until the Shopify store is connected; nothing here
 * is shown once Shopify is configured.
 *
 * SCOPE: five categories only — Air Conditioners, Washing Machines, Refrigerators, Televisions, Inverters.
 * VERIFY before launch: prices were read from a small image. Items marked `verify` have titles that were
 * cut off. Page 2 (15 more products) is still to be added.
 * Capacity comes from Panasonic's model code (12 = 1 Ton, 18 = 1.5 Ton, 24 = 2 Ton).
 */

export interface DemoCollection {
  handle: string;
  title: Localized;
  description: Localized;
  /** Child collection handles (parent pages show their children's products). */
  children?: string[];
}

export const demoCollections: DemoCollection[] = [
  {
    handle: "air-conditioners",
    title: { en: "Air Conditioners", ta: "ஏர் கண்டிஷனர்கள்" },
    description: { en: "Split and window ACs for Chennai summers.", ta: "சென்னை வெயிலுக்கு ஸ்பிளிட் மற்றும் விண்டோ AC." },
    children: ["split-acs", "window-acs"],
  },
  {
    handle: "split-acs",
    title: { en: "Split ACs", ta: "ஸ்பிளிட் AC" },
    description: { en: "Inverter and convertible split air conditioners.", ta: "இன்வர்ட்டர் மற்றும் கன்வெர்ட்டிபிள் ஸ்பிளிட் AC." },
  },
  {
    handle: "window-acs",
    title: { en: "Window ACs", ta: "விண்டோ AC" },
    description: { en: "No outdoor unit needed.", ta: "வெளிப்புற யூனிட் தேவையில்லை." },
  },
  {
    handle: "washing-machines",
    title: { en: "Washing Machines", ta: "வாஷிங் மெஷின்கள்" },
    description: { en: "Front load and top load washing machines.", ta: "ஃப்ரண்ட் லோடு மற்றும் டாப் லோடு வாஷிங் மெஷின்கள்." },
    children: ["front-load-washing-machines", "top-load-washing-machines"],
  },
  { handle: "front-load-washing-machines", title: { en: "Front Load Washing Machines", ta: "ஃப்ரண்ட் லோடு" }, description: { en: "Gentle on clothes.", ta: "துணிகளுக்கு மென்மை." } },
  { handle: "top-load-washing-machines", title: { en: "Top Load Washing Machines", ta: "டாப் லோடு" }, description: { en: "Quick everyday washes.", ta: "விரைவான அன்றாட சலவை." } },
  {
    handle: "refrigerators",
    title: { en: "Refrigerators", ta: "குளிர்சாதனப் பெட்டிகள்" },
    description: { en: "Single door to side-by-side.", ta: "சிங்கிள் டோர் முதல் சைட்-பை-சைட் வரை." },
  },
  {
    handle: "televisions",
    title: { en: "Televisions", ta: "தொலைக்காட்சிகள்" },
    description: { en: "Smart TVs for every room.", ta: "ஒவ்வொரு அறைக்கும் ஸ்மார்ட் டிவி." },
  },
  {
    handle: "inverters",
    title: { en: "Inverters", ta: "இன்வர்ட்டர்கள்" },
    description: { en: "Home power backup: inverters and batteries.", ta: "வீட்டு மின் காப்பு: இன்வர்ட்டர், பேட்டரி." },
  },
];

export interface DemoProduct extends ProductCard {
  collections: string[];
  /** Title or price needs checking against the live site / brand price list. */
  verify?: boolean;
}

interface AcInput {
  handle: string;
  title: string;
  kind: "split" | "window";
  tons: string;
  /** Selling price shown on the current website (INR). */
  price: number;
  mrp: number;
  stars?: number;
  features?: string[];
  popular?: boolean;
  verify?: boolean;
}

/** Large appliances are quote-led (pricing_mode = whatsapp_quote); the current selling price becomes the "Starting from" band. */
const MODE: PricingMode = "whatsapp_quote";

function ac(i: AcInput): DemoProduct {
  const features = [i.kind === "window" ? "Window AC" : "Split AC", ...(i.features ?? [])];
  return {
    id: `gid://local/Product/${i.handle}`,
    handle: i.handle,
    title: i.title,
    vendor: "Panasonic",
    productType: i.kind === "window" ? "Window Air Conditioner" : "Split Air Conditioner",
    tags: [i.kind, ...(i.popular ? ["popular"] : []), ...(i.verify ? ["verify"] : [])],
    availableForSale: true,
    image: null,
    pricingMode: MODE,
    price: null,
    mrp: i.mrp,
    priceBand: { min: i.price, max: null },
    defaultVariantId: null,
    energyRating: i.stars ?? null,
    capacity: i.tons,
    keyFeatures: features,
    collections: ["air-conditioners", i.kind === "window" ? "window-acs" : "split-acs"],
    verify: i.verify,
  };
}

export const demoProducts: DemoProduct[] = [
  // ---------- Window ACs ----------
  ac({ handle: "panasonic-cw-ln183cm", title: "Panasonic CW-LN183CM", kind: "window", tons: "1.5 Ton", price: 40000, mrp: 43500 }),
  ac({ handle: "panasonic-cw-lu183cg", title: "Panasonic CW-LU183CG", kind: "window", tons: "1.5 Ton", price: 42000, mrp: 44000 }),
  ac({
    handle: "panasonic-xu-8-in-1-convertible-1-5-ton-5-star-inverter-window-ac",
    title: "Panasonic XU 8 in 1 Convertible 1.5 Ton 5 Star Inverter Window AC",
    kind: "window",
    tons: "1.5 Ton",
    stars: 5,
    price: 47000,
    mrp: 48500,
    features: ["8-in-1 convertible", "Inverter"],
  }),

  // ---------- Split ACs: model-code listings ----------
  ac({ handle: "panasonic-cs-cu-kn24cky", title: "Panasonic CS/CU-KN24CKY", kind: "split", tons: "2 Ton", price: 52000, mrp: 64500 }),
  ac({ handle: "panasonic-cs-cu-kn18cky", title: "Panasonic CS/CU-KN18CKY", kind: "split", tons: "1.5 Ton", price: 40000, mrp: 52000, popular: true }),
  ac({ handle: "panasonic-ac-cs-cu-kn12cky", title: "Panasonic AC CS/CU-KN12CKY", kind: "split", tons: "1 Ton", price: 33000, mrp: 45500, verify: true }),
  ac({ handle: "panasonic-cs-cu-kn12cky", title: "Panasonic CS/CU-KN12CKY", kind: "split", tons: "1 Ton", price: 43000, mrp: 45500, verify: true }),
  ac({ handle: "panasonic-cs-cu-kn18cky3x", title: "Panasonic CS/CU-KN18CKY3X", kind: "split", tons: "1.5 Ton", price: 42000, mrp: 57000 }),
  ac({ handle: "panasonic-cs-cu-kn12cky3x", title: "Panasonic CS/CU-KN12CKY3X", kind: "split", tons: "1 Ton", price: 46000, mrp: 48500 }),
  ac({ handle: "panasonic-cs-cu-ru24cky", title: "Panasonic CS/CU-RU24CKY", kind: "split", tons: "2 Ton", price: 49500, mrp: 68500 }),
  ac({ handle: "panasonic-cs-cu-ru18cky-1", title: "Panasonic CS/CU-RU18CKY-1", kind: "split", tons: "1.5 Ton", price: 34300, mrp: 52500 }),
  ac({ handle: "panasonic-cs-cu-ru18cky", title: "Panasonic CS/CU-RU18CKY", kind: "split", tons: "1.5 Ton", price: 52000, mrp: 53500 }),
  ac({ handle: "panasonic-cs-cu-eu18cky3xfmh", title: "Panasonic CS/CU-EU18CKY3XFMH", kind: "split", tons: "1.5 Ton", price: 57500, mrp: 59500 }),
  ac({ handle: "panasonic-cs-cu-ez24ckyfm", title: "Panasonic CS/CU-EZ24CKYFM", kind: "split", tons: "2 Ton", price: 74000, mrp: 75500 }),

  // ---------- Split ACs: descriptive listings ----------
  ac({
    handle: "panasonic-1-ton-3-star-split-air-conditioner",
    title: "Panasonic 1 Ton 3 Star Split Air Conditioner",
    kind: "split",
    tons: "1 Ton",
    stars: 3,
    price: 34000,
    mrp: 47000,
    popular: true,
  }),
  ac({
    handle: "panasonic-1-ton-3-star-inverter-split-ac",
    title: "Panasonic 1 Ton 3 Star Inverter Split AC",
    kind: "split",
    tons: "1 Ton",
    stars: 3,
    price: 34000,
    mrp: 51500,
    features: ["Inverter"],
  }),
  ac({
    handle: "panasonic-eu-8-in-1-convertible-1-ton-3-star-inverter-split-smart-ac",
    title: "Panasonic EU 8 in 1 Convertible 1 Ton 3 Star Inverter Split Smart AC",
    kind: "split",
    tons: "1 Ton",
    stars: 3,
    price: 50500,
    mrp: 53000,
    features: ["8-in-1 convertible", "Smart (Wi-Fi)"],
  }),
  ac({
    handle: "panasonic-eu-8-in-1-convertible-1-5-ton-3-star-inverter-split-ac",
    title: "Panasonic EU 8 in 1 Convertible 1.5 Ton 3 Star Inverter Split AC",
    kind: "split",
    tons: "1.5 Ton",
    stars: 3,
    price: 55000,
    mrp: 57000,
    features: ["8-in-1 convertible", "Inverter"],
    popular: true,
  }),
  ac({
    // Title cut off in the screenshot ("...Split AC with P..."): confirm full name.
    handle: "panasonic-eu-8-in-1-convertible-1-5-ton-3-star-inverter-split-ac-with-p",
    title: "Panasonic EU 8 in 1 Convertible 1.5 Ton 3 Star Inverter Split AC (full name to confirm)",
    kind: "split",
    tons: "1.5 Ton",
    stars: 3,
    price: 56500,
    mrp: 58500,
    features: ["8-in-1 convertible", "Inverter"],
    verify: true,
  }),
  ac({
    handle: "panasonic-1-5-ton-3-star-hot-cold-wi-fi-inverter-split-smart-ac",
    title: "Panasonic 1.5 Ton 3 Star Hot & Cold Wi-Fi Inverter Split Smart AC",
    kind: "split",
    tons: "1.5 Ton",
    stars: 3,
    price: 60000,
    mrp: 62000,
    features: ["Hot & cold", "Smart (Wi-Fi)"],
  }),
  ac({
    handle: "panasonic-eu-8-in-1-convertible-2-ton-3-star-inverter-split-ac",
    title: "Panasonic EU 8 in 1 Convertible 2 Ton 3 Star Inverter Split AC",
    kind: "split",
    tons: "2 Ton",
    stars: 3,
    price: 71500,
    mrp: 72500,
    features: ["8-in-1 convertible", "Inverter"],
  }),
  ac({
    // Title cut off in the screenshot ("...Split AC with P..."): confirm full name.
    handle: "panasonic-eu-8-in-1-convertible-2-ton-5-star-inverter-split-ac-with-p",
    title: "Panasonic EU 8 in 1 Convertible 2 Ton 5 Star Inverter Split AC (full name to confirm)",
    kind: "split",
    tons: "2 Ton",
    stars: 5,
    price: 70500,
    mrp: 71500,
    features: ["8-in-1 convertible", "Inverter"],
    verify: true,
  }),
  ac({
    handle: "panasonic-qu-8-in-1-convertible-2-5-ton-3-star-inverter-split-smart-ac",
    title: "Panasonic QU 8 in 1 Convertible 2.5 Ton 3 Star Inverter Split Smart AC",
    kind: "split",
    tons: "2.5 Ton",
    stars: 3,
    price: 94500,
    mrp: 95500,
    features: ["8-in-1 convertible", "Smart (Wi-Fi)"],
  }),
];
