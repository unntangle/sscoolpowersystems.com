import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { footerGroups, socialLinks } from "@/config/navigation";
import { site } from "@/config/site";
import { footerContent } from "@/content/home";
import { NewsletterForm } from "@/features/newsletter/newsletter-form";
import { loc, type Dictionary, type Locale } from "@/i18n";
import { FooterLinks } from "./footer-links";
import { Logo } from "./logo";

/** Dark editorial footer with logo-blue accents: newsletter, link groups, store finder, giant wordmark. */
export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const groups = footerGroups.map((g) => ({
    title: loc(g.title, locale),
    links: g.links.map((l) => ({ label: loc(l.label, locale), href: l.href })),
  }));
  const { address } = site;

  return (
    <footer className="mt-auto bg-ink pb-24 text-white lg:pb-0" data-theme="dark">
      <div aria-hidden className="h-1 bg-gradient-to-r from-accent-600 via-accent-400 to-accent-600" />
      <div className="container-wide grid gap-14 pt-16 pb-12 lg:grid-cols-[1fr_1.6fr] lg:pt-24">
        <div className="max-w-md">
          <p className="text-display-3 text-white">
            {loc(footerContent.newsletterLead, locale)}
            <br />
            <span className="accent-serif text-accent-300">{loc(footerContent.newsletterAccent, locale)}</span>
          </p>
          <div className="mt-8">
            <NewsletterForm t={t.footer} tone="dark" />
          </div>
        </div>
        <FooterLinks groups={groups} />
      </div>

      <div className="container-wide">
        <form
          action="/stores"
          className="grid gap-4 rounded-2xl bg-accent-900/60 px-6 py-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8 sm:px-8"
        >
          <p className="text-lg font-medium">{t.footer.storeTitle}</p>
          <div className="flex items-center gap-3 border-b border-white/30 pb-1 focus-within:border-accent-300 sm:max-w-xs">
            <label htmlFor="store-pincode" className="sr-only">
              {t.pincode.label}
            </label>
            <input
              id="store-pincode"
              name="pincode"
              inputMode="numeric"
              maxLength={6}
              placeholder={t.pincode.label}
              className="h-10 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/50"
            />
            <button type="submit" className="inline-flex size-9 items-center justify-center rounded-full hover:bg-white/10">
              <ArrowRight className="size-4" aria-hidden />
              <span className="sr-only">{t.footer.storeCta}</span>
            </button>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="accent" size="sm">
              <Link href="/stores">{t.footer.storeCta}</Link>
            </Button>
            <Button asChild variant="glass" size="sm">
              <Link href="/project-enquiry">B2B / GST</Link>
            </Button>
          </div>
        </form>
      </div>

      <div className="container-wide overflow-hidden py-10 select-none" aria-hidden>
        <p className="text-center text-mega whitespace-nowrap text-white/[0.08]">
          {footerContent.wordmark.sans} <span className="accent-serif text-accent-400/25">{footerContent.wordmark.serif}</span>
        </p>
      </div>

      <div className="container-wide grid items-center gap-6 border-t border-white/10 py-6 text-xs text-white/55 sm:grid-cols-3">
        <div className="grid gap-1">
          <p>
            © {new Date().getFullYear()} {site.name}. {t.footer.rights}
          </p>
          <p>
            {t.footer.gst}: {site.gstin} · {address.locality}, {address.city} {address.pincode}
          </p>
        </div>
        <div className="sm:justify-self-center">
          <Logo inverted />
        </div>
        <nav aria-label={t.footer.follow} className="flex gap-5 sm:justify-self-end">
          {socialLinks.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-accent-300">
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
