"use client";

import * as React from "react";
import { setLocaleAction } from "@/i18n/actions";
import type { Locale } from "@/i18n";
import { cn } from "@/lib/utils";

const options: { locale: Locale; label: string }[] = [
  { locale: "en", label: "EN" },
  { locale: "ta", label: "தமிழ்" },
];

/** EN | தமிழ் segmented switch. `tone="dark"` for dark backgrounds. */
export function LanguageSwitcher({
  locale,
  label,
  tone = "light",
  className,
}: {
  locale: Locale;
  label: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const [pending, startTransition] = React.useTransition();

  return (
    <div
      role="group"
      aria-label={label}
      aria-busy={pending}
      className={cn(
        "inline-flex items-center rounded-full p-0.5",
        tone === "light" ? "bg-neutral-100" : "bg-white/10",
        className,
      )}
    >
      {options.map((option) => {
        const active = locale === option.locale;
        return (
          <button
            key={option.locale}
            type="button"
            lang={option.locale}
            aria-pressed={active}
            disabled={pending}
            onClick={() => startTransition(() => setLocaleAction(option.locale))}
            className={cn(
              "min-h-7 rounded-full px-2.5 text-xs transition-colors",
              tone === "light"
                ? active
                  ? "bg-white font-semibold text-neutral-950 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-950"
                : active
                  ? "bg-white font-semibold text-neutral-950"
                  : "text-white/70 hover:text-white",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
