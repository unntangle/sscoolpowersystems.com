import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { loc, type Localized } from "@/i18n";
import { getI18n } from "@/i18n/server";
import { telLink, whatsappLink } from "@/lib/whatsapp/links";

export const metadata: Metadata = {
  title: "Contact",
  description: `Call, WhatsApp or visit ${site.name} in St. Thomas Mount, Chennai.`,
};

const copy = {
  title: { en: "Talk to us.", ta: "எங்களிடம் பேசுங்கள்." },
  accent: { en: "We reply fast.", ta: "விரைவாகப் பதிலளிப்போம்." },
  intro: {
    en: "Questions about a model, a price, delivery or installation? Call, WhatsApp or drop by the store.",
    ta: "மாடல், விலை, டெலிவரி அல்லது நிறுவல் பற்றிய கேள்விகளா? அழைக்கவும், WhatsApp செய்யவும், அல்லது கடைக்கு வாருங்கள்.",
  },
  call: { en: "Call us", ta: "அழைக்கவும்" },
  whatsapp: { en: "WhatsApp", ta: "WhatsApp" },
  whatsappCta: { en: "Chat on WhatsApp", ta: "WhatsApp-ல் பேசுங்கள்" },
  email: { en: "Email", ta: "மின்னஞ்சல்" },
  visit: { en: "Visit the store", ta: "கடைக்கு வாருங்கள்" },
  directions: { en: "Get directions", ta: "வழி காட்டு" },
  hours: { en: "WhatsApp replies", ta: "WhatsApp பதில்" },
  message: {
    en: "Hi SS Cool Power Systems, I have a question.",
    ta: "வணக்கம் SS Cool Power Systems, எனக்கு ஒரு கேள்வி உள்ளது.",
  },
} satisfies Record<string, Localized>;

export default async function ContactPage() {
  const { locale } = await getI18n();
  const { address } = site;
  const fullAddress = `${address.line1}, ${address.locality}, ${address.city}, ${address.state} ${address.pincode}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name}, ${fullAddress}`)}`;

  const cards = [
    { icon: Phone, title: loc(copy.call, locale), value: site.phones.sales, href: telLink(site.phones.sales), external: false },
    { icon: MessageCircle, title: loc(copy.whatsapp, locale), value: site.phones.sales, href: whatsappLink(loc(copy.message, locale)), external: true },
    { icon: Mail, title: loc(copy.email, locale), value: site.email, href: `mailto:${site.email}`, external: false },
    { icon: Clock, title: loc(copy.hours, locale), value: site.promises.whatsappHours.label, href: null, external: false },
  ];

  return (
    <div className="container-wide section-y">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
        <h1 className="text-display-2 text-neutral-950">
          {loc(copy.title, locale)}
          <br />
          <span className="accent-serif">{loc(copy.accent, locale)}</span>
        </h1>
        <p className="max-w-md text-neutral-600 lg:justify-self-end">{loc(copy.intro, locale)}</p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const body = (
            <>
              <card.icon className="size-6 text-neutral-700" aria-hidden />
              <p className="mt-6 text-xs font-medium tracking-[0.12em] text-neutral-500 uppercase">{card.title}</p>
              <p className="mt-1 text-lg text-neutral-950">{card.value}</p>
            </>
          );
          return card.href ? (
            <a
              key={card.title}
              href={card.href}
              {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="rounded-2xl border border-neutral-200 p-6 transition-shadow hover:shadow-card"
            >
              {body}
            </a>
          ) : (
            <div key={card.title} className="rounded-2xl border border-neutral-200 p-6">
              {body}
            </div>
          );
        })}
      </div>

      <section className="mt-6 grid gap-6 rounded-banner bg-cream p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex gap-4">
          <MapPin className="mt-1 size-6 shrink-0 text-neutral-700" aria-hidden />
          <div>
            <h2 className="text-2xl text-neutral-950">{loc(copy.visit, locale)}</h2>
            <address className="mt-2 text-neutral-700 not-italic">{fullAddress}</address>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href={mapsHref} target="_blank" rel="noopener noreferrer">
              {loc(copy.directions, locale)}
            </a>
          </Button>
          <Button asChild variant="whatsapp">
            <a href={whatsappLink(loc(copy.message, locale))} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden />
              {loc(copy.whatsappCta, locale)}
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
