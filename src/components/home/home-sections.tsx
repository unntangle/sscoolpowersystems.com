import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  FileDown,
  HelpCircle,
  MapPin,
  MessageSquareText,
  PlayCircle,
  ReceiptText,
  RefreshCw,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { Photo } from "@/components/commerce/photo";
import { ProductArt } from "@/components/commerce/product-art";
import { ProductCard } from "@/components/commerce/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { Rating } from "@/components/ui/rating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  brandBanner,
  everyday,
  getStarted,
  installations,
  lifestyleBanners,
  offerCards,
  quickLinks,
  sampleReviews,
  stories,
  valueProps,
} from "@/content/home";
import { loc, type Dictionary, type Locale, type Localized } from "@/i18n";
import { photo } from "@/lib/media";
import type { ProductCard as ProductCardData } from "@/lib/shopify/mappers";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

interface SectionProps {
  locale: Locale;
  t: Dictionary;
}

const labels = {
  bestSellers: { en: "Best sellers", ta: "அதிகம் விற்பவை" },
  explore: { en: "Explore all guides", ta: "அனைத்து வழிகாட்டிகளும்" },
  installs: { en: "Installed by us", ta: "நாங்கள் நிறுவியவை" },
} satisfies Record<string, Localized>;

/** Two-tone headline: sans lead + logo-blue serif-italic accent on the next line. */
function SplitHeading({ lead, accent, className }: { lead: string; accent: string; className?: string }) {
  return (
    <h2 className={cn("text-display-2 text-neutral-950", className)}>
      {lead}
      <br />
      <span className="accent-serif text-accent-600">{accent}</span>
    </h2>
  );
}

/** Centred section title with a short logo-blue rule underneath. */
function CenteredTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-display-3 text-neutral-950">{children}</h2>
      <span aria-hidden className="mt-4 h-1 w-12 rounded-full bg-accent-500" />
    </div>
  );
}

function SampleBadge({ label }: { label: string }) {
  return (
    <Badge tone="warning" className="absolute top-3 right-3 z-10">
      {label}
    </Badge>
  );
}

/** Original decorative motif for offer cards (concentric arcs). */
function OfferMotif() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden className="pointer-events-none absolute -right-10 -bottom-10 size-72 text-white/20">
      {[30, 50, 70, 90].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" />
      ))}
      <circle cx="100" cy="100" r="12" fill="currentColor" />
    </svg>
  );
}

const tabTrigger = "text-sm data-[state=active]:border-accent-600 data-[state=active]:text-accent-700";

// ---------- In the spotlight ----------

export function Spotlight({ locale, t, recommended }: SectionProps & { recommended: ProductCardData[] }) {
  return (
    <section className="section-y">
      <Reveal>
        <CenteredTitle>{t.home.spotlight}</CenteredTitle>
        <Tabs defaultValue="offers" className="mt-6">
          <TabsList aria-label={t.home.spotlight} className="mx-auto w-fit justify-center border-b-0">
            <TabsTrigger value="offers" className={tabTrigger}>
              {t.home.tabOffers}
            </TabsTrigger>
            <TabsTrigger value="recommended" className={tabTrigger}>
              {t.home.tabRecommended}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="offers" className="pt-8">
            <div className="container-wide">
              <Carousel label={t.home.tabOffers} slideClassName="basis-[88%] sm:basis-[62%] lg:basis-[44%]">
                {offerCards.map((offer) => {
                  const src = photo(offer.image);
                  return (
                    <article
                      key={offer.id}
                      className="relative flex aspect-[4/3] flex-col overflow-hidden rounded-banner bg-sand p-7 text-neutral-950 sm:aspect-[16/11] sm:p-10"
                    >
                      <OfferMotif />
                      <p className="relative inline-flex w-fit items-center gap-2 font-display text-xl font-semibold tracking-tight uppercase sm:text-2xl">
                        <span aria-hidden className="h-6 w-1 rounded-full bg-accent-600" />
                        {loc(offer.label, locale)}
                      </p>
                      <p className="relative mt-2 max-w-[16rem] text-sm text-neutral-800">{loc(offer.promise, locale)}</p>
                      <div className="relative mt-6">
                        <Button asChild variant="accent" size="sm">
                          <Link href={offer.cta.href}>
                            {loc(offer.cta.label, locale)}
                            <ArrowRight aria-hidden />
                          </Link>
                        </Button>
                      </div>
                      <div className="absolute right-6 bottom-6 h-[48%] w-[42%] text-neutral-900 sm:right-10 sm:bottom-8">
                        {src ? (
                          <Image src={src} alt="" fill sizes="(min-width: 1024px) 20vw, 40vw" className="object-contain object-bottom" />
                        ) : (
                          <ProductArt kind={offer.art} className="[&_*]:[fill-opacity:0.35]" />
                        )}
                      </div>
                    </article>
                  );
                })}
              </Carousel>
            </div>
          </TabsContent>

          <TabsContent value="recommended" className="pt-8">
            <div className="container-wide grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
              {recommended.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} t={t} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Reveal>
    </section>
  );
}

