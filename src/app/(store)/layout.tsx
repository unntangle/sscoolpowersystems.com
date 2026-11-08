import { CartDrawer } from "@/components/layout/cart-drawer";
import { FloatingContact } from "@/components/layout/floating-contact";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { UtilityBar } from "@/components/layout/utility-bar";
import { site } from "@/config/site";
import { CartProvider } from "@/features/cart/cart-context";
import { readCart } from "@/features/cart/server";
import { getPincode } from "@/features/pincode/server";
import { getI18n } from "@/i18n/server";
import { getPairedProducts, getPopularProducts } from "@/lib/catalog";

const announcement = {
  en: `Shop with confidence: hassle-free ${site.promises.returnDays}-day returns on every order.`,
  ta: `நம்பிக்கையுடன் வாங்குங்கள்: ஒவ்வொரு ஆர்டருக்கும் ${site.promises.returnDays} நாள் எளிய ரிட்டர்ன்.`,
};

/** Storefront shell: announcement, utility bar, header, cart drawer, footer and floating contact. */
export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const { locale, t } = await getI18n();
  const [pincode, cart, popular, paired] = await Promise.all([
    getPincode(),
    readCart(locale),
    getPopularProducts(locale, 6),
    getPairedProducts(locale, 8),
  ]);

  return (
    <div lang={locale} className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-white px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {t.header.skipToContent}
      </a>

      <p className="bg-ink px-4 py-2 text-center text-xs text-white/85">{announcement[locale]}</p>

      <CartProvider
        initialCart={cart}
        messages={{ added: t.cart.added, error: t.cart.error, couponDemo: t.cart.couponDemo }}
      >
        <UtilityBar locale={locale} pincode={pincode} t={t} />
        <Header locale={locale} t={t} popular={popular} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} t={t} />
        <CartDrawer t={t} paired={paired} />
        <FloatingContact t={{ chat: t.whatsapp.chat, callExpert: t.utility.callExpert, message: t.whatsapp.general }} />
      </CartProvider>
    </div>
  );
}
