# Build progress

## Done
- **Phase 1**: scaffold, tokens, UI kit, Shopify client, seed script.
- **Demo data mode**: `src/lib/catalog` serves a sample catalogue (fictional brands) until Shopify env vars are set.
  A yellow DEMO strip shows at the top while it is active. Force it with `CATALOG_SOURCE=demo`.
- **Phase 2 (shell)**: utility bar (pincode modal, phones, EN | தமிழ், Call an Expert), header with two mega-menu
  panels + mobile drill-down drawer, search overlay (Discover / Recently viewed / Most viewed, predictive results),
  cart drawer (stepper, paired carousel, coupon, MOV notice), mobile-OTP login modal (demo OTP 123456),
  footer (newsletter, link groups, store strip, GSTIN), floating WhatsApp + mobile Call bar.
- **Phase 3 (homepage)**: hero carousel with prompt search, spotlight tabs, category banners (Laundry/Kitchen/Living),
  real installations, guides, brand statement, value props, reviews wall, quick links, trust strip.
- `/search` results page.

## Bilingual approach
UI strings live in `src/i18n/en.ts` and `ta.ts` (Tamil machine-drafted, needs review). The language is a cookie
(`ss_locale`), switched from the utility bar. `next-intl` with `/ta` URLs needs a `next.config.ts` change and is
planned for Phase 8 (SEO); the dictionaries are already shaped for it.

## Placeholder content (must be replaced before launch)
- `src/config/site.ts`: phones, GSTIN, address, year.
- Reviews and installation photos on the homepage are labelled "Sample content". Never publish invented reviews.
- Logo: `src/components/layout/logo.tsx`.

## Next
- Phase 4: collection pages with filters, product page (price modes, WhatsApp lead form, bundles, All-in price,
  not-in-box, running cost, true cost comparison), lead service (Postgres).
- Phase 5 / 5B: finder quiz, compare, booking, installation tracker, passport, admin.
- Phases 6–8: content pages, checkout, SEO, analytics, launch.

## Known follow-ups
- Search overlay mini rows show line art even when a product has a Shopify image.
- Adding to an expired Shopify cart should start a new cart instead of showing an error.
- OTP actions need rate limiting before a real SMS provider is connected.
