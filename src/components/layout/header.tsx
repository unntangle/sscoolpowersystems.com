import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brands } from "@/config/brands";
import { brandHref, mainNav } from "@/config/main-nav";
import { discoverQueries, topLinks } from "@/config/navigation";
import { site } from "@/config/site";
import { loc, type Dictionary, type Locale } from "@/i18n";
import { brandLogo } from "@/lib/brand-logos";
import type { ProductCard } from "@/lib/shopify/mappers";
import { telLink } from "@/lib/whatsapp/links";
import { HeaderActions } from "./header-actions";
import { Logo } from "./logo";
import { MegaMenu } from "./mega-menu";
import { MobileMenu } from "./mobile-menu";
import { resolveNavigation } from "./nav-types";

interface HeaderProps {
  locale: Locale;
  t: Dictionary;
  popular: ProductCard[];
}

/** Logo · Home · About · Products ▾ · Brands ▾ · Contact · search/account/cart · Shop Now (logo blue) */
export function Header({ locale, t, popular }: HeaderProps) {
  const { sections } = resolveNavigation(locale);
  const labels = {
    home: loc(mainNav.home.label, locale),
    about: loc(mainNav.about.label, locale),
    products: loc(mainNav.products.label, locale),
    brands: loc(mainNav.brands.label, locale),
    contact: loc(mainNav.contact.label, locale),
    viewAll: loc(mainNav.products.viewAll, locale),
    viewAllHref: mainNav.products.viewAllHref,
    brandsIntro: loc(mainNav.brands.intro, locale),
  };
  const shopNow = loc(mainNav.shopNow.label, locale);
  const brandLinks = brands.map((b) => ({ name: b.name, href: brandHref(b.name), logo: brandLogo(b.handle) }));

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="container-wide flex h-16 items-center justify-between gap-4 lg:h-18">
        <div className="flex items-center gap-1">
          <MobileMenu
            sections={sections}
            brands={brandLinks.map((b) => ({ label: b.name, href: b.href }))}
            extraLinks={topLinks.map((l) => ({ label: loc(l.label, locale), href: l.href }))}
            shopHref={mainNav.shopNow.href}
            callHref={telLink(site.phones.sales)}
            t={{
              ...labels,
              menu: t.header.menu,
              back: t.header.back,
              viewAll: t.header.viewAll,
              callExpert: t.utility.callExpert,
              shopNow,
            }}
          />
          <Logo />
        </div>

        <MegaMenu sections={sections} brands={brandLinks} labels={labels} />

        <div className="flex items-center gap-2">
          <HeaderActions
            t={{ header: t.header, search: t.search, product: t.product, login: t.login }}
            popular={popular}
            discover={discoverQueries.map((q) => loc(q, locale))}
          />
          <Button asChild variant="accent" size="sm" className="hidden px-5 tracking-wide uppercase sm:inline-flex">
            <Link href={mainNav.shopNow.href}>
              {shopNow}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
