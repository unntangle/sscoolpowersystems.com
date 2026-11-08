import { en, type Dictionary } from "./en";
import { ta } from "./ta";
import type { Locale } from "@/lib/shopify/context";

export type { Dictionary, Locale };
export { locales, isLocale } from "@/lib/shopify/context";

export const LOCALE_COOKIE = "ss_locale";
export const DEFAULT_LOCALE: Locale = "en";

const dictionaries: Record<Locale, Dictionary> = { en, ta };

export function getDictionaryFor(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Content stored in both languages (navigation, homepage copy). */
export type Localized = { en: string; ta: string };

export function loc(value: Localized, locale: Locale): string {
  return value[locale] || value.en;
}

/** Fill {placeholders}: fmt("Delivery in {days} days", { days: 2 }) */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
