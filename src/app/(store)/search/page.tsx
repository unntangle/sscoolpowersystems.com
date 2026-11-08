import type { Metadata } from "next";
import { ProductCard } from "@/components/commerce/product-card";
import { fmt } from "@/i18n";
import { getI18n } from "@/i18n/server";
import { searchAll } from "@/lib/catalog";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim().slice(0, 80) ?? "";
  const { locale, t } = await getI18n();
  const products = query.length >= 2 ? await searchAll(query, locale) : [];

  return (
    <div className="container-wide py-10 lg:py-14">
      <h1 className="text-display-3 font-bold">
        {query ? fmt(t.search.resultsFor, { query }) : t.search.label}
      </h1>
      {query ? (
        <p className="mt-2 text-neutral-600">{fmt(t.search.resultsCount, { count: products.length })}</p>
      ) : (
        <p className="mt-2 text-neutral-600">{t.search.emptyQuery}</p>
      )}

      {query && products.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-neutral-50 p-8">
          <p className="text-lg font-medium">{fmt(t.search.noResults, { query })}</p>
          <p className="mt-1 text-neutral-600">{t.search.noResultsHint}</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} t={t} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
