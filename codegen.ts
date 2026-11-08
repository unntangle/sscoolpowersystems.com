import type { CodegenConfig } from "@graphql-codegen/cli";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
const publicToken = process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN;
const version = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2026-07";

/**
 * Schema source:
 * - live store schema when Shopify env vars are present (matches the API version we actually call)
 * - otherwise the Storefront schema bundled with @shopify/hydrogen-react (works offline and in CI)
 */
const schema: CodegenConfig["schema"] =
  domain && (privateToken || publicToken)
    ? {
        [`https://${domain}/api/${version}/graphql.json`]: {
          headers: privateToken
            ? { "Shopify-Storefront-Private-Token": privateToken }
            : { "X-Shopify-Storefront-Access-Token": publicToken ?? "" },
        },
      }
    : "node_modules/@shopify/hydrogen-react/storefront.schema.json";

const config: CodegenConfig = {
  overwrite: true,
  schema,
  documents: ["src/lib/shopify/**/*.ts", "!src/lib/shopify/__generated__/**", "!src/lib/shopify/**/*.test.ts"],
  ignoreNoDocuments: false,
  generates: {
    "src/lib/shopify/__generated__/": {
      preset: "client",
      presetConfig: { fragmentMasking: false },
      config: {
        documentMode: "string",
        enumsAsTypes: true,
        useTypeImports: true,
        defaultScalarType: "unknown",
        scalars: {
          Color: "string",
          DateTime: "string",
          Decimal: "string",
          HTML: "string",
          ISO8601DateTime: "string",
          JSON: "unknown",
          URL: "string",
          UnsignedInt64: "string",
        },
      },
    },
  },
};

export default config;
