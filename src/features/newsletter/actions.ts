"use server";

import { z } from "zod";

const schema = z.object({
  email: z.email().max(200),
  /** Honeypot: real users never fill this hidden field. */
  company: z.string().max(0).optional(),
});

export type NewsletterResult = { ok: true } | { ok: false; error: "invalid" };

export async function subscribeAction(input: { email: string; company?: string }): Promise<NewsletterResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    // Bots that fill the honeypot get a silent success.
    return input.company ? { ok: true } : { ok: false, error: "invalid" };
  }
  // TODO(Phase 4): store in Postgres (leads table, source=newsletter) and sync to the email tool.
  console.info("[newsletter] subscribed", parsed.data.email.replace(/^(.).*@/, "$1***@"));
  return { ok: true };
}
