import Link from "next/link";
import { Phone } from "lucide-react";
import { features } from "@/config/features";
import { site } from "@/config/site";
import { PincodeModal } from "@/features/pincode/pincode-modal";
import type { Dictionary, Locale } from "@/i18n";
import { telLink } from "@/lib/whatsapp/links";
import { LanguageSwitcher } from "./language-switcher";

interface UtilityBarProps {
  locale: Locale;
  pincode: string | null;
  t: Pick<Dictionary, "utility" | "pincode">;
}

/** Slim top bar: delivery pincode left; hotline and Support pill (logo blue) right. */
export function UtilityBar({ locale, pincode, t }: UtilityBarProps) {
  const { sales, support } = site.phones;
  const phones = sales === support ? [sales] : [sales, support];

  return (
    <div className="border-b border-neutral-200/70 bg-white text-xs text-neutral-600">
      <div className="container-wide flex min-h-10 items-center justify-between gap-4">
        <PincodeModal pincode={pincode} t={t} />

        <div className="flex items-center gap-3 lg:gap-5">
          <span className="hidden items-center gap-2 tabular-nums sm:inline-flex">
            <Phone className="size-3.5 text-accent-600" aria-hidden />
            {phones.map((phone, i) => (
              <span key={phone} className="inline-flex items-center gap-2">
                {i > 0 ? (
                  <span aria-hidden className="text-neutral-300">
                    |
                  </span>
                ) : null}
                <a href={telLink(phone)} className="font-medium text-neutral-800 hover:text-accent-700">
                  {phone}
                </a>
              </span>
            ))}
          </span>
          {features.languageSwitch ? <LanguageSwitcher locale={locale} label={t.utility.language} /> : null}
          <Link
            href="/support"
            className="inline-flex min-h-7 items-center rounded-full bg-accent-600 px-3 font-medium text-white transition-colors hover:bg-accent-700"
          >
            {t.utility.support}
          </Link>
        </div>
      </div>
    </div>
  );
}
