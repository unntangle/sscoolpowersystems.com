"use client";

import * as React from "react";
import { toast } from "@/components/ui/toast";
import type { Cart } from "@/lib/shopify/mappers";
import {
  addToCartAction,
  applyDiscountAction,
  removeCartLineAction,
  updateCartLineAction,
  type CartActionResult,
} from "./actions";

interface CartMessages {
  added: string;
  error: string;
  couponDemo: string;
}

interface CartContextValue {
  cart: Cart | null;
  count: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  pending: boolean;
  add: (variantId: string, quantity?: number) => Promise<void>;
  setQuantity: (lineId: string, quantity: number) => Promise<void>;
  remove: (lineId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<boolean>;
}

const CartContext = React.createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

/** Recalculate totals locally for an optimistic quantity change. */
function withQuantity(cart: Cart, lineId: string, quantity: number): Cart {
  const lines = cart.lines
    .map((l) => (l.id === lineId ? { ...l, quantity, lineTotal: (l.unitPrice ?? 0) * quantity } : l))
    .filter((l) => l.quantity > 0);
  const subtotal = lines.reduce((s, l) => s + (l.lineTotal ?? 0), 0);
  return {
    ...cart,
    lines,
    totalQuantity: lines.reduce((s, l) => s + l.quantity, 0),
    subtotal,
    total: subtotal,
  };
}

export function CartProvider({
  initialCart,
  messages,
  children,
}: {
  initialCart: Cart | null;
  messages: CartMessages;
  children: React.ReactNode;
}) {
  const [cart, setCart] = React.useState<Cart | null>(initialCart);
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  // Server re-render (e.g. language change) brings a fresh cart.
  React.useEffect(() => setCart(initialCart), [initialCart]);

  const run = React.useCallback(
    async (action: () => Promise<CartActionResult>, rollback: Cart | null) => {
      setPending(true);
      try {
        const result = await action();
        setCart(result.cart);
        if (!result.ok) {
          toast.error(result.error === "demo" ? messages.couponDemo : messages.error);
          return false;
        }
        return true;
      } catch {
        setCart(rollback);
        toast.error(messages.error);
        return false;
      } finally {
        setPending(false);
      }
    },
    [messages],
  );

  const value = React.useMemo<CartContextValue>(
    () => ({
      cart,
      count: cart?.totalQuantity ?? 0,
      open,
      setOpen,
      pending,
      add: async (variantId, quantity = 1) => {
        const ok = await run(() => addToCartAction(variantId, quantity), cart);
        if (ok) {
          toast.success(messages.added);
          setOpen(true);
        }
      },
      setQuantity: async (lineId, quantity) => {
        const previous = cart;
        if (cart) setCart(withQuantity(cart, lineId, quantity));
        await run(() => updateCartLineAction(lineId, quantity), previous);
      },
      remove: async (lineId) => {
        const previous = cart;
        if (cart) setCart(withQuantity(cart, lineId, 0));
        await run(() => removeCartLineAction(lineId), previous);
      },
      applyCoupon: (code) => run(() => applyDiscountAction(code), cart),
    }),
    [cart, open, pending, run, messages.added],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
