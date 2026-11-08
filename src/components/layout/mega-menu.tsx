"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationMenu } from "radix-ui";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavIcon } from "./nav-icon";
import type { ResolvedSection } from "./nav-types";

export interface MegaMenuLabels {
  home: string;
  about: string;
  products: string;
  brands: string;
  contact: string;
  viewAll: string;
  viewAllHref: string;
  brandsIntro: string;
}

interface MegaMenuProps {
  sections: ResolvedSection[];
  /** `logo` is the official logo path when a file exists in /public/images/brands/. */
  brands: { name: string; href: string; logo: string | null }[];
  labels: MegaMenuLabels;
}

const itemClass =
  "inline-flex h-18 items-center gap-1 border-b-2 border-transparent px-3 text-[0.9375rem] text-neutral-800 transition-colors hover:text-accent-700 data-[state=open]:border-accent-600 data-[state=open]:text-accent-700 aria-[current=page]:border-accent-600 aria-[current=page]:text-accent-700 xl:px-4";

/**
 * Panels are positioned against the sticky <header> (its nearest positioned ancestor), so they span the
 * full header width. Root strips Radix's `position: relative` from the list wrapper to make that work.
 */
const panelClass =
  "absolute inset-x-0 top-full w-full border-t border-neutral-200 bg-white shadow-raised data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in-0 data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out-0";

/**
 * Desktop navigation (lg+): Home · About · Products ▾ · Brands ▾ · Contact.
 * Radix NavigationMenu: hover + focus opening, arrow keys, Escape, correct ARIA.
 */
export function MegaMenu({ sections, brands, labels }: MegaMenuProps) {
  const pathname = usePathname();
  const current = (href: string) => (pathname === href ? "page" : undefined);
  const groups = sections.flatMap((s) => s.groups);
  const promo = sections[0]?.promo;

  const simpleLink = (href: string, label: string) => (
    <NavigationMenu.Item>
      <NavigationMenu.Link asChild>
        <Link href={href} aria-current={current(href)} className={itemClass}>
          {label}
        </Link>
      </NavigationMenu.Link>
    </NavigationMenu.Item>
  );

  return (
    <NavigationMenu.Root delayDuration={80} aria-label="Main" className="static! hidden lg:block [&>div]:static!">
      <NavigationMenu.List className="flex items-center">
        {simpleLink("/", labels.home)}
        {simpleLink("/about", labels.about)}

        {/* Products: the five categories */}
        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger className={cn(itemClass, "group")}>
            {labels.products}
            <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className={panelClass}>
            <div className="container-wide grid grid-cols-[1fr_17rem] gap-10 py-10">
              <div className="grid grid-cols-3 gap-x-8 gap-y-8 xl:grid-cols-5">
                {groups.map((group) => (
                  <div key={group.id} className="min-w-0">
                    <NavigationMenu.Link asChild>
                      <Link href={group.href} className="group/title flex items-center gap-3">
                        <NavIcon icon={group.icon} className="shrink-0" />
                        <span className="text-[0.9375rem] leading-snug font-medium text-neutral-950 group-hover/title:text-accent-700">
                          {group.title}
                        </span>
                      </Link>
                    </NavigationMenu.Link>
                    <ul className="mt-4 grid gap-1 border-l border-accent-200 pl-4">
                      {group.links.map((link) => (
                        <li key={link.href + link.label}>
                          <NavigationMenu.Link asChild>
                            <Link
                              href={link.href}
                              className="block rounded-sm py-1 text-sm text-neutral-600 transition-colors hover:text-accent-700"
                            >
                              {link.label}
                            </Link>
                          </NavigationMenu.Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {promo ? (
                <div className="flex flex-col justify-between rounded-2xl bg-accent-50 p-6">
                  <div>
                    <p className="text-lg font-medium text-accent-900">{promo.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-700">{promo.body}</p>
                  </div>
                  <NavigationMenu.Link asChild>
                    <Link
                      href={promo.href}
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent-700 hover:underline"
                    >
                      {promo.cta}
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </NavigationMenu.Link>
                </div>
              ) : null}
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {/* Brands */}
        <NavigationMenu.Item value="brands">
          <NavigationMenu.Trigger className={cn(itemClass, "group")}>
            {labels.brands}
            <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className={panelClass}>
            <div className="container-wide grid grid-cols-[16rem_1fr] items-center gap-12 py-10">
              <p className="text-sm leading-relaxed text-neutral-600">{labels.brandsIntro}</p>
              <ul className="grid grid-cols-5 overflow-hidden rounded-2xl border border-neutral-200">
                {brands.map((brand, i) => (
                  <li key={brand.name} className={cn(i > 0 && "border-l border-neutral-200")}>
                    <NavigationMenu.Link asChild>
                      <Link
                        href={brand.href}
                        className="group flex h-24 items-center justify-center px-5 text-center text-[0.9375rem] leading-snug font-medium text-neutral-800 transition-colors hover:bg-accent-50 hover:text-accent-800"
                      >
                        {brand.logo ? (
                          <span className="relative h-9 w-full max-w-[8.5rem] transition-transform duration-300 group-hover:scale-105">
                            <Image
                              src={brand.logo}
                              alt={brand.name}
                              fill
                              sizes="136px"
                              unoptimized={brand.logo.endsWith(".svg")}
                              className="object-contain"
                            />
                          </span>
                        ) : (
                          brand.name
                        )}
                      </Link>
                    </NavigationMenu.Link>
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {simpleLink("/contact", labels.contact)}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
