import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Photo } from "@/components/commerce/photo";
import { Rating } from "@/components/ui/rating";
import { sampleReviews } from "@/content/home";
import { loc, type Locale, type Localized } from "@/i18n";
import { Reveal } from "./reveal";

const copy = {
  lead: { en: "What our customers", ta: "எங்கள் வாடிக்கையாளர்கள்" },
  accent: { en: "say about us", ta: "சொல்வது" },
  body: {
    en: "Reviews from Google and short video stories from families we've installed for across Chennai.",
    ta: "Google மதிப்புரைகள் மற்றும் சென்னை குடும்பங்களின் வீடியோ அனுபவங்கள்.",
  },
  cta: { en: "Read all reviews", ta: "அனைத்து மதிப்புரைகளும்" },
  sample: { en: "Sample", ta: "மாதிரி" },
  placeholderQuote: {
    en: "A verified Google review from one of our customers will appear here.",
    ta: "எங்கள் வாடிக்கையாளரின் சரிபார்க்கப்பட்ட Google மதிப்புரை இங்கே தோன்றும்.",
  },
  source: { en: "Google review", ta: "Google மதிப்புரை" },
  videoTitle: { en: "Customer stories", ta: "வாடிக்கையாளர் அனுபவங்கள்" },
  videoBody: { en: "Short videos from homes we've installed in", ta: "நாங்கள் நிறுவிய வீடுகளிலிருந்து வீடியோக்கள்" },
} satisfies Record<string, Localized>;

/** Tiny, quiet marker for placeholder content (never presented as a real review). */
function SampleTag({ label, onDark = false }: { label: string; onDark?: boolean }) {
  return (
    <span
      className={
        onDark
          ? "text-[0.625rem] font-medium tracking-[0.16em] text-white/55 uppercase"
          : "text-[0.625rem] font-medium tracking-[0.16em] text-neutral-400 uppercase"
      }
    >
      {label}
    </span>
  );
}

/**
 * Reviews in the site's editorial style: split serif heading, quiet white cards, dark video card.
 * Until real Google reviews are connected the cards show a neutral placeholder line, marked "Sample".
 */
export function ReviewsWall({ locale }: { locale: Locale }) {
  return (
    <section className="bg-cream">
      <div className="container-wide section-y">
        <Reveal>
          <div className="mb-12 grid gap-6 lg:grid-cols-2 lg:items-end">
            <h2 className="text-display-2 text-neutral-950">
              {loc(copy.lead, locale)}
              <br />
              <span className="accent-serif text-accent-600">{loc(copy.accent, locale)}</span>
            </h2>
            <div className="max-w-md lg:justify-self-end">
              <p className="text-sm leading-relaxed text-neutral-600">{loc(copy.body, locale)}</p>
              <Link
                href="/reviews"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent-700 underline-offset-4 hover:underline"
              >
                {loc(copy.cta, locale)}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.15fr]">
            {sampleReviews.map((review) => (
              <figure key={review.id} className="flex min-h-[18rem] flex-col rounded-2xl bg-white p-7">
                <div className="flex items-center justify-between">
                  <Rating value={review.rating} />
                  <SampleTag label={loc(copy.sample, locale)} />
                </div>
                <span aria-hidden className="accent-serif mt-6 text-6xl leading-[0.5] text-brand-300">
                  &ldquo;
                </span>
                <blockquote className="mt-2 text-[0.9375rem] leading-relaxed text-neutral-500 italic">
                  {loc(copy.placeholderQuote, locale)}
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3 border-t border-neutral-100 pt-5">
                  <span
                    aria-hidden
                    className="inline-flex size-9 items-center justify-center rounded-full bg-cream text-sm font-medium text-neutral-700"
                  >
                    G
                  </span>
                  <span className="text-sm">
                    <span className="block font-medium text-neutral-900">{loc(copy.source, locale)}</span>
                    <span className="block text-neutral-500">{review.locality}</span>
                  </span>
                </figcaption>
              </figure>
            ))}

            <div className="relative min-h-[18rem] overflow-hidden rounded-2xl sm:col-span-2 lg:col-span-1">
              <Photo src={null} alt="" art="ac" tone="dark" artPosition="center" sizes="(min-width: 1024px) 25vw, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
              <div className="absolute top-6 right-6">
                <SampleTag label={loc(copy.sample, locale)} onDark />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex size-16 items-center justify-center rounded-full bg-white/95 text-neutral-900 transition-transform duration-300 hover:scale-105">
                  <Play className="ml-1 size-6 fill-current" aria-hidden />
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <p className="text-lg font-medium">{loc(copy.videoTitle, locale)}</p>
                <p className="mt-1 text-sm text-white/70">{loc(copy.videoBody, locale)}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
