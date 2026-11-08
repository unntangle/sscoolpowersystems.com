import { z } from "zod";

/**
 * Environment validation. Imported by next.config.ts so a bad config fails at boot.
 * - `serverEnv` is only readable on the server; touching it in the browser throws.
 * - `clientEnv` holds NEXT_PUBLIC_* values (referenced statically so Next can inline them).
 * Set SKIP_ENV_VALIDATION=1 for CI or before the Shopify store exists.
 */

const skipValidation = ["1", "true"].includes(process.env.SKIP_ENV_VALIDATION ?? "");
const isServer = typeof window === "undefined";
const apiVersion = z.string().regex(/^\d{4}-\d{2}$/, "Use the YYYY-MM API version format");

const serverSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    SHOPIFY_STORE_DOMAIN: z
      .string()
      .regex(/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/, "Use the <store>.myshopify.com domain"),
    SHOPIFY_STOREFRONT_API_VERSION: apiVersion.default("2026-07"),
    SHOPIFY_STOREFRONT_PRIVATE_TOKEN: z.string().min(1).optional(),
    SHOPIFY_STOREFRONT_PUBLIC_TOKEN: z.string().min(1).optional(),
    SHOPIFY_ADMIN_ACCESS_TOKEN: z.string().min(1).optional(),
    SHOPIFY_ADMIN_API_VERSION: apiVersion.default("2026-07"),
    SHOPIFY_WEBHOOK_SECRET: z.string().min(1).optional(),
    DATABASE_URL: z.url().optional(),
    WHATSAPP_PHONE_NUMBER_ID: z.string().min(1).optional(),
    WHATSAPP_ACCESS_TOKEN: z.string().min(1).optional(),
    SENTRY_DSN: z.url().optional(),
  })
  .refine((v) => Boolean(v.SHOPIFY_STOREFRONT_PRIVATE_TOKEN || v.SHOPIFY_STOREFRONT_PUBLIC_TOKEN), {
    message: "Set SHOPIFY_STOREFRONT_PRIVATE_TOKEN (preferred) or SHOPIFY_STOREFRONT_PUBLIC_TOKEN",
    path: ["SHOPIFY_STOREFRONT_PRIVATE_TOKEN"],
  });

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z
    .string()
    .regex(/^\d{10,15}$/, "Digits only, with country code, e.g. 919876543210")
    .optional(),
  NEXT_PUBLIC_GA4_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().min(1).optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;

/** Empty strings in .env files mean "not set". */
function blankToUndefined(input: Record<string, string | undefined>) {
  return Object.fromEntries(Object.entries(input).map(([k, v]) => [k, v === "" ? undefined : v]));
}

function fail(label: string, error: z.ZodError): never {
  console.error(`\n❌ Invalid ${label} environment variables:\n${z.prettifyError(error)}\n`);
  throw new Error(`Invalid ${label} environment variables. See the list above.`);
}

function loadServerEnv(): ServerEnv {
  const input = blankToUndefined({ ...process.env });
  if (skipValidation) return input as unknown as ServerEnv;
  const result = serverSchema.safeParse(input);
  return result.success ? result.data : fail("server", result.error);
}

function loadClientEnv(): ClientEnv {
  const result = clientSchema.safeParse(
    blankToUndefined({
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
      NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID,
      NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    }),
  );
  return result.success ? result.data : fail("public", result.error);
}

export const serverEnv: ServerEnv = isServer
  ? loadServerEnv()
  : new Proxy({} as ServerEnv, {
      get(_target, prop) {
        throw new Error(`serverEnv.${String(prop)} was read in the browser. Server-only values never ship to clients.`);
      },
    });

export const clientEnv: ClientEnv = loadClientEnv();
