import "server-only";
import { serverEnv } from "@/env";
import { loc, type Locale } from "@/i18n";
import * as shopify from "@/lib/shopify";
import type { ProductCard } from "@/lib/shopify/mappers";
import { demoCollections, demoProducts, type DemoProduct } from "./demo-data";

/**
 * Catalog facade used by pages and components.
 * - "shopify": real Storefront data (when Shopify env vars are set)
 * - "demo":    the sample catalog in demo-data.ts (before the store exists, or CATALOG_SOURCE=demo)
 * Swapping sources needs no component changes.
 */

export type CatalogSource = "shopify" | "demo";

export function catalogSource(): CatalogSource {
  if (process.env.CATALOG_SOURCE === "demo") return "demo";
  const hasToken = Boolean(serverEnv.SHOPIFY_STOREFRONT_PRIVATE_TOKEN || serverEnv.SHOPIFY_STOREFRONT_PUBLIC_TOKEN);
  return serverEnv.SHOPIFY_STORE_DOMAIN && hasToken ? "shopify" : "demo";
}

export const isDemo = () => catalogSource() === "demo";

/** Shopify collection handles that power homepage rows. Create these collections in Shopify. */
const SHOPIFY_COLLECTIONS = {
  popular: "popular",
  paired: "frequently-paired",
} as const;

export interface CollectionSummary {
  handle: string;
  title: string;
  count: number | null;
}

export interface CollectionListing {
  handle: string;
  title: string;
  description: string;
  products: ProductCard[];
}

function toCard(p: DemoProduct): ProductCard {
  const { collections: _collections, ...card } = p;
  return card;
}

function demoProductsIn(handle: string): DemoProduct[] {
  const collection = demoCollections.find((c) => c.handle === handle);
  if (!collection) return [];
  const handles = new Set([handle, ...(collection.children ?? [])]);
  return demoProducts.filter((p) => p.collections.some((h) => handles.has(h)));
}

async function safe<T>(fallback: T, run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.error("[catalog] Shopify request failed", error);
    return fallback;
  }
}

// ---------- Collections ----------

export async function getCollection(handle: string, locale: Locale): Promise<CollectionListing | null> {
  if (isDemo()) {
    const collection = demoCollections.find((c) => c.handle === handle);
    if (!collection) return null;
    return {
      handle,
      title: loc(collection.title, locale),
      description: loc(collection.description, locale),
      products: demoProductsIn(handle).map(toCard),
    };
  }
  const result = await shopify.getCollectionProducts({ handle, locale, first: 48 });
  if (!result) return null;
  return { handle, title: result.title, description: result.description, products: result.products };
}

// ---------- Product lists for homepage, cart and search ----------

export async function getPopularProducts(locale: Locale, limit = 8): Promise<ProductCard[]> {
  if (isDemo()) return demoProducts.filter((p) => p.tags.includes("popular")).slice(0, limit).map(toCard);
  return safe([], async () => (await getCollection(SHOPIFY_COLLECTIONS.popular, locale))?.products.slice(0, limit) ?? []);
}

/** Public-priced add-ons shown in the cart drawer's "frequently paired" row. */
export async function getPairedProducts(locale: Locale, limit = 8): Promise<ProductCard[]> {
  if (isDemo()) {
    return demoProducts
      .filter((p) => p.tags.includes("paired") && p.pricingMode === "public")
      .slice(0, limit)
      .map(toCard);
  }
  return safe([], async () =>
    ((await getCollection(SHOPIFY_COLLECTIONS.paired, locale))?.products ?? [])
      .filter((p) => p.pricingMode === "public")
      .slice(0, limit),
  );
}

export async function getProductsByHandles(handles: string[], locale: Locale): Promise<ProductCard[]> {
  if (isDemo()) {
    return handles
      .map((h) => demoProducts.find((p) => p.handle === h))
      .filter((p): p is DemoProduct => p !== undefined)
      .map(toCard);
  }
  const products = await Promise.all(handles.map((h) => safe(null, () => shopify.getProduct(h, locale))));
  return products.filter((p): p is NonNullable<typeof p> => p !== null);
}

// ---------- Search ----------

export interface SearchResults {
  products: ProductCard[];
  collections: CollectionSummary[];
}

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9஀-௿.\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

export async function searchCatalog(query: string, locale: Locale, limit = 6): Promise<SearchResults> {
  const q = query.trim();
  if (q.length < 2) return { products: [], collections: [] };

  if (isDemo()) {
    const terms = tokens(q);
    const scored = demoProducts
      .map((p) => {
        const haystack = `${p.title} ${p.productType} ${p.vendor} ${p.capacity ?? ""} ${p.keyFeatures.join(" ")}`.toLowerCase();
        const score = terms.reduce((s, t) => s + (haystack.includes(t) ? 1 : 0), 0);
        return { p, score };
      })
      .filter((x) => x.score === terms.length || (terms.length > 2 && x.score >= terms.length - 1))
      .sort((a, b) => b.score - a.score);

    const products = scored.map((x) => x.p);
    const collections = demoCollections
      .map((c) => {
        const title = loc(c.title, locale);
        const matchesTitle = terms.some((t) => `${c.title.en} ${c.title.ta}`.toLowerCase().includes(t));
        const count = demoProductsIn(c.handle).length;
        const hits = products.filter((p) => demoProductsIn(c.handle).includes(p)).length;
        return { handle: c.handle, title, count, relevance: (matchesTitle ? 10 : 0) + hits };
      })
      .filter((c) => c.relevance > 0 && c.count > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 4)
      .map(({ handle, title, count }) => ({ handle, title, count }));

    return { products: products.slice(0, limit).map(toCard), collections };
  }

  return safe({ products: [], collections: [] }, async () => {
    const result = await shopify.predictiveSearch(q, locale, limit);
    return {
      products: result.products,
      collections: result.collections.map((c) => ({ handle: c.handle, title: c.title, count: null })),
    };
  });
}

/** Full results page (more items than the overlay). */
export async function searchAll(query: string, locale: Locale): Promise<ProductCard[]> {
  return (await searchCatalog(query, locale, 48)).products;
}

// ---------- Demo cart support ----------

export function findDemoVariant(variantId: string): ProductCard | null {
  const p = demoProducts.find((x) => x.defaultVariantId === variantId);
  return p ? toCard(p) : null;
}
