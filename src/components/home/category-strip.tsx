import Image from "next/image";
import Link from "next/link";
import { ProductArt, type ArtKind } from "@/components/commerce/product-art";
import { categories, type NavIcon } from "@/config/navigation";
import { fmt, loc, type Locale } from "@/i18n";
import { photo } from "@/lib/media";

const art: Record<NavIcon, ArtKind> = {
  ac: "ac",
  washer: "washer",
  fridge: "fridge",
  tv: "tv",
  inverter: "inverter",
};

const countLabel = {
  one: { en: "{n} product", ta: "{n} பொருள்" },
  many: { en: "{n} products", ta: "{n} பொருட்கள்" },
  soon: { en: "Coming soon", ta: "விரைவில்" },
};

/** Category image: public/images/categories/<handle>.(png|webp|jpg), transparent cut-out preferred. */
function categoryImage(handle: string): string | null {
  for (const ext of ["png", "webp", "jpg"]) {
    const src = photo(`/images/categories/${handle}.${ext}`);
    if (src) return src;
  }
  return null;
}

/**
 * The five product categories as large circular tiles with product counts.
 * Soft logo-blue circles; a blue ring and title on hover.
 */
export function CategoryStrip({
  locale,
  label,
  counts,
}: {
  locale: Locale;
  label: string;
  counts: Record<string, number | null>;
}) {
  return (
    <nav aria-label={label} className="container-wide py-10 lg:py-14">
      <ul className="no-scrollbar -mx-[var(--ss-gutter)] flex snap-x gap-4 overflow-x-auto px-[var(--ss-gutter)] sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-6 sm:overflow-visible sm:px-0">
        {categories.map((cat) => {
          const src = categoryImage(cat.handle);
          const count = counts[cat.handle];
          const countText =
            count == null
              ? null
              : count === 0
                ? loc(countLabel.soon, locale)
                : fmt(loc(count === 1 ? countLabel.one : countLabel.many, locale), { n: count });

          return (
            <li key={cat.handle} className="w-36 shrink-0 snap-start sm:w-auto">
              <Link href={`/collections/${cat.handle}`} className="group flex flex-col items-center text-center">
                <span className="relative flex aspect-square w-full max-w-[13rem] items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-accent-50 to-accent-100 ring-2 ring-transparent ring-offset-4 transition duration-300 group-hover:ring-accent-500">
                  {src ? (
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 18vw, 144px"
                      className="object-contain p-[14%] transition-transform duration-500 ease-out-soft group-hover:scale-105"
                    />
                  ) : (
                    <span className="h-1/2 w-1/2 text-accent-700 transition-transform duration-500 ease-out-soft group-hover:scale-105">
                      <ProductArt kind={art[cat.icon]} />
                    </span>
                  )}
                </span>
                <span className="mt-4 text-base font-medium text-neutral-950 transition-colors group-hover:text-accent-700 sm:text-lg">
                  {loc(cat.title, locale)}
                </span>
                {countText ? (
                  <span className={count === 0 ? "mt-0.5 text-sm text-neutral-500" : "mt-0.5 text-sm font-medium text-accent-700"}>
                    {countText}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
