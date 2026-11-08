# SS Cool Power Systems — Headless Shopify Build Prompts

Use PROMPT 0 once as the project brief (paste it first, or save it as CLAUDE.md / .cursorrules in the repo).
Then run PROMPTS 1–8 (including 5B) one at a time. Review and commit after each phase.

Version 2 adds: price bands and response-time promise, All-in Installed Price packages, Tamil/English, opt-in add-ons
(compliance), video demo and showroom booking, installation tracker, compare tool, B2B/GST flow and a Deal Closer admin.

Replace the [PLACEHOLDERS] before you start.

---

## PROMPT 0 — Master brief (project context)

You are a senior full-stack TypeScript engineer and UI engineer. Build a production-grade headless e-commerce
website for **[CLIENT NAME: SS Cool Power Systems]**, a Chennai-based wholesaler/dealer of home and commercial
appliances with 20 years of category knowledge and large institutional clients (e.g. Saravana Stores, Vande Bharat).

### Business model (this shapes every decision)
- Large appliances (AC, refrigerator, washing machine, etc.) do not show an exact public price. The product page shows
  MRP, a "Starting from" price band, a visible response-time promise ("Best price on WhatsApp within [10] minutes,
  9am-9pm") and a "Get Best Price on WhatsApp" form (name, phone, pincode) that saves the lead and redirects to WhatsApp.
  A Rs 40,000 purchase closes on WhatsApp, not in a cart, so the site must also help the sales team close the deal
  (see the Deal Closer admin in PROMPT 6).
- Every large appliance can also be offered as an **All-in Installed Price package** (appliance + stabiliser + copper
  piping + stand + installation + warranty as ONE number) so SS Cool Power Systems can answer marketplaces that now advertise
  installation-inclusive pricing.
- **Bilingual from day one**: English and Tamil (next-intl), with Tamil WhatsApp message templates. Language switcher
  in the utility bar; all Shopify content read with the Storefront `@inContext(language:)` directive.
- Customers include households AND businesses (builders, hotels, institutions). Support GST-invoice details at lead
  and checkout, and a project/bulk enquiry path.
- Small appliances, accessories and consumables (stabilisers, chimney filters, detergents, etc.) show full public
  pricing and use normal cart -> Shopify checkout with instant payment.
- Commercial appliances (washers, dryers, ironers, steam generators, commercial dishwashers) are quote-led: an RFQ form
  plus WhatsApp, with a spec sheet download. No cart.
- Each product has a `pricing_mode` metafield: `public` | `whatsapp_quote` | `rfq`. The UI must switch automatically.
- Brand pricing agreements may restrict online prices, so the pricing mode must be changeable per product
  without a deploy. Also expose `price_band_min` / `price_band_max` metafields and a global switch to show or hide bands.
- Compliance rules (India consumer protection, dark-pattern guidelines): add-ons and bundles are NEVER pre-selected
  or silently added to the cart; the customer opts in with one click and sees the price of every extra. Comparison
  tools use only customer-entered or clearly sourced numbers and never name or disparage a competitor.
- Honesty rules for trust features: every figure shown (running cost, installation cost, savings) is labelled
  "indicative", shows its assumptions, and is editable by the customer.

### Stack (do not substitute without asking)
- Next.js 15 (App Router, React Server Components, Server Actions, `next/image`), TypeScript strict mode
  (`strict`, `noUncheckedIndexedAccess`, no `any`)
- Shopify Storefront API (GraphQL) via a typed client + GraphQL Code Generator (`@graphql-codegen/client-preset`);
  Shopify Cart API for the cart; Shopify-hosted checkout; Customer Account API for login
- Shopify metaobjects/metafields for specs, energy ratings, bundles, installation info and "what's not in the box"
- Tailwind CSS v4 + Radix UI primitives (shadcn/ui-style components), `lucide-react`, `next/font`
- Zod for validation, React Hook Form for forms, `nuqs` for URL-state filters, Zustand only for small client UI state
- Postgres (Neon) + Drizzle ORM for data Shopify should not hold: leads, Appliance Passport, serviceable pincodes,
  finder quiz results
- WhatsApp Business Cloud API (or WATI/Interakt behind an adapter interface) for lead hand-off and reminders
- Razorpay is the payment gateway configured inside Shopify (no-cost EMI messaging handled in the UI)
- `next-intl` for English/Tamil routing and messages; Shopify Admin API (server-only) for Draft Orders and quote invoices
- Internal admin area (`/admin`, auth via Auth.js + role-based access) for the sales team: lead inbox, quotes, bookings
- Sanity (or Shopify metaobjects if kept simple) for homepage banners, buying guides and blog
- Vercel hosting, Vercel Cron or Inngest for scheduled reminders, Sentry, GA4 + Meta Pixel + Meta Conversions API
- Vitest + Testing Library for units, Playwright for the critical flows (lead capture, add to cart, pincode check)

### Design direction
Match the **layout, structure and interaction patterns** of ifbappliances.com, but with the client's own brand.
Do not copy IFB's logo, wordmark, copy, photography or image assets. Use placeholders, and put the client's colours
and fonts in design tokens in one file (`src/styles/tokens.css`) so rebranding is one edit.
Style: clean, premium, lots of white space, big full-bleed lifestyle banners, restrained typography, rounded product
cards, subtle motion, mobile-first. Light theme only for v1.

### Global UI structure to reproduce
1. **Utility bar** (top): "Delivering to [pincode]" with an edit link that opens a pincode modal, two phone numbers,
   a Support link, a language switcher (EN | தமிழ்) and a "Call an Expert" action.
2. **Header**: logo, two-tab mega menu (Home Appliances | Commercial Appliances), "Amazing Everyday"
   (guides/blog), Offers, search icon, account icon, cart icon with item count.
   - Home Appliances panel has columns: Laundry (front load, top load, washer-dryer, dryers), Kitchen
     (refrigerators, microwaves, chimneys, built-in, dishwashers, hobs), Living (air conditioners), and More
     (Essentials/consumables, Accessories). Each group has an icon image and sub-links.
   - Commercial panel: Laundry (washers, ironers, dryers, steam generators, finishing equipment, accessories) and
     Dishwashing.
   - Mobile: full-screen drawer with a back arrow and accordion drill-down.
3. **Search overlay** (full-width): input; before typing it shows "Discover" quick chips, "Recently viewed" and "Most
   viewed"; while typing it shows predictive Categories (with counts) and Products (image, name, price, MRP, % off).
   Use the Storefront `predictiveSearch` query, debounced.
4. **Cart drawer** (slide-over): line items, quantity stepper, "Frequently and popularly paired" carousel, coupon
   line, subtotal, minimum-order-value notice, View Cart and Proceed to Checkout. Empty state with Start Shopping.
5. **Login modal**: mobile number -> OTP -> verify, with benefit bullets (track orders, faster checkout, exclusive offers).
6. **Footer**: newsletter field, accordion link groups (Home Appliances, Commercial, Essentials, Accessories, Amazing
   Everyday, Offers, About, Support, Legal), "Find an SS Cool Power Systems store near you" strip, social links, GST number and address.
7. **Floating elements**: persistent WhatsApp button (all pages); sticky "Call an Expert" bar on mobile.

### Engineering rules
- Server Components by default; `"use client"` only where interaction needs it. Cache Shopify reads with tags and
  `revalidateTag` via a Shopify webhook route (products, collections, inventory).
- A typed `lib/shopify` module owns all Storefront calls. No raw fetch calls in components.
- Every form: Zod schema shared by client and server, honeypot + rate limit, server action, optimistic UI, clear error states.
- Accessibility: WCAG 2.2 AA, focus trapping in modals/drawers, keyboard-navigable mega menu, visible focus states.
- Performance targets: LCP < 2.5 s on 4G mobile, CLS < 0.1, JS per route < 150 kB gzipped. Use `next/image`
  with explicit sizes, AVIF/WebP, lazy-load below the fold.
- SEO: metadata API, JSON-LD (Product, BreadcrumbList, Organization, LocalBusiness, FAQ), sitemap, robots, canonical URLs.
- Folder layout: `src/app`, `src/components/{ui,layout,commerce,home}`, `src/lib/{shopify,db,whatsapp,analytics}`,
  `src/features/{finder,tco,bundle,passport,pincode,lead}`, `src/styles`.
- Env vars validated at boot with Zod (`env.ts`). Never expose Admin API tokens to the client.
- Commit after each phase with a conventional-commit message. Write a short README section per phase.

Confirm you understand, list any ambiguities as numbered questions, and then wait for PROMPT 1.

---

## PROMPT 1 — Scaffold, tokens, Shopify client

1. Scaffold the Next.js 15 + TS strict project with the folder layout above, ESLint, Prettier, Husky + lint-staged,
   `env.ts` with Zod, and a CI workflow (typecheck, lint, test, build).
2. Create `tokens.css` (colour scale, neutral scale, radii, shadows, spacing, type scale, container widths) and
   wire it into Tailwind v4. Add `next/font` with a clean sans for UI and a display weight for banner headlines.
3. Build the base UI kit: Button (primary/secondary/ghost/link), Input, Select, Checkbox, Badge, Modal, Drawer,
   Accordion, Tabs, Tooltip, Skeleton, Toast, Carousel (embla), Price (MRP strike-through + % off), Rating.
4. Build the typed Shopify client with codegen, retry and error handling. Provide queries for: shop, menu, collections,
   products by handle, product recommendations, predictive search, cart create/add/update/remove/discount.
5. Provide `scripts/seed-shopify.ts` that creates the metafield and metaobject definitions we need:
   `pricing_mode`, `price_band_min`, `price_band_max`, `energy_rating`, `warranty_years`, `capacity`, `key_features`,
   `not_in_box` (list of {item, indicative_cost}), `bundle_items`, `installation_info`, `power_watts`,
   `all_in_package` (list of {item, price}, used by the All-in Installed Price), `tamil_title`/`tamil_summary` fallbacks.
   Enable Shopify translations for Tamil on products, collections and menus.
   Show me the exact definitions before running anything.

Deliver working code, run typecheck/lint, and summarise what to verify.

---

## PROMPT 2 — Layout, mega menu, search, cart drawer, login

Implement the global shell exactly as specified in the master brief: utility bar with pincode modal, header with the
two-tab mega menu (desktop hover/focus + mobile drill-down drawer), search overlay with predictive results and
recently/most-viewed (persist in localStorage), cart drawer with frequently-paired products, login modal, footer,
floating WhatsApp button and the mobile sticky "Call an Expert" bar.

Details:
- The pincode is stored in a cookie and read in server components. Changing it revalidates the delivery messaging.
- Menu content comes from a typed config file now, with a Shopify-menu adapter prepared for later.
- Cart is server-backed (Shopify cart id in an httpOnly cookie), with optimistic updates through Server Actions.
- Login: build the UI and a `AuthProvider` interface. Implement Shopify Customer Account API sign-in. Stub the
  mobile-OTP path behind an adapter (MSG91/Twilio) and document the gap between Shopify's email-based login and
  mobile OTP.
- Write Playwright tests for: open/close menu with keyboard, search suggestions, add/remove in cart drawer.

---

## PROMPT 3 — Homepage (IFB-style structure)

Build the homepage in this order, with CMS-driven content (Sanity or typed JSON fallback):

1. **Hero**: full-bleed rotating banners with a centered prompt-style search bar: "Tell us what you are looking
   for?" (links into the Appliance Finder Quiz and search).
2. **In the spotlight**: tabs ("Offers" | "Recommended for you") over a row of 4 offer cards, each with image,
   small label (VALUE UPGRADES / EASY EMIs / INSTANT SAVINGS), a one-line promise and a CTA (Exchange / Buy Now / Shop).
3. **Category banners**: alternating full-bleed lifestyle banners grouped under Laundry, Kitchen and Living headings.
   Each has a two-line headline, a Shop button and a Discover button. Responsive art direction (separate mobile crops).
4. **Real Installations grid** (our differentiator): photos of actual installs with the locality named, linking
   to the product used.
5. **"Your everyday made amazing"**: editorial grid of 5-6 buying guides/blog cards with category tags.
6. **Brand statement banner** with a link to About.
7. **Three value props**: Free Home Delivery, Easy EMIs, Exchange and Upgrade. Copy is editable from the CMS.
8. **Reviews wall**: live Google reviews widget plus Tamil video testimonials (lazy-loaded embeds).
9. **"Get started, we've made it easy"** quick-link cards: Product Registration (Appliance Passport), Download
   Manuals, Get in Touch, FAQs.
10. **Trust strip**: GST number, year established, brand authorisation certificates, address.
11. Newsletter signup.

Use Intersection Observer for subtle reveal animations, respect `prefers-reduced-motion`, and keep the above-the-fold
JS minimal.

---

## PROMPT 4 — Catalog, filtering, product page

**Collection/listing pages** (8 categories + sub-categories): breadcrumb, hero strip, sticky filter bar (desktop
left rail, mobile bottom sheet), filters from Shopify product filters (brand, capacity, energy rating, price, type),
sort, URL-synced via `nuqs`, infinite "load more", product cards with image, badges (energy rating, % off), key
spec chips, a compare checkbox (max 3) and the correct CTA for the `pricing_mode`.

**Product page** - build a flexible PDP:
- Gallery (zoom, video, 360 optional), title, rating, price block that depends on `pricing_mode`
  - `public`: price, MRP, % off, No-Cost EMI display, Add to Cart + Buy Now
  - `whatsapp_quote`: MRP and a "Get Best Price on WhatsApp" modal form (name, phone, pincode)
  - `rfq`: "Request Quote" form with quantity, business name, GST number, site city
- Pincode checker (delivery and installation dates), exchange value estimator, no-cost EMI table
- **Bundle builder**: stabiliser, installation kit and extended warranty offered as one-click add-ons, UNCHECKED by
  default, each with its price, a one-line "why you may need it", and the combined saving shown once the customer picks
  them. Never pre-select or auto-add items.
- **"What is not in the box"** panel from the `not_in_box` metafield with indicative costs, merged with the
  **All-in Installed Price** selector: "Appliance only" | "Appliance + standard installation" | "All-in (everything
  needed, one price)". Show what each option includes and excludes.
