import { megaMenu, topLinks, type NavIcon } from "@/config/navigation";
import { loc, type Locale } from "@/i18n";

/** Navigation with labels resolved for one locale, ready to pass to client components. */
export interface ResolvedLink {
  label: string;
  href: string;
}

export interface ResolvedGroup {
  id: string;
  title: string;
  icon: NavIcon;
  href: string;
  links: ResolvedLink[];
}

export interface ResolvedSection {
  id: string;
  title: string;
  groups: ResolvedGroup[];
  promo: { title: string; body: string; href: string; cta: string };
}

export function resolveNavigation(locale: Locale): { sections: ResolvedSection[]; links: ResolvedLink[] } {
  return {
    sections: megaMenu.map((s) => ({
      id: s.id,
      title: loc(s.title, locale),
      groups: s.groups.map((g) => ({
        id: g.id,
        title: loc(g.title, locale),
        icon: g.icon,
        href: g.href,
        links: g.links.map((l) => ({ label: loc(l.label, locale), href: l.href })),
      })),
      promo: {
        title: loc(s.promo.title, locale),
        body: loc(s.promo.body, locale),
        href: s.promo.href,
        cta: loc(s.promo.cta, locale),
      },
    })),
    links: topLinks.map((l) => ({ label: loc(l.label, locale), href: l.href })),
  };
}
