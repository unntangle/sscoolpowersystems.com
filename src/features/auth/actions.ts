"use server";

import { z } from "zod";
import { getOtpProvider } from "./otp-provider";

const phoneSchema = z.string().regex(/^[6-9]\d{9}$/);
const codeSchema = z.string().regex(/^\d{6}$/);

export type OtpResult = { ok: true; demo: boolean } | { ok: false; error: "invalid" | "unavailable" };

export async function requestOtpAction(phone: string): Promise<OtpResult> {
  if (!phoneSchema.safeParse(phone).success) return { ok: false, error: "invalid" };
  const provider = getOtpProvider();
  if (!provider) return { ok: false, error: "unavailable" };
  const result = await provider.send(phone);
  return result.ok ? { ok: true, demo: provider.name === "demo" } : { ok: false, error: "unavailable" };
}

export async function verifyOtpAction(phone: string, code: string): Promise<OtpResult> {
  if (!phoneSchema.safeParse(phone).success || !codeSchema.safeParse(code).success) {
    return { ok: false, error: "invalid" };
  }
  const provider = getOtpProvider();
  if (!provider) return { ok: false, error: "unavailable" };
  const result = await provider.verify(phone, code);
  // Session creation and Shopify customer linking arrive in Phase 7.
  return result.ok ? { ok: true, demo: provider.name === "demo" } : { ok: false, error: "invalid" };
}
