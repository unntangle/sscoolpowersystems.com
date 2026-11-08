import { z } from "zod";
import { toNumber } from "@/lib/format";

/** Metafield parsing. Pure functions: no Shopify calls, safe to unit test. */

export const PRICING_MODES = ["public", "whatsapp_quote", "rfq"] as const;
export const pricingModeSchema = z.enum(PRICING_MODES);
export type PricingMode = z.infer<typeof pricingModeSchema>;

/**
 * Missing or invalid values fall back to `whatsapp_quote` so a misconfigured product
 * never publishes a price that a brand agreement may forbid.
 */
export const DEFAULT_PRICING_MODE: PricingMode = "whatsapp_quote";

export function parsePricingMode(value: string | null | undefined): PricingMode {
  const result = pricingModeSchema.safeParse(value?.trim().toLowerCase());
  return result.success ? result.data : DEFAULT_PRICING_MODE;
}

export function parseInteger(value: string | null | undefined): number | null {
  const n = toNumber(value);
  return n !== null && Number.isInteger(n) ? n : null;
}

export function parseDecimal(value: string | null | undefined): number | null {
  return toNumber(value);
}

export function parseBoolean(value: string | null | undefined): boolean | null {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

const stringList = z.array(z.string());

/** `list.single_line_text_field` values arrive as a JSON-encoded array string. */
export function parseStringList(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const result = stringList.safeParse(JSON.parse(value));
    return result.success ? result.data.map((s) => s.trim()).filter(Boolean) : [];
  } catch {
    return [];
  }
}

/** Energy rating 1–5 stars, or null. */
export function parseEnergyRating(value: string | null | undefined): number | null {
  const n = parseInteger(value);
  return n !== null && n >= 1 && n <= 5 ? n : null;
}

export interface PriceBand {
  min: number;
  max: number | null;
}

export function parsePriceBand(
  min: string | null | undefined,
  max: string | null | undefined,
): PriceBand | null {
  const lo = parseDecimal(min);
  if (lo === null || lo <= 0) return null;
  const hi = parseDecimal(max);
  return { min: lo, max: hi !== null && hi > lo ? hi : null };
}

/** Metaobject `fields` -> { key: value } */
export function fieldsToRecord(
  fields: ReadonlyArray<{ key: string; value?: string | null }>,
): Record<string, string | undefined> {
  const record: Record<string, string | undefined> = {};
  for (const f of fields) record[f.key] = f.value ?? undefined;
  return record;
}
