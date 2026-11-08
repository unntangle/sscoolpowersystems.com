import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/** Official SS Cool Power Systems logo (public/images/sscool-logo.webp, 1200×255). */
const LOGO = { src: "/images/sscool-logo.webp", width: 1200, height: 255 };

/**
 * Brand logo linking home. `inverted` places it on a white pill for dark backgrounds,
 * so the red and blue artwork is never recoloured.
 */
export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      className={cn("inline-flex shrink-0 items-center", inverted && "rounded-lg bg-white px-3 py-2", className)}
    >
      <Image
        src={LOGO.src}
        alt={site.name}
        width={LOGO.width}
        height={LOGO.height}
        priority={!inverted}
        sizes="(min-width: 1024px) 220px, 170px"
        className={cn("w-auto", inverted ? "h-8" : "h-9 sm:h-10 lg:h-11")}
      />
    </Link>
  );
}
