"use client";

import * as React from "react";
import { Search, ShoppingBag, UserRound } from "lucide-react";
import { LoginModal } from "@/features/auth/login-modal";
import { useCart } from "@/features/cart/cart-context";
import { SearchOverlay } from "@/features/search/search-overlay";
import { fmt, type Dictionary } from "@/i18n";
import type { ProductCard } from "@/lib/shopify/mappers";

interface HeaderActionsProps {
  t: Pick<Dictionary, "header" | "search" | "product" | "login">;
  popular: ProductCard[];
  discover: string[];
}

const iconButton =
  "relative inline-flex size-11 items-center justify-center rounded-full text-neutral-900 transition-colors hover:bg-neutral-100";

export function HeaderActions({ t, popular, discover }: HeaderActionsProps) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const { count, setOpen: setCartOpen } = useCart();

  // "/" opens search from anywhere (except when typing in a field).
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target?.closest("input, textarea, select, [contenteditable=true]");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      <button type="button" className={iconButton} onClick={() => setSearchOpen(true)}>
        <Search className="size-[1.375rem]" aria-hidden />
        <span className="sr-only">{t.header.search}</span>
      </button>
      <button type="button" className={iconButton} onClick={() => setLoginOpen(true)}>
        <UserRound className="size-[1.375rem]" aria-hidden />
        <span className="sr-only">{t.header.account}</span>
      </button>
      <button type="button" className={iconButton} onClick={() => setCartOpen(true)}>
        <ShoppingBag className="size-[1.375rem]" aria-hidden />
        <span className="sr-only">{fmt(t.header.cartWithCount, { count })}</span>
        {count > 0 ? (
          <span
            aria-hidden
            className="absolute top-1 right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[0.6875rem] leading-5 font-bold text-white"
          >
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </button>

      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} popular={popular} discover={discover} t={t} />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} t={t.login} />
    </div>
  );
}
