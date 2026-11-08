# SS Cool Power Systems — Headless Shopify storefront

Next.js 15 + TypeScript (strict) + Tailwind v4 + Radix UI, on the Shopify Storefront API.
Project brief: `CLAUDE.md`. Phase prompts: `ss-cool-power-systems-build-prompt.md`.

## Decisions (2026-11-08)

Everything is new: no Shopify store, accounts, brand assets or translations exist yet.

- Package manager **pnpm** (via corepack), **Node 22 LTS**. Repo root is this folder.
- Business placeholders (phones, WhatsApp, GSTIN, address, response minutes, install hours) live in
  `src/config/site.ts`, each marked `PLACEHOLDER`.
- Brand: placeholder "cool blue" palette in `src/styles/tokens.css` (the only file to edit when rebranding).
  Fonts: Inter (UI), Plus Jakarta Sans (display), Noto Sans Tamil (Tamil glyphs).
- Shopify plan assumed **standard (non-Plus)**; anything needing Plus will be flagged, not built.
- CMS: **Shopify metaobjects** for v1 (translations stay in Shopify; Sanity optional later).
- Login: Shopify Customer Account API for v1; mobile OTP via an MSG91 adapter for leads/admin.
- WhatsApp: Meta Cloud API behind an adapter. Submit Tamil templates for approval early.
- Tamil copy: machine-drafted, marked "needs review", English fallback.
- `pricing_mode` missing/invalid falls back to **`whatsapp_quote`** so a price is never published by accident.
- The storefront mapper strips the selling price for non-public products. **In Shopify, set the variant price of
  quote-led products to their MRP**: anyone with a public Storefront token can read raw prices.
- Metafield namespace: `ss`.

## Getting started (Windows)

```powershell
cd D:\SS
corepack enable
pnpm install
copy .env.example .env.local
# Until the Shopify store exists, add this line to .env.local:
#   SKIP_ENV_VALIDATION=1
pnpm codegen          # generates typed GraphQL into src/lib/shopify/__generated__
pnpm dev              # http://localhost:3000  and  http://localhost:3000/kit
git init; git add -A; git commit -m "chore: phase 1 scaffold"
```

`pnpm check` runs codegen, typecheck, lint and tests in one go.

## Phase 1 — Scaffold, tokens, UI kit, Shopify client

**What's here**

| Area | Files |
| --- | --- |
| Tooling | `package.json`, `tsconfig.json` (strict + `noUncheckedIndexedAccess`), `eslint.config.mjs` (no `any`, no raw `fetch` in components), Prettier + Tailwind plugin, Husky + lint-staged, `.github/workflows/ci.yml` |
| Env | `src/env.ts`: Zod-validated at boot (imported by `next.config.ts`); `serverEnv` throws if read in the browser |
| Design tokens | `src/styles/tokens.css` → mapped into Tailwind in `src/app/globals.css` (`bg-brand-600`, `shadow-card`, `text-display-1`, `container-site`, ...) |
| UI kit | `src/components/ui/*`: Button, Input + Field, Select, Checkbox, Badge, Modal, Drawer, Accordion, Tabs, Tooltip, Skeleton, Toast, Carousel (Embla), Price, Rating. Preview at `/kit` (dev only) |
| Shopify | `src/lib/shopify/`: `client.ts` (retry with backoff on 429/5xx/THROTTLED, typed errors), `fragments.ts`, `queries.ts`, `mutations.ts`, `mappers.ts` (raw → domain types), `metafields.ts`, `context.ts` (`@inContext` EN/TA), `tags.ts`, `index.ts` (public API) |
| Cache | Reads use `force-cache` + tags; carts are `no-store` and never auto-retried. `POST /api/revalidate` verifies the Shopify HMAC and revalidates tags |
| Seed | `scripts/seed-shopify.ts`: dry run by default; `--apply` creates definitions idempotently and enables Tamil |
| Tests | `src/lib/format.test.ts`, `src/lib/shopify/{client,metafields}.test.ts`, `src/components/ui/price.test.tsx` |

**Codegen schema.** With Shopify env vars set, codegen introspects your live store. Without them it uses the
Storefront schema bundled in `@shopify/hydrogen-react`, so CI and day-one development work before the store exists.
Re-run `pnpm codegen` after setting up the store so types match the API version you call.

**Setting up Shopify (when ready)**

1. Create the store (Shopify Partner dev store is fine to start). Set currency INR.
2. Install the **Headless** sales channel → create a storefront → copy the **private** Storefront token into
   `SHOPIFY_STOREFRONT_PRIVATE_TOKEN`.
3. Create an Admin API app (Shopify Dev Dashboard) with scopes `write_products`, `write_metaobject_definitions`,
   `write_metaobjects`, `write_locales`. Put the token in `SHOPIFY_ADMIN_ACCESS_TOKEN`.
4. `pnpm seed:shopify` (review the printed definitions) → `pnpm seed:shopify --apply`.
5. Settings → Markets → India: add Tamil. Translate content in **Translate & Adapt**.
6. Remove `SKIP_ENV_VALIDATION` from `.env.local`, re-run `pnpm codegen`.

**Verify**

- `pnpm check` passes.
- `/kit`: keyboard through every control; modal and drawer trap focus, close on Escape and return focus.
- Tamil sample on `/kit` renders in Noto Sans Tamil.
- `pnpm seed:shopify` prints the definitions without touching anything.
