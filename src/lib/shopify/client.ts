import "server-only";
import { ShopifyError } from "./errors";

/**
 * Minimal shape of the TypedDocumentString emitted by @graphql-codegen/client-preset (documentMode: "string").
 * Declared structurally so this file has no dependency on generated code.
 */
export interface TypedDocument<TResult, TVariables> {
  toString(): string;
  /** Phantom fields: carry types only. */
  __apiType?: (variables: TVariables) => TResult;
}

export interface ShopifyClientConfig {
  storeDomain: string;
  apiVersion: string;
  /** Preferred: server-side private token. */
  privateToken?: string;
  publicToken?: string;
  /** Default retries for queries. Mutations should pass `retries: 0` unless idempotent. */
  maxRetries?: number;
  baseDelayMs?: number;
  fetch?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
}

export interface RequestOptions<TVariables> {
  variables: TVariables;
  /** Next.js cache tags (revalidated by the Shopify webhook route). */
  tags?: string[];
  /** Seconds, or false to cache until a tag is revalidated. */
  revalidate?: number | false;
  /** Default "force-cache" for queries; pass "no-store" for carts and customer data. */
  cache?: RequestCache;
  retries?: number;
  /** Forward the shopper's IP with private tokens so Shopify's bot protection sees real buyers. */
  buyerIp?: string;
}

type GraphQLError = { message: string; extensions?: { code?: string } };
type GraphQLResponse<T> = { data?: T | null; errors?: GraphQLError[] };

const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function retryAfterMs(res: Response): number | null {
  const header = res.headers.get("retry-after");
  if (!header) return null;
  const seconds = Number(header);
  return Number.isFinite(seconds) ? Math.min(seconds * 1000, 10_000) : null;
}

export function createShopifyClient(config: ShopifyClientConfig) {
  const endpoint = `https://${config.storeDomain}/api/${config.apiVersion}/graphql.json`;
  const doFetch = config.fetch ?? fetch;
  const sleep = config.sleep ?? defaultSleep;
  const baseDelay = config.baseDelayMs ?? 300;

  const backoff = (attempt: number) => baseDelay * 2 ** attempt + Math.floor(Math.random() * baseDelay);

  async function request<TResult, TVariables>(
    document: TypedDocument<TResult, TVariables>,
    options: RequestOptions<TVariables>,
  ): Promise<TResult> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (config.privateToken) {
      headers["Shopify-Storefront-Private-Token"] = config.privateToken;
      if (options.buyerIp) headers["Shopify-Storefront-Buyer-IP"] = options.buyerIp;
    } else if (config.publicToken) {
      headers["X-Shopify-Storefront-Access-Token"] = config.publicToken;
    } else {
      throw new ShopifyError("config", "No Shopify Storefront token configured");
    }

    const cache = options.cache ?? "force-cache";
    const init: RequestInit = {
      method: "POST",
      headers,
      body: JSON.stringify({ query: document.toString(), variables: options.variables }),
      cache,
      ...(cache === "no-store" ? {} : { next: { tags: options.tags, revalidate: options.revalidate } }),
    };

    const maxRetries = options.retries ?? config.maxRetries ?? 2;

    for (let attempt = 0; ; attempt++) {
      const canRetry = attempt < maxRetries;
      let res: Response;

      try {
        res = await doFetch(endpoint, init);
      } catch (cause) {
        if (canRetry) {
          await sleep(backoff(attempt));
          continue;
        }
        throw new ShopifyError("network", "Could not reach Shopify", { cause });
      }

      if (res.status === 429 || res.status >= 500) {
        if (canRetry) {
          await sleep(retryAfterMs(res) ?? backoff(attempt));
          continue;
        }
        throw new ShopifyError("http", `Shopify responded with HTTP ${res.status}`, { status: res.status });
      }

      if (!res.ok) {
        throw new ShopifyError("http", `Shopify responded with HTTP ${res.status}`, { status: res.status });
      }

      const json = (await res.json()) as GraphQLResponse<TResult>;

      if (json.errors && json.errors.length > 0) {
        const throttled = json.errors.some((e) => e.extensions?.code === "THROTTLED");
        if (throttled && canRetry) {
          await sleep(backoff(attempt));
          continue;
        }
        throw new ShopifyError("graphql", json.errors.map((e) => e.message).join("; "), {
          details: json.errors,
        });
      }

      if (!json.data) {
        throw new ShopifyError("graphql", "Shopify returned an empty response");
      }

      return json.data;
    }
  }

  return { request, endpoint };
}

export type ShopifyClient = ReturnType<typeof createShopifyClient>;