- Response-time promise and trust row under the CTA (GST invoice, brand-authorised dealer, installation within [48] hours)
- **Five-year running-cost calculator** (usage hours + local tariff -> 5-year electricity difference between 3-star and 5-star)
- **True Cost Comparison**: the customer enters any price they saw elsewhere; show a side-by-side that adds stabiliser,
  copper piping, stand, installation, gas/service terms and warranty handling to both sides, using editable
  indicative numbers. It must only show arithmetic, never name or disparage a competitor, and always label assumptions.
- Specs table, downloads (manual, brochure), FAQs, installation gallery for this model, related products, JSON-LD.
- Sticky mobile purchase bar with the correct CTA.

Create the shared lead-capture service (`features/lead`): Zod schema, server action, rate limit, Postgres insert
(source, product, pincode, UTM params), WhatsApp deep-link redirect with a prefilled message, and a Meta
Conversions API `Lead` event.

---

## PROMPT 5 — Differentiating features (8 from the proposal + 6 additions)

Implement each in `src/features/*` with unit tests and a Playwright happy-path test. Build in this priority order:
Real Installations, Finder Quiz, All-in Installed Price, True Cost, WhatsApp price flow, Video Demo/Showroom booking,
Installation Promise tracker, running-cost calculator, add-ons, Passport-lite, compare tool.

