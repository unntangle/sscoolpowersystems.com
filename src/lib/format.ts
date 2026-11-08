/** Currency and number helpers. Pure functions, safe on server and client. */

const formatters = new Map<string, Intl.NumberFormat>();

function inrFormatter(locale: string, fractionDigits: 0 | 2): Intl.NumberFormat {
  const key = `${locale}:${fractionDigits}`;
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
    formatters.set(key, f);
  }
  return f;
}

/** ₹32,990 for whole rupees, ₹99.50 when paise are present. Indian digit grouping (lakhs). */
export function formatINR(amount: number, locale = "en-IN"): string {
  const hasPaise = Math.round(amount * 100) % 100 !== 0;
  return inrFormatter(locale, hasPaise ? 2 : 0).format(amount);
}

/**
 * Discount vs MRP as a whole percentage, rounded DOWN so we never overstate a saving
 * (consumer-protection / dark-pattern guidelines). Returns null when there is no real discount.
 */
export function discountPercent(price: number, mrp: number): number | null {
  if (!Number.isFinite(price) || !Number.isFinite(mrp) || price <= 0 || mrp <= 0 || price >= mrp) return null;
  const pct = Math.floor(((mrp - price) / mrp) * 100);
  return pct >= 1 ? pct : null;
}

/** Parse a Shopify Decimal string ("32990.0") into a number, or null. */
export function toNumber(value: string | null | undefined): number | null {
  if (value == null || value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
