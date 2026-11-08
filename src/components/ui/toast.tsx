"use client";

import { Toaster as Sonner, toast } from "sonner";

export { toast };

/** Mount once in the root layout. Toasts are announced politely to screen readers. */
export function Toaster() {
  return (
    <Sonner
      position="bottom-center"
      closeButton
      richColors
      offset={{ bottom: "5.5rem" }}
      mobileOffset={{ bottom: "5.5rem" }}
      toastOptions={{
        classNames: {
          toast: "font-sans rounded-lg! shadow-raised!",
          title: "text-sm font-semibold",
          description: "text-sm",
        },
      }}
    />
  );
}
