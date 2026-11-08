import Link from "next/link";
import { ArrowRight, FileText, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/features/cart/add-to-cart-button";
import { WishlistButton } from "@/features/wishlist/wishlist-button";
import { fmt, type Dictionary } from "@/i18n";
import { discountPercent, formatINR } from "@/lib/format";
import type { ProductCard as ProductCardData } from "@/lib/shopify/mappers";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp/links";
import { ProductImage } from "./product-image";

interface ProductCardProps {
  product: ProductCardData;
  t: Pick<Dictionary, "product" | "cart">;
  /** Global switch (shop metafield) for "Starting from" bands. */
  showPriceBands?: boolean;
  priority?: boolean;
  className?: string;
}

/**
 * Minimal editorial product card with logo-blue accents. The CTA follows pricing_mode:
 * public -> Add to Cart · whatsapp_quote -> Get Best Price (WhatsApp) · rfq -> Request Quote.
 */
export function ProductCard({ product, t, showPriceBands = true, priority, className }: ProductCardProps) {
  const href = `/products/${product.handle}`;
  const band = showPriceBands ? product.priceBand : null;
  const isPublic = product.pricingMode === "public";
  const pct = isPublic && product.price != null && product.mrp != null ? discountPercent(product.price, product.mrp) : null;
  const features = [product.capacity, ...product.keyFeatures].filter((f): f is string => Boolean(f)).slice(0, 3);
  const isBestseller = product.tags.includes("popular");
  const badge = isBestseller ? "Bestseller" : product.energyRating ? fmt(t.product.star, { n: product.energyRating }) : null;

  return (
    <article className={cn("group relative flex h-full flex-col bg-white", className)}>
      <div className="relative">
        <ProductImage
          image={product.image}
          title={product.title}
          productType={product.productType}
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 70vw"
          priority={priority}
          className="rounded-xl bg-neutral-50 transition-colors group-hover:bg-accent-50"
        />
        {badge ? (
          <Badge
            tone="solid"
            className={cn(
              "absolute top-3 left-3 rounded-full px-2.5 text-[0.6875rem] font-medium",
              isBestseller ? "bg-accent-600" : "bg-neutral-900",
            )}
          >
            {badge}
          </Badge>
        ) : null}
        <WishlistButton handle={product.handle} label={`Save ${product.title}`} className="absolute top-2 right-2 z-10 bg-white/80" />
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-xs font-medium text-accent-700">{product.vendor}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.5em] text-[0.9375rem] leading-snug font-medium text-neutral-900 transition-colors group-hover:text-accent-700">
          <Link href={href} className="after:absolute after:inset-0">
            {product.title}
          </Link>
        </h3>

        {features.length > 0 ? (
          <ul className="mt-3 grid gap-1">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-neutral-600">
                <span className="size-1 shrink-0 rounded-full bg-accent-500" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto pt-4">
          {isPublic && product.price != null ? (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-lg font-semibold text-neutral-900 tabular-nums">{formatINR(product.price)}</span>
              {pct !== null && product.mrp != null ? (
                <>
                  <span className="text-xs text-neutral-500">
                    {t.product.mrp} <s className="tabular-nums">{formatINR(product.mrp)}</s>
                  </span>
                  <span className="text-xs font-semibold text-success-700">
                    {pct}% {t.product.off}
                  </span>
                </>
              ) : null}
            </div>
          ) : band ? (
            <div>
              <p className="text-xs text-neutral-500">{t.product.startingFrom}</p>
              <p className="text-lg font-semibold text-neutral-900 tabular-nums">{formatINR(band.min)}</p>
              {product.mrp ? (
                <p className="text-xs text-neutral-500">
                  {t.product.mrp} {formatINR(product.mrp)}
                </p>
              ) : null}
            </div>
          ) : product.mrp ? (
            <p className="text-sm text-neutral-700">
              {t.product.mrp} <span className="text-lg font-semibold text-neutral-900 tabular-nums">{formatINR(product.mrp)}</span>
            </p>
          ) : (
            <p className="text-sm font-medium text-neutral-700">{t.product.requestQuote}</p>
          )}
        </div>

        <div className="relative z-10 mt-4">
          {isPublic && product.defaultVariantId ? (
            <AddToCartButton
              variantId={product.defaultVariantId}
              label={t.cart.addToCart}
              variant="accent-outline"
              size="sm"
              className="w-full"
            />
          ) : product.pricingMode === "whatsapp_quote" ? (
            <Button asChild variant="accent-outline" size="sm" className="w-full">
              <a
                href={whatsappLink(fmt(t.product.whatsappMessage, { title: product.title }))}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden />
                {t.product.getBestPrice}
              </a>
            </Button>
          ) : (
            <Button asChild variant="accent-outline" size="sm" className="w-full">
              <Link href={`${href}#quote`}>
                <FileText aria-hidden />
                {t.product.requestQuote}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
