import { clientEnv } from "@/env";

/**
 * WhatsApp number used when NEXT_PUBLIC_WHATSAPP_NUMBER is not set: the store hotline (+91 96011 11070).
 * ASSUMPTION: this number is on WhatsApp Business. Set NEXT_PUBLIC_WHATSAPP_NUMBER if a different one is used.
 */
const FALLBACK_NUMBER = "919601111070";

export function whatsappNumber(): string {
  return clientEnv.NEXT_PUBLIC_WHATSAPP_NUMBER ?? FALLBACK_NUMBER;
}

/** wa.me deep link with a prefilled message. Works on mobile (app) and desktop (WhatsApp Web). */
export function whatsappLink(message: string): string {
  return `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(message)}`;
}

/** tel: link from a display number like "+91 96011 11070". */
export function telLink(display: string): string {
  return `tel:${display.replace(/[^\d+]/g, "")}`;
}
