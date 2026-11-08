import "server-only";
import { serverEnv } from "@/env";
import type {
  CartInput,
  CartLineInput,
  CartLineUpdateInput,
  ProductCollectionSortKeys,
  ProductFilter,
  ProductRecommendationIntent,
} from "./__generated__/graphql";
import { createShopifyClient, type ShopifyClient } from "./client";
import { inContext, type Locale } from "./context";
import { assertNoUserErrors, ShopifyError } from "./errors";
import { toCart, toImage, toProductCard, toProductDetail, type Cart } from "./mappers";
import { parseBoolean } from "./metafields";
import {
  CartCreateMutation,
  CartDiscountCodesUpdateMutation,
  CartLinesAddMutation,
  CartLinesRemoveMutation,
  CartLinesUpdateMutation,
} from "./mutations";
import {
  CartQuery,
  CollectionProductsQuery,
  CollectionsQuery,
  MenuQuery,
  PredictiveSearchQuery,
  ProductByHandleQuery,
  ProductRecommendationsQuery,
  ShopQuery,
} from "./queries";
import { TAGS } from "./tags";

export * from "./mappers";
export { ShopifyError, isShopifyError } from "./errors";
export { PRICING_MODES, type PricingMode } from "./metafields";
export { locales, isLocale, type Locale } from "./context";

/** The only entry point components use for Shopify Storefront data. Server-only. */

let client: ShopifyClient | undefined;

function shopify(): ShopifyClient {
  client ??= createShopifyClient({
    storeDomain: serverEnv.SHOPIFY_STORE_DOMAIN,
    apiVersion: serverEnv.SHOPIFY_STOREFRONT_API_VERSION,
    privateToken: serverEnv.SHOPIFY_STOREFRONT_PRIVATE_TOKEN,
    publicToken: serverEnv.SHOPIFY_STOREFRONT_PUBLIC_TOKEN,
  });
  return client;
}

// ---------- Shop & navigation ----------

export async function getShop(locale: Locale = "en") {
  const { shop, localization } = await shopify().request(ShopQuery, {
    variables: inContext(locale),
    tags: [TAGS.shop],
  });
  return {
    name: shop.name,
    description: shop.description ?? null,
    url: shop.primaryDomain.url,
    logo: toImage(shop.brand?.logo?.image),
    /** Global switch for "Starting from" price bands (shop metafield ss.show_price_bands). Default on. */
    showPriceBands: parseBoolean(shop.showPriceBands?.value) ?? true,
    languages: localization.availableLanguages.map((l) => ({ isoCode: l.isoCode, name: l.endonymName })),
  };
}

export async function getMenu(handle: string, locale: Locale = "en") {
  const { menu } = await shopify().request(MenuQuery, {
    variables: { handle, ...inContext(locale) },
    tags: [TAGS.menus],
  });
  return menu ?? null;
}

// ---------- Catalog ----------

export async function getCollections(locale: Locale = "en", first = 100, after?: string) {
  const { collections } = await shopify().request(CollectionsQuery, {
    variables: { first, after, ...inContext(locale) },
    tags: [TAGS.collections],
  });
  return {
    collections: collections.nodes.map((c) => ({
      id: c.id,
      handle: c.handle,
      title: c.title,
      description: c.description,
      image: toImage(c.image),
      seo: { title: c.seo.title ?? null, description: c.seo.description ?? null },
      updatedAt: c.updatedAt,
    })),
    pageInfo: collections.pageInfo,
  };
}

export interface CollectionProductsArgs {
  handle: string;
  locale?: Locale;
  first?: number;
  after?: string;
  sortKey?: ProductCollectionSortKeys;
  reverse?: boolean;
  filters?: ProductFilter[];
}

export async function getCollectionProducts({
  handle,
  locale = "en",
  first = 24,
  after,
  sortKey,
  reverse,
  filters,
}: CollectionProductsArgs) {
  const { collection } = await shopify().request(CollectionProductsQuery, {
    variables: { handle, first, after, sortKey, reverse, filters, ...inContext(locale) },
    tags: [TAGS.collections, TAGS.products, TAGS.collection(handle)],
  });
  if (!collection) return null;
  return {
    id: collection.id,
    handle: collection.handle,
    title: collection.title,
    description: collection.description,
    descriptionHtml: collection.descriptionHtml,
    image: toImage(collection.image),
    seo: { title: collection.seo.title ?? null, description: collection.seo.description ?? null },
    filters: collection.products.filters,
    products: collection.products.nodes.map(toProductCard),
    pageInfo: collection.products.pageInfo,
  };
}

