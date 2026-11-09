# SS Cool Power Systems — Handover (end of day, 8 Nov 2026)

Read this first when you continue. The project brief and every agreed decision are in **`CLAUDE.md`**
(it overrides the original prompt file `ss-cool-power-systems-build-prompt.md`).

---

## 1. Start-of-day checklist

```powershell
cd D:\SS
Remove-Item -Recurse -Force .next      # clears stale styles (the dev server stopped picking up changes last night)
pnpm check                             # codegen + typecheck + lint + tests  ← not run since the last ~25 changes
pnpm dev                               # http://localhost:3000
```

- Fix whatever `pnpm check` reports **before** starting new work (many files were written without being run).
- After any change, if the page doesn't update: Ctrl+C, delete `.next`, `pnpm dev`, then Ctrl+Shift+R.
- Old versions of every replaced file are in `D:\SS-backup\round3` … `round32` (newest = highest number).

---

## 2. Project at a glance

| Item | Value |
| --- | --- |
| Stack | Next.js 15 (App Router) · TypeScript strict · Tailwind v4 · Radix UI · Shopify Storefront API (not connected yet) |
| Package manager | pnpm 10.12.1 (installed with `npm install -g pnpm@10.12.1`) · Node 22 |
| Data source today | Local catalogue `src/lib/catalog/demo-data.ts` (switches to Shopify automatically once env vars are set) |
| Language | English only (Tamil kept, switched off in `src/config/features.ts`) |
| Scope | 5 categories only: Air Conditioners, Washing Machines, Refrigerators, Televisions, Inverters. No commercial, no kitchen |

### Where things live

| What | File |
| --- | --- |
| Business details (phone, email, address, GSTIN, promises) | `src/config/site.ts` |
| Categories, Products menu, footer links, social links | `src/config/navigation.ts` |
| Top nav (Home, About, Products, Brands, Contact, Shop Now) | `src/config/main-nav.ts` |
| Brands | `src/config/brands.ts` + logos in `public/images/brands/` |
| Homepage copy (hero, offers, banners, guides, installations, reviews) | `src/content/home.ts` |
| Colours, fonts, spacing (rebrand here) | `src/styles/tokens.css` |
| Footer layout grid | `src/styles/footer.css` + `src/components/layout/footer.tsx` |
| English / Tamil UI text | `src/i18n/en.ts`, `src/i18n/ta.ts` |
| Products (temporary) | `src/lib/catalog/demo-data.ts` |
| Photo slots + required filenames | `public/images/README.md` |

---

## 3. Completed

### Foundation (Phase 1)
- Next.js 15 + TS strict scaffold, ESLint (no `any`, no raw `fetch` in components), Prettier, Husky, CI workflow.
- Zod-validated env (`src/env.ts`), design tokens, UI kit (Button, Input/Field, Select, Checkbox, Badge, Modal, Drawer,
  Accordion, Tabs, Tooltip, Skeleton, Toast, Carousel, Price, Rating). Preview at `/kit` (dev only).
- Typed Shopify Storefront client with retries, codegen, queries (shop, menu, collections, product, recommendations,
  predictive search) and cart mutations; mappers that hide selling price for non-public products.
- `scripts/seed-shopify.ts` (dry run by default) for metafield + metaobject definitions.
- `/api/revalidate` Shopify webhook route (HMAC verified).

### Site shell (Phase 2)
- Black announcement bar (7-day returns) · utility bar (pincode modal, hotline, blue Support pill).
- Header: SS logo · Home · About · Products ▾ (5 categories + All-in promo) · Brands ▾ (logos) · Contact ·
  search · login · cart · blue **SHOP NOW**. Mobile drawer with drill-down.
- Search overlay (Discover chips, recently viewed, most viewed, live results) + `/search` page.
- Cart drawer (server-backed; demo mode), mobile-OTP login modal (demo OTP **123456**).
- Floating WhatsApp button + mobile Call/WhatsApp bar.
- Footer (agreed final layout): link columns → [Visit our store | Contact | newsletter] → "stay cool" wordmark →
  copyright, GSTIN, Instagram/Facebook/LinkedIn.

### Homepage (Phase 3, IFB-inspired, own branding)
Hero carousel (neutral) · 5 category circles with product counts · "Tell us what you are looking for?" ·
authorised brands row · In the spotlight (offers / recommended) · 3 full-width lifestyle banners · Best sellers ·
Real installations (sample) · "Your everyday, made easier" + guides rail · brand banner · value props ·
reviews (restyled, sample) · Get started.

### Pages
- `/about` (story drafted from the brief — owner to review), `/contact` (cards + Google Maps), `/search`.

### Branding & content done
- Logo (`sscool-logo.webp`), favicon (`sscool-fav-icon.png`), 5 brand logos wired.
- Warm sand palette + logo-blue accent (`--ss-accent-*`), flat buttons, hero kept neutral.
- Real details: +91 96011 11070 · info@sscoolpowersystems.com ·
  37, Ravi Colony Second Street, Nazarethpuram, Gandhi Nagar, St. Thomas Mount, Chennai, Tamil Nadu 600032.
- 23 Panasonic ACs from the current website (page 1 of 2) as "Starting from ₹X" + MRP, WhatsApp best price.

---

