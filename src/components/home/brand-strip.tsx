import Image from "next/image";
import Link from "next/link";
import { brands } from "@/config/brands";
import { brandHref } from "@/config/main-nav";
import { brandLogo } from "@/lib/brand-logos";

/**
 * Authorised brands row. Shows the official logo (true colours, per brand guidelines) when a file exists
 * in /public/images/brands/, otherwise the brand name set in type.
 */
export function BrandStrip({ title }: { title: string }) {
  return (
    <section aria-label={title} className="container-wide pb-4">
      <p className="mb-5 flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.18em] text-accent-700 uppercase">
        <span aria-hidden className="h-px w-8 bg-accent-300" />
        {title}
        <span aria-hidden className="h-px w-8 bg-accent-300" />
      </p>
      <ul className="grid grid-cols-2 overflow-hidden rounded-2xl border border-neutral-200 sm:grid-cols-3 lg:grid-cols-5">
        {brands.map((brand) => {
          const logo = brandLogo(brand.handle);
          return (
            <li key={brand.handle} className="-mt-px -ml-px border-t border-l border-neutral-200">
              <Link
                href={brandHref(brand.name)}
                className="group flex h-24 items-center justify-center px-6 text-center transition-colors hover:bg-accent-50"
              >
                {logo ? (
                  <span className="relative h-10 w-full max-w-[9rem] transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={logo}
                      alt={brand.name}
                      fill
                      sizes="144px"
                      unoptimized={logo.endsWith(".svg")}
                      className="object-contain"
                    />
                  </span>
                ) : (
                  <span className="text-[0.9375rem] leading-snug font-medium text-neutral-700 group-hover:text-accent-700">
                    {brand.name}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
