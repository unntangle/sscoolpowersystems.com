"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog, VisuallyHidden } from "radix-ui";
import { ArrowRight, Loader2, Search, X } from "lucide-react";
import { ProductImage } from "@/components/commerce/product-image";
import { Price } from "@/components/ui/price";
import { fmt, type Dictionary } from "@/i18n";
import type { SearchResults } from "@/lib/catalog";
import type { ProductCard } from "@/lib/shopify/mappers";
import { predictiveSearchAction } from "./actions";
import { readRecentlyViewed, type RecentItem } from "./recent";

interface SearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  popular: ProductCard[];
  discover: string[];
  t: Pick<Dictionary, "search" | "product">;
}

const EMPTY: SearchResults = { products: [], collections: [] };

function MiniProduct({
  href,
  title,
  productType,
  price,
  mrp,
  t,
  onNavigate,
}: {
  href: string;
  title: string;
  productType: string;
  price: number | null;
  mrp: number | null;
  t: SearchOverlayProps["t"];
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-neutral-50"
    >
      <ProductImage image={null} title={title} productType={productType} sizes="56px" className="size-14 shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-sm font-medium text-neutral-900">{title}</span>
        <Price
          amount={price}
          mrp={mrp}
          size="sm"
          labels={{ mrp: t.product.mrp, off: t.product.off }}
          className="mt-0.5 [&_*]:text-xs"
        />
      </span>
    </Link>
  );
}

export function SearchOverlay({ open, onOpenChange, popular, discover, t }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResults>(EMPTY);
  const [loading, setLoading] = React.useState(false);
  const [recent, setRecent] = React.useState<RecentItem[]>([]);
  const requestId = React.useRef(0);

  React.useEffect(() => {
    if (open) setRecent(readRecentlyViewed());
  }, [open]);

  // Debounced predictive search; stale responses are ignored.
  React.useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults(EMPTY);
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = ++requestId.current;
    const timer = window.setTimeout(async () => {
      try {
        const data = await predictiveSearchAction(q);
        if (id === requestId.current) setResults(data);
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  const close = () => onOpenChange(false);
  const typed = query.trim().length >= 2;
  const resultsHref = `/search?q=${encodeURIComponent(query.trim())}`;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-950/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 top-0 z-50 max-h-[90dvh] overflow-y-auto bg-white shadow-overlay data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:animate-in data-[state=open]:slide-in-from-top"
        >
          <VisuallyHidden.Root>
            <Dialog.Title>{t.search.label}</Dialog.Title>
          </VisuallyHidden.Root>

          <div className="container-site py-4 sm:py-6">
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                if (!typed) return;
                close();
                router.push(resultsHref);
              }}
              className="flex items-center gap-3 border-b-2 border-neutral-900 pb-3"
            >
              <Search className="size-6 shrink-0 text-neutral-500" aria-hidden />
              <label htmlFor="site-search" className="sr-only">
                {t.search.label}
              </label>
              <input
                id="site-search"
                type="search"
                autoFocus
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.search.placeholder}
                className="h-12 min-w-0 flex-1 bg-transparent text-lg text-neutral-900 outline-none placeholder:text-neutral-400 sm:text-2xl"
              />
              {loading ? <Loader2 className="size-5 animate-spin text-neutral-400" aria-hidden /> : null}
              <Dialog.Close className="inline-flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-neutral-100">
                <X className="size-6" aria-hidden />
                <span className="sr-only">{t.search.close}</span>
              </Dialog.Close>
            </form>

            <div aria-live="polite" className="pt-6 pb-4">
              {!typed ? (
                <div className="grid gap-8 lg:grid-cols-[1fr_1fr_1fr]">
                  <section>
                    <h2 className="mb-3 text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                      {t.search.discover}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {discover.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setQuery(chip)}
                          className="min-h-10 rounded-full border border-neutral-300 px-4 text-sm text-neutral-800 transition-colors hover:border-neutral-900"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </section>

                  {recent.length > 0 ? (
                    <section>
                      <h2 className="mb-2 text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                        {t.search.recent}
                      </h2>
                      {recent.slice(0, 4).map((item) => (
                        <MiniProduct
                          key={item.handle}
                          href={`/products/${item.handle}`}
                          title={item.title}
                          productType={item.productType}
                          price={item.price}
                          mrp={item.mrp}
                          t={t}
                          onNavigate={close}
                        />
                      ))}
                    </section>
                  ) : null}

                  {popular.length > 0 ? (
                    <section>
                      <h2 className="mb-2 text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                        {t.search.popular}
                      </h2>
                      {popular.slice(0, 4).map((p) => (
                        <MiniProduct
                          key={p.id}
                          href={`/products/${p.handle}`}
                          title={p.title}
                          productType={p.productType}
                          price={p.price}
                          mrp={p.mrp}
                          t={t}
                          onNavigate={close}
                        />
                      ))}
                    </section>
                  ) : null}
                </div>
              ) : !loading && results.products.length === 0 && results.collections.length === 0 ? (
                <div className="py-6">
                  <p className="text-lg font-medium">{fmt(t.search.noResults, { query: query.trim() })}</p>
                  <p className="mt-1 text-sm text-neutral-600">{t.search.noResultsHint}</p>
                </div>
              ) : (
                <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
                  <section>
                    <h2 className="mb-2 text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                      {t.search.categories}
                    </h2>
                    <ul>
                      {results.collections.map((c) => (
                        <li key={c.handle}>
                          <Link
                            href={`/collections/${c.handle}`}
                            onClick={close}
                            className="flex min-h-11 items-center justify-between rounded-lg px-2 text-sm hover:bg-neutral-50"
                          >
                            <span className="font-medium text-neutral-900">{c.title}</span>
                            {c.count !== null ? (
                              <span className="text-neutral-500 tabular-nums">({c.count})</span>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h2 className="mb-2 text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                      {t.search.products}
                    </h2>
                    <div className="grid gap-1 sm:grid-cols-2">
                      {results.products.map((p) => (
                        <MiniProduct
                          key={p.id}
                          href={`/products/${p.handle}`}
                          title={p.title}
                          productType={p.productType}
                          price={p.price}
                          mrp={p.mrp}
                          t={t}
                          onNavigate={close}
                        />
                      ))}
                    </div>
                    <Link
                      href={resultsHref}
                      onClick={close}
                      className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
                    >
                      {t.search.seeAll} <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </section>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
