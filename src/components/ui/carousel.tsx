"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type EmblaOptions = NonNullable<Parameters<typeof useEmblaCarousel>[0]>;

export interface CarouselProps {
  /** Accessible name, e.g. "Frequently paired products". */
  label: string;
  children: React.ReactNode;
  options?: EmblaOptions;
  /** Width of each slide. Default: peek on mobile, 2 / 4 per view on larger screens. */
  slideClassName?: string;
  className?: string;
  controls?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  slideLabel?: (index: number, total: number) => string;
}

export function Carousel({
  label,
  children,
  options,
  slideClassName = "basis-[85%] sm:basis-1/2 lg:basis-1/4",
  className,
  controls = true,
  prevLabel = "Previous",
  nextLabel = "Next",
  slideLabel = (i, total) => `${i + 1} of ${total}`,
}: CarouselProps) {
  const [viewportRef, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", ...options });
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;
    const update = () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    update();
    api.on("select", update).on("reInit", update);
    return () => {
      api.off("select", update).off("reInit", update);
    };
  }, [api]);

  const slides = React.Children.toArray(children);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className={cn("relative", className)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") api?.scrollPrev();
        if (e.key === "ArrowRight") api?.scrollNext();
      }}
    >
      <div ref={viewportRef} className="overflow-hidden">
        <div className="-ml-4 flex touch-pan-y">
          {slides.map((slide, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={slideLabel(i, slides.length)}
              className={cn("min-w-0 shrink-0 grow-0 pl-4", slideClassName)}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {controls && (canPrev || canNext) ? (
        <div className="mt-4 flex justify-end gap-2">
          <CarouselButton label={prevLabel} disabled={!canPrev} onClick={() => api?.scrollPrev()}>
            <ChevronLeft aria-hidden />
          </CarouselButton>
          <CarouselButton label={nextLabel} disabled={!canNext} onClick={() => api?.scrollNext()}>
            <ChevronRight aria-hidden />
          </CarouselButton>
        </div>
      ) : null}
    </section>
  );
}

function CarouselButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 transition-colors hover:border-neutral-900 disabled:opacity-40 [&_svg]:size-5"
    >
      {children}
    </button>
  );
}