## 4. Pending — build work (in order)

### Next up: Phase 4 — catalogue and product pages (these links are 404 today)
- [ ] `/collections/[handle]` — breadcrumb, hero strip, filters (brand, capacity, star rating, price, type) via
      `nuqs`, sort, load more, compare checkbox (max 3), empty state for categories with no products yet.
- [ ] `/products/[handle]` — gallery, price block by `pricing_mode` (public / whatsapp_quote / rfq),
      **Get Best Price on WhatsApp** form (name, phone, pincode → save lead → WhatsApp), response-time promise,
      pincode delivery check, EMI table, All-in Installed Price selector, opt-in add-ons (never pre-selected),
      "What's not in the box", 5-year running-cost calculator, True Cost Comparison, specs, FAQs, related products,
      JSON-LD, sticky mobile buy bar, record "recently viewed".
- [ ] Lead service: Zod schema, rate limit, Postgres (Neon + Drizzle) insert, WhatsApp deep link, Meta CAPI `Lead`.

### Phase 5 — features
- [ ] Appliance Finder quiz (`/finder`), compare up to 3, video demo / showroom booking, installation & service
      tracker, Appliance Passport-lite (`/passport`), business/GST enquiry flow (`/project-enquiry`).

### Phase 5B — sales admin (`/admin`)
- [ ] Lead inbox, quote builder, Shopify Draft Order pay links, installation board, dashboards, roles, audit log.

### Phase 6 — content pages (all 404 today)
- [ ] `/offers`, `/guides` + guide pages, `/reviews`, `/installations`, `/installation-promise`, `/faq`, `/stores`,
      `/support`, `/support/track-order`, `/support/manuals`, `/legal/privacy|terms|returns|shipping`, `/cart`.
- [ ] Move homepage content to Shopify metaobjects (editable without code).

### Phase 7 — checkout & orders
- [ ] Shopify checkout hand-off, Razorpay, GST invoices, order tracking, Customer Account login, MSG91 OTP.

### Phase 8 — launch
- [ ] SEO (metadata, JSON-LD, sitemap), GA4 + Meta Pixel/CAPI, consent banner, Sentry, security headers,
      performance budgets, Playwright tests, launch checklist.

---

## 5. Pending — needed from the client

| Item | Where it goes |
| --- | --- |
| Real **GSTIN** (current is a dummy) and **year established** | `src/config/site.ts` |
| Store / WhatsApp **hours** and opening days | `src/config/site.ts` |
| Confirm **WhatsApp number** (assumed 919601111070) — also fix `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` (still dummy 919999999999) | `.env.local` |
| **Instagram, Facebook, LinkedIn** profile URLs | `socialLinks` in `src/config/navigation.ts` |
| **Page 2 of products** (15 items) + full titles of 2 cut-off listings + clarify duplicate CS/CU-KN12CKY (₹33,000 vs ₹43,000) + verify all prices | `src/lib/catalog/demo-data.ts` |
| Decide: ACs as **WhatsApp best price** (current) or **fixed price + cart** like the old site | `pricing_mode` |
| **Photos**: hero, banners, offer cut-outs, guide images, installation photos, 5 category cut-outs | names in `public/images/README.md` |
| Transparent **Daikin** logo; square 512×512 **favicon** | `public/images/brands/`, `public/images/` |
| Owner review of the **About** story ("around twenty years") | `src/app/(store)/about/page.tsx` |
| Real **Google reviews** + customer videos (reviews and installations are labelled Sample until then) | homepage |

### Accounts to create (needed from Phase 4 onwards)
Shopify store (+ Headless channel, Admin app), Neon Postgres, WhatsApp Business Cloud API, Razorpay (via Shopify),
MSG91 (OTP), Vercel, Sentry, GA4 + Meta Business. Setup steps for Shopify are in `README.md` (Phase 1 section).

---

## 6. Known issues / clean-up

- [ ] Run `pnpm check` and fix errors (see section 1).
- [ ] "Real installations" still uses orange "Sample content" pills — restyle like the reviews section (offered, not done).
- [ ] `src/components/home/home-sections.tsx` still exports an old, unused `ReviewsWall` — delete it
      (the live one is `src/components/home/reviews-wall.tsx`).
- [ ] Search overlay rows always show line art, even when a product has a real image.
- [ ] Adding to an expired Shopify cart should start a new cart instead of erroring (`src/features/cart/actions.ts`).
- [ ] Rate-limit the OTP actions before connecting a real SMS provider.
- [ ] `README.md` only describes Phase 1 and old details — refresh it.
- [ ] Unused but kept on purpose: `language-switcher.tsx`, `src/i18n/ta.ts`, Tamil font (for re-enabling Tamil).
- [ ] Deprecation warnings at install (ESLint 9, `@testing-library/jest-dom`) — bump versions later.
- [ ] No Playwright tests yet (planned in Phase 2/8).

---

## 7. Tomorrow — suggested order

1. Section 1 checklist (clear `.next`, `pnpm check`, fix errors).
2. Quick wins: restyle Real installations samples; delete the unused `ReviewsWall`.
3. Start **Phase 4**: collection pages, then the product page with the WhatsApp lead form.
4. Chase the client list in section 5 (GSTIN, product page 2, photos, social links, pricing decision).
