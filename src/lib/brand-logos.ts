import "server-only";
import { photo } from "@/lib/media";

const EXTENSIONS = ["svg", "png", "webp", "jpg", "jpeg"] as const;

/**
 * Official brand logo for a brand handle, if a file exists in /public/images/brands/
 * (e.g. panasonic.svg, daikin.webp). Returns null so callers can fall back to the brand name.
 * Prefer SVG or transparent PNG/WebP: JPG logos carry a solid background box.
 */
export function brandLogo(handle: string): string | null {
  for (const ext of EXTENSIONS) {
    const src = photo(`/images/brands/${handle}.${ext}`);
    if (src) return src;
  }
  return null;
}
