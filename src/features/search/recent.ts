import { z } from "zod";

/** "Recently viewed" products, kept in localStorage (no personal data). */

const KEY = "ss_recently_viewed";
const MAX = 8;

export const recentItemSchema = z.object({
  handle: z.string(),
  title: z.string(),
  productType: z.string(),
  price: z.number().nullable(),
  mrp: z.number().nullable(),
});
export type RecentItem = z.infer<typeof recentItemSchema>;

export function readRecentlyViewed(): RecentItem[] {
  try {
    const parsed = z.array(recentItemSchema).safeParse(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function recordRecentlyViewed(item: RecentItem): void {
  try {
    const next = [item, ...readRecentlyViewed().filter((i) => i.handle !== item.handle)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage unavailable (private mode): ignore
  }
}
