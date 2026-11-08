import "server-only";
import { cookies } from "next/headers";
import { z } from "zod";
import { commerce } from "@/config/commerce";
import type { Locale } from "@/i18n";
import { findDemoVariant, isDemo } from "@/lib/catalog";
import * as shopify from "@/lib/shopify";
import type { Cart, CartLine } from "@/lib/shopify/mappers";

/**
 * Cart storage.
 * - Shopify: cart id in an httpOnly cookie; the cart itself lives in Shopify.
 * - Demo: line items in an httpOnly cookie (public-priced demo products only).
 */

export const CART_COOKIE = "ss_cart_id";
export const DEMO_CART_COOKIE = "ss_demo_cart";

const cookieOptions = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30,
};

const demoLinesSchema = z.array(z.tuple([z.string(), z.number().int().min(1).max(commerce.maxLineQuantity)]));
type DemoLines = z.infer<typeof demoLinesSchema>;

export async function readDemoLines(): Promise<DemoLines> {
  const raw = (await cookies()).get(DEMO_CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = demoLinesSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export async function writeDemoLines(lines: DemoLines): Promise<void> {
  (await cookies()).set(DEMO_CART_COOKIE, JSON.stringify(lines), cookieOptions);
}

export function buildDemoCart(lines: DemoLines): Cart {
  const cartLines: CartLine[] = [];
  for (const [variantId, quantity] of lines) {
    const product = findDemoVariant(variantId);
    if (!product || product.price == null) continue;
    cartLines.push({
      id: variantId,
      quantity,
      merchandiseId: variantId,
      title: product.title,
      variantTitle: "Default",
      handle: product.handle,
      vendor: product.vendor,
      image: product.image,
      unitPrice: product.price,
      unitMrp: product.mrp,
      lineTotal: product.price * quantity,
      availableForSale: product.availableForSale,
      attributes: [],
    });
  }
  const subtotal = cartLines.reduce((sum, l) => sum + (l.lineTotal ?? 0), 0);
  return {
    id: "demo-cart",
    checkoutUrl: "",
    totalQuantity: cartLines.reduce((sum, l) => sum + l.quantity, 0),
    subtotal,
    total: subtotal,
    currencyCode: "INR",
    discountCodes: [],
    attributes: [],
    lines: cartLines,
  };
}

export async function getCartId(): Promise<string | null> {
  return (await cookies()).get(CART_COOKIE)?.value ?? null;
}

export async function setCartId(id: string): Promise<void> {
  (await cookies()).set(CART_COOKIE, id, cookieOptions);
}

/** Current cart for the request (null when empty / not created yet). */
export async function readCart(locale: Locale): Promise<Cart | null> {
  if (isDemo()) {
    const lines = await readDemoLines();
    return lines.length ? buildDemoCart(lines) : null;
  }
  const id = await getCartId();
  if (!id) return null;
  try {
    return await shopify.getCart(id, locale);
  } catch (error) {
    console.error("[cart] could not load cart", error);
    return null;
  }
}
