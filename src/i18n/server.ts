import "server-only";
import { cookies } from "next/headers";
import { features } from "@/config/features";
import { DEFAULT_LOCALE, getDictionaryFor, isLocale, LOCALE_COOKIE, type Locale } from "./index";

/**
 * Current locale. While the language switch is off (src/config/features.ts) the site is English-only,
 * ignoring any locale cookie left over from earlier visits.
 */
export async function getLocale(): Promise<Locale> {
  if (!features.languageSwitch) return DEFAULT_LOCALE;
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getI18n() {
  const locale = await getLocale();
  return { locale, t: getDictionaryFor(locale) };
}
