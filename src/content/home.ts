import type { ArtKind } from "@/components/commerce/product-art";
import type { Localized } from "@/i18n";

/**
 * Homepage content (typed fallback for the CMS; moves to Shopify metaobjects in Phase 6).
 * Categories (the five tiles) come from `categories` in src/config/navigation.ts.
 *
 * PHOTOGRAPHY: every `image` is an optional path under /public. Drop a file with that exact name into
 * D:\SS\public\images\... and it replaces the placeholder scene automatically. Use photos you own or
 * have licensed (brand dealer media kits, your own installation shoots). See public/images/README.md.
 */

// ---------- Hero ----------

export interface HeroSlide {
  id: string;
  eyebrow: Localized;
  title: Localized;
  body: Localized;
  cta: { label: Localized; href: string };
  art: ArtKind;
  image?: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "ac",
    eyebrow: { en: "Panasonic · Daikin · Mitsubishi · Haier", ta: "Panasonic · Daikin · Mitsubishi · Haier" },
    title: { en: "Cool rooms.\nNo surprise bills.", ta: "குளிர்ந்த அறைகள்.\nகூடுதல் கட்டணம் இல்லை." },
    body: {
      en: "Split and window ACs with stabiliser, piping, stand and installation in one honest number.",
      ta: "ஸ்டெபிலைசர், பைப்பிங், ஸ்டாண்ட், நிறுவலுடன் ஸ்பிளிட் மற்றும் விண்டோ AC ஒரே விலையில்.",
    },
    cta: { label: { en: "Shop ACs", ta: "AC வாங்குங்கள்" }, href: "/collections/air-conditioners" },
    art: "ac",
    image: "/images/home/hero-ac.jpg",
  },
  {
    id: "convertible",
    eyebrow: { en: "8-in-1 convertible ACs", ta: "8-in-1 கன்வெர்ட்டிபிள் AC" },
    title: { en: "One AC.\nEight ways to cool.", ta: "ஒரே AC.\nஎட்டு விதக் குளிர்ச்சி." },
    body: {
      en: "Run at the capacity you need and save power on milder days. Ask us which model suits your room.",
      ta: "தேவையான அளவில் இயக்கி மின்சாரத்தைச் சேமியுங்கள். உங்கள் அறைக்கு ஏற்ற மாடலைக் கேளுங்கள்.",
    },
    cta: { label: { en: "See convertible ACs", ta: "கன்வெர்ட்டிபிள் AC" }, href: "/search?q=8+in+1+convertible" },
    art: "ac",
    image: "/images/home/hero-convertible.jpg",
  },
  {
    id: "home",
    eyebrow: { en: "For the whole home", ta: "முழு வீட்டுக்கும்" },
    title: { en: "Fridges, washers, TVs\nand inverters too.", ta: "ஃப்ரிட்ஜ், வாஷர், டிவி,\nஇன்வர்ட்டரும் கூட." },
    body: {
      en: "Delivered, installed and backed by our own team across Chennai. 7-day hassle-free returns.",
      ta: "சென்னை முழுவதும் எங்கள் குழுவால் டெலிவரி, நிறுவல். 7 நாள் எளிய ரிட்டர்ன்.",
    },
    cta: { label: { en: "Talk to an expert", ta: "நிபுணரிடம் பேசுங்கள்" }, href: "/contact" },
    art: "fridge",
    image: "/images/home/hero-home.jpg",
  },
];

/** Rotating examples in the "Tell us what you are looking for?" field. */
export const promptExamples: Localized[] = [
  { en: "1.5 ton split AC", ta: "1.5 டன் ஸ்பிளிட் AC" },
  { en: "Window AC", ta: "விண்டோ AC" },
  { en: "8 in 1 convertible", ta: "8 in 1 கன்வெர்ட்டிபிள்" },
  { en: "2 ton inverter AC", ta: "2 டன் இன்வர்ட்டர் AC" },
];

// ---------- In the spotlight ----------

export interface OfferCard {
  id: string;
  label: Localized;
  promise: Localized;
  cta: { label: Localized; href: string };
  art: ArtKind;
  image?: string;
}

