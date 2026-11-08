import { Headset, MessageCircle } from "lucide-react";
import { site } from "@/config/site";
import { telLink, whatsappLink } from "@/lib/whatsapp/links";

interface FloatingContactProps {
  t: { chat: string; callExpert: string; message: string };
}

/**
 * Persistent WhatsApp button (all pages) + sticky "Call an Expert" bar on mobile.
 * The mobile bar reserves space via the footer's bottom padding so nothing is hidden behind it.
 */
export function FloatingContact({ t }: FloatingContactProps) {
  const wa = whatsappLink(t.message);

  return (
    <>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-4 bottom-20 z-30 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp-600 text-white shadow-raised transition-transform hover:scale-105 hover:bg-whatsapp-700 lg:right-6 lg:bottom-6"
      >
        <MessageCircle className="size-7" aria-hidden />
        <span className="sr-only">{t.chat}</span>
      </a>

      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-neutral-200 bg-white/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <a
          href={telLink(site.phones.sales)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-semibold text-white"
        >
          <Headset className="size-5" aria-hidden />
          {t.callExpert}
        </a>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-whatsapp-600 text-sm font-semibold text-white"
        >
          <MessageCircle className="size-5" aria-hidden />
          WhatsApp
        </a>
      </div>
    </>
  );
}
