/**
 * Business details and promises shown across the site.
 * Values marked PLACEHOLDER still need the client's confirmation before launch.
 */
export const site = {
  name: "SS Cool Power Systems",
  shortName: "SS Cool Power",
  tagline:
    "Air conditioners, refrigerators, washing machines, televisions and inverters from authorised brands, delivered and installed across Chennai.",
  yearEstablished: 2006, // PLACEHOLDER: confirm
  gstin: "33AAAAA0000A1Z5", // PLACEHOLDER: confirm real GSTIN
  phones: {
    sales: "+91 96011 11070", // Hotline
    support: "+91 96011 11070", // PLACEHOLDER: separate service line if any
  },
  email: "info@sscoolpowersystems.com",
  address: {
    line1: "37, Ravi Colony Second Street",
    locality: "Nazarethpuram, Gandhi Nagar, St. Thomas Mount",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600032",
    country: "IN",
  },
  promises: {
    /** "Best price on WhatsApp within N minutes" */
    whatsappResponseMinutes: 10,
    whatsappHours: { open: "09:00", close: "21:00", label: "9am–9pm" }, // PLACEHOLDER: confirm hours
    /** "Installed within N hours of delivery" */
    installationHours: 48, // PLACEHOLDER: confirm
    /** Hassle-free return window (from the current website). */
    returnDays: 7,
  },
  defaultPincode: "600032",
  locales: ["en", "ta"] as const,
  defaultLocale: "en" as const,
} as const;

export type Site = typeof site;