### Additions beyond the proposal
9. **All-in Installed Price packages**: per product, a configurable package (appliance + stabiliser + copper piping +
   stand + installation + warranty) priced as one number, with a transparent line-by-line breakdown. Adds to cart as a
   Shopify bundle for public-priced items, and goes into the WhatsApp lead for quote-led items.
10. **Video Demo and Showroom Visit booking**: choose a product, pick a slot (video call over WhatsApp or showroom
    visit), confirm by WhatsApp. Slots, capacity and holidays are configured in the admin. Reminder 1 hour before.
11. **Installation and Service Promise tracker**: a public promise (e.g. installed within [48] hours of delivery) and a
    customer-facing status timeline (Ordered -> Delivered -> Installation scheduled -> Installed -> Warranty active)
    that updates from the admin and sends WhatsApp messages in the customer's language.
12. **Compare up to 3 models** side by side with plain-language "what this means for you" rows (noise, power cost,
    capacity in family-size terms), not only raw specs.
13. **Bilingual experience** (English/Tamil) across the Finder Quiz, WhatsApp templates and key pages.
14. **Business/GST and project enquiry flow**: collect GSTIN and site details, generate a GST-ready quote, and tag
    leads as B2C, business, builder or designer for the sales team.

### The proposal's eight features

1. **Appliance Finder Quiz** (AC, refrigerator, washing machine) - requirement-led questions (room size, family size,
   budget, usage), 4-6 steps with progress bar. It returns 3 recommended models with: why that size, the five-year running
   cost, and a WhatsApp button. The recommendation rules live in a typed config, not in the UI. Save results to the DB.
