"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Headset, Menu } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { NavIcon } from "./nav-icon";
import type { ResolvedLink, ResolvedSection } from "./nav-types";

export interface MobileMenuLabels {
  menu: string;
  back: string;
  viewAll: string;
  callExpert: string;
  home: string;
  about: string;
  products: string;
  brands: string;
  contact: string;
  shopNow: string;
  brandsIntro: string;
}

interface MobileMenuProps {
  sections: ResolvedSection[];
  brands: ResolvedLink[];
  extraLinks: ResolvedLink[];
  shopHref: string;
  callHref: string;
  t: MobileMenuLabels;
}

type Level = "root" | "products" | "brands";

/** Full-screen drawer: Home · About · Products › · Brands › · Contact, with drill-down levels. */
export function MobileMenu({ sections, brands, extraLinks, shopHref, callHref, t }: MobileMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [level, setLevel] = React.useState<Level>("root");
  const close = () => setOpen(false);

  const title = level === "products" ? t.products : level === "brands" ? t.brands : t.menu;
  const rowClass = "flex min-h-14 w-full items-center justify-between text-left text-lg text-neutral-950";

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setLevel("root");
      }}
    >
      <DrawerTrigger className="inline-flex size-11 items-center justify-center rounded-full text-neutral-900 hover:bg-neutral-100 lg:hidden">
        <Menu className="size-6" aria-hidden />
        <span className="sr-only">{t.menu}</span>
      </DrawerTrigger>
      <DrawerContent
        side="left"
        className="max-w-none sm:max-w-md"
        title={title}
        headerStart={
          level !== "root" ? (
            <button
              type="button"
              onClick={() => setLevel("root")}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-neutral-100"
            >
              <ArrowLeft className="size-5" aria-hidden />
              <span className="sr-only">{t.back}</span>
            </button>
          ) : null
        }
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={shopHref}
              onClick={close}
              className="flex min-h-12 items-center justify-center rounded-full bg-neutral-900 text-sm font-medium text-white"
            >
              {t.shopNow}
            </Link>
            <a
              href={callHref}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-neutral-900 text-sm font-medium text-neutral-900"
            >
              <Headset className="size-4" aria-hidden />
              {t.callExpert}
            </a>
          </div>
        }
      >
        {level === "products" ? (
          <div className="grid gap-6">
            {sections.map((section) => (
              <div key={section.id}>
                {sections.length > 1 ? (
                  <p className="mb-1 text-xs font-medium tracking-[0.12em] text-neutral-500 uppercase">{section.title}</p>
                ) : null}
                <Accordion type="single" collapsible defaultValue={section.groups[0]?.id}>
                  {section.groups.map((group) => (
                    <AccordionItem key={group.id} value={group.id}>
                      <AccordionTrigger>
                        <span className="flex items-center gap-3">
                          <NavIcon icon={group.icon} className="size-9" />
                          {group.title}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="grid pl-12">
                          {group.links.map((link) => (
                            <li key={link.href + link.label}>
                              <Link href={link.href} onClick={close} className="block py-2.5 text-base text-neutral-700">
                                {link.label}
                              </Link>
                            </li>
                          ))}
                          <li>
                            <Link href={group.href} onClick={close} className="block py-2.5 font-medium text-neutral-950">
                              {t.viewAll}
                            </Link>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        ) : level === "brands" ? (
          <div>
            <p className="mb-4 text-sm text-neutral-600">{t.brandsIntro}</p>
            <ul className="divide-y divide-neutral-200">
              {brands.map((brand) => (
                <li key={brand.label}>
                  <Link href={brand.href} onClick={close} className={rowClass}>
                    {brand.label}
                    <ChevronRight className="size-5 text-neutral-400" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <nav aria-label="Mobile">
            <ul className="divide-y divide-neutral-200">
              <li>
                <Link href="/" onClick={close} className={rowClass}>
                  {t.home}
                </Link>
              </li>
              <li>
                <Link href="/about" onClick={close} className={rowClass}>
                  {t.about}
                </Link>
              </li>
              <li>
                <button type="button" onClick={() => setLevel("products")} className={rowClass}>
                  {t.products}
                  <ChevronRight className="size-5 text-neutral-500" aria-hidden />
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setLevel("brands")} className={rowClass}>
                  {t.brands}
                  <ChevronRight className="size-5 text-neutral-500" aria-hidden />
                </button>
              </li>
              <li>
                <Link href="/contact" onClick={close} className={rowClass}>
                  {t.contact}
                </Link>
              </li>
            </ul>
            <ul className="mt-6 grid gap-1">
              {extraLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={close} className="block py-2 text-base text-neutral-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </DrawerContent>
    </Drawer>
  );
}