export const offerCards: OfferCard[] = [
  {
    id: "exchange-ac",
    label: { en: "Value upgrades", ta: "மதிப்பு மேம்பாடு" },
    promise: { en: "Exchange your old AC for a fair value off a new inverter model.", ta: "பழைய AC-ஐ மாற்றி புதிய இன்வர்ட்டர் மாடலில் நியாயமான மதிப்பு." },
    cta: { label: { en: "Exchange", ta: "மாற்றுங்கள்" }, href: "/offers#exchange" },
    art: "ac",
    image: "/images/home/offer-exchange.png",
  },
  {
    id: "all-in",
    label: { en: "All-in price", ta: "முழு விலை" },
    promise: { en: "Installation, stand and copper piping included. One number, upfront.", ta: "நிறுவல், ஸ்டாண்ட், காப்பர் பைப்பிங் உட்பட. ஒரே விலை." },
    cta: { label: { en: "See packages", ta: "பேக்கேஜ்கள்" }, href: "/collections/air-conditioners" },
    art: "windowac",
    image: "/images/home/offer-all-in.png",
  },
  {
    id: "emi",
    label: { en: "Easy EMIs", ta: "எளிய EMI" },
    promise: { en: "No-cost EMI on leading cards, 3 to 12 months.", ta: "முன்னணி கார்டுகளில் 3–12 மாத கட்டணமில்லா EMI." },
    cta: { label: { en: "Ask on WhatsApp", ta: "WhatsApp-ல் கேளுங்கள்" }, href: "/offers#emi" },
    art: "fridge",
    image: "/images/home/offer-emi.png",
  },
  {
    id: "returns",
    label: { en: "7-day returns", ta: "7 நாள் ரிட்டர்ன்" },
    promise: { en: "Shop with confidence: hassle-free returns within 7 days.", ta: "நம்பிக்கையுடன் வாங்குங்கள்: 7 நாட்களுக்குள் எளிய ரிட்டர்ன்." },
    cta: { label: { en: "How it works", ta: "எப்படி" }, href: "/legal/returns" },
    art: "box",
    image: "/images/home/offer-returns.png",
  },
];

// ---------- Full-bleed lifestyle banners ----------

export interface LifestyleBanner {
  id: string;
  label: Localized;
  title: Localized;
  shopHref: string;
  discoverHref: string;
  art: ArtKind;
  tone: "warm" | "sand" | "cool" | "dark" | "light";
  image?: string;
}

export const lifestyleBanners: LifestyleBanner[] = [
  {
    id: "living",
    label: { en: "Air conditioners", ta: "ஏர் கண்டிஷனர்கள்" },
    title: { en: "Chennai heat,\nleft at the door.", ta: "சென்னை வெயில்,\nவாசலிலேயே நிற்கும்." },
    shopHref: "/collections/air-conditioners",
    discoverHref: "/guides/ac-tonnage-guide",
    art: "ac",
    tone: "cool",
    image: "/images/home/banner-living.jpg",
  },
  {
    id: "kitchen",
    label: { en: "Refrigerators", ta: "குளிர்சாதனப் பெட்டிகள்" },
    title: { en: "Food stays fresher.\nMornings run smoother.", ta: "உணவு புதிதாக இருக்கும்.\nகாலைகள் எளிதாகும்." },
    shopHref: "/collections/refrigerators",
    discoverHref: "/guides/refrigerator-size-guide",
    art: "fridge",
    tone: "light",
    image: "/images/home/banner-kitchen.jpg",
  },
  {
    id: "laundry",
    label: { en: "Washing machines", ta: "வாஷிங் மெஷின்கள்" },
    title: { en: "Fresh laundry,\nevery single day.", ta: "ஒவ்வொரு நாளும்\nபுதிய சலவை." },
    shopHref: "/collections/washing-machines",
    discoverHref: "/guides/front-load-vs-top-load",
    art: "washer",
    tone: "warm",
    image: "/images/home/banner-laundry.jpg",
  },
];

/** Product handles for the "Best sellers" carousel (Shopify: use a "best-sellers" collection later). */
export const bestSellerHandles = [
  "panasonic-cs-cu-kn18cky",
  "panasonic-eu-8-in-1-convertible-1-5-ton-3-star-inverter-split-ac",
  "panasonic-1-ton-3-star-split-air-conditioner",
  "panasonic-xu-8-in-1-convertible-1-5-ton-5-star-inverter-window-ac",
  "panasonic-1-5-ton-3-star-hot-cold-wi-fi-inverter-split-smart-ac",
  "panasonic-cs-cu-ru24cky",
  "panasonic-eu-8-in-1-convertible-1-ton-3-star-inverter-split-smart-ac",
  "panasonic-cw-ln183cm",
];

// ---------- Everyday, made easier (editorial) ----------

