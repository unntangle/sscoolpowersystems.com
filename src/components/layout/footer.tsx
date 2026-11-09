import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { footerGroups, socialLinks } from "@/config/navigation";
import { site } from "@/config/site";
import { footerContent } from "@/content/home";
import { NewsletterForm } from "@/features/newsletter/newsletter-form";
import { loc, type Dictionary, type Locale, type Localized } from "@/i18n";
import { telLink } from "@/lib/whatsapp/links";
import { FooterLinks } from "./footer-links";
import "@/styles/footer.css";

const contactCopy = {
  visit: { en: "Visit our store", ta: "எங்கள் கடை" },
  directions: { en: "Get directions", ta: "வழி காட்டு" },
  contact: { en: "Contact", ta: "தொடர்பு" },
} satisfies Record<string, Localized>;

/** Same heading style as the link groups above, so these columns read as part of the footer. */
const headingClass = "mb-3 text-sm font-medium text-white";
const valueClass = "text-sm leading-relaxed text-white/65";
const actionClass = "inline-flex items-center gap-1 text-sm text-accent-300 transition-colors hover:text-white";

/**
 * Dark editorial footer (layout in src/styles/footer.css):
 *   [ Products        | Company | Support | Legal ]
 *   [ Visit our store | Contact |      Sale updates ]
 */
export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const groups = footerGroups.map((g) => ({
    title: loc(g.title, locale),
    links: g.links.map((l) => ({ label: loc(l.label, locale), href: l.href })),
  }));
  const { address } = site;
  const fullAddress = `${address.line1}, ${address.locality}, ${address.city}, ${address.state} ${address.pincode}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name}, ${fullAddress}`)}`;

  // Short lines so the address fits one column neatly.
  const localityParts = address.locality.split(", ");
  const addressLines = [
    `${address.line1},`,
    `${localityParts.slice(0, 2).join(", ")},`,
    ...(localityParts.length > 2 ? [`${localityParts.slice(2).join(", ")},`] : []),
    `${address.city}, ${address.state} ${address.pincode}`,
  ];

  return (
    <footer className="mt-auto bg-ink pb-24 text-white lg:pb-0" data-theme="dark">
      <div className="container-wide pt-16 pb-14 lg:pt-24">
        {/* Row 1: link columns */}
        <FooterLinks groups={groups} />

        {/* Row 2: store | contact | newsletter (right) — same 4-column grid, no divider */}
        <div className="footer-cols mt-16">
          <address className="not-italic">
            <p className={headingClass}>{loc(contactCopy.visit, locale)}</p>
            <p className={valueClass}>
              {addressLines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>
            <a href={mapsHref} target="_blank" rel="noopener noreferrer" className={`${actionClass} mt-3`}>
              {loc(contactCopy.directions, locale)}
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          </address>

          <div className="min-w-0">
            <p className={headingClass}>{loc(contactCopy.contact, locale)}</p>
            <ul className="grid gap-2">
              <li>
                <a href={telLink(site.phones.sales)} className={`${valueClass} inline-flex items-center gap-2 hover:text-white`}>
                  <Phone className="size-4 shrink-0 text-accent-300" aria-hidden />
                  <span className="tabular-nums">{site.phones.sales}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className={`${valueClass} inline-flex items-center gap-2 break-all hover:text-white`}
                >
                  <Mail className="size-4 shrink-0 text-accent-300" aria-hidden />
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <p className="text-display-3 text-white">
              {loc(footerContent.newsletterLead, locale)}
              <br />
              <span className="accent-serif text-accent-300">{loc(footerContent.newsletterAccent, locale)}</span>
            </p>
            <div className="mt-8">
              <NewsletterForm t={t.footer} tone="dark" />
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide overflow-hidden py-8 select-none" aria-hidden>
        <p className="text-center text-mega whitespace-nowrap text-white/[0.08]">
          {footerContent.wordmark.sans} <span className="accent-serif text-accent-400/25">{footerContent.wordmark.serif}</span>
        </p>
      </div>

      <div className="container-wide flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. {t.footer.rights} · {t.footer.gst}: {site.gstin}
        </p>
        {/* Right padding on desktop keeps the links clear of the floating WhatsApp button. */}
        <nav aria-label={t.footer.follow} className="flex gap-5 lg:pr-20">
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
