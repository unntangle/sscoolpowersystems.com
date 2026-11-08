"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface PromptSearchProps {
  title: string;
  examples: string[];
  submitLabel: string;
  finderLabel: string;
}

/** "Tell us what you are looking for?" — big statement left, search field with rotating examples right. */
export function PromptSearch({ title, examples, submitLabel, finderLabel }: PromptSearchProps) {
  const [i, setI] = React.useState(0);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (value || examples.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setI((n) => (n + 1) % examples.length), 2800);
    return () => window.clearInterval(timer);
  }, [value, examples.length]);

  return (
    <section className="container-site section-y pt-6">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <h2 className="text-display-3 text-neutral-950">
          <label htmlFor="prompt-search">{title}</label>
        </h2>
        <div>
          <form
            action="/search"
            role="search"
            className="flex items-center gap-3 border-b-2 border-neutral-300 pb-3 transition-colors focus-within:border-accent-600"
          >
            <input
              id="prompt-search"
              name="q"
              required
              minLength={2}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={examples[i] ?? ""}
              autoComplete="off"
              className="h-12 min-w-0 flex-1 bg-transparent text-lg text-neutral-900 outline-none placeholder:text-neutral-400"
            />
            <button
              type="submit"
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-600 text-white transition-colors hover:bg-accent-700"
            >
              <ArrowRight className="size-5" aria-hidden />
              <span className="sr-only">{submitLabel}</span>
            </button>
          </form>
          <Link
            href="/finder"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-700 underline-offset-4 hover:underline"
          >
            <Sparkles className="size-4" aria-hidden />
            {finderLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