export const everyday = {
  lead: { en: "Your everyday,", ta: "உங்கள் அன்றாடம்," } as Localized,
  accent: { en: "made easier", ta: "எளிதாக்கப்பட்டது" } as Localized,
  body: {
    en: "Buying guides, care tips and honest comparisons from years of installing appliances in Chennai homes.",
    ta: "சென்னை வீடுகளில் பல ஆண்டு நிறுவல் அனுபவத்திலிருந்து வாங்கும் வழிகாட்டிகள், பராமரிப்பு குறிப்புகள்.",
  } as Localized,
  feature: { art: "ac" as ArtKind, image: "/images/home/everyday-feature.jpg" },
};

export interface Story {
  slug: string;
  tag: Localized;
  title: Localized;
  art: ArtKind;
  image?: string;
}

export const stories: Story[] = [
  { slug: "ac-tonnage-guide", tag: { en: "Air conditioners", ta: "AC" }, title: { en: "1, 1.5 or 2 ton? Sizing an AC for your room", ta: "1, 1.5 அல்லது 2 டன்? அறைக்கு ஏற்ற AC" }, art: "ac", image: "/images/stories/ac-tonnage.jpg" },
  { slug: "convertible-ac-explained", tag: { en: "Air conditioners", ta: "AC" }, title: { en: "8-in-1 convertible ACs, explained simply", ta: "8-in-1 கன்வெர்ட்டிபிள் AC எளிய விளக்கம்" }, art: "ac", image: "/images/stories/convertible.jpg" },
  { slug: "split-vs-window-ac", tag: { en: "Air conditioners", ta: "AC" }, title: { en: "Split or window AC: which suits your home?", ta: "ஸ்பிளிட்டா விண்டோவா: உங்கள் வீட்டுக்கு எது?" }, art: "windowac", image: "/images/stories/split-vs-window.jpg" },
  { slug: "refrigerator-size-guide", tag: { en: "Refrigerators", ta: "ஃப்ரிட்ஜ்" }, title: { en: "How many litres does your family need?", ta: "உங்கள் குடும்பத்துக்கு எத்தனை லிட்டர்?" }, art: "fridge", image: "/images/stories/fridge-size.jpg" },
  { slug: "choosing-a-home-inverter", tag: { en: "Inverters", ta: "இன்வர்ட்டர்" }, title: { en: "Choosing a home inverter and battery", ta: "வீட்டு இன்வர்ட்டர், பேட்டரி தேர்வு" }, art: "inverter", image: "/images/stories/inverter.jpg" },
];

// ---------- Brand banner ----------

export const brandBanner = {
  title: { en: "Authorised brands.\nInstalled by our own team.", ta: "அங்கீகரிக்கப்பட்ட பிராண்டுகள்.\nஎங்கள் குழுவால் நிறுவல்." } as Localized,
  cta: { en: "About us", ta: "எங்களைப் பற்றி" } as Localized,
  art: "ac" as ArtKind,
  image: "/images/home/brand.jpg",
};

// ---------- Real installations (differentiator) ----------

export interface Installation {
  id: string;
  locality: string;
  product: { title: string; handle: string };
  art: ArtKind;
  note: Localized;
  image?: string;
  /** Placeholder until a real install photo is added. Shown with a visible "Sample" label. */
  sample: boolean;
}

export const installations: Installation[] = [
  { id: "i1", locality: "St. Thomas Mount", product: { title: "Panasonic CS/CU-KN18CKY", handle: "panasonic-cs-cu-kn18cky" }, art: "ac", note: { en: "Bedroom, 2nd floor", ta: "படுக்கையறை, 2வது மாடி" }, image: "/images/installations/install-1.jpg", sample: true },
  { id: "i2", locality: "Ramapuram", product: { title: "Panasonic CW-LN183CM", handle: "panasonic-cw-ln183cm" }, art: "windowac", note: { en: "Window AC in a shop front", ta: "கடையில் விண்டோ AC" }, image: "/images/installations/install-2.jpg", sample: true },
  { id: "i3", locality: "Nandambakkam", product: { title: "Panasonic EU 8 in 1 Convertible 1.5 Ton", handle: "panasonic-eu-8-in-1-convertible-1-5-ton-3-star-inverter-split-ac" }, art: "ac", note: { en: "Living room, wall-mounted outdoor unit", ta: "ஹால், சுவரில் வெளிப்புற யூனிட்" }, image: "/images/installations/install-3.jpg", sample: true },
  { id: "i4", locality: "Porur", product: { title: "Panasonic CS/CU-RU24CKY", handle: "panasonic-cs-cu-ru24cky" }, art: "ac", note: { en: "Office cabin, 2 Ton", ta: "அலுவலக அறை, 2 டன்" }, image: "/images/installations/install-4.jpg", sample: true },
];

