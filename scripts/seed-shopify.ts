/**
 * Creates the SS Cool Power Systems metaobject + metafield definitions and enables Tamil.
 *
 *   pnpm seed:shopify            # DRY RUN (default): prints every definition, changes nothing
 *   pnpm seed:shopify --apply    # creates them (idempotent: existing ones are skipped)
 *
 * Needs SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local.
 * Admin token scopes: write_products, write_metaobject_definitions, write_metaobjects, write_locales.
 */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const NAMESPACE = "ss";
const APPLY = process.argv.includes("--apply");

// ---------------------------------------------------------------------------
// Definitions
// ---------------------------------------------------------------------------

type Validation = { name: string; value: string };

interface MetaobjectField {
  key: string;
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  validations?: Validation[];
}

interface MetaobjectDefinition {
  type: string;
  name: string;
  description: string;
  displayNameKey: string;
  fieldDefinitions: MetaobjectField[];
}

interface MetafieldDefinition {
  ownerType: "PRODUCT" | "SHOP";
  key: string;
  name: string;
  type: string;
  description: string;
  validations?: Validation[];
  /** For metaobject references: the metaobject type (resolved to an id at apply time). */
  metaobjectType?: string;
}

const choices = (values: string[]): Validation => ({ name: "choices", value: JSON.stringify(values) });
const min = (n: number): Validation => ({ name: "min", value: String(n) });
const max = (n: number): Validation => ({ name: "max", value: String(n) });

export const METAOBJECTS: MetaobjectDefinition[] = [
  {
    type: "ss_not_in_box_item",
    name: "Not in the box item",
    description: "Something the customer may need that is not in the box, with an indicative cost.",
    displayNameKey: "item",
    fieldDefinitions: [
      { key: "item", name: "Item", type: "single_line_text_field", required: true },
      {
        key: "indicative_cost",
        name: "Indicative cost (INR)",
        type: "number_decimal",
        required: true,
        validations: [min(0)],
        description: "Shown to customers labelled 'indicative'.",
      },
      { key: "note", name: "Why you may need it", type: "single_line_text_field" },
    ],
  },
  {
    type: "ss_package_item",
    name: "All-in package line",
    description: "One line of the All-in Installed Price (appliance, stabiliser, piping, stand, installation, warranty).",
    displayNameKey: "item",
    fieldDefinitions: [
      { key: "item", name: "Item", type: "single_line_text_field", required: true },
      { key: "price", name: "Price (INR)", type: "number_decimal", required: true, validations: [min(0)] },
      {
        key: "kind",
        name: "Kind",
        type: "single_line_text_field",
        validations: [
          choices(["appliance", "stabiliser", "copper_piping", "stand", "installation", "warranty", "other"]),
        ],
      },
    ],
  },
];

export const METAFIELDS: MetafieldDefinition[] = [
  {
    ownerType: "PRODUCT",
    key: "pricing_mode",
    name: "Pricing mode",
    type: "single_line_text_field",
    description: "public = cart + checkout; whatsapp_quote = MRP + WhatsApp best price; rfq = quote form. Default whatsapp_quote.",
    validations: [choices(["public", "whatsapp_quote", "rfq"])],
  },
  {
    ownerType: "PRODUCT",
    key: "price_band_min",
    name: "Price band: from (INR)",
    type: "number_decimal",
    description: "'Starting from' price for quote-led products.",
    validations: [min(0)],
  },
  {
    ownerType: "PRODUCT",
    key: "price_band_max",
    name: "Price band: to (INR)",
    type: "number_decimal",
    description: "Optional upper end of the price band.",
    validations: [min(0)],
  },
  {
    ownerType: "PRODUCT",
    key: "energy_rating",
    name: "Energy rating (stars)",
    type: "number_integer",
    description: "BEE star rating, 1 to 5.",
    validations: [min(1), max(5)],
  },
  {
    ownerType: "PRODUCT",
    key: "warranty_years",
    name: "Warranty (years)",
    type: "number_integer",
    description: "Standard brand warranty in years.",
    validations: [min(0), max(25)],
  },
  {
    ownerType: "PRODUCT",
    key: "capacity",
    name: "Capacity",
    type: "single_line_text_field",
    description: "Use one format per category: '1.5 Ton', '7 kg', '260 L', '25 L'.",
  },
  {
    ownerType: "PRODUCT",
    key: "key_features",
    name: "Key features",
    type: "list.single_line_text_field",
    description: "3 to 5 short spec chips for product cards.",
  },
  {
    ownerType: "PRODUCT",
    key: "not_in_box",
    name: "What is not in the box",
    type: "list.metaobject_reference",
    description: "Items the customer may need to buy separately, with indicative costs.",
    metaobjectType: "ss_not_in_box_item",
  },
  {
    ownerType: "PRODUCT",
    key: "bundle_items",
    name: "Bundle add-ons",
    type: "list.variant_reference",
    description: "Opt-in add-ons (stabiliser, installation kit, extended warranty). Never pre-selected.",
  },
  {
    ownerType: "PRODUCT",
    key: "installation_info",
    name: "Installation info",
    type: "multi_line_text_field",
    description: "What standard installation includes and excludes.",
  },
  {
    ownerType: "PRODUCT",
    key: "power_watts",
    name: "Power (watts)",
    type: "number_integer",
    description: "Rated power draw, used by the running-cost calculator.",
    validations: [min(0)],
  },
  {
    ownerType: "PRODUCT",
    key: "all_in_package",
    name: "All-in Installed Price package",
    type: "list.metaobject_reference",
    description: "Lines that make up the single All-in Installed Price.",
    metaobjectType: "ss_package_item",
  },
  {
    ownerType: "PRODUCT",
    key: "tamil_title",
    name: "Tamil title (fallback)",
    type: "single_line_text_field",
    description: "Used only if no Tamil translation exists in Translate & Adapt.",
  },
  {
    ownerType: "PRODUCT",
    key: "tamil_summary",
    name: "Tamil summary (fallback)",
    type: "multi_line_text_field",
    description: "Used only if no Tamil translation exists in Translate & Adapt.",
  },
  {
    ownerType: "SHOP",
    key: "show_price_bands",
    name: "Show price bands",
    type: "boolean",
    description: "Global switch: show 'Starting from' bands on quote-led products.",
  },
];

