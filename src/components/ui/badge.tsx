import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap [&_svg]:size-3.5",
  {
    variants: {
      tone: {
        neutral: "bg-neutral-100 text-neutral-700",
        brand: "bg-brand-50 text-brand-800",
        accent: "bg-accent-50 text-accent-800",
        success: "bg-success-50 text-success-700",
        danger: "bg-danger-50 text-danger-700",
        warning: "bg-warning-50 text-warning-700",
        outline: "border border-neutral-300 text-neutral-700",
        solid: "bg-neutral-900 text-white",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
