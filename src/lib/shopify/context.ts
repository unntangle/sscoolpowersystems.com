import type { CountryCode, LanguageCode } from "./__generated__/graphql";

export const locales = ["en", "ta"] as const;
export type Locale = (typeof locales)[number];

const languageByLocale: Record<Locale, LanguageCode> = {
  en: "EN",
  ta: "TA",
};

const COUNTRY: CountryCode = "IN";

/** Variables for the @inContext directive on every Storefront operation. */
export function inContext(locale: Locale = "en"): { language: LanguageCode; country: CountryCode } {
  return { language: languageByLocale[locale], country: COUNTRY };
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
