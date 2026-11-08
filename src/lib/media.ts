import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Returns the public path if the image file exists in /public, otherwise null.
 * Lets the team drop real photography into public/images/... and have it appear with no code change;
 * until then components render a styled placeholder scene.
 */
export function photo(src: string | undefined): string | null {
  if (!src) return null;
  const file = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  return existsSync(file) ? src : null;
}
