import { BrandStrip } from "@/components/home/brand-strip";
import { CategoryStrip } from "@/components/home/category-strip";
import { Hero, type ResolvedSlide } from "@/components/home/hero";
import {
  BestSellers,
  BrandBanner,
  Everyday,
  GetStarted,
  LifestyleBanners,
  RealInstallations,
  Spotlight,
  ValueProps,
} from "@/components/home/home-sections";
import { PromptSearch } from "@/components/home/prompt-search";
import { ReviewsWall } from "@/components/home/reviews-wall";
import { categories } from "@/config/navigation";
import { bestSellerHandles, heroSlides, promptExamples } from "@/content/home";
import { loc, type Locale } from "@/i18n";
import { getI18n } from "@/i18n/server";
import { getCollection, getPopularProducts, getProductsByHandles } from "@/lib/catalog";
import { photo } from "@/lib/media";

const brandsTitle = { en: "Authorised dealer for", ta: "அங்கீகரிக்கப்பட்ட டீலர்" };

/** Product count per category tile; null hides the count if the collection can't be loaded. */
async function categoryCounts(locale: Locale): Promise<Record<string, number | null>> {
  const entries = await Promise.all(
    categories.map(async (c): Promise<[string, number | null]> => {
      try {
        const collection = await getCollection(c.handle, locale);
        return [c.handle, collection ? collection.products.length : null];
      } catch {
        return [c.handle, null];
      }
    }),
  );
  return Object.fromEntries(entries);
}

export default async function HomePage() {
  const { locale, t } = await getI18n();
  const [recommended, bestSellers, counts] = await Promise.all([
    getPopularProducts(locale, 4),
    getProductsByHandles(bestSellerHandles, locale),
    categoryCounts(locale),
  ]);

  const slides: ResolvedSlide[] = heroSlides.map((s) => ({
    id: s.id,
    eyebrow: loc(s.eyebrow, locale),
    title: loc(s.title, locale),
    body: loc(s.body, locale),
    ctaLabel: loc(s.cta.label, locale),
    ctaHref: s.cta.href,
    art: s.art,
    image: photo(s.image),
  }));

  return (
    <>
      <Hero slides={slides} t={t.home} />
      <CategoryStrip locale={locale} label={t.header.shopBy} counts={counts} />
      <PromptSearch
        title={t.home.heroPrompt}
        examples={promptExamples.map((e) => loc(e, locale))}
        submitLabel={t.search.label}
        finderLabel={t.home.heroFinder}
      />
      <BrandStrip title={loc(brandsTitle, locale)} />
      <Spotlight locale={locale} t={t} recommended={recommended} />
      <LifestyleBanners locale={locale} t={t} />
      <BestSellers locale={locale} t={t} products={bestSellers} />
      <RealInstallations locale={locale} t={t} />
      <Everyday locale={locale} t={t} />
      <BrandBanner locale={locale} />
      <ValueProps locale={locale} t={t} />
      <ReviewsWall locale={locale} />
      <GetStarted locale={locale} />
    </>
  );
}
