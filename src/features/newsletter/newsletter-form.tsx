"use client";

import * as React from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import type { Dictionary } from "@/i18n";
import { cn } from "@/lib/utils";
import { subscribeAction } from "./actions";

/** Underlined email field with an arrow submit. `tone="dark"` for the footer. */
export function NewsletterForm({ t, tone = "light" }: { t: Dictionary["footer"]; tone?: "light" | "dark" }) {
  const [email, setEmail] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "done" | "error">("idle");
  const [pending, startTransition] = React.useTransition();
  const id = React.useId();
  const dark = tone === "dark";

  if (status === "done") {
    return (
      <p role="status" className={cn("text-sm font-medium", dark ? "text-white" : "text-success-700")}>
        {t.subscribed}
      </p>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const result = await subscribeAction({ email, company });
          setStatus(result.ok ? "done" : "error");
        });
      }}
    >
      <label htmlFor={`${id}-email`} className="sr-only">
        {t.newsletterLabel}
      </label>
      <div
        className={cn(
          "flex items-center gap-3 border-b pb-2 transition-colors",
          dark ? "border-white/30 focus-within:border-white" : "border-neutral-300 focus-within:border-neutral-900",
        )}
      >
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          placeholder={t.newsletterPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={status === "error" || undefined}
          aria-describedby={status === "error" ? `${id}-error` : undefined}
          className={cn(
            "h-11 min-w-0 flex-1 bg-transparent text-sm outline-none",
            dark ? "text-white placeholder:text-white/50" : "text-neutral-900 placeholder:text-neutral-400",
          )}
        />
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-colors",
            dark ? "text-white hover:bg-white/10" : "text-neutral-900 hover:bg-neutral-100",
          )}
        >
          {pending ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <ArrowRight className="size-5" aria-hidden />}
          <span className="sr-only">{t.subscribe}</span>
        </button>
      </div>
      {/* Honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      {status === "error" ? (
        <p id={`${id}-error`} role="alert" className={cn("mt-2 text-xs font-medium", dark ? "text-[#f3b4a9]" : "text-danger-700")}>
          {t.invalidEmail}
        </p>
      ) : null}
    </form>
  );
}
