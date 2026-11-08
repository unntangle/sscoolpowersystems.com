"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isServiceable, PINCODE_COOKIE, pincodeSchema } from "./pincode";

export type PincodeResult = { ok: true; pincode: string; serviceable: boolean } | { ok: false };

export async function setPincodeAction(input: string): Promise<PincodeResult> {
  const parsed = pincodeSchema.safeParse(input);
  if (!parsed.success) return { ok: false };

  (await cookies()).set(PINCODE_COOKIE, parsed.data, {
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
  return { ok: true, pincode: parsed.data, serviceable: isServiceable(parsed.data) };
}
