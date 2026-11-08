import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Line-art placeholders for products and banners until real photography arrives.
 * Original drawings; give a product a Shopify image (or a file in /public) to replace them.
 */

export type ArtKind =
  | "ac"
  | "windowac"
  | "fridge"
  | "washer"
  | "topload"
  | "microwave"
  | "oven"
  | "chimney"
  | "dishwasher"
  | "hob"
  | "stabiliser"
  | "ironer"
  | "tv"
  | "inverter"
  | "box";

// Order matters: AC titles often contain "inverter", so AC rules come first.
const rules: [RegExp, ArtKind][] = [
  [/window (air conditioner|ac)\b|window ac|cw-l/i, "windowac"],
  [/air conditioner|\bac\b|split|cs\/cu/i, "ac"],
  [/refrigerator|fridge/i, "fridge"],
  [/televi|\btv\b|\bled\b|\boled\b/i, "tv"],
  [/\binverters?\b|batter|\bups\b|power backup/i, "inverter"],
  [/top load/i, "topload"],
  [/washer|washing|dryer|laundry/i, "washer"],
  [/microwave/i, "microwave"],
  [/oven|built-in/i, "oven"],
  [/chimney/i, "chimney"],
  [/dishwasher|dishwashing/i, "dishwasher"],
  [/\bhob\b|burner/i, "hob"],
  [/stabili[sz]er/i, "stabiliser"],
  [/ironer|finish/i, "ironer"],
];

export function artKindFor(...texts: (string | null | undefined)[]): ArtKind {
  const text = texts.filter(Boolean).join(" ");
  for (const [pattern, kind] of rules) if (pattern.test(text)) return kind;
  return "box";
}

const S = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const F = { fill: "white", stroke: "currentColor", strokeWidth: 3, strokeLinejoin: "round" } as const;

const drawings: Record<ArtKind, React.ReactNode> = {
  ac: (
    <>
      <rect x="18" y="62" width="164" height="54" rx="14" {...F} />
      <path d="M30 100h140M46 108h108" {...S} />
      <circle cx="160" cy="78" r="3" fill="currentColor" />
      <path d="M60 132c4 8 4 14 0 22M100 132c4 8 4 14 0 22M140 132c4 8 4 14 0 22" {...S} opacity="0.5" />
    </>
  ),
  windowac: (
    <>
      <rect x="34" y="44" width="132" height="112" rx="10" {...F} />
      <path d="M48 62h70M48 74h70M48 86h70M48 98h70M48 110h70M48 122h70M48 134h70" {...S} opacity="0.6" />
      <rect x="128" y="60" width="26" height="40" rx="4" {...S} />
      <circle cx="141" cy="122" r="7" {...S} />
    </>
  ),
  fridge: (
    <>
      <rect x="58" y="16" width="84" height="170" rx="12" {...F} />
      <path d="M58 76h84M124 36v24M124 94v40" {...S} />
    </>
  ),
  washer: (
    <>
      <rect x="44" y="24" width="112" height="152" rx="14" {...F} />
      <path d="M44 56h112" {...S} />
      <circle cx="100" cy="114" r="38" {...F} />
      <circle cx="100" cy="114" r="26" {...S} opacity="0.5" />
      <circle cx="136" cy="40" r="6" {...S} />
      <path d="M60 40h28" {...S} />
    </>
  ),
  topload: (
    <>
      <rect x="44" y="40" width="112" height="140" rx="14" {...F} />
      <path d="M52 40l8-18h80l8 18M60 62h80" {...S} />
      <circle cx="100" cy="122" r="6" fill="currentColor" opacity="0.4" />
    </>
  ),
  microwave: (
    <>
      <rect x="22" y="56" width="156" height="92" rx="12" {...F} />
      <rect x="36" y="70" width="98" height="64" rx="8" {...S} />
      <path d="M150 74h14M150 88h14M150 102h14" {...S} />
      <circle cx="157" cy="124" r="7" {...S} />
    </>
  ),
  oven: (
    <>
      <rect x="40" y="28" width="120" height="146" rx="10" {...F} />
      <path d="M40 58h120M70 44h60" {...S} />
      <rect x="56" y="74" width="88" height="80" rx="8" {...S} />
    </>
  ),
  chimney: (
    <>
      <rect x="82" y="14" width="36" height="60" rx="4" {...F} />
      <path d="M44 74h112l26 44H18z" {...F} />
      <path d="M40 104h120" {...S} opacity="0.5" />
    </>
  ),
  dishwasher: (
    <>
      <rect x="46" y="26" width="108" height="150" rx="10" {...F} />
      <path d="M46 56h108M78 42h44" {...S} />
      <path d="M64 120h72" {...S} opacity="0.5" />
    </>
  ),
  hob: (
    <>
      <path d="M30 82h140l14 40H16z" {...F} />
      <ellipse cx="66" cy="94" rx="16" ry="5" {...S} />
      <ellipse cx="134" cy="94" rx="16" ry="5" {...S} />
      <ellipse cx="58" cy="112" rx="18" ry="5" {...S} />
      <ellipse cx="142" cy="112" rx="18" ry="5" {...S} />
    </>
  ),
  stabiliser: (
    <>
      <rect x="50" y="56" width="100" height="92" rx="12" {...F} />
      <rect x="64" y="72" width="44" height="22" rx="4" {...S} />
      <circle cx="128" cy="83" r="8" {...S} />
      <path d="M64 120h72M64 132h48" {...S} opacity="0.5" />
    </>
  ),
  ironer: (
    <>
      <rect x="18" y="86" width="164" height="58" rx="10" {...F} />
      <circle cx="100" cy="86" r="26" {...F} />
      <path d="M30 160v14M170 160v14M30 144v16M170 144v16" {...S} />
    </>
  ),
  tv: (
    <>
      <rect x="16" y="38" width="168" height="104" rx="8" {...F} />
      <rect x="26" y="48" width="148" height="84" rx="3" {...S} opacity="0.5" />
      <path d="M70 168l14-26M130 168l-14-26M60 168h80" {...S} />
    </>
  ),
  inverter: (
    <>
      <rect x="22" y="66" width="76" height="96" rx="10" {...F} />
      <rect x="34" y="80" width="40" height="18" rx="3" {...S} />
      <circle cx="84" cy="89" r="5" {...S} />
      <rect x="108" y="82" width="70" height="80" rx="6" {...F} />
      <path d="M124 82v-10h12v10M150 82v-10h12v10M140 108l-8 14h12l-8 14" {...S} />
    </>
  ),
  box: (
    <>
      <path d="M40 72l60-26 60 26v70l-60 26-60-26z" {...F} />
      <path d="M40 72l60 26 60-26M100 98v70" {...S} />
    </>
  ),
};

export function ProductArt({
  kind,
  className,
  label,
}: {
  kind: ArtKind;
  className?: string;
  /** Accessible label; omit when the art is decorative. */
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("h-full w-full", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {drawings[kind]}
    </svg>
  );
}