2. **Get Best Price on WhatsApp** (already in the lead service; polish the UX and the confirmation state).
3. **Total Cost Comparison** (see PDP).
4. **Bundle builder** (see PDP) with real Shopify variant/line-item bundling for public-priced items.
5. **Real Installations gallery**: CMS content type with photo, locality, product link; homepage grid + PDP strip.
6. **"What is not in the box"** panel.
7. **Five-year running-cost calculator** with a typical Tamil Nadu tariff slab as the default (editable).
8. **Appliance Passport**: ship "Passport-lite" first. It is created automatically when a purchase is recorded
   (from Shopify orders or an admin entry) with model, serial, purchase date and warranty expiry, and sends WhatsApp
   reminders (warranty expiry, filter changes, AMC offers). Phase 2: customer dashboard, service history, invoice
   upload (S3/R2). Pull orders from Shopify to prefill.

---

## PROMPT 5B — Deal Closer admin (turns WhatsApp leads into paid orders)

Build `/admin` (Auth.js, roles: owner, sales, technician) so the sales team can close deals started on the site:
1. **Lead inbox**: every lead (price request, RFQ, quiz result, booking) with source, product, pincode, language,
   UTM, status (New, Contacted, Quoted, Won, Lost), owner, notes and follow-up reminders. Click-to-WhatsApp and
   click-to-call with Tamil/English message templates.
