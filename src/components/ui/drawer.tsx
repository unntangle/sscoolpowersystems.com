"use client";

import * as React from "react";
import { Dialog, VisuallyHidden } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Slide-over panel (cart drawer, mobile menu, filter bottom sheet). Same a11y guarantees as Modal. */
export const Drawer = Dialog.Root;
export const DrawerTrigger = Dialog.Trigger;
export const DrawerClose = Dialog.Close;

const sides = {
  right:
    "inset-y-0 right-0 h-dvh w-full max-w-md data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
  left: "inset-y-0 left-0 h-dvh w-full max-w-md data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
  bottom:
    "inset-x-0 bottom-0 max-h-[90dvh] w-full rounded-t-2xl data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
  full: "inset-0 h-dvh w-full data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
} as const;

export type DrawerContentProps = Omit<React.ComponentProps<typeof Dialog.Content>, "title"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  hideTitle?: boolean;
  side?: keyof typeof sides;
  /** Sticky footer (e.g. subtotal + checkout buttons). */
  footer?: React.ReactNode;
  /** Optional element rendered before the title (e.g. a back arrow in the mobile menu). */
  headerStart?: React.ReactNode;
  closeLabel?: string;
};

export function DrawerContent({
  title,
  description,
  hideTitle = false,
  side = "right",
  footer,
  headerStart,
  closeLabel = "Close",
  className,
  children,
  ...props
}: DrawerContentProps) {
  const titleNode = (
    <Dialog.Title className="font-display text-lg font-semibold text-neutral-900">{title}</Dialog.Title>
  );

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-950/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <Dialog.Content
        {...(description ? {} : { "aria-describedby": undefined })}
        className={cn(
          "fixed z-50 flex flex-col bg-white shadow-overlay duration-300 ease-out-soft data-[state=closed]:animate-out data-[state=open]:animate-in",
          sides[side],
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-3 border-b border-neutral-200 px-5 py-4">
          {headerStart}
          <div className="min-w-0 flex-1">
            {hideTitle ? <VisuallyHidden.Root>{titleNode}</VisuallyHidden.Root> : titleNode}
            {description ? (
              <Dialog.Description className="mt-0.5 text-sm text-neutral-600">{description}</Dialog.Description>
            ) : null}
          </div>
          <Dialog.Close className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900">
            <X className="size-5" aria-hidden />
            <span className="sr-only">{closeLabel}</span>
          </Dialog.Close>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
        {footer ? (
          <div className="border-t border-neutral-200 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        ) : null}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
