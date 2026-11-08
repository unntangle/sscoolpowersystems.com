export type ShopifyErrorKind =
  /** Missing or invalid configuration (no token, bad domain). */
  | "config"
  /** Could not reach Shopify (DNS, timeout, offline). */
  | "network"
  /** Non-2xx HTTP status. */
  | "http"
  /** GraphQL `errors` array in the response. */
  | "graphql"
  /** Mutation `userErrors` (e.g. variant out of stock, invalid discount code). Safe to show the customer. */
  | "user";

export class ShopifyError extends Error {
  readonly kind: ShopifyErrorKind;
  readonly status?: number;
  readonly details?: unknown;

  constructor(
    kind: ShopifyErrorKind,
    message: string,
    options: { cause?: unknown; status?: number; details?: unknown } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "ShopifyError";
    this.kind = kind;
    this.status = options.status;
    this.details = options.details;
  }
}

export function isShopifyError(error: unknown): error is ShopifyError {
  return error instanceof ShopifyError;
}

type UserError = { message: string; field?: readonly string[] | null; code?: string | null };

/** Throws a `user` ShopifyError when a mutation returned userErrors. */
export function assertNoUserErrors(errors: readonly UserError[] | null | undefined): void {
  if (errors && errors.length > 0) {
    throw new ShopifyError("user", errors.map((e) => e.message).join("; "), { details: errors });
  }
}
