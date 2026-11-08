import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { serverEnv } from "@/env";
import { TAGS, WEBHOOK_TOPIC_TAGS } from "@/lib/shopify/tags";

/**
 * Shopify webhook -> cache revalidation.
 * Subscribe topics: products/*, collections/*, inventory_levels/update, shop/update.
 * Verified with the X-Shopify-Hmac-Sha256 signature.
 */
export const runtime = "nodejs";

const bodySchema = z.object({ handle: z.string().optional() }).loose();

function verify(rawBody: string, signature: string, secret: string): boolean {
  const digest = Buffer.from(createHmac("sha256", secret).update(rawBody, "utf8").digest("base64"));
  const given = Buffer.from(signature);
  return digest.length === given.length && timingSafeEqual(digest, given);
}

export async function POST(request: NextRequest) {
  const secret = serverEnv.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-shopify-hmac-sha256") ?? "";
  if (!verify(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const topic = request.headers.get("x-shopify-topic") ?? "";
  const tags = new Set(WEBHOOK_TOPIC_TAGS[topic] ?? []);

  let json: unknown = null;
  try {
    json = JSON.parse(rawBody);
  } catch {
    // ignore: tags from the topic are enough
  }
  const parsed = bodySchema.safeParse(json);
  if (parsed.success && parsed.data.handle) {
    if (topic.startsWith("products/")) tags.add(TAGS.product(parsed.data.handle));
    if (topic.startsWith("collections/")) tags.add(TAGS.collection(parsed.data.handle));
  }

  for (const tag of tags) revalidateTag(tag);

  return NextResponse.json({ topic, revalidated: [...tags] });
}