2. **Quote builder**: select products and the All-in package, add discount and GST details, and generate a shareable
   quote page (unique link, expiry date).
3. **Pay link**: convert an accepted quote into a Shopify Draft Order (Admin API) and send the Shopify invoice /
   Razorpay payment link by WhatsApp. On payment, mark the lead Won and create the Appliance Passport entry.
4. **Installation scheduling** board that feeds the customer status timeline.
5. **Dashboards**: leads by source, response time, quote-to-order conversion, cost per lead (from Meta spend entered
   manually), best-performing products and content.
Add audit logs, role checks on every server action, and tests for the quote -> draft order flow (mock Shopify).

---

## PROMPT 6 — Trust, content and conversion pages

Build: About (owner story, 20 years, technician profiles), Reviews, Installation Promise, Combo/Bundle pages,
Project Enquiry form (builders, hotels, institutions) and Designer Partner form, Store/Showroom page with Google Map,
Buying Guides (6 templates with TOC, comparison table, CTA to the Finder), FAQ with JSON-LD, Support hub
(Order Tracking, Ticket Status, AMC info), Legal pages. Add a Commercial Appliances landing with RFQ and spec downloads.

---

## PROMPT 7 — Checkout, payments, orders

Configure and wire up: Shopify checkout hand-off with the cart, UTM and pincode passed as attributes; Razorpay
(UPI, cards, netbanking, EMI) as the gateway inside Shopify; GST-aware invoices; minimum order value rule; coupon
display; order confirmation redirect and the "Order Tracking" page using the Customer Account API. List exactly which
checkout customisations need Shopify Plus (Checkout Extensibility) and which we can do on a standard plan.

---

## PROMPT 8 — SEO, analytics, performance, launch

GA4 events (view_item, add_to_cart, generate_lead, begin_checkout, purchase, finder_complete), Meta Pixel +
Conversions API with event deduplication, consent banner, structured data audit, sitemap and redirects,
Lighthouse CI budgets, Sentry, error pages, 404 with search, security headers/CSP, backups, uptime monitor, a launch
checklist and a runbook for the monthly maintenance tasks (product uploads, price changes, offers).

---

## Tips when running these
- Paste PROMPT 0 first, then run one phase at a time. Ask the agent to show a plan before writing code for Phases 4 and 5.
- If it drifts from the design, attach screenshots of IFB's header, search overlay and a banner row as visual
  references, and say "match the structure and spacing, not the branding".
- Keep Shopify product data clean first (consistent titles, collections, metafields); the UI depends on it.
