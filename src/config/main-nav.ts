import type { Localized } from "@/i18n";

/** Top-level navigation: Home · About · Products ▾ · Brands ▾ · Contact + Shop Now. */
export const mainNav = {
  home: { label: { en: "Home", ta: "முகப்பு" } as Localized, href: "/" },
  about: { label: { en: "About", ta: "எங்களைப் பற்றி" } as Localized, href: "/about" },
  products: {
    label: { en: "Products", ta: "பொருட்கள்" } as Localized,
    viewAll: { en: "View all air conditioners", ta: "அனைத்து AC-களையும் காண்க" } as Localized,
    viewAllHref: "/collections/air-conditioners",
  },
  brands: {
    label: { en: "Brands", ta: "பிராண்டுகள்" } as Localized,
    intro: {
      en: "Authorised dealer: genuine products with full brand warranty.",
      ta: "அங்கீகரிக்கப்பட்ட டீலர்: முழு பிராண்ட் வாரண்டியுடன் அசல் பொருட்கள்.",
    } as Localized,
  },
  contact: { label: { en: "Contact", ta: "தொடர்பு" } as Localized, href: "/contact" },
  shopNow: { label: { en: "Shop Now", ta: "இப்போது வாங்குங்கள்" } as Localized, href: "/collections/air-conditioners" },
};

/** Brand pages arrive with the catalogue phase; until then a brand link opens search filtered to it. */
export const brandHref = (name: string) => `/search?q=${encodeURIComponent(name)}`;
