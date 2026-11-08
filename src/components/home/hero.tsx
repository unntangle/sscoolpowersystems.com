"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Photo } from "@/components/commerce/photo";
import type { ArtKind } from "@/components/commerce/product-art";
import { Button } from "@/components/ui/button";
import { fmt, type Dictionary } from "@/i18n";
import { cn } from "@/lib/utils";

export interface ResolvedSlide {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  art: ArtKind;
  image: string | null;
}

const INTERVAL = 7000;

/**
 * Rounded, inset hero carousel with crossfade. Neutral white-on-photo styling (no brand accent here,
 * so it sits naturally on any photography). Pauses on hover/focus; no autoplay for reduced motion.
 */
export function Hero({ slides, t }: { slides: ResolvedSlide[]; t: Dictionary["home"] }) {
  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  const [paused, setPaused] = React.useState(false);
  const count = slides.length;

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  React.useEffect(() => {
    if (!playing || paused || count < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => window.clearInterval(timer);
  }, [playing, paused, count]);

  const go = (i: number) => setIndex((i + count) % count);

  return (
    <section className="container-wide pt-4 lg:pt-6">
      <div
        aria-roledescription="carousel"
        aria-label="Highlights"
        className="relative h-[34rem] overflow-hidden rounded-banner bg-[#6f5c4b] sm:h-[36rem] lg:h-[40rem]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {slides.map((slide, i) => {
          const active = i === index;
          const Heading = i === 0 ? "h1" : "h2";
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${count}`}
              aria-hidden={!active}
              inert={!active}
              className={cn("absolute inset-0 transition-opacity duration-1000", active ? "opacity-100" : "opacity-0")}
            >
              <Photo
                src={slide.image}
                alt=""
                art={slide.art}
                tone="warm"
                sizes="(min-width: 1600px) 1600px, 100vw"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
              <div className="relative flex h-full max-w-2xl flex-col justify-center px-7 pb-16 text-white sm:px-12 lg:px-16">
                <p className="text-xs font-medium tracking-[0.18em] text-white/85 uppercase">{slide.eyebrow}</p>
                <Heading className="mt-4 text-display-2 whitespace-pre-line">{slide.title}</Heading>
                <p className="mt-4 max-w-md text-base text-white/85">{slide.body}</p>
                <div className="mt-8">
                  <Button asChild variant="glass">
                    <Link href={slide.ctaHref}>
                      {slide.ctaLabel}
                      <ArrowRight aria-hidden />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {count > 1 ? (
          <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="inline-flex size-9 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white"
            >
              <ChevronLeft className="size-5" aria-hidden />
              <span className="sr-only">{t.previous}</span>
            </button>
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                aria-current={i === index}
                className="inline-flex h-6 items-center"
              >
                <span
                  className={cn(
                    "block h-[3px] rounded-full transition-all duration-500",
                    i === index ? "w-8 bg-white" : "w-4 bg-white/45",
                  )}
                />
                <span className="sr-only">{fmt(t.goTo, { n: i + 1 })}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="inline-flex size-9 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white"
            >
              <ChevronRight className="size-5" aria-hidden />
              <span className="sr-only">{t.next}</span>
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="ml-1 inline-flex size-9 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white"
            >
              {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
              <span className="sr-only">{playing ? t.pause : t.play}</span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
