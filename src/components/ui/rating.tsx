import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const iconSizes = { sm: "size-3.5", md: "size-4", lg: "size-5" } as const;

export interface RatingProps {
  value: number;
  count?: number;
  max?: number;
  size?: keyof typeof iconSizes;
  /** Build the screen-reader label (override for Tamil). */
  label?: (value: string, max: number, count?: number) => string;
  className?: string;
}

const defaultLabel = (value: string, max: number, count?: number) =>
  `Rated ${value} out of ${max}${count != null ? ` from ${count} reviews` : ""}`;

/** Star rating with fractional fill (gold stars, independent of the brand accent). */
export function Rating({ value, count, max = 5, size = "sm", label = defaultLabel, className }: RatingProps) {
  const clamped = Math.max(0, Math.min(max, value));
  const display = clamped.toFixed(1);
  const stars = Array.from({ length: max }, (_, i) => (
    <Star key={i} className={cn(iconSizes[size], "shrink-0 fill-current")} aria-hidden />
  ));

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span role="img" aria-label={label(display, max, count)} className="relative inline-flex">
        <span className="flex text-neutral-300">{stars}</span>
        <span
          className="absolute inset-y-0 left-0 flex overflow-hidden text-amber-500"
          style={{ width: `${(clamped / max) * 100}%` }}
        >
          {stars}
        </span>
      </span>
      <span aria-hidden className="text-sm font-medium text-neutral-900 tabular-nums">
        {display}
      </span>
      {count != null ? (
        <span aria-hidden className="text-sm text-neutral-500 tabular-nums">
          ({count})
        </span>
      ) : null}
    </span>
  );
}
