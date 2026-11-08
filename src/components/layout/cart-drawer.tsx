"use client";

import * as React from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { ProductImage } from "@/components/commerce/product-image";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Price } from "@/components/ui/price";
import { toast } from "@/components/ui/toast";
import { commerce } from "@/config/commerce";
import { useCart } from "@/features/cart/cart-context";
import { fmt, type Dictionary } from "@/i18n";
import { formatINR } from "@/lib/format";
import type { ProductCard } from "@/lib/shopify/mappers";

interface CartDrawerProps {
  t: Pick<Dictionary, "cart" | "product" | "common">;
  paired: ProductCard[];
}

export function CartDrawer({ t, paired }: CartDrawerProps) {
  const { cart, open, setOpen, pending, setQuantity, remove, add, applyCoupon } = useCart();
  const [coupon, setCoupon] = React.useState("");
  const lines = cart?.lines ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const shortfall = Math.max(0, commerce.minOrderValue - subtotal);
  const inCart = new Set(lines.map((l) => l.merchandiseId));
  const suggestions = paired.filter((p) => p.defaultVariantId && !inCart.has(p.defaultVariantId));
  const priceLabels = { mrp: t.product.mrp, off: t.product.off };

  const checkout = () => {
    if (!cart?.checkoutUrl) {
      toast.info(t.cart.demoCheckout);
      return;
    }
    window.location.href = cart.checkoutUrl;
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent
        title={`${t.cart.title}${lines.length ? ` (${cart?.totalQuantity ?? 0})` : ""}`}
        footer={
          lines.length ? (
            <div className="grid gap-3" aria-busy={pending}>
              <form
                className="flex gap-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (coupon.trim() && (await applyCoupon(coupon))) setCoupon("");
                }}
              >
                <label htmlFor="cart-coupon" className="sr-only">
                  {t.cart.coupon}
                </label>
                <Input
                  id="cart-coupon"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder={t.cart.coupon}
                  className="h-10 uppercase"
                />
                <Button type="submit" variant="secondary" size="sm" className="h-10">
                  {t.cart.apply}
                </Button>
              </form>
              {cart?.discountCodes.length ? (
                <p className="text-xs text-success-700">{cart.discountCodes.map((d) => d.code).join(", ")}</p>
              ) : null}
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-neutral-600">{t.cart.subtotal}</span>
                <span className="text-lg font-semibold tabular-nums">{formatINR(subtotal)}</span>
              </div>
              <p className="text-xs text-neutral-500">{t.cart.taxNote}</p>
              {shortfall > 0 ? (
                <p role="status" className="rounded-md bg-warning-50 px-3 py-2 text-xs font-medium text-warning-700">
                  {fmt(t.cart.minOrder, {
                    amount: formatINR(shortfall),
                    min: formatINR(commerce.minOrderValue),
                  })}
                </p>
              ) : null}
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="secondary">
                  <Link href="/cart" onClick={() => setOpen(false)}>
                    {t.cart.viewCart}
                  </Link>
                </Button>
                <Button onClick={checkout} disabled={shortfall > 0 || pending}>
                  {t.cart.checkout}
                </Button>
              </div>
            </div>
          ) : undefined
        }
      >
        {lines.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <span className="inline-flex size-16 items-center justify-center rounded-full bg-cream">
              <ShoppingBag className="size-8 text-neutral-600" aria-hidden />
            </span>
            <p className="mt-4 text-lg font-medium">{t.cart.empty}</p>
            <p className="mt-2 max-w-xs text-sm text-neutral-600">{t.cart.emptyHint}</p>
            <Button className="mt-6" onClick={() => setOpen(false)} asChild>
              <Link href="/collections/air-conditioners">{t.cart.startShopping}</Link>
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {lines.map((line) => (
              <li key={line.id} className="flex gap-3 py-4">
                <ProductImage image={line.image} title={line.title} sizes="80px" className="size-20 shrink-0" />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${line.handle}`}
                    onClick={() => setOpen(false)}
                    className="line-clamp-2 text-sm font-medium text-neutral-900 hover:underline"
                  >
                    {line.title}
                  </Link>
                  <Price
                    amount={line.unitPrice}
                    mrp={line.unitMrp}
                    size="sm"
                    labels={priceLabels}
                    className="mt-1 [&_*]:text-xs"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-neutral-300">
                      <button
                        type="button"
                        onClick={() => setQuantity(line.id, line.quantity - 1)}
                        className="inline-flex size-9 items-center justify-center rounded-full hover:bg-neutral-100"
                      >
                        <Minus className="size-4" aria-hidden />
                        <span className="sr-only">{t.cart.decrease}</span>
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums" aria-label={t.cart.quantity}>
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={line.quantity >= commerce.maxLineQuantity}
                        onClick={() => setQuantity(line.id, line.quantity + 1)}
                        className="inline-flex size-9 items-center justify-center rounded-full hover:bg-neutral-100 disabled:opacity-40"
                      >
                        <Plus className="size-4" aria-hidden />
                        <span className="sr-only">{t.cart.increase}</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.id)}
                      className="inline-flex min-h-9 items-center gap-1 rounded-sm text-xs text-neutral-500 hover:text-danger-700"
                    >
                      <Trash2 className="size-4" aria-hidden />
                      {t.cart.remove}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {suggestions.length > 0 ? (
          <section className="mt-6 border-t border-neutral-200 pt-6">
            <h3 className="mb-3 text-base font-medium">{t.cart.paired}</h3>
            <Carousel label={t.cart.paired} slideClassName="basis-[70%]">
              {suggestions.map((p) => (
                <div key={p.id} className="flex h-full flex-col rounded-lg border border-neutral-200 p-3">
                  <ProductImage image={p.image} title={p.title} productType={p.productType} sizes="160px" />
                  <p className="mt-2 line-clamp-2 text-sm font-medium">{p.title}</p>
                  <Price amount={p.price} mrp={p.mrp} size="sm" labels={priceLabels} className="mt-1 [&_*]:text-xs" />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-3"
                    disabled={pending}
                    onClick={() => p.defaultVariantId && add(p.defaultVariantId)}
                  >
                    <Plus aria-hidden />
                    {t.cart.addToCart}
                  </Button>
                </div>
              ))}
            </Carousel>
          </section>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}
