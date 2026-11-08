import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ReceiptText, RotateCcw, Truck, Wrench } from "lucide-react";
import { BrandStrip } from "@/components/home/brand-strip";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { loc, type Localized } from "@/i18n";
import { getI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "About us",
  description: `${site.name}: authorised home appliance dealer in Chennai. Delivery, installation and service by our own team.`,
};

/** PLACEHOLDER copy drafted from the project brief: have the owner review and add the real story. */
const copy = {
  eyebrow: { en: "About SS Cool Power Systems", ta: "SS Cool Power Systems பற்றி" },
  title: { en: "Two decades of keeping", ta: "இருபது ஆண்டுகளாக" },
  accent: { en: "Chennai homes cool.", ta: "சென்னை வீடுகளைக் குளிர்விக்கிறோம்." },
  story: {
    en: "We are a Chennai-based dealer of home appliances, specialising in air conditioners alongside refrigerators, washing machines, televisions and inverters. Our team has spent around twenty years learning what actually works in Chennai homes: the right tonnage for a west-facing bedroom, the stabiliser a fridge really needs, the stand that survives a monsoon balcony. That experience is what we bring to every recommendation.",
    ta: "நாங்கள் சென்னையைச் சேர்ந்த வீட்டு உபகரண டீலர். ஏர் கண்டிஷனர்கள் எங்கள் சிறப்பு; ஃப்ரிட்ஜ், வாஷிங் மெஷின், டிவி, இன்வர்ட்டர்களும் விற்கிறோம். சுமார் இருபது ஆண்டுகளாக சென்னை வீடுகளுக்கு எது சரியாக வேலை செய்யும் என்பதைக் கற்றுக்கொண்டுள்ளோம். அந்த அனுபவத்தையே ஒவ்வொரு பரிந்துரையிலும் தருகிறோம்.",
  },
  promisesTitle: { en: "What you can count on", ta: "நீங்கள் நம்பலாம்" },
  brandsTitle: { en: "Authorised dealer for", ta: "அங்கீகரிக்கப்பட்ட டீலர்" },
  ctaTitle: { en: "Not sure which model fits?", ta: "எந்த மாடல் பொருந்தும் என்று தெரியவில்லையா?" },
  ctaBody: { en: "Tell us your room size and budget. We'll suggest two or three options with honest running costs.", ta: "அறை அளவு, பட்ஜெட்டைச் சொல்லுங்கள். நேர்மையான மின் செலவுடன் 2–3 மாடல்களைப் பரிந்துரைப்போம்." },
  ctaButton: { en: "Contact us", ta: "தொடர்பு கொள்ளுங்கள்" },
} satisfies Record<string, Localized>;

const promises: { icon: typeof Truck; title: Localized; body: Localized }[] = [
  { icon: BadgeCheck, title: { en: "Genuine, authorised stock", ta: "அசல், அங்கீகரிக்கப்பட்ட பொருட்கள்" }, body: { en: "Full brand warranty on every product.", ta: "ஒவ்வொரு பொருளுக்கும் முழு பிராண்ட் வாரண்டி." } },
  { icon: Truck, title: { en: "Delivered across Chennai", ta: "சென்னை முழுவதும் டெலிவரி" }, body: { en: "Scheduled delivery to your door.", ta: "உங்கள் வீட்டுக்கு திட்டமிட்ட டெலிவரி." } },
  { icon: Wrench, title: { en: "Installed by our team", ta: "எங்கள் குழுவால் நிறுவல்" }, body: { en: "Trained technicians, neat piping, tested before we leave.", ta: "பயிற்சி பெற்ற டெக்னீஷியன்கள், சோதித்த பின்பே புறப்படுவோம்." } },
  { icon: ReceiptText, title: { en: "GST invoice", ta: "GST இன்வாய்ஸ்" }, body: { en: "For homes and businesses alike.", ta: "வீடுகளுக்கும் நிறுவனங்களுக்கும்." } },
  { icon: RotateCcw, title: { en: "7-day returns", ta: "7 நாள் ரிட்டர்ன்" }, body: { en: "Hassle-free, as on our current store.", ta: "எளிய ரிட்டர்ன் வசதி." } },
];

export default async function AboutPage() {
  const { locale } = await getI18n();

  return (
    <>
      <section className="container-wide section-y">
        <p className="text-xs font-medium tracking-[0.18em] text-neutral-500 uppercase">{loc(copy.eyebrow, locale)}</p>
        <h1 className="mt-4 max-w-4xl text-display-1 text-neutral-950">
          {loc(copy.title, locale)} <span className="accent-serif">{loc(copy.accent, locale)}</span>
        </h1>
        <p className="mt-10 max-w-2xl text-lg leading-relaxed text-neutral-700">{loc(copy.story, locale)}</p>
      </section>

      <section className="bg-cream">
        <div className="container-wide section-y">
          <h2 className="text-display-3 text-neutral-950">{loc(copy.promisesTitle, locale)}</h2>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {promises.map((p) => (
              <li key={p.title.en}>
                <p.icon className="size-6 text-neutral-800" aria-hidden />
                <h3 className="mt-4 text-base font-medium text-neutral-950">{loc(p.title, locale)}</h3>
                <p className="mt-1 text-sm text-neutral-600">{loc(p.body, locale)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div id="brands" className="scroll-mt-28 pt-16">
        <BrandStrip title={loc(copy.brandsTitle, locale)} />
      </div>

      <section className="container-wide section-y">
        <div className="flex flex-col items-start justify-between gap-6 rounded-banner bg-ink p-8 text-white sm:p-12 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-display-3">{loc(copy.ctaTitle, locale)}</h2>
            <p className="mt-3 max-w-xl text-white/75">{loc(copy.ctaBody, locale)}</p>
          </div>
          <Button asChild variant="light">
            <Link href="/contact">
              {loc(copy.ctaButton, locale)}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
