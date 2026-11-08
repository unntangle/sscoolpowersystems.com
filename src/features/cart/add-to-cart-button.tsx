"use client";

import * as React from "react";
import { ShoppingCart } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useCart } from "./cart-context";

interface AddToCartButtonProps extends Omit<ButtonProps, "onClick"> {
  variantId: string;
  quantity?: number;
  label: string;
}

export function AddToCartButton({ variantId, quantity = 1, label, ...props }: AddToCartButtonProps) {
  const { add } = useCart();
  const [busy, setBusy] = React.useState(false);

  return (
    <Button
      {...props}
      loading={busy}
      onClick={async () => {
        setBusy(true);
        await add(variantId, quantity);
        setBusy(false);
      }}
    >
      {busy ? null : <ShoppingCart aria-hidden />}
      {label}
    </Button>
  );
}
