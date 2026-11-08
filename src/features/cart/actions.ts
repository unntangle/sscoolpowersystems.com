"use server";

import { z } from "zod";
import { commerce } from "@/config/commerce";
import { getLocale } from "@/i18n/server";
import { findDemoVariant, isDemo } from "@/lib/catalog";
import * as shopify from "@/lib/shopify";
import { isShopifyError } from "@/lib/shopify/errors";
import type { Cart } from "@/lib/shopify/mappers";
import { buildDemoCart, getCartId, readCart, readDemoLines, setCartId, writeDemoLines } from "./server";

export type CartActionResult = { ok: true; cart: Cart | null } | { ok: false; error: string; cart: Cart | null };

const idSchema = z.string().min(1).max(200);
const qtySchema = z.number().int().min(0).max(commerce.maxLineQuantity);

async function fail(error: unknown, fallbackMessage: string): Promise<CartActionResult> {
  console.error("[cart]", error);
  const message = isShopifyError(error) && error.kind === "user" ? error.message : fallbackMessage;
  return { ok: false, error: message, cart: await readCart(await getLocale()) };
}

export async function addToCartAction(variantId: string, quantity = 1): Promise<CartActionResult> {
  const id = idSchema.safeParse(variantId);
  const qty = qtySchema.safeParse(quantity);
  if (!id.success || !qty.success || qty.data < 1) return { ok: false, error: "invalid", cart: null };

  try {
    if (isDemo()) {
      if (!findDemoVariant(id.data)) return { ok: false, error: "invalid", cart: null };
      const lines = await readDemoLines();
      const existing = lines.find(([v]) => v === id.data);
      if (existing) existing[1] = Math.min(existing[1] + qty.data, commerce.maxLineQuantity);
      else lines.push([id.data, qty.data]);
      await writeDemoLines(lines);
      return { ok: true, cart: buildDemoCart(lines) };
    }

    const locale = await getLocale();
    const cartId = await getCartId();
    const line = { merchandiseId: id.data, quantity: qty.data };
    if (cartId) {
      try {
        return { ok: true, cart: await shopify.addCartLines(cartId, [line], locale) };
      } catch (error) {
        // Expired or completed cart: start a new one below.
        if (!(isShopifyError(error) && error.kind !== "user")) throw error;
      }
    }
    const cart = await shopify.createCart({ lines: [line] }, locale);
    await setCartId(cart.id);
    return { ok: true, cart };
  } catch (error) {
    return fail(error, "error");
  }
}

export async function updateCartLineAction(lineId: string, quantity: number): Promise<CartActionResult> {
  const id = idSchema.safeParse(lineId);
  const qty = qtySchema.safeParse(quantity);
  if (!id.success || !qty.success) return { ok: false, error: "invalid", cart: null };

  try {
    if (isDemo()) {
      const lines = (await readDemoLines())
        .map(([v, q]): [string, number] => [v, v === id.data ? qty.data : q])
        .filter(([, q]) => q > 0);
      await writeDemoLines(lines);
      return { ok: true, cart: lines.length ? buildDemoCart(lines) : null };
    }
    const cartId = await getCartId();
    if (!cartId) return { ok: false, error: "error", cart: null };
    const locale = await getLocale();
    const cart =
      qty.data === 0
        ? await shopify.removeCartLines(cartId, [id.data], locale)
        : await shopify.updateCartLines(cartId, [{ id: id.data, quantity: qty.data }], locale);
    return { ok: true, cart };
  } catch (error) {
    return fail(error, "error");
  }
}

export async function removeCartLineAction(lineId: string): Promise<CartActionResult> {
  return updateCartLineAction(lineId, 0);
}

export async function applyDiscountAction(code: string): Promise<CartActionResult> {
  const parsed = z.string().trim().min(1).max(50).safeParse(code);
  if (!parsed.success) return { ok: false, error: "invalid", cart: null };
  if (isDemo()) return { ok: false, error: "demo", cart: await readCart(await getLocale()) };

  try {
    const cartId = await getCartId();
    if (!cartId) return { ok: false, error: "error", cart: null };
    const cart = await shopify.updateCartDiscountCodes(cartId, [parsed.data.toUpperCase()], await getLocale());
    return { ok: true, cart };
  } catch (error) {
    return fail(error, "error");
  }
}