// ---------- Full-bleed lifestyle banners ----------

export function LifestyleBanners({ locale, t }: SectionProps) {
  return (
    <section className="grid gap-4" aria-label={t.header.shopBy}>
      {lifestyleBanners.map((banner, i) => {
        const darkText = banner.tone === "light" || banner.tone === "sand";
        return (
          <Reveal key={banner.id}>
            <article className="relative h-[30rem] overflow-hidden sm:h-[36rem] lg:h-[44rem]">
              <Photo
                src={photo(banner.image)}
                alt=""
                art={banner.art}
                tone={banner.tone}
                artPosition={i % 2 === 0 ? "right" : "center"}
                sizes="100vw"
              />
              <div
                className={cn(
                  "absolute inset-0",
                  darkText ? "bg-gradient-to-r from-white/50 via-white/10 to-transparent" : "bg-gradient-to-r from-black/40 via-black/10 to-transparent",
                )}
              />
              <div className="container-wide relative flex h-full flex-col justify-end pb-12 sm:pb-16 lg:justify-center lg:pb-0">
                <p
                  className={cn(
                    "inline-flex w-fit items-center gap-2 text-sm font-medium",
                    darkText ? "text-accent-700" : "text-accent-200",
                  )}
                >
                  <span aria-hidden className={cn("size-2 rounded-full", darkText ? "bg-accent-600" : "bg-accent-300")} />
                  {loc(banner.label, locale)}
                </p>
                <h2 className={cn("mt-2 text-display-2 whitespace-pre-line", darkText ? "text-neutral-950" : "text-white")}>
                  {loc(banner.title, locale)}
                </h2>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild variant="accent" size="sm">
                    <Link href={banner.shopHref}>
                      {t.home.shop}
                      <ArrowRight aria-hidden />
                    </Link>
                  </Button>
                  <Button asChild variant={darkText ? "secondary" : "glass"} size="sm">
                    <Link href={banner.discoverHref}>{t.home.discover}</Link>
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>
        );
      })}
    </section>
  );
}

// ---------- Best sellers ----------

export function BestSellers({ locale, t, products }: SectionProps & { products: ProductCardData[] }) {
  if (products.length === 0) return null;
  return (
    <section className="container-wide section-y">
      <Reveal>
        <div className="mb-10">
          <CenteredTitle>{loc(labels.bestSellers, locale)}</CenteredTitle>
        </div>
        <Carousel label={loc(labels.bestSellers, locale)} slideClassName="basis-[72%] sm:basis-[42%] lg:basis-[24%]">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} t={t} />
          ))}
        </Carousel>
      </Reveal>
    </section>
  );
}

// ---------- Real installations ----------

