import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, Inter_Tight, Noto_Sans_Tamil } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
import { site } from "@/config/site";
import { clientEnv } from "@/env";
import { cn } from "@/lib/utils";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-next-sans", display: "swap" });

// Headlines: tight, light-to-medium weight.
const display = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-next-display",
  display: "swap",
});

// Serif-italic accents ("made easier").
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-next-serif",
  display: "swap",
});

// Tamil glyphs (kept for when the language switch is re-enabled). Not preloaded.
const tamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-next-tamil",
  display: "swap",
  preload: false,
});

/** Favicon: public/images/sscool-fav-icon.png */
const FAVICON = "/images/sscool-fav-icon.png";

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
  title: { default: `${site.name} | Home Appliances, Chennai`, template: `%s | ${site.name}` },
  description:
    "Authorised dealer for air conditioners, washing machines, refrigerators, TVs and inverters in Chennai. Best price on WhatsApp, installation included.",
  applicationName: site.name,
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: FAVICON, type: "image/png" }],
    shortcut: [{ url: FAVICON, type: "image/png" }],
    apple: [{ url: FAVICON, type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(sans.variable, display.variable, serif.variable, tamil.variable)}>
      <body className="min-h-dvh bg-white">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
