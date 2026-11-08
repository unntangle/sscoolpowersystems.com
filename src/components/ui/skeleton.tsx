import * as React from "react";
import { cn } from "@/lib/utils";

/** Loading placeholder. Give it the final element's size to avoid layout shift (CLS < 0.1). */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div aria-hidden className={cn("animate-pulse rounded-md bg-neutral-200/70", className)} {...props} />;
}
