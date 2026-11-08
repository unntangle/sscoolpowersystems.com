import "server-only";

/**
 * Mobile OTP behind an adapter so MSG91 / Twilio can be plugged in later.
 *
 * Gap to know about: Shopify's Customer Account API signs customers in with email + one-time code,
 * not mobile OTP. Plan: verify the mobile number here, then link it to the Shopify customer
 * (Phase 7). Until a provider is configured, a DEMO provider accepts 123456 outside production.
 */
export interface OtpProvider {
  readonly name: string;
  send(phone: string): Promise<{ ok: boolean }>;
  verify(phone: string, code: string): Promise<{ ok: boolean }>;
}

const DEMO_CODE = "123456";

const demoProvider: OtpProvider = {
  name: "demo",
  async send() {
    return { ok: true };
  },
  async verify(_phone, code) {
    return { ok: code === DEMO_CODE };
  },
};

/** Returns null when no provider is available (production without MSG91 configured). */
export function getOtpProvider(): OtpProvider | null {
  // TODO(Phase 7): return an MSG91 provider when MSG91_AUTH_KEY is set.
  if (process.env.NODE_ENV !== "production" || process.env.ENABLE_DEMO_OTP === "1") return demoProvider;
  return null;
}
