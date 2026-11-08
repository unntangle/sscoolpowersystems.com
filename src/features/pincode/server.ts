import "server-only";
import { cookies } from "next/headers";
import { PINCODE_COOKIE, pincodeSchema } from "./pincode";

/** Customer's delivery pincode from the cookie, or null if not set yet. */
export async function getPincode(): Promise<string | null> {
  const value = (await cookies()).get(PINCODE_COOKIE)?.value;
  const parsed = pincodeSchema.safeParse(value ?? "");
  return parsed.success ? parsed.data : null;
}
