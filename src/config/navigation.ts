import type { Localized } from "@/i18n";

/**
 * Product categories for the Products menu, mobile menu and footer.
 * SCOPE: exactly five categories — Air Conditioners, Washing Machines, Refrigerators, Televisions, Inverters.
 * Top-level items (Home, About, Products, Brands, Contact, Shop Now) live in main-nav.ts.
 */

export type NavIcon = "ac" | "washer" | "fridge" | "tv" | "inverter";

export interface NavLink {
  label: Localized;
  href: string;
}

export interface NavGroup {
  id: string;
  title: Localized;
  icon: NavIcon;
  href: string;
  links: NavLink[];
}

export interface NavSection {
  id: "home";
  title: Localized;
  groups: NavGroup[];
  promo: { title: Localized; body: Localized; href: string; cta: Localized };
}

const c = (handle: string) => `/collections/${handle}`;

/** The five categories, in display order. Handles match Shopify collection handles. */
export const categories: { handle: string; title: Localized; icon: NavIcon }[] = [
  { handle: "air-conditioners", title: { en: "Air Conditioners", ta: "ஏர் கண்டிஷனர்கள்" }, icon: "ac" },
  { handle: "washing-machines", title: { en: "Washing Machines", ta: "வாஷிங் மெஷின்கள்" }, icon: "washer" },
  { handle: "refrigerators", title: { en: "Refrigerators", ta: "குளிர்சாதனப் பெட்டிகள்" }, icon: "fridge" },
  { handle: "televisions", title: { en: "Televisions", ta: "தொலைக்காட்சிகள்" }, icon: "tv" },
  { handle: "inverters", title: { en: "Inverters", ta: "இன்வர்ட்டர்கள்" }, icon: "inverter" },
];

const viewAll: Localized = { en: "View all", ta: "அனைத்தையும் காண்க" };

export const megaMenu: NavSection[] = [
  {
    id: "home",
    title: { en: "Products", ta: "பொருட்கள்" },
    groups: [
      {
        id: "air-conditioners",
        title: categories[0]!.title,
        icon: "ac",
        href: c("air-conditioners"),
        links: [
          { label: { en: "Split ACs", ta: "ஸ்பிளிட் AC" }, href: c("split-acs") },
          { label: { en: "Window ACs", ta: "விண்டோ AC" }, href: c("window-acs") },
          { label: viewAll, href: c("air-conditioners") },
        ],
      },
      {
        id: "washing-machines",
        title: categories[1]!.title,
        icon: "washer",
        href: c("washing-machines"),
        links: [
          { label: { en: "Front Load", ta: "ஃப்ரண்ட் லோடு" }, href: c("front-load-washing-machines") },
          { label: { en: "Top Load", ta: "டாப் லோடு" }, href: c("top-load-washing-machines") },
          { label: viewAll, href: c("washing-machines") },
        ],
      },
      {
        id: "refrigerators",
        title: categories[2]!.title,
        icon: "fridge",
        href: c("refrigerators"),
        links: [{ label: viewAll, href: c("refrigerators") }],
      },
      {
        id: "televisions",
        title: categories[3]!.title,
        icon: "tv",
        href: c("televisions"),
        links: [{ label: viewAll, href: c("televisions") }],
      },
      {
        id: "inverters",
        title: categories[4]!.title,
        icon: "inverter",
        href: c("inverters"),
        links: [{ label: viewAll, href: c("inverters") }],
      },
    ],
    promo: {
      title: { en: "All-in Installed Price", ta: "நிறுவலுடன் முழு விலை" },
      body: {
        en: "Appliance, stabiliser, piping, stand, installation and warranty. One number, no surprises.",
        ta: "உபகரணம், ஸ்டெபிலைசர், பைப்பிங், ஸ்டாண்ட், நிறுவல், வாரண்டி. ஒரே விலை.",
      },
      href: c("air-conditioners"),
      cta: { en: "See AC packages", ta: "AC பேக்கேஜ்களைக் காண்க" },
    },
  },
];

/** Secondary links (mobile menu extras). */
export const topLinks: NavLink[] = [
  { label: { en: "Buying guides", ta: "வழிகாட்டிகள்" }, href: "/guides" },
  { label: { en: "Offers", ta: "சலுகைகள்" }, href: "/offers" },
  { label: { en: "Track your order", ta: "ஆர்டரைக் கண்காணி" }, href: "/support/track-order" },
];

/** Search overlay "Discover" chips. */
export const discoverQueries: Localized[] = [
  { en: "1.5 ton split AC", ta: "1.5 ton split AC" },
  { en: "window AC", ta: "window AC" },
  { en: "8 in 1 convertible", ta: "8 in 1 convertible" },
  { en: "2 ton", ta: "2 ton" },
  { en: "smart AC", ta: "smart AC" },
];

export interface FooterGroup {
  title: Localized;
  links: NavLink[];
}

export const footerGroups: FooterGroup[] = [
  {
    title: { en: "Products", ta: "பொருட்கள்" },
    links: categories.map((cat) => ({ label: cat.title, href: c(cat.handle) })),
  },
  {
    title: { en: "Company", ta: "நிறுவனம்" },
    links: [
      { label: { en: "About Us", ta: "எங்களைப் பற்றி" }, href: "/about" },
      { label: { en: "Brands", ta: "பிராண்டுகள்" }, href: "/about#brands" },
      { label: { en: "Reviews", ta: "மதிப்புரைகள்" }, href: "/reviews" },
      { label: { en: "Installation Promise", ta: "நிறுவல் உறுதிமொழி" }, href: "/installation-promise" },
      { label: { en: "Buying Guides", ta: "வாங்கும் வழிகாட்டிகள்" }, href: "/guides" },
    ],
  },
  {
    title: { en: "Support", ta: "உதவி" },
    links: [
      { label: { en: "Contact Us", ta: "தொடர்பு கொள்ள" }, href: "/contact" },
      { label: { en: "Track Order", ta: "ஆர்டரைக் கண்காணி" }, href: "/support/track-order" },
      { label: { en: "Product Registration", ta: "பொருள் பதிவு" }, href: "/passport" },
      { label: { en: "Returns (7 days)", ta: "திருப்பி அனுப்புதல் (7 நாட்கள்)" }, href: "/legal/returns" },
      { label: { en: "FAQs", ta: "கேள்விகள்" }, href: "/faq" },
    ],
  },
  {
    title: { en: "Legal", ta: "சட்டம்" },
    links: [
      { label: { en: "Privacy Policy", ta: "தனியுரிமைக் கொள்கை" }, href: "/legal/privacy" },
      { label: { en: "Terms of Use", ta: "பயன்பாட்டு விதிமுறைகள்" }, href: "/legal/terms" },
      { label: { en: "Shipping Policy", ta: "டெலிவரி கொள்கை" }, href: "/legal/shipping" },
    ],
  },
];

/** Footer social links. PLACEHOLDER URLs: replace with the real profile links. */
export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "Facebook", href: "https://www.facebook.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
] as const;