export async function getProduct(handle: string, locale: Locale = "en") {
  const { product } = await shopify().request(ProductByHandleQuery, {
    variables: { handle, ...inContext(locale) },
    tags: [TAGS.products, TAGS.product(handle)],
  });
  return product ? toProductDetail(product) : null;
}

export async function getProductRecommendations(
  productId: string,
  intent: ProductRecommendationIntent = "RELATED",
  locale: Locale = "en",
) {
  const { productRecommendations } = await shopify().request(ProductRecommendationsQuery, {
    variables: { productId, intent, ...inContext(locale) },
    tags: [TAGS.products],
  });
  return (productRecommendations ?? []).map(toProductCard);
}

export async function predictiveSearch(query: string, locale: Locale = "en", limit = 6) {
  const trimmed = query.trim();
  if (trimmed.length < 2) return { products: [], collections: [], queries: [] };
  const { predictiveSearch: result } = await shopify().request(PredictiveSearchQuery, {
    variables: { query: trimmed, limit, ...inContext(locale) },
    tags: [TAGS.products, TAGS.collections],
    revalidate: 300,
  });
  return {
    products: (result?.products ?? []).map(toProductCard),
    collections: (result?.collections ?? []).map((c) => ({
      id: c.id,
      handle: c.handle,
      title: c.title,
      image: toImage(c.image),
    })),
    queries: (result?.queries ?? []).map((q) => ({ text: q.text, styledText: q.styledText })),
  };
}

// ---------- Cart (never cached, never auto-retried) ----------

const cartOptions = { cache: "no-store" as const, retries: 0 };

export async function getCart(cartId: string, locale: Locale = "en"): Promise<Cart | null> {
  const { cart } = await shopify().request(CartQuery, {
    variables: { cartId, ...inContext(locale) },
    cache: "no-store",
  });
  return cart ? toCart(cart) : null;
}

function requireCart<T extends { cart?: Parameters<typeof toCart>[0] | null }>(payload: T): Cart {
  if (!payload.cart) throw new ShopifyError("graphql", "Shopify returned no cart");
  return toCart(payload.cart);
}

export async function createCart(input: CartInput = {}, locale: Locale = "en"): Promise<Cart> {
  const { cartCreate } = await shopify().request(CartCreateMutation, {
    variables: { input, ...inContext(locale) },
    ...cartOptions,
  });
  if (!cartCreate) throw new ShopifyError("graphql", "cartCreate returned nothing");
  assertNoUserErrors(cartCreate.userErrors);
  return requireCart(cartCreate);
}

export async function addCartLines(cartId: string, lines: CartLineInput[], locale: Locale = "en") {
  const { cartLinesAdd } = await shopify().request(CartLinesAddMutation, {
    variables: { cartId, lines, ...inContext(locale) },
    ...cartOptions,
  });
  if (!cartLinesAdd) throw new ShopifyError("graphql", "cartLinesAdd returned nothing");
  assertNoUserErrors(cartLinesAdd.userErrors);
  return requireCart(cartLinesAdd);
}

export async function updateCartLines(cartId: string, lines: CartLineUpdateInput[], locale: Locale = "en") {
  const { cartLinesUpdate } = await shopify().request(CartLinesUpdateMutation, {
    variables: { cartId, lines, ...inContext(locale) },
    ...cartOptions,
  });
  if (!cartLinesUpdate) throw new ShopifyError("graphql", "cartLinesUpdate returned nothing");
  assertNoUserErrors(cartLinesUpdate.userErrors);
  return requireCart(cartLinesUpdate);
}

export async function removeCartLines(cartId: string, lineIds: string[], locale: Locale = "en") {
  const { cartLinesRemove } = await shopify().request(CartLinesRemoveMutation, {
    variables: { cartId, lineIds, ...inContext(locale) },
    ...cartOptions,
  });
  if (!cartLinesRemove) throw new ShopifyError("graphql", "cartLinesRemove returned nothing");
  assertNoUserErrors(cartLinesRemove.userErrors);
  return requireCart(cartLinesRemove);
}

export async function updateCartDiscountCodes(cartId: string, discountCodes: string[], locale: Locale = "en") {
  const { cartDiscountCodesUpdate } = await shopify().request(CartDiscountCodesUpdateMutation, {
    variables: { cartId, discountCodes, ...inContext(locale) },
    ...cartOptions,
  });
  if (!cartDiscountCodesUpdate) throw new ShopifyError("graphql", "cartDiscountCodesUpdate returned nothing");
  assertNoUserErrors(cartDiscountCodesUpdate.userErrors);
  return requireCart(cartDiscountCodesUpdate);
}
