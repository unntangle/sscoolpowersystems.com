import { z } from "zod";
import { commerce } from "@/config/commerce";

export const PINCODE_COOKIE = "ss_pincode";

export const pincodeSchema = z
  .string()
  .trim()
  .regex(/^[1-9]\d{5}$/, "invalid");

export function isServiceable(pincode: string): boolean {
  return commerce.serviceablePincodePrefixes.some((prefix) => pincode.startsWith(prefix));
}