export function RealInstallations({ locale, t }: SectionProps) {
  return (
    <section className="container-wide section-y pt-0">
      <Reveal>
        <div className="mb-10 grid gap-4 lg:grid-cols-2 lg:items-end">
          <SplitHeading lead={t.home.installationsTitle} accent={loc(labels.installs, locale)} />
          <p className="max-w-md text-sm text-neutral-600 lg:justify-self-end">{t.home.installationsSubtitle}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {installations.map((item) => (
            <article key={item.id} className="group relative aspect-[3/4] overflow-hidden rounded-2xl">
              {item.sample ? <SampleBadge label={t.common.sample} /> : null}
              <Photo
                src={photo(item.image)}
                alt={`${item.product.title} installed in ${item.locality}`}
                art={item.art}
                tone="sand"
                artPosition="center"
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent-900/80 via-black/0 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  <MapPin className="size-4 text-accent-300" aria-hidden />
                  {item.locality}
                </p>
                <p className="mt-1 text-xs text-white/80">{loc(item.note, locale)}</p>
                <Link
                  href={`/products/${item.product.handle}`}
                  className="mt-2 line-clamp-1 text-xs font-medium underline-offset-4 after:absolute after:inset-0 group-hover:underline"
                >
                  {item.product.title}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

// ---------- Everyday, made easier ----------

export function Everyday({ locale, t }: SectionProps) {
  return (
    <section>
      <div className="container-wide section-y pb-12">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <SplitHeading lead={loc(everyday.lead, locale)} accent={loc(everyday.accent, locale)} />
            <p className="max-w-md text-sm text-neutral-600 lg:justify-self-end">{loc(everyday.body, locale)}</p>
          </div>
        </Reveal>
      </div>

      <div className="relative h-[24rem] overflow-hidden sm:h-[32rem] lg:h-[40rem]">
        <Photo src={photo(everyday.feature.image)} alt="" art={everyday.feature.art} tone="light" artPosition="center" sizes="100vw" />
      </div>

      <div className="bg-gradient-to-b from-ink to-accent-900 py-16 text-white lg:py-20">
        <div className="container-wide">
          <Carousel label={t.home.guidesTitle} slideClassName="basis-[78%] sm:basis-[46%] lg:basis-[31%]">
            {stories.map((story) => (
              <article key={story.slug} className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Photo src={photo(story.image)} alt="" art={story.art} tone="dark" artPosition="center" sizes="(min-width: 1024px) 31vw, 78vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="inline-flex rounded-full bg-accent-600 px-2.5 py-0.5 text-[0.6875rem] font-medium text-white">
                    {loc(story.tag, locale)}
                  </p>
                  <h3 className="mt-2 text-xl leading-snug font-medium">
                    <Link href={`/guides/${story.slug}`} className="after:absolute after:inset-0 group-hover:underline">
                      {loc(story.title, locale)}
                    </Link>
                  </h3>
                </div>
              </article>
            ))}
          </Carousel>
          <div className="mt-8 flex justify-center">
            <Button asChild variant="light" size="sm">
              <Link href="/guides">
                {loc(labels.explore, locale)}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Brand banner ----------

export function BrandBanner({ locale }: { locale: Locale }) {
  return (
    <section className="container-wide section-y">
      <Reveal>
        <div className="relative h-[26rem] overflow-hidden rounded-banner sm:h-[32rem]">
          <Photo src={photo(brandBanner.image)} alt="" art={brandBanner.art} tone="dark" artPosition="right" sizes="(min-width: 1600px) 1600px, 100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-accent-900/80 via-black/25 to-transparent" />
          <div className="relative flex h-full flex-col justify-end p-8 text-white sm:p-12">
            <h2 className="text-display-3 whitespace-pre-line">{loc(brandBanner.title, locale)}</h2>
            <div className="mt-6">
              <Button asChild variant="accent" size="sm">
                <Link href="/about">
                  {loc(brandBanner.cta, locale)}
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ---------- Value props ----------

const valueIcons: Record<(typeof valueProps)[number]["icon"], LucideIcon> = {
  truck: Truck,
  card: CreditCard,
  exchange: RefreshCw,
};

export function ValueProps({ locale, t }: SectionProps) {
  return (
    <section aria-label={t.home.valueTitle} className="container-wide pb-16">
      <div className="grid gap-8 border-y border-neutral-200 py-10 md:grid-cols-3">
        {valueProps.map((v) => {
          const Icon = valueIcons[v.icon];
          return (
            <div key={v.id} className="flex items-start gap-4">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-neutral-950">{loc(v.title, locale)}</h3>
                <p className="mt-1 text-xs leading-relaxed text-neutral-600">{loc(v.body, locale)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---------- Reviews ----------

export function ReviewsWall({ locale, t }: SectionProps) {
  return (
    <section className="bg-cream">
      <div className="container-wide section-y">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-display-3 text-neutral-950">{t.home.reviewsTitle}</h2>
              <p className="mt-2 text-sm text-neutral-600">{t.home.reviewsSubtitle}</p>
            </div>
            <Button asChild variant="accent-outline" size="sm">
              <Link href="/reviews">{t.home.reviewsCta}</Link>
            </Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {sampleReviews.map((review) => (
              <figure key={review.id} className="relative flex flex-col rounded-2xl border-t-4 border-accent-500 bg-white p-6">
                <SampleBadge label={t.common.sample} />
                <Rating value={review.rating} />
                <blockquote className="mt-4 flex-1 text-sm text-neutral-700">{loc(review.text, locale)}</blockquote>
                <figcaption className="mt-4 text-sm font-medium text-neutral-900">
                  {review.name}
                  <span className="font-normal text-neutral-500"> · {review.locality}</span>
                </figcaption>
              </figure>
            ))}
            <div className="relative flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-accent-700 to-accent-900 p-6 text-center text-white">
              <SampleBadge label={t.common.sample} />
              <PlayCircle className="size-12 text-white/85" aria-hidden />
              <p className="font-display text-lg">{t.home.videoStory}</p>
              <p lang="ta" className="text-sm text-white/75">
                தமிழ் வீடியோ
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- Get started (last section before the footer: shorter bottom padding) ----------

const quickIcons: Record<(typeof quickLinks)[number]["icon"], LucideIcon> = {
  passport: ReceiptText,
  manual: FileDown,
  contact: MessageSquareText,
  faq: HelpCircle,
};

export function GetStarted({ locale }: { locale: Locale }) {
  return (
    <section className="container-wide pt-[var(--ss-section-y)] pb-14 lg:pb-20">
      <Reveal>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SplitHeading lead={loc(getStarted.lead, locale)} accent={loc(getStarted.accent, locale)} />
          <div className="grid gap-10 sm:grid-cols-2">
            {quickLinks.map((q) => {
              const Icon = quickIcons[q.icon];
              return (
                <div key={q.id} className="flex gap-4">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-xs font-semibold tracking-[0.12em] text-neutral-950 uppercase">{loc(q.title, locale)}</h3>
                    <p className="mt-2 text-sm text-neutral-600">{loc(q.body, locale)}</p>
                    <Link
                      href={q.href}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent-700 underline-offset-4 hover:underline"
                    >
                      {loc(q.cta, locale)}
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
