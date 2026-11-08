"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const KEY = "ss_wishlist";
const EVENT = "ss-wishlist-change";

function read(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

/** Heart toggle saved in localStorage (synced to the customer account in a later phase). */
export function WishlistButton({ handle, label, className }: { handle: string; label: string; className?: string }) {
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    const sync = () => setSaved(read().includes(handle));
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, [handle]);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={label}
      onClick={() => {
        const list = read();
        const next = list.includes(handle) ? list.filter((h) => h !== handle) : [...list, handle];
        try {
          localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
          // ignore storage errors
        }
        window.dispatchEvent(new Event(EVENT));
      }}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:text-neutral-900",
        className,
      )}
    >
      <Heart className={cn("size-[1.125rem]", saved && "fill-danger-600 text-danger-600")} aria-hidden />
    </button>
  );
}
