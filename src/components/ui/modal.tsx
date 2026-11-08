"use client";

import * as React from "react";
import { Dialog, VisuallyHidden } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Centered dialog. Radix handles focus trapping, Escape, scroll lock and focus return. */
export const Modal = Dialog.Root;
export const ModalTrigger = Dialog.Trigger;
export const ModalClose = Dialog.Close;

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
} as const;

export type ModalContentProps = Omit<React.ComponentProps<typeof Dialog.Content>, "title"> & {
  /** Required for screen readers. Use hideTitle to keep it visually hidden. */
  title: React.ReactNode;
  description?: React.ReactNode;
  hideTitle?: boolean;
  size?: keyof typeof sizes;
  closeLabel?: string;
};

export function ModalContent({
  title,
  description,
  hideTitle = false,
  size = "md",
  closeLabel = "Close",
  className,
  children,
  ...props
}: ModalContentProps) {
  const titleNode = (
    <Dialog.Title className="font-display text-xl font-semibold text-neutral-900">{title}</Dialog.Title>
  );

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-950/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <Dialog.Content
        {...(description ? {} : { "aria-describedby": undefined })}
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-5 overflow-y-auto rounded-xl bg-white p-6 shadow-overlay sm:p-8",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          sizes[size],
          className,
        )}
        {...props}
      >
        <div className="pr-8">
          {hideTitle ? <VisuallyHidden.Root>{titleNode}</VisuallyHidden.Root> : titleNode}
          {description ? (
            <Dialog.Description className="mt-1.5 text-sm text-neutral-600">{description}</Dialog.Description>
          ) : null}
        </div>
        {children}
        <Dialog.Close className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900">
          <X className="size-5" aria-hidden />
          <span className="sr-only">{closeLabel}</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