const TAMIL_LOCALE = "ta";

// ---------------------------------------------------------------------------
// Admin API
// ---------------------------------------------------------------------------

type AdminResponse<T> = { data?: T; errors?: { message: string }[] };
type UserError = { field?: string[] | null; message: string; code?: string | null };

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}. Add it to .env.local (see .env.example).`);
    process.exit(1);
  }
  return value;
}

function adminClient() {
  const domain = requireEnv("SHOPIFY_STORE_DOMAIN");
  const token = requireEnv("SHOPIFY_ADMIN_ACCESS_TOKEN");
  const version = process.env.SHOPIFY_ADMIN_API_VERSION || "2026-07";
  const endpoint = `https://${domain}/admin/api/${version}/graphql.json`;

  return async function admin<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) throw new Error(`Admin API HTTP ${res.status}: ${await res.text()}`);
    const json = (await res.json()) as AdminResponse<T>;
    if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
    if (!json.data) throw new Error("Admin API returned no data");
    return json.data;
  };
}

function reportUserErrors(label: string, errors: UserError[]): boolean {
  if (errors.length === 0) return false;
  for (const e of errors) console.error(`  ✗ ${label}: ${e.message}${e.code ? ` (${e.code})` : ""}`);
  return true;
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

async function ensureMetaobjects(admin: ReturnType<typeof adminClient>): Promise<Map<string, string>> {
  const ids = new Map<string, string>();

  for (const def of METAOBJECTS) {
    const existing = await admin<{ metaobjectDefinitionByType: { id: string } | null }>(
      `query ($type: String!) { metaobjectDefinitionByType(type: $type) { id } }`,
      { type: def.type },
    );
    if (existing.metaobjectDefinitionByType) {
      console.log(`  • metaobject ${def.type} exists, skipped`);
      ids.set(def.type, existing.metaobjectDefinitionByType.id);
      continue;
    }

    const result = await admin<{
      metaobjectDefinitionCreate: { metaobjectDefinition: { id: string } | null; userErrors: UserError[] };
    }>(
      `mutation ($definition: MetaobjectDefinitionCreateInput!) {
        metaobjectDefinitionCreate(definition: $definition) {
          metaobjectDefinition { id }
          userErrors { field message code }
        }
      }`,
      {
        definition: {
          type: def.type,
          name: def.name,
          description: def.description,
          displayNameKey: def.displayNameKey,
          access: { storefront: "PUBLIC_READ" },
          capabilities: { translatable: { enabled: true } },
          fieldDefinitions: def.fieldDefinitions,
        },
      },
    );

    const { metaobjectDefinition, userErrors } = result.metaobjectDefinitionCreate;
    if (reportUserErrors(def.type, userErrors) || !metaobjectDefinition) continue;
    console.log(`  ✓ metaobject ${def.type} created`);
    ids.set(def.type, metaobjectDefinition.id);
  }

  return ids;
}

async function ensureMetafields(admin: ReturnType<typeof adminClient>, metaobjectIds: Map<string, string>) {
  for (const ownerType of ["PRODUCT", "SHOP"] as const) {
    const existing = await admin<{ metafieldDefinitions: { nodes: { key: string }[] } }>(
      `query ($ownerType: MetafieldOwnerType!, $namespace: String!) {
        metafieldDefinitions(first: 100, ownerType: $ownerType, namespace: $namespace) { nodes { key } }
      }`,
      { ownerType, namespace: NAMESPACE },
    );
    const existingKeys = new Set(existing.metafieldDefinitions.nodes.map((n) => n.key));

    for (const def of METAFIELDS.filter((d) => d.ownerType === ownerType)) {
      const label = `${ownerType.toLowerCase()} ${NAMESPACE}.${def.key}`;
      if (existingKeys.has(def.key)) {
        console.log(`  • ${label} exists, skipped`);
        continue;
      }

      const validations = [...(def.validations ?? [])];
      if (def.metaobjectType) {
        const id = metaobjectIds.get(def.metaobjectType);
        if (!id) {
          console.error(`  ✗ ${label}: metaobject ${def.metaobjectType} missing, skipped`);
          continue;
        }
        validations.push({ name: "metaobject_definition_id", value: id });
      }

      const result = await admin<{
        metafieldDefinitionCreate: { createdDefinition: { id: string } | null; userErrors: UserError[] };
      }>(
        `mutation ($definition: MetafieldDefinitionInput!) {
          metafieldDefinitionCreate(definition: $definition) {
            createdDefinition { id }
            userErrors { field message code }
          }
        }`,
        {
          definition: {
            namespace: NAMESPACE,
            key: def.key,
            name: def.name,
            description: def.description,
            type: def.type,
            ownerType: def.ownerType,
            validations,
            access: { storefront: "PUBLIC_READ" },
            pin: def.ownerType === "PRODUCT",
          },
        },
      );

      const { createdDefinition, userErrors } = result.metafieldDefinitionCreate;
      if (reportUserErrors(label, userErrors) || !createdDefinition) continue;
      console.log(`  ✓ ${label} created`);
    }
  }
}

async function ensureTamil(admin: ReturnType<typeof adminClient>) {
  const { shopLocales } = await admin<{ shopLocales: { locale: string; published: boolean }[] }>(
    `query { shopLocales { locale published } }`,
  );
  const tamil = shopLocales.find((l) => l.locale === TAMIL_LOCALE);

  if (!tamil) {
    const res = await admin<{ shopLocaleEnable: { userErrors: UserError[] } }>(
      `mutation ($locale: String!) { shopLocaleEnable(locale: $locale) { shopLocale { locale } userErrors { field message } } }`,
      { locale: TAMIL_LOCALE },
    );
    if (reportUserErrors("enable Tamil", res.shopLocaleEnable.userErrors)) return;
    console.log("  ✓ Tamil enabled");
  } else {
    console.log("  • Tamil already enabled");
  }

  if (!tamil?.published) {
    const res = await admin<{ shopLocaleUpdate: { userErrors: UserError[] } }>(
      `mutation ($locale: String!) {
        shopLocaleUpdate(locale: $locale, shopLocale: { published: true }) { shopLocale { locale } userErrors { field message } }
      }`,
      { locale: TAMIL_LOCALE },
    );
    if (reportUserErrors("publish Tamil", res.shopLocaleUpdate.userErrors)) return;
    console.log("  ✓ Tamil published");
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function printPlan() {
  console.log("\nMetaobject definitions (storefront: PUBLIC_READ, translatable):\n");
  for (const m of METAOBJECTS) {
    console.log(`  ${m.type}  "${m.name}"`);
    for (const f of m.fieldDefinitions) {
      const v = f.validations?.map((x) => `${x.name}=${x.value}`).join(", ");
      console.log(`    - ${f.key}: ${f.type}${f.required ? " (required)" : ""}${v ? `  [${v}]` : ""}`);
    }
  }
  console.log(`\nMetafield definitions (namespace "${NAMESPACE}", storefront: PUBLIC_READ):\n`);
  for (const d of METAFIELDS) {
    const v = [
      ...(d.validations?.map((x) => `${x.name}=${x.value}`) ?? []),
      ...(d.metaobjectType ? [`-> ${d.metaobjectType}`] : []),
    ].join(", ");
    console.log(`  ${d.ownerType.padEnd(7)} ${NAMESPACE}.${d.key.padEnd(18)} ${d.type}${v ? `  [${v}]` : ""}`);
  }
  console.log(`\nLocales: enable + publish "${TAMIL_LOCALE}" (Tamil).\n`);
}

async function main() {
  printPlan();

  if (!APPLY) {
    console.log("DRY RUN: nothing was changed. Re-run with --apply to create these definitions.\n");
    return;
  }

  const admin = adminClient();
  console.log("Applying...\n\nMetaobjects:");
  const ids = await ensureMetaobjects(admin);
  console.log("\nMetafields:");
  await ensureMetafields(admin, ids);
  console.log("\nLocales:");
  await ensureTamil(admin);
  console.log(
    "\nDone. Manual follow-ups: add Tamil to the India market (Settings > Markets), and translate products, collections and menus in Translate & Adapt.\n",
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
