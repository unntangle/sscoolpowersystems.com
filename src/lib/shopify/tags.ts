/** Next.js cache tags for Shopify data. Revalidated by src/app/api/revalidate/route.ts. */
export const TAGS = {
  shop: "shopify:shop",
  menus: "shopify:menus",
  collections: "shopify:collections",
  products: "shopify:products",
  product: (handle: string) => `shopify:product:${handle}`,
  collection: (handle: string) => `shopify:collection:${handle}`,
} as const;

/** Shopify webhook topic -> tags to revalidate. */
export const WEBHOOK_TOPIC_TAGS: Record<string, readonly string[]> = {
  "products/create": [TAGS.products, TAGS.collections],
  "products/update": [TAGS.products, TAGS.collections],
  "products/delete": [TAGS.products, TAGS.collections],
  "collections/create": [TAGS.collections],
  "collections/update": [TAGS.collections],
  "collections/delete": [TAGS.collections],
  "inventory_levels/update": [TAGS.products],
  "shop/update": [TAGS.shop],
};
