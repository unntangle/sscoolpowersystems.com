import * as React from "react";
import { discountPercent, formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
} as const;

export interface PriceLabels {
  mrp: string;
  off: string;
  taxNote: string;
}

export interface PriceProps {
  /** Selling price. Omit/null for quote-led products: only the MRP is shown. */
  amount?: number | null;
  mrp?: number | null;
  /** e.g. "Starting from" for price bands. */
  prefix?: string;
  size?: keyof typeof sizeClasses;
  locale?: string;
  showTaxNote?: boolean;
  labels?: Partial<PriceLabels>;
  className?: string;
}

/**
 * Price block: selling price, MRP strike-through and % off.
 * The % off is rounded down (see discountPercent) so a saving is never overstated.
 */
export function Price({
  amount,
  mrp,
  prefix,
  size = "md",
  locale = "en-IN",
  showTaxNote = false,
  labels,
  className,
}: PriceProps) {
  const l: PriceLabels = { mrp: "MRP", off: "off", taxNote: "Inclusive of all taxes", ...labels };
  if (amount == null && mrp == null) return null;

  const pct = amount != null && mrp != null ? discountPercent(amount, mrp) : null;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {amount != null ? (
          <>
            {prefix ? <span className="text-sm text-neutral-600">{prefix}</span> : null}
            <span
              className={cn("font-semibold text-neutral-900 tabular-nums", sizeClasses[size])}
              data-testid="price-amount"
            >
              {formatINR(amount, locale)}
            </span>
            {pct !== null && mrp != null ? (
              <span className="text-sm text-neutral-500">
                {l.mrp} <s className="tabular-nums">{formatINR(mrp, locale)}</s>
              </span>
            ) : null}
            {pct !== null ? (
              <span className="text-sm font-semibold text-success-700" data-testid="price-off">
                {pct}% {l.off}
              </span>
            ) : null}
          </>
        ) : mrp != null ? (
          <span className={cn("font-semibold text-neutral-900 tabular-nums", sizeClasses[size])}>
            <span className="mr-1.5 text-sm font-normal text-neutral-600">{l.mrp}</span>
            {formatINR(mrp, locale)}
          </span>
        ) : null}
      </div>
      {showTaxNote ? <p className="text-xs text-neutral-500">{l.taxNote}</p> : null}
    </div>
  );
}
