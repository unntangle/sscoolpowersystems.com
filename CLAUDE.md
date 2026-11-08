# SS Cool Power Systems — Project Brief (CLAUDE.md)

Source: PROMPT 0 of `ss-cool-power-systems-build-prompt.md`, amended by the decisions below.
Where this file and the prompt file disagree, THIS FILE WINS.

## Scope (2026-11-08)
**Exactly five product categories:** Air Conditioners (Split, Window), Washing Machines (Front Load, Top Load),
Refrigerators, Televisions, Inverters. Defined once in `categories` in `src/config/navigation.ts`.
- No commercial appliances (washers, dryers, ironers, steam generators, finishing equipment, commercial dishwashers).
- No kitchen appliances (microwaves, chimneys, built-in, dishwashers, hobs), essentials or accessories categories.
- Ignore any of the above in the prompt file. The `rfq` pricing mode stays available for bulk/business enquiries.
- Business buyers still get GST invoices and the project/bulk enquiry form.
- **English only (2026-11-08).** No language switch, no `/ta` URLs, no Tamil WhatsApp templates for now.
  Tamil strings stay in `src/i18n/ta.ts`; re-enable with `features.languageSwitch` in `src/config/features.ts`.
  Keep all new UI text in `src/i18n/en.ts` so Tamil can be added later without code changes.

## Business
Chennai-based authorised dealer. Brands: Panasonic, Mitsubishi Heavy Industries, Daikin, Mitsubishi Electric, Haier
(`src/config/brands.ts`, logos in `public/images/brands/`). Logo: `public/images/sscool-logo.webp` (1200×255).
Contact: +91 96011 11070 · info@sspowercool.com · 43, Ravi Colony Second Street, Ramapuram, Nazarethpuram,
Gandhi Nagar, St. Thomas Mount, Chennai 600032 (`src/config/site.ts`). 7-day hassle-free returns.

## Business model
- Each product has a `pricing_mode` metafield: `public` | `whatsapp_quote` | `rfq`, changeable without a deploy.
  Also `price_band_min` / `price_band_max` and a global show/hide-bands switch.
- **Large appliances** (`whatsapp_quote`): MRP, "Starting from" band, response-time promise, "Get Best Price on
  WhatsApp" form (name, phone, pincode) -> save lead -> WhatsApp. Deals close on WhatsApp; the Deal Closer admin helps.
- **All-in Installed Price** package per AC (appliance + stabiliser + piping + stand + installation + warranty).

### Compliance
- Add-ons/bundles never pre-selected or silently added; price of every extra visible.
- Comparisons use customer-entered or sourced numbers only; never name or disparage a competitor.
- Every figure labelled "indicative" with editable assumptions. Discount % rounded down.
- Never publish invented reviews or installation photos; placeholders carry a visible "Sample" label.
- Brand logos are shown in their true colours (never recoloured).

## Stack (do not substitute without asking)
Next.js 15 (App Router, RSC, Server Actions) · TypeScript strict (`noUncheckedIndexedAccess`, no `any`) ·
Shopify Storefront API + codegen client preset · Cart API · Shopify checkout · Customer Account API ·
Admin API (server-only) · Tailwind v4 + Radix UI · Zod · React Hook Form · nuqs · Postgres (Neon) + Drizzle ·
WhatsApp Cloud API behind an adapter · Razorpay in Shopify · Auth.js admin (owner, sales, technician) ·
Shopify metaobjects for CMS content · Vercel · Sentry · GA4 + Meta CAPI · Vitest + Playwright.

## Design
Layout and interaction patterns inspired by ifbappliances.com, with our own brand, copy and imagery (never IFB's
assets or text). Warm sand/cream surfaces and ink text, with the **logo blue** (`--ss-accent-*`, 600 = #1a6fb0) as
the accent on CTAs, highlights, icons and serif-italic headline accents. Inter Tight headlines with Instrument
Serif italic accents, rounded banners, dark footer. Star ratings stay gold. All tokens in `src/styles/tokens.css`.
Photos go in `public/images/` (see its README); missing photos render styled placeholder scenes.

## Global UI
1. Announcement bar (7-day returns) · utility bar: pincode, hotline, Support pill.
2. Header: SS logo · **Home · About · Products ▾ · Brands ▾ · Contact** · search, account, cart · **SHOP NOW**.
   Products panel = the five categories (with Split/Window and Front/Top Load links) + All-in promo.
   Brands panel = authorised brand logos. Mobile: drawer with drill-down for Products and Brands.
3. Homepage: hero · five category tiles with product counts · prompt search · brands row · spotlight ·
   lifestyle banners · best sellers · installations · editorial · brand banner · value props · reviews · get started.
4. Search overlay, cart drawer, login modal (mobile OTP), dark footer, floating WhatsApp, sticky mobile Call bar.

## Engineering rules
- Server Components by default; tagged Shopify cache + webhook revalidation.
- `src/lib/shopify` owns Storefront calls; `src/lib/catalog` is the facade pages use (Shopify or local catalogue).
- No raw fetch in components (ESLint). Forms: shared Zod schema, honeypot, rate limit, server action.
- WCAG 2.2 AA. LCP < 2.5 s, CLS < 0.1, JS/route < 150 kB gz. JSON-LD, sitemap, canonicals.
- Env validated with Zod (`src/env.ts`); Admin tokens never reach the client.

## Decisions
- pnpm, Node 22. Repo root `D:\SS`. Replaced files are kept in `D:\SS-backup\roundN`.
- Shopify plan assumed standard (non-Plus). Metafield namespace `ss`.
- `pricing_mode` missing/invalid falls back to `whatsapp_quote`. For quote-led products set Shopify price = MRP.
- Login: Customer Account API for v1; mobile OTP via MSG91 adapter (demo OTP 123456 in development).
- Local catalogue (`src/lib/catalog/demo-data.ts`) = the client's current Panasonic AC listings (page 1 of 2);
  prices to verify; page 2 pending. Washing machines, refrigerators, TVs and inverters have no products yet.

## Open items
- GSTIN, year established, store hours, WhatsApp number confirmation, social links.
- Product page 2 (15 products), full titles of two truncated listings, product photos, category images,
  transparent Daikin logo.
- Confirm whether ACs stay WhatsApp-quote or switch to public cart pricing.