// ---------- Value props ----------

export const valueProps: { id: string; icon: "truck" | "card" | "exchange"; title: Localized; body: Localized }[] = [
  { id: "delivery", icon: "truck", title: { en: "Free home delivery", ta: "இலவச டெலிவரி" }, body: { en: "Across Chennai, with installation booked in.", ta: "சென்னை முழுவதும், நிறுவலுடன்." } },
  { id: "emi", icon: "card", title: { en: "Easy EMIs", ta: "எளிய EMI" }, body: { en: "No-cost EMI on leading cards and UPI pay-later.", ta: "கட்டணமில்லா EMI, UPI பே-லேட்டர்." } },
  { id: "exchange", icon: "exchange", title: { en: "7-day returns & exchange", ta: "7 நாள் ரிட்டர்ன் & மாற்று" }, body: { en: "Hassle-free returns, and fair value for your old appliance.", ta: "எளிய ரிட்டர்ன், பழைய உபகரணத்துக்கு நியாயமான மதிப்பு." } },
];

// ---------- Reviews (placeholders: replace with real Google reviews) ----------

export const sampleReviews: { id: string; name: string; locality: string; rating: number; text: Localized }[] = [
  { id: "r1", name: "Sample reviewer", locality: "Chennai", rating: 5, text: { en: "Placeholder: a real Google review appears here once the reviews widget is connected.", ta: "இடம்பிடிப்பு: உண்மையான Google மதிப்புரை இங்கே தோன்றும்." } },
  { id: "r2", name: "Sample reviewer", locality: "Chennai", rating: 5, text: { en: "Placeholder: we never publish invented reviews.", ta: "இடம்பிடிப்பு: கற்பனை மதிப்புரைகளை வெளியிடுவதில்லை." } },
  { id: "r3", name: "Sample reviewer", locality: "Chennai", rating: 4, text: { en: "Placeholder: Tamil video testimonials sit alongside these.", ta: "இடம்பிடிப்பு: தமிழ் வீடியோ அனுபவங்கள் இவற்றுடன்." } },
];

// ---------- Get started ----------

export const getStarted = {
  lead: { en: "Get started.", ta: "தொடங்குங்கள்." } as Localized,
  accent: { en: "We've kept it simple.", ta: "எளிமையாக வைத்துள்ளோம்." } as Localized,
};

export const quickLinks: { id: string; icon: "passport" | "manual" | "contact" | "faq"; title: Localized; body: Localized; cta: Localized; href: string }[] = [
  { id: "register", icon: "passport", title: { en: "Product registration", ta: "பொருள் பதிவு" }, body: { en: "Create your Appliance Passport for warranty and service reminders.", ta: "வாரண்டி, சேவை நினைவூட்டல்களுக்கு உபகரண பாஸ்போர்ட்." }, cta: { en: "Register here", ta: "இங்கே பதிவு செய்யுங்கள்" }, href: "/passport" },
  { id: "track", icon: "manual", title: { en: "Track your order", ta: "ஆர்டரைக் கண்காணி" }, body: { en: "Delivery and installation status, step by step.", ta: "டெலிவரி, நிறுவல் நிலை படிப்படியாக." }, cta: { en: "Track now", ta: "இப்போது கண்காணி" }, href: "/support/track-order" },
  { id: "contact", icon: "contact", title: { en: "Get in touch", ta: "தொடர்பு கொள்ள" }, body: { en: "Call +91 96011 11070, WhatsApp us or visit the store in St. Thomas Mount.", ta: "+91 96011 11070 அழைக்கவும், WhatsApp செய்யவும், அல்லது கடைக்கு வாருங்கள்." }, cta: { en: "Let's connect", ta: "இணைவோம்" }, href: "/contact" },
  { id: "faq", icon: "faq", title: { en: "FAQs", ta: "கேள்விகள்" }, body: { en: "Delivery, installation, EMI, returns and warranty, answered.", ta: "டெலிவரி, நிறுவல், EMI, ரிட்டர்ன், வாரண்டி பதில்கள்." }, cta: { en: "Start here", ta: "இங்கே தொடங்குங்கள்" }, href: "/faq" },
];

// ---------- Footer ----------

export const footerContent = {
  newsletterLead: { en: "Sale updates,", ta: "விற்பனைச் செய்திகள்," } as Localized,
  newsletterAccent: { en: "straight to your inbox.", ta: "நேராக உங்கள் இன்பாக்ஸுக்கு." } as Localized,
  /** Giant wordmark at the bottom of the footer. */
  wordmark: { sans: "stay", serif: "cool" },
};
