import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,border-color,color] duration-200 select-none disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Ink pill. */
        primary: "bg-neutral-900 text-white hover:bg-neutral-700",
        /** Logo-blue pill: the main call to action. Flat, no shadow. */
        accent: "bg-accent-600 text-white hover:bg-accent-700",
        /** Outlined pill on light surfaces. */
        secondary: "border border-neutral-900/80 bg-transparent text-neutral-900 hover:bg-neutral-900 hover:text-white",
        /** Outlined logo-blue pill. */
        "accent-outline": "border border-accent-600 bg-transparent text-accent-700 hover:bg-accent-600 hover:text-white",
        ghost: "text-neutral-800 hover:bg-neutral-100",
        link: "h-auto rounded-none px-0 text-accent-700 underline-offset-4 hover:underline",
        whatsapp: "bg-whatsapp-600 text-white hover:bg-whatsapp-700",
        /** White pill on photos and dark sections. */
        light: "bg-white text-neutral-900 hover:bg-accent-50 hover:text-accent-800",
        /** Translucent outlined pill on photos and dark sections. */
        glass: "border border-white/70 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-neutral-900",
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem]",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-7 text-[0.9375rem]",
        icon: "size-11",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /** Render the child element (e.g. a Next <Link>) with button styles. */
  asChild?: boolean;
  /** Shows a spinner, disables the button and sets aria-busy. Ignored when asChild. */
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  type,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild) {
    return (
      <Slot.Slot className={classes} {...props}>
        {children}
      </Slot.Slot>
    );
  }

  return (
    <button
      type={type ?? "button"}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}
